// Language translations
const translations = {
    tr: {
        title: "FreeDogeAI Ön Satış",
        bnb_to_fdai: "1 BNB = 120,000,000,000 FDAI",
        connect_metamask: "🔗 MetaMask ile Bağlan",
        connected: "✅ Bağlandı",
        your_wallet: "Cüzdanınız",
        address: "Adres:",
        bnb_balance: "BNB Bakiyesi:",
        bnb_amount: "BNB Miktarı:",
        you_will_receive: "Alacağınız Miktar:",
        buy_fdai: "🚀 FDAI Token Satın Al",
        important_info: "Önemli Bilgiler",
        token_reflection: "Token satın alma işleminizin ardından, tokenleriniz 24 saat içerisinde cüzdanınıza yansıtılacaktır. Token bakiyenizi görüntülemek için MetaMask uygulamasında 'Token Ekle' seçeneğini kullanarak ilgili token kontrat adresini manuel olarak eklemeniz gerekebilir.",
        fdai_recipient_address: "FDAI Alıcı Adresi:",
        note: "NOT:",
        manual_add_note: "Eğer FDAI tokenları satın alma işleminden sonra cüzdanınızda görünmezse, aşağıdaki kontrat adresini kullanarak tokenı manuel olarak ekleyebilirsiniz:",
        about_title: "FreeDogeAI Hakkında",
        about_text: "FreeDogeAI, yapay zeka gücünü meme tabanlı kripto paraların viral çekiciliği ile birleştiren yenilikçi bir projedir. Misyonumuz, AI'yi kullanarak kullanıcıları güçlendiren, topluluk katılımını teşvik eden ve finansal özgürlüğü destekleyen merkezi olmayan bir ekosistem oluşturmaktır. FreeDogeAI ile finansın geleceğini dönüştürmeye katılın!",
        community_title: "Topluluğumuza Katılın",
        twitter: "X (Twitter)",
        telegram: "Telegram",
        download_whitepaper: "FreeDogeAI Whitepaper'ı İndir",
        invalid_amount: "Lütfen geçerli bir miktar girin!",
        transaction_success: "✅ {amount} BNB başarıyla gönderildi!\n\nAlacak: {fdai} FDAI\nTX Hash: {hash}",
        transaction_failed: "İşlem başarısız: {error}",
        open_in_metamask: "MetaMask uygulamasında açmak için tıklayın"
    },
    en: {
        title: "FreeDogeAI Presale",
        bnb_to_fdai: "1 BNB = 120,000,000,000 FDAI",
        connect_metamask: "🔗 Connect with MetaMask",
        connected: "✅ Connected",
        your_wallet: "Your Wallet",
        address: "Address:",
        bnb_balance: "BNB Balance:",
        bnb_amount: "BNB Amount:",
        you_will_receive: "You will receive:",
        buy_fdai: "🚀 Buy FDAI Tokens",
        important_info: "Important Information",
        token_reflection: "After your token purchase, your tokens will be reflected in your wallet within 24 hours. To view your token balance, you may need to manually add the token contract address using the 'Add Token' option in MetaMask.",
        fdai_recipient_address: "FDAI Recipient Address:",
        note: "NOTE:",
        manual_add_note: "If FDAI tokens do not appear in your wallet after purchase, you can manually add the token using the following contract address:",
        about_title: "About FreeDogeAI",
        about_text: "FreeDogeAI is an innovative project combining the power of artificial intelligence with the viral appeal of meme-based cryptocurrencies. Our mission is to create a decentralized ecosystem that leverages AI to empower users, foster community engagement, and drive financial freedom. Join us in revolutionizing the future of finance with FreeDogeAI!",
        community_title: "Join Our Community",
        twitter: "X (Twitter)",
        telegram: "Telegram",
        download_whitepaper: "Download FreeDogeAI Whitepaper",
        invalid_amount: "Please enter a valid amount!",
        transaction_success: "✅ {amount} BNB successfully sent!\n\nYou will receive: {fdai} FDAI\nTX Hash: {hash}",
        transaction_failed: "Transaction failed: {error}",
        open_in_metamask: "Click to open in MetaMask app"
    }
};

