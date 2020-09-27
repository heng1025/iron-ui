import React from 'react';
import Form from '../components/form';

export default {
  title: 'Components/Form',
  component: Form,
};

export const Primary = args => {
  return <Form {...args}>i am form</Form>;
};
