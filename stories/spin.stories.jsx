import React from 'react';
import Spin from '../components/spin';

export default {
  title: 'components/Spin',
  component: Spin,
};

export const Primay = args => {
  return <Spin {...args} spinning />;
};

export const Tip = Primay.bind();
Tip.args = { tip: 'loading' };

export const Embedded = () => {
  return (
    <Spin spinning>
      <div>
        <div>今天下大雨了</div>
        <div>游泳还是不会</div>
        <div>啊啊啊啊啊啊</div>
      </div>
    </Spin>
  );
};
