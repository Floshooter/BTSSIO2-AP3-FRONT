import '../../assets/styles/Shop.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, ListGroup, Button, Container, Row, Col } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const url = 'http://192.168.1.28:8001';
// const imageUrl = 'http://localhost:8001/upload/products/';
const Shop = ({ userData }) => {
  console.log(userData);
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]);
  // const [searchTerm, setSearchTerm] = useState('');
  // const [error, setError] = useState('');
  // const [searchResultsMessage, setSearchResultsMessage] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const items = await axios.get(`${url}/boutique`, {
      headers: {
          Authorization: `${localStorage.getItem('token')}`
      }
  })
      setItems(items.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des articles : ', error);
    }
  };

  const addItemToCart = async (item) => {
    setCart([...cart, item]);
    try {
      const article = {
        itemId: item.id_items,
        item_name: item.item_name,
        quantity: 1,
        basePrice: item.price,
        userId: userData.userId
      };
      const response = await axios.post(`${url}/article/add`, article, {
        headers: {
          Authorization: `${localStorage.getItem('token')}`
      }});
      
      console.log('Response from server:', response);
      console.log('Data from server:', response.data);
      toast.success('Le produit a été ajouté au favoris', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
        })
    } catch (error) {
      console.error('Error adding item to cart: ', error);
    }
  };

  // const handleSearch = async () => {
  //   if (!searchTerm || searchTerm.trim().length < 1) {
  //     setError('Veuillez saisir au moins une lettre pour effectuer la recherche.');
  //     return;
  //   }
  //   try {
  //     const response = await axios.get(`${url}/boutique/s?name=${searchTerm}`);
  //     if (response.data.length === 0) {
  //       setSearchResultsMessage('Aucun produit trouvé.');
  //     } else {
  //       setItems(response.data);
  //       setSearchResultsMessage('');
  //     }
  //     setError('');
  //   } catch (error) {
  //     console.error('Erreur lors de la recherche : ', error);
  //   }
  // };

   
  return (
    <div>
      {/* <div>
        <input
          type="text"
          placeholder="Rechercher..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>Rechercher</button>
        {error && <p>{error}</p>}
        {searchResultsMessage && <p>{searchResultsMessage}</p>}
      </div> */}
      {items && userData && userData.isConnected && (
        <Container className="shop-container">
          <h1>Liste des articles :</h1>
          <Row>
            {items.map((item, index) => (
              <Col key={index} md={4} className="mb-4">
                <Card>
                  <Card.Img variant="top" src={`http://localhost:8001/upload/${item.thumbnail}`} alt={item.item_name} className="card-img" />
                  <Card.Body>
                    <Card.Title>{item.item_name}</Card.Title>
                    <Card.Text className="card-text">{item.price}€</Card.Text>
                  </Card.Body>
                  <Card.Footer>
                    <Button variant="success" onClick={() => addItemToCart(item)}>
                      Ajouter au panier
                    </Button>
                    <ToastContainer />
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      )}
      {items && userData && (!userData.isConnected || userData === null) && (
        <div className="card-grid-container">
          {items.map((item, index) => (
            <Card key={index} style={{ width: '18rem' }}>
              <Card.Img variant="top" src={item.thumbnail} />
              <Card.Body>
                <Card.Title>{item.item_name}</Card.Title>
              </Card.Body>
              <ListGroup className="list-group-flush">
                <ListGroup.Item>
                  Catégorie: {item.id_category === 0
                    ? 'Inconnue'
                    : item.id_category === 1
                    ? 'Football'
                    : item.id_category === 2
                    ? 'Basketball'
                    : item.id_category === 3
                    ? 'Tennis'
                    : item.id_category === 4
                    ? 'Tennis de table'
                    : item.id_category === 5
                    ? 'Volleyball'
                    : item.id_category === 6
                    ? 'Golf'
                    : 'Autre'}
                </ListGroup.Item>
                <ListGroup.Item>
                  Stocks: {item.stocks === 0 ? <span style={{ color: 'red' }}>Rupture de stock</span> : `${item.stocks} restant(s)` }
                </ListGroup.Item>
                <ListGroup.Item>{item.price}€</ListGroup.Item>
              </ListGroup>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Shop;
