import React, { useState } from 'react';
import Modal from '../components/modal';
import Button from '../components/button';

export default {
  title: 'Components/Modal',
  component: Modal,
};

export const Primary = args => {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <Button {...args} onClick={() => setVisible(true)}>
        i am button
      </Button>
      <Modal
        visible={visible}
        onCancel={() => setVisible(false)}
        title="i am a modal"
      >
        <p>i will spend my holiday</p>
        <p>i will spend my holiday</p>
        <p>i will spend my holiday</p>
        <p>i will spend my holiday</p>
        <p>i will spend my holiday</p>
      </Modal>
    </div>
  );
};
