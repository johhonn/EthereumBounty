import React, { Component } from 'react';

class DisputeView extends Component {

    render () {
      let Display=null
      let url="https://gateway.ipfs.io/ipfs/"+this.props.ipfshash
      console.log(this.props)
      if(this.props.display==true){
        Display=(

        <div>
            <h1> Selected Dispute Details</h1>
            <p>The  details outlining the dispute have the ipfs hash  {this.props.ipfshash}</p>
            <a href={url} >View them here</a>
        </div>
      )
    }
        if(this.props.display==false){
        Display=(<div> <h1>Selected Submission</h1></div>)
        }



        return (
          <div>
            {Display}
          </div>
        );
    }
}

export default DisputeView;
