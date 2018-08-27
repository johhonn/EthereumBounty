import React, { Component } from 'react';
import {Table, Grid, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ipfs from '../../utils/ipfs'
import getWeb3 from '../../utils/getWeb3'
import PhotoBounty from '../../../build/contracts/PhotoBounty.json'
import moment from 'moment';
let web3
let PB;



class GoalSetup extends Component{

state={
 BountyID:0,
 ipfshash:'',
 buffer:'',
 user:'',
 totalusers:'',
 arbitor:'',
 title:'',
 payout:0,
 start:0,
 end:0,
 SPB:'',
 Submissions:'',
 winner:'',
 ethAddress:''
}

componentWillMount() {
  // Get network provider and web3 instance.
  // See utils/getWeb3 for more info.

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

  const contract = require('truffle-contract')
  let  PBB = contract(PhotoBounty)
  PBB.setProvider(this.state.web3.currentProvider)
  this.state.web3.eth.getAccounts((error, accounts) => {
    PBB.deployed().then((instance) => {

       PB = instance

       console.log(PB)
       PB.getCreatedBounties(accounts[0]).then(result=>{
         this.setState({BountyID:result.length})
         this.setState({ethAddress:PB.address})
         console.log(result.length)
         console.log(result.length +"IDDDDDDDDDDDdS")
         this.setState({SPB:PB},this.getBountyInfo(accounts[0],result.length))

       })

       console.log(PB.address +"constract address")
       console.log(this.state)
     })
   })
}
getBountyInfo=(address,ID)=>{


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
       console.log(buffer)
     //set this buffer -using es6 syntax
       this.setState({buffer});
        };


SubmitHash=()=>{
  let web3=this.state.web3
  let Bounty=this.state.BountyID;
  let hash=this.state.ipfsHash;
  web3.eth.getAccounts((error, accounts) => {
    PB.SetInfo(Bounty,hash,{from:accounts[0]}).then(result=>{
      console.log(result)
    }).then(()=>{
      this.getBountyInfo(accounts[0],Bounty)
    })

   })
}
onSubmit=async(event)=>{
  event.preventDefault();
  await ipfs.add(this.state.buffer, (err, ipfsHash) => {
          console.log(err,ipfsHash);
          console.log("add should have happened")
          //setState by setting ipfsHash to ipfsHash[0].hash
          console.log(ipfsHash[0].hash)
          this.setState({ ipfsHash:ipfsHash[0].hash });
          this.SubmitHash();
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
addUser=(event)=>{
    event.preventDefault()

    let web3=this.state.web3
    let Bounty=this.state.BountyID;
    let User= this.state.user
    console.log(User)
    console.log(Bounty)
    web3.eth.getAccounts((error, accounts) => {
    PB.RegisterParticipant(User,Bounty,{from:accounts[0]}).then(result=>{
      console.log(result +" registered")
    }).then(()=>{
      this.getBountyInfo(accounts[0],Bounty)
    })
  })
}

render(){
  let start=this.state.start
  let end=this.state.end

  start=start*1000
  end=end*1000
  start= moment(start).format('LLLL');
  console.log(start)
  end=moment(end).format('LLLL')
  return(  <div >
          <header >
            <h1> Upload Bounty Info And Invite Participants </h1>
          </header>

          <hr />

<Grid>
          <h3> Choose file to send to IPFS </h3>
          <Form onSubmit={this.onSubmit}>
            <input
              type = "file"
              onChange = {this.captureFile}
            />
             <Button
             bsStyle="primary"
             type="submit">
             Send it

             </Button>
          </Form>
<hr/>
<form onSubmit={this.addUser}>

<label>
 Register Participant Address
<input type='text' width='200px' value={this.state.user} onChange={this.handleChange.bind(this,'user')} ></input>
<Button
bsStyle="primary"
type="submit">
add user
</Button>
</label>
</form>

  <Table bordered responsive>
                <thead>
                  <tr>
                    <th>Current Bounty Info</th>
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
     </div>)
}


}
export default GoalSetup;
