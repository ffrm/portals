const secureConnection = require('../secureConnection');

module.exports = {
  broadcaster: function(req, res) {
    console.log(secureConnection.getAddress() + '/broadcast');
    return res.redirect(secureConnection.getAddress() + '/broadcast');
  },
  watcher: function(req, res) {
    return res.redirect(secureConnection.getAddress() + '/watcher');
  }
};
