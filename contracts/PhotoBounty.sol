
pragma solidity ^0.4.24;
/** @title PhotoBounty. */
contract PhotoBounty{
//
uint validationInterval;

uint arbitrationInterval;
uint TimeOut;
bool cancelCreate;
address owner;
mapping(uint=>Bounty) BountyMap;

mapping(address=>uint[]) BountyList;

mapping(address=>uint[]) GamesToJudge;

mapping(address=>uint[]) RegisteredBounties;
mapping(uint=>bool) killedBounty;

mapping(uint=>uint) DisputeTimeOut;
mapping(uint=>string[]) DisputeData;
mapping(address=>bool) DisputeDataUploaded;
uint totalBounties;

// Sets the validation arbitration and Dispute Timeout Periods
constructor(uint VI,uint AI,uint TI){
  validationInterval=VI;
  arbitrationInterval=AI;
  totalBounties=0;
  TimeOut=TI;
  owner=msg.sender;
  cancelCreate=false;
}

// Sets
function cancelCreation() public {
  require(msg.sender==owner);
  if(cancelCreate==false){
     cancelCreate=true;
  }else{
     cancelCreate=false;
  }
}
//Stuct that defines each Bounty Instance
struct Bounty{
  address Arbitor;
  address creator;
  string Info;
  uint registeredPlayers;

  uint payout;
  mapping(address=>bool) registered;
  mapping(uint=>address) SubmissionOrder;
  mapping(address=>Submission) Submissions;
  //mapping(address=>uint) verified;
  uint startDate;
  uint endDate;


  string name;
  bool finished;
  uint totalSubmissions;
  address winner;
}

//Struct that defines each Submission
struct Submission{
  uint time;

  string IPFShash;
  address sender;
}
modifier isCreator(uint _bounty){

require(msg.sender==BountyMap[_bounty].creator);
_;
}
modifier isArbitor(uint _bounty){

require(msg.sender==BountyMap[_bounty].Arbitor);
_;
}
//Determines the Interval where Users can can create Submissions for bounties they are registered for
modifier isSubmitable(uint _bounty){
require((now>BountyMap[_bounty].startDate)&&(now<BountyMap[_bounty].endDate));
_;
}
//Determines when the creator can choose a winner for a Bounty
modifier isVerifiable(uint _bounty){
require((now>BountyMap[_bounty].endDate)&&(now<(BountyMap[_bounty].endDate+validationInterval)));
_;
}
// Determines the time period when a Bounty can be disputed
modifier isDisputable(uint _bounty){
require((now>(BountyMap[_bounty].endDate+validationInterval))
&&(now<(BountyMap[_bounty].endDate+validationInterval+arbitrationInterval)));
_;
}
modifier disputeIsResolved(uint _bounty){
  require(resolveDisputeTimeOut(_bounty));
  _;
}

modifier gameNotStarted(uint _bounty){
  require(now<BountyMap[_bounty].startDate);
    _;
  }
modifier isAlive(uint _bounty){
  require(BountyMap[_bounty].finished==false);
  _;
}


// Creates a new Bounty belonging to the sender
function CreateBounty(uint _payout,uint Start,uint End,address _judge,string _name,string _info) public payable {
require(cancelCreate==false);
require(msg.value==_payout);
//require((Start>=now)&&(End>Start));
Bounty memory temp =Bounty(_judge,msg.sender,_info,0,_payout,Start,End,_name,false,0,msg.sender);
uint total=totalBounties+1;
BountyMap[total]=temp;
BountyList[msg.sender].push(total);
totalBounties=total;
GamesToJudge[_judge].push(total);
}
// Updates bounty IPFS description
function SetInfo(uint bounty,string _info) public isCreator(bounty) isAlive(bounty) gameNotStarted(bounty){

Bounty storage temp=BountyMap[bounty];
    temp.Info=_info;
}
/*Registers a new participant to a Bounty
Can only be called before a bounty has started*/
function RegisterParticipant(address user,uint bounty) public isCreator(bounty) isAlive(bounty) gameNotStarted(bounty){

  Bounty storage temp=BountyMap[bounty];
  require(temp.registered[user]==false);
  temp.registered[user]=true;
  temp.registeredPlayers+=1;
  RegisteredBounties[user].push(bounty);
}
//Ends Bounty before it starts and returns deposit to its creator
function KillBounty(uint bounty) isCreator(bounty) public gameNotStarted(bounty) isAlive(bounty){
  Bounty storage temp=BountyMap[bounty];
  temp.finished=true;
  killedBounty[bounty]=true;
  msg.sender.transfer(BountyMap[bounty].payout);
}
/*Allows users to submit an IPFS hash containing their submission for a given bounty
 Users can only make a single submission*/
function SubmitBounty(uint _Bounty,string data) public isSubmitable(_Bounty) isAlive(_Bounty){
  require(BountyMap[_Bounty].registered[msg.sender]==true);
  require(BountyMap[_Bounty].Submissions[msg.sender].time==0);
  Submission memory Sub=Submission(now,data,msg.sender);
  Bounty storage temp=BountyMap[_Bounty];
  uint count=temp.totalSubmissions+1;
  temp.Submissions[msg.sender]=Sub;
  temp.SubmissionOrder[count]=msg.sender;
  temp.totalSubmissions=count;

}
//Allows the creator of a bounty to choose a winner for the given bounty
function VerifySubmission(uint bounty,uint submission) public isCreator(bounty) isAlive(bounty) isVerifiable(bounty) returns(address){

  Bounty storage temp=BountyMap[bounty];
  address user=temp.SubmissionOrder[submission];
  temp.winner=user;
  return user;
}

/*Sets a bounty Disputed Status to true
requires the arbitor to resolve the dispute
*/
function disputeClaim(uint bounty) public isDisputable(bounty) isAlive(bounty) {
  Bounty memory temp=BountyMap[bounty];
  require(BountyMap[bounty].registered[msg.sender]==true);
  require(BountyMap[bounty].Submissions[msg.sender].time!=0);
  DisputeTimeOut[bounty]=now+TimeOut;
}
/* allows a user to upload a hash of an ipfs file outlining the details of their dispute
 Only one upload is allowed per user*/
function disputeDataUpload(uint bounty,string data) public isDisputable(bounty) isAlive(bounty){
  require(BountyMap[bounty].Submissions[msg.sender].time!=0);
  require(BountyMap[bounty].registered[msg.sender]==true);
  require(DisputeDataUploaded[msg.sender]==false);
  DisputeData[bounty].push(data);
  DisputeDataUploaded[msg.sender]=true;

}
// Activates logic to end dispute status in the case where the arbitor fails to perform their job
function resolveDisputeTimeOut(uint bounty) public constant returns (bool){
  bool b=true;
  if(DisputeTimeOut[bounty]!=0)
  b=(now>DisputeTimeOut[bounty]);
  return b;

}

// returns the nth dispute ipfs hash uploaded
function GetDisputeData(uint bounty,uint n) public constant returns(string){
  return DisputeData[bounty][n];
}

// Allows the Bounty arbitor to resolve a dispute by
function ResolveDispute(uint _bounty,uint submission) public   isArbitor(_bounty){
  require((now<DisputeTimeOut[_bounty])&&(DisputeTimeOut[_bounty]!=0));
  require(submission<=BountyMap[_bounty].totalSubmissions);
  Bounty storage temp=BountyMap[_bounty];
  if(submission==0){
    temp.winner=temp.creator;
  }
  else{

    address user=temp.SubmissionOrder[submission];

    temp.winner=user;

    DisputeTimeOut[_bounty]=0;
 }
}
// returns the Submission creator and IPFS hash for a bounty based on submission order start at 1 for the first bounty
function ViewSubmision(uint _bounty,uint submission) public constant returns(string,address,uint){
  address a= BountyMap[_bounty].SubmissionOrder[submission];
  return (BountyMap[_bounty].Submissions[a].IPFShash,a,BountyMap[_bounty].Submissions[a].time);
}
// allows the chosen winner to withdraw the reward
function WithDrawReward(uint bounty) disputeIsResolved(bounty){
  require(now>(BountyMap[bounty].endDate+validationInterval+arbitrationInterval));
  require(msg.sender==BountyMap[bounty].winner);
  require(BountyMap[bounty].finished==false);

  BountyMap[bounty].finished=true;
  msg.sender.transfer(BountyMap[bounty].payout);
}

//returns all paremeters of the Bounty struct
function GetBountyDetails(uint _bounty) public constant returns(address,address,string,uint,uint,uint,uint,string,bool,uint,address){
  Bounty memory t=BountyMap[_bounty];
  return(
    t.Arbitor,
    t.creator,
    t.Info,
    t.registeredPlayers,
    t.payout,
    t.startDate,
    t.endDate,
    t.name,
    t.finished,
    t.totalSubmissions,
    t.winner);
  }

  // returns an array of the ids of all bounites an address has  created
  function getCreatedBounties(address a) public  constant returns(uint[]){
     return BountyList[a];
  }
 // returns the total unique bounties a user has created
  function gettotalCreatedBounties(address a) public constant returns(uint){
     return BountyList[a].length;
  }
  // returns an array of the ids of all bounites an address has been registered
  function getRegisterdBounties(address a) public constant returns(uint[]){
     return RegisteredBounties[a];
  }
  // returns the total unique bounties an address has been registered for
  function gettotalRegisteredBounties(address a) public constant returns(uint){
     return RegisteredBounties[a].length;
  }
  // returns total dipsute files uploaded for a given bounty
  function totalDisputesUploaded(uint bounty) public constant returns(uint){
    return DisputeData[bounty].length;
  }
  function getGamesToJudge(address a) public  constant returns(uint[]){
    return GamesToJudge[a];
  }
  // returns the total number of Bounties an address is registered to judge
  function gettotalGamesToJudge(address a) public constant returns(uint){
    return GamesToJudge[a].length;
  }
  // returns the unix timestamp for when a dispute times out
  function getTimeOut(uint _bounty) public constant returns(uint){
    return DisputeTimeOut[_bounty];
  }
  // retuns true if game was killed otherwise false
  function wasGameKilled(uint _bounty) public  constant returns(bool){
    return killedBounty[_bounty];
  }
  // returns the cancelCreate variable
  function wasCanceled() constant public returns(bool){
    return cancelCreate;
  }
  /* returns one of the time periods a bounty can be in
   period 1: Game has been created but not started
   period 2: Game has started but not ended
   period 3: Game has ended and is within the interval for validation where a winner can be chosen
   period 4: Game can be Disputed
   period 5; Game is completed;
   period 6: Game  been disputed and is still in the arbitrationInterval
   period 7: Game is past the past the arbitration int
   period 8: Game is past the dispute TimeOut which is nonzero
   */
  function getTimePeriod(uint _bounty ) public constant returns(uint){
    require(BountyMap[_bounty].startDate!=0);
    uint ret=0;
    if(now<=BountyMap[_bounty].startDate) ret=1;
    if((now>BountyMap[_bounty].startDate)&&(now<BountyMap[_bounty].endDate)) ret=2;
    if((now>BountyMap[_bounty].endDate)&&(now<(BountyMap[_bounty].endDate+validationInterval)) ) ret=3;
    if((now>(BountyMap[_bounty].endDate+validationInterval))&&(now<(BountyMap[_bounty].endDate+validationInterval+arbitrationInterval))) ret=4;
    if(now>(BountyMap[_bounty].endDate+validationInterval+arbitrationInterval)) ret=5;
    if((ret==4)&&(DisputeTimeOut[_bounty]!=0)) ret=6;
    if( (ret==5)&&(now<DisputeTimeOut[_bounty])) ret=7;
    if((now> DisputeTimeOut[_bounty])&&(DisputeTimeOut[_bounty]!=0)) ret=8;

    return ret;
  }

}
