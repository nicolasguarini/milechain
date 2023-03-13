// SPDX-License-Identifier: GNU

pragma solidity ^0.8.18;

contract Owned {
    address internal deployer; // TODO: implementare la gestione di gruppi di deployers
    bool internal safeMode;

    modifier onlyDeployer() {
        require(msg.sender == deployer);
        _;
    }

    constructor() {
        deployer = msg.sender;
        safeMode = false;
    }

    function transferDeployer(address newDeployer) public onlyDeployer {
        deployer = newDeployer;
    }

    function setSafeMode(bool newState) public onlyDeployer {
        safeMode = newState;
    }
}
