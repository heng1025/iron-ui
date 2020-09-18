import React from 'react';
import Icon from 'antd/es/icon';

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

export default Spin;
