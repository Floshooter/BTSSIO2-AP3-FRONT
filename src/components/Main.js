import React from 'react';
import '../assets/styles/Main.css';

function Main({ userData }) {
  function getUserRole(permLevel) {
    switch (permLevel) {
      case 0:
        return 'utilisateur';
      case 1:
        return 'staff';
      case 2:
        return 'administrateur';
      default:
        return 'utilisateur';
    }
  }

  return (
    <div className="main-content">
      {userData && userData.isConnected ? (
        <div>
          <h1>Bienvenue {userData.username} !</h1>
          <p>Vous êtes connecté en tant que {getUserRole(userData.permLevel)}.</p>
          {(userData.permLevel === 1 || userData.permLevel === 2) && (
            <p>Vous avez accès au dashboard !</p>
          )}
          {userData.permLevel === 0 && (
            <p>Vous avez accès à votre compte !</p>
          )}
        </div>
      ) : (
        <div>
          <h1>Bienvenue sur notre plateforme !</h1>
          <p>Connectez-vous ou créez un compte pour bénéficier d'avantages supplémentaires.</p>
        </div>
      )}
    </div>
  );
}

export default Main;
