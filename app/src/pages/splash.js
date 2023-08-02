import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFeatureIsOn } from "@growthbook/growthbook-react";

function Splash(){
  
  const isInputVariant = useFeatureIsOn("is_input_variant");
  const isCompatibilityVariant = useFeatureIsOn("is_compatibility_variant");
  const isBlurVariant = useFeatureIsOn("is_blur_variant");
  const variants = [{"isBlurVariant":isBlurVariant},{"isInputVariant":isInputVariant},{"isCompatibilityVariant":isCompatibilityVariant}];
  
  // Use the useHistory hook here
  const navigate = useNavigate();

  const handleStart = () => {
    // Use navigate to redirect to the /chat page
    navigate('/chat');
  }

  return (
    <>    
      <div className="splash-screen">
        <h1>Zag's mal</h1>
        <button onClick={() => {
          handleStart();
          window.analytics.track('Los Gehts Clicked', {
            variants: variants,
          });
          }}>Los geht's</button>        
      </div>
    </>
  );
};

export { Splash };
