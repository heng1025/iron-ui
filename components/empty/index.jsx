import React from 'react';
import emptyImg from './style/empty.svg';

const Empty = ({ children, image = emptyImg, description = 'No Data' }) => {
  return (
    <div className="iron-empty">
      {image && (
        <div>
          <img src={image} alt="empty" />
        </div>
      )}
      {description && <p className="iron-empty-des">{description}</p>}
      {children && <div className="iron-empty-footer">{children}</div>}
    </div>
  );
};

export default Empty;
