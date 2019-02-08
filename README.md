# EXPERIMENTAL - DO NOT USE

Okay, so going back and forth between the Dialogflow console and code editor
just to update training phrases is a pain. It’s really easy to mess up the
entity names and intent names (because the developer has to manually type these
things in) between the developer console and code, and most importantly mature
developers are going to want the data that currently lives in the Dialogflow
GUI (training phrases, entity synonyms, etc…) under version control.

Leviathan tries to address that, by giving you a way to keep all that stuff (the
training phrases and entity strings etc...) alongside your fulfillment logic
and having a single simple way to deploy all of it at the same time.

```
const { Intent } = require('leviathan');

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
```

and for that "roomName" Entity:

```
const { EntityType } = require('leviathan');

const entityType = new EntityType({

  name: 'roomName',

  entities: [
    ['Atlantis', 'the land beneath the sea'],
    ['Lemuria', 'Kumari Kandam'],
    ['Mu']
  ]

});
```

A few more details here and there, then it's as simple as

```leviathan deploy```

and the Dialogflow details are pushed to Dialogflow, and the fulfillment code is
deployed to Firebase Functions.

## Setup

Okay, first we'll need a project: I recommend going
[here](https://github.com/actions-on-google/dialogflow-webhook-boilerplate-nodejs)
(which is the Actions on Google Dialogflow boilerplatiest of the boilerplate
Actions) and clicking on the "Add to Dialgflow" button, which will create a
project and route you to the console. Keep that window open for a sec.

Next, we'll clone the git repo locally and tell firebase to use the project (you
can get a list of firebase projects with the command ```firebase list```. If you
don't have the firebase-cli installed yet, do that), and ```firebase deploy```.


Okay, so at this point you've created a new Dialogflow project, cloned all that
code down to your local machine from Github, and deployed it up to Firebase.
That last step should have printed a url in your terminal. Copy that, and go
back to the Dialogflow web console (the window I told you to leave open), go to
the Fulfillment section (button on the left nav) toggle on the webhook
fulfillment switch and paste that url in.

Phew, okay, now we're almost in business.

I'm sorry about this, but the next bit is the trickiest and I don't know how to
get around it yet.

You're going to need to set up the credentials. At
least, there's a guide
[here](https://cloud.google.com/docs/authentication/getting-started)

Once you've don ALL that, we're finally ready to begin.

I suggest taking a look at the [leviathan examples
repo](https://github.com/aog-leviathan/leviathan-examples/tree/master/simple-example/functions)
