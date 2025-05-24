const CONFIG = {
    RECEIVE_WALLET: "0xd924e01c7d319c5b23708cd622bd1143cd4fb360",
    TOKENS_PER_BNB: 120000000000,
    TOKENS_PER_USDT: 200000000,
    BSC_CHAIN_ID: 56,
    USDT_CONTRACT: "0x55d398326f99059fF775485246999027B3197955"
};

let web3;
let userAddress = "";
let usdtContract;

window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('connectWalletBtn').addEventListener('click', connectWallet);
    document.getElementById('buyBtn').addEventListener('click', sendPayment);
    document.getElementById('bnbAmount').addEventListener('input', calculateFDAI);
    document.getElementById('usdtAmount').addEventListener('input', calculateFDAI);
    document.getElementById('paymentMethod').addEventListener('change', togglePaymentMethod);
    
    // Başlangıçta ödeme yöntemi seçilmemiş, buton pasif
    document.getElementById('buyBtn').disabled = true;
    
    if (window.ethereum?.selectedAddress) {
        connectWallet();
    }
});

function togglePaymentMethod() {
    const method = document.getElementById('paymentMethod').value;
    if (method === 'bnb') {
        document.getElementById('bnbSection').style.display = 'block';
        document.getElementById('usdtSection').style.display = 'none';
        document.getElementById('rateInfo').textContent = '1 BNB = 120,000,000,000 FDAI';
        document.getElementById('bnbAmount').value = '0.1';
        document.getElementById('usdtAmount').value = ''; // USDT alanını sıfırla
    } else {
        document.getElementById('bnbSection').style.display = 'none';
        document.getElementById('usdtSection').style.display = 'block';
        document.getElementById('rateInfo').textContent = '1 USDT = 200,000,000 FDAI';
        document.getElementById('usdtAmount').value = '10';
        document.getElementById('bnbAmount').value = ''; // BNB alanını sıfırla
    }
    calculateFDAI();
}

async function connectWallet() {
    try {
        if (!window.ethereum) {
            if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
                const currentUrl = window.location.href.replace(/^https?:\/\//, '');
                window.location.href = "https://metamask.app.link/dapp/buyfreedogeaifdai.org";
            } else {
                window.open("https://metamask.io/download.html", "_blank");
            }
            return;
        }
        
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        userAddress = accounts[0];
        web3 = new Web3(window.ethereum);
        // Eğer ikinci denemede bağlanırsa, bağlantı kontrolü aktif kalsın
if (retryTimer) clearInterval(retryTimer);
retryTimer = setInterval(() => {
    if (window.ethereum.selectedAddress === userAddress) {
        clearInterval(retryTimer);
        updateWalletUI();
    }
}, 1000);
        setTimeout(() => {
    if (!window.ethereum?.selectedAddress) {
        const currentUrl = window.location.href.replace(/^https?:\/\//, '');
        window.location.href = `https://metamask.app.link/dapp/${currentUrl}`;
    }
}, 60000);
        
        const usdtAbi = [{
            "constant": true,
            "inputs": [{"name": "_owner", "type": "address"}],
            "name": "balanceOf",
            "outputs": [{"name": "balance", "type": "uint256"}],
            "type": "function"
        }, {
            "constant": false,
            "inputs": [
                {"name": "_to", "type": "address"},
                {"name": "_value", "type": "uint256"}
            ],
            "name": "transfer",
            "outputs": [{"name": "", "type": "bool"}],
            "type": "function"
        }];
        usdtContract = new web3.eth.Contract(usdtAbi, CONFIG.USDT_CONTRACT);
        
        try {
            const chainId = Number(await web3.eth.getChainId());
            if (chainId !== CONFIG.BSC_CHAIN_ID) {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: '0x38' }]
                });
            }
        } catch (error) {
            console.log("Ağ değiştirme hatası:", error);
            alert("Ağ değiştirme hatası: " + (error.message || error));
        }
        
        await updateWalletUI();
    } catch (error) {
        console.log("Bağlantı hatası:", error);
        alert("Bağlantı hatası: " + (error.message || error));
    }
}

