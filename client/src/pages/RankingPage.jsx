import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Spinner,
  Alert,
} from "react-bootstrap";

const RankingPage = () => {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch the leaderboard data when the component mounts
  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const response = await fetch("/api/game/ranking");

        // Handle unauthorized access if the backend protects this route
        if (response.status === 401) {
          setError("Please login to view the leaderboard.");
          setLoading(false);
          return;
        }

        if (response.ok) {
          const data = await response.json();
          setRankings(data);
        } else {
          setError("Failed to fetch ranking data.");
        }
      } catch (err) {
        console.error("Ranking fetch error:", err);
        setError("Network error occurred while fetching rankings.");
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, []);

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-warning text-dark text-center py-3">
              <h2 className="mb-0 fw-bold">🏆 Leaderboard</h2>
            </Card.Header>
            <Card.Body className="p-0">
              {loading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="warning" />
                  <p className="mt-2 text-muted">Loading best scores...</p>
                </div>
              ) : error ? (
                <Alert variant="danger" className="m-3 text-center">
                  {error}
                </Alert>
              ) : rankings.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  <h5>No games played yet.</h5>
                  <p>Be the first to set a high score!</p>
                </div>
              ) : (
                <Table striped hover responsive className="mb-0 text-center">
                  <thead className="table-light">
                    <tr>
                      <th>Rank</th>
                      <th>Player Username</th>
                      <th>Best Score (Coins)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rankings.map((entry, index) => (
                      <tr key={index}>
                        <td className="fw-bold text-muted">#{index + 1}</td>
                        <td className="fw-bold">{entry.username}</td>
                        <td>
                          <span className="badge bg-success rounded-pill fs-6">
                            {entry.bestScore}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default RankingPage;