// Function to change language
function changeLanguage() {
    console.log("Changing language...");
    const langSelect = document.getElementById('languageSelect');
    if (!langSelect) {
        console.error("Language select element not found!");
        return;
    }
    const lang = langSelect.value || 'en';
    const elements = document.querySelectorAll('[data-lang]');
    elements.forEach(element => {
        const key = element.getAttribute('data-lang');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
            if (element.id === 'connectWalletBtn') {
                element.textContent = '🔗 ' + translations[lang][key].replace('🔗 ', '');
            } else if (element.id === 'buyBtn') {
                element.textContent = '🚀 ' + translations[lang][key].replace('🚀 ', '');
            }
        } else {
            console.warn(`Translation key "${key}" not found for language "${lang}"`);
        }
    });
    document.title = translations[lang].title || "FreeDogeAI Presale";
    console.log(`Language changed to ${lang}`);
}

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
document.addEventListener('DOMContentLoaded', () => {
    console.log("Page loaded, initializing...");

    // Setup event listeners
    const connectWalletBtn = document.getElementById('connectWalletBtn');
    if (connectWalletBtn) {
        connectWalletBtn.addEventListener('click', () => {
            console.log("Connect Wallet button clicked!");
            connectWallet();
        });
    } else {
        console.error("Connect Wallet button not found!");
    }

    const buyBtn = document.getElementById('buyBtn');
    if (buyBtn) {
        buyBtn.addEventListener('click', () => {
            console.log("Buy button clicked!");
            sendBNB();
        });
    } else {
        console.error("Buy button not found!");
    }

    const bnbAmountInput = document.getElementById('bnbAmount');
    if (bnbAmountInput) {
        bnbAmountInput.addEventListener('input', () => {
            console.log("BNB Amount input changed!");
            calculateFDAI();
        });
    } else {
        console.error("BNB Amount input not found!");
    }

    const langSelect = document.getElementById('languageSelect');
    if (langSelect) {
        langSelect.addEventListener('change', () => {
            console.log("Language selection changed!");
            changeLanguage();
        });
    } else {
        console.error("Language select not found!");
    }

    // Auto-connect if already connected
    if (window.ethereum && window.ethereum.selectedAddress) {
        console.log("Auto-connecting to MetaMask...");
        userAddress = window.ethereum.selectedAddress;
        web3 = new Web3(window.ethereum);
        updateWalletUI();
    }

    // Set default language
    changeLanguage();
});

// Wallet connection handler
async function connectWallet() {
    console.log("Attempting to connect wallet...");
    try {
        if (!window.ethereum) {
            console.log("MetaMask not detected!");
            const lang = document.getElementById('languageSelect')?.value || 'en';
            if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
                const currentUrl = window.location.href.replace(/^https?:\/\//, '');
                const deepLink = `https://metamask.app.link/dapp/${currentUrl}`;
                console.log("Redirecting to MetaMask app:", deepLink);
                window.location.href = deepLink;

                const metamaskRedirect = document.getElementById('metamaskRedirect');
                if (metamaskRedirect) {
                    metamaskRedirect.style.display = 'block';
                    const openInMetamaskLink = document.getElementById('openInMetamask');
                    if (openInMetamaskLink) {
                        openInMetamaskLink.textContent = translations[lang].open_in_metamask;
                        openInMetamaskLink.href = deepLink;
                    }
                }
            } else {
                console.log("Opening MetaMask download page...");
                window.open("https://metamask.io/download.html", "_blank");
            }
            return;
        }

        console.log("Requesting accounts from MetaMask...");
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        userAddress = accounts[0];
        web3 = new Web3(window.ethereum);
        console.log("Connected to MetaMask, user address:", userAddress);

        try {
            const chainId = await web3.eth.getChainId();
            console.log("Current chain ID:", chainId);
            if (chainId !== CONFIG.BSC_CHAIN_ID) {
                console.log("Switching to BSC Mainnet...");
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: '0x38' }]
                });
                console.log("Switched to BSC Mainnet");
            }
        } catch (error) {
            console.error("Network switch failed:", error.message);
        }

        updateWalletUI();
    } catch (error) {
        console.error("Connection error:", error.message);
        alert("Failed to connect to MetaMask: " + error.message);
    }
}

