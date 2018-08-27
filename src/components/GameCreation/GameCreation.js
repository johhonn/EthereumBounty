import React, { Component } from 'react';
import { Link ,Redirect} from 'react-router-dom';
import getWeb3 from '../../utils/getWeb3'
import PhotoBounty from '../../../build/contracts/PhotoBounty.json'
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';

import './GameCreation.css'





let PB;

class GameCreation extends Component{

state={
payout:0,
Start:0,
End:0,
DisplayStart:'',
DisplayEnd:'',
name:'',
Judge:'',
web3:'',
info:'',
redirect:false
}


handleChange = (fieldName, event) => {
  const state = {
    ...this.state,
  };
  state[fieldName] = event.target.value;
  this.setState(state);
  console.log(state)
};
handleStartDate=(data)=>{
let temp=data.unix()
this.setState({Start:temp})
this.setState({DisplayStart:data})
console.log(temp)

}
handleEndDate=(data)=>{

let temp1=data.unix()
this.setState({End:temp1})
this.setState({DisplayEnd:data})
console.log(temp1)

}
handleSubmit=async()=>{
  let web3=this.state.web3
  web3.eth.getAccounts((error, accounts) => {
    PB.CreateBounty(this.state.payout,this.state.Start,this.state.End,this.state.Judge,this.state.name,'0x608060405260043610610175576000357c01',{from:accounts[0],value:this.state.payout}).then((result)=>
    {  this.setState({redirect:true})
      return console.log(result)


        console.log('setting state')
    })

   })

//  CreateBounty(uint _payout,uint Start,uint End,address _judge,string _name,bytes32 _info)


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
componentDidUpdate(){
  console.log(this.state.Start)
}
instantiateContract() {
  /*
   * SMART CONTRACT EXAMPLE
   *
   * Normally these functions would be called in the context of a
   * state management library, but for convenience I've placed them here.
   */

  const contract = require('truffle-contract')
  let  PBB = contract(PhotoBounty)
  PBB.setProvider(this.state.web3.currentProvider)
  this.state.web3.eth.getAccounts((error, accounts) => {
    PBB.deployed().then((instance) => {

       PB = instance
       console.log(PB.address +"constract address")
       console.log(PB)
     })
   })
}
render() {
  const redirect  = this.state.redirect;
        console.log(redirect+ "sfasdfhwksehkwuharf")
       if (redirect==true) {
         return <Redirect to='/GameSetup'/>;
       }
return(

      <div>
          <div className="col">
              <h1 className="bg-white d-table-cell">Set Game Info</h1>
          </div>

          <div>
          <form>

          <label>
           Bounty Payout Amount
          <input type='text' value={this.state.value} onChange={this.handleChange.bind(this,'payout')} ></input>
          </label>

          <label>
           Judge Address
          <input type='text'  value={this.state.value} onChange={this.handleChange.bind(this,'Judge')}></input>
          </label>

          <label>
          Bounty Title
          <input type='text' value={this.state.value} onChange={this.handleChange.bind(this,'name')} ></input>
          </label>



          </form>



          </div>
          <label>
           Start Date
          <DatePicker
            selected={this.state.DisplayStart}
            onChange={this.handleStartDate}
            className="myDatePicker"
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="LLL"
            timeCaption="time"
            />
           </label>

           <label>
             End Date
            <DatePicker
              selected={this.state.DisplayEnd}
              onChange={this.handleEndDate}
              className="myDatePicker"
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="LLL"
              timeCaption="time"
              />
           </label>
          <div>
          <button onClick={this.handleSubmit}>Submit</button>
          </div>
      </div>













)
}




}
export default GameCreation;
