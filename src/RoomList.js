// RoomsList.js

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
function RoomsList({ socket }) {

  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    socket.on('room-created', room => {
      setRooms(prevRooms => [...prevRooms, room]);
    });

    socket.on('room-closed', roomId => {
      setRooms(prevRooms => prevRooms.filter(room => room.id !== roomId)); 
    });
  }, []);

  return (
    <div>
      <h3>Available Rooms</h3>
      {rooms.map(room => (
        <Link key={room.id} to={`/room/${room.id}`}>
          {room.roomname}
        </Link>
      ))}
    </div>
  );

}

export default RoomsList;