import 'bootstrap/dist/css/bootstrap.min.css';
import { Nav, Container, Navbar, Button, Modal, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';




function MyNavbar(props) {
    const navigate = useNavigate();
    const [popup, setPopup] = useState(false);
    const [title, setTitle] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const handleClose = () => setPopup(false);
    const handleShow = () => setPopup(true);

    function handleTitle(event) {
        const v = event.target.value;
        setTitle(v);
    }

    function handleSubmit(event) {
        event.preventDefault();

        // Form validation
        if (title === '')
            setErrorMsg('Insert a title');
        else if (title === props.title)
            setErrorMsg('the new title is the same as the old one');
        else {
            props.updateTitle(title);
            handleClose();
        }
    };

    return (
        <>
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>{props.title}</Navbar.Brand>
                    {props.user ?
                        props.user.admin ?
                            <Button variant='light' size='sm' onClick={handleShow}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16">
                                    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
                                </svg>
                            </Button> : null : null}
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="me-auto">
                            {props.user == undefined ?
                                <Nav.Link onClick={() => navigate('/')}>Published pages</Nav.Link> :
                                <>
                                    <Nav.Link onClick={() => { navigate('/'); props.changeFilter('all-pages') }}>All pages</Nav.Link>
                                    <Nav.Link onClick={() => { navigate('/'); props.changeFilter('published') }}>Published pages</Nav.Link>
                                    <Nav.Link onClick={() => { navigate('/'); props.changeFilter('my-pages') }}>My pages</Nav.Link>
                                </>}
                        </Nav>
                        <Nav>
                            {props.user == undefined ?
                                <Nav.Link onClick={() => navigate('/login')}>Login</Nav.Link>
                                :
                                <>
                                    <Navbar.Text style={{ marginRight: 40 }}>
                                        {"Signed in as: " + props.user.name}
                                    </Navbar.Text>
                                    <Nav.Link onClick={props.logout}>Logout</Nav.Link>
                                </>}

                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Modal show={popup} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit the title</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>

                        <Form.Group className="mb-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder={props.title}
                                value={title}
                                onChange={handleTitle}
                                autoFocus
                            />
                        </Form.Group>
                        {errorMsg ? <Alert variant='danger' onClose={() => setErrorMsg('')} dismissible>{errorMsg}</Alert> : false}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="outline-dark" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="dark" type="submit">
                            Save Change
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    );
}

export default MyNavbar;