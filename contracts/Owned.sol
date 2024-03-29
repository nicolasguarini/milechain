// SPDX-License-Identifier: GNU
pragma solidity ^0.8.18;

/* Errors */
error Unauthorized();
error NotADeployer();
error AlreadyADeployer();

/**
 * A contract to manage contract ownership and safe mode
 * @title Owned
 * @author Nicolas Guarini, Lorenzo Ficazzola
 */
contract Owned {
    /**
     * @dev Define variables to keep track of deployers and safe mode
     */
    mapping(address => bool) internal _deployers;
    bool internal _safeMode;

    /**
     * @dev Define modifier to grant access only to deployers
     */
    modifier onlyDeployers() {
        if (_deployers[msg.sender] != true) {
            revert Unauthorized();
        }
        _;
    }

    /**
     * Initialize contract variables
     * @param deployers Initial deployers array
     */
    constructor(address[] memory deployers) {
        _deployers[msg.sender] = true;

        for (uint i = 0; i < deployers.length; i++) {
            _deployers[deployers[i]] = true;
        }

        _safeMode = false;
    }

    /**
     * Function to change the state of the safe mode
     * @param newState The new state of the safe mode
     */
    function setSafeMode(bool newState) public onlyDeployers {
        _safeMode = newState;
    }

    /**
     * Function to add a new deployer to the deployers mapping
     * @param newDeployer The new deployer's address
     */
    function addDeployer(address newDeployer) public onlyDeployers {
        if (_deployers[newDeployer]) {
            revert AlreadyADeployer();
        }

        _deployers[newDeployer] = true;
    }

    /**
     * Function to remove a deployer from the deployers mapping
     * @param deployer The deployer's address which needs to be removed
     */
    function deleteDeployer(address deployer) public onlyDeployers {
        if (_deployers[deployer] != true) {
            revert NotADeployer();
        }

        _deployers[deployer] = false;
    }

    /**
     * Function to check if a given address is in the deployers mapping
     * @param deployer The deployer's address which needs to be checked
     * @return A boolean result
     */
    function isDeployer(address deployer) public view returns (bool) {
        return _deployers[deployer];
    }

    /**
     * Function to check the current state of the contract
     * @return The current safe mode state
     */
    function getCurrentSafeModeState() public view returns (bool) {
        return _safeMode;
    }
}
