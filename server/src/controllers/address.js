const secureConnection = require('../secureConnection');

module.exports = function addressController(req, res) {
  return res.send({
    address: secureConnection.getAddress(),
  });
};
