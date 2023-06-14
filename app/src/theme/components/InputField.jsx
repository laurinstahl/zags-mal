import React from 'react';
import PropTypes from 'prop-types';
import '../css/theme.css';
import { Box } from '@chakra-ui/react';

/**
 * Input field with send and microphone button for user interaction
 */
export const InputField = ({ onSend, onRecord, ...props }) => {
  const [message, setMessage] = React.useState('');
  const [processing, setProcessing] = React.useState(false);
  const [recording, setRecording] = React.useState(false);
  const [mediaRecorder, setMediaRecorder] = React.useState(null);
  const [loadingText, setLoadingText] = React.useState('');
  const textareaRef = React.useRef(null);

  React.useEffect(() => {
    if (processing) {
      let i = 0;
      const intervalId = setInterval(() => {
        setLoadingText('.'.repeat(i++ % 4));
      }, 500);
      return () => clearInterval(intervalId);
    } else {
      setLoadingText('');
    }
  }, [processing]);


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

  const handleRecord = async () => {
    if (!recording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start();
        setMediaRecorder(mediaRecorder);
        setRecording(true);
      } catch (err) {
        console.error('Failed to start recording', err);
      }
    } else {
      mediaRecorder.stop();
      setRecording(false);
      // Simulate processing delay
      setProcessing(true);
      setTimeout(() => setProcessing(false), 3000);  // Remove this when real processing is implemented
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
          value={processing ? loadingText : message}
          ref={textareaRef}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="input-text"
          disabled={processing}
          {...props}
        />
        <button onClick={handleSend} className="send-button" disabled={message.trim() === ''}>Send</button>
        <button onClick={handleRecord} className="record-button">{recording ? '⏹️' : '🎙️'}</button>
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
