// Language translations
const translations = {
    tr: {
        connect_metamask: "🔗 MetaMask ile Bağlan",
        connected: "✅ Bağlandı",
        your_wallet: "Cüzdanınız",
        address: "Adres:",
        bnb_balance: "BNB Bakiyesi:",
        bnb_amount: "BNB Miktarı:",
        you_will_receive: "Alacağınız Miktar:",
        buy_fdai: "🚀 FDAI Token Satın Al",
        invalid_amount: "Lütfen geçerli bir miktar girin!",
        transaction_success: "✅ {amount} BNB başarıyla gönderildi!\n\nAlacak: {fdai} FDAI\nTX Hash: {hash}",
        transaction_failed: "İşlem başarısız: {error}"
    },
    en: {
        connect_metamask: "🔗 Connect with MetaMask",
        connected: "✅ Connected",
        your_wallet: "Your Wallet",
        address: "Address:",
        bnb_balance: "BNB Balance:",
        bnb_amount: "BNB Amount:",
        you_will_receive: "You will receive:",
        buy_fdai: "🚀 Buy FDAI Tokens",
        invalid_amount: "Please enter a valid amount!",
        transaction_success: "✅ {amount} BNB successfully sent!\n\nYou will receive: {fdai} FDAI\nTX Hash: {hash}",
        transaction_failed: "Transaction failed: {error}"
    },
    zh: {
        connect_metamask: "🔗 使用 MetaMask 连接",
        connected: "✅ 已连接",
        your_wallet: "你的钱包",
        address: "地址：",
        bnb_balance: "BNB 余额：",
        bnb_amount: "BNB 数量：",
        you_will_receive: "你将收到：",
        buy_fdai: "🚀 购买 FDAI 代币",
        invalid_amount: "请输入有效金额！",
        transaction_success: "✅ {amount} BNB 已成功发送！\n\n你将收到：{fdai} FDAI\n交易哈希：{hash}",
        transaction_failed: "交易失败：{error}"
    },
    ja: {
        connect_metamask: "🔗 MetaMask で接続",
        connected: "✅ 接続済み",
        your_wallet: "あなたのウォレット",
        address: "アドレス：",
        bnb_balance: "BNB 残高：",
        bnb_amount: "BNB 数量：",
        you_will_receive: "受け取る金額：",
        buy_fdai: "🚀 FDAI トークンを購入",
        invalid_amount: "有効な金額を入力してください！",
        transaction_success: "✅ {amount} BNB が正常に送信されました！\n\n受け取る金額：{fdai} FDAI\nトランザクションハッシュ：{hash}",
        transaction_failed: "取引に失敗しました：{error}"
    },
    ur: {
        connect_metamask: "🔗 میٹاماسک کے ساتھ کنیکٹ کریں",
        connected: "✅ منسلک ہو گیا",
        your_wallet: "آپ کا والٹ",
        address: "ایڈریس:",
        bnb_balance: "BNB بیلنس:",
        bnb_amount: "BNB کی مقدار:",
        you_will_receive: "آپ کو ملے گا:",
        buy_fdai: "🚀 FDAI ٹوکن خریدیں",
        invalid_amount: "براہ کرم ایک درست رقم درج کریں!",
        transaction_success: "✅ {amount} BNB کامیابی کے ساتھ بھیج دیا گیا!\n\nآپ کو ملے گا: {fdai} FDAI\nTX Hash: {hash}",
        transaction_failed: "لین دین ناکام ہو گیا: {error}"
    },
    ar: {
        connect_metamask: "🔗 الاتصال بـ MetaMask",
        connected: "✅ متصل",
        your_wallet: "محفظتك",
        address: "العنوان:",
        bnb_balance: "رصيد BNB:",
        bnb_amount: "كمية BNB:",
        you_will_receive: "سوف تتلقى:",
        buy_fdai: "🚀 شراء رموز FDAI",
        invalid_amount: "يرجى إدخال مبلغ صالح!",
        transaction_success: "✅ تم إرسال {amount} BNB بنجاح!\n\nسوف تتلقى: {fdai} FDAI\nمعرف المعاملة: {hash}",
        transaction_failed: "فشلت المعاملة: {error}"
    },
    ru: {
        connect_metamask: "🔗 Подключиться через MetaMask",
        connected: "✅ Подключено",
        your_wallet: "Ваш кошелек",
        address: "Адрес:",
        bnb_balance: "Баланс BNB:",
        bnb_amount: "Количество BNB:",
        you_will_receive: "Вы получите:",
        buy_fdai: "🚀 Купить токены FDAI",
        invalid_amount: "Пожалуйста, введите действительную сумму!",
        transaction_success: "✅ {amount} BNB успешно отправлено!\n\nВы получите: {fdai} FDAI\nХэш транзакции: {hash}",
        transaction_failed: "Транзакция не удалась: {error}"
    }
};

