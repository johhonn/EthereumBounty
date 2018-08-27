import React, { Component } from 'react';
import {Table, Grid, Button, Form } from 'react-bootstrap';
import EditSetup from '../EditBounty/EditSetup'
import { Link,Route} from 'react-router-dom';
import ipfs from '../../utils/ipfs'
import getWeb3 from '../../utils/getWeb3'
import PhotoBounty from '../../../build/contracts/PhotoBounty.json'

import SubmissionView from '../SubmissionView/SubmissionView'
import moment from 'moment';
let web3;
let PB;



class OwnerConsole extends Component{

state={
 BountyID:this.props.location.pathname.slice(14),
 rID:'',
 subID:0,
 ipfshash:'',
 subhash:'',
 subaddress:'',
 buffer:'',
 user:'',
 totalusers:'',
 arbitor:'',
 title:'',
 payout:0,
 start:0,
 end:0,
 submissionSelected:false,
 web3:'',
 BountyStatus:0,
 Submissions:'',
 winner:'',
 myAddress:'',
 ethAddress:'',
 killed:false
}

componentDidMount() {
  // Get network provider and web3 instance.
  // See utils/getWeb3 for more info.
 console.log(this.props + "props")
 console.log(this.props.location.pathname.slice(14))
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
  console.log(this.props)
  const contract = require('truffle-contract')
  let  PBB = contract(PhotoBounty)
  PBB.setProvider(this.state.web3.currentProvider)
  var id=this.state.BountyID

  console.log(id)
  this.state.web3.eth.getAccounts((error, accounts) => {
    this.setState({myAddress:accounts[0]})
    PBB.deployed().then((instance) => {

       PB = instance
       console.log(PB)

       PB.getCreatedBounties(accounts[0]).then(result=>{

         let r=result[id-1].c[0]
        this.setState({rID:r})
        this.getBountyInfo(accounts[0],r)
        console.log(PB.address +"constract address")
        this.setState({ethAddress:PB.address})
          })
       })


       console.log(this.state)
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
  console.log(ID)
  PB.getTimePeriod(ID).then(result=>{
    console.log(result.c[0] + "time period *********************************")
    this.setState({BountyStatus:result})
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
        submitPayout=()=>{
          let web3=this.state.web3
          let Bounty=this.state.BountyID;

          web3.eth.getAccounts((error, accounts) => {
            PB.WithDrawReward(Bounty,{from:accounts[0]}).then(result=>{
              console.log(result)
            })

           })
        }


onSubmit=async(event)=>{
  event.preventDefault();
  await ipfs.add(this.state.buffer, (err, ipfsHash) => {
          console.log(err,ipfsHash);
          //setState by setting ipfsHash to ipfsHash[0].hash
          this.setState({ ipfsHash:ipfsHash[0].hash });
          this.SubmitHash();
     })


}
handleChange = (fieldName, event) => {
    event.preventDefault()
  const state = {
    ...this.state,
  };
  state[fieldName] = event.target.value;
  this.setState(state);
  console.log(state)
};
getSubmission=()=>{
  event.preventDefault()
  let web3=this.state.web3
  let Bounty=this.state.rID;
   console.log("clicked")
  web3.eth.getAccounts((error, accounts) => {
    PB.ViewSubmision(Bounty,this.state.subID).then(result=>{
      console.log(result)
      console.log(result[0])
     this.setState({subhash:result[0]})
      this.setState({subaddress:result[1]})
      this.setState({ submissionSelected:true})
    })

   })

}
chooseWinner=()=>{
  let web3=this.state.web3
  let Bounty=this.state.BountyID;
  let submission=this.state.subID
  console.log(submission)
  console.log(Bounty)
  web3.eth.getAccounts((error, accounts) => {
    PB.VerifySubmission(Bounty,submission,{from:accounts[0]}).then(result=>{
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
 if(this.state.BountyStatus==1){
   Display=(<div><h1> Bounty has not yet started</h1>
    <h3><Link to={{pathname:"/EditSetup"+ '/'+this.state.BountyID}}> Click here to edit Game Details</Link></h3>
       <Route path={'/EditSetup'+'/:id'} exact component={EditSetup} />
     </div>)
 }
 if(this.state.killed==true){
  Display=(<div><h3>You have killed the Bounty</h3></div>)
 }else{

  if(this.state.BountyStatus==2){
  Display=(<div>
    <h3> Bounty in Progress: View Current Submissions</h3>
      <Form >
        <input
          type = "text"
          onChange = {this.handleChange.bind(this,'subID')}
          />
          <Button
            bsSize="small"
            bsStyle="primary"
            onClick={this.getSubmission}

            >
            View Info

          </Button>
        </Form>
        <SubmissionView address={this.state.subaddress} ipfshash={this.state.subhash} display={this.state.submissionSelected}/>
    </div>)
  }

  if(this.state.BountyStatus==3){
  Display=(
    <div>
    <h3>Game has finished View Submissions and Select Winner</h3>
    <Form >
      <input
        type = "text"
        onChange = {this.handleChange.bind(this,'subID')}
      />
       <Button
       bsStyle="primary"
       onClick={this.getSubmission}
        style={{"height" : "40px", "width" : "170px"}}
       >
       Get Submission info

       </Button>
    </Form>
    <h3> Set submission {this.state.subID} as a winning Submission</h3>
    <Form>

       <Button
       bsStyle="primary"

       onClick={this.chooseWinner}>
       Send it

       </Button>
    </Form>
      <SubmissionView address={this.state.subaddress} ipfshash={this.state.subhash} display={this.state.submissionSelected}/>
   </div>
  )
}
  if(this.state.BountyStatus==4){
    Display=(<div>
      <h3>The Bounty is in its arbitration period.</h3>
      </div>
    )
  }
  if((this.state.BountyStatus==6)||(this.state.BountyStatus==7)){
 Display=(<div>
   <h3> The Bounty has been disputed. A resolution is being reached. </h3>
   <h3>View Old Submissions </h3>
     <Form >
       <input
         type = "text"
         onChange = {this.handleChange.bind(this,'subID')}
         />
         <Button
           bsStyle="primary"
           onClick={this.getSubmission}
           >
           Display info

         </Button>
       </Form>
       <SubmissionView address={this.state.subaddress} ipfshash={this.state.subhash} display={this.state.submissionSelected}/>
       </div>)
  }
  if(((this.state.BountyStatus==5)||(this.state.BountyStatus==8))) {
    if(this.state.winner==this.state.myAddress){
      Display=(
      <div>
      <h3> No Submissions have been selected as Winners. </h3>
      <h3>click below to get back deposit</h3>

        <Button
        bsStyle="primary"
        onClick={this.submitPayout}
          style={{"height" : "40px", "width" : "150px"}}
        >
        Claim Winnings

        </Button>

      </div>
      )

    }
    else{
    Display=(<div>
      <h3> Bounty Has been completed. The winner is {this.state.winner}</h3>
      <h3>View Old Submissions </h3>
        <Form >
          <input
            type = "text"
            onChange = {this.handleChange.bind(this,'subID')}
            />
            <Button
              bsStyle="primary"
              onClick={this.getSubmission}
              >
              Display info

            </Button>
          </Form>
          <SubmissionView address={this.state.subaddress} ipfshash={this.state.subhash} display={this.state.submissionSelected}/>
      </div>)
    }

  }
}
  return(  <div >
          <header >
            <h1> Manage Bounty and view Info </h1>
          </header>

          <hr />

<Grid>
  {Display}


<hr/>


  <Table bordered responsive>
                <thead>
                  <tr>
                    <th>My Bounty Info</th>
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
export default OwnerConsole;
