import { PermitData } from "@/components/Deposit/Deposit";
import { signTypedData } from "@wagmi/core";
import { config } from "@/config/wagmi";

export const createPermitSignature = async (permitData: PermitData) => {
  const domainName = permitData.domainName; // put your token name
  const domainVersion = "1"; // leave this to "1"
  const chainId = permitData.chainId; // this is for the chain's ID. value is 1 for remix
  const contractAddress = permitData.contractAddress; // Put the address here from remix

  const domain = {
    name: domainName,
    version: domainVersion,
    verifyingContract: contractAddress,
    chainId,
  };

  const domainType = [
    { name: "name", type: "string" },
    { name: "version", type: "string" },
    { name: "chainId", type: "uint256" },
    { name: "verifyingContract", type: "address" },
  ];

  const splitSig = (sig: any) => {
    // Splits the signature into r, s, and v values.
    const pureSig = sig.replace("0x", "");

    const r = Buffer.from(pureSig.substring(0, 64), "hex");
    const s = Buffer.from(pureSig.substring(64, 128), "hex");
    const v = Buffer.from(parseInt(pureSig.substring(128, 130), 16).toString());

    return { r, s, v };
  };

  async function createPermit(
    spender: string,
    value: number,
    nonce: number,
    deadline: number
  ) {
    const permit = {
      owner: permitData.currentAccount,
      spender,
      value,
      nonce,
      deadline,
    };
    const Permit = [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
      { name: "value", type: "uint256" },
      { name: "nonce", type: "uint256" },
      { name: "deadline", type: "uint256" },
    ];

    const dataToSign = {
      types: {
        EIP712Domain: domainType,
        Permit: Permit,
      },
      domain: domain,
      primaryType: "Permit",
      message: permit,
    };

    const signature = await signTypedData(config, dataToSign);

    const split = splitSig(signature);

    return {
      ...split,
      signature,
    };
  }

  const permit = await createPermit(
    permitData.spenderAddress,
    permitData.tokensAmount,
    permitData.nonce,
    permitData.deadline
  );
  console.log(
    `r: 0x${permit.r.toString("hex")}, s: 0x${permit.s.toString("hex")}, v: ${
      permit.v
    }, sig: ${permit.signature}`
  );

  const returnData = {
    r: `0x${permit.r.toString("hex")}`,
    s: `0x${permit.s.toString("hex")}`,
    v: Number(`${permit.v}`),
    sig: `${permit.signature}`,
  };

  return returnData;
};
