
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
    mapping(address => bool) internal isDeployer;
    bool internal safeMode;

    modifier onlyDeployers(){
        require(isDeployer[msg.sender]);
        _;
    }

    /**
     * @dev Initialize the contract's variables
     */
    constructor(address[] memory _deployers) public {
        isDeployer[msg.sender]=true;
        for(uint i=0; i<_deployers.length; i++){
            isDeployer[_deployers[i]]=true;
        }
        safeMode = false;
    }

    /**
     * Function to change the state of the safe mode
     * @param newState The new state of the safe mode
     */
    function setSafeMode(bool newState) public onlyDeployers {
        safeMode = newState;
    }

    function addDeployer(address _newDeployer) public onlyDeployers{
        isDeployer[_newDeployer]=true;
    }

     function deleteDeployer(address _deployer) public onlyDeployers{
        isDeployer[_deployer]=false;
    }

}
