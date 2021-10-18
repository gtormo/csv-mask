const fs = require('fs');
const crypto = require('crypto');

try {
    console.info('Generating keys...');
    const keyPair = crypto.generateKeyPairSync('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem',
            cipher: 'aes-256-cbc',
            passphrase: ''
        }
    });

    fs.writeFileSync('certificates/private_key.pem', keyPair.privateKey.toString());
    console.info('certificates/private_key.pem - OK!');
    fs.writeFileSync('certificates/public_key.pem', keyPair.publicKey.toString());
    console.info('certificates/public_key.pem - OK!');
} catch (error) {
    throw new Error(error);
}