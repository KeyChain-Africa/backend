const fs = require('fs');
const path = require('path');
require('dotenv').config();

const lndCert = fs.readFileSync(process.env.LND_TLS_CERT_PATH);
const macaroonHex = fs.readFileSync(process.env.LND_MACAROON_PATH).toString('hex');

module.exports = {
  primary: {
    host: process.env.LND_PRIMARY_HOST,
    cert: lndCert,
    macaroon: macaroonHex
  }
};
