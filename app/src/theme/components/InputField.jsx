import React from 'react';
import PropTypes from 'prop-types';
import '../css/theme.css';
import { Box } from '@chakra-ui/react';
import axios from 'axios'; // make sure to install and import axios

/**
 * Input field with send and microphone button for user interaction
 */
export const InputField = ({ onSend, isLoading, disabled, isVariant, ...props }) => {
  const [message, setMessage] = React.useState('');
  const [processing, setProcessing] = React.useState(false);
  const [recording, setRecording] = React.useState(false);
  const [chunks, setChunks] = React.useState([]);
  const mediaRecorder = React.useRef(null);
  const [loadingText, setLoadingText] = React.useState('');
  const textareaRef = React.useRef(null);
  React.useEffect(() => {
    if (processing) {
      let i = 0;
      const intervalId = setInterval(() => {
        setLoadingText('.'.repeat(i++ % 4));
      }, 200);
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
    if (e.data.size > 0) {
      setChunks((prev) => [...prev, e.data]);
    }
  };

  const handleCancel = () => {
    setMessage('');
  };

  const handleStop = () => {
    mediaRecorder.current.onstop = () => {
      const blob = new Blob(chunks, { 'type': 'audio/mp4; codecs=mp4a' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'audio.mp4');
      document.body.appendChild(link);
      setProcessing(true); // Set processing to true here
      //link.click(); we don't want to download the file
      setChunks([]);
      const sendAudioToTranscribeAPI = async () => {
        const data = new FormData();
        data.append('file', blob, 'audio.mp4');
        for (let pair of data.entries()) {
        }
        try {
          let apiEndpoint;

          if (window.location.hostname === "localhost" && window.location.port === "3000") {
              apiEndpoint = "http://localhost:8123/api/transcribe";
          } else {
              apiEndpoint = "/api/transcribe";
          }
          const response = await axios.post(apiEndpoint, data);
          setMessage(prevMessage => isVariant ? `${prevMessage} ${response.data.message.text}` : response.data.message.text);
        } catch (error) {
          console.error('Error sending audio file:', error);
        } finally {
          setProcessing(false);
        }
      };

      sendAudioToTranscribeAPI();
    };
    mediaRecorder.current.stop();
  };

  const handleRecord = async () => {
    if (!mediaRecorder.current || mediaRecorder.current.state === 'inactive') {
      setRecording(true);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const newMediaRecorder = new MediaRecorder(stream);
      newMediaRecorder.ondataavailable = handleDataAvailable;
      newMediaRecorder.onstop = handleStop;  
      newMediaRecorder.start(500); // Increase the timeslice duration for testing purpose
      mediaRecorder.current = newMediaRecorder;
    } else if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
      handleStop();
      setRecording(false);
    }
  };

  React.useEffect(() => {
    textareaRef.current.style.height = "24px"; // Reset the height
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  }, [message]);

  return (
    <Box p="16px">
      <div className={`input-field ${isVariant ? "variant" : ""}`}>
        <textarea
          value={processing ? (isVariant ? message + loadingText : loadingText) : message}
          ref={textareaRef}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="input-text"
          disabled={disabled || processing || isVariant}
          {...props}
        />
        <div className={`button-box ${isVariant ? "variant" : ""}`}>
          {isVariant && <button onClick={handleCancel} className="cancel-button">Cancel</button>}
        <button onClick={handleRecord} className="record-button">{recording ? '⏹️' : '🎙️'}</button>
        <button onClick={handleSend} className="send-button" disabled={message.trim() === ''}>Send</button>
        </div>
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
  onRecord: PropTypes.func,
};
