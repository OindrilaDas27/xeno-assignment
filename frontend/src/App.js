import './App.css';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'; 
import Login from './pages/Login/Login';
import Campaigns from './pages/Campaigns/Campaigns';
import { GoogleOAuthProvider } from '@react-oauth/google'
import Feed from './pages/Feed/Feed';
import Segments from './pages/Segments/Segments';
import Navbar from './components/Navbar/Navbar';
import CampaignDetail from './pages/CampaignDetail/CampaignDetail';

function App() {
  const userName = localStorage.getItem('userName');

  return (
    <GoogleOAuthProvider clientId="559746045934-etugrnpe8nhp5mifpdsmbep4ghkegajk.apps.googleusercontent.com">
      <BrowserRouter>
        <AppContent userName={userName} />
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

function AppContent({ userName }) {
  const location = useLocation();

  return (
    <>
      {userName && location.pathname !== '/login' && <Navbar userName={userName} />}
      <Routes>
        <Route path='/' element={userName ? <Navigate to='/feed' /> : <Navigate to='/login' />} />
        <Route path="/login" element={<Login />} />
        <Route path='/feed' element={<Feed />} />
        <Route path="/campaign" element={<Campaigns />} />
        <Route path="/segment" element={<Segments />} />
        <Route path="/campaign/:id" element={<CampaignDetail />} />
      </Routes>
    </>
  );
}

export default App;
