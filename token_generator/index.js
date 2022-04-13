const jwt = require('jsonwebtoken');

// This is secret key which is used in the backend and to change this you also need to change the secret key in backend (backend/config/default.json)
const secret = 'ZWN2cHltOHgwdWcw';

// Please replace the key with the real private key.
let key = 'c165962d8f87eb32a27e2348f049f9c858dabf72a66376562d695bcc68679d64';

let payload = {
    key: key,
};

jwt.sign(
    payload,
    secret,
    { expiresIn: 3600 },
    (err, token) => {
      if (err) throw err;
      console.log('token: ', token);
      process.exit(1);
    }
);

// please run command 'node index'.
// Then you will see the token generated in the console and you can use that token.