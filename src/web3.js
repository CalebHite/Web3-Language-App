import { ethers } from "ethers";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyChASsVBWmAfZjm3AscwnEmFqrlFWv87NY");
const model = genAI.getGenerativeModel({ 
	model: "gemini-1.5-flash",
	systemInstruction: "Hold a conversation with the user with the intent of language learning. Include translations only for difficult words or phrases. Increase or decrease the complexity of responses based on the user's level of language."
 });

let provider;
let signer;
let contract;
let accounts;
let chat;

const contractAddress = "Add real address here";
const contractABI = [
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "streakGoal",
                "type": "uint256"
            }
        ],
        "name": "deposit",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "recordProgress",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "forfeitStreak",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "distributePool",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "streakGoal",
                "type": "uint256"
            }
        ],
        "name": "Deposit",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "reward",
                "type": "uint256"
            }
        ],
        "name": "StreakCompleted",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "forfeitedAmount",
                "type": "uint256"
            }
        ],
        "name": "StreakFailed",
        "type": "event"
    },
    {
        "stateMutability": "payable",
        "type": "receive"
    }
];

export async function connectWallet() {
    if (window.ethereum) {
        accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    } else {
        console.log("Please install MetaMask!");
    }
}

export async function connectContract() {
    if (window.ethereum) {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();
        contract = new ethers.Contract(contractAddress, contractABI, signer);
    }
}

export async function deposit(streakGoal, amount) {
    try {
        const tx = await contract.deposit(streakGoal, {
            value: ethers.utils.parseEther(amount)
        });
        await tx.wait();
        console.log("Deposit successful", tx);
    } catch (error) {
        console.error("Deposit failed", error);
        throw error;
    }
}

export async function recordProgress() {
    try {
        const tx = await contract.recordProgress();
        await tx.wait();
        console.log("Progress recorded", tx);
    } catch (error) {
        console.error("Failed to record progress", error);
        throw error;
    }
}

export async function forfeitStreak() {
    try {
        const tx = await contract.forfeitStreak();
        await tx.wait();
        console.log("Streak forfeited", tx);
    } catch (error) {
        console.error("Failed to forfeit streak", error);
        throw error;
    }
}

export async function distributePool(to, amount) {
    try {
        const tx = await contract.distributePool(to, ethers.utils.parseEther(amount));
        await tx.wait();
        console.log("Pool distributed", tx);
    } catch (error) {
        console.error("Failed to distribute pool", error);
        throw error;
    }
}

export async function startConversation(language) {
	chat = model.startChat();
	let message = "Only answer in this language for the entire conversation: "+language;
    await chat.sendMessage(message);
}
export async function sendMessage(message){
	let result = await chat.sendMessage(message);
	return result.response.text();
}

