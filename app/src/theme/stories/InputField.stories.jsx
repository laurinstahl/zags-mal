import React from 'react';

import { InputField } from '../index';

export default {
  title: 'Zag\'s Mal/InputField',
  component: InputField,
};

const Template = (args) => <InputField {...args} />;

export const Default = Template.bind({});
Default.args = {
  onSend: (message) => console.log(`Send clicked with message: ${message}`),
  onRecord: () => console.log('Record clicked'),
};
