import React from 'react';
import PropTypes from 'prop-types';
import '../css/theme.css';
import { Box } from '@chakra-ui/react';

/**
 * Input field with send and microphone button for user interaction
 */
export const InputField = ({ onSend, onRecord, ...props }) => {
  const [message, setMessage] = React.useState('');
  const textareaRef = React.useRef(null);

  const handleSend = () => {
    if(message.trim() !== ''){
      onSend(message);
      setMessage('');
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  React.useEffect(() => {
    textareaRef.current.style.height = "24px"; // Reset the height
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  }, [message]);

  return (
    <Box p="16px">
      <div className="input-field">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="input-text"
          {...props}
        />
        <button onClick={handleSend} className="send-button" disabled={message.trim() === ''}>Send</button>
        <button onClick={onRecord} className="record-button">🎙️</button>
      </div>
    </Box>
  );
};

InputField.propTypes = {
  /**
   * Function to call when the send button is clicked
   */
  onSend: PropTypes.func.isRequired,
  /**
   * Function to call when the microphone button is clicked
   */
  onRecord: PropTypes.func.isRequired,
};
