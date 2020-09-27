import React, { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const PopContent = ({ title, content, style }) => {
  return (
    <div className="iron-popover" style={style}>
      {title && <h2 className="iron-popover-title">{title}</h2>}
      <div className="iron-popover-content">{content}</div>
    </div>
  );
};

const Popover = ({
  children,
  title,
  content,
  visible,
  onVisibleChange,
  overlayStyle,
}) => {
  const popoverRef = useRef(null);
  const [el, setEl] = useState(document.body);
  const [top, setTop] = useState(0);

  useEffect(() => {
    const dom = popoverRef.current;
    const offset = 10;
    if (dom) {
      setEl(dom);
      setTop(dom.clientHeight + offset);
    }
  }, []);

  useEffect(() => {
    const optionWrap = popoverRef.current;
    const handler = e => {
      if (optionWrap && !optionWrap.contains(e.target)) {
        onVisibleChange(false);
      }
    };
    window.addEventListener('click', handler);
    return () => {
      window.removeEventListener('click', handler);
    };
  }, [onVisibleChange]);

  return (
    <div ref={popoverRef} className="iron-popover-wrapper">
      {createPortal(
        <PopContent
          title={title}
          content={content}
          style={{
            display: visible ? 'block' : 'none',
            top: `${top}px`,
            ...overlayStyle,
          }}
        />,
        el
      )}
      <span onClick={() => onVisibleChange(!visible)} aria-hidden="true">
        {children}
      </span>
    </div>
  );
};
export default Popover;
