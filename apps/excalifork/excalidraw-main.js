/** tree shaking seemed to be broken in the production build,
 * so we're using a custom entrypoint
 */
if (process.env.NODE_ENV === "production") {
  module.exports = require("./dist/excalidraw.production.min.js");
} else {
  module.exports = require("./dist/excalidraw.development.js");
}
