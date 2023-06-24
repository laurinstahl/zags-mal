import React from 'react';
/**
 * Input field with send and microphone button for user interaction
 */
export const CompatibilityMessage = ( props ) => {
  return (
    <div className="compatibility-message">
      <p>Your operating system is not supported.</p>
      <p>Please switch to an iOS device to use this application.</p>
    </div>
  );
};

CompatibilityMessage.propTypes = {
 
};
