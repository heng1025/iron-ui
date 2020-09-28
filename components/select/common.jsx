import React from 'react';
import classNames from 'classnames';
import { FixedSizeList as VList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import Spin from '../spin';
import Empty from '../empty';

function VRow({ children: child, style, selected, className, onClick }) {
  const {
    value: val = child.key,
    children: text,
    className: cn,
    title,
  } = child.props;
  const label = typeof text === 'string' ? text : val;
  const activeClass = child.key === selected ? 'active' : '';
  return React.cloneElement(child, {
    style,
    title: title || label,
    className: classNames(className, cn, activeClass),
    onClick: () => {
      if (onClick) {
        onClick({ key: child.key, value: val, props: child.props });
      }
    },
  });
}

export function Options({
  children,
  loading,
  height = 164,
  rowHeight = 30,
  ...rest
}) {
  const elementLen = children.length;

  if (elementLen <= 0) {
    return (
      <Spin spinning={Boolean(loading)}>
        <Empty />
      </Spin>
    );
  }

  if (elementLen <= 6) {
    return children.map(c => (
      <VRow key={c.key || c.value} {...rest}>
        {c}
      </VRow>
    ));
  }

  return (
    <AutoSizer disableHeight>
      {({ width }) => (
        <VList
          height={height}
          itemCount={elementLen}
          itemSize={rowHeight}
          width={width}
        >
          {({ index, style }) => (
            <VRow style={style} {...rest}>
              {children[index]}
            </VRow>
          )}
        </VList>
      )}
    </AutoSizer>
  );
}
