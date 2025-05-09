// Configuration
const CONFIG = {
    RECEIVE_WALLET: "0xd924e01c7d319c5b23708cd622bd1143cd4fb360",
    TOKENS_PER_BNB: 120000000000,
    BSC_CHAIN_ID: 56
};

// App state
let web3;
let userAddress = "";

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log("1. Page loaded, initializing JavaScript...");

    // Connect Wallet button
    const connectWalletBtn = document.getElementById('connectWalletBtn');
    if (connectWalletBtn) {
        console.log("2. Connect Wallet button found!");
        connectWalletBtn.addEventListener('click', () => {
            console.log("3. Connect Wallet button clicked!");
            connectWallet();
        });
    } else {
        console.error("ERROR: Connect Wallet button not found! Check if 'connectWalletBtn' ID exists in HTML.");
    }

    // Buy button
    const buyBtn = document.getElementById('buyBtn');
    if (buyBtn) {
        console.log("4. Buy button found!");
        buyBtn.addEventListener('click', () => {
            console.log("5. Buy button clicked!");
            sendBNB();
        });
    } else {
        console.error("ERROR: Buy button not found! Check if 'buyBtn' ID exists in HTML.");
    }

    // BNB Amount input
    const bnbAmountInput = document.getElementById('bnbAmount');
    if (bnbAmountInput) {
        console.log("6. BNB Amount input found!");
        bnbAmountInput.addEventListener('input', () => {
            console.log("7. BNB Amount input changed!");
            calculateFDAI();
        });
    } else {
        console.error("ERROR: BNB Amount input not found! Check if 'bnbAmount' ID exists in HTML.");
    }

    // Language select (for now, just log the change)
    const langSelect = document.getElementById('languageSelect');
    if (langSelect) {
        console.log("8. Language select found!");
        langSelect.addEventListener('change', () => {
            console.log("9. Language selection changed to:", langSelect.value);
            changeLanguage();
        });
    } else {
        console.error("ERROR: Language select not found! Check if 'languageSelect' ID exists in HTML.");
    }

    // Check if already connected
    if (window.ethereum && window.ethereum.selectedAddress) {
        console.log("10. Auto-connecting to MetaMask...");
        userAddress = window.ethereum.selectedAddress;
        web3 = new Web3(window.ethereum);
        updateWalletUI();
    } else {
        console.log("10. No auto-connection, MetaMask not connected yet.");
    }
});

// Wallet connection handler
async function connectWallet() {
    console.log("11. Attempting to connect wallet...");
    try {
        if (!window.ethereum) {
            console.log("12. MetaMask not detected!");
            if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
                const currentUrl = window.location.href.replace(/^https?:\/\//, '');
                const deepLink = `https://metamask.app.link/dapp/${currentUrl}`;
                console.log("13. Redirecting to MetaMask app:", deepLink);
                window.location.href = deepLink;

                const metamaskRedirect = document.getElementById('metamaskRedirect');
                if (metamaskRedirect) {
                    console.log("14. Showing MetaMask redirect message...");
                    metamaskRedirect.style.display = 'block';
                    const openInMetamaskLink = document.getElementById('openInMetamask');
                    if (openInMetamaskLink) {
                        openInMetamaskLink.textContent = "Click to open in MetaMask app";
                        openInMetamaskLink.href = deepLink;
                    }
                }
            } else {
                console.log("13. Opening MetaMask download page...");
                window.open("https://metamask.io/download.html", "_blank");
            }
            return;
        }

        console.log("12. Requesting accounts from MetaMask...");
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        userAddress = accounts[0];
        web3 = new Web3(window.ethereum);
        console.log("13. Connected to MetaMask, user address:", userAddress);

        try {
            const chainId = await web3.eth.getChainId();
            console.log("14. Current chain ID:", chainId);
            if (chainId !== CONFIG.BSC_CHAIN_ID) {
                console.log("15. Switching to BSC Mainnet...");
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: '0x38' }]
                });
                console.log("16. Switched to BSC Mainnet");
            }
        } catch (error) {
            console.error("ERROR: Network switch failed:", error.message);
        }

        updateWalletUI();
    } catch (error) {
        console.error("ERROR: Connection error:", error.message);
        alert("Failed to connect to MetaMask: " + error.message);
    }
}

