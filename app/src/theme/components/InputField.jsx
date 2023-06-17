import React from 'react';
import PropTypes from 'prop-types';
import '../css/theme.css';
import { Box } from '@chakra-ui/react';
import axios from 'axios'; // make sure to install and import axios

/**
 * Input field with send and microphone button for user interaction
 */
export const InputField = ({ onSend, isLoading, ...props }) => {
  const [message, setMessage] = React.useState('');
  const [processing, setProcessing] = React.useState(false);
  const [recording, setRecording] = React.useState(false);
  const [chunks, setChunks] = React.useState([]);
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
    if(message.trim() !== '' & !isLoading){
      onSend(message);
      setMessage('');
    }
  };

  const handleKeyDown = (event) => {
    if (isLoading) {
      return;
    }
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const handleDataAvailable = (e) => {
    setChunks((prev) => [...prev, e.data]);
  };

  const handleStop = async () => {
    const blob = new Blob(chunks, { 'type' : 'audio/webm; codecs=opus' });
    setChunks([]);
    setProcessing(true);
    const data = new FormData();
    data.append('file', blob);
    try {
      const response = await axios.post('http://localhost:8123/api/transcribe', data);
      setMessage(response.data.text);
    } catch (error) {
      console.error('Error sending audio file:', error);
    }
    setProcessing(false);
  };

  const handleRecord = async () => {
    if (!mediaRecorder || mediaRecorder.state === 'inactive') {
      setRecording(true);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = handleDataAvailable;
      mediaRecorder.onstop = handleStop;
      mediaRecorder.start();
      setMediaRecorder(mediaRecorder);
    } else if (mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      setRecording(false);
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
          disabled={processing || isLoading}
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
