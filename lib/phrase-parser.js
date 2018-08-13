// let phrase = 'tell me about <bug>spiders</bug> things and <bug>beetle</bug> stuff.';
// console.log(JSON.stringify(parse(phrase), null, 2));

function parse(str) {
  // do this better later
  const sequence = str.split(' ');
  const parts = [];
  let part = {text: []};
  for (let token of sequence) {
    if (token.startsWith('<')) {
      part.text = ' ' + part.text.join(' ') + ' ';
      parts.push(part);
      part = {text: []};
      // replace this with a sane regex and stuff
      let entity = token.match(/([A-z]*)(?=>)/g)[0];
      let text = token.match(/>([A-z]*)</g)[0].slice(1, -1)
      parts.push({text: text, entityType: '@' + entity, alias: entity});
      continue;
    }
    part.text.push(token);
  }
  part.text = ' ' + part.text.join(' ') + ' ';
  parts.push(part);
  return {type: 'EXAMPLE', parts};
}

module.exports = {parse};