// Update UI after connection
function updateWalletUI() {
    console.log("17. Updating wallet UI...");
    const walletAddressElement = document.getElementById('walletAddress');
    const userTokenAddressElement = document.getElementById('userTokenAddress');
    const walletInfoElement = document.getElementById('walletInfo');
    const connectWalletBtn = document.getElementById('connectWalletBtn');
    const buyBtn = document.getElementById('buyBtn');

    if (!walletAddressElement || !userTokenAddressElement || !walletInfoElement || !connectWalletBtn || !buyBtn) {
        console.error("ERROR: One or more UI elements not found!");
        return;
    }

    const shortAddress = `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`;
    walletAddressElement.textContent = shortAddress;
    userTokenAddressElement.textContent = shortAddress;

    walletInfoElement.style.display = 'block';
    connectWalletBtn.textContent = "✅ Connected";
    buyBtn.disabled = false;

    if (web3) {
        web3.eth.getBalance(userAddress).then(balance => {
            const bnbBalanceElement = document.getElementById('bnbBalance');
            if (bnbBalanceElement) {
                const bnbBalance = web3.utils.fromWei(balance, 'ether');
                bnbBalanceElement.textContent = `${parseFloat(bnbBalance).toFixed(6)} BNB`;
                console.log("18. BNB Balance updated:", bnbBalanceElement.textContent);
            }
        }).catch(error => {
            console.error("ERROR: Failed to fetch balance:", error.message);
        });
    }
}

// Calculate FDAI tokens
function calculateFDAI() {
    console.log("19. Calculating FDAI tokens...");
    const bnbAmountInput = document.getElementById('bnbAmount');
    const fdaiAmountElement = document.getElementById('fdaiAmount');

    if (!bnbAmountInput || !fdaiAmountElement) {
        console.error("ERROR: BNB Amount or FDAI Amount element not found!");
        return;
    }

    const amount = parseFloat(bnbAmountInput.value) || 0;
    fdaiAmountElement.textContent = (amount * CONFIG.TOKENS_PER_BNB).toLocaleString();
    console.log("20. FDAI amount updated:", fdaiAmountElement.textContent);
}

// Send BNB transaction
async function sendBNB() {
    console.log("21. Sending BNB transaction...");
    const bnbAmountInput = document.getElementById('bnbAmount');
    if (!bnbAmountInput) {
        console.error("ERROR: BNB Amount input not found!");
        return;
    }

    const bnbAmount = parseFloat(bnbAmountInput.value);
    if (!bnbAmount || bnbAmount <= 0) {
        console.log("22. Invalid BNB amount entered:", bnbAmount);
        alert("Please enter a valid amount!");
        return;
    }

    if (!web3 || !userAddress) {
        console.error("ERROR: Wallet not connected!");
        alert("Please connect your wallet first!");
        return;
    }

    try {
        const weiAmount = web3.utils.toWei(bnbAmount.toString(), 'ether');
        console.log("23. Transaction details - Amount in Wei:", weiAmount);

        const tx = {
            from: userAddress,
            to: CONFIG.RECEIVE_WALLET,
            value: weiAmount,
            gas: 300000,
            gasPrice: await web3.eth.getGasPrice()
        };

        console.log("24. Sending transaction:", tx);
        const receipt = await web3.eth.sendTransaction(tx);
        console.log("25. Transaction successful, receipt:", receipt);

        const message = `✅ ${bnbAmount} BNB successfully sent!\n\nYou will receive: ${(bnbAmount * CONFIG.TOKENS_PER_BNB).toLocaleString()} FDAI\nTX Hash: ${receipt.transactionHash}`;
        alert(message);
    } catch (error) {
        console.error("ERROR: Transaction failed:", error.message);
        alert("Transaction failed: " + error.message);
    }
}

// Language change (minimal for now)
function changeLanguage() {
    console.log("26. Language change triggered...");
    const langSelect = document.getElementById('languageSelect');
    if (langSelect) {
        console.log("27. Current language:", langSelect.value);
        // We'll add full language support later
    } else {
        console.error("ERROR: Language select not found!");
    }
}

// Handle account and chain changes
if (window.ethereum) {
    window.ethereum.on('accountsChanged', (accounts) => {
        console.log("28. Accounts changed:", accounts);
        if (accounts.length > 0) {
            userAddress = accounts[0];
            web3 = new Web3(window.ethereum);
            updateWalletUI();
        } else {
            const walletInfoElement = document.getElementById('walletInfo');
            const connectWalletBtn = document.getElementById('connectWalletBtn');
            const buyBtn = document.getElementById('buyBtn');

            if (walletInfoElement && connectWalletBtn && buyBtn) {
                walletInfoElement.style.display = 'none';
                connectWalletBtn.textContent = "🔗 Connect with MetaMask";
                buyBtn.disabled = true;
                userAddress = "";
                web3 = null;
                console.log("29. Disconnected from MetaMask");
            }
        }
    });

    window.ethereum.on('chainChanged', () => {
        console.log("30. Chain changed, reloading page...");
        window.location.reload();
    });
}
