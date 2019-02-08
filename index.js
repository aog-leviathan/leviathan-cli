const { parse } = require('./lib/phrase-parser');

// probably yank this out into it's own file
class Intent {
  constructor(opts) {
    this.output = {};
    Object.assign(this, opts);
    if (this.trainingPhrases) this.transformTrainingPhrases();
  }

  transformTrainingPhrases() {
    let output = {};
    output.trainingPhrases = [];
    for (let phrase of this.trainingPhrases) {
      output.trainingPhrases.push(parse(phrase));
    }
    output.displayName = this.name;
    output.webhookState = 'WEBHOOK_STATE_';
    output.webhookState += this.fulfillment ? 'ENABLED' : 'DISABLED';
    output.mlEnabled = false;
    output.priority = 500000;
    // this is the thing to fix the List bug
    // the "result" - weirdly - is where parameters are defined
    // output.result
    this.output = output;
  }

}

// probably yank this out into it's own file
class EntityType {
  constructor(opts) {
    Object.assign(this, opts);
    this.output = {
      displayName: opts.name,
      entities: opts.entities.map(entity => {
        return {value: entity[0], synonyms: entity};
      }),
      kind: 'KIND_MAP',
      autoExpansionMode: 'AUTO_EXPANSION_MODE_UNSPECIFIED'
    };
  }
}

class Leviathan {

  constructor(app) {
    // this is so dumb, I have something that people will
    // inevitibly call "app" with a property called "app"
    // Fix this Luke Davis
    this.app = app;
    this.intents = [];
    this.entityTypes = [];
    this.contexts = [];
  }

  create(...args) {
    // at the moment we're only registering intents and entities
    // in the future, rather than registering entities directly
    // we'll probably just walk the tree registering Intents, Entities,
    // and Contexts as we go
    for (let arg of args) {
      if (arg instanceof Intent) {
        this.app.intent(arg.name, arg.fulfillment);
        if (this.intents.indexOf(arg) === -1) this.intents.push(arg);
      } else if (arg instanceof EntityType) {
        if (this.entityTypes.indexOf(arg) === -1) this.entityTypes.push(arg);
      }
    }
  }

}

exports.EntityType  = EntityType;
exports.Intent = Intent;
exports.Leviathan = Leviathan;
