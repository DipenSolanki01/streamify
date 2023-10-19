
import './App.css';


import RoomPage from './RoomPage';
import HomePage from './HomePage';
// App.js

import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import io from 'socket.io-client';

const socket = io('http://localhost:3001'); 

socket.on('connection', () => {
  console.log('Connected to server');
});
function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<HomePage socket={socket} />} />
        <Route path="/room/:id" element={<RoomPage />} />
      </Routes>
    </BrowserRouter>
    
  );
}

export default App;
