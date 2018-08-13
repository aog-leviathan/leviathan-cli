const { functions } = require('firebase-functions');
const { app } require('./app');

exports.leviathanExample = functions.https.onRequest(app);
