import { useContext, useEffect, useState } from "react";
import { Container, Row, Col, Card, Alert, Spinner } from "react-bootstrap";
import { AuthContext } from "../contexts/AuthContext.jsx";
import NetworkMap from "../components/NetworkMap.jsx";

const HomePage = () => {
  const { user } = useContext(AuthContext);
  const [networkData, setNetworkData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch the subway network data from the backend
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
      {/* Game Instructions Section */}
      <Row className="mb-4">
        <Col>
          <Card className="bg-light shadow-sm border-0">
            <Card.Body>
              <Card.Title
                as="h1"
                className="text-primary border-bottom pb-2 fw-bold"
              >
                Welcome to Last Race!
              </Card.Title>
              <Card.Text className="fs-5 mt-3">
                <strong>Game Instructions:</strong>
              </Card.Text>
              <ol className="fs-6 text-muted">
                <li>
                  <strong>Setup Phase:</strong> Review the interactive network
                  map below to memorize connections (Login required).
                </li>
                <li>
                  <strong>Planning Phase:</strong> You will be given a random
                  start and destination station. You have exactly{" "}
                  <strong>90 seconds</strong> to build a valid continuous route.
                </li>
                <li>
                  <strong>Execution Phase:</strong> Your path is validated.
                  Random events will modify your starting coins (20). An invalid
                  route results in a score of 0!
                </li>
                <li>
                  <strong>Result Phase:</strong> Your remaining coins determine
                  your final score on the leaderboard.
                </li>
              </ol>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Interactive Network Map Section */}
      <Row>
        <Col>
          <Card className="shadow-sm border-0">
            <Card.Header as="h4" className="bg-dark text-white py-3">
              Interactive Subway Network Map
            </Card.Header>
            <Card.Body className="p-0">
              {!user ? (
                <Alert variant="warning" className="m-4 text-center fs-5">
                  Please <strong>Login</strong> to view the interactive subway
                  network map.
                </Alert>
              ) : loading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="primary" />
                  <p className="mt-3 text-muted fs-5">
                    Generating visual map...
                  </p>
                </div>
              ) : error ? (
                <Alert variant="danger" className="m-4">
                  {error}
                </Alert>
              ) : (
                /* Render the modularized NetworkMap component and pass the fetched data */
                networkData && <NetworkMap networkData={networkData} />
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
