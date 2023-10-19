// // RoomPage.js

// import { useState, useEffect, useRef } from 'react'; 
// import { useParams } from 'react-router-dom';
// import io from 'socket.io-client';
// import Peer from 'simple-peer';
// import VideoStream from './VideoStream.';
// import Chat from './Chat';

// const socket = io('http://localhost:5000');

// function RoomPage() {

//   const [streams, setStreams] = useState([]);
//   const [text, setText] = useState('');

//   const { id: roomId } = useParams();

//   const videoRef = useRef();

//   useEffect(() => {

//     // Get user video stream
//     navigator.mediaDevices.getUserMedia({video: true, audio: true})
//       .then(stream => {
//         videoRef.current.srcObject = stream;

//         // Send stream to server
//         socket.emit('add-stream', stream);
//       })

//     // Join room
//     socket.emit('join-room', roomId);

//     // Handle new streams
//     socket.on('add-stream', (stream) => {
//       setStreams(prev => [...prev, stream]);
//     });

//     // Remove user stream on unmount
//     return () => {
//       videoRef.current.srcObject.getTracks().forEach(track => track.stop());
//       socket.disconnect();
//     }

//   }, []);
// RoomPage.js

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';  
import io from 'socket.io-client';
import Peer from 'simple-peer';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import VideoStream from './Videostream';
import Chat from './Chat';

const socket = io('http://localhost:3001');

function RoomPage() {

  const [streams, setStreams] = useState([]);
  const [text, setText] = useState('');
  const [message, setMessages] = useState([]);
  const { id: roomId } = useParams();

  const videoRef = useRef();
  const peerRef = useRef(); 

  useEffect(() => {

    // Get user video stream
    navigator.mediaDevices.getUserMedia({video: true, audio: true})
      .then(streams => {
        videoRef.current.srcObject = streams;

        // Create peer instance
        peerRef.current = new Peer({
          initiator: true,
          trickle: false,
          streams,
        });

        // Send local stream to server
        socket.emit('add-stream', streams);
      });

    // Join room
    socket.emit('join-room', roomId);

    // Handle new streams
    socket.on('add-stream', (streams) => {
      // Create peer to connect to new user's stream
      const peer = new Peer({
        initiator: false,
        trickle: false,
        streams,
      });

      peer.on('stream', (remoteStream) => {
        // Got remote stream
        setStreams(prev => [...prev, remoteStream]);
      });

      peer.on('close', () => {
        // Remove stream
      });

      peer.signal(streams.id);

      // Add this peer to the list
      setStreams(prev => {
        return prev.map(s => {
          if (s.id === streams.id) {
            return { ...s, peer };
          }
          return s;
        });
      });
    });

    peerRef.current.on('signal', data => {
      socket.emit('signal', { 
        streamId: streams.id,
        signal: data
      });
    });

    socket.on('signal', ({ streamId, signal }) => {
      const peer = streams.find(s => s.id === streamId).peer;
      peer.signal(signal);
    });

    // Remove tracks on unmount
    return () => {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      socket.disconnect();
    }

  }, []);

  // Chat logic...
  // Chat message handler
  useEffect(() => {
    socket.on('chat-message', (message) => {
      setMessages(prev => [...prev, message]);
    });
  }, []);

  function sendChat(e) {
    e.preventDefault();

    socket.emit('chat-message', text);
    setText('');
  }

  return (
    <div>
      <video ref={videoRef} autoPlay muted />

      {streams.map(stream => (
        <VideoStream key={stream.id} stream={stream} />
      ))}

      <Chat socket={socket} />

      <form onSubmit={sendChat}>
        <input 
          value={text}
          onChange={e => setText(e.target.value)} 
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default RoomPage;