const Mustache = require('mustache');

exports.renderTemplate = (subject, body, metadata) => {
  return {
    subject: Mustache.render(subject, metadata),
    body: Mustache.render(body, metadata)
  };
};