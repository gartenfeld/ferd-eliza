module.exports = function(ferd) {

  return function(triggers, handlers) {

    var users = {};
    var defaults = {
      salute: function(res, phrase) {
        var name = res.getMessageSender().name || 'Buddy';
        res.send(phrase + ', ' + name + '!');
      },
      hello: function(res) {
        this.salute(res, 'Hello');
      },
      chat: function(res) {
        this.salute(res, 'Whatever');
      },
      bye: function(res) {
        this.salute(res, 'Bye');
      }
    };

    handlers = handlers || {};
    handlers.greeting = handlers.greeting || defaults.hello;
    handlers.converse = handlers.converse || defaults.chat;
    handlers.farewell = handlers.farewell || defaults.bye;

    ferd.hear(function(message) {
      return !!users[message.user];
    }, /.*/, handlers.converse);

    ferd.listen(triggers.summon, function(res) {
      var userId = res.incomingMessage.user,
          username = res.getMessageSender().name;
      users[userId] = username;
      handlers.greeting(res);
    });

    ferd.listen(triggers.dismiss, function(res) {
      var userId = res.incomingMessage.user;
      users[userId] = null;
      handlers.farewell(res);
    });

  }; // curried function

};