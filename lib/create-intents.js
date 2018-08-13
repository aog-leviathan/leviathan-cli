const projectId = 'lukedavis-leviathan';
const { app } = require('../app');

function createIntents(projectId) {
  // [START dialogflow_create_intent]
  // Imports the Dialogflow library
  const dialogflow = require('dialogflow');

  // Instantiates clients
  const contextsClient = new dialogflow.ContextsClient();
  const intentsClient = new dialogflow.IntentsClient();

  // The path to identify the agent that owns the created intent.
  const agentPath = intentsClient.projectAgentPath(projectId);

  // Setup intents for ordering a pizza.

  // First of all, let's create an intent that triggers pizza order flow.

  // Output contexts for ordering pizza. They are used for matching follow-up
  // intents. For pizza ordering intents, a "pizza" output context is used for
  // hinting the conversation is about pizza ordering, not beer or something
  // else. For the first intent, it returns responses asking users to provide
  // size information, with a "size" output context for matching the intent
  // asking for the size of the pizza.

  // Note that session ID is unknown here, using asterisk.
  const pizzaOutputContexts = [
    {
      name: contextsClient.contextPath(
        projectId,
        '*' /* sessionId */,
        'pizza_order'
      ),
      lifespanCount: 5,
    },
  ];

  // The result of the matched intent.
  const pizzaResult = {
    action: 'pizza',
    parameters: [
      {
        displayName: 'size',
        value: '$size',
        entityTypeDisplayName: '@size',
        mandatory: true,
        prompts: [
          'What size pizza would you like to order?',
          'Would you like a large, medium, or small pizza?',
        ],
      },
      {
        displayName: 'topping',
        value: '$topping',
        entityTypeDisplayName: '@topping',
        mandatory: true,
        prompts: ['What toppings would you like?'],
        isList: true,
      },
      {
        displayName: 'address',
        value: '$address',
        // The API provides a built-in entity type @sys.address for addresses.
        entityTypeDisplayName: '@sys.location',
        mandatory: true,
        prompts: ['What is the delivery address?'],
      },
    ],
    messages: [
      {
        text: {
          text: [
            'No problem. Getting a $size pizza with $topping and delivering ' +
              'to $address.',
          ],
        },
      },
      {
        text: {
          text: [
            'Reply "check" to place your order. Reply "cancel" to cancel ' +
              'your order. You can change your delivery address as well.',
          ],
        },
      },
      {
        quickReplies: {
          title:
            'No problem. Getting a $size pizza with $topping and ' +
            'delivering to $address.',
          quickReplies: ['Place order', 'Cancel'],
        },
        platform: 'PLATFORM_FACEBOOK',
      },
    ],
    outputContexts: pizzaOutputContexts,
  };

  // The phrases for training the linguistic model.
  const pizzaPhrases = [
    {type: 'EXAMPLE', parts: [{text: 'Order pizza'}]},
    {type: 'EXAMPLE', parts: [{text: 'Pizza'}]},
    {
      type: 'EXAMPLE',
      parts: [
        {text: 'Get me a '},
        {text: 'large', entityType: '@size', alias: 'size'},
        {text: ' '},
        {text: 'mushrooms', entityType: '@topping', alias: 'topping'},
        {text: ' for '},
        {
          text: '1 1st st, New York, NY',
          entityType: '@sys.location',
          alias: 'address',
        },
      ],
    },
    {
      type: 'EXAMPLE',
      parts: [
        {text: "I'd like to order a "},
        {text: 'large', entityType: '@size', alias: 'size'},
        {text: ' pizza with '},
        {text: 'mushrooms', entityType: '@topping', alias: 'topping'},
      ],
    },
    {
      type: 'TEMPLATE',
      parts: [{text: "I'd like a @size:size pizza"}],
    },
  ];

  // The intent to be created.
  const pizzaIntent = {
    displayName: 'Pizza',
    events: ['order_pizza'],
    // Webhook is disabled because we are not ready to call the webhook yet.
    webhookState: 'WEBHOOK_STATE_ENABLED',
    trainingPhrases: pizzaPhrases,
    mlEnabled: false,
    priority: 500000,
    //result: pizzaResult,
  };

  const pizzaRequest = {
    parent: agentPath,
    intent: pizzaIntent,
  };

  // Create the pizza intent
  intentsClient
    .createIntent(pizzaRequest)
    .then(responses => {
      console.log('Created Pizza intent:');
      console.log(responses[0]);
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
}

createIntents(projectId);
