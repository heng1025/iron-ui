import React, { forwardRef, useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';

const PopContent = forwardRef(({ title, content, style }, ref) => {
  return (
    <div className="iron-popover" style={style} ref={ref}>
      {title && <h2 className="iron-popover-title">{title}</h2>}
      <div className="iron-popover-content">{content}</div>
    </div>
  );
});

const Popover = ({
  children,
  title,
  content,
  visible,
  onVisibleChange,
  overlayStyle,
}) => {
  const openRef = useRef(null);
  const popoverRef = useRef(null);
  const [container, setContainer] = useState(document.body);
  const [position, setPosition] = useState(0);

  useEffect(() => {
    const openEl = openRef.current;
    const dom = openEl.parentNode;
    const { offsetHeight, offsetLeft, offsetTop } = openEl;
    const offsetDelta = 5;
    setContainer(dom);
    setPosition({
      top: offsetHeight + offsetTop + offsetDelta,
      left: offsetLeft,
    });
  }, []);

  // useEffect(() => {
  //   const popoverEl = popoverRef.current;
  //   const handler = e => {
  //     console.log('e.target', e.target);
  //     if (visible && popoverEl && !popoverEl.contains(e.target)) {
  //       onVisibleChange(false);
  //     }
  //   };
  //   window.addEventListener('click', handler);
  //   return () => {
  //     window.removeEventListener('click', handler);
  //   };
  // }, [visible, onVisibleChange]);

  return (
    <>
      <span
        ref={openRef}
        aria-hidden="true"
        onClick={() => onVisibleChange(!visible)}
      >
        {children}
      </span>
      {createPortal(
        <PopContent
          ref={popoverRef}
          title={title}
          content={content}
          style={{
            ...position,
            ...overlayStyle,
            display: visible ? 'block' : 'none',
          }}
        />,
        container
      )}
    </>
  );
};
export default Popover;
