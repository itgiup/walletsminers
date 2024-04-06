const { utils, Wallet, randomBytes } = require('ethers');

// Tạo một private key ngẫu nhiên
const randomPrivateKey = randomBytes(64);
// const randomWallet = new Wallet(randomPrivateKey.toString());



let p = new Uint8Array(64);
p.set("0x4200000000000000000000000000000000000042")
p.set(randomBytes(24))

const customWallet = ""//  new Wallet(p);
console.log(p, p.toString("hex"));

// Bổ sung các số 0 phía trước cho private key để tạo ra địa chỉ ví như mong muốn
// const customPrivateKey = `0x4200000000000000000000000000000000000042${randomPrivateKey.slice(2)}`;

// Tạo một địa chỉ ví từ private key

// console.log("Custom Private Key:", customPrivateKey);
// console.log("Custom Wallet Address:", customWallet.address);