// Update UI after connection
function updateWalletUI() {
    console.log("Updating wallet UI...");
    const walletAddressElement = document.getElementById('walletAddress');
    const userTokenAddressElement = document.getElementById('userTokenAddress');
    const walletInfoElement = document.getElementById('walletInfo');
    const connectWalletBtn = document.getElementById('connectWalletBtn');
    const buyBtn = document.getElementById('buyBtn');

    if (!walletAddressElement || !userTokenAddressElement || !walletInfoElement || !connectWalletBtn || !buyBtn) {
        console.error("One or more UI elements not found!");
        return;
    }

    const shortAddress = `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`;
    walletAddressElement.textContent = shortAddress;
    userTokenAddressElement.textContent = shortAddress;

    walletInfoElement.style.display = 'block';
    const lang = document.getElementById('languageSelect')?.value || 'en';
    connectWalletBtn.textContent = translations[lang].connected;
    buyBtn.disabled = false;

    if (web3) {
        web3.eth.getBalance(userAddress).then(balance => {
            const bnbBalanceElement = document.getElementById('bnbBalance');
            if (bnbBalanceElement) {
                const bnbBalance = web3.utils.fromWei(balance, 'ether');
                bnbBalanceElement.textContent = `${parseFloat(bnbBalance).toFixed(6)} BNB`;
                console.log("BNB Balance updated:", bnbBalanceElement.textContent);
            }
        }).catch(error => {
            console.error("Failed to fetch balance:", error.message);
        });
    }
}

// Calculate FDAI tokens
function calculateFDAI() {
    console.log("Calculating FDAI tokens...");
    const bnbAmountInput = document.getElementById('bnbAmount');
    const fdaiAmountElement = document.getElementById('fdaiAmount');

    if (!bnbAmountInput || !fdaiAmountElement) {
        console.error("BNB Amount or FDAI Amount element not found!");
        return;
    }

    const amount = parseFloat(bnbAmountInput.value) || 0;
    fdaiAmountElement.textContent = (amount * CONFIG.TOKENS_PER_BNB).toLocaleString();
    console.log("FDAI amount updated:", fdaiAmountElement.textContent);
}

// Send BNB transaction
async function sendBNB() {
    console.log("Sending BNB transaction...");
    const bnbAmountInput = document.getElementById('bnbAmount');
    if (!bnbAmountInput) {
        console.error("BNB Amount input not found!");
        return;
    }

    const bnbAmount = parseFloat(bnbAmountInput.value);
    const lang = document.getElementById('languageSelect')?.value || 'en';

    if (!bnbAmount || bnbAmount <= 0) {
        console.log("Invalid BNB amount entered:", bnbAmount);
        alert(translations[lang].invalid_amount);
        return;
    }

    if (!web3 || !userAddress) {
        console.error("Wallet not connected!");
        alert("Please connect your wallet first!");
        return;
    }

    try {
        const weiAmount = web3.utils.toWei(bnbAmount.toString(), 'ether');
        console.log("Transaction details - Amount in Wei:", weiAmount);

        const tx = {
            from: userAddress,
            to: CONFIG.RECEIVE_WALLET,
            value: weiAmount,
            gas: 300000,
            gasPrice: await web3.eth.getGasPrice()
        };

        console.log("Sending transaction:", tx);
        const receipt = await web3.eth.sendTransaction(tx);
        console.log("Transaction successful, receipt:", receipt);

        const message = translations[lang].transaction_success
            .replace('{amount}', bnbAmount)
            .replace('{fdai}', (bnbAmount * CONFIG.TOKENS_PER_BNB).toLocaleString())
            .replace('{hash}', receipt.transactionHash);
        alert(message);
    } catch (error) {
        console.error("Transaction failed:", error.message);
        const message = translations[lang].transaction_failed.replace('{error}', error.message || error);
        alert(message);
    }
}

// Handle account and chain changes
if (window.ethereum) {
    window.ethereum.on('accountsChanged', (accounts) => {
        console.log("Accounts changed:", accounts);
        if (accounts.length > 0) {
            userAddress = accounts[0];
            web3 = new Web3(window.ethereum);
            updateWalletUI();
        } else {
            const walletInfoElement = document.getElementById('walletInfo');
            const connectWalletBtn = document.getElementById('connectWalletBtn');
            const buyBtn = document.getElementById('buyBtn');

            if (walletInfoElement && connectWalletBtn && buyBtn) {
                walletInfoElement.style.display = 'none';
                const lang = document.getElementById('languageSelect')?.value || 'en';
                connectWalletBtn.textContent = '🔗 ' + translations[lang].connect_metamask.replace('🔗 ', '');
                buyBtn.disabled = true;
                userAddress = "";
                web3 = null;
                console.log("Disconnected from MetaMask");
            }
        }
    });

    window.ethereum.on('chainChanged', () => {
        console.log("Chain changed, reloading page...");
        window.location.reload();
    });
                       }
