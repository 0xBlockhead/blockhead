export interface paths {
    "/v2/blocks/{block_hash_or_number_param}/internal-transactions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List internal transactions in a specific block
         * @description Retrieves internal transactions included in a specific block with optional filtering by type and call type.
         */
        get: operations["BlockScoutWeb.API.V2.BlockController.internal_transactions"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/tokens/{address_hash_param}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Retrieve detailed information about a specific token
         * @description Retrieves detailed information for a specific token identified by its contract address.
         */
        get: operations["BlockScoutWeb.API.V2.TokenController.token"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/config/csv-export": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * CSV export limits
         * @description Returns configured limits for CSV export endpoints.
         */
        get: operations["BlockScoutWeb.API.V2.ConfigController.csv_export"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/transactions/{transaction_hash_param}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Retrieve detailed information about a specific transaction
         * @description Retrieves detailed information for a specific transaction identified by its hash.
         */
        get: operations["BlockScoutWeb.API.V2.TransactionController.transaction"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/main-page/transactions/watchlist": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Last 6 transactions from the current user's watchlist
         * @description Retrieves a list of last 6 transactions from the current user's watchlist.
         */
        get: operations["BlockScoutWeb.API.V2.MainPageController.watchlist_transactions"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/tokens/{address_hash_param}/holders/csv": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Export token holders as CSV
         * @description Exports the holders of a specific token as a CSV file.
         */
        get: operations["BlockScoutWeb.API.V2.CsvExportController.export_token_holders"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/tokens/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List tokens with optional filtering by name, symbol, or type
         * @description Retrieves a paginated list of tokens with optional filtering by name, symbol, or type.
         */
        get: operations["BlockScoutWeb.API.V2.TokenController.tokens_list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/transactions/{transaction_hash_param}/fhe-operations": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List FHE operations for a specific transaction
         * @description Retrieves Fully Homomorphic Encryption (FHE) operations parsed from transaction logs. Includes operation details, HCU (Homomorphic Compute Unit) costs, operation types, and related metadata.
         */
        get: operations["BlockScoutWeb.API.V2.TransactionController.fhe_operations"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/addresses/{address_hash_param}/token-transfers/csv": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Export token transfers as CSV
         * @description Exports token transfers for a specific address as a CSV file.
         */
        get: operations["BlockScoutWeb.API.V2.CsvExportController.token_transfers_csv"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/addresses/{address_hash_param}/token-balances": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List all token balances held by a specific address
         * @description Retrieves all token balances held by a specific address, including ERC-20, ERC-721, ERC-1155, and ERC-404 tokens.
         */
        get: operations["BlockScoutWeb.API.V2.AddressController.token_balances"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/blocks/{block_hash_or_number_param}/withdrawals": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List validator withdrawals including amounts, index and receiver details processed in a specific block
         * @description Retrieves withdrawals processed in a specific block (typically for proof-of-stake networks).
         */
        get: operations["BlockScoutWeb.API.V2.BlockController.withdrawals"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/tokens/{address_hash_param}/holders": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List addresses holding a specific token sorted by balance
         * @description Retrieves addresses holding a specific token, sorted by balance. Useful for analyzing token distribution.
         */
        get: operations["BlockScoutWeb.API.V2.TokenController.holders"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/blocks/{block_hash_or_number_param}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Retrieves detailed information for a specific block identified by its number or hash.
         * @description Retrieves detailed information for a specific block, including transactions, internal transactions, and metadata.
         */
        get: operations["BlockScoutWeb.API.V2.BlockController.block"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/addresses/{address_hash_param}/tokens": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List token balances for an address with pagination and type filtering
         * @description Retrieves token balances for a specific address with pagination and filtering by token type. Useful for displaying large token portfolios.
         */
        get: operations["BlockScoutWeb.API.V2.AddressController.tokens"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/smart-contracts/{address_hash_param}/audit-reports": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Audit reports list
         * @description Returns audit reports for a given smart contract address.
         */
        get: operations["BlockScoutWeb.API.V2.SmartContractController.audit_reports_list"];
        put?: never;
        /**
         * Submit audit report
         * @description Submits an audit report for a given smart contract address.
         */
        post: operations["BlockScoutWeb.API.V2.SmartContractController.audit_report_submission"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/addresses/{address_hash_param}/token-transfers": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List token transfers involving a specific address with filtering options
         * @description Retrieves token transfers involving a specific address, with optional filtering by token type, direction, and specific token.
         */
        get: operations["BlockScoutWeb.API.V2.AddressController.token_transfers"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/addresses/{address_hash_param}/nft": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List NFTs owned by a specific address with optional type filtering
         * @description Retrieves a list of NFTs (non-fungible tokens) owned by a specific address, with optional filtering by token type.
         */
        get: operations["BlockScoutWeb.API.V2.AddressController.nft_list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/stats": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Retrieve blockchain network statistics and metrics
         * @description Retrieves blockchain network statistics including total blocks, transactions, addresses, average block time, market data, and network utilization.
         */
        get: operations["BlockScoutWeb.API.V2.StatsController.stats"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/tokens/{address_hash_param}/instances": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List individual NFT instances for a token contract
         * @description Retrieves instances of NFTs for a specific token contract. This endpoint is primarily for ERC-721 and ERC-1155 tokens.
         */
        get: operations["BlockScoutWeb.API.V2.TokenController.instances"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/proxy/account-abstraction/operations/{operation_hash_param}/summary": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get a human-readable, LLM-based user operation summary
         * @description Retrieves a human-readable summary of what a user operation did, presented in natural language.
         */
        get: operations["BlockScoutWeb.API.V2.Proxy.AccountAbstractionController.summary"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/main-page/blocks": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Retrieve recent blocks as displayed on Blockscout homepage
         * @description Retrieves a limited set of recent blocks for display on the main page or dashboard.
         */
        get: operations["BlockScoutWeb.API.V2.MainPageController.blocks"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/stats/charts/secondary-coin-market": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Secondary coin market history chart data
         * @description Returns market history for the secondary coin used for charting.
         */
        get: operations["BlockScoutWeb.API.V2.StatsController.secondary_coin_market_chart"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/addresses/{address_hash_param}/blocks-validated": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List blocks validated (mined) by a specific validator/miner address
         * @description Retrieves blocks that were validated (mined) by a specific address. Useful for tracking validator/miner performance.
         */
        get: operations["BlockScoutWeb.API.V2.AddressController.blocks_validated"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/addresses/{address_hash_param}/internal-transactions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List all internal transactions involving a specific address
         * @description Retrieves all internal transactions involving a specific address, with optional filtering for internal transactions sent from or to the address.
         */
        get: operations["BlockScoutWeb.API.V2.AddressController.internal_transactions"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/transactions/{transaction_hash_param}/external-transactions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List external transactions linked to a transaction
         * @description Retrieves external transactions that are linked to the specified transaction (e.g., Solana transactions in `neon` chain type).
         */
        get: operations["BlockScoutWeb.API.V2.TransactionController.external_transactions"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/tokens/{address_hash_param}/transfers": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List ownership transfer history for a specific NFT
         * @description Retrieves transfer history for a specific NFT instance, showing ownership changes over time.
         */
        get: operations["BlockScoutWeb.API.V2.TokenController.transfers"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/transactions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List blockchain transactions with filtering options for status, type, and method
         * @description Retrieves a paginated list of transactions with optional filtering by status, type, and method.
         */
        get: operations["BlockScoutWeb.API.V2.TransactionController.transactions"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/tokens/{address_hash_param}/instances/{token_id_param}/holders": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List current holders of a specific NFT
         * @description Retrieves current holders of a specific NFT instance. For ERC-721, this will typically be a single address. For ERC-1155, multiple addresses may hold the same token ID.
         */
        get: operations["BlockScoutWeb.API.V2.TokenController.holders_by_instance"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/stats/hot-smart-contracts": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Retrieve hot smart-contracts
         * @description Retrieves paginated list of hot smart-contracts
         */
        get: operations["BlockScoutWeb.API.V2.StatsController.hot_smart_contracts"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/advanced-filters/csv": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Export advanced-filter results as CSV
         * @description Streams the items matching the advanced filter criteria as a CSV file. When asynchronous CSV export is enabled on the deployment, returns `202 Accepted` with a `request_id` that can be polled via `/api/v2/csv-exports/{request_id}`; otherwise the CSV body is streamed inline.
         */
        get: operations["BlockScoutWeb.API.V2.AdvancedFilterController.list_csv"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/proxy/account-abstraction/status": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get the status of the account abstraction microservice
         * @description Retrieves the status of the account abstraction microservice.
         */
        get: operations["BlockScoutWeb.API.V2.Proxy.AccountAbstractionController.status"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/smart-contracts/{address_hash_param}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Retrieve detailed information about a verified smart contract
         * @description Retrieves detailed information about a specific verified smart contract, including source code, ABI, and deployment details.
         */
        get: operations["BlockScoutWeb.API.V2.SmartContractController.smart_contract"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/tokens/{address_hash_param}/instances/{token_id_param}/transfers": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List token transfers for a specific token instance
         * @description Retrieves token transfers for a specific token instance (by token address and token ID).
         */
        get: operations["BlockScoutWeb.API.V2.TokenController.transfers_by_instance"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/config/backend-version": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get backend version
         * @description Returns application backend version string.
         */
        get: operations["BlockScoutWeb.API.V2.ConfigController.backend_version"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/legacy/logs/get-logs": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Event Logs by Address and/or Topic(s)
         * @description Event logs for an address and topic. Use and/or with the topic operator to specify
         *     topic retrieval options when adding multiple topics. Up to a maximum of 1,000 event logs.
         *
         *     Required:
         *     - `fromBlock` and `toBlock`
         *     - At least one of `address`, `topic0`, `topic1`, `topic2`, `topic3`
         *     - If any pair of topic parameters is set, the corresponding `topicA_B_opr` is required.
         */
        get: operations["BlockScoutWeb.API.Legacy.LogsController.get_logs"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/token-transfers": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List token transfers across all token types (ERC-20, ERC-721, ERC-1155)
         * @description Retrieves a paginated list of token transfers across all token types (ERC-20, ERC-721, ERC-1155).
         */
        get: operations["BlockScoutWeb.API.V2.TokenTransferController.token_transfers"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/transactions/{transaction_hash_param}/token-transfers": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List token transfers within a specific transaction
         * @description Retrieves token transfers that occurred within a specific transaction, with optional filtering by token type.
         */
        get: operations["BlockScoutWeb.API.V2.TransactionController.token_transfers"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/stats/charts/market": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get daily closing price and market cap for native coin
         * @description Retrieves time series data of market information (daily closing price, market cap) for rendering charts.
         */
        get: operations["BlockScoutWeb.API.V2.StatsController.market_chart"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/search/quick": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Quick (unpaginated) search
         * @description Performs a quick, unpaginated search for short queries.
         */
        get: operations["BlockScoutWeb.API.V2.SearchController.quick_search"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/proxy/account-abstraction/bundlers/{address_hash_param}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get a bundler by address hash
         * @description Retrieves a bundler by its address hash.
         */
        get: operations["BlockScoutWeb.API.V2.Proxy.AccountAbstractionController.bundler"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/main-page/transactions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Retrieve recent transactions as displayed on Blockscout homepage
         * @description Retrieves a limited set of recent transactions displayed on the home page.
         */
        get: operations["BlockScoutWeb.API.V2.MainPageController.transactions"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/addresses/{address_hash_param}/counters": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get activity count stats for a specific address
         * @description Retrieves count statistics for an address, including transactions, token transfers, gas usage, and validations.
         */
        get: operations["BlockScoutWeb.API.V2.AddressController.counters"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/tokens/{address_hash_param}/counters": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get holder and transfer count statistics for a specific token
         * @description Retrieves count statistics for a specific token, including holders count and transfers count.
         */
        get: operations["BlockScoutWeb.API.V2.TokenController.counters"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/config/indexer": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Indexer configuration
         * @description Returns config of indexer.
         */
        get: operations["BlockScoutWeb.API.V2.ConfigController.indexer"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/config/smart-contracts/languages": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Smart contract languages list
         * @description Returns list of smart contract languages supported by the database schema.
         */
        get: operations["BlockScoutWeb.API.V2.ConfigController.languages_list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/advanced-filters": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List transactions, internal transactions and token transfers matching the advanced filter criteria
         * @description Returns a paginated, mixed list of activity — native value transfers, internal transactions and token transfers — filtered by transaction type, contract method, time window, address relations, value range and/or token contract. The response also echoes the resolved human-readable names of the methods and tokens referenced in the request filters.
         */
        get: operations["BlockScoutWeb.API.V2.AdvancedFilterController.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/tokens/{address_hash_param}/instances/{token_id_param}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Retrieve detailed information about a specific NFT
         * @description Retrieves detailed information about a specific NFT instance, identified by its token contract address and token ID.
         */
        get: operations["BlockScoutWeb.API.V2.TokenController.instance"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/stats/charts/transactions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get daily transaction counts
         * @description Retrieves time series data of daily transaction counts for rendering charts.
         */
        get: operations["BlockScoutWeb.API.V2.StatsController.transactions_chart"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/addresses/{address_hash_param}/tabs-counters": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get counters for address tabs
         * @description Retrieves counters for various address-related entities (max counter value is 51).
         */
        get: operations["BlockScoutWeb.API.V2.AddressController.tabs_counters"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/smart-contracts/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List verified smart contracts with optional filtering options
         * @description Retrieves a paginated list of verified smart contracts with optional filtering by proxy status or programming language.
         */
        get: operations["BlockScoutWeb.API.V2.SmartContractController.smart_contracts_list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/addresses/{address_hash_param}/coin-balance-history": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get native coin balance history for an address showing all balance changes
         * @description Retrieves historical native coin balance changes for a specific address, tracking how an address's balance has changed over time.
         */
        get: operations["BlockScoutWeb.API.V2.AddressController.coin_balance_history"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/tokens/{address_hash_param}/instances/refetch-metadata": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Trigger metadata refetch for a token's NFT collection
         * @description Triggers a metadata refetch for a token's NFT collection (by token address). Requires API key.
         */
        patch: operations["BlockScoutWeb.API.V2.TokenController.trigger_nft_collection_metadata_refetch"];
        trace?: never;
    };
    "/v2/proxy/account-abstraction/bundlers": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List of top bundlers
         * @description Retrieves a list of top bundlers.
         */
        get: operations["BlockScoutWeb.API.V2.Proxy.AccountAbstractionController.bundlers"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/transactions/{transaction_hash_param}/state-changes": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get on-chain state changes caused by a specific transaction
         * @description Retrieves state changes (balance changes, token transfers) caused by a specific transaction.
         */
        get: operations["BlockScoutWeb.API.V2.TransactionController.state_changes"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/addresses/{address_hash_param}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Retrieve detailed information about a specific address or contract
         * @description Retrieves detailed information for a specific address, including balance, transaction count, and metadata.
         */
        get: operations["BlockScoutWeb.API.V2.AddressController.address"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/blocks/{block_number_param}/countdown": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get countdown information for a target block number
         * @description Calculates the estimated time remaining until a specified block number is reached based on current block and average block time.
         */
        get: operations["BlockScoutWeb.API.V2.BlockController.block_countdown"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/addresses": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List addresses holding native coins sorted by balance - top accounts
         * @description Retrieves a paginated list of addresses holding the native coin, sorted by balance.
         */
        get: operations["BlockScoutWeb.API.V2.AddressController.addresses_list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/addresses/{address_hash_param}/withdrawals": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List validator withdrawals involving a specific address
         * @description Retrieves withdrawals involving a specific address, typically for proof-of-stake networks supporting validator withdrawals.
         */
        get: operations["BlockScoutWeb.API.V2.AddressController.withdrawals"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/proxy/account-abstraction/operations/{operation_hash_param}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get a user operation by hash
         * @description Retrieves a user operation by its hash.
         */
        get: operations["BlockScoutWeb.API.V2.Proxy.AccountAbstractionController.operation"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/proxy/account-abstraction/paymasters/{address_hash_param}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get a paymaster by address hash
         * @description Retrieves a paymaster by its address hash.
         */
        get: operations["BlockScoutWeb.API.V2.Proxy.AccountAbstractionController.paymaster"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/internal-transactions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List internal transactions generated during smart contract execution
         * @description Retrieves a paginated list of internal transactions. Internal transactions are generated during contract execution and not directly recorded on the blockchain.
         */
        get: operations["BlockScoutWeb.API.V2.InternalTransactionController.internal_transactions"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/proxy/account-abstraction/operations": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List of recent user operations
         * @description Retrieves a list of recent user operations.
         */
        get: operations["BlockScoutWeb.API.V2.Proxy.AccountAbstractionController.operations"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/addresses/{address_hash_param}/coin-balance-history-by-day": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get daily native coin balance snapshots for an address from previous 10 days
         * @description Retrieves daily snapshots of native coin balance for a specific address. Useful for generating balance-over-time charts.
         */
        get: operations["BlockScoutWeb.API.V2.AddressController.coin_balance_history_by_day"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/smart-contracts/counters": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get count statistics (new & newly verified) for deployed smart contracts
         * @description Retrieves count statistics for smart contracts, including total contracts, verified contracts, and new contracts in the last 24 hours.
         */
        get: operations["BlockScoutWeb.API.V2.SmartContractController.smart_contracts_counters"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/tokens/{address_hash_param}/instances/{token_id_param}/transfers-count": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get total number of ownership transfers for a specific NFT
         * @description Retrieves the total number of transfers for a specific NFT instance. Useful for determining how frequently an NFT has changed hands.
         */
        get: operations["BlockScoutWeb.API.V2.TokenController.transfers_count_by_instance"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/main-page/indexing-status": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Check if indexing is finished with indexing ratio
         * @description Retrieves the current status of blockchain data indexing by the BlockScout instance.
         */
        get: operations["BlockScoutWeb.API.V2.MainPageController.indexing_status"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/blocks/{block_hash_or_number_param}/transactions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List transactions and tx details included in a specific block
         * @description Retrieves transactions included in a specific block, ordered by transaction index.
         */
        get: operations["BlockScoutWeb.API.V2.BlockController.transactions"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/proxy/account-abstraction/accounts/{address_hash_param}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get an account abstraction wallet by address hash
         * @description Retrieves an account abstraction wallet by its address hash.
         */
        get: operations["BlockScoutWeb.API.V2.Proxy.AccountAbstractionController.account"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/transactions/{transaction_hash_param}/summary": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get a human-readable, LLM-based transaction summary
         * @description Retrieves a human-readable summary of what a transaction did, presented in natural language.
         */
        get: operations["BlockScoutWeb.API.V2.TransactionController.summary"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/proxy/account-abstraction/factories": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List of top wallet factories
         * @description Retrieves a list of top wallet factories.
         */
        get: operations["BlockScoutWeb.API.V2.Proxy.AccountAbstractionController.factories"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/withdrawals/counters": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Withdrawals counters
         * @description Returns total withdrawals count and sum from cache.
         */
        get: operations["BlockScoutWeb.API.V2.WithdrawalController.withdrawals_counters"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/blocks": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List blocks with optional filtering by block type
         * @description Retrieves a paginated list of blocks ordered by descending block number.
         *
         *     When the `type` query parameter is omitted, only main-chain consensus blocks
         *     (equivalent to `type=block`) are returned. Use `type=uncle` to list ommer
         *     blocks (valid but not in the main chain) and `type=reorg` to list blocks
         *     that lost consensus during a chain reorganization.
         *
         *     Pagination is cursor-based: the response contains `next_page_params` with
         *     `block_number` and `items_count` — pass these back as query parameters on
         *     the next request to fetch the following page.
         */
        get: operations["BlockScoutWeb.API.V2.BlockController.blocks"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/tokens/{address_hash_param}/instances/{token_id_param}/refetch-metadata": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Trigger a refresh of metadata for a specific NFT
         * @description Triggers a refresh of metadata for a specific NFT instance. Useful when the NFT's metadata has been updated but is not yet reflected in the BlockScout database.
         */
        patch: operations["BlockScoutWeb.API.V2.TokenController.refetch_metadata"];
        trace?: never;
    };
    "/v2/addresses/{address_hash_param}/logs": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List event logs emitted by or involving a specific address
         * @description Retrieves event logs emitted by or involving a specific address.
         */
        get: operations["BlockScoutWeb.API.V2.AddressController.logs"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/legacy/block/get-block-number-by-time": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get block number by time stamp
         * @description Returns the block number created closest to a provided timestamp.
         *
         *     Required:
         *     - `timestamp`
         *     - `closest`
         */
        get: operations["BlockScoutWeb.API.Legacy.BlockController.get_block_number_by_time"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/proxy/account-abstraction/accounts": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List of account abstraction wallets
         * @description Retrieves a list of account abstraction wallets.
         */
        get: operations["BlockScoutWeb.API.V2.Proxy.AccountAbstractionController.accounts"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/addresses/{address_hash_param}/internal-transactions/csv": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Export internal transactions as CSV
         * @description Exports internal transactions for a specific address as a CSV file.
         */
        get: operations["BlockScoutWeb.API.V2.CsvExportController.internal_transactions_csv"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/search/check-redirect": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Check if search query should redirect to a specific entity page
         * @description Checks if a search query redirects to a specific entity page rather than showing search results.
         */
        get: operations["BlockScoutWeb.API.V2.SearchController.check_redirect"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/transactions/stats": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get transaction statistics
         * @description Retrieves statistics for transactions, including counts and fee summaries for the last 24 hours.
         */
        get: operations["BlockScoutWeb.API.V2.TransactionController.stats"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/config/public-metrics": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Public metrics configuration
         * @description Returns update period / configuration for public metrics.
         */
        get: operations["BlockScoutWeb.API.V2.ConfigController.public_metrics"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/search": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Search for tokens, addresses, contracts, blocks, or transactions by identifier
         * @description Performs a unified search across multiple blockchain entity types including tokens, addresses, contracts, blocks, transactions and other resources.
         */
        get: operations["BlockScoutWeb.API.V2.SearchController.search"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/proxy/account-abstraction/factories/{address_hash_param}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get a factory by address hash
         * @description Retrieves a factory by its address hash.
         */
        get: operations["BlockScoutWeb.API.V2.Proxy.AccountAbstractionController.factory"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/transactions/{transaction_hash_param}/logs": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List event logs emitted during a specific transaction
         * @description Retrieves event logs emitted during the execution of a specific transaction. Logs contain information about contract events and state changes.
         */
        get: operations["BlockScoutWeb.API.V2.TransactionController.logs"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/config/db-background-migrations": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Uncompleted background migrations
         * @description Returns list of background migrations that are not yet completed.
         */
        get: operations["BlockScoutWeb.API.V2.ConfigController.db_background_migrations"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/advanced-filters/methods": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List known contract methods
         * @description Returns a list of known contract methods. When the `q` parameter is provided, searches for a single method by its 4-byte selector or name. Without `q`, returns the default list of popular methods.
         */
        get: operations["BlockScoutWeb.API.V2.AdvancedFilterController.list_methods"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/proxy/account-abstraction/paymasters": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List of top paymasters
         * @description Retrieves a list of top paymasters.
         */
        get: operations["BlockScoutWeb.API.V2.Proxy.AccountAbstractionController.paymasters"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/transactions/watchlist": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List transactions in a user's watchlist
         * @description Retrieves transactions in the authenticated user's watchlist.
         */
        get: operations["BlockScoutWeb.API.V2.TransactionController.watchlist_transactions"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/transactions/{transaction_hash_param}/internal-transactions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List internal transactions triggered during a specific transaction
         * @description Retrieves internal transactions generated during the execution of a specific transaction. Useful for analyzing contract interactions and debugging failed transactions.
         */
        get: operations["BlockScoutWeb.API.V2.TransactionController.internal_transactions"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/proxy/account-abstraction/bundles": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List of recent bundles
         * @description Retrieves a list of recent bundles.
         */
        get: operations["BlockScoutWeb.API.V2.Proxy.AccountAbstractionController.bundles"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/config/backend": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get backend environment configuration
         * @description Returns non-secret backend environment variables in the snake case (e.g., chain_type).
         */
        get: operations["BlockScoutWeb.API.V2.ConfigController.backend"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/addresses/{address_hash_param}/logs/csv": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Export logs as CSV
         * @description Exports logs for a specific address as a CSV file.
         */
        get: operations["BlockScoutWeb.API.V2.CsvExportController.logs_csv"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/legacy/block/eth-block-number": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get the latest block number
         * @description Returns the latest block number as a hex-encoded string in a JSON-RPC 2.0 response.
         */
        get: operations["BlockScoutWeb.API.Legacy.BlockController.eth_block_number"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/withdrawals": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List validator withdrawal details on proof-of-stake networks
         * @description Retrieves a paginated list of withdrawals, typically for proof-of-stake networks supporting validator withdrawals.
         */
        get: operations["BlockScoutWeb.API.V2.WithdrawalController.withdrawals_list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/search": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Search for tokens, addresses, contracts, blocks, or transactions by identifier
         * @description Performs a unified search across multiple blockchain entity types including tokens, addresses, contracts, blocks, transactions and other resources.
         */
        get: operations["BlockScoutWeb.API.V2.SearchController.search (2)"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/addresses/{address_hash_param}/transactions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List transactions involving a specific address with to-from filtering
         * @description Retrieves transactions involving a specific address, with optional filtering for transactions sent from or to the address.
         */
        get: operations["BlockScoutWeb.API.V2.AddressController.transactions"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/transactions/{transaction_hash_param}/raw-trace": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get step-by-step execution trace for a specific transaction
         * @description Retrieves the raw execution trace for a transaction, showing the step-by-step execution path and all contract interactions.
         */
        get: operations["BlockScoutWeb.API.V2.TransactionController.raw_trace"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/addresses/{address_hash_param}/transactions/csv": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Export transactions as CSV
         * @description Exports transactions for a specific address as a CSV file.
         */
        get: operations["BlockScoutWeb.API.V2.CsvExportController.transactions_csv"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/csv-exports/{uuid_param}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get CSV export
         * @description Gets a CSV export by UUID
         */
        get: operations["BlockScoutWeb.API.V2.CsvExportController.get_csv_export"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/addresses/{address_hash_param}/nft/collections": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List NFTs owned by an address grouped by collection/project
         * @description Retrieves NFTs owned by a specific address, organized by collection. Useful for displaying an address's NFT portfolio grouped by project.
         */
        get: operations["BlockScoutWeb.API.V2.AddressController.nft_collections"];
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
        /**
         * NotImplementedResponse
         * @description Response returned when the feature is not implemented
         */
        NotImplementedResponse: {
            /**
             * @description Error message indicating the feature is not implemented
             * @example Feature not implemented
             */
            message?: string;
        };
        /**
         * Address
         * @description Address
         */
        Address: {
            /** @description ENS domain name associated with the address */
            ens_domain_name: string | null;
            hash: components["schemas"]["AddressHash"];
            /** @description Implementations linked with the contract */
            implementations: components["schemas"]["Implementation"][];
            /** @description Has address contract code? */
            is_contract: boolean | null;
            /** @description Has address scam badge? */
            is_scam: boolean;
            /** @description Has address associated source code? */
            is_verified: boolean | null;
            metadata: components["schemas"]["Metadata"] | null;
            /** @description Name associated with the address */
            name: string | null;
            /** @description Private tags associated with the address */
            private_tags?: components["schemas"]["Tag"][];
            proxy_type: components["schemas"]["ProxyType"];
            /** @description Public tags associated with the address */
            public_tags?: components["schemas"]["Tag"][];
            /**
             * @description Reputation of the address
             * @enum {string}
             */
            reputation: "ok" | "scam";
            /** @description Watchlist name associated with the address */
            watchlist_names?: components["schemas"]["WatchlistName"][];
        };
        /**
         * EthBlockNumberResult
         * @description Hex-encoded latest block number on the chain. Nullable in the schema for defensive reasons; always present in practice.
         */
        EthBlockNumberResult: string | null;
        /** NFTCollection */
        NFTCollection: {
            amount: components["schemas"]["IntegerStringNullable"];
            token: components["schemas"]["Token"];
            token_instances: components["schemas"]["TokenInstanceInList"][];
        };
        /**
         * ForbiddenResponse
         * @description Response returned when the user is forbidden to access the resource
         */
        ForbiddenResponse: {
            /**
             * @description Error message indicating the user is forbidden to access the resource
             * @example Unverified email
             */
            message?: string;
        };
        /** Log */
        Log: {
            address: components["schemas"]["Address"];
            block_hash: components["schemas"]["FullHash"];
            block_number: number;
            block_timestamp: components["schemas"]["TimestampNullable"];
            data: components["schemas"]["HexString"];
            decoded: components["schemas"]["DecodedLogInput"] | null;
            index: number;
            smart_contract: components["schemas"]["Address"] | null;
            topics: components["schemas"]["HexStringNullable"][];
            transaction_hash: components["schemas"]["FullHash"];
        };
        /**
         * WatchlistName
         * @description Watchlist name struct
         */
        WatchlistName: {
            display_name: string;
            label: string;
        };
        /** EmptyString */
        EmptyString: string;
        /**
         * AddressNullable
         * @description AddressNullable
         */
        AddressNullable: {
            /** @description ENS domain name associated with the address */
            ens_domain_name: string | null;
            hash: components["schemas"]["AddressHash"];
            /** @description Implementations linked with the contract */
            implementations: components["schemas"]["Implementation"][];
            /** @description Has address contract code? */
            is_contract: boolean | null;
            /** @description Has address scam badge? */
            is_scam: boolean;
            /** @description Has address associated source code? */
            is_verified: boolean | null;
            metadata: components["schemas"]["Metadata"] | null;
            /** @description Name associated with the address */
            name: string | null;
            /** @description Private tags associated with the address */
            private_tags?: components["schemas"]["Tag"][];
            proxy_type: components["schemas"]["ProxyType"];
            /** @description Public tags associated with the address */
            public_tags?: components["schemas"]["Tag"][];
            /**
             * @description Reputation of the address
             * @enum {string}
             */
            reputation: "ok" | "scam";
            /** @description Watchlist name associated with the address */
            watchlist_names?: components["schemas"]["WatchlistName"][];
        } | null;
        /** NullString */
        NullString: string;
        /**
         * Metadata
         * @description Metadata struct
         */
        Metadata: {
            /** @description Metadata tags linked with the address */
            tags: components["schemas"]["MetadataTag"][];
        };
        /**
         * AccountAbstractionStatus
         * @description Status struct.
         */
        AccountAbstractionStatus: {
            finished_past_indexing: boolean;
        } & {
            [key: string]: {
                enabled?: boolean;
                live?: boolean;
                past_db_logs_indexing_finished?: boolean;
                past_rpc_logs_indexing_finished?: boolean;
            };
        };
        /** LogItem */
        LogItem: {
            address: components["schemas"]["AddressHash"];
            /** @description Hex-encoded block number. */
            blockNumber: string;
            /** @description Hex-encoded event data payload (`0x`-prefixed, arbitrary length). */
            data: string;
            /** @description Hex-encoded gas price in wei. */
            gasPrice: string;
            /** @description Hex-encoded gas used by the transaction. */
            gasUsed: string;
            /** @description Hex-encoded position of the log within the block. */
            logIndex: string;
            /** @description Hex-encoded Unix timestamp in seconds of the block. */
            timeStamp: string;
            /** @description 32-byte indexed event topics. Always a 4-element array; unfilled slots are `null`. */
            topics: (string | null)[];
            transactionHash: components["schemas"]["FullHash"];
            /** @description Hex-encoded position of the transaction within the block. */
            transactionIndex: string;
        };
        /** TotalERC721 */
        TotalERC721: {
            token_id: components["schemas"]["IntegerStringNullable"];
            token_instance: components["schemas"]["TokenInstance"] | null;
        };
        /** TotalERC1155 */
        TotalERC1155: {
            decimals: components["schemas"]["IntegerStringNullable"];
            token_id: components["schemas"]["IntegerStringNullable"];
            token_instance: components["schemas"]["TokenInstance"] | null;
            value: components["schemas"]["IntegerStringNullable"];
        };
        /** SummaryJustRequestBody */
        SummaryJustRequestBody: {
            chain_id?: number | null;
            data: {
                decoded_input: Record<string, never> | null;
                from: components["schemas"]["Address"] | null;
                hash: string;
                internal_transactions: (components["schemas"]["InternalTransaction"] | null)[];
                method: string | null;
                raw_input: string;
                status: string;
                to: components["schemas"]["Address"] | null;
                token_transfers: (components["schemas"]["TokenTransfer"] | null)[];
                transaction_types: string[];
                type: number | null;
                value: string;
            };
            logs_data?: {
                items: (components["schemas"]["Log"] | null)[];
            };
        };
        /** AdvancedFilterResponse */
        AdvancedFilterResponse: {
            items: components["schemas"]["AdvancedFilterItem"][];
            /**
             * @example {
             *       "block_number": 23532302,
             *       "internal_transaction_index": null,
             *       "items_count": 50,
             *       "token_transfer_batch_index": null,
             *       "token_transfer_index": 0,
             *       "transaction_index": 1
             *     }
             */
            next_page_params: {
                [key: string]: unknown;
            } | null;
            search_params: components["schemas"]["AdvancedFilterSearchParams"];
        };
        /** HotContract */
        HotContract: {
            balance: components["schemas"]["IntegerStringNullable"];
            contract_address: components["schemas"]["Address"];
            total_gas_used: number;
            transactions_count: number;
        };
        /** IntegerStringOrEmptyOrNullLiteral */
        IntegerStringOrEmptyOrNullLiteral: string | ("" | "null");
        /**
         * BadRequestResponse
         * @description Response returned when the request is invalid
         */
        BadRequestResponse: {
            /**
             * @description Error message indicating the request is invalid
             * @example Invalid request
             */
            message?: string;
        };
        /** Withdrawal */
        Withdrawal: {
            amount: components["schemas"]["IntegerString"];
            block_number?: number;
            index: number;
            receiver?: components["schemas"]["Address"];
            timestamp?: components["schemas"]["Timestamp"];
            validator_index: number;
        };
        /**
         * TopAddress
         * @description Address holding native coin, with its balance and transactions count
         */
        TopAddress: {
            coin_balance: components["schemas"]["IntegerStringNullable"];
            /** @description ENS domain name associated with the address */
            ens_domain_name: string | null;
            hash: components["schemas"]["AddressHash"];
            /** @description Implementations linked with the contract */
            implementations: components["schemas"]["Implementation"][];
            /** @description Has address contract code? */
            is_contract: boolean | null;
            /** @description Has address scam badge? */
            is_scam: boolean;
            /** @description Has address associated source code? */
            is_verified: boolean | null;
            metadata: components["schemas"]["Metadata"] | null;
            /** @description Name associated with the address */
            name: string | null;
            /** @description Private tags associated with the address */
            private_tags?: components["schemas"]["Tag"][];
            proxy_type: components["schemas"]["ProxyType"];
            /** @description Public tags associated with the address */
            public_tags?: components["schemas"]["Tag"][];
            /**
             * @description Reputation of the address
             * @enum {string}
             */
            reputation: "ok" | "scam";
            transactions_count: (components["schemas"]["IntegerString"] | components["schemas"]["EmptyString"]) | null;
            /** @description Watchlist name associated with the address */
            watchlist_names?: components["schemas"]["WatchlistName"][];
        };
        /**
         * AddressTabsCounters
         * @description Counters for address tabs
         */
        AddressTabsCounters: {
            beacon_deposits_count?: number;
            celo_election_rewards_count?: number;
            internal_transactions_count?: number;
            logs_count?: number;
            token_balances_count?: number;
            token_transfers_count?: number;
            transactions_count?: number;
            validations_count?: number;
            withdrawals_count?: number;
        };
        /**
         * TokenHolderResponse
         * @description Token holder response
         * @example {
         *       "address": {
         *         "ens_domain_name": null,
         *         "hash": "0xF977814e90dA44bFA03b6295A0616a897441aceC",
         *         "implementations": [],
         *         "is_contract": false,
         *         "is_scam": false,
         *         "is_verified": false,
         *         "metadata": {
         *           "tags": [
         *             {
         *               "meta": {
         *                 "main_entity": "Binance",
         *                 "tooltipUrl": "https://www.binance.com/"
         *               },
         *               "name": "Binance: Hot Wallet 20",
         *               "ordinal": 10,
         *               "slug": "binance-hot-wallet-20",
         *               "tagType": "name"
         *             },
         *             {
         *               "meta": {
         *                 "tooltipUrl": "https://www.binance.com"
         *               },
         *               "name": "Binance 8",
         *               "ordinal": 10,
         *               "slug": "binance-8",
         *               "tagType": "name"
         *             },
         *             {
         *               "meta": {},
         *               "name": "HOT WALLET",
         *               "ordinal": 0,
         *               "slug": "hot-wallet",
         *               "tagType": "generic"
         *             },
         *             {
         *               "meta": {},
         *               "name": "Exchange",
         *               "ordinal": 0,
         *               "slug": "exchange",
         *               "tagType": "generic"
         *             },
         *             {
         *               "meta": {},
         *               "name": "Binance",
         *               "ordinal": 0,
         *               "slug": "binance",
         *               "tagType": "protocol"
         *             }
         *           ]
         *         },
         *         "name": null,
         *         "private_tags": [],
         *         "proxy_type": null,
         *         "public_tags": [],
         *         "reputation": "ok",
         *         "watchlist_names": []
         *       },
         *       "token_id": null,
         *       "value": "19474530513868000"
         *     }
         */
        TokenHolderResponse: {
            /**
             * Address
             * @description Address
             */
            address: {
                /** @description ENS domain name associated with the address */
                ens_domain_name: string | null;
                hash: components["schemas"]["AddressHash"];
                /** @description Implementations linked with the contract */
                implementations: components["schemas"]["Implementation"][];
                /** @description Has address contract code? */
                is_contract: boolean | null;
                /** @description Has address scam badge? */
                is_scam: boolean;
                /** @description Has address associated source code? */
                is_verified: boolean | null;
                metadata: components["schemas"]["Metadata"] | null;
                /** @description Name associated with the address */
                name: string | null;
                /** @description Private tags associated with the address */
                private_tags?: components["schemas"]["Tag"][];
                proxy_type: components["schemas"]["ProxyType"];
                /** @description Public tags associated with the address */
                public_tags?: components["schemas"]["Tag"][];
                /**
                 * @description Reputation of the address
                 * @enum {string}
                 */
                reputation: "ok" | "scam";
                /** @description Watchlist name associated with the address */
                watchlist_names?: components["schemas"]["WatchlistName"][];
            };
            token_id: components["schemas"]["IntegerStringNullable"];
            value: components["schemas"]["IntegerStringNullable"];
        };
        /**
         * AddressResponse
         * @description Address response
         */
        AddressResponse: {
            block_number_balance_updated_at: number | null;
            coin_balance: components["schemas"]["IntegerStringNullable"];
            /**
             * @description Creation status of the contract
             * @enum {string|null}
             */
            creation_status: "success" | "failed" | "selfdestructed" | null;
            creation_transaction_hash: components["schemas"]["FullHashNullable"];
            creator_address_hash: components["schemas"]["AddressHashNullable"];
            /** @description ENS domain name associated with the address */
            ens_domain_name: string | null;
            exchange_rate: components["schemas"]["FloatStringNullable"];
            has_beacon_chain_withdrawals: boolean;
            has_logs: boolean;
            has_token_transfers: boolean;
            has_tokens: boolean;
            has_validated_blocks: boolean;
            hash: components["schemas"]["AddressHash"];
            /** @description Implementations linked with the contract */
            implementations: components["schemas"]["Implementation"][];
            /** @description Has address contract code? */
            is_contract: boolean | null;
            /** @description Has address scam badge? */
            is_scam: boolean;
            /** @description Has address associated source code? */
            is_verified: boolean | null;
            metadata: components["schemas"]["Metadata"] | null;
            /** @description Name associated with the address */
            name: string | null;
            /** @description Private tags associated with the address */
            private_tags?: components["schemas"]["Tag"][];
            proxy_type: components["schemas"]["ProxyType"];
            /** @description Public tags associated with the address */
            public_tags?: components["schemas"]["Tag"][];
            /**
             * @description Reputation of the address
             * @enum {string}
             */
            reputation: "ok" | "scam";
            token: components["schemas"]["Token"] | null;
            watchlist_address_id: number | null;
            /** @description Watchlist name associated with the address */
            watchlist_names?: components["schemas"]["WatchlistName"][];
        };
        /** RawTrace */
        RawTrace: {
            action: {
                /** @enum {string} */
                callType?: "call" | "callcode" | "delegatecall" | "staticcall";
                from: components["schemas"]["AddressHash"];
                gas: components["schemas"]["HexString"];
                init?: components["schemas"]["HexString"];
                input: components["schemas"]["HexString"];
                to?: components["schemas"]["AddressHash"];
                value: components["schemas"]["HexString"];
            };
            result?: {
                gasUsed: components["schemas"]["HexString"];
                output: components["schemas"]["HexString"];
            };
            subtraces: number;
            traceAddress: number[];
            transactionHash?: components["schemas"]["FullHashNullable"];
            /** @enum {string} */
            type: "call" | "create" | "create2" | "reward" | "selfdestruct" | "stop" | "invalid";
        }[];
        /** DecodedLogInput */
        DecodedLogInput: {
            method_call: string | null;
            method_id: string | null;
            parameters: {
                indexed: boolean;
                name: string;
                type: string;
                value: Record<string, never> | (Record<string, never> | string[] | string)[] | string;
            }[];
        };
        /**
         * Account
         * @description Account struct.
         */
        Account: {
            address: components["schemas"]["Address"];
            creation_op_hash: components["schemas"]["FullHashNullable"];
            creation_timestamp: components["schemas"]["TimestampNullable"];
            creation_transaction_hash: components["schemas"]["FullHashNullable"];
            factory: components["schemas"]["AddressNullable"];
            total_ops: number;
        };
        /**
         * Language
         * @enum {string}
         */
        Language: "solidity" | "vyper" | "yul" | "geas";
        /** FheOperationsResponse */
        FheOperationsResponse: {
            items: components["schemas"]["FheOperation"][];
            /**
             * @description Maximum HCU depth across all operations in the transaction
             * @example 3
             */
            max_depth_hcu: number;
            /**
             * @description Total number of FHE operations in the transaction
             * @example 5
             */
            operation_count: number;
            /**
             * @description Total HCU (Homomorphic Compute Units) cost for all operations in the transaction
             * @example 500
             */
            total_hcu: number;
        };
        /**
         * Counters
         * @description Smart contracts counters
         */
        Counters: {
            new_smart_contracts_24h?: components["schemas"]["IntegerString"];
            new_verified_smart_contracts_24h?: components["schemas"]["IntegerString"];
            smart_contracts?: components["schemas"]["IntegerString"];
            verified_smart_contracts?: components["schemas"]["IntegerString"];
        };
        /** CoinBalance */
        CoinBalance: {
            block_number: number;
            block_timestamp: components["schemas"]["Timestamp"];
            delta: components["schemas"]["IntegerString"];
            transaction_hash: components["schemas"]["FullHashNullable"];
            value: components["schemas"]["IntegerString"];
        };
        /** FloatStringNullable */
        FloatStringNullable: string | null;
        /** Summary */
        Summary: {
            data: {
                summaries: {
                    summary_template: string;
                    summary_template_variables: {
                        [key: string]: {
                            type: string;
                            value: string | number | Record<string, never>;
                        };
                    };
                }[];
            };
            success: boolean;
        };
        /** TotalERC7984 */
        TotalERC7984: {
            decimals: components["schemas"]["IntegerStringNullable"];
            value: components["schemas"]["IntegerStringNullable"];
        };
        /**
         * URLNullable
         * Format: uri
         * @example https://example.com
         */
        URLNullable: string | null;
        /** FloatString */
        FloatString: string;
        /** FullHashNullable */
        FullHashNullable: string | null;
        /**
         * AdvancedFilterMethod
         * @description Contract method identified by its 4-byte selector and human-readable name.
         */
        AdvancedFilterMethod: {
            /**
             * @description 4-byte method selector prefixed with 0x (lowercase hex).
             * @example 0xa9059cbb
             */
            method_id: string;
            /**
             * @description Human-readable method name. Empty string if the name could not be resolved.
             * @example transfer
             */
            name: string;
        };
        /** Block */
        Block: {
            /** @description EIP-1559 base fee per gas, in wei. Null on blocks produced before EIP-1559 activation or on chains that do not implement EIP-1559. */
            base_fee_per_gas: components["schemas"]["IntegerStringNullable"];
            /** @description Sum of EIP-1559 base fees burned by transactions in this block, in wei. */
            burnt_fees: components["schemas"]["IntegerStringNullable"];
            /**
             * Format: float
             * @description Burned base fees as a percentage of total transaction fees in this block.
             */
            burnt_fees_percentage: number | null;
            /** @description Proof-of-work difficulty of this block. Zero on proof-of-stake chains. */
            difficulty: components["schemas"]["IntegerStringNullable"];
            gas_limit: components["schemas"]["IntegerString"];
            /**
             * Format: float
             * @description Percent above the EIP-1559 elasticity target (gas_used vs. gas_limit / elasticity_multiplier).
             */
            gas_target_percentage: number;
            gas_used: components["schemas"]["IntegerString"];
            /**
             * Format: float
             * @description Gas used in this block as a percentage of `gas_limit`.
             */
            gas_used_percentage: number;
            hash: components["schemas"]["FullHash"];
            /** @description Block number (zero-based index from genesis). */
            height: number;
            /** @description Number of internal transactions in this block; null when the count is unavailable. */
            internal_transactions_count: number | null;
            /** @description True when the block is scheduled for re-fetch; its fields may change once re-fetching completes. */
            is_pending_update: boolean | null;
            /** @description Address credited with the block — the miner on PoW chains, the fee recipient / proposer on PoS chains, and the sequencer on rollups. */
            miner: components["schemas"]["Address"];
            /** @description Proof-of-work nonce used to satisfy the difficulty target. Zero on proof-of-stake chains. */
            nonce: components["schemas"]["HexString"];
            parent_hash: components["schemas"]["FullHash"];
            /** @description Sum of validator tips (EIP-1559 priority fees) paid by transactions in this block, in wei. */
            priority_fee: components["schemas"]["IntegerStringNullable"];
            /** @description Block rewards grouped by recipient category. Each entry describes a reward paid for this block; the set of categories depends on the chain and block type. */
            rewards: {
                reward: components["schemas"]["IntegerString"];
                /**
                 * @description Reward category (machine-readable identifier).
                 * @enum {string}
                 */
                type: "emission_funds" | "uncle" | "validator";
            }[];
            /** @description Block size in bytes (length of the RLP-encoded block). */
            size: number | null;
            timestamp: components["schemas"]["Timestamp"];
            /** @description Cumulative chain difficulty through this block (sum of `difficulty` of this block and all ancestors). */
            total_difficulty: components["schemas"]["IntegerStringNullable"];
            /** @description Sum of transaction fees (gas price × gas used) paid by transactions in this block, in wei. */
            transaction_fees: components["schemas"]["IntegerString"];
            transactions_count: number;
            /**
             * @description Block classification: `block` = main-chain consensus block; `uncle` = ommer (valid but not in main chain); `reorg` = former main-chain block lost to reorganization.
             * @enum {string}
             */
            type: "block" | "uncle" | "reorg";
            /** @description Hashes of ommer (uncle) blocks referenced by this block. */
            uncles_hashes: {
                hash: components["schemas"]["FullHash"];
            }[];
            /** @description Number of withdrawals included in this block; null when the count is unavailable. */
            withdrawals_count: number | null;
        };
        /**
         * Implementation
         * @description Proxy smart contract implementation
         */
        Implementation: {
            address_hash: components["schemas"]["AddressHash"];
            name: string | null;
        };
        /** AddressHash */
        AddressHash: string;
        /** IntegerString */
        IntegerString: string;
        /**
         * Bundler
         * @description Bundler struct.
         */
        Bundler: {
            address: components["schemas"]["Address"];
            total_bundles: number;
            total_ops: number;
        };
        /**
         * Bundle
         * @description Bundle struct.
         */
        Bundle: {
            block_number: components["schemas"]["IntegerString"];
            bundle_index: number;
            bundler: components["schemas"]["Address"];
            timestamp: components["schemas"]["Timestamp"];
            total_ops: number;
            transaction_hash: components["schemas"]["FullHash"];
        };
        /** TokenInstance */
        TokenInstance: {
            animation_url: components["schemas"]["URLNullable"];
            external_app_url: components["schemas"]["URLNullable"];
            id: components["schemas"]["IntegerString"];
            image_url: components["schemas"]["URLNullable"];
            is_unique: boolean | null;
            /**
             * @description Mime type of the media in media_url
             * @example image/png
             */
            media_type: string | null;
            media_url: components["schemas"]["URLNullable"];
            /**
             * @example {
             *       "description": "Test",
             *       "image": "https://example.com/image.png",
             *       "name": "Test"
             *     }
             */
            metadata: {
                [key: string]: unknown;
            } | null;
            owner: components["schemas"]["Address"] | null;
            thumbnails: {
                /** Format: uri */
                "250x250"?: string;
                /** Format: uri */
                "500x500"?: string;
                /** Format: uri */
                "60x60"?: string;
                /** Format: uri */
                original: string;
            } | null;
            token: components["schemas"]["Token"] | null;
            token_type?: components["schemas"]["TokenType"] | null;
            value?: components["schemas"]["IntegerStringNullable"];
        };
        /**
         * SmartContractListItem
         * @description Smart contract list item
         */
        SmartContractListItem: {
            address: components["schemas"]["Address"];
            certified: boolean;
            coin_balance?: string | null;
            compiler_version: string | null;
            has_constructor_args: boolean | null;
            language: string | null;
            license_type: string | null;
            market_cap?: string | null;
            optimization_enabled: boolean | null;
            reputation: string | null;
            transactions_count?: number | null;
            /** Format: date-time */
            verified_at: string | null;
        };
        /** CoinBalanceByDay */
        CoinBalanceByDay: {
            /** Format: date */
            date: string;
            value: components["schemas"]["IntegerString"];
        };
        /** Counter */
        Counter: {
            withdrawals_count: components["schemas"]["IntegerString"];
            withdrawals_sum: components["schemas"]["IntegerString"];
        };
        /** IntegerStringNullable */
        IntegerStringNullable: string | null;
        /**
         * ProxyType
         * @enum {string|null}
         */
        ProxyType: "eip1167" | "eip1967" | "eip1822" | "eip1967_oz" | "eip1967_beacon" | "master_copy" | "basic_implementation" | "basic_get_implementation" | "comptroller" | "eip2535" | "clone_with_immutable_arguments" | "eip7702" | "resolved_delegate_proxy" | "erc7760" | "minimal_proxy" | null;
        /**
         * MethodNameNullable
         * @description Method name or hex method id
         * @example transfer
         */
        MethodNameNullable: string | null;
        /** Total */
        Total: {
            decimals: components["schemas"]["IntegerStringNullable"];
            value: components["schemas"]["IntegerStringNullable"];
        };
        /**
         * UserOperationInList
         * @description UserOperationInList struct.
         */
        UserOperationInList: {
            address: components["schemas"]["Address"];
            block_number: components["schemas"]["IntegerString"];
            entry_point: components["schemas"]["Address"];
            /** @enum {string} */
            entry_point_version: "v0.6" | "v0.7" | "v0.8" | "v0.9";
            fee: components["schemas"]["IntegerString"];
            hash: components["schemas"]["FullHash"];
            status: boolean;
            timestamp: components["schemas"]["TimestampNullable"];
            transaction_hash: components["schemas"]["FullHash"];
        };
        /**
         * UserOperation
         * @description UserOperation struct.
         */
        UserOperation: {
            aggregator_signature: components["schemas"]["HexStringNullable"];
            bundler: components["schemas"]["Address"];
            block_number: components["schemas"]["IntegerString"];
            entry_point: components["schemas"]["Address"];
            user_logs_count: number;
            paymaster: components["schemas"]["AddressNullable"];
            user_logs_start_index: number;
            nonce: components["schemas"]["FullHash"];
            timestamp: components["schemas"]["TimestampNullable"];
            consensus: boolean | null;
            call_gas_limit: components["schemas"]["IntegerString"];
            factory: components["schemas"]["AddressNullable"];
            gas_price: components["schemas"]["IntegerString"];
            verification_gas_limit: components["schemas"]["IntegerString"];
            sender: components["schemas"]["Address"];
            execute_call_data: components["schemas"]["HexStringNullable"];
            fee: components["schemas"]["IntegerString"];
            status: boolean;
            execute_target: components["schemas"]["AddressNullable"];
            gas_used: components["schemas"]["IntegerString"];
            signature: components["schemas"]["HexString"];
            /** @enum {string} */
            entry_point_version: "v0.6" | "v0.7" | "v0.8" | "v0.9";
            call_data: components["schemas"]["HexString"];
            aggregator: components["schemas"]["AddressHashNullable"];
            max_priority_fee_per_gas: components["schemas"]["IntegerString"];
            index: number;
            block_hash: components["schemas"]["FullHash"];
            /** @enum {string} */
            sponsor_type: "wallet_deposit" | "wallet_balance" | "paymaster_sponsor" | "paymaster_hybrid";
            revert_reason: components["schemas"]["HexStringNullable"];
            gas: components["schemas"]["IntegerString"];
            max_fee_per_gas: components["schemas"]["IntegerString"];
            hash: components["schemas"]["FullHash"];
            decoded_execute_call_data: components["schemas"]["DecodedInput"] | null;
            bundle_index: number;
            decoded_call_data: components["schemas"]["DecodedInput"] | null;
            pre_verification_gas: components["schemas"]["IntegerString"];
            /** @description Raw user operation data. */
            raw: {
                call_data: components["schemas"]["HexString"];
                call_gas_limit: components["schemas"]["IntegerString"];
                init_code: components["schemas"]["HexString"];
                max_fee_per_gas: components["schemas"]["IntegerString"];
                max_priority_fee_per_gas: components["schemas"]["IntegerString"];
                nonce: components["schemas"]["IntegerString"];
                paymaster_and_data: components["schemas"]["HexString"];
                pre_verification_gas: components["schemas"]["IntegerString"];
                sender: components["schemas"]["AddressHash"];
                signature: components["schemas"]["HexString"];
                verification_gas_limit: components["schemas"]["IntegerString"];
            } | {
                account_gas_limits: components["schemas"]["FullHash"];
                call_data: components["schemas"]["HexString"];
                gas_fees: components["schemas"]["FullHash"];
                init_code: components["schemas"]["HexString"];
                nonce: components["schemas"]["IntegerString"];
                paymaster_and_data: components["schemas"]["HexString"];
                pre_verification_gas: components["schemas"]["IntegerString"];
                sender: components["schemas"]["AddressHash"];
                signature: components["schemas"]["HexString"];
            };
            transaction_hash: components["schemas"]["FullHash"];
        };
        /**
         * SearchResult
         * @description Search results containing blocks, transactions, and addresses
         */
        SearchResult: {
            items?: Record<string, never>[];
            next_page_params?: {
                [key: string]: unknown;
            } | null;
        };
        /**
         * TokenCountersResponse
         * @description Token counters response
         * @example {
         *       "token_holders_count": "0",
         *       "transfers_count": "0"
         *     }
         */
        TokenCountersResponse: {
            token_holders_count: components["schemas"]["IntegerString"];
            transfers_count: components["schemas"]["IntegerString"];
        };
        /**
         * BlockResponse
         * @description Block response
         */
        BlockResponse: {
            /** @description EIP-1559 base fee per gas, in wei. Null on blocks produced before EIP-1559 activation or on chains that do not implement EIP-1559. */
            base_fee_per_gas: components["schemas"]["IntegerStringNullable"];
            /** @description Sum of EIP-1559 base fees burned by transactions in this block, in wei. */
            burnt_fees: components["schemas"]["IntegerStringNullable"];
            /**
             * Format: float
             * @description Burned base fees as a percentage of total transaction fees in this block.
             */
            burnt_fees_percentage: number | null;
            /** @description Proof-of-work difficulty of this block. Zero on proof-of-stake chains. */
            difficulty: components["schemas"]["IntegerStringNullable"];
            gas_limit: components["schemas"]["IntegerString"];
            /**
             * Format: float
             * @description Percent above the EIP-1559 elasticity target (gas_used vs. gas_limit / elasticity_multiplier).
             */
            gas_target_percentage: number;
            gas_used: components["schemas"]["IntegerString"];
            /**
             * Format: float
             * @description Gas used in this block as a percentage of `gas_limit`.
             */
            gas_used_percentage: number;
            hash: components["schemas"]["FullHash"];
            /** @description Block number (zero-based index from genesis). */
            height: number;
            /** @description Number of internal transactions in this block; null when the count is unavailable. */
            internal_transactions_count: number | null;
            /** @description True when the block is scheduled for re-fetch; its fields may change once re-fetching completes. */
            is_pending_update: boolean | null;
            /** @description Address credited with the block — the miner on PoW chains, the fee recipient / proposer on PoS chains, and the sequencer on rollups. */
            miner: components["schemas"]["Address"];
            /** @description Proof-of-work nonce used to satisfy the difficulty target. Zero on proof-of-stake chains. */
            nonce: components["schemas"]["HexString"];
            parent_hash: components["schemas"]["FullHash"];
            /** @description Sum of validator tips (EIP-1559 priority fees) paid by transactions in this block, in wei. */
            priority_fee: components["schemas"]["IntegerStringNullable"];
            /** @description Block rewards grouped by recipient category. Single-block variant: `type` is a human-readable label rather than a machine identifier. */
            rewards: {
                reward: components["schemas"]["IntegerString"];
                /** @description Human-readable reward category label (e.g. "Miner Reward", "Uncle Reward"). */
                type: string;
            }[];
            /** @description Block size in bytes (length of the RLP-encoded block). */
            size: number | null;
            timestamp: components["schemas"]["Timestamp"];
            /** @description Cumulative chain difficulty through this block (sum of `difficulty` of this block and all ancestors). */
            total_difficulty: components["schemas"]["IntegerStringNullable"];
            /** @description Sum of transaction fees (gas price × gas used) paid by transactions in this block, in wei. */
            transaction_fees: components["schemas"]["IntegerString"];
            transactions_count: number;
            /**
             * @description Block classification: `block` = main-chain consensus block; `uncle` = ommer (valid but not in main chain); `reorg` = former main-chain block lost to reorganization.
             * @enum {string}
             */
            type: "block" | "uncle" | "reorg";
            /** @description Hashes of ommer (uncle) blocks referenced by this block. */
            uncles_hashes: {
                hash: components["schemas"]["FullHash"];
            }[];
            /** @description Number of withdrawals included in this block; null when the count is unavailable. */
            withdrawals_count: number | null;
        };
        /** GetBlockNumberByTimeResult */
        GetBlockNumberByTimeResult: {
            /** @description Decimal-string block number. */
            blockNumber: components["schemas"]["IntegerString"];
        } | null;
        /**
         * AuditReport
         * @description Smart contract audit report item
         */
        AuditReport: {
            audit_company_name: string;
            /** Format: date */
            audit_publish_date: string;
            audit_report_url: string;
        };
        /** HexString */
        HexString: string;
        /** JsonErrorResponse */
        JsonErrorResponse: {
            errors: {
                /** @example null value where string expected */
                detail: string;
                source: {
                    /** @example /data/attributes/petName */
                    pointer: string;
                };
                /** @example Invalid value */
                title: string;
            }[];
        };
        /** AdvancedFilterCsvExportError */
        AdvancedFilterCsvExportError: {
            /** @description Human-readable error description. */
            error: string;
        };
        /**
         * MetadataTag
         * @description Metadata tag struct
         */
        MetadataTag: {
            meta: {
                [key: string]: unknown;
            } | null;
            name: string;
            ordinal: number;
            slug: string;
            /** @enum {string} */
            tagType: "name" | "generic" | "classifier" | "information" | "note" | "protocol";
        };
        /** TokenInstanceInList */
        TokenInstanceInList: {
            animation_url: components["schemas"]["URLNullable"];
            external_app_url: components["schemas"]["URLNullable"];
            id: components["schemas"]["IntegerString"];
            image_url: components["schemas"]["URLNullable"];
            is_unique: boolean | null;
            /**
             * @description Mime type of the media in media_url
             * @example image/png
             */
            media_type: string | null;
            media_url: components["schemas"]["URLNullable"];
            /**
             * @example {
             *       "description": "Test",
             *       "image": "https://example.com/image.png",
             *       "name": "Test"
             *     }
             */
            metadata: {
                [key: string]: unknown;
            } | null;
            owner: components["schemas"]["Address"] | null;
            thumbnails: {
                /** Format: uri */
                "250x250"?: string;
                /** Format: uri */
                "500x500"?: string;
                /** Format: uri */
                "60x60"?: string;
                /** Format: uri */
                original: string;
            } | null;
            token: components["schemas"]["Token"] | null;
            token_type: components["schemas"]["TokenType"];
            value: components["schemas"]["IntegerStringNullable"];
        };
        /** DecodedInput */
        DecodedInput: {
            method_call: string | null;
            method_id: string | null;
            parameters: {
                name?: string;
                type?: string;
                value?: Record<string, never> | (Record<string, never> | string[] | string)[] | string;
            }[];
        };
        /**
         * TokenType
         * @enum {string}
         */
        TokenType: "ERC-20" | "ERC-721" | "ERC-1155" | "ERC-404" | "ERC-7984";
        /** AddressHashNullable */
        AddressHashNullable: string | null;
        /**
         * Factory
         * @description Factory struct.
         */
        Factory: {
            address: components["schemas"]["Address"];
            total_accounts: number;
        };
        /** InternalTransaction */
        InternalTransaction: {
            block_number: number;
            created_contract: components["schemas"]["Address"] | null;
            error: string | null;
            from: components["schemas"]["Address"];
            gas_limit: components["schemas"]["IntegerStringNullable"];
            /** @description The index of this internal transaction inside the transaction. */
            index: number;
            success: boolean;
            timestamp: components["schemas"]["Timestamp"];
            to: components["schemas"]["Address"] | null;
            transaction_hash: components["schemas"]["FullHash"];
            /** @description The index of the parent transaction inside the block. */
            transaction_index: number;
            /** @description Type of the internal transaction (call, create, etc.) */
            type: string;
            value: components["schemas"]["IntegerString"];
        };
        /**
         * Tag
         * @description Address tag struct
         */
        Tag: {
            address_hash: components["schemas"]["AddressHash"];
            display_name: string;
            label: string;
        };
        /**
         * NotFoundResponse
         * @description Response returned when the requested resource is not found
         */
        NotFoundResponse: {
            /**
             * @description Error message indicating the requested resource was not found
             * @example Resource not found
             */
            message?: string;
        };
        /**
         * TimestampNullable
         * Format: date-time
         */
        TimestampNullable: string | null;
        /**
         * TokenResponse
         * @description Token response
         */
        TokenResponse: {
            address_hash: components["schemas"]["AddressHash"];
            /**
             * @description Type of bridge used for this bridged token
             * @enum {string|null}
             */
            bridge_type?: "omni" | "amb" | null;
            circulating_market_cap: components["schemas"]["FloatStringNullable"];
            circulating_supply: components["schemas"]["FloatStringNullable"];
            decimals: components["schemas"]["IntegerStringNullable"];
            exchange_rate: components["schemas"]["FloatStringNullable"];
            foreign_address?: string | null;
            holders_count: components["schemas"]["IntegerStringNullable"];
            icon_url: components["schemas"]["URLNullable"];
            name: string | null;
            origin_chain_id?: components["schemas"]["IntegerStringNullable"];
            /**
             * @description Reputation of the token
             * @enum {string|null}
             */
            reputation: "ok" | "scam" | null;
            symbol: string | null;
            total_supply: components["schemas"]["IntegerStringNullable"];
            type: components["schemas"]["TokenType"] | null;
            volume_24h: components["schemas"]["FloatStringNullable"];
        };
        /**
         * AdvancedFilterCsvExportAccepted
         * @description Body returned when an asynchronous CSV export job has been queued. Poll `/api/v2/csv-exports/{request_id}` with the returned `request_id` to check status.
         */
        AdvancedFilterCsvExportAccepted: {
            /**
             * Format: uuid
             * @description UUID of the queued export request.
             */
            request_id: string;
        };
        /** AdvancedFilterItem */
        AdvancedFilterItem: {
            /** @description Number of the block that contains the parent transaction. */
            block_number: number;
            /** @description Address of the contract deployed by this item. `null` unless the item is a contract creation. */
            created_contract: components["schemas"]["Address"] | null;
            /** @description Transaction fee paid by the sender, in the chain's base unit (e.g. wei). */
            fee: string;
            /** @description Sender address. `null` for contract-creation items. */
            from: components["schemas"]["Address"] | null;
            hash: components["schemas"]["FullHash"];
            /** @description Zero-based position of the internal transaction within its parent transaction. Populated only for internal-transaction items; `null` otherwise. */
            internal_transaction_index: number | null;
            method: components["schemas"]["MethodNameNullable"];
            /** @description Execution status of the parent transaction. One of `pending`, `awaiting_internal_transactions`, `success`, or a free-form error reason string when the transaction reverted (e.g. `Reverted`). */
            status: string;
            /**
             * Timestamp
             * Format: date-time
             * @description Block timestamp of the parent transaction.
             */
            timestamp: string;
            /** @description Recipient address. `null` for contract-creation items and some internal transactions. */
            to: components["schemas"]["Address"] | null;
            /** @description Token contract metadata. Populated only for token-transfer items; `null` otherwise. */
            token: components["schemas"]["Token"] | null;
            /** @description Zero-based position within an ERC-1155 batch token transfer. Populated only for items that belong to a batch; `null` otherwise. */
            token_transfer_batch_index: number | null;
            /** @description Zero-based position of the token transfer, unique per parent transaction. Populated only for token-transfer items; `null` otherwise. */
            token_transfer_index: number | null;
            /** @description Token transfer amount (or token id for NFTs). Populated only for token-transfer items; `null` otherwise. */
            total: (components["schemas"]["TotalERC721"] | components["schemas"]["TotalERC1155"] | components["schemas"]["TotalERC7984"] | components["schemas"]["Total"]) | null;
            /** @description Zero-based position of the parent transaction within its block. */
            transaction_index: number;
            /**
             * @description Kind of activity represented by the item. Values `coin_transfer`, `contract_interaction`, and `contract_creation` apply to top-level transactions and internal transactions; the `ERC-*` values apply to token transfers.
             * @enum {string}
             */
            type: "coin_transfer" | "contract_interaction" | "contract_creation" | "ERC-20" | "ERC-721" | "ERC-1155" | "ERC-404" | "ERC-7984";
            /** @description Native coin amount transferred, in the chain's base unit (e.g. wei). `null` for token-transfer items. */
            value: string | null;
        };
        /** StateChange */
        StateChange: {
            address: components["schemas"]["Address"];
            balance_after: components["schemas"]["IntegerStringNullable"];
            balance_before: components["schemas"]["IntegerStringNullable"];
            change: components["schemas"]["IntegerStringNullable"];
            is_miner: boolean;
            token: components["schemas"]["Token"] | null;
            token_id?: components["schemas"]["IntegerStringNullable"];
            /** @enum {string} */
            type: "token" | "coin";
        };
        /** AdvancedFilterSearchParams */
        AdvancedFilterSearchParams: {
            /** @description Map of 4-byte method selectors (keys) to resolved method names (values) for the `methods` filter. */
            methods: {
                [key: string]: string;
            };
            /** @description Map of token contract address hashes (keys) to `Token` objects for tokens referenced in the `token_contract_address_hashes_to_include`/`_exclude` filters. At most 20 entries are returned (combined across both lists). */
            tokens: {
                [key: string]: components["schemas"]["Token"];
            };
        };
        /**
         * BlockCountdown
         * @description Block countdown information showing estimated time until a target block is reached
         * @example {
         *       "countdown_block_number": 22600000,
         *       "current_block_number": 22566361,
         *       "estimated_time_in_seconds": "404868.0",
         *       "remaining_blocks_count": 33639
         *     }
         */
        BlockCountdown: {
            /**
             * @description The target block number for the countdown
             * @example 22600000
             */
            countdown_block_number: number;
            /**
             * @description The current highest block number in the blockchain
             * @example 22566361
             */
            current_block_number: number;
            /**
             * @description Estimated time in seconds until the target block is reached
             * @example 404868.0
             */
            estimated_time_in_seconds: string;
            /**
             * @description Number of blocks remaining until the target block is reached
             * @example 33639
             */
            remaining_blocks_count: number;
        };
        /**
         * AddressCounters
         * @description Address counters
         */
        AddressCounters: {
            gas_usage_count: components["schemas"]["IntegerString"];
            token_transfers_count: components["schemas"]["IntegerString"];
            transactions_count: components["schemas"]["IntegerString"];
            validations_count: components["schemas"]["IntegerString"];
        };
        /** TokenTransfer */
        TokenTransfer: {
            block_hash: components["schemas"]["FullHash"];
            block_number: number;
            from: components["schemas"]["Address"];
            log_index: number;
            method: components["schemas"]["MethodNameNullable"];
            timestamp: components["schemas"]["TimestampNullable"];
            to: components["schemas"]["Address"];
            token: components["schemas"]["Token"];
            token_type: components["schemas"]["TokenType"];
            total: (components["schemas"]["TotalERC721"] | components["schemas"]["TotalERC1155"] | components["schemas"]["TotalERC7984"] | components["schemas"]["Total"]) | null;
            transaction_hash: components["schemas"]["FullHash"];
            /** @enum {string} */
            type: "token_burning" | "token_minting" | "token_spawning" | "token_transfer";
        };
        /** TokenBalance */
        TokenBalance: {
            token: components["schemas"]["Token"] | null;
            token_id: components["schemas"]["IntegerStringNullable"];
            token_instance: components["schemas"]["TokenInstance"] | null;
            value: components["schemas"]["IntegerString"];
        };
        /**
         * SmartContract
         * @description Smart contract
         */
        SmartContract: {
            constructor_args?: string | null;
            is_partially_verified?: boolean | null;
            is_changed_bytecode?: boolean | null;
            abi?: Record<string, never>[] | null;
            conflicting_implementations: Record<string, never>[] | null;
            certified?: boolean;
            additional_sources?: {
                file_path?: string;
                source_code?: string;
            }[] | null;
            is_verified_via_sourcify?: boolean | null;
            can_be_visualized_via_sol2uml?: boolean | null;
            evm_version?: string | null;
            /** @enum {string|null} */
            language?: "solidity" | "vyper" | "yul" | "scilla" | "stylus_rust" | "geas" | null;
            is_verified_via_eth_bytecode_db?: boolean | null;
            coin_balance?: string | null;
            is_fully_verified?: boolean | null;
            license_type?: string | null;
            is_blueprint?: boolean | null;
            name?: string | null;
            creation_bytecode: string | null;
            external_libraries?: {
                address_hash?: components["schemas"]["AddressHash"];
                name?: string | null;
            }[] | null;
            market_cap?: string | null;
            proxy_type: string | null;
            implementations: {
                address_hash?: components["schemas"]["AddressHash"];
                name?: string | null;
            }[] | null;
            /** Format: date-time */
            verified_at?: string | null;
            is_verified_via_verifier_alliance?: boolean | null;
            compiler_version?: string | null;
            decoded_constructor_args?: (unknown[] | Record<string, never> | string)[][] | null;
            sourcify_repo_url?: string | null;
            optimization_runs?: number | null;
            compiler_settings?: Record<string, never> | null;
            verification_metadata?: Record<string, never> | null;
            is_verified?: boolean | null;
            reputation?: string | null;
            verified_twin_address_hash?: string | null;
            optimization_enabled?: boolean | null;
            deployed_bytecode: string | null;
            source_code?: string | null;
            transactions_count?: number | null;
            creation_status: string | null;
            file_path?: string | null;
            has_constructor_args?: boolean | null;
        };
        /** Fee */
        Fee: {
            /** @enum {string} */
            type: "maximum" | "actual";
            value: components["schemas"]["IntegerStringNullable"];
        };
        /** FullHash */
        FullHash: string;
        /**
         * StatsResponse
         * @description Stats response
         */
        StatsResponse: {
            /** Format: float */
            average_block_time?: number;
            coin_image?: string | null;
            coin_price?: components["schemas"]["FloatStringNullable"];
            /** Format: float */
            coin_price_change_percentage?: number | null;
            gas_price_updated_at?: components["schemas"]["TimestampNullable"];
            gas_prices?: Record<string, never> | null;
            gas_prices_update_in?: number | null;
            gas_used_today?: components["schemas"]["IntegerStringNullable"] | number;
            market_cap?: components["schemas"]["FloatString"];
            network_utilization_percentage?: number | null;
            secondary_coin_image?: string | null;
            secondary_coin_price?: components["schemas"]["FloatStringNullable"];
            static_gas_price?: components["schemas"]["IntegerStringNullable"];
            total_addresses?: components["schemas"]["IntegerString"];
            total_blocks?: components["schemas"]["IntegerString"];
            total_gas_used?: components["schemas"]["IntegerString"];
            total_transactions?: components["schemas"]["IntegerString"];
            transactions_today?: components["schemas"]["IntegerString"];
            tvl?: components["schemas"]["IntegerStringNullable"];
        };
        /**
         * Token
         * @description Token struct
         */
        Token: {
            address_hash: components["schemas"]["AddressHash"];
            /**
             * @description Type of bridge used for this bridged token
             * @enum {string|null}
             */
            bridge_type?: "omni" | "amb" | null;
            circulating_market_cap: components["schemas"]["FloatStringNullable"];
            circulating_supply: components["schemas"]["FloatStringNullable"];
            decimals: components["schemas"]["IntegerStringNullable"];
            exchange_rate: components["schemas"]["FloatStringNullable"];
            foreign_address?: string | null;
            holders_count: components["schemas"]["IntegerStringNullable"];
            icon_url: components["schemas"]["URLNullable"];
            name: string | null;
            origin_chain_id?: components["schemas"]["IntegerStringNullable"];
            /**
             * @description Reputation of the token
             * @enum {string|null}
             */
            reputation: "ok" | "scam" | null;
            symbol: string | null;
            total_supply: components["schemas"]["IntegerStringNullable"];
            type: components["schemas"]["TokenType"] | null;
            volume_24h: components["schemas"]["FloatStringNullable"];
        };
        /** FheOperation */
        FheOperation: {
            /** @example 12345678 */
            block_number: number;
            caller?: components["schemas"]["Address"] | null;
            /**
             * @example Uint8
             * @enum {string}
             */
            fhe_type: "Bool" | "Uint8" | "Uint16" | "Uint32" | "Uint64" | "Uint128" | "Uint160" | "Uint256" | "Bytes64" | "Bytes128" | "Bytes256";
            /** @example 100 */
            hcu_cost: number;
            /** @example 1 */
            hcu_depth: number;
            inputs: {
                control?: string | null;
                ct?: string | null;
                if_false?: string | null;
                if_true?: string | null;
                lhs?: string | null;
                plaintext?: number | null;
                rhs?: string | null;
            };
            /** @example false */
            is_scalar: boolean;
            log_index: number;
            /** @example FheAdd */
            operation: string;
            result: components["schemas"]["HexString"];
            /**
             * @example arithmetic
             * @enum {string}
             */
            type: "arithmetic" | "bitwise" | "comparison" | "unary" | "control" | "encryption" | "random";
        };
        /** Transaction */
        Transaction: {
            has_error_in_internal_transactions: boolean | null;
            block_number: number | null;
            exchange_rate: components["schemas"]["FloatStringNullable"];
            transaction_types: ("coin_transfer" | "contract_call" | "contract_creation" | "rootstock_bridge" | "rootstock_remasc" | "token_creation" | "token_transfer" | "blob_transaction" | "set_code_transaction")[];
            historic_exchange_rate: components["schemas"]["FloatStringNullable"];
            nonce: number;
            timestamp: components["schemas"]["TimestampNullable"];
            base_fee_per_gas: components["schemas"]["IntegerStringNullable"];
            token_transfers: components["schemas"]["TokenTransfer"][] | null;
            /** @description Number of FHE (Fully Homomorphic Encryption) operations in the transaction */
            fhe_operations_count: number;
            decoded_input: components["schemas"]["DecodedInput"] | null;
            gas_price: components["schemas"]["IntegerStringNullable"];
            gas_limit: components["schemas"]["IntegerString"];
            fee: components["schemas"]["Fee"];
            method: components["schemas"]["MethodNameNullable"];
            authorization_list: components["schemas"]["SignedAuthorization"][] | null;
            to: components["schemas"]["Address"];
            /** @enum {string|null} */
            status: "ok" | "error" | null;
            gas_used: components["schemas"]["IntegerStringNullable"];
            from: components["schemas"]["Address"];
            value: components["schemas"]["IntegerString"];
            created_contract: components["schemas"]["Address"] | null;
            /**
             * @description Transaction tag set in My Account
             * @example personal
             */
            transaction_tag: string | null;
            max_priority_fee_per_gas: components["schemas"]["IntegerStringNullable"];
            position: number | null;
            confirmations: number;
            token_transfers_overflow: boolean | null;
            type: number | null;
            transaction_burnt_fee: components["schemas"]["IntegerStringNullable"];
            /**
             * @description Array of time intervals in milliseconds. Can be empty [] (no info), single value [interval] (means that the transaction was confirmed within {interval} milliseconds), or two values [short_interval, long_interval] (means that the transaction's confirmation took from {short_interval} to {long_interval} milliseconds)
             * @example [
             *       1000,
             *       2000
             *     ]
             */
            confirmation_duration: number[];
            revert_reason: (components["schemas"]["DecodedInput"] | {
                raw: (components["schemas"]["HexString"] | string) | null;
            }) | null;
            max_fee_per_gas: components["schemas"]["IntegerStringNullable"];
            hash: components["schemas"]["FullHash"];
            result: ("pending" | "awaiting_internal_transactions" | "success" | "dropped/replaced") | string;
            is_pending_update: boolean | null;
            raw_input: components["schemas"]["HexString"];
            priority_fee: components["schemas"]["IntegerStringNullable"];
        };
        /** SignedAuthorization */
        SignedAuthorization: {
            address_hash: components["schemas"]["AddressHash"];
            authority: components["schemas"]["AddressHash"];
            chain_id: number;
            nonce: components["schemas"]["IntegerString"];
            r: components["schemas"]["IntegerString"];
            s: components["schemas"]["IntegerString"];
            /** @enum {string|null} */
            status: "ok" | "invalid_chain_id" | "invalid_signature" | "invalid_nonce" | null;
            v: number;
        };
        /** Response */
        Response: {
            /** Format: date-time */
            expires_at?: string | null;
            file_id?: string | null;
            /** @enum {string} */
            status?: "pending" | "completed" | "failed";
        };
        /**
         * TransactionResponse
         * @description Transaction response
         */
        TransactionResponse: {
            has_error_in_internal_transactions: boolean | null;
            block_number: number | null;
            exchange_rate: components["schemas"]["FloatStringNullable"];
            transaction_types: ("coin_transfer" | "contract_call" | "contract_creation" | "rootstock_bridge" | "rootstock_remasc" | "token_creation" | "token_transfer" | "blob_transaction" | "set_code_transaction")[];
            historic_exchange_rate: components["schemas"]["FloatStringNullable"];
            nonce: number;
            timestamp: components["schemas"]["TimestampNullable"];
            base_fee_per_gas: components["schemas"]["IntegerStringNullable"];
            token_transfers: components["schemas"]["TokenTransfer"][] | null;
            /** @description Number of FHE (Fully Homomorphic Encryption) operations in the transaction */
            fhe_operations_count: number;
            decoded_input: components["schemas"]["DecodedInput"] | null;
            gas_price: components["schemas"]["IntegerStringNullable"];
            gas_limit: components["schemas"]["IntegerString"];
            fee: components["schemas"]["Fee"];
            method: components["schemas"]["MethodNameNullable"];
            authorization_list: components["schemas"]["SignedAuthorization"][] | null;
            to: components["schemas"]["Address"];
            /** @enum {string|null} */
            status: "ok" | "error" | null;
            gas_used: components["schemas"]["IntegerStringNullable"];
            from: components["schemas"]["Address"];
            value: components["schemas"]["IntegerString"];
            created_contract: components["schemas"]["Address"] | null;
            /**
             * @description Transaction tag set in My Account
             * @example personal
             */
            transaction_tag: string | null;
            max_priority_fee_per_gas: components["schemas"]["IntegerStringNullable"];
            position: number | null;
            confirmations: number;
            token_transfers_overflow: boolean | null;
            type: number | null;
            transaction_burnt_fee: components["schemas"]["IntegerStringNullable"];
            /**
             * @description Array of time intervals in milliseconds. Can be empty [] (no info), single value [interval] (means that the transaction was confirmed within {interval} milliseconds), or two values [short_interval, long_interval] (means that the transaction's confirmation took from {short_interval} to {long_interval} milliseconds)
             * @example [
             *       1000,
             *       2000
             *     ]
             */
            confirmation_duration: number[];
            revert_reason: (components["schemas"]["DecodedInput"] | {
                raw: (components["schemas"]["HexString"] | string) | null;
            }) | null;
            max_fee_per_gas: components["schemas"]["IntegerStringNullable"];
            hash: components["schemas"]["FullHash"];
            result: ("pending" | "awaiting_internal_transactions" | "success" | "dropped/replaced") | string;
            is_pending_update: boolean | null;
            raw_input: components["schemas"]["HexString"];
            priority_fee: components["schemas"]["IntegerStringNullable"];
        };
        /**
         * Paymaster
         * @description Paymaster struct.
         */
        Paymaster: {
            address: components["schemas"]["Address"];
            total_ops: number;
        };
        /** HexStringNullable */
        HexStringNullable: string | null;
        /**
         * Timestamp
         * Format: date-time
         * @description Block timestamp of the parent transaction.
         */
        Timestamp: string;
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    "BlockScoutWeb.API.V2.BlockController.internal_transactions": {
        parameters: {
            query?: {
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
                /**
                 * @description Filter internal transactions by type:
                 *     * all - Show all internal transactions (default)
                 *     * call - Only show call internal transactions
                 *     * create - Only show create internal transactions
                 *     * create2 - Only show create2 internal transactions
                 *     * reward - Only show reward internal transactions
                 *     * selfdestruct - Only show selfdestruct internal transactions
                 *     * stop - Only show stop internal transactions
                 *     * invalid - Only show invalid internal transactions (Arbitrum only)
                 */
                internal_type?: "call" | "create" | "create2" | "reward" | "selfdestruct" | "stop";
                /**
                 * @description Filter internal transactions by call type:
                 *     * all - Show all internal transactions (default)
                 *     * call - Only show call internal transactions
                 *     * callcode - Only show callcode internal transactions
                 *     * delegatecall - Only show delegatecall internal transactions
                 *     * staticcall - Only show staticcall internal transactions
                 *     * invalid - Only show invalid internal transactions (Arbitrum only)
                 */
                call_type?: "call" | "callcode" | "delegatecall" | "staticcall";
                /** @description Transaction index for paging */
                transaction_index?: number;
                /** @description Item index for paging */
                index?: number;
                /** @description Number of items returned per page */
                items_count?: number;
            };
            header?: never;
            path: {
                /** @description Block hash or number in the path */
                block_hash_or_number_param: number | components["schemas"]["FullHash"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Internal transactions in the specified block. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        items: components["schemas"]["InternalTransaction"][];
                        /**
                         * @example {
                         *       "index": 8,
                         *       "items_count": 50,
                         *       "transaction_index": 3
                         *     }
                         */
                        next_page_params: {
                            [key: string]: unknown;
                        } | null;
                    };
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
            /** @description Unprocessable Entity */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JsonErrorResponse"];
                };
            };
        };
    };
    "BlockScoutWeb.API.V2.TokenController.token": {
        parameters: {
            query?: {
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
            };
            header?: never;
            path: {
                /** @description Address hash in the path */
                address_hash_param: components["schemas"]["AddressHash"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Detailed information about the specified token. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TokenResponse"];
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
            /** @description Unprocessable Entity */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JsonErrorResponse"];
                };
            };
        };
    };
    "BlockScoutWeb.API.V2.ConfigController.csv_export": {
        parameters: {
            query?: {
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description CSV export limits. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        async_enabled?: boolean;
                        limit?: number;
                    };
                };
            };
            /** @description Unprocessable Entity */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JsonErrorResponse"];
                };
            };
        };
    };
    "BlockScoutWeb.API.V2.TransactionController.transaction": {
        parameters: {
            query?: {
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
            };
            header?: never;
            path: {
                /** @description Transaction hash in the path */
                transaction_hash_param: components["schemas"]["FullHash"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Detailed information about the specified transaction. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TransactionResponse"];
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
            /** @description Unprocessable Entity */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JsonErrorResponse"];
                };
            };
        };
    };
    "BlockScoutWeb.API.V2.MainPageController.watchlist_transactions": {
        parameters: {
            query?: {
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description List of watchlist transactions */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TransactionResponse"][];
                };
            };
            /** @description Unprocessable Entity */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JsonErrorResponse"];
                };
            };
        };
    };
    "BlockScoutWeb.API.V2.CsvExportController.export_token_holders": {
        parameters: {
            query?: {
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
                /** @description Start of the time period (ISO 8601 format) in CSV export */
                from_period?: string | components["schemas"]["NullString"];
                /** @description End of the time period (ISO 8601 format) In CSV export */
                to_period?: string | components["schemas"]["NullString"];
                /** @description Filter type in CSV export */
                filter_type?: ("address" | null) | components["schemas"]["NullString"];
                /** @description Filter value in CSV export */
                filter_value?: ("to" | "from" | null) | components["schemas"]["NullString"];
            };
            header?: never;
            path: {
                /** @description Address hash in the path */
                address_hash_param: components["schemas"]["AddressHash"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description CSV file of token holders. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/csv": unknown;
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
            /** @description Unprocessable Entity */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JsonErrorResponse"];
                };
            };
        };
    };
    "BlockScoutWeb.API.V2.TokenController.tokens_list": {
        parameters: {
            query?: {
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
                /**
                 * @description Filter by token type. Comma-separated list of:
                 *     * ERC-20 - Fungible tokens
                 *     * ERC-721 - Non-fungible tokens
                 *     * ERC-1155 - Multi-token standard
                 *     * ERC-404 - Hybrid fungible/non-fungible tokens
                 *
                 *
                 *     Example: `ERC-20,ERC-721` to show both fungible and NFT transfers
                 */
                type?: components["schemas"]["EmptyString"] | string;
                /** @description Search query filter */
                q?: string | null;
                /** @description Limit result items in the response */
                limit?: number | null;
                /**
                 * @description Sort results by:
                 *     * fiat_value - Sort by fiat value
                 *     * holders_count - Sort by number of token holders
                 *     * circulating_market_cap - Sort by circulating market cap of the token
                 *     Should be used together with `order` parameter.
                 */
                sort?: "fiat_value" | "holders_count" | "circulating_market_cap";
                /**
                 * @description Sort order:
                 *     * asc - Ascending order
                 *     * desc - Descending order
                 *     Should be used together with `sort` parameter.
                 */
                order?: "asc" | "desc";
                /** @description Contract address hash for paging */
                contract_address_hash?: components["schemas"]["AddressHashNullable"];
                /** @description Fiat value for paging */
                fiat_value?: components["schemas"]["FloatString"] | components["schemas"]["EmptyString"] | components["schemas"]["NullString"];
                /** @description Number of holders returned per page */
                holders_count?: components["schemas"]["IntegerString"] | components["schemas"]["EmptyString"] | components["schemas"]["NullString"];
                /** @description Is name null for paging */
                is_name_null?: boolean;
                /** @description Market cap for paging */
                market_cap?: components["schemas"]["FloatString"] | components["schemas"]["EmptyString"] | components["schemas"]["NullString"];
                /** @description Name for paging */
                name?: string;
                /** @description Number of items returned per page */
                items_count?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description List of tokens matching the filter criteria, with pagination. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        items: components["schemas"]["Token"][];
                        /**
                         * @example {
                         *       "contract_address_hash": "0xbe9895146f7af43049ca1c1ae358b0541ea49704",
                         *       "fiat_value": "4724.32",
                         *       "holders_count": 59731,
                         *       "is_name_null": false,
                         *       "items_count": 50,
                         *       "market_cap": "570958125.135513",
                         *       "name": "Wrapped Staked ETH"
                         *     }
                         */
                        next_page_params: {
                            [key: string]: unknown;
                        } | null;
                    };
                };
            };
            /** @description Unprocessable Entity */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JsonErrorResponse"];
                };
            };
        };
    };
    "BlockScoutWeb.API.V2.TransactionController.fhe_operations": {
        parameters: {
            query?: {
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
            };
            header?: never;
            path: {
                /** @description Transaction hash in the path */
                transaction_hash_param: components["schemas"]["FullHash"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description FHE operations for the specified transaction with transaction-level metrics. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FheOperationsResponse"];
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
            /** @description Unprocessable Entity */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JsonErrorResponse"];
                };
            };
        };
    };
    "BlockScoutWeb.API.V2.CsvExportController.token_transfers_csv": {
        parameters: {
            query: {
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
                /** @description Start of the time period (ISO 8601 format) in CSV export */
                from_period: string | components["schemas"]["NullString"];
                /** @description End of the time period (ISO 8601 format) In CSV export */
                to_period: string | components["schemas"]["NullString"];
                /** @description Filter type in CSV export */
                filter_type?: ("address" | null) | components["schemas"]["NullString"];
                /** @description Filter value in CSV export */
                filter_value?: ("to" | "from" | null) | components["schemas"]["NullString"];
            };
            header?: never;
            path: {
                /** @description Address hash in the path */
                address_hash_param: components["schemas"]["AddressHash"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description CSV file of token transfers. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/csv": unknown;
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
            /** @description Unprocessable Entity */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JsonErrorResponse"];
                };
            };
        };
    };
    "BlockScoutWeb.API.V2.AddressController.token_balances": {
        parameters: {
            query?: {
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
            };
            header?: never;
            path: {
                /** @description Address hash in the path */
                address_hash_param: components["schemas"]["AddressHash"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description All token balances for the specified address. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TokenBalance"][];
                };
            };
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ForbiddenResponse"];
                };
            };
            /** @description Unprocessable Entity */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JsonErrorResponse"];
                };
            };
        };
    };
    "BlockScoutWeb.API.V2.BlockController.withdrawals": {
        parameters: {
            query?: {
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
                /** @description Item index for paging */
                index?: number;
                /** @description Number of items returned per page */
                items_count?: number;
            };
            header?: never;
            path: {
                /** @description Block hash or number in the path */
                block_hash_or_number_param: number | components["schemas"]["FullHash"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Withdrawals in the specified block, with pagination. Note that block_number and timestamp fields are not included in this endpoint. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        items: components["schemas"]["Withdrawal"][];
                        /**
                         * @example {
                         *       "index": 88192653,
                         *       "items_count": 50
                         *     }
                         */
                        next_page_params: {
                            [key: string]: unknown;
                        } | null;
                    };
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
            /** @description Unprocessable Entity */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JsonErrorResponse"];
                };
            };
        };
    };
    "BlockScoutWeb.API.V2.TokenController.holders": {
        parameters: {
            query?: {
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
                /** @description Address hash for paging */
                address_hash?: components["schemas"]["AddressHash"];
                /** @description Transaction value for paging */
                value?: components["schemas"]["IntegerString"] | components["schemas"]["EmptyString"] | components["schemas"]["NullString"];
                /** @description Number of items returned per page */
                items_count?: number;
            };
            header?: never;
            path: {
                /** @description Address hash in the path */
                address_hash_param: components["schemas"]["AddressHash"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Holders of the specified token, with pagination. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        items: components["schemas"]["TokenHolderResponse"][];
                        /**
                         * @example {
                         *       "address_hash": "0x48bb9b14483e43c7726df702b271d410e7460656",
                         *       "items_count": 50,
                         *       "value": "200000000000000"
                         *     }
                         */
                        next_page_params: {
                            [key: string]: unknown;
                        } | null;
                    };
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
            /** @description Unprocessable Entity */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JsonErrorResponse"];
                };
            };
        };
    };
    "BlockScoutWeb.API.V2.BlockController.block": {
        parameters: {
            query?: {
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
            };
            header?: never;
            path: {
                /** @description Block hash or number in the path */
                block_hash_or_number_param: number | components["schemas"]["FullHash"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Detailed information about the specified block. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BlockResponse"];
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
            /** @description Unprocessable Entity */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JsonErrorResponse"];
                };
            };
        };
    };
    "BlockScoutWeb.API.V2.AddressController.tokens": {
        parameters: {
            query?: {
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
                /**
                 * @description Filter by token type. Comma-separated list of:
                 *     * ERC-20 - Fungible tokens
                 *     * ERC-721 - Non-fungible tokens
                 *     * ERC-1155 - Multi-token standard
                 *     * ERC-404 - Hybrid fungible/non-fungible tokens
                 *
                 *
                 *     Example: `ERC-20,ERC-721` to show both fungible and NFT transfers
                 */
                type?: components["schemas"]["EmptyString"] | string;
                /** @description Fiat value for paging */
                fiat_value?: components["schemas"]["FloatString"] | components["schemas"]["EmptyString"] | components["schemas"]["NullString"];
                /** @description ID for paging */
                id?: number;
                /** @description Number of items returned per page */
                items_count?: number;
                /** @description Transaction value for paging */
                value?: components["schemas"]["IntegerString"] | components["schemas"]["EmptyString"] | components["schemas"]["NullString"];
            };
            header?: never;
            path: {
                /** @description Address hash in the path */
                address_hash_param: components["schemas"]["AddressHash"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Token balances for the specified address with pagination. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        items: components["schemas"]["TokenBalance"][];
                        /**
                         * @example {
                         *       "fiat_value": null,
                         *       "id": 12519063346,
                         *       "items_count": 50,
                         *       "value": "3750000000000000000000"
                         *     }
                         */
                        next_page_params: {
                            [key: string]: unknown;
                        } | null;
                    };
                };
            };
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ForbiddenResponse"];
                };
            };
            /** @description Unprocessable Entity */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JsonErrorResponse"];
                };
            };
        };
    };
    "BlockScoutWeb.API.V2.SmartContractController.audit_reports_list": {
        parameters: {
            query?: {
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
            };
            header?: never;
            path: {
                /** @description Address hash in the path */
                address_hash_param: components["schemas"]["AddressHash"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Audit reports. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        items: components["schemas"]["AuditReport"][];
                        next_page_params: {
                            [key: string]: unknown;
                        } | null;
                    };
                };
            };
            /** @description Unprocessable Entity */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JsonErrorResponse"];
                };
            };
        };
    };
    "BlockScoutWeb.API.V2.SmartContractController.audit_report_submission": {
        parameters: {
            query?: {
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
            };
            header?: never;
            path: {
                /** @description Address hash in the path */
                address_hash_param: components["schemas"]["AddressHash"];
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": {
                    audit_company_name: string;
                    /** Format: date */
                    audit_publish_date: string;
                    audit_report_url: string;
                    comment?: string | null;
                    is_project_owner: boolean;
                    project_name: string;
                    project_url: string;
                    submitter_email: string;
                    submitter_name: string;
                };
            };
        };
        responses: {
            /** @description Audit report submission is successful. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        message?: string;
                    };
                };
            };
            /** @description Unprocessable Entity */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JsonErrorResponse"];
                };
            };
        };
    };
    "BlockScoutWeb.API.V2.AddressController.token_transfers": {
        parameters: {
            query?: {
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
                /**
                 * @description Filter transactions by direction:
                 *     * to - Only show transactions sent to this address
                 *     * from - Only show transactions sent from this address
                 *     If omitted, all transactions involving the address are returned.
                 */
                filter?: "to" | "from";
                /**
                 * @description Filter by token type. Comma-separated list of:
                 *     * ERC-20 - Fungible tokens
                 *     * ERC-721 - Non-fungible tokens
                 *     * ERC-1155 - Multi-token standard
                 *     * ERC-404 - Hybrid fungible/non-fungible tokens
                 *
                 *
                 *     Example: `ERC-20,ERC-721` to show both fungible and NFT transfers
                 */
                type?: components["schemas"]["EmptyString"] | string;
                /** @description Filter token transfers by token contract address. */
                token?: components["schemas"]["AddressHash"];
                /** @description Block number for paging */
                block_number?: number;
                /** @description Item index for paging */
                index?: number;
                /** @description Number of items returned per page */
                items_count?: number;
                /** @description Batch log index for paging */
                batch_log_index?: number;
                /** @description Batch block hash for paging */
                batch_block_hash?: components["schemas"]["FullHash"];
                /** @description Batch transaction hash for paging */
                batch_transaction_hash?: components["schemas"]["FullHash"];
                /** @description Index in batch for paging */
                index_in_batch?: number;
            };
            header?: never;
            path: {
                /** @description Address hash in the path */
                address_hash_param: components["schemas"]["AddressHash"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description All token transfers for the specified address. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        items: components["schemas"]["TokenTransfer"][];
                        /**
                         * @example {
                         *       "block_number": 12345678,
                         *       "index": 0,
                         *       "items_count": 50
                         *     }
                         */
                        next_page_params: {
                            [key: string]: unknown;
                        } | null;
                    };
                };
            };
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ForbiddenResponse"];
                };
            };
            /** @description Unprocessable Entity */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JsonErrorResponse"];
                };
            };
        };
    };
    "BlockScoutWeb.API.V2.AddressController.nft_list": {
        parameters: {
            query?: {
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
                /**
                 * @description Filter by token type. Comma-separated list of:
                 *     * ERC-721 - Non-fungible tokens
                 *     * ERC-1155 - Multi-token standard
                 *     * ERC-404 - Hybrid fungible/non-fungible tokens
                 *
                 *     Example: `ERC-721,ERC-1155` to show both NFT and multi-token transfers
                 */
                type?: components["schemas"]["EmptyString"] | string;
                /** @description Number of items returned per page */
                items_count?: number;
                /** @description Token contract address hash for paging */
                token_contract_address_hash?: components["schemas"]["AddressHash"];
                /** @description Token ID for paging */
                token_id?: components["schemas"]["IntegerStringNullable"];
                /** @description Token type for paging */
                token_type?: components["schemas"]["TokenType"];
            };
            header?: never;
            path: {
                /** @description Address hash in the path */
                address_hash_param: components["schemas"]["AddressHash"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description NFTs owned by the specified address, with pagination. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        items: components["schemas"]["TokenInstanceInList"][];
                        /**
                         * @example {
                         *       "items_count": 50,
                         *       "token_contract_address_hash": "0x1ffe11b9fb7f6ff1b153ab8608cf403ecaf9d44a",
                         *       "token_id": "24950",
                         *       "token_type": "ERC-721"
                         *     }
                         */
                        next_page_params: {
                            [key: string]: unknown;
                        } | null;
                    };
                };
            };
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ForbiddenResponse"];
                };
            };
            /** @description Unprocessable Entity */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JsonErrorResponse"];
                };
            };
        };
    };
    "BlockScoutWeb.API.V2.StatsController.stats": {
        parameters: {
            query?: {
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Blockchain network statistics. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["StatsResponse"];
                };
            };
            /** @description Unprocessable Entity */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JsonErrorResponse"];
                };
            };
        };
    };
    "BlockScoutWeb.API.V2.TokenController.instances": {
        parameters: {
            query?: {
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
                /** @description Token holder address hash in the query */
                holder_address_hash?: components["schemas"]["AddressHash"];
                /** @description Token ID for paging */
                unique_token?: components["schemas"]["IntegerStringNullable"];
            };
            header?: never;
            path: {
                /** @description Address hash in the path */
                address_hash_param: components["schemas"]["AddressHash"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description NFT instances for the specified token contract, with pagination. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        items: components["schemas"]["TokenInstance"][];
                        /**
                         * @example {
                         *       "unique_token": 782098
                         *     }
                         */
                        next_page_params: {
                            [key: string]: unknown;
                        } | null;
                    };
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
            /** @description Unprocessable Entity */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JsonErrorResponse"];
                };
            };
        };
    };
    "BlockScoutWeb.API.V2.Proxy.AccountAbstractionController.summary": {
        parameters: {
            query?: {
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
                /** @description If true, returns only the request body in the summary endpoint */
                just_request_body?: boolean;
            };
            header?: never;
            path: {
                /** @description User operation hash in the path */
                operation_hash_param: components["schemas"]["FullHash"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Human-readable summary of the specified user operation. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Summary"] | components["schemas"]["SummaryJustRequestBody"];
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
            /** @description Unprocessable Entity */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JsonErrorResponse"];
                };
            };
            /** @description Not Implemented */
            501: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotImplementedResponse"];
                };
            };
        };
    };
    "BlockScoutWeb.API.V2.MainPageController.blocks": {
        parameters: {
            query?: {
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description List of recent blocks on the home page. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Block"][];
                };
            };
        };
    };
    "BlockScoutWeb.API.V2.StatsController.secondary_coin_market_chart": {
        parameters: {
            query?: {
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Secondary coin market chart data. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        chart_data?: Record<string, never>[];
                    };
                };
            };
            /** @description Unprocessable Entity */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JsonErrorResponse"];
                };
            };
        };
    };
    "BlockScoutWeb.API.V2.AddressController.blocks_validated": {
        parameters: {
            query?: {
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
                /** @description Block number for paging */
                block_number?: number;
                /** @description Number of items returned per page */
                items_count?: number;
            };
            header?: never;
            path: {
                /** @description Address hash in the path */
                address_hash_param: components["schemas"]["AddressHash"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Blocks validated by the specified address, with pagination. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        items: components["schemas"]["Block"][];
                        /**
                         * @example {
                         *       "block_number": 22546398,
                         *       "items_count": 50
                         *     }
                         */
                        next_page_params: {
                            [key: string]: unknown;
                        } | null;
                    };
                };
            };
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ForbiddenResponse"];
                };
            };
            /** @description Unprocessable Entity */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JsonErrorResponse"];
                };
            };
        };
    };
    "BlockScoutWeb.API.V2.AddressController.internal_transactions": {
        parameters: {
            query?: {
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
                /**
                 * @description Filter transactions by direction:
                 *     * to - Only show transactions sent to this address
                 *     * from - Only show transactions sent from this address
                 *     If omitted, all transactions involving the address are returned.
                 */
                filter?: "to" | "from";
                /** @description Block number for paging */
                block_number?: number;
                /** @description Item index for paging */
                index?: number;
                /** @description Number of items returned per page */
                items_count?: number;
                /** @description Transaction index for paging */
                transaction_index?: number;
            };
            header?: never;
            path: {
                /** @description Address hash in the path */
                address_hash_param: components["schemas"]["AddressHash"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description All internal transactions for the specified address. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        items: components["schemas"]["InternalTransaction"][];
                        /**
                         * @example {
                         *       "block_number": 22530770,
                         *       "index": 8,
                         *       "items_count": 50,
                         *       "transaction_index": 8
                         *     }
                         */
                        next_page_params: {
                            [key: string]: unknown;
                        } | null;
                    };
                };
            };
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ForbiddenResponse"];
                };
            };
            /** @description Unprocessable Entity */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JsonErrorResponse"];
                };
            };
        };
    };
    "BlockScoutWeb.API.V2.TransactionController.external_transactions": {
        parameters: {
            query?: {
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
            };
            header?: never;
            path: {
                /** @description Transaction hash in the path */
                transaction_hash_param: components["schemas"]["FullHash"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Linked external transactions. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": string[];
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
            /** @description Unprocessable Entity */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JsonErrorResponse"];
                };
            };
        };
    };
    "BlockScoutWeb.API.V2.TokenController.transfers": {
        parameters: {
            query?: {
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
                /** @description Item index for paging */
                index?: number;
                /** @description Block number for paging */
                block_number?: number;
                /** @description Batch log index for paging */
                batch_log_index?: number;
                /** @description Batch block hash for paging */
                batch_block_hash?: components["schemas"]["FullHash"];
                /** @description Batch transaction hash for paging */
                batch_transaction_hash?: components["schemas"]["FullHash"];
                /** @description Index in batch for paging */
                index_in_batch?: number;
            };
            header?: never;
            path: {
                /** @description Address hash in the path */
                address_hash_param: components["schemas"]["AddressHash"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Transfers of the specified token, with pagination. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        items: components["schemas"]["TokenTransfer"][];
                        /**
                         * @example {
                         *       "batch_block_hash": "0x789",
                         *       "batch_log_index": 3,
                         *       "batch_transaction_hash": "0xabc",
                         *       "block_number": 23484141,
                         *       "index": 259,
                         *       "index_in_batch": 2
                         *     }
                         */
                        next_page_params: {
                            [key: string]: unknown;
                        } | null;
                    };
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
            /** @description Unprocessable Entity */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JsonErrorResponse"];
                };
            };
        };
    };
    "BlockScoutWeb.API.V2.TransactionController.transactions": {
        parameters: {
            query?: {
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
                /**
                 * @description Filter transactions by status:
                 *     * pending - Transactions waiting to be mined/validated
                 *     * validated - Confirmed transactions included in blocks
                 *     If omitted, default value "validated" is used.
                 */
                filter?: "validated" | "pending";
                /**
                 * @description Filter by transaction type. Comma-separated list of:
                 *     * blob_transaction - Only show blob transactions
                 */
                type?: "blob_transaction";
                /** @description Block number for paging */
                block_number?: number;
                /** @description Item index for paging */
                index?: number;
                /** @description Number of items returned per page */
                items_count?: number;
                /** @description Transaction hash for paging */
                hash?: components["schemas"]["FullHash"];
                /** @description Inserted at timestamp for paging (ISO8601) */
                inserted_at?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description List of transactions with pagination information. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        items: components["schemas"]["TransactionResponse"][];
                        /**
                         * @example {
                         *       "block_number": 23532302,
                         *       "index": 375,
                         *       "items_count": 50
                         *     }
                         */
                        next_page_params: {
                            [key: string]: unknown;
                        } | null;
                    };
                };
            };
            /** @description Unprocessable Entity */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JsonErrorResponse"];
                };
            };
        };
    };
    "BlockScoutWeb.API.V2.TokenController.holders_by_instance": {
        parameters: {
            query?: {
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
                /** @description Address hash for paging */
                address_hash?: components["schemas"]["AddressHash"];
                /** @description Number of items returned per page */
                items_count?: number;
                /** @description Token ID for paging */
                token_id?: components["schemas"]["IntegerStringNullable"];
                /** @description Transaction value for paging */
                value?: components["schemas"]["IntegerString"] | components["schemas"]["EmptyString"] | components["schemas"]["NullString"];
            };
            header?: never;
            path: {
                /** @description Address hash in the path */
                address_hash_param: components["schemas"]["AddressHash"];
                /** @description Token ID for ERC-721/1155/404 tokens */
                token_id_param: components["schemas"]["IntegerStringNullable"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Current holders of the specified NFT instance, with pagination. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        items: components["schemas"]["TokenHolderResponse"][];
                        /**
                         * @example {
                         *       "address_hash": "0x1d2c163fbda9486c3a384b6fa5e34c96fe948e9a",
                         *       "items_count": 50,
                         *       "token_id": "0",
                         *       "value": "4217417051704137590935"
                         *     }
                         */
                        next_page_params: {
                            [key: string]: unknown;
                        } | null;
                    };
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
            /** @description Unprocessable Entity */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JsonErrorResponse"];
                };
            };
        };
    };
    "BlockScoutWeb.API.V2.StatsController.hot_smart_contracts": {
        parameters: {
            query: {
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
                /**
                 * @description Sort results by:
                 *     * transactions_count - Sort by number of transactions
                 *     * total_gas_used - Sort by total gas used
                 *     Should be used together with `order` parameter.
                 */
                sort?: "transactions_count" | "total_gas_used";
                /**
                 * @description Sort order:
                 *     * asc - Ascending order
                 *     * desc - Descending order
                 *     Should be used together with `sort` parameter.
                 */
                order?: "asc" | "desc";
                /** @description Time scale for hot contracts aggregation (5m=5 minutes, 1h=1 hour, 3h=3 hours, 1d=1 day, 7d=7 days, 30d=30 days) */
                scale: "5m" | "1h" | "3h" | "1d" | "7d" | "30d";
                /** @description Transactions count for paging */
                transactions_count?: number;
                /** @description Total gas used for paging */
                total_gas_used?: number;
                /** @description Contract address hash for paging */
                contract_address_hash?: components["schemas"]["AddressHash"];
                /** @description Number of items returned per page */
                items_count?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Paginated list of hot smart-contracts. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        items: components["schemas"]["HotContract"][];
                        /**
                         * @example {
                         *       "contract_address_hash": "0x01a2A10583675E0e5dF52DE1b62734109201477a",
                         *       "items_count": 50,
                         *       "total_gas_used": "100",
                         *       "transactions_count": 100
                         *     }
                         */
                        next_page_params: {
                            [key: string]: unknown;
                        } | null;
                    };
                };
            };
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ForbiddenResponse"];
                };
            };
            /** @description Unprocessable Entity */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JsonErrorResponse"];
                };
            };
        };
    };
    "BlockScoutWeb.API.V2.AdvancedFilterController.list_csv": {
        parameters: {
            query?: {
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
                /**
                 * @description Comma-separated list of transaction types to include. Allowed values: `COIN_TRANSFER`, `CONTRACT_INTERACTION`, `CONTRACT_CREATION`, `ERC-20`, `ERC-404`, `ERC-721`, `ERC-1155`, `ERC-7984` (plus `ZRC-2` on Zilliqa). Values are matched case-insensitively; unknown entries are silently dropped.
                 * @example COIN_TRANSFER,ERC-20
                 */
                transaction_types?: string | null;
                /**
                 * @description Comma-separated list of 4-byte contract method selectors (lowercase, `0x`-prefixed). At most 20 unique entries are honored; invalid entries are dropped.
                 * @example 0xa9059cbb,0x095ea7b3
                 */
                methods?: string | null;
                /**
                 * @description Inclusive lower bound on `timestamp` (ISO 8601).
                 * @example 2024-01-01T00:00:00Z
                 */
                age_from?: string | null;
                /**
                 * @description Inclusive upper bound on `timestamp` (ISO 8601).
                 * @example 2024-12-31T23:59:59Z
                 */
                age_to?: string | null;
                /**
                 * @description Comma-separated list of sender address hashes to include.
                 * @example 0x5a52e96bacdabb82fd05763e25335261b270efcb,0x00000000219ab540356cbb839cbe05303d7705fa
                 */
                from_address_hashes_to_include?: string | null;
                /**
                 * @description Comma-separated list of sender address hashes to exclude.
                 * @example 0x5a52e96bacdabb82fd05763e25335261b270efcb,0x00000000219ab540356cbb839cbe05303d7705fa
                 */
                from_address_hashes_to_exclude?: string | null;
                /**
                 * @description Comma-separated list of recipient address hashes to include.
                 * @example 0x5a52e96bacdabb82fd05763e25335261b270efcb,0x00000000219ab540356cbb839cbe05303d7705fa
                 */
                to_address_hashes_to_include?: string | null;
                /**
                 * @description Comma-separated list of recipient address hashes to exclude.
                 * @example 0x5a52e96bacdabb82fd05763e25335261b270efcb,0x00000000219ab540356cbb839cbe05303d7705fa
                 */
                to_address_hashes_to_exclude?: string | null;
                /**
                 * @description How to combine the `from_address_hashes_*` and `to_address_hashes_*` filters. Accepts `or` or `and` (case-insensitive). `or` (default) matches an item if either side matches; `and` requires both sides to match. Any other value is silently coerced to `nil` (no relation constraint).
                 * @example and
                 */
                address_relation?: string | null;
                /**
                 * @description Inclusive lower bound on the item's transferred amount (decimal string in the token's base units).
                 * @example 0
                 */
                amount_from?: string | null;
                /**
                 * @description Inclusive upper bound on the item's transferred amount (decimal string in the token's base units).
                 * @example 1000000
                 */
                amount_to?: string | null;
                /**
                 * @description Comma-separated list of token contract address hashes to include. Use the literal `native` to also include native coin transfers. Each list (include and exclude) is capped to 20 entries separately.
                 * @example native,0xdac17f958d2ee523a2206206994597c13d831ec7
                 */
                token_contract_address_hashes_to_include?: string | null;
                /**
                 * @description Comma-separated list of token contract address hashes to exclude. Use the literal `native` to also exclude native coin transfers. Each list (include and exclude) is capped to 20 entries separately.
                 * @example 0x0000000000000000000000000000000000000000
                 */
                token_contract_address_hashes_to_exclude?: string | null;
                /**
                 * @description Comma-separated list of human-readable method names corresponding to the `methods` selectors.
                 * @example transfer,approve
                 */
                methods_names?: string | null;
                /**
                 * @description Comma-separated list of token symbols to include.
                 * @example USDT,USDC
                 */
                token_contract_symbols_to_include?: string | null;
                /**
                 * @description Comma-separated list of token symbols to exclude.
                 * @example USDT,USDC
                 */
                token_contract_symbols_to_exclude?: string | null;
                /**
                 * @description Keyset cursor: block number of the last item from the previous page.
                 * @example 23532302
                 */
                block_number?: string;
                /**
                 * @description Keyset cursor: transaction index within the block of the last item from the previous page.
                 * @example 1
                 */
                transaction_index?: string;
                /** @description Keyset cursor: internal-transaction index of the last item from the previous page. Use an empty string or the literal `null` when the previous item was not an internal transaction. */
                internal_transaction_index?: components["schemas"]["IntegerStringOrEmptyOrNullLiteral"];
                /** @description Keyset cursor: token-transfer index of the last item from the previous page. Use an empty string or the literal `null` when the previous item was not a token transfer. */
                token_transfer_index?: components["schemas"]["IntegerStringOrEmptyOrNullLiteral"];
                /** @description Keyset cursor: index within an ERC-1155 batch token transfer. Use an empty string or the literal `null` when the previous item was not part of a batch. */
                token_transfer_batch_index?: components["schemas"]["IntegerStringOrEmptyOrNullLiteral"];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description CSV file (sync export). */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/csv": unknown;
                };
            };
            /** @description Async export queued; poll `/api/v2/csv-exports/{request_id}` with the returned `request_id`. */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdvancedFilterCsvExportAccepted"];
                };
            };
            /** @description Too many pending export requests for this client. */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdvancedFilterCsvExportError"];
                };
            };
            /** @description Unprocessable Entity */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JsonErrorResponse"];
                };
            };
            /** @description Failed to create CSV export request. */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdvancedFilterCsvExportError"];
                };
            };
        };
    };
    "BlockScoutWeb.API.V2.Proxy.AccountAbstractionController.status": {
        parameters: {
            query?: {
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Status */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AccountAbstractionStatus"];
                };
            };
            /** @description Not Implemented */
            501: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotImplementedResponse"];
                };
            };
        };
    };
    "BlockScoutWeb.API.V2.SmartContractController.smart_contract": {
        parameters: {
            query?: {
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
            };
            header?: never;
            path: {
                /** @description Address hash in the path */
                address_hash_param: components["schemas"]["AddressHash"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Detailed information about the specified verified smart contract. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SmartContract"];
                };
            };
        };
    };
    "BlockScoutWeb.API.V2.TokenController.transfers_by_instance": {
        parameters: {
            query?: {
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
                /** @description Item index for paging */
                index?: number;
                /** @description Block number for paging */
                block_number?: number;
                /** @description Token ID for paging */
                token_id?: components["schemas"]["IntegerStringNullable"];
            };
            header?: never;
            path: {
                /** @description Address hash in the path */
                address_hash_param: components["schemas"]["AddressHash"];
                /** @description Token ID for ERC-721/1155/404 tokens */
                token_id_param: components["schemas"]["IntegerStringNullable"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Transfer history for the specified NFT instance, with pagination. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        items: components["schemas"]["TokenTransfer"][];
                        /**
                         * @example {
                         *       "block_number": 23489243,
                         *       "index": 920,
                         *       "token_id": "4"
                         *     }
                         */
                        next_page_params: {
                            [key: string]: unknown;
                        } | null;
                    };
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
            /** @description Unprocessable Entity */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JsonErrorResponse"];
                };
            };
        };
    };
    "BlockScoutWeb.API.V2.ConfigController.backend_version": {
        parameters: {
            query?: {
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Backend version. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        backend_version?: string | null;
                    };
                };
            };
            /** @description Unprocessable Entity */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JsonErrorResponse"];
                };
            };
        };
    };
    "BlockScoutWeb.API.Legacy.LogsController.get_logs": {
        parameters: {
            query?: {
                /** @description Start block: integer or the sentinel "latest" */
                fromBlock?: components["schemas"]["IntegerString"] | "latest";
                /** @description End block: integer or the sentinel "latest" */
                toBlock?: components["schemas"]["IntegerString"] | "latest";
                address?: components["schemas"]["AddressHash"];
                topic0?: string;
                topic1?: string;
                topic2?: string;
                topic3?: string;
                topic0_1_opr?: "and" | "or";
                topic0_2_opr?: "and" | "or";
                topic0_3_opr?: "and" | "or";
                topic1_2_opr?: "and" | "or";
                topic1_3_opr?: "and" | "or";
                topic2_3_opr?: "and" | "or";
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Event logs */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @description Human-readable status string — `OK` on success, a descriptive error message otherwise. */
                        message: string;
                        /** @description Endpoint-specific payload on success; `null` on error. */
                        result: (components["schemas"]["LogItem"][] | null) | null;
                        /**
                         * @description `1` = OK, `0` = error, `2` = pending.
                         * @enum {string}
                         */
                        status: "0" | "1" | "2";
                    };
                };
            };
        };
    };
    "BlockScoutWeb.API.V2.TokenTransferController.token_transfers": {
        parameters: {
            query?: {
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
                /**
                 * @description Filter by token type. Comma-separated list of:
                 *     * ERC-20 - Fungible tokens
                 *     * ERC-721 - Non-fungible tokens
                 *     * ERC-1155 - Multi-token standard
                 *     * ERC-404 - Hybrid fungible/non-fungible tokens
                 *
                 *
                 *     Example: `ERC-20,ERC-721` to show both fungible and NFT transfers
                 */
                type?: components["schemas"]["EmptyString"] | string;
                /** @description Limit result items in the response */
                limit?: number | null;
                /** @description Item index for paging */
                index?: number;
                /** @description Block number for paging */
                block_number?: number;
                /** @description Batch log index for paging */
                batch_log_index?: number;
                /** @description Batch block hash for paging */
                batch_block_hash?: components["schemas"]["FullHash"];
                /** @description Batch transaction hash for paging */
                batch_transaction_hash?: components["schemas"]["FullHash"];
                /** @description Index in batch for paging */
                index_in_batch?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description List of token transfers with pagination information. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        items: components["schemas"]["TokenTransfer"][];
                        /**
                         * @example {
                         *       "block_number": 22133247,
                         *       "index": 50
                         *     }
                         */
                        next_page_params: {
                            [key: string]: unknown;
                        } | null;
                    };
                };
            };
            /** @description Unprocessable Entity */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JsonErrorResponse"];
                };
            };
        };
    };
    "BlockScoutWeb.API.V2.TransactionController.token_transfers": {
        parameters: {
            query?: {
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
                /**
                 * @description Filter by token type. Comma-separated list of:
                 *     * ERC-20 - Fungible tokens
                 *     * ERC-721 - Non-fungible tokens
                 *     * ERC-1155 - Multi-token standard
                 *     * ERC-404 - Hybrid fungible/non-fungible tokens
                 *
                 *
                 *     Example: `ERC-20,ERC-721` to show both fungible and NFT transfers
                 */
                type?: components["schemas"]["EmptyString"] | string;
                /** @description Item index for paging */
                index?: number;
                /** @description Block number for paging */
                block_number?: number;
                /** @description Batch log index for paging */
                batch_log_index?: number;
                /** @description Batch block hash for paging */
                batch_block_hash?: components["schemas"]["FullHash"];
                /** @description Batch transaction hash for paging */
                batch_transaction_hash?: components["schemas"]["FullHash"];
                /** @description Index in batch for paging */
                index_in_batch?: number;
            };
            header?: never;
            path: {
                /** @description Transaction hash in the path */
                transaction_hash_param: components["schemas"]["FullHash"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Token transfers within the specified transaction, with pagination. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        items: components["schemas"]["TokenTransfer"][];
                        /**
                         * @example {
                         *       "block_number": 21307214,
                         *       "index": 442
                         *     }
                         */
                        next_page_params: {
                            [key: string]: unknown;
                        } | null;
                    };
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
            /** @description Unprocessable Entity */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JsonErrorResponse"];
                };
            };
        };
    };
    "BlockScoutWeb.API.V2.StatsController.market_chart": {
        parameters: {
            query?: {
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Time series data for market charts and available token supply. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        available_supply?: components["schemas"]["FloatString"] | number;
                        chart_data?: Record<string, never>[];
                    };
                };
            };
            /** @description Unprocessable Entity */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JsonErrorResponse"];
                };
            };
        };
    };
    "BlockScoutWeb.API.V2.SearchController.quick_search": {
        parameters: {
            query?: {
                /** @description Search query filter */
                q?: string | null;
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Quick search results. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": Record<string, never>[];
                };
            };
            /** @description Unprocessable Entity */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JsonErrorResponse"];
                };
            };
        };
    };
    "BlockScoutWeb.API.V2.Proxy.AccountAbstractionController.bundler": {
        parameters: {
            query?: {
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
            };
            header?: never;
            path: {
                /** @description Address hash in the path */
                address_hash_param: components["schemas"]["AddressHash"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Bundler */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Bundler"];
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
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotFoundResponse"];
                };
            };
            /** @description Not Implemented */
            501: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotImplementedResponse"];
                };
            };
        };
    };
    "BlockScoutWeb.API.V2.MainPageController.transactions": {
        parameters: {
            query?: {
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description List of recent transactions on the home page. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TransactionResponse"][];
                };
            };
            /** @description Unprocessable Entity */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JsonErrorResponse"];
                };
            };
        };
    };
    "BlockScoutWeb.API.V2.AddressController.counters": {
        parameters: {
            query?: {
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
            };
            header?: never;
            path: {
                /** @description Address hash in the path */
                address_hash_param: components["schemas"]["AddressHash"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Count statistics for the specified address. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AddressCounters"];
                };
            };
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ForbiddenResponse"];
                };
            };
            /** @description Unprocessable Entity */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JsonErrorResponse"];
                };
            };
        };
    };
    "BlockScoutWeb.API.V2.TokenController.counters": {
        parameters: {
            query?: {
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
            };
            header?: never;
            path: {
                /** @description Address hash in the path */
                address_hash_param: components["schemas"]["AddressHash"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Count statistics for the specified token. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TokenCountersResponse"];
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
            /** @description Unprocessable Entity */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JsonErrorResponse"];
                };
            };
        };
    };
    "BlockScoutWeb.API.V2.ConfigController.indexer": {
        parameters: {
            query?: {
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Indexer configuration. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        block_reward_fetcher_enabled?: boolean;
                        indexer_enabled?: boolean;
                        internal_transactions_fetcher_enabled?: boolean;
                        pending_transactions_fetcher_enabled?: boolean;
                        token_instance_retry_fetcher_enabled?: boolean;
                        token_instance_sanitize_fetcher_enabled?: boolean;
                    };
                };
            };
            /** @description Unprocessable Entity */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JsonErrorResponse"];
                };
            };
        };
    };
    "BlockScoutWeb.API.V2.ConfigController.languages_list": {
        parameters: {
            query?: {
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Smart contract languages. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        languages?: components["schemas"]["Language"][];
                    };
                };
            };
            /** @description Unprocessable Entity */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JsonErrorResponse"];
                };
            };
        };
    };
    "BlockScoutWeb.API.V2.AdvancedFilterController.list": {
        parameters: {
            query?: {
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
                /**
                 * @description Comma-separated list of transaction types to include. Allowed values: `COIN_TRANSFER`, `CONTRACT_INTERACTION`, `CONTRACT_CREATION`, `ERC-20`, `ERC-404`, `ERC-721`, `ERC-1155`, `ERC-7984` (plus `ZRC-2` on Zilliqa). Values are matched case-insensitively; unknown entries are silently dropped.
                 * @example COIN_TRANSFER,ERC-20
                 */
                transaction_types?: string | null;
                /**
                 * @description Comma-separated list of 4-byte contract method selectors (lowercase, `0x`-prefixed). At most 20 unique entries are honored; invalid entries are dropped.
                 * @example 0xa9059cbb,0x095ea7b3
                 */
                methods?: string | null;
                /**
                 * @description Inclusive lower bound on `timestamp` (ISO 8601).
                 * @example 2024-01-01T00:00:00Z
                 */
                age_from?: string | null;
                /**
                 * @description Inclusive upper bound on `timestamp` (ISO 8601).
                 * @example 2024-12-31T23:59:59Z
                 */
                age_to?: string | null;
                /**
                 * @description Comma-separated list of sender address hashes to include.
                 * @example 0x5a52e96bacdabb82fd05763e25335261b270efcb,0x00000000219ab540356cbb839cbe05303d7705fa
                 */
                from_address_hashes_to_include?: string | null;
                /**
                 * @description Comma-separated list of sender address hashes to exclude.
                 * @example 0x5a52e96bacdabb82fd05763e25335261b270efcb,0x00000000219ab540356cbb839cbe05303d7705fa
                 */
                from_address_hashes_to_exclude?: string | null;
                /**
                 * @description Comma-separated list of recipient address hashes to include.
                 * @example 0x5a52e96bacdabb82fd05763e25335261b270efcb,0x00000000219ab540356cbb839cbe05303d7705fa
                 */
                to_address_hashes_to_include?: string | null;
                /**
                 * @description Comma-separated list of recipient address hashes to exclude.
                 * @example 0x5a52e96bacdabb82fd05763e25335261b270efcb,0x00000000219ab540356cbb839cbe05303d7705fa
                 */
                to_address_hashes_to_exclude?: string | null;
                /**
                 * @description How to combine the `from_address_hashes_*` and `to_address_hashes_*` filters. Accepts `or` or `and` (case-insensitive). `or` (default) matches an item if either side matches; `and` requires both sides to match. Any other value is silently coerced to `nil` (no relation constraint).
                 * @example and
                 */
                address_relation?: string | null;
                /**
                 * @description Inclusive lower bound on the item's transferred amount (decimal string in the token's base units).
                 * @example 0
                 */
                amount_from?: string | null;
                /**
                 * @description Inclusive upper bound on the item's transferred amount (decimal string in the token's base units).
                 * @example 1000000
                 */
                amount_to?: string | null;
                /**
                 * @description Comma-separated list of token contract address hashes to include. Use the literal `native` to also include native coin transfers. Each list (include and exclude) is capped to 20 entries separately.
                 * @example native,0xdac17f958d2ee523a2206206994597c13d831ec7
                 */
                token_contract_address_hashes_to_include?: string | null;
                /**
                 * @description Comma-separated list of token contract address hashes to exclude. Use the literal `native` to also exclude native coin transfers. Each list (include and exclude) is capped to 20 entries separately.
                 * @example 0x0000000000000000000000000000000000000000
                 */
                token_contract_address_hashes_to_exclude?: string | null;
                /**
                 * @description Comma-separated list of human-readable method names corresponding to the `methods` selectors.
                 * @example transfer,approve
                 */
                methods_names?: string | null;
                /**
                 * @description Comma-separated list of token symbols to include.
                 * @example USDT,USDC
                 */
                token_contract_symbols_to_include?: string | null;
                /**
                 * @description Comma-separated list of token symbols to exclude.
                 * @example USDT,USDC
                 */
                token_contract_symbols_to_exclude?: string | null;
                /**
                 * @description Keyset cursor: block number of the last item from the previous page.
                 * @example 23532302
                 */
                block_number?: string;
                /**
                 * @description Keyset cursor: transaction index within the block of the last item from the previous page.
                 * @example 1
                 */
                transaction_index?: string;
                /** @description Keyset cursor: internal-transaction index of the last item from the previous page. Use an empty string or the literal `null` when the previous item was not an internal transaction. */
                internal_transaction_index?: components["schemas"]["IntegerStringOrEmptyOrNullLiteral"];
                /** @description Keyset cursor: token-transfer index of the last item from the previous page. Use an empty string or the literal `null` when the previous item was not a token transfer. */
                token_transfer_index?: components["schemas"]["IntegerStringOrEmptyOrNullLiteral"];
                /** @description Keyset cursor: index within an ERC-1155 batch token transfer. Use an empty string or the literal `null` when the previous item was not part of a batch. */
                token_transfer_batch_index?: components["schemas"]["IntegerStringOrEmptyOrNullLiteral"];
                /** @description Cumulative number of items already returned across previous pages. */
                items_count?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description List of matching items with pagination information and resolved search params. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdvancedFilterResponse"];
                };
            };
            /** @description Unprocessable Entity */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JsonErrorResponse"];
                };
            };
        };
    };
    "BlockScoutWeb.API.V2.TokenController.instance": {
        parameters: {
            query?: {
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
            };
            header?: never;
            path: {
                /** @description Address hash in the path */
                address_hash_param: components["schemas"]["AddressHash"];
                /** @description Token ID for ERC-721/1155/404 tokens */
                token_id_param: components["schemas"]["IntegerStringNullable"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Detailed information about the specified NFT instance. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TokenInstance"];
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
            /** @description Unprocessable Entity */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JsonErrorResponse"];
                };
            };
        };
    };
    "BlockScoutWeb.API.V2.StatsController.transactions_chart": {
        parameters: {
            query?: {
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Time series data for transaction count charts. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        chart_data?: Record<string, never>[];
                    };
                };
            };
            /** @description Unprocessable Entity */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JsonErrorResponse"];
                };
            };
        };
    };
    "BlockScoutWeb.API.V2.AddressController.tabs_counters": {
        parameters: {
            query?: {
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
            };
            header?: never;
            path: {
                /** @description Address hash in the path */
                address_hash_param: components["schemas"]["AddressHash"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Counters for address tabs. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AddressTabsCounters"];
                };
            };
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ForbiddenResponse"];
                };
            };
            /** @description Unprocessable Entity */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JsonErrorResponse"];
                };
            };
        };
    };
    "BlockScoutWeb.API.V2.SmartContractController.smart_contracts_list": {
        parameters: {
            query?: {
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
                /**
                 * @description Sort results by:
                 *     * balance - Sort by account balance
                 *     * transactions_count - Sort by number of transactions
                 *     Should be used together with `order` parameter.
                 */
                sort?: "balance" | "transactions_count";
                /**
                 * @description Sort order:
                 *     * asc - Ascending order
                 *     * desc - Descending order
                 *     Should be used together with `sort` parameter.
                 */
                order?: "asc" | "desc";
                /** @description Search query filter */
                q?: string | null;
                /** @description Filter to apply */
                filter?: components["schemas"]["Language"];
                /** @description Smart-contract ID for paging */
                smart_contract_id?: number;
                /** @description Coin balance for paging */
                coin_balance?: number | components["schemas"]["EmptyString"] | components["schemas"]["NullString"];
                /** @description Address hash for paging */
                hash?: components["schemas"]["AddressHash"];
                /** @description Transactions count for paging */
                transactions_count?: number | components["schemas"]["EmptyString"] | components["schemas"]["NullString"];
                /** @description Number of items returned per page */
                items_count?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description List of verified smart contracts matching the filter criteria, with pagination. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        items: components["schemas"]["SmartContractListItem"][];
                        /**
                         * @example {
                         *       "items_count": 50,
                         *       "smart_contract_id": 1947801
                         *     }
                         */
                        next_page_params: {
                            [key: string]: unknown;
                        } | null;
                    };
                };
            };
            /** @description Unprocessable Entity */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JsonErrorResponse"];
                };
            };
        };
    };
    "BlockScoutWeb.API.V2.AddressController.coin_balance_history": {
        parameters: {
            query?: {
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
                /** @description Block number for paging */
                block_number?: number;
                /** @description Number of items returned per page */
                items_count?: number;
            };
            header?: never;
            path: {
                /** @description Address hash in the path */
                address_hash_param: components["schemas"]["AddressHash"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Historical coin balance changes for the specified address, with pagination. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        items: components["schemas"]["CoinBalance"][];
                        /**
                         * @example {
                         *       "block_number": 22546398,
                         *       "items_count": 50
                         *     }
                         */
                        next_page_params: {
                            [key: string]: unknown;
                        } | null;
                    };
                };
            };
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ForbiddenResponse"];
                };
            };
            /** @description Unprocessable Entity */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JsonErrorResponse"];
                };
            };
        };
    };
    "BlockScoutWeb.API.V2.TokenController.trigger_nft_collection_metadata_refetch": {
        parameters: {
            query?: {
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
                /** @description API key required for sensitive endpoints */
                api_key?: string;
            };
            header?: {
                /** @description API key required for sensitive endpoints */
                "x-api-key"?: string;
            };
            path: {
                /** @description Address hash in the path */
                address_hash_param: components["schemas"]["AddressHash"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description NFT collection metadata refetch triggered. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        message?: string;
                    };
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
            /** @description Unprocessable Entity */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JsonErrorResponse"];
                };
            };
        };
    };
    "BlockScoutWeb.API.V2.Proxy.AccountAbstractionController.bundlers": {
        parameters: {
            query?: {
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
                /** @description Number of items returned per page */
                page_size?: number;
                /** @description Page token for paging */
                page_token?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description List of bundlers with pagination. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        items: components["schemas"]["Bundler"][];
                        /**
                         * @example {
                         *       "page_size": 50,
                         *       "page_token": "5,0x9B67A24A474e9EC7372c23B023f36ab28831e4C4"
                         *     }
                         */
                        next_page_params: {
                            [key: string]: unknown;
                        } | null;
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
            /** @description Not Implemented */
            501: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotImplementedResponse"];
                };
            };
        };
    };
    "BlockScoutWeb.API.V2.TransactionController.state_changes": {
        parameters: {
            query?: {
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
                /** @description State changes for paging */
                state_changes?: string | null;
                /** @description Cumulative number of items to skip for keyset-based pagination of state changes */
                items_count?: number;
            };
            header?: never;
            path: {
                /** @description Transaction hash in the path */
                transaction_hash_param: components["schemas"]["FullHash"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description State changes caused by the specified transaction, with pagination. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        items: components["schemas"]["StateChange"][];
                        /**
                         * @example {
                         *       "items_count": 50,
                         *       "state_changes": null
                         *     }
                         */
                        next_page_params: {
                            [key: string]: unknown;
                        } | null;
                    };
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
            /** @description Unprocessable Entity */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JsonErrorResponse"];
                };
            };
        };
    };
    "BlockScoutWeb.API.V2.AddressController.address": {
        parameters: {
            query?: {
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
            };
            header?: never;
            path: {
                /** @description Address hash in the path */
                address_hash_param: components["schemas"]["AddressHash"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Detailed information about the specified address. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AddressResponse"];
                };
            };
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ForbiddenResponse"];
                };
            };
            /** @description Unprocessable Entity */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JsonErrorResponse"];
                };
            };
        };
    };
    "BlockScoutWeb.API.V2.BlockController.block_countdown": {
        parameters: {
            query?: {
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
            };
            header?: never;
            path: {
                /** @description Block number in the path */
                block_number_param: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Block countdown information. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BlockCountdown"];
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
            /** @description Unprocessable Entity */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JsonErrorResponse"];
                };
            };
        };
    };
    "BlockScoutWeb.API.V2.AddressController.addresses_list": {
        parameters: {
            query?: {
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
                /**
                 * @description Sort results by:
                 *     * balance - Sort by account balance
                 *     * transactions_count - Sort by number of transactions
                 *     Should be used together with `order` parameter.
                 */
                sort?: "balance" | "transactions_count";
                /**
                 * @description Sort order:
                 *     * asc - Ascending order
                 *     * desc - Descending order
                 *     Should be used together with `sort` parameter.
                 */
                order?: "asc" | "desc";
                /** @description Fetched coin balance for paging */
                fetched_coin_balance?: components["schemas"]["IntegerStringNullable"];
                /** @description Address hash for paging */
                hash?: components["schemas"]["AddressHash"];
                /** @description Number of items returned per page */
                items_count?: number;
                /** @description Transactions count for paging */
                transactions_count?: number | components["schemas"]["EmptyString"] | components["schemas"]["NullString"];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description List of native coin holders with their balances, with pagination. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        exchange_rate: components["schemas"]["FloatStringNullable"];
                        items: components["schemas"]["TopAddress"][];
                        /**
                         * @example {
                         *       "fetched_coin_balance": "124355417998347240251800",
                         *       "hash": "0x59708733fbbf64378d9293ec56b977c011a08fd2",
                         *       "items_count": 50,
                         *       "transactions_count": null
                         *     }
                         */
                        next_page_params: {
                            [key: string]: unknown;
                        } | null;
                        total_supply: components["schemas"]["FloatStringNullable"];
                    };
                };
            };
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ForbiddenResponse"];
                };
            };
        };
    };
    "BlockScoutWeb.API.V2.AddressController.withdrawals": {
        parameters: {
            query?: {
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
                /** @description Item index for paging */
                index?: number;
                /** @description Number of items returned per page */
                items_count?: number;
            };
            header?: never;
            path: {
                /** @description Address hash in the path */
                address_hash_param: components["schemas"]["AddressHash"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Withdrawals for the specified address, with pagination. Note that receiver field is not included in this endpoint. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        items: components["schemas"]["Withdrawal"][];
                        /**
                         * @example {
                         *       "index": 88192653,
                         *       "items_count": 50
                         *     }
                         */
                        next_page_params: {
                            [key: string]: unknown;
                        } | null;
                    };
                };
            };
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ForbiddenResponse"];
                };
            };
            /** @description Unprocessable Entity */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JsonErrorResponse"];
                };
            };
        };
    };
    "BlockScoutWeb.API.V2.Proxy.AccountAbstractionController.operation": {
        parameters: {
            query?: {
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
            };
            header?: never;
            path: {
                /** @description User operation hash in the path */
                operation_hash_param: components["schemas"]["FullHash"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description User operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UserOperation"];
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
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotFoundResponse"];
                };
            };
            /** @description Not Implemented */
            501: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotImplementedResponse"];
                };
            };
        };
    };
    "BlockScoutWeb.API.V2.Proxy.AccountAbstractionController.paymaster": {
        parameters: {
            query?: {
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
            };
            header?: never;
            path: {
                /** @description Address hash in the path */
                address_hash_param: components["schemas"]["AddressHash"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Paymaster */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Paymaster"];
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
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotFoundResponse"];
                };
            };
            /** @description Not Implemented */
            501: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotImplementedResponse"];
                };
            };
        };
    };
    "BlockScoutWeb.API.V2.InternalTransactionController.internal_transactions": {
        parameters: {
            query?: {
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
                /** @description Transaction hash in the query */
                transaction_hash?: components["schemas"]["FullHash"];
                /** @description Limit result items in the response */
                limit?: number | null;
                /** @description Item index for paging */
                index?: number;
                /** @description Block number for paging */
                block_number?: number;
                /** @description Transaction index for paging */
                transaction_index?: number;
                /** @description Number of items returned per page */
                items_count?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description List of internal transactions with pagination information. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        items: components["schemas"]["InternalTransaction"][];
                        /**
                         * @example {
                         *       "block_number": 22133247,
                         *       "index": 50,
                         *       "items_count": 50,
                         *       "transaction_index": 68
                         *     }
                         */
                        next_page_params: {
                            [key: string]: unknown;
                        } | null;
                    };
                };
            };
            /** @description Unprocessable Entity */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JsonErrorResponse"];
                };
            };
        };
    };
    "BlockScoutWeb.API.V2.Proxy.AccountAbstractionController.operations": {
        parameters: {
            query?: {
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
                /** @description User operation sender address hash */
                sender?: components["schemas"]["AddressHash"];
                /** @description User operation bundler address hash */
                bundler?: components["schemas"]["AddressHash"];
                /** @description User operation paymaster address hash */
                paymaster?: components["schemas"]["AddressHash"];
                /** @description User operation factory address hash */
                factory?: components["schemas"]["AddressHash"];
                /** @description Transaction hash in the query */
                transaction_hash?: components["schemas"]["FullHash"];
                /** @description User operation entry point address hash */
                entry_point?: components["schemas"]["AddressHash"];
                /** @description User operation bundle index */
                bundle_index?: number;
                /** @description User operation block number */
                block_number?: number;
                /** @description Number of items returned per page */
                page_size?: number;
                /** @description Page token for paging */
                page_token?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description List of user operations with pagination. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        items: components["schemas"]["UserOperationInList"][];
                        /**
                         * @example {
                         *       "page_size": 50,
                         *       "page_token": "3937439,0xbb680271614883525ac8056c388489e80b3518ec12ec46e1b910c7238c46b565"
                         *     }
                         */
                        next_page_params: {
                            [key: string]: unknown;
                        } | null;
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
            /** @description Not Implemented */
            501: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotImplementedResponse"];
                };
            };
        };
    };
    "BlockScoutWeb.API.V2.AddressController.coin_balance_history_by_day": {
        parameters: {
            query?: {
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
            };
            header?: never;
            path: {
                /** @description Address hash in the path */
                address_hash_param: components["schemas"]["AddressHash"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Daily coin balance history for the specified address. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        days?: number;
                        items?: components["schemas"]["CoinBalanceByDay"][];
                    };
                };
            };
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ForbiddenResponse"];
                };
            };
            /** @description Unprocessable Entity */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JsonErrorResponse"];
                };
            };
        };
    };
    "BlockScoutWeb.API.V2.SmartContractController.smart_contracts_counters": {
        parameters: {
            query?: {
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Count statistics for smart contracts. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Counters"];
                };
            };
            /** @description Unprocessable Entity */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JsonErrorResponse"];
                };
            };
        };
    };
    "BlockScoutWeb.API.V2.TokenController.transfers_count_by_instance": {
        parameters: {
            query?: {
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
            };
            header?: never;
            path: {
                /** @description Address hash in the path */
                address_hash_param: components["schemas"]["AddressHash"];
                /** @description Token ID for ERC-721/1155/404 tokens */
                token_id_param: components["schemas"]["IntegerStringNullable"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Total number of transfers for the specified NFT instance. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        transfers_count?: number;
                    };
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
            /** @description Unprocessable Entity */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JsonErrorResponse"];
                };
            };
        };
    };
    "BlockScoutWeb.API.V2.MainPageController.indexing_status": {
        parameters: {
            query?: {
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Current blockchain indexing status. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        finished_indexing?: boolean;
                        finished_indexing_blocks?: boolean;
                        /** Format: float */
                        indexed_blocks_ratio?: number;
                        /** Format: float */
                        indexed_internal_transactions_ratio?: number | null;
                    };
                };
            };
        };
    };
    "BlockScoutWeb.API.V2.BlockController.transactions": {
        parameters: {
            query?: {
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
                /**
                 * @description Filter by transaction type. Comma-separated list of:
                 *     * token_transfer - Token transfer transactions
                 *     * contract_creation - Contract deployment transactions
                 *     * contract_call - Contract method call transactions
                 *     * coin_transfer - Native coin transfer transactions
                 *     * token_creation - Token creation transactions
                 *     * blob_transaction - Only show blob transactions (Ethereum only)
                 */
                type?: "coin_transfer" | "contract_call" | "contract_creation" | "token_transfer" | "token_creation";
                /** @description Block number for paging */
                block_number?: number;
                /** @description Item index for paging */
                index?: number;
                /** @description Number of items returned per page */
                items_count?: number;
            };
            header?: never;
            path: {
                /** @description Block hash or number in the path */
                block_hash_or_number_param: number | components["schemas"]["FullHash"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Transactions in the specified block, with pagination. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        items: components["schemas"]["Transaction"][];
                        /**
                         * @example {
                         *       "block_number": 12345678,
                         *       "index": 103,
                         *       "items_count": 50
                         *     }
                         */
                        next_page_params: {
                            [key: string]: unknown;
                        } | null;
                    };
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
            /** @description Unprocessable Entity */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JsonErrorResponse"];
                };
            };
        };
    };
    "BlockScoutWeb.API.V2.Proxy.AccountAbstractionController.account": {
        parameters: {
            query?: {
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
            };
            header?: never;
            path: {
                /** @description Address hash in the path */
                address_hash_param: components["schemas"]["AddressHash"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Account */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Account"];
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
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotFoundResponse"];
                };
            };
            /** @description Not Implemented */
            501: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotImplementedResponse"];
                };
            };
        };
    };
    "BlockScoutWeb.API.V2.TransactionController.summary": {
        parameters: {
            query?: {
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
                /** @description If true, returns only the request body in the summary endpoint */
                just_request_body?: boolean;
            };
            header?: never;
            path: {
                /** @description Transaction hash in the path */
                transaction_hash_param: components["schemas"]["FullHash"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Human-readable summary of the specified transaction. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Summary"] | components["schemas"]["SummaryJustRequestBody"];
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
            /** @description Unprocessable Entity */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JsonErrorResponse"];
                };
            };
        };
    };
    "BlockScoutWeb.API.V2.Proxy.AccountAbstractionController.factories": {
        parameters: {
            query?: {
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
                /** @description Number of items returned per page */
                page_size?: number;
                /** @description Page token for paging */
                page_token?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description List of factories with pagination. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        items: components["schemas"]["Factory"][];
                        /**
                         * @example {
                         *       "page_size": 50,
                         *       "page_token": "3,0xC23957e7Fea98eBD017abe15a4e7770797ff6D8d"
                         *     }
                         */
                        next_page_params: {
                            [key: string]: unknown;
                        } | null;
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
            /** @description Not Implemented */
            501: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotImplementedResponse"];
                };
            };
        };
    };
    "BlockScoutWeb.API.V2.WithdrawalController.withdrawals_counters": {
        parameters: {
            query?: {
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Withdrawals counters. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Counter"];
                };
            };
            /** @description Unprocessable Entity */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JsonErrorResponse"];
                };
            };
        };
    };
    "BlockScoutWeb.API.V2.BlockController.blocks": {
        parameters: {
            query?: {
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
                /**
                 * @description Filter by block type:
                 *     * block - Standard blocks in the main chain
                 *     * uncle - Uncle/ommer blocks (valid but not in main chain)
                 *     * reorg - Blocks from chain reorganizations
                 *     If omitted, default value "block" is used.
                 */
                type?: "uncle" | "reorg" | "block";
                /** @description Block number for paging */
                block_number?: number;
                /** @description Number of items returned per page */
                items_count?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description List of blocks with pagination information. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        items: components["schemas"]["Block"][];
                        /**
                         * @example {
                         *       "block_number": 22566361,
                         *       "items_count": 50
                         *     }
                         */
                        next_page_params: {
                            [key: string]: unknown;
                        } | null;
                    };
                };
            };
            /** @description Unprocessable Entity */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JsonErrorResponse"];
                };
            };
        };
    };
    "BlockScoutWeb.API.V2.TokenController.refetch_metadata": {
        parameters: {
            query?: {
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
                /** @description reCAPTCHA response token */
                recaptcha_response?: string;
            };
            header?: never;
            path: {
                /** @description Address hash in the path */
                address_hash_param: components["schemas"]["AddressHash"];
                /** @description Token ID for ERC-721/1155/404 tokens */
                token_id_param: components["schemas"]["IntegerStringNullable"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Metadata refresh has been successfully initiated. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        message?: string;
                    };
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
            /** @description Unprocessable Entity */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JsonErrorResponse"];
                };
            };
        };
    };
    "BlockScoutWeb.API.V2.AddressController.logs": {
        parameters: {
            query?: {
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
                /** @description Log topic param in the query */
                topic?: components["schemas"]["HexString"];
                /** @description Block number for paging */
                block_number?: number;
                /** @description Item index for paging */
                index?: number;
                /** @description Number of items returned per page */
                items_count?: number;
            };
            header?: never;
            path: {
                /** @description Address hash in the path */
                address_hash_param: components["schemas"]["AddressHash"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Event logs for the specified address, with pagination. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        items: components["schemas"]["Log"][];
                        /**
                         * @example {
                         *       "block_number": 22546398,
                         *       "index": 268,
                         *       "items_count": 50
                         *     }
                         */
                        next_page_params: {
                            [key: string]: unknown;
                        } | null;
                    };
                };
            };
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ForbiddenResponse"];
                };
            };
            /** @description Unprocessable Entity */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JsonErrorResponse"];
                };
            };
        };
    };
    "BlockScoutWeb.API.Legacy.BlockController.get_block_number_by_time": {
        parameters: {
            query?: {
                /** @description Unix timestamp in seconds. */
                timestamp?: components["schemas"]["IntegerString"];
                /** @description Whether to return the block before or after the timestamp. */
                closest?: "before" | "after";
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Block number */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @description Human-readable status string — `OK` on success, a descriptive error message otherwise. */
                        message: string;
                        /** @description Endpoint-specific payload on success; `null` on error. */
                        result: components["schemas"]["GetBlockNumberByTimeResult"] | null;
                        /**
                         * @description `1` = OK, `0` = error, `2` = pending.
                         * @enum {string}
                         */
                        status: "0" | "1" | "2";
                    };
                };
            };
        };
    };
    "BlockScoutWeb.API.V2.Proxy.AccountAbstractionController.accounts": {
        parameters: {
            query?: {
                /** @description User operation factory address hash */
                factory?: components["schemas"]["AddressHash"];
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
                /** @description Number of items returned per page */
                page_size?: number;
                /** @description Page token for paging */
                page_token?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description List of account abstraction wallets with pagination. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        items: components["schemas"]["Account"][];
                        /**
                         * @example {
                         *       "page_size": 50,
                         *       "page_token": "0x29cB129476609bBa26372b23427Af3b87cB23aF6"
                         *     }
                         */
                        next_page_params: {
                            [key: string]: unknown;
                        } | null;
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
            /** @description Not Implemented */
            501: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotImplementedResponse"];
                };
            };
        };
    };
    "BlockScoutWeb.API.V2.CsvExportController.internal_transactions_csv": {
        parameters: {
            query: {
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
                /** @description Start of the time period (ISO 8601 format) in CSV export */
                from_period: string | components["schemas"]["NullString"];
                /** @description End of the time period (ISO 8601 format) In CSV export */
                to_period: string | components["schemas"]["NullString"];
                /** @description Filter type in CSV export */
                filter_type?: ("address" | null) | components["schemas"]["NullString"];
                /** @description Filter value in CSV export */
                filter_value?: ("to" | "from" | null) | components["schemas"]["NullString"];
            };
            header?: never;
            path: {
                /** @description Address hash in the path */
                address_hash_param: components["schemas"]["AddressHash"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description CSV file of internal transactions. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/csv": unknown;
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
            /** @description Unprocessable Entity */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JsonErrorResponse"];
                };
            };
        };
    };
    "BlockScoutWeb.API.V2.SearchController.check_redirect": {
        parameters: {
            query?: {
                /** @description Search query filter */
                q?: string | null;
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Response indicating whether the query should redirect to a specific entity page. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        parameter?: string | null;
                        redirect?: boolean | null;
                        /** @enum {string|null} */
                        type?: "address" | "block" | "transaction" | "user_operation" | "blob" | null;
                    };
                };
            };
            /** @description Unprocessable Entity */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JsonErrorResponse"];
                };
            };
        };
    };
    "BlockScoutWeb.API.V2.TransactionController.stats": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Transaction statistics. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        pending_transactions_count: components["schemas"]["IntegerString"];
                        transaction_fees_avg_24h: components["schemas"]["IntegerString"];
                        transaction_fees_sum_24h: components["schemas"]["IntegerString"];
                        transactions_count_24h: components["schemas"]["IntegerString"];
                    };
                };
            };
            /** @description Unprocessable Entity */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JsonErrorResponse"];
                };
            };
        };
    };
    "BlockScoutWeb.API.V2.ConfigController.public_metrics": {
        parameters: {
            query?: {
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Public metrics config. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        update_period_hours?: number;
                    };
                };
            };
            /** @description Unprocessable Entity */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JsonErrorResponse"];
                };
            };
        };
    };
    "BlockScoutWeb.API.V2.SearchController.search": {
        parameters: {
            query?: {
                /** @description Search query filter */
                q?: string | null;
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
                /** @description Next page params type for paging */
                next_page_params_type?: string;
                /** @description Label for paging in the search results */
                label?: Record<string, never>;
                /** @description Token for paging in the search results */
                token?: Record<string, never>;
                /** @description Contract for paging in the search results */
                contract?: Record<string, never>;
                /** @description TAC operation for paging in the search results */
                tac_operation?: Record<string, never>;
                /** @description Metadata tag for paging in the search results */
                metadata_tag?: Record<string, never>;
                /** @description Block for paging in the search results */
                block?: Record<string, never>;
                /** @description Blob for paging in the search results */
                blob?: Record<string, never>;
                /** @description User operation for paging in the search results */
                user_operation?: Record<string, never>;
                /** @description Address for paging in the search results */
                address?: Record<string, never>;
                /** @description ENS domain for paging in the search results */
                ens_domain?: Record<string, never>;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /**
             * @description Successful search response containing matched items and pagination information.
             *                 Results are ordered by relevance and limited to 50 items per page.
             */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SearchResult"];
                };
            };
            /** @description Unprocessable Entity */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JsonErrorResponse"];
                };
            };
        };
    };
    "BlockScoutWeb.API.V2.Proxy.AccountAbstractionController.factory": {
        parameters: {
            query?: {
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
            };
            header?: never;
            path: {
                /** @description Address hash in the path */
                address_hash_param: components["schemas"]["AddressHash"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Factory */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Factory"];
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
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotFoundResponse"];
                };
            };
            /** @description Not Implemented */
            501: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotImplementedResponse"];
                };
            };
        };
    };
    "BlockScoutWeb.API.V2.TransactionController.logs": {
        parameters: {
            query?: {
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
                /** @description Item index for paging */
                index?: number;
                /** @description Block number for paging */
                block_number?: number;
                /** @description Number of items returned per page */
                items_count?: number;
            };
            header?: never;
            path: {
                /** @description Transaction hash in the path */
                transaction_hash_param: components["schemas"]["FullHash"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Event logs for the specified transaction, with pagination. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        items: components["schemas"]["Log"][];
                        /**
                         * @example {
                         *       "block_number": 21925703,
                         *       "index": 124,
                         *       "items_count": 50
                         *     }
                         */
                        next_page_params: {
                            [key: string]: unknown;
                        } | null;
                    };
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
            /** @description Unprocessable Entity */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JsonErrorResponse"];
                };
            };
        };
    };
    "BlockScoutWeb.API.V2.ConfigController.db_background_migrations": {
        parameters: {
            query?: {
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Uncompleted background migrations. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        migrations?: {
                            /** Format: date-time */
                            inserted_at?: string;
                            meta?: Record<string, never> | null;
                            migration_name?: string;
                            status?: string;
                            /** Format: date-time */
                            updated_at?: string;
                        }[];
                    };
                };
            };
            /** @description Unprocessable Entity */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JsonErrorResponse"];
                };
            };
        };
    };
    "BlockScoutWeb.API.V2.AdvancedFilterController.list_methods": {
        parameters: {
            query?: {
                /**
                 * @description Search string: either a 4-byte method selector (e.g. `0xa9059cbb`) or a method name (e.g. `transfer`).
                 * @example transfer
                 */
                q?: string | null;
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description List of contract methods. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdvancedFilterMethod"][];
                };
            };
            /** @description Unprocessable Entity */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JsonErrorResponse"];
                };
            };
        };
    };
    "BlockScoutWeb.API.V2.Proxy.AccountAbstractionController.paymasters": {
        parameters: {
            query?: {
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
                /** @description Number of items returned per page */
                page_size?: number;
                /** @description Page token for paging */
                page_token?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description List of paymasters with pagination. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        items: components["schemas"]["Paymaster"][];
                        /**
                         * @example {
                         *       "page_size": 50,
                         *       "page_token": "19,0xB98Cb1dA4F9BD640879F0bBCb30A541c84163406"
                         *     }
                         */
                        next_page_params: {
                            [key: string]: unknown;
                        } | null;
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
            /** @description Not Implemented */
            501: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotImplementedResponse"];
                };
            };
        };
    };
    "BlockScoutWeb.API.V2.TransactionController.watchlist_transactions": {
        parameters: {
            query?: {
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
                /** @description Block number for paging */
                block_number?: number;
                /** @description Item index for paging */
                index?: number;
                /** @description Number of items returned per page */
                items_count?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Watchlist transactions. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        items: components["schemas"]["TransactionResponse"][];
                        /**
                         * @example {
                         *       "block_number": 23617990,
                         *       "index": 128,
                         *       "items_count": 50
                         *     }
                         */
                        next_page_params: {
                            [key: string]: unknown;
                        } | null;
                    };
                };
            };
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ForbiddenResponse"];
                };
            };
            /** @description Unprocessable Entity */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JsonErrorResponse"];
                };
            };
        };
    };
    "BlockScoutWeb.API.V2.TransactionController.internal_transactions": {
        parameters: {
            query?: {
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
                /** @description Item index for paging */
                index?: number;
                /** @description Block number for paging */
                block_number?: number;
                /** @description Transaction index for paging */
                transaction_index?: number;
                /** @description Number of items returned per page */
                items_count?: number;
            };
            header?: never;
            path: {
                /** @description Transaction hash in the path */
                transaction_hash_param: components["schemas"]["FullHash"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Internal transactions for the specified transaction, with pagination. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        items: components["schemas"]["InternalTransaction"][];
                        /**
                         * @example {
                         *       "block_number": 22133247,
                         *       "index": 50,
                         *       "items_count": 50,
                         *       "transaction_index": 68
                         *     }
                         */
                        next_page_params: {
                            [key: string]: unknown;
                        } | null;
                    };
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
            /** @description Unprocessable Entity */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JsonErrorResponse"];
                };
            };
        };
    };
    "BlockScoutWeb.API.V2.Proxy.AccountAbstractionController.bundles": {
        parameters: {
            query?: {
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
                /** @description User operation bundler address hash */
                bundler?: components["schemas"]["AddressHash"];
                /** @description User operation entry point address hash */
                entry_point?: components["schemas"]["AddressHash"];
                /** @description Number of items returned per page */
                page_size?: number;
                /** @description Page token for paging */
                page_token?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description List of bundles with pagination. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        items: components["schemas"]["Bundle"][];
                        /**
                         * @example {
                         *       "page_size": 50,
                         *       "page_token": "3949699,0x275f7110df7d73e530f3381daa9d422dea80f036b514e56427d2d7e492c8a81f,0"
                         *     }
                         */
                        next_page_params: {
                            [key: string]: unknown;
                        } | null;
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
            /** @description Not Implemented */
            501: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotImplementedResponse"];
                };
            };
        };
    };
    "BlockScoutWeb.API.V2.ConfigController.backend": {
        parameters: {
            query?: {
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Backend environment configuration. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        chain_type?: string | null;
                        openapi_spec_folder_name?: string | null;
                    };
                };
            };
            /** @description Unprocessable Entity */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JsonErrorResponse"];
                };
            };
        };
    };
    "BlockScoutWeb.API.V2.CsvExportController.logs_csv": {
        parameters: {
            query: {
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
                /** @description Start of the time period (ISO 8601 format) in CSV export */
                from_period: string | components["schemas"]["NullString"];
                /** @description End of the time period (ISO 8601 format) In CSV export */
                to_period: string | components["schemas"]["NullString"];
                /** @description Filter type in CSV export */
                filter_type?: ("address" | null) | components["schemas"]["NullString"];
                /** @description Filter value in CSV export */
                filter_value?: ("to" | "from" | null) | components["schemas"]["NullString"];
            };
            header?: never;
            path: {
                /** @description Address hash in the path */
                address_hash_param: components["schemas"]["AddressHash"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description CSV file of logs. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/csv": unknown;
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
            /** @description Unprocessable Entity */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JsonErrorResponse"];
                };
            };
        };
    };
    "BlockScoutWeb.API.Legacy.BlockController.eth_block_number": {
        parameters: {
            query?: {
                /** @description JSON-RPC request id echoed back in the response. Defaults to 1 when omitted. */
                id?: number | string;
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Latest block number */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @description Echoes the request id. When the client omits it, the server echoes integer `1`. */
                        id: number | string;
                        /**
                         * @description JSON-RPC protocol version, always `2.0`.
                         * @enum {string}
                         */
                        jsonrpc: "2.0";
                        /** @description Endpoint-specific payload. */
                        result: components["schemas"]["EthBlockNumberResult"];
                    };
                };
            };
        };
    };
    "BlockScoutWeb.API.V2.WithdrawalController.withdrawals_list": {
        parameters: {
            query?: {
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
                /** @description Item index for paging */
                index?: number;
                /** @description Number of items returned per page */
                items_count?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description List of withdrawals with pagination. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        items: components["schemas"]["Withdrawal"][];
                        /**
                         * @example {
                         *       "index": 50,
                         *       "items_count": 50
                         *     }
                         */
                        next_page_params: {
                            [key: string]: unknown;
                        } | null;
                    };
                };
            };
            /** @description Unprocessable Entity */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JsonErrorResponse"];
                };
            };
        };
    };
    "BlockScoutWeb.API.V2.SearchController.search (2)": {
        parameters: {
            query?: {
                /** @description Search query filter */
                q?: string | null;
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
                /** @description Next page params type for paging */
                next_page_params_type?: string;
                /** @description Label for paging in the search results */
                label?: Record<string, never>;
                /** @description Token for paging in the search results */
                token?: Record<string, never>;
                /** @description Contract for paging in the search results */
                contract?: Record<string, never>;
                /** @description TAC operation for paging in the search results */
                tac_operation?: Record<string, never>;
                /** @description Metadata tag for paging in the search results */
                metadata_tag?: Record<string, never>;
                /** @description Block for paging in the search results */
                block?: Record<string, never>;
                /** @description Blob for paging in the search results */
                blob?: Record<string, never>;
                /** @description User operation for paging in the search results */
                user_operation?: Record<string, never>;
                /** @description Address for paging in the search results */
                address?: Record<string, never>;
                /** @description ENS domain for paging in the search results */
                ens_domain?: Record<string, never>;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /**
             * @description Successful search response containing matched items and pagination information.
             *                 Results are ordered by relevance and limited to 50 items per page.
             */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SearchResult"];
                };
            };
            /** @description Unprocessable Entity */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JsonErrorResponse"];
                };
            };
        };
    };
    "BlockScoutWeb.API.V2.AddressController.transactions": {
        parameters: {
            query?: {
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
                /**
                 * @description Filter transactions by direction:
                 *     * to - Only show transactions sent to this address
                 *     * from - Only show transactions sent from this address
                 *     If omitted, all transactions involving the address are returned.
                 */
                filter?: "to" | "from";
                /**
                 * @description Sort results by:
                 *     * block_number - Sort by block number
                 *     * value - Sort by transaction value
                 *     * fee - Sort by transaction fee
                 *     Should be used together with `order` parameter.
                 */
                sort?: "block_number" | "value" | "fee";
                /**
                 * @description Sort order:
                 *     * asc - Ascending order
                 *     * desc - Descending order
                 *     Should be used together with `sort` parameter.
                 */
                order?: "asc" | "desc";
                /** @description Block number for paging */
                block_number?: number | components["schemas"]["EmptyString"] | components["schemas"]["NullString"];
                /** @description Transaction index for paging */
                index?: number | components["schemas"]["EmptyString"] | components["schemas"]["NullString"];
                /** @description Inserted at timestamp for paging (ISO8601) */
                inserted_at?: string;
                /** @description Transaction hash for paging */
                hash?: components["schemas"]["FullHash"];
                /** @description Transaction value for paging */
                value?: components["schemas"]["IntegerString"] | components["schemas"]["EmptyString"] | components["schemas"]["NullString"];
                /** @description Transaction fee for paging */
                fee?: components["schemas"]["IntegerString"];
                /** @description Number of items returned per page */
                items_count?: number;
            };
            header?: never;
            path: {
                /** @description Address hash in the path */
                address_hash_param: components["schemas"]["AddressHash"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description All transactions for the specified address. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        items: components["schemas"]["Transaction"][];
                        /**
                         * @example {
                         *       "block_number": 22566361,
                         *       "fee": "19206937428000",
                         *       "hash": "0xe38d616dade747097354b0731b5560f581536dacf22121feb4bb4a0b776018aa",
                         *       "index": 103,
                         *       "inserted_at": "2025-05-26T10:26:51.474448Z",
                         *       "items_count": 50,
                         *       "value": "24741049597737"
                         *     }
                         */
                        next_page_params: {
                            [key: string]: unknown;
                        } | null;
                    };
                };
            };
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ForbiddenResponse"];
                };
            };
            /** @description Unprocessable Entity */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JsonErrorResponse"];
                };
            };
        };
    };
    "BlockScoutWeb.API.V2.TransactionController.raw_trace": {
        parameters: {
            query?: {
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
            };
            header?: never;
            path: {
                /** @description Transaction hash in the path */
                transaction_hash_param: components["schemas"]["FullHash"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Raw execution trace for the specified transaction. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RawTrace"];
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
            /** @description Unprocessable Entity */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JsonErrorResponse"];
                };
            };
        };
    };
    "BlockScoutWeb.API.V2.CsvExportController.transactions_csv": {
        parameters: {
            query: {
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
                /** @description Start of the time period (ISO 8601 format) in CSV export */
                from_period: string | components["schemas"]["NullString"];
                /** @description End of the time period (ISO 8601 format) In CSV export */
                to_period: string | components["schemas"]["NullString"];
                /** @description Filter type in CSV export */
                filter_type?: ("address" | null) | components["schemas"]["NullString"];
                /** @description Filter value in CSV export */
                filter_value?: ("to" | "from" | null) | components["schemas"]["NullString"];
            };
            header?: never;
            path: {
                /** @description Address hash in the path */
                address_hash_param: components["schemas"]["AddressHash"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description CSV file of transactions. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/csv": unknown;
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
            /** @description Unprocessable Entity */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JsonErrorResponse"];
                };
            };
        };
    };
    "BlockScoutWeb.API.V2.CsvExportController.get_csv_export": {
        parameters: {
            query?: {
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
            };
            header?: never;
            path: {
                /** @description UUID for CSV export */
                uuid_param: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Status of CSV export. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Response"];
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
        };
    };
    "BlockScoutWeb.API.V2.AddressController.nft_collections": {
        parameters: {
            query?: {
                /** @description API key for rate limiting or for sensitive endpoints */
                apikey?: string;
                /** @description Secret key for getting access to restricted resources */
                key?: string;
                /**
                 * @description Filter by token type. Comma-separated list of:
                 *     * ERC-721 - Non-fungible tokens
                 *     * ERC-1155 - Multi-token standard
                 *     * ERC-404 - Hybrid fungible/non-fungible tokens
                 *
                 *     Example: `ERC-721,ERC-1155` to show both NFT and multi-token transfers
                 */
                type?: components["schemas"]["EmptyString"] | string;
                /** @description Number of items returned per page */
                items_count?: number;
                /** @description Token contract address hash for paging */
                token_contract_address_hash?: components["schemas"]["AddressHash"];
                /** @description Token type for paging */
                token_type?: components["schemas"]["TokenType"];
            };
            header?: never;
            path: {
                /** @description Address hash in the path */
                address_hash_param: components["schemas"]["AddressHash"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description NFTs owned by the specified address, grouped by collection, with pagination. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        items: components["schemas"]["NFTCollection"][];
                        /**
                         * @example {
                         *       "items_count": 50,
                         *       "token_contract_address_hash": "0x1ffe11b9fb7f6ff1b153ab8608cf403ecaf9d44a",
                         *       "token_type": "ERC-721"
                         *     }
                         */
                        next_page_params: {
                            [key: string]: unknown;
                        } | null;
                    };
                };
            };
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ForbiddenResponse"];
                };
            };
            /** @description Unprocessable Entity */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JsonErrorResponse"];
                };
            };
        };
    };
}
