module.exports = function() {
  const message = `
      Leviathan is both a command-line tool and a framework for developing
      Actions-on-Google Agents. Use the command "leviathan init" to setup
      the necessary config file (leviathan.config.json) and
      "leviathan deploy" to simultaneously deploy your webhook fulfillment
      and Dialogflow Intents and Entities.
      `;
  console.log(message);
  console.log('------------------');
};
