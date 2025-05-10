// YENİ URL OLUŞTURMA SİSTEMİ
function createMetaMaskDeepLink() {
    // 1. Temel URL'yi al
    let baseUrl = window.location.href.split('?')[0];
    
    // 2. Protokolü kaldır ve küçük harfe çevir
    baseUrl = baseUrl.replace(/^https?:\/\//i, '')
                   .toLowerCase()
                   .replace(/\s+/g, ''); // Tüm boşlukları kaldır
    
    // 3. Özel karakterleri temizle
    const cleanPath = baseUrl.split('/').map(segment => {
        return encodeURIComponent(segment.replace(/[^a-z0-9-._~]/g, ''));
    }).join('/');
    
    // 4. Son URL'yi oluştur
    return `https://metamask.app.link/dapp/${cleanPath}?mobileSign=true`;
}

// MOBILE BAĞLANTI FONKSİYONU (GÜNCELLENMİŞ)
async function handleMobileConnection() {
    try {
        // MetaMask kontrolü
        if (!window.ethereum) {
            const deeplink = createMetaMaskDeepLink();
            console.log("Generated Deep Link:", deeplink);
            
            // URL'yi doğrulama
            if (!deeplink.includes(' ')) {
                window.location.href = deeplink;
                setTimeout(() => {
                    window.location.href = `${window.location.origin}${window.location.pathname}?mobileSign=true`;
                }, 3000);
            } else {
                throw new Error("URL contains invalid characters");
            }
            return;
        }
        
        // Normal bağlantı akışı
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        userAddress = accounts[0];
        web3 = new Web3(window.ethereum);
        
        await signMessage();
        await switchToBSC();
        updateWalletUI();
        
    } catch (error) {
        console.error("Mobile connection error:", error);
        alert("Bağlantı hatası: Lütfen MetaMask uygulamasını elle açın");
    }
}
