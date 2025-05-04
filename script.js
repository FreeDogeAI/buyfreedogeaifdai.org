let currentFile = null;
let files = JSON.parse(localStorage.getItem('files')) || {
    'FDAIPresale.sol': `pragma solidity ^0.8.17;

// SPDX-License-Identifier: Unlicense
contract FDAIPresale {
    address public owner;
    IERC20 public token;
    address public receiverWallet;
    bool public saleActive = true;
    uint256 public rate = 459900;
    
    event TokensPurchased(address buyer, uint256 amount);
    event SaleClosed();
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
}`
};
let web3;
let compiledContract = null;

// Dosya Listesini Güncelle
function updateFileList() {
    const fileList = document.getElementById('fileList');
    fileList.innerHTML = '';
    Object.keys(files).forEach(fileName => {
        const li = document.createElement('li');
        li.innerText = fileName;
        li.onclick = () => loadFile(fileName);
        fileList.appendChild(li);
    });
    localStorage.setItem('files', JSON.stringify(files));
}

// Yeni Dosya Oluştur
function newFile() {
    const fileName = prompt('Enter file name (e.g., Contract.sol):');
    if (fileName && !files[fileName]) {
        files[fileName] = `pragma solidity ^0.8.17;\n\ncontract ${fileName.replace('.sol', '')} {\n\n}`;
        updateFileList();
        loadFile(fileName);
    } else if (files[fileName]) {
        alert('File already exists!');
    }
}

// Dosya Yükle
function loadFile(fileName) {
    currentFile = fileName;
    document.getElementById('codeEditor').value = files[fileName];
    document.getElementById('output').innerText = `Loaded file: ${fileName}`;
}

// Solidity Kodunu Derle
async function compileCode() {
    const code = document.getElementById('codeEditor').value;
    files[currentFile] = code; // Dosyayı güncelle
    localStorage.setItem('files', JSON.stringify(files));
    const output = document.getElementById('output');

    try {
        const compiled = solc.compile(JSON.stringify({
            language: "Solidity",
            sources: {
                [currentFile]: {
                    content: code
                }
            },
            settings: {
                outputSelection: {
                    "*": {
                        "*": ["abi", "evm.bytecode"]
                    }
                }
            }
        }));
        const result = JSON.parse(compiled);

        if (result.errors) {
            output.innerText = 'Compilation Errors:\n' + result.errors.map(err => err.formattedMessage).join('\n');
            compiledContract = null;
        } else {
            const contractName = Object.keys(result.contracts[currentFile])[0];
            compiledContract = {
                abi: result.contracts[currentFile][contractName].abi,
                bytecode: result.contracts[currentFile][contractName].evm.bytecode.object
            };
            output.innerText = 'Compilation Successful!\nABI and Bytecode generated.';
        }
    } catch (error) {
        output.innerText = 'Error during compilation: ' + error.message;
        compiledContract = null;
    }
}

// Web3 ile Ethereum Ağına Bağlan ve Kontratı Dağıt
async function deployContract() {
    const output = document.getElementById('output');
    if (!compiledContract) {
        output.innerText = 'Please compile the contract first!';
        return;
    }

    // Web3 ile MetaMask'e bağlan
    if (typeof window.ethereum === 'undefined') {
        output.innerText = 'MetaMask is not installed!';
        return;
    }

    try {
        // MetaMask ile bağlantı kur
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        web3 = new Web3(window.ethereum);

        const accounts = await web3.eth.getAccounts();
        const account = accounts[0];

        output.innerText = `Connected with account: ${account}\nDeploying contract...`;

        // Kontratı dağıt
        const contract = new web3.eth.Contract(compiledContract.abi);
        const deployTx = contract.deploy({
            data: '0x' + compiledContract.bytecode
        });

        const gas = await deployTx.estimateGas({ from: account });
        const deployedContract = await deployTx.send({
            from: account,
            gas: gas,
            gasPrice: await web3.eth.getGasPrice()
        });

        output.innerText += `\nContract deployed at address: ${deployedContract.options.address}`;
    } catch (error) {
        output.innerText = 'Error during deployment: ' + error.message;
    }
}

// Sayfa Yüklendiğinde Dosya Listesini Güncelle
window.onload = () => {
    updateFileList();
    if (Object.keys(files).length > 0) {
        loadFile(Object.keys(files)[0]);
    }
};
