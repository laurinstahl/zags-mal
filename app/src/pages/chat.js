import React from 'react';
import {ChatBubble, InputField, OptionButton, RefreshButton}   from '../theme/index';
import { Box } from '@chakra-ui/react';

function Chat(){
  const [messages, setMessages] = React.useState([
    { sender: 'ChatGPT', message: 'Hi, worüber willst du heute sprechen?', timestamp: new Date().toISOString(), profileImg:"https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/1200px-ChatGPT_logo.svg.png" }
  ]);
  const [hiddenMessages, setHiddenMessages] = React.useState([]);
  const isVariant = true;
  const isBlurVariant = true;
  //refresh button
  const [abortController, setAbortController] = React.useState(null);
  let firstMessage = messages.length > 0 ? [messages[0]] : [];
  const handleRefresh = () => {
    if (abortController) {
      abortController.abort();
    }
    // check if there are messages and if so, keep the first message
    setMessages(firstMessage);
    
    // show the option buttons
    setShowOptionButtons(true);
    setIsLoading(false);
  };

  //options buttons
  const [showOptionButtons, setShowOptionButtons] = React.useState(true);
  // Add function to handle when an option button is clicked
  const handleOptionSelected = (prompt) => {
    // Send prompt to the ChatGPT API
    handleSend(prompt);
    // Remove option buttons from display
    setShowOptionButtons(false);
  };

  //speech synthesis
  const [isSpeaking, setIsSpeaking] = React.useState(false);
  const [speech, setSpeech] = React.useState(new SpeechSynthesisUtterance());
  const [speakingMessage, setSpeakingMessage] = React.useState(null);
  const [voices, setVoices] = React.useState(null);

  //call speech at pageload
  React.useEffect(() => {
    if ('speechSynthesis' in window) {
      const synth = window.speechSynthesis;
      speech.text = ''; // empty string
      synth.speak(speech); // triggers the loading of voices

      let id;
  
      id = setInterval(() => {
        if (synth.getVoices().length !== 0) {
          setVoices(synth.getVoices());
          let text = "";
          let i = 0;
          console.log(synth.getVoices())
          synth.getVoices().map(item => {
            i++;
            console.log(i-1,item.lang)
            text = text+(i-1)+item.lang+"...";
          })
          changeEverything(text);
          clearInterval(id);
        }
      }, 10);
    }
  }, []);

  // Define a function to start speech
  const startSpeech = (message) => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setSpeakingMessage(null);
    }
    // Start the new speech
    speech.text = message;
    speech.voice = voices[0];
    changeEverything(voices);
    speech.rate = 1;
    setTimeout(() => {
      window.speechSynthesis.speak(speech);
    }, 50); // delay of 50ms
    setIsSpeaking(true);
    setSpeakingMessage(message);
  };

  const changeEverything = (voices) => {
    document.getElementsByClassName("chatbubble")[0].innerText = voices;
  };

  // Define a function to stop speech
  const stopSpeech = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setSpeakingMessage(null);
    }
  };

  // Set up an event listener to handle when the speech ends
  speech.onend = function(event) {
    setIsSpeaking(false);
  };

  const messagesEndRef = React.useRef(null);
  //communication to chatgpt
  const [isLoading, setIsLoading] = React.useState(false);
  const handleSend = (message) => {
    // If there is an existing request, cancel it
    if (abortController) {
      abortController.abort();
    }

    // Create a new AbortController
    const newAbortController = new AbortController();
    setAbortController(newAbortController);

    // Add user's message to chat
    const userMessage = { sender: 'User', message, timestamp: new Date().toISOString(), profileImg:"https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png" };
    setMessages(prevMessages => prevMessages.concat(userMessage));
    const loadingMessage = { sender: 'ChatGPT', message: '', timestamp: new Date().toISOString(), profileImg:"https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/1200px-ChatGPT_logo.svg.png", isLoading: true };
    setMessages(prevMessages => prevMessages.concat(loadingMessage));
    setIsLoading(true); // Set loading to true
    setShowOptionButtons(false);

    // Send user's message to server and get response from ChatGPT
    fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
      signal: newAbortController.signal, // Add this line

    })
    .then(response => response.json())
    .then(data => {
      setIsLoading(false); // Set loading to false
      setMessages(prevMessages => {
        let messagesWithoutLoading = prevMessages.slice(0, prevMessages.length - 1);
        const chatGptMessage = { sender: 'ChatGPT', message: data.message, timestamp: new Date().toISOString(), profileImg:"https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/1200px-ChatGPT_logo.svg.png", isLoading: false };
        return messagesWithoutLoading.concat(chatGptMessage);
      });
      setHiddenMessages(prevHiddenMessages => [...prevHiddenMessages, data.message]);  // Add the new message to hiddenMessages
      startSpeech(data.message);  // Start speech synthesis
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };
  const scrollToBottom = () => {
    if (messages.length !== 1) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  React.useEffect(scrollToBottom, [messages]);


  return (
    <div className="box">
      <Box className="refresh-box" display="flex" flexDirection="row" justifyContent="center">
        <RefreshButton onRefresh={handleRefresh} />
      </Box>
      <div className="messages">
        {
          messages.length > 0 && 
          <ChatBubble 
            key={0}
            isUser={messages[0].sender === 'User'}
            message={messages[0].message}
            timestamp={messages[0].timestamp}
            profileImg={messages[0].profileImg}
            hiddenMessages={hiddenMessages}
            setHiddenMessages={setHiddenMessages}  
            isSpeaking={isSpeaking}
            startSpeech={startSpeech}
            stopSpeech={stopSpeech}
            speakingMessage={speakingMessage}
            isVariant={true}
          />}
          <div className="option-buttons">
            <OptionButton text="Rollenspiel" prompt="Starte ein Rollenspiel. Such dir eine Situation aus, nehme eine Rolle ein und stelle die erste Frage." onOptionSelected={handleOptionSelected} showOptionButtons={showOptionButtons} setShowOptionButtons={setShowOptionButtons} />
            <OptionButton text="Geschichte vorlesen" prompt="Lese mir eine Geschichte vor. Du kannst sie dir ausdenken. Sie soll mindestens 100 Wörter haben." onOptionSelected={handleOptionSelected} showOptionButtons={showOptionButtons} setShowOptionButtons={setShowOptionButtons} />
            <OptionButton text="Zufällige Frage" prompt="Stelle mir eine zufällige Frage." onOptionSelected={handleOptionSelected} showOptionButtons={showOptionButtons} setShowOptionButtons={setShowOptionButtons} />
          </div>
          {messages.slice(1).map((msg, index) => 
            <ChatBubble
              key={index+1} // adjust index to avoid key collision
              isUser={msg.sender === 'User'}
              message={msg.message}
              timestamp={msg.timestamp}
              profileImg={msg.profileImg}
              hiddenMessages={hiddenMessages}
              setHiddenMessages={setHiddenMessages}  
              isSpeaking={isSpeaking}
              startSpeech={startSpeech}
              stopSpeech={stopSpeech}
              speakingMessage={speakingMessage}
              isLoading={index+1 === messages.length - 1 && isLoading} // Only pass isLoading if this is the last message
              />
          )}
        
        <div ref={messagesEndRef} />
      </div>
      <InputField onSend={handleSend} disabled={isLoading} isVariant={isVariant} />
    </div>
  );
};

export { Chat };
