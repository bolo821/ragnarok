const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const http = require('http');
const fs = require('fs');

const https = require('https');
var https_options = {
  key: fs.readFileSync(path.join(__dirname, "sarahserver.xyz.key")),
  cert: fs.readFileSync(path.join(__dirname, "sarahserver_xyz.crt")),
  ca: [
        fs.readFileSync(path.join(__dirname, "sarahserver.xyz.csr")),
        fs.readFileSync(path.join(__dirname, "sarahserver_xyzss.crt")),
      ]
};

const cors = require('cors');
dotenv.config();
const app = express();

// Init Middleware
app.use(express.json());
app.use(cors());

// Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/balance', require('./routes/api/balance'));
app.use('/api/fund', require('./routes/api/fund'));
app.use('/api/logs', require('./routes/api/logs'));
app.use('/api/news', require('./routes/api/news'));
app.use('/api/character', require('./routes/api/character'));
app.use('/api/minter', require('./routes/api/minter'));
app.use('/api/mode', require('./routes/api/mode'));

app.use(express.static(path.join(__dirname, '/public')));
const PORT = process.env.PORT;

if (process.env.NODE_ENV === 'production') {
  const httpsServer = https.createServer(https_options, app);
	options = {
		cors: true,
		origins: "*",
	}
	require('./socketServer')(httpsServer, options);

	httpsServer.listen(PORT, () => {
		console.log(`HTTPS Server running on port ${PORT}`);
	});
} else {
  const server = http.createServer(app);
  options = {
    cors: true,
    origins: "*",
  }
  require('./socketServer')(server, options);
  
  server.listen(PORT, () => {
    console.log(`HTTP Server is running on port ${PORT}`);
  });
}