var Session = require('./session');
var Therapist = require('./logic');
var personify = require('extend');
var message = { mrkdwn: true };
var persona = {
  as_user: false,
  username: 'Eliza',
  icon_emoji: ':woman:'
};
personify(message, persona);

var identify = function(event) {
  var sender = event.getMessageSender();
  return (sender && sender.profile && sender.profile.first_name) || 
    (sender && sender.name) || 'Anonymous';
};

module.exports = function(ferd) {

  var inject = Session(ferd);
  // returns a function that accepts: 
  // a `triggers` obj and a `handlers` obj

  var Eliza = new Therapist();
  Eliza.reset();

  var triggers = {
    summon: /ferd eliza/i,
    dismiss: /^(bye|goodbye|quit|exit)\.*$/i
  };

  var handlers = {

    greeting: function(response) {
      var client = identify(response);
      message.text = "Hi, " + client + "! I\'m Eliza.\n" + Eliza.getInitial();
      response.postMessage(message);
    },

    farewell: function(response) {
      message.text = "See you soon.";
      setTimeout(function() { response.postMessage(message); }, 500 );
      ongoing = false;
    },

    converse: function(response) {
      message.text = Eliza.transform(response.incomingMessage.text);
      response.postMessage(message);
    }
    
  };

  inject(triggers, handlers);

};
