const axios = require('axios');

const sigalignServerAddress = 'http://localhost:4000';

async function getSignalignServerSecureConnectionAddress() {
  const response = await axios.get(`${sigalignServerAddress}/address`);
  const { data } = response;
  const { address } = data;
  return address;
}

module.exports = {
  getSignalignServerSecureConnectionAddress,
};
