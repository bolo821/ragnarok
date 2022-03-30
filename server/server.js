const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const http = require('http');

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

const server = http.createServer(app);
options = {
  cors: true,
  origins: "*",
}
require('./socketServer')(server, options);

server.listen(PORT, () => {
  console.log(`Server is listening at port ${PORT}`);
})
