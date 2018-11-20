const colors = require('colors');
const jsonfile = require('jsonfile');
const find = require('find');
const { spawn } = require('child_process');


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




module.exports = function() {
  console.log('\n\n\n');
  console.log('Attempting to deploy...');
  find.file('leviathan.config.json', process.cwd(), (files) => {
    if (!files[0]) return console.log('No leviathan.config.json file found');
    console.log('Config file ' + files[0] + ' found');
    jsonfile.readFile(files[0], (err, config) => {
      if (err) return console.log('Error: ', err);
      const {deploy, projectId, target} = config;
      if (projectId && target) {
        console.log('---');
        console.log(projectId, process.cwd(), target);
        console.log('---');
        return;
        createIntents(projectId, app.intents.map(intent => intent.output));
        createEntityTypes(projectId, app.entityTypes.map(entityType => entityType.output));
      }

      if (!deploy) return console.log('No deploy target designated');
      console.log('Attempting script: ' + deploy);
      // run the script
      const io = spawn(deploy, {shell: true});

      io.stdout.on( 'data', data => {
          console.log( colors.green(data.toString()) );
      } );

      io.stderr.on( 'data', data => {
          console.log( colors.red(data.toString()) );
      } );

      io.on( 'close', code => {
          console.log('Deployment complete');
      } );
    });
  });
};
