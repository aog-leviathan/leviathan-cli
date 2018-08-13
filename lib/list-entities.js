const projectId = 'lukedavis-leviathan';


function listEntityTypes(projectId) {
  // Imports the Dialogflow library
  const dialogflow = require('dialogflow');

  // Instantiates clients
  const entityTypesClient = new dialogflow.EntityTypesClient();
  const intentsClient = new dialogflow.IntentsClient();

  // The path to the agent the entity types belong to.
  const agentPath = intentsClient.projectAgentPath(projectId);

  // The request.
  const request = {
    parent: agentPath,
  };

  // Call the client library to retrieve a list of all existing entity types.
  return entityTypesClient
    .listEntityTypes(request)
    .then(responses => {
      return responses[0];
    })
    .catch(err => {
      console.error('Failed to list entity types:', err);
    });
}

function showEntityTypes(projectId) {
  // List all entity types then delete all of them.
  return listEntityTypes(projectId).then(entityTypes => {
    return Promise.all(
      entityTypes.map(entityType => {
        return getEntityType(entityType);
      })
    );
  });
}

function getEntityType(entityType) {
  // Imports the Dialogflow library
  const dialogflow = require('dialogflow');

  // Instantiates client
  const entityTypesClient = new dialogflow.EntityTypesClient();

  // The request.
  const request = {name: entityType.name};

  // Call the client library to retrieve an entity type.
  return entityTypesClient
    .getEntityType(request)
    .then(responses => {
      console.log('Found entity type:');
      console.log(responses);
    })
    .catch(err => {
      console.error(`Failed to get entity type ${entityType.displayName}`, err);
    });
}

showEntityTypes(projectId);
