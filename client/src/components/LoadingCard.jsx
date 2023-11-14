import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Card, Col, Badge, Placeholder } from 'react-bootstrap';
import '../css/style.css'


function LoadingCard() {
    return (
        <>

            {
                Array(3).fill(true).map((_, i) =>
                    <Col key={i} xs={12} sm={6} md={6} lg={4} xl={3} style={{ padding: 20 }}>
                        <Card className='pageCard'>
                            <Card.Img variant="top" src='http://localhost:3001/default.png' />
                            <Card.Body>
                                <Placeholder as={Card.Title} animation="glow">
                                    <Placeholder xs={6} />
                                </Placeholder>
                                <Placeholder as={Card.Subtitle} animation="glow">
                                    <Placeholder xs={6} />
                                </Placeholder>
                                <Placeholder as={Card.Text} animation="glow">
                                    <Placeholder xs={7} /> <Placeholder xs={4} /> <Placeholder xs={4} />{' '}
                                    <Placeholder xs={6} /> <Placeholder xs={8} /> <Placeholder xs={3} />
                                    <Placeholder xs={5} />
                                </Placeholder>
                                <Placeholder.Button variant="outline-danger" xs={2} style={{ float: 'right', marginLeft: 10 }} />
                                {' '}
                                <Placeholder.Button variant="outline-warning" xs={2} style={{ float: 'right' }} />
                            </Card.Body>
                            <Card.Footer>
                                <div>
                                    <Placeholder xs={4} style={{ fontSize: 13 }} />
                                </div>
                                <div>
                                    <Placeholder xs={6} style={{ fontSize: 13 }} />
                                </div>
                                <Placeholder xs={3} style={{ fontSize: 13 }} />
                            </Card.Footer>
                        </Card >
                    </Col >
                )

            }
        </>
    );
}

export default LoadingCard;