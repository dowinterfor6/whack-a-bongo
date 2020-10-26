module.exports = {
  presets: [
    ['@babel/preset-env', {
      debug: true,
      modules: false,
      targets: "> 0.25%, not dead",
      useBuiltIns: 'usage', // check other options
      corejs: 3 // needed for error
    }]
  ],
}