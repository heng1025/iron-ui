import React, { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

const Content = ({ children, title, width = 400, visible, onCancel }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const optionWrap = modalRef.current;
    const handler = e => {
      if (visible && optionWrap && !optionWrap.contains(e.target)) {
        onCancel();
      }
    };
    window.addEventListener('click', handler);
    return () => {
      window.removeEventListener('click', handler);
    };
  }, [visible]);

  return (
    <div style={{ display: visible ? 'block' : 'none' }}>
      <div className="iron-modal-mask"></div>
      <div className="iron-modal" style={{ width }} ref={modalRef}>
        {title && <h2 className="iron-modal-title">{title}</h2>}
        <div className="iron-modal-content">{children}</div>
      </div>
    </div>
  );
};

const Modal = props => {
  return createPortal(<Content {...props} />, document.body);
};

export default Modal;
