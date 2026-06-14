import { useContext, useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  ListGroup,
  Badge,
  Alert,
  Spinner,
} from "react-bootstrap";
import { AuthContext } from "../contexts/AuthContext.jsx";

const HomePage = () => {
  const { user } = useContext(AuthContext);
  const [networkData, setNetworkData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch the subway network data if the user is authenticated
  useEffect(() => {
    if (!user) {
      setNetworkData(null);
      return;
    }

    const fetchNetwork = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch("/api/network");
        if (response.ok) {
          const data = await response.json();
          setNetworkData(data);
        } else {
          setError("Failed to load network map.");
        }
      } catch (err) {
        setError("Network error occurred while fetching the map.");
      } finally {
        setLoading(false);
      }
    };

    fetchNetwork();
  }, [user]);

  return (
    <Container className="my-4">
      <Row className="mb-4">
        <Col>
          <Card className="bg-light shadow-sm">
            <Card.Body>
              <Card.Title as="h1" className="text-primary border-bottom pb-2">
                Welcome to Last Race!
              </Card.Title>
              <Card.Text className="fs-5 mt-3">
                <strong>Game Instructions:</strong>
              </Card.Text>
              <ol className="fs-6 text-muted">
                <li>
                  <strong>Setup Phase:</strong> Review the complete network map
                  below to memorize connections (Only available for logged-in
                  players).
                </li>
                <li>
                  <strong>Planning Phase:</strong> Once you start, lines
                  disappear! You are given a random start and destination
                  station. You have exactly <strong>90 seconds</strong> to
                  select and chain connected segments to build a valid route.
                </li>
                <li>
                  <strong>Execution Phase:</strong> The system validates your
                  path. If correct, you travel step-by-step. Random events will
                  occur, modifying your initial 20 coins. If the route is broken
                  or incorrect, your score instantly becomes 0!
                </li>
                <li>
                  <strong>Result Phase:</strong> Your remaining coins are
                  recorded as your final score. Aim for the leaderboard!
                </li>
              </ol>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Display Network Map section only for logged-in users */}
      <Row>
        <Col>
          <Card className="shadow-sm">
            <Card.Header as="h4" className="bg-dark text-white">
              Subway Network Map
            </Card.Header>
            <Card.Body>
              {!user ? (
                <Alert variant="warning" className="text-center mb-0">
                  Please <strong>Login</strong> to view the interactive subway
                  network map and start playing.
                </Alert>
              ) : loading ? (
                <div className="text-center py-4">
                  <Spinner animation="border" variant="primary" />
                  <p className="mt-2 text-muted">
                    Loading network configuration...
                  </p>
                </div>
              ) : error ? (
                <Alert variant="danger">{error}</Alert>
              ) : networkData ? (
                <Row xs={1} md={2} lg={4} className="g-4">
                  {networkData.lines.map((line) => {
                    // Filter segments belonging to the current line
                    const lineSegments = networkData.segments.filter(
                      (s) => s.line_id === line.id,
                    );

                    // Find all unique station IDs present on this line
                    const stationIdsOnLine = new Set();
                    lineSegments.forEach((s) => {
                      stationIdsOnLine.add(s.station_a_id);
                      stationIdsOnLine.add(s.station_b_id);
                    });

                    return (
                      <Col key={line.id}>
                        <Card className="h-100 border-secondary">
                          <Card.Header className="fw-bold bg-secondary text-white d-flex justify-content-between align-items-center">
                            {line.name}
                            <Badge bg="light" text="dark">
                              {stationIdsOnLine.size} Stations
                            </Badge>
                          </Card.Header>
                          <ListGroup variant="flush">
                            {networkData.stations
                              .filter((s) => stationIdsOnLine.has(s.id))
                              .map((station) => {
                                // Check if this station serves multiple lines (Interchange)
                                const isInterchange =
                                  networkData.segments
                                    .filter(
                                      (seg) =>
                                        seg.station_a_id === station.id ||
                                        seg.station_b_id === station.id,
                                    )
                                    .reduce(
                                      (acc, seg) => acc.add(seg.line_id),
                                      new Set(),
                                    ).size > 1;

                                return (
                                  <ListGroup.Item
                                    key={station.id}
                                    className="d-flex justify-content-between align-items-center"
                                  >
                                    {station.name}
                                    {isInterchange && (
                                      <Badge bg="info">Interchange</Badge>
                                    )}
                                  </ListGroup.Item>
                                );
                              })}
                          </ListGroup>
                        </Card>
                      </Col>
                    );
                  })}
                </Row>
              ) : null}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
