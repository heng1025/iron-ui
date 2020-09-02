import React, { forwardRef } from 'react';
import classNames from 'classnames';
import Empty from 'antd/es/empty';
import Spin from 'antd/es/spin';
import VList from 'react-virtualized/dist/es/List';
import AutoSizer from 'react-virtualized/dist/es/AutoSizer';
import styles from './index.less';

function VRow({ children: child, style, selected, className, onClick }) {
  const {
    value: val = child.key,
    children: text,
    className: cn,
    title,
  } = child.props;
  const label = typeof text === 'string' ? text : val;
  const activeClass = child.key === selected ? styles.active : '';
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
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      </Spin>
    );
  }

  if (elementLen <= 6) {
    return children.map((c) => (
      <VRow key={c.key || c.value} {...rest}>
        {c}
      </VRow>
    ));
  }

  return (
    <AutoSizer disableHeight>
      {({ width }) => (
        <VList
          width={width}
          height={height}
          rowHeight={rowHeight}
          rowCount={elementLen}
          rowRenderer={({ index, style }) => {
            const child = children[index];
            return (
              <VRow key={child.key || child.value} style={style} {...rest}>
                {child}
              </VRow>
            );
          }}
        />
      )}
    </AutoSizer>
  );
}

export const Title = ({ value }) => <span className="text">{value}</span>;

export const VListWithDynamic = forwardRef(
  ({ rowCount, className, rowHeight, rowRenderer }, ref) => (
    <AutoSizer>
      {({ height, width }) => (
        <VList
          ref={ref}
          width={width}
          height={height}
          rowHeight={rowHeight}
          rowCount={rowCount}
          className={className}
          rowRenderer={rowRenderer}
        />
      )}
    </AutoSizer>
  )
);
