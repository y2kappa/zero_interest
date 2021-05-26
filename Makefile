PROGRAMID=UpbA7oUWbQiXyvbkrMtfMF2gZ3W7F6U3jqxXbUvyPrD

build:
	anchor build

deploy:
	anchor upgrade /Users/sanchez/Projects/solana/ziquid/target/deploy/basic_0.so -p $(PROGRAMID)

deploy-new:
	anchor deploy -k tutorial-0.json -u https://api.devnet.solana.com/

run:
	node client.js

listen:
	solana logs $(PROGRAMID)