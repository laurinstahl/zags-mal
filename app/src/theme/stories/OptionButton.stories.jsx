import React from 'react';

import { ChatBubble } from '../index';
import { Box } from '@chakra-ui/react';

export default {
  title: 'Zag\'s Mal/ChatBubble',
  component: ChatBubble,
};

const Template = (args) => 
<Box display="flex" flexDirection="column" className='box' p={16}>
  <OptionButton text="Rollenspiel" prompt="Starte ein Rollenspiel. Such dir eine Situation aus, nehme eine Rolle ein und stelle die erste Frage."  />
  <OptionButton text="Geschichte vorlesen" prompt="Lese mir eine Geschichte vor. Du kannst sie dir ausdenken. Sie soll mindestens 100 Wörter haben."  />
  <OptionButton text="Zufällige Frage" prompt="Stelle mir eine zufällige Frage." />        
</Box>

export const Default = Template.bind({});
Default.args = {
  
};
