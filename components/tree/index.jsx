import React, { useMemo, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Icon from '../icon';
import Checkbox from '../checkbox';

import { VListWithDynamic, Title } from './utils';

const ROW_HEIGHT = 26;

const nodeHasChildren = (node) => node.children && node.children.length;

const transformTreeData = (data, defaultExpandAll = false, parent) =>
  data.map((item) => {
    if (parent) {
      item.parent = parent;
    }
    if (!item.key) {
      item.key = item.id;
    }
    item.expanded = defaultExpandAll;
    item.checked = false;
    item.indeterminate = false;
    if (nodeHasChildren(item)) {
      transformTreeData(item.children, defaultExpandAll, item);
    }

    return item;
  });

function getExpandedItemCount(item) {
  let total = 1;
  const { expanded, children } = item;
  if (expanded && children) {
    total += children
      .map(getExpandedItemCount)
      .reduce((acc, num) => acc + num, 0);
  }
  return total;
}

const updateSubNodeState = (nodes, checked) => {
  nodes.forEach((subNode) => {
    subNode.checked = checked;
    subNode.indeterminate = false;
    if (nodeHasChildren(subNode)) {
      updateSubNodeState(subNode.children, checked);
    }
  });
};

const updateSupNodeState = (parentNode, checked) => {
  const isNotEqual = parentNode.children.some(
    (item) => item.checked !== checked || item.indeterminate
  );
  if (isNotEqual) {
    parentNode.checked = false;
    parentNode.indeterminate = true;
  } else {
    parentNode.checked = checked;
    parentNode.indeterminate = false;
  }
  if (parentNode.parent) {
    updateSupNodeState(parentNode.parent, checked);
  }
};

const updateTreeNodeState = (trees, checkedKeys) => {
  trees.forEach((node) => {
    const isChecked = checkedKeys.includes(node.id);
    node.checked = isChecked;
    node.indeterminate = false;
    if (node.parent) {
      updateSupNodeState(node.parent, isChecked);
    }
    if (nodeHasChildren(node)) {
      updateTreeNodeState(node.children, checkedKeys);
    }
  });
};

const getCheckedNodes = (trees, checkedNodes = [], checkedKeys = []) => {
  trees.forEach((node) => {
    if (nodeHasChildren(node)) {
      getCheckedNodes(node.children, checkedNodes);
    }
    if (node.checked) {
      checkedKeys.push(node.id);
      checkedNodes.push(node);
    }
  });
  return { checkedKeys, checkedNodes };
};

function VirtualTree({
  treeData = [],
  checkable,
  rowClassName,
  defaultExpandAll,
  checkedKeys = [],
  onCheck,
}) {
  const listRef = useRef(null);

  const trees = useMemo(() => {
    const rawData = JSON.stringify(treeData);
    return transformTreeData(JSON.parse(rawData), defaultExpandAll);
  }, [
    // resolve referrence issue
    JSON.stringify(treeData),
    defaultExpandAll,
  ]);

  function refreshList() {
    listRef.current.recomputeRowHeights();
    listRef.current.forceUpdate();
  }

  // update node state
  useEffect(() => {
    updateTreeNodeState(trees, checkedKeys);
    refreshList();
  }, [checkedKeys]);

  function renderItem(item, deepness = 0) {
    let nodes = [];
    const { id, expanded } = item;
    const hasChildren = nodeHasChildren(item);
    const offset = deepness * (hasChildren ? 18 : 10);

    if (expanded && hasChildren) {
      nodes = item.children.map((v) => renderItem(v, deepness + 1));
    }

    nodes.unshift(
      <VirtualTree.TreeNode
        key={id}
        node={item}
        checkable={checkable}
        checkedKeys={checkedKeys}
        onExpand={refreshList}
        onCheck={() => {
          if (onCheck) {
            const { checkedKeys: cKeys, checkedNodes } = getCheckedNodes(trees);
            console.log('renderItem -> checkedNodes', checkedNodes);
            onCheck(cKeys, { checkedNodes });
            refreshList();
          }
        }}
      />
    );

    return (
      <div key={id} style={{ marginLeft: offset }}>
        {nodes}
      </div>
    );
  }

  function cellRenderer(props) {
    const { index, style } = props;
    const child = trees[index];
    return (
      <div style={style} key={child.id} className={rowClassName}>
        {renderItem(child)}
      </div>
    );
  }

  return (
    <VListWithDynamic
      ref={listRef}
      className="iron-tree"
      rowCount={trees.length}
      rowHeight={({ index }) => getExpandedItemCount(trees[index]) * ROW_HEIGHT}
      rowRenderer={cellRenderer}
    />
  );
}

const TreeNode = ({ checkable, node, children, onExpand, onCheck }) => {
  function handleExpand(event) {
    if (node.children) {
      event.stopPropagation();
      node.expanded = !node.expanded;
      onExpand();
    }
  }

  function handleCheck(e) {
    const { checked } = e.target;
    node.checked = checked;
    node.indeterminate = false;
    if (nodeHasChildren(node)) {
      updateSubNodeState(node.children, checked);
    }
    if (node.parent) {
      updateSupNodeState(node.parent, checked);
    }
    onCheck();
  }

  return (
    <div
      style={{ height: ROW_HEIGHT, lineHeight: `${ROW_HEIGHT}px` }}
      className="iron-tree-child"
    >
      <span
        onClick={handleExpand}
        aria-hidden="true"
        className="iron-tree-switch"
        style={{
          visibility: node.children ? 'visible' : 'hidden',
        }}
      >
        <Icon
          type="caret-down"
          theme="filled"
          rotate={!node.expanded ? -90 : 0}
        />
      </span>
      {checkable && (
        <Checkbox
          checked={node.checked}
          indeterminate={node.indeterminate}
          onChange={handleCheck}
        />
      )}
      <span className="iron-tree-title">
        <Title {...node} />
      </span>
      {children}
    </div>
  );
};

VirtualTree.TreeNode = TreeNode;

VirtualTree.propTypes = {
  treeData: PropTypes.array,
  checkable: PropTypes.bool,
  rowClassName: PropTypes.string,
  defaultExpandAll: PropTypes.bool,
  checkedKeys: PropTypes.array,
  onCheck: PropTypes.func,
};

VirtualTree.defaultProps = {
  checkable: false,
  defaultExpandAll: false,
};

export default VirtualTree;
