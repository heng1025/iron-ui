A React UI Library

## dev

```
yarn storybook
```

## local test

- [error solution](https://reactjs.org/warnings/invalid-hook-call-warning.html)
- [error detail](https://github.com/facebook/react/issues/13991)
- `npm link /path/to/testApp/node_modules/react` (it will conflict with storybook)

## antd icon import on demand

[antd-icon](https://www.zhihu.com/question/308898834)

## Use

- Getting Started

```javascript
import { VirtualSelect, VirtualAutoComplete, VirtualTree } from 'iron-ui';
// load all style
import 'iron-ui/dist/iron-ui.min.css';
```

- Import on Demand

```javascript
[
  'import',
  {
    libraryName: 'iron-ui',
    customName: (name) => {
      if (/virtual-(.*)/.test(name)) {
        const validName = name.replace(/virtual-(.*)/, '$1');
        return `iron-ui/es/${validName.toLowerCase()}`;
      }
      return `iron-ui/es/${name}`;
    },
  },
];
```
