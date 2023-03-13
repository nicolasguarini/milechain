// SPDX-License-Identifier: GNU

pragma solidity ^0.8.18;

/**
 * A contract to manage contract ownership and safe mode
 * @title Owned
 * @author Nicolas Guarini, Lorenzo Ficazzola
 */
contract Owned {
    /**
     * @dev Define variables to keep track of deployers and safe mode
     */
    address internal deployer; // TODO: implement managing a group of deployers
    bool internal safeMode;

    /**
     * @dev Define modifier for giving permission only to the deployers of the contract
     */
    modifier onlyDeployer() {
        require(msg.sender == deployer);
        _;
    }

    /**
     * @dev Initialize the contract's variables
     */
    constructor() {
        deployer = msg.sender;
        safeMode = false;
    }

    /**
     * Function to transfer contract ownership to another address
     * @param newDeployer The new deployer of the contract
     */
    function transferDeployer(address newDeployer) public onlyDeployer {
        deployer = newDeployer;
    }

    /**
     * Function to change the state of the safe mode
     * @param newState The new state of the safe mode
     */
    function setSafeMode(bool newState) public onlyDeployer {
        safeMode = newState;
    }

    /**
     * Function to get the deployer of the contract
     * @return The address of the deployer of the contract
     */
    function getDeployer() public view onlyDeployer returns (address) {
        return deployer;
    }
}
