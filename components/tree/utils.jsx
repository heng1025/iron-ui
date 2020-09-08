import React, { forwardRef } from 'react';
import VList from 'react-virtualized/dist/es/List';
import AutoSizer from 'react-virtualized/dist/es/AutoSizer';

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
