import '../../assets/styles/Dashboard.css';
import { Table, Form, InputGroup, Button, Card, FloatingLabel, Toast } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import { v4 } from 'uuid'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const url = 'http://192.168.1.28:8001'
const Dashboard = ({userData}) => {
    // Variables
    const [items, setItems] = useState([]);
    const [users, setUsers] = useState([]);
    const [currentChoice, setCurrentChoice] = useState('users');
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        username: '',
        email: '',
        password: '',
        confpassword: ''
  });
  const [formDataItem, setFormDataItem] = useState({
      item_name: '',
      id_category: '',
      description: '',
      price: '',
      stocks: '',
      thumbnail: ''
  })
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
      const response = await axios.post(`${url}/users/addemployee`,formData);
      console.log(response)

      if (response.status === 200) {
        alert('Compte créé');
        window.location.href = '/';
      } else {
        console.error('Erreur lors de la création du compte :', response.statusText);
      }
    } catch (error) {
      console.error('Error during registration:', error);
    }
  }
  const handleSubmitAddItem = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${url}/boutique/additem`,formDataItem);
      console.log(response)
      if (response.status === 200) {
        alert('Item ajouté');
        window.location.href = '/dashboard';
      } else {
        console.error('Erreur lors de l\'ajout d\'un item :', response.statusText);
      }
    } catch (error) {
      console.error('Error during item addition:', error);
    }
  }
  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value})
  }
  const handleChangeItem = (e) => {
    setFormDataItem({...formDataItem, [e.target.name]: e.target.value})
  }

    const fetchUsers = async () => {
        try {
            const users = await axios.get(`${url}/users/`)
            console.log({'users': users.data})
            setUsers(users.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }
    const fetchItems = async () => {
        try {
            const items = await axios.get(`${url}/boutique`)
            console.log({'items': items.data})
            setItems(items.data);
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    }
    useEffect(() => {
        fetchUsers();
        fetchItems()
    }, []);

    const deleteItem = async (itemId) => {
        try {
            const response = await axios.delete(`${url}/boutique/deleteitem/${itemId}`);
            if (response.status === 200) {
                toast.success('L\'item a été supprimé', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                })
            } else {
                console.error('Erreur lors de la suppression de l\'item :', response.statusText);
            }
        } catch (error) {
            console.error('Error during item deletion:', error);
        }
    }
    
    return (
        <div className='dashboard'>
            <div className='displayedChoice'>
                <Button className='btn-displayed' variant="warning" onClick={() => setCurrentChoice('users')}>Utilisateur</Button>
                <Button className='btn-displayed' variant="warning" onClick={() => setCurrentChoice('items')}>Items</Button>
                <Button className='btn-displayed' variant="warning" onClick={() => setCurrentChoice('addUser')}>Ajouter un employé</Button>
                <Button className='btn-displayed' variant="warning" onClick={() => setCurrentChoice('addItem')}>Ajouter un item</Button>
            </div>
            <div className='displayed'>
                {currentChoice === 'users' && (
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <td colSpan={8}>Utilisateurs</td>
                                <td colSpan={1} className="horizontal-layout">
                                    <Button variant="secondary"><i class="bi bi-arrow-left-square"></i></Button>
                                    <p>1</p>
                                    <Button variant="secondary"><i class="bi bi-arrow-right-square"></i></Button>
                                </td>
                            </tr>
                        </thead>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Firstname</th>
                                <th>Lastname</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Password</th>
                                <th>Country</th>
                                <th>Niveau de permission</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={v4()}>
                                    <td>{user.id}</td>
                                    <td>{user.firstname}</td>
                                    <td>{user.lastname}</td>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                    <td>***</td>
                                    <td>{user.country}</td>
                                    <td>{user.perm_level === 1 ? `Staff (${user.perm_level})` : user.perm_level === 2 ? `Admin (${user.perm_level})` : `Utilisateur (${user.perm_level})`} </td>
                                    <td className="horizontal-layout">
                                        {(user.perm_level === 1 || user.perm_level === 2) ? (
                                            (user.username === 'Floshooter' || user.email === 'f.bernier@ecole-ipssi.net') ? (
                                                <>
                                                <Button className="button-dashboard btn-sm" variant="primary" disabled>
                                                    <i className="bi bi-pen"></i> Modifier
                                                </Button>
                                                <Button className="button-dashboard btn-sm" variant="danger" disabled>
                                                    <i className="bi bi-trash3-fill"></i>Supprimer
                                                </Button>
                                                </>
                                            ) : (
                                                <>
                                                    <Button className="button-dashboard btn-sm" variant="primary">
                                                        <i className="bi bi-pen"></i> Modifier
                                                    </Button>
                                                    <Button className="button-dashboard btn-sm" variant="danger">
                                                        <i className="bi bi-trash3-fill"></i>Supprimer
                                                    </Button>
                                                </>
                                            )
                                        ) : (
                                            <>
                                                <Button className="button-dashboard btn-sm" variant="primary" disabled>
                                                    <i className="bi bi-pen"></i> Modifier
                                                </Button>
                                                <Button className="button-dashboard btn-sm" variant="danger">
                                                    <i className="bi bi-trash3-fill"></i>Supprimer
                                                </Button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
                {currentChoice === 'items' && (
                    <><Table striped bordered hover>
                        <thead>
                            <tr>
                                <td colSpan={7}>Items</td>
                                <td colSpan={1} className="horizontal-layout">
                                    <Button variant="secondary"><i className="bi bi-arrow-left-square"></i></Button>
                                    <p>1</p>
                                    <Button variant="secondary"><i className="bi bi-arrow-right-square"></i></Button>
                                </td>
                            </tr>
                        </thead>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Catégorie</th>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Stocks</th>
                                <th>Thumbnail</th>
                                <th>Price</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td>{item.id_category === 0 ? 'Inconnue' : item.id_category === 1 ? 'Football' : item.id_category === 2 ? 'Basketball' : item.id_category === 3 ? 'Tennis' : item.id_category === 4 ? 'Tennis de table' : item.id_category === 5 ? 'Volleyball' : item.id_category === 6 ? 'Golf' : 'Autre'}</td>
                                    <td>{item.item_name}</td>
                                    <td>{item.description}</td>
                                    <td>{item.stocks}</td>
                                    <td>{item.thumbnail}</td>
                                    <td>{item.price}€</td>
                                    <td className="horizontal-layout">
                                        <Button className="button-dashboard btn-sm" variant="primary">
                                            <i className="bi bi-pen"></i> Modifier
                                        </Button>
                                        <Button className="button-dashboard btn-sm" variant="danger" onClick={() => deleteItem(item.id)}>
                                            <i className="bi bi-trash3-fill"></i>Supprimer
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table><ToastContainer /></>
                )}
                {currentChoice === 'addUser' && (
                    <Card className="register-form-card">
                        <Card.Body>
                            <Card.Title>Création d'un compte employé</Card.Title>
                            <Form onSubmit={handleSubmit}>
                            <InputGroup className="mb-3">
                                <InputGroup.Text><i className="bi bi-person-fill"></i></InputGroup.Text>
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
                                    onChange={handleChange}
                                    aria-label="lastname"
                                    name='lastname'
                                />
                                </FloatingLabel>
                            </InputGroup>
        
                            <InputGroup className='mb-3'>
                                <InputGroup.Text>@</InputGroup.Text>
                                <FloatingLabel label="Username *">
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
                                <InputGroup.Text><i className="bi bi-envelope-at-fill"></i></InputGroup.Text>
                                <FloatingLabel label="Email Address *">
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
        
                            <InputGroup className="mb-3">
                                <InputGroup.Text><i className="bi bi-lock-fill"></i></InputGroup.Text>
                                <FloatingLabel label="Password *">
                                <Form.Control 
                                    type="password"
                                    placeholder="Password"
                                    aria-label="password"
                                    onChange={handleChange}
                                    name='password'
                                    required
                                />
                                </FloatingLabel>
                                <FloatingLabel label="Confirm password *">
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
                            <Button variant="primary" type="submit">
                                Ajouter l'employé
                            </Button>
                            <Form.Text>
                                * = required
                            </Form.Text>
                            </Form>
                        </Card.Body>
                    </Card>
                )}
                {currentChoice === 'addItem' && (
                    <Card className="register-form-card">
                        <Card.Body>
                            <Card.Title>Ajouter un item</Card.Title>
                            <Form onSubmit={handleSubmitAddItem}>
                            <InputGroup className="mb-3">
                                <InputGroup.Text><i className="bi bi-person-fill"></i></InputGroup.Text>
                                <FloatingLabel label="Nom de l'item *">
                                <Form.Control 
                                    type="text"
                                    placeholder="item_name"
                                    aria-label="item_name"
                                    name='item_name'
                                    onChange={handleChangeItem}
                                    required
                                />
                                </FloatingLabel>
                                <FloatingLabel label="Catégorie *">
                                <Form.Control 
                                    type="number"
                                    placeholder="id_category"
                                    aria-label="id_category"
                                    name='id_category'
                                    onChange={handleChangeItem}
                                    required
                                />
                                </FloatingLabel>
                            </InputGroup>
        
                            <InputGroup className='mb-3'>
                                <InputGroup.Text>@</InputGroup.Text>
                                <FloatingLabel label="Description *">
                                <Form.Control 
                                    type="text"
                                    placeholder='Description'
                                    aria-label="description"
                                    name="description"
                                    onChange={handleChangeItem}
                                    required
                                />
                                </FloatingLabel>
                            </InputGroup>
        
                            <InputGroup className="mb-3">
                                <InputGroup.Text><i className="bi bi-lock-fill"></i></InputGroup.Text>
                                <FloatingLabel label="Stocks *">
                                <Form.Control 
                                    type="number"
                                    placeholder="stocks"
                                    aria-label="stocks"
                                    name='stocks'
                                    onChange={handleChangeItem}
                                    required
                                />
                                </FloatingLabel>
                                <FloatingLabel label="Price *">
                                <Form.Control 
                                    type="number"
                                    placeholder="Price"
                                    aria-label="price"
                                    name='price'
                                    onChange={handleChangeItem}
                                    required
                                />
                                </FloatingLabel>
                            </InputGroup>

                            <InputGroup className='mb-3'>
                                <InputGroup.Text><i className="bi bi-envelope-at-fill"></i></InputGroup.Text>
                                <FloatingLabel label="Image *">
                                <Form.Control 
                                    type="file"
                                    placeholder='thumbnail'
                                    aria-label="thumbnail"
                                    name="thumbnail"
                                    onChange={handleChangeItem}
                                />
                                </FloatingLabel>
                            </InputGroup>

                            <Button variant="primary" type="submit">
                                Ajouter l'item
                            </Button>
                            <Form.Text>
                                * = required
                            </Form.Text>
                            </Form>
                        </Card.Body>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default Dashboard;

