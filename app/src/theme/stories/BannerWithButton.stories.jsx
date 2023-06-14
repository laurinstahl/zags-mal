import React from 'react';

import {BannerWithButton} from '../molecules/BannerWithButton';

export default {
  title: 'Chakra Pro Molecules/BannerWithButton',
  component: BannerWithButton,
};

const Template = (args) => <BannerWithButton {...args} />;

export const Default = Template.bind({});
Default.args = {};