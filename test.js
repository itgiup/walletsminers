const { Web3 } = require('web3');

// Kết nối tới một Ethereum node
const web3 = new Web3('https://eth.merkle.io');
console.log(web3.eth.net);

// // Lấy danh sách các peer node từ một nút Ethereum
// async function getActiveNodes() {
//     try {
//         const peerCount = await web3.eth.net.getPeerCount();
//         const peers = await web3.eth.net.getPeers();

//         console.log(`Số lượng node đang kết nối: ${peerCount}`);
//         console.log('Danh sách các node:');
//         peers.forEach(peer => console.log(peer));
//     } catch (error) {
//         console.error('Lỗi khi lấy danh sách các node:', error);
//     }
// }

// getActiveNodes();
