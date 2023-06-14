import React from 'react';

import { BannerLink } from '../components/BannerLink';

export default {
  title: 'Chakra Pro Components/BannerLink',
  component: BannerLink,
};

const Template = (args) => <BannerLink {...args}>Hello BannerLink</BannerLink>;

export const Default = Template.bind({});