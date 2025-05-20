import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import './App.css';

const APP_CONFIG = {
  RECEIVER_ADDRESS: '0xd924e01c7d319c5B23708Cd622bD1143CD4Fb360',
  DEFAULT_AMOUNT: 0.1,
  COMPANY_NAME: "Crypto Payment App",
  BSC_NETWORK: {
    chainId: '0x38',
    chainName: 'Binance Smart Chain',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18
    },
    rpcUrls: ['https://bsc-dataseed.binance.org/'],
    blockExplorerUrls: ['https://bscscan.com/']
  }
};

const App = () => {
  const [state, setState] = useState({
    account: '',
    balance: '0',
    network: '',
    paymentAmount: APP_CONFIG.DEFAULT_AMOUNT.toString(),
    transactionHash: '',
    isMobile: false,
    isLoading: false,
    isConnected: false,
    error: null
  });

  useEffect(() => {
    const detectMobile = () => {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    };

    const initializeApp = async () => {
      try {
        setState(prev => ({ ...prev, isMobile: detectMobile() }));
        
        if (window.ethereum) {
          await setupEventListeners();
          await checkWalletConnection();
        }
      } catch (error) {
        handleError(error, 'Initialization error');
      }
    };

    initializeApp();

    return () => {
      cleanupEventListeners();
    };
  }, []);

  const checkWalletConnection = async () => {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        await setupWallet(accounts[0]);
      }
    } catch (error) {
      handleError(error, 'Wallet connection check failed');
    }
  };

  const connectWallet = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      if (state.isMobile && !window.ethereum?.isMetaMask) {
  window.location.href = "https://metamask.app.link/dapp/buyfreedogeai.org";
  return;
      }
      
      if (state.isMobile) {
        window.location.href = `https://metamask.app.link/dapp/${window.location.hostname}`;
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      await switchToBscNetwork();
      await setupWallet(accounts[0]);
      
      setState(prev => ({ ...prev, isConnected: true }));
    } catch (error) {
      handleError(error, 'Wallet connection failed');
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const setupWallet = async (account) => {
    try {
      const web3 = new Web3(window.ethereum);
      const balanceWei = await web3.eth.getBalance(account);
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      
      setState(prev => ({
        ...prev,
        account,
        balance: web3.utils.fromWei(balanceWei, 'ether'),
        network: getNetworkName(chainId),
        error: null
      }));
    } catch (error) {
      handleError(error, 'Wallet setup failed');
    }
  };

  const switchToBscNetwork = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: APP_CONFIG.BSC_NETWORK.chainId }],
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [APP_CONFIG.BSC_NETWORK],
          });
        } catch (addError) {
          throw new Error('Failed to add BSC network to MetaMask');
        }
      }
    }
  };

  const handlePayment = async () => {
    try {
      validatePayment();
      
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const web3 = new Web3(window.ethereum);
      const amountInWei = web3.utils.toWei(state.paymentAmount, 'ether');
      
      const tx = await web3.eth.sendTransaction({
        from: state.account,
        to: APP_CONFIG.RECEIVER_ADDRESS,
        value: amountInWei,
        gas: 21000
      });

      const newBalance = await web3.eth.getBalance(state.account);
      
      setState(prev => ({
        ...prev,
        transactionHash: tx.transactionHash,
        balance: web3.utils.fromWei(newBalance, 'ether'),
        isLoading: false
      }));

    } catch (error) {
      handleError(error, 'Payment failed');
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const validatePayment = () => {
    if (!state.account) {
      throw new Error('Please connect your wallet first');
    }

    const amount = parseFloat(state.paymentAmount);
    if (isNaN(amount) || amount <= 0) {
      throw new Error('Please enter a valid BNB amount');
    }
  };

  const setupEventListeners = () => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts) => {
      if (accounts.length > 0) {
        setupWallet(accounts[0]);
      } else {
        resetWalletState();
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    };
  };

  const cleanupEventListeners = () => {
    if (window.ethereum) {
      window.ethereum.removeAllListeners('accountsChanged');
      window.ethereum.removeAllListeners('chainChanged');
    }
  };

  const resetWalletState = () => {
    setState({
      account: '',
      balance: '0',
      network: '',
      paymentAmount: APP_CONFIG.DEFAULT_AMOUNT.toString(),
      transactionHash: '',
      isMobile: false,
      isLoading: false,
      isConnected: false,
      error: null
    });
  };

  const handleError = (error, context) => {
    console.error(`${context}:`, error);
    setState(prev => ({
      ...prev,
      error: error.message,
      isLoading: false
    }));
    alert(`${context}: ${error.message}`);
  };

  const getNetworkName = (chainId) => {
    switch (chainId) {
      case '0x1': return 'Ethereum Mainnet';
      case '0x38': return 'Binance Smart Chain';
      case '0x61': return 'BSC Testnet';
      case '0x89': return 'Polygon Mainnet';
      default: return `Network (${chainId})`;
    }
  };

  const formatAddress = (address) => {
    return address ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : '';
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>{APP_CONFIG.COMPANY_NAME}</h1>
        <p className="app-subtitle">BNB Payment Gateway</p>
      </header>
      
      <main className="app-content">
        {!state.isConnected ? (
          <div className="connection-section">
            <button 
              onClick={connectWallet} 
              className="connect-button"
              disabled={state.isLoading}
            >
              {state.isLoading ? 'Connecting...' : 'Connect Wallet'}
            </button>
            {state.error && <p className="error-message">{state.error}</p>}
          </div>
        ) : (
          <div className="wallet-dashboard">
            <section className="wallet-info">
              <h2>Wallet Details</h2>
              <div className="info-row">
                <span>Address:</span>
                <span>{formatAddress(state.account)}</span>
              </div>
              <div className="info-row">
                <span>Network:</span>
                <span>{state.network}</span>
              </div>
              <div className="info-row">
                <span>Balance:</span>
                <span>{parseFloat(state.balance).toFixed(4)} BNB</span>
              </div>
            </section>

            <section className="payment-section">
              <h2>Send Payment</h2>
              <div className="input-group">
                <label htmlFor="amount">BNB Amount:</label>
                <input
                  id="amount"
                  type="number"
                  value={state.paymentAmount}
                  onChange={(e) => setState(prev => ({ ...prev, paymentAmount: e.target.value }))}
                  min="0.0001"
                  step="0.0001"
                  disabled={state.isLoading}
                />
              </div>

              <div className="recipient-info">
                <h3>Recipient Details</h3>
                <div className="info-row">
                  <span>Address:</span>
                  <span>{formatAddress(APP_CONFIG.RECEIVER_ADDRESS)}</span>
                </div>
              </div>

              <button 
                onClick={handlePayment} 
                className="payment-button"
                disabled={state.isLoading}
              >
                {state.isLoading ? 'Processing...' : `Send ${state.paymentAmount} BNB`}
              </button>
              {state.error && <p className="error-message">{state.error}</p>}
            </section>

            {state.transactionHash && (
              <section className="transaction-info">
                <h3>Transaction Details</h3>
                <a
                  href={`https://bscscan.com/tx/${state.transactionHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transaction-link"
                >
                  View on BSCScan
                </a>
              </section>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
