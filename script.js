// Sabitler
const ALICI_CUZDAN_ADRESI = "0xd924e01c7d319c5b23708cd622bd1143cd4fb360"; // Senin BNB cüzdan adresin
const FDAI_PER_BNB = 120000000000; // 1 BNB = 120,000,000,000 FDAI
const BSC_CHAIN_ID = "0x38"; // BSC Mainnet (testnet için 0x61)

let web3;
let userAddress;

// MetaMask bağlantısı
async function connectWallet() {
    try {
        // MetaMask yüklü mü kontrol et
        if (typeof window.ethereum === 'undefined') {
            document.getElementById('status').innerText = "MetaMask yüklü değil. Lütfen yükleyin.";
            return;
        }

        web3 = new Web3(window.ethereum);

        // BSC ağına geçiş
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: BSC_CHAIN_ID }],
            });
        } catch (switchError) {
            if (switchError.code === 4902) {
                document.getElementById('status').innerText = "Binance Smart Chain'i MetaMask'e ekleyin.";
                return;
            }
            throw switchError;
        }

        // Cüzdan bağlantısı iste
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        userAddress = accounts[0];

        // Mobil imza (personal_sign)
        const message = `FreeDogeAI: ${userAddress} için bağlantıyı onaylıyorum`;
        await window.ethereum.request({
            method: 'personal_sign',
            params: [message, userAddress],
        });

        // Başarılı bağlantı
        document.getElementById('connectButton').style.display = 'none';
        document.getElementById('buySection').style.display = 'block';
        updateWalletInfo();
    } catch (error) {
        document.getElementById('status').innerText = `Bağlantı hatası: ${error.message}`;
    }
}

// Cüzdan bilgilerini güncelle
async function updateWalletInfo() {
    if (!web3 || !userAddress) return;

    const balance = await web3.eth.getBalance(userAddress);
    const bnbBalance = web3.utils.fromWei(balance, 'ether');
    document.getElementById('walletInfo').innerText = 
        `Bağlı Cüzdan: ${userAddress}\nBNB Bakiyesi: ${parseFloat(bnbBalance).toFixed(4)}`;
}

// BNB miktarına göre FDAI hesapla
document.getElementById('bnbAmount').addEventListener('input', function() {
    const bnbAmount = parseFloat(this.value);
    if (isNaN(bnbAmount) || bnbAmount <= 0) {
        document.getElementById('fdaiAmount').innerText = "Alınacak FDAI: 0";
        return;
    }
    const fdaiAmount = bnbAmount * FDAI_PER_BNB;
    document.getElementById('fdaiAmount').innerText = `Alınacak FDAI: ${fdaiAmount.toLocaleString()}`;
});

// FDAI token satın alma
async function buyFDAI() {
    try {
        const bnbAmount = document.getElementById('bnbAmount').value;
        if (!bnbAmount || parseFloat(bnbAmount) <= 0) {
            document.getElementById('status').innerText = "Geçerli bir BNB miktarı girin.";
            return;
        }

        document.getElementById('buyButton').disabled = true;
        document.getElementById('status').innerText = "İşlem işleniyor...";

        // BNB'yi senin cüzdanına gönder
        const weiAmount = web3.utils.toWei(bnbAmount, 'ether');
        const tx = await web3.eth.sendTransaction({
            from: userAddress,
            to: ALICI_CUZDAN_ADRESI,
            value: weiAmount,
        });

        // Manuel dağıtım notu
        document.getElementById('status').innerText = 
            `Başarılı! İşlem: ${tx.transactionHash}\nFDAI tokenları manuel olarak gönderilecek.`;
        
        updateWalletInfo();
    } catch (error) {
        document.getElementById('status').innerText = `İşlem hatası: ${error.message}`;
    } finally {
        document.getElementById('buyButton').disabled = false;
    }
}

// Sayfa yüklendiğinde cüzdan durumunu kontrol et
window.addEventListener('load', async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        if (accounts.length > 0) {
            userAddress = accounts[0];
            document.getElementById('connectButton').style.display = 'none';
            document.getElementById('buySection').style.display = 'block';
            updateWalletInfo();
        }
    }
});
