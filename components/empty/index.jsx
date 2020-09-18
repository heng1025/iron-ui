import React from 'react';

const Empty = ({ children, image="./style/empty.svg", description = 'No Data' }) => {
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
