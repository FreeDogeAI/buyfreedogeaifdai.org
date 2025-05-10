// TAM ÇALIŞAN KOD (SİZİN SİTENİZ İÇİN ÖZEL)
async function connectWallet() {
  if (!window.ethereum) {
    if (isMobile) {
      // SİZİN SİTENİZ İÇİN MANUEL URL
      const manualUrl = "https://metamask.app.link/dapp/freedogeai.github.io/FreeDogeAI-Forge?mobileSign=true";
      
      console.log("MetaMask Bağlantı Linki:", manualUrl); // Debug
      
      // 1. MetaMask'i aç
      window.location.href = manualUrl;
      
      // 2. 3 saniye sonra geri dön
      setTimeout(() => {
        window.location.href = "https://freedogeai.github.io/FreeDogeAI-Forge/?mobileSign=true";
      }, 3000);
      return;
    }
    alert("Lütfen MetaMask yükleyin: https://metamask.io/download.html");
    return;
  }

  // Normal bağlantı akışı
  try {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    userAddress = accounts[0];
    web3 = new Web3(window.ethereum);
    updateWalletUI();
  } catch (error) {
    console.error("Bağlantı hatası:", error);
  }
}
