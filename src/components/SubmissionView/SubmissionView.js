import React, { Component } from 'react';

class SubmissionView extends Component {

    render () {
      let Display=null
      let url="https://gateway.ipfs.io/ipfs/"+this.props.ipfshash
      console.log(this.props)
      if(this.props.display==true){
        Display=(

        <div>
            <h1>Selected Submission</h1>
            <p>The Submission owner is {this.props.address}</p>
            <p>the submission ipfs hash is {this.props.ipfshash}</p>
            <a href={url} >See it here</a>
        </div>
      )
    }
        if(this.props.display==false){
        Display=(<div> <h1></h1></div>)
        }



        return (
          <div>
            {Display}
          </div>
        );
    }
}

export default SubmissionView;
