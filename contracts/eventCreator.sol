// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract EventCreator {
    uint256 private _number;

    event NewEventName(address indexed _from, string _name);
    event NewEventMessage(address indexed _from, string _message);
    event NewEventNumber(address indexed _from, uint256 _number);

    function addToNumber(uint256 _value) public {
        _number += _value;
        emit NewEventNumber(msg.sender, _number);
    }

    function getNumber() public view returns (uint256) {
        return _number;
    }

    function createEventMessage(string memory _message) public {
        emit NewEventMessage(msg.sender, _message);
    }

    function createEventName(string memory _name) public {
        emit NewEventName(msg.sender, _name);
    }
}
