const {ethers} = require('hardhat');

async function main() {
    v3FactoryFactory = await ethers.getContractFactory('UniswapV3Factory');
    v3Factory = await v3FactoryFactory.deploy();
    await v3Factory.deployed();
    console.log('UniswapV3Factory deployed to:', v3Factory.address);
    await hre.run("verify:verify", {
        address: v3Factory.address,
        constructorArguments: [
        ],
      });
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });