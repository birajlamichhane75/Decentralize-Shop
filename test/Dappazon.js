const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether');
}



describe("Dappazon", () => {
  let dappazon;
  let deployer;
  let buyer;
  let ID = 1;
  let NAME = "shoes";
  let CATEGORY =  "cloth";
  let COST = 1;
  let IMAGE = "Image";
  let RATING = 4;
  let STOCKS = 1;


  beforeEach(async () => {
    [deployer,buyer] = await ethers.getSigners()

    const Dappazon = await ethers.getContractFactory("Dappazon");
    dappazon = await Dappazon.deploy();
  })
  describe("Deployment",()=>{
    it("Should have owner",async()=>{
      expect(await dappazon.owner()).to.equal(deployer.address);
    })

  })

  describe("Listing",()=>{
    let trans;
    beforeEach(async()=>{
      trans = await dappazon.connect(deployer).list(ID,NAME,CATEGORY,COST,IMAGE,RATING,STOCKS);
      await trans.wait();

    })
    it("Should have items",async()=>{
      let item = await dappazon.idToProduct(1);
      expect(item.name).to.equal(NAME);
    })
  })

  describe("Buying",()=>{
    let trans;
    beforeEach(async()=>{
      trans = await dappazon.connect(deployer).list(ID,NAME,CATEGORY,COST,IMAGE,RATING,STOCKS);

      trans = await dappazon.connect(buyer).buy(ID,{value:COST});
      await trans.wait();
    })
   
    it("Should update contract balance",async()=>{
      let result = await ethers.provider.getBalance(dappazon.address);
      expect(result).to.equal(COST);
    })

    it("should update ordercount",async()=>{
     let order = await dappazon.orderCount(buyer.address);
     expect(order).to.equal(1);
    })

    it("should add order",async()=>{
      let order = await dappazon.orders(buyer.address,1);

      expect(order.time).to.greaterThan(0);
      expect(order.item.name).to.equal(NAME)
    })

    it("Emits a buy event",async()=>{
      expect(trans).to.emit(dappazon,"Buy");
    })

  })

  describe("Withdraw Fund",async()=>{
    let balanceBefore;
    beforeEach(async()=>{
      let trans = await dappazon.connect(deployer).list(ID,NAME,CATEGORY,COST,IMAGE,RATING,STOCKS);
      await trans.wait();

      trans = await dappazon.connect(buyer).buy(ID,{value:COST});
      await trans.wait();

      balanceBefore = await ethers.provider.getBalance(deployer.address);

      trans = await dappazon.connect(deployer).withDrawFunds();
      await trans.wait();
    })

    it("Should increase owner balance",async()=>{
      const balanceAfter = await ethers.provider.getBalance(deployer.address);
      expect(balanceAfter).to.be.greaterThan(balanceBefore)
    })
    
    it("update contract balance",async()=>{
      let result = await ethers.provider.getBalance(dappazon.address);
      expect(result).to.be.equal(0);
    })
    
  })

})
