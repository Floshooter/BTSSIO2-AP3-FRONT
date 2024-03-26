import '../../assets/styles/user.css';
import React, { useState, useEffect } from 'react'
import axios from 'axios';

import pdp from '../../assets/image/pdp.png';
const url = 'http://192.168.1.28:8001/users';

// Fonction pour renommer les champs
const fieldNames = {
  firstname: 'Prénom',
  lastname: 'Nom de famille',
  username: 'Nom utilisateur',
  email: 'Email',
  pwd: 'Mot de passe',
  country: 'Pays'
};

function User({userData}) {
  const [user, setUser] = useState([]);
  const [editableField, setEditableField] = useState(null);
  console.log('userdata:', userData)

  const fetchUser = async () => {
    try {
      if ( userData && userData.userId) {
        const response = await axios.get(`${url}/id/${userData.userId}`);
        console.log({'user': response.data});
        setUser(response.data);
      }
    } catch (error) {
        console.error('Error fetching users:', error);
    }
};
  useEffect(() => {
      fetchUser();
  }, [userData]);

  const handleEdit = (field) => {
    setEditableField(field);
  };

  const handleCancelEdit = () => {
    setEditableField(null);
  };

  const handleInputChange = (event) => {
    setUser({ ...user, [editableField]: event.target.value });
  };

  const handleSave = async () => {
    try {
      await axios.put(`${url}/updateUser/${userData.userId}`, {
        field: editableField,
        value: user[editableField]
      });
      setEditableField(null);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
    <div className="container">
      <form>
        <div className="row">
          <div className="col-md-4">
            <img src={pdp} alt="Photo de profil" />
            <h3>ID: {user.id}</h3>
            <p>{user.perm_level ? 'Administrateur' : 'Utilisateur'}</p>
          </div>
          <div className="col-md-8">
            <h2>Mes informations</h2>
            {Object.entries(user).map(([key, value]) => (
              key !== 'id' && key !== 'perm_level' && (
                <div className="info-item" key={key}>
                  <div className="info-title">{fieldNames[key]}</div>
                  {editableField === key ? (
                    <>
                      <input
                        type="text"
                        value={value}
                        onChange={handleInputChange}
                      />
                      <button className="btn btn-secondary" onClick={handleCancelEdit}>Annuler</button>
                    </>
                  ) : (
                    <div className="info-value">{value}</div>
                  )}
                  {editableField === key && (
                    <button className="btn btn-primary" onClick={handleSave}>
                      Enregistrer
                    </button>
                  )}
                  {!editableField && (
                    <button
                      className="btn btn-primary"
                      onClick={() => handleEdit(key)}
                    >
                      Modifier
                    </button>
                  )}
                </div>
              )
            ))}
          </div>
        </div>
      </form>
    </div>
  );
}

export default User;
