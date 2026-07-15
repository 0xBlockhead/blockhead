export interface paths {
    "/accounts/{address}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get account
         * @description Return the authentication key and the sequence number for an account
         *     address. Optionally, a ledger version can be specified. If the ledger
         *     version is not specified in the request, the latest ledger version is used.
         */
        get: operations["get_account"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/accounts/{address}/resources": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get account resources
         * @description Retrieves all account resources for a given account and a specific ledger version.  If the
         *     ledger version is not specified in the request, the latest ledger version is used.
         *
         *     The Aptos nodes prune account state history, via a configurable time window.
         *     If the requested ledger version has been pruned, the server responds with a 410.
         */
        get: operations["get_account_resources"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/accounts/{address}/balance/{asset_type}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get account balance
         * @description Retrieves account balance for coins / fungible asset (only for primary fungible asset store)
         *     for a given account, asset type and a specific ledger version.  If the
         *     ledger version is not specified in the request, the latest ledger version is used.
         *
         *     The Aptos nodes prune account state history, via a configurable time window.
         *     If the requested ledger version has been pruned, the server responds with a 410.
         */
        get: operations["get_account_balance"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/accounts/{address}/modules": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get account modules
         * @description Retrieves all account modules' bytecode for a given account at a specific ledger version.
         *     If the ledger version is not specified in the request, the latest ledger version is used.
         *
         *     The Aptos nodes prune account state history, via a configurable time window.
         *     If the requested ledger version has been pruned, the server responds with a 410.
         */
        get: operations["get_account_modules"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/spec": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Show OpenAPI explorer
         * @description Provides a UI that you can use to explore the API. You can also
         *     retrieve the API directly at `/spec.yaml` and `/spec.json`.
         */
        get: operations["spec"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/info": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Show some basic info of the node. */
        get: operations["info"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/-/healthy": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Check basic node health
         * @description By default this endpoint just checks that it can get the latest ledger
         *     info and then returns 200.
         *
         *     If the duration_secs param is provided, this endpoint will return a
         *     200 if the following condition is true:
         *
         *     `server_latest_ledger_info_timestamp >= server_current_time_timestamp - duration_secs`
         */
        get: operations["healthy"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/blocks/by_height/{block_height}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get blocks by height
         * @description This endpoint allows you to get the transactions in a block
         *     and the corresponding block information.
         *
         *     Transactions are limited by max default transactions size.  If not all transactions
         *     are present, the user will need to query for the rest of the transactions via the
         *     get transactions API.
         *
         *     If the block is pruned, it will return a 410
         */
        get: operations["get_block_by_height"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/blocks/by_version/{version}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get blocks by version
         * @description This endpoint allows you to get the transactions in a block
         *     and the corresponding block information given a version in the block.
         *
         *     Transactions are limited by max default transactions size.  If not all transactions
         *     are present, the user will need to query for the rest of the transactions via the
         *     get transactions API.
         *
         *     If the block has been pruned, it will return a 410
         */
        get: operations["get_block_by_version"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/accounts/{address}/events/{creation_number}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get events by creation number
         * @description Event types are globally identifiable by an account `address` and
         *     monotonically increasing `creation_number`, one per event type emitted
         *     to the given account. This API returns events corresponding to that
         *     that event type.
         */
        get: operations["get_events_by_creation_number"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/accounts/{address}/events/{event_handle}/{field_name}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get events by event handle
         * @description This API uses the given account `address`, `eventHandle`, and `fieldName`
         *     to build a key that can globally identify an event types. It then uses this
         *     key to return events emitted to the given account matching that event type.
         */
        get: operations["get_events_by_event_handle"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get ledger info
         * @description Get the latest ledger information, including data such as chain ID,
         *     role type, ledger versions, epoch, etc.
         */
        get: operations["get_ledger_info"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/accounts/{address}/resource/{resource_type}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get account resource
         * @description Retrieves an individual resource from a given account and at a specific ledger version. If the
         *     ledger version is not specified in the request, the latest ledger version is used.
         *
         *     The Aptos nodes prune account state history, via a configurable time window.
         *     If the requested ledger version has been pruned, the server responds with a 410.
         */
        get: operations["get_account_resource"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/accounts/{address}/module/{module_name}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get account module
         * @description Retrieves an individual module from a given account and at a specific ledger version. If the
         *     ledger version is not specified in the request, the latest ledger version is used.
         *
         *     The Aptos nodes prune account state history, via a configurable time window.
         *     If the requested ledger version has been pruned, the server responds with a 410.
         */
        get: operations["get_account_module"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tables/{table_handle}/item": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Get table item
         * @description Get a table item at a specific ledger version from the table identified by {table_handle}
         *     in the path and the "key" (TableItemRequest) provided in the request body.
         *
         *     This is a POST endpoint because the "key" for requesting a specific
         *     table item (TableItemRequest) could be quite complex, as each of its
         *     fields could themselves be composed of other structs. This makes it
         *     impractical to express using query params, meaning GET isn't an option.
         *
         *     The Aptos nodes prune account state history, via a configurable time window.
         *     If the requested ledger version has been pruned, the server responds with a 410.
         */
        post: operations["get_table_item"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tables/{table_handle}/raw_item": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Get raw table item
         * @description Get a table item at a specific ledger version from the table identified by {table_handle}
         *     in the path and the "key" (RawTableItemRequest) provided in the request body.
         *
         *     The `get_raw_table_item` requires only a serialized key comparing to the full move type information
         *     comparing to the `get_table_item` api, and can only return the query in the bcs format.
         *
         *     The Aptos nodes prune account state history, via a configurable time window.
         *     If the requested ledger version has been pruned, the server responds with a 410.
         */
        post: operations["get_raw_table_item"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/transactions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get transactions
         * @description Retrieve on-chain committed transactions. The page size and start ledger version
         *     can be provided to get a specific sequence of transactions.
         *
         *     If the version has been pruned, then a 410 will be returned.
         *
         *     To retrieve a pending transaction, use /transactions/by_hash.
         */
        get: operations["get_transactions"];
        put?: never;
        /**
         * Submit transaction
         * @description This endpoint accepts transaction submissions in two formats.
         *
         *     To submit a transaction as JSON, you must submit a SubmitTransactionRequest.
         *     To build this request, do the following:
         *
         *     1. Encode the transaction as BCS. If you are using a language that has
         *     native BCS support, make sure of that library. If not, you may take
         *     advantage of /transactions/encode_submission. When using this
         *     endpoint, make sure you trust the node you're talking to, as it is
         *     possible they could manipulate your request.
         *     2. Sign the encoded transaction and use it to create a TransactionSignature.
         *     3. Submit the request. Make sure to use the "application/json" Content-Type.
         *
         *     To submit a transaction as BCS, you must submit a SignedTransaction
         *     encoded as BCS. See SignedTransaction in types/src/transaction/mod.rs.
         *     Make sure to use the `application/x.aptos.signed_transaction+bcs` Content-Type.
         */
        post: operations["submit_transaction"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/transactions/by_hash/{txn_hash}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get transaction by hash
         * @description Look up a transaction by its hash. This is the same hash that is returned
         *     by the API when submitting a transaction (see PendingTransaction).
         *
         *     When given a transaction hash, the server first looks for the transaction
         *     in storage (on-chain, committed). If no on-chain transaction is found, it
         *     looks the transaction up by hash in the mempool (pending, not yet committed).
         *
         *     To create a transaction hash by yourself, do the following:
         *     1. Hash message bytes: "RawTransaction" bytes + BCS bytes of [Transaction](https://aptos-labs.github.io/aptos-core/aptos_types/transaction/enum.Transaction.html).
         *     2. Apply hash algorithm `SHA3-256` to the hash message bytes.
         *     3. Hex-encode the hash bytes with `0x` prefix.
         */
        get: operations["get_transaction_by_hash"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/transactions/wait_by_hash/{txn_hash}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Wait for transaction by hash
         * @description Same as /transactions/by_hash, but will wait for a pending transaction to be committed. To be used as a long
         *     poll optimization by clients, to reduce latency caused by polling. The "long" poll is generally a second or
         *     less but dictated by the server; the client must deal with the result as if the request was a normal
         *     /transactions/by_hash request, e.g., by retrying if the transaction is pending.
         */
        get: operations["wait_transaction_by_hash"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/transactions/by_version/{txn_version}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get transaction by version
         * @description Retrieves a transaction by a given version. If the version has been
         *     pruned, a 410 will be returned.
         */
        get: operations["get_transaction_by_version"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/transactions/auxiliary_info": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get transactions auxiliary info
         * @description Retrieves persisted auxiliary information (such as transaction indices within blocks) for
         *     transactions in a given version range.
         *
         *     If the version range has been pruned, a 410 will be returned.
         */
        get: operations["get_transactions_auxiliary_info"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/accounts/{address}/transactions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get account transactions
         * @description Retrieves on-chain committed sequence-number based transactions from an account.
         *     Does not retrieve orderless transactions sent from the account.
         *     If the start version is too far in the past, a 410 will be returned.
         *
         *     If no start version is given, it will start at version 0.
         *
         *     To retrieve a pending transaction, use /transactions/by_hash.
         */
        get: operations["get_account_transactions"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/accounts/{address}/transaction_summaries": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get account transaction summaries
         * @description Retrieves summaries of on-chain committed transactions (both sequence number based
         *     and orderless transactions) from an account.
         *     Each transaction summary contains the sender addresss, transaction hash, version, and replay protector.
         *
         *     If start_version is provided, the output consists of transaction summaries starting form that version.
         *
         *     If start_version is not provided but the end_version is provided, the output consists of transaction summaries
         *     ending at the end_version.
         *
         *     If both start_version and end_version are not provided, the output consists of the summaries of
         *     most recent committed transaction from the account.
         *
         *     The output always consists of transaction summaries ordered in ascending order by version.
         *
         *     To retrieve a pending transaction, use /transactions/by_hash.
         */
        get: operations["get_account_transaction_summaries"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/transactions/batch": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Submit batch transactions
         * @description This allows you to submit multiple transactions.  The response has three outcomes:
         *
         *     1. All transactions succeed, and it will return a 202
         *     2. Some transactions succeed, and it will return the failed transactions and a 206
         *     3. No transactions succeed, and it will also return the failed transactions and a 206
         *
         *     To submit a transaction as JSON, you must submit a SubmitTransactionRequest.
         *     To build this request, do the following:
         *
         *     1. Encode the transaction as BCS. If you are using a language that has
         *     native BCS support, make sure to use that library. If not, you may take
         *     advantage of /transactions/encode_submission. When using this
         *     endpoint, make sure you trust the node you're talking to, as it is
         *     possible they could manipulate your request.
         *     2. Sign the encoded transaction and use it to create a TransactionSignature.
         *     3. Submit the request. Make sure to use the "application/json" Content-Type.
         *
         *     To submit a transaction as BCS, you must submit a SignedTransaction
         *     encoded as BCS. See SignedTransaction in types/src/transaction/mod.rs.
         *     Make sure to use the `application/x.aptos.signed_transaction+bcs` Content-Type.
         */
        post: operations["submit_batch_transactions"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/transactions/simulate": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Simulate transaction
         * @description The output of the transaction will have the exact transaction outputs and events that running
         *     an actual signed transaction would have.  However, it will not have the associated state
         *     hashes, as they are not updated in storage.  This can be used to estimate the maximum gas
         *     units for a submitted transaction.
         *
         *     To use this, you must:
         *     - Create a SignedTransaction with a zero-padded signature.
         *     - Submit a SubmitTransactionRequest containing a UserTransactionRequest containing that signature.
         *
         *     To use this endpoint with BCS, you must submit a SignedTransaction
         *     encoded as BCS. See SignedTransaction in types/src/transaction/mod.rs.
         */
        post: operations["simulate_transaction"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/transactions/encode_submission": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Encode submission
         * @description This endpoint accepts an EncodeSubmissionRequest, which internally is a
         *     UserTransactionRequestInner (and optionally secondary signers) encoded
         *     as JSON, validates the request format, and then returns that request
         *     encoded in BCS. The client can then use this to create a transaction
         *     signature to be used in a SubmitTransactionRequest, which it then
         *     passes to the /transactions POST endpoint.
         *
         *     To be clear, this endpoint makes it possible to submit transaction
         *     requests to the API from languages that do not have library support for
         *     BCS. If you are using an SDK that has BCS support, such as the official
         *     Rust, TypeScript, or Python SDKs, you do not need to use this endpoint.
         *
         *     To sign a message using the response from this endpoint:
         *     - Decode the hex encoded string in the response to bytes.
         *     - Sign the bytes to create the signature.
         *     - Use that as the signature field in something like Ed25519Signature, which you then use to build a TransactionSignature.
         */
        post: operations["encode_submission"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/estimate_gas_price": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Estimate gas price
         * @description Gives an estimate of the gas unit price required to get a transaction on chain in a
         *     reasonable amount of time. The gas unit price is the amount that each transaction commits to
         *     pay for each unit of gas consumed in executing the transaction. The estimate is based on
         *     recent history: it gives the minimum gas that would have been required to get into recent
         *     blocks, for blocks that were full. (When blocks are not full, the estimate will match the
         *     minimum gas unit price.)
         *
         *     The estimation is given in three values: de-prioritized (low), regular, and prioritized
         *     (aggressive). Using a more aggressive value increases the likelihood that the transaction
         *     will make it into the next block; more aggressive values are computed with a larger history
         *     and higher percentile statistics. More details are in AIP-34.
         */
        get: operations["estimate_gas_price"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/view": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Execute view function of a module
         * @description Execute the Move function with the given parameters and return its execution result.
         *
         *     The Aptos nodes prune account state history, via a configurable time window.
         *     If the requested ledger version has been pruned, the server responds with a 410.
         */
        post: operations["view"];
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
        AbstractSignature: {
            function_info: string;
            auth_data: components["schemas"]["HexEncodedBytes"];
        };
        /**
         * @description Account data
         *
         *     A simplified version of the onchain Account resource
         */
        AccountData: {
            sequence_number: components["schemas"]["U64"];
            authentication_key: components["schemas"]["HexEncodedBytes"];
        };
        /**
         * @description Account signature scheme
         *
         *     The account signature scheme allows you to have two types of accounts:
         *
         *     1. A single Ed25519 key account, one private key
         *     2. A k-of-n multi-Ed25519 key account, multiple private keys, such that k-of-n must sign a transaction.
         *     3. A single Secp256k1Ecdsa key account, one private key
         */
        AccountSignature: components["schemas"]["AccountSignature_Ed25519Signature"] | components["schemas"]["AccountSignature_MultiEd25519Signature"] | components["schemas"]["AccountSignature_SingleKeySignature"] | components["schemas"]["AccountSignature_MultiKeySignature"] | components["schemas"]["AccountSignature_NoAccountSignature"] | components["schemas"]["AccountSignature_AbstractSignature"];
        AccountSignature_AbstractSignature: {
            /**
             * @example abstract_signature
             * @enum {string}
             */
            type: "abstract_signature";
        } & components["schemas"]["AbstractSignature"] & {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            type: "abstract_signature";
        };
        AccountSignature_Ed25519Signature: {
            /**
             * @example ed25519_signature
             * @enum {string}
             */
            type: "ed25519_signature";
        } & components["schemas"]["Ed25519Signature"] & {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            type: "ed25519_signature";
        };
        AccountSignature_MultiEd25519Signature: {
            /**
             * @example multi_ed25519_signature
             * @enum {string}
             */
            type: "multi_ed25519_signature";
        } & components["schemas"]["MultiEd25519Signature"] & {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            type: "multi_ed25519_signature";
        };
        AccountSignature_MultiKeySignature: {
            /**
             * @example multi_key_signature
             * @enum {string}
             */
            type: "multi_key_signature";
        } & components["schemas"]["MultiKeySignature"] & {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            type: "multi_key_signature";
        };
        AccountSignature_NoAccountSignature: {
            /**
             * @example no_account_signature
             * @enum {string}
             */
            type: "no_account_signature";
        } & components["schemas"]["NoAccountSignature"] & {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            type: "no_account_signature";
        };
        AccountSignature_SingleKeySignature: {
            /**
             * @example single_key_signature
             * @enum {string}
             */
            type: "single_key_signature";
        } & components["schemas"]["SingleKeySignature"] & {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            type: "single_key_signature";
        };
        /**
         * Format: hex
         * @description A hex encoded 32 byte Aptos account address.
         *
         *     This is represented in a string as a 64 character hex string, sometimes
         *     shortened by stripping leading 0s, and adding a 0x.
         *
         *     For example, address 0x0000000000000000000000000000000000000000000000000000000000000001 is represented as 0x1.
         * @example 6.195948399647823e+76
         */
        Address: string;
        /**
         * @description This is the generic struct we use for all API errors, it contains a string
         *     message and an Aptos API specific error code.
         */
        AptosError: {
            /** @description A message describing the error */
            message: string;
            error_code: components["schemas"]["AptosErrorCode"];
            /**
             * Format: uint64
             * @description A code providing VM error details when submitting transactions to the VM
             */
            vm_error_code?: number;
        };
        /**
         * @description These codes provide more granular error information beyond just the HTTP
         *     status code of the response.
         * @enum {string}
         */
        AptosErrorCode: "account_not_found" | "resource_not_found" | "module_not_found" | "struct_field_not_found" | "version_not_found" | "transaction_not_found" | "table_item_not_found" | "block_not_found" | "state_value_not_found" | "version_pruned" | "block_pruned" | "invalid_input" | "invalid_transaction_update" | "sequence_number_too_old" | "vm_error" | "rejected_by_filter" | "health_check_failed" | "mempool_is_full" | "rate_limited" | "internal_error" | "web_framework_error" | "bcs_not_supported" | "api_disabled";
        /**
         * Format: hex
         * @description A hex encoded 32 byte Aptos account address or a struct tag.
         *
         *     This is represented in a string as a 64 character hex string, sometimes
         *     shortened by stripping leading 0s, and adding a 0x or
         *     Format: `{address}::{module name}::{struct name}`
         * @example 0x1::aptos_coin::AptosCoin
         */
        AssetType: string;
        /**
         * @description A Block with or without transactions
         *
         *     This contains the information about a transactions along with
         *     associated transactions if requested
         */
        Block: {
            block_height: components["schemas"]["U64"];
            block_hash: components["schemas"]["HashValue"];
            block_timestamp: components["schemas"]["U64"];
            first_version: components["schemas"]["U64"];
            last_version: components["schemas"]["U64"];
            /** @description The transactions in the block in sequential order */
            transactions?: components["schemas"]["Transaction"][];
        };
        BlockEndInfo: {
            block_gas_limit_reached: boolean;
            block_output_limit_reached: boolean;
            /** Format: uint64 */
            block_effective_block_gas_units: number;
            /** Format: uint64 */
            block_approx_output_size: number;
        };
        /** @description A block epilogue transaction */
        BlockEpilogueTransaction: {
            version: components["schemas"]["U64"];
            hash: components["schemas"]["HashValue"];
            state_change_hash: components["schemas"]["HashValue"];
            event_root_hash: components["schemas"]["HashValue"];
            state_checkpoint_hash?: components["schemas"]["HashValue"];
            gas_used: components["schemas"]["U64"];
            /** @description Whether the transaction was successful */
            success: boolean;
            /** @description The VM status of the transaction, can tell useful information in a failure */
            vm_status: string;
            accumulator_root_hash: components["schemas"]["HashValue"];
            /** @description Final state of resources changed by the transaction */
            changes: components["schemas"]["WriteSetChange"][];
            timestamp: components["schemas"]["U64"];
            block_end_info?: components["schemas"]["BlockEndInfo"];
        };
        BlockMetadataExtension: components["schemas"]["BlockMetadataExtension_BlockMetadataExtensionEmpty"] | components["schemas"]["BlockMetadataExtension_BlockMetadataExtensionRandomness"] | components["schemas"]["BlockMetadataExtension_BlockMetadataExtensionRandomnessAndDecKey"] | components["schemas"]["BlockMetadataExtension_BlockMetadataExtensionRandomnessAndDecPayload"];
        BlockMetadataExtensionEmpty: Record<string, never>;
        BlockMetadataExtensionRandomness: {
            randomness?: components["schemas"]["HexEncodedBytes"];
        };
        BlockMetadataExtensionRandomnessAndDecKey: {
            randomness?: components["schemas"]["HexEncodedBytes"];
            decryption_key?: components["schemas"]["HexEncodedBytes"];
        };
        BlockMetadataExtensionRandomnessAndDecPayload: {
            randomness?: components["schemas"]["HexEncodedBytes"];
            decryption_key?: components["schemas"]["HexEncodedBytes"];
            decryption_round?: components["schemas"]["U64"];
        };
        BlockMetadataExtension_BlockMetadataExtensionEmpty: {
            /**
             * @example v0
             * @enum {string}
             */
            type: "v0";
        } & components["schemas"]["BlockMetadataExtensionEmpty"] & {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            type: "v0";
        };
        BlockMetadataExtension_BlockMetadataExtensionRandomness: {
            /**
             * @example v1
             * @enum {string}
             */
            type: "v1";
        } & components["schemas"]["BlockMetadataExtensionRandomness"] & {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            type: "v1";
        };
        BlockMetadataExtension_BlockMetadataExtensionRandomnessAndDecKey: {
            /**
             * @example v2
             * @enum {string}
             */
            type: "v2";
        } & components["schemas"]["BlockMetadataExtensionRandomnessAndDecKey"] & {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            type: "v2";
        };
        BlockMetadataExtension_BlockMetadataExtensionRandomnessAndDecPayload: {
            /**
             * @example v3
             * @enum {string}
             */
            type: "v3";
        } & components["schemas"]["BlockMetadataExtensionRandomnessAndDecPayload"] & {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            type: "v3";
        };
        /**
         * @description A block metadata transaction
         *
         *     This signifies the beginning of a block, and contains information
         *     about the specific block
         */
        BlockMetadataTransaction: {
            version: components["schemas"]["U64"];
            hash: components["schemas"]["HashValue"];
            state_change_hash: components["schemas"]["HashValue"];
            event_root_hash: components["schemas"]["HashValue"];
            state_checkpoint_hash?: components["schemas"]["HashValue"];
            gas_used: components["schemas"]["U64"];
            /** @description Whether the transaction was successful */
            success: boolean;
            /** @description The VM status of the transaction, can tell useful information in a failure */
            vm_status: string;
            accumulator_root_hash: components["schemas"]["HashValue"];
            /** @description Final state of resources changed by the transaction */
            changes: components["schemas"]["WriteSetChange"][];
            id: components["schemas"]["HashValue"];
            epoch: components["schemas"]["U64"];
            round: components["schemas"]["U64"];
            /** @description The events emitted at the block creation */
            events: components["schemas"]["Event"][];
            /** @description Previous block votes */
            previous_block_votes_bitvec: number[];
            proposer: components["schemas"]["Address"];
            /** @description The indices of the proposers who failed to propose */
            failed_proposer_indices: number[];
            timestamp: components["schemas"]["U64"];
            block_metadata_extension?: Omit<components["schemas"]["BlockMetadataExtension"], "type"> & unknown;
        };
        ChunkyDKGResultTransaction: {
            version: components["schemas"]["U64"];
            hash: components["schemas"]["HashValue"];
            state_change_hash: components["schemas"]["HashValue"];
            event_root_hash: components["schemas"]["HashValue"];
            state_checkpoint_hash?: components["schemas"]["HashValue"];
            gas_used: components["schemas"]["U64"];
            /** @description Whether the transaction was successful */
            success: boolean;
            /** @description The VM status of the transaction, can tell useful information in a failure */
            vm_status: string;
            accumulator_root_hash: components["schemas"]["HashValue"];
            /** @description Final state of resources changed by the transaction */
            changes: components["schemas"]["WriteSetChange"][];
            events: components["schemas"]["Event"][];
            timestamp: components["schemas"]["U64"];
            certified_subtrx: components["schemas"]["ExportedCertifiedAggregatedChunkySubtranscript"];
            encryption_key: components["schemas"]["HexEncodedBytes"];
        };
        /**
         * @description An encrypted payload's claim about the entry function. Specifies at least the module address,
         *     and optionally the specific entry funtion.
         */
        ClaimedEntryFunction: {
            module: components["schemas"]["MoveModuleId"];
            name?: components["schemas"]["IdentifierWrapper"];
        };
        DKGResultTransaction: {
            version: components["schemas"]["U64"];
            hash: components["schemas"]["HashValue"];
            state_change_hash: components["schemas"]["HashValue"];
            event_root_hash: components["schemas"]["HashValue"];
            state_checkpoint_hash?: components["schemas"]["HashValue"];
            gas_used: components["schemas"]["U64"];
            /** @description Whether the transaction was successful */
            success: boolean;
            /** @description The VM status of the transaction, can tell useful information in a failure */
            vm_status: string;
            accumulator_root_hash: components["schemas"]["HashValue"];
            /** @description Final state of resources changed by the transaction */
            changes: components["schemas"]["WriteSetChange"][];
            events: components["schemas"]["Event"][];
            timestamp: components["schemas"]["U64"];
            dkg_transcript: components["schemas"]["ExportedDKGTranscript"];
        };
        /** @description Decoded table data */
        DecodedTableData: {
            /** @description Key of table in JSON */
            key: unknown;
            /** @description Type of key */
            key_type: string;
            /** @description Value of table in JSON */
            value: unknown;
            /** @description Type of value */
            value_type: string;
        };
        /** @description Payload has been successfully decrypted. */
        DecryptedPayload: {
            payload_hash: components["schemas"]["HashValue"];
            ciphertext: components["schemas"]["HexEncodedBytes"] & unknown;
            encryption_epoch: components["schemas"]["U64"];
            claimed_entry_fun?: components["schemas"]["ClaimedEntryFunction"];
            decrypted_payload: components["schemas"]["EncryptedTransactionInnerPayload"];
            decryption_nonce: components["schemas"]["HexEncodedBytes"];
        };
        /**
         * @description A higher-limits request backed by a stake pool the fee payer is the
         *     delegated voter of.
         */
        DelegatedVoterLimitsRequest: {
            pool_address: components["schemas"]["Address"];
            multipliers: components["schemas"]["RequestedMultipliers"];
        };
        /**
         * @description A higher-limits request backed by a delegation pool the fee payer delegates
         *     to.
         */
        DelegationPoolDelegatorLimitsRequest: {
            pool_address: components["schemas"]["Address"];
            multipliers: components["schemas"]["RequestedMultipliers"];
        };
        /** @description Delete a module */
        DeleteModule: {
            address: components["schemas"]["Address"];
            /** @description State key hash */
            state_key_hash: string;
            module: components["schemas"]["MoveModuleId"];
        };
        /** @description Delete a resource */
        DeleteResource: {
            address: components["schemas"]["Address"];
            /** @description State key hash */
            state_key_hash: string;
            resource: components["schemas"]["MoveStructTag"];
        };
        /** @description Delete a table item */
        DeleteTableItem: {
            state_key_hash: string;
            handle: components["schemas"]["HexEncodedBytes"];
            key: components["schemas"]["HexEncodedBytes"];
            data?: components["schemas"]["DeletedTableData"];
        };
        /** @description Deleted table data */
        DeletedTableData: {
            /** @description Deleted key */
            key: unknown;
            /** @description Deleted key type */
            key_type: string;
        };
        DeprecatedModuleBundlePayload: Record<string, never>;
        DirectWriteSet: {
            changes: components["schemas"]["WriteSetChange"][];
            events: components["schemas"]["Event"][];
        };
        Ed25519: {
            value: components["schemas"]["HexEncodedBytes"];
        };
        /** @description A single Ed25519 signature */
        Ed25519Signature: {
            public_key: components["schemas"]["HexEncodedBytes"];
            signature: components["schemas"]["HexEncodedBytes"];
        };
        /** @description Request to encode a submission */
        EncodeSubmissionRequest: {
            sender: components["schemas"]["Address"];
            sequence_number: components["schemas"]["U64"];
            max_gas_amount: components["schemas"]["U64"];
            gas_unit_price: components["schemas"]["U64"];
            expiration_timestamp_secs: components["schemas"]["U64"];
            payload: components["schemas"]["TransactionPayload"];
            replay_protection_nonce?: components["schemas"]["U64"];
            /** @description Secondary signer accounts of the request for Multi-agent */
            secondary_signers?: components["schemas"]["Address"][];
        };
        /** @description Payload is still encrypted and cannot be read. */
        EncryptedPayload: {
            payload_hash: components["schemas"]["HashValue"];
            ciphertext: components["schemas"]["HexEncodedBytes"] & unknown;
            encryption_epoch: components["schemas"]["U64"];
            claimed_entry_fun?: components["schemas"]["ClaimedEntryFunction"];
        };
        /** @description The inner payload of an encrypted transaction, present only when decrypted. */
        EncryptedTransactionInnerPayload: components["schemas"]["EncryptedTransactionInnerPayload_EntryFunctionPayload"] | components["schemas"]["EncryptedTransactionInnerPayload_ScriptPayload"] | components["schemas"]["EncryptedTransactionInnerPayload_MultisigPayload"];
        EncryptedTransactionInnerPayload_EntryFunctionPayload: {
            /**
             * @example entry_function_payload
             * @enum {string}
             */
            type: "entry_function_payload";
        } & components["schemas"]["EntryFunctionPayload"] & {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            type: "entry_function_payload";
        };
        EncryptedTransactionInnerPayload_MultisigPayload: {
            /**
             * @example multisig_payload
             * @enum {string}
             */
            type: "multisig_payload";
        } & components["schemas"]["MultisigPayload"] & {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            type: "multisig_payload";
        };
        EncryptedTransactionInnerPayload_ScriptPayload: {
            /**
             * @example script_payload
             * @enum {string}
             */
            type: "script_payload";
        } & components["schemas"]["ScriptPayload"] & {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            type: "script_payload";
        };
        /**
         * @description An encrypted transaction payload, discriminated by encrypted_state.
         *
         *     NOTE: multisig_address and replay_protection_nonce are not surfaced here.
         *     They are part of extra_config and already exposed on UserTransactionRequest.
         *     For Decrypted state, multisig_address is embedded in the MultisigPayload variant
         *     of decrypted_payload.
         */
        EncryptedTransactionPayload: components["schemas"]["EncryptedTransactionPayload_EncryptedPayload"] | components["schemas"]["EncryptedTransactionPayload_FailedDecryptionPayload"] | components["schemas"]["EncryptedTransactionPayload_DecryptedPayload"];
        EncryptedTransactionPayload_DecryptedPayload: {
            /**
             * @example decrypted
             * @enum {string}
             */
            encrypted_state: "decrypted";
        } & components["schemas"]["DecryptedPayload"] & {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            encrypted_state: "decrypted";
        };
        EncryptedTransactionPayload_EncryptedPayload: {
            /**
             * @example encrypted
             * @enum {string}
             */
            encrypted_state: "encrypted";
        } & components["schemas"]["EncryptedPayload"] & {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            encrypted_state: "encrypted";
        };
        EncryptedTransactionPayload_FailedDecryptionPayload: {
            /**
             * @example failed_decryption
             * @enum {string}
             */
            encrypted_state: "failed_decryption";
        } & components["schemas"]["FailedDecryptionPayload"] & {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            encrypted_state: "failed_decryption";
        };
        /**
         * @description Entry function id is string representation of a entry function defined on-chain.
         *
         *     Format: `{address}::{module name}::{function name}`
         *
         *     Both `module name` and `function name` are case-sensitive.
         * @example 0x1::aptos_coin::transfer
         */
        EntryFunctionId: string;
        /** @description Payload which runs a single entry function */
        EntryFunctionPayload: {
            function: components["schemas"]["EntryFunctionId"];
            /** @description Type arguments of the function */
            type_arguments: components["schemas"]["MoveType"][];
            /** @description Arguments of the function */
            arguments: unknown[];
        };
        /** @description An event from a transaction */
        Event: {
            guid: components["schemas"]["EventGuid"];
            sequence_number: components["schemas"]["U64"];
            type: components["schemas"]["MoveType"];
            /** @description The JSON representation of the event */
            data: unknown;
        };
        EventGuid: {
            creation_number: components["schemas"]["U64"];
            account_address: components["schemas"]["Address"];
        };
        /** @description A more API-friendly representation of the on-chain `aptos_types::aggregate_signature::AggregateSignature`. */
        ExportedAggregateSignature: {
            signer_indices: number[];
            sig?: components["schemas"]["HexEncodedBytes"];
        };
        /**
         * @description A more API-friendly representation of the on-chain
         *     `aptos_types::dkg::chunky_dkg::CertifiedAggregatedChunkySubtranscript`.
         */
        ExportedCertifiedAggregatedChunkySubtranscript: {
            epoch: components["schemas"]["U64"];
            author: components["schemas"]["Address"];
            subtrx: components["schemas"]["HexEncodedBytes"];
            signature: components["schemas"]["ExportedAggregateSignature"];
        };
        ExportedDKGTranscript: {
            epoch: components["schemas"]["U64"];
            author: components["schemas"]["Address"];
            payload: components["schemas"]["HexEncodedBytes"];
        };
        /** @description A more API-friendly representation of the on-chain `aptos_types::jwks::ProviderJWKs`. */
        ExportedProviderJWKs: {
            issuer: string;
            /** Format: uint64 */
            version: number;
            jwks: components["schemas"]["JWK"][];
        };
        /** @description A more API-friendly representation of the on-chain `aptos_types::jwks::QuorumCertifiedUpdate`. */
        ExportedQuorumCertifiedUpdate: {
            update: components["schemas"]["ExportedProviderJWKs"];
            multi_sig: components["schemas"]["ExportedAggregateSignature"];
        };
        /** @description Decryption was attempted but failed. */
        FailedDecryptionPayload: {
            payload_hash: components["schemas"]["HashValue"];
            ciphertext: components["schemas"]["HexEncodedBytes"] & unknown;
            encryption_epoch: components["schemas"]["U64"];
            claimed_entry_fun?: components["schemas"]["ClaimedEntryFunction"];
        };
        FederatedKeyless: {
            value: components["schemas"]["HexEncodedBytes"];
        };
        /**
         * @description Fee payer signature for fee payer transactions
         *
         *     This allows you to have transactions across multiple accounts and with a fee payer
         */
        FeePayerSignature: {
            sender: components["schemas"]["AccountSignature"];
            /** @description The other involved parties' addresses */
            secondary_signer_addresses: components["schemas"]["Address"][];
            /** @description The associated signatures, in the same order as the secondary addresses */
            secondary_signers: components["schemas"]["AccountSignature"][];
            fee_payer_address: components["schemas"]["Address"] & unknown;
            fee_payer_signer: Omit<components["schemas"]["AccountSignature"], "type"> & unknown;
        };
        /** @description Struct holding the outputs of the estimate gas API */
        GasEstimation: {
            /**
             * Format: uint64
             * @description The deprioritized estimate for the gas unit price
             */
            deprioritized_gas_estimate?: number;
            /**
             * Format: uint64
             * @description The current estimate for the gas unit price
             */
            gas_estimate: number;
            /**
             * Format: uint64
             * @description The prioritized estimate for the gas unit price
             */
            prioritized_gas_estimate?: number;
        };
        /** @description The writeset payload of the Genesis transaction */
        GenesisPayload: components["schemas"]["GenesisPayload_WriteSetPayload"];
        GenesisPayload_WriteSetPayload: {
            /**
             * @example write_set_payload
             * @enum {string}
             */
            type: "write_set_payload";
        } & components["schemas"]["WriteSetPayload"] & {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            type: "write_set_payload";
        };
        /**
         * @description The genesis transaction
         *
         *     This only occurs at the genesis transaction (version 0)
         */
        GenesisTransaction: {
            version: components["schemas"]["U64"];
            hash: components["schemas"]["HashValue"];
            state_change_hash: components["schemas"]["HashValue"];
            event_root_hash: components["schemas"]["HashValue"];
            state_checkpoint_hash?: components["schemas"]["HashValue"];
            gas_used: components["schemas"]["U64"];
            /** @description Whether the transaction was successful */
            success: boolean;
            /** @description The VM status of the transaction, can tell useful information in a failure */
            vm_status: string;
            accumulator_root_hash: components["schemas"]["HashValue"];
            /** @description Final state of resources changed by the transaction */
            changes: components["schemas"]["WriteSetChange"][];
            payload: components["schemas"]["GenesisPayload"];
            /** @description Events emitted during genesis */
            events: components["schemas"]["Event"][];
        };
        HashValue: string;
        /** @description Representation of a successful healthcheck */
        HealthCheckSuccess: {
            message: string;
        };
        /**
         * Format: hex
         * @description All bytes (Vec<u8>) data is represented as hex-encoded string prefixed with `0x` and fulfilled with
         *     two hex digits per byte.
         *
         *     Unlike the `Address` type, HexEncodedBytes will not trim any zeros.
         * @example 6.195948399647823e+76
         */
        HexEncodedBytes: string;
        /**
         * Format: int128
         * @description A string containing a 128-bit signed integer.
         *
         *     We represent i128 values as a string to ensure compatibility with languages such
         *     as JavaScript that do not parse i128s in JSON natively.
         * @example -32425224034
         */
        I128: string;
        /**
         * Format: int256
         * @description A string containing a 256-bit signed integer.
         *
         *     We represent i256 values as a string to ensure compatibility with languages such
         *     as JavaScript that do not parse i256s in JSON natively.
         * @example -32425224034
         */
        I256: string;
        /**
         * Format: int64
         * @description A string containing a 64-bit signed integer.
         *
         *     We represent i64 values as a string to ensure compatibility with languages such
         *     as JavaScript that do not parse i64s in JSON natively.
         * @example -32425224034
         */
        I64: string;
        IdentifierWrapper: string;
        /**
         * @description The struct holding all data returned to the client by the
         *     index endpoint (i.e., GET "/").  Only for responding in JSON
         */
        IndexResponse: {
            /**
             * Format: uint8
             * @description Chain ID of the current chain
             */
            chain_id: number;
            epoch: components["schemas"]["U64"];
            ledger_version: components["schemas"]["U64"];
            oldest_ledger_version: components["schemas"]["U64"];
            ledger_timestamp: components["schemas"]["U64"];
            node_role: components["schemas"]["RoleType"];
            oldest_block_height: components["schemas"]["U64"];
            block_height: components["schemas"]["U64"];
            /**
             * @description Git hash of the build of the API endpoint.  Can be used to determine the exact
             *     software version used by the API endpoint.
             */
            git_hash?: string;
            /** @description Per-epoch transaction encryption key (hex-encoded) */
            encryption_key?: string;
        };
        IndexedSignature: {
            /** Format: uint8 */
            index: number;
            signature: components["schemas"]["Signature"];
        };
        /** @description The JWK type that can be converted from/to `JWKMoveStruct` but easier to use in rust. */
        JWK: components["schemas"]["RSA_JWK"] | components["schemas"]["UnsupportedJWK"];
        JWKUpdateTransaction: {
            version: components["schemas"]["U64"];
            hash: components["schemas"]["HashValue"];
            state_change_hash: components["schemas"]["HashValue"];
            event_root_hash: components["schemas"]["HashValue"];
            state_checkpoint_hash?: components["schemas"]["HashValue"];
            gas_used: components["schemas"]["U64"];
            /** @description Whether the transaction was successful */
            success: boolean;
            /** @description The VM status of the transaction, can tell useful information in a failure */
            vm_status: string;
            accumulator_root_hash: components["schemas"]["HashValue"];
            /** @description Final state of resources changed by the transaction */
            changes: components["schemas"]["WriteSetChange"][];
            events: components["schemas"]["Event"][];
            timestamp: components["schemas"]["U64"];
            quorum_certified_update: components["schemas"]["ExportedQuorumCertifiedUpdate"];
        };
        Keyless: {
            value: components["schemas"]["HexEncodedBytes"];
        };
        MoveAbility: string;
        /** @description Move function */
        MoveFunction: {
            name: components["schemas"]["IdentifierWrapper"];
            visibility: components["schemas"]["MoveFunctionVisibility"];
            /** @description Whether the function can be called as an entry function directly in a transaction */
            is_entry: boolean;
            /** @description Whether the function is a view function or not */
            is_view: boolean;
            /** @description Generic type params associated with the Move function */
            generic_type_params: components["schemas"]["MoveFunctionGenericTypeParam"][];
            /** @description Parameters associated with the move function */
            params: components["schemas"]["MoveType"][];
            /** @description Return type of the function */
            return: components["schemas"]["MoveType"][];
        };
        /** @description Move function generic type param */
        MoveFunctionGenericTypeParam: {
            /** @description Move abilities tied to the generic type param and associated with the function that uses it */
            constraints: components["schemas"]["MoveAbility"][];
        };
        /**
         * @description Move function visibility
         * @enum {string}
         */
        MoveFunctionVisibility: "private" | "public" | "friend";
        /** @description A Move module */
        MoveModule: {
            address: components["schemas"]["Address"];
            name: components["schemas"]["IdentifierWrapper"];
            /** @description Friends of the module */
            friends: components["schemas"]["MoveModuleId"][];
            /** @description Public functions of the module */
            exposed_functions: components["schemas"]["MoveFunction"][];
            /** @description Structs of the module */
            structs: components["schemas"]["MoveStruct"][];
        };
        /** @description Move module bytecode along with it's ABI */
        MoveModuleBytecode: {
            bytecode: components["schemas"]["HexEncodedBytes"];
            abi?: components["schemas"]["MoveModule"];
        };
        /**
         * @description Move module id is a string representation of Move module.
         *
         *     Format: `{address}::{module name}`
         *
         *     `address` should be hex-encoded 32 byte account address that is prefixed with `0x`.
         *
         *     Module name is case-sensitive.
         * @example 0x1::aptos_coin
         */
        MoveModuleId: string;
        /** @description A parsed Move resource */
        MoveResource: {
            type: components["schemas"]["MoveStructTag"];
            data: components["schemas"]["MoveStructValue"];
        };
        /** @description Move script bytecode */
        MoveScriptBytecode: {
            bytecode: components["schemas"]["HexEncodedBytes"];
            abi?: components["schemas"]["MoveFunction"];
        };
        /** @description A move struct */
        MoveStruct: {
            name: components["schemas"]["IdentifierWrapper"];
            /** @description Whether the struct is a native struct of Move */
            is_native: boolean;
            /** @description Whether the struct is marked with the #[event] annotation */
            is_event: boolean;
            /** @description Whether the struct is an enum (i.e. enum MyEnum vs struct MyStruct). */
            is_enum: boolean;
            /** @description Abilities associated with the struct */
            abilities: components["schemas"]["MoveAbility"][];
            /** @description Generic types associated with the struct */
            generic_type_params: components["schemas"]["MoveStructGenericTypeParam"][];
            /** @description Fields associated with the struct */
            fields: components["schemas"]["MoveStructField"][];
            /** @description Variants of the enum. Only populated when `is_enum` is true. */
            variants: components["schemas"]["MoveStructVariant"][];
        };
        /** @description Move struct field */
        MoveStructField: {
            name: components["schemas"]["IdentifierWrapper"];
            type: components["schemas"]["MoveType"];
        };
        /** @description Move generic type param */
        MoveStructGenericTypeParam: {
            /** @description Move abilities tied to the generic type param and associated with the type that uses it */
            constraints: components["schemas"]["MoveAbility"][];
        };
        /**
         * @description String representation of a MoveStructTag (on-chain Move struct type). This exists so you
         *     can specify MoveStructTags as path / query parameters, e.g. for get_events_by_event_handle.
         *
         *     It is a combination of:
         *       1. `move_module_address`, `module_name` and `struct_name`, all joined by `::`
         *       2. `struct generic type parameters` joined by `, `
         *
         *     Examples:
         *       * `0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>`
         *       * `0x1::account::Account`
         *
         *     Note:
         *       1. Empty chars should be ignored when comparing 2 struct tag ids.
         *       2. When used in an URL path, should be encoded by url-encoding (AKA percent-encoding).
         *
         *     See [doc](https://aptos.dev/concepts/accounts) for more details.
         * @example 0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>
         */
        MoveStructTag: string;
        /**
         * @description This is a JSON representation of some data within an account resource. More specifically,
         *     it is a map of strings to arbitrary JSON values / objects, where the keys are top level
         *     fields within the given resource.
         *
         *     To clarify, you might query for 0x1::account::Account and see the example data.
         *
         *     Move `bool` type value is serialized into `boolean`.
         *
         *     Move `u8`, `u16`, `u32`, `i8`, `i16`, and `i32` type value is serialized into `integer`.
         *
         *     Move `u64`, `u128`, `u256`, `i64`, `i128`, and `i256` type value is serialized into `string`.
         *
         *     Move `address` type value (32 byte Aptos account address) is serialized into a HexEncodedBytes string.
         *     For example:
         *       - `0x1`
         *       - `0x1668f6be25668c1a17cd8caf6b8d2f25`
         *
         *     Move `vector` type value is serialized into `array`, except `vector<u8>` which is serialized into a
         *     HexEncodedBytes string with `0x` prefix.
         *     For example:
         *       - `vector<u64>{255, 255}` => `["255", "255"]`
         *       - `vector<u8>{255, 255}` => `0xffff`
         *
         *     Move `struct` type value is serialized into `object` that looks like this (except some Move stdlib types, see the following section):
         *       ```json
         *       {
         *         field1_name: field1_value,
         *         field2_name: field2_value,
         *         ......
         *       }
         *       ```
         *
         *     For example:
         *       `{ "created": "0xa550c18", "role_id": "0" }`
         *
         *     **Special serialization for Move stdlib types**:
         *       - [0x1::string::String](https://github.com/aptos-labs/aptos-core/blob/main/third_party/move/move-stdlib/docs/ascii.md)
         *         is serialized into `string`. For example, struct value `0x1::string::String{bytes: b"Hello World!"}`
         *         is serialized as `"Hello World!"` in JSON.
         * @example {
         *       "authentication_key": "0x0000000000000000000000000000000000000000000000000000000000000001",
         *       "coin_register_events": {
         *         "counter": "0",
         *         "guid": {
         *           "id": {
         *             "addr": "0x1",
         *             "creation_num": "0"
         *           }
         *         }
         *       },
         *       "self_address": "0x1",
         *       "sequence_number": "0"
         *     }
         */
        MoveStructValue: Record<string, never>;
        /** @description A single variant of a Move enum. */
        MoveStructVariant: {
            name: components["schemas"]["IdentifierWrapper"];
            /** @description Fields associated with the variant, if any. */
            fields: components["schemas"]["MoveStructField"][];
        };
        /**
         * @description String representation of an on-chain Move type tag that is exposed in transaction payload.
         *         Values:
         *           - bool
         *           - u8
         *           - u16
         *           - u32
         *           - u64
         *           - u128
         *           - u256
         *           - i8
         *           - i16
         *           - i32
         *           - i64
         *           - i128
         *           - i256
         *           - address
         *           - signer
         *           - vector: `vector<{non-reference MoveTypeId}>`
         *           - struct: `{address}::{module_name}::{struct_name}::<{generic types}>`
         *
         *         Vector type value examples:
         *           - `vector<u8>`
         *           - `vector<vector<u64>>`
         *           - `vector<0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>>`
         *
         *         Struct type value examples:
         *           - `0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>
         *           - `0x1::account::Account`
         *
         *         Note:
         *           1. Empty chars should be ignored when comparing 2 struct tag ids.
         *           2. When used in an URL path, should be encoded by url-encoding (AKA percent-encoding).
         */
        MoveType: string;
        /** @description An enum of the possible Move value types */
        MoveValue: number | components["schemas"]["U64"] | components["schemas"]["U128"] | components["schemas"]["U256"] | components["schemas"]["I64"] | components["schemas"]["I128"] | components["schemas"]["I256"] | boolean | components["schemas"]["Address"] | components["schemas"]["MoveValue"][] | components["schemas"]["HexEncodedBytes"] | components["schemas"]["MoveStructValue"] | string;
        /**
         * @description Multi agent signature for multi agent transactions
         *
         *     This allows you to have transactions across multiple accounts
         */
        MultiAgentSignature: {
            sender: components["schemas"]["AccountSignature"];
            /** @description The other involved parties' addresses */
            secondary_signer_addresses: components["schemas"]["Address"][];
            /** @description The associated signatures, in the same order as the secondary addresses */
            secondary_signers: components["schemas"]["AccountSignature"][];
        };
        /**
         * @description A Ed25519 multi-sig signature
         *
         *     This allows k-of-n signing for a transaction
         */
        MultiEd25519Signature: {
            /** @description The public keys for the Ed25519 signature */
            public_keys: components["schemas"]["HexEncodedBytes"][];
            /** @description Signature associated with the public keys in the same order */
            signatures: components["schemas"]["HexEncodedBytes"][];
            /**
             * Format: uint8
             * @description The number of signatures required for a successful transaction
             */
            threshold: number;
            bitmap: components["schemas"]["HexEncodedBytes"];
        };
        /** @description A multi key signature */
        MultiKeySignature: {
            public_keys: components["schemas"]["PublicKey"][];
            signatures: components["schemas"]["IndexedSignature"][];
            /** Format: uint8 */
            signatures_required: number;
        };
        /**
         * @description A multisig transaction that allows an owner of a multisig account to execute a pre-approved
         *     transaction as the multisig account.
         */
        MultisigPayload: {
            multisig_address: components["schemas"]["Address"];
            transaction_payload?: components["schemas"]["MultisigTransactionPayload"];
        };
        /** @description Enum for multisig transaction payloads, supporting both entry functions and scripts. */
        MultisigTransactionPayload: components["schemas"]["MultisigTransactionPayload_EntryFunctionPayload"] | components["schemas"]["MultisigTransactionPayload_ScriptPayload"];
        MultisigTransactionPayload_EntryFunctionPayload: {
            /**
             * @example entry_function_payload
             * @enum {string}
             */
            type: "entry_function_payload";
        } & components["schemas"]["EntryFunctionPayload"] & {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            type: "entry_function_payload";
        };
        MultisigTransactionPayload_ScriptPayload: {
            /**
             * @example script_payload
             * @enum {string}
             */
            type: "script_payload";
        } & components["schemas"]["ScriptPayload"] & {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            type: "script_payload";
        };
        /** @description A placeholder to represent the absence of account signature */
        NoAccountSignature: Record<string, never>;
        /** @description A transaction waiting in mempool */
        PendingTransaction: {
            hash: components["schemas"]["HashValue"];
            sender: components["schemas"]["Address"];
            sequence_number: components["schemas"]["U64"];
            max_gas_amount: components["schemas"]["U64"];
            gas_unit_price: components["schemas"]["U64"];
            expiration_timestamp_secs: components["schemas"]["U64"];
            payload: components["schemas"]["TransactionPayload"];
            signature?: components["schemas"]["TransactionSignature"];
            replay_protection_nonce?: components["schemas"]["U64"];
            txn_limits_request?: components["schemas"]["UserTxnLimitsRequest"];
        };
        /** @description API representation of persisted auxiliary transaction information */
        PersistedAuxiliaryInfo: {
            /**
             * Format: uint32
             * @description Optional transaction index in the block (None indicates no auxiliary info available)
             */
            transaction_index?: number;
        };
        PublicKey: components["schemas"]["PublicKey_Ed25519"] | components["schemas"]["PublicKey_Secp256k1Ecdsa"] | components["schemas"]["PublicKey_Secp256r1Ecdsa"] | components["schemas"]["PublicKey_Keyless"] | components["schemas"]["PublicKey_FederatedKeyless"] | components["schemas"]["PublicKey_SlhDsa_Sha2_128s"];
        PublicKey_Ed25519: {
            /**
             * @example ed25519
             * @enum {string}
             */
            type: "ed25519";
        } & components["schemas"]["Ed25519"] & {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            type: "ed25519";
        };
        PublicKey_FederatedKeyless: {
            /**
             * @example federated_keyless
             * @enum {string}
             */
            type: "federated_keyless";
        } & components["schemas"]["FederatedKeyless"] & {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            type: "federated_keyless";
        };
        PublicKey_Keyless: {
            /**
             * @example keyless
             * @enum {string}
             */
            type: "keyless";
        } & components["schemas"]["Keyless"] & {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            type: "keyless";
        };
        PublicKey_Secp256k1Ecdsa: {
            /**
             * @example secp256k1_ecdsa
             * @enum {string}
             */
            type: "secp256k1_ecdsa";
        } & components["schemas"]["Secp256k1Ecdsa"] & {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            type: "secp256k1_ecdsa";
        };
        PublicKey_Secp256r1Ecdsa: {
            /**
             * @example secp256r1_ecdsa
             * @enum {string}
             */
            type: "secp256r1_ecdsa";
        } & components["schemas"]["Secp256r1Ecdsa"] & {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            type: "secp256r1_ecdsa";
        };
        PublicKey_SlhDsa_Sha2_128s: {
            /**
             * @example slh_dsa__sha2_128s
             * @enum {string}
             */
            type: "slh_dsa__sha2_128s";
        } & components["schemas"]["SlhDsa_Sha2_128s"] & {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            type: "slh_dsa__sha2_128s";
        };
        /**
         * @description Move type `0x1::jwks::RSA_JWK` in rust.
         *     See its doc in Move for more details.
         */
        RSA_JWK: {
            kid: string;
            kty: string;
            alg: string;
            e: string;
            n: string;
        };
        /** @description Table Item request for the GetTableItemRaw API */
        RawTableItemRequest: {
            key: components["schemas"]["HexEncodedBytes"];
        };
        ReplayProtector: components["schemas"]["ReplayProtector_string(U64)"] | components["schemas"]["ReplayProtector_string(U64)"];
        "ReplayProtector_string(U64)": {
            /**
             * @example sequence_number
             * @enum {string}
             */
            type: "sequence_number";
        } & components["schemas"]["U64"] & {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            type: "nonce" | "sequence_number";
        };
        /**
         * @description Multipliers for higher transaction limits, expressed as percent of the base
         *     limit (100 = 1x, 200 = 2x, 250 = 2.5x).
         */
        RequestedMultipliers: {
            execution_multiplier_percent: components["schemas"]["U64"];
            io_multiplier_percent: components["schemas"]["U64"];
        };
        /** @enum {string} */
        RoleType: "validator" | "full_node";
        /** @description Payload which runs a script that can run multiple functions */
        ScriptPayload: {
            code: components["schemas"]["MoveScriptBytecode"];
            /** @description Type arguments of the function */
            type_arguments: components["schemas"]["MoveType"][];
            /** @description Arguments of the function */
            arguments: unknown[];
        };
        ScriptWriteSet: {
            execute_as: components["schemas"]["Address"];
            script: components["schemas"]["ScriptPayload"];
        };
        Secp256k1Ecdsa: {
            value: components["schemas"]["HexEncodedBytes"];
        };
        Secp256r1Ecdsa: {
            value: components["schemas"]["HexEncodedBytes"];
        };
        Signature: components["schemas"]["Signature_Ed25519"] | components["schemas"]["Signature_Secp256k1Ecdsa"] | components["schemas"]["Signature_WebAuthn"] | components["schemas"]["Signature_Keyless"] | components["schemas"]["Signature_SlhDsa_Sha2_128s"];
        Signature_Ed25519: {
            /**
             * @example ed25519
             * @enum {string}
             */
            type: "ed25519";
        } & components["schemas"]["Ed25519"] & {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            type: "ed25519";
        };
        Signature_Keyless: {
            /**
             * @example keyless
             * @enum {string}
             */
            type: "keyless";
        } & components["schemas"]["Keyless"] & {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            type: "keyless";
        };
        Signature_Secp256k1Ecdsa: {
            /**
             * @example secp256k1_ecdsa
             * @enum {string}
             */
            type: "secp256k1_ecdsa";
        } & components["schemas"]["Secp256k1Ecdsa"] & {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            type: "secp256k1_ecdsa";
        };
        Signature_SlhDsa_Sha2_128s: {
            /**
             * @example slh_dsa__sha2_128s
             * @enum {string}
             */
            type: "slh_dsa__sha2_128s";
        } & components["schemas"]["SlhDsa_Sha2_128s"] & {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            type: "slh_dsa__sha2_128s";
        };
        Signature_WebAuthn: {
            /**
             * @example web_authn
             * @enum {string}
             */
            type: "web_authn";
        } & components["schemas"]["WebAuthn"] & {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            type: "web_authn";
        };
        /** @description A single key signature */
        SingleKeySignature: {
            public_key: components["schemas"]["PublicKey"];
            signature: components["schemas"]["Signature"];
        };
        SlhDsa_Sha2_128s: {
            value: components["schemas"]["HexEncodedBytes"];
        };
        /** @description A higher-limits request whose backing is a stake pool the fee payer owns. */
        StakePoolOwnerLimitsRequest: {
            multipliers: components["schemas"]["RequestedMultipliers"];
        };
        /** @description A state checkpoint transaction */
        StateCheckpointTransaction: {
            version: components["schemas"]["U64"];
            hash: components["schemas"]["HashValue"];
            state_change_hash: components["schemas"]["HashValue"];
            event_root_hash: components["schemas"]["HashValue"];
            state_checkpoint_hash?: components["schemas"]["HashValue"];
            gas_used: components["schemas"]["U64"];
            /** @description Whether the transaction was successful */
            success: boolean;
            /** @description The VM status of the transaction, can tell useful information in a failure */
            vm_status: string;
            accumulator_root_hash: components["schemas"]["HashValue"];
            /** @description Final state of resources changed by the transaction */
            changes: components["schemas"]["WriteSetChange"][];
            timestamp: components["schemas"]["U64"];
        };
        /**
         * @description Representation of a StateKey as a hex string. This is used for cursor based pagination.
         * @example 0000000000000000000000000000000000000000000000000000000000000000012f0000000000000000000000000000000000000000000000000000000000000000010d7374616b696e675f70726f7879
         */
        StateKeyWrapper: string;
        /**
         * @description A request to submit a transaction
         *
         *     This requires a transaction and a signature of it
         */
        SubmitTransactionRequest: {
            sender: components["schemas"]["Address"];
            sequence_number: components["schemas"]["U64"];
            max_gas_amount: components["schemas"]["U64"];
            gas_unit_price: components["schemas"]["U64"];
            expiration_timestamp_secs: components["schemas"]["U64"];
            payload: components["schemas"]["TransactionPayload"];
            replay_protection_nonce?: components["schemas"]["U64"];
            signature: components["schemas"]["TransactionSignature"];
        };
        /** @description Table Item request for the GetTableItem API */
        TableItemRequest: {
            key_type: components["schemas"]["MoveType"];
            value_type: components["schemas"]["MoveType"];
            /** @description The value of the table item's key */
            key: unknown;
        };
        /** @description Enum of the different types of transactions in Aptos */
        Transaction: components["schemas"]["Transaction_PendingTransaction"] | components["schemas"]["Transaction_UserTransaction"] | components["schemas"]["Transaction_GenesisTransaction"] | components["schemas"]["Transaction_BlockMetadataTransaction"] | components["schemas"]["Transaction_StateCheckpointTransaction"] | components["schemas"]["Transaction_BlockEpilogueTransaction"] | components["schemas"]["Transaction_ValidatorTransaction"];
        /** @description An enum of the possible transaction payloads */
        TransactionPayload: components["schemas"]["TransactionPayload_EntryFunctionPayload"] | components["schemas"]["TransactionPayload_ScriptPayload"] | components["schemas"]["TransactionPayload_DeprecatedModuleBundlePayload"] | components["schemas"]["TransactionPayload_MultisigPayload"] | components["schemas"]["TransactionPayload_EncryptedTransactionPayload"];
        TransactionPayload_DeprecatedModuleBundlePayload: {
            /**
             * @example module_bundle_payload
             * @enum {string}
             */
            type: "module_bundle_payload";
        } & components["schemas"]["DeprecatedModuleBundlePayload"] & {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            type: "module_bundle_payload";
        };
        TransactionPayload_EncryptedTransactionPayload: {
            /**
             * @example encrypted_transaction_payload
             * @enum {string}
             */
            type: "encrypted_transaction_payload";
        } & Omit<components["schemas"]["EncryptedTransactionPayload"], "encrypted_state"> & {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            type: "encrypted_transaction_payload";
        };
        TransactionPayload_EntryFunctionPayload: {
            /**
             * @example entry_function_payload
             * @enum {string}
             */
            type: "entry_function_payload";
        } & components["schemas"]["EntryFunctionPayload"] & {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            type: "entry_function_payload";
        };
        TransactionPayload_MultisigPayload: {
            /**
             * @example multisig_payload
             * @enum {string}
             */
            type: "multisig_payload";
        } & components["schemas"]["MultisigPayload"] & {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            type: "multisig_payload";
        };
        TransactionPayload_ScriptPayload: {
            /**
             * @example script_payload
             * @enum {string}
             */
            type: "script_payload";
        } & components["schemas"]["ScriptPayload"] & {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            type: "script_payload";
        };
        /** @description An enum representing the different transaction signatures available */
        TransactionSignature: components["schemas"]["TransactionSignature_Ed25519Signature"] | components["schemas"]["TransactionSignature_MultiEd25519Signature"] | components["schemas"]["TransactionSignature_MultiAgentSignature"] | components["schemas"]["TransactionSignature_FeePayerSignature"] | components["schemas"]["TransactionSignature_AccountSignature"] | components["schemas"]["TransactionSignature_NoAccountSignature"];
        TransactionSignature_AccountSignature: {
            /**
             * @example single_sender
             * @enum {string}
             */
            type: "single_sender";
        } & Omit<components["schemas"]["AccountSignature"], "type"> & {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            type: "single_sender";
        };
        TransactionSignature_Ed25519Signature: {
            /**
             * @example ed25519_signature
             * @enum {string}
             */
            type: "ed25519_signature";
        } & components["schemas"]["Ed25519Signature"] & {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            type: "ed25519_signature";
        };
        TransactionSignature_FeePayerSignature: {
            /**
             * @example fee_payer_signature
             * @enum {string}
             */
            type: "fee_payer_signature";
        } & components["schemas"]["FeePayerSignature"] & {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            type: "fee_payer_signature";
        };
        TransactionSignature_MultiAgentSignature: {
            /**
             * @example multi_agent_signature
             * @enum {string}
             */
            type: "multi_agent_signature";
        } & components["schemas"]["MultiAgentSignature"] & {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            type: "multi_agent_signature";
        };
        TransactionSignature_MultiEd25519Signature: {
            /**
             * @example multi_ed25519_signature
             * @enum {string}
             */
            type: "multi_ed25519_signature";
        } & components["schemas"]["MultiEd25519Signature"] & {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            type: "multi_ed25519_signature";
        };
        TransactionSignature_NoAccountSignature: {
            /**
             * @example no_account_signature
             * @enum {string}
             */
            type: "no_account_signature";
        } & components["schemas"]["NoAccountSignature"] & {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            type: "no_account_signature";
        };
        TransactionSummary: {
            sender: components["schemas"]["Address"];
            version: components["schemas"]["U64"];
            transaction_hash: components["schemas"]["HashValue"];
            replay_protector: components["schemas"]["ReplayProtector"];
        };
        Transaction_BlockEpilogueTransaction: {
            /**
             * @example block_epilogue_transaction
             * @enum {string}
             */
            type: "block_epilogue_transaction";
        } & components["schemas"]["BlockEpilogueTransaction"] & {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            type: "block_epilogue_transaction";
        };
        Transaction_BlockMetadataTransaction: {
            /**
             * @example block_metadata_transaction
             * @enum {string}
             */
            type: "block_metadata_transaction";
        } & components["schemas"]["BlockMetadataTransaction"] & {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            type: "block_metadata_transaction";
        };
        Transaction_GenesisTransaction: {
            /**
             * @example genesis_transaction
             * @enum {string}
             */
            type: "genesis_transaction";
        } & components["schemas"]["GenesisTransaction"] & {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            type: "genesis_transaction";
        };
        Transaction_PendingTransaction: {
            /**
             * @example pending_transaction
             * @enum {string}
             */
            type: "pending_transaction";
        } & components["schemas"]["PendingTransaction"] & {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            type: "pending_transaction";
        };
        Transaction_StateCheckpointTransaction: {
            /**
             * @example state_checkpoint_transaction
             * @enum {string}
             */
            type: "state_checkpoint_transaction";
        } & components["schemas"]["StateCheckpointTransaction"] & {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            type: "state_checkpoint_transaction";
        };
        Transaction_UserTransaction: {
            /**
             * @example user_transaction
             * @enum {string}
             */
            type: "user_transaction";
        } & components["schemas"]["UserTransaction"] & {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            type: "user_transaction";
        };
        Transaction_ValidatorTransaction: {
            /**
             * @example validator_transaction
             * @enum {string}
             */
            type: "validator_transaction";
        } & Omit<components["schemas"]["ValidatorTransaction"], "validator_transaction_type"> & {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            type: "validator_transaction";
        };
        /** @description Information telling which batch submission transactions failed */
        TransactionsBatchSingleSubmissionFailure: {
            error: components["schemas"]["AptosError"];
            /**
             * Format: uint64
             * @description The index of which transaction failed, same as submission order
             */
            transaction_index: number;
        };
        /**
         * @description Batch transaction submission result
         *
         *     Tells which transactions failed
         */
        TransactionsBatchSubmissionResult: {
            /** @description Summary of the failed transactions */
            transaction_failures: components["schemas"]["TransactionsBatchSingleSubmissionFailure"][];
        };
        /**
         * Format: uint128
         * @description A string containing a 128-bit unsigned integer.
         *
         *     We represent u128 values as a string to ensure compatibility with languages such
         *     as JavaScript that do not parse u128s in JSON natively.
         * @example 340282366920938463463374607431768211454
         */
        U128: string;
        /**
         * Format: uint256
         * @description A string containing a 256-bit unsigned integer.
         *
         *     We represent u256 values as a string to ensure compatibility with languages such
         *     as JavaScript that do not parse u256s in JSON natively.
         * @example 340282366920938463463374607431768211454
         */
        U256: string;
        /**
         * Format: uint64
         * @description A string containing a 64-bit unsigned integer.
         *
         *     We represent u64 values as a string to ensure compatibility with languages such
         *     as JavaScript that do not parse u64s in JSON natively.
         * @example 32425224034
         */
        U64: string;
        /**
         * @description Move type `0x1::jwks::UnsupportedJWK` in rust.
         *     See its doc in Move for more details.
         */
        UnsupportedJWK: {
            id: number[];
            payload: number[];
        };
        /** @description A transaction submitted by a user to change the state of the blockchain */
        UserTransaction: {
            version: components["schemas"]["U64"];
            hash: components["schemas"]["HashValue"];
            state_change_hash: components["schemas"]["HashValue"];
            event_root_hash: components["schemas"]["HashValue"];
            state_checkpoint_hash?: components["schemas"]["HashValue"];
            gas_used: components["schemas"]["U64"];
            /** @description Whether the transaction was successful */
            success: boolean;
            /** @description The VM status of the transaction, can tell useful information in a failure */
            vm_status: string;
            accumulator_root_hash: components["schemas"]["HashValue"];
            /** @description Final state of resources changed by the transaction */
            changes: components["schemas"]["WriteSetChange"][];
            sender: components["schemas"]["Address"];
            sequence_number: components["schemas"]["U64"];
            max_gas_amount: components["schemas"]["U64"];
            gas_unit_price: components["schemas"]["U64"];
            expiration_timestamp_secs: components["schemas"]["U64"];
            payload: components["schemas"]["TransactionPayload"];
            signature?: components["schemas"]["TransactionSignature"];
            replay_protection_nonce?: components["schemas"]["U64"];
            txn_limits_request?: components["schemas"]["UserTxnLimitsRequest"];
            /** @description Events generated by the transaction */
            events: components["schemas"]["Event"][];
            timestamp: components["schemas"]["U64"];
        };
        /** @description A request for higher transaction execution limits, backed by a staking proof. */
        UserTxnLimitsRequest: components["schemas"]["UserTxnLimitsRequest_StakePoolOwnerLimitsRequest"] | components["schemas"]["UserTxnLimitsRequest_DelegatedVoterLimitsRequest"] | components["schemas"]["UserTxnLimitsRequest_DelegationPoolDelegatorLimitsRequest"];
        UserTxnLimitsRequest_DelegatedVoterLimitsRequest: {
            /**
             * @example delegated_voter
             * @enum {string}
             */
            type: "delegated_voter";
        } & components["schemas"]["DelegatedVoterLimitsRequest"] & {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            type: "delegated_voter";
        };
        UserTxnLimitsRequest_DelegationPoolDelegatorLimitsRequest: {
            /**
             * @example delegation_pool_delegator
             * @enum {string}
             */
            type: "delegation_pool_delegator";
        } & components["schemas"]["DelegationPoolDelegatorLimitsRequest"] & {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            type: "delegation_pool_delegator";
        };
        UserTxnLimitsRequest_StakePoolOwnerLimitsRequest: {
            /**
             * @example stake_pool_owner
             * @enum {string}
             */
            type: "stake_pool_owner";
        } & components["schemas"]["StakePoolOwnerLimitsRequest"] & {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            type: "stake_pool_owner";
        };
        ValidatorTransaction: components["schemas"]["ValidatorTransaction_JWKUpdateTransaction"] | components["schemas"]["ValidatorTransaction_DKGResultTransaction"] | components["schemas"]["ValidatorTransaction_ChunkyDKGResultTransaction"];
        ValidatorTransaction_ChunkyDKGResultTransaction: {
            /**
             * @example chunky_d_k_g_result
             * @enum {string}
             */
            validator_transaction_type: "chunky_d_k_g_result";
        } & components["schemas"]["ChunkyDKGResultTransaction"] & {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            validator_transaction_type: "chunky_d_k_g_result";
        };
        ValidatorTransaction_DKGResultTransaction: {
            /**
             * @example dkg_result
             * @enum {string}
             */
            validator_transaction_type: "dkg_result";
        } & components["schemas"]["DKGResultTransaction"] & {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            validator_transaction_type: "dkg_result";
        };
        ValidatorTransaction_JWKUpdateTransaction: {
            /**
             * @example observed_jwk_update
             * @enum {string}
             */
            validator_transaction_type: "observed_jwk_update";
        } & components["schemas"]["JWKUpdateTransaction"] & {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            validator_transaction_type: "observed_jwk_update";
        };
        /** @description An event from a transaction with a version */
        VersionedEvent: {
            version: components["schemas"]["U64"];
            guid: components["schemas"]["EventGuid"];
            sequence_number: components["schemas"]["U64"];
            type: components["schemas"]["MoveType"];
            /** @description The JSON representation of the event */
            data: unknown;
        };
        /** @description View request for the Move View Function API */
        ViewRequest: {
            function: components["schemas"]["EntryFunctionId"];
            /** @description Type arguments of the function */
            type_arguments: components["schemas"]["MoveType"][];
            /** @description Arguments of the function */
            arguments: unknown[];
        };
        WebAuthn: {
            value: components["schemas"]["HexEncodedBytes"];
        };
        /** @description Write a new module or update an existing one */
        WriteModule: {
            address: components["schemas"]["Address"];
            /** @description State key hash */
            state_key_hash: string;
            data: components["schemas"]["MoveModuleBytecode"];
        };
        /** @description Write a resource or update an existing one */
        WriteResource: {
            address: components["schemas"]["Address"];
            /** @description State key hash */
            state_key_hash: string;
            data: components["schemas"]["MoveResource"];
        };
        /** @description The associated writeset with a payload */
        WriteSet: components["schemas"]["WriteSet_ScriptWriteSet"] | components["schemas"]["WriteSet_DirectWriteSet"];
        /** @description A final state change of a transaction on a resource or module */
        WriteSetChange: components["schemas"]["WriteSetChange_DeleteModule"] | components["schemas"]["WriteSetChange_DeleteResource"] | components["schemas"]["WriteSetChange_DeleteTableItem"] | components["schemas"]["WriteSetChange_WriteModule"] | components["schemas"]["WriteSetChange_WriteResource"] | components["schemas"]["WriteSetChange_WriteTableItem"];
        WriteSetChange_DeleteModule: {
            /**
             * @example delete_module
             * @enum {string}
             */
            type: "delete_module";
        } & components["schemas"]["DeleteModule"] & {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            type: "delete_module";
        };
        WriteSetChange_DeleteResource: {
            /**
             * @example delete_resource
             * @enum {string}
             */
            type: "delete_resource";
        } & components["schemas"]["DeleteResource"] & {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            type: "delete_resource";
        };
        WriteSetChange_DeleteTableItem: {
            /**
             * @example delete_table_item
             * @enum {string}
             */
            type: "delete_table_item";
        } & components["schemas"]["DeleteTableItem"] & {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            type: "delete_table_item";
        };
        WriteSetChange_WriteModule: {
            /**
             * @example write_module
             * @enum {string}
             */
            type: "write_module";
        } & components["schemas"]["WriteModule"] & {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            type: "write_module";
        };
        WriteSetChange_WriteResource: {
            /**
             * @example write_resource
             * @enum {string}
             */
            type: "write_resource";
        } & components["schemas"]["WriteResource"] & {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            type: "write_resource";
        };
        WriteSetChange_WriteTableItem: {
            /**
             * @example write_table_item
             * @enum {string}
             */
            type: "write_table_item";
        } & components["schemas"]["WriteTableItem"] & {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            type: "write_table_item";
        };
        /** @description A writeset payload, used only for genesis */
        WriteSetPayload: {
            write_set: components["schemas"]["WriteSet"];
        };
        WriteSet_DirectWriteSet: {
            /**
             * @example direct_write_set
             * @enum {string}
             */
            type: "direct_write_set";
        } & components["schemas"]["DirectWriteSet"] & {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            type: "direct_write_set";
        };
        WriteSet_ScriptWriteSet: {
            /**
             * @example script_write_set
             * @enum {string}
             */
            type: "script_write_set";
        } & components["schemas"]["ScriptWriteSet"] & {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            type: "script_write_set";
        };
        /** @description Change set to write a table item */
        WriteTableItem: {
            state_key_hash: string;
            handle: components["schemas"]["HexEncodedBytes"];
            key: components["schemas"]["HexEncodedBytes"];
            value: components["schemas"]["HexEncodedBytes"];
            data?: components["schemas"]["DecodedTableData"];
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
    get_account: {
        parameters: {
            query?: {
                /**
                 * @description Ledger version to get state of account
                 *
                 *     If not provided, it will be the latest version
                 */
                ledger_version?: components["schemas"]["U64"];
            };
            header?: never;
            path: {
                /** @description Address of account with or without a `0x` prefix */
                address: components["schemas"]["Address"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID": number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION": number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION": number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC": number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH": number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT": number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT": number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /**
                     * @description Cursor to be used for endpoints that support cursor-based
                     *     pagination. Pass this to the `start` field of the endpoint
                     *     on the next call to get the next page of results.
                     */
                    "X-APTOS-CURSOR"?: string;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AccountData"];
                    "application/x-bcs": number[];
                };
            };
            400: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            403: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            404: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            410: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            500: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            503: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
        };
    };
    get_account_resources: {
        parameters: {
            query?: {
                /**
                 * @description Ledger version to get state of account
                 *
                 *     If not provided, it will be the latest version
                 */
                ledger_version?: components["schemas"]["U64"];
                /**
                 * @description Cursor specifying where to start for pagination
                 *
                 *     This cursor cannot be derived manually client-side. Instead, you must
                 *     call this endpoint once without this query parameter specified, and
                 *     then use the cursor returned in the X-Aptos-Cursor header in the
                 *     response.
                 */
                start?: components["schemas"]["StateKeyWrapper"];
                /**
                 * @description Max number of account resources to retrieve
                 *
                 *     If not provided, defaults to default page size.
                 */
                limit?: number;
            };
            header?: never;
            path: {
                /** @description Address of account with or without a `0x` prefix */
                address: components["schemas"]["Address"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID": number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION": number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION": number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC": number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH": number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT": number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT": number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /**
                     * @description Cursor to be used for endpoints that support cursor-based
                     *     pagination. Pass this to the `start` field of the endpoint
                     *     on the next call to get the next page of results.
                     */
                    "X-APTOS-CURSOR"?: string;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MoveResource"][];
                    "application/x-bcs": number[];
                };
            };
            400: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            403: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            404: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            410: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            500: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            503: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
        };
    };
    get_account_balance: {
        parameters: {
            query?: {
                /**
                 * @description Ledger version to get state of account
                 *
                 *     If not provided, it will be the latest version
                 */
                ledger_version?: components["schemas"]["U64"];
            };
            header?: never;
            path: {
                /** @description Address of account with or without a `0x` prefix */
                address: components["schemas"]["Address"];
                asset_type: components["schemas"]["AssetType"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID": number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION": number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION": number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC": number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH": number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT": number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT": number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /**
                     * @description Cursor to be used for endpoints that support cursor-based
                     *     pagination. Pass this to the `start` field of the endpoint
                     *     on the next call to get the next page of results.
                     */
                    "X-APTOS-CURSOR"?: string;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": number;
                    "application/x-bcs": number[];
                };
            };
            400: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            403: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            404: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            410: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            500: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            503: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
        };
    };
    get_account_modules: {
        parameters: {
            query?: {
                /**
                 * @description Ledger version to get state of account
                 *
                 *     If not provided, it will be the latest version
                 */
                ledger_version?: components["schemas"]["U64"];
                /**
                 * @description Cursor specifying where to start for pagination
                 *
                 *     This cursor cannot be derived manually client-side. Instead, you must
                 *     call this endpoint once without this query parameter specified, and
                 *     then use the cursor returned in the X-Aptos-Cursor header in the
                 *     response.
                 */
                start?: components["schemas"]["StateKeyWrapper"];
                /**
                 * @description Max number of account modules to retrieve
                 *
                 *     If not provided, defaults to default page size.
                 */
                limit?: number;
            };
            header?: never;
            path: {
                /** @description Address of account with or without a `0x` prefix */
                address: components["schemas"]["Address"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID": number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION": number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION": number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC": number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH": number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT": number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT": number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /**
                     * @description Cursor to be used for endpoints that support cursor-based
                     *     pagination. Pass this to the `start` field of the endpoint
                     *     on the next call to get the next page of results.
                     */
                    "X-APTOS-CURSOR"?: string;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MoveModuleBytecode"][];
                    "application/x-bcs": number[];
                };
            };
            400: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            403: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            404: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            410: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            500: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            503: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
        };
    };
    spec: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/html": string;
                };
            };
        };
    };
    info: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        [key: string]: unknown;
                    };
                };
            };
        };
    };
    healthy: {
        parameters: {
            query?: {
                /**
                 * @description Threshold in seconds that the server can be behind to be considered healthy
                 *
                 *     If not provided, the healthcheck will always succeed
                 */
                duration_secs?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID": number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION": number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION": number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC": number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH": number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT": number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT": number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /**
                     * @description Cursor to be used for endpoints that support cursor-based
                     *     pagination. Pass this to the `start` field of the endpoint
                     *     on the next call to get the next page of results.
                     */
                    "X-APTOS-CURSOR"?: string;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HealthCheckSuccess"];
                    "application/x-bcs": number[];
                };
            };
            500: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            503: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
        };
    };
    get_block_by_height: {
        parameters: {
            query?: {
                /**
                 * @description If set to true, include all transactions in the block
                 *
                 *     If not provided, no transactions will be retrieved
                 */
                with_transactions?: boolean;
            };
            header?: never;
            path: {
                /** @description Block height to lookup.  Starts at 0 */
                block_height: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID": number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION": number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION": number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC": number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH": number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT": number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT": number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /**
                     * @description Cursor to be used for endpoints that support cursor-based
                     *     pagination. Pass this to the `start` field of the endpoint
                     *     on the next call to get the next page of results.
                     */
                    "X-APTOS-CURSOR"?: string;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Block"];
                    "application/x-bcs": number[];
                };
            };
            400: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            403: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            404: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            410: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            500: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            503: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
        };
    };
    get_block_by_version: {
        parameters: {
            query?: {
                /**
                 * @description If set to true, include all transactions in the block
                 *
                 *     If not provided, no transactions will be retrieved
                 */
                with_transactions?: boolean;
            };
            header?: never;
            path: {
                /** @description Ledger version to lookup block information for. */
                version: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID": number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION": number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION": number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC": number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH": number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT": number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT": number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /**
                     * @description Cursor to be used for endpoints that support cursor-based
                     *     pagination. Pass this to the `start` field of the endpoint
                     *     on the next call to get the next page of results.
                     */
                    "X-APTOS-CURSOR"?: string;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Block"];
                    "application/x-bcs": number[];
                };
            };
            400: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            403: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            404: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            410: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            500: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            503: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
        };
    };
    get_events_by_creation_number: {
        parameters: {
            query?: {
                /**
                 * @description Starting sequence number of events.
                 *
                 *     If unspecified, by default will retrieve the most recent events
                 */
                start?: components["schemas"]["U64"];
                /**
                 * @description Max number of events to retrieve.
                 *
                 *     If unspecified, defaults to default page size
                 */
                limit?: number;
            };
            header?: never;
            path: {
                /**
                 * @description Hex-encoded 32 byte Aptos account, with or without a `0x` prefix, for
                 *     which events are queried. This refers to the account that events were
                 *     emitted to, not the account hosting the move module that emits that
                 *     event type.
                 */
                address: components["schemas"]["Address"];
                /**
                 * @description Creation number corresponding to the event stream originating
                 *     from the given account.
                 */
                creation_number: components["schemas"]["U64"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID": number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION": number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION": number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC": number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH": number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT": number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT": number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /**
                     * @description Cursor to be used for endpoints that support cursor-based
                     *     pagination. Pass this to the `start` field of the endpoint
                     *     on the next call to get the next page of results.
                     */
                    "X-APTOS-CURSOR"?: string;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["VersionedEvent"][];
                    "application/x-bcs": number[];
                };
            };
            400: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            403: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            404: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            410: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            500: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            503: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
        };
    };
    get_events_by_event_handle: {
        parameters: {
            query?: {
                /**
                 * @description Starting sequence number of events.
                 *
                 *     If unspecified, by default will retrieve the most recent
                 */
                start?: components["schemas"]["U64"];
                /**
                 * @description Max number of events to retrieve.
                 *
                 *     If unspecified, defaults to default page size
                 */
                limit?: number;
            };
            header?: never;
            path: {
                /**
                 * @description Hex-encoded 32 byte Aptos account, with or without a `0x` prefix, for
                 *     which events are queried. This refers to the account that events were
                 *     emitted to, not the account hosting the move module that emits that
                 *     event type.
                 */
                address: components["schemas"]["Address"];
                /** @description Name of struct to lookup event handle e.g. `0x1::account::Account` */
                event_handle: components["schemas"]["MoveStructTag"];
                /** @description Name of field to lookup event handle e.g. `withdraw_events` */
                field_name: components["schemas"]["IdentifierWrapper"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID": number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION": number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION": number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC": number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH": number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT": number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT": number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /**
                     * @description Cursor to be used for endpoints that support cursor-based
                     *     pagination. Pass this to the `start` field of the endpoint
                     *     on the next call to get the next page of results.
                     */
                    "X-APTOS-CURSOR"?: string;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["VersionedEvent"][];
                    "application/x-bcs": number[];
                };
            };
            400: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            403: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            404: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            410: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            500: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            503: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
        };
    };
    get_ledger_info: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID": number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION": number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION": number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC": number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH": number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT": number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT": number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /**
                     * @description Cursor to be used for endpoints that support cursor-based
                     *     pagination. Pass this to the `start` field of the endpoint
                     *     on the next call to get the next page of results.
                     */
                    "X-APTOS-CURSOR"?: string;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["IndexResponse"];
                    "application/x-bcs": number[];
                };
            };
            400: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            403: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            500: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            503: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
        };
    };
    get_account_resource: {
        parameters: {
            query?: {
                /**
                 * @description Ledger version to get state of account
                 *
                 *     If not provided, it will be the latest version
                 */
                ledger_version?: components["schemas"]["U64"];
            };
            header?: never;
            path: {
                /** @description Address of account with or without a `0x` prefix */
                address: components["schemas"]["Address"];
                /** @description Name of struct to retrieve e.g. `0x1::account::Account` */
                resource_type: components["schemas"]["MoveStructTag"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID": number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION": number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION": number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC": number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH": number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT": number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT": number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /**
                     * @description Cursor to be used for endpoints that support cursor-based
                     *     pagination. Pass this to the `start` field of the endpoint
                     *     on the next call to get the next page of results.
                     */
                    "X-APTOS-CURSOR"?: string;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MoveResource"];
                    "application/x-bcs": number[];
                };
            };
            400: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            403: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            404: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            410: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            500: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            503: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
        };
    };
    get_account_module: {
        parameters: {
            query?: {
                /**
                 * @description Ledger version to get state of account
                 *
                 *     If not provided, it will be the latest version
                 */
                ledger_version?: components["schemas"]["U64"];
            };
            header?: never;
            path: {
                /** @description Address of account with or without a `0x` prefix */
                address: components["schemas"]["Address"];
                /** @description Name of module to retrieve e.g. `coin` */
                module_name: components["schemas"]["IdentifierWrapper"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID": number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION": number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION": number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC": number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH": number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT": number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT": number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /**
                     * @description Cursor to be used for endpoints that support cursor-based
                     *     pagination. Pass this to the `start` field of the endpoint
                     *     on the next call to get the next page of results.
                     */
                    "X-APTOS-CURSOR"?: string;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MoveModuleBytecode"];
                    "application/x-bcs": number[];
                };
            };
            400: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            403: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            404: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            410: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            500: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            503: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
        };
    };
    get_table_item: {
        parameters: {
            query?: {
                /**
                 * @description Ledger version to get state of account
                 *
                 *     If not provided, it will be the latest version
                 */
                ledger_version?: components["schemas"]["U64"];
            };
            header?: never;
            path: {
                /** @description Table handle hex encoded 32-byte string */
                table_handle: components["schemas"]["Address"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["TableItemRequest"];
            };
        };
        responses: {
            200: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID": number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION": number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION": number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC": number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH": number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT": number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT": number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /**
                     * @description Cursor to be used for endpoints that support cursor-based
                     *     pagination. Pass this to the `start` field of the endpoint
                     *     on the next call to get the next page of results.
                     */
                    "X-APTOS-CURSOR"?: string;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MoveValue"];
                    "application/x-bcs": number[];
                };
            };
            400: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            403: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            404: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            410: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            500: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            503: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
        };
    };
    get_raw_table_item: {
        parameters: {
            query?: {
                /**
                 * @description Ledger version to get state of account
                 *
                 *     If not provided, it will be the latest version
                 */
                ledger_version?: components["schemas"]["U64"];
            };
            header?: never;
            path: {
                /** @description Table handle hex encoded 32-byte string */
                table_handle: components["schemas"]["Address"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RawTableItemRequest"];
            };
        };
        responses: {
            200: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID": number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION": number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION": number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC": number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH": number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT": number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT": number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /**
                     * @description Cursor to be used for endpoints that support cursor-based
                     *     pagination. Pass this to the `start` field of the endpoint
                     *     on the next call to get the next page of results.
                     */
                    "X-APTOS-CURSOR"?: string;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MoveValue"];
                    "application/x-bcs": number[];
                };
            };
            400: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            403: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            404: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            410: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            500: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            503: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
        };
    };
    get_transactions: {
        parameters: {
            query?: {
                /**
                 * @description Ledger version to start list of transactions
                 *
                 *     If not provided, defaults to showing the latest transactions
                 */
                start?: components["schemas"]["U64"];
                /**
                 * @description Max number of transactions to retrieve.
                 *
                 *     If not provided, defaults to default page size
                 */
                limit?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID": number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION": number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION": number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC": number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH": number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT": number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT": number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /**
                     * @description Cursor to be used for endpoints that support cursor-based
                     *     pagination. Pass this to the `start` field of the endpoint
                     *     on the next call to get the next page of results.
                     */
                    "X-APTOS-CURSOR"?: string;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Transaction"][];
                    "application/x-bcs": number[];
                };
            };
            400: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            403: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            404: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            410: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            500: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            503: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
        };
    };
    submit_transaction: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SubmitTransactionRequest"];
                "application/x.aptos.signed_transaction+bcs": number[];
            };
        };
        responses: {
            202: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID": number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION": number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION": number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC": number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH": number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT": number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT": number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /**
                     * @description Cursor to be used for endpoints that support cursor-based
                     *     pagination. Pass this to the `start` field of the endpoint
                     *     on the next call to get the next page of results.
                     */
                    "X-APTOS-CURSOR"?: string;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PendingTransaction"];
                    "application/x-bcs": number[];
                };
            };
            400: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            403: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            404: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            413: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            500: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            503: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            507: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
        };
    };
    get_transaction_by_hash: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Hash of transaction to retrieve */
                txn_hash: components["schemas"]["HashValue"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID": number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION": number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION": number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC": number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH": number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT": number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT": number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /**
                     * @description Cursor to be used for endpoints that support cursor-based
                     *     pagination. Pass this to the `start` field of the endpoint
                     *     on the next call to get the next page of results.
                     */
                    "X-APTOS-CURSOR"?: string;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Transaction"];
                    "application/x-bcs": number[];
                };
            };
            400: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            403: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            404: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            410: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            500: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            503: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
        };
    };
    wait_transaction_by_hash: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Hash of transaction to retrieve */
                txn_hash: components["schemas"]["HashValue"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID": number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION": number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION": number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC": number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH": number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT": number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT": number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /**
                     * @description Cursor to be used for endpoints that support cursor-based
                     *     pagination. Pass this to the `start` field of the endpoint
                     *     on the next call to get the next page of results.
                     */
                    "X-APTOS-CURSOR"?: string;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Transaction"];
                    "application/x-bcs": number[];
                };
            };
            400: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            403: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            404: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            410: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            500: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            503: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
        };
    };
    get_transaction_by_version: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Version of transaction to retrieve */
                txn_version: components["schemas"]["U64"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID": number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION": number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION": number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC": number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH": number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT": number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT": number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /**
                     * @description Cursor to be used for endpoints that support cursor-based
                     *     pagination. Pass this to the `start` field of the endpoint
                     *     on the next call to get the next page of results.
                     */
                    "X-APTOS-CURSOR"?: string;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Transaction"];
                    "application/x-bcs": number[];
                };
            };
            400: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            403: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            404: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            410: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            500: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            503: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
        };
    };
    get_transactions_auxiliary_info: {
        parameters: {
            query: {
                /** @description Starting ledger version to retrieve auxiliary info for */
                start_version: components["schemas"]["U64"];
                /**
                 * @description Max number of transactions to retrieve auxiliary info for.
                 *
                 *     If not provided, defaults to default page size
                 */
                limit?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID": number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION": number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION": number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC": number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH": number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT": number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT": number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /**
                     * @description Cursor to be used for endpoints that support cursor-based
                     *     pagination. Pass this to the `start` field of the endpoint
                     *     on the next call to get the next page of results.
                     */
                    "X-APTOS-CURSOR"?: string;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PersistedAuxiliaryInfo"][];
                    "application/x-bcs": number[];
                };
            };
            400: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            403: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            404: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            410: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            500: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            503: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
        };
    };
    get_account_transactions: {
        parameters: {
            query?: {
                /**
                 * @description Account sequence number to start list of transactions
                 *
                 *     If not provided, defaults to showing the latest transactions
                 */
                start?: components["schemas"]["U64"];
                /**
                 * @description Max number of transactions to retrieve.
                 *
                 *     If not provided, defaults to default page size
                 */
                limit?: number;
            };
            header?: never;
            path: {
                /** @description Address of account with or without a `0x` prefix */
                address: components["schemas"]["Address"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID": number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION": number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION": number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC": number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH": number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT": number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT": number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /**
                     * @description Cursor to be used for endpoints that support cursor-based
                     *     pagination. Pass this to the `start` field of the endpoint
                     *     on the next call to get the next page of results.
                     */
                    "X-APTOS-CURSOR"?: string;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Transaction"][];
                    "application/x-bcs": number[];
                };
            };
            400: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            403: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            404: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            410: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            500: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            503: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
        };
    };
    get_account_transaction_summaries: {
        parameters: {
            query?: {
                /**
                 * @description Transaction version to start list of transactions
                 *
                 *     If not provided, defaults to showing the latest transactions
                 */
                start_version?: components["schemas"]["U64"];
                /**
                 * @description Transaction version to end list of transactions
                 *
                 *     If not provided, defaults to showing the latest transactions
                 */
                end_version?: components["schemas"]["U64"];
                /**
                 * @description Max number of transactions to retrieve.
                 *
                 *     If not provided, defaults to default page size
                 */
                limit?: number;
            };
            header?: never;
            path: {
                /** @description Address of account with or without a `0x` prefix */
                address: components["schemas"]["Address"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID": number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION": number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION": number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC": number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH": number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT": number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT": number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /**
                     * @description Cursor to be used for endpoints that support cursor-based
                     *     pagination. Pass this to the `start` field of the endpoint
                     *     on the next call to get the next page of results.
                     */
                    "X-APTOS-CURSOR"?: string;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TransactionSummary"][];
                    "application/x-bcs": number[];
                };
            };
            400: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            403: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            404: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            410: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            500: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            503: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
        };
    };
    submit_batch_transactions: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SubmitTransactionRequest"][];
                "application/x.aptos.signed_transaction+bcs": number[];
            };
        };
        responses: {
            202: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID": number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION": number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION": number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC": number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH": number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT": number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT": number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /**
                     * @description Cursor to be used for endpoints that support cursor-based
                     *     pagination. Pass this to the `start` field of the endpoint
                     *     on the next call to get the next page of results.
                     */
                    "X-APTOS-CURSOR"?: string;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TransactionsBatchSubmissionResult"];
                    "application/x-bcs": number[];
                };
            };
            206: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID": number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION": number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION": number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC": number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH": number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT": number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT": number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /**
                     * @description Cursor to be used for endpoints that support cursor-based
                     *     pagination. Pass this to the `start` field of the endpoint
                     *     on the next call to get the next page of results.
                     */
                    "X-APTOS-CURSOR"?: string;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TransactionsBatchSubmissionResult"];
                    "application/x-bcs": number[];
                };
            };
            400: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            403: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            404: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            413: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            500: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            503: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            507: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
        };
    };
    simulate_transaction: {
        parameters: {
            query?: {
                /**
                 * @description If set to true, the max gas value in the transaction will be ignored
                 *     and the maximum possible gas will be used
                 */
                estimate_max_gas_amount?: boolean;
                /**
                 * @description If set to true, the gas unit price in the transaction will be ignored
                 *     and the estimated value will be used
                 */
                estimate_gas_unit_price?: boolean;
                /**
                 * @description If set to true, the transaction will use a higher price than the original
                 *     estimate.
                 */
                estimate_prioritized_gas_unit_price?: boolean;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SubmitTransactionRequest"];
                "application/x.aptos.signed_transaction+bcs": number[];
            };
        };
        responses: {
            200: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID": number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION": number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION": number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC": number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH": number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT": number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT": number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /**
                     * @description Cursor to be used for endpoints that support cursor-based
                     *     pagination. Pass this to the `start` field of the endpoint
                     *     on the next call to get the next page of results.
                     */
                    "X-APTOS-CURSOR"?: string;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UserTransaction"][];
                    "application/x-bcs": number[];
                };
            };
            400: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            403: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            404: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            413: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            500: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            503: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            507: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
        };
    };
    encode_submission: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["EncodeSubmissionRequest"];
            };
        };
        responses: {
            200: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID": number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION": number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION": number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC": number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH": number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT": number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT": number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /**
                     * @description Cursor to be used for endpoints that support cursor-based
                     *     pagination. Pass this to the `start` field of the endpoint
                     *     on the next call to get the next page of results.
                     */
                    "X-APTOS-CURSOR"?: string;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HexEncodedBytes"];
                    "application/x-bcs": number[];
                };
            };
            400: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            403: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            500: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            503: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
        };
    };
    estimate_gas_price: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID": number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION": number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION": number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC": number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH": number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT": number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT": number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /**
                     * @description Cursor to be used for endpoints that support cursor-based
                     *     pagination. Pass this to the `start` field of the endpoint
                     *     on the next call to get the next page of results.
                     */
                    "X-APTOS-CURSOR"?: string;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GasEstimation"];
                    "application/x-bcs": number[];
                };
            };
            400: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            403: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            500: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            503: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
        };
    };
    view: {
        parameters: {
            query?: {
                /**
                 * @description Ledger version to get state of account
                 *
                 *     If not provided, it will be the latest version
                 */
                ledger_version?: components["schemas"]["U64"];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ViewRequest"];
                "application/x.aptos.view_function+bcs": number[];
            };
        };
        responses: {
            200: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID": number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION": number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION": number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC": number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH": number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT": number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT": number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /**
                     * @description Cursor to be used for endpoints that support cursor-based
                     *     pagination. Pass this to the `start` field of the endpoint
                     *     on the next call to get the next page of results.
                     */
                    "X-APTOS-CURSOR"?: string;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MoveValue"][];
                    "application/x-bcs": number[];
                };
            };
            400: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            403: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            404: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            410: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            500: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
            503: {
                headers: {
                    /** @description Chain ID of the current chain */
                    "X-APTOS-CHAIN-ID"?: number;
                    /** @description Current ledger version of the chain */
                    "X-APTOS-LEDGER-VERSION"?: number;
                    /** @description Oldest non-pruned ledger version of the chain */
                    "X-APTOS-LEDGER-OLDEST-VERSION"?: number;
                    /** @description Current timestamp of the chain */
                    "X-APTOS-LEDGER-TIMESTAMPUSEC"?: number;
                    /** @description Current epoch of the chain */
                    "X-APTOS-EPOCH"?: number;
                    /** @description Current block height of the chain */
                    "X-APTOS-BLOCK-HEIGHT"?: number;
                    /** @description Oldest non-pruned block height of the chain */
                    "X-APTOS-OLDEST-BLOCK-HEIGHT"?: number;
                    /** @description The cost of the call in terms of gas */
                    "X-APTOS-GAS-USED"?: number;
                    /** @description Per-epoch transaction encryption key (hex-encoded) */
                    "X-APTOS-TXN-ENCRYPTION-KEY"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AptosError"];
                };
            };
        };
    };
}
