// replace this with a check to the config file.
const projectId = 'lukedavis-leviathan';
// replace this with the target
const { app } = require('../app');

function createIntents(projectId, intents) {
  const dialogflow = require('dialogflow');
  const contextsClient = new dialogflow.ContextsClient();
  const intentsClient = new dialogflow.IntentsClient();
  const agentPath = intentsClient.projectAgentPath(projectId);

  console.log('intents: \n', intents);

  for (let intent of intents) {
    let request = {
      parent: agentPath,
      intent: intent,
    };

    console.log('\n\nrequest:\n', JSON.stringify(request, null, 2));

    // Create the pizza intent
    intentsClient
      .createIntent(request)
      .then(responses => {
        console.log('Created Intent:');
        console.log(responses[0]);
      })
      .catch(err => {
        console.error('ERROR:', err);
      });
  }
}

function createEntityTypes(projectId, entityTypes) {
  const dialogflow = require('dialogflow');
  const entityTypesClient = new dialogflow.EntityTypesClient();
  const intentsClient = new dialogflow.IntentsClient();

  const agentPath = intentsClient.projectAgentPath(projectId);

  for (let entityType of entityTypes) {
    // Create an entity type named "size", with possible values of small, medium
    // and large and some synonyms.
    const request = {
      parent: agentPath,
      entityType
    };

    entityTypesClient
      .createEntityType(request)
      .then(responses => {
        console.log('Created  entity type:');
        console.log(responses[0]);
      })
      .catch(err => {
        console.error('Failed to create size entity type:', err);
      });
  }
}

createIntents(projectId, app.intents.map(intent => intent.output));
createEntityTypes(projectId, app.entityTypes.map(entityType => entityType.output));
