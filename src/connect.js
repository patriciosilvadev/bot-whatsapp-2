const fs = require('fs');
const venom = require('venom-bot');
const {Viewers} = require('./model')

function connect(session){
const connect = venom
.create(
    session,
    (base64Qr, asciiQR) => {
        var matches = base64Qr.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
        response = {};

      if (matches.length !== 3) {
        return new Error('Invalid input string');
      }
      response.type = matches[1];
      response.data = new Buffer.from(matches[2], 'base64');

      var imageBuffer = response;
        fs.writeFile(
        `./public/images/${session}.png`,
        imageBuffer['data'],
        'binary',
        function (err) {
          if (err != null) {
            console.log(err);
          }
        }
      );
    },
    (statusSession) => {
      var status = {
        status: statusSession,
        userId: session
      }
      Viewers.InsertStatus(status)
        console.log('Status Session: ', statusSession); //return isLogged || notLogged || browserClose || qrReadSuccess || qrReadFail || autocloseCalled
    },
    {
        folderNameToken: 'tokens', //folder name when saving tokens
        mkdirFolderToken: '', //folder directory tokens, just inside the venom folder, example:  { mkdirFolderToken: '/node_modules', } //will save the tokens folder in the node_modules directory
        headless: true, // Headless chrome
        devtools: false, // Open devtools by default
        useChrome: true, // If false will use Chromium instance
        debug: false, // Opens a debug session
        logQR: false, // Logs QR automatically in terminal
        browserWS: '', // If u want to use browserWSEndpoint
        browserArgs: [''], // Parameters to be added into the chrome browser instance
        disableSpins: true, // Will disable Spinnies animation, useful for containers (docker) for a better log
        disableWelcome: true, // Will disable the welcoming message which appears in the beginning
        updatesLog: false, // Logs info updates automatically in terminal
        //autoClose: 60000, // Automatically closes the venom-bot only when scanning the QR code (default 60 seconds, if you want to turn it off, assign 0 or false)
    }
  )
  return connect
}
module.exports = {
    connect
}