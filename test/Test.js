 var E=require( './expectThrow')
const should = require('chai')
var SH = artifacts.require('PhotoBounty');

var time=(new Date().getTime())
time=time/1000;
console.log(time + "tim")
var endTime=time+10
function sleep(ms){
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}

contract('Bounty tests', function(accounts) {



  it('Created a new Bounty with 3 registered users and submissions and selects a winner with no dispute', async function() {
  var MyGame=await SH.deployed();
  console.log(SH.address)
  var time=(new Date().getTime())
  time=Math.floor(time/1000)
  time=time+2;

  console.log(time + "tim")
  var endTime=time+10
  //CreateBounty(uint _payout,uint Start,uint End,address _judge,string _name,bytes32 _info)
  await MyGame.CreateBounty(100000,time,endTime,accounts[3],"scenic landscape","0xd7c0c62c2985bd9e0f9f474a1001c85f2ea08a04",{from:accounts[0],value:100000})
  console.log("created")
  var balance= await web3.eth.getBalance(SH.address)
  console.log(balance + "contract balance")
  assert.equal(100000,balance,"eth was deposited")
  await E.expectThrow(MyGame.WithDrawReward(1,{from:accounts[0]}));

  console.log("started")
  await MyGame.RegisterParticipant(accounts[4],1,{from:accounts[0]})
  console.log("registered")
  await E.expectThrow(MyGame.RegisterParticipant(accounts[4],1,{from:accounts[0]}))
  await MyGame.RegisterParticipant(accounts[5],1,{from:accounts[0]})
  await MyGame.RegisterParticipant(accounts[6],1,{from:accounts[0]})
 var info=await MyGame.GetBountyDetails.call(1);
 var registered=await MyGame.getRegisterdBounties(accounts[5])
 assert.equal(registered,1,'register account increments')
 var test=[accounts[3],accounts[0],"0xd7c0c62c2985bd9e0f9f474a1001c85f2ea08a04",3,100000,time,endTime,"scenic landscape",false,0,accounts[0]]
// console.log(test)
 var createdGames= await MyGame.getCreatedBounties(accounts[0]);
 for(var i=0;i<info.length;i++){

   assert.equal(info[i],test[i],"bounty propertytime,"+i+ " is correct")
 }
var total=await MyGame.gettotalCreatedBounties(accounts[0])
console.log(total + "total")
 await sleep(3000)
 var status=await MyGame.getTimePeriod(1 )
console.log(status.c[0] +"status")
await MyGame.SubmitBounty(1,"testIPFSHashPlaceHolder",{from:accounts[4]})
await MyGame.SubmitBounty(1,"testIPFSHashPlaceHolder1",{from:accounts[5]})
await MyGame.SubmitBounty(1,"testIPFSHashPlaceHolder2",{from:accounts[6]})
var subdata=await MyGame.ViewSubmision(1,1)
var subdata1=await MyGame.ViewSubmision(1,2)
var subdata2=await MyGame.ViewSubmision(1,3)
assert.equal(subdata[0],"testIPFSHashPlaceHolder",'ipfs hash is set properly')
assert.equal(subdata[1],accounts[4],'submission account is set properly')

console.log("bounties submitted")
await sleep(11000)
status=await MyGame.getTimePeriod(1 )
console.log(status.c[0])
await MyGame.VerifySubmission(1,1,{from:accounts[0]})
info=await MyGame.GetBountyDetails.call(1);
assert.equal(info[9],3,"bounty submission updates")
console.log(info[10])
await E.expectThrow(MyGame.ResolveDispute(1,1,{from:accounts[3]}))
await sleep(30000)
status=await MyGame.getTimePeriod(1 )
console.log(status.c[0])

await MyGame.WithDrawReward(1,{from:accounts[4]})
  var balance= await web3.eth.getBalance(SH.address)
assert.equal(balance,0,"eth was withdrawn")
  await E.expectThrow( MyGame.WithDrawReward(1,{from:accounts[4]}))
})
it('Created a new Bounty where no one submits', async function() {
  var MyGame=await SH.deployed();
  console.log(SH.address)
  var time=(new Date().getTime())
  time=Math.floor(time/1000)
  time=time+2;

  console.log(time + "tim")
  var endTime=time+10
//CreateBounty(uint _payout,uint Start,uint End,address _judge,string _name,bytes32 _info)
await MyGame.CreateBounty(100000,time,endTime,accounts[3],"test number two","0xd7c0c62c2985bd9e0f9f474a1001c85f2ea08a04",{from:accounts[0],value:100000})
var total=await MyGame.gettotalCreatedBounties(accounts[0])
console.log(total)
await MyGame.RegisterParticipant(accounts[4],2,{from:accounts[0]})
await MyGame.RegisterParticipant(accounts[5],2,{from:accounts[0]})
await MyGame.RegisterParticipant(accounts[6],2,{from:accounts[0]})

console.log("second test registered")
await sleep(11000)
 await E.expectThrow(MyGame.VerifySubmission(1,1,{from:accounts[0]}))
await sleep(30000)

status=await MyGame.getTimePeriod(1 )
console.log(status.c[0]+ "second test status")

await MyGame.WithDrawReward(2,{from:accounts[0]})
  var balance= await web3.eth.getBalance(SH.address)
  assert.equal(balance,0,"eth was withdrawn")
})

it('Creates a Game that is disputed', async function() {
var MyGame=await SH.deployed();
var time=(new Date().getTime())
time=Math.floor(time/1000)
time=time+2;

console.log(time + "tim")
var endTime=time+10
console.log("third test")
//CreateBounty(uint _payout,uint Start,uint End,address _judge,string _name,bytes32 _info)
await MyGame.CreateBounty(100000,time,endTime,accounts[3],"tester  number 3","0xd7c0c62c2985bd9e0f9f474a1001c85f2ea08a04",{from:accounts[0],value:100000})
//await MyGame.CreateBounty(100000,time,endTime,accounts[3],"tester  number 3","0xd7c0c62c2985bd9e0f9f474a1001c85f2ea08a04",{from:accounts[0],value:100000})
//await MyGame.CreateBounty(100000,time,endTime,accounts[3],"tester  number 3","0xd7c0c62c2985bd9e0f9f474a1001c85f2ea08a04",{from:accounts[0],value:100000})
console.log("that worked")

await E.expectThrow(MyGame.WithDrawReward(3,{from:accounts[4]}));
//await E.expectThrow(MyGame.RegisterParticipant(accounts[4],1,{from:accounts[0]}))

await MyGame.RegisterParticipant(accounts[4],3,{from:accounts[0]})
await MyGame.RegisterParticipant(accounts[5],3,{from:accounts[0]})
await MyGame.RegisterParticipant(accounts[6],3,{from:accounts[0]})
var info=await MyGame.GetBountyDetails.call(3);
var createdGames= await MyGame.getCreatedBounties(accounts[0]);

for(var i=0;i<info.length;i++){
 console.log(info[i] + " counter "+i)
}
var total=await MyGame.gettotalCreatedBounties(accounts[0])
console.log(total + "total")
await sleep(3000)
var status=await MyGame.getTimePeriod(3 )
console.log(status.c[0])
await MyGame.SubmitBounty(3,"firstSubmit",{from:accounts[4]})
await MyGame.SubmitBounty(3,"secondSubmit",{from:accounts[5]})
await MyGame.SubmitBounty(3,"thirdSubmit",{from:accounts[6]})
var subdata=await MyGame.ViewSubmision(3,3)
console.log(subdata)
console.log("bounties submitted")
await sleep(10000)
status=await MyGame.getTimePeriod(3 )
console.log(status.c[0])
await MyGame.VerifySubmission(3,3,{from:accounts[0]})
info=await MyGame.GetBountyDetails.call(3);
//for(var i=0;i<info.length;i++){
//console.log(info[i] + " counter "+i)
//}
await sleep(12000)
console.log(await MyGame.getTimePeriod(3)+"time period for disputes")
await MyGame.disputeClaim(3,{from:accounts[4]})
console.log('disputed')
await MyGame.disputeDataUpload(3,"test dispute data",{from:accounts[4]})
var disputedata =await MyGame.GetDisputeData(3,0)
var status=await MyGame.resolveDisputeTimeOut(3)
console.log(status)
assert.equal(status,false,"dispute has not been resolved")
await MyGame.ResolveDispute(3,1,{from:accounts[3]})
var status=await MyGame.resolveDisputeTimeOut(3);
assert.equal(status,true,"dispute has not been resolved")
var info=await MyGame.GetBountyDetails.call(3);
var winner=info[10]
assert.equal(winner,accounts[4],"winner should be account 6")
console.log(winner)
await sleep(10000)
status=await MyGame.getTimePeriod(3)
console.log(status.c[0])

await MyGame.WithDrawReward(3,{from:accounts[4]})
})

it('Creates a Game that is disputed but the judge fails ', async function() {
  var MyGame=await SH.deployed();
  var time=(new Date().getTime())
  time=Math.floor(time/1000)
  time=time+2;

  console.log(time + "tim")
  var endTime=time+10
  await MyGame.CreateBounty(100000,time,endTime,accounts[3],"tester  number 3","0xd7c0c62c2985bd9e0f9f474a1001c85f2ea08a04",{from:accounts[0],value:100000})
//  await MyGame.CreateBounty(100000,time,endTime,accounts[3],"tester  number 3","0xd7c0c62c2985bd9e0f9f474a1001c85f2ea08a04",{from:accounts[0],value:100000})
  //await MyGame.CreateBounty(100000,time,endTime,accounts[3],"tester  number 3","0xd7c0c62c2985bd9e0f9f474a1001c85f2ea08a04",{from:accounts[0],value:100000})
//await MyGame.CreateBounty(100000,time,endTime,accounts[3],"tester  number 4","0xd7c0c62c2985bd9e0f9f474a1001c85f2ea08a04",{from:accounts[0],value:100000})
  console.log( "bounty 4 created")
  await MyGame.RegisterParticipant(accounts[4],4,{from:accounts[0]})
  await MyGame.RegisterParticipant(accounts[5],4,{from:accounts[0]})
  await MyGame.RegisterParticipant(accounts[6],4,{from:accounts[0]})
  await E.expectThrow( MyGame.RegisterParticipant(accounts[6],4,{from:accounts[0]}));
  console.log( "bounty 4 created")
  await sleep(3000)
  await MyGame.SubmitBounty(4,"0xd7c0c62c2985bd9e0f9f474a1001c85f2ea08a04",{from:accounts[4]})
  await MyGame.SubmitBounty(4,"0xd7c0c62c2985bd9e0f9f474a1001c85f2ea08a04",{from:accounts[5]})
  await MyGame.SubmitBounty(4,"0xd7c0c62c2985bd9e0f9f474a1001c85f2ea08a04",{from:accounts[6]})
  await sleep(10000)
  await MyGame.VerifySubmission(4,2,{from:accounts[0]})
  await sleep(10000)
  await MyGame.disputeClaim(4,{from:accounts[4]})
  await sleep(50000)

  var timeout=await MyGame.getTimePeriod(4,{from:accounts[0]});
  assert.equal(timeout,8,"the dispute timed out")
  await MyGame.WithDrawReward(4,{from:accounts[5]})
  })

it('test a bounty that is canceled', async function(){
  var MyGame=await SH.deployed();
  var time=(new Date().getTime())
  time=2+time/1000;

  var endTime=time+10
  var payout= web3.toWei('1', 'ether');
  await MyGame.CreateBounty(payout,time,endTime,accounts[3],"tester  number 4","0xd7c0c62c2985bd9e0f9f474a1001c85f2ea08a04",{from:accounts[0],value:payout})
  await MyGame.RegisterParticipant(accounts[4],5,{from:accounts[0]})
  await MyGame.RegisterParticipant(accounts[5],5,{from:accounts[0]})
  await MyGame.RegisterParticipant(accounts[6],5,{from:accounts[0]})
//var balance=await web3.eth.getBalance(accounts[0])
  var hash=await MyGame.KillBounty(5,{from:accounts[0]})
//hash=hash.tx
//const tx = await web3.eth.getTransaction(hash);
//const receipt = await web3.eth.getTransactionReceipt(hash);
//const gasCost = tx.gasPrice.mul(receipt.gasUsed);
//console.log(gasCost+'gascost')
//var increase=payout-gasCost
  var Balance=await web3.eth.getBalance(SH.address)
  console.log(Balance)
//var actualincrease=updatedBalance-balance;
  assert.equal(Balance,0,'contract returns deposit')
  var status= await MyGame.wasGameKilled(5,{from:accounts[4]})
  info=await MyGame.GetBountyDetails.call(5);
  assert.equal(info[8],true,"game is marked as finished")
  assert.equal(status,true,"game was killed")
  console.log(JSON.stringify(status)+ "killed")
  await E.expectThrow(MyGame.SubmitBounty(4,{from:accounts[4]}));
  await E.expectThrow(MyGame.RegisterParticipant(accounts[4],5,{from:accounts[0]}))
  await E.expectThrow(MyGame.WithDrawReward(5,{from:accounts[0]}))
})


it('contract owner can disable bounty creation', async function() {
    var MyGame=await SH.deployed();

    await MyGame.cancelCreation({from:accounts[0]})
    var cancel =(await MyGame.wasCanceled({from:accounts[0]}))
    assert.equal(true,cancel,'cancel status should be returned to false')
    await E.expectThrow(MyGame.CreateBounty(100000,time,endTime,accounts[3],"scenic landscape","0xd7c0c62c2985bd9e0f9f474a1001c85f2ea08a04",{from:accounts[0],value:100000}))
    await MyGame.cancelCreation({from:accounts[0]})
    cancel=await MyGame.wasCanceled({from:accounts[0]})
    console.log(cancel)
    assert.equal(false,cancel,'cancel status should be returned to false')
})
})
