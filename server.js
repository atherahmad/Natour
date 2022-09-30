/* eslint-disable import/extensions */
import app from './app.js';

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// USE "npm run start:dev or npm run start:prod" in terminal to run the server. We changed the script in package.json from test to start with value "nodemon server.js"

// 1. install following dependencies in next project like:
// npm i eslint prettier eslint-config-prettier eslint-plugin-prettier eslint-config-airbnb eslint-plugin-node eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react --save-dev
// 2. create .eslintrc.json and copy inside:
// {
//   "extends": ["airbnb", "prettier", "plugin:node/recommended"],
//   "plugins": ["prettier"],
//   "rules": {
//     "prettier/prettier": "error",
//     "spaced-comment": "off",
//     "no-console": "off",
//     "consistent-return": "off",
//     "func-names": "off",
//     "object-shorthand": "off",
//     "no-process-exit": "off",
//     "no-param-reassign": "off",
//     "no-return-await": "off",
//     "no-underscore-dangle": "off",
//     "class-methods-use-this": "off",
//     "prefer-destructuring": ["error", { "object": true, "array": false }],
//     "no-unused-vars": ["error", { "argsIgnorePattern": "req|res|next|val" }]
//   }
// }
// 3. create .prettierrc and copy following inside:
// {
//   "singleQuote": true
// }
