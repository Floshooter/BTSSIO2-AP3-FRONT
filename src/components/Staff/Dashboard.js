import '../../assets/styles/Dashboard.css';
import { Table, Form, InputGroup, Button, Card, FloatingLabel, Toast, Modal } from 'react-bootstrap';
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
    const [selectedItem, setSelectedItem] = useState(null);
    const [modifyField, setModifyField] = useState('');
    const [newValue, setNewValue] = useState('');
    const [showModifyDialog, setShowModifyDialog] = useState(false);

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
      const response = await axios.post(`${url}/users/addemployee`,formData, {headers: {Authorization: `${localStorage.getItem('token')}`}});
      console.log(response)

      if (response.status === 200) {
        alert('Compte créé');
        window.location.href = '/dashboard';
      } else {
        console.error('Erreur lors de la création du compte :', response.statusText);
      }
    } catch (error) {
      console.error('Error during registration:', error);
    }
  }
  const handleSubmitAddItem = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('item_name', formDataItem.item_name);
    formData.append('description', formDataItem.description);
    formData.append('stocks', formDataItem.stocks);
    formData.append('price', formDataItem.price);
    formData.append('id_category', formDataItem.id_category);
    formData.append('thumbnail', formDataItem.thumbnail);

    try {
        const response = await axios.post(`${url}/boutique/additem`, formData, {
            headers: {
                Authorization: `${localStorage.getItem('token')}`,
            }
        });
        console.log(response);
        if (response.status === 200) {
            alert('Item ajouté');
            window.location.href = '/dashboard';
        } else {
            console.error('Erreur lors de l\'ajout d\'un item :', response.statusText);
        }
    } catch (error) {
        console.error('Error during item addition:', error);
    }
};

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value})
  }
  const handleChangeItem = (e) => {
    if (e.target.name === 'thumbnail') {
      setFormDataItem({...formDataItem, thumbnail: e.target.files[0]});
    } else {
      setFormDataItem({...formDataItem, [e.target.name]: e.target.value});
    }
  }

    const fetchUsers = async () => {
        try {
            const users = await axios.get(`${url}/users/`, {
                headers: {
                    Authorization: `${localStorage.getItem('token')}`
                }
            })
            console.log({'users': users.data})
            setUsers(users.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }
    const fetchItems = async () => {
        try {
            const items = await axios.get(`${url}/boutique`, {
                headers: {
                    Authorization: `${localStorage.getItem('token')}`
                }
            })
            console.log({'items': items.data})
            setItems(items.data);
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    }

    const openModifyDialog = (item) => {
        setSelectedItem(item);
        setShowModifyDialog(true);
    }

    const closeModifyDialog = () => {
        setShowModifyDialog(false);
        setSelectedItem(null);
        setModifyField('');
        setNewValue('');
    }

    const handleModify = async () => {
        try {
            const response = await axios.put(
                `${url}/boutique/updateitem/${selectedItem.id_items}`,
                {
                    field: modifyField,
                    value: newValue
                },
                {
                    headers: {
                        Authorization: `${localStorage.getItem('token')}`
                    }
                }
            );

            if (response.status === 200) {
                toast.success('Modification enregistrée');
                fetchItems();
                closeModifyDialog();
            } else {
                console.error('Erreur lors de la modification :', response.statusText);
            }
        } catch (error) {
            console.error('Erreur lors de la modification:', error);
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchItems()
    }, []);

    const deleteItem = async (itemId) => {
        try {
            const response = await axios.delete(`${url}/boutique/deleteitem/${itemId}`, {
                headers: {
                    Authorization: `${localStorage.getItem('token')}`
                }
            });
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
    const deleteUser = async (userId) => {
        try {
            const response = await axios.delete(`${url}/users/deleteUser/${userId}`, {
                headers: {
                    Authorization: `${localStorage.getItem('token')}`
                }
            });
            if (response.status === 200) {
                toast.success('L\'utilisateur a été supprimé', {
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
                console.error('Erreur lors de la suppression de l\'utilisateur :', response.statusText);
            }
        } catch (error) {
            console.error('Error during user deletion:', error);
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
                                                    <Button className="button-dashboard btn-sm" variant="danger" onClick={() => deleteUser(user.id)}>
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
                                    <td>{item.id_items}</td>
                                    <td>{item.id_category === 0 ? 'Inconnue' : item.id_category === 1 ? 'Football' : item.id_category === 2 ? 'Basketball' : item.id_category === 3 ? 'Tennis' : item.id_category === 4 ? 'Tennis de table' : item.id_category === 5 ? 'Volleyball' : item.id_category === 6 ? 'Golf' : 'Autre'}</td>
                                    <td>{item.item_name}</td>
                                    <td>{item.description}</td>
                                    <td>{item.stocks}</td>
                                    <td>{item.thumbnail}</td>
                                    <td>{item.price}€</td>
                                    <td className="horizontal-layout">
                                        <Button className="button-dashboard btn-sm" variant="primary"  onClick={() => openModifyDialog(item)}>
                                            <i className="bi bi-pen"></i> Modifier
                                        </Button>
                                        <Button className="button-dashboard btn-sm" variant="danger" onClick={() => deleteItem(item.id_items)}>
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
                            <Form onSubmit={handleSubmitAddItem} enctype="multipart/form-data">
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
                                    pattern="^\d*(\.\d{0,2})?$"
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
            <Modal show={showModifyDialog} onHide={closeModifyDialog}>
                <Modal.Header closeButton>
                    <Modal.Title>Modifier l'item</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group controlId="modifyField">
                        <Form.Label>Champ à modifier</Form.Label>
                        <Form.Control as="select" onChange={(e) => setModifyField(e.target.value)}>
                            <option value="">Sélectionnez un champ</option>
                            <option value="item_name">Nom</option>
                            <option value="description">Description</option>
                            <option value="stocks">Stocks</option>
                            <option value="price">Prix</option>
                            <option value="id_category">Catégorie</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="newValue">
                        <Form.Label>Nouvelle valeur</Form.Label>
                        <Form.Control type="text" value={newValue} onChange={(e) => setNewValue(e.target.value)} />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeModifyDialog}>
                        Annuler
                    </Button>
                    <Button variant="primary" onClick={handleModify}>
                        Enregistrer
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Dashboard;

