import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';import Login from './components/Login/Login';
import Signup from './components/Signup/SIgnup';

function App() {
  return (
    <BrowserRouter>
     <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
