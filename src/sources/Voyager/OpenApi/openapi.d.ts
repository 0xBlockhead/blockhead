export interface paths {
    "/txns": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get transactions
         * @description Retrieve a paginated list of all transactions on the Starknet network with optional filtering.
         */
        get: operations["listTransactions"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/meta-txns": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get meta transactions
         * @description List meta-transactions (transactions using the "execute from outside" pattern) for a specific contract account.
         */
        get: operations["listMetaTransactions"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/txns/{txnHash}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get transaction by hash
         * @description Retrieve detailed information about a specific transaction using its hash.
         */
        get: operations["getTransactionByHash"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/token-transfers": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get token transfers
         * @description Get a list of token transfers. Supports filtering by token address, sender, receiver, block range, and timestamp range.
         */
        get: operations["getTokenTransfers"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tokens": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get tokens
         * @description List all deployed tokens on the Starknet network with filtering and sorting options.
         */
        get: operations["listTokens"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tokens/{address}/holders": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get token holders
         * @description Retrieves a paginated list of token holders for a specific ERC20 token, including holder addresses, balances, aliases, and last transfer times.
         */
        get: operations["getTokenHolders"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tokens/{address}/holders/overview": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get holders analytics overview
         * @description Returns the holders-analytics snapshot for a verified ERC-20 token: concentration metrics, tier distribution, Gini coefficient, and optional wallet-depth histogram. Returns `{ overview: null }` when no snapshot has been computed yet. Returns 404 for tokens outside the scope of this endpoint (non-verified or non-ERC-20).
         */
        get: operations["getTokenHoldersOverview"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/contracts": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get contracts
         * @description Retrieve a paginated list of all contracts deployed on Starknet. Contracts are deployed from classes.
         */
        get: operations["listContracts"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/contracts/{contractAddress}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get contract by address
         * @description Retrieve detailed information about a specific contract using its address.
         */
        get: operations["getContractByAddress"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/contracts/{contractAddress}/token-balances": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get contract token balances
         * @description Retrieve the token balances of a specific contract address.
         */
        get: operations["getContractTokenBalances"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/contracts/{contractAddress}/transfers": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get contract token transfers
         * @description Retrieve token transfers for a contract.
         *
         *     **Time-window rules** (checked in this order):
         *     1. If the contract has no transfer activity at all, an empty response is returned with `range.startTimestamp` and `range.endTimestamp` set to `null`.
         *     2. `timestampFrom` must be ≤ `timestampTo`, otherwise a **400** error is returned.
         *     3. Every user-provided timestamp must fall within the contract's activity range (`range.startTimestamp` … `range.endTimestamp`). If any provided timestamp is outside, an empty `items` array is returned together with the `range` object — use it to discover the valid window.
         *     4. When both are provided, the span must not exceed **90 days**, otherwise a **400** error is returned.
         *
         *     **Defaults when only one timestamp is provided:**
         *     - Only `timestampFrom` (must be inside the activity range) → `timestampTo` defaults to `min(lastTransfer, timestampFrom + 90 days)`.
         *     - Only `timestampTo` (must be inside the activity range) → `timestampFrom` defaults to `max(firstTransfer, timestampTo − 90 days)`.
         *     - Neither provided → the latest 90 days of activity.
         *
         *     Every response includes a `range` object with the contract's first and latest transfer timestamps. Use `range` to page through the full history.
         */
        get: operations["getContractTransfers"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/contracts/{contractAddress}/erc20-balance-history": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get ERC20 balance history
         * @description Retrieve the historical daily balances of ERC20 tokens ever held by a contract address.
         */
        get: operations["getContractBalanceHistory"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/contracts/{contractAddress}/erc20-tokens-held": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get ERC20 tokens ever held
         * @description Retrieve the list of ERC20 tokens that a specific contract address has ever held, along with the latest known balance and metadata.
         */
        get: operations["getContractTokensHeld"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/classes": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get classes
         * @description Retrieve a paginated list of all classes (smart contract templates) on the Starknet network.
         */
        get: operations["listClasses"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/classes/verified": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get verified classes
         * @description Retrieve a paginated list of all verified contract classes on Starknet. Verified classes have their source code validated and publicly available.
         */
        get: operations["listVerifiedClasses"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/classes/{classHash}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get class by hash
         * @description Retrieve detailed information about a specific class using its hash.
         */
        get: operations["getClassByHash"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/classes/{classHash}/source": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get class source code
         * @description Retrieve the verified source code for a specific class on the Starknet network.
         */
        get: operations["getClassSourceCode"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/classes/{classHash}/contracts": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get class contracts
         * @description Retrieve a list of all contracts deployed from a specific class.
         */
        get: operations["listClassContracts"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/nft-contract/{contract_address}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get NFT contract
         * @description Retrieve detailed information about an NFT contract including its metadata, statistics, and collection information.
         */
        get: operations["getNftContract"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/nft/{contract_address}/{token_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get NFT details
         * @description Get detailed information about a specific NFT including metadata.
         */
        get: operations["getNftDetails"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/nft-events": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get NFT events
         * @description Get a paginated list of NFT events (transfers, mints, burns).
         */
        get: operations["getNftEvents"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/nft-balances": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get NFT balances
         * @description Get NFT balances for a collection or specific token.
         */
        get: operations["getNftBalances"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/nft-holders": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get NFT holders
         * @description Get a list of holders for an NFT collection.
         */
        get: operations["getNftHolders"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/nft-items": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get NFT items
         * @description Get a list of NFT items from a collection, optionally filtered by owner.
         */
        get: operations["getNftItems"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/nft-contract-balance": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get NFT contract balance
         * @description Get NFT collection balances for a specific owner address.
         */
        get: operations["getNftContractBalance"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/nft-transfers": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get NFT transfers
         * @description Get a paginated list of NFT transfers for a collection.
         */
        get: operations["getNftTransfers"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/nft-stats": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get NFT stats
         * @description Get statistics for NFT collections including volume, sales, and floor price.
         */
        get: operations["getNftStats"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/marketplace-stats": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get marketplace stats
         * @description Get statistics for NFT marketplaces.
         */
        get: operations["getMarketplaceStats"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/nft/update-metadata/{contract_address}/{token_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Request NFT metadata update
         * @description Request a refresh of the metadata for a specific NFT.
         */
        post: operations["requestNftMetadataUpdate"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/blocks": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get blocks
         * @description Retrieve a paginated list of all blocks on the Starknet network. Each block contains multiple transactions.
         */
        get: operations["listBlocks"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/blocks/{blockHash}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get block by hash
         * @description Retrieve detailed information about a specific block using its hash.
         */
        get: operations["getBlockByHash"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/staking/overview": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get staking overview
         * @description Get an overview of staking statistics and metrics for the Starknet network.
         */
        get: operations["getStakingOverview"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/staking/validators": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get validators
         * @description Returns a paginated list of staking validators with detailed information including stake amounts, delegators, commission rates, APR calculations, and staking power metrics for both STRK and BTC assets.
         */
        get: operations["listValidators"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/staking/validator-details": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get validator details
         * @description Get detailed information about a specific validator.
         */
        get: operations["getValidatorDetails"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/staking/validator-pool-info": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get validator pool info
         * @description Get staking pool information for a validator.
         */
        get: operations["getValidatorPoolInfo"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/staking/delegators": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get delegators
         * @description Get a paginated list of delegators for a specific validator.
         */
        get: operations["listDelegators"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/staking/wallet-info": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get wallet staking info
         * @description Get staking information for a specific wallet address.
         */
        get: operations["getWalletStakingInfo"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/staking/delegators-over-time": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get delegators over time
         * @description Get historical data of delegator count over time.
         */
        get: operations["getDelegatorsOverTime"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/staking/stake-over-time": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get stake over time
         * @description Get historical data of total stake over time.
         */
        get: operations["getStakeOverTime"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/staking/wallet-info/stake-over-time": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get wallet stake over time
         * @description Get historical stake data for a specific wallet.
         */
        get: operations["getWalletStakeOverTime"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/staking/wallet-info/activity": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get wallet staking activity
         * @description Get staking activity history for a specific wallet.
         */
        get: operations["getWalletStakingActivity"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/staking/validator-details/activity": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get validator activity
         * @description Get staking activity history for a specific validator.
         */
        get: operations["getValidatorActivity"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/staking/attestations": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get attestations
         * @description Get validator attestation records.
         */
        get: operations["getAttestations"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/events": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get events
         * @description Retrieve a paginated list of all events emitted on Starknet with optional filtering. Note: The contract parameter cannot be mixed with blockHash or txnHash parameters.
         */
        get: operations["listEvents"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/messages": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get messages
         * @description Retrieve a paginated list of all messages on Starknet, including L1-L2 and L2-L1 bridge transactions.
         */
        get: operations["listMessages"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/message/{msgHash}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get message by hash
         * @description Retrieve detailed information about a specific message using its message hash.
         */
        get: operations["getMessageByHash"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/message/{msgHash}/bridgeTransactions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get bridge transactions
         * @description Get bridge transactions associated with a message.
         */
        get: operations["getMessageBridgeTransactions"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/daily-stats": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get daily statistics
         * @description Retrieves aggregated historical metrics for the Starknet network over a specified time range. Supports querying individual metrics or all available metrics across different time periods.
         */
        get: operations["getDailyStats"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/daily-stats/today": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get today's statistics
         * @description Returns real-time aggregated metrics for the Starknet network for the current day, including transaction stats, user operations, network activity, account growth, TVL, and block fees.
         */
        get: operations["getTodayStats"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/stats": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get network statistics
         * @description Retrieve current network statistics for Starknet, including transaction counts, performance metrics, and financial data.
         */
        get: operations["getNetworkStats"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/event-activity": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get event activities
         * @description Get a list of event activities including token transfers. At least one of `from_address` or `to_address` must be provided.
         */
        get: operations["getEventActivities"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tx-activity": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get transaction activities
         * @description Get a paginated list of transaction activities with decoded function call information. Supports filtering by sender address and block range. Note: `from_block` can only be used together with `sender_address`; providing `from_block` without `sender_address` will return a 400 error.
         */
        get: operations["getTransactionActivities"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/class-verify/job/{job}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get verification job status
         * @description Query the status of a created verification job by its job ID. This endpoint provides tracking for the current status of a submitted contract verification.
         */
        get: operations["getVerificationJobStatus"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/class-verify/check/{hash}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get verification status
         * @description Check if a class or contract is verified.
         */
        get: operations["checkVerificationStatus"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/class-verify/{hash}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Submit contract verification
         * @description Submit contract source code for verification against a deployed class hash on Starknet.
         */
        post: operations["submitVerification"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api-status": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get API status
         * @description Retrieve the current status of Voyager APIs, including uptime and lag information.
         */
        get: operations["getApiStatus"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        ErrorResponse: {
            /** @description Error message */
            error: string;
        };
        MessageErrorResponse: {
            /** @description Error type */
            error: string;
            /** @description Detailed error message */
            message: string;
        };
        ForbiddenResponse: {
            /** @description Authentication error message */
            message: string;
        };
        RateLimitResponse: {
            /** @description Rate limit exceeded message */
            message: string;
        };
        BadRequestResponse: {
            /** @description Validation error message */
            error: string;
        };
        NotFoundResponse: {
            /** @description Not found error message */
            error: string;
        };
        /** @description Standard pagination parameters */
        PaginationQuery: {
            /**
             * @description Page number. Defaults to 1.
             * @default 1
             */
            p: number;
            /**
             * @description Number of items per page. Available options: 10, 25, 50, 100.
             * @default 25
             */
            ps: number;
        };
        /** @description Cursor-based pagination parameters */
        CursorPaginationQuery: {
            /**
             * @description Opaque cursor returned by the previous response. Omit for the first request.
             * @default ffffffffffffffffffffff
             */
            cursor: string;
            /**
             * @description Maximum number of items to return. Defaults to 25.
             * @default 25
             */
            limit: number;
        };
        ListBlocksResponse: {
            items: {
                blockNumber: number | null;
                hash?: string | null;
                timestamp: number | null;
                stateRoot?: string | null;
                txnCount: number | null;
                messageCount: number | null;
                eventCount: number | null;
                l1VerificationTxHash?: string | null;
                status?: string | null;
            }[];
            lastPage: number;
        };
        BlockHashParam: {
            /** @description Block number, block hash (0x-prefixed hex), or "pre_confirmed" for pending blocks. */
            blockHash: string;
        };
        BlockDetails: {
            blockNumber: number | null;
            hash?: string | null;
            timestamp: number | null;
            stateRoot?: string | null;
            txnCount: number | null;
            messageCount: number | null;
            eventCount: number | null;
            l1VerificationTxHash?: string | null;
            status?: string | null;
            prevBlockHash?: string | null;
            nextBlockHash?: string | null;
            confirmations: number | null;
            sequencerAddress?: string | null;
            totalFee?: string | null;
            timeToMine: number | null;
            version?: string | null;
            ethGasPrice?: string | null;
            strkGasPrice?: string | null;
            l1AcceptTime: number | null;
        };
        ListTransactionsQuery: {
            /**
             * @description Page number. Defaults to 1.
             * @default 1
             */
            p: number;
            /**
             * @description Number of items per page. Available options: 10, 25, 50, 100.
             * @default 25
             */
            ps: number;
            /** @description Filter transactions sent to a specific contract address. */
            to?: string;
            /**
             * @description Filter by block. Accepts a block number, a block hash (0x-prefixed hex string), or "pre_confirmed" for pending transactions.
             * @default
             */
            block: string;
            /**
             * @description Filter by transaction type: DEPLOY (0), INVOKE (1), DECLARE (2), L1_HANDLER (3), DEPLOY_ACCOUNT (4).
             * @enum {string}
             */
            type?: "0" | "1" | "2" | "3" | "4" | "null";
            /**
             * @description When "true", returns only rejected transactions. Ignored when block is set (rejected transactions are not associated with any block). Can be combined with the "to" filter. Defaults to false.
             * @enum {string}
             */
            rejected?: "true" | "false";
        };
        ListTransactionsResponse: {
            items: ({
                blockNumber: number;
                hash: string;
                index: number;
                l1VerificationHash: string;
                classHash: string | null;
                contractAddress: string | null;
                timestamp: number;
                actualFee: string | null;
                contractAlias: string | null;
                classAlias: string | null;
                status: string;
                type: string;
            } | {
                hash: string;
                type: string;
                timestamp: number;
                contractAddress: string;
                classHash: string;
                status: string;
                failureCode: string;
            })[];
            lastPage: number;
        };
        MetaTransactionsQuery: {
            /**
             * @description Page number. Defaults to 1.
             * @default 1
             */
            p: number;
            /**
             * @description Number of items per page. Available options: 10, 25, 50, 100.
             * @default 25
             */
            ps: number;
            /** @description Filter by destination contract address (0x-prefixed hex). */
            to: string;
        };
        ListMetaTransactionsResponse: {
            items: {
                blockNumber: number;
                blockId: string;
                hash: string;
                index: number;
                l1VerificationHash: string;
                classHash: string | null;
                contractAddress: string | null;
                timestamp: number;
                actualFee: string | null;
                contractAlias: string | null;
                classAlias: string | null;
                senderAddress: string | null;
                senderAlias: string | null;
                status: string;
                type: string;
                actions: string | null;
                executionStatus: string;
                finalityStatus: string;
                operations: string | null;
                name?: string | null;
                selector?: string | null;
                revertError?: string | null;
            }[];
            lastPage: number;
        };
        TransactionHashParam: {
            /** @description Transaction hash (0x-prefixed hex). */
            txnHash: string;
        };
        TransactionDetails: {
            blockNumber: number;
            hash: string;
            index: number;
            l1VerificationHash: string;
            classHash: string | null;
            contractAddress: string | null;
            timestamp: number;
            actualFee: string | null;
            contractAlias: string | null;
            classAlias: string | null;
            status: string;
            type: string;
            blockId: string;
            actualFeeUnit: string | null;
            usdFormattedMaxFee: string | null;
            usdHistoricalFormattedMaxFee: string | null;
            executionResources: {
                steps?: string | null;
                memory_holes?: string | null;
                pedersen_builtin_applications?: string | null;
                range_check_builtin_applications?: string | null;
                bitwise_builtin_applications?: string | null;
                output_builtin_applications?: string | null;
                ecdsa_builtin_applications?: string | null;
                ec_op_builtin_applications?: string | null;
                poseidon_builtin_applications?: string | null;
                keccak_builtin_applications?: string | null;
                segment_arena_builtin?: string | null;
                data_availability?: {
                    l1_gas?: string | null;
                    l1_data_gas?: string | null;
                };
            } | {
                l1_gas?: string | null;
                l1_data_gas?: string | null;
                l2_gas?: string | null;
            };
            tip: string | null;
            receipt: {
                events: {
                    id?: string | null;
                    blockNumber: number | null;
                    blockHash?: string | null;
                    fromAddress?: string | null;
                    timestamp: number | null;
                    selector?: string | null;
                    name?: string | null;
                    nestedName?: string | null;
                    nestedEventNames: (string | null)[];
                    contractAlias?: string | null;
                }[];
                tokensTransferred: {
                    from?: string | null;
                    to?: string | null;
                    amount?: string | null;
                    function?: string | null;
                    tokenId?: string | null;
                    tokenAddress?: string | null;
                    tokenName?: string | null;
                    symbol?: string | null;
                    decimals: number | null;
                    usd?: string | null;
                    usdHistoricalPrice: number | null;
                    usdHistorical?: string | null;
                    fromAlias?: string | null;
                    toAlias?: string | null;
                    index?: number | null;
                    tokenLogoUrl?: string | null;
                }[];
                feeTransferred: {
                    from?: string | null;
                    to?: string | null;
                    amount?: string | null;
                    function?: string | null;
                    tokenId?: string | null;
                    tokenAddress?: string | null;
                    tokenName?: string | null;
                    symbol?: string | null;
                    decimals: number | null;
                    usd?: string | null;
                    usdHistoricalPrice: number | null;
                    usdHistorical?: string | null;
                    fromAlias?: string | null;
                    toAlias?: string | null;
                    index?: number | null;
                    tokenLogoUrl?: string | null;
                }[];
                nftTransferred: {
                    /** @enum {string} */
                    type: "Mint" | "Transfer" | "Burn" | "Sale";
                    nftContractAddress?: string | null;
                    tokenId?: string | null;
                    from?: string | null;
                    to?: string | null;
                    quantity?: string | null;
                    collectionName?: string | null;
                    collectionImage?: string | null;
                    collectionSymbol?: string | null;
                    itemName?: string | null;
                    itemImage?: string | null;
                    itemImageSmall?: string | null;
                    fromAlias?: string | null;
                    toAlias?: string | null;
                    marketplaceContractAddress?: string | null;
                    nftPrice?: string | null;
                    paymentTokenAddress?: string | null;
                }[];
            };
            /** @enum {string} */
            executionStatus: "Rejected" | "Reverted" | "Succeeded";
            signature: (string | null)[];
            contractAddressSalt: string | null;
            senderAddress: string | null;
            maxFee: string | null;
            nonce: string | null;
            version: string | null;
            selector: string;
            calldata?: string[];
            constructorCalldata?: string[];
            transactionFailureReason?: {
                code?: string | null;
                error_message?: string | null;
            };
            revertError: string | null;
        };
        ListContractsParams: {
            /**
             * @description Page number. Defaults to 1.
             * @default 1
             */
            p: number;
            /**
             * @description Number of items per page. Available options: 10, 25, 50, 100.
             * @default 25
             */
            ps: number;
            /**
             * @description Filter by contract type. Case-insensitive.
             * @enum {string|null}
             */
            type?: "account" | "erc20" | "erc721" | "erc1155" | "unknown" | "proxy" | null;
        };
        ListContractsResponse: {
            items: {
                address: string;
                blockNumber: number;
                isAccount: boolean;
                isErcToken: boolean;
                isProxy: boolean;
                type: string;
                creationTimestamp: number;
                verifiedTimestamp: number | null;
                classAlias: string | null;
                contractAlias: string | null;
                classHash: string;
                version: string | null;
                blockHash: string;
            }[];
            lastPage: number;
        };
        ContractAddressParams: {
            /** @description Starknet contract address (0x-prefixed hex). */
            contractAddress: string;
        };
        ContractDetails: {
            address: string;
            blockNumber: number;
            isAccount: boolean;
            isErcToken: boolean;
            isProxy: boolean;
            type: string;
            creationTimestamp: number;
            verifiedTimestamp: number | null;
            classAlias: string | null;
            contractAlias: string | null;
            classHash: string;
            version: string | null;
            blockHash: string;
            nonce: number;
            implementationContract: string | null;
            tokenName: string | null;
            tokenSymbol: string | null;
        };
        ListTokenBalancesResponse: {
            erc20TokenBalances: {
                address?: string | null;
                balance?: string | null;
                decimals?: (number | null) | (string | null) | null;
                symbol?: string | null;
                name?: string | null;
                usdBalance?: string | null;
                usdFormattedBalance?: string | null;
                formattedBalance?: string | null;
                iconLogo?: string | null;
                isVerified?: boolean | null;
                price?: number | null;
                tags?: ("Unknown" | "Verified" | "Community" | "Unruggable" | "AVNU")[] | null;
            }[];
            verfiedTokensCount: number;
            totalTokensCount: number;
            totalUsdValue: string;
        };
        ContractTransfersQuery: {
            /**
             * @description Number of items per page. Available options: 10, 25, 50, 100.
             * @default 25
             */
            ps: number;
            /**
             * @description Token standard to filter by: "erc20", "erc721", or "erc1155". Defaults to "erc20".
             * @default erc20
             * @enum {string}
             */
            type: "erc20" | "erc721" | "erc1155";
            /** @description Filter by sender address (0x-prefixed hex). */
            from?: string | null;
            /** @description Filter by recipient address (0x-prefixed hex). */
            to?: string | null;
            /** @description Filter by token symbol (e.g. ETH, STRK). */
            symbol?: string | null;
            /** @description Token contract address (0x-prefixed hex). */
            tokenAddress?: string | null;
            /** @description Unix timestamp (seconds) for the start of the query window (inclusive). Must be within the contract's transfer activity range, available in the response `range` object. If omitted, it is derived automatically from timestampTo (up to 90 days back or the contract's first transfer). The window between timestampFrom and timestampTo must not exceed 90 days. */
            timestampFrom?: number | null;
            /** @description Unix timestamp (seconds) for the end of the query window (inclusive). Must be within the contract's transfer activity range, available in the response `range` object. If omitted, it is derived automatically from timestampFrom (up to 90 days forward or the contract's last transfer). The window between timestampFrom and timestampTo must not exceed 90 days. */
            timestampTo?: number | null;
            /**
             * @description Transaction execution phase: VALIDATE, EXECUTE, FEE_TRANSFER, ALL_EXCEPT_FEE_TRANSFER (ERC-20 only: hide fee-phase transfers), or ALL (no filter). Defaults to ALL.
             * @default ALL
             */
            invocationType: string | null;
            /** @description Cursor for keyset pagination. Pass the id from the last item of the previous response to fetch the next page. */
            id?: string;
            /**
             * @description Sort direction: ascending or descending. Defaults to descending.
             * @default desc
             * @enum {string}
             */
            order_by: "asc" | "desc";
        };
        ListContractTransfersResponse: {
            /** @description Token transfer records for the requested window. */
            items: ({
                blockNumber: number | null;
                tokenAddress?: string | null;
                timestamp: number | null;
                operator?: string | null;
                transferFrom?: string | null;
                transferTo?: string | null;
                dataLen: number | null;
                ids?: (string | null) | (string | null)[] | null;
                values?: (string | null) | (string | null)[] | null;
                txHash?: string | null;
                callName?: string | null;
                blockHash?: string | null;
                fromAlias?: string | null;
                toAlias?: string | null;
                fromDomain?: string | null;
                toDomain?: string | null;
                invocationType?: string | null;
                tokenName: string | null;
                tokenSymbol: string | null;
                tokenDecimals: number | null;
                tokenIcon: string | null;
            } | {
                blockNumber: number | null;
                tokenAddress?: string | null;
                timestamp: number | null;
                transferFrom?: string | null;
                transferTo?: string | null;
                txHash?: string | null;
                callName?: string | null;
                blockHash?: string | null;
                fromAlias?: string | null;
                toAlias?: string | null;
                fromDomain?: string | null;
                toDomain?: string | null;
                invocationType?: string | null;
                tokenName: string | null;
                tokenSymbol: string | null;
                tokenDecimals: number | null;
                tokenIcon: string | null;
            } | {
                blockNumber: number | null;
                tokenAddress?: string | null;
                timestamp: number | null;
                transferFrom?: string | null;
                transferTo?: string | null;
                transferValue?: string | null;
                transferValueFormatted?: string | null;
                txHash?: string | null;
                callName?: string | null;
                blockHash?: string | null;
                fromAlias?: string | null;
                toAlias?: string | null;
                fromDomain?: string | null;
                toDomain?: string | null;
                invocationType?: string | null;
                tokenName: string | null;
                tokenSymbol: string | null;
                tokenDecimals: number | null;
                tokenIcon: string | null;
            })[];
            /** @description True when additional pages are available. Pass the last item's id to fetch the next page. */
            hasMore: boolean;
            /** @description The contract's full transfer activity range. Use these values to construct follow-up queries. */
            range: {
                /** @description Unix timestamp (seconds) of the contract's first recorded transfer, or null if no transfers exist. */
                startTimestamp: number | null;
                /** @description Unix timestamp (seconds) of the contract's most recent transfer, or null if no transfers exist. */
                endTimestamp: number | null;
            };
        };
        BalanceHistoryQuery: {
            /**
             * @description Time window: "1w", "1m", "3m", "6m", or "1y". Defaults to "1m".
             * @default 1m
             * @enum {string}
             */
            timerange: "1y" | "1m" | "3m" | "6m" | "1w";
            /** @description Token contract address (0x-prefixed hex). */
            token_address?: string;
        };
        BalanceHistoryResponse: {
            address: string;
            name: string;
            symbol: string;
            decimals: number | null;
            balance?: string | null;
            logo?: string;
            isVerified?: boolean | null;
            lastTransferTime?: number | null;
            balanceHistory: {
                day: string;
                balance?: string | null;
            }[];
        }[] | null;
        TokensHeldResponse: {
            address: string;
            name: string;
            symbol: string;
            decimals: number | null;
            balance?: string | null;
            lastTransferTime: number | null;
            logo?: string;
            isVerified?: boolean | null;
        }[] | null;
        ListClassesResponse: {
            items: {
                hash: string;
                transactionHash: string;
                version: string | null;
                type: number | null;
                isAccount: boolean | null;
                isProxy: boolean | null;
                isErcToken: boolean | null;
                creationTimestamp: number | null;
            }[];
            lastPage: number;
        };
        ListVerifiedClassesResponse: {
            items: {
                classHash: string;
                verifiedTimestamp: number;
                verifiedName: string;
            }[];
            lastPage: number;
        };
        ClassHashParam: {
            /** @description Starknet class hash (0x-prefixed hex). */
            classHash: string;
        };
        ClassDetails: {
            hash: string;
            transactionHash: string;
            version: string | null;
            type: number | null;
            isAccount: boolean | null;
            isProxy: boolean | null;
            isErcToken: boolean | null;
            creationTimestamp: number | null;
            contractsCount: number | null;
            declaredBy: string;
            code: string | {
                [key: string]: string;
            } | null;
            abi?: unknown;
            byteCode: string[] | null;
            license: string | null;
        };
        ClassSourceCode: {
            classHash: string;
            sourceCode: {
                [key: string]: string;
            } | string | null;
            compilerVersion: string;
            verifiedTimestamp: number;
            adminName?: string;
            verifiedName?: string;
        };
        ListClassContractsResponse: {
            items: {
                address: string;
                creationTimestamp: number;
                txnCount: number;
                starknetId: string;
                accountCallCount?: number;
                contractAlias: string | null;
                constructorCalldata: string[] | null;
            }[];
            lastPage: number;
        };
        ListTokensQuery: {
            /**
             * @description Page number. Defaults to 1.
             * @default 1
             */
            p: number;
            /**
             * @description Number of items per page. Available options: 10, 25, 50, 100.
             * @default 25
             */
            ps: number;
            /**
             * @description Token standard to filter by: "erc20", "erc721", or "erc1155". Defaults to "erc20".
             * @default erc20
             * @enum {string}
             */
            type: "erc20" | "erc721" | "erc1155";
            /**
             * @description Sort tokens by attribute: "holders" (holder count), "transfers" (transfer count), or "market_cap". Defaults to "holders".
             * @default holders
             * @enum {string}
             */
            attribute: "holders" | "transfers" | "market_cap";
        };
        ListTokensResponse: {
            items: {
                address: string;
                name: string | null;
                symbol: string | null;
                decimals: string | null;
                transfers: string;
                holders: string;
                /** @enum {string} */
                type: "erc20" | "erc721" | "erc1155";
            }[];
            lastPage: number;
        };
        /** @description Token contract address parameter */
        TokenAddressParam: {
            /** @description Token contract address (0x-prefixed hex). */
            address: string;
        };
        TokenHoldersQuery: {
            /**
             * @description Page number. Defaults to 1.
             * @default 1
             */
            p: number;
            /**
             * @description Number of items per page. Available options: 10, 25, 50, 100.
             * @default 25
             */
            ps: number;
            /**
             * @description Token standard to filter by: "erc20", "erc721", or "erc1155". Defaults to "erc20".
             * @default erc20
             * @enum {string}
             */
            type: "erc20" | "erc721" | "erc1155";
        };
        ListTokenHoldersResponse: {
            items: ({
                owner?: string | null;
                balance?: string | null;
                lastTransferTime: number | null;
                contractAlias?: string | null;
                starknetId?: string | null;
            } | {
                owner?: string | null;
                balance?: string | null;
                lastTransferTime: number | null;
                contractAlias?: string | null;
                starknetId?: string | null;
            } | {
                lastTransferTime: number | null;
                contractAlias?: string | null;
                starknetId?: string | null;
                decimals?: string | null;
                holder?: string | null;
                balance?: string | null;
                balanceSeparated?: string | null;
            })[];
            lastPage: number;
            hasMore: boolean;
        };
        /** @description Holders analytics overview snapshot (null when no snapshot yet) */
        HoldersOverviewResponse: {
            overview: {
                tokenAddress: string;
                totalSupply: string;
                burnedSupply: string;
                circulatingSupply: string;
                holderCount: number;
                holdersOver1Pct: number;
                topNConcentration: {
                    top5: number;
                    top10: number;
                    top100: number;
                };
                concentrationBuckets: {
                    top_1_5: number;
                    top_6_10: number;
                    top_11_25: number;
                    top_26_50: number;
                    top_51_100: number;
                    outside_100: number;
                };
                tierDistribution: {
                    /** @enum {string} */
                    tier: "whale" | "shark" | "dolphin" | "fish" | "crab" | "shrimp";
                    count: number;
                    supplyShare: number;
                }[];
                walletDepthUsd: {
                    usdThreshold: number;
                    walletCount: number;
                }[] | null;
                giniTop10k: number;
                tokenUsdPrice: number | null;
                computedAt: string;
                isStale: boolean;
                isRecomputing: boolean;
            } | null;
        };
        Event: {
            blockNumber: number | null;
            transactionNumber: number | null;
            number: number | null;
            fromAddress?: string | null;
            classHash?: string | null;
            transactionHash?: string | null;
            blockId?: string | null;
            timestamp: number | null;
            id?: string | null;
            classAlias?: string | null;
            contractAlias?: string | null;
            name?: string | null;
            nestedName?: string | null;
            nestedEventNames?: (string | null)[];
            selector?: string | null;
            dataDecoded?: {
                name?: string | null;
                value?: (string | null) | (string | null)[] | {
                    value?: unknown;
                    type?: string | null;
                }[] | {
                    value?: unknown;
                    type?: string | null;
                } | null;
                type?: string | null;
            }[];
            keyDecoded?: {
                name?: string | null;
                value?: (string | null) | (string | null)[] | {
                    value?: unknown;
                    type?: string | null;
                }[] | {
                    value?: unknown;
                    type?: string | null;
                } | null;
                type?: string | null;
            }[];
        };
        ListEventsParams: {
            /**
             * @description Page number. Defaults to 1.
             * @default 1
             */
            p: number;
            /**
             * @description Number of items per page. Available options: 10, 25, 50, 100.
             * @default 25
             */
            ps: number;
            /** @description Filter by contract address. Mutually exclusive with blockHash and txnHash — providing both returns 400. */
            contract?: string;
            /** @description Filter by transaction hash. Mutually exclusive with contract — providing both returns 400. */
            txnHash?: string;
            /** @description Filter by block hash. Mutually exclusive with contract — providing both returns 400. */
            blockHash?: string;
        };
        ListEventsResponse: {
            items: {
                blockNumber: number | null;
                transactionNumber: number | null;
                number: number | null;
                fromAddress?: string | null;
                classHash?: string | null;
                transactionHash?: string | null;
                blockId?: string | null;
                timestamp: number | null;
                id?: string | null;
                classAlias?: string | null;
                contractAlias?: string | null;
                name?: string | null;
                nestedName?: string | null;
                nestedEventNames?: (string | null)[];
                selector?: string | null;
                dataDecoded?: {
                    name?: string | null;
                    value?: (string | null) | (string | null)[] | {
                        value?: unknown;
                        type?: string | null;
                    }[] | {
                        value?: unknown;
                        type?: string | null;
                    } | null;
                    type?: string | null;
                }[];
                keyDecoded?: {
                    name?: string | null;
                    value?: (string | null) | (string | null)[] | {
                        value?: unknown;
                        type?: string | null;
                    }[] | {
                        value?: unknown;
                        type?: string | null;
                    } | null;
                    type?: string | null;
                }[];
            }[];
            lastPage: number;
        };
        /** @enum {string} */
        MessageStatus: "sent" | "pending" | "consumed";
        /** @enum {string} */
        MessageType: "l2l1" | "l1l2";
        MessageDetail: {
            metadata: {
                hash?: string | null;
                count: number | null;
                /** @enum {string} */
                type: "l2l1" | "l1l2";
                from_address?: string | null;
                to_address?: string | null;
                selector?: string | null;
                payload?: string | null;
                l1ContractAlias?: string | null;
                l2ContractAlias?: string | null;
                metaInfo: (null | {
                    timestamp: number | null;
                    txHash?: string | null;
                    blockHash?: string | null;
                    /** @enum {string} */
                    status: "sent" | "pending" | "consumed";
                })[];
                displayInfo: {
                    /** @enum {string} */
                    status: "sent" | "pending" | "consumed";
                    l1VerificationHash?: string | null;
                }[];
                l1_transaction_hash?: string | null;
                bridgeTxCount?: number | null;
                indexingComplete?: boolean;
            };
            l1l2: {
                hash?: string | null;
                from_address?: string | null;
                to_address?: string | null;
                selector?: string | null;
                payload?: (string | null)[];
                fee?: string | null;
            } | null;
            l2l1: {
                hash?: string | null;
                from_address?: string | null;
                to_address?: string | null;
                payload?: (string | null)[];
            } | null;
        };
        MessageHashParam: {
            /** @description L1 ↔ L2 message hash (0x-prefixed hex). */
            msgHash: string;
        };
        ListMessagesParams: {
            /** @description Filter by block number, block hash, or "pre_confirmed". */
            block?: string;
            /** @description Filter by contract address (0x-prefixed hex). */
            contract?: string;
            /** @description Message direction as numeric index: 0 = L1→L2, 1 = L2→L1. */
            type?: string;
            /**
             * @description Page number. Defaults to 1.
             * @default 1
             */
            p: number;
            /**
             * @description Number of items per page. Available options: 10, 25, 50, 100.
             * @default 25
             */
            ps: number;
        };
        ListMessagesResponse: {
            items: {
                number?: string | null;
                hash?: string | null;
                block_number: number | null;
                tx_hash?: string | null;
                from_address?: string | null;
                to_address?: string | null;
                l1_blocks_hash?: string | null;
                l2_blocks_hash?: string | null;
                timestamp: number | null;
                verified_block_number: number | null;
                alias_l1_contract_address?: string | null;
                block_hash?: string | null;
                /** @enum {string} */
                type: "l2l1" | "l1l2";
                routeToL1?: boolean | null;
                contractAlias?: string | null;
            }[];
            lastPage: number;
        };
        ListBridgeTransactionsResponse: {
            items: {
                l2_transaction_hash?: string | null;
                l1_contract_address?: string | null;
                l2_token_bridge_address?: string | null;
                l1_address?: string | null;
                l2_address?: string | null;
                type: number | null;
                amount: number | null;
                fee: number | null;
                contractAlias?: string | null;
                starknetId?: string | null;
                l1ContractAlias?: string | null;
                timestamp: number | null;
                l1_transaction_hash?: string | null;
                token_address?: string | null;
                tokenName?: string | null;
                tokenSymbol?: string | null;
                tokenDecimals: number | null;
                routeToL1?: boolean | null;
                iconLogo?: string | null;
            }[];
            lastPage: number;
        };
        NftContractParam: {
            /**
             * @description Opaque cursor returned by the previous response. Omit for the first request.
             * @default ffffffffffffffffffffff
             */
            cursor: string;
            /**
             * @description Maximum number of items to return. Defaults to 25.
             * @default 25
             */
            limit: number;
            /** @description Starknet contract address (0x-prefixed hex). */
            contract_address: string;
        };
        NftContract: {
            contractAddress?: string | null;
            contractType: number | null;
            name?: string | null;
            description?: string | null;
            symbol?: string | null;
            imageUrl?: string | null;
            imageSmallUrl?: string | null;
            imageLargeUrl?: string | null;
            externalUrl?: string | null;
            bannerUrl?: string | null;
            createdAtBlockNumber: number | null;
            creatorAddress?: string | null;
            latestActivity?: {
                tokenId?: string | null;
                transactionHash?: string | null;
                timestamp: number | null;
                totalPrice?: string | null;
                /** @enum {string} */
                type?: "Mint" | "Transfer" | "Burn" | "Sale";
            };
            stats?: {
                totalSupply?: string | null;
                totalOwners: number | null;
                totalSalesVolume?: string | null;
                averagePrice?: string | null;
            };
            isVerified?: boolean | null;
        };
        NftObjectParam: {
            /**
             * @description Opaque cursor returned by the previous response. Omit for the first request.
             * @default ffffffffffffffffffffff
             */
            cursor: string;
            /**
             * @description Maximum number of items to return. Defaults to 25.
             * @default 25
             */
            limit: number;
            /** @description Starknet contract address (0x-prefixed hex). */
            contract_address: string;
            /** @description NFT token ID within the collection. */
            token_id?: string | null;
        };
        NftObject: {
            contractAddress?: string | null;
            collectionName?: string | null;
            tokenId?: string | null;
            contractType: number | null;
            name?: string | null;
            description?: string | null;
            externalUrl?: string | null;
            attributes: unknown[] | null;
            imageUrl?: string | null;
            imageSmallUrl?: string | null;
            imageLargeUrl?: string | null;
            youtubeUrl?: string | null;
            animationUrl?: string | null;
            mintedByAddress?: string | null;
            mintedAtTimestamp: number | null;
            mintedAtBlockNumber: number | null;
            mintedAtTransactionHash?: string | null;
            updatedAt: number | null;
            latestActivity?: {
                tokenId?: string | null;
                transactionHash?: string | null;
                timestamp: number | null;
                totalPrice?: string | null;
                /** @enum {string} */
                type?: "Mint" | "Transfer" | "Burn" | "Sale";
            };
            balance?: {
                contractAddress?: string | null;
                ownerAddress?: string | null;
                contractAddressAlias?: string | null;
                ownerAddressAlias?: string | null;
                balance: number | null;
                tokenId?: string | null;
                lastTransferTime: number | null;
            };
            isVerified?: boolean | null;
            mintedByAddressAlias?: string | null;
        };
        NftEventsQuery: {
            /**
             * @description Opaque cursor returned by the previous response. Omit for the first request.
             * @default ffffffffffffffffffffff
             */
            cursor: string;
            /**
             * @description Maximum number of items to return. Defaults to 25.
             * @default 25
             */
            limit: number;
            /** @description Starknet contract address (0x-prefixed hex). */
            contract_address: string;
            /** @description NFT token ID within the collection. */
            token_id?: string | null;
        };
        NftEvent: {
            transactionHash?: string | null;
            blockNumber: number | null;
            tokenId?: string | null;
            fromAddress?: string | null;
            toAddress?: string | null;
            fromAlias?: string | null;
            toAlias?: string | null;
            nftContractAddress?: string | null;
            quantity: number | null;
            paymentTokenAddress?: string | null;
            paymentTokenSymbol?: string | null;
            totalPrice?: string | null;
            marketplaceContractAddress?: string | null;
            timestamp: number | null;
            name?: string | null;
            imageUrl?: string | null;
            imageSmallUrl?: string | null;
            imageLargeUrl?: string | null;
            /** @enum {string} */
            type?: "Mint" | "Transfer" | "Burn" | "Sale";
        };
        NftBalancesQuery: {
            /**
             * @description Page number. Defaults to 1.
             * @default 1
             */
            p: number;
            /**
             * @description Number of items per page. Available options: 10, 25, 50, 100.
             * @default 25
             */
            ps: number;
            /** @description Starknet contract address (0x-prefixed hex). */
            contract_address: string;
            /** @description NFT token ID within the collection. */
            token_id?: string | null;
        };
        NftBalance: {
            contractAddress?: string | null;
            ownerAddress?: string | null;
            contractAddressAlias?: string | null;
            ownerAddressAlias?: string | null;
            balance: number | null;
            tokenId?: string | null;
            lastTransferTime: number | null;
        };
        NftHoldersQuery: {
            /**
             * @description Page number. Defaults to 1.
             * @default 1
             */
            p: number;
            /**
             * @description Number of items per page. Available options: 10, 25, 50, 100.
             * @default 25
             */
            ps: number;
            /** @description Starknet contract address (0x-prefixed hex). */
            contract_address: string;
            /** @description NFT token ID within the collection. */
            token_id?: string | null;
        };
        NftHolder: {
            contractAddress?: string | null;
            ownerAddress?: string | null;
            contractAddressAlias?: string | null;
            ownerAddressAlias?: string | null;
            balance: number | null;
            tokenId?: string | null;
            lastTransferTime: number | null;
        };
        NftItemsQuery: {
            /**
             * @description Opaque cursor returned by the previous response. Omit for the first request.
             * @default ffffffffffffffffffffff
             */
            cursor: string;
            /**
             * @description Maximum number of items to return. Defaults to 25.
             * @default 25
             */
            limit: number;
            /** @description Starknet contract address (0x-prefixed hex). */
            contract_address: string;
            /** @description Owner wallet address (0x-prefixed hex). */
            owner_address?: string;
        };
        NftItem: {
            contractAddress?: string | null;
            tokenId?: string | null;
            contractType: number | null;
            name?: string | null;
            description?: string | null;
            externalUrl?: string | null;
            attributes: unknown[] | null;
            imageUrl?: string | null;
            imageSmallUrl?: string | null;
            imageLargeUrl?: string | null;
            youtubeUrl?: string | null;
            animationUrl?: string | null;
            mintedByAddress?: string | null;
            mintedAtTimestamp: number | null;
            mintedAtBlockNumber: number | null;
            mintedAtTransactionHash?: string | null;
            ownerAddress?: string | null;
            balance: {
                contractAddress?: string | null;
                ownerAddress?: string | null;
                contractAddressAlias?: string | null;
                ownerAddressAlias?: string | null;
                balance: number | null;
                tokenId?: string | null;
                lastTransferTime: number | null;
            } | null;
        };
        NftContractOwnerQuery: {
            /**
             * @description Opaque cursor returned by the previous response. Omit for the first request.
             * @default ffffffffffffffffffffff
             */
            cursor: string;
            /**
             * @description Maximum number of items to return. Defaults to 25.
             * @default 25
             */
            limit: number;
            /** @description Owner wallet address (0x-prefixed hex). */
            owner_address: string;
            /** @description Starknet contract address (0x-prefixed hex). */
            contract_address?: string;
        };
        NftContractBalance: {
            contractAddress?: string | null;
            tokenId?: string | null;
            ownerAddress?: string | null;
            balance: number | null;
            lastTransferTime: number | null;
            tokenName?: string | null;
            tokenDescription?: string | null;
            attributes: unknown[] | null;
            imageUrl?: string | null;
            imageSmallUrl?: string | null;
            imageLargeUrl?: string | null;
            collectionName?: string | null;
            contractType: number | null;
        };
        NftTransfersQuery: {
            /**
             * @description Opaque cursor returned by the previous response. Omit for the first request.
             * @default ffffffffffffffffffffff
             */
            cursor: string;
            /**
             * @description Maximum number of items to return. Defaults to 25.
             * @default 25
             */
            limit: number;
            /** @description Starknet contract address (0x-prefixed hex). */
            contract_address: string;
            /**
             * @description NFT standard: "erc721" or "erc1155". Defaults to "erc721".
             * @default erc721
             * @enum {string}
             */
            type: "erc721" | "erc1155";
        };
        NftTransfer: {
            transactionHash?: string | null;
            tokenId?: string | null;
            fromAddress?: string | null;
            toAddress?: string | null;
            nftContractAddress?: string | null;
            quantity?: string | null;
            totalPrice?: string | null;
            paymentTokenAddress?: string | null;
            paymentTokenSymbol?: string | null;
            timestamp: number | null;
            itemName?: string | null;
            itemImage?: string | null;
            itemImageSmall?: string | null;
            collectionName?: string | null;
            collectionImage?: string | null;
            collectionSymbol?: string | null;
            /** @enum {string} */
            type?: "Mint" | "Transfer" | "Burn" | "Sale";
            fromAlias?: string | null;
            toAlias?: string | null;
        };
        NftStatsQuery: {
            /**
             * @description Page number. Defaults to 1.
             * @default 1
             */
            p: number;
            /**
             * @description Number of items per page. Available options: 10, 25, 50, 100.
             * @default 25
             */
            ps: number;
            /**
             * @description Stats aggregation window: "day", "week", "month", or "all". Defaults to all time when omitted.
             * @enum {string}
             */
            timeframe?: "day" | "week" | "month" | "all";
            /**
             * @description Metric to rank collections by: "sales", "owners", "supply", "sales_volume", or "traders".
             * @enum {string}
             */
            attribute?: "sales" | "owners" | "supply" | "sales_volume" | "traders";
            /**
             * @description Sort direction: "asc" or "desc".
             * @enum {string}
             */
            sort?: "desc" | "asc";
        };
        NftStats: {
            contractName?: string | null;
            contractAddress?: string | null;
            imageUrl?: string | null;
            sales: number | null;
            salesVolume?: string | null;
            averagePrice?: string | null;
            traders: number | null;
            mints?: string | null;
            burns?: string | null;
            transfers: number | null;
            totalSupply?: string | null;
            totalOwners: number | null;
        };
        MarketplaceStatsQuery: {
            /**
             * @description Page number. Defaults to 1.
             * @default 1
             */
            p: number;
            /**
             * @description Number of items per page. Available options: 10, 25, 50, 100.
             * @default 25
             */
            ps: number;
            /**
             * @description Stats aggregation window: "day", "week", "month", or "all". Defaults to all time when omitted.
             * @enum {string}
             */
            timeframe?: "day" | "week" | "month" | "all";
            /**
             * @description Metric to rank marketplaces by: "sales", "sales_volume", or "traders".
             * @enum {string}
             */
            attribute?: "sales" | "sales_volume" | "traders";
            /**
             * @description Sort direction: "asc" or "desc".
             * @enum {string}
             */
            sort?: "desc" | "asc";
        };
        MarketplaceStats: {
            marketplaceContractAddress?: string | null;
            sales: number | null;
            salesVolume?: string | null;
            averagePrice?: string | null;
            traders: number | null;
            marketplaceContractAlias?: string | null;
        };
        StakingOverview: {
            tokenInfoStrk: {
                tokenAddress?: string;
                price?: number;
                decimals?: number;
                logoUrl?: string;
                name?: string;
                symbol?: string;
            } | null;
            tokenInfoBtc: {
                tokenAddress?: string;
                price?: number;
                decimals?: number;
                logoUrl?: string;
                name?: string;
                symbol?: string;
            } | null;
            /** @description BigInt value serialized as string */
            totalSupply: string;
            totalValidators: number;
            totalDelegators: number;
            maxAPRStrk: number;
            maxAPRBtc: number;
            mintingCurve: number;
            securityLockup: number;
            /** @description BigInt value serialized as string */
            minimumStake: string;
            averageCommission: number;
            totalStakeStrk: string;
            totalStakeBtc: string;
            totalPendingUnstakeBtc: string;
            totalPendingUnstakeStrk: string;
            epochData: {
                id: number;
                nextId: number;
                progress: number;
                estimatedEndTimestamp: number;
                durationSeconds: number;
            } | null;
        };
        StakingOverviewResponse: {
            overview: {
                tokenInfoStrk: {
                    tokenAddress?: string;
                    price?: number;
                    decimals?: number;
                    logoUrl?: string;
                    name?: string;
                    symbol?: string;
                } | null;
                tokenInfoBtc: {
                    tokenAddress?: string;
                    price?: number;
                    decimals?: number;
                    logoUrl?: string;
                    name?: string;
                    symbol?: string;
                } | null;
                /** @description BigInt value serialized as string */
                totalSupply: string;
                totalValidators: number;
                totalDelegators: number;
                maxAPRStrk: number;
                maxAPRBtc: number;
                mintingCurve: number;
                securityLockup: number;
                /** @description BigInt value serialized as string */
                minimumStake: string;
                averageCommission: number;
                totalStakeStrk: string;
                totalStakeBtc: string;
                totalPendingUnstakeBtc: string;
                totalPendingUnstakeStrk: string;
                epochData: {
                    id: number;
                    nextId: number;
                    progress: number;
                    estimatedEndTimestamp: number;
                    durationSeconds: number;
                } | null;
            };
            lastUpdated: number;
        };
        ValidatorRowInfo: {
            address: string;
            name?: string;
            imgSrc?: string;
            /** @default false */
            isVerified: boolean;
            /** @enum {string} */
            stakerState?: "active" | "deleted" | "exited";
            totalStakeStrk: string;
            totalStakeBtc: string;
            totalStakePercentageStrk: number;
            totalStakePercentageBtc: number;
            totalSelfStake: string;
            totalDelegatedStakeStrk: string;
            totalDelegatedStakeBtc: string;
            totalDelegators: number;
            revenueShare: number;
            aprStrk: number;
            aprBtc: number;
            /** @description BigInt value serialized as string */
            rank: string;
            withdrawalTime?: number;
            unstakingTime?: number;
            startTime: number;
            stakerAddress?: string;
            liveness?: number | null;
            livenessAttestedEpochs?: number | null;
            livenessTotalEpochs?: number | null;
            livenessLastEpoch?: number | null;
            liveness90d?: number | null;
            livenessAttestedEpochs90d?: number | null;
            livenessTotalEpochs90d?: number | null;
            livenessLastEpoch90d?: number | null;
            poolInfos: {
                tokenAddress: string;
                poolContract: string;
                tokenInfo?: {
                    tokenAddress?: string;
                    price?: number;
                    decimals?: number;
                    logoUrl?: string;
                    name?: string;
                    symbol?: string;
                };
                rewardAddress?: string | null;
            }[];
            stakingPowerStrk?: number;
            stakingPowerBtc?: number;
            stakingPower?: number;
        };
        ValidatorsResponse: {
            items: {
                address: string;
                name?: string;
                imgSrc?: string;
                /** @default false */
                isVerified: boolean;
                /** @enum {string} */
                stakerState?: "active" | "deleted" | "exited";
                totalStakeStrk: string;
                totalStakeBtc: string;
                totalStakePercentageStrk: number;
                totalStakePercentageBtc: number;
                totalSelfStake: string;
                totalDelegatedStakeStrk: string;
                totalDelegatedStakeBtc: string;
                totalDelegators: number;
                revenueShare: number;
                aprStrk: number;
                aprBtc: number;
                /** @description BigInt value serialized as string */
                rank: string;
                withdrawalTime?: number;
                unstakingTime?: number;
                startTime: number;
                stakerAddress?: string;
                liveness?: number | null;
                livenessAttestedEpochs?: number | null;
                livenessTotalEpochs?: number | null;
                livenessLastEpoch?: number | null;
                liveness90d?: number | null;
                livenessAttestedEpochs90d?: number | null;
                livenessTotalEpochs90d?: number | null;
                livenessLastEpoch90d?: number | null;
                poolInfos: {
                    tokenAddress: string;
                    poolContract: string;
                    tokenInfo?: {
                        tokenAddress?: string;
                        price?: number;
                        decimals?: number;
                        logoUrl?: string;
                        name?: string;
                        symbol?: string;
                    };
                    rewardAddress?: string | null;
                }[];
                stakingPowerStrk?: number;
                stakingPowerBtc?: number;
                stakingPower?: number;
            }[];
            pagination: {
                prev?: string | null;
                next?: string | null;
                totalPages?: number | null;
                pageSize?: number | null;
                prevPage?: number | null;
                nextPage?: number | null;
                currentPage?: number | null;
            };
        };
        ValidatorsQuery: {
            /**
             * @description Page number. Defaults to 1.
             * @default 1
             */
            p: number;
            /**
             * @description Number of items per page. Available options: 10, 25, 50, 100.
             * @default 25
             */
            ps: number;
            /** @description Free-text search across validator names, addresses, and metadata. */
            search?: string;
            /**
             * @description Field to sort validators by: "rank", "stakeStrk", "stakeBtc", "delegators", "commission", "stakingPower", "liveness" (30-day window), or "liveness90d" (90-day window). Defaults to "rank".
             * @default rank
             * @enum {string}
             */
            sortBy: "rank" | "stakeStrk" | "stakeBtc" | "delegators" | "commission" | "stakingPower" | "liveness" | "liveness90d";
            /**
             * @description Sort direction: ascending or descending. Defaults to ascending.
             * @default ASC
             * @enum {string}
             */
            sortOrder: "ASC" | "DESC";
            /** @description Token contract address (0x-prefixed hex). */
            tokenAddress?: string;
        };
        ValidatorDetails: {
            address: string;
            name?: string;
            imgSrc?: string;
            /** @default false */
            isVerified: boolean;
            /** @enum {string} */
            stakerState?: "active" | "deleted" | "exited";
            totalStakeStrk: string;
            totalStakeBtc: string;
            totalStakePercentageStrk: number;
            totalStakePercentageBtc: number;
            totalSelfStake: string;
            totalDelegatedStakeStrk: string;
            totalDelegatedStakeBtc: string;
            totalDelegators: number;
            revenueShare: number;
            aprStrk: number;
            aprBtc: number;
            /** @description BigInt value serialized as string */
            rank: string;
            withdrawalTime?: number;
            unstakingTime?: number;
            startTime: number;
            stakerAddress?: string;
            liveness?: number | null;
            livenessAttestedEpochs?: number | null;
            livenessTotalEpochs?: number | null;
            livenessLastEpoch?: number | null;
            liveness90d?: number | null;
            livenessAttestedEpochs90d?: number | null;
            livenessTotalEpochs90d?: number | null;
            livenessLastEpoch90d?: number | null;
            poolInfos: {
                tokenAddress: string;
                poolContract: string;
                tokenInfo?: {
                    tokenAddress?: string;
                    price?: number;
                    decimals?: number;
                    logoUrl?: string;
                    name?: string;
                    symbol?: string;
                };
                rewardAddress?: string | null;
            }[];
            stakingPowerStrk?: number;
            stakingPowerBtc?: number;
            stakingPower?: number;
            startingTime: string;
            description?: string;
            website?: string;
            socials?: {
                [key: string]: {
                    value: string;
                    link: string;
                    /** @enum {string} */
                    iconName: "TwitterX" | "Telegram" | "Discord" | "LinkedIn";
                };
            };
            rewardAddress: string;
            operationalAddress: string;
            commitmentMaxCommission?: number;
            commitmentExpirationEpoch?: number;
            commitmentExpirationEpochTimestamp?: number;
        } | null;
        ValidatorDetailsApiResponse: {
            validatorDetails: {
                address: string;
                name?: string;
                imgSrc?: string;
                /** @default false */
                isVerified: boolean;
                /** @enum {string} */
                stakerState?: "active" | "deleted" | "exited";
                totalStakeStrk: string;
                totalStakeBtc: string;
                totalStakePercentageStrk: number;
                totalStakePercentageBtc: number;
                totalSelfStake: string;
                totalDelegatedStakeStrk: string;
                totalDelegatedStakeBtc: string;
                totalDelegators: number;
                revenueShare: number;
                aprStrk: number;
                aprBtc: number;
                /** @description BigInt value serialized as string */
                rank: string;
                withdrawalTime?: number;
                unstakingTime?: number;
                startTime: number;
                stakerAddress?: string;
                liveness?: number | null;
                livenessAttestedEpochs?: number | null;
                livenessTotalEpochs?: number | null;
                livenessLastEpoch?: number | null;
                liveness90d?: number | null;
                livenessAttestedEpochs90d?: number | null;
                livenessTotalEpochs90d?: number | null;
                livenessLastEpoch90d?: number | null;
                poolInfos: {
                    tokenAddress: string;
                    poolContract: string;
                    tokenInfo?: {
                        tokenAddress?: string;
                        price?: number;
                        decimals?: number;
                        logoUrl?: string;
                        name?: string;
                        symbol?: string;
                    };
                    rewardAddress?: string | null;
                }[];
                stakingPowerStrk?: number;
                stakingPowerBtc?: number;
                stakingPower?: number;
                startingTime: string;
                description?: string;
                website?: string;
                socials?: {
                    [key: string]: {
                        value: string;
                        link: string;
                        /** @enum {string} */
                        iconName: "TwitterX" | "Telegram" | "Discord" | "LinkedIn";
                    };
                };
                rewardAddress: string;
                operationalAddress: string;
                commitmentMaxCommission?: number;
                commitmentExpirationEpoch?: number;
                commitmentExpirationEpochTimestamp?: number;
            } | null;
        };
        ValidatorQuery: {
            /** @description Staking validator contract address (0x-prefixed hex). */
            validator: string;
        };
        ValidatorPoolInfo: {
            poolContract: string;
            tokenAddress: string;
            tokenSymbol: string | null;
            tokenName: string | null;
            tokenDecimals: number | null;
            iconLogo: string | null;
        };
        ValidatorPoolInfoArrayResponse: {
            poolContract: string;
            tokenAddress: string;
            tokenSymbol: string | null;
            tokenName: string | null;
            tokenDecimals: number | null;
            iconLogo: string | null;
        }[];
        DelegatorInfo: {
            address: string;
            delegatedStake: string;
            share: number;
            withdrawalTime?: number;
            unpoolTime?: number;
            startTime: number;
        };
        DelegatorsResponse: {
            items: {
                address: string;
                delegatedStake: string;
                share: number;
                withdrawalTime?: number;
                unpoolTime?: number;
                startTime: number;
            }[];
            pagination: {
                prev?: string | null;
                next?: string | null;
                totalPages?: number | null;
                pageSize?: number | null;
                prevPage?: number | null;
                nextPage?: number | null;
                currentPage?: number | null;
            };
        };
        DelegatorsQuery: {
            /**
             * @description Page number. Defaults to 1.
             * @default 1
             */
            p: number;
            /**
             * @description Number of items per page. Available options: 10, 25, 50, 100.
             * @default 25
             */
            ps: number;
            /** @description Staking validator contract address (0x-prefixed hex). */
            validator: string;
            /** @description Delegator wallet address (0x-prefixed hex). */
            delegator?: string;
            /**
             * @description Staking asset to filter by: "strk" or "btc".
             * @enum {string}
             */
            asset?: "strk" | "btc";
        };
        WalletStakingInfoApiResponse: {
            overview: {
                totalStakedStrk: string;
                totalStakedBtc: string;
                totalRewardsClaimedStrk: string;
                totalRewardsClaimedBtc: string;
                totalRewardsUnclaimedStrk: string;
                totalRewardsUnclaimedBtc: string;
            };
            staked: {
                tokenAddress: string;
                poolContract: string;
                /** @description BigInt value serialized as string */
                amount: string;
                withdrawalTime?: number;
                unpoolTime?: number;
                formattedTotalAmount: string;
                rewardAddress: string;
                /** @description BigInt value serialized as string */
                rewardsClaimed: string;
                /** @description BigInt value serialized as string */
                rewardsUnclaimed: string;
                delegationActivatedAt: number;
                lastDelegationAt: number;
                /** @enum {string} */
                status: "active" | "exited" | "deleted";
                validatorRowInfo?: {
                    address: string;
                    name?: string;
                    imgSrc?: string;
                    /** @default false */
                    isVerified: boolean;
                    /** @enum {string} */
                    stakerState?: "active" | "deleted" | "exited";
                    totalStakeStrk: string;
                    totalStakeBtc: string;
                    totalStakePercentageStrk: number;
                    totalStakePercentageBtc: number;
                    totalSelfStake: string;
                    totalDelegatedStakeStrk: string;
                    totalDelegatedStakeBtc: string;
                    totalDelegators: number;
                    revenueShare: number;
                    aprStrk: number;
                    aprBtc: number;
                    /** @description BigInt value serialized as string */
                    rank: string;
                    withdrawalTime?: number;
                    unstakingTime?: number;
                    startTime: number;
                    stakerAddress?: string;
                    liveness?: number | null;
                    livenessAttestedEpochs?: number | null;
                    livenessTotalEpochs?: number | null;
                    livenessLastEpoch?: number | null;
                    liveness90d?: number | null;
                    livenessAttestedEpochs90d?: number | null;
                    livenessTotalEpochs90d?: number | null;
                    livenessLastEpoch90d?: number | null;
                    poolInfos: {
                        tokenAddress: string;
                        poolContract: string;
                        tokenInfo?: {
                            tokenAddress?: string;
                            price?: number;
                            decimals?: number;
                            logoUrl?: string;
                            name?: string;
                            symbol?: string;
                        };
                        rewardAddress?: string | null;
                    }[];
                    stakingPowerStrk?: number;
                    stakingPowerBtc?: number;
                    stakingPower?: number;
                };
            }[];
        };
        WalletInfoQuery: {
            /** @description Starknet wallet address (0x-prefixed hex). */
            address: string;
        };
        DelegatorsOverTimeResponse: {
            date: string;
            delegationChangeStrk: number;
            delegationChangeBtc: number;
            delegationChange: number;
            delegationCountStrk: number;
            delegationCountBtc: number;
            delegationCount: number;
        };
        DelegatorsOverTimeLegacyResponse: {
            date: string;
            delegationChange: number;
            delegationCount: number;
        };
        DelegatorsOverTimeArrayResponse: {
            date: string;
            delegationChangeStrk: number;
            delegationChangeBtc: number;
            delegationChange: number;
            delegationCountStrk: number;
            delegationCountBtc: number;
            delegationCount: number;
        }[] | {
            date: string;
            delegationChange: number;
            delegationCount: number;
        }[] | null;
        StakeOverTimeResponse: {
            date: string;
            totalStakeChangeStrk: string;
            totalStakeChangeBtc: string;
            totalStakeStrk: string;
            totalStakeBtc: string;
        };
        StakeOverTimeArrayResponse: {
            date: string;
            totalStakeChangeStrk: string;
            totalStakeChangeBtc: string;
            totalStakeStrk: string;
            totalStakeBtc: string;
        }[] | null;
        TimerangeQuery: {
            /**
             * @description Time window for historical data: "1w" (1 week), "1m" (1 month), "3m", "6m", "1y", or "max". Defaults to "1m".
             * @default 1m
             * @enum {string}
             */
            timerange: "max" | "1y" | "1m" | "1w";
            /** @description Staking validator contract address (0x-prefixed hex). */
            address?: string;
        };
        WalletTimerangeQuery: {
            /**
             * @description Time window for historical data: "1w" (1 week), "1m" (1 month), "3m", "6m", "1y", or "max". Defaults to "1m".
             * @default 1m
             * @enum {string}
             */
            timerange: "max" | "1y" | "1m" | "1w";
            /** @description Starknet wallet address (0x-prefixed hex). */
            address: string;
        };
        StakingActivity: {
            timestamp: string;
            name: string;
            delegatorAddress: string | null;
            stakerAddress: string;
            destinationName: string | null;
            destinationIcon: string | null;
            source: string;
            destination: string;
            txnHash: string;
            /** @description BigInt value serialized as string */
            amount: string;
            tokenAddress?: string | null;
            tokenInfo?: {
                tokenAddress?: string;
                price?: number;
                decimals?: number;
                logoUrl?: string;
                name?: string;
                symbol?: string;
            } | null;
            meta?: {
                operationsAvailable: string[];
                destinationsAvailable: {
                    name?: string | null;
                    iconSrc?: string | null;
                    value: string;
                }[];
            };
        };
        WalletStakingActivityResponse: {
            items: {
                timestamp: string;
                name: string;
                delegatorAddress: string | null;
                stakerAddress: string;
                destinationName: string | null;
                destinationIcon: string | null;
                source: string;
                destination: string;
                txnHash: string;
                /** @description BigInt value serialized as string */
                amount: string;
                tokenAddress?: string | null;
                tokenInfo?: {
                    tokenAddress?: string;
                    price?: number;
                    decimals?: number;
                    logoUrl?: string;
                    name?: string;
                    symbol?: string;
                } | null;
                meta?: {
                    operationsAvailable: string[];
                    destinationsAvailable: {
                        name?: string | null;
                        iconSrc?: string | null;
                        value: string;
                    }[];
                };
            }[];
            meta: {
                destinationsAvailable: {
                    name?: string | null;
                    iconSrc?: string | null;
                    value: string;
                }[];
                operationsAvailable: string[];
            };
            pagination: {
                prev?: string | null;
                next?: string | null;
                totalPages?: number | null;
                pageSize?: number | null;
                prevPage?: number | null;
                nextPage?: number | null;
                currentPage?: number | null;
            };
        };
        ValidatorStakingActivityResponse: {
            items: {
                timestamp: string;
                name: string;
                amount: string;
                delegatorAddress: string;
                destination: string;
                destinationName: string;
                destinationIcon: string;
                source: string;
                stakerAddress: string;
                txnHash: string;
                tokenInfo?: {
                    tokenAddress?: string;
                    price?: number;
                    decimals?: number;
                    logoUrl?: string;
                    name?: string;
                    symbol?: string;
                } | null;
            }[];
            meta: {
                destinationsAvailable: {
                    name?: string | null;
                    iconSrc?: string | null;
                    value: string;
                }[];
                operationsAvailable: string[];
            };
            pagination: {
                prev?: string | null;
                next?: string | null;
                totalPages?: number | null;
                pageSize?: number | null;
                prevPage?: number | null;
                nextPage?: number | null;
                currentPage?: number | null;
            };
        };
        StakingActivityQuery: {
            /**
             * @description Page number. Defaults to 1.
             * @default 1
             */
            p: number;
            /**
             * @description Number of items per page. Available options: 10, 25, 50, 100.
             * @default 25
             */
            ps: number;
            /** @description Staking validator contract address (0x-prefixed hex). */
            address: string;
            /** @description Staking validator contract address (0x-prefixed hex). */
            validator?: string;
            /**
             * @description Sort direction: ascending or descending. Defaults to descending.
             * @default DESC
             * @enum {string}
             */
            sort: "ASC" | "DESC";
            /** @description ISO 8601 date string (YYYY-MM-DD) for range filtering. */
            start?: string;
            /** @description ISO 8601 date string (YYYY-MM-DD) for range filtering. */
            end?: string;
            /** @description Free-text search across validator names, addresses, and metadata. */
            search?: string;
            /**
             * @description Filter by staking operation type (e.g. stake, unstake, claim rewards).
             * @enum {string}
             */
            operation?: "validator_stake" | "validator_withdrawal_initiated" | "validator_withdrawal_completed" | "validator_claim_rewards" | "delegator_stake" | "delegator_withdrawal_initiated" | "delegator_withdrawal_cancelled" | "delegator_withdrawal_completed" | "delegator_move_stake" | "delegator_claimed_rewards" | "delegator_claim_rewards" | "delegator_restaked_rewards";
        };
        WalletStakingActivityQuery: {
            /**
             * @description Page number. Defaults to 1.
             * @default 1
             */
            p: number;
            /**
             * @description Number of items per page. Available options: 10, 25, 50, 100.
             * @default 25
             */
            ps: number;
            /** @description Starknet wallet address (0x-prefixed hex). */
            address: string;
            /** @description Filter by destination validator address (0x-prefixed hex). */
            destination?: string;
            /**
             * @description Sort direction: ascending or descending. Defaults to descending.
             * @default DESC
             * @enum {string}
             */
            sort: "ASC" | "DESC";
            /** @description ISO 8601 date string (YYYY-MM-DD) for range filtering. */
            start?: string;
            /** @description ISO 8601 date string (YYYY-MM-DD) for range filtering. */
            end?: string;
            /**
             * @description Filter by staking operation type (e.g. stake, unstake, claim rewards).
             * @enum {string}
             */
            operation?: "validator_stake" | "validator_withdrawal_initiated" | "validator_withdrawal_completed" | "validator_claim_rewards" | "delegator_stake" | "delegator_withdrawal_initiated" | "delegator_withdrawal_cancelled" | "delegator_withdrawal_completed" | "delegator_move_stake" | "delegator_claimed_rewards" | "delegator_claim_rewards" | "delegator_restaked_rewards";
            /** @description Free-text search across validator names, addresses, and metadata. */
            search?: string;
        };
        StakingTerms: {
            minimumStake: string[];
            flexibility: string[];
            mintingCurve: string[];
            withdrawalPeriod: string[];
            stakingTokens: string[];
            rewards: string[];
            linkToLearnMore: string;
            description: string;
            /** @enum {string} */
            title: "delegators" | "validators";
        };
        AttestationResponse: {
            epochId: number;
            blockNumber: number;
            transactionHash: string;
            validatorName?: string;
            validatorAddress: string;
            validatorImgSrc?: string;
            validatorIsVerified: boolean;
        };
        PagedAttestationsResponse: {
            items: {
                epochId: number;
                blockNumber: number;
                transactionHash: string;
                validatorName?: string;
                validatorAddress: string;
                validatorImgSrc?: string;
                validatorIsVerified: boolean;
            }[];
            pagination: {
                prev?: string | null;
                next?: string | null;
                totalPages?: number | null;
                pageSize?: number | null;
                prevPage?: number | null;
                nextPage?: number | null;
                currentPage?: number | null;
            };
        };
        AttestationsQuery: {
            /**
             * @description Page number. Defaults to 1.
             * @default 1
             */
            p: number;
            /**
             * @description Number of items per page. Available options: 10, 25, 50, 100.
             * @default 25
             */
            ps: number;
            /** @description Staking validator contract address (0x-prefixed hex). */
            validator?: string;
        };
        Statistics: {
            blocksCount: string;
            contractsCount: string;
            classesCount: string;
            transactionsCount: string;
            tpsAtBlockHash: string;
            tps: string;
            maxRecordedTps: string;
            latestAvgFee: {
                avgFee: string;
                /** @enum {string} */
                unit: "USD" | "ETH";
            }[];
            activeAccounts: string;
            accountsGrowth: string;
            totalTvl: {
                value: string;
                unit: string;
            };
        };
        ListDailyStatisticsParams: {
            /**
             * @description Page number. Defaults to 1.
             * @default 1
             */
            p: number;
            /**
             * @description Number of items per page. Available options: 10, 25, 50, 100.
             * @default 25
             */
            ps: number;
            /**
             * @description Metric name to retrieve, or "*" for all available metrics. Defaults to "*".
             * @default *
             * @enum {string}
             */
            metrics: "*" | "transactions_per_block" | "transactions_per_second" | "max_transactions_per_second" | "transactions_count" | "classes_count" | "events_count" | "messages_count" | "contracts_count" | "cairo_1_classes" | "cairo_1_contracts" | "account_contracts_count" | "active_account_contracts" | "l1_block_creation_time" | "l2_block_creation_time" | "proof_generation_time" | "fee_per_block" | "tvl" | "account_contracts" | "active_accounts" | "txns_in_queue" | "queue_delay" | "tx_time" | "gas_per_block" | "user_operations_count" | "user_operations_per_block" | "user_operations_per_second" | "max_user_operations_per_second" | "account_calls_count" | "account_calls_per_block" | "account_calls_per_second" | "max_account_calls_per_second" | "standardized_tps" | "erc20_scaling" | "eth_transfer_fee" | "erc20_transfer_fee" | "swap_fee" | "nft_mint_fee" | "starkgate_eth_deposit_fee" | "starkgate_eth_withdrawal_fee" | "l1_block_verification_cost";
            /**
             * @description Time window for historical data: "1w" (1 week), "1m" (1 month), "3m", "6m", "1y", or "max". Defaults to "1m".
             * @default 1m
             * @enum {string}
             */
            timerange: "max" | "1y" | "1m" | "1w" | "1d";
        };
        ListDailyStatsResponse: {
            items: ({
                date: string;
                value: number;
                commulative_value?: string;
            } | {
                date: string;
                value: number;
                argentx_value: number;
                braavos_value: number;
                okx_value: number;
                cartridge_value: number;
                xverse_value: number;
                cex_value: number;
                others_value: number;
                commulative_value: number;
                argentx_commulative_value: number;
                braavos_commulative_value: number;
                okx_commulative_value: number;
                cartridge_commulative_value: number;
                xverse_commulative_value: number;
                cex_commulative_value: number;
                others_commulative_value: number;
            } | {
                date: string;
                value: number;
                argentx_value: number;
                braavos_value: number;
                okx_value: number;
                cartridge_value: number;
                xverse_value: number;
                cex_value: number;
                others_value: number;
            } | {
                date: string;
                tvl_total?: string;
            } | {
                date: string;
                l1_value_eth: number;
                l1_value_usd: number;
                l2_value_eth: number;
                l2_value_usd: number;
                l2_vs_l1: number;
            } | {
                date: string;
                fee_per_block_usd: number;
                fee_in_wei_per_block_usd: number;
                fee_in_fri_per_block_usd: number;
                fee_per_block_eth: number;
                fee_in_wei_per_block_eth: number;
                fee_in_fri_per_block_eth: number;
            } | {
                date: string;
                l1_gas_per_block: number;
                l1_data_gas_per_block: number;
                l2_gas_per_block: number;
            } | {
                date: string;
                starkgate_eth_deposit_fee_eth: number;
                starkgate_eth_deposit_fee_usd: number;
            } | {
                date: string;
                starkgate_eth_withdrawal_fee_eth: number;
                starkgate_eth_withdrawal_fee_usd: number;
                starkgate_eth_initiate_withdrawal_fee_eth: number;
                starkgate_eth_initiate_withdrawal_fee_usd: number;
                starkgate_eth_withdrawal_fee_total_eth: number;
                starkgate_eth_withdrawal_fee_total_usd: number;
            } | {
                date: string;
                l1_block_verification_cost_eth: number;
                l1_block_verification_cost_usd: number;
            } | {
                date: string;
                transactions_per_block: number;
                transactions_per_second: number;
                transactions_count: number;
                max_transactions_per_second: number;
                classes_count: number;
                events_count: number;
                messages_count: number;
                contracts_count: number;
                cairo_1_classes: number;
                cairo_1_contracts: number;
                account_contracts_count: number;
                daily_account_contracts: number;
                active_account_contracts: number;
                l1_block_creation_time: number;
                l2_block_creation_time: number;
                proof_generation_time: number;
                fee_per_block: string;
                last_updated: number;
            })[];
        };
        TodayStats: {
            date: string;
            timeRange: string;
            transactionStats: {
                transactions_per_block: string;
                transactions_per_second: string;
                transactions_count: string;
                max_transactions_per_second: string;
            };
            userOperationsStats: {
                user_operations_count?: string;
                user_operations_per_block?: string;
                user_operations_per_second?: string;
                max_user_operations_per_second?: string;
            };
            networkStats: {
                classes_count?: string;
                events_count?: string;
                messages_count?: string;
                contracts_count?: string;
            };
            blockCreationTime: {
                proofGenerationTime: string;
                l1BlockCreationTime: string;
                l2BlockCreationTime: string;
            };
            accountStats?: {
                lastUpdated: string;
                totalAccountContracts: {
                    total: string;
                    argentx: string;
                    braavos: string;
                    okx: string;
                    cartridge: string;
                    xverse: string;
                    cex: string;
                    others: string;
                };
                accountsGrowth: {
                    total: string;
                    argentx: string;
                    braavos: string;
                    okx: string;
                    cartridge: string;
                    xverse: string;
                    cex: string;
                    others: string;
                };
                activeAccounts: {
                    total: string;
                    argentx: string;
                    braavos: string;
                    okx: string;
                    cartridge: string;
                    xverse: string;
                    cex: string;
                    others: string;
                };
            };
            tvlStats?: {
                lastUpdated: string;
                totalValueLocked: number;
            };
            blockFeeTracker?: {
                lastUpdated: string;
                l1BlockVerificationCost: string;
                totalBlockFee: string;
                totalGasUsed: {
                    l1Gas: string;
                    l1DataGas: string;
                    l2Gas: string;
                };
            };
        } | Record<string, never>;
        TodayStatsQuery: {
            /**
             * @description Lookback window for today's stats: "1h", "4h", or "24h". Defaults to "24h".
             * @default 24h
             * @enum {string}
             */
            hours: "1h" | "4h" | "24h";
        };
        EventActivityQuery: {
            /**
             * @description Number of items per page. Available options: 10, 25, 50, 100.
             * @default 100
             */
            page_size: number;
            /**
             * @description Page number. Defaults to 1.
             * @default 1
             */
            page: number;
            /**
             * @description Token standard to filter by: "ERC20", "ERC721", or "ERC1155". Defaults to "ERC20".
             * @default ERC20
             */
            token_type: string | null;
            /** @description Sender address (0x-prefixed hex). At least one of from_address or to_address must be provided. */
            from_address?: string | null;
            /** @description Recipient address (0x-prefixed hex). At least one of from_address or to_address must be provided. */
            to_address?: string | null;
            /** @description Start of the block range (inclusive). */
            from_block?: number | null;
            /** @description End of the block range (inclusive). */
            to_block?: number | null;
            /** @description Start of the time range (Unix seconds, inclusive). Must be after 2021-01-01. Max window: 90 days. */
            from_timestamp?: number;
            /** @description End of the time range (Unix seconds, inclusive). Max window: 90 days. Future values are clamped to now. */
            to_timestamp?: number | null;
            /**
             * @description Sort direction: ascending or descending. Defaults to descending.
             * @default DESC
             */
            sort: string | null;
            /** @description Cursor for keyset pagination. Pass the id from the last item of the previous response to fetch the next page. */
            last_id?: string;
        };
        EventActivityResponse: {
            items: {
                blockHash?: string | null;
                blockNumber: number | null;
                timestamp: number | null;
                tokenAddress?: string | null;
                transferFrom?: string | null;
                transferTo?: string | null;
                transferDataLen: number | null;
                transferIds?: (string | null)[];
                transferValues: (string | null)[];
                txHash?: string | null;
                tokenName?: string | null;
                tokenSymbol?: string | null;
                tokenDecimals?: string | null;
                callName?: string | null;
                /** @enum {string} */
                invocationType: "VALIDATE" | "EXECUTE" | "FEE_TRANSFER";
                abiVerified?: boolean | null;
                data: (string | null)[];
                keys: (string | null)[];
                selector?: string | null;
                name?: string | null;
                nestedName?: string | null;
                nestedEventNames: (string | null)[];
                dataDecoded: {
                    name?: string | null;
                    value?: string | null;
                    type?: string | null;
                }[];
                keyDecoded: {
                    name?: string | null;
                    value?: string | null;
                    type?: string | null;
                }[];
                eventId?: string | null;
                fromAlias?: string | null;
                toAlias?: string | null;
                id?: string | null;
            }[];
            hasMore: boolean;
        };
        TransactionActivityQuery: {
            /**
             * @description Page number. Defaults to 1.
             * @default 1
             */
            p: number;
            /**
             * @description Number of items per page. Available options: 10, 25, 50, 100.
             * @default 25
             */
            ps: number;
            /** @description Start of the block range (inclusive). Requires sender_address to be provided. */
            from_block?: number | null;
            /** @description Sender wallet address (0x-prefixed hex). */
            sender_address?: string;
            /**
             * @description Sort direction: ascending or descending. Defaults to ascending.
             * @default asc
             * @enum {string}
             */
            sort: "asc" | "desc";
        };
        TransactionActivityResponse: {
            items: {
                block_hash: string;
                block_number: number;
                hash: string;
                index: number;
                l1_transaction_hash: string | null;
                /** @enum {string} */
                type: "DECLARE" | "DEPLOY" | "DEPLOY_ACCOUNT" | "INVOKE" | "L1_HANDLER" | "OTHER";
                class_hash: string | null;
                contract_address: string | null;
                sender_address: string | null;
                timestamp: number;
                status: string;
                execution_status: string;
                finality_status: string;
                revert_error: string | null;
                entry_point_selector: string | null;
                max_fee: string | null;
                actual_fee: string | null;
                actual_fee_unit: string | null;
                gas_price_in_wei: string | null;
                gas_price_in_fri: string | null;
                version: string | null;
                nonce: string | null;
                constructor_calldata: string[] | null;
                calldata: string[] | null;
                calls: {
                    contract_address: string;
                    class_hash: string;
                    entrypoint_type: string;
                    entrypoint: string;
                    selector: string;
                    calldata: string[];
                    call_type: string;
                    inputs: {
                        [key: string]: unknown;
                    };
                    outputs?: unknown;
                }[];
                partial_calls_parsing: boolean;
                sender_alias: string | null;
                contract_alias: string | null;
                class_alias: string | null;
            }[];
            lastPage: number;
        };
        JobIdParam: {
            /**
             * Format: uuid
             * @description UUID of the class verification job.
             */
            job: string;
        };
        VerificationJobStatus: {
            job_id: string;
            class_hash: string;
            created_timestamp: number;
            updated_timestamp: number;
            status: number;
            status_description: string;
            address: string;
            contract_file: string | null;
            name: string;
            version: string;
            license: string | null;
            package_name: string | null;
            project_dir_path: string | null;
            build_tool: string | null;
            dojo_version: string | null;
            error_code: string | null;
            error_category: string | null;
            error_details: string | null;
            error_stage: string | null;
            error_suggestions: string[] | null;
            trace_id: string | null;
            error?: {
                code: string;
                category: string;
                message: string;
                details?: string | null;
                stage: string;
                suggestions: string[];
                trace_id?: string | null;
            };
        };
        VerificationCheckParam: {
            /** @description Class hash or contract address to check verification status for (0x-prefixed hex). */
            hash: string;
        };
        VerificationCheckResult: {
            verified: boolean;
            class_hash: string;
            name?: string;
            version?: string;
            license?: string | null;
            verified_timestamp?: number;
            contract_file?: string;
        };
        VerificationSubmitParam: {
            /** @description Class hash or contract address to check verification status for (0x-prefixed hex). */
            hash: string;
        };
        VerificationSubmitBody: {
            compiler_version: string;
            scarb_version: string;
            project_dir_path: string;
            name: string;
            package_name: string;
            license: string | null;
            files: {
                [key: string]: string;
            };
            /** @enum {string} */
            build_tool: "scarb" | "sozo";
            dojo_version?: string;
            contract_file?: string;
        };
        VerificationSubmitResult: {
            job_id: string;
        };
        VerificationResult: {
            /** @enum {string} */
            verification_status: "Error" | "Ok";
            error?: {
                message: string;
                detail?: string;
            };
        };
        VerifyContractClassResponse: {
            job_id: string;
        } | {
            /** @enum {string} */
            verification_status: "Error" | "Ok";
            error?: {
                message: string;
                detail?: string;
            };
        } | null;
        TokenTransfersParams: {
            /**
             * @description Number of items per page. Available options: 10, 25, 50, 100.
             * @default 100
             */
            page_size: number;
            /** @description Token contract address (0x-prefixed hex). */
            token_address?: string;
            /** @description Sender address (0x-prefixed hex). */
            from_address?: string;
            /** @description Recipient address (0x-prefixed hex). */
            to_address?: string;
            /** @description Start of the block range (inclusive). */
            from_block?: number | null;
            /** @description End of the block range (inclusive). */
            to_block?: number | null;
            /** @description Start of the time range (Unix seconds, inclusive). Must be after 2021-01-01. Max window: 90 days. */
            from_timestamp?: number;
            /** @description End of the time range (Unix seconds, inclusive). Max window: 90 days. Future values are clamped to now. */
            to_timestamp?: number;
            /** @description Filter by the event selector hash that triggered the transfer (0x-prefixed hex). */
            event_selector?: string;
            /**
             * @default desc
             * @enum {string}
             */
            order_by: "asc" | "desc";
            /**
             * @description Filter transfers by the transaction execution phase: VALIDATE, EXECUTE, FEE_TRANSFER, ALL_EXCEPT_FEE_TRANSFER (exclude fee-phase rows), or ALL (no filter). Defaults to ALL.
             * @default ALL
             * @enum {string}
             */
            invocation_type: "ALL" | "ALL_EXCEPT_FEE_TRANSFER" | "VALIDATE" | "EXECUTE" | "FEE_TRANSFER";
            /** @description Cursor for keyset pagination. Pass the id from the last item of the previous response to fetch the next page. */
            id?: string;
        };
        ListTokenTransfersResponse: {
            items: {
                block_hash?: string | null;
                block_number: number | null;
                token_address?: string | null;
                transaction_hash?: string | null;
                event_selector?: string | null;
                event_index: number | null;
                timestamp: number | null;
                /** @enum {string} */
                invocation_type: "VALIDATE" | "EXECUTE" | "FEE_TRANSFER";
                /** @enum {string} */
                token_type: "ERC20" | "ERC721" | "ERC1155";
                from_address?: string | null;
                to_address?: string | null;
                data_len: number | null;
                transfer_amounts: (string | null)[];
                token_ids?: (string | null)[];
                id: string;
            }[];
            hasMore: boolean;
        };
        ApiStatus: {
            apis: {
                [key: string]: {
                    /** @enum {string} */
                    status: "ok" | "lagging" | "down";
                    lagSeconds: number;
                };
            };
            timestamp: number;
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    listTransactions: {
        parameters: {
            query?: {
                /** @description Page number. Defaults to 1. */
                p?: number;
                /** @description Number of items per page. Available options: 10, 25, 50, 100. */
                ps?: number;
                /** @description Filter transactions sent to a specific contract address. */
                to?: string;
                /** @description Filter by block. Accepts a block number, a block hash (0x-prefixed hex string), or "pre_confirmed" for pending transactions. */
                block?: string;
                /** @description Filter by transaction type: DEPLOY (0), INVOKE (1), DECLARE (2), L1_HANDLER (3), DEPLOY_ACCOUNT (4). */
                type?: "0" | "1" | "2" | "3" | "4" | "null";
                /** @description When "true", returns only rejected transactions. Ignored when block is set (rejected transactions are not associated with any block). Can be combined with the "to" filter. Defaults to false. */
                rejected?: "true" | "false";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successfully retrieved transactions */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "items": [
                     *         {
                     *           "blockNumber": 2386637,
                     *           "hash": "0x4b97f8083d1e58066a46f547d8d0435cc37d8316bcdd1acf928da406f8ab03e",
                     *           "index": 40,
                     *           "l1VerificationHash": "0x0",
                     *           "classHash": null,
                     *           "contractAddress": "0x02328fde7856dac094ddbca1dbdca4060092ed0ef8f907b6b32589149f756ea2",
                     *           "timestamp": 1758631328,
                     *           "actualFee": "11502720017210880",
                     *           "contractAlias": null,
                     *           "classAlias": null,
                     *           "status": "Accepted on L2",
                     *           "type": "INVOKE"
                     *         }
                     *       ],
                     *       "lastPage": 23042669
                     *     }
                     */
                    "application/json": components["schemas"]["ListTransactionsResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BadRequestResponse"];
                };
            };
            /** @description Forbidden - Missing or invalid API key */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Forbidden"
                     *     }
                     */
                    "application/json": components["schemas"]["ForbiddenResponse"];
                };
            };
            /** @description Too Many Requests - Rate limit exceeded */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Limit Exceeded"
                     *     }
                     */
                    "application/json": components["schemas"]["RateLimitResponse"];
                };
            };
        };
    };
    listMetaTransactions: {
        parameters: {
            query: {
                /** @description Page number. Defaults to 1. */
                p?: number;
                /** @description Number of items per page. Available options: 10, 25, 50, 100. */
                ps?: number;
                /** @description Filter by destination contract address (0x-prefixed hex). */
                to: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successfully retrieved meta transactions */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "items": [
                     *         {
                     *           "blockNumber": 3145013,
                     *           "blockId": "0x7a418e1449e39c08c72ce82bd150274de425ef9df42dccf883f944b12b5864",
                     *           "hash": "0x15f0ad18c6fbce78f401e15d859ec0e349fe2f7b6087da15819ecc0fd506c58",
                     *           "index": 15,
                     *           "l1VerificationHash": "",
                     *           "classHash": "0x0743c83c41ce99ad470aa308823f417b2141e02e04571f5c0004e743556e7faf",
                     *           "contractAddress": "0x04af22fa6d29a9fe5781def72d8c85c0722096fc3646f3bde2dd6e1d0cc7fa9b",
                     *           "timestamp": 1761207549,
                     *           "actualFee": "15860160027199296",
                     *           "contractAlias": null,
                     *           "classAlias": null,
                     *           "senderAddress": "0x063a5eb7b0435bfe0a371b1b29967927a85a55fd2096dfcbb37a513aa1300ec8",
                     *           "senderAlias": null,
                     *           "status": "Accepted on L2",
                     *           "type": "INVOKE",
                     *           "actions": null,
                     *           "executionStatus": "Succeeded",
                     *           "finalityStatus": "Accepted on L2",
                     *           "operations": "execute_from_outside_v3,claim_reward_token",
                     *           "name": "execute_from_outside_v3",
                     *           "selector": "0x3dbc508ba4afd040c8dc4ff8a61113a7bcaf5eae88a6ba27b3c50578b3587e3",
                     *           "revertError": null
                     *         }
                     *       ],
                     *       "lastPage": 1345
                     *     }
                     */
                    "application/json": components["schemas"]["ListMetaTransactionsResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BadRequestResponse"];
                };
            };
            /** @description Forbidden - Missing or invalid API key */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Forbidden"
                     *     }
                     */
                    "application/json": components["schemas"]["ForbiddenResponse"];
                };
            };
            /** @description Too Many Requests - Rate limit exceeded */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Limit Exceeded"
                     *     }
                     */
                    "application/json": components["schemas"]["RateLimitResponse"];
                };
            };
        };
    };
    getTransactionByHash: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Transaction hash (0x-prefixed hex). */
                txnHash: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Transaction details */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "blockNumber": 16947,
                     *       "hash": "0x56eec91a857c7bb80673def67c60335abdd07f092c88fde269e98789c0b0c4f",
                     *       "index": 97,
                     *       "l1VerificationHash": "0x3a5347ceeb2fe07990aab5580b7c74d656ea09d28272076f964d212ce3d8d037",
                     *       "classHash": "0x07f3777c99f3700505ea966676aac4a0d692c2a9f5e667f4c606b51ca1dd3420",
                     *       "contractAddress": "0x005c7f50b66f3f7a356b537565c6bbd6982df0d9e128a392df8563ff6e316799",
                     *       "timestamp": 1671203370,
                     *       "actualFee": "346922455115316",
                     *       "contractAlias": null,
                     *       "classAlias": null,
                     *       "status": "Accepted on L1",
                     *       "type": "INVOKE",
                     *       "blockId": "0x75b14a7fcdf277a715d201bec8b7808db9a8a949fcbcfd354aa416146e5b791",
                     *       "actualFeeUnit": "ETH",
                     *       "usdFormattedMaxFee": null,
                     *       "usdHistoricalFormattedMaxFee": null,
                     *       "executionResources": {
                     *         "steps": "undefined",
                     *         "memory_holes": "undefined"
                     *       },
                     *       "tip": null,
                     *       "receipt": {
                     *         "events": [],
                     *         "tokensTransferred": [],
                     *         "feeTransferred": [],
                     *         "nftTransferred": []
                     *       },
                     *       "executionStatus": "Succeeded",
                     *       "signature": [
                     *         "0x37046ac5d9d93db6feaed58a742e21b446e7a657b8d49cdaebc6695c3b0b7e0",
                     *         "0x577de9744beb643fee380df6be95c22feb2bc808e83330c4eb29401ffea66b0"
                     *       ],
                     *       "contractAddressSalt": null,
                     *       "senderAddress": "0x005c7f50b66f3f7a356b537565c6bbd6982df0d9e128a392df8563ff6e316799",
                     *       "maxFee": "0x13eaf6f59b4c0",
                     *       "nonce": "0x1",
                     *       "version": "0x1",
                     *       "selector": "0x15d40a3d6ca2ac30f4031e42be28da9b056fef9bb7357ac5e85627ee876e5ad",
                     *       "calldata": [
                     *         "0x1",
                     *         "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7"
                     *       ],
                     *       "revertError": null
                     *     }
                     */
                    "application/json": components["schemas"]["TransactionDetails"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BadRequestResponse"];
                };
            };
            /** @description Forbidden - Missing or invalid API key */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Forbidden"
                     *     }
                     */
                    "application/json": components["schemas"]["ForbiddenResponse"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotFoundResponse"];
                };
            };
            /** @description Too Many Requests - Rate limit exceeded */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Limit Exceeded"
                     *     }
                     */
                    "application/json": components["schemas"]["RateLimitResponse"];
                };
            };
        };
    };
    getTokenTransfers: {
        parameters: {
            query?: {
                /** @description Number of items per page. Available options: 10, 25, 50, 100. */
                page_size?: number;
                /** @description Token contract address (0x-prefixed hex). */
                token_address?: string;
                /** @description Sender address (0x-prefixed hex). */
                from_address?: string;
                /** @description Recipient address (0x-prefixed hex). */
                to_address?: string;
                /** @description Start of the block range (inclusive). */
                from_block?: number | null;
                /** @description End of the block range (inclusive). */
                to_block?: number | null;
                /** @description Start of the time range (Unix seconds, inclusive). Must be after 2021-01-01. Max window: 90 days. */
                from_timestamp?: number;
                /** @description End of the time range (Unix seconds, inclusive). Max window: 90 days. Future values are clamped to now. */
                to_timestamp?: number;
                /** @description Filter by the event selector hash that triggered the transfer (0x-prefixed hex). */
                event_selector?: string;
                order_by?: "asc" | "desc";
                /** @description Filter transfers by the transaction execution phase: VALIDATE, EXECUTE, FEE_TRANSFER, ALL_EXCEPT_FEE_TRANSFER (exclude fee-phase rows), or ALL (no filter). Defaults to ALL. */
                invocation_type?: "ALL" | "ALL_EXCEPT_FEE_TRANSFER" | "VALIDATE" | "EXECUTE" | "FEE_TRANSFER";
                /** @description Cursor for keyset pagination. Pass the id from the last item of the previous response to fetch the next page. */
                id?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Token transfers */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "items": [
                     *         {
                     *           "block_hash": "0x26e33072da06ad179ce6379c9673cc9384ec7255dca84f8edd21e12768c78c6",
                     *           "block_number": 1643556,
                     *           "token_address": "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
                     *           "transaction_hash": "0x36ff4c434ffed203e9c9c7d3acd25690861d8b1928028f0791e0942bd95d5b9",
                     *           "event_index": 0,
                     *           "timestamp": 1753642806,
                     *           "invocation_type": "FEE_TRANSFER",
                     *           "token_type": "ERC20",
                     *           "from_address": "0x01bed88e5027795facabb1a8fe8fa882f56a734412697232d9e7c86e18589b18",
                     *           "to_address": "0x01176a1bd84444c89232ec27754698e5d2e7e1a7f1539f12027f28b23ec9f3d8",
                     *           "data_len": 1,
                     *           "transfer_amounts": [
                     *             "3868635833644894372806"
                     *           ],
                     *           "id": "1255164560"
                     *         }
                     *       ],
                     *       "hasMore": true
                     *     }
                     */
                    "application/json": components["schemas"]["ListTokenTransfersResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BadRequestResponse"];
                };
            };
            /** @description Forbidden - Missing or invalid API key */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Forbidden"
                     *     }
                     */
                    "application/json": components["schemas"]["ForbiddenResponse"];
                };
            };
            /** @description Too Many Requests - Rate limit exceeded */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Limit Exceeded"
                     *     }
                     */
                    "application/json": components["schemas"]["RateLimitResponse"];
                };
            };
        };
    };
    listTokens: {
        parameters: {
            query?: {
                /** @description Page number. Defaults to 1. */
                p?: number;
                /** @description Number of items per page. Available options: 10, 25, 50, 100. */
                ps?: number;
                /** @description Token standard to filter by: "erc20", "erc721", or "erc1155". Defaults to "erc20". */
                type?: "erc20" | "erc721" | "erc1155";
                /** @description Sort tokens by attribute: "holders" (holder count), "transfers" (transfer count), or "market_cap". Defaults to "holders". */
                attribute?: "holders" | "transfers" | "market_cap";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successfully retrieved tokens */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "items": [
                     *         {
                     *           "address": "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
                     *           "name": "Ether",
                     *           "symbol": "ETH",
                     *           "decimals": "18",
                     *           "transfers": "229585280",
                     *           "holders": "4494104",
                     *           "type": "erc20"
                     *         },
                     *         {
                     *           "address": "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
                     *           "name": "Starknet Token",
                     *           "symbol": "STRK",
                     *           "decimals": "18",
                     *           "transfers": "116525724",
                     *           "holders": "991560",
                     *           "type": "erc20"
                     *         }
                     *       ],
                     *       "lastPage": 8298
                     *     }
                     */
                    "application/json": components["schemas"]["ListTokensResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BadRequestResponse"];
                };
            };
            /** @description Forbidden - Missing or invalid API key */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Forbidden"
                     *     }
                     */
                    "application/json": components["schemas"]["ForbiddenResponse"];
                };
            };
            /** @description Too Many Requests - Rate limit exceeded */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Limit Exceeded"
                     *     }
                     */
                    "application/json": components["schemas"]["RateLimitResponse"];
                };
            };
        };
    };
    getTokenHolders: {
        parameters: {
            query?: {
                /** @description Page number. Defaults to 1. */
                p?: number;
                /** @description Number of items per page. Available options: 10, 25, 50, 100. */
                ps?: number;
                /** @description Token standard to filter by: "erc20", "erc721", or "erc1155". Defaults to "erc20". */
                type?: "erc20" | "erc721" | "erc1155";
            };
            header?: never;
            path: {
                /** @description Token contract address (0x-prefixed hex). */
                address: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Token holders */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "items": [
                     *         {
                     *           "owner": "undefined",
                     *           "balance": "66101348.043955",
                     *           "lastTransferTime": 1760089468,
                     *           "contractAlias": "Extended: Core"
                     *         },
                     *         {
                     *           "owner": "undefined",
                     *           "balance": "12473263.493965",
                     *           "lastTransferTime": 1760089579,
                     *           "contractAlias": "Ekubo: Core"
                     *         }
                     *       ],
                     *       "lastPage": 0,
                     *       "hasMore": true
                     *     }
                     */
                    "application/json": components["schemas"]["ListTokenHoldersResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BadRequestResponse"];
                };
            };
            /** @description Forbidden - Missing or invalid API key */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Forbidden"
                     *     }
                     */
                    "application/json": components["schemas"]["ForbiddenResponse"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotFoundResponse"];
                };
            };
            /** @description Too Many Requests - Rate limit exceeded */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Limit Exceeded"
                     *     }
                     */
                    "application/json": components["schemas"]["RateLimitResponse"];
                };
            };
        };
    };
    getTokenHoldersOverview: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Token contract address (0x-prefixed hex). */
                address: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Holders analytics overview */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HoldersOverviewResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BadRequestResponse"];
                };
            };
            /** @description Forbidden - Missing or invalid API key */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Forbidden"
                     *     }
                     */
                    "application/json": components["schemas"]["ForbiddenResponse"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotFoundResponse"];
                };
            };
            /** @description Too Many Requests - Rate limit exceeded */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Limit Exceeded"
                     *     }
                     */
                    "application/json": components["schemas"]["RateLimitResponse"];
                };
            };
        };
    };
    listContracts: {
        parameters: {
            query?: {
                /** @description Page number. Defaults to 1. */
                p?: number;
                /** @description Number of items per page. Available options: 10, 25, 50, 100. */
                ps?: number;
                /** @description Filter by contract type. Case-insensitive. */
                type?: "account" | "erc20" | "erc721" | "erc1155" | "unknown" | "proxy" | null;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successfully retrieved contracts */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "items": [
                     *         {
                     *           "address": "0x07b7196ce28756a07a1e874947cce4696425060108fd2ca1cee054e46a00865b",
                     *           "blockNumber": 1655799,
                     *           "isAccount": true,
                     *           "isErcToken": false,
                     *           "isProxy": false,
                     *           "type": "Ready",
                     *           "creationTimestamp": 1753890591,
                     *           "verifiedTimestamp": 1732798981,
                     *           "classAlias": "Ready",
                     *           "contractAlias": null,
                     *           "classHash": "0x036078334509b514626504edc9fb252328d1a240e4e948bef8d0c08dff45927f",
                     *           "version": "2.6.3",
                     *           "blockHash": "0x5123420d1ff254b138eb0efb446db8d3b9a5ae8cd842697d1559ff1ed039c1e"
                     *         }
                     *       ],
                     *       "lastPage": 1
                     *     }
                     */
                    "application/json": components["schemas"]["ListContractsResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BadRequestResponse"];
                };
            };
            /** @description Forbidden - Missing or invalid API key */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Forbidden"
                     *     }
                     */
                    "application/json": components["schemas"]["ForbiddenResponse"];
                };
            };
            /** @description Too Many Requests - Rate limit exceeded */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Limit Exceeded"
                     *     }
                     */
                    "application/json": components["schemas"]["RateLimitResponse"];
                };
            };
        };
    };
    getContractByAddress: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Starknet contract address (0x-prefixed hex). */
                contractAddress: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Contract details */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "address": "0x07faf54d35eb92d381cb5d3b9ba6b35ccf297980e35be22ecfe07eafd2a4ac48",
                     *       "blockNumber": 29410,
                     *       "isAccount": true,
                     *       "isErcToken": false,
                     *       "isProxy": false,
                     *       "type": "Ready",
                     *       "creationTimestamp": 1680260250,
                     *       "verifiedTimestamp": null,
                     *       "classAlias": "Ready",
                     *       "contractAlias": null,
                     *       "classHash": "0x01a736d6ed154502257f02b1ccdf4d9d1089f80811cd6acad48e6b6a9d1f2003",
                     *       "version": "2.0.0",
                     *       "blockHash": "0x701838987e597a6cb3489d93cb41e8827cc62048ca5fb690a1cf62d8a9a2bc5",
                     *       "nonce": 100,
                     *       "implementationContract": null,
                     *       "tokenName": null,
                     *       "tokenSymbol": null
                     *     }
                     */
                    "application/json": components["schemas"]["ContractDetails"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BadRequestResponse"];
                };
            };
            /** @description Forbidden - Missing or invalid API key */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Forbidden"
                     *     }
                     */
                    "application/json": components["schemas"]["ForbiddenResponse"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotFoundResponse"];
                };
            };
            /** @description Too Many Requests - Rate limit exceeded */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Limit Exceeded"
                     *     }
                     */
                    "application/json": components["schemas"]["RateLimitResponse"];
                };
            };
        };
    };
    getContractTokenBalances: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Starknet contract address (0x-prefixed hex). */
                contractAddress: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Token balances */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "erc20TokenBalances": [
                     *         {
                     *           "address": "0x068f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8",
                     *           "balance": "120196",
                     *           "decimals": 6,
                     *           "symbol": "USDT",
                     *           "name": "Tether USD",
                     *           "usdBalance": "0.12",
                     *           "usdFormattedBalance": "$0.12",
                     *           "formattedBalance": "0.120196",
                     *           "iconLogo": "https://coin-images.coingecko.com/coins/images/32210/small/usdt_%281%29.png?1696752003",
                     *           "isVerified": true
                     *         }
                     *       ],
                     *       "verfiedTokensCount": 4,
                     *       "totalTokensCount": 5,
                     *       "totalUsdValue": "0.22"
                     *     }
                     */
                    "application/json": components["schemas"]["ListTokenBalancesResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BadRequestResponse"];
                };
            };
            /** @description Forbidden - Missing or invalid API key */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Forbidden"
                     *     }
                     */
                    "application/json": components["schemas"]["ForbiddenResponse"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotFoundResponse"];
                };
            };
            /** @description Too Many Requests - Rate limit exceeded */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Limit Exceeded"
                     *     }
                     */
                    "application/json": components["schemas"]["RateLimitResponse"];
                };
            };
        };
    };
    getContractTransfers: {
        parameters: {
            query?: {
                /** @description Number of items per page. Available options: 10, 25, 50, 100. */
                ps?: number;
                /** @description Token standard to filter by: "erc20", "erc721", or "erc1155". Defaults to "erc20". */
                type?: "erc20" | "erc721" | "erc1155";
                /** @description Filter by sender address (0x-prefixed hex). */
                from?: string | null;
                /** @description Filter by recipient address (0x-prefixed hex). */
                to?: string | null;
                /** @description Filter by token symbol (e.g. ETH, STRK). */
                symbol?: string | null;
                /** @description Token contract address (0x-prefixed hex). */
                tokenAddress?: string | null;
                /** @description Unix timestamp (seconds) for the start of the query window (inclusive). Must be within the contract's transfer activity range, available in the response `range` object. If omitted, it is derived automatically from timestampTo (up to 90 days back or the contract's first transfer). The window between timestampFrom and timestampTo must not exceed 90 days. */
                timestampFrom?: number | null;
                /** @description Unix timestamp (seconds) for the end of the query window (inclusive). Must be within the contract's transfer activity range, available in the response `range` object. If omitted, it is derived automatically from timestampFrom (up to 90 days forward or the contract's last transfer). The window between timestampFrom and timestampTo must not exceed 90 days. */
                timestampTo?: number | null;
                /** @description Transaction execution phase: VALIDATE, EXECUTE, FEE_TRANSFER, ALL_EXCEPT_FEE_TRANSFER (ERC-20 only: hide fee-phase transfers), or ALL (no filter). Defaults to ALL. */
                invocationType?: string | null;
                /** @description Cursor for keyset pagination. Pass the id from the last item of the previous response to fetch the next page. */
                id?: string;
                /** @description Sort direction: ascending or descending. Defaults to descending. */
                order_by?: "asc" | "desc";
            };
            header?: never;
            path: {
                /** @description Starknet contract address (0x-prefixed hex). */
                contractAddress: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description A paginated list of token transfers within the resolved time window, along with the contract's full activity range. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "items": [
                     *         {
                     *           "blockNumber": 1643556,
                     *           "tokenAddress": "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
                     *           "timestamp": 1753642806,
                     *           "transferFrom": "0x01bed88e5027795facabb1a8fe8fa882f56a734412697232d9e7c86e18589b18",
                     *           "transferTo": "0x01176a1bd84444c89232ec27754698e5d2e7e1a7f1539f12027f28b23ec9f3d8",
                     *           "txHash": "0x36ff4c434ffed203e9c9c7d3acd25690861d8b1928028f0791e0942bd95d5b9",
                     *           "callName": "transfer",
                     *           "blockHash": "0x26e33072da06ad179ce6379c9673cc9384ec7255dca84f8edd21e12768c78c6",
                     *           "fromAlias": null,
                     *           "toAlias": "StarkWare: Sequencer",
                     *           "invocationType": "fee_transfer",
                     *           "tokenName": "Starknet Token",
                     *           "tokenSymbol": "STRK",
                     *           "tokenDecimals": 18,
                     *           "tokenIcon": "https://coin-images.coingecko.com/coins/images/26433/small/starknet.png?1696525507"
                     *         }
                     *       ],
                     *       "hasMore": true,
                     *       "range": {
                     *         "startTimestamp": 1630454400,
                     *         "endTimestamp": 1753642806
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ListContractTransfersResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BadRequestResponse"];
                };
            };
            /** @description Forbidden - Missing or invalid API key */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Forbidden"
                     *     }
                     */
                    "application/json": components["schemas"]["ForbiddenResponse"];
                };
            };
            /** @description Too Many Requests - Rate limit exceeded */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Limit Exceeded"
                     *     }
                     */
                    "application/json": components["schemas"]["RateLimitResponse"];
                };
            };
        };
    };
    getContractBalanceHistory: {
        parameters: {
            query?: {
                /** @description Time window: "1w", "1m", "3m", "6m", or "1y". Defaults to "1m". */
                timerange?: "1y" | "1m" | "3m" | "6m" | "1w";
                /** @description Token contract address (0x-prefixed hex). */
                token_address?: string;
            };
            header?: never;
            path: {
                /** @description Starknet contract address (0x-prefixed hex). */
                contractAddress: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Balance history data points */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example [
                     *       {
                     *         "address": "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
                     *         "name": "Starknet",
                     *         "symbol": "strk",
                     *         "decimals": 18,
                     *         "balance": "1191499627201360392279",
                     *         "logo": "https://coin-images.coingecko.com/coins/images/26433/small/starknet.png?1696525507",
                     *         "isVerified": true,
                     *         "lastTransferTime": 1733356800,
                     *         "balanceHistory": [
                     *           {
                     *             "day": "2025-12-02",
                     *             "balance": "1191499627201360392279"
                     *           },
                     *           {
                     *             "day": "2025-12-03",
                     *             "balance": "1191499627201360392279"
                     *           },
                     *           {
                     *             "day": "2025-12-04",
                     *             "balance": "1191499627201360392279"
                     *           }
                     *         ]
                     *       }
                     *     ]
                     */
                    "application/json": components["schemas"]["BalanceHistoryResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BadRequestResponse"];
                };
            };
            /** @description Forbidden - Missing or invalid API key */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Forbidden"
                     *     }
                     */
                    "application/json": components["schemas"]["ForbiddenResponse"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotFoundResponse"];
                };
            };
            /** @description Too Many Requests - Rate limit exceeded */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Limit Exceeded"
                     *     }
                     */
                    "application/json": components["schemas"]["RateLimitResponse"];
                };
            };
        };
    };
    getContractTokensHeld: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Starknet contract address (0x-prefixed hex). */
                contractAddress: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description List of tokens */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example [
                     *       {
                     *         "address": "0x006ac248c18c69e57573aa3eeccbb7f8cd29e3024561be252ee7b34b96c1043e",
                     *         "name": "Vesu Ether",
                     *         "symbol": "vETH",
                     *         "decimals": 18,
                     *         "balance": "1273198304298242227",
                     *         "lastTransferTime": 1765226160,
                     *         "isVerified": false
                     *       }
                     *     ]
                     */
                    "application/json": components["schemas"]["TokensHeldResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BadRequestResponse"];
                };
            };
            /** @description Forbidden - Missing or invalid API key */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Forbidden"
                     *     }
                     */
                    "application/json": components["schemas"]["ForbiddenResponse"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotFoundResponse"];
                };
            };
            /** @description Too Many Requests - Rate limit exceeded */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Limit Exceeded"
                     *     }
                     */
                    "application/json": components["schemas"]["RateLimitResponse"];
                };
            };
        };
    };
    listClasses: {
        parameters: {
            query?: {
                /** @description Page number. Defaults to 1. */
                p?: number;
                /** @description Number of items per page. Available options: 10, 25, 50, 100. */
                ps?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successfully retrieved classes */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "items": [
                     *         {
                     *           "hash": "0x04ad7e07e08165f95f4d6e3e7d491471238df43ab98794801dcd9dda5494213e",
                     *           "transactionHash": "0x749ed08cb508f92072db74cb493cad8e73c3ee3efd0582646e35631b1468b7d",
                     *           "version": "2.12.2",
                     *           "type": 0,
                     *           "isAccount": false,
                     *           "isProxy": false,
                     *           "isErcToken": false,
                     *           "creationTimestamp": 1758631691
                     *         }
                     *       ],
                     *       "lastPage": 6853
                     *     }
                     */
                    "application/json": components["schemas"]["ListClassesResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BadRequestResponse"];
                };
            };
            /** @description Forbidden - Missing or invalid API key */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Forbidden"
                     *     }
                     */
                    "application/json": components["schemas"]["ForbiddenResponse"];
                };
            };
            /** @description Too Many Requests - Rate limit exceeded */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Limit Exceeded"
                     *     }
                     */
                    "application/json": components["schemas"]["RateLimitResponse"];
                };
            };
        };
    };
    listVerifiedClasses: {
        parameters: {
            query?: {
                /** @description Page number. Defaults to 1. */
                p?: number;
                /** @description Number of items per page. Available options: 10, 25, 50, 100. */
                ps?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successfully retrieved verified classes */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "items": [
                     *         {
                     *           "classHash": "0x04a80a072713b645d16c0238060d5ebd318f6a5cec2b7acdc272b1dcc2f5e2d7",
                     *           "verifiedTimestamp": 1728474285,
                     *           "verifiedName": "V_Test_2.6.3"
                     *         }
                     *       ],
                     *       "lastPage": 28
                     *     }
                     */
                    "application/json": components["schemas"]["ListVerifiedClassesResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BadRequestResponse"];
                };
            };
            /** @description Forbidden - Missing or invalid API key */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Forbidden"
                     *     }
                     */
                    "application/json": components["schemas"]["ForbiddenResponse"];
                };
            };
            /** @description Too Many Requests - Rate limit exceeded */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Limit Exceeded"
                     *     }
                     */
                    "application/json": components["schemas"]["RateLimitResponse"];
                };
            };
        };
    };
    getClassByHash: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Starknet class hash (0x-prefixed hex). */
                classHash: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Class details */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "hash": "0x0421dbe408553c0a49267f752565277123f437145463e4670e3da70fe69ed285",
                     *       "transactionHash": "0x45fbb396ac262997a3edc79261e93204af7e0f0694a01c98f1f674f9cc11edc",
                     *       "version": "2.11.4",
                     *       "type": 5,
                     *       "isAccount": false,
                     *       "isProxy": false,
                     *       "isErcToken": true,
                     *       "creationTimestamp": 1757525492,
                     *       "contractsCount": null,
                     *       "declaredBy": "0x06a0e8ac47a0b046c8184b4b0499d2821834c235350e62b648d2669421b124b8",
                     *       "code": null,
                     *       "abi": null,
                     *       "byteCode": null,
                     *       "license": null
                     *     }
                     */
                    "application/json": components["schemas"]["ClassDetails"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BadRequestResponse"];
                };
            };
            /** @description Forbidden - Missing or invalid API key */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Forbidden"
                     *     }
                     */
                    "application/json": components["schemas"]["ForbiddenResponse"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotFoundResponse"];
                };
            };
            /** @description Too Many Requests - Rate limit exceeded */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Limit Exceeded"
                     *     }
                     */
                    "application/json": components["schemas"]["RateLimitResponse"];
                };
            };
        };
    };
    getClassSourceCode: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Starknet class hash (0x-prefixed hex). */
                classHash: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Class source code */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "classHash": "0x04a80a072713b645d16c0238060d5ebd318f6a5cec2b7acdc272b1dcc2f5e2d7",
                     *       "sourceCode": {
                     *         "cairo_ds/Scarb.toml": "[package]\nname = \"cairo_ds\"...",
                     *         "cairo_ds/src/contracts/ERC20.cairo": "use starknet::ContractAddress;..."
                     *       },
                     *       "compilerVersion": "2.6.3",
                     *       "verifiedTimestamp": 1728474285,
                     *       "verifiedName": "V_Test_2.6.3"
                     *     }
                     */
                    "application/json": components["schemas"]["ClassSourceCode"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BadRequestResponse"];
                };
            };
            /** @description Forbidden - Missing or invalid API key */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Forbidden"
                     *     }
                     */
                    "application/json": components["schemas"]["ForbiddenResponse"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotFoundResponse"];
                };
            };
            /** @description Too Many Requests - Rate limit exceeded */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Limit Exceeded"
                     *     }
                     */
                    "application/json": components["schemas"]["RateLimitResponse"];
                };
            };
        };
    };
    listClassContracts: {
        parameters: {
            query?: {
                /** @description Page number. Defaults to 1. */
                p?: number;
                /** @description Number of items per page. Available options: 10, 25, 50, 100. */
                ps?: number;
            };
            header?: never;
            path: {
                /** @description Starknet class hash (0x-prefixed hex). */
                classHash: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description List of contracts */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "items": [
                     *         {
                     *           "address": "0x036834a40984312f7f7de8d31e3f6305b325389eaeea5b1c0664b2fb936461a4",
                     *           "creationTimestamp": 1757525503,
                     *           "txnCount": 0,
                     *           "starknetId": "",
                     *           "accountCallCount": 6,
                     *           "contractAlias": null,
                     *           "constructorCalldata": [
                     *             "0x111",
                     *             "0x222",
                     *             "0x333"
                     *           ]
                     *         }
                     *       ],
                     *       "lastPage": 1
                     *     }
                     */
                    "application/json": components["schemas"]["ListClassContractsResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BadRequestResponse"];
                };
            };
            /** @description Forbidden - Missing or invalid API key */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Forbidden"
                     *     }
                     */
                    "application/json": components["schemas"]["ForbiddenResponse"];
                };
            };
            /** @description Too Many Requests - Rate limit exceeded */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Limit Exceeded"
                     *     }
                     */
                    "application/json": components["schemas"]["RateLimitResponse"];
                };
            };
        };
    };
    getNftContract: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Opaque cursor returned by the previous response. Omit for the first request. */
                cursor: string;
                /** @description Maximum number of items to return. Defaults to 25. */
                limit: number;
                /** @description Starknet contract address (0x-prefixed hex). */
                contract_address: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description NFT contract details */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "contractAddress": "0x0727a63f78ee3f1bd18f78009067411ab369c31dece1ae22e16f567906409905",
                     *       "contractType": 6,
                     *       "name": "Starkpunks",
                     *       "description": "Starkpunks launched as the first 10k NFTs collection on StarkNet in 2022.",
                     *       "symbol": "SPK",
                     *       "imageUrl": "https://cdn-a.voyager.online/0x0727a63f78ee3f1bd18f78009067411ab369c31dece1ae22e16f567906409905/contract_image/0x0727a63f78ee3f1bd18f78009067411ab369c31dece1ae22e16f567906409905_small.png",
                     *       "imageSmallUrl": "https://cdn-a.voyager.online/0x0727a63f78ee3f1bd18f78009067411ab369c31dece1ae22e16f567906409905/contract_image/0x0727a63f78ee3f1bd18f78009067411ab369c31dece1ae22e16f567906409905_small.png",
                     *       "imageLargeUrl": "https://cdn-a.voyager.online/0x0727a63f78ee3f1bd18f78009067411ab369c31dece1ae22e16f567906409905/contract_image/0x0727a63f78ee3f1bd18f78009067411ab369c31dece1ae22e16f567906409905_large.png",
                     *       "externalUrl": "https://twitter.com/starkpunks_nft",
                     *       "bannerUrl": null,
                     *       "createdAtBlockNumber": 16652,
                     *       "creatorAddress": "null",
                     *       "latestActivity": {
                     *         "tokenId": "7065",
                     *         "transactionHash": "0x6199b69e58562c7b729ef28f7cfa28505617b63223ed83713f0174a00232e3",
                     *         "timestamp": 1758867113,
                     *         "type": "Transfer"
                     *       },
                     *       "stats": {
                     *         "totalSupply": "10000",
                     *         "totalOwners": 12391
                     *       },
                     *       "isVerified": false
                     *     }
                     */
                    "application/json": components["schemas"]["NftContract"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BadRequestResponse"];
                };
            };
            /** @description Forbidden - Missing or invalid API key */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Forbidden"
                     *     }
                     */
                    "application/json": components["schemas"]["ForbiddenResponse"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotFoundResponse"];
                };
            };
            /** @description Too Many Requests - Rate limit exceeded */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Limit Exceeded"
                     *     }
                     */
                    "application/json": components["schemas"]["RateLimitResponse"];
                };
            };
        };
    };
    getNftDetails: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Opaque cursor returned by the previous response. Omit for the first request. */
                cursor: string;
                /** @description Maximum number of items to return. Defaults to 25. */
                limit: number;
                /** @description Starknet contract address (0x-prefixed hex). */
                contract_address: string;
                /** @description NFT token ID within the collection. */
                token_id: string | null;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description NFT details */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NftObject"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BadRequestResponse"];
                };
            };
            /** @description Forbidden - Missing or invalid API key */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Forbidden"
                     *     }
                     */
                    "application/json": components["schemas"]["ForbiddenResponse"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotFoundResponse"];
                };
            };
            /** @description Too Many Requests - Rate limit exceeded */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Limit Exceeded"
                     *     }
                     */
                    "application/json": components["schemas"]["RateLimitResponse"];
                };
            };
        };
    };
    getNftEvents: {
        parameters: {
            query: {
                /** @description Opaque cursor returned by the previous response. Omit for the first request. */
                cursor?: string;
                /** @description Maximum number of items to return. Defaults to 25. */
                limit?: number;
                /** @description Starknet contract address (0x-prefixed hex). */
                contract_address: string;
                /** @description NFT token ID within the collection. */
                token_id?: string | null;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description NFT events */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        items: components["schemas"]["NftEvent"][];
                        pagination: {
                            next: string | null;
                            prev: string | null;
                            count?: number;
                        };
                    };
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BadRequestResponse"];
                };
            };
            /** @description Forbidden - Missing or invalid API key */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Forbidden"
                     *     }
                     */
                    "application/json": components["schemas"]["ForbiddenResponse"];
                };
            };
            /** @description Too Many Requests - Rate limit exceeded */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Limit Exceeded"
                     *     }
                     */
                    "application/json": components["schemas"]["RateLimitResponse"];
                };
            };
        };
    };
    getNftBalances: {
        parameters: {
            query: {
                /** @description Page number. Defaults to 1. */
                p?: number;
                /** @description Number of items per page. Available options: 10, 25, 50, 100. */
                ps?: number;
                /** @description Starknet contract address (0x-prefixed hex). */
                contract_address: string;
                /** @description NFT token ID within the collection. */
                token_id?: string | null;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description NFT balances */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        items: components["schemas"]["NftBalance"][];
                        pagination: {
                            next: string | null;
                            prev: string | null;
                            count?: number;
                        };
                    };
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BadRequestResponse"];
                };
            };
            /** @description Forbidden - Missing or invalid API key */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Forbidden"
                     *     }
                     */
                    "application/json": components["schemas"]["ForbiddenResponse"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotFoundResponse"];
                };
            };
            /** @description Too Many Requests - Rate limit exceeded */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Limit Exceeded"
                     *     }
                     */
                    "application/json": components["schemas"]["RateLimitResponse"];
                };
            };
        };
    };
    getNftHolders: {
        parameters: {
            query: {
                /** @description Page number. Defaults to 1. */
                p?: number;
                /** @description Number of items per page. Available options: 10, 25, 50, 100. */
                ps?: number;
                /** @description Starknet contract address (0x-prefixed hex). */
                contract_address: string;
                /** @description NFT token ID within the collection. */
                token_id?: string | null;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description NFT holders */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        items: components["schemas"]["NftHolder"][];
                        pagination: {
                            next: string | null;
                            prev: string | null;
                            count?: number;
                        };
                    };
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BadRequestResponse"];
                };
            };
            /** @description Forbidden - Missing or invalid API key */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Forbidden"
                     *     }
                     */
                    "application/json": components["schemas"]["ForbiddenResponse"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotFoundResponse"];
                };
            };
            /** @description Too Many Requests - Rate limit exceeded */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Limit Exceeded"
                     *     }
                     */
                    "application/json": components["schemas"]["RateLimitResponse"];
                };
            };
        };
    };
    getNftItems: {
        parameters: {
            query: {
                /** @description Opaque cursor returned by the previous response. Omit for the first request. */
                cursor?: string;
                /** @description Maximum number of items to return. Defaults to 25. */
                limit?: number;
                /** @description Starknet contract address (0x-prefixed hex). */
                contract_address: string;
                /** @description Owner wallet address (0x-prefixed hex). */
                owner_address?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description NFT items */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        items: components["schemas"]["NftItem"][];
                        pagination: {
                            next: string | null;
                            prev: string | null;
                            count?: number;
                        };
                    };
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BadRequestResponse"];
                };
            };
            /** @description Forbidden - Missing or invalid API key */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Forbidden"
                     *     }
                     */
                    "application/json": components["schemas"]["ForbiddenResponse"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotFoundResponse"];
                };
            };
            /** @description Too Many Requests - Rate limit exceeded */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Limit Exceeded"
                     *     }
                     */
                    "application/json": components["schemas"]["RateLimitResponse"];
                };
            };
        };
    };
    getNftContractBalance: {
        parameters: {
            query: {
                /** @description Opaque cursor returned by the previous response. Omit for the first request. */
                cursor?: string;
                /** @description Maximum number of items to return. Defaults to 25. */
                limit?: number;
                /** @description Owner wallet address (0x-prefixed hex). */
                owner_address: string;
                /** @description Starknet contract address (0x-prefixed hex). */
                contract_address?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description NFT contract balances */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        items: components["schemas"]["NftContractBalance"][];
                        pagination: {
                            next: string | null;
                            prev: string | null;
                            count?: number;
                        };
                    };
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BadRequestResponse"];
                };
            };
            /** @description Forbidden - Missing or invalid API key */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Forbidden"
                     *     }
                     */
                    "application/json": components["schemas"]["ForbiddenResponse"];
                };
            };
            /** @description Too Many Requests - Rate limit exceeded */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Limit Exceeded"
                     *     }
                     */
                    "application/json": components["schemas"]["RateLimitResponse"];
                };
            };
        };
    };
    getNftTransfers: {
        parameters: {
            query: {
                /** @description Opaque cursor returned by the previous response. Omit for the first request. */
                cursor?: string;
                /** @description Maximum number of items to return. Defaults to 25. */
                limit?: number;
                /** @description Starknet contract address (0x-prefixed hex). */
                contract_address: string;
                /** @description NFT standard: "erc721" or "erc1155". Defaults to "erc721". */
                type?: "erc721" | "erc1155";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description NFT transfers */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        items: components["schemas"]["NftTransfer"][];
                        pagination: {
                            next: string | null;
                            prev: string | null;
                            count?: number;
                        };
                    };
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BadRequestResponse"];
                };
            };
            /** @description Forbidden - Missing or invalid API key */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Forbidden"
                     *     }
                     */
                    "application/json": components["schemas"]["ForbiddenResponse"];
                };
            };
            /** @description Too Many Requests - Rate limit exceeded */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Limit Exceeded"
                     *     }
                     */
                    "application/json": components["schemas"]["RateLimitResponse"];
                };
            };
        };
    };
    getNftStats: {
        parameters: {
            query?: {
                /** @description Page number. Defaults to 1. */
                p?: number;
                /** @description Number of items per page. Available options: 10, 25, 50, 100. */
                ps?: number;
                /** @description Stats aggregation window: "day", "week", "month", or "all". Defaults to all time when omitted. */
                timeframe?: "day" | "week" | "month" | "all";
                /** @description Metric to rank collections by: "sales", "owners", "supply", "sales_volume", or "traders". */
                attribute?: "sales" | "owners" | "supply" | "sales_volume" | "traders";
                /** @description Sort direction: "asc" or "desc". */
                sort?: "desc" | "asc";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description NFT collection statistics */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        items: components["schemas"]["NftStats"][];
                        pagination: {
                            next: string | null;
                            prev: string | null;
                            count?: number;
                        };
                    };
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BadRequestResponse"];
                };
            };
            /** @description Forbidden - Missing or invalid API key */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Forbidden"
                     *     }
                     */
                    "application/json": components["schemas"]["ForbiddenResponse"];
                };
            };
            /** @description Too Many Requests - Rate limit exceeded */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Limit Exceeded"
                     *     }
                     */
                    "application/json": components["schemas"]["RateLimitResponse"];
                };
            };
        };
    };
    getMarketplaceStats: {
        parameters: {
            query?: {
                /** @description Page number. Defaults to 1. */
                p?: number;
                /** @description Number of items per page. Available options: 10, 25, 50, 100. */
                ps?: number;
                /** @description Stats aggregation window: "day", "week", "month", or "all". Defaults to all time when omitted. */
                timeframe?: "day" | "week" | "month" | "all";
                /** @description Metric to rank marketplaces by: "sales", "sales_volume", or "traders". */
                attribute?: "sales" | "sales_volume" | "traders";
                /** @description Sort direction: "asc" or "desc". */
                sort?: "desc" | "asc";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Marketplace statistics */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        items: components["schemas"]["MarketplaceStats"][];
                        pagination: {
                            next: string | null;
                            prev: string | null;
                            count?: number;
                        };
                    };
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BadRequestResponse"];
                };
            };
            /** @description Forbidden - Missing or invalid API key */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Forbidden"
                     *     }
                     */
                    "application/json": components["schemas"]["ForbiddenResponse"];
                };
            };
            /** @description Too Many Requests - Rate limit exceeded */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Limit Exceeded"
                     *     }
                     */
                    "application/json": components["schemas"]["RateLimitResponse"];
                };
            };
        };
    };
    requestNftMetadataUpdate: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Opaque cursor returned by the previous response. Omit for the first request. */
                cursor: string;
                /** @description Maximum number of items to return. Defaults to 25. */
                limit: number;
                /** @description Starknet contract address (0x-prefixed hex). */
                contract_address: string;
                /** @description NFT token ID within the collection. */
                token_id: string | null;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Metadata update requested */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        success: boolean;
                    };
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BadRequestResponse"];
                };
            };
            /** @description Forbidden - Missing or invalid API key */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Forbidden"
                     *     }
                     */
                    "application/json": components["schemas"]["ForbiddenResponse"];
                };
            };
            /** @description Too Many Requests - Rate limit exceeded */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Limit Exceeded"
                     *     }
                     */
                    "application/json": components["schemas"]["RateLimitResponse"];
                };
            };
        };
    };
    listBlocks: {
        parameters: {
            query?: {
                /** @description Page number. Defaults to 1. */
                p?: number;
                /** @description Number of items per page. Available options: 10, 25, 50, 100. */
                ps?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successfully retrieved blocks */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "items": [
                     *         {
                     *           "blockNumber": 2385197,
                     *           "hash": "0x781fb89f90f7c3a660ceab01587bc6d3caff67a97698b678fb337c128ca74b",
                     *           "timestamp": 1753889087,
                     *           "stateRoot": "0x5c1fd1fd3ebbc9f0c99e695da105875b8fda090beed5b8c72ad4085b57c409e",
                     *           "txnCount": 39,
                     *           "messageCount": 0,
                     *           "eventCount": 323,
                     *           "l1VerificationTxHash": null,
                     *           "status": "Accepted on L2"
                     *         }
                     *       ],
                     *       "lastPage": 1
                     *     }
                     */
                    "application/json": components["schemas"]["ListBlocksResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BadRequestResponse"];
                };
            };
            /** @description Forbidden - Missing or invalid API key */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Forbidden"
                     *     }
                     */
                    "application/json": components["schemas"]["ForbiddenResponse"];
                };
            };
            /** @description Too Many Requests - Rate limit exceeded */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Limit Exceeded"
                     *     }
                     */
                    "application/json": components["schemas"]["RateLimitResponse"];
                };
            };
        };
    };
    getBlockByHash: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Block number, block hash (0x-prefixed hex), or "pre_confirmed" for pending blocks. */
                blockHash: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Block details */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "blockNumber": 483249,
                     *       "hash": "0x19402ac841080ad4849ac0209265cb6e82856036ffce993e7f583b322c61092",
                     *       "timestamp": 1703664798,
                     *       "stateRoot": "0x17c8b7b9018634b80f1680e2682779256799b0a7dab1b2bf7ec2d637d802ac9",
                     *       "txnCount": 130,
                     *       "messageCount": 0,
                     *       "eventCount": 738,
                     *       "l1VerificationTxHash": "0xca936a77272c3c7eb494654ed8910fcb16bc9edb7f2fa83d98146df396ae74e0",
                     *       "status": "Accepted on L1",
                     *       "prevBlockHash": "0x51b4e567a96cc66c4be585b2e0a02c38988bbc4fa9cf4c667f58275b1153839",
                     *       "nextBlockHash": "0x4e1b608bc2596010e111363904729f92602e2c69b89abcd7b2b76d74462501f",
                     *       "confirmations": 1426574,
                     *       "sequencerAddress": "0x1176a1bd84444c89232ec27754698e5d2e7e1a7f1539f12027f28b23ec9f3d8",
                     *       "totalFee": "0x5a166d429e58d4",
                     *       "timeToMine": 41,
                     *       "version": "0.12.3",
                     *       "ethGasPrice": "0x043ec6fbec",
                     *       "strkGasPrice": "0x0",
                     *       "l1AcceptTime": 19492
                     *     }
                     */
                    "application/json": components["schemas"]["BlockDetails"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BadRequestResponse"];
                };
            };
            /** @description Forbidden - Missing or invalid API key */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Forbidden"
                     *     }
                     */
                    "application/json": components["schemas"]["ForbiddenResponse"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotFoundResponse"];
                };
            };
            /** @description Too Many Requests - Rate limit exceeded */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Limit Exceeded"
                     *     }
                     */
                    "application/json": components["schemas"]["RateLimitResponse"];
                };
            };
        };
    };
    getStakingOverview: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Staking overview */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "overview": {
                     *         "tokenInfoStrk": {
                     *           "tokenAddress": "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
                     *           "price": 0.119393,
                     *           "decimals": 18,
                     *           "logoUrl": "https://coin-images.coingecko.com/coins/images/26433/small/starknet.png?1696525507",
                     *           "name": "Starknet",
                     *           "symbol": "strk"
                     *         },
                     *         "tokenInfoBtc": null,
                     *         "totalSupply": "10000000000",
                     *         "totalValidators": 164,
                     *         "totalDelegators": 69161,
                     *         "maxAPRStrk": 668,
                     *         "maxAPRBtc": 0,
                     *         "mintingCurve": 160,
                     *         "securityLockup": 604800,
                     *         "minimumStake": "20000000000000000000000",
                     *         "averageCommission": 647,
                     *         "totalStakeStrk": "573308919158317718685138261",
                     *         "totalStakeBtc": "4012490000593076",
                     *         "totalPendingUnstakeBtc": "0",
                     *         "totalPendingUnstakeStrk": "0",
                     *         "epochData": {
                     *           "id": 3940,
                     *           "nextId": 3941,
                     *           "progress": 76.47,
                     *           "estimatedEndTimestamp": 1758544346.91,
                     *           "durationSeconds": 2494.53
                     *         }
                     *       },
                     *       "lastUpdated": 1758543761802
                     *     }
                     */
                    "application/json": components["schemas"]["StakingOverviewResponse"];
                };
            };
            /** @description Forbidden - Missing or invalid API key */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Forbidden"
                     *     }
                     */
                    "application/json": components["schemas"]["ForbiddenResponse"];
                };
            };
            /** @description Too Many Requests - Rate limit exceeded */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Limit Exceeded"
                     *     }
                     */
                    "application/json": components["schemas"]["RateLimitResponse"];
                };
            };
        };
    };
    listValidators: {
        parameters: {
            query?: {
                /** @description Page number. Defaults to 1. */
                p?: number;
                /** @description Number of items per page. Available options: 10, 25, 50, 100. */
                ps?: number;
                /** @description Free-text search across validator names, addresses, and metadata. */
                search?: string;
                /** @description Field to sort validators by: "rank", "stakeStrk", "stakeBtc", "delegators", "commission", "stakingPower", "liveness" (30-day window), or "liveness90d" (90-day window). Defaults to "rank". */
                sortBy?: "rank" | "stakeStrk" | "stakeBtc" | "delegators" | "commission" | "stakingPower" | "liveness" | "liveness90d";
                /** @description Sort direction: ascending or descending. Defaults to ascending. */
                sortOrder?: "ASC" | "DESC";
                /** @description Token contract address (0x-prefixed hex). */
                tokenAddress?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Validators list */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "items": [
                     *         {
                     *           "address": "0x00d3b910d8c528bf0216866053c3821ac6c97983dc096bff642e9a3549210ee7",
                     *           "name": "Ready (prev. Argent)",
                     *           "imgSrc": "https://dv3jj1unlp2jl.cloudfront.net/argent-assets/hito-orange-on-white.png",
                     *           "isVerified": true,
                     *           "stakerState": "active",
                     *           "totalStakeStrk": "94316184.12303925",
                     *           "totalStakeBtc": "255.6972182289891",
                     *           "totalStakePercentageStrk": 16.45,
                     *           "totalStakePercentageBtc": 6.37,
                     *           "totalSelfStake": "1000000000000000000000",
                     *           "totalDelegatedStakeStrk": "94315184123039250000000000",
                     *           "totalDelegatedStakeBtc": "255697218228989100000000",
                     *           "totalDelegators": 34899,
                     *           "revenueShare": 0,
                     *           "aprStrk": 1213,
                     *           "aprBtc": 490,
                     *           "rank": "1",
                     *           "startTime": 1704067200,
                     *           "liveness": 99.9,
                     *           "poolInfos": [],
                     *           "stakingPower": 2253.25
                     *         }
                     *       ],
                     *       "pagination": {
                     *         "prev": null,
                     *         "next": "/staking/validators?p=2&ps=10&sortBy=rank&sortOrder=ASC",
                     *         "totalPages": 18,
                     *         "pageSize": 10,
                     *         "currentPage": 1
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ValidatorsResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BadRequestResponse"];
                };
            };
            /** @description Forbidden - Missing or invalid API key */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Forbidden"
                     *     }
                     */
                    "application/json": components["schemas"]["ForbiddenResponse"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotFoundResponse"];
                };
            };
            /** @description Too Many Requests - Rate limit exceeded */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Limit Exceeded"
                     *     }
                     */
                    "application/json": components["schemas"]["RateLimitResponse"];
                };
            };
        };
    };
    getValidatorDetails: {
        parameters: {
            query: {
                /** @description Staking validator contract address (0x-prefixed hex). */
                validator: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Validator details */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ValidatorDetailsApiResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BadRequestResponse"];
                };
            };
            /** @description Forbidden - Missing or invalid API key */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Forbidden"
                     *     }
                     */
                    "application/json": components["schemas"]["ForbiddenResponse"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotFoundResponse"];
                };
            };
            /** @description Too Many Requests - Rate limit exceeded */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Limit Exceeded"
                     *     }
                     */
                    "application/json": components["schemas"]["RateLimitResponse"];
                };
            };
        };
    };
    getValidatorPoolInfo: {
        parameters: {
            query: {
                /** @description Staking validator contract address (0x-prefixed hex). */
                validator: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Validator pool information */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ValidatorPoolInfoArrayResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BadRequestResponse"];
                };
            };
            /** @description Forbidden - Missing or invalid API key */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Forbidden"
                     *     }
                     */
                    "application/json": components["schemas"]["ForbiddenResponse"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotFoundResponse"];
                };
            };
            /** @description Too Many Requests - Rate limit exceeded */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Limit Exceeded"
                     *     }
                     */
                    "application/json": components["schemas"]["RateLimitResponse"];
                };
            };
        };
    };
    listDelegators: {
        parameters: {
            query: {
                /** @description Page number. Defaults to 1. */
                p?: number;
                /** @description Number of items per page. Available options: 10, 25, 50, 100. */
                ps?: number;
                /** @description Staking validator contract address (0x-prefixed hex). */
                validator: string;
                /** @description Delegator wallet address (0x-prefixed hex). */
                delegator?: string;
                /** @description Staking asset to filter by: "strk" or "btc". */
                asset?: "strk" | "btc";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Delegators list */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DelegatorsResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BadRequestResponse"];
                };
            };
            /** @description Forbidden - Missing or invalid API key */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Forbidden"
                     *     }
                     */
                    "application/json": components["schemas"]["ForbiddenResponse"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotFoundResponse"];
                };
            };
            /** @description Too Many Requests - Rate limit exceeded */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Limit Exceeded"
                     *     }
                     */
                    "application/json": components["schemas"]["RateLimitResponse"];
                };
            };
        };
    };
    getWalletStakingInfo: {
        parameters: {
            query: {
                /** @description Starknet wallet address (0x-prefixed hex). */
                address: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Wallet staking information */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WalletStakingInfoApiResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BadRequestResponse"];
                };
            };
            /** @description Forbidden - Missing or invalid API key */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Forbidden"
                     *     }
                     */
                    "application/json": components["schemas"]["ForbiddenResponse"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotFoundResponse"];
                };
            };
            /** @description Too Many Requests - Rate limit exceeded */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Limit Exceeded"
                     *     }
                     */
                    "application/json": components["schemas"]["RateLimitResponse"];
                };
            };
        };
    };
    getDelegatorsOverTime: {
        parameters: {
            query?: {
                /** @description Time window for historical data: "1w" (1 week), "1m" (1 month), "3m", "6m", "1y", or "max". Defaults to "1m". */
                timerange?: "max" | "1y" | "1m" | "1w";
                /** @description Staking validator contract address (0x-prefixed hex). */
                address?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Delegators over time data */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DelegatorsOverTimeArrayResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BadRequestResponse"];
                };
            };
            /** @description Forbidden - Missing or invalid API key */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Forbidden"
                     *     }
                     */
                    "application/json": components["schemas"]["ForbiddenResponse"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotFoundResponse"];
                };
            };
            /** @description Too Many Requests - Rate limit exceeded */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Limit Exceeded"
                     *     }
                     */
                    "application/json": components["schemas"]["RateLimitResponse"];
                };
            };
        };
    };
    getStakeOverTime: {
        parameters: {
            query?: {
                /** @description Time window for historical data: "1w" (1 week), "1m" (1 month), "3m", "6m", "1y", or "max". Defaults to "1m". */
                timerange?: "max" | "1y" | "1m" | "1w";
                /** @description Staking validator contract address (0x-prefixed hex). */
                address?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Stake over time data */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["StakeOverTimeArrayResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BadRequestResponse"];
                };
            };
            /** @description Forbidden - Missing or invalid API key */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Forbidden"
                     *     }
                     */
                    "application/json": components["schemas"]["ForbiddenResponse"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotFoundResponse"];
                };
            };
            /** @description Too Many Requests - Rate limit exceeded */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Limit Exceeded"
                     *     }
                     */
                    "application/json": components["schemas"]["RateLimitResponse"];
                };
            };
        };
    };
    getWalletStakeOverTime: {
        parameters: {
            query: {
                /** @description Time window for historical data: "1w" (1 week), "1m" (1 month), "3m", "6m", "1y", or "max". Defaults to "1m". */
                timerange?: "max" | "1y" | "1m" | "1w";
                /** @description Starknet wallet address (0x-prefixed hex). */
                address: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Wallet stake over time data */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["StakeOverTimeArrayResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BadRequestResponse"];
                };
            };
            /** @description Forbidden - Missing or invalid API key */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Forbidden"
                     *     }
                     */
                    "application/json": components["schemas"]["ForbiddenResponse"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotFoundResponse"];
                };
            };
            /** @description Too Many Requests - Rate limit exceeded */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Limit Exceeded"
                     *     }
                     */
                    "application/json": components["schemas"]["RateLimitResponse"];
                };
            };
        };
    };
    getWalletStakingActivity: {
        parameters: {
            query: {
                /** @description Page number. Defaults to 1. */
                p?: number;
                /** @description Number of items per page. Available options: 10, 25, 50, 100. */
                ps?: number;
                /** @description Starknet wallet address (0x-prefixed hex). */
                address: string;
                /** @description Filter by destination validator address (0x-prefixed hex). */
                destination?: string;
                /** @description Sort direction: ascending or descending. Defaults to descending. */
                sort?: "ASC" | "DESC";
                /** @description ISO 8601 date string (YYYY-MM-DD) for range filtering. */
                start?: string;
                /** @description ISO 8601 date string (YYYY-MM-DD) for range filtering. */
                end?: string;
                /** @description Filter by staking operation type (e.g. stake, unstake, claim rewards). */
                operation?: "validator_stake" | "validator_withdrawal_initiated" | "validator_withdrawal_completed" | "validator_claim_rewards" | "delegator_stake" | "delegator_withdrawal_initiated" | "delegator_withdrawal_cancelled" | "delegator_withdrawal_completed" | "delegator_move_stake" | "delegator_claimed_rewards" | "delegator_claim_rewards" | "delegator_restaked_rewards";
                /** @description Free-text search across validator names, addresses, and metadata. */
                search?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Wallet staking activity */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WalletStakingActivityResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BadRequestResponse"];
                };
            };
            /** @description Forbidden - Missing or invalid API key */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Forbidden"
                     *     }
                     */
                    "application/json": components["schemas"]["ForbiddenResponse"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotFoundResponse"];
                };
            };
            /** @description Too Many Requests - Rate limit exceeded */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Limit Exceeded"
                     *     }
                     */
                    "application/json": components["schemas"]["RateLimitResponse"];
                };
            };
        };
    };
    getValidatorActivity: {
        parameters: {
            query: {
                /** @description Page number. Defaults to 1. */
                p?: number;
                /** @description Number of items per page. Available options: 10, 25, 50, 100. */
                ps?: number;
                /** @description Staking validator contract address (0x-prefixed hex). */
                address: string;
                /** @description Staking validator contract address (0x-prefixed hex). */
                validator?: string;
                /** @description Sort direction: ascending or descending. Defaults to descending. */
                sort?: "ASC" | "DESC";
                /** @description ISO 8601 date string (YYYY-MM-DD) for range filtering. */
                start?: string;
                /** @description ISO 8601 date string (YYYY-MM-DD) for range filtering. */
                end?: string;
                /** @description Free-text search across validator names, addresses, and metadata. */
                search?: string;
                /** @description Filter by staking operation type (e.g. stake, unstake, claim rewards). */
                operation?: "validator_stake" | "validator_withdrawal_initiated" | "validator_withdrawal_completed" | "validator_claim_rewards" | "delegator_stake" | "delegator_withdrawal_initiated" | "delegator_withdrawal_cancelled" | "delegator_withdrawal_completed" | "delegator_move_stake" | "delegator_claimed_rewards" | "delegator_claim_rewards" | "delegator_restaked_rewards";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Validator staking activity */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ValidatorStakingActivityResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BadRequestResponse"];
                };
            };
            /** @description Forbidden - Missing or invalid API key */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Forbidden"
                     *     }
                     */
                    "application/json": components["schemas"]["ForbiddenResponse"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotFoundResponse"];
                };
            };
            /** @description Too Many Requests - Rate limit exceeded */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Limit Exceeded"
                     *     }
                     */
                    "application/json": components["schemas"]["RateLimitResponse"];
                };
            };
        };
    };
    getAttestations: {
        parameters: {
            query?: {
                /** @description Page number. Defaults to 1. */
                p?: number;
                /** @description Number of items per page. Available options: 10, 25, 50, 100. */
                ps?: number;
                /** @description Staking validator contract address (0x-prefixed hex). */
                validator?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Attestations */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PagedAttestationsResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BadRequestResponse"];
                };
            };
            /** @description Forbidden - Missing or invalid API key */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Forbidden"
                     *     }
                     */
                    "application/json": components["schemas"]["ForbiddenResponse"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotFoundResponse"];
                };
            };
            /** @description Too Many Requests - Rate limit exceeded */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Limit Exceeded"
                     *     }
                     */
                    "application/json": components["schemas"]["RateLimitResponse"];
                };
            };
        };
    };
    listEvents: {
        parameters: {
            query?: {
                /** @description Page number. Defaults to 1. */
                p?: number;
                /** @description Number of items per page. Available options: 10, 25, 50, 100. */
                ps?: number;
                /** @description Filter by contract address. Mutually exclusive with blockHash and txnHash — providing both returns 400. */
                contract?: string;
                /** @description Filter by transaction hash. Mutually exclusive with contract — providing both returns 400. */
                txnHash?: string;
                /** @description Filter by block hash. Mutually exclusive with contract — providing both returns 400. */
                blockHash?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successfully retrieved events */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "items": [
                     *         {
                     *           "blockNumber": 1655808,
                     *           "transactionNumber": 32,
                     *           "number": 3,
                     *           "fromAddress": "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
                     *           "classHash": "0x04ad3c1dc8413453db314497945b6903e1c766495a1e60492d44da9c2a986e4b",
                     *           "transactionHash": "0x3b3fd52c420eb1c0e7a603a650ddae85ead91ad6bc6f8d1df41c020da5576ad",
                     *           "blockId": "undefined",
                     *           "timestamp": 1753890838,
                     *           "id": "12345678",
                     *           "classAlias": null,
                     *           "contractAlias": "StarkGate: STRK Token",
                     *           "name": "Transfer",
                     *           "nestedName": "Transfer",
                     *           "nestedEventNames": [],
                     *           "selector": "0x99cd8bde557814842a3121e8ddfd433a539b8c9f14bf31ebf108d12e6196e9",
                     *           "dataDecoded": [
                     *             {
                     *               "name": "from",
                     *               "value": "0x7162c947255d60a03b935f7f708a5d50a27294fe6aeff3f5ce22865ddf5aab",
                     *               "type": "core::starknet::contract_address::ContractAddress"
                     *             },
                     *             {
                     *               "name": "to",
                     *               "value": "0x1176a1bd84444c89232ec27754698e5d2e7e1a7f1539f12027f28b23ec9f3d8",
                     *               "type": "core::starknet::contract_address::ContractAddress"
                     *             },
                     *             {
                     *               "name": "value",
                     *               "value": "0x116cc1b1ef3500",
                     *               "type": "core::integer::u256"
                     *             }
                     *           ],
                     *           "keyDecoded": []
                     *         }
                     *       ],
                     *       "lastPage": 1
                     *     }
                     */
                    "application/json": components["schemas"]["ListEventsResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BadRequestResponse"];
                };
            };
            /** @description Forbidden - Missing or invalid API key */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Forbidden"
                     *     }
                     */
                    "application/json": components["schemas"]["ForbiddenResponse"];
                };
            };
            /** @description Too Many Requests - Rate limit exceeded */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Limit Exceeded"
                     *     }
                     */
                    "application/json": components["schemas"]["RateLimitResponse"];
                };
            };
        };
    };
    listMessages: {
        parameters: {
            query?: {
                /** @description Filter by block number, block hash, or "pre_confirmed". */
                block?: string;
                /** @description Filter by contract address (0x-prefixed hex). */
                contract?: string;
                /** @description Message direction as numeric index: 0 = L1→L2, 1 = L2→L1. */
                type?: string;
                /** @description Page number. Defaults to 1. */
                p?: number;
                /** @description Number of items per page. Available options: 10, 25, 50, 100. */
                ps?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successfully retrieved messages */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "items": [
                     *         {
                     *           "number": "undefined",
                     *           "hash": "0xa61e3f8770bf11073d1723872a0a6550adae94f91c9325d8797f5e7bd509ec86",
                     *           "block_number": 2389962,
                     *           "tx_hash": "0x440b384d51b8070127ab26c09d5692ae4edcecc91581c1368083b1a880dc9f2",
                     *           "from_address": "0x073314940630fd6dcda0d772d4c972c4e0a9946bef9dabf4ef84eda8ef542b82",
                     *           "to_address": "0xae0ee0a63a2ce6baeeffe56e7714fb4efe48d419",
                     *           "l1_blocks_hash": "undefined",
                     *           "l2_blocks_hash": "0x5475b1162e4410419f467e9c797af838f4384f3e32bafd0ca65cc9e257f7451",
                     *           "timestamp": 1758644185,
                     *           "verified_block_number": 0,
                     *           "alias_l1_contract_address": "undefined",
                     *           "block_hash": "0x5475b1162e4410419f467e9c797af838f4384f3e32bafd0ca65cc9e257f7451",
                     *           "type": "l2l1",
                     *           "contractAlias": "undefined"
                     *         }
                     *       ],
                     *       "lastPage": 85209
                     *     }
                     */
                    "application/json": components["schemas"]["ListMessagesResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BadRequestResponse"];
                };
            };
            /** @description Forbidden - Missing or invalid API key */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Forbidden"
                     *     }
                     */
                    "application/json": components["schemas"]["ForbiddenResponse"];
                };
            };
            /** @description Too Many Requests - Rate limit exceeded */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Limit Exceeded"
                     *     }
                     */
                    "application/json": components["schemas"]["RateLimitResponse"];
                };
            };
        };
    };
    getMessageByHash: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description L1 ↔ L2 message hash (0x-prefixed hex). */
                msgHash: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Message details */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "metadata": {
                     *         "hash": "0xfccbe5f6486f30a8da921c94bd3f9b847c58306439235504f5bbf935d5643886",
                     *         "count": 4,
                     *         "type": "l2l1",
                     *         "from_address": "0x073314940630fd6dcda0d772d4c972c4e0a9946bef9dabf4ef84eda8ef542b82",
                     *         "to_address": "0xae0ee0a63a2ce6baeeffe56e7714fb4efe48d419",
                     *         "selector": "null",
                     *         "payload": "0,634620463854586859851242826670858498842198099023,4543560,35000000000000000000,0",
                     *         "l1ContractAlias": "L1 StarkGate: ETH Bridge",
                     *         "l2ContractAlias": "StarkGate: ETH Bridge",
                     *         "metaInfo": [
                     *           {
                     *             "timestamp": 1744696813,
                     *             "txHash": "0x3254fb74139e2097351ea3b31cb4e0c7e7e0d1605bcf4b7274aa1a565ce10cd",
                     *             "blockHash": "0x32c315cba601b0cf81675642b0b673d98c8d6d3d62c2cd014d701cd47216dc6",
                     *             "status": "sent"
                     *           }
                     *         ],
                     *         "displayInfo": [
                     *           {
                     *             "status": "sent"
                     *           },
                     *           {
                     *             "status": "consumed"
                     *           }
                     *         ],
                     *         "l1_transaction_hash": null
                     *       },
                     *       "l1l2": null,
                     *       "l2l1": {
                     *         "hash": "0xfccbe5f6486f30a8da921c94bd3f9b847c58306439235504f5bbf935d5643886",
                     *         "from_address": "0x073314940630fd6dcda0d772d4c972c4e0a9946bef9dabf4ef84eda8ef542b82",
                     *         "to_address": "0xae0ee0a63a2ce6baeeffe56e7714fb4efe48d419",
                     *         "payload": [
                     *           "0",
                     *           "634620463854586859851242826670858498842198099023",
                     *           "4543560",
                     *           "35000000000000000000",
                     *           "0"
                     *         ]
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["MessageDetail"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BadRequestResponse"];
                };
            };
            /** @description Forbidden - Missing or invalid API key */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Forbidden"
                     *     }
                     */
                    "application/json": components["schemas"]["ForbiddenResponse"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotFoundResponse"];
                };
            };
            /** @description Too Many Requests - Rate limit exceeded */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Limit Exceeded"
                     *     }
                     */
                    "application/json": components["schemas"]["RateLimitResponse"];
                };
            };
        };
    };
    getMessageBridgeTransactions: {
        parameters: {
            query?: {
                /** @description Page number. Defaults to 1. */
                p?: number;
                /** @description Number of items per page. Available options: 10, 25, 50, 100. */
                ps?: number;
            };
            header?: never;
            path: {
                /** @description L1 ↔ L2 message hash (0x-prefixed hex). */
                msgHash: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Bridge transactions */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ListBridgeTransactionsResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BadRequestResponse"];
                };
            };
            /** @description Forbidden - Missing or invalid API key */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Forbidden"
                     *     }
                     */
                    "application/json": components["schemas"]["ForbiddenResponse"];
                };
            };
            /** @description Too Many Requests - Rate limit exceeded */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Limit Exceeded"
                     *     }
                     */
                    "application/json": components["schemas"]["RateLimitResponse"];
                };
            };
        };
    };
    getDailyStats: {
        parameters: {
            query?: {
                /** @description Page number. Defaults to 1. */
                p?: number;
                /** @description Number of items per page. Available options: 10, 25, 50, 100. */
                ps?: number;
                /** @description Metric name to retrieve, or "*" for all available metrics. Defaults to "*". */
                metrics?: "*" | "transactions_per_block" | "transactions_per_second" | "max_transactions_per_second" | "transactions_count" | "classes_count" | "events_count" | "messages_count" | "contracts_count" | "cairo_1_classes" | "cairo_1_contracts" | "account_contracts_count" | "active_account_contracts" | "l1_block_creation_time" | "l2_block_creation_time" | "proof_generation_time" | "fee_per_block" | "tvl" | "account_contracts" | "active_accounts" | "txns_in_queue" | "queue_delay" | "tx_time" | "gas_per_block" | "user_operations_count" | "user_operations_per_block" | "user_operations_per_second" | "max_user_operations_per_second" | "account_calls_count" | "account_calls_per_block" | "account_calls_per_second" | "max_account_calls_per_second" | "standardized_tps" | "erc20_scaling" | "eth_transfer_fee" | "erc20_transfer_fee" | "swap_fee" | "nft_mint_fee" | "starkgate_eth_deposit_fee" | "starkgate_eth_withdrawal_fee" | "l1_block_verification_cost";
                /** @description Time window for historical data: "1w" (1 week), "1m" (1 month), "3m", "6m", "1y", or "max". Defaults to "1m". */
                timerange?: "max" | "1y" | "1m" | "1w" | "1d";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Daily statistics */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "items": [
                     *         {
                     *           "date": "2025-10-03",
                     *           "value": 285671,
                     *           "commulative_value": "234297810"
                     *         },
                     *         {
                     *           "date": "2025-10-09",
                     *           "value": 566253,
                     *           "commulative_value": "236766700"
                     *         }
                     *       ]
                     *     }
                     */
                    "application/json": components["schemas"]["ListDailyStatsResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BadRequestResponse"];
                };
            };
            /** @description Forbidden - Missing or invalid API key */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Forbidden"
                     *     }
                     */
                    "application/json": components["schemas"]["ForbiddenResponse"];
                };
            };
            /** @description Too Many Requests - Rate limit exceeded */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Limit Exceeded"
                     *     }
                     */
                    "application/json": components["schemas"]["RateLimitResponse"];
                };
            };
        };
    };
    getTodayStats: {
        parameters: {
            query?: {
                /** @description Lookback window for today's stats: "1h", "4h", or "24h". Defaults to "24h". */
                hours?: "1h" | "4h" | "24h";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Today's statistics */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /** @example {} */
                    "application/json": components["schemas"]["TodayStats"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BadRequestResponse"];
                };
            };
            /** @description Forbidden - Missing or invalid API key */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Forbidden"
                     *     }
                     */
                    "application/json": components["schemas"]["ForbiddenResponse"];
                };
            };
            /** @description Too Many Requests - Rate limit exceeded */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Limit Exceeded"
                     *     }
                     */
                    "application/json": components["schemas"]["RateLimitResponse"];
                };
            };
        };
    };
    getNetworkStats: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Network statistics */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "blocksCount": "2390025",
                     *       "contractsCount": "6373421",
                     *       "classesCount": "68530",
                     *       "transactionsCount": "230540045",
                     *       "tpsAtBlockHash": "0x7faee6e4612f883a8af435f06ca625c69a5e3ba34500a46543fa6b5ed424a89",
                     *       "tps": "8",
                     *       "maxRecordedTps": "992",
                     *       "latestAvgFee": [
                     *         {
                     *           "avgFee": "0.001868883883626956",
                     *           "unit": "USD"
                     *         },
                     *         {
                     *           "avgFee": "0.000000446609922962",
                     *           "unit": "ETH"
                     *         }
                     *       ],
                     *       "activeAccounts": "53183",
                     *       "accountsGrowth": "5846",
                     *       "totalTvl": {
                     *         "value": "566494214",
                     *         "unit": "USD"
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["Statistics"];
                };
            };
            /** @description Forbidden - Missing or invalid API key */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Forbidden"
                     *     }
                     */
                    "application/json": components["schemas"]["ForbiddenResponse"];
                };
            };
            /** @description Too Many Requests - Rate limit exceeded */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Limit Exceeded"
                     *     }
                     */
                    "application/json": components["schemas"]["RateLimitResponse"];
                };
            };
        };
    };
    getEventActivities: {
        parameters: {
            query?: {
                /** @description Number of items per page. Available options: 10, 25, 50, 100. */
                page_size?: number;
                /** @description Page number. Defaults to 1. */
                page?: number;
                /** @description Token standard to filter by: "ERC20", "ERC721", or "ERC1155". Defaults to "ERC20". */
                token_type?: string | null;
                /** @description Sender address (0x-prefixed hex). At least one of from_address or to_address must be provided. */
                from_address?: string | null;
                /** @description Recipient address (0x-prefixed hex). At least one of from_address or to_address must be provided. */
                to_address?: string | null;
                /** @description Start of the block range (inclusive). */
                from_block?: number | null;
                /** @description End of the block range (inclusive). */
                to_block?: number | null;
                /** @description Start of the time range (Unix seconds, inclusive). Must be after 2021-01-01. Max window: 90 days. */
                from_timestamp?: number;
                /** @description End of the time range (Unix seconds, inclusive). Max window: 90 days. Future values are clamped to now. */
                to_timestamp?: number | null;
                /** @description Sort direction: ascending or descending. Defaults to descending. */
                sort?: string | null;
                /** @description Cursor for keyset pagination. Pass the id from the last item of the previous response to fetch the next page. */
                last_id?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Event activities */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "items": [
                     *         {
                     *           "blockHash": "0x61a4a7b548fde072087b1544d9307a2e00fdd604218fcb1c579468192bffe86",
                     *           "blockNumber": 192179,
                     *           "timestamp": 1726677511,
                     *           "tokenAddress": "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
                     *           "transferFrom": "0x02dc3f265d7e99089460a98721b1dec131147402b6ce0a64487238f96872b649",
                     *           "transferTo": "0x01176a1bd84444c89232ec27754698e5d2e7e1a7f1539f12027f28b23ec9f3d8",
                     *           "transferDataLen": 1,
                     *           "transferValues": [
                     *             "48912831549305"
                     *           ],
                     *           "txHash": "0x21bd605123b087472e0a3217f622b864e46c8caadd5f5ac4899520e641efa60",
                     *           "tokenName": "Ether",
                     *           "tokenSymbol": "ETH",
                     *           "tokenDecimals": "0x12",
                     *           "callName": "transfer",
                     *           "invocationType": "FEE_TRANSFER",
                     *           "abiVerified": false,
                     *           "data": [
                     *             "0x2dc3f265d7e99089460a98721b1dec131147402b6ce0a64487238f96872b649",
                     *             "0x1176a1bd84444c89232ec27754698e5d2e7e1a7f1539f12027f28b23ec9f3d8",
                     *             "0x2c7c67f30f79",
                     *             "0x0"
                     *           ],
                     *           "keys": [
                     *             "0x99cd8bde557814842a3121e8ddfd433a539b8c9f14bf31ebf108d12e6196e9"
                     *           ],
                     *           "selector": "0x99cd8bde557814842a3121e8ddfd433a539b8c9f14bf31ebf108d12e6196e9",
                     *           "name": "Transfer",
                     *           "nestedName": "Transfer",
                     *           "nestedEventNames": [],
                     *           "dataDecoded": [
                     *             {
                     *               "name": "from",
                     *               "value": "0x2dc3f265d7e99089460a98721b1dec131147402b6ce0a64487238f96872b649",
                     *               "type": "core::starknet::contract_address::ContractAddress"
                     *             },
                     *             {
                     *               "name": "to",
                     *               "value": "0x1176a1bd84444c89232ec27754698e5d2e7e1a7f1539f12027f28b23ec9f3d8",
                     *               "type": "core::starknet::contract_address::ContractAddress"
                     *             },
                     *             {
                     *               "name": "value",
                     *               "value": "0x2c7c67f30f79",
                     *               "type": "core::integer::u256"
                     *             }
                     *           ],
                     *           "keyDecoded": [],
                     *           "eventId": "192179_0_1",
                     *           "fromAlias": null,
                     *           "toAlias": null,
                     *           "id": "32894032"
                     *         }
                     *       ],
                     *       "hasMore": false
                     *     }
                     */
                    "application/json": components["schemas"]["EventActivityResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BadRequestResponse"];
                };
            };
            /** @description Forbidden - Missing or invalid API key */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Forbidden"
                     *     }
                     */
                    "application/json": components["schemas"]["ForbiddenResponse"];
                };
            };
            /** @description Too Many Requests - Rate limit exceeded */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Limit Exceeded"
                     *     }
                     */
                    "application/json": components["schemas"]["RateLimitResponse"];
                };
            };
        };
    };
    getTransactionActivities: {
        parameters: {
            query?: {
                /** @description Page number. Defaults to 1. */
                p?: number;
                /** @description Number of items per page. Available options: 10, 25, 50, 100. */
                ps?: number;
                /** @description Start of the block range (inclusive). Requires sender_address to be provided. */
                from_block?: number | null;
                /** @description Sender wallet address (0x-prefixed hex). */
                sender_address?: string;
                /** @description Sort direction: ascending or descending. Defaults to ascending. */
                sort?: "asc" | "desc";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Transaction activities with decoded call information */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "items": [
                     *         {
                     *           "block_hash": "0x61a4a7b548fde072087b1544d9307a2e00fdd604218fcb1c579468192bffe86",
                     *           "block_number": 192179,
                     *           "hash": "0x21bd605123b087472e0a3217f622b864e46c8caadd5f5ac4899520e641efa60",
                     *           "index": 0,
                     *           "l1_transaction_hash": null,
                     *           "type": "INVOKE",
                     *           "class_hash": "0x01a736d6ed154502257f02b1ccdf4d9d1089f80811cd6acad48e6b6a9d1f2003",
                     *           "contract_address": "0x02dc3f265d7e99089460a98721b1dec131147402b6ce0a64487238f96872b649",
                     *           "sender_address": "0x02dc3f265d7e99089460a98721b1dec131147402b6ce0a64487238f96872b649",
                     *           "timestamp": 1726677511,
                     *           "status": "Accepted on L2",
                     *           "execution_status": "Succeeded",
                     *           "finality_status": "Accepted on L2",
                     *           "revert_error": null,
                     *           "entry_point_selector": "0x15d40a3d6ca2ac30f4031e42be28da9b056fef9bb7357ac5e85627ee876e5ad",
                     *           "max_fee": "0x2386f26fc10000",
                     *           "actual_fee": "0x2c7c67f30f79",
                     *           "actual_fee_unit": "ETH",
                     *           "gas_price_in_wei": "0x3b9aca00",
                     *           "gas_price_in_fri": null,
                     *           "version": "0x1",
                     *           "nonce": "0x5",
                     *           "constructor_calldata": null,
                     *           "calldata": [
                     *             "0x1",
                     *             "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
                     *             "0x83afd3f4caedc6eebf44246fe54e38c95e3179a5ec9ea81740eca5b482d12e"
                     *           ],
                     *           "calls": [
                     *             {
                     *               "contract_address": "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
                     *               "class_hash": "0x048624e084dc68d82076582219c7ed8cb0910c01746cca3cd72a28ecfe07e42d",
                     *               "entrypoint_type": "EXTERNAL",
                     *               "entrypoint": "transfer",
                     *               "selector": "0x83afd3f4caedc6eebf44246fe54e38c95e3179a5ec9ea81740eca5b482d12e",
                     *               "calldata": [
                     *                 "0x1176a1bd84444c89232ec27754698e5d2e7e1a7f1539f12027f28b23ec9f3d8",
                     *                 "0x2c7c67f30f79",
                     *                 "0x0"
                     *               ],
                     *               "call_type": "CALL",
                     *               "inputs": {
                     *                 "recipient": "0x1176a1bd84444c89232ec27754698e5d2e7e1a7f1539f12027f28b23ec9f3d8",
                     *                 "amount": {
                     *                   "low": "48912831549305",
                     *                   "high": "0"
                     *                 }
                     *               },
                     *               "outputs": {
                     *                 "0": true
                     *               }
                     *             }
                     *           ],
                     *           "partial_calls_parsing": false,
                     *           "sender_alias": null,
                     *           "contract_alias": null,
                     *           "class_alias": "Account"
                     *         }
                     *       ],
                     *       "lastPage": 1000
                     *     }
                     */
                    "application/json": components["schemas"]["TransactionActivityResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BadRequestResponse"];
                };
            };
            /** @description Forbidden - Missing or invalid API key */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Forbidden"
                     *     }
                     */
                    "application/json": components["schemas"]["ForbiddenResponse"];
                };
            };
            /** @description Too Many Requests - Rate limit exceeded */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Limit Exceeded"
                     *     }
                     */
                    "application/json": components["schemas"]["RateLimitResponse"];
                };
            };
        };
    };
    getVerificationJobStatus: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description UUID of the class verification job. */
                job: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Verification job status */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "job_id": "1985c0c9-c4f0-4000-8881-93ab2a614101",
                     *       "class_hash": "0x0421dbe408553c0a49267f752565277123f437145463e4670e3da70fe69ed285",
                     *       "created_timestamp": 1758640000,
                     *       "updated_timestamp": 1758640300,
                     *       "status": 4,
                     *       "status_description": "Verification completed successfully",
                     *       "address": "0x07faf54d35eb92d381cb5d3b9ba6b35ccf297980e35be22ecfe07eafd2a4ac48",
                     *       "contract_file": "src/lib.cairo",
                     *       "name": "MyToken",
                     *       "version": "2.4.0",
                     *       "license": "MIT",
                     *       "package_name": "my_token",
                     *       "project_dir_path": ".",
                     *       "build_tool": "scarb",
                     *       "dojo_version": null,
                     *       "error_code": null,
                     *       "error_category": null,
                     *       "error_details": null,
                     *       "error_stage": null,
                     *       "error_suggestions": null,
                     *       "trace_id": "abc123-def456"
                     *     }
                     */
                    "application/json": components["schemas"]["VerificationJobStatus"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BadRequestResponse"];
                };
            };
            /** @description Forbidden - Missing or invalid API key */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Forbidden"
                     *     }
                     */
                    "application/json": components["schemas"]["ForbiddenResponse"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotFoundResponse"];
                };
            };
            /** @description Too Many Requests - Rate limit exceeded */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Limit Exceeded"
                     *     }
                     */
                    "application/json": components["schemas"]["RateLimitResponse"];
                };
            };
        };
    };
    checkVerificationStatus: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Class hash or contract address to check verification status for (0x-prefixed hex). */
                hash: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Verification check result */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["VerificationCheckResult"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BadRequestResponse"];
                };
            };
            /** @description Forbidden - Missing or invalid API key */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Forbidden"
                     *     }
                     */
                    "application/json": components["schemas"]["ForbiddenResponse"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotFoundResponse"];
                };
            };
            /** @description Too Many Requests - Rate limit exceeded */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Limit Exceeded"
                     *     }
                     */
                    "application/json": components["schemas"]["RateLimitResponse"];
                };
            };
        };
    };
    submitVerification: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Class hash or contract address to check verification status for (0x-prefixed hex). */
                hash: string;
            };
            cookie?: never;
        };
        /** @description Cairo source files and metadata */
        requestBody?: {
            content: {
                "multipart/form-data": components["schemas"]["VerificationSubmitBody"];
            };
        };
        responses: {
            /** @description Verification job created or verification result */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["VerifyContractClassResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BadRequestResponse"];
                };
            };
            /** @description Forbidden - Missing or invalid API key */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Forbidden"
                     *     }
                     */
                    "application/json": components["schemas"]["ForbiddenResponse"];
                };
            };
            /** @description Too Many Requests - Rate limit exceeded */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Limit Exceeded"
                     *     }
                     */
                    "application/json": components["schemas"]["RateLimitResponse"];
                };
            };
        };
    };
    getApiStatus: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description API status */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "apis": {
                     *         "core": {
                     *           "status": "ok",
                     *           "lagSeconds": 5
                     *         },
                     *         "staking": {
                     *           "status": "ok",
                     *           "lagSeconds": 6
                     *         },
                     *         "tokens": {
                     *           "status": "lagging",
                     *           "lagSeconds": 80
                     *         },
                     *         "nfts": {
                     *           "status": "down",
                     *           "lagSeconds": 400
                     *         }
                     *       },
                     *       "timestamp": 1767097236000
                     *     }
                     */
                    "application/json": components["schemas"]["ApiStatus"];
                };
            };
            /** @description Forbidden - Missing or invalid API key */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Forbidden"
                     *     }
                     */
                    "application/json": components["schemas"]["ForbiddenResponse"];
                };
            };
            /** @description Too Many Requests - Rate limit exceeded */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Limit Exceeded"
                     *     }
                     */
                    "application/json": components["schemas"]["RateLimitResponse"];
                };
            };
        };
    };
}
