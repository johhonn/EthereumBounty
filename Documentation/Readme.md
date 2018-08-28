This Web App allows for the creation of  simple Ethereum Bounty Requests.It can run using npm run start.
It was designed with use of photos in mind but any type of document that can be uploaded to ipfs can be requested as bounty.
There are 3 roles for Users
1.creator
2.bounty submitter
3.bounty judge

Bounty Time periods
1.Game Setup
2.Submission interval
3.Validation interval
4.Dispute creation Interval
5.Dispute resolution interval

The creator sets up a Bounty. They set the start and endDate for submissions.They choose the bounty reward paybout and must deposit that exact amount into the contract. They choose a judge that resolves disputes. They upload instuctions for the bounty requirements as an a file on IPFS.
They then register users who can submit bounties.
Users who submit bounties must be registered and have only one chance for submission which must be between the bounty start and end date. Submissions must be in the form of a file uploaded on IPFS.
After the submission window has passed the creator has a fixed period of time that is built into the contract to select a winner. If the creator decides no submissions fulfills his requirements he can select no winner and withdraw the
payout deposit he initially deposited.
There is then a fixed period of time in which any user who has made a submission can choose to dispute the previously chosen results. They have the option to upload an ipfs file detailing their issues with the results of the bounty.

After a dispute has been made the judge can choose any submission as a new winner including the bounty creator by selecting submission 0. If the judge fails to act in given time period the dispute will timeout and the original winner will be able to claim the payout.
If no dispute was made the winner can withdraw their payout directly after the arbitration Interval has ended.

Note on Web Interface: Bounties and Submissions are selected via text input. Given 5 bounties the first can be selected by entering 1, the second by selecting 2 and so on.
The interface updates dynamically based on the time passed in the smart contract. 
