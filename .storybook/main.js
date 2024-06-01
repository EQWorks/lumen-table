module.exports = {
  "stories": ["../**/*.mdx", "../**/*.stories.@(js|jsx)"],

  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-webpack5-compiler-babel"
  ],

  framework: '@storybook/react-webpack5',
}
