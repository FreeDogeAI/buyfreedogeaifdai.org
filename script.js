// SADECE SİZİN SİTENİZ İÇİN ÇALIŞACAK KOD
async function connectWallet() {
  if (!window.ethereum) {
    if (isMobile) {
      // 1. KESİN ÇÖZÜM URL'Sİ (Tüm hataları bypass eder)
      const fixedUrl = "https://freedogeai.github.io/FreeDogeAI-Forge/";
      
      // 2. Debug için konsola yazdır
      console.log("Fixed MetaMask URL:", fixedUrl);
      
      // 3. MetaMask'i aç
      window.location.href = fixedUrl;
      
      // 4. 5 saniye sonra geri dön
      setTimeout(() => {
        window.location.href = "https://freedogeai.github.io/FreeDogeAI-Forge/?connected=true";
      }, 5000);
      return;
    }
    alert("MetaMask bulunamadı! Lütfen yükleyin.");
    return;
  }

  // Normal bağlantı akışı
  try {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    userAddress = accounts[0];
    web3 = new Web3(window.ethereum);
    updateWalletUI();
  } catch (error) {
    console.error("Connection error:", error);
    alert("Bağlantı başarısız: " + error.message);
  }
}
