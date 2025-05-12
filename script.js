<script>
    // Configuration
    const CONFIG = {
        RECEIVE_WALLET: "0xd924e01c7d319c5b23708cd622bd1143cd4fb360",
        TOKENS_PER_BNB: 120000000000,
        BSC_CHAIN_ID: 56
    };

    // App state
    let web3;
    let userAddress = "";

    // Initialize on page load
    window.addEventListener('DOMContentLoaded', () => {
        // Butonların DOM'da mevcut olduğundan emin ol
        const connectWalletBtn = document.getElementById('connectWalletBtn');
        const buyBtn = document.getElementById('buyBtn');
        const bnbAmountInput = document.getElementById('bnbAmount');

        if (!connectWalletBtn || !buyBtn || !bnbAmountInput) {
            console.error("Butonlar veya input alanı bulunamadı. DOM doğru şekilde yüklendi mi?");
            return;
-D        }

        // Setup event listeners
        connectWalletBtn.addEventListener('click', connectWallet);
        buyBtn.addEventListener('click', sendBNB);
        bnbAmountInput.addEventListener('input', calculateFDAI);

        // Auto-connect if already connected
        if (window.ethereum?.selectedAddress) {
            connectWallet();
        }
    });

    // Wallet connection handler
    async function connectWallet() {
        try {
            // Mobil cihaz kontrolü
            if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
                // WalletConnect ile bağlantı
                if (typeof WalletConnectWeb3Provider === "undefined") {
                    console.error("WalletConnectWeb3Provider tanımlı değil. Kütüphane yüklenmedi mi?");
                    alert("WalletConnect kütüphanesi yüklenemedi. Lütfen sayfayı yenileyin veya MetaMask uygulamasını manuel olarak kullanın.");
                    return;
                }

                const provider = new WalletConnectWeb3Provider({
                    rpc: {
                        56: "https://bsc-dataseed.binance.org/" // BSC Mainnet RPC
                    },
                    chainId: 56
                });

                // WalletConnect ile cüzdan bağlantısını başlat
                await provider.enable(); // Bu, MetaMask uygulamasını açar ve imza ister
                web3 = new Web3(provider);
                const accounts = await web3.eth.getAccounts();
                userAddress = accounts[0];

                updateWalletUI();
                return;
            }

            // Masaüstü için MetaMask kontrolü
            if (!window.ethereum) {
                window.open("https://metamask.io/download.html", "_blank");
                return;
            }

            // MetaMask yüklüyse, cüzdan bağlantısını başlat
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            userAddress = accounts[0];
            web3 = new Web3(window.ethereum);

            // BSC ağına geçiş
            try {
                const chainId = await web3.eth.getChainId();
                if (chainId !== CONFIG.BSC_CHAIN_ID) {
                    await window.ethereum.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: '0x38' }] // BSC Mainnet
                    });
                }
            } catch (error) {
                console.log("Network switch failed:", error);
            }

            updateWalletUI();
        } catch (error) {
            console.error("Cüzdan bağlantı hatası:", error);
            alert("Cüzdan bağlantısı başarısız: " + (error.message || error));
        }
    }

    // Update UI after connection
    function updateWalletUI() {
        // Format address display
        const shortAddress = `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`;
        document.getElementById('walletAddress').textContent = shortAddress;
        document.getElementById('userTokenAddress').textContent = shortAddress;

        // Show wallet info and enable buy button
        document.getElementById('walletInfo').style.display = 'block';
        document.getElementById('connectWalletBtn').textContent = '✅ Connected';
        document.getElementById('buyBtn').disabled = false;

        // Get and display balance
        web3.eth.getBalance(userAddress).then(balance => {
            const bnbBalance = web3.utils.fromWei(balance, 'ether');
            document.getElementById('bnbBalance').textContent = `${parseFloat(bnbBalance).toFixed(6)} BNB`;
        }).catch(error => {
            console.error("Bakiye alınırken hata:", error);
        });
    }

    // Calculate FDAI tokens
    function calculateFDAI() {
        const amount = parseFloat(document.getElementById('bnbAmount').value) || 0;
        document.getElementById('fdaiAmount').textContent = (amount * CONFIG.TOKENS_PER_BNB).toLocaleString();
    }

    // Send BNB transaction
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
            alert(`✅ ${bnbAmount} BNB başarıyla gönderildi!\n\nAlacak: ${(bnbAmount * CONFIG.TOKENS_PER_BNB).toLocaleString()} FDAI\nTX Hash: ${receipt.transactionHash}`);
        } catch (error) {
            console.error("Transaction failed:", error);
            alert("İşlem başarısız: " + (error.message || error));
        }
    }

    // Handle account changes
    if (window.ethereum) {
        window.ethereum.on('accountsChanged', (accounts) => {
            if (accounts.length > 0) {
                userAddress = accounts[0];
                updateWalletUI();
            } else {
                // Disconnect
                document.getElementById('walletInfo').style.display = 'none';
                document.getElementById('connectWalletBtn').textContent = '🔗 MetaMask ile Bağlan';
                document.getElementById('buyBtn').disabled = true;
            }
        });

        window.ethereum.on('chainChanged', () => window.location.reload());
    }
</script>
