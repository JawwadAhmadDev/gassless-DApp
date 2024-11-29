"use client";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { dilithium } from "dilithium-crystals"; // Import the SuperDilithium library
import { useAccount } from "wagmi";
import {
  getAccount,
  readContract,
  signTypedData,
  SignTypedDataParameters,
} from "wagmi/actions";
import { config } from "@/config/wagmi";
import { abi } from "@/contracts/QuantumResistant/contract";
// import PasswordManagerABI from "../abi/PasswordManager.json"; // Import your contract ABI

const contractAddress = "0x89D2E6291f4755B8d7Add0ad1576eE732a9Ca5cD"; // Replace with your contract address
const quantumContract = "0x93e1523647a9a9e82482163916DCa7D9607c8292";

export default function QuantumResistant() {
  const [password, setPassword] = useState("");
  const [ethSignature, setEthSignature] = useState("");
  const [quantumSignature, setQuantumSignature] = useState("");
  const [message, setMessage] = useState("");
  const [verifypassword, setVerifypassword] = useState("");
  const [verifySignature, setVerifySignature] = useState("");
  const [verifyPublicKey, setVerifyPublicKey] = useState("");
  const [signature, setSignature] = useState("");
  const [publicKey, setPublicKey] = useState("");
  // const [contract, setContract] = useState();

  const account = useAccount();
  const currentAccount = getAccount(config);
  const deadline = 2661766724;

  //     const initializeContract = async () => {
  //       if (typeof window.ethereum !== "undefined") {
  //         await window.ethereum.request({ method: "eth_requestAccounts" });
  //         const provider = new ethers.providers.Web3Provider(window.ethereum);
  //         const signer = provider.getSigner();
  //         const contractInstance = new ethers.Contract(
  //           contractAddress,
  //           PasswordManagerABI,
  //           signer
  //         );
  //         setContract(contractInstance);
  //         setSigner(signer);
  //       } else {
  //         console.error("MetaMask is not installed.");
  //         setMessage("Please install MetaMask to interact with this DApp.");
  //       }
  //     };

  //     initializeContract().catch((error) => {
  //       console.error("Failed to initialize contract:", error);
  //       setMessage("Failed to initialize contract.");
  //     });
  //   }, []);

  // Register Password with Quantum-Resistant Signature
  const registerPassword = async () => {
    if (!quantumContract || !currentAccount) return;
    try {
      // Step 1: Generate keys for Dilithium (public/private)
      const keypair = await dilithium.keyPair();
      const passwordUint8 = new TextEncoder().encode(password);
      const signature = await dilithium.sign(passwordUint8, keypair.privateKey);

      // Convert to hex for state storage
      const signatureHex = Buffer.from(signature).toString("hex");
      console.log("🚀 ~ registerPassword ~ signatureHex:", signatureHex);
      const publicKeyHex = Buffer.from(keypair.publicKey).toString("hex");
      console.log("🚀 ~ registerPassword ~ publicKeyHex:", publicKeyHex);
      setSignature(signatureHex);
      setPublicKey(publicKeyHex);

      // const domainData = await readContract(config, {
      //   abi,
      //   address: quantumContract as `0x${string}`,
      //   functionName: "eip712Domain",
      // });

      const domain = {
        name: "QuantumResistant",
        version: "1",
        chainId: 11155111,
        verifyingContract: quantumContract as `0x${string}`,
      };

      const domainType = [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "chainId", type: "uint256" },
        { name: "verifyingContract", type: "address" },
      ];
      const PasswordHash = [
        { name: "signer", type: "address" },
        { name: "customMessage", type: "string" },
        { name: "password", type: "string" },
        { name: "passwordHash", type: "bytes32" },
        { name: "deadline", type: "uint256" },
      ];
      let passwordHash = ethers.keccak256(ethers.toUtf8Bytes(password));
      console.log("🚀 ~ registerPassword ~ passwordHash:", passwordHash);
      const message = {
        signer: currentAccount.address,
        customMessage: "You are signing with a quantum-resistant key.",
        password: password,
        passwordHash, // This must match the hashed password from the frontend
        deadline,
      };

      const dataToSign = {
        types: {
          EIP712Domain: domainType,
          PasswordHash: PasswordHash,
        },
        domain: domain,
        primaryType: "PasswordHash",
        message: message,
      };

      const ethSignature = await signTypedData(
        config,
        dataToSign as SignTypedDataParameters
      );
      console.log("🚀 ~ registerPassword ~ ethSignature:", ethSignature);
      setMessage("Password stored successfully!");
    } catch (error) {
      console.error("Error storing password:", error);
      setMessage("Failed to store password. See console for details.");
    }
  };

  // Verify Password during Login
  const verifyLogin = async () => {
    if (!contract || !signer) return;
    try {
      // Retrieve stored keys and signatures
      const passwordUint8 = new TextEncoder().encode(verifypassword); // Ensure this is exactly the same
      const cleanedVerifySignature = verifySignature.replace(/^0x/, "");
      const cleanedVerifyPublicKey = verifyPublicKey.replace(/^0x/, "");
      // Retrieve and convert back to Uint8Array
      const signatureUint8 = Uint8Array.from(
        Buffer.from(cleanedVerifySignature, "hex")
      );
      const publicKeyUint8 = Uint8Array.from(
        Buffer.from(cleanedVerifyPublicKey, "hex")
      );

      const isVerified = await dilithium.verifyDetached(
        signatureUint8,
        passwordUint8,
        publicKeyUint8
      );
      console.log("Verification result:", isVerified);
      // Sign the password
      // const signature = await dilithium.sign(passwordUint8, keypair.privateKey);
      // const hashedPasswordHex = Buffer.from(signature).toString("hex");

      // Hash the password using Keccak-256
      // const passwordHash = ethers.utils.keccak256(
      //   ethers.utils.toUtf8Bytes(hashedPasswordHex)
      // );

      // Ethereum-specific message hash
      // const messageHash = ethers.utils.solidityKeccak256(
      //   ["string", "bytes32"],
      //   ["\x19Ethereum Signed Message:\n32", passwordHash]
      // );

      // const ethSignature = await signer.signMessage(
      //   ethers.utils.arrayify(messageHash)
      // );

      // Verify Login with the Contract
      // const isValid = await contract.verifyLogin(
      //   await signer.getAddress(),
      //   passwordHash,
      //   hashedPasswordHex,
      //   ethers.utils.arrayify(ethSignature)
      // );

      // setMessage(
      //   isValid ? "Login verified successfully!" : "Invalid login attempt."
      // );
    } catch (error) {
      console.error("Error verifying login:", error);
      setMessage("Failed to verify login. See console for details.");
    }
  };

  const signPassword = async () => {
    const keypair = await dilithium.keyPair();
    const passwordUint8 = new TextEncoder().encode(password);
    const signature = await dilithium.sign(passwordUint8, keypair.privateKey);
    // Convert to hex for state storage
    const signatureHex = Buffer.from(signature).toString("hex");
    const publicKeyHex = Buffer.from(keypair.publicKey).toString("hex");
    setSignature(signatureHex);
    setPublicKey(publicKeyHex);
  };

  const verifyPassword = async () => {
    const passwordUint8 = new TextEncoder().encode(password); // Ensure this is exactly the same
    // Retrieve and convert back to Uint8Array
    const signatureUint8 = Uint8Array.from(Buffer.from(signature, "hex"));
    const publicKeyUint8 = Uint8Array.from(Buffer.from(publicKey, "hex"));
    const isVerified = await dilithium.verifyDetached(
      signatureUint8,
      passwordUint8,
      publicKeyUint8
    );
    console.log("Verification result:", isVerified);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Password Manager DApp</h1>

      <div>
        <h2>Register Password</h2>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ marginBottom: "1rem", padding: "0.5rem" }}
        />
        <button onClick={registerPassword} style={{ padding: "0.5rem 1rem" }}>
          Register
        </button>
      </div>

      <div style={{ marginTop: "2rem" }}>
        <h2>Login</h2>
        <input
          type="password"
          placeholder="Enter your password"
          value={verifypassword}
          onChange={(e) => setVerifypassword(e.target.value)}
          style={{ marginBottom: "1rem", padding: "0.5rem" }}
        />
        <input
          type="text"
          placeholder="Enter your signature"
          value={verifySignature}
          onChange={(e) => setVerifySignature(e.target.value)}
          style={{ marginBottom: "1rem", padding: "0.5rem" }}
        />
        <input
          type="text"
          placeholder="Enter your public key"
          value={verifyPublicKey}
          onChange={(e) => setVerifyPublicKey(e.target.value)}
          style={{ marginBottom: "1rem", padding: "0.5rem" }}
        />
        <button onClick={verifyLogin} style={{ padding: "0.5rem 1rem" }}>
          Verify Login
        </button>
      </div>

      <p style={{ marginTop: "1rem", color: "blue" }}>{message}</p>
    </div>
  );
}
function createEIP712Signature(
  domain: unknown
):
  | { r: any; s: any; v: any; sig: any }
  | PromiseLike<{ r: any; s: any; v: any; sig: any }> {
  throw new Error("Function not implemented.");
}
