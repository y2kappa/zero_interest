PROGRAMID=UpbA7oUWbQiXyvbkrMtfMF2gZ3W7F6U3jqxXbUvyPrD

.PHONY: build deploy build-client run listen deploy-new

build:
	anchor build

deploy:
	anchor upgrade /Users/sanchez/Projects/solana/ziquid/target/deploy/basic_0.so -p $(PROGRAMID)

deploy-new:
	anchor deploy -k tutorial-0.json -u https://api.devnet.solana.com/

build-client:
	npm run build

run:
	npm run start

listen:
	solana logs $(PROGRAMID)