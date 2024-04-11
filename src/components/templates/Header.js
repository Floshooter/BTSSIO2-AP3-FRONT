import React from 'react';
import '../../assets/styles/Header.css';
import { Link } from 'react-router-dom';
import { Button, Dropdown, DropdownButton, DropdownDivider } from 'react-bootstrap';

const logo = require('../../assets/image/Logo_M2L.png');
function Header({userData}) {
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <div className='banner'>
        <div className='banner1'>
        <img src={logo} alt="Logo M2L"/>
        </div>
        <div className='liens'>
          <Button variant="light" className='button'><Link to="/" className='lien'>Home</Link></Button>
          <Button variant="light" className='button'><Link to="/product" className='lien'>Boutique</Link></Button>   
        </div>
        {userData && userData.isConnected && userData.permLevel === 0 && (
          <div className='account'>
            <DropdownButton variant='light' id="dropdown-item-button" title={<i class="bi bi-person-fill"></i>}>
                <Dropdown.ItemText className='title-action'>{userData ? userData.username : 'Guest'}</Dropdown.ItemText>
                <DropdownDivider />
                <Link to="/mon-compte" className='lien'><Dropdown.Item as={"button"} className='action'><i class="bi bi-person-fill"></i> Mon Compte</Dropdown.Item></Link>
                <Link to="/mon-compte/panier" className='lien'><Dropdown.Item as={"button"} className='action'><i class="bi bi-person-fill"></i> Mon Panier</Dropdown.Item></Link>
                <DropdownDivider />
                <Dropdown.ItemText as="button" onClick={handleLogout} className='action'><i class="bi bi-box-arrow-right"></i>Déconnecter</Dropdown.ItemText>          
            </DropdownButton>
          </div>
        )}
        {userData && userData.isConnected && (userData.permLevel === 1 || userData.permLevel === 2) && (
          <div className='account'>
            <DropdownButton variant='light' id="dropdown-item-button" title={<i class="bi bi-person-fill"></i>}>
              <Dropdown.ItemText className='title-action'>{userData ? userData.username : 'Guest'}</Dropdown.ItemText>
              <DropdownDivider />
              <Link to="/mon-compte" className='lien'><Dropdown.Item as="button" className='action'><i class="bi bi-box-arrow-in-right"></i> Mon Compte</Dropdown.Item></Link>
              <Link to="/mon-compte/panier" className='lien'><Dropdown.Item as={"button"} className='action'><i class="bi bi-person-fill"></i> Mon Panier</Dropdown.Item></Link>
              <Link to="/dashboard" className='lien'><Dropdown.Item as="button" className='action'><i class="bi bi-plus-square"></i>Dashboard</Dropdown.Item></Link>
              <DropdownDivider />
              <Dropdown.ItemText as="button" onClick={handleLogout} className='action'><i class="bi bi-box-arrow-right"></i>Déconnecter</Dropdown.ItemText>          
            </DropdownButton>
          </div> 
        )}
        {!userData && (
          <div className='account'>
            <DropdownButton variant='light' id="dropdown-item-button" title={<i class="bi bi-person-fill"></i>}>
                <Dropdown.ItemText className='title-action'>{userData ? userData.username : 'Guest'}</Dropdown.ItemText>
                <DropdownDivider />
                <Link to="login" className='lien'><Dropdown.Item as="button" className='action'><i class="bi bi-box-arrow-in-right"></i> Se connecter</Dropdown.Item></Link>
                <Link to="register" className='lien'><Dropdown.Item as="button" className='action'><i class="bi bi-plus-square"></i>S'inscrire</Dropdown.Item></Link>
            </DropdownButton>
          </div>
        )}
    </div>
  )
}

export default Header