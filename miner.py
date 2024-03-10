import threading
import os
import random
from web3 import Web3, HTTPProvider

# Tạo chuỗi 64 ký tự ngẫu nhiên

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
        "ARB":{
            "rpc": Web3(HTTPProvider("https://arbitrum.drpc.org")),
            "min": 0
        },
        "AVAX": {
            "rpc": Web3(HTTPProvider("https://avalanche.drpc.org")),
            "min": 0
        },
        "MATIC":{ 
            "rpc": Web3(HTTPProvider("https://polygon.drpc.org")),
            "min": 0
        },
        "OP": { 
            "rpc": Web3(HTTPProvider("https://optimism.llamarpc.com")),
            "min": 0
        },
        "MANTA": { 
            "rpc": Web3(HTTPProvider("https://pacific-rpc.manta.network/http")),
            "min": 0
        },
        "BASE": { 
            "rpc": Web3(HTTPProvider("wss://base-rpc.publicnode.com")),
            "min": 0
        },
        "PLS": { 
            "rpc": Web3(HTTPProvider("wss://pulsechain-rpc.publicnode.com")),
            "min": 0
        },
        "CRO": { 
            "rpc": Web3(HTTPProvider("wss://cronos-evm-rpc.publicnode.com	")),
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

    while 1:
        private_key = ''.join(random.choice('0123456789abcdef') for _ in range(64))
        print('0x'+ private_key)

        # Tạo Web3 instance
        w3 = Web3(HTTPProvider("https://eth.llamarpc.com"))

        # Chuyển đổi private key thành địa chỉ ví
        address = w3.eth.account.from_key(private_key).address


        for x, y in Chains.items():
            # print(x, y["min"])
            
            # Kiểm tra số dư coin
            balance = w3.eth.get_balance(address)
            if balance > y["min"]:
                # In ra kết quả
                print(f"{x} \n Private Key: {private_key} \n Địa chỉ ví: {address} \n Số dư: {balance}")



# thay đổi số lượng luồng
maxThread = 100
for x in range(maxThread):
    t = threading.Thread(target=scan, name='t' + str(x))
    t.start()
    
    
print(f"Đang quét {maxThread} luồng...")
