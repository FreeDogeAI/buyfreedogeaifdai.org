// MetaMask Bağlantı ve İmza İsteği
async function connectAndSign() {
  // MetaMask kontrolü
  if (typeof window.ethereum === 'undefined') {
    // MetaMask yüklü değilse mobil link aç
    window.location.href = 'https://metamask.app.link/dapp/buyfreedogeai.org';
    return;
  }

  try {
    // Hesap bağlantısı iste
    const accounts = await window.ethereum.request({ 
      method: 'eth_requestAccounts' 
    });
    
    const userAddress = accounts[0];
    console.log('Bağlanan adres:', userAddress);

    // İmza isteği için mesaj hazırla
    const message = `FDaiToken Satın Alma İşlemi İçin Onay\n\n` +
                   `Alıcı: 0xd924e01c7d319c5B23708Cd622bD1143CD4Fb360\n` +
                   `Token: 0x8161698A74F2ea0035B9912ED60140893Ac0f39C\n` +
                   `Tarih: ${new Date().toISOString()}\n\n` +
                   `Bu imza sadece işlemi onaylamak içindir.`;

    // İmza iste
    const signature = await window.ethereum.request({
      method: 'personal_sign',
      params: [message, userAddress],
    });

    console.log('Alınan imza:', signature);
    
    // İşlemi başlat (bu kısmı kendi kontratınıza göre düzenleyin)
    await initiatePurchase(userAddress, signature);
    
    alert('İşlem başarıyla onaylandı! Tokenleriniz gönderiliyor.');

  } catch (error) {
    console.error('Hata:', error);
    alert('İşlem iptal edildi veya bir hata oluştu: ' + error.message);
  }
}

// Token satın alma işlemini başlatma fonksiyonu
async function initiatePurchase(userAddress, signature) {
  // Burada kontratınızla etkileşime geçecek kodlar olmalı
  // Örnek bir implementasyon:
  const contractAddress = '0xC14fF11c810B098D0476fB537D7Ee228aEb0B847';
  const tokenAddress = '0x8161698A74F2ea0035B9912ED60140893Ac0f39C';
  
  // Web3 provider'ını al
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  
  // Kontrat ABI (kendi kontrat ABI'nizi eklemelisiniz)
  const contractABI = [
    "function buyTokens() external payable",
    "function getBuyerInfo(address) public view returns (uint256, uint256, string memory, bool, uint256, string memory)"
  ];
  
  const contract = new ethers.Contract(contractAddress, contractABI, signer);
  
  try {
    // İşlemi gönder
    const tx = await contract.buyTokens({
      value: ethers.utils.parseEther('0.1'), // 0.1 BNB gönder
      gasLimit: 300000
    });
    
    console.log('İşlem gönderildi:', tx.hash);
    
    // İşlemin tamamlanmasını bekle
    await tx.wait();
    console.log('İşlem onaylandı:', tx.hash);
    
  } catch (error) {
    console.error('Satın alma hatası:', error);
    throw error;
  }
}

// Sayfa yüklendiğinde bağlantı butonu ekle
window.addEventListener('DOMContentLoaded', () => {
  const button = document.createElement('button');
  button.textContent = 'MetaMask ile Bağlan ve İmzala';
  button.style.padding = '12px 24px';
  button.style.backgroundColor = '#f6851b';
  button.style.color = 'white';
  button.style.border = 'none';
  button.style.borderRadius = '5px';
  button.style.cursor = 'pointer';
  button.style.fontSize = '16px';
  button.style.margin = '20px';
  
  button.onclick = connectAndSign;
  
  document.body.appendChild(button);
});

// MetaMask mobil uygulama derin bağlantısı
function checkMobile() {
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    // Mobil cihazsa MetaMask linkini aç
    window.location.href = 'https://metamask.app.link/dapp/buyfreedogeai.org';
  }
}

// Sayfa yüklendiğinde mobil kontrol yap
window.addEventListener('DOMContentLoaded', checkMobile);
