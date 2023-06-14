import React from 'react';
import { Card, Description } from '../index';

export default {
  title: 'Chakra Pro Molecules/Card',
  component: Card,
};

const Template = (args) => (
  <Card {...args}><Description
    title="UX Strategist &amp; Sales Funnel Designer"
    location="Los Angeles, United States"
  >
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi, totam at
    reprehenderit maxime aut beatae ad.
  </Description>
  <Description title="Freelance Graphic &amp; Web Designer" location="Stockholm, Sweden">
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi, totam at
    reprehenderit maxime aut beatae ad.
  </Description>
  </Card>);

// More on interaction testing: https://storybook.js.org/docs/react/writing-tests/interaction-testing
export const Default = Template.bind({});
Default.args = {
  buttonText: "Add",
  clickFunction: () => { console.log("Clicked") }
};


export const WithoutButton = Template.bind({});
