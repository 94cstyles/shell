module.exports = {
  env: {
    es6: true,
    browser: true,
    node: true
  },
  extends: ['standard', 'standard-react'],
  parser: 'babel-eslint',
  rules: {
    'react/jsx-tag-spacing': 0,
    'react/jsx-boolean-value': 0,
  }
}