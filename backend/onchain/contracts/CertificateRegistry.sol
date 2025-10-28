// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title CertificateRegistry
 * @notice Minimal, gas-light on-chain certificate registry for (issuer, certId).
 *         Stores a SHA-256/Keccak256 digest (as bytes32) and optional metadata CID (string).
 */
contract CertificateRegistry is Ownable {
    struct Certificate {
        bytes32 fileHash;       // 32-byte digest of the document (e.g., sha256)
        string metadataCid;     // optional IPFS/Arweave/Firebase CID
        uint64 issuedAt;        // unix timestamp
        address issuer;         // who issued
        bool exists;            // guard
    }

    // issuer => allowed
    mapping(address => bool) public isIssuer;

    // key = keccak256(abi.encodePacked(issuer, certId))
    mapping(bytes32 => Certificate) private _certs;

    event IssuerGranted(address indexed issuer);
    event IssuerRevoked(address indexed issuer);
    event CertificateIssued(
        address indexed issuer,
        string certId,
        bytes32 indexed key,
        bytes32 fileHash,
        string metadataCid,
        uint256 blockNumber,
        uint64 issuedAt
    );

    constructor(address initialOwner) Ownable(initialOwner) {}

    // ---------- Admin (owner) ----------

    function grantIssuer(address issuer) external onlyOwner {
        require(issuer != address(0), "zero addr");
        require(!isIssuer[issuer], "already issuer");
        isIssuer[issuer] = true;
        emit IssuerGranted(issuer);
    }

    function revokeIssuer(address issuer) external onlyOwner {
        require(isIssuer[issuer], "not issuer");
        isIssuer[issuer] = false;
        emit IssuerRevoked(issuer);
    }

    // ---------- Issuance ----------

    function issueCertificate(
        string calldata certId,
        bytes32 fileHash,
        string calldata metadataCid
    ) external {
        require(isIssuer[msg.sender], "not authorized issuer");
        require(bytes(certId).length > 0, "empty certId");
        require(fileHash != bytes32(0), "empty fileHash");

        bytes32 key = keccak256(abi.encodePacked(msg.sender, certId));
        Certificate storage c = _certs[key];
        require(!c.exists, "already issued");

        c.fileHash = fileHash;
        c.metadataCid = metadataCid;
        c.issuedAt = uint64(block.timestamp);
        c.issuer = msg.sender;
        c.exists = true;

        emit CertificateIssued(
            msg.sender,
            certId,
            key,
            fileHash,
            metadataCid,
            block.number,
            c.issuedAt
        );
    }

    // ---------- Views / verification ----------

    function computeKey(address issuer, string calldata certId) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(issuer, certId));
    }

    function getCertificate(address issuer, string calldata certId)
        external
        view
        returns (
            bool exists,
            bytes32 fileHash,
            string memory metadataCid,
            uint64 issuedAt,
            address storedIssuer
        )
    {
        bytes32 key = computeKey(issuer, certId);
        Certificate storage c = _certs[key];
        return (c.exists, c.fileHash, c.metadataCid, c.issuedAt, c.issuer);
    }

    function verify(
        address issuer,
        string calldata certId,
        bytes32 fileHash
    ) external view returns (bool isValid, string memory metadataCid, uint64 issuedAt) {
        bytes32 key = computeKey(issuer, certId);
        Certificate storage c = _certs[key];
        if (!c.exists) return (false, "", 0);
        if (c.fileHash != fileHash) return (false, "", 0);
        return (true, c.metadataCid, c.issuedAt);
    }
}
