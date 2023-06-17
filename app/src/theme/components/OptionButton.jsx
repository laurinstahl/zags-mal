import React from 'react';

function OptionButton({ text, prompt, onOptionSelected, showOptionButtons, setShowOptionButtons }) {
  // Handle when the option button is clicked
  const handleClick = () => {
    // Call the function passed in from the parent component
    onOptionSelected(prompt);
  };

  return (
    <div className={`option-button ${showOptionButtons ? 'visible' : 'hidden'}`} onClick={handleClick}>
      {text}
    </div>
  );
}

export { OptionButton };