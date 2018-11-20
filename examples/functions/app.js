const { EntityType, Intent, Leviathan } = require('leviathan');
const { dialogflow, Suggestions } = require('actions-on-google');

const app = new Leviathan(dialogflow({debug: true}));

const entityType = new EntityType({

  name: 'roomName',

  entities: [
    ['Atlantis', 'the land beneath the sea'],
    ['Lemuria', 'Kumari Kandam'],
    ['Mu']
  ]

});

const intent = new Intent({

  name: 'book-room',

  trainingPhrases: [
    'Is <roomName>Atlantis</roomName> booked right now?',
    'Is <roomName>Lemuria</roomName> open?',
  ],

  fulfillment: (conv, {roomName}) => {
    conv.ask(roomName + ' is busy right now');
  }

});

app.create(intent);
app.create(entityType);

exports.app = app;
