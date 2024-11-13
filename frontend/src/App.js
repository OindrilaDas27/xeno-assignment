import './App.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'; import Login from './components/Login/Login';
import Campaigns from './components/Campaigns/Campaigns';
import { GoogleOAuthProvider } from '@react-oauth/google'

function App() {
  return (
    <GoogleOAuthProvider clientId="559746045934-etugrnpe8nhp5mifpdsmbep4ghkegajk.apps.googleusercontent.com">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Navigate to='/login' />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
