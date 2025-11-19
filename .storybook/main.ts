module.exports = {
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  stories: ['../src/stories/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y', '@storybook/addon-controls'],
  staticDirs: ['../public'],
  docs: {
    autodocs: true,
  },
}

