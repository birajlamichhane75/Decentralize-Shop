// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Dappazon {
    address public owner;

    struct Items {
        uint id;
        string name;
        string category;
        uint cost;
        string image;
        uint rating;
        uint stocks;
    }

    struct Order{
        uint time;
        Items item;
    }

    modifier onlyOwner{
        require(msg.sender == owner);
        _;
    }

    mapping (uint => Items) public idToProduct;
    mapping (address => uint) public orderCount;
    mapping (address => mapping(uint => Order)) public orders;


    event Buy(address  buyer, uint256  itemId, uint256 orderId);

    constructor() {
        owner = msg.sender;
    }

    // List products
    function list(
        uint _id,
        string memory _name,
        string memory _category,
        uint _cost,
        string memory _image,
        uint _rating,
        uint _stocks
    ) public onlyOwner{
        Items memory item = Items(_id,_name,_category,_cost,_image,_rating,_stocks);
        idToProduct[_id] = item;

    }

    function buy(uint _id) public payable{
        // Check
        require(msg.value >= idToProduct[_id].cost);
        require(idToProduct[_id].stocks > 0,"No item available");

        // Create an order
        Items memory item = idToProduct[_id];
        Order memory order = Order(block.timestamp,item);
        orderCount[msg.sender] ++ ;

        // Save order to chain
        orders[msg.sender][orderCount[msg.sender]] = order;
        idToProduct[_id].stocks = item.stocks - 1;

        emit Buy(msg.sender,_id, orderCount[msg.sender]);
    }

    function withDrawFunds() public onlyOwner{
        (bool success,) = owner.call{value:address(this).balance}("");
        require(success);
    }
        

}
