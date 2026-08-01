export interface paths {
    "/api/v2/jsonRPC": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * JSON-RPC endpoint
         * @description Endpoint for JSON-RPC requests
         */
        post: operations["jsonRPC_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v2/detectAddress": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Detect address
         * @description Get all possible address forms
         */
        get: operations["detectAddress_get"];
        put?: never;
        /**
         * Detect address
         * @description Get all possible address forms
         */
        post: operations["detectAddress_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v2/detectHash": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Detect hash
         * @description Get all possible hash forms
         */
        get: operations["detectHash_get"];
        put?: never;
        /**
         * Detect hash
         * @description Get all possible hash forms
         */
        post: operations["detectHash_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v2/packAddress": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Pack address
         * @description Pack address to base64 form
         */
        get: operations["packAddress_get"];
        put?: never;
        /**
         * Pack address
         * @description Pack address to base64 form
         */
        post: operations["packAddress_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v2/unpackAddress": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Unpack address
         * @description Unpack address from base64 form
         */
        get: operations["unpackAddress_get"];
        put?: never;
        /**
         * Unpack address
         * @description Unpack address from base64 form
         */
        post: operations["unpackAddress_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v2/getAddressInformation": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Address Information
         * @description Get basic information about address
         */
        get: operations["getAddressInformation_get"];
        put?: never;
        /**
         * Get Address Information
         * @description Get basic information about address
         */
        post: operations["getAddressInformation_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v2/getExtendedAddressInformation": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Extended Address Information
         * @description Get extended information about address
         */
        get: operations["getExtendedAddressInformation_get"];
        put?: never;
        /**
         * Get Extended Address Information
         * @description Get extended information about address
         */
        post: operations["getExtendedAddressInformation_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v2/getShardAccountCell": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Shard Address Cell
         * @description Get raw TVM cell with shard account
         */
        get: operations["getShardAccountCell_get"];
        put?: never;
        /**
         * Get Shard Address Cell
         * @description Get raw TVM cell with shard account
         */
        post: operations["getShardAccountCell_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v2/getWalletInformation": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Wallet Information
         * @description Get wallet-specific information about address
         */
        get: operations["getWalletInformation_get"];
        put?: never;
        /**
         * Get Wallet Information
         * @description Get wallet-specific information about address
         */
        post: operations["getWalletInformation_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v2/getAddressBalance": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Address Balance
         * @description Get address balance in nanotons
         */
        get: operations["getAddressBalance_get"];
        put?: never;
        /**
         * Get Address Balance
         * @description Get address balance in nanotons
         */
        post: operations["getAddressBalance_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v2/getAddressState": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Address State
         * @description Get address state (active, uninitialized or frozen)
         */
        get: operations["getAddressState_get"];
        put?: never;
        /**
         * Get Address State
         * @description Get address state (active, uninitialized or frozen)
         */
        post: operations["getAddressState_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v2/getTokenData": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Token Data
         * @description Get Jetton/NFT metadata from token smart contract
         */
        get: operations["getTokenData_get"];
        put?: never;
        /**
         * Get Token Data
         * @description Get Jetton/NFT metadata from token smart contract
         */
        post: operations["getTokenData_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v2/dnsResolve": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Resolve TON DNS name
         * @description Resolve TON DNS contract
         */
        get: operations["dnsResolve_get"];
        put?: never;
        /**
         * Resolve TON DNS name
         * @description Resolve TON DNS contract
         */
        post: operations["dnsResolve_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v2/getMasterchainInfo": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Masterchain Info
         * @description Get up-to-date masterchain state
         */
        get: operations["getMasterchainInfo_get"];
        put?: never;
        /**
         * Get Masterchain Info
         * @description Get up-to-date masterchain state
         */
        post: operations["getMasterchainInfo_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v2/getMasterchainBlockSignatures": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Masterchain Block Signatures
         * @description Get signatures of validators for masterchain block
         */
        get: operations["getMasterchainBlockSignatures_get"];
        put?: never;
        /**
         * Get Masterchain Block Signatures
         * @description Get signatures of validators for masterchain block
         */
        post: operations["getMasterchainBlockSignatures_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v2/getShardBlockProof": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Shard Block Proof
         * @description Get merkle proof of shard block
         */
        get: operations["getShardBlockProof_get"];
        put?: never;
        /**
         * Get Shard Block Proof
         * @description Get merkle proof of shard block
         */
        post: operations["getShardBlockProof_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v2/getConsensusBlock": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Consensus Block
         * @description Get block that was confirmed by consensus
         */
        get: operations["getConsensusBlock_get"];
        put?: never;
        /**
         * Get Consensus Block
         * @description Get block that was confirmed by consensus
         */
        post: operations["getConsensusBlock_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v2/lookupBlock": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Lookup Block
         * @description Look up block by seqno, shard and workchain
         */
        get: operations["lookupBlock_get"];
        put?: never;
        /**
         * Lookup Block
         * @description Look up block by seqno, shard and workchain
         */
        post: operations["lookupBlock_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v2/getShards": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Shards
         * @description Get shards information by given masterchain block seqno
         */
        get: operations["getShards_get"];
        put?: never;
        /**
         * Get Shards
         * @description Get shards information
         */
        post: operations["getShards_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v2/getBlockHeader": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Block Header
         * @description Get block header information
         */
        get: operations["getBlockHeader_get"];
        put?: never;
        /**
         * Get Block Header
         * @description Get block header information
         */
        post: operations["getBlockHeader_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v2/getOutMsgQueueSize": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Out Msg Queue Size
         * @description Get size of outbound message queue
         */
        get: operations["getOutMsgQueueSize_get"];
        put?: never;
        /**
         * Get Out Msg Queue Size
         * @description Get size of outbound message queue
         */
        post: operations["getOutMsgQueueSize_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v2/getBlockTransactions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Block Transactions
         * @description Get transactions in specified block
         */
        get: operations["getBlockTransactions_get"];
        put?: never;
        /**
         * Get Block Transactions
         * @description Get transactions in specified block
         */
        post: operations["getBlockTransactions_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v2/getBlockTransactionsExt": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Block Transactions Extended
         * @description Get transactions in specified block with extended information
         */
        get: operations["getBlockTransactionsExt_get"];
        put?: never;
        /**
         * Get Block Transactions Extended
         * @description Get transactions in specified block with extended information
         */
        post: operations["getBlockTransactionsExt_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v2/getTransactions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Transactions
         * @description Get transactions for specified address
         */
        get: operations["getTransactions_get"];
        put?: never;
        /**
         * Get Transactions
         * @description Get transactions for specified address
         */
        post: operations["getTransactions_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v2/getTransactionsStd": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Transactions Std
         * @description Standardized version of getTransactions
         */
        get: operations["getTransactionsStd_get"];
        put?: never;
        /**
         * Get Transactions Std
         * @description Standardized version of getTransactions
         */
        post: operations["getTransactionsStd_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v2/tryLocateTx": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Try Locate Transaction
         * @description Try to locate outcoming transaction of __destination__ address by incoming message
         */
        get: operations["tryLocateTx_get"];
        put?: never;
        /**
         * Try Locate Transaction
         * @description Try to locate transaction by incoming message parameters
         */
        post: operations["tryLocateTx_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v2/tryLocateResultTx": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Try Locate Result Transaction
         * @description Same as previous. Try to locate outcoming transaction of destination address by incoming message
         */
        get: operations["tryLocateResultTx_get"];
        put?: never;
        /**
         * Try Locate Result Transaction
         * @description Try to locate incoming transaction of source address by outcoming message
         */
        post: operations["tryLocateResultTx_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v2/tryLocateSourceTx": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Try Locate Source Transaction
         * @description Try to locate source transaction by destination transaction parameters
         */
        get: operations["tryLocateSourceTx_get"];
        put?: never;
        /**
         * Try Locate Source Transaction
         * @description Try to locate source transaction by destination transaction parameters
         */
        post: operations["tryLocateSourceTx_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v2/getConfigParam": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Config Parameter
         * @description Get blockchain configuration parameter
         */
        get: operations["getConfigParam_get"];
        put?: never;
        /**
         * Get Config Parameter
         * @description Get blockchain configuration parameter
         */
        post: operations["getConfigParam_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v2/getConfigAll": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get All Config
         * @description Get all blockchain configuration parameters
         */
        get: operations["getConfigAll_get"];
        put?: never;
        /**
         * Get All Config
         * @description Get all blockchain configuration parameters
         */
        post: operations["getConfigAll_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v2/getLibraries": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Libraries
         * @description Get library code by their hashes
         */
        get: operations["getLibraries_get"];
        put?: never;
        /**
         * Get Libraries
         * @description Get library entries by their hashes
         */
        post: operations["getLibraries_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v2/runGetMethod": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Run Get Method
         * @description Run get method of smart contract
         */
        post: operations["runGetMethod_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v2/runGetMethodStd": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Run Get Method Std
         * @description Run get method of smart contract
         */
        post: operations["runGetMethodStd_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v2/sendBoc": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Send BOC
         * @description Send bag of cells to blockchain
         */
        post: operations["sendBoc_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v2/sendBocReturnHash": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Send BOC Return Hash
         * @description Send bag of cells to blockchain and return hash
         */
        post: operations["sendBocReturnHash_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v2/estimateFee": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Estimate Fee
         * @description Estimate fee for query
         */
        post: operations["estimateFee_post"];
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
        EmptyRequest: Record<string, never>;
        AddressRequest: {
            address: components["schemas"]["TonAddr"];
        };
        AddressWithSeqnoRequest: {
            address: components["schemas"]["TonAddr"];
            seqno?: string | number;
        };
        SeqnoRequest: {
            seqno: string | number;
        };
        DetectAddressRequest: components["schemas"]["AddressRequest"];
        DetectHashRequest: {
            hash: components["schemas"]["TonHash"];
        };
        PackAddressRequest: components["schemas"]["AddressRequest"];
        UnpackAddressRequest: components["schemas"]["AddressRequest"];
        AddressInformationRequest: components["schemas"]["AddressWithSeqnoRequest"];
        ShardAccountCellRequest: components["schemas"]["AddressWithSeqnoRequest"];
        ExtendedAddressInformationRequest: components["schemas"]["AddressWithSeqnoRequest"];
        WalletInformationRequest: components["schemas"]["AddressWithSeqnoRequest"];
        AddressBalanceRequest: components["schemas"]["AddressWithSeqnoRequest"];
        AddressStateRequest: components["schemas"]["AddressWithSeqnoRequest"];
        TokenDataRequest: components["schemas"]["AddressWithSeqnoRequest"];
        DnsResolveRequest: {
            address: components["schemas"]["TonAddr"];
            name?: string;
            category?: string;
            /** Format: int32 */
            ttl?: number;
            /** Format: int32 */
            seqno?: number;
        };
        MasterchainInfoRequest: components["schemas"]["EmptyRequest"];
        MasterchainBlockSignaturesRequest: components["schemas"]["SeqnoRequest"];
        ShardBlockProofRequest: {
            workchain: string | number;
            shard: string | number;
            seqno: string | number;
            from_seqno?: string | number;
        };
        ConsensusBlockRequest: components["schemas"]["EmptyRequest"];
        LookupBlockRequest: {
            workchain: string | number;
            shard: string | number;
            seqno?: string | number;
            lt?: string | number;
            unixtime?: string | number;
        };
        ShardsRequest: components["schemas"]["SeqnoRequest"];
        BlockHeaderRequest: {
            workchain: string | number;
            shard: string | number;
            seqno: string | number;
            root_hash?: components["schemas"]["TonHash"];
            file_hash?: components["schemas"]["TonHash"];
        };
        OutMsgQueueSizeRequest: components["schemas"]["EmptyRequest"];
        BlockTransactionsRequest: {
            workchain: string | number;
            shard: string | number;
            seqno: string | number;
            root_hash?: components["schemas"]["TonHash"];
            file_hash?: components["schemas"]["TonHash"];
            after_lt?: string | number;
            after_hash?: components["schemas"]["TonAddrWithoutWorkchain"];
            count?: string | number;
        };
        BlockTransactionsExtRequest: components["schemas"]["BlockTransactionsRequest"];
        TransactionsRequest: {
            address: components["schemas"]["TonAddr"];
            lt?: string | number;
            hash?: components["schemas"]["TonHash"];
            to_lt?: string | number;
            archival?: string | number | boolean;
            limit?: string | number;
        };
        TryLocateTxRequest: {
            source: components["schemas"]["TonAddr"];
            destination: components["schemas"]["TonAddr"];
            created_lt: string | number;
        };
        TryLocateResultTxRequest: components["schemas"]["TryLocateTxRequest"];
        TryLocateSourceTxRequest: components["schemas"]["TryLocateTxRequest"];
        ConfigParamRequest: {
            config_id?: string | number;
            param?: string | number;
            seqno?: string | number;
        };
        ConfigAllRequest: {
            seqno?: string | number;
        };
        LibrariesRequest: {
            libraries?: components["schemas"]["TonHash"][];
        };
        SendBocRequest: {
            boc: components["schemas"]["Bytes"];
        };
        EstimateFeeRequest: {
            address: components["schemas"]["TonAddr"];
            body: components["schemas"]["Bytes"];
            init_code?: components["schemas"]["Bytes"];
            init_data?: components["schemas"]["Bytes"];
            /** @default true */
            ignore_chksig: boolean;
        };
        JsonRpcRequest: {
            /** @default 2.0 */
            jsonrpc: string;
            id: string;
            method: string;
            params: {
                [key: string]: unknown;
            };
        };
        TonAddr: string;
        TonAddrWithoutWorkchain: string;
        TonHash: string;
        TonHashHex: string;
        Int256: string;
        Bytes: string;
        AccountAddress: {
            /**
             * @default accountAddress
             * @enum {string}
             */
            "@type": "accountAddress";
            account_address: string;
        };
        AdnlAddress: {
            /**
             * @default adnlAddress
             * @enum {string}
             */
            "@type": "adnlAddress";
            adnl_address: string;
        };
        /** @description Extended block identifier. */
        TonBlockIdExt: {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            "@type": "ton.blockIdExt";
            workchain: number;
            shard: string;
            seqno: number;
            root_hash: components["schemas"]["TonHash"];
            file_hash: components["schemas"]["TonHash"];
        };
        /** @description Base64 form of address variant */
        DetectAddressBase64Variant: {
            /**
             * @default ext.utils.detectedAddressVariant
             * @enum {string}
             */
            "@type": "ext.utils.detectedAddressVariant";
            b64: string;
            b64url: string;
        };
        ExtraCurrencyBalance: {
            /**
             * @default extraCurrency
             * @enum {string}
             */
            "@type": "extraCurrency";
            /** Format: int32 */
            id: number;
            amount: components["schemas"]["Int256"];
        };
        /** @description Internal transaction identifier. */
        InternalTransactionId: {
            /**
             * @default internal.transactionId
             * @enum {string}
             */
            "@type": "internal.transactionId";
            /** @description Logical time */
            lt: string;
            hash: components["schemas"]["TonHash"];
        };
        AccountStateRaw: {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            "@type": "raw.accountState";
            code: components["schemas"]["Bytes"];
            data: components["schemas"]["Bytes"];
            frozen_hash: components["schemas"]["TonHash"];
        };
        AccountStateWalletV3: {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            "@type": "wallet.v3.accountState";
            /** Format: int64 */
            wallet_id: number;
            /** Format: int32 */
            seqno: number;
        };
        AccountStateWalletV4: {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            "@type": "wallet.v4.accountState";
            /** Format: int64 */
            wallet_id: number;
            /** Format: int32 */
            seqno: number;
        };
        AccountStateWalletHighloadV1: {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            "@type": "wallet.highload.v1.accountState";
            /** Format: int64 */
            wallet_id: number;
            /** Format: int32 */
            seqno: number;
        };
        AccountStateWalletHighloadV2: {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            "@type": "wallet.highload.v2.accountState";
            /** Format: int64 */
            wallet_id: number;
        };
        AccountStateDns: {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            "@type": "dns.accountState";
            /** Format: int64 */
            wallet_id: number;
        };
        RWalletLimit: {
            /**
             * @default rwallet.limit
             * @enum {string}
             */
            "@type": "rwallet.limit";
            /** Format: int32 */
            seconds: number;
            /** Format: int64 */
            value: number;
        };
        RWalletConfig: {
            /**
             * @default rwallet.config
             * @enum {string}
             */
            "@type": "rwallet.config";
            /** Format: int64 */
            start_at: number;
            limits: components["schemas"]["RWalletLimit"][];
        };
        AccountStateRWallet: {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            "@type": "rwallet.accountState";
            /** Format: int64 */
            wallet_id: number;
            /** Format: int32 */
            seqno: number;
            /** Format: int64 */
            unlocked_balance: number;
            config: components["schemas"]["RWalletConfig"];
        };
        PChanConfig: {
            /**
             * @default pchan.config
             * @enum {string}
             */
            "@type": "pchan.config";
            alice_public_key: string;
            alice_address: components["schemas"]["AccountAddress"];
            bob_public_key: string;
            bob_address: components["schemas"]["AccountAddress"];
            /** Format: int32 */
            init_timeout: number;
            /** Format: int32 */
            close_timeout: number;
            /** Format: int64 */
            channel_id: number;
        };
        PChanStateInit: {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            "@type": "pchan.stateInit";
            signed_A: boolean;
            signed_B: boolean;
            /** Format: int64 */
            min_A: number;
            /** Format: int64 */
            min_B: number;
            /** Format: int64 */
            expire_at: number;
            /** Format: int64 */
            A: number;
            /** Format: int64 */
            B: number;
        };
        PChanStateClose: {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            "@type": "pchan.stateClose";
            signed_A: boolean;
            signed_B: boolean;
            /** Format: int64 */
            min_A: number;
            /** Format: int64 */
            min_B: number;
            /** Format: int64 */
            expire_at: number;
            /** Format: int64 */
            A: number;
            /** Format: int64 */
            B: number;
        };
        PChanStatePayout: {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            "@type": "pchan.statePayout";
            /** Format: int64 */
            A: number;
            /** Format: int64 */
            B: number;
        };
        PChanState: components["schemas"]["PChanStateInit"] | components["schemas"]["PChanStateClose"] | components["schemas"]["PChanStatePayout"];
        AccountStatePChan: {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            "@type": "pchan.accountState";
            config: components["schemas"]["PChanConfig"];
            state: components["schemas"]["PChanState"];
            description: string;
        };
        AccountStateUninited: {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            "@type": "uninited.accountState";
            frozen_hash: components["schemas"]["TonHash"];
        };
        AccountState: components["schemas"]["AccountStateRaw"] | components["schemas"]["AccountStateWalletV3"] | components["schemas"]["AccountStateWalletV4"] | components["schemas"]["AccountStateWalletHighloadV1"] | components["schemas"]["AccountStateWalletHighloadV2"] | components["schemas"]["AccountStateDns"] | components["schemas"]["AccountStateRWallet"] | components["schemas"]["AccountStatePChan"] | components["schemas"]["AccountStateUninited"];
        TokenContentDict: {
            [key: string]: unknown;
        };
        DnsRecordStorageAddress: {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            "@type": "dns_storage_address";
            bag_id: components["schemas"]["TonHashHex"];
        };
        DnsRecordAdnlAddress: {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            "@type": "dns_adnl_address";
            adnl_addr: components["schemas"]["TonHashHex"];
        };
        SmcAddr: {
            /**
             * @default addr_std
             * @enum {string}
             */
            "@type": "addr_std";
            /** Format: int32 */
            workchain_id: number;
            address: components["schemas"]["TonHashHex"];
        };
        DnsRecordSmcAddress: {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            "@type": "dns_smc_address";
            smc_addr: components["schemas"]["SmcAddr"];
        };
        DnsRecordNextResolver: {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            "@type": "dns_next_resolver";
            resolver: components["schemas"]["SmcAddr"];
        };
        DnsRecord: components["schemas"]["DnsRecordStorageAddress"] | components["schemas"]["DnsRecordSmcAddress"] | components["schemas"]["DnsRecordAdnlAddress"] | components["schemas"]["DnsRecordNextResolver"];
        DnsRecordSet: {
            dns_next_resolver?: components["schemas"]["DnsRecord"];
            wallet?: components["schemas"]["DnsRecord"];
            site?: components["schemas"]["DnsRecord"];
            storage?: components["schemas"]["DnsRecord"];
        } & {
            [key: string]: unknown;
        };
        DnsContent: {
            domain: string;
            data: components["schemas"]["DnsRecordSet"];
        };
        TokenContent: {
            /** @enum {string} */
            type: "onchain" | "offchain";
            data: string | components["schemas"]["TokenContentDict"];
        };
        JettonMasterData: {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            "@type": "ext.tokens.jettonMasterData";
            address: components["schemas"]["TonAddr"];
            /**
             * @default jetton_master
             * @enum {string}
             */
            contract_type: "jetton_master";
            total_supply: components["schemas"]["Int256"];
            mintable: boolean;
            admin_address?: components["schemas"]["TonAddr"];
            jetton_content: components["schemas"]["TokenContent"];
            jetton_wallet_code: components["schemas"]["Bytes"];
        };
        JettonWalletData: {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            "@type": "ext.tokens.jettonWalletData";
            address: components["schemas"]["TonAddr"];
            /**
             * @default jetton_wallet
             * @enum {string}
             */
            contract_type: "jetton_wallet";
            balance: components["schemas"]["Int256"];
            owner: components["schemas"]["TonAddr"];
            jetton: components["schemas"]["TonAddr"];
            mintless_is_claimed?: boolean;
            jetton_wallet_code: components["schemas"]["Bytes"];
        };
        NftCollectionData: {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            "@type": "ext.tokens.nftCollectionData";
            address: components["schemas"]["TonAddr"];
            /**
             * @default nft_collection
             * @enum {string}
             */
            contract_type: "nft_collection";
            next_item_index: components["schemas"]["Int256"];
            owner_address?: components["schemas"]["TonAddr"];
            collection_content: components["schemas"]["TokenContent"];
        };
        NftItemData: {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            "@type": "ext.tokens.nftItemData";
            address: components["schemas"]["TonAddr"];
            /**
             * @default nft_item
             * @enum {string}
             */
            contract_type: "nft_item";
            init: boolean;
            index: components["schemas"]["Int256"];
            collection_address?: components["schemas"]["TonAddr"];
            owner_address?: components["schemas"]["TonAddr"];
            content: components["schemas"]["TokenContent"] | components["schemas"]["DnsContent"];
        };
        TokenData: components["schemas"]["JettonMasterData"] | components["schemas"]["JettonWalletData"] | components["schemas"]["NftCollectionData"] | components["schemas"]["NftItemData"];
        DnsEntryDataUnknown: {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            "@type": "dns.entryDataUnknown";
            bytes: components["schemas"]["Bytes"];
        };
        DnsEntryDataText: {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            "@type": "dns.entryDataText";
            text: string;
        };
        DnsEntryDataNextResolver: {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            "@type": "dns.entryDataNextResolver";
            resolver: components["schemas"]["AccountAddress"];
        };
        DnsEntryDataSmcAddress: {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            "@type": "dns.entryDataSmcAddress";
            smc_address: components["schemas"]["AccountAddress"];
        };
        DnsEntryDataAdnlAddress: {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            "@type": "dns.entryDataAdnlAddress";
            adnl_address: components["schemas"]["AdnlAddress"];
        };
        DnsEntryDataStorageAddress: {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            "@type": "dns.entryDataStorageAddress";
            bag_id: components["schemas"]["TonHashHex"];
        };
        DnsEntryData: components["schemas"]["DnsEntryDataUnknown"] | components["schemas"]["DnsEntryDataText"] | components["schemas"]["DnsEntryDataNextResolver"] | components["schemas"]["DnsEntryDataSmcAddress"] | components["schemas"]["DnsEntryDataAdnlAddress"] | components["schemas"]["DnsEntryDataStorageAddress"];
        DnsEntry: {
            /**
             * @default dns.entry
             * @enum {string}
             */
            "@type": "dns.entry";
            name: string;
            category: components["schemas"]["TonHash"];
            entry: components["schemas"]["DnsEntryData"];
        };
        DnsResolved: {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            "@type": "dns.resolved";
            entries: components["schemas"]["DnsEntry"][];
        };
        /**
         * @description Computed from code/frozen_hash by the API server.
         * @enum {string}
         */
        AccountStateEnum: "uninitialized" | "active" | "frozen";
        BlockSignature: {
            /**
             * @default blocks.signature
             * @enum {string}
             */
            "@type": "blocks.signature";
            node_id_short: components["schemas"]["TonHash"];
            signature: components["schemas"]["Bytes"];
        };
        ShardBlockLink: {
            /**
             * @default blocks.shardBlockLink
             * @enum {string}
             */
            "@type": "blocks.shardBlockLink";
            id: components["schemas"]["TonBlockIdExt"];
            proof: components["schemas"]["Bytes"];
        };
        BlockLinkBack: {
            /**
             * @default blocks.blockLinkBack
             * @enum {string}
             */
            "@type": "blocks.blockLinkBack";
            to_key_block: boolean;
            from: components["schemas"]["TonBlockIdExt"];
            to: components["schemas"]["TonBlockIdExt"];
            dest_proof: components["schemas"]["Bytes"];
            proof: components["schemas"]["Bytes"];
            state_proof: components["schemas"]["Bytes"];
        };
        OutMsgQueueSize: {
            /**
             * @default blocks.outMsgQueueSize
             * @enum {string}
             */
            "@type": "blocks.outMsgQueueSize";
            /** @description Block identifier for the shard. */
            id: components["schemas"]["TonBlockIdExt"];
            /** @description Queue size for the shard. */
            size: number;
        };
        LibraryEntry: {
            /**
             * @default smc.libraryEntry
             * @enum {string}
             */
            "@type": "smc.libraryEntry";
            hash: components["schemas"]["TonHash"];
            data: components["schemas"]["Bytes"];
        };
        /** @description Short transaction identifier */
        ShortTxId: {
            /**
             * @default blocks.shortTxId
             * @enum {string}
             */
            "@type": "blocks.shortTxId";
            /** @description Transaction mode flags */
            mode: number;
            account: components["schemas"]["TonAddr"];
            /** @description Logical time of the transaction */
            lt: string;
            /** @description Base64 hash of the transaction */
            hash: components["schemas"]["TonHash"];
        };
        MsgDataRaw: {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            "@type": "msg.dataRaw";
            body?: components["schemas"]["Bytes"];
            init_state?: components["schemas"]["Bytes"];
        };
        MsgDataText: {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            "@type": "msg.dataText";
            text?: components["schemas"]["Bytes"];
        };
        MsgDataDecryptedText: {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            "@type": "msg.dataDecryptedText";
            text?: components["schemas"]["Bytes"];
        };
        MsgDataEncryptedText: {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            "@type": "msg.dataEncryptedText";
            text?: components["schemas"]["Bytes"];
        };
        MsgData: components["schemas"]["MsgDataRaw"] | components["schemas"]["MsgDataText"] | components["schemas"]["MsgDataDecryptedText"] | components["schemas"]["MsgDataEncryptedText"];
        MessageStd: {
            /**
             * @default raw.message
             * @enum {string}
             */
            "@type": "raw.message";
            hash: components["schemas"]["TonHash"];
            source: components["schemas"]["AccountAddress"];
            destination: components["schemas"]["AccountAddress"];
            value: components["schemas"]["Int256"];
            extra_currencies: components["schemas"]["ExtraCurrencyBalance"][];
            fwd_fee: components["schemas"]["Int256"];
            ihr_fee: components["schemas"]["Int256"];
            /** @description Logical time of the transaction */
            created_lt: string;
            body_hash: components["schemas"]["TonHash"];
            msg_data: components["schemas"]["MsgData"];
        };
        TransactionStd: {
            /**
             * @default raw.transaction
             * @enum {string}
             */
            "@type": "raw.transaction";
            address: components["schemas"]["AccountAddress"];
            /** @description UNIX timestamp of transaction */
            utime: number;
            data: components["schemas"]["Bytes"];
            transaction_id: components["schemas"]["InternalTransactionId"];
            fee: components["schemas"]["Int256"];
            storage_fee: components["schemas"]["Int256"];
            other_fee: components["schemas"]["Int256"];
            in_msg?: components["schemas"]["MessageStd"];
            out_msgs: components["schemas"]["MessageStd"][];
        };
        TransactionExt: components["schemas"]["TransactionStd"] & {
            /**
             * @default raw.transactionExt
             * @enum {string}
             */
            "@type": "raw.transactionExt";
            account?: components["schemas"]["TonAddr"];
        };
        Message: {
            /**
             * @default ext.message
             * @enum {string}
             */
            "@type": "ext.message";
            hash: components["schemas"]["TonHash"];
            source: components["schemas"]["TonAddr"];
            destination: components["schemas"]["TonAddr"];
            value: components["schemas"]["Int256"];
            extra_currencies: components["schemas"]["ExtraCurrencyBalance"][];
            fwd_fee: components["schemas"]["Int256"];
            ihr_fee: components["schemas"]["Int256"];
            /** @description Logical time of the transaction */
            created_lt: string;
            body_hash: components["schemas"]["TonHash"];
            msg_data: components["schemas"]["MsgData"];
            message?: string;
            message_decode_error?: string;
        };
        Transaction: {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            "@type": "ext.transaction";
            address: components["schemas"]["AccountAddress"];
            account: components["schemas"]["TonAddr"];
            /** @description UNIX timestamp of transaction */
            utime: number;
            data: components["schemas"]["Bytes"];
            transaction_id: components["schemas"]["InternalTransactionId"];
            fee: components["schemas"]["Int256"];
            storage_fee: components["schemas"]["Int256"];
            other_fee: components["schemas"]["Int256"];
            in_msg?: components["schemas"]["Message"];
            out_msgs: components["schemas"]["Message"][];
        };
        TonlibObject: components["schemas"]["DetectAddress"] | components["schemas"]["DetectHash"] | components["schemas"]["AddressInformation"] | components["schemas"]["ExtendedAddressInformation"] | components["schemas"]["WalletInformation"] | components["schemas"]["JettonMasterData"] | components["schemas"]["JettonWalletData"] | components["schemas"]["NftCollectionData"] | components["schemas"]["NftItemData"] | components["schemas"]["DnsResolved"] | components["schemas"]["MasterchainInfo"] | components["schemas"]["BlockSignatures"] | components["schemas"]["BlockSignaturesSimplex"] | components["schemas"]["ShardBlockProof"] | components["schemas"]["ConsensusBlock"] | components["schemas"]["TonBlockIdExt"] | components["schemas"]["Shards"] | components["schemas"]["BlockHeader"] | components["schemas"]["OutMsgQueueSizes"] | components["schemas"]["BlockTransactions"] | components["schemas"]["BlockTransactionsExt"] | components["schemas"]["Transaction"] | components["schemas"]["TransactionsStd"] | components["schemas"]["ConfigInfo"] | components["schemas"]["LibraryResult"] | components["schemas"]["QueryFees"] | components["schemas"]["ExtMessageInfo"] | components["schemas"]["ResultOk"] | components["schemas"]["RunGetMethodStdResult"] | components["schemas"]["RunGetMethodResult"] | components["schemas"]["TvmCell"];
        /** TonlibResponse */
        TonlibResponse: {
            /**
             * Ok
             * @default true
             */
            ok: boolean;
            result: string | components["schemas"]["AccountStateEnum"] | components["schemas"]["TonlibObject"] | components["schemas"]["TonlibObject"][];
            /** Extra information */
            "@extra": string;
            jsonrpc?: string;
            id?: string;
        };
        /** TonlibErrorResponse */
        TonlibErrorResponse: {
            /**
             * Ok
             * @default false
             */
            ok: boolean;
            /** Error description */
            error: string;
            /** Error code */
            code: number;
            /** Extra information */
            "@extra"?: string;
            jsonrpc?: string;
            id?: string;
        };
        JsonRpcResponse: {
            /** @default 2.0 */
            jsonrpc: string;
            id: string;
        } & components["schemas"]["TonlibResponse"];
        JsonRpcErrorResponse: {
            /** @default 2.0 */
            jsonrpc: string;
            id: string;
        } & components["schemas"]["TonlibErrorResponse"];
        /** @description Information about the address. */
        DetectAddress: {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            "@type": "ext.utils.detectAddress";
            raw_form: string;
            bounceable: components["schemas"]["DetectAddressBase64Variant"];
            non_bounceable: components["schemas"]["DetectAddressBase64Variant"];
            /** @enum {string} */
            given_type: "raw_form" | "friendly_bounceable" | "friendly_non_bounceable";
            test_only: boolean;
        };
        DetectHash: {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            "@type": "ext.utils.detectedHash";
            /** base64 form */
            b64: string;
            /** base64 url-safe form */
            b64url: string;
            /** hex form */
            hex: string;
        };
        /** Address packed in base64 */
        PackAddress: string;
        /** Address unpacked to raw form */
        UnpackAddress: string;
        AddressInformation: {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            "@type": "raw.fullAccountState";
            balance: components["schemas"]["Int256"];
            extra_currencies: components["schemas"]["ExtraCurrencyBalance"][];
            last_transaction_id: components["schemas"]["InternalTransactionId"];
            block_id: components["schemas"]["TonBlockIdExt"];
            code: components["schemas"]["Bytes"];
            data: components["schemas"]["Bytes"];
            frozen_hash: components["schemas"]["TonHash"];
            /** Format: int64 */
            sync_utime: number;
            state: components["schemas"]["AccountStateEnum"];
            suspended?: boolean;
        };
        ExtendedAddressInformation: {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            "@type": "fullAccountState";
            address: components["schemas"]["AccountAddress"];
            balance: components["schemas"]["Int256"];
            extra_currencies: components["schemas"]["ExtraCurrencyBalance"][];
            last_transaction_id: components["schemas"]["InternalTransactionId"];
            block_id: components["schemas"]["TonBlockIdExt"];
            /** Format: int64 */
            sync_utime: number;
            account_state: components["schemas"]["AccountState"];
            revision: number;
        };
        WalletInformation: {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            "@type": "ext.accounts.walletInformation";
            wallet: boolean;
            balance: string;
            account_state: components["schemas"]["AccountStateEnum"];
            last_transaction_id: components["schemas"]["InternalTransactionId"];
            /** @enum {string} */
            wallet_type?: "wallet v1 r1" | "wallet v1 r2" | "wallet v1 r3" | "wallet v2 r1" | "wallet v2 r2" | "wallet v3 r1" | "wallet v3 r2" | "wallet v4 r1" | "wallet v4 r2" | "wallet v5 beta" | "wallet v5 r1";
            /** Format: int64 */
            seqno?: number;
            wallet_id?: number;
            is_signature_allowed?: boolean;
        };
        AddressBalance: components["schemas"]["Int256"];
        AddressState: components["schemas"]["AccountStateEnum"];
        /** @description Information about the latest masterchain block. */
        MasterchainInfo: {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            "@type": "blocks.masterchainInfo";
            last: components["schemas"]["TonBlockIdExt"];
            state_root_hash: components["schemas"]["TonHash"];
            init: components["schemas"]["TonBlockIdExt"];
        };
        BlockSignatures: {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            "@type": "blocks.blockSignatures";
            id: components["schemas"]["TonBlockIdExt"];
            signatures: components["schemas"]["BlockSignature"][];
        };
        BlockSignaturesSimplex: {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            "@type": "blocks.blockSignatures.simplex";
            id: components["schemas"]["TonBlockIdExt"];
            signatures: components["schemas"]["BlockSignature"][];
            session_id: components["schemas"]["TonHash"];
            /** Format: int32 */
            slot: number;
            candidate: components["schemas"]["Bytes"];
        };
        MasterchainBlockSignatures: components["schemas"]["BlockSignatures"] | components["schemas"]["BlockSignaturesSimplex"];
        ShardBlockProof: {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            "@type": "blocks.shardBlockProof";
            from: components["schemas"]["TonBlockIdExt"];
            mc_id: components["schemas"]["TonBlockIdExt"];
            links: components["schemas"]["ShardBlockLink"][];
            mc_proof: components["schemas"]["BlockLinkBack"][];
        };
        ConsensusBlock: {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            "@type": "ext.blocks.consensusBlock";
            /** Format: int32 */
            consensus_block: number;
            /** Format: int32 */
            timestamp: number;
        };
        LookupBlock: components["schemas"]["TonBlockIdExt"];
        Shards: {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            "@type": "blocks.shards";
            shards: components["schemas"]["TonBlockIdExt"][];
        };
        /** @description Block header information. */
        BlockHeader: {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            "@type": "blocks.header";
            /** @description Extended identifier of the block. */
            id: components["schemas"]["TonBlockIdExt"];
            /** @description Global network identifier. */
            global_id: number;
            /** @description Block format version. */
            version: number;
            /** @description True if block was created after a merge. */
            after_merge: boolean;
            /** @description True if block was created after a split. */
            after_split: boolean;
            /** @description True if block was created before a split. */
            before_split: boolean;
            /** @description Indicates if validators wanted a merge. */
            want_merge: boolean;
            /** @description Indicates if validators wanted a split. */
            want_split: boolean;
            /** @description Short hash of validator list. */
            validator_list_hash_short: number;
            /** @description Catchain sequence number. */
            catchain_seqno: number;
            /** @description Minimum referenced masterchain seqno. */
            min_ref_mc_seqno: number;
            /** @description True if this block is a key block. */
            is_key_block: boolean;
            /** @description Previous key block sequence number. */
            prev_key_block_seqno: number;
            /** @description Starting logical time. */
            start_lt: string;
            /** @description Ending logical time. */
            end_lt: string;
            /** @description Block generation UNIX timestamp. */
            gen_utime: number;
            /** @description List of previous block identifiers. */
            prev_blocks: components["schemas"]["TonBlockIdExt"][];
        } & {
            [key: string]: unknown;
        };
        OutMsgQueueSizes: {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            "@type": "blocks.outMsgQueueSizes";
            /** @description List of outgoing message queue sizes per shard. */
            shards: components["schemas"]["OutMsgQueueSize"][];
            /** @description Limit for the external message queue size. */
            ext_msg_queue_size_limit: number;
        };
        ConfigInfo: {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            "@type": "configInfo";
            config: components["schemas"]["TvmCell"];
        };
        LibraryResult: {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            "@type": "smc.libraryResult";
            result: components["schemas"]["LibraryEntry"][];
        };
        /** @description Block transactions information */
        BlockTransactions: {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            "@type": "blocks.transactions";
            /** @description Identifier of the block containing the transactions */
            id: components["schemas"]["TonBlockIdExt"];
            /** @description Number of requested transactions */
            req_count: number;
            /** @description Indicates if the transaction list is incomplete */
            incomplete: boolean;
            /** @description List of short transaction identifiers */
            transactions: components["schemas"]["ShortTxId"][];
        };
        /** @description Block transactions information */
        BlockTransactionsExt: {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            "@type": "blocks.transactionsExt";
            /** @description Identifier of the block containing the transactions */
            id: components["schemas"]["TonBlockIdExt"];
            /** @description Number of requested transactions */
            req_count: number;
            /** @description Indicates if the transaction list is incomplete */
            incomplete: boolean;
            /** @description List of short transaction identifiers */
            transactions: components["schemas"]["TransactionExt"][];
        };
        Transactions: components["schemas"]["Transaction"][];
        TransactionsStd: {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            "@type": "raw.transactions";
            transactions: components["schemas"]["TransactionStd"][];
            previous_transaction_id: components["schemas"]["InternalTransactionId"];
        };
        ExtMessageInfo: {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            "@type": "raw.extMessageInfo";
            hash: components["schemas"]["TonHash"];
            hash_norm: components["schemas"]["TonHash"];
        };
        ResultOk: {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            "@type": "ok";
        };
        SendBocResult: components["schemas"]["ResultOk"] | components["schemas"]["ExtMessageInfo"];
        Fees: {
            /**
             * @default fees
             * @enum {string}
             */
            "@type": "fees";
            /** Format: int64 */
            in_fwd_fee: number;
            /** Format: int64 */
            storage_fee: number;
            /** Format: int64 */
            gas_fee: number;
            /** Format: int64 */
            fwd_fee: number;
        };
        QueryFees: {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            "@type": "query.fees";
            source_fees: components["schemas"]["Fees"];
            destination_fees: components["schemas"]["Fees"][];
        };
        TvmStackEntrySlice: {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            "@type": "tvm.stackEntrySlice";
            slice: components["schemas"]["TvmSlice"];
        };
        TvmStackEntryCell: {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            "@type": "tvm.stackEntryCell";
            cell: components["schemas"]["TvmCell"];
        };
        TvmStackEntryNumber: {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            "@type": "tvm.stackEntryNumber";
            number: components["schemas"]["TvmNumberDecimal"];
        };
        TvmStackEntryTuple: {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            "@type": "tvm.stackEntryTuple";
            tuple: components["schemas"]["TvmTuple"];
        };
        TvmStackEntryList: {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            "@type": "tvm.stackEntryList";
            list: components["schemas"]["TvmList"];
        };
        TvmStackEntryUnsupported: {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            "@type": "tvm.stackEntryUnsupported";
        };
        TvmSlice: {
            /**
             * @default tvm.slice
             * @enum {string}
             */
            "@type": "tvm.slice";
            bytes: components["schemas"]["Bytes"];
        };
        TvmCell: {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            "@type": "tvm.cell";
            bytes: components["schemas"]["Bytes"];
        };
        TvmNumberDecimal: {
            /**
             * @default tvm.numberDecimal
             * @enum {string}
             */
            "@type": "tvm.numberDecimal";
            number: components["schemas"]["Int256"];
        };
        TvmTuple: {
            /**
             * @default tvm.tuple
             * @enum {string}
             */
            "@type": "tvm.tuple";
            elements: (components["schemas"]["TvmStackEntrySlice"] | components["schemas"]["TvmStackEntryCell"] | components["schemas"]["TvmStackEntryNumber"] | components["schemas"]["TvmStackEntryTuple"] | components["schemas"]["TvmStackEntryList"] | components["schemas"]["TvmStackEntryUnsupported"])[];
        };
        TvmList: {
            /**
             * @default tvm.list
             * @enum {string}
             */
            "@type": "tvm.list";
            elements: (components["schemas"]["TvmStackEntrySlice"] | components["schemas"]["TvmStackEntryCell"] | components["schemas"]["TvmStackEntryNumber"] | components["schemas"]["TvmStackEntryTuple"] | components["schemas"]["TvmStackEntryList"] | components["schemas"]["TvmStackEntryUnsupported"])[];
        };
        RunGetMethodStdRequest: {
            address: components["schemas"]["TonAddr"];
            method: string | number;
            stack: (components["schemas"]["TvmStackEntrySlice"] | components["schemas"]["TvmStackEntryCell"] | components["schemas"]["TvmStackEntryNumber"] | components["schemas"]["TvmStackEntryTuple"] | components["schemas"]["TvmStackEntryList"] | components["schemas"]["TvmStackEntryUnsupported"])[];
            seqno?: number;
        };
        RunGetMethodStdResult: {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            "@type": "smc.runResult";
            /** Format: int64 */
            gas_used: number;
            stack: (components["schemas"]["TvmStackEntrySlice"] | components["schemas"]["TvmStackEntryCell"] | components["schemas"]["TvmStackEntryNumber"] | components["schemas"]["TvmStackEntryTuple"] | components["schemas"]["TvmStackEntryList"] | components["schemas"]["TvmStackEntryUnsupported"])[];
            /** Format: int32 */
            exit_code: number;
        };
        LegacyTvmCell: {
            data: {
                b64: components["schemas"]["Bytes"];
                /** Format: int32 */
                len: number;
            };
            refs: components["schemas"]["LegacyTvmCell"][];
            special: boolean;
        };
        LegacyStackEntryCell: {
            bytes: components["schemas"]["Bytes"];
            object?: components["schemas"]["LegacyTvmCell"];
        };
        LegacyStackEntry: (string | number | components["schemas"]["LegacyStackEntryCell"] | components["schemas"]["TvmTuple"] | components["schemas"]["TvmList"])[];
        RunGetMethodRequest: {
            address: components["schemas"]["TonAddr"];
            method: string | number;
            stack: components["schemas"]["LegacyStackEntry"][];
            /** Format: int32 */
            seqno?: number;
        };
        RunGetMethodResult: {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            "@type": "ext.runResult";
            /** Format: int64 */
            gas_used: number;
            stack: components["schemas"]["LegacyStackEntry"][];
            /** Format: int32 */
            exit_code: number;
            block_id: components["schemas"]["TonBlockIdExt"];
            last_transaction_id: components["schemas"]["InternalTransactionId"];
        };
    };
    responses: {
        /** @description Tonlib error */
        default: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["TonlibErrorResponse"];
            };
        };
    };
    parameters: {
        /** @description Identifier of target TON account in any form */
        address: components["schemas"]["TonAddr"];
        /** @description The 256-bit hash in any form */
        hash: components["schemas"]["TonHash"];
        /** @description The 256-bit hash in any form */
        hashOptional: components["schemas"]["TonHash"];
        /** @description Workchain ID */
        workchain: number;
        /** @description Shard ID */
        shard: string;
        /** @description Seqno of a block */
        seqno: number;
        /** @description Seqno of a block */
        seqnoOptional: number;
        /** @description Root hash of a block */
        rootHashOptional: string;
        /** @description File hash of a block */
        fileHashOptional: string;
        /** @description Logical time of transaction to read after */
        afterLtOptional: string;
        /** @description Hash of account in this block in hex or base64 representation, which indicates transaction to read after */
        afterAccountHashOptional: string;
        /** @description Maximum number of items in response */
        countOptional: number;
        /** @description Maximum number of items in response */
        limitOptional: number;
        /** @description Logical time of the transaction to start from */
        ltOptional: string;
        /** @description Logical time to stop at */
        toLtOptional: string;
        /** @description Whether to use archival node */
        archivalOptional: boolean;
        /** @description Source address */
        sourceAddress: components["schemas"]["TonAddr"];
        /** @description Destination address */
        destinationAddress: components["schemas"]["TonAddr"];
        /** @description Creation logical time of a message */
        createdLt: string;
    };
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    jsonRPC_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["JsonRpcRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TonlibResponse"];
                };
            };
            default: components["responses"]["default"];
        };
    };
    detectAddress_get: {
        parameters: {
            query: {
                /** @description Identifier of target TON account in any form */
                address: components["parameters"]["address"];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TonlibResponse"];
                };
            };
            default: components["responses"]["default"];
        };
    };
    detectAddress_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["DetectAddressRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TonlibResponse"];
                };
            };
            default: components["responses"]["default"];
        };
    };
    detectHash_get: {
        parameters: {
            query: {
                /** @description The 256-bit hash in any form */
                hash: components["parameters"]["hash"];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TonlibResponse"];
                };
            };
            default: components["responses"]["default"];
        };
    };
    detectHash_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["DetectHashRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TonlibResponse"];
                };
            };
            default: components["responses"]["default"];
        };
    };
    packAddress_get: {
        parameters: {
            query: {
                /** @description Identifier of target TON account in any form */
                address: components["parameters"]["address"];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TonlibResponse"];
                };
            };
            default: components["responses"]["default"];
        };
    };
    packAddress_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["PackAddressRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TonlibResponse"];
                };
            };
            default: components["responses"]["default"];
        };
    };
    unpackAddress_get: {
        parameters: {
            query: {
                /** @description Identifier of target TON account in any form */
                address: components["parameters"]["address"];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TonlibResponse"];
                };
            };
            default: components["responses"]["default"];
        };
    };
    unpackAddress_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UnpackAddressRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TonlibResponse"];
                };
            };
            default: components["responses"]["default"];
        };
    };
    getAddressInformation_get: {
        parameters: {
            query: {
                /** @description Identifier of target TON account in any form */
                address: components["parameters"]["address"];
                /** @description Seqno of a block */
                seqno?: components["parameters"]["seqnoOptional"];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TonlibResponse"];
                };
            };
            default: components["responses"]["default"];
        };
    };
    getAddressInformation_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AddressInformationRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TonlibResponse"];
                };
            };
            default: components["responses"]["default"];
        };
    };
    getExtendedAddressInformation_get: {
        parameters: {
            query: {
                /** @description Identifier of target TON account in any form */
                address: components["parameters"]["address"];
                /** @description Seqno of a block */
                seqno?: components["parameters"]["seqnoOptional"];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TonlibResponse"];
                };
            };
            default: components["responses"]["default"];
        };
    };
    getExtendedAddressInformation_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ExtendedAddressInformationRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TonlibResponse"];
                };
            };
            default: components["responses"]["default"];
        };
    };
    getShardAccountCell_get: {
        parameters: {
            query: {
                /** @description Identifier of target TON account in any form */
                address: components["parameters"]["address"];
                /** @description Seqno of a block */
                seqno?: components["parameters"]["seqnoOptional"];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TonlibResponse"];
                };
            };
            default: components["responses"]["default"];
        };
    };
    getShardAccountCell_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ShardAccountCellRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TonlibResponse"];
                };
            };
            default: components["responses"]["default"];
        };
    };
    getWalletInformation_get: {
        parameters: {
            query: {
                /** @description Identifier of target TON account in any form */
                address: components["parameters"]["address"];
                /** @description Seqno of a block */
                seqno?: components["parameters"]["seqnoOptional"];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TonlibResponse"];
                };
            };
            default: components["responses"]["default"];
        };
    };
    getWalletInformation_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["WalletInformationRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TonlibResponse"];
                };
            };
            default: components["responses"]["default"];
        };
    };
    getAddressBalance_get: {
        parameters: {
            query: {
                /** @description Identifier of target TON account in any form */
                address: components["parameters"]["address"];
                /** @description Seqno of a block */
                seqno?: components["parameters"]["seqnoOptional"];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TonlibResponse"];
                };
            };
            default: components["responses"]["default"];
        };
    };
    getAddressBalance_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AddressBalanceRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TonlibResponse"];
                };
            };
            default: components["responses"]["default"];
        };
    };
    getAddressState_get: {
        parameters: {
            query: {
                /** @description Identifier of target TON account in any form */
                address: components["parameters"]["address"];
                /** @description Seqno of a block */
                seqno?: components["parameters"]["seqnoOptional"];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TonlibResponse"];
                };
            };
            default: components["responses"]["default"];
        };
    };
    getAddressState_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AddressStateRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TonlibResponse"];
                };
            };
            default: components["responses"]["default"];
        };
    };
    getTokenData_get: {
        parameters: {
            query: {
                /** @description Identifier of target TON account in any form */
                address: components["parameters"]["address"];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TonlibResponse"];
                };
            };
            default: components["responses"]["default"];
        };
    };
    getTokenData_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["TokenDataRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TonlibResponse"];
                };
            };
            default: components["responses"]["default"];
        };
    };
    dnsResolve_get: {
        parameters: {
            query: {
                /** @description Identifier of target TON account in any form */
                address: components["parameters"]["address"];
                /** @description Domain name to resolve */
                name?: string;
                /** @description Get a specific category of DNS record */
                category?: string;
                /** @description TTL of a resolved record */
                ttl?: Record<string, never>;
                /** @description Seqno of a block */
                seqno?: components["parameters"]["seqnoOptional"];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TonlibResponse"];
                };
            };
            default: components["responses"]["default"];
        };
    };
    dnsResolve_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["DnsResolveRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TonlibResponse"];
                };
            };
            default: components["responses"]["default"];
        };
    };
    getMasterchainInfo_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TonlibResponse"];
                };
            };
            default: components["responses"]["default"];
        };
    };
    getMasterchainInfo_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["MasterchainInfoRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TonlibResponse"];
                };
            };
            default: components["responses"]["default"];
        };
    };
    getMasterchainBlockSignatures_get: {
        parameters: {
            query: {
                /** @description Seqno of a block */
                seqno: components["parameters"]["seqno"];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TonlibResponse"];
                };
            };
            default: components["responses"]["default"];
        };
    };
    getMasterchainBlockSignatures_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["MasterchainBlockSignaturesRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TonlibResponse"];
                };
            };
            default: components["responses"]["default"];
        };
    };
    getShardBlockProof_get: {
        parameters: {
            query: {
                /** @description Workchain ID */
                workchain: components["parameters"]["workchain"];
                /** @description Shard ID */
                shard: components["parameters"]["shard"];
                /** @description Seqno of a block */
                seqno: components["parameters"]["seqno"];
                /** @description Seqno of masterchain block starting from which proof is required. If not specified latest masterchain block is used */
                from_seqno?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TonlibResponse"];
                };
            };
            default: components["responses"]["default"];
        };
    };
    getShardBlockProof_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ShardBlockProofRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TonlibResponse"];
                };
            };
            default: components["responses"]["default"];
        };
    };
    getConsensusBlock_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TonlibResponse"];
                };
            };
            default: components["responses"]["default"];
        };
    };
    getConsensusBlock_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ConsensusBlockRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TonlibResponse"];
                };
            };
            default: components["responses"]["default"];
        };
    };
    lookupBlock_get: {
        parameters: {
            query: {
                /** @description Workchain ID */
                workchain: components["parameters"]["workchain"];
                /** @description Shard ID */
                shard: components["parameters"]["shard"];
                /** @description Seqno of a block */
                seqno?: components["parameters"]["seqnoOptional"];
                /** @description Logical time of a block */
                lt?: string;
                /** @description UNIX timestamp of a block */
                unixtime?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TonlibResponse"];
                };
            };
            default: components["responses"]["default"];
        };
    };
    lookupBlock_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["LookupBlockRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TonlibResponse"];
                };
            };
            default: components["responses"]["default"];
        };
    };
    getShards_get: {
        parameters: {
            query: {
                /** @description Seqno of a block */
                seqno: components["parameters"]["seqno"];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TonlibResponse"];
                };
            };
            default: components["responses"]["default"];
        };
    };
    getShards_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ShardsRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TonlibResponse"];
                };
            };
            default: components["responses"]["default"];
        };
    };
    getBlockHeader_get: {
        parameters: {
            query: {
                /** @description Workchain ID */
                workchain: components["parameters"]["workchain"];
                /** @description Shard ID */
                shard: components["parameters"]["shard"];
                /** @description Seqno of a block */
                seqno: components["parameters"]["seqno"];
                /** @description Root hash of a block */
                root_hash?: components["parameters"]["rootHashOptional"];
                /** @description File hash of a block */
                file_hash?: components["parameters"]["fileHashOptional"];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TonlibResponse"];
                };
            };
            default: components["responses"]["default"];
        };
    };
    getBlockHeader_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["BlockHeaderRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TonlibResponse"];
                };
            };
            default: components["responses"]["default"];
        };
    };
    getOutMsgQueueSize_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TonlibResponse"];
                };
            };
            default: components["responses"]["default"];
        };
    };
    getOutMsgQueueSize_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["OutMsgQueueSizeRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TonlibResponse"];
                };
            };
            default: components["responses"]["default"];
        };
    };
    getBlockTransactions_get: {
        parameters: {
            query: {
                /** @description Workchain ID */
                workchain: components["parameters"]["workchain"];
                /** @description Shard ID */
                shard: components["parameters"]["shard"];
                /** @description Seqno of a block */
                seqno: components["parameters"]["seqno"];
                /** @description Root hash of a block */
                root_hash?: components["parameters"]["rootHashOptional"];
                /** @description File hash of a block */
                file_hash?: components["parameters"]["fileHashOptional"];
                /** @description Logical time of transaction to read after */
                after_lt?: components["parameters"]["afterLtOptional"];
                /** @description Hash of account in this block in hex or base64 representation, which indicates transaction to read after */
                after_hash?: components["parameters"]["afterAccountHashOptional"];
                /** @description Maximum number of items in response */
                count?: components["parameters"]["countOptional"];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TonlibResponse"];
                };
            };
            default: components["responses"]["default"];
        };
    };
    getBlockTransactions_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["BlockTransactionsRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TonlibResponse"];
                };
            };
            default: components["responses"]["default"];
        };
    };
    getBlockTransactionsExt_get: {
        parameters: {
            query: {
                /** @description Workchain ID */
                workchain: components["parameters"]["workchain"];
                /** @description Shard ID */
                shard: components["parameters"]["shard"];
                /** @description Seqno of a block */
                seqno: components["parameters"]["seqno"];
                /** @description Root hash of a block */
                root_hash?: components["parameters"]["rootHashOptional"];
                /** @description File hash of a block */
                file_hash?: components["parameters"]["fileHashOptional"];
                /** @description Logical time of transaction to read after */
                after_lt?: components["parameters"]["afterLtOptional"];
                /** @description Hash of account in this block in hex or base64 representation, which indicates transaction to read after */
                after_hash?: components["parameters"]["afterAccountHashOptional"];
                /** @description Maximum number of items in response */
                count?: components["parameters"]["countOptional"];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TonlibResponse"];
                };
            };
            default: components["responses"]["default"];
        };
    };
    getBlockTransactionsExt_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["BlockTransactionsExtRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TonlibResponse"];
                };
            };
            default: components["responses"]["default"];
        };
    };
    getTransactions_get: {
        parameters: {
            query: {
                /** @description Identifier of target TON account in any form */
                address: components["parameters"]["address"];
                /** @description Maximum number of items in response */
                limit?: components["parameters"]["limitOptional"];
                /** @description Logical time of the transaction to start from */
                lt?: components["parameters"]["ltOptional"];
                /** @description The 256-bit hash in any form */
                hash?: components["parameters"]["hashOptional"];
                /** @description Logical time to stop at */
                to_lt?: components["parameters"]["toLtOptional"];
                /** @description Whether to use archival node */
                archival?: components["parameters"]["archivalOptional"];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TonlibResponse"];
                };
            };
            default: components["responses"]["default"];
        };
    };
    getTransactions_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["TransactionsRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TonlibResponse"];
                };
            };
            default: components["responses"]["default"];
        };
    };
    getTransactionsStd_get: {
        parameters: {
            query: {
                /** @description Identifier of target TON account in any form */
                address: components["parameters"]["address"];
                /** @description Maximum number of items in response */
                limit?: components["parameters"]["limitOptional"];
                /** @description Logical time of the transaction to start from */
                lt?: components["parameters"]["ltOptional"];
                /** @description The 256-bit hash in any form */
                hash?: components["parameters"]["hashOptional"];
                /** @description Logical time to stop at */
                to_lt?: components["parameters"]["toLtOptional"];
                /** @description Whether to use archival node */
                archival?: components["parameters"]["archivalOptional"];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TonlibResponse"];
                };
            };
            default: components["responses"]["default"];
        };
    };
    getTransactionsStd_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["TransactionsRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TonlibResponse"];
                };
            };
            default: components["responses"]["default"];
        };
    };
    tryLocateTx_get: {
        parameters: {
            query: {
                /** @description Source address */
                source: components["parameters"]["sourceAddress"];
                /** @description Destination address */
                destination: components["parameters"]["destinationAddress"];
                /** @description Creation logical time of a message */
                created_lt: components["parameters"]["createdLt"];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TonlibResponse"];
                };
            };
            default: components["responses"]["default"];
        };
    };
    tryLocateTx_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["TryLocateTxRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TonlibResponse"];
                };
            };
            default: components["responses"]["default"];
        };
    };
    tryLocateResultTx_get: {
        parameters: {
            query: {
                /** @description Source address */
                source: components["parameters"]["sourceAddress"];
                /** @description Destination address */
                destination: components["parameters"]["destinationAddress"];
                /** @description Creation logical time of a message */
                created_lt: components["parameters"]["createdLt"];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TonlibResponse"];
                };
            };
            default: components["responses"]["default"];
        };
    };
    tryLocateResultTx_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["TryLocateResultTxRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TonlibResponse"];
                };
            };
            default: components["responses"]["default"];
        };
    };
    tryLocateSourceTx_get: {
        parameters: {
            query: {
                /** @description Source address */
                source: components["parameters"]["sourceAddress"];
                /** @description Destination address */
                destination: components["parameters"]["destinationAddress"];
                /** @description Creation logical time of a message */
                created_lt: components["parameters"]["createdLt"];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TonlibResponse"];
                };
            };
            default: components["responses"]["default"];
        };
    };
    tryLocateSourceTx_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["TryLocateSourceTxRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TonlibResponse"];
                };
            };
            default: components["responses"]["default"];
        };
    };
    getConfigParam_get: {
        parameters: {
            query: {
                /** @description Parameter number */
                param: number;
                /** @description Block seqno */
                seqno?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TonlibResponse"];
                };
            };
            default: components["responses"]["default"];
        };
    };
    getConfigParam_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ConfigParamRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TonlibResponse"];
                };
            };
            default: components["responses"]["default"];
        };
    };
    getConfigAll_get: {
        parameters: {
            query?: {
                /** @description Block seqno */
                seqno?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TonlibResponse"];
                };
            };
            default: components["responses"]["default"];
        };
    };
    getConfigAll_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ConfigAllRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TonlibResponse"];
                };
            };
            default: components["responses"]["default"];
        };
    };
    getLibraries_get: {
        parameters: {
            query?: {
                /** @description Hashes of libraries */
                libraries?: Record<string, never>[];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TonlibResponse"];
                };
            };
            default: components["responses"]["default"];
        };
    };
    getLibraries_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["LibrariesRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TonlibResponse"];
                };
            };
            default: components["responses"]["default"];
        };
    };
    runGetMethod_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RunGetMethodRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TonlibResponse"];
                };
            };
            default: components["responses"]["default"];
        };
    };
    runGetMethodStd_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RunGetMethodStdRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TonlibResponse"];
                };
            };
            default: components["responses"]["default"];
        };
    };
    sendBoc_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SendBocRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TonlibResponse"];
                };
            };
            default: components["responses"]["default"];
        };
    };
    sendBocReturnHash_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SendBocRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TonlibResponse"];
                };
            };
            default: components["responses"]["default"];
        };
    };
    estimateFee_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["EstimateFeeRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TonlibResponse"];
                };
            };
            default: components["responses"]["default"];
        };
    };
}
