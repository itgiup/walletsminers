import threading
import random
import requests
from web3 import Web3, HTTPProvider
import json

settings = json.load(open("settings.json"))

def saveWallet(chain, private_key, address, balance):
    f = open(f"wallets/{chain}_{private_key}.txt", "a")
    f.write(f"{chain} \n {private_key}\n {address}\n {balance}")
    f.close()


def alertTele(chain, private_key, address, balance):
    message = f"{chain} \n Private Key: {private_key} \n Địa chỉ ví: {address} \n Số dư: {balance}"
    url = f"https://api.telegram.org/bot{settings["tele"]["token"]}/sendMessage?chat_id=-{settings["tele"]["chatId"]}&text={message}&parse_mode=html";

    requests.post(url)


# Tạo chuỗi 64 ký tự ngẫu nhiên

web3 = Web3()

def scan():
    Chains = {
        "ETH":{
            "rpc": Web3(HTTPProvider("https://eth.llamarpc.com")),
            "min": 50600000000000000
        },
        "BNB":{ 
            "rpc":  Web3(HTTPProvider("https://binance.llamarpc.com")), 
            "min": 0
        },
        # "ARB":{
        #     "rpc": Web3(HTTPProvider("https://arbitrum.drpc.org")),
        #     "min": 0
        # },
        "AVAX": {
            "rpc": Web3(HTTPProvider("https://avalanche.drpc.org")),
            "min": 0
        },
        # "MATIC":{ 
        #     "rpc": Web3(HTTPProvider("https://polygon.drpc.org")),
        #     "min": 0
        # },
        "OP": { 
            "rpc": Web3(HTTPProvider("https://optimism.llamarpc.com")),
            "min": 0
        },
        "MANTA": { 
            "rpc": Web3(HTTPProvider("https://pacific-rpc.manta.network/http")),
            "min": 0
        },
        "BASE": { 
            "rpc": Web3(HTTPProvider("https://mainnet.base.org")),
            "min": 0
        },
        "PLS": { 
            "rpc": Web3(HTTPProvider("https://rpc.pulsechain.com")),
            "min": 0
        },
        "CRO": { 
            "rpc": Web3(HTTPProvider("https://cronos-evm-rpc.publicnode.com")),
            "min": 0
        },
        "KAVA": { 
            "rpc": Web3(HTTPProvider("https://kava-pokt.nodies.app")),
            "min": 0
        },
        "XDAI": { 
            "rpc": Web3(HTTPProvider("https://gnosis.drpc.org")),
            "min": 0
        },
        "CELO": { 
            "rpc": Web3(HTTPProvider("https://1rpc.io/celo")),
            "min": 0
        },
        "FTM": { 
            "rpc": Web3(HTTPProvider("https://endpoints.omniatech.io/v1/fantom/mainnet/public")),
            "min": 0
        },
        "GLMR": { 
            "rpc": Web3(HTTPProvider("https://endpoints.omniatech.io/v1/moonbeam/mainnet/public")),
            "min": 0
        },
        
        # : { 
        #     "rpc": Web3(HTTPProvider("")),
        #     "min": 0
        # },
    }

    loop = 0
    while 1:
        private_key = ''.join(random.choice('0123456789abcdef') for _ in range(64))

        # Tạo Web3 instance

        # Chuyển đổi private key thành địa chỉ ví
        address = web3.eth.account.from_key(private_key).address
        loop+=1
        # print(private_key, address)

        for coin, w3 in Chains.items():
            try:
                # print(coin)
                # Kiểm tra số dư coin
                balance = w3["rpc"].eth.get_balance(address)
                print(coin, address, balance)
                if balance > w3["min"]:
                    # In ra kết quả
                    print(f"{coin} \n Private Key: {private_key} \n Địa chỉ ví: {address} \n Số dư: {balance}")
                    saveWallet(coin, private_key, address, balance)
                    alertTele(coin, private_key, address, balance)
            except NameError:
                print("")

# thay đổi số lượng luồng
maxThread = settings["maxThread"]
for x in range(maxThread):
    t = threading.Thread(target=scan, name='t' + str(x))
    t.start()
    
print(f"Đang quét {maxThread} luồng...")
