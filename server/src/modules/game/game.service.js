import db from "#src/config/db.js";

export class GameService {
  queryAll(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  runQuery(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.run(sql, params, function (err) {
        if (err) reject(err);
        else resolve(this.lastID);
      });
    });
  }

  // Retrieve top scores for the general ranking leaderboard
  async getRanking() {
    const sql = `
            SELECT users.username, MAX(games.score) as bestScore
            FROM games
            JOIN users ON games.user_id = users.id
            GROUP BY users.id
            ORDER BY bestScore DESC
        `;
    return await this.queryAll(sql);
  }

  // Start Phase: Generate start and end stations with a minimum distance of 3 segments
  async startGame() {
    const stations = await this.queryAll("SELECT id, name FROM stations");
    const segments = await this.queryAll(
      "SELECT id, station_a_id, station_b_id FROM segments",
    );

    // Build an adjacency list graph for the BFS algorithm
    const graph = {};
    stations.forEach((s) => (graph[s.id] = []));
    segments.forEach((seg) => {
      graph[seg.station_a_id].push(seg.station_b_id);
      graph[seg.station_b_id].push(seg.station_a_id);
    });

    // BFS helper function to calculate the shortest path distance between two stations
    const getDistance = (startId, endId) => {
      const queue = [{ id: startId, dist: 0 }];
      const visited = new Set([startId]);
      while (queue.length > 0) {
        const curr = queue.shift();
        if (curr.id === endId) return curr.dist;
        for (let neighbor of graph[curr.id]) {
          if (!visited.has(neighbor)) {
            visited.add(neighbor);
            queue.push({ id: neighbor, dist: curr.dist + 1 });
          }
        }
      }
      return -1;
    };

    // Randomly select stations until the minimum distance requirement (3 segments) is met
    let start,
      end,
      dist = 0;
    while (dist < 3) {
      start = stations[Math.floor(Math.random() * stations.length)];
      end = stations[Math.floor(Math.random() * stations.length)];
      if (start.id !== end.id) dist = getDistance(start.id, end.id);
    }

    // Shuffle segments and hide the line_id from the client during the planning phase
    const shuffledSegments = segments
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => {
        delete value.line_id; // The user should not see the lines
        return value;
      });

    return { startStation: start, endStation: end, segments: shuffledSegments };
  }

  // Execution Phase: Validate the user's submitted route and apply random events
  async playGame(userId, startStationId, endStationId, submittedSegmentIds) {
    let score = 20; // Initial coins
    const events = await this.queryAll("SELECT * FROM events");
    const segmentsDb = await this.queryAll("SELECT * FROM segments");

    // Helper function to handle a failed game (score drops to 0)
    const saveFailedGame = async () => {
      await this.runQuery(
        "INSERT INTO games (user_id, score, date) VALUES (?, ?, ?)",
        [userId, 0, new Date().toISOString().split("T")[0]],
      );
    };

    // Validation Rule: Each segment may be selected only once
    const uniqueIds = new Set(submittedSegmentIds);
    if (uniqueIds.size !== submittedSegmentIds.length) {
      await saveFailedGame();
      return {
        valid: false,
        score: 0,
        message: "Invalid route: Duplicate segments used.",
      };
    }

    let currentStationId = startStationId;
    const journey = [];

    // Traverse the submitted route sequentially to verify continuity
    for (let segId of submittedSegmentIds) {
      const seg = segmentsDb.find((s) => s.id === segId);
      if (!seg) {
        await saveFailedGame();
        return { valid: false, score: 0, message: "Invalid segment detected." };
      }

      // Determine the next station based on the current position
      let nextStationId = null;
      if (seg.station_a_id === currentStationId)
        nextStationId = seg.station_b_id;
      else if (seg.station_b_id === currentStationId)
        nextStationId = seg.station_a_id;

      // Route is broken if the segment doesn't connect to the current station
      if (!nextStationId) {
        await saveFailedGame();
        return { valid: false, score: 0, message: "Route is not continuous." };
      }

      // Apply a random event effect to the score
      const randomEvent = events[Math.floor(Math.random() * events.length)];
      score += randomEvent.effect;

      journey.push({
        segmentId: seg.id,
        from: currentStationId,
        to: nextStationId,
        event: randomEvent.description,
        effect: randomEvent.effect,
        currentScore: score,
      });

      currentStationId = nextStationId; // Move to the next station
    }

    // Final Validation: Ensure the route actually reached the target destination
    if (currentStationId !== endStationId) {
      await saveFailedGame();
      return {
        valid: false,
        score: 0,
        message: "Destination was not reached.",
      };
    }

    // The game was successfully completed
    const finalScore = Math.max(0, score); // Prevent negative final scores
    await this.runQuery(
      "INSERT INTO games (user_id, score, date) VALUES (?, ?, ?)",
      [userId, finalScore, new Date().toISOString().split("T")[0]],
    );

    return { valid: true, score: finalScore, journey };
  }
}
