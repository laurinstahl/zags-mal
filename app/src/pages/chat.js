import React from 'react';
import {ChatBubble, InputField}   from '../theme/index';

function Chat(){
  const [messages, setMessages] = React.useState([
    { sender: 'ChatGPT', message: 'Hello, how can I assist you today?', timestamp: new Date().toISOString(), profileImg:"https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/1200px-ChatGPT_logo.svg.png" }
  ]);

  const messagesEndRef = React.useRef(null);

  const handleSend = (message) => {
    setMessages(messages.concat({ sender: 'User', message, timestamp: new Date().toISOString(), profileImg:"https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png" }))
  };

  React.useEffect(() => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="box">
      <div className="messages">
        {messages.map((msg, index) => 
          <ChatBubble
            key={index}
            isUser={msg.sender === 'User'}
            message={msg.message}
            timestamp={msg.timestamp}
            profileImg={msg.profileImg}
          />
        )}
        <div ref={messagesEndRef} />
      </div>
      <InputField onSend={handleSend} />
    </div>
  );
};

export { Chat };
