let userAddress = "";

async function connectWallet() {
  if (window.ethereum) {
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      userAddress = accounts[0];

      // Mobil imza al (isteğe bağlı ama güvenlik için önerilir)
      const signature = await ethereum.request({
        method: "personal_sign",
        params: ["FDAI Presale Access", userAddress],
      });

      document.getElementById("userAddress").innerText = userAddress;

      const web3 = new Web3(window.ethereum);
      const balanceWei = await web3.eth.getBalance(userAddress);
      const balanceBNB = web3.utils.fromWei(balanceWei, "ether");
      document.getElementById("bnbBalance").innerText = parseFloat(balanceBNB).toFixed(4);

      document.getElementById("walletInfo").style.display = "block";
    } catch (error) {
      console.error("Connection failed", error);
      alert("Wallet connection failed: " + error.message);
    }
  } else {
    // Eğer tarayıcıda MetaMask yoksa deeplink ile yönlendir
    const dappURL = window.location.href.replace("https://", "");
    window.location.href = `https://metamask.app.link/dapp/${dappURL}`;
  }
}

document.getElementById("connectButton").addEventListener("click", connectWallet);
