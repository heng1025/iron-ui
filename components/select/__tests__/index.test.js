import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { VirtualSelect } from '../index';

const options = ['abc', 'def', 'ccc', 'bsd'];

// for (let i = 0; i < 10000; i++) {
//   const value = `${i.toString(36)}${i}`;
//   options.push(value);
// }

describe('VirtualSelect', () => {
  function genSelect(args) {
    return (
      <VirtualSelect {...args}>
        {options.map((v) => (
          <div key={v}>{v}</div>
        ))}
      </VirtualSelect>
    );
  }
  it('render success', () => {
    const wrapper = render(genSelect());
    expect(wrapper).toMatchSnapshot();
  });

  it('renders disabled select correctly', () => {
    const wrapper = render(genSelect({ disabled: true }));
    expect(wrapper).toMatchSnapshot();
  });

  it('should hide the dropdown when click outside', () => {
    const wrapper = render(genSelect());
    const inputEls = screen.getAllByPlaceholderText('please select');
    // second input box
    fireEvent(inputEls[1], new FocusEvent('focus'));
    // screen.debug()
    expect(wrapper.queryByText('abc')).toBeInTheDocument();
    fireEvent.click(document);
    expect(wrapper.queryByText('abc')).not.toBeInTheDocument();
  });
});
