const solc = require('solc');
const fs = require('fs');
const path = require('path');

// Get contract paths
const tokenPath = path.resolve(__dirname, '../contracts/TapRaceToken.sol');
const gamePath = path.resolve(__dirname, '../contracts/GameContract.sol');

// Read the contracts
const tokenSource = fs.readFileSync(tokenPath, 'utf8');
const gameSource = fs.readFileSync(gamePath, 'utf8');

// Create input for compiler
const input = {
  language: 'Solidity',
  sources: {
    'TapRaceToken.sol': {
      content: tokenSource
    },
    'GameContract.sol': {
      content: gameSource
    }
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['abi', 'evm.bytecode']
      }
    }
  }
};

// Compile
console.log('Compiling contracts...');
const output = JSON.parse(solc.compile(JSON.stringify(input)));

// Check for errors
if (output.errors) {
  output.errors.forEach(error => {
    console.error(error.formattedMessage);
  });
  if (output.errors.some(e => e.severity === 'error')) {
    process.exit(1);
  }
}

// Create artifacts directory
const artifactsDir = path.resolve(__dirname, '../lib/contracts');
if (!fs.existsSync(artifactsDir)) {
  fs.mkdirSync(artifactsDir, { recursive: true });
}

// Save ABIs and bytecode
const contracts = ['TapRaceToken', 'GameContract'];
contracts.forEach(contractName => {
  const fileName = contractName + '.sol';
  const contract = output.contracts[fileName][contractName];
  
  // Save ABI
  fs.writeFileSync(
    path.join(artifactsDir, `${contractName}.json`),
    JSON.stringify({
      abi: contract.abi,
      bytecode: contract.evm.bytecode.object
    }, null, 2)
  );
  
  console.log(`✓ ${contractName} compiled and ABI saved`);
});

console.log('\nCompilation complete!');
