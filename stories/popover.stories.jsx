import React, { useState } from 'react';
import Button from '../components/button';
import Popover from '../components/popover';

export default {
  title: 'Components/Popover',
  component: Popover,
};

export const Primary = args => {
  const [visible, setVisible] = useState(false);
  return (
    <Popover
      {...args}
      title="title"
      content="content"
      trigger="click  "
      getPopupContainer={triggerNode=>triggerNode.parentNode}
      visible={visible}
      onVisibleChange={v => setVisible(v)}
    >
      <Button>i am button</Button>
    </Popover>
  );
};
