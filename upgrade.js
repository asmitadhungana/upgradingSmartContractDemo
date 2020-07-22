const Web3 = require('web3');
const { Contracts, ProxyAdminProject, ZWeb3 } = require('@openzeppelin/upgrades');

async function main(web3) {
  // Create web3 provider and initialize OpenZeppelin upgrades
  if (!web3) web3 = new Web3('http://localhost:8545');
  ZWeb3.initialize(web3.currentProvider)

  // Create an OpenZeppelin project
  const [from] = await ZWeb3.eth.getAccounts();
  const project = new ProxyAdminProject('MyProject', null, null, { from, gas: 1e6, gasPrice: 1e9 });

  // Deploy an instance of SimpleStorage
  console.log('Creating an upgradeable instance of v3...');
  const SimpleStorage = Contracts.getFromLocal('SimpleStorage');
  const instance = await project.createProxy(SimpleStorage);
  const address = instance.options.address;
  console.log(`Contract created at ${address}`);

  await instance.methods.initialize()
    .send({ from, gas: 1e5, gasPrice: 1e9 });
  
  // Upgrade it to V2
  console.log('Upgrading to v4...');
  const SimpleStorageV4 = Contracts.getFromLocal('SimpleStorageV4');
  const instanceV4 = await project.upgradeProxy(address, SimpleStorageV4);
  console.log(`Contract upgraded at ${instanceV4.options.address}`);

  //Interact with the contract
  await instanceV4.methods.changeValue("klm", 10)
    .send({ from, gas: 1e5, gasPrice: 1e9 });

  return instanceV4;
}

main();




//   const b4storedValue = await instance.methods.retrieve().call();
//   console.log(b4storedValue);



//   const afterStoredValue = await instanceV4.methods.retrieve().call();
//   console.log(afterStoredValue);

