const signIn_en = new Intent({

  name: 'sign-in',

  language: 'en',

  trainingPhrases: [
    'Sign in',
    'Log in',
    'Sign in to my account',
  ],

  fulfillment: (conv) => {
    conv.ask(new SignIn());
  },

});

const signIn_es = new Intent({

  name: 'sign-in',

  language: 'es',

  trainingPhrases: [
    'Entrada',
    'Entrado',
    'Entrada accounto mi',
  ],

  fulfillment: (conv) => {
    conv.ask(new SignIn());
  },

});

exports = {
  signIn_en,
  signIn_es,
};
