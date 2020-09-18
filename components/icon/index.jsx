import React from 'react';
import {
  LoadingOutline,
  UpOutline,
  DownOutline,
  SearchOutline,
  CaretDownFill,
  CheckOutline,
} from '@ant-design/icons';

const icons = [
  LoadingOutline,
  UpOutline,
  DownOutline,
  SearchOutline,
  CaretDownFill,
  CheckOutline,
];

const Icon = ({ type, rotate, className }) => {
  const { icon } = icons.find((i) => i.name === type);
  return (
    <i aria-label={`icon: ${type}`} className={className}>
      <icon.tag
        {...icon.attrs}
        width="1em"
        height="1em"
        fill="currentcolor"
        style={{ transform: `rotate(${rotate}deg)` }}
      >
        {icon.children.map((v) => (
          <v.tag {...v.attrs} key={v.tag} />
        ))}
      </icon.tag>
    </i>
  );
};

export default Icon;
