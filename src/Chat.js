// Chat.js

import { useState, useEffect } from 'react';

function Chat({ socket }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on('chat-message', (message) => {
      setMessages(prev => [...prev, message]);
    });
  }, []);

  return (
    <div>
      {messages.map(message => (
        <div>{message}</div>
      ))}
    </div>
  )
}

export default Chat;