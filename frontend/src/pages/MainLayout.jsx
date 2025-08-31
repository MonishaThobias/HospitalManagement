import React,{useState,useEffect} from 'react';
import Navbar from '../components/NavBar';
import { Outlet, useNavigate } from 'react-router';
import Footer from '../components/Footer.jsx';


const MainLayout = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  //const username = 'Dr. Monisha'; // You can replace this with dynamic data later
useEffect(() => {
    const savedUsername = localStorage.getItem('username');
    if (savedUsername) {
      setUsername(savedUsername);
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
     localStorage.removeItem('username'); 
    navigate('/');
  };

  return (
    <>
      <Navbar username={username} onLogout={handleLogout} />
      <main className="content" style={{ padding: '20px' }}>
        <Outlet />
      </main>
     <Footer /> 
    </>
  );
};

export default MainLayout;
