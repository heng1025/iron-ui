import React from 'react';

const Input = ({ suffix, ...rest }) => {
  return (
    <div className="iron-input-wrapper">
      <input {...rest} className="iron-input" />
      {suffix && <span className="iron-input-suffix">{suffix}</span>}
    </div>
  );
};

export default Input;
