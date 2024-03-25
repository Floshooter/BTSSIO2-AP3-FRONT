import React from 'react'
import '../../assets/styles/Footer.css'

// Module
import { Link } from 'react-router-dom'
import { Button, Dropdown, DropdownButton, DropdownDivider } from 'react-bootstrap';

function Footer() {
  return (
    <div className='banner'>
        <div className='banner1'>
          <h1>M2L</h1>
        </div>
        <div className='liens'>
            <Button variant="info" className='button'><Link to="/" className='lien'>Home</Link></Button>
            <Button variant="info" className='button'><Link to="/product" className='lien'>Boutique</Link></Button>        
        </div>
        <div className='account'>
            <DropdownButton variant='info' id="dropdown-item-button" title={<i class="bi bi-person-fill"></i>}>
                <Dropdown.ItemText className='title-action'><i class="bi bi-person-fill"></i> Account</Dropdown.ItemText>
                <DropdownDivider />
                <Link to="/account/login" className='lien'><Dropdown.Item as="button" className='action'><i class="bi bi-box-arrow-in-right"></i> Sign in</Dropdown.Item></Link>
                <Link to="/account/register" className='lien'><Dropdown.Item as="button" className='action'><i class="bi bi-plus-square"></i> Sign up</Dropdown.Item></Link>
            </DropdownButton>
        </div>
    </div>
  )
}

export default Footer