// Function to change language
function changeLanguage() {
    const lang = document.getElementById('languageSelect').value;
    document.querySelectorAll('[data-lang]').forEach(element => {
        const key = element.getAttribute('data-lang');
        if (translations[lang][key]) {
            element.textContent = translations[lang][key];
            // Special case for buttons with icons
            if (element.id === 'connectWalletBtn' && element.textContent.includes('🔗')) {
                element.textContent = '🔗 ' + translations[lang][key].replace('🔗 ', '');
            }
            if (element.id === 'buyBtn' && element.textContent.includes('🚀')) {
                element.textContent = '🚀 ' + translations[lang][key].replace('🚀 ', '');
            }
        }
    });
    document.title = translations[lang].title;
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
window.addEventListener('DOMContentLoaded', () => {
    // Setup event listeners
    document.getElementById('connectWalletBtn').addEventListener('click', connectWallet);
    document.getElementById('buyBtn').addEventListener('click', sendBNB);
    document.getElementById('bnbAmount').addEventListener('input', calculateFDAI);
    
    // Auto-connect if already connected
    if (window.ethereum?.selectedAddress) {
        connectWallet();
    }

    // Set default language
    changeLanguage();
});

// Wallet connection handler
async function connectWallet() {
    try {
        // Check if MetaMask is installed
        if (!window.ethereum) {
            // Mobile redirect
            if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
                const currentUrl = window.location.href.replace(/^https?:\/\//, '');
                window.location.href = `https://metamask.app.link/dapp/${currentUrl}`;
            } else {
                // Desktop - open MetaMask download page
                window.open("https://metamask.io/download.html", "_blank");
            }
            return;
        }
        
        // Request accounts
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        userAddress = accounts[0];
        web3 = new Web3(window.ethereum);
        
        // Switch to BSC network
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
        console.log("Connection error:", error);
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
    const lang = document.getElementById('languageSelect').value;
    document.getElementById('connectWalletBtn').textContent = translations[lang].connected;
    document.getElementById('buyBtn').disabled = false;
    
    // Get and display balance
    web3.eth.getBalance(userAddress).then(balance => {
        const bnbBalance = web3.utils.fromWei(balance, 'ether');
        document.getElementById('bnbBalance').textContent = `${parseFloat(bnbBalance).toFixed(6)} BNB`;
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
    const lang = document.getElementById('languageSelect').value;
    
    if (!bnbAmount || bnbAmount <= 0) {
        alert(translations[lang].invalid_amount);
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
        const message = translations[lang].transaction_success
            .replace('{amount}', bnbAmount)
            .replace('{fdai}', (bnbAmount * CONFIG.TOKENS_PER_BNB).toLocaleString())
            .replace('{hash}', receipt.transactionHash);
        alert(message);
        
    } catch (error) {
        console.error("Transaction failed:", error);
        const message = translations[lang].transaction_failed.replace('{error}', error.message || error);
        alert(message);
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
            const lang = document.getElementById('languageSelect').value;
            document.getElementById('connectWalletBtn').textContent = '🔗 ' + translations[lang].connect_metamask.replace('🔗 ', '');
            document.getElementById('buyBtn').disabled = true;
        }
    });
    
    window.ethereum.on('chainChanged', () => window.location.reload());
}
