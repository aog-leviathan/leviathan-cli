const whoAreYou = new Intent({

  name: 'who-are-you',

  trainingPhrases: [
    'Who are you?',
    'What is your name?',
    'Tell me about yourself',
  ],

  fulfillment: [
    'My name is Mortimer.',
    'I\'m Mortimer',
    'The name\'s Mortimer',
    'I\'m Mortimer, your Launch Day assistant.',
  ],

  /*
  // Alternatively, you can respond with just one string
  fulfillment: 'Mortimer. Don\'t call me Mort',
  */

});

exports = {
  whoAreYou,
};
