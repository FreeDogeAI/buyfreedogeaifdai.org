// FreeDogeAI Presale JavaScript

const CONFIG = { RECEIVE_WALLET: "0xd924e01c7d319c5b23708cd622bd1143cd4fb360", TOKENS_PER_BNB: 120000000000, CONTRACT_ADDRESS: "0x8161698A74F2ea0035B9912ED60140893Ac0f39C" };

let web3; let userAddress = "";

async function connectWallet() { if (typeof window.ethereum !== 'undefined') { try { const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }); userAddress = accounts[0]; web3 = new Web3(window.ethereum); document.getElementById('walletStatus').innerText = 'Connected: ' + userAddress.slice(0, 6) + '...' + userAddress.slice(-4); } catch (err) { alert('Wallet connection rejected.'); } } else { const url = https://metamask.app.link/dapp/${window.location.href.replace(/^https?:\/\//, '')}; window.location.href = url; } }

async function buyTokens() { const amount = parseFloat(document.getElementById('bnbAmount').value); if (!amount || amount <= 0) { alert('Enter valid BNB amount.'); return; }

const weiAmount = web3.utils.toWei(amount.toString(), 'ether'); try { const tx = await web3.eth.sendTransaction({ from: userAddress, to: CONFIG.RECEIVE_WALLET, value: weiAmount }); alert(✅ Transaction sent! TX: ${tx.transactionHash}); } catch (err) { console.error(err); alert("Transaction failed"); } }

window.addEventListener('DOMContentLoaded', () => { document.getElementById('connectBtn')?.addEventListener('click', connectWallet); document.getElementById('buyBtn')?.addEventListener('click', buyTokens); });
