// MOBILE CONNECTION FIXED VERSION
async function handleMobileConnection() {
    try {
        // 1. Önce doğrudan bağlantı deneyelim
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        userAddress = accounts[0];
        web3 = new Web3(window.ethereum);
        
        // 2. İmza isteği
        await signMessage();
        
        // 3. Ağ değişimi
        await switchToBSC();
        
        updateWalletUI();
        
    } catch (error) {
        console.log("Direct connection failed, using fallback...");
        
        // 4. DÜZGÜN URL OLUŞTURMA
        const currentUrl = window.location.href;
        const baseUrl = currentUrl.split('?')[0]
            .replace(/^https?:\/\//, '') // Protokolü kaldır
            .replace(/\s+/g, '')         // Boşlukları temizle
            .toLowerCase();              // Küçük harfe çevir
        
        // 5. MetaMask Deep Link
        const deeplink = `https://metamask.app.link/dapp/${baseUrl}?mobileSign=true`;
        console.log("Generated Deep Link:", deeplink); // Debug için
        
        // 6. MetaMask'i aç
        window.location.href = deeplink;
        
        // 7. 3 sn sonra geri dön
        setTimeout(() => {
            window.location.href = `${window.location.origin}${window.location.pathname}?mobileSign=true`;
        }, 3000);
    }
}

// URL DOĞRULAMA FONKSİYONU
function validateUrl(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}
