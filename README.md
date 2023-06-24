# ETHScriptoor
## Infrastrucutre for a better minting experience with ETHScriptions

### What is ETHScriptoor?

I wanted a way to setup a minting experience similar to the one we are used to with traditional NFTs, but bring that to ETHScriptions. I built this system in order to accomplish that. **It is still highly experimental and has not been tested under extreme load.** I plan to build this out over time if the ETHScription protocol continues to flourish. For now, it gets the job done. Below you will finds steps to get setup with the system and how it works. In a basic summary, when you mint from the contract, a bot listens for an event from said contract, and calls a transfer event with the tokenID dataURI as calldata. Below are some pros and cons of using this system:

#### Pros:

- Simple to setup
- Open-Source
- Quickly ethscribes to minters on mint
- Cheap to run
- Lightweight

#### Cons:

- Not permissionless
- Not trustless
- Hasn't been run at high scale
- Doesn't account for fluctuating gas prices
- May require a node to run for large volume of minters
- In-Memory Queue system, could use Redis or something similar instead

### Requirements

- NodeJS
- An [Alchemy Account](alchemy.com)
- Somewhere to host the bot (I used Google Compute Engine)

### Getting Started

First clone the repository and install requirements:

```
git clone https://github.com/M4cs/Ethscriptoor.git
cd ./Ethscriptoor/
yarn install
```

Next setup the `.env` file using the `.env.example` provided in the repo. You will need the following environment variables:

```
ALCHEMY_API_KEY=
ALCHEMY_NETWORK=
ALCHEMY_WSS_RPC=
DEPLOYER_PRIVATE_KEY=0x...
DEPLOYER_CONTRACT_ADDR=0x...
```

**The deployer private key must be the private key to the wallet that deploys the `Ethscriptoor.sol` contract on the blockchain.**

You will need to deploy the contract in `/contracts/` which will act as your minting contract. This contract is very basic and emits a `Mint(address minter, uint256 amount, uint256 startID, uint256 endID)` event. Do not remove this event or the bot will not work properly! It relies on listening to this. You can change the function to do whatever logic you like, but this event **MUST** be emitted properly in order for the bot to work. It's best to leave the logic that relates to this event _alone_.

#### Running the listener

Once you have deployed the contract, installed requirements, and filled out your `.env` file, you can run the bot with:

```
yarn start
```

### How to host the bot easily

I setup a Google Compute Engine instance with a service worker to run the bot and restart it on fail. This can easily be done with the help of ChatGPT or a quick Google Search. You can also deploy it on a VPS, or use any sort of platform that can run a background script without you having to keep it open. If you run it on a server, use tmux or screen or something along those lines!

### Contributions

Please feel free to contribute! The queue system could be improved by using redis or something along the lines, this is very basic and light weight.

### License

```
MIT License

Copyright (c) 2023 Max Bridgland

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```