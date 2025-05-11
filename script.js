const CONFIG = {
    RECEIVE_WALLET: "0xd924e01c7d319c5b23708cd622bd1143cd4fb360",
    TOKENS_PER_BNB: 120000000000,
    BSC_CHAIN_ID: 56
};

let web3;
let userAddress = "";

window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('connectWalletBtn').addEventListener('click', connectWallet);
    document.getElementById('buyBtn').addEventListener('click', sendBNB);
    document.getElementById('bnbAmount').addEventListener('input', calculateFDAI);
});

async function connectWallet() {
    try {
        if (!window.ethereum) {
            alert("MetaMask yüklü değil.");
            return;
        }

        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        userAddress = accounts[0];
        web3 = new Web3(window.ethereum);

        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x38' }] // BSC Mainnet
        });

        // Mobil imza penceresini aç
        const message = "Bağlantıyı onaylıyor musunuz?";
        await web3.eth.personal.sign(message, userAddress, "");

        updateWalletUI();
    } catch (error) {
        console.error("Wallet bağlantısı başarısız:", error);
        alert("Bağlantı reddedildi veya başarısız.");
    }
}

function updateWalletUI() {
    const shortAddress = `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`;
    document.getElementById('walletAddress').textContent = shortAddress;
    document.getElementById('userTokenAddress').textContent = shortAddress;
    document.getElementById('walletInfo').style.display = 'block';
    document.getElementById('connectWalletBtn').textContent = '✅ Connected';
    document.getElementById('buyBtn').disabled = false;

    web3.eth.getBalance(userAddress).then(balance => {
        const bnbBalance = web3.utils.fromWei(balance, 'ether');
        document.getElementById('bnbBalance').textContent = `${parseFloat(bnbBalance).toFixed(6)} BNB`;
    });
}

function calculateFDAI() {
    const amount = parseFloat(document.getElementById('bnbAmount').value) || 0;
    document.getElementById('fdaiAmount').textContent = (amount * CONFIG.TOKENS_PER_BNB).toLocaleString();
}

async function sendBNB() {
    const bnbAmount = parseFloat(document.getElementById('bnbAmount').value);
    if (!bnbAmount || bnbAmount <= 0) {
        alert("Lütfen geçerli bir miktar girin!");
        return;
    }

    try {
        const weiAmount = web3.utils.toWei(bnbAmount.toString(), 'ether');
        const tx = {
            from: userAddress,
            to: CONFIG.RECEIVE_WALLET,
            value: weiAmount,
            gas: 300000,
            gasPrice: await web3.eth.getGasPrice()
        };
        const receipt = await web3.eth.sendTransaction(tx);
        alert(`✅ ${bnbAmount} BNB başarıyla gönderildi!\nAlacak: ${(bnbAmount * CONFIG.TOKENS_PER_BNB).toLocaleString()} FDAI\nTX Hash: ${receipt.transactionHash}`);
    } catch (error) {
        console.error("İşlem başarısız:", error);
        alert("İşlem reddedildi veya başarısız.");
    }
    }
