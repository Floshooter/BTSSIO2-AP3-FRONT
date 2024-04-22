import React, { useState } from 'react';
import axios from 'axios'
import '../../assets/styles/Register.css'
import countryData from '../../assets/country.json';
// Module
import { Form, InputGroup, Button, Card, FloatingLabel, ProgressBar } from 'react-bootstrap';
import { Link } from 'react-router-dom'

const userURL = 'http://192.168.1.28:8001/users/inscription';

function Register() {
  const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        username: '',
        email: '',
        country: '',
        password: '',
        confpassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confpassword) {
      setPasswordError('Les mots de passe ne correspondent pas');
      return;
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      setPasswordError('Le mot de passe doit contenir au moins une majuscule, une minuscule, un caractère spécial et un chiffre, et faire au moins 8 caractères de long');    
      return;
    }
    try {
      const response = await axios.post(userURL, formData);

      if (response.status === 200) {
        alert('Compte créé');
        window.location.href = '/login';
      } else {
        console.error('Erreur lors de la création du compte :', response.statusText);
      }
    } catch (error) {
      console.error('Error during registration:', error);
    }
  }
  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value})
  }
  return (
    <div className='register-page'>
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            <Card className="register-form-card">
                <Card.Body>
                    <Card.Title>Création d'un compte</Card.Title>
                    <Form onSubmit={handleSubmit}>
                      <InputGroup className="mb-3">
                        <InputGroup.Text><i class="bi bi-person-fill"></i></InputGroup.Text>
                        <FloatingLabel label="Firstname">
                          <Form.Control 
                            type="text"
                            placeholder="Firstname"
                            aria-label="firstname"
                            onChange={handleChange}
                            name='firstname'
                          />
                        </FloatingLabel>
                        <FloatingLabel label="Lastname">
                          <Form.Control 
                            type="text"
                            placeholder="Lastname"
                            aria-label="lastname"
                            onChange={handleChange}
                            name='lastname'
                          />
                        </FloatingLabel>
                      </InputGroup>

                      <InputGroup className='mb-3'>
                        <InputGroup.Text>@</InputGroup.Text>
                        <FloatingLabel label="Username">
                          <Form.Control 
                            type="text"
                            placeholder='Username'
                            aria-label="username"
                            onChange={handleChange}
                            name="username"
                            required
                          />
                        </FloatingLabel>
                      </InputGroup>

                      <InputGroup className='mb-3'>
                        <InputGroup.Text><i class="bi bi-envelope-at-fill"></i></InputGroup.Text>
                        <FloatingLabel label="Email Address">
                          <Form.Control 
                            type="email"
                            placeholder='Email Address'
                            aria-label="email-address"
                            onChange={handleChange}
                            name="email"
                            required
                          />
                        </FloatingLabel>
                      </InputGroup>

                      <InputGroup className='mb-3'>
                        <InputGroup.Text><i class="bi bi-house-fill"></i></InputGroup.Text>
                        <Form.Select aria-label="Default select example" name="country" onChange={handleChange}>
                          <option>Country</option>
                          {Object.entries(countryData).map(([code, country]) => (
                            <option key={code} value={country}>{country}</option>
                          ))}
                        </Form.Select>
                      </InputGroup>

                      <InputGroup className="mb-3">
                        <InputGroup.Text><i class="bi bi-lock-fill"></i></InputGroup.Text>
                        <FloatingLabel label="Password">
                          <Form.Control 
                            type="password"
                            placeholder="Password"
                            aria-label="password"
                            onChange={handleChange}
                            name='password'
                            required
                          />
                        </FloatingLabel>
                        <FloatingLabel label="Confirm password">
                          <Form.Control 
                            type="password"
                            placeholder="Confirm password"
                            aria-label="confpassword"
                            onChange={handleChange}
                            name='confpassword'
                            required
                          />
                        </FloatingLabel>
                      </InputGroup>
                      {passwordError && <div className='text-danger'>{passwordError}</div>}
                      <Button variant="primary" onClick={handleSubmit} type="submit">
                          S'inscrire
                      </Button>
                      <Form.Text id="passwordHelpBlock">
                          Déjà connecté ? <Link to="/account/login" className='lien'>Se connecter</Link>
                      </Form.Text>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    </div>
  )
}

export default Register
