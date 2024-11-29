// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract QuantumResistant is EIP712 {
    // Define the typehash for the struct, including the custom message
    bytes32 public constant PASSWORD_HASH_TYPEHASH =
        keccak256("PasswordHash(string customMessage,bytes32 passwordHash)");
    error ERC2612ExpiredSignature(uint256 deadline);
    error ERC2612InvalidSigner(address signer, address owner);

    bytes32 public DOMAIN_SEPARATOR;
    uint256 public id;

    event Debug(string name, bytes32 hash);
    event MessageHash(bytes32 messageHash);

    constructor(string memory name) EIP712(name, "1") {}

    // Verify function to validate the EIP-712 signature
    function verifySignature(
        address signer,
        string memory customMessage,
        string memory password,
        bytes32 passwordHash,
        uint256 deadline,
        bytes memory ethSignature
    ) public view returns (bool) {
        bytes32 typeHash = keccak256(
            abi.encode(
                keccak256(
                    "PasswordHash(address signer,string customMessage,string password,bytes32 passwordHash,uint256 deadline)"
                ),
                signer,
                keccak256(bytes(customMessage)),
                keccak256(bytes(password)),
                passwordHash,
                deadline
            )
        );

        bytes32 digest = _hashTypedDataV4(typeHash);
        address _signer = ECDSA.recover(digest, ethSignature);

        if (_signer != signer) {
            return false;
        } else {
            return true;
        }
    }
}