async function updateWalletUI() {
    const shortAddress = `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`;
    document.getElementById('walletAddress').textContent = shortAddress;
    
    document.getElementById('walletInfo').style.display = 'block';
    document.getElementById('connectWalletBtn').textContent = '✅ Bağlandı';
    document.getElementById('buyBtn').disabled = false; // Cüzdan bağlandığında buton aktif olabilir
    
    try {
        const bnbBalance = await web3.eth.getBalance(userAddress);
        document.getElementById('bnbBalance').textContent = `${web3.utils.fromWei(bnbBalance, 'ether').slice(0, 8)} BNB`;
        
        const usdtBalance = await usdtContract.methods.balanceOf(userAddress).call();
        document.getElementById('usdtBalance').textContent = `${web3.utils.fromWei(usdtBalance, 'ether')} USDT`;
    } catch (error) {
        console.error("Bakiye alma hatası:", error);
    }
}

function calculateFDAI() {
    const method = document.getElementById('paymentMethod').value;
    let fdai = 0;
    
    if (method === 'bnb') {
        const bnbAmount = parseFloat(document.getElementById('bnbAmount').value) || 0;
        fdai = bnbAmount * CONFIG.TOKENS_PER_BNB;
    } else if (method === 'usdt') {
        const usdtAmount = parseFloat(document.getElementById('usdtAmount').value) || 0;
        fdai = usdtAmount * CONFIG.TOKENS_PER_USDT;
    }
    
    document.getElementById('fdaiAmount').textContent = fdai.toLocaleString();
}

async function sendPayment() {
    const method = document.getElementById('paymentMethod').value;
    
    if (!method) {
        alert("Lütfen bir ödeme yöntemi seçin!");
        return;
    }
    
    if (method === 'bnb') {
        const bnbAmount = parseFloat(document.getElementById('bnbAmount').value) || 0;
        if (!bnbAmount || bnbAmount <= 0) {
            alert("Lütfen geçerli bir BNB miktarı girin!");
            return;
        }
        await sendBNB();
    } else if (method === 'usdt') {
        const usdtAmount = parseFloat(document.getElementById('usdtAmount').value) || 0;
        if (!usdtAmount || usdtAmount <= 0) {
            alert("Lütfen geçerli bir USDT miktarı girin!");
            return;
        }
        await sendUSDT();
    }
}

async function sendBNB() {
    const bnbAmount = parseFloat(document.getElementById('bnbAmount').value);
    
    if (!bnbAmount || bnbAmount <= 0) {
        alert("Lütfen geçerli bir BNB miktarı girin!");
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
        alert(`✅ ${bnbAmount} BNB başarıyla gönderildi!\n\nAlacağınız miktar: ${(bnbAmount * CONFIG.TOKENS_PER_BNB).toLocaleString()} FDAI\nTX Hash: ${receipt.transactionHash}`);
    } catch (error) {
        console.error("BNB gönderim hatası:", error);
        alert("BNB gönderimi başarısız oldu: " + (error.message || error));
    }
}

async function sendUSDT() {
    const usdtAmount = parseFloat(document.getElementById('usdtAmount').value);
    
    if (!usdtAmount || usdtAmount <= 0) {
        alert("Lütfen geçerli bir USDT miktarı girin!");
        return;
    }
    
    try {
        const weiAmount = web3.utils.toWei(usdtAmount.toString(), 'ether');
        
        const receipt = await usdtContract.methods.transfer(
            CONFIG.RECEIVE_WALLET,
            weiAmount
        ).send({
            from: userAddress,
            gas: 200000,
            gasPrice: await web3.eth.getGasPrice()
        });
        
        alert(`✅ ${usdtAmount} USDT başarıyla gönderildi!\n\nAlacağınız miktar: ${(usdtAmount * CONFIG.TOKENS_PER_USDT).toLocaleString()} FDAI\nTX Hash: ${receipt.transactionHash}`);
    } catch (error) {
        console.error("USDT gönderim hatası:", error);
        alert("USDT gönderimi başarısız oldu: " + (error.message || error));
    }
}

if (window.ethereum) {
    window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
            userAddress = accounts[0];
            updateWalletUI();
        } else {
            document.getElementById('walletInfo').style.display = 'none';
            document.getElementById('connectWalletBtn').textContent = '🔗 MetaMask ile Bağlan';
            document.getElementById('buyBtn').disabled = true;
        }
    });
    
    window.ethereum.on('chainChanged', () => window.location.reload());
            }
