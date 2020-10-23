const ngrok = require('ngrok');

class SecureConnection {
  setServerPort(serverPort) {
    this.serverPort = serverPort;
  }

  async setup() {
    this.url = await ngrok.connect({
      proto: 'http',
      addr: this.serverPort,
    });
    console.log(this.url);
  }

  getAddress() {
    return this.url;
  }
}

module.exports = new SecureConnection();
