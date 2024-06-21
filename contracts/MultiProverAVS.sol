// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title Multi-Prover Attestation and Verification System (AVS) Contract
 * @dev This contract manages multiple provers and their attestations.
 */
contract MultiProverAVS {
    event ProverAdded(address indexed prover);
    event ProverRemoved(address indexed prover);
    event AttestationAdded(address indexed prover, bytes32 indexed attestationHash);

    struct Prover {
        bool isRegistered;
        mapping(bytes32 => bool) attestations;
    }

    mapping(address => Prover) private provers;

    /**
     * @dev Modifier to ensure only registered provers can call specific functions.
     */
    modifier onlyRegisteredProver() {
        require(provers[msg.sender].isRegistered, "Sender is not a registered prover");
        _;
    }

    /**
     * @dev Add a new prover to the system.
     * @param _prover Address of the prover to add.
     */
    function addProver(address _prover) external {
        require(_prover != address(0), "Invalid prover address");
        require(!provers[_prover].isRegistered, "Prover already registered");

        provers[_prover].isRegistered = true;
        emit ProverAdded(_prover);
    }

    /**
     * @dev Remove a prover from the system.
     * @param _prover Address of the prover to remove.
     */
    function removeProver(address _prover) external {
        require(provers[_prover].isRegistered, "Prover is not registered");

        delete provers[_prover];
        emit ProverRemoved(_prover);
    }

    /**
     * @dev Add an attestation hash for a prover.
     * @param _attestationHash Hash of the attestation data.
     */
    function addAttestation(bytes32 _attestationHash) external onlyRegisteredProver {
        require(!provers[msg.sender].attestations[_attestationHash], "Attestation already added");

        provers[msg.sender].attestations[_attestationHash] = true;
        emit AttestationAdded(msg.sender, _attestationHash);
    }

    /**
     * @dev Check if a prover has a specific attestation.
     * @param _prover Address of the prover.
     * @param _attestationHash Hash of the attestation data.
     * @return true if the prover has the attestation, false otherwise.
     */
    function hasAttestation(address _prover, bytes32 _attestationHash) external view returns (bool) {
        return provers[_prover].attestations[_attestationHash];
    }

    /**
     * @dev Get the registration status of a prover.
     * @param _prover Address of the prover.
     * @return true if the prover is registered, false otherwise.
     */
    function isProverRegistered(address _prover) external view returns (bool) {
        return provers[_prover].isRegistered;
    }
}
