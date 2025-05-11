async function connectWallet() {
    try {
        // MetaMask yüklü mü?
        if (!window.ethereum) {
            const currentUrl = window.location.href.replace(/^https?:\/\//, '');
            // MetaMask yüklü değilse mobilde açılmasını sağla
            if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
                window.location.href = `https://metamask.app.link/dapp/${currentUrl}`;
            } else {
                window.open("https://metamask.io/download.html", "_blank");
            }
            return;
        }

        // MetaMask yüklü ve tarayıcıda destekliyorsa direkt bağlan
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        userAddress = accounts[0];
        web3 = new Web3(window.ethereum);

        // Zincir kontrolü (BSC değilse geçiş isteği)
        const chainId = await web3.eth.getChainId();
        if (chainId !== CONFIG.BSC_CHAIN_ID) {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x38' }]
            });
        }

        updateWalletUI();

    } catch (error) {
        alert("Bağlantı başarısız. MetaMask’ta bağlantıyı onayladığından emin ol.");
        console.error("Connection error:", error);
    }
}
