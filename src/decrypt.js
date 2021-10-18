const fs = require('fs');
const crypto = require('crypto');

try {
    const privateKey = fs.readFileSync('certificates/private_key.pem', 'utf8');
    const buffer = Buffer.from(process.argv[2], 'base64');

    const decryptedText = crypto.privateDecrypt({
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
        passphrase: ''
    }, buffer);

    console.info(`Decrypted text: ${decryptedText.toString()}`);
} catch (error) {
    throw new Error(error);
}