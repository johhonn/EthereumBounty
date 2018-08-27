import React, { Component } from 'react';
import {Table, Grid, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ipfs from '../../utils/ipfs'
import getWeb3 from '../../utils/getWeb3'
import PhotoBounty from '../../../build/contracts/PhotoBounty.json'
import SubmissionView from '../SubmissionView/SubmissionView'
import moment from 'moment';
let web3
let PB;



class UserSubmit extends Component{

state={
 BountyID:this.props.location.pathname.slice(12),
 rID:0,
 ipfshash:'',
 buffer:'',
 user:'',
 totalusers:'',
 arbitor:'',
 title:'',
 payout:0,
 start:0,
 end:0,
 BountyStatus:0,
 myAddress:'',
 winner:'',
 Submissions:'',
 submissionSelected:false,
 ethAddress:'',
 killed:false

}

componentWillMount() {
  // Get network provider and web3 instance.
  // See utils/getWeb3 for more info.
console.log(JSON.stringify(this.props)+ "props")
console.log(this.props.location.pathname)

  getWeb3
  .then(results => {
    this.setState({
      web3: results.web3
    })

    // Instantiate contract once web3 provided.
    this.instantiateContract()
  })
  .catch(() => {
    console.log('Error finding web3.')
  })
}
instantiateContract() {
console.log(this.props+ "props IDDD")
  const contract = require('truffle-contract')
  let  PBB = contract(PhotoBounty)
  PBB.setProvider(this.state.web3.currentProvider)
  this.state.web3.eth.getAccounts((error, accounts) => {
    PBB.deployed().then((instance) => {
       let id=this.state.BountyID
       PB = instance
       console.log(PB)

       PB.getRegisterdBounties(accounts[0]).then(result=>{
         console.log(id)
         console.log(result)
         let r=result[id-1].c[0]
        this.setState({rID:r})
        this.setState({myAddress:accounts[0]})
        this.getBountyInfo(accounts[0],r)
        this.setState({ethAddress:PB.address})
      })
       console.log(PB.address +"constract address")
       console.log(this.state.myAddress)
       console.log(this.state)
     })


   })
}
getBountyInfo(address,ID){
  PB.GetBountyDetails(ID).then(result1=>{
    console.log(result1[4].c[0])
    this.setState({title:result1[7]})
    this.setState({arbitor:result1[0]})
    this.setState({totalusers:result1[3].c[0]})
    this.setState({ipfshash:result1[2]})
    this.setState({payout:result1[4].c[0]})
    this.setState({start:result1[5].c[0]})
    this.setState({end:result1[6].c[0]})
    this.setState({Submissions:result1[9].c[0]})
    this.setState({winner:result1[10]},console.log(this.state))
  })
  PB.getTimePeriod(ID).then(result=>{
    console.log(result + "time period")
    this.setState({BountyStatus:result.c[0]})
  })
  PB.wasGameKilled(ID).then(result=>{
    console.log(result+ "killed status")
    this.setState({killed:result})
  })
}

captureFile=(event) => {
        event.stopPropagation()
        event.preventDefault()
        const file = event.target.files[0]
        let reader = new window.FileReader()
        reader.readAsArrayBuffer(file)
        reader.onloadend = () => this.convertToBuffer(reader)
      }
convertToBuffer = async(reader) => {
     //file is converted to a buffer for upload to IPFS
       const buffer = await Buffer.from(reader.result);
     //set this buffer -using es6 syntax
       this.setState({buffer});
        };


SubmitHash=()=>{
  let web3=this.state.web3
  let Bounty=this.state.rID;
  let hash=this.state.ipfshash
  console.log(Bounty)
  console.log(hash)

  web3.eth.getAccounts((error, accounts) => {
    try{
    PB.SubmitBounty(Bounty,hash,{from:accounts[0]}).then(result=>{
      console.log(result + "result string")
      console.log(result.length)
        this.setState({submissionSelected:true})
    }).then(()=>{
      this.getBountyInfo(accounts[0],Bounty)

    })
  }catch(error){

  }

   })


}
SubmitDispute=()=>{
  let web3=this.state.web3
  let Bounty=this.state.rID;
  let hash=this.state.ipfshash
  console.log(Bounty)
  console.log(hash)
  console.log("disputing upload")
  web3.eth.getAccounts((error, accounts) => {
    try{
    PB.disputeDataUpload(Bounty,hash,{from:accounts[0]}).then(result=>{
      console.log(result + "result string")
      console.log(result.length)
        this.setState({submissionSelected:true})
    }).then(()=>{
      this.getBountyInfo(accounts[0],Bounty)

    })
  }catch(error){

  }

   })


}
onSubmit=async(event)=>{
  event.preventDefault();
  await ipfs.add(this.state.buffer, (err, ipfsHash) => {
          console.log(err,ipfsHash);
          //setState by setting ipfsHash to ipfsHash[0].hash
          console.log(ipfsHash[0].hash)
          if((this.state.BountyStatus==4)||(this.state.BountyStatus==6)||(this.state.BountyStatus==7)){
          this.setState({ ipfsHash:ipfsHash[0].hash },this.SubmitDispute());
          }
          else{
          this.setState({ ipfsHash:ipfsHash[0].hash },this.SubmitHash());
        }

     })


}

handleChange = (fieldName, event) => {
  const state = {
    ...this.state,
  };
  state[fieldName] = event.target.value;
  this.setState(state);
  console.log(state)
};
Dispute=()=>{
  let web3=this.state.web3
  let Bounty=this.state.BountyID;

  web3.eth.getAccounts((error, accounts) => {
    PB.disputeClaim(Bounty,{from:accounts[0]}).then(result=>{
      console.log(result)
    })

   })
  }
 submitPayout=()=>{
   let web3=this.state.web3
   let Bounty=this.state.BountyID;

   web3.eth.getAccounts((error, accounts) => {
     PB.WithDrawReward(Bounty,{from:accounts[0]}).then(result=>{
       console.log(result)
     })

    })
 }


render(){
  let Display=null
  let start=this.state.start
  let end=this.state.end
  console.log(start)
  console.log(end)
  start=start*1000
  end=end*1000
  start= moment(start).format('LLLL');
  console.log(start)
  end=moment(end).format('LLLL')
  console.log(((this.state.BountyStatus==5)||(this.state.BountyStatus==8))&&(this.state.winner==this.state.myAddress))
  if(this.state.killed==true){
    Display=(<div><h3>Game Was Killed by creator</h3></div>)
  }
  else{

  if(this.state.BountyStatus==1){
  Display=  (<h3> Submissions Have not Started Yet </h3>)
  }
  if(this.state.BountyStatus==2){
  Display=  (
  <div>
    <h3> Bounty is Open to Submissions: Choose file to send to IPFS </h3>
    <Form>
      <input
        type = "file"
        onChange = {this.captureFile}
        />
       <Button
       bsStyle="primary"
       onClick={this.onSubmit}>
       Send it
      </Button>
    </Form>
      <SubmissionView address={this.state.myAddress} ipfshash={this.state.ipfsHash} display={this.state.submissionSelected}/>
  </div>)
  }

  if(this.state.BountyStatus==3){
    Display=(<h3> The Bounty has finished accepting Submissions a winner is being chosen Currently</h3>)

   }

  if((this.state.BountyStatus==4)&&(this.state.disputed==true)){


   Display=(<h3> The Bounty winner of {this.state.winner} is being disupted currently</h3>)
    }

    if(this.state.BountyStatus==4){
      Display= (
      <div>
        <h3> The Bounty winner is {this.state.winner} </h3>
        <h3> The bounty payment is currently open to dispute</h3>
        <Form >

           <Button
           bsStyle="primary"
           onClick={ this.Dispute}
           >
           start dispute

           </Button>
        </Form>
        <h3> After the dispute is started comments detailing the nature of you dispute can be uploaded here. Choose file to send to IPFS </h3>
        <Form>
          <input
            type = "file"
            onChange = {this.captureFile}
            />
           <Button
           bsStyle="primary"
           onClick={this.onSubmit}>
           Send it
          </Button>
        </Form>
      </div>
      )

  }
  if(((this.state.BountyStatus==5)||(this.state.BountyStatus==8))) {
  Display=(<div><h3> The Bounty winner is {this.state.winner} </h3>


    </div>)
    if(this.state.winner==this.state.myAddress){
      Display=(
      <div>
      <h3> You have won the bounty </h3>
      <h3>click below to get reward</h3>

        <Button
        bsStyle="primary"
        onClick={this.submitPayout}
        style={{"height" : "40px", "width" : "170px"}}
        >
        Claim Winnings

        </Button>

      </div>
      )
    }
}

  if((this.state.BountyStatus==6)||(this.state.BountyStatus==7)){
 Display=(<div><h3> The Bounty has been disputed. A resolution is being reached. </h3>
   <h3> After the dispute is started comments detailing the nature of you dispute can be uploaded here. Choose file to send to IPFS </h3>
   <Form>
     <input
       type = "file"
       onChange = {this.captureFile}
       />
      <Button
      bsStyle="primary"
      onClick={this.onSubmit}>
      Send it
     </Button>
   </Form>


   </div>)
  }
}
  return(
    <div>
          <header >
            <h1> User Information </h1>
          </header>

          <hr/>

<Grid>
          {Display}

<hr/>


  <Table bordered responsive>
                <thead>
                  <tr>
                    <th>My Submission Info</th>
                    <th>Values</th>

                  </tr>
                </thead>
                <tbody>
                <tr>
                  <td> Bounty Title</td>
                  <td>{this.state.title}</td>
                </tr>
                  <tr>
                    <td>IPFS Hash # storing Bounty Info</td>
                    <td>{this.state.ipfshash}</td>
                  </tr>
                  <tr>
                    <td>Total Registered Players</td>
                    <td>{this.state.totalusers}</td>
                  </tr>
                  <tr>
                    <td>Ethereum Contract Address</td>
                    <td>{this.state.ethAddress}</td>
                  </tr>
                  <tr>
                    <td>Bounty Arbitor Address</td>
                    <td>{this.state.arbitor}</td>
                  </tr>

                  <tr>
                    <td>Payout Amount</td>
                    <td>{this.state.payout}</td>
                  </tr>
                  <tr>
                    <td>Total Submissions</td>
                    <td>{this.state.Submissions}</td>
                  </tr>
                  <tr>
                    <td>Start Date</td>
                    <td>{start}</td>
                  </tr>
                  <tr>
                    <td>End Date</td>
                    <td>{end}</td>
                  </tr>
                </tbody>
            </Table>
        </Grid>
     </div>
   )
}


}
export default UserSubmit;
