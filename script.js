// app.js
const CONFIG = {
    RECEIVE_WALLET: "0xd924e01c7d319c5b23708cd622bd1143cd4fb360",
    TOKENS_PER_BNB: 120000000000,
    BSC_CHAIN_ID: 56
};

let web3;
let userAddress = "";

// Dil çevirileri için sözlük
const translations = {
    en: {
        title: "FreeDogeAI Presale",
        connectWallet: "🔗 Connect with MetaMask",
        connected: "✅ Connected",
        walletTitle: "Your Wallet",
        addressLabel: "Address:",
        balanceLabel: "BNB Balance:",
        bnbAmountLabel: "BNB Amount:",
        receiveLabel: "You will receive:",
        buyButton: "🚀 Buy FDAI Tokens",
        infoTitle: "Important Information",
        infoText1: "Please use MetaMask to complete your purchase.<br>To see your tokens in your wallet, add the contract address manually in MetaMask after the transaction.",
        infoText2: "Tokens will appear in your wallet within 24 hours after your purchase.",
        infoText3: "NOTE: If FDAI tokens do not appear in your wallet after purchase, you can manually add the token using the following contract address:",
        aboutTitle: "About",
        aboutText: "FreeDogeAI is your next big opportunity in the crypto world. Inspired by Doge, powered by AI. Don't miss your chance to join the future of decentralized innovation.",
        whitepaperLink: "Download Whitepaper (PDF)",
        communityTitle: "Community",
        telegramLink: "Telegram: @freedogeaiFDAI",
        twitterLink: "Twitter (X): @FreeDogeAI_FDAI",
        highlightMessage: "Don't miss the next Doge! This opportunity won't last long.",
        metamaskRedirect: "Click to open in MetaMask app"
    },
    tr: {
        title: "FreeDogeAI Ön Satış",
        connectWallet: "🔗 MetaMask ile Bağlan",
        connected: "✅ Bağlandı",
        walletTitle: "Cüzdanınız",
        addressLabel: "Adres:",
        balanceLabel: "BNB Bakiyesi:",
        bnbAmountLabel: "BNB Miktarı:",
        receiveLabel: "Alacağınız Miktar:",
        buyButton: "🚀 FDAI Token Satın Al",
        infoTitle: "Önemli Bilgiler",
        infoText1: "Satın alma işleminizi tamamlamak için lütfen MetaMask kullanın.<br>Tokenlarınızı cüzdanınızda görmek için, işlemden sonra MetaMask'e sözleşme adresini manuel olarak ekleyin.",
        infoText2: "Tokenlar satın alma işleminden sonra 24 saat içinde cüzdanınızda görünecektir.",
        infoText3: "NOT: Eğer FDAI tokenları satın alma işleminden sonra cüzdanınızda görünmezse, aşağıdaki sözleşme adresini kullanarak tokenı manuel olarak ekleyebilirsiniz:",
        aboutTitle: "Hakkında",
        aboutText: "FreeDogeAI, kripto dünyasındaki bir sonraki büyük fırsatınız. Doge'dan ilham alındı, yapay zeka ile güçlendirildi. Merkezi olmayan yeniliklerin geleceğine katılma şansınızı kaçırmayın.",
        whitepaperLink: "Beyaz Bülteni İndir (PDF)",
        communityTitle: "Topluluk",
        telegramLink: "Telegram: @freedogeaiFDAI",
        twitterLink: "Twitter (X): @FreeDogeAI_FDAI",
        highlightMessage: "Bir sonraki Doge'u kaçırmayın! Bu fırsat uzun sürmeyecek.",
        metamaskRedirect: "MetaMask uygulamasında açmak için tıklayın"
    },
    ar: {
        title: "بيع مسبق لـ FreeDogeAI",
        connectWallet: "🔗 الاتصال بـ MetaMask",
        connected: "✅ متصل",
        walletTitle: "محفظتك",
        addressLabel: "العنوان:",
        balanceLabel: "رصيد BNB:",
        bnbAmountLabel: "كمية BNB:",
        receiveLabel: "ستتلقى:",
        buyButton: "🚀 شراء رموز FDAI",
        infoTitle: "معلومات هامة",
        infoText1: "يرجى استخدام MetaMask لإكمال عملية الشراء.<br>لرؤية الرموز في محفظتك، أضف عنوان العقد يدويًا في MetaMask بعد المعاملة.",
        infoText2: "ستظهر الرموز في محفظتك خلال 24 ساعة بعد الشراء.",
        infoText3: "ملاحظة: إذا لم تظهر رموز FDAI في محفظتك بعد الشراء، يمكنك إضافة الرمز يدويًا باستخدام عنوان العقد التالي:",
        aboutTitle: "عن المشروع",
        aboutText: "FreeDogeAI هي فرصتك الكبيرة القادمة في عالم العملات الرقمية. مستوحاة من Doge، مدعومة بالذكاء الاصطناعي. لا تفوت فرصتك للانضمام إلى مستقبل الابتكار اللامركزي.",
        whitepaperLink: "تحميل الورقة البيضاء (PDF)",
        communityTitle: "المجتمع",
        telegramLink: "تيليجرام: @freedogeaiFDAI",
        twitterLink: "تويتر (X): @FreeDogeAI_FDAI",
        highlightMessage: "لا تفوت الـ Doge القادم! هذه الفرصة لن تستمر طويلاً.",
        metamaskRedirect: "انقر لفتح التطبيق في MetaMask"
    },
    hi: {
        title: "FreeDogeAI प्रीसेल",
        connectWallet: "🔗 MetaMask से कनेक्ट करें",
        connected: "✅ कनेक्टेड",
        walletTitle: "आपका वॉलेट",
        addressLabel: "पता:",
        balanceLabel: "BNB बैलेंस:",
        bnbAmountLabel: "BNB राशि:",
        receiveLabel: "आपको मिलेगा:",
        buyButton: "🚀 FDAI टोकन खरीदें",
        infoTitle: "महत्वपूर्ण जानकारी",
        infoText1: "कृपया अपनी खरीदारी पूरी करने के लिए MetaMask का उपयोग करें।<br>अपने वॉलेट में टोकन देखने के लिए, लेनदेन के बाद MetaMask में कॉन्ट्रैक्ट पता मैन्युअल रूप से जोड़ें।",
        infoText2: "खरीदारी के बाद 24 घंटे के भीतर टोकन आपके वॉलेट में दिखाई देंगे।",
        infoText3: "नोट: यदि खरीदारी के बाद FDAI टोकन आपके वॉलेट में दिखाई नहीं देते, तो आप निम्नलिखित कॉन्ट्रैक्ट पते का उपयोग करके टोकन मैन्युअल रूप से जोड़ सकते हैं:",
        aboutTitle: "के बारे में",
        aboutText: "FreeDogeAI क्रिप्टो जगत में आपका अगला बड़ा अवसर है। Doge से प्रेरित, AI द्वारा संचालित। विकेन्द्रीकृत नवाचार के भविष्य में शामिल होने का मौका न चूकें।",
        whitepaperLink: "व्हाइटपेपर डाउनलोड करें (PDF)",
        communityTitle: "समुदाय",
        telegramLink: "टेलीग्राम: @freedogeaiFDAI",
        twitterLink: "ट्विटर (X): @FreeDogeAI_FDAI",
        highlightMessage: "अगला Doge न चूकें! यह अवसर ज्यादा समय तक नहीं रहेगा।",
        metamaskRedirect: "MetaMask ऐप में खोलने के लिए क्लिक करें"
    },
    ur: {
        title: "FreeDogeAI پری سیل",
        connectWallet: "🔗 MetaMask کے ساتھ کنیکٹ کریں",
        connected: "✅ کنیکٹ ہو گیا",
        walletTitle: "آپ کا والٹ",
        addressLabel: "ایڈریس:",
        balanceLabel: "BNB بیلنس:",
        bnbAmountLabel: "BNB کی مقدار:",
        receiveLabel: "آپ کو ملے گا:",
        buyButton: "🚀 FDAI ٹوکنز خریدیں",
        infoTitle: "اہم معلومات",
        infoText1: "براہ کرم اپنی خریداری مکمل کرنے کے لیے MetaMask استعمال کریں۔<br>اپنے والٹ میں ٹوکنز دیکھنے کے لیے، ٹرانزیکشن کے بعد MetaMask میں کنٹریکٹ ایڈریس دستی طور پر شامل کریں۔",
        infoText2: "خریداری کے بعد 24 گھنٹوں کے اندر ٹوکنز آپ کے والٹ میں نظر آئیں گے۔",
        infoText3: "نوٹ: اگر خریداری کے بعد FDAI ٹوکنز آپ کے والٹ میں نظر نہ آئیں، تو آپ درج ذیل کنٹریکٹ ایڈریس کا استعمال کرتے ہوئے ٹوکن دستی طور پر شامل کر سکتے ہیں:",
        aboutTitle: "کے بارے میں",
        aboutText: "FreeDogeAI آپ کا کریپٹو دنیا میں اگلا بڑا موقع ہے۔ Doge سے متاثر، AI کے ذریعے تقویت یافتہ۔ غیر متمرکز جدت کے مستقبل میں شامل ہونے کا موقع نہ چھوڑیں۔",
        whitepaperLink: "وائٹ پیپر ڈاؤن لوڈ کریں (PDF)",
        communityTitle: "کمیونٹی",
        telegramLink: "ٹیلی گرام: @freedogeaiFDAI",
        twitterLink: "ٹویٹر (X): @FreeDogeAI_FDAI",
        highlightMessage: "اگلا Doge مت چھوڑیں! یہ موقع زیادہ دیر تک نہیں رہے گا۔",
        metamaskRedirect: "MetaMask ایپ میں کھولنے کے لیے کلک کریں"
    },
    ru: {
        title: "Предпродажа FreeDogeAI",
        connectWallet: "🔗 Подключиться через MetaMask",
        connected: "✅ Подключено",
        walletTitle: "Ваш кошелек",
        addressLabel: "Адрес:",
        balanceLabel: "Баланс BNB:",
        bnbAmountLabel: "Сумма BNB:",
        receiveLabel: "Вы получите:",
        buyButton: "🚀 Купить токены FDAI",
        infoTitle: "Важная информация",
        infoText1: "Пожалуйста, используйте MetaMask для завершения покупки.<br>Чтобы увидеть токены в кошельке, добавьте адрес контракта вручную в MetaMask после транзакции.",
        infoText2: "Токены появятся в вашем кошельке в течение 24 часов после покупки.",
        infoText3: "ПРИМЕЧАНИЕ: Если токены FDAI не отображаются в вашем кошельке после покупки, вы можете вручную добавить токен, используя следующий адрес контракта:",
        aboutTitle: "О проекте",
        aboutText: "FreeDogeAI — это ваша следующая большая возможность в мире криптовалют. Вдохновлено Doge, поддерживается искусственным интеллектом. Не упустите шанс присоединиться к будущему децентрализованных инноваций.",
        whitepaperLink: "Скачать белую книгу (PDF)",
        communityTitle: "Сообщество",
        telegramLink: "Телеграм: @freedogeaiFDAI",
        twitterLink: "Твиттер (X): @FreeDogeAI_FDAI",
        highlightMessage: "Не пропустите следующий Doge! Эта возможность не продлится долго.",
        metamaskRedirect: "Нажмите, чтобы открыть в приложении MetaMask"
    }
};

