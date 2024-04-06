const bitcoin = require('bitcoinjs-lib');

const { log, error } = console;

log(bitcoin.ECPair)

// // Tạo một private key ngẫu nhiên
// const keyPair = bitcoin.ECPair.makeRandom();

// // Lấy địa chỉ ví từ private key
// const address = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey }).address;

// console.log('Private Key (hex):', keyPair.privateKey.toString('hex'));
// console.log('Địa chỉ ví Bitcoin:', address);
