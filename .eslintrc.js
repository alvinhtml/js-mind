module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "parser": '@typescript-eslint/parser', //定义ESLint的解析器
    "extends": [
        "eslint:recommended",  //规则默认都是关闭的，使用 eslint:recommended 启用推荐规则。参见 http://eslint.cn/docs/rules/
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaFeatures": { // 指定 ESLint 可以解析JSX语法
            "jsx": true
        },
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "plugins": [
        "react",
        "flowtype",
        "@typescript-eslint"
    ],
    "settings": {
        "react": { // 自动发现React的版本，从而进行规范react代码
            "version": "detect" //React版本
        }
    },
    "rules": {
      "flowtype/define-flow-type": 1,
      "flowtype/use-flow-type": 1
    }
};
