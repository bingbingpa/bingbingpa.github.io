module.exports = ctx => ({
  plugins: {
    "postcss-easy-media-query": {
      breakpoints: {
        tablet: 600,
        desktop: 1024
      }
    },
    "postcss-text-remove-gap": {
      defaultFontFamily: "Open Sans",
      defaultLineHeight: "0"
    },
    "postcss-nested": {},
    "postcss-cssnext": {}
  }
});
