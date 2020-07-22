//"SPDX-License-Identifier: UNLICENSED"
pragma solidity ^0.6.0;

import "@openzeppelin/contracts-ethereum-package/contracts/Initializable.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/math/SafeMath.sol";

contract SimpleStorageV4 is Initializable {
    using SafeMath for uint256;
    uint256 public storedValue;
    uint256 public addedValue;
    uint256 public subtractedValue;
    event added(uint256);

    function initialize () public initializer {
        storedValue = 5;
    }

    function retrieve() public view returns (uint256){
        return storedValue;
    }

    function changeValue(string memory _task, uint256 _value) public {
        if (keccak256(abi.encodePacked(_task)) == keccak256(abi.encodePacked("add"))) {
            addedValue = _value;
            storedValue = storedValue + _value;
        }
        else if (keccak256(abi.encodePacked(_task)) == keccak256(abi.encodePacked("sub")))  {
            subtractedValue = _value;
            storedValue = storedValue.sub(_value);
        }
        else {
            revert("Incorrect task");
        }
    }
}


