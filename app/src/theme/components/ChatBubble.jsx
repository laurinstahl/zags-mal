import React from 'react';
import PropTypes from 'prop-types';
import '../css/theme.css';
import { Box } from '@chakra-ui/react';
import { useFeatureIsOn } from "@growthbook/growthbook-react";

/**
 * Primary UI component for user interaction
 */
export const ChatBubble = ({ profileImg, message, isUser, timestamp, hiddenMessages, setHiddenMessages, isSpeaking, startSpeech, stopSpeech, speakingMessage, isLoading, isBlurVariant, ...props }) => {
  const color = isUser ? 'chatbubble-secondary' : 'chatbubble-primary';
  //handle loading dots
  const [loadingDots, setLoadingDots] = React.useState('...');
  React.useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setLoadingDots(prev => prev.length < 3 ? prev + '.' : '');
      }, 500); // Update every 500ms
      return () => clearInterval(interval); // Clean up on unmount or when isLoading changes
    }
  }, [isLoading]);

  // Define a function to handle onClick event
  const handleClick = () => {
    if (!isUser) {  // Only toggle visibility for ChatGPT's messages
      if (hiddenMessages.includes(message)) {
        setHiddenMessages(hiddenMessages.filter(hiddenMessage => hiddenMessage !== message));
      } else {
        setHiddenMessages([...hiddenMessages, message]);
      }
    }
  };

  const blurStyle = {
    filter: 'blur(3px)',  // Change this value to get the desired level of blur
    WebkitFilter: 'blur(3px)',  // Ensure compatibility with Safari
  };

  //Defining the skeleton text replacement
  const SkeletonWord = ({ word }) => {
    return (
      <span style={{ 
        display: 'inline-block', 
        backgroundColor: 'black', 
        borderRadius: '0.2em', 
        width: `${word.length * 0.6}em`, 
        height: '1em', 
        margin: '0.2em',
        opacity: 0.3
      }} />
    );
  };

  const MessageSkeleton = () => {
    const words = message.split(' ');
    return (
      <p style={{ display: 'flex', flexWrap: 'wrap' }}>
        {words.map((word, index) => (
          <SkeletonWord key={index} word={word} />
        ))}
      </p>
    );
  };

  return (
    <Box display="flex" flexDirection="row">
      <Box marginRight="8px" marginLeft="16px" display="flex" flexDirection="row" alignItems="flex-start" marginTop="10px" >
        <img style={{borderRadius: '50%'}} width="50px" height="50px" src={profileImg} alt="profile" className="chatbubble-image" />
      </Box>
      <div className={['chatbubble', color].join(' ')} {...props}>
        
      <div onClick={handleClick} style={hiddenMessages.includes(message) && isBlurVariant ? blurStyle : null} >
          {isLoading ? loadingDots : ''}
          {hiddenMessages.includes(message) ? (isBlurVariant ? <p>{message}</p> : <MessageSkeleton />) : <p>{message}</p>}
        </div>
        <Box display="flex" flexDirection="column" justifyContent="flex-end" height="100%">
        {!isUser && !isLoading && (
          isSpeaking && speakingMessage === message
          ? <button style={{marginLeft:"10px"}} onClick={stopSpeech}>⏸️</button>
          : <button style={{marginLeft:"10px"}} onClick={() => startSpeech(message)}>⏯️</button>            
        )}
        </Box>
      </div>
        
    </Box>
  );
};

ChatBubble.propTypes = {
  /**
   * The message to be displayed
   */
  message: PropTypes.string,
  /**
   * Is this message sent by the user?
   */
  isUser: PropTypes.bool,
  /**
   * The time the message was sent
   */
  timestamp: PropTypes.string.isRequired,
  profileImg: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
  isBlurVariant: PropTypes.bool,


};

ChatBubble.defaultProps = {
  isUser: false,
  isLoading: false,
  isBlurVariant: false,
};
