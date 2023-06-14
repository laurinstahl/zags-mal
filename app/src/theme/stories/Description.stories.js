import React from 'react';
import { storiesOf } from '@storybook/react';
import { Description } from '../index';

// storiesOf('Chakra Pro Components/Description', module)
//   .add('default', () => <Description bg="brand.100" p="16px" />);

export default {
  title: 'Chakra Pro Components/Description',
  component: Description,
};

const Template = (args) => <Description {...args}/>;

export const Default = Template.bind({});
Default.args = {
  title: "Default Title",
  children: ["1",2,3],
  location: 'bottom',
};
