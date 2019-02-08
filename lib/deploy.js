const colors = require('colors');
const jsonfile = require('jsonfile');
const find = require('find');
const { spawn } = require('child_process');


function createIntents(projectId, intents) {
  const dialogflow = require('dialogflow');
  const contextsClient = new dialogflow.ContextsClient();
  const intentsClient = new dialogflow.IntentsClient();
  const agentPath = intentsClient.projectAgentPath(projectId);

  // going to hide these console logs behind a "debugger" flag at some point
  console.log('intents: \n', intents);

  for (let intent of intents) {
    let request = {
      parent: agentPath,
      intent: intent,
    };

    // going to hide these console logs behind a "debugger" flag at some point
    console.log('\n\nrequest:\n', JSON.stringify(request, null, 2));

    intentsClient
      .createIntent(request)
      .then(responses => {
        console.log('Created Intent:');
        // going to hide these console logs behind a "debugger" flag at some point
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
        // going to hide these console logs behind a "debugger" flag at some point
        console.log('Created  entity type:');
        console.log(responses[0]);
      })
      .catch(err => {
        console.error('Failed to create size entity type:', err);
      });
  }
}

// this is a mess - what the heck is wrong with you Luke Davis
module.exports = function() {
  // going to hide these console logs behind a "debugger" flag at some point
  console.log('\n\n\n');
  console.log('Attempting to deploy...');
  console.log('cwd: ', process.cwd());
  find.file('leviathan.config.json', process.cwd(), (files) => {
    if (!files[0]) return console.log('No leviathan.config.json file found');
    console.log('Config file ' + files[0] + ' found');
    jsonfile.readFile(files[0], (err, config) => {
      if (err) return console.log('Error: ', err);
      const {deploy, projectId, target} = config;
      console.log('files found', deploy, projectId, target);
      if (projectId && target) {
        console.log('---');
        console.log(projectId, process.cwd(), target);
        console.log('---');
        console.log('target: ', target);
        const app = require(target);
        if (!app) console.log('there doesn\'t seem to be an app target defined');
        console.log('app: ', app);
        console.log('---');
        console.log('app.app: ', app.app);
        console.log('app.app.intents: ', app.app.intents);
        createIntents(projectId, app.app.intents.map(intent => intent.output));
        createEntityTypes(projectId, app.app.entityTypes.map(entityType => entityType.output));
        return;
      }

      if (!deploy) return console.log('No deploy command designated');
      if (!projectId) return console.log('No project Id designated');
      if (!target) return console.log('No target designated');
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
