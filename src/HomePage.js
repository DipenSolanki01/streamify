// HomePage.js

import { useState } from 'react';
import RoomList from './RoomList';
// function HomePage({ socket }) {

//     function createRoom() {
//       socket.emit('create-room'); 
//     }
  
//     // ...
//     createRoom();
  
//   }


// HomePage.js


function HomePage({ socket }) {

  const [roomName, setRoomName] = useState('');

  function handleCreateRoom() {
    socket.emit('create-room', roomName);
    setRoomName('');
  }

  return (
    <div>
      <RoomList socket={socket} />

      <input 
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
      />
      <button variant="contained" color="primary" onClick={handleCreateRoom}>Create Room</button>
    </div>
  );

}

export default HomePage;