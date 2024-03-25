import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../assets/styles/panier.css';
const url = 'http://localhost:8001';

function Cart({userData}) {
  const [items, setItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0)

  useEffect(() => {
    const fetchItems = async () => {
      try {
        if(userData && userData.userId) {
          const response = await axios.get(`${url}/article/getCart/${userData.userId}`);
          const itemsArray = Object.values(response.data)
          setItems(itemsArray[0]);
          const calculatedTotalPrice = itemsArray[0].reduce((accumulator, item) => {
            return accumulator + parseFloat(item.price);
          }, 0);
          
          setTotalPrice(calculatedTotalPrice);
          console.log('user items: ', itemsArray);

        }
      } catch (error) {
        console.error('Erreur lors de la récupération des articles : ', error);
      }
    };

    fetchItems();
  }, [userData]);

  const handleDeleteItem = async (itemId) => {
    try {
      const userId = userData.userId;
      if (!userId) {
        console.error('L\'userId n\'est pas défini.');
        return;
      }
      await axios.delete(`${url}/deleteUserItem/${itemId}`, { data: { userId } });
      setItems(items.filter(item => item.id !== itemId));
      alert('Item supprimé du panier');
      window.location.href = '/mon-compte/panier';
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'article : ', error);
    }
  };

  const handleValidateCart = async () => {
    try {
      const response = await axios.delete(`${url}/article/deleteUserCart/${userData.userId}`);
      console.log('Réponse du serveur:', response.data);
      alert('Panier validé avec succès !');
    } catch (error) {
      console.error('Erreur lors de la validation du panier : ', error);
      alert('Erreur lors de la validation du panier. Veuillez réessayer plus tard.');
    }
  };

  return (
    <div className="cart-container">
      <h2>Mon panier</h2>
      {Array.isArray(items) && items.map(item => (
        <div key={item.id_item} className="cart-item">
          <img src={item.image} alt={item.item_name} className="item-image" />
          <div className="item-details">
            <h3>{item.total_quantity}x {item.item_name}</h3>
            <p>Prix total: {item.price}€</p>
          </div>
          <button className="delete-button" onClick={() => handleDeleteItem(item.id_item)}>Supprimer</button>
        </div>
      ))}
      {items.length > 0 && (
        <>
        <div className="total-price">
          Total: {totalPrice.toFixed(2)}€
        </div>
        <button className="validate-button" onClick={handleValidateCart}>Valider le panier</button>
        </>
      )}
      {items.length === 0 && (
        <p>Il y a encore rien dans le pa</p>
      )}
    </div>
  );
}

export default Cart;
