import React, { Component } from 'react';
import getWeb3 from '../../utils/getWeb3'
import PhotoBounty from '../../../build/contracts/PhotoBounty.json'
import {Link,Route} from 'react-router-dom';
import UserSubmit from '../UserSubmit/UserSubmit'
import OwnerConsole from  '../OwnerConsole/OwnerConsole'
import JudgeConsole from '../BountyJudgeConsole/JudgeConsole'
let PB
class GameInfoDisplay extends Component{
state={
  CreatedGames:0,
  RegisteredGames:0,
  GamesToJudge:0,

  BountyID:'',
  BountyID2:'',
  BountyID3:'',

  RGameClicked:false,
  CGameClicked:false
}
getGameInfo=()=>{
  const contract = require('truffle-contract')
  let  PBB = contract(PhotoBounty)
  PBB.setProvider(this.state.web3.currentProvider)
  this.state.web3.eth.getAccounts((error, accounts) => {
    PBB.deployed().then((instance) => {

       PB = instance
       PB.gettotalCreatedBounties(accounts[0]).then(result=>{
         console.log(result)
         this.setState({CreatedGames:result.c[0]})

         console.log(result)
       })
       PB.gettotalRegisteredBounties(accounts[0]).then(result=>{
          console.log( result)

         this.setState({RegisteredGames:result.c[0]})

       })
       PB.gettotalGamesToJudge(accounts[0]).then(result=>{
          console.log( result)

         this.setState({GamesToJudge:result.c[0]})

       })
       console.log(PB.address +"constract address")
       console.log(PB)
     })
   })

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
    this.getGameInfo()
  })
  .catch(() => {
    console.log('Error finding web3.')
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


render(){

  let BountyID=this.state.BountyID
  let BountyID2=this.state.BountyID2
  let BountyID3=this.state.BountyID3
  console.log(this.state)
  return(<div><h1>You Game Info</h1>
        <div><p>You have Created {this.state.CreatedGames} Bounties</p>
          <form>

            <label>
              Find Created Game
              <input type='text' value={this.state.BountyID} onChange={this.handleChange.bind(this,'BountyID')} ></input>
              </label>
              <Link to={{pathname:"/OwnerConsole"+ '/'+this.state.BountyID}}>
              <button >Submit</button>
              </Link>
            </form>
        </div>

        <div><p>You are registered for {this.state.RegisteredGames} Bounties</p>
          <form>

          <label>
            Find Registered Game
            <input type='text' value={this.state.BountyID2} onChange={this.handleChange.bind(this,'BountyID2')} ></input>
            </label>
            <Link to={{pathname:"/UserSubmit"+ '/'+this.state.BountyID2}}>
            <button> Submit</button>
            </Link>
          </form>
        </div>
        <div><p>You are registered to Resolve Disputes in {this.state.GamesToJudge} Bounties</p>
          <form>

          <label>
            Get Bounty
            <input type='text' value={this.state.BountyID3} onChange={this.handleChange.bind(this,'BountyID3')} ></input>
            </label>
            <Link to={{pathname:"/JudgeConsole"+ '/'+this.state.BountyID3}}>
            <button >Submit</button>
            </Link>
          </form>
        </div>
        <Route path={'/UserSubmit'+'/:id'} exact component={UserSubmit} />
        <Route path={'/OwnerConsole'+'/:id'} exact component={OwnerConsole} />
          <Route path={"/JudgeConsole"+'/:id'} exact component={JudgeConsole}/>
       </div>)
}






}
export default GameInfoDisplay;
