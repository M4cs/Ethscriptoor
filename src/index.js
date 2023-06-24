const { ethers } = require('ethers');

const ABI = require('./abis/Ethscriptoor');
const { Nonce } = require('./nonce');
const directory = require('./directory.json');

require('dotenv').config();

const walletProvider = new ethers.AlchemyProvider(process.env.ALCHEMY_NETWORK, process.env.ALCHEMY_API_KEY);
const provider = new ethers.WebSocketProvider(process.env.ALCHEMY_WSS_RPC);
const wallet = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY, walletProvider);
const contract = new ethers.Contract(process.env.DEPLOYER_CONTRACT_ADDR);

const sleep = ms => new Promise(r => setTimeout(r, ms));

const queue = [];
let isProcessing = false;

let nonceManager;
wallet.getNonce().then((startNonce) => {
    nonceManager = new Nonce(startNonce);
});

const processTransaction = async () => {
    if (queue.length === 0 || isProcessing) {
        if (queue.length === 0) {
            console.log(`Queue has cleared!`);
        }
        return;
    }

    isProcessing = true;
    const { minter, startID, index } = queue.shift();

    let txn;
    while (true) {
        try {
            const tx = {
                to: minter,
                value: 0,
                data: ethers.hexlify(ethers.toUtf8Bytes(`data:image/png;base64,${directory[startID+BigInt(index)]}`)),
                nonce: nonceManager.nonce
            };
            txn = await wallet.sendTransaction(tx);
            console.log(`Transaction created: ${txn.hash} | To: ${minter} | TokenID: ${startID+BigInt(index)}`);
            break; // If transaction is successful, break the loop
        } catch (error) {
            if (error.code === "NONCE_EXPIRED") {
                console.log(`Bad Nonce: ${nonceManager.nonce}`);
                console.log("Nonce expired, incrementing nonce and retrying...");
                nonceManager.increment();
                await sleep(1000);
            } else {
                throw error;
            }
        }
    }
    nonceManager.increment();
    await sleep(3000);

    isProcessing = false;
    processTransaction();
}

console.log(`ETHScriptoor v1 Started...`);
contract.on("Mint", (minter, amount, startID, endID) => {
    console.log(`Adding new transaction bundle to queue:`);
    console.log(`Minter: ${minter} | Amount: ${amount} | StartID: ${startID} | EndID: ${endID}`);
    for (let i=0;i<amount;i++) {
        queue.push({ minter, startID, index: i });
    }
    processTransaction();
}).catch((err) => {
    console.log(err);
});