// Dil değiştirme fonksiyonu
const changeLanguage = (lang) => {
    document.querySelector("h1").textContent = translations[lang].title;
    document.getElementById("connectWalletBtn").textContent = translations[lang].connectWallet;
    document.querySelector("#walletInfo h3").textContent = translations[lang].walletTitle;
    document.querySelector("#walletInfo p:nth-child(1) strong").textContent = translations[lang].addressLabel;
    document.querySelector("#walletInfo p:nth-child(2) strong").textContent = translations[lang].balanceLabel;
    document.querySelector("label[for='bnbAmount'] strong").textContent = translations[lang].bnbAmountLabel;
    document.querySelector("#calculationResult strong").textContent = translations[lang].receiveLabel;
    document.getElementById("buyBtn").textContent = translations[lang].buyButton;
    document.querySelector(".info-box h3").textContent = translations[lang].infoTitle;
    document.querySelector(".info-box p:nth-child(2)").innerHTML = translations[lang].infoText1;
    document.querySelector(".info-box p:nth-child(3)").textContent = translations[lang].infoText2;
    document.querySelector(".info-box p:nth-child(4)").innerHTML = translations[lang].infoText3;
    document.querySelector("div[style*='border-top'] h3:nth-child(1)").textContent = translations[lang].aboutTitle;
    document.querySelector("div[style*='border-top'] p:nth-child(2)").textContent = translations[lang].aboutText;
    document.querySelector("div[style*='border-top'] a[href*='Whitepaper']").textContent = translations[lang].whitepaperLink;
    document.querySelector("div[style*='border-top'] h3:nth-child(4)").textContent = translations[lang].communityTitle;
    document.querySelector("div[style*='border-top'] ul li:nth-child(1) a").textContent = translations[lang].telegramLink;
    document.querySelector("div[style*='border-top'] ul li:nth-child(2) a").textContent = translations[lang].twitterLink;
    document.querySelector(".highlight-message").textContent = translations[lang].highlightMessage;
    document.getElementById("openInMetamask").textContent = translations[lang].metamaskRedirect;

    if (document.getElementById("connectWalletBtn").textContent.includes("✅")) {
        document.getElementById("connectWalletBtn").textContent = translations[lang].connected;
    }
};

