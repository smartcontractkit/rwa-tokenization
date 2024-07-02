export const CONTRACT_ADDRESS_REAL_ESTATE = '0x89DccebCB4715937487f472a482217883e64D5E0'

// Warning: Do not copy/paste this code.
// Please refer to the supplied example code in the repository instead.
// The code here has been slightly changed to escape special characters in order to be displayed on the web-page.

export const CONTRACT_CODE = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import { FunctionsClient } from "@chainlink/contracts/src/v0.8/functions/v1_0_0/FunctionsClient.sol";
import { FunctionsRequest } from "@chainlink/contracts/src/v0.8/functions/v1_0_0/libraries/FunctionsRequest.sol";
import { ConfirmedOwner } from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";

import { Base64 } from "@openzeppelin/contracts/utils/Base64.sol";
import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import { IERC20 } from "@openzeppelin/contracts/interfaces/IERC20.sol";

import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import { ERC721URIStorage } from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import { ERC721Burnable } from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";

/**
 * @title Chainlink Functions example consuming Real Estate API
 */
contract RealEstate is
    FunctionsClient,
    ConfirmedOwner,
    ERC721("Tokenized Real Estate", "tRE"),
    ERC721URIStorage,
    ERC721Burnable
{
    using FunctionsRequest for FunctionsRequest.Request;
    using SafeERC20 for IERC20;

    struct APIResponse {
        uint index;
        string tokenId;
        string response;
    }

    struct Houses {
        string tokenId;
        address recipientAddress;
        string homeAddress; 
        string listPrice; 
        string squareFootage;
        uint createTime;
        uint lastUpdate;
    }

    // Chainlink Functions script source code.
    string private constant SOURCE_PRICE_INFO =
        "const id = args[0];"
        "const priceResponse = await Functions.makeHttpRequest({"
        "url: \`https://api.chateau.voyage/house/\${id}\`,"
        "});"
        "if (priceResponse.error) {"
        "throw Error('Housing Price Request Error');"
        "}"
        "const price = priceResponse.data.latestValue;"
        "return Functions.encodeString(price);";

    bytes32 public donId; // DON ID for the Functions DON to which the requests are sent
    uint64 private subscriptionId; // Subscription ID for the Chainlink Functions
    uint32 private gasLimit; // Gas limit for the Chainlink Functions callbacks
    uint public epoch; // Time interval for price updates.
    uint private _totalHouses;

    // Mapping of request IDs to API response info
    mapping(bytes32 => APIResponse) public requests;
    mapping(string => bytes32) public latestRequestId;
    mapping(string tokenId => string price) public latestPrice;

    Houses[] public houseInfo;

    event LastPriceRequested(bytes32 indexed requestId, string tokenId);
    event LastPriceReceived(bytes32 indexed requestId, string response);

    event RequestFailed(bytes error);

    constructor(
        address router,
        bytes32 _donId,
        uint64 _subscriptionId,
        uint32 _gasLimit
    ) FunctionsClient(router) ConfirmedOwner(msg.sender) {
        donId = _donId;
        subscriptionId = _subscriptionId;
        gasLimit = _gasLimit;
    }

    /**
     * @notice Issues new tokenized real estate NFT asset.
     */
    function issueHouse(
        address recipientAddress, 
        string memory homeAddress, 
        string memory listPrice,
        string memory squareFootage
    ) external onlyOwner {
        uint index = _totalHouses;
        string memory tokenId = string(abi.encode(index));

        // increase: _totalHouses.
        _totalHouses++;

        // create: instance of a House.
       houseInfo.push(Houses({
            tokenId: tokenId,
            recipientAddress: recipientAddress,
            homeAddress: homeAddress,
            listPrice: listPrice,
            squareFootage: squareFootage,
            createTime: block.timestamp,
            lastUpdate: block.timestamp
        }));

        setURI(
            index,
            homeAddress,
            listPrice, 
            squareFootage
        );

        _safeMint(recipientAddress, index);
    }

    /**
     * @notice Request \`lastPrice\` for a given \`tokenId\`
     * @param tokenId id of said token e.g. 0
     */
    function requestLastPrice(string calldata tokenId, uint index) external {
        string[] memory args = new string[](1);
        args[0] = tokenId;

        // gets: houseInfo[tokenId]
        Houses storage house = houseInfo[index];

        // ensures: price update is not too soon (i.e. not until a full epoch elapsed).
        require(block.timestamp - house.lastUpdate >= epoch, "RealEstate: Price update too soon");

        bytes32 requestId = _sendRequest(SOURCE_PRICE_INFO, args);
        // maps: \`tokenId\` associated with a given \`requestId\`.
        requests[requestId].tokenId = tokenId;
        // maps: \`index\` associated with a given \`requestId\`.
        requests[requestId].index = index;

        latestRequestId[tokenId] = requestId;

        emit LastPriceRequested(requestId, tokenId);
    }

    /**
     * @notice Construct and store a URI containing the off-chain data.
     * @param tokenId the tokenId associated with the home.
     * @param homeAddress the address of the home.
     * @param listPrice year the home was built.
     * @param squareFootage size of the home (in ft^2)
     */
    function setURI(
        uint tokenId,
        string memory homeAddress,
        string memory listPrice,
        string memory squareFootage
    ) internal {
        // [then] create URI: with property details.
        string memory uri = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "Tokenized Real Estate",'
                        '"description": "Tokenized Real Estate",',
                        '"image": "",'
                        '"attributes": [',
                        '{"trait_type": "homeAddress",',
                        '"value": ',
                        homeAddress,
                        "}",
                        ',{"trait_type": "listPrice",',
                        '"value": ',
                        listPrice,
                        "}",
                        ',{"trait_type": "squareFootage",',
                        '"value": ',
                        squareFootage,
                        "}",
                        "]}"
                    )
                )
            )
        );
            // [then] create: finalTokenURI: with metadata.
            string memory finalTokenURI = string(abi.encodePacked("data:application/json;base64,", uri));

            // [then] set: tokenURI for a given \`tokenId\`, containing metadata.
            _setTokenURI(tokenId, finalTokenURI);

    }

    /**
     * @notice Process the response from the executed Chainlink Functions script
     * @param requestId The request ID
     * @param response The response from the Chainlink Functions script
     */
    function _processResponse(
        bytes32 requestId,
        bytes memory response
    ) private {
        requests[requestId].response = string(response);

        uint index = requests[requestId].index;
        string memory tokenId = requests[requestId].tokenId;

        // store: latest price for a given \`tokenId\`.
        latestPrice[tokenId] = string(response);

        // gets: houseInfo[tokenId]
        Houses storage house = houseInfo[index];

        // updates: listPrice for a given \`tokenId\`.
        house.listPrice = string(response);
        // updates: lastUpdate for a given \`tokenId\`.
        house.lastUpdate = block.timestamp;

        emit LastPriceReceived(requestId, string(response));
    }

    // CHAINLINK FUNCTIONS //

    /**
     * @notice Triggers an on-demand Functions request
     * @param args String arguments passed into the source code and accessible via the global variable \`args\`
     */
    function _sendRequest(
        string memory source,
        string[] memory args
    ) internal returns (bytes32 requestId) {
        FunctionsRequest.Request memory req;
        req.initializeRequest(
            FunctionsRequest.Location.Inline,
            FunctionsRequest.CodeLanguage.JavaScript,
            source
        );
        if (args.length > 0) {
            req.setArgs(args);
        }
        requestId = _sendRequest(
            req.encodeCBOR(),
            subscriptionId,
            gasLimit,
            donId
        );
    }

    /**
     * @notice Fulfillment callback function
     * @param requestId The request ID, returned by sendRequest()
     * @param response Aggregated response from the user code
     * @param err Aggregated error from the user code or from the execution pipeline
     * Either response or error parameter will be set, but never both
     */
    function fulfillRequest(
        bytes32 requestId,
        bytes memory response,
        bytes memory err
    ) internal override {
        if (err.length > 0) {
            emit RequestFailed(err);
            return;
        }
        _processResponse(requestId, response);
    }

    // ERC721 SETTINGS //

    // gets: tokenURI for a given \`tokenId\`.
    function tokenURI(
        uint tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    // checks: interface is supported by this contract.
    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function totalHouses() public view returns (uint) {
        return _totalHouses;
    }

    // OWNER SETTING //

    // prevents excessive calls from UI.
    function setEpoch(uint _epoch) external onlyOwner {
        epoch = _epoch;
    }
}`

export const TABS = [
    {
        label: 'Contracts Imports',
        content:
            'Where we tell our smart contract we want to use Chainlink Functions.',
        highlightedLines: Array.from({ length: 2 }, (v, k) => 3 + k),
    },
    {
        label: 'JavaScript Source',
        content:
            'JavaScript Chainlink Functions will execute. Storing on-chain guarantees only this code will be executed.',
        highlightedLines: Array.from({ length: 10 }, (v, k) => 45 + k),
    },
    {
        label: 'Subscription ID',
        content:
            'Chainlink Functions <a class="explainer-link" href="https://docs.chain.link/chainlink-functions/resources/subscriptions">subscription ID</a> is required for your smart contract to use Chainlink Functions.',
        highlightedLines: [57],
    },
    {
        label: 'Functions Initialization',
        content:
            'We set some Functions-specific configuration values in the contructor, such as the <a class="explainer-link" href="https://docs.chain.link/chainlink-functions/supported-networks">donId</a>, <a class="explainer-link" href="https://docs.chain.link/chainlink-functions/resources/subscriptions">subscriptionId</a>, and gasLimit for the callback transaction.',
        highlightedLines: Array.from({ length: 10 }, (v, k) => 74 + k),
    },
    {
        label: 'Functions Request',
        content:
            'This is called by the UI when a new request is initiated. It sends the request to the Chainlink Functions DoN, along with the tokenId and index of the tokenized asset that requires a price update.',
        highlightedLines: Array.from({ length: 20 }, (v, k) => 125 + k),
    },
    {
        label: 'Functions Response',
        content:
            'This is the function called by the Chainlink Functions DoN when it receives a response from the JavaScript code executed off-chain in the Chainlink Function.',
        highlightedLines: Array.from({ length: 22 }, (v, k) => 198 + k),
    },
]

export const realEstateABI = [
    {
        "type": "constructor",
        "inputs": [
            {
                "name": "router",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "_donId",
                "type": "bytes32",
                "internalType": "bytes32"
            },
            {
                "name": "_subscriptionId",
                "type": "uint64",
                "internalType": "uint64"
            },
            {
                "name": "_gasLimit",
                "type": "uint32",
                "internalType": "uint32"
            }
        ],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "acceptOwnership",
        "inputs": [],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "approve",
        "inputs": [
            {
                "name": "to",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "tokenId",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "balanceOf",
        "inputs": [
            {
                "name": "owner",
                "type": "address",
                "internalType": "address"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "burn",
        "inputs": [
            {
                "name": "tokenId",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "donId",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "bytes32",
                "internalType": "bytes32"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "epoch",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "getApproved",
        "inputs": [
            {
                "name": "tokenId",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "address",
                "internalType": "address"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "handleOracleFulfillment",
        "inputs": [
            {
                "name": "requestId",
                "type": "bytes32",
                "internalType": "bytes32"
            },
            {
                "name": "response",
                "type": "bytes",
                "internalType": "bytes"
            },
            {
                "name": "err",
                "type": "bytes",
                "internalType": "bytes"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "houseInfo",
        "inputs": [
            {
                "name": "",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [
            {
                "name": "tokenId",
                "type": "string",
                "internalType": "string"
            },
            {
                "name": "recipientAddress",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "homeAddress",
                "type": "string",
                "internalType": "string"
            },
            {
                "name": "listPrice",
                "type": "string",
                "internalType": "string"
            },
            {
                "name": "squareFootage",
                "type": "string",
                "internalType": "string"
            },
            {
                "name": "createTime",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "lastUpdate",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "isApprovedForAll",
        "inputs": [
            {
                "name": "owner",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "operator",
                "type": "address",
                "internalType": "address"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "bool",
                "internalType": "bool"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "issueHouse",
        "inputs": [
            {
                "name": "recipientAddress",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "homeAddress",
                "type": "string",
                "internalType": "string"
            },
            {
                "name": "listPrice",
                "type": "string",
                "internalType": "string"
            },
            {
                "name": "squareFootage",
                "type": "string",
                "internalType": "string"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "latestPrice",
        "inputs": [
            {
                "name": "tokenId",
                "type": "string",
                "internalType": "string"
            }
        ],
        "outputs": [
            {
                "name": "price",
                "type": "string",
                "internalType": "string"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "latestRequestId",
        "inputs": [
            {
                "name": "",
                "type": "string",
                "internalType": "string"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "bytes32",
                "internalType": "bytes32"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "name",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "string",
                "internalType": "string"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "owner",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "address",
                "internalType": "address"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "ownerOf",
        "inputs": [
            {
                "name": "tokenId",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "address",
                "internalType": "address"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "requestLastPrice",
        "inputs": [
            {
                "name": "tokenId",
                "type": "string",
                "internalType": "string"
            },
            {
                "name": "index",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "requests",
        "inputs": [
            {
                "name": "",
                "type": "bytes32",
                "internalType": "bytes32"
            }
        ],
        "outputs": [
            {
                "name": "index",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "tokenId",
                "type": "string",
                "internalType": "string"
            },
            {
                "name": "response",
                "type": "string",
                "internalType": "string"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "safeTransferFrom",
        "inputs": [
            {
                "name": "from",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "to",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "tokenId",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "safeTransferFrom",
        "inputs": [
            {
                "name": "from",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "to",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "tokenId",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "data",
                "type": "bytes",
                "internalType": "bytes"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "setApprovalForAll",
        "inputs": [
            {
                "name": "operator",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "approved",
                "type": "bool",
                "internalType": "bool"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "setEpoch",
        "inputs": [
            {
                "name": "_epoch",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "supportsInterface",
        "inputs": [
            {
                "name": "interfaceId",
                "type": "bytes4",
                "internalType": "bytes4"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "bool",
                "internalType": "bool"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "symbol",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "string",
                "internalType": "string"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "tokenURI",
        "inputs": [
            {
                "name": "tokenId",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "string",
                "internalType": "string"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "totalHouses",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "transferFrom",
        "inputs": [
            {
                "name": "from",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "to",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "tokenId",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "transferOwnership",
        "inputs": [
            {
                "name": "to",
                "type": "address",
                "internalType": "address"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "event",
        "name": "Approval",
        "inputs": [
            {
                "name": "owner",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            },
            {
                "name": "approved",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            },
            {
                "name": "tokenId",
                "type": "uint256",
                "indexed": true,
                "internalType": "uint256"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "ApprovalForAll",
        "inputs": [
            {
                "name": "owner",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            },
            {
                "name": "operator",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            },
            {
                "name": "approved",
                "type": "bool",
                "indexed": false,
                "internalType": "bool"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "BatchMetadataUpdate",
        "inputs": [
            {
                "name": "_fromTokenId",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
            },
            {
                "name": "_toTokenId",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "LastPriceReceived",
        "inputs": [
            {
                "name": "requestId",
                "type": "bytes32",
                "indexed": true,
                "internalType": "bytes32"
            },
            {
                "name": "response",
                "type": "string",
                "indexed": false,
                "internalType": "string"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "LastPriceRequested",
        "inputs": [
            {
                "name": "requestId",
                "type": "bytes32",
                "indexed": true,
                "internalType": "bytes32"
            },
            {
                "name": "tokenId",
                "type": "string",
                "indexed": false,
                "internalType": "string"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "MetadataUpdate",
        "inputs": [
            {
                "name": "_tokenId",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "OwnershipTransferRequested",
        "inputs": [
            {
                "name": "from",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            },
            {
                "name": "to",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "OwnershipTransferred",
        "inputs": [
            {
                "name": "from",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            },
            {
                "name": "to",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "RequestFailed",
        "inputs": [
            {
                "name": "error",
                "type": "bytes",
                "indexed": false,
                "internalType": "bytes"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "RequestFulfilled",
        "inputs": [
            {
                "name": "id",
                "type": "bytes32",
                "indexed": true,
                "internalType": "bytes32"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "RequestSent",
        "inputs": [
            {
                "name": "id",
                "type": "bytes32",
                "indexed": true,
                "internalType": "bytes32"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "Transfer",
        "inputs": [
            {
                "name": "from",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            },
            {
                "name": "to",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            },
            {
                "name": "tokenId",
                "type": "uint256",
                "indexed": true,
                "internalType": "uint256"
            }
        ],
        "anonymous": false
    },
    {
        "type": "error",
        "name": "ERC721IncorrectOwner",
        "inputs": [
            {
                "name": "sender",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "tokenId",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "owner",
                "type": "address",
                "internalType": "address"
            }
        ]
    },
    {
        "type": "error",
        "name": "ERC721InsufficientApproval",
        "inputs": [
            {
                "name": "operator",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "tokenId",
                "type": "uint256",
                "internalType": "uint256"
            }
        ]
    },
    {
        "type": "error",
        "name": "ERC721InvalidApprover",
        "inputs": [
            {
                "name": "approver",
                "type": "address",
                "internalType": "address"
            }
        ]
    },
    {
        "type": "error",
        "name": "ERC721InvalidOperator",
        "inputs": [
            {
                "name": "operator",
                "type": "address",
                "internalType": "address"
            }
        ]
    },
    {
        "type": "error",
        "name": "ERC721InvalidOwner",
        "inputs": [
            {
                "name": "owner",
                "type": "address",
                "internalType": "address"
            }
        ]
    },
    {
        "type": "error",
        "name": "ERC721InvalidReceiver",
        "inputs": [
            {
                "name": "receiver",
                "type": "address",
                "internalType": "address"
            }
        ]
    },
    {
        "type": "error",
        "name": "ERC721InvalidSender",
        "inputs": [
            {
                "name": "sender",
                "type": "address",
                "internalType": "address"
            }
        ]
    },
    {
        "type": "error",
        "name": "ERC721NonexistentToken",
        "inputs": [
            {
                "name": "tokenId",
                "type": "uint256",
                "internalType": "uint256"
            }
        ]
    },
    {
        "type": "error",
        "name": "EmptyArgs",
        "inputs": []
    },
    {
        "type": "error",
        "name": "EmptySource",
        "inputs": []
    },
    {
        "type": "error",
        "name": "NoInlineSecrets",
        "inputs": []
    },
    {
        "type": "error",
        "name": "OnlyRouterCanFulfill",
        "inputs": []
    }
] as const