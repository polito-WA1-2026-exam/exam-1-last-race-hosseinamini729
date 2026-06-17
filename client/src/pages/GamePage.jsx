import { useState, useEffect, useContext } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Alert,
  ListGroup,
  ProgressBar,
} from "react-bootstrap";
import { AuthContext } from "../contexts/AuthContext.jsx";
import { networkAPI } from "../api/network.js";
import { gameAPI } from "../api/game.js";
import usePageTitle from "../hooks/usePageTitle.js";
import PageTransition from "../components/PageTransition.jsx";

const GamePage = () => {
  usePageTitle("Play Game");
  const { user } = useContext(AuthContext);

  const [gameState, setGameState] = useState("idle");
  const [stationMap, setStationMap] = useState({});
  const [gameData, setGameData] = useState(null);
  const [selectedSegments, setSelectedSegments] = useState([]);
  const [availableSegments, setAvailableSegments] = useState([]);
  const [resultData, setResultData] = useState(null);
  const [timeLeft, setTimeLeft] = useState(90);

  // Fetch network data to map station IDs to names
  useEffect(() => {
    const fetchNetwork = async () => {
      try {
        const data = await networkAPI.getNetwork();
        const map = {};
        data.stations.forEach((s) => (map[s.id] = s.name));
        setStationMap(map);
      } catch (err) {
        console.error("Failed to load station dictionary", err);
      }
    };
    if (user) fetchNetwork();
  }, [user]);

  // Timer Logic
  useEffect(() => {
    let timer;
    if (gameState === "planning" && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (gameState === "planning" && timeLeft === 0) {
      submitRoute();
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  useEffect(() => {
    return () => {
      localStorage.removeItem("gameInProgress");
    };
  }, []);

  const handleStartGame = async () => {
    try {
      const data = await gameAPI.startGame();
      setGameData(data);
      setAvailableSegments(data.segments);
      setSelectedSegments([]);
      setTimeLeft(90);
      setResultData(null);
      setGameState("planning");

      // Local storage used for Anti-Cheat
      localStorage.setItem("gameInProgress", "true");
    } catch (err) {
      console.error("Failed to start game", err);
    }
  };

  const selectSegment = (segment) => {
    setAvailableSegments((prev) => prev.filter((s) => s.id !== segment.id));
    setSelectedSegments((prev) => [...prev, segment]);
  };

  const removeSegment = (segment) => {
    setSelectedSegments((prev) => prev.filter((s) => s.id !== segment.id));
    setAvailableSegments((prev) => [...prev, segment]);
  };

  const submitRoute = async () => {
    if (gameState === "result") return;

    setGameState("result");

    localStorage.removeItem("gameInProgress");

    const payload = {
      startStationId: gameData.startStation.id,
      endStationId: gameData.endStation.id,
      segments: selectedSegments.map((s) => s.id),
    };

    try {
      const data = await gameAPI.playGame(payload);
      setResultData(data);
    } catch (err) {
      console.error("Failed to submit game", err);
      setResultData({
        valid: false,
        score: 0,
        message: "Network error occurred during submission.",
      });
    }
  };

  if (!user) {
    return (
      <Alert variant="danger" className="mt-4 text-center">
        You must be logged in to access the game page.
      </Alert>
    );
  }

  // The return statement (UI) remains completely unchanged!
  return (
    <PageTransition>
      <Container className="my-4">
        {/* ---------------- IDLE PHASE ---------------- */}
        {gameState === "idle" && (
          <Row className="justify-content-center text-center">
            <Col md={6}>
              <Card className="shadow-sm py-5">
                <Card.Body>
                  <h2>Ready for the Race?</h2>
                  <p className="text-muted mb-4">
                    You will have exactly 90 seconds to build a continuous path
                    from a random start to a random destination.
                  </p>
                  <Button variant="success" size="lg" onClick={handleStartGame}>
                    Start Game
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        {/* ---------------- PLANNING PHASE ---------------- */}
        {gameState === "planning" && gameData && (
          <Row>
            <Col lg={12} className="mb-3">
              <Card className="border-primary shadow-sm">
                <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
                  <span className="fs-5">Mission Objective</span>
                  <Badge
                    bg={timeLeft <= 15 ? "danger" : "light"}
                    text={timeLeft <= 15 ? "white" : "dark"}
                    className="fs-5"
                  >
                    Time Left: {timeLeft}s
                  </Badge>
                </Card.Header>
                <Card.Body className="text-center">
                  <h4>
                    <Badge bg="success">{gameData.startStation.name}</Badge>
                    <span className="mx-3">➔</span>
                    <Badge bg="danger">{gameData.endStation.name}</Badge>
                  </h4>
                  <ProgressBar
                    now={(timeLeft / 90) * 100}
                    variant={timeLeft <= 15 ? "danger" : "info"}
                    className="mt-3"
                  />
                </Card.Body>
              </Card>
            </Col>

            {/* Route Builder Sections */}
            <Col md={6}>
              <Card className="shadow-sm h-100 border-info">
                <Card.Header className="bg-info text-white">
                  Your Selected Route
                </Card.Header>
                <Card.Body>
                  {selectedSegments.length === 0 ? (
                    <p className="text-muted text-center mt-4">
                      No segments selected yet.
                    </p>
                  ) : (
                    <ListGroup>
                      {selectedSegments.map((seg, index) => (
                        <ListGroup.Item
                          key={seg.id}
                          action
                          onClick={() => removeSegment(seg)}
                          className="d-flex justify-content-between align-items-center border-start border-primary border-4"
                        >
                          <span>
                            <Badge bg="secondary" className="me-2">
                              {index + 1}
                            </Badge>
                            {stationMap[seg.station_a_id]} ↔{" "}
                            {stationMap[seg.station_b_id]}
                          </span>
                          <span className="text-danger small">Remove</span>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  )}
                </Card.Body>
                <Card.Footer>
                  <Button
                    variant="primary"
                    className="w-100"
                    onClick={submitRoute}
                    disabled={selectedSegments.length === 0}
                  >
                    Submit Route Now
                  </Button>
                </Card.Footer>
              </Card>
            </Col>

            <Col md={6}>
              <Card className="shadow-sm h-100">
                <Card.Header>Available Segments (Shuffled)</Card.Header>
                <Card.Body style={{ maxHeight: "400px", overflowY: "auto" }}>
                  <ListGroup variant="flush">
                    {availableSegments.map((seg) => (
                      <ListGroup.Item
                        key={seg.id}
                        action
                        onClick={() => selectSegment(seg)}
                        className="d-flex justify-content-between align-items-center"
                      >
                        <span>
                          {stationMap[seg.station_a_id]} ↔{" "}
                          {stationMap[seg.station_b_id]}
                        </span>
                        <span className="text-success small">+ Add</span>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        {/* ---------------- RESULT PHASE ---------------- */}
        {gameState === "result" && resultData && (
          <Row className="justify-content-center">
            <Col md={8}>
              <Card
                className={`shadow-sm border-${resultData.valid ? "success" : "danger"}`}
              >
                <Card.Header
                  className={`bg-${resultData.valid ? "success" : "danger"} text-white fs-4 text-center`}
                >
                  {resultData.valid
                    ? "Mission Accomplished!"
                    : "Mission Failed!"}
                </Card.Header>
                <Card.Body>
                  <div className="text-center mb-4">
                    <h1
                      className={`text-${resultData.valid ? "success" : "danger"} display-4 fw-bold`}
                    >
                      Score: {resultData.score}
                    </h1>
                    {!resultData.valid && (
                      <h5 className="text-muted">{resultData.message}</h5>
                    )}
                  </div>

                  {resultData.journey && resultData.journey.length > 0 && (
                    <>
                      <h5 className="border-bottom pb-2">Travel Log</h5>
                      <ListGroup variant="flush" className="mb-4">
                        {resultData.journey.map((step, index) => (
                          <ListGroup.Item
                            key={index}
                            className="d-flex justify-content-between"
                          >
                            <div>
                              <strong>Step {index + 1}:</strong>{" "}
                              {stationMap[step.from]} ➔ {stationMap[step.to]}
                              <br />
                              <span className="text-muted small">
                                Event: {step.event}
                              </span>
                            </div>
                            <div className="text-end">
                              <Badge
                                bg={step.effect >= 0 ? "success" : "danger"}
                              >
                                {step.effect >= 0
                                  ? `+${step.effect}`
                                  : step.effect}
                              </Badge>
                              <div className="small fw-bold mt-1">
                                Total: {step.currentScore}
                              </div>
                            </div>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    </>
                  )}

                  <div className="text-center">
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={() => setGameState("idle")}
                    >
                      Play Again
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
    </PageTransition>
  );
};

export default GamePage;
