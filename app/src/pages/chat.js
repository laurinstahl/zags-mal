import React from 'react';
import {ChatBubble, InputField, OptionButton, RefreshButton, CompatibilityMessage}   from '../theme/index';
import { Box } from '@chakra-ui/react';
import { useFeatureIsOn } from "@growthbook/growthbook-react";

function Chat(){
  const [messages, setMessages] = React.useState([
    { sender: 'ChatGPT', message: 'Hi, worüber willst du heute sprechen?', timestamp: new Date().toISOString(), profileImg:"https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/1200px-ChatGPT_logo.svg.png" }
  ]);
  const [userMessageCount, setUserMessageCount] = React.useState(1);
  const [hiddenMessages, setHiddenMessages] = React.useState([]);
  const isInputVariant = useFeatureIsOn("is_input_variant");
  const isCompatibilityVariant = useFeatureIsOn("is_compatibility_variant");
  const isBlurVariant = useFeatureIsOn("is_blur_variant");
  const variants = [{"isBlurVariant":isBlurVariant},{"isInputVariant":isInputVariant},{"isCompatibilityVariant":isCompatibilityVariant}];

  //compatibility & setting user voice
  let voicesIndex; // Initialize voicesIndex
  if (window.navigator.userAgent.indexOf("CriOS") !== -1) {
    voicesIndex = 9; // Set to Chrome, 4 ✅,5,6, 181 ✅, 13 ✅,12,11,10,9,8,7
  } else if (window.navigator.userAgent.indexOf("Safari") !== -1 && window.navigator.userAgent.indexOf("Chrome") === -1) {
    voicesIndex = 173; // Set to Safari
  } else {
    voicesIndex = 9; // Default to Chrome if neither Chrome nor Safari is detected
  }
  // console.log(window.navigator.userAgent, voicesIndex) //for debugging
  const userAgent = navigator.userAgent.toLowerCase();
  const isIOS = /iphone|ipad|ipod/.test(userAgent);

  //feature flags

  const isCommpatible = !(isIOS && !userAgent.includes('macintosh')); 
  const showCompatibilityMessage = isCommpatible && isCompatibilityVariant; // Show compatibility message if not iOS or iPad on macOS
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
  const [voicesLoaded, setVoicesLoaded] = React.useState(false); // Add this line

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
          setVoicesLoaded(true); // Set voicesLoaded to true
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
  
    // Filter the voices for only German voices
    let germanVoices = voices.filter(voice => voice.lang.includes('de-DE'));

    // Check if 'Google' exists in German voices
    let googleVoice = germanVoices.filter(voice => voice.name.includes('Google'));

    let selectedVoice;

    if(googleVoice.length > 0) {
      // If 'Google' exists, use it as the speech voice
      selectedVoice = googleVoice[0];
    } else {
      // If 'Google' doesn't exist, check for 'Anna'
      let annaVoice = germanVoices.filter(voice => voice.name.includes('Anna'));
      if(annaVoice.length > 0) {
        // If 'Anna' exists, use it as the speech voice
        selectedVoice = annaVoice[0];
      } else {
        // If 'Anna' doesn't exist, use the last voice in the array of German voices
        selectedVoice = germanVoices[germanVoices.length - 1];
      }
    }

    speech.voice = selectedVoice;
    speech.rate = 1;
    setIsSpeaking(true);
    window.speechSynthesis.speak(speech);
    setSpeakingMessage(message);
  };
  // console.log(speech.voice)

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

  //Splash screen
  const [splashScreenVisible, setSplashScreenVisible] = React.useState(true);

  const handleStart = React.useCallback(() => {
    setSplashScreenVisible(false);
    if (voicesLoaded) {
      startSpeech(messages[0].message);
    }
  }, [voicesLoaded, messages]);

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
    // user message count
    setUserMessageCount(userMessageCount + 1);
    let apiEndpoint;

    if (window.location.hostname === "localhost" && window.location.port === "3000") {
        apiEndpoint = "http://localhost:8123/api/chat";
    } else {
        apiEndpoint = "/api/chat";
    }

    // Send user's message to server and get response from ChatGPT
    fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        message, 
        userMessageCount,
        userId: localStorage.getItem('userId'),
        variants: variants
      }), // Pass userMessageCount along with the message
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
  if (showCompatibilityMessage) {
    return <CompatibilityMessage/>;
  }

  return (
    <>    
      {splashScreenVisible ? (
        <div className="splash-screen">
          <h1>Zag's mal</h1>
          <button onClick={() => {
            handleStart();
            window.analytics.track('Los Gehts Clicked', {
              variants: variants,
            });
            }}>Los geht's</button>        
        </div>
      ) : null}
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
              isBlurVariant={isBlurVariant}
              isLoading={index+1 === messages.length - 1 && isLoading} // Only pass isLoading if this is the last message
              />
          )}
        
        <div ref={messagesEndRef} />
      </div>
      <InputField onSend={handleSend} disabled={isLoading} isVariant={isInputVariant} />
    </div>
    </>
  );
};

export { Chat };
