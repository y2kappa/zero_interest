// client.js is used to introduce the reader to generating clients from IDLs.
// It is not expected users directly test with this example. For a more
// ergonomic example, see `tests/basic-0.js` in this workspace.

const anchor = require('@project-serum/anchor');
const programPublicKey = "UpbA7oUWbQiXyvbkrMtfMF2gZ3W7F6U3jqxXbUvyPrD";
const programId = new anchor.web3.PublicKey(programPublicKey);
const idl = JSON.parse(require('fs').readFileSync('./target/idl/basic_0.json', 'utf8'));

// Configure the local cluster.
anchor.setProvider(anchor.Provider.local("https://api.devnet.solana.com/"));
const program = new anchor.Program(idl, programId);


// Instructions
async function initializeMarket() {
  await program.rpc.initializeMarket();
}
async function initializeTrove() {
  await program.rpc.initializeTrove();
}
async function depositTroveSol() {
  await program.rpc.depositTroveSol();
}

console.log('Running client.');
// initializeMarket().then(() => console.log('Success'));
// initializeTrove().then(() => console.log('Success'));
depositTroveSol().then(() => console.log('Success'));
