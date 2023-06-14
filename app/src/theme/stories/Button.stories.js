import React from 'react';
import { storiesOf } from '@storybook/react';
import { Button } from '../index';

storiesOf('Chakra Pro Components/Button', module)
  .add('default', () => <Button>Click me</Button>)
  .add('disabled', () => <Button disabled>Can't click me</Button>);