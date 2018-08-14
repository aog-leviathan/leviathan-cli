const inquirer = require('inquirer');
const pad = require('pad');
const colors = require('colors');
const jsf = require('jsonfile');

const questions = [
  {
    type: 'confirm',
    name: 'deployment',
    message: 'Use Firebase for fulfillment?',
    default: true
  },
  {
    type: 'input',
    name: 'target',
    message: 'Where is your app defined?',
    default: './app.js'
  }

];


module.exports = function() {
  console.log('Initialize Leviathan project');
  console.log('------------------');

  inquirer
    .prompt(questions)
    .then(function (answers) {
      console.log(pad(colors.grey('Firebase fulfillment: '), 30), answers.deployment);
      console.log(pad(colors.grey('Firebase fulfillment: '), 30), answers.target);
      const obj = {
        deploy: 'firebase deploy --only functions',
        target: answers.target
      };
      const options = {spaces: 2, EOL: '\r\n'};
      const fileName = './leviathan-config.json';
      jsf.writeFile(fileName, obj, options, (err) => {
        if (err) return console.log(err);
        return console.log('leviathan-config.json succefully written');
      });

    });

};
