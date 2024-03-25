import React, { useState } from 'react';
import axios from 'axios'
import { Form, InputGroup, Button, Card, FloatingLabel } from 'react-bootstrap';
import { Link } from 'react-router-dom'

// Components
import '../../assets/styles/Login.css';

const url = 'http://localhost:8001/users/login';
function Login() {
    const [loginData, setLoginData] = useState({
        email: '',
        password: '',
    })

    const handleLogin = async (e) => {
        e.preventDefault();
        try{
            const response = await axios.post(url, loginData);
            if (response.status === 200) {
                const userData = response.data;
                localStorage.setItem('token', userData.token);
                console.log(userData)
 
                window.location.href = '/';
            } else {
                const errorData = await response.json();
                console.error(errorData.error);
            }
        } catch (error) {
            console.error('Erreur lors de la connexion :', error);
        }
    };

    const handleChange = (e) => {
        setLoginData({...loginData, [e.target.name]: e.target.value})
    }
    return (
        <div className='login-page'>
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <Card className="form-card">
                    <Card.Body>
                        <Card.Title>Connexion au compte</Card.Title>
                        <Form onSubmit={handleLogin}>
                            <InputGroup className="mb-3">
                                <InputGroup.Text id="basic-addon1"><i className="bi bi-person-fill"></i></InputGroup.Text>
                                <FloatingLabel label='Email'>
                                    <Form.Control
                                        type="text"
                                        placeholder="Email"
                                        aria-label="email"
                                        name='email'
                                        onChange={(e) =>handleChange(e)}
                                        aria-describedby="basic-addon1"
                                    />
                                </FloatingLabel>
                                <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
                            </InputGroup>
                            <InputGroup className="mb-3">
                                <InputGroup.Text id="basic-addon1"><i className="bi bi-lock-fill"></i></InputGroup.Text>
                                <FloatingLabel label='Password'>
                                    <Form.Control
                                        type="password"
                                        placeholder="Password"
                                        aria-label="password"
                                        name='password'
                                        onChange={(e) =>handleChange(e)}
                                        aria-describedby="basic-addon1"
                                    />
                                </FloatingLabel>
                            </InputGroup>
                            <Button variant="primary" type="submit">
                                Connexion
                            </Button>
                            <Form.Text id="passwordHelpBlock">
                                Pas encore enregistré ? <Link to="/account/register" className='lien'>S'enregistrer</Link>
                            </Form.Text>
                        </Form>
                    </Card.Body>
                </Card>
            </div>
        </div>
    )
}

export default Login