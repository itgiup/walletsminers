const { ethers, JsonRpcProvider } = require("ethers");
const axios = require("axios");
const fs = require("fs");
const settings = require("./settings.json");

const { log, error } = console;


function saveWallet(chain, private_key, address, balance) {
    const data = `${chain}\n${private_key}\n${address}\n${balance}`;
    fs.appendFileSync(`wallets/${chain}_${private_key}.txt`, data);
}

function alertTele(chain, private_key, address, balance) {
    const message = encodeURIComponent(
        `<code>test:\n - ${chain}
- Private Key: ${private_key}
- Địa chỉ ví: ${address}
- Số dư: ${balance}</code>`);
    const url = `https://api.telegram.org/bot${settings.tele.token}/sendMessage?chat_id=-${settings.tele.chatId}&text=${message}&parse_mode=html`;

    axios.post(url);
}

let loop = 0;

setInterval(() => {
    console.clear()
    log(loop)
}, 2000);

async function scan(Chains) {
    const privateKey = [...Array(64)].map(() => (~~(Math.random() * 16)).toString(16)).join('');

    const wallet = new ethers.Wallet(privateKey);
    const address = await wallet.getAddress();
    loop++;

    Promise.all(Object.entries(Chains).map(([coin, chain]) => {
        if (Chains.hasOwnProperty(coin)) {
            return Chains[coin].rpc.getBalance(address).then(balance => {
                // log(coin, address, balance);
                if (balance > Chains[coin].min) {
                    log(`${coin}\nPrivate Key: ${privateKey}\nĐịa chỉ ví: ${address}\nSố dư: ${balance}`);
                    saveWallet(coin, privateKey, address, balance);
                    alertTele(coin, privateKey, address, balance);
                }
            }).catch(err => {
                error(coin, err.shortMessage);
            })
        }
    })).then(() => {
        scan(Chains)
    })
}

// Thay đổi số lượng luồng
const maxThread = settings.maxThread;
for (let i = 0; i < maxThread; i++) {

    const Chains = {
        "ETH": {
            "rpc": new JsonRpcProvider("https://eth.merkle.io"),
            "min": 50600000000000000n
        },
        "BNB": {
            "rpc": new JsonRpcProvider("https://bsc-dataseed4.binance.org/"),
            "min": 0n
        },
        // Add other chains here

        "ARB":{
            "rpc": new JsonRpcProvider("https://arb1.arbitrum.io/rpc"),
            "min": 0
        },
        "AVAX": {
            "rpc": new JsonRpcProvider("https://avalanche.drpc.org"),
            "min": 0
        },
        "MATIC":{ 
            "rpc": new JsonRpcProvider("https://polygon-rpc.com/"),
            "min": 0
        },
        "OP": {
            "rpc": new JsonRpcProvider("https://mainnet.optimism.io"),
            "min": 0
        },
        "MANTA": {
            "rpc": new JsonRpcProvider("https://pacific-rpc.manta.network/http"),
            "min": 0
        },
        "BASE": {
            "rpc": new JsonRpcProvider("https://mainnet.base.org"),
            "min": 0
        },
        "PLS": {
            "rpc": new JsonRpcProvider("https://rpc.pulsechain.com"),
            "min": 0
        },
        // "CRO": {
        //     "rpc": new JsonRpcProvider("https://rpc.cronos.org/"),
        //     "min": 0
        // },
        "KAVA": {
            "rpc": new JsonRpcProvider("https://evm.kava-rpc.com"),
            "min": 0
        },
        "XDAI": {
            "rpc": new JsonRpcProvider("https://rpc.gnosis.gateway.fm"),
            "min": 0
        },
        "CELO": {
            "rpc": new JsonRpcProvider("https://forno.celo.org"),
            "min": 0
        },
        "FTM": {
            "rpc": new JsonRpcProvider("https://rpcapi.fantom.network"),
            "min": 0
        },
        "GLMR": {
            "rpc": new JsonRpcProvider("https://rpc.api.moonbeam.network"),
            "min": 0
        },

        // : { 
        //     "rpc": new JsonRpcProvider(""),
        //     "min": 0
        // },
    };
    scan(Chains);
}


log(`Đang quét ${maxThread} luồng...`);
