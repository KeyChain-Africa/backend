const http = require('node:http');

const hostname = '127.0.0.1';
const port = 3000;

const express = require('express');
const app = express();
const authRoutes = require('./routes/authRoutes'); // chemin vers tes routes
const vaultRoutes = require('./routes/vaultRoutes');
app.use(express.json());

// Point d’entrée vers toutes les routes de coffre (vault)
app.use('/auth', authRoutes);
app.use('/vault', vaultRoutes);
/*
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello, World!\n');
});
*/
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});