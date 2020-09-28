import React, { forwardRef } from 'react';
import { VariableSizeList as VList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

export const Title = ({ value }) => <span className="text">{value}</span>;

export const VListWithDynamic1 = forwardRef(
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

export const VListWithDynamic = forwardRef(
  ({ className, itemCount, itemSize, rowRenderer }, ref) => (
    <AutoSizer>
      {({ height, width }) => (
        <VList
          ref={ref}
          width={width}
          height={height}
          itemSize={itemSize}
          itemCount={itemCount}
          className={className}
        >
          {rowRenderer}
        </VList>
      )}
    </AutoSizer>
  )
);
