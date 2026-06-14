import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
    return (
        <Container className="text-center my-5 py-5">
            <Row className="justify-content-center">
                <Col md={8}>
                    {/* Display massive 404 text */}
                    <h1 className="display-1 fw-bold text-danger mb-3">404</h1>
                    
                    {/* User-friendly error message */}
                    <h2 className="mb-4">Page Not Found</h2>
                    <p className="text-muted fs-5 mb-5">
                        Oops! The subway station you are looking for does not exist on this network. 
                        It might have been moved or the URL is incorrect.
                    </p>
                    
                    {/* Navigation button to safely return the user to the starting point */}
                    <Button variant="primary" size="lg" as={Link} to="/">
                        Return to Home Station
                    </Button>
                </Col>
            </Row>
        </Container>
    );
};

export default NotFoundPage;