import React from 'react';
import { render } from '@testing-library/react';
import { VirtualSelect } from '../index';

const options = [];

for (let i = 0; i < 10000; i++) {
  const value = `${i.toString(36)}${i}`;
  options.push(value);
}

describe('VirtualSelect', () => {
  it('render success', () => {
    const wrapper = render(
      <VirtualSelect>
        {options.map((v) => (
          <div key={v}>{v}</div>
        ))}
      </VirtualSelect>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
