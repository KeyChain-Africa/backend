const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
    prisma,
    User: require('./User'),
    VaultKey: require('./VaultKey'),
    Share: require('./Share'),
    BlockchainLog: require('./BlockchainLog')
};