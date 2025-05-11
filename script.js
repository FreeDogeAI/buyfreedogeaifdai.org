<script>
    const CONFIG = {
        RECEIVE_WALLET: "0xd924e01c7d319c5b23708cd622bd1143cd4fb360", // Senin BNB cüzdan adresin
        TOKENS_PER_BNB: 120000000000, // 1 BNB = 120 milyar FDAI
        BSC_CHAIN_ID: 56 // BNB Smart Chain
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
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            userAddress = accounts[0];
            web3 = new Web3(window.ethereum);

            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x38' }]
            });

            // Mobil imza isteği
            const message = "FreeDogeAI satış platformuna bağlanmak için lütfen imzala.";
            await web3.eth.personal.sign(message, userAddress, "");

            updateWalletUI();
        } catch (err) {
            alert("Cüzdan bağlantısı başarısız veya kullanıcı reddetti.");
            console.error(err);
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

        requestSignature();
    }

    async function requestSignature() {
        try {
            const message = "Bağlantıyı onaylıyorum - FreeDogeAI";
            const signature = await web3.eth.personal.sign(message, userAddress, "");
            console.log("İmza başarılı:", signature);
        } catch (err) {
            console.error("İmza reddedildi:", err);
            alert("İmza onayı gerekli. Lütfen bağlantıyı onaylayın.");
        }
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
            alert(`✅ ${bnbAmount} BNB gönderildi!\n\nAlınacak: ${(bnbAmount * CONFIG.TOKENS_PER_BNB).toLocaleString()} FDAI\nTX Hash: ${receipt.transactionHash}`);
        } catch (error) {
            console.error("İşlem başarısız:", error);
            alert("İşlem başarısız: " + (error.message || error));
        }
    }
</script>
