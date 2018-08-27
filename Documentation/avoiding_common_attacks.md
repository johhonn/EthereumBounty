Reentrency attacks are prevented through the contract logic.In functions that transfer ether variables are set preventing them to be called again while ether is being transfered.In
WithDrawReward and KillBounty the variable finished which is required to be false is set to true before transfer is called.


The contract is not dependent of the balance being zero to prevent forcibly sending ether attacks.

Modifications to the state are heavily restricted by both time and account to prevent any cross racing conditions .The only Bounty parameters that can be changed after creation are the registered users and the bounty ipfs info hash and this can only be done for a fixed time period.

Bounty participation is limited to registered accounts and each account is limited to one submission to prevent excess spam submssions.

In practical use  contract time dependent variables have intervals which do not require an accuracy of more than 30 seconds so they are not susceptible to miner based manipulation.

The submission order for bounties is susceptible to transaction ordering attacks however this can mitigated by requirements specific to each bounty use case. The bounty creator could consider bounties submitted within certain block intervals to be ties in terms of ordering and judge the winner strictly by quality of submission. A third party verification service could also be required for the submitted photos
