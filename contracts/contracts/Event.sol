// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

contract Event {
    struct EventDS {
        address owner;
        string title;
        string description;
        uint256 date;
        uint256 price;
        uint256 amountCollected;
        address[] registrations;
        string[] nameOfAttendees;
    }

    mapping(uint256 => EventDS) public events;

    uint256 public numberOfEvents = 0;

    function createEvents(
        address _owner,
        string memory _title,
        string memory _description,
        uint256 _date,
        uint256 _price
    ) public returns (uint256) {
        EventDS storage eventi = events[numberOfEvents];

        require(
            eventi.date < block.timestamp,
            "The event date must be in the future"
        );

        eventi.owner = _owner;
        eventi.title = _title;
        eventi.description = _description;
        eventi.date  = _date;
        eventi.price = _price;
        eventi.amountCollected = 0;

        numberOfEvents++;

        return numberOfEvents - 1;
    }

    function payToEvent(uint256 _id, string memory _name) public payable {
        uint256 amount = events[_id].price;

        EventDS storage eventi = events[_id];
        eventi.registrations.push(msg.sender);
        eventi.nameOfAttendees.push(_name);

        (bool sent, ) = payable(eventi.owner).call{value: amount}("");

        if (sent) {
            eventi.amountCollected += eventi.amountCollected + amount;
        } else {
            revert("Failed to send Ether");
        }
    }

    function getEventAttendees(
        uint256 _id
    ) public view returns (address[] memory, string[] memory) {
        return (events[_id].registrations, events[_id].nameOfAttendees);
    }

    function getEvents() public view returns (EventDS[] memory){
        EventDS[]  memory allEvents = new EventDS[](numberOfEvents);

        for (uint i = 0; i < numberOfEvents; i++) {
            EventDS storage item = events[i];

            allEvents[i] = item;
        }
        return allEvents;
    }
}