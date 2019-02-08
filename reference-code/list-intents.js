const projectId = 'lukedavis-leviathan';

function listIntents(projectId) {
  // Imports the Dialogflow library
  const dialogflow = require('dialogflow');

  // Instantiates clients
  const intentsClient = new dialogflow.IntentsClient();

  // The path to identify the agent that owns the intents.
  const projectAgentPath = intentsClient.projectAgentPath(projectId);

  const request = {
    parent: projectAgentPath,
  };

  // Send the request for listing intents.
  return intentsClient
    .listIntents(request)
    .then(responses => {
      return responses[0];
    })
    .catch(err => {
      console.error('Failed to list intents:', err);
    });
}

function showIntents(projectId) {
  return listIntents(projectId).then(intents => {
    return Promise.all(
      intents.map(intent => {
        return getIntent(intent);
      })
    );
  });
}

function getIntent(intent) {
  // Imports the Dialogflow library
  const dialogflow = require('dialogflow');

  // Instantiates clients
  const intentsClient = new dialogflow.IntentsClient();

  const request = {
    // By default training phrases are not returned. If you want training
    // phrases included in the returned intent, uncomment the line below.
    //
    // intentView: 'INTENT_VIEW_FULL',
    name: intent.name,
  };

  // Send the request for retrieving the intent.
  return intentsClient
    .getIntent(request)
    .then(responses => {
      console.log('Found intent:');
      console.log(responses[0]);
    })
    .catch(err => {
      console.error(`Failed to get intent ${intent.displayName}`, err);
    });
}

showIntents(projectId);
