const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const logger = require('../utils/logger');
const fs = require('fs');

const PROTO_PATH = path.resolve(__dirname, '../proto/lightning.proto');
const lndConfig = require('../config/lnd').primary;

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const lnrpc = grpc.loadPackageDefinition(packageDefinition).lnrpc;

class LightningService {
  constructor() {
    this.client = this.createClient();
    logger.info('✅ Connexion LND initialisée avec Polar');
  }

  createClient() {
    const metadata = new grpc.Metadata();
    metadata.add('macaroon', lndConfig.macaroon);

    const sslCreds = grpc.credentials.createSsl(lndConfig.cert);
    const macaroonCreds = grpc.credentials.createFromMetadataGenerator((_args, callback) => {
      callback(null, metadata);
    });

    const creds = grpc.credentials.combineChannelCredentials(sslCreds, macaroonCreds);

    return new lnrpc.Lightning(lndConfig.host, creds);
  }

  async createInvoice(amount, memo = '') {
    return new Promise((resolve, reject) => {
      const request = { value: amount, memo };

      this.client.addInvoice(request, (err, response) => {
        if (err) {
          logger.error(`Erreur création invoice: ${err.message}`);
          return reject(err);
        }

        resolve({
          paymentRequest: response.payment_request,
          paymentHash: response.r_hash.toString('hex'),
          expiresAt: new Date(Date.now() + (response.expiry || 3600) * 1000).toISOString()

        });
      });
    });
  }
}

module.exports = new LightningService();
