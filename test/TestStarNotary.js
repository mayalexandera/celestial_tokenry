const StarNotary = artifacts.require('StarNotary');
var assert = require('assert');

var accounts;
var owner;

contract('StarNotary', async (accs) => {
  accounts = accs;
  owner = accounts[0];
});

it('Can create a star', async () => {
  let instance = await StarNotary.deployed();
  let tokenId = 1;
  await instance.createStar('Awesome Star!', tokenId, { from: accounts[0] });
  assert.equal(await instance.tokenIdToStarInfo.call(tokenId), 'Awesome Star!');
});

it('Can put a star up for Sale', async () => {
  let instance = await StarNotary.deployed();
  let userSeller = accounts[1];
  let starId = 2;
  let starPrice = web3.utils.toWei('.01', 'ether');
  await instance.createStar('Awesome Star!', starId, { from: userSeller });
  await instance.putStarUpForSale(starId, starPrice, { from: userSeller });
  assert.equal(await instance.starsForSale.call(starId), starPrice);
});

it('lets userSeller get the fund after the sale', async () => {
  let instance = await StarNotary.deployed();
  let userSeller = accounts[1];
  let userBuyer = accounts[2];
  let starId = 3;
  let starPrice = web3.utils.toWei('.01', 'ether');
  let balance = web3.utils.toWei('.05', 'ether');
  await instance.createStar('Awesome Star!', starId, { from: userSeller });
  await instance.putStarUpForSale(starId, starPrice, { from: userSeller });
  let balanceOfSellerBeforeTransaction = await web3.eth.getBalance(userSeller);
  await instance.buyStar(starId, { from: userBuyer, value: balance });
  let balanceOfSellerAfterTransaction = await web3.eth.getBalance(userSeller);
  let valueBefore =
    Number(balanceOfSellerBeforeTransaction) + Number(starPrice);
  let valueAfter = Number(balanceOfSellerAfterTransaction);
  assert.equal(valueBefore, valueAfter);
});

it('lets userBuyer buy a star, if it is put up for sale', async () => {
  let instance = await StarNotary.deployed();
  let userSeller = accounts[1];
  let userBuyer = accounts[2];
  let starId = 4;
  let starPrice = web3.utils.toWei('.01', 'ether');
  let balance = web3.utils.toWei('.05', 'ether');
  await instance.createStar('Awesome Star!', starId, { from: userSeller });
  await instance.putStarUpForSale(starId, starPrice, { from: userSeller });
  await instance.buyStar(starId, { from: userBuyer, value: balance });
  assert.equal(await instance.ownerOf.call(starId), userBuyer);
});

it('lets userBuyer buy a star and decreases its balance in ether', async () => {
  let instance = await StarNotary.deployed();
  let seller = accounts[1];
  let buyer = accounts[2];
  let starId = 5;
  let starPrice = web3.utils.toWei('.01', 'ether');
  let balance = web3.utils.toWei('.05', 'ether');
  await instance.createStar('Awesome Star!', starId, { from: seller });
  await instance.putStarUpForSale(starId, starPrice, { from: seller });
  //let balanceOfSellerBeforeTransaction = await web3.eth.getBalance(seller);
  const balanceOfBuyerBeforeTransaction = await web3.eth.getBalance(buyer);
  await instance.buyStar(starId, { from: buyer, value: balance, gasPrice: 0 });
  const balanceOfBuyerAfterTransaction = await web3.eth.getBalance(buyer);
  let accBalance =
    Number(balanceOfBuyerBeforeTransaction) -
    Number(balanceOfBuyerAfterTransaction);
  assert.equal(accBalance, starPrice);
});

// Implement Task 2 Add supporting unit tests

it('lookUptokenIdToStarInfo test', async () => {
  let instance = await StarNotary.deployed();
  let user = accounts[1];
  // 1. create a Star with different tokenId
  let starId = 6;
  await instance.createStar('Hot Potato!', starId, { from: user });
  // 2. Call your method lookUptokenIdToStarInfo
  let starName = await instance.tokenIdToStarInfo.call(starId);
  assert.equal(starName, 'Hot Potato!');
  // 3. Verify if you Star name is the same
});

it('can add the star name and star symbol properly', async () => {
  // 1. create a Star with different tokenId
  let instance = await StarNotary.deployed();
  let user = accounts[1];
  let starId = 7;
  await instance.createStar('Yeppy Yayy!', starId, { from: user });
  //2. Call the name and symbol properties in your Smart Contract and compare with the name and symbol provided
  let TokenName = await instance.name();
  let tokenSymbol = await instance.symbol();
  assert.equal(TokenName, 'Grappl');
  assert.equal(tokenSymbol, 'GRP');
});

it('lets 2 users exchange stars', async () => {
  // 1. create 2 Stars with different tokenId
  let instance = await StarNotary.deployed();
  let user1 = accounts[1];
  let user2 = accounts[2];
  let starId1 = 8;
  let starId2 = 9;
  await instance.createStar('Twinkle Twinkle', starId1, { from: user1 });
  await instance.createStar('Little Star', starId2, { from: user2 });
  // 2. Call the exchangeStars functions implemented in the Smart Contract
  await instance.exchangeStars(starId1, starId2, { from: user1 });
  // 3. Verify that the owners changed
  let starOwner1 = await instance.ownerOf.call(starId1);
  let starOwner2 = await instance.ownerOf.call(starId2);
  assert.equal(starOwner1, user2);
  assert.equal(starOwner2, user1);
});

it('lets a user transfer a star', async () => {
  // 1. create a Star with different tokenId
  let instance = await StarNotary.deployed();
  let user = accounts[1];
  let newOwner = accounts[2];
  let starId = 10;
  await instance.createStar('Sputnik', starId, { from: user });
  // 2. use the transferStar function implemented in the Smart Contract
  await instance.transferStar(newOwner, starId, { from: user });
  // 3. Verify the star owner changed.
  assert.equal(await instance.ownerOf.call(starId), newOwner);
});
