import React from 'react';
import emptyImage from './style/empty.svg';

const EMPTY_IMAGE = {
  src: emptyImage,
  alt: 'empty',
};

const Empty = ({
  children,
  image = EMPTY_IMAGE.src,
  description = 'No Data',
}) => {
  return (
    <div className="iron-empty">
      {image && (
        <div>
          <img src={image} alt={EMPTY_IMAGE.alt} />
        </div>
      )}
      {description && <p className="iron-empty-des">{description}</p>}
      {children && <div className="iron-empty-footer">{children}</div>}
    </div>
  );
};

export default Empty;
