import React from 'react';
import * as Icons from '../../utils/antdIcon';

const Icon = ({ type, rotate, ...rest }) => {
  const { icon } = Object.values(Icons).find(i => i.name === type);
  return (
    <i aria-label={`icon: ${type}`} {...rest}>
      <icon.tag
        {...icon.attrs}
        width="1em"
        height="1em"
        fill="currentcolor"
        style={{ transform: `rotate(${rotate}deg)` }}
      >
        {icon.children.map(v => (
          <v.tag {...v.attrs} key={v.tag} />
        ))}
      </icon.tag>
    </i>
  );
};

export default Icon;
