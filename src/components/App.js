import React, { useState, useEffect } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

// Components
import '../assets/styles/App.css';
import Header from './templates/Header'
// import Footer from './templates/Footer'
import Main from './Main'
import Shop from './shop/Shop'
import Login from './account/Login'
import Register from './account/Register'
import Panier from './cart/panier';
import User from './user/User';
import Dashboard from './Staff/Dashboard';
import NotFound from './Error/Notfound';
import AccessDenied from './Error/Accessdenied';

function App() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      const decodedToken = jwtDecode(storedToken);
      setUserData(decodedToken);
    }
  }, []);
  return (
    <div className="App">
      <Header userData={userData}/>
      <Routes>
        <Route path="/" element={<Main userData={userData}/>} />
        <Route path="/mon-compte" element={<User userData={userData}/>} />
        <Route path="/product" element={<Shop userData={userData}/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />}/>
        <Route path="/mon-compte/panier" element={<Panier userData={userData}/>} />
        <Route path="/404" element={<NotFound />} />
        <Route path="/access-denied" element={<AccessDenied />} />
        <Route path="*" element={<Navigate to="/404" />} />

        {/* Staff & Admin */}
        <Route path="/dashboard" element={<Dashboard userData={userData}/>}/>
      </Routes>
    </div>
  );
}

export default App;
