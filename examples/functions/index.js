const functions = require('firebase-functions');
const { app } = require('./app');

console.log(functions);
console.log('---|---');

exports.leviathanExample = functions.https.onRequest(app.app);
