# Leviathan

## Problem
Going back and forth between the Dialogflow console and code editor just to update training phrases is a pain. It’s really easy to mess up the entity names and intent names (because the developer has to manually type these things in) between the developer console and code, and most importantly mature developers are going to want the data that currently lives in the Dialogflow GUI (training phrases, entity synonyms, etc…) under version control.

## Solution
Write a client library that handles both.

## Implementation
```
import { Intent, Leviathan } from ‘leviathan’
import { dialogflow, Suggestions } from ‘actions-on-google’
import { functions } from 'firebase-functions'

const app = new Leviathan(dialogflow({debug: true});

const intent = new Intent({

  name: ‘podcasts’,

  trainingPhrases: [
    ‘Does Luke listen to any podcasts?’,
    ‘Podcasts’,
    ‘What does Luke listen to?’
  ],

  fulfillment: (conv, params) => {
    conv.ask(
      ‘Luke listens to After On, Econ Talk, Software Engineering Daily, and a few others.’,
      new Suggestions([‘After On’, ‘Econ Talk’, ‘Software Engineering Daily’])
    );
  }

});

app.use(intent);

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
```

Perhaps the modal case after writing webhook fulfillment code is to run something like

```
firebase deploy --only functions
```

We’ll instead replace that with a config file and 

```
leviathan deploy
```

Which will deploy both the firebase function and send the new Intents and Entities to the Dialogflow through the Dialogflow API, thus obviating the need to bounce back and forth between the code editor and the Dialogflow console.

A followup intent implementation might look like this:

```
import { Intent, Leviathan } from ‘leviathan’
import { dialogflow, Suggestions } from ‘actions-on-google’
import { functions } from 'firebase-functions'

const app = new Leviathan(dialogflow({debug: true});

const afterOn = new Intent({

  name: ‘podcasts - after-on’,

  trainingPhrases: [
    ‘After On’,
    ‘Tell me about After On’,
    ‘The After On Podcast’,
    ‘The Rob Reid Podcast’
  ],

  fulfillment: (conv, params) => {
    conv.close(‘After On is a podcast hosted by author Rob Reid about future technology.’);
  }

});

const podcasts = new Intent({

  name: ‘podcasts’,

  trainingPhrases: [
    ‘Does Luke listen to any podcasts?’,
    ‘Podcasts’,
    ‘What does Luke listen to?’
  ],

  fulfillment: (conv, params) => {
    conv.ask(
      ‘Luke listens to After On, Econ Talk, Software Engineering Daily, and a few others.’,
      new Suggestions([‘After On’, ‘Econ Talk’, ‘Software Engineering Daily’])
    );
  },

  followupIntents: [ afterOn ]

});

app.use(podcasts);

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
```


An example of how to define and use Entities

```
import { Intent, Entity, Leviathan } from ‘leviathan’
import { dialogflow, Suggestions } from ‘actions-on-google’
import { functions } from 'firebase-functions'

const app = new Leviathan(dialogflow({debug: true});

const roomName = new Entity({

  name: ‘roomName’,

  values: [‘Atlantis’, ‘Lemuria’, ‘Mu’]

});

const checkRoom = new Intent({

  name: ‘check room’,

  trainingPhrases: [
    ‘Is <roomName>Atlantis</roomName> booked right now?’,
    ‘Is <roomName>Lemuria</roomName> open?’
  ],

  entities : [
    {name: ‘roomName’, required: true, prompts: [‘Which room do you want to know about?’]}
  ],

  fulfillment: (conv, {roomName}) => {
    conv.ask(`Room ${roomName} is busy right now.`);
  }

});

app.use(roomName, checkRoom);

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
```

## Challenges
This approach works extremely well when deploying to Firebase Functions, but to deploy to another platform (an Express app running on Heroku, for example) we’d need to rely on a config file.