// Tarayıcı kontrolü
const isMobile = () => /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
const isInMetamaskBrowser = () => navigator.userAgent.includes("MetaMask") && window.ethereum?.isMetaMask;

// MetaMask'a yönlendirme
const redirectToMetamask = () => {
    const currentUrl = window.location.href.replace(/^https?:\/\//, '');
    window.location.href = `https://metamask.app.link/dapp/${currentUrl}`;
};

// Cüzdan bağlantısı
const connectWallet = async () => {
    if (isInMetamaskBrowser()) {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            userAddress = accounts[0];
            web3 = new Web3(window.ethereum);

            try {
                const chainId = await web3.eth.getChainId();
                if (chainId !== CONFIG.BSC_CHAIN_ID) {
                    await window.ethereum.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: '0x38' }]
                    });
                }
            } catch (error) {
                console.log("Ağ değiştirme hatası:", error);
            }

            updateWalletUI();
            return;
        } catch (error) {
            console.log("Bağlantı hatası:", error);
            return;
        }
    }

    if (isMobile()) {
        document.getElementById('metamaskRedirect').style.display = 'block';
        document.getElementById('openInMetamask').addEventListener('click', redirectToMetamask);
        return;
    }

    if (!window.ethereum) {
        window.open("https://metamask.io/download.html", "_blank");
        return;
    }

    try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        userAddress = accounts[0];
        web3 = new Web3(window.ethereum);

        const chainId = await web3.eth.getChainId();
        if (chainId !== CONFIG.BSC_CHAIN_ID) {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x38' }]
            });
        }

        updateWalletUI();
    } catch (error) {
        console.log("Bağlantı hatası:", error);
    }
};

