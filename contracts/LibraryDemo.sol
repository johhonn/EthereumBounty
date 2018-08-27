pragma solidity ^0.4.24;
import "./Math.sol";

contract LibraryDemo{

using Math for *;

/*Calculates e^x for positve and negative input n
In the case where x is less that 0 so taht e^x<1 the result is multiplied by 10**18 to account for decimal places
*/
function CalculateExponential(int n) constant returns(uint){
  int input=0x10000000000000000*n;
    if(n<0){
      return (((10**18)*(input.exp()))/0x10000000000000000);

    }
    else {
      return ((input.exp())/0x10000000000000000);
    }
}


}
