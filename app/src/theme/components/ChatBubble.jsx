import React from 'react';
import PropTypes from 'prop-types';
import '../css/theme.css';
import { Box } from '@chakra-ui/react';

/**
 * Primary UI component for user interaction
 */
export const ChatBubble = ({ profileImg, message, isUser, timestamp, ...props }) => {
  const color = isUser ? 'chatbubble-secondary' : 'chatbubble-primary';
  return (
    <Box display="flex" flexDirection="row">
      <Box marginRight="8px" marginLeft="16px" display="flex" flexDirection="row" alignItems="center">
        <img style={{borderRadius: '50%'}} width="50px" height="50px" src={profileImg} alt="profile" className="chatbubble-image" />
      </Box>
      <div
        className={['chatbubble', color].join(' ')}
        {...props}
      >
        <div>
          <p>{message}</p>
          {/* <p>{timestamp}</p> */}
        </div>
      </div>
    </Box>
  );
};

ChatBubble.propTypes = {
  /**
   * The message to be displayed
   */
  message: PropTypes.string.isRequired,
  /**
   * Is this message sent by the user?
   */
  isUser: PropTypes.bool,
  /**
   * The time the message was sent
   */
  timestamp: PropTypes.string.isRequired,
  profileImg: PropTypes.string.isRequired,

};

ChatBubble.defaultProps = {
  isUser: false,
};
