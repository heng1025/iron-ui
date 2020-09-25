import React from 'react';
import classSNames from 'classnames';

const Row = ({ children, className, align = 'top', justify = 'start' }) => {
  return (
    <div
      className={classSNames(
        className,
        'iron-row',
        `iron-row-${align}`,
        `iron-row-${justify}`
      )}
    >
      {children}
    </div>
  );
};

const Col = ({ span, style, children }) => {
  return (
    <div
      style={style}
      className={classSNames('iron-col', {
        [`iron-col-${span}`]: span !== undefined,
      })}
    >
      {children}
    </div>
  );
};

export { Row, Col };
