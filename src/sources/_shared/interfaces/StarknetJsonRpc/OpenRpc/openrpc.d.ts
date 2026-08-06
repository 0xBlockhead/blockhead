export type paths = Record<string, never>;
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        /** Events chunk */
        EVENTS_CHUNK: {
            /** Matching Events */
            events: components["schemas"]["EMITTED_EVENT"][];
            /**
             * Continuation token
             * @description Use this token in a subsequent query to obtain the next page. Should not appear if there are no more pages.
             */
            continuation_token?: string;
        };
        /** Result page request */
        RESULT_PAGE_REQUEST: {
            /**
             * Continuation token
             * @description The token returned from the previous query. If no token is provided the first page is returned.
             */
            continuation_token?: string;
            /** Chunk size */
            chunk_size: number;
        };
        /**
         * Emitted event
         * @description Event information decorated with metadata on where it was emitted / An event emitted as a result of transaction execution
         */
        EMITTED_EVENT: components["schemas"]["EVENT"] & {
            /**
             * Block hash
             * @description The hash of the block in which the event was emitted
             */
            block_hash?: components["schemas"]["BLOCK_HASH"];
            /**
             * Block number
             * @description The number of the block in which the event was emitted
             */
            block_number?: components["schemas"]["BLOCK_NUMBER"];
            /**
             * Transaction hash
             * @description The transaction that emitted the event
             */
            transaction_hash: components["schemas"]["TXN_HASH"];
            /**
             * Transaction index
             * @description The index of the transaction in the block by which the event was emitted
             */
            transaction_index: number;
            /**
             * Event index
             * @description The index of the event in the transaction by which it was emitted
             */
            event_index: number;
        };
        /**
         * Event
         * @description A StarkNet event
         */
        EVENT: {
            /** From address */
            from_address: components["schemas"]["ADDRESS"];
        } & components["schemas"]["EVENT_CONTENT"];
        /**
         * Event content
         * @description The content of an event
         */
        EVENT_CONTENT: {
            /** Keys */
            keys: components["schemas"]["FELT"][];
            /** Data */
            data: components["schemas"]["FELT"][];
        };
        /**
         * Keys
         * @description The keys to filter over
         */
        EVENT_KEYS: components["schemas"]["FELT"][][];
        /**
         * Event filter
         * @description An event filter/query
         */
        EVENT_FILTER: {
            /** from block */
            from_block?: components["schemas"]["BLOCK_ID"];
            /** to block */
            to_block?: components["schemas"]["BLOCK_ID"];
            /**
             * from contract
             * @description A contract address or a list of addresses from which events should originate
             */
            address?: components["schemas"]["ADDRESS"] | components["schemas"]["ADDRESS"][];
            /**
             * event keys
             * @description The keys to filter over
             */
            keys?: components["schemas"]["EVENT_KEYS"];
        };
        /**
         * Block id
         * @description Block hash, number or tag
         */
        BLOCK_ID: {
            /** Block hash */
            block_hash: components["schemas"]["BLOCK_HASH"];
        } | {
            /** Block number */
            block_number: components["schemas"]["BLOCK_NUMBER"];
        } | components["schemas"]["BLOCK_TAG"];
        /**
         * Block tag
         * @description A tag specifying a dynamic reference to a block. Tag `l1_accepted` refers to the latest Starknet block which was included in a state update on L1 and finalized by the consensus on L1. Tag `latest` refers to the latest Starknet block finalized by the consensus on L2. Tag `pre_confirmed` refers to the block which is currently being built by the block proposer in height `latest` + 1.
         * @enum {string}
         */
        BLOCK_TAG: "l1_accepted" | "latest" | "pre_confirmed";
        /**
         * Sync status
         * @description An object describing the node synchronization status
         */
        SYNC_STATUS: {
            /**
             * Starting block hash
             * @description The hash of the block from which the sync started
             */
            starting_block_hash: components["schemas"]["BLOCK_HASH"];
            /**
             * Starting block number
             * @description The number (height) of the block from which the sync started
             */
            starting_block_num: components["schemas"]["BLOCK_NUMBER"];
            /**
             * Current block hash
             * @description The hash of the current block being synchronized
             */
            current_block_hash: components["schemas"]["BLOCK_HASH"];
            /**
             * Current block number
             * @description The number (height) of the current block being synchronized
             */
            current_block_num: components["schemas"]["BLOCK_NUMBER"];
            /**
             * Highest block hash
             * @description The hash of the estimated highest block to be synchronized
             */
            highest_block_hash: components["schemas"]["BLOCK_HASH"];
            /**
             * Highest block number
             * @description The number (height) of the estimated highest block to be synchronized
             */
            highest_block_num: components["schemas"]["BLOCK_NUMBER"];
        };
        /**
         * Number as hex
         * @description An unsigned integer number in hex format (0x...)
         */
        NUM_AS_HEX: string;
        /**
         * u64
         * @description 64 bit unsigned integers, represented by hex string of length at most 16
         */
        u64: string;
        /**
         * u128
         * @description 128 bit unsigned integers, represented by hex string of length at most 32
         */
        u128: string;
        /**
         * Chain id
         * @description StarkNet chain id, given in hex representation.
         */
        CHAIN_ID: string;
        /** @description The change in state applied in this block, given as a mapping of addresses to the new values and/or new contracts */
        STATE_DIFF: {
            /** Storage diffs */
            storage_diffs: components["schemas"]["CONTRACT_STORAGE_DIFF_ITEM"][];
            /** Deprecated declared classes */
            deprecated_declared_classes: components["schemas"]["FELT"][];
            /** Declared classes */
            declared_classes: {
                /**
                 * Class hash
                 * @description The hash of the declared class
                 */
                class_hash?: components["schemas"]["FELT"];
                /**
                 * Compiled class hash
                 * @description The Cairo assembly hash corresponding to the declared class
                 */
                compiled_class_hash?: components["schemas"]["FELT"];
            }[];
            /** Migrated compiled classes */
            migrated_compiled_classes?: {
                /**
                 * Class hash
                 * @description The hash of the class
                 */
                class_hash?: components["schemas"]["FELT"];
                /**
                 * Compiled class hash
                 * @description The Blake-migrated Cairo assembly hash corresponding to the class
                 */
                compiled_class_hash?: components["schemas"]["FELT"];
            }[];
            /** Deployed contracts */
            deployed_contracts: components["schemas"]["DEPLOYED_CONTRACT_ITEM"][];
            /** Replaced classes */
            replaced_classes: {
                /**
                 * Contract address
                 * @description The address of the contract whose class was replaced
                 */
                contract_address?: components["schemas"]["ADDRESS"];
                /**
                 * Class hash
                 * @description The new class hash
                 */
                class_hash?: components["schemas"]["FELT"];
            }[];
            /** Nonces */
            nonces: {
                /**
                 * Contract address
                 * @description The address of the contract
                 */
                contract_address?: components["schemas"]["ADDRESS"];
                /**
                 * Nonce
                 * @description The nonce for the given address at the end of the block
                 */
                nonce?: components["schemas"]["FELT"];
            }[];
        };
        /**
         * Pre-confirmed state update
         * @description Pre-confirmed state update
         */
        PRE_CONFIRMED_STATE_UPDATE: {
            /**
             * Old root
             * @description The previous global state root
             */
            old_root?: components["schemas"]["FELT"];
            /** State diff */
            state_diff: components["schemas"]["STATE_DIFF"];
        };
        /** State update */
        STATE_UPDATE: {
            /** Block hash */
            block_hash: components["schemas"]["BLOCK_HASH"];
            /**
             * Old root
             * @description The previous global state root
             */
            old_root: components["schemas"]["FELT"];
            /**
             * New root
             * @description The new global state root
             */
            new_root: components["schemas"]["FELT"];
            /** State diff */
            state_diff: components["schemas"]["STATE_DIFF"];
        };
        /** Address */
        ADDRESS: components["schemas"]["FELT"];
        /**
         * Storage key
         * @description A storage key. Represented as up to 62 hex digits, 3 bits, and 5 leading zeroes.
         */
        STORAGE_KEY: string;
        /**
         * Ethereum address
         * @description an ethereum address represented as 40 hex digits
         */
        ETH_ADDRESS: string;
        /**
         * Transaction hash
         * @description The hash of a Starknet transaction
         */
        TXN_HASH: components["schemas"]["FELT"];
        /** @description The hash of an Ethereum transaction */
        L1_TXN_HASH: components["schemas"]["NUM_AS_HEX"];
        /**
         * Field element
         * @description A field element. represented by at most 63 hex digits
         */
        FELT: string;
        /**
         * Block number
         * @description The block's number (its height)
         */
        BLOCK_NUMBER: number;
        /** Block hash */
        BLOCK_HASH: components["schemas"]["FELT"];
        /** Block body with transaction hashes */
        BLOCK_BODY_WITH_TX_HASHES: {
            /**
             * Transaction hashes
             * @description The hashes of the transactions included in this block
             */
            transactions: components["schemas"]["TXN_HASH"][];
        };
        /** Block body with transactions */
        BLOCK_BODY_WITH_TXS: {
            /**
             * Transactions
             * @description The transactions in this block
             */
            transactions: unknown[];
        };
        /** Block body with transactions and receipts */
        BLOCK_BODY_WITH_RECEIPTS: {
            /**
             * Transactions
             * @description The transactions in this block
             */
            transactions: {
                /** transaction */
                transaction: components["schemas"]["TXN"];
                /** receipt */
                receipt: components["schemas"]["TXN_RECEIPT"];
            }[];
        };
        /** Block header */
        BLOCK_HEADER: {
            /** Block hash */
            block_hash: components["schemas"]["BLOCK_HASH"];
            /**
             * Parent hash
             * @description The hash of this block's parent
             */
            parent_hash: components["schemas"]["BLOCK_HASH"];
            /**
             * Block number
             * @description The block number (its height)
             */
            block_number: components["schemas"]["BLOCK_NUMBER"];
            /**
             * New root
             * @description The new global state root
             */
            new_root: components["schemas"]["FELT"];
            /**
             * Timestamp
             * @description The time in which the block was created, encoded in Unix time
             */
            timestamp: number;
            /**
             * Sequencer address
             * @description The StarkNet identity of the sequencer submitting this block
             */
            sequencer_address: components["schemas"]["FELT"];
            /**
             * L1 gas price
             * @description The price of l1 gas in the block
             */
            l1_gas_price: components["schemas"]["RESOURCE_PRICE"];
            /**
             * L2 gas price
             * @description The price of l2 gas in the block
             */
            l2_gas_price: components["schemas"]["RESOURCE_PRICE"];
            /**
             * L1 data gas price
             * @description The price of l1 data gas in the block
             */
            l1_data_gas_price: components["schemas"]["RESOURCE_PRICE"];
            /**
             * L1 da mode
             * @description specifies whether the data of this block is published via blob data or calldata
             * @enum {string}
             */
            l1_da_mode: "BLOB" | "CALLDATA";
            /**
             * Starknet version
             * @description Semver of the current Starknet protocol
             */
            starknet_version: string;
            /**
             * Event commitment
             * @description The root of Merkle Patricia trie for events in the block. For blocks where this data is not available (e.g., old blocks), use 0x0
             */
            event_commitment: components["schemas"]["FELT"];
            /**
             * Transaction commitment
             * @description The root of Merkle Patricia trie for transactions in the block. For blocks where this data is not available (e.g., old blocks), use 0x0
             */
            transaction_commitment: components["schemas"]["FELT"];
            /**
             * Receipt commitment
             * @description The root of Merkle Patricia trie for receipts in the block. For blocks where this data is not available (e.g., old blocks), use 0x0
             */
            receipt_commitment: components["schemas"]["FELT"];
            /**
             * State diff commitment
             * @description The state diff commitment hash in the block. For blocks where this data is not available (e.g., old blocks), use 0x0
             */
            state_diff_commitment: components["schemas"]["FELT"];
            /**
             * Event count
             * @description The number of events in the block
             */
            event_count: number;
            /**
             * Transaction count
             * @description The number of transactions in the block
             */
            transaction_count: number;
            /**
             * State diff length
             * @description The length of the state diff in the block. For blocks where this data is not available (e.g., old blocks), compute from state diff if possible, otherwise use 0
             */
            state_diff_length: number;
        };
        /** Pre-confirmed block header */
        PRE_CONFIRMED_BLOCK_HEADER: {
            /**
             * Block number
             * @description The block number of the block that the proposer is currently building. Note that this is a local view of the node, whose accuracy depends on its polling interval length.
             */
            block_number: components["schemas"]["BLOCK_NUMBER"];
            /**
             * Timestamp
             * @description The time in which the block was created, encoded in Unix time
             */
            timestamp: number;
            /**
             * Sequencer address
             * @description The StarkNet identity of the sequencer submitting this block
             */
            sequencer_address: components["schemas"]["FELT"];
            /**
             * L1 gas price
             * @description The price of l1 gas in the block
             */
            l1_gas_price: components["schemas"]["RESOURCE_PRICE"];
            /**
             * L2 gas price
             * @description The price of l2 gas in the block
             */
            l2_gas_price: components["schemas"]["RESOURCE_PRICE"];
            /**
             * L1 data gas price
             * @description The price of l1 data gas in the block
             */
            l1_data_gas_price: components["schemas"]["RESOURCE_PRICE"];
            /**
             * L1 da mode
             * @description specifies whether the data of this block is published via blob data or calldata
             * @enum {string}
             */
            l1_da_mode: "BLOB" | "CALLDATA";
            /**
             * Starknet version
             * @description Semver of the current Starknet protocol
             */
            starknet_version: string;
        };
        /**
         * Block with transaction hashes
         * @description The block object
         */
        BLOCK_WITH_TX_HASHES: {
            /** Status */
            status: components["schemas"]["BLOCK_STATUS"];
        } & components["schemas"]["BLOCK_HEADER"] & components["schemas"]["BLOCK_BODY_WITH_TX_HASHES"];
        /**
         * Block with transactions
         * @description The block object
         */
        BLOCK_WITH_TXS: {
            /** Status */
            status: components["schemas"]["BLOCK_STATUS"];
        } & components["schemas"]["BLOCK_HEADER"] & components["schemas"]["BLOCK_BODY_WITH_TXS"];
        /**
         * Block with transactions and receipts
         * @description The block object
         */
        BLOCK_WITH_RECEIPTS: {
            /** Status */
            status: components["schemas"]["BLOCK_STATUS"];
        } & components["schemas"]["BLOCK_HEADER"] & components["schemas"]["BLOCK_BODY_WITH_RECEIPTS"];
        /**
         * Pre-confirmed block with transaction hashes
         * @description The dynamic block being constructed by the sequencer. Note that this object will be deprecated upon decentralization.
         */
        PRE_CONFIRMED_BLOCK_WITH_TX_HASHES: components["schemas"]["BLOCK_BODY_WITH_TX_HASHES"] & components["schemas"]["PRE_CONFIRMED_BLOCK_HEADER"];
        /**
         * Pre-confirmed block with transactions
         * @description The dynamic block being constructed by the sequencer. Note that this object will be deprecated upon decentralization.
         */
        PRE_CONFIRMED_BLOCK_WITH_TXS: components["schemas"]["BLOCK_BODY_WITH_TXS"] & components["schemas"]["PRE_CONFIRMED_BLOCK_HEADER"];
        /**
         * Pre-confirmed block with transactions and receipts
         * @description The dynamic block being constructed by the sequencer. Note that this object will be deprecated upon decentralization.
         */
        PRE_CONFIRMED_BLOCK_WITH_RECEIPTS: components["schemas"]["BLOCK_BODY_WITH_RECEIPTS"] & components["schemas"]["PRE_CONFIRMED_BLOCK_HEADER"];
        /** Deployed contract item */
        DEPLOYED_CONTRACT_ITEM: {
            /**
             * Address
             * @description The address of the contract
             */
            address: components["schemas"]["FELT"];
            /**
             * Class hash
             * @description The hash of the contract code
             */
            class_hash: components["schemas"]["FELT"];
        };
        /** Contract storage diff item */
        CONTRACT_STORAGE_DIFF_ITEM: {
            /**
             * Address
             * @description The contract address for which the storage changed
             */
            address: components["schemas"]["FELT"];
            /**
             * Storage entries
             * @description The changes in the storage of the contract
             */
            storage_entries: {
                /**
                 * Key
                 * @description The key of the changed value
                 */
                key?: components["schemas"]["FELT"];
                /**
                 * Value
                 * @description The new value applied to the given address
                 */
                value?: components["schemas"]["FELT"];
            }[];
        };
        /**
         * Transaction
         * @description The transaction schema, as it appears inside a block
         */
        TXN: components["schemas"]["INVOKE_TXN"] | components["schemas"]["L1_HANDLER_TXN"] | components["schemas"]["DECLARE_TXN"] | components["schemas"]["DEPLOY_TXN"] | components["schemas"]["DEPLOY_ACCOUNT_TXN"];
        TXN_WITH_HASH: unknown;
        /**
         * Signature
         * @description A transaction signature
         */
        SIGNATURE: components["schemas"]["FELT"][];
        /** Declare transaction */
        DECLARE_TXN: components["schemas"]["DECLARE_TXN_V0"] | components["schemas"]["DECLARE_TXN_V1"] | components["schemas"]["DECLARE_TXN_V2"] | components["schemas"]["DECLARE_TXN_V3"];
        /**
         * Declare Contract Transaction V0
         * @description Declare Contract Transaction V0
         */
        DECLARE_TXN_V0: {
            /**
             * Declare
             * @enum {string}
             */
            type: "DECLARE";
            /**
             * Sender address
             * @description The address of the account contract sending the declaration transaction
             */
            sender_address: components["schemas"]["ADDRESS"];
            /**
             * Max fee
             * @description The maximal fee that can be charged for including the transaction
             */
            max_fee: components["schemas"]["FELT"];
            /**
             * Version
             * @description Version of the transaction scheme
             * @enum {string}
             */
            version: "0x0" | "0x100000000000000000000000000000000";
            /** Signature */
            signature: components["schemas"]["SIGNATURE"];
            /**
             * Class hash
             * @description The hash of the declared class
             */
            class_hash: components["schemas"]["FELT"];
        };
        /**
         * Declare Contract Transaction V1
         * @description Declare Contract Transaction V1
         */
        DECLARE_TXN_V1: {
            /**
             * Declare
             * @enum {string}
             */
            type: "DECLARE";
            /**
             * Sender address
             * @description The address of the account contract sending the declaration transaction
             */
            sender_address: components["schemas"]["ADDRESS"];
            /**
             * Max fee
             * @description The maximal fee that can be charged for including the transaction
             */
            max_fee: components["schemas"]["FELT"];
            /**
             * Version
             * @description Version of the transaction scheme
             * @enum {string}
             */
            version: "0x1" | "0x100000000000000000000000000000001";
            /** Signature */
            signature: components["schemas"]["SIGNATURE"];
            /** Nonce */
            nonce: components["schemas"]["FELT"];
            /**
             * Class hash
             * @description The hash of the declared class
             */
            class_hash: components["schemas"]["FELT"];
        };
        /**
         * Declare Transaction V2
         * @description Declare Contract Transaction V2
         */
        DECLARE_TXN_V2: {
            /**
             * Declare
             * @enum {string}
             */
            type: "DECLARE";
            /**
             * Sender address
             * @description The address of the account contract sending the declaration transaction
             */
            sender_address: components["schemas"]["ADDRESS"];
            /**
             * Compiled class hash
             * @description The hash of the Cairo assembly resulting from the Sierra compilation
             */
            compiled_class_hash: components["schemas"]["FELT"];
            /**
             * Max fee
             * @description The maximal fee that can be charged for including the transaction
             */
            max_fee: components["schemas"]["FELT"];
            /**
             * Version
             * @description Version of the transaction scheme
             * @enum {string}
             */
            version: "0x2" | "0x100000000000000000000000000000002";
            /** Signature */
            signature: components["schemas"]["SIGNATURE"];
            /** Nonce */
            nonce: components["schemas"]["FELT"];
            /**
             * Class hash
             * @description The hash of the declared class
             */
            class_hash: components["schemas"]["FELT"];
        };
        /**
         * Declare Transaction V3
         * @description Declare Contract Transaction V3
         */
        DECLARE_TXN_V3: {
            /**
             * Declare
             * @enum {string}
             */
            type: "DECLARE";
            /**
             * Sender address
             * @description The address of the account contract sending the declaration transaction
             */
            sender_address: components["schemas"]["ADDRESS"];
            /**
             * Compiled class hash
             * @description The hash of the Cairo assembly resulting from the Sierra compilation
             */
            compiled_class_hash: components["schemas"]["FELT"];
            /**
             * Version
             * @description Version of the transaction scheme
             * @enum {string}
             */
            version: "0x3" | "0x100000000000000000000000000000003";
            /** Signature */
            signature: components["schemas"]["SIGNATURE"];
            /** Nonce */
            nonce: components["schemas"]["FELT"];
            /**
             * Class hash
             * @description The hash of the declared class
             */
            class_hash: components["schemas"]["FELT"];
            /**
             * Resource bounds
             * @description resource bounds for the transaction execution
             */
            resource_bounds: components["schemas"]["RESOURCE_BOUNDS_MAPPING"];
            /**
             * Tip
             * @description the tip for the transaction
             */
            tip: components["schemas"]["u64"];
            /**
             * Paymaster data
             * @description data needed to allow the paymaster to pay for the transaction in native tokens
             */
            paymaster_data: components["schemas"]["FELT"][];
            /**
             * Account deployment data
             * @description data needed to deploy the account contract from which this tx will be initiated
             */
            account_deployment_data: components["schemas"]["FELT"][];
            /**
             * Nonce DA mode
             * @description The storage domain of the account's nonce (an account has a nonce per DA mode)
             */
            nonce_data_availability_mode: components["schemas"]["DA_MODE"];
            /**
             * Fee DA mode
             * @description The storage domain of the account's balance from which fee will be charged
             */
            fee_data_availability_mode: components["schemas"]["DA_MODE"];
        };
        BROADCASTED_TXN: components["schemas"]["BROADCASTED_INVOKE_TXN"] | components["schemas"]["BROADCASTED_DECLARE_TXN"] | components["schemas"]["BROADCASTED_DEPLOY_ACCOUNT_TXN"];
        /** Broadcasted invoke transaction */
        BROADCASTED_INVOKE_TXN: components["schemas"]["INVOKE_TXN_V3"] & {
            /**
             * Proof
             * @description Optional proof for the transaction, as a base64 string-encoded byte array
             */
            proof?: string;
        };
        /** Broadcasted deploy account transaction */
        BROADCASTED_DEPLOY_ACCOUNT_TXN: components["schemas"]["DEPLOY_ACCOUNT_TXN_V3"];
        /** Broadcasted declare transaction */
        BROADCASTED_DECLARE_TXN: components["schemas"]["BROADCASTED_DECLARE_TXN_V3"];
        /**
         * Broadcasted declare Transaction V3
         * @description Broadcasted declare Contract Transaction V3
         */
        BROADCASTED_DECLARE_TXN_V3: {
            /**
             * Declare
             * @enum {string}
             */
            type: "DECLARE";
            /**
             * Sender address
             * @description The address of the account contract sending the declaration transaction
             */
            sender_address: components["schemas"]["ADDRESS"];
            /**
             * Compiled class hash
             * @description The hash of the Cairo assembly resulting from the Sierra compilation
             */
            compiled_class_hash: components["schemas"]["FELT"];
            /**
             * Version
             * @description Version of the transaction scheme
             * @enum {string}
             */
            version: "0x3" | "0x100000000000000000000000000000003";
            /** Signature */
            signature: components["schemas"]["SIGNATURE"];
            /** Nonce */
            nonce: components["schemas"]["FELT"];
            /**
             * Contract class
             * @description The class to be declared
             */
            contract_class: components["schemas"]["CONTRACT_CLASS"];
            /**
             * Resource bounds
             * @description resource bounds for the transaction execution
             */
            resource_bounds: components["schemas"]["RESOURCE_BOUNDS_MAPPING"];
            /**
             * Tip
             * @description the tip for the transaction
             */
            tip: components["schemas"]["u64"];
            /**
             * Paymaster data
             * @description data needed to allow the paymaster to pay for the transaction in native tokens
             */
            paymaster_data: components["schemas"]["FELT"][];
            /**
             * Account deployment data
             * @description data needed to deploy the account contract from which this tx will be initiated
             */
            account_deployment_data: components["schemas"]["FELT"][];
            /**
             * Nonce DA mode
             * @description The storage domain of the account's nonce (an account has a nonce per DA mode)
             */
            nonce_data_availability_mode: components["schemas"]["DA_MODE"];
            /**
             * Fee DA mode
             * @description The storage domain of the account's balance from which fee will be charged
             */
            fee_data_availability_mode: components["schemas"]["DA_MODE"];
        };
        /**
         * Deploy account transaction
         * @description deploys a new account contract
         */
        DEPLOY_ACCOUNT_TXN: components["schemas"]["DEPLOY_ACCOUNT_TXN_V1"] | components["schemas"]["DEPLOY_ACCOUNT_TXN_V3"];
        /**
         * Deploy account transaction
         * @description Deploys an account contract, charges fee from the pre-funded account addresses
         */
        DEPLOY_ACCOUNT_TXN_V1: {
            /**
             * Deploy account
             * @enum {string}
             */
            type: "DEPLOY_ACCOUNT";
            /**
             * Max fee
             * @description The maximal fee that can be charged for including the transaction
             */
            max_fee: components["schemas"]["FELT"];
            /**
             * Version
             * @description Version of the transaction scheme
             * @enum {string}
             */
            version: "0x1" | "0x100000000000000000000000000000001";
            /** Signature */
            signature: components["schemas"]["SIGNATURE"];
            /** Nonce */
            nonce: components["schemas"]["FELT"];
            /**
             * Contract address salt
             * @description The salt for the address of the deployed contract
             */
            contract_address_salt: components["schemas"]["FELT"];
            /**
             * Constructor calldata
             * @description The parameters passed to the constructor
             */
            constructor_calldata: components["schemas"]["FELT"][];
            /**
             * Class hash
             * @description The hash of the deployed contract's class
             */
            class_hash: components["schemas"]["FELT"];
        };
        /**
         * Deploy account transaction
         * @description Deploys an account contract, charges fee from the pre-funded account addresses
         */
        DEPLOY_ACCOUNT_TXN_V3: {
            /**
             * Deploy account
             * @enum {string}
             */
            type: "DEPLOY_ACCOUNT";
            /**
             * Version
             * @description Version of the transaction scheme
             * @enum {string}
             */
            version: "0x3" | "0x100000000000000000000000000000003";
            /** Signature */
            signature: components["schemas"]["SIGNATURE"];
            /** Nonce */
            nonce: components["schemas"]["FELT"];
            /**
             * Contract address salt
             * @description The salt for the address of the deployed contract
             */
            contract_address_salt: components["schemas"]["FELT"];
            /**
             * Constructor calldata
             * @description The parameters passed to the constructor
             */
            constructor_calldata: components["schemas"]["FELT"][];
            /**
             * Class hash
             * @description The hash of the deployed contract's class
             */
            class_hash: components["schemas"]["FELT"];
            /**
             * Resource bounds
             * @description resource bounds for the transaction execution
             */
            resource_bounds: components["schemas"]["RESOURCE_BOUNDS_MAPPING"];
            /**
             * Tip
             * @description the tip for the transaction
             */
            tip: components["schemas"]["u64"];
            /**
             * Paymaster data
             * @description data needed to allow the paymaster to pay for the transaction in native tokens
             */
            paymaster_data: components["schemas"]["FELT"][];
            /**
             * Nonce DA mode
             * @description The storage domain of the account's nonce (an account has a nonce per DA mode)
             */
            nonce_data_availability_mode: components["schemas"]["DA_MODE"];
            /**
             * Fee DA mode
             * @description The storage domain of the account's balance from which fee will be charged
             */
            fee_data_availability_mode: components["schemas"]["DA_MODE"];
        };
        /**
         * Deploy Contract Transaction
         * @description The structure of a deploy transaction. Note that this transaction type is deprecated and will no longer be supported in future versions
         */
        DEPLOY_TXN: {
            /**
             * Version
             * @description Version of the transaction scheme
             */
            version: components["schemas"]["FELT"];
            /**
             * Deploy
             * @enum {string}
             */
            type: "DEPLOY";
            /**
             * Contract address salt
             * @description The salt for the address of the deployed contract
             */
            contract_address_salt: components["schemas"]["FELT"];
            /**
             * Constructor calldata
             * @description The parameters passed to the constructor
             */
            constructor_calldata: components["schemas"]["FELT"][];
            /**
             * Class hash
             * @description The hash of the deployed contract's class
             */
            class_hash: components["schemas"]["FELT"];
        };
        /**
         * Invoke transaction V0
         * @description invokes a specific function in the desired contract (not necessarily an account)
         */
        INVOKE_TXN_V0: {
            /**
             * Type
             * @enum {string}
             */
            type: "INVOKE";
            /**
             * Max fee
             * @description The maximal fee that can be charged for including the transaction
             */
            max_fee: components["schemas"]["FELT"];
            /**
             * Version
             * @description Version of the transaction scheme
             * @enum {string}
             */
            version: "0x0" | "0x100000000000000000000000000000000";
            /** Signature */
            signature: components["schemas"]["SIGNATURE"];
            /** Contract address */
            contract_address: components["schemas"]["ADDRESS"];
            /** Entry point selector */
            entry_point_selector: components["schemas"]["FELT"];
            /**
             * Calldata
             * @description The parameters passed to the function
             */
            calldata: components["schemas"]["FELT"][];
        };
        /**
         * Invoke transaction V1
         * @description initiates a transaction from a given account
         */
        INVOKE_TXN_V1: {
            /**
             * Type
             * @enum {string}
             */
            type: "INVOKE";
            /** sender address */
            sender_address: components["schemas"]["ADDRESS"];
            /**
             * calldata
             * @description The data expected by the account's `execute` function (in most usecases, this includes the called contract address and a function selector)
             */
            calldata: components["schemas"]["FELT"][];
            /**
             * Max fee
             * @description The maximal fee that can be charged for including the transaction
             */
            max_fee: components["schemas"]["FELT"];
            /**
             * Version
             * @description Version of the transaction scheme
             * @enum {string}
             */
            version: "0x1" | "0x100000000000000000000000000000001";
            /** Signature */
            signature: components["schemas"]["SIGNATURE"];
            /** Nonce */
            nonce: components["schemas"]["FELT"];
        };
        /**
         * Invoke transaction V3
         * @description initiates a transaction from a given account
         */
        INVOKE_TXN_V3: {
            /**
             * Type
             * @enum {string}
             */
            type: "INVOKE";
            /** sender address */
            sender_address: components["schemas"]["ADDRESS"];
            /**
             * calldata
             * @description The data expected by the account's `execute` function (in most usecases, this includes the called contract address and a function selector)
             */
            calldata: components["schemas"]["FELT"][];
            /**
             * Version
             * @description Version of the transaction scheme
             * @enum {string}
             */
            version: "0x3" | "0x100000000000000000000000000000003";
            /** Signature */
            signature: components["schemas"]["SIGNATURE"];
            /** Nonce */
            nonce: components["schemas"]["FELT"];
            /**
             * Resource bounds
             * @description resource bounds for the transaction execution
             */
            resource_bounds: components["schemas"]["RESOURCE_BOUNDS_MAPPING"];
            /**
             * Tip
             * @description the tip for the transaction
             */
            tip: components["schemas"]["u64"];
            /**
             * Paymaster data
             * @description data needed to allow the paymaster to pay for the transaction in native tokens
             */
            paymaster_data: components["schemas"]["FELT"][];
            /**
             * Account deployment data
             * @description data needed to deploy the account contract from which this tx will be initiated
             */
            account_deployment_data: components["schemas"]["FELT"][];
            /**
             * Nonce DA mode
             * @description The storage domain of the account's nonce (an account has a nonce per DA mode)
             */
            nonce_data_availability_mode: components["schemas"]["DA_MODE"];
            /**
             * Fee DA mode
             * @description The storage domain of the account's balance from which fee will be charged
             */
            fee_data_availability_mode: components["schemas"]["DA_MODE"];
            /**
             * Proof facts
             * @description Proof facts for the transaction. An empty array is returned if no proof facts exist for the transaction
             */
            proof_facts?: components["schemas"]["FELT"][];
        };
        /**
         * Invoke transaction
         * @description Initiate a transaction from an account
         */
        INVOKE_TXN: components["schemas"]["INVOKE_TXN_V0"] | components["schemas"]["INVOKE_TXN_V1"] | components["schemas"]["INVOKE_TXN_V3"];
        /** L1 Handler transaction */
        L1_HANDLER_TXN: {
            /**
             * Version
             * @description Version of the transaction scheme
             * @enum {string}
             */
            version: "0x0";
            /**
             * type
             * @enum {string}
             */
            type: "L1_HANDLER";
            /**
             * Nonce
             * @description The L1->L2 message nonce field of the SN Core L1 contract at the time the transaction was sent
             */
            nonce: components["schemas"]["NUM_AS_HEX"];
        } & components["schemas"]["FUNCTION_CALL"];
        COMMON_RECEIPT_PROPERTIES: {
            /**
             * Transaction hash
             * @description The hash identifying the transaction
             */
            transaction_hash: components["schemas"]["TXN_HASH"];
            /**
             * Actual fee
             * @description The fee that was charged by the sequencer
             */
            actual_fee: components["schemas"]["FEE_PAYMENT"];
            /**
             * Finality status
             * @description finality status of the tx
             */
            finality_status: components["schemas"]["TXN_FINALITY_STATUS"];
            /** Messages sent */
            messages_sent: components["schemas"]["MSG_TO_L1"][];
            /**
             * Events
             * @description The events emitted as part of this transaction
             */
            events: components["schemas"]["EVENT"][];
            /**
             * Execution resources
             * @description The resources consumed by the transaction
             */
            execution_resources: components["schemas"]["EXECUTION_RESOURCES"];
        } & ({
            /**
             * Execution status
             * @description The execution status of the transaction
             * @enum {string}
             */
            execution_status: "SUCCEEDED";
        } | {
            /**
             * Execution status
             * @description The execution status of the transaction
             * @enum {string}
             */
            execution_status: "REVERTED";
            /**
             * Revert reason
             * @description the revert reason for the failed execution
             */
            revert_reason: string;
        });
        /** Invoke Transaction Receipt */
        INVOKE_TXN_RECEIPT: {
            /**
             * Type
             * @enum {string}
             */
            type: "INVOKE";
        } & components["schemas"]["COMMON_RECEIPT_PROPERTIES"];
        /** Declare Transaction Receipt */
        DECLARE_TXN_RECEIPT: {
            /**
             * Declare
             * @enum {string}
             */
            type: "DECLARE";
        } & components["schemas"]["COMMON_RECEIPT_PROPERTIES"];
        /** Deploy Account Transaction Receipt */
        DEPLOY_ACCOUNT_TXN_RECEIPT: components["schemas"]["COMMON_RECEIPT_PROPERTIES"] & {
            /**
             * Deploy account
             * @enum {string}
             */
            type: "DEPLOY_ACCOUNT";
            /**
             * Contract address
             * @description The address of the deployed contract
             */
            contract_address: components["schemas"]["FELT"];
        };
        /** Deploy Transaction Receipt */
        DEPLOY_TXN_RECEIPT: components["schemas"]["COMMON_RECEIPT_PROPERTIES"] & {
            /**
             * Deploy
             * @enum {string}
             */
            type: "DEPLOY";
            /**
             * Contract address
             * @description The address of the deployed contract
             */
            contract_address: components["schemas"]["FELT"];
        };
        /**
         * L1 Handler Transaction Receipt
         * @description receipt for l1 handler transaction
         */
        L1_HANDLER_TXN_RECEIPT: {
            /**
             * type
             * @enum {string}
             */
            type: "L1_HANDLER";
            /**
             * Message hash
             * @description The message hash as it appears on the L1 core contract
             */
            message_hash: components["schemas"]["NUM_AS_HEX"];
        } & components["schemas"]["COMMON_RECEIPT_PROPERTIES"];
        /** Transaction Receipt */
        TXN_RECEIPT: components["schemas"]["INVOKE_TXN_RECEIPT"] | components["schemas"]["L1_HANDLER_TXN_RECEIPT"] | components["schemas"]["DECLARE_TXN_RECEIPT"] | components["schemas"]["DEPLOY_TXN_RECEIPT"] | components["schemas"]["DEPLOY_ACCOUNT_TXN_RECEIPT"];
        /** Transaction receipt with block info */
        TXN_RECEIPT_WITH_BLOCK_INFO: components["schemas"]["TXN_RECEIPT"] & {
            /**
             * Block hash
             * @description If this field is missing, it means the receipt belongs to the pre-confirmed block
             */
            block_hash?: components["schemas"]["BLOCK_HASH"];
            /** Block number */
            block_number: components["schemas"]["BLOCK_NUMBER"];
        };
        /** Message to L1 */
        MSG_TO_L1: {
            /** @description The address of the L2 contract sending the message */
            from_address: components["schemas"]["FELT"];
            /**
             * To address
             * @description The target L1 address the message is sent to
             */
            to_address: components["schemas"]["FELT"];
            /**
             * Payload
             * @description The payload of the message
             */
            payload: components["schemas"]["FELT"][];
        };
        /** Message from L1 */
        MSG_FROM_L1: {
            /** @description The address of the L1 contract sending the message */
            from_address: components["schemas"]["ETH_ADDRESS"];
            /**
             * To address
             * @description The target L2 address the message is sent to
             */
            to_address: components["schemas"]["ADDRESS"];
            /**
             * Selector
             * @description The selector of the l1_handler in invoke in the target contract
             */
            entry_point_selector: components["schemas"]["FELT"];
            /**
             * Payload
             * @description The payload of the message
             */
            payload: components["schemas"]["FELT"][];
        };
        /**
         * Transaction status result
         * @description Transaction status result, including finality status and execution status
         */
        TXN_STATUS_RESULT: {
            /** finality status */
            finality_status: components["schemas"]["TXN_STATUS"];
            /** execution status */
            execution_status?: components["schemas"]["TXN_EXECUTION_STATUS"];
            /**
             * failure reason
             * @description the failure reason, only appears if execution_status is REVERTED
             */
            failure_reason?: string;
        };
        /**
         * Transaction status
         * @description The finality status of the transaction, including the case the txn is still in the mempool or failed validation during the block construction phase
         * @enum {string}
         */
        TXN_STATUS: "RECEIVED" | "CANDIDATE" | "PRE_CONFIRMED" | "ACCEPTED_ON_L2" | "ACCEPTED_ON_L1";
        /**
         * Finality status
         * @description The finality status of the transaction
         * @enum {string}
         */
        TXN_FINALITY_STATUS: "PRE_CONFIRMED" | "ACCEPTED_ON_L2" | "ACCEPTED_ON_L1";
        /**
         * Execution status
         * @description The execution status of the transaction
         * @enum {string}
         */
        TXN_EXECUTION_STATUS: "SUCCEEDED" | "REVERTED";
        /**
         * Transaction type
         * @description The type of the transaction
         * @enum {string}
         */
        TXN_TYPE: "DECLARE" | "DEPLOY" | "DEPLOY_ACCOUNT" | "INVOKE" | "L1_HANDLER";
        /**
         * Block status
         * @description The status of the block
         * @enum {string}
         */
        BLOCK_STATUS: "PRE_CONFIRMED" | "ACCEPTED_ON_L2" | "ACCEPTED_ON_L1";
        /**
         * Function call
         * @description Function call information
         */
        FUNCTION_CALL: {
            /** Contract address */
            contract_address: components["schemas"]["ADDRESS"];
            /** Entry point selector */
            entry_point_selector: components["schemas"]["FELT"];
            /**
             * Calldata
             * @description The parameters passed to the function
             */
            calldata: components["schemas"]["FELT"][];
        };
        /** Contract class */
        CONTRACT_CLASS: {
            /**
             * Sierra program
             * @description The list of Sierra instructions of which the program consists
             */
            sierra_program: components["schemas"]["FELT"][];
            /**
             * Contract class version
             * @description The version of the contract class object. Currently, the Starknet OS supports version 0.1.0
             */
            contract_class_version: string;
            /** Entry points by type */
            entry_points_by_type: {
                /** Constructor */
                CONSTRUCTOR: components["schemas"]["SIERRA_ENTRY_POINT"][];
                /** External */
                EXTERNAL: components["schemas"]["SIERRA_ENTRY_POINT"][];
                /** L1 handler */
                L1_HANDLER: components["schemas"]["SIERRA_ENTRY_POINT"][];
            };
            /**
             * ABI
             * @description The class ABI, as supplied by the user declaring the class
             */
            abi?: string;
        };
        /**
         * Deprecated contract class
         * @description The definition of a StarkNet contract class
         */
        DEPRECATED_CONTRACT_CLASS: {
            /**
             * Program
             * @description A base64 representation of the compressed program code
             */
            program: string;
            /** Deprecated entry points by type */
            entry_points_by_type: {
                /** Deprecated constructor */
                CONSTRUCTOR?: components["schemas"]["DEPRECATED_CAIRO_ENTRY_POINT"][];
                /** Deprecated external */
                EXTERNAL?: components["schemas"]["DEPRECATED_CAIRO_ENTRY_POINT"][];
                /** Deprecated L1 handler */
                L1_HANDLER?: components["schemas"]["DEPRECATED_CAIRO_ENTRY_POINT"][];
            };
            /** Contract ABI */
            abi?: components["schemas"]["CONTRACT_ABI"];
        };
        /** Deprecated Cairo entry point */
        DEPRECATED_CAIRO_ENTRY_POINT: {
            /**
             * Offset
             * @description The offset of the entry point in the program
             */
            offset: components["schemas"]["NUM_AS_HEX"];
            /**
             * Selector
             * @description A unique identifier of the entry point (function) in the program
             */
            selector: components["schemas"]["FELT"];
        };
        /** Sierra entry point */
        SIERRA_ENTRY_POINT: {
            /**
             * Selector
             * @description A unique identifier of the entry point (function) in the program
             */
            selector: components["schemas"]["FELT"];
            /**
             * Function index
             * @description The index of the function in the program
             */
            function_idx: number;
        };
        /** Contract ABI */
        CONTRACT_ABI: components["schemas"]["CONTRACT_ABI_ENTRY"][];
        /** Contract ABI entry */
        CONTRACT_ABI_ENTRY: components["schemas"]["FUNCTION_ABI_ENTRY"] | components["schemas"]["EVENT_ABI_ENTRY"] | components["schemas"]["STRUCT_ABI_ENTRY"];
        /**
         * Struct ABI type
         * @enum {string}
         */
        STRUCT_ABI_TYPE: "struct";
        /**
         * Event ABI type
         * @enum {string}
         */
        EVENT_ABI_TYPE: "event";
        /**
         * Function ABI type
         * @enum {string}
         */
        FUNCTION_ABI_TYPE: "function" | "l1_handler" | "constructor";
        /** Struct ABI entry */
        STRUCT_ABI_ENTRY: {
            /** Struct ABI type */
            type: components["schemas"]["STRUCT_ABI_TYPE"];
            /**
             * Struct name
             * @description The struct name
             */
            name: string;
            /** Size */
            size: number;
            /** Members */
            members: components["schemas"]["STRUCT_MEMBER"][];
        };
        /** Struct member */
        STRUCT_MEMBER: components["schemas"]["TYPED_PARAMETER"] & {
            /**
             * Offset
             * @description offset of this property within the struct
             */
            offset?: number;
        };
        /** Event ABI entry */
        EVENT_ABI_ENTRY: {
            /** Event ABI type */
            type: components["schemas"]["EVENT_ABI_TYPE"];
            /**
             * Event name
             * @description The event name
             */
            name: string;
            /** Typed parameter */
            keys: components["schemas"]["TYPED_PARAMETER"][];
            /** Typed parameter */
            data: components["schemas"]["TYPED_PARAMETER"][];
        };
        /**
         * Function state mutability type
         * @enum {string}
         */
        FUNCTION_STATE_MUTABILITY: "view";
        /** Function ABI entry */
        FUNCTION_ABI_ENTRY: {
            /** Function ABI type */
            type: components["schemas"]["FUNCTION_ABI_TYPE"];
            /**
             * Function name
             * @description The function name
             */
            name: string;
            /** Typed parameter */
            inputs: components["schemas"]["TYPED_PARAMETER"][];
            /** Typed parameter */
            outputs: components["schemas"]["TYPED_PARAMETER"][];
            /** Function state mutability */
            stateMutability?: components["schemas"]["FUNCTION_STATE_MUTABILITY"];
        };
        /** Typed parameter */
        TYPED_PARAMETER: {
            /**
             * Parameter name
             * @description The parameter's name
             */
            name: string;
            /**
             * Parameter type
             * @description The parameter's type
             */
            type: string;
        };
        /**
         * @description Flags that indicate how to simulate a given transaction. By default, the sequencer behavior is replicated locally
         * @enum {string}
         */
        SIMULATION_FLAG_FOR_ESTIMATE_FEE: "SKIP_VALIDATE";
        /**
         * @description Flags that control what additional fields are included in transaction responses. INCLUDE_PROOF_FACTS: Include proof_facts field in the response (an empty array is returned if no proof facts exist for the transaction).
         * @enum {string}
         */
        TXN_RESPONSE_FLAG: "INCLUDE_PROOF_FACTS";
        /**
         * @description Flags that control what additional fields are included in storage responses. INCLUDE_LAST_UPDATE_BLOCK: changes the return type to include the block number of the most recent block that modified this storage slot.
         * @enum {string}
         */
        STORAGE_RESPONSE_FLAG: "INCLUDE_LAST_UPDATE_BLOCK";
        /**
         * Storage result with metadata
         * @description The storage value along with additional metadata about the storage slot
         */
        STORAGE_RESULT: {
            /**
             * Value
             * @description The value at the given key for the given contract. 0 if no value is found
             */
            value: components["schemas"]["FELT"];
            /**
             * Last update block
             * @description The block number of the most recent block that included a modification to this storage slot. 0 if the storage slot has never been modified (i.e. the value is 0)
             */
            last_update_block: components["schemas"]["BLOCK_NUMBER"];
        };
        /**
         * Price unit wei
         * @enum {string}
         */
        PRICE_UNIT_WEI: "WEI";
        /**
         * Price unit fri
         * @enum {string}
         */
        PRICE_UNIT_FRI: "FRI";
        /**
         * Price unit
         * @description Units in which the fee is given
         */
        PRICE_UNIT: components["schemas"]["PRICE_UNIT_WEI"] | components["schemas"]["PRICE_UNIT_FRI"];
        /** Fee estimation common fields */
        FEE_ESTIMATE_COMMON: {
            /**
             * L1 gas consumed
             * @description The Ethereum gas consumption of the transaction, charged for L1->L2 messages and, depending on the block's DA_MODE, state diffs
             */
            l1_gas_consumed: components["schemas"]["u64"];
            /**
             * L1 gas price
             * @description The gas price (in wei or fri, depending on the tx version) that was used in the cost estimation
             */
            l1_gas_price: components["schemas"]["u128"];
            /**
             * L2 gas consumed
             * @description The L2 gas consumption of the transaction
             */
            l2_gas_consumed: components["schemas"]["u64"];
            /**
             * L2 gas price
             * @description The L2 gas price (in wei or fri, depending on the tx version) that was used in the cost estimation
             */
            l2_gas_price: components["schemas"]["u128"];
            /**
             * L1 data gas consumed
             * @description The Ethereum data gas consumption of the transaction
             */
            l1_data_gas_consumed: components["schemas"]["u64"];
            /**
             * L1 data gas price
             * @description The data gas price (in wei or fri, depending on the tx version) that was used in the cost estimation
             */
            l1_data_gas_price: components["schemas"]["u128"];
            /**
             * Overall fee
             * @description The estimated fee for the transaction (in wei or fri, depending on the tx version), equals to l1_gas_consumed*l1_gas_price + l1_data_gas_consumed*l1_data_gas_price + l2_gas_consumed*l2_gas_price
             */
            overall_fee: components["schemas"]["u128"];
        };
        /** Fee estimation */
        FEE_ESTIMATE: components["schemas"]["FEE_ESTIMATE_COMMON"] & {
            /**
             * Fee unit
             * @description Units in which the fee is given, can only be FRI
             */
            unit: components["schemas"]["PRICE_UNIT_FRI"];
        };
        /** Message fee estimation */
        MESSAGE_FEE_ESTIMATE: components["schemas"]["FEE_ESTIMATE_COMMON"] & {
            /**
             * Fee unit
             * @description Units in which the fee is given, can only be WEI
             */
            unit: components["schemas"]["PRICE_UNIT_WEI"];
        };
        /**
         * Fee Payment
         * @description fee payment info as it appears in receipts
         */
        FEE_PAYMENT: {
            /**
             * Amount
             * @description amount paid
             */
            amount: components["schemas"]["FELT"];
            /**
             * Fee unit
             * @description units in which the fee is given
             */
            unit: components["schemas"]["PRICE_UNIT"];
        };
        /**
         * DA mode
         * @description Specifies a storage domain in Starknet. Each domain has different guarantees regarding availability
         * @enum {string}
         */
        DA_MODE: "L1" | "L2";
        RESOURCE_BOUNDS_MAPPING: {
            /**
             * L1 Gas
             * @description The max amount and max price per unit of L1 gas used in this tx
             */
            l1_gas: components["schemas"]["RESOURCE_BOUNDS"];
            /**
             * L1 Data Gas
             * @description The max amount and max price per unit of L1 blob gas used in this tx
             */
            l1_data_gas: components["schemas"]["RESOURCE_BOUNDS"];
            /**
             * L2 Gas
             * @description The max amount and max price per unit of L2 gas used in this tx
             */
            l2_gas: components["schemas"]["RESOURCE_BOUNDS"];
        };
        RESOURCE_BOUNDS: {
            /**
             * max amount
             * @description the max amount of the resource that can be used in the tx
             */
            max_amount: components["schemas"]["u64"];
            /**
             * max price
             * @description the max price per unit of this resource for this tx
             */
            max_price_per_unit: components["schemas"]["u128"];
        };
        RESOURCE_PRICE: {
            /**
             * price in fri
             * @description the price of one unit of the given resource, denominated in fri (10^-18 strk)
             */
            price_in_fri: components["schemas"]["FELT"];
            /**
             * price in wei
             * @description the price of one unit of the given resource, denominated in wei
             */
            price_in_wei: components["schemas"]["FELT"];
        };
        /**
         * Execution resources
         * @description the resources consumed by the transaction
         */
        EXECUTION_RESOURCES: {
            /**
             * L1Gas
             * @description l1 gas consumed by this transaction, used for l2-->l1 messages and state updates if blobs are not used
             */
            l1_gas: number;
            /**
             * L1DataGas
             * @description data gas consumed by this transaction, 0 if blobs are not used
             */
            l1_data_gas: number;
            /**
             * L2Gas
             * @description l2 gas consumed by this transaction, used for computation and calldata
             */
            l2_gas: number;
        };
        /**
         * MP node
         * @description a node in the Merkle-Patricia tree, can be a leaf, binary node, or an edge node
         */
        MERKLE_NODE: components["schemas"]["BINARY_NODE"] | components["schemas"]["EDGE_NODE"];
        /** @description an internal node whose both children are non-zero */
        BINARY_NODE: {
            /** @description the hash of the left child */
            left: components["schemas"]["FELT"];
            /** @description the hash of the right child */
            right: components["schemas"]["FELT"];
        };
        /** @description represents a path to the highest non-zero descendant node */
        EDGE_NODE: {
            /** @description an unsigned integer whose binary representation represents the path from the current node to its highest non-zero descendant (bounded by 2^251) */
            path: components["schemas"]["NUM_AS_HEX"];
            /** @description the length of the path (bounded by 251) */
            length: number;
            /** @description the hash of the unique non-zero maximal-height descendant node */
            child: components["schemas"]["FELT"];
        };
        /** @description a node_hash -> node mapping of all the nodes in the union of the paths between the requested leaves and the root */
        NODE_HASH_TO_NODE_MAPPING: {
            node_hash: components["schemas"]["FELT"];
            node: components["schemas"]["MERKLE_NODE"];
        }[];
        /**
         * contract execution error
         * @description structured error that can later be processed by wallets or sdks
         */
        CONTRACT_EXECUTION_ERROR: components["schemas"]["CONTRACT_EXECUTION_ERROR_INNER"];
        /**
         * contract execution error
         * @description structured error that can later be processed by wallets or sdks
         */
        CONTRACT_EXECUTION_ERROR_INNER: {
            contract_address: components["schemas"]["ADDRESS"];
            class_hash: components["schemas"]["FELT"];
            selector: components["schemas"]["FELT"];
            error: components["schemas"]["CONTRACT_EXECUTION_ERROR"];
        } | string;
        /** JSON-RPC spec version */
        JSON_RPC_spec_version: string;
        /** Block id */
        Block_id: components["schemas"]["BLOCK_ID"];
        /** Starknet get block hash with tx hashes result */
        Starknet_get_block_hash_with_tx_hashes_result: components["schemas"]["BLOCK_WITH_TX_HASHES"] | components["schemas"]["PRE_CONFIRMED_BLOCK_WITH_TX_HASHES"];
        /** @default [] */
        starknet_getBlockWithTxs_Param1_response_flags: components["schemas"]["TXN_RESPONSE_FLAG"][];
        /** Starknet get block with txs result */
        Starknet_get_block_with_txs_result: components["schemas"]["BLOCK_WITH_TXS"] | components["schemas"]["PRE_CONFIRMED_BLOCK_WITH_TXS"];
        /** @default [] */
        starknet_getBlockWithReceipts_Param1_response_flags: components["schemas"]["TXN_RESPONSE_FLAG"][];
        /** Starknet get block with txs and receipts result */
        Starknet_get_block_with_txs_and_receipts_result: components["schemas"]["BLOCK_WITH_RECEIPTS"] | components["schemas"]["PRE_CONFIRMED_BLOCK_WITH_RECEIPTS"];
        /** Contract addresses */
        Contract_addresses: components["schemas"]["ADDRESS"][];
        /** Starknet get state update result */
        Starknet_get_state_update_result: components["schemas"]["STATE_UPDATE"] | components["schemas"]["PRE_CONFIRMED_STATE_UPDATE"];
        /** Address */
        Address: components["schemas"]["ADDRESS"];
        /** Storage key */
        Storage_key: components["schemas"]["STORAGE_KEY"];
        /** @default [] */
        starknet_getStorageAt_Param3_response_flags: components["schemas"]["STORAGE_RESPONSE_FLAG"][];
        /** Storage value result */
        Storage_value_result: components["schemas"]["FELT"] | components["schemas"]["STORAGE_RESULT"];
        /** Transaction hash */
        Transaction_hash: components["schemas"]["TXN_HASH"];
        starknet_getTransactionStatus_Result: components["schemas"]["TXN_STATUS_RESULT"];
        starknet_getMessagesStatus_Result: {
            transaction_hash: components["schemas"]["TXN_HASH"];
            /** finality status */
            finality_status: components["schemas"]["TXN_FINALITY_STATUS"];
            /** execution status */
            execution_status: components["schemas"]["TXN_EXECUTION_STATUS"];
            /**
             * failure reason
             * @description The failure reason. Only appears if `execution_status` is REVERTED
             */
            failure_reason?: string;
        }[];
        /** @default [] */
        starknet_getTransactionByHash_Param1_response_flags: components["schemas"]["TXN_RESPONSE_FLAG"][];
        starknet_getTransactionByHash_Result: components["schemas"]["TXN_WITH_HASH"];
        /** Index */
        Index: number;
        /** @default [] */
        starknet_getTransactionByBlockIdAndIndex_Param2_response_flags: components["schemas"]["TXN_RESPONSE_FLAG"][];
        starknet_getTransactionByBlockIdAndIndex_Result: components["schemas"]["TXN_WITH_HASH"];
        /** Transaction receipt with block info */
        Transaction_receipt_with_block_info: components["schemas"]["TXN_RECEIPT_WITH_BLOCK_INFO"];
        /** Field element */
        Field_element: components["schemas"]["FELT"];
        /** Starknet get class result */
        Starknet_get_class_result: components["schemas"]["DEPRECATED_CONTRACT_CLASS"] | components["schemas"]["CONTRACT_CLASS"];
        /** Starknet get class at result */
        Starknet_get_class_at_result: components["schemas"]["DEPRECATED_CONTRACT_CLASS"] | components["schemas"]["CONTRACT_CLASS"];
        /** Block transaction count */
        Block_transaction_count: number;
        /** Function call */
        Function_call: components["schemas"]["FUNCTION_CALL"];
        /**
         * Transaction
         * @description a sequence of transactions to estimate, running each transaction on the state resulting from applying all the previous ones
         */
        Transaction: components["schemas"]["BROADCASTED_TXN"][];
        starknet_estimateFee_Param1_simulation_flags: components["schemas"]["SIMULATION_FLAG_FOR_ESTIMATE_FEE"][];
        /**
         * Estimation
         * @description a sequence of fee estimation where the i'th estimate corresponds to the i'th transaction
         */
        Estimation: components["schemas"]["FEE_ESTIMATE"][];
        starknet_estimateMessageFee_Param0_message: components["schemas"]["MSG_FROM_L1"];
        starknet_estimateMessageFee_Result: components["schemas"]["MESSAGE_FEE_ESTIMATE"];
        /** Block number */
        Block_number: components["schemas"]["BLOCK_NUMBER"];
        /** Starknet block hash and number result */
        Starknet_block_hash_and_number_result: {
            /** Block hash */
            block_hash: components["schemas"]["BLOCK_HASH"];
            /** Block number */
            block_number: components["schemas"]["BLOCK_NUMBER"];
        };
        /** Chain id */
        Chain_id: components["schemas"]["CHAIN_ID"];
        /** SyncingStatus */
        SyncingStatus: boolean | components["schemas"]["SYNC_STATUS"];
        /** Events request */
        Events_request: components["schemas"]["EVENT_FILTER"] & components["schemas"]["RESULT_PAGE_REQUEST"];
        /** Events chunk */
        Events_chunk: components["schemas"]["EVENTS_CHUNK"];
        /** classes */
        classes: components["schemas"]["FELT"][];
        /** contracts */
        contracts: components["schemas"]["ADDRESS"][];
        starknet_getStorageProof_Param3_contracts_storage_keys: {
            contract_address: components["schemas"]["ADDRESS"];
            storage_keys: components["schemas"]["STORAGE_KEY"][];
        }[];
        starknet_getStorageProof_Result: {
            classes_proof: components["schemas"]["NODE_HASH_TO_NODE_MAPPING"];
            contracts_proof: {
                /** @description The nodes in the union of the paths from the contracts tree root to the requested leaves */
                nodes: components["schemas"]["NODE_HASH_TO_NODE_MAPPING"];
                contract_leaves_data: {
                    nonce: components["schemas"]["FELT"];
                    class_hash: components["schemas"]["FELT"];
                    storage_root?: components["schemas"]["FELT"];
                }[];
            };
            contracts_storage_proofs: components["schemas"]["NODE_HASH_TO_NODE_MAPPING"][];
            global_roots: {
                contracts_tree_root: components["schemas"]["FELT"];
                classes_tree_root: components["schemas"]["FELT"];
                /** @description the associated block hash (needed in case the caller used a block tag for the block_id parameter) */
                block_hash: components["schemas"]["FELT"];
            };
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export type operations = Record<string, never>;
