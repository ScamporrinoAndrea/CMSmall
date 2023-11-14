import React, { useState } from 'react';
import { Card, Button, Form, Alert } from 'react-bootstrap';
import API from '../API';
import { useNavigate } from 'react-router-dom';
import MyNavbar from '../components/MyNavbar.jsx'



function Login(props) {
    const [validated, setValidated] = useState(false);
    const [username, setUsername] = useState("318927@polito.it");
    const [password, setPassword] = useState("pwd");
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();


    function handleUsername(event) {
        const v = event.target.value;
        setUsername(v);
    }
    function handlePassword(event) {
        const v = event.target.value;
        setPassword(v);
    }

    function doLogIn(credentials) {
        API.logIn(credentials)
            .then(user => {
                setErrorMessage('');
                props.loginSuccessful(user);
                navigate('/');
            })
            .catch(err => {
                setErrorMessage('Wrong username or password');
            })
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        setValidated(true);
        const form = event.currentTarget;
        if (form.checkValidity() === true) {
            const credentials = { username, password };
            doLogIn(credentials);
            setErrorMessage('');
        }
    };

    return (
        <>
            <MyNavbar title={props.title} />
            <div style={{ marginTop: 50 }}>
                <Card style={{ maxWidth: '500px', margin: '0 auto' }}>
                    <Card.Header>Login</Card.Header>
                    <Card.Body>
                        <Form noValidate validated={validated} onSubmit={handleSubmit}>
                            <Form.Group controlId='username' style={{ margin: 10 }}>
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    required
                                    type="email"
                                    placeholder="Email"
                                    value={username}
                                    onChange={handleUsername}
                                    autoComplete='on'
                                />
                                <Form.Control.Feedback type="invalid">
                                    Please insert an Email
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId='password' style={{ margin: 10 }}>
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    required
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={handlePassword}
                                    autoComplete="on"
                                />
                                <Form.Control.Feedback type="invalid">
                                    Please insert a password
                                </Form.Control.Feedback>
                            </Form.Group>
                            <div className="text-center">
                                <Button size='md' variant='dark' type="submit" style={{ margin: 10, width: 200 }} >Login</Button>
                            </div>
                            {errorMessage ? <Alert variant='danger' dismissible onClick={() => setErrorMessage('')}>{errorMessage}</Alert> : ''}
                        </Form >
                    </Card.Body >
                </Card >
            </div >
        </>
    );
}

export default Login