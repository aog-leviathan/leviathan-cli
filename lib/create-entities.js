// [START dialogflow_create_entity]
// Imports the Dialogflow library
const dialogflow = require('dialogflow');

// Instantiates clients
const entityTypesClient = new dialogflow.EntityTypesClient();
const intentsClient = new dialogflow.IntentsClient();

// The path to the agent the created entity type belongs to.
const agentPath = intentsClient.projectAgentPath(projectId);


// Create an entity type named "size", with possible values of small, medium
// and large and some synonyms.
const sizeRequest = {
  parent: agentPath,
  entityType: {
    displayName: 'size',
    kind: 'KIND_MAP',
    autoExpansionMode: 'AUTO_EXPANSION_MODE_UNSPECIFIED',
    entities: [
      {value: 'small', synonyms: ['small', 'petit']},
      {value: 'medium', synonyms: ['medium']},
      {value: 'large', synonyms: ['large', 'big']},
    ],
  },
};

entityTypesClient
  .createEntityType(sizeRequest)
  .then(responses => {
    console.log('Created  entity type:');
    console.log(responses[0]);
  })
  .catch(err => {
    console.error('Failed to create size entity type:', err);
  });
