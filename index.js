const { parse } = require('./lib/phrase-parser');

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
    this.output = output;
    //console.log(JSON.stringify(this.output, null, 2));
    //console.log('\n\n\n');
  }

}

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
    this.app = app;
    this.intents = [];
    this.entityTypes = [];
    this.contexts = [];
  }

  create(...args) {
    // only handle intents for now
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