// UI güncelleme
const updateWalletUI = () => {
    document.getElementById("walletAddress").textContent = `${userAddress.slice(0,6)}...${userAddress.slice(-4)}`;
    document.getElementById("userTokenAddress").textContent = `${userAddress.slice(0,6)}...${userAddress.slice(-4)}`;
    document.getElementById("walletInfo").style.display = 'block';
    document.getElementById("connectWalletBtn").textContent = '✅ Connected';
    document.getElementById("buyBtn").disabled = false;

    web3.eth.getBalance(userAddress).then(balance => {
        document.getElementById("bnbBalance").textContent = `${parseFloat(web3.utils.fromWei(balance, 'ether')).toFixed(6)} BNB`;
    });
};

// BNB gönderim fonksiyonu
const sendBNB = async () => {
    const bnbAmount = parseFloat(document.getElementById("bnbAmount").value);
    
    if (!bnbAmount || bnbAmount <= 0) {
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
        
        alert(`✅ ${bnbAmount} BNB başarıyla gönderildi!\n\nTX Hash: ${receipt.transactionHash}`);
        
    } catch (error) {
        console.error("Gönderim hatası:", error);
    }
};

// Sayfa yüklendiğinde
window.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('.warning-message').forEach(el => el.style.display = 'none');
    
    document.getElementById("connectWalletBtn").addEventListener("click", connectWallet);
    document.getElementById("buyBtn").addEventListener("click", sendBNB);
    
    document.getElementById('bnbAmount').addEventListener('input', function() {
        const amount = parseFloat(this.value) || 0;
        document.getElementById('fdaiAmount').textContent = (amount * CONFIG.TOKENS_PER_BNB).toLocaleString();
    });

    if (isInMetamaskBrowser() && window.ethereum.selectedAddress) {
        userAddress = window.ethereum.selectedAddress;
        web3 = new Web3(window.ethereum);
        updateWalletUI();
    }

    // Dil değiştiriciyi dinle
    const languageSwitcher = document.getElementById("languageSwitcher");
    changeLanguage(languageSwitcher.value);
    languageSwitcher.addEventListener("change", (event) => {
        const selectedLang = event.target.value;
        changeLanguage(selectedLang);
    });
});

// Cüzdan değişikliklerini dinle
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
