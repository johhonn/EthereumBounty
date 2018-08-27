var Bounty= artifacts.require('PhotoBounty.sol')
  var lib=artifacts.require('LibraryDemo.sol')
var math=artifacts.require('Math.sol')

module.exports = function(deployer) {

  deployer.deploy(Bounty,10,10,30)
   deployer.deploy(math)
  deployer.link(math,lib)
  deployer.deploy(lib)
};
