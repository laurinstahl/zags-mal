import React from 'react';

import { ChatBubble } from '../index';
import { Box } from '@chakra-ui/react';

export default {
  title: 'Zag\'s Mal/ChatBubble',
  component: ChatBubble,
};

const Template = (args) => 
<Box display="flex" flexDirection="column" className='box' p={16}>
  <ChatBubble profileImg="https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png" message='Hello, User!' isUser={false} timestamp={new Date().toLocaleTimeString()} />
  <ChatBubble profileImg="https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png" message={args.userResponse} isUser={true} timestamp={new Date().toLocaleTimeString()} />
</Box>

export const Default = Template.bind({});
Default.args = {
  isUser: true,
  timestamp: new Date().toLocaleTimeString(),
  userResponse: (
    <>
      <p>Hello, ChatGPT!</p>
      <p>Let's do some line breaks!</p>
    </>
  )
};
