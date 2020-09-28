import React from 'react';
import Icon from '../icon';

const Spin = ({ children, spinning, tip }) => {
  return (
    <div className="iron-spin-wrapper">
      {spinning && (
        <div>
          <div className="iron-spin-icon-wrapper">
            <Icon type="loading" className="iron-spin-icon" />
            {tip && <div className="iron-spin-text">{tip}</div>}
          </div>
        </div>
      )}
      {children && <div className="iron-spin-container">{children}</div>}
    </div>
  );
};

Spin.displayName = 'Spin'
export default Spin;
