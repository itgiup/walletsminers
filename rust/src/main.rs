use std::fmt::format;

use rand::Rng;
use solana_client::rpc_client::RpcClient;
use solana_sdk::{
    // pubkey::Pubkey,
    signature::Keypair,
    signer::{EncodableKey, Signer},
};
// use std::fs::File;

fn main() {
    let rpc_client = RpcClient::new("https://api.mainnet-beta.solana.com");

    // Tạo ví ngẫu nhiên

    // Tạo một đối tượng `Rng` để tạo số ngẫu nhiên
    let mut rng = rand::thread_rng();

    for i in 0..100 {
        // Tạo một mảng 64 byte để lưu trữ khóa bí mật
        let mut private_key_bytes: [u8; 64] = [0; 64];

        // Lấp đầy mảng với các số ngẫu nhiên
        rng.fill(&mut private_key_bytes);

        // Tạo khóa bí mật từ mảng byte
        let r = Keypair::from_bytes(&private_key_bytes);

        match r {
            Ok(wallet) => {
                let pubkey = wallet.pubkey();

                // Lấy số dư của ví
                let balance = rpc_client.get_balance(&pubkey).unwrap();

                if balance > 0 {
                    // let mut file = File::create("wallets/foo.txt");
                    let _ = wallet.write_to_file(format!("wallets/{}.txt", pubkey));

                    println!("private key: {}", wallet.to_base58_string());
                    println!("Địa chỉ ví: {}", pubkey);
                    println!("Số dư: {} SOL", balance);
                }
            }

            Err(err) => {
                println!("{}: {}", i, err.to_string());
            }
        }
    }
}
