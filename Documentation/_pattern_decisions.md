Two different circuit brakers are implementes. One can only be used by the contract creator and prevents new Bounties from being created. The second can only be activated by the Bounty Creator before the bounty has started and cancels the created Bounty and returns the .

Bounties function as State Machine with 8 possible stages based on time and whether a Bounty has been disputed
period 1: Game has been created but not started
period 2: Game has started but not ended
period 3: Game has ended and is within the interval for validation where a winner can be chosen
period 4: Game can be Disputed
period 5; Game is completed;
period 6: Game has been disputed and is still in the arbitrationInterval
period 7: Game has been disputed and is past the arbitration interval
period 8: Game is past the dispute TimeOut which is nonzero
The state auto depreciates using modifiers depending on five variable startDate, endDate, arbitrationInterval, validationInterval,and TimeOut

For functions a Fail early and fail loud design pattern has been used with strict require statements being implemented for all cases where functions should fail.
