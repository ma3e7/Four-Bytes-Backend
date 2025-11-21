// netlify/functions/api.js
import serverless from "serverless-http"
import app from "../../server"

// Netlify invokes paths like: /.netlify/functions/api/api/users
// basePath strips "/.netlify/functions" so Express sees "/api/users"
module.exports.handler = serverless(app, {
  basePath: '/.netlify/functions',
});