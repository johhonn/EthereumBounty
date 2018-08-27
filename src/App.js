import React, { Component } from 'react'

import { Route, Link,Switch,BrowserRouter  } from 'react-router-dom';
import getWeb3 from './utils/getWeb3'
import GameCreation from './components/GameCreation/GameCreation'
import GameInfoDisplay from './components/GameInfoDisplay/GameInfoDisplay'
import GoalSetup from './components/GoalSetup/GoalSetup'
import UserSubmit from './components/UserSubmit/UserSubmit'
import OwnerConsole from './components/OwnerConsole/OwnerConsole'
import JudgeConsole from './components/BountyJudgeConsole/JudgeConsole'
import  EditSetup from './components/EditBounty/EditSetup'
import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)
 }



  render() {
    return (
      <BrowserRouter>
      <div className="App">
      <div><h3><Link to="/creation">CreateBounty</Link></h3></div>
      <h3><Link to="/mygames">ViewMyBounties</Link></h3>
       <h3>This Web App allows for the creation of  simple Ethereum Bounty Requests</h3>
        <p>Click The Create Bounty link to make a new bounty request. Click the ViewMyBounties link to see all Bounties you have created and are registered for </p>

        <Switch>
          <Route path="/creation"  component={GameCreation} />
          <Route path="/mygames"  component={GameInfoDisplay} />
          <Route path="/GameSetup" component={GoalSetup}/>
          <Route path="/UserSubmit"  component={UserSubmit}/>
          <Route path="/OwnerConsole"  component={OwnerConsole}/>
          <Route path="/JudgeConsole" component={JudgeConsole}/>
          <Route path="/EditSetup" component={EditSetup}/>
        </Switch>

      </div>
        </BrowserRouter>
      );
    }
  }

export default App
