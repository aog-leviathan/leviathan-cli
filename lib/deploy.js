const colors = require('colors');
const jsonfile = require('jsonfile');
const find = require('find');
const { spawn } = require('child_process');

module.exports = function() {
  console.log('\n\n\n');
  console.log('Attempting to deploy...');
  find.file('leviathan.config.json', process.cwd(), (files) => {
    if (!files[0]) return console.log('No leviathan.config.json file found');
    console.log('Config file ' + files[0] + ' found');
    jsonfile.readFile(files[0], (err, obj) => {
      if (err) return console.log('Error: ', err);
      if (!obj.deploy) return console.log('No deploy target designated');
      console.log('Attempting script: ' + obj.deploy);
      // run the script
      const io = spawn('firebase', ['deploy', '--only', 'functions']);

      io.stdout.on( 'data', data => {
          console.log( `stdout: ${data}` );
      } );

      io.stderr.on( 'data', data => {
          console.log( `stderr: ${data}` );
      } );

      io.on( 'close', code => {
          console.log( `child process exited with code ${code}` );
      } );
    });
  });
};
