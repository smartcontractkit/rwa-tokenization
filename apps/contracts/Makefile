-include .env

.PHONY: all test clean deploy fund help install snapshot format anvil scopefile deploy-bridges

DEFAULT_ANVIL_KEY := 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

all: remove install build

# Clean Repo
clean  :; forge clean

# Remove Modules
remove :; rm -rf .gitmodules && rm -rf .git/modules/* && rm -rf lib && touch .gitmodules && git add . && git commit -m "modules"

# Install Libs
install :; forge install https://github.com/smartcontractkit/chainlink lib/chainlink --no-commit && forge install https://github.com/smartcontractkit/chainlink-local lib/chainlink-local --no-commit && forge install https://github.com/foundry-rs/forge-std lib/forge-std --no-commit && forge install https://github.com/OpenZeppelin/openzeppelin-contracts lib/openzeppelin-contracts --no-commit
# cyfrin/foundry-devops --no-commit && forge install smartcontractkit/chainlink-brownie-contracts@0.8.0 --no-commit && forge install foundry-rs/forge-std --no-commit && forge install openzeppelin/openzeppelin-contracts --no-commit

# Update Dependencies
update:; forge update

build:; forge build

test :; forge test