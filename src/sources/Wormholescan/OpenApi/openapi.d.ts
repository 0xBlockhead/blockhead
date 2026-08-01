export interface paths {
    "/api/v1/address/:address": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Lookup an address */
        get: operations["find-address-by-id"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/application-activity": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Search for a specific period of time the number of transactions and the volume per application. */
        get: operations["application-activity"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/global-tx/:chain_id/:emitter/:seq": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * @description Find a global transaction by VAA ID
         *     Global transactions is a logical association of two transactions that are related to each other by a unique VAA ID.
         *     The first transaction is created on the origin chain when the VAA is emitted.
         *     The second transaction is created on the destination chain when the VAA is redeemed.
         *     If the response only contains an origin tx the VAA was not redeemed.
         */
        get: operations["find-global-transaction-by-id"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/governor/config": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Returns governor configuration for all guardians. */
        get: operations["governor-config"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/governor/config/:guardian_address": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Returns governor configuration for a given guardian. */
        get: operations["governor-config-by-guardian-address"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/governor/enqueued_vaas/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Returns enqueued VAAs for each blockchain. */
        get: operations["governor-enqueued-vaas"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/governor/enqueued_vaas/:chain": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Returns all enqueued VAAs for a given blockchain. */
        get: operations["guardians-enqueued-vaas-by-chain"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/governor/limit": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Returns the governor limit for all blockchains. */
        get: operations["governor-notional-limit"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/governor/notional/available": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Returns the amount of notional value available for each blockchain. */
        get: operations["governor-notional-available"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/governor/notional/available/:chain": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Returns the amount of notional value available for a given blockchain. */
        get: operations["governor-notional-available-by-chain"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/governor/notional/limit": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Returns the detailed notional limit for all blockchains. */
        get: operations["governor-notional-limit-detail"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/governor/notional/limit/:chain": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Returns the detailed notional limit available for a given blockchain. */
        get: operations["governor-notional-limit-detail-by-chain"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/governor/notional/max_available/:chain": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Returns the maximum amount of notional value available for a given blockchain. */
        get: operations["governor-max-notional-available-by-chain"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/governor/status": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Returns the governor status for all guardians. */
        get: operations["governor-status"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/governor/status/:guardian_address": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Returns the governor status for a given guardian. */
        get: operations["governor-status-by-guardian-address"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/governor/vaas": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Returns all vaas in Governor. */
        get: operations["governor-vaas"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/guardian_sets/{version}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Returns a guardian set by version, or the current one when "current" is supplied. */
        get: operations["get-guardian-set"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/health": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Health check */
        get: operations["health-check"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/last-txs": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Returns the number of transactions by a defined time span and sample rate. */
        get: operations["get-last-transactions"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/live-tracking/subscribe": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Subscribe to live tracking events for a VAA or transaction */
        get: operations["live-tracking-subscribe"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/native-token-transfer/activity": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Returns a list of values (tx count or notional) of the Native Token Transfer for a emitter and destination chains. */
        get: operations["/api/v1/native-token-transfer/activity"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/native-token-transfer/summary": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Returns a summary of the Native Token Transfer. */
        get: operations["/api/v1/native-token-transfer/summary"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/native-token-transfer/token-list": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Returns the list of supported Native Token Transfer tokens. */
        get: operations["/api/v1/native-token-transfer/token-list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/native-token-transfer/top-address": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Returns a list of values (tx count or notional) of the Native Token Transfer for address. */
        get: operations["/api/v1/native-token-transfer/top-address"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/native-token-transfer/top-holder": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Returns a list of volume and chain of the Native Token Transfer for top holders. */
        get: operations["/api/v1/native-token-transfer/top-holder"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/native-token-transfer/transfer-by-time": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Returns a list of values (tx count or notional) of the Native Token Transfer for a emitter and destination chains. */
        get: operations["/api/v1/native-token-transfer/transfer-by-time"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/observations": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Returns all observations, sorted in descending timestamp order. */
        get: operations["find-observations"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/observations/:chain": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Returns all observations for a given blockchain, sorted in descending timestamp order. */
        get: operations["find-observations-by-chain"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/observations/:chain/:emitter": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Returns all observations for a specific emitter address, sorted in descending timestamp order. */
        get: operations["find-observations-by-emitter"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/observations/:chain/:emitter/:sequence": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Find observations identified by emitter chain, emitter address and sequence. */
        get: operations["find-observations-by-sequence"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/observations/:chain/:emitter/:sequence/:signer/:hash": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Find a specific observation. */
        get: operations["find-observations-by-id"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/observations/delegate/:chain_id": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Returns delegate observations for a given chain, sorted in descending timestamp order. */
        get: operations["find-delegate-observations-by-chain"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/observations/delegate/:chain_id/:emitter_address": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Returns delegate observations for a given chain and emitter, sorted in descending timestamp order. */
        get: operations["find-delegate-observations-by-emitter"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/observations/delegate/:chain_id/:emitter_address/:sequence": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Returns delegate observations for a given chain, emitter and sequence. */
        get: operations["find-delegate-observations-by-sequence"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/observations/delegate/:chain_id/:emitter_address/:sequence/:guardian_address": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Returns delegate observations for a given chain, emitter, sequence and delegate guardian address. */
        get: operations["find-delegate-observations-by-guardian"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/operations": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Find all operations. */
        get: operations["get-operations"];
        put?: never;
        /** @description Find operations by filters. Currently only txHash is supported. */
        post: operations["search-operations"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/operations/{chain_id}/{emitter}/{seq}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Find operations by ID (chainID/emitter/sequence). */
        get: operations["get-operation-by-id"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/protocols/stats": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Returns the representative stats for the top protocols */
        get: operations["get-top-protocols-stats"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/protocols/{protocolId}/top_network_pairs": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * @description Returns the most used network pairs (chains) for a given protocol ranked by USD volume transferred
         *     The endpoint automatically selects hourly or daily aggregation based on the time range
         *     For ranges < 24 hours within the last 30 days, hourly data is used
         *     Otherwise, daily data is used
         */
        get: operations["get-protocol-network-pairs"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/protocols/{protocolId}/trending_tokens": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * @description Returns the top 100 trending tokens for a given protocol ranked by USD volume transferred
         *     The endpoint automatically selects hourly or daily aggregation based on the time range
         *     For ranges < 24 hours, hourly data is used and 'from' must be within last 24 hours
         *     Otherwise, daily data is used
         */
        get: operations["get-protocol-trending-tokens"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/ready": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Ready check */
        get: operations["ready-check"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/relays/:chain/:emitter/:sequence": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Get a specific relay information by chainID, emitter address and sequence. */
        get: operations["find-relay-by-vaa-id"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/scorecards": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * @description Returns a list of KPIs for Wormhole.
         *     TVL is total value locked by token bridge contracts in USD.
         *     Volume is the all-time total volume transferred through the token bridge in USD.
         *     24h volume is the volume transferred through the token bridge in the last 24 hours, in USD.
         *     Total Tx count is the number of transaction bridging assets since the creation of the network (does not include Pyth or other messages).
         *     24h tx count is the number of transaction bridging assets in the last 24 hours (does not include Pyth or other messages).
         *     Total messages is the number of VAAs emitted since the creation of the network (includes Pyth messages).
         */
        get: operations["get-scorecards"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/supply": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Get W token supply data (circulation and total supply). */
        get: operations["supply-info"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/supply/circulating": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Get W token circulation supply. */
        get: operations["circulating-supply"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/supply/total": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Get W token total supply. */
        get: operations["total-supply"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/token/:chain_id/:token_address": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Returns a token symbol, coingecko id and address by chain and token address. */
        get: operations["get-token-by-chain-and-address"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/top-100-corridors": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Returns a list of the top 100 tokens, sorted in descending order by the number of transactions. */
        get: operations["/api/v1/top-100-corridors"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/top-assets-by-volume": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * @description Returns a list of emitter_chain and asset pairs with ordered by volume.
         *     The volume is calculated using the notional price of the symbol at the day the VAA was emitted.
         */
        get: operations["get-top-assets-by-volume"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/top-chain-pairs-by-num-transfers": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Returns a list of the emitter_chain and destination_chain pair ordered by transfer count. */
        get: operations["get-top-chain-pairs-by-num-transfers"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/top-symbols-by-volume": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * @description Returns a list of symbols by origin chain and tokens.
         *     The volume is calculated using the notional price of the symbol at the day the VAA was emitted.
         */
        get: operations["top-symbols-by-volume"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/transactions/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Returns transactions. Output is paginated. */
        get: operations["list-transactions"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/transactions/:chain_id/:emitter/:seq": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Find VAA metadata by ID. */
        get: operations["get-transaction-by-id"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaas/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Returns all VAAs. Output is paginated and can also be be sorted. */
        get: operations["find-all-vaas"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaas/:chain_id": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Returns all the VAAs generated in specific blockchain. */
        get: operations["find-vaas-by-chain"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaas/:chain_id/:emitter": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Returns all all the VAAs generated by a specific emitter address. */
        get: operations["find-vaas-by-emitter"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaas/:chain_id/:emitter/:seq": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Find a VAA by ID. */
        get: operations["find-vaa-by-id"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaas/:chain_id/:emitter/:seq/duplicated": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Find duplicated VAA by ID. */
        get: operations["find-duplicated-vaa-by-id"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaas/parse": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** @description Parse a VAA. */
        post: operations["parse-vaa"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaas/vaa-counts": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Returns the total number of VAAs emitted for each blockchain. */
        get: operations["get-vaa-counts"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/version": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Get version/release information. */
        get: operations["get-version"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/wormhole/assets/secured-tokens": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Returns a list of tokens secured by Wormhole, including Native Token Transfers and Portal Bridge tokens */
        get: operations["get-secured-tokens"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/x-chain-activity": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * @description Returns a list of chain pairs by origin chain and destination chain.
         *     The list could be rendered by notional or transaction count.
         *     The volume is calculated using the notional price of the symbol at the day the VAA was emitted.
         */
        get: operations["x-chain-activity"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/x-chain-activity/tops": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Search for a specific period of time the number of transactions and the volume. */
        get: operations["x-chain-activity-tops"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/swagger.json": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Returns the swagger specification for this API. */
        get: operations["swagger"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/governor/available_notional_by_chain": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * @description Get available notional by chainID
         *     Since from the wormhole-explorer point of view it is not a node, but has the information of all nodes,
         *     in order to build the endpoints it was assumed:
         *     There are N number of remainingAvailableNotional values in the GovernorConfig collection. N = number of guardians
         *     for a chainID. The smallest remainingAvailableNotional value for a chainID is used for the endpoint response.
         */
        get: operations["governor-available-notional-by-chain"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/governor/enqueued_vaas": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Get enqueued VAAs */
        get: operations["guardians-enqueued-vaas"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/governor/is_vaa_enqueued/:chain_id/:emitter/:seq": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Check if vaa is enqueued */
        get: operations["guardians-is-vaa-enqueued"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/governor/token_list": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * @description Get token list
         *     Since from the wormhole-explorer point of view it is not a node, but has the information of all nodes,
         *     in order to build the endpoints it was assumed:
         *     For tokens with the same originChainId and originAddress and different price values for each node,
         *     the price that has most occurrences in all the nodes for an originChainId and originAddress is returned.
         */
        get: operations["guardians-token-list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/guardianset/current": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Get current guardian set. */
        get: operations["guardian-set"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/heartbeats": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Get heartbeats for guardians */
        get: operations["guardians-hearbeats"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/signed_batch_vaa/:chain_id/:emitter/sequence/:seq": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description get a batch of VAA []byte from a chainID, emitter address and sequence. */
        get: operations["guardians-find-signed-batch-vaa"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/signed_vaa/:chain_id/:emitter/:seq": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description get a VAA []byte from a chainID, emitter address and sequence. */
        get: operations["guardians-find-signed-vaa"];
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
        "address.AddressOverview": {
            vaas?: components["schemas"]["vaa.VaaDoc"][];
        };
        "delegate_observations.DelegateObservationDoc": {
            consistencyLevel?: number;
            /** @description json name is not a typo, requested by foundation */
            delegatedGuardianAddr?: string;
            emitterAddr?: string;
            emitterChain?: components["schemas"]["vaa.ChainID"];
            hash?: number[];
            id?: string;
            indexedAt?: string;
            isReobservation?: boolean;
            nonce?: number;
            payload?: number[];
            sentTimestamp?: string;
            sequence?: string;
            signature?: number[];
            timestamp?: string;
            txHash?: number[];
            unreliable?: boolean;
            updatedAt?: string;
            verificationState?: number;
        };
        "github_com_wormhole-foundation_wormhole-explorer_api_routes_guardian_guardian.GuardianSet": {
            addresses?: string[];
            index?: number;
        };
        "github_com_wormhole-foundation_wormhole-explorer_api_routes_wormscan_operations.BalanceChanges": {
            amount?: string;
            recipient?: string;
            tokenAddress?: string;
        };
        "governor.AvailableNotionalItemResponse": {
            bigTransactionSize?: string;
            chainId?: components["schemas"]["vaa.ChainID"];
            notionalLimit?: string;
            remainingAvailableNotional?: string;
        };
        "governor.AvailableNotionalResponse": {
            entries?: components["schemas"]["governor.AvailableNotionalItemResponse"][];
        };
        "governor.Emitter": {
            emitterAddress?: string;
            enqueuedVaas?: components["schemas"]["governor.EnqueuedVAA"][];
            totalEnqueuedVaas?: number;
        };
        "governor.EnqueuedVAA": {
            notionalValue?: number;
            releaseTime?: string;
            sequence?: string;
            txHash?: string;
        };
        "governor.EnqueuedVaa": {
            chainId?: components["schemas"]["vaa.ChainID"];
            emitterAddress?: string;
            notionalValue?: number;
            sequence?: string;
            txHash?: string;
        };
        "governor.EnqueuedVaaDetail": {
            chainId?: components["schemas"]["vaa.ChainID"];
            emitterAddress?: string;
            notionalValue?: number;
            releaseTime?: number;
            sequence?: string;
            txHash?: string;
        };
        "governor.EnqueuedVaaItemResponse": {
            emitterAddress?: string;
            emitterChain?: components["schemas"]["vaa.ChainID"];
            notionalValue?: string;
            releaseTime?: number;
            sequence?: number;
            txHash?: string;
        };
        "governor.EnqueuedVaaResponse": {
            entries?: components["schemas"]["governor.EnqueuedVaaItemResponse"][];
        };
        "governor.EnqueuedVaas": {
            chainId?: components["schemas"]["vaa.ChainID"];
            enqueuedVaas?: components["schemas"]["governor.EnqueuedVaa"][];
        };
        "governor.GovConfig": {
            chains?: components["schemas"]["governor.GovConfigChains"][];
            counter?: number;
            createdAt?: string;
            id?: string;
            nodeName?: string;
            tokens?: components["schemas"]["governor.GovConfigfTokens"][];
            updatedAt?: string;
        };
        "governor.GovConfigChains": {
            bigTransactionSize?: number;
            chainId?: components["schemas"]["vaa.ChainID"];
            notionalLimit?: number;
        };
        "governor.GovConfigfTokens": {
            originAddress?: string;
            originChainId?: number;
            price?: number;
        };
        "governor.GovStatus": {
            chains?: components["schemas"]["governor.GovStatusChains"][];
            createdAt?: string;
            id?: string;
            nodeName?: string;
            updatedAt?: string;
        };
        "governor.GovStatusChainEmitter": {
            emitterAddress?: string;
            enqueuedVaas?: unknown;
            totalEnqueuedVaas?: number;
        };
        "governor.GovStatusChains": {
            chainId?: components["schemas"]["vaa.ChainID"];
            emitters?: components["schemas"]["governor.GovStatusChainEmitter"][];
            remainingAvailableNotional?: number;
        };
        "governor.GovernorLimit": {
            availableNotional?: number;
            chainId?: components["schemas"]["vaa.ChainID"];
            maxTransactionSize?: number;
            notionalLimit?: number;
        };
        "governor.GovernorVaasResponse": {
            amount?: number;
            chainId?: components["schemas"]["vaa.ChainID"];
            emitterAddress?: string;
            releaseTime?: string;
            sequence?: string;
            status?: string;
            txHash?: string;
            vaaId?: string;
        };
        "governor.MaxNotionalAvailableRecord": {
            availableNotional?: number;
            chainId?: components["schemas"]["vaa.ChainID"];
            createdAt?: string;
            emitters?: components["schemas"]["governor.Emitter"][];
            id?: string;
            nodeName?: string;
            updatedAt?: string;
        };
        "governor.NotionalAvailable": {
            availableNotional?: number;
            chainId?: components["schemas"]["vaa.ChainID"];
        };
        "governor.NotionalAvailableDetail": {
            availableNotional?: number;
            chainId?: components["schemas"]["vaa.ChainID"];
            createdAt?: string;
            id?: string;
            nodeName?: string;
            updatedAt?: string;
        };
        "governor.NotionalLimitDetail": {
            chainId?: components["schemas"]["vaa.ChainID"];
            createdAt?: string;
            id?: string;
            maxTransactionSize?: number;
            nodeName?: string;
            notionalLimit?: number;
            updatedAt?: string;
        };
        "governor.TokenList": {
            originAddress?: string;
            originChainId?: components["schemas"]["vaa.ChainID"];
            price?: number;
        };
        "guardian.GuardianSetResponse": {
            guardianSet?: components["schemas"]["github_com_wormhole-foundation_wormhole-explorer_api_routes_guardian_guardian.GuardianSet"];
        };
        "guardian_sets.GuardianAddress": {
            address?: string;
            name?: string;
        };
        "guardian_sets.GuardianSetDoc": {
            addresses?: components["schemas"]["guardian_sets.GuardianAddress"][];
            version?: number;
        };
        "heartbeats.HeartbeatNetworkResponse": {
            contractAddress?: string;
            errorCount?: string;
            height?: string;
            id?: number;
        };
        "heartbeats.HeartbeatResponse": {
            p2pNodeAddr?: string;
            rawHeartbeat?: components["schemas"]["heartbeats.RawHeartbeat"];
            verifiedGuardianAddr?: string;
        };
        "heartbeats.HeartbeatsResponse": {
            entries?: components["schemas"]["heartbeats.HeartbeatResponse"][];
        };
        "heartbeats.RawHeartbeat": {
            bootTimestamp?: string;
            counter?: string;
            features?: string[];
            guardianAddr?: string;
            networks?: components["schemas"]["heartbeats.HeartbeatNetworkResponse"][];
            nodeName?: string;
            timestamp?: string;
            version?: string;
        };
        "infrastructure.VersionResponse": {
            build?: string;
            build_date?: string;
            version?: string;
        };
        "observations.ObservationDoc": {
            emitterAddr?: string;
            emitterChain?: components["schemas"]["vaa.ChainID"];
            guardianAddr?: string;
            hash?: number[];
            id?: string;
            indexedAt?: string;
            sequence?: string;
            signature?: number[];
            txHash?: number[];
            updatedAt?: string;
        };
        "operations.Content": {
            executorRequest?: unknown;
            payload?: {
                [key: string]: unknown;
            };
            standarizedProperties?: components["schemas"]["operations.StandardizedProperties"];
        };
        "operations.Data": {
            type?: string;
            value?: {
                [key: string]: unknown;
            };
        };
        "operations.EmitterAddress": {
            hex?: string;
            native?: string;
        };
        "operations.OperationResponse": {
            content?: components["schemas"]["operations.Content"];
            data?: {
                [key: string]: unknown;
            };
            emitterAddress?: components["schemas"]["operations.EmitterAddress"];
            emitterChain?: components["schemas"]["vaa.ChainID"];
            id?: string;
            sequence?: string;
            sourceChain?: components["schemas"]["operations.SourceChain"];
            targetChain?: components["schemas"]["operations.TargetChain"];
            vaa?: components["schemas"]["operations.Vaa"];
        };
        "operations.SourceChain": {
            attribute?: components["schemas"]["operations.Data"];
            balanceChanges?: components["schemas"]["github_com_wormhole-foundation_wormhole-explorer_api_routes_wormscan_operations.BalanceChanges"][];
            chainId?: components["schemas"]["vaa.ChainID"];
            fee?: string;
            feeUSD?: string;
            from?: string;
            gasTokenNotional?: string;
            /** @description Indicates whether the VAA was emitted through a SVM Shim program */
            isSolanaShim?: boolean;
            status?: string;
            timestamp?: string;
            transaction?: components["schemas"]["operations.Transaction"];
        };
        "operations.StandardizedProperties": {
            amount?: string;
            appIds?: string[];
            fee?: string;
            feeAddress?: string;
            feeChain?: components["schemas"]["vaa.ChainID"];
            fromAddress?: string;
            fromChain?: components["schemas"]["vaa.ChainID"];
            normalizedDecimals?: number;
            toAddress?: string;
            toChain?: components["schemas"]["vaa.ChainID"];
            tokenAddress?: string;
            tokenChain?: components["schemas"]["vaa.ChainID"];
        };
        "operations.TargetChain": {
            balanceChanges?: components["schemas"]["github_com_wormhole-foundation_wormhole-explorer_api_routes_wormscan_operations.BalanceChanges"][];
            chainId?: components["schemas"]["vaa.ChainID"];
            fee?: string;
            feeUSD?: string;
            from?: string;
            gasTokenNotional?: string;
            status?: string;
            timestamp?: string;
            to?: string;
            transaction?: components["schemas"]["operations.Transaction"];
        };
        "operations.Transaction": {
            secondTxHash?: string;
            txHash?: string;
        };
        "operations.Vaa": {
            guardianSetIndex?: number;
            isDuplicated?: boolean;
            raw?: number[];
        };
        "parser.ParseVaaWithStandarizedPropertiesdResponse": {
            parsedPayload?: unknown;
            standardizedProperties?: components["schemas"]["parser.StandardizedProperties"];
        };
        "parser.StandardizedProperties": {
            amount?: string;
            appIds?: string[];
            fee?: string;
            feeAddress?: string;
            feeChain?: components["schemas"]["vaa.ChainID"];
            fromAddress?: string;
            fromChain?: components["schemas"]["vaa.ChainID"];
            normalizedDecimals?: number;
            toAddress?: string;
            toChain?: components["schemas"]["vaa.ChainID"];
            tokenAddress?: string;
            tokenChain?: components["schemas"]["vaa.ChainID"];
        };
        "protocols.ProtocolNetworkPairResponse": {
            data?: components["schemas"]["protocols.ProtocolNetworkPairResult"];
            protocol?: string;
        };
        "protocols.ProtocolNetworkPairResult": {
            from?: string;
            to?: string;
            values?: components["schemas"]["protocols.ProtocolNetworkPairVolume"][];
        };
        "protocols.ProtocolNetworkPairVolume": {
            destination_chain?: components["schemas"]["vaa.ChainID"];
            source_chain?: components["schemas"]["vaa.ChainID"];
            volume_usd?: number;
        };
        "protocols.ProtocolTotalValuesDTO": {
            error?: string;
            period_diff_percentage?: string;
            period_diff_volume_percentage?: string;
            period_messages?: number;
            period_volume?: number;
            protocol?: string;
            total_messages?: number;
            total_value_locked?: number;
            total_value_secured?: number;
            total_value_transferred?: number;
        };
        "protocols.ProtocolTrendingToken": {
            coingecko_id?: string;
            decimals?: number;
            image?: {
                large?: string;
                small?: string;
                thumb?: string;
            };
            symbol?: string;
            token_address?: string;
            token_chain?: components["schemas"]["vaa.ChainID"];
            volume?: number;
        };
        "protocols.ProtocolTrendingTokensResponse": {
            data?: components["schemas"]["protocols.ProtocolTrendingTokensResult"];
            protocol?: string;
        };
        "protocols.ProtocolTrendingTokensResult": {
            from?: string;
            to?: string;
            tokens?: components["schemas"]["protocols.ProtocolTrendingToken"][];
        };
        "relays.DeliveryReponse": {
            budget?: string;
            execution?: components["schemas"]["relays.ResultExecutionResponse"];
            maxRefund?: string;
            relayGasUsed?: number;
            targetChainDecimals?: number;
        };
        "relays.InstructionsResponse": {
            encodedExecutionInfo?: string;
            extraReceiverValue?: {
                _hex?: string;
                _isBigNumber?: boolean;
            };
            refundAddress?: string;
            refundChainId?: number;
            refundDeliveryProvider?: string;
            requestedReceiverValue?: {
                _hex?: string;
                _isBigNumber?: boolean;
            };
            senderAddress?: string;
            sourceDeliveryProvider?: string;
            targetAddress?: string;
            targetChainId?: number;
            vaaKeys?: unknown[];
        };
        "relays.RelayDataResponse": {
            delivery?: components["schemas"]["relays.DeliveryReponse"];
            fromTxHash?: string;
            instructions?: components["schemas"]["relays.InstructionsResponse"];
            maxAttempts?: number;
            toTxHash?: string;
        };
        "relays.RelayResponse": {
            completedAt?: string;
            data?: components["schemas"]["relays.RelayDataResponse"];
            failedAt?: string;
            id?: string;
            receivedAt?: string;
            relayer?: string;
            status?: string;
        };
        "relays.ResultExecutionResponse": {
            detail?: string;
            gasUsed?: string;
            refundStatus?: string;
            revertString?: string;
            status?: string;
            transactionHash?: string;
        };
        "response.APIError": {
            /** @description support to guardian-api code. */
            code?: number;
            details?: components["schemas"]["response.ErrorDetail"][];
            message?: string;
        };
        "response.ErrorDetail": {
            request_id?: string;
            stack_trace?: string;
        };
        "response.Response-address_AddressOverview": {
            data?: components["schemas"]["address.AddressOverview"];
            pagination?: components["schemas"]["response.ResponsePagination"];
        };
        "response.Response-array_governor_EnqueuedVaaDetail": {
            data?: components["schemas"]["governor.EnqueuedVaaDetail"][];
            pagination?: components["schemas"]["response.ResponsePagination"];
        };
        "response.Response-array_governor_EnqueuedVaas": {
            data?: components["schemas"]["governor.EnqueuedVaas"][];
            pagination?: components["schemas"]["response.ResponsePagination"];
        };
        "response.Response-array_governor_GovStatus": {
            data?: components["schemas"]["governor.GovStatus"][];
            pagination?: components["schemas"]["response.ResponsePagination"];
        };
        "response.Response-array_governor_GovernorLimit": {
            data?: components["schemas"]["governor.GovernorLimit"][];
            pagination?: components["schemas"]["response.ResponsePagination"];
        };
        "response.Response-array_governor_GovernorVaasResponse": {
            data?: components["schemas"]["governor.GovernorVaasResponse"][];
            pagination?: components["schemas"]["response.ResponsePagination"];
        };
        "response.Response-array_governor_NotionalAvailable": {
            data?: components["schemas"]["governor.NotionalAvailable"][];
            pagination?: components["schemas"]["response.ResponsePagination"];
        };
        "response.Response-array_governor_NotionalAvailableDetail": {
            data?: components["schemas"]["governor.NotionalAvailableDetail"][];
            pagination?: components["schemas"]["response.ResponsePagination"];
        };
        "response.Response-array_governor_NotionalLimitDetail": {
            data?: components["schemas"]["governor.NotionalLimitDetail"][];
            pagination?: components["schemas"]["response.ResponsePagination"];
        };
        "response.Response-array_vaa_VaaDoc": {
            data?: components["schemas"]["vaa.VaaDoc"][];
            pagination?: components["schemas"]["response.ResponsePagination"];
        };
        "response.Response-array_vaa_VaaStats": {
            data?: components["schemas"]["vaa.VaaStats"][];
            pagination?: components["schemas"]["response.ResponsePagination"];
        };
        "response.Response-governor_GovConfig": {
            data?: components["schemas"]["governor.GovConfig"];
            pagination?: components["schemas"]["response.ResponsePagination"];
        };
        "response.Response-governor_GovStatus": {
            data?: components["schemas"]["governor.GovStatus"];
            pagination?: components["schemas"]["response.ResponsePagination"];
        };
        "response.Response-governor_MaxNotionalAvailableRecord": {
            data?: components["schemas"]["governor.MaxNotionalAvailableRecord"];
            pagination?: components["schemas"]["response.ResponsePagination"];
        };
        "response.Response-guardian_sets_GuardianSetDoc": {
            data?: components["schemas"]["guardian_sets.GuardianSetDoc"];
            pagination?: components["schemas"]["response.ResponsePagination"];
        };
        "response.ResponsePagination": {
            next?: string;
        };
        "stats.NativeTokenTransferActivity": {
            destinationChain?: components["schemas"]["vaa.ChainID"];
            emitterChain?: components["schemas"]["vaa.ChainID"];
            symbol?: string;
            value?: number;
        };
        "stats.NativeTokenTransferByTime": {
            symbol?: string;
            time?: string;
            value?: number;
        };
        "stats.NativeTokenTransferSummary": {
            circulatingSupply?: number;
            fullyDilutedValuation?: number;
            image?: components["schemas"]["stats.image"];
            links?: {
                [key: string]: unknown;
            };
            marketCap?: number;
            platforms?: {
                [key: string]: string;
            };
            price?: number;
            symbol?: string;
            totalSupply?: number;
            totalTokenTransferred?: number;
            totalValueTokenTransferred?: number;
        };
        "stats.NativeTokenTransferTopAddress": {
            fromAddress?: string;
            value?: number;
        };
        "stats.NativeTokenTransferTopHolder": {
            address?: string;
            chain?: components["schemas"]["vaa.ChainID"];
            volume?: number;
        };
        "stats.Token": {
            address?: string;
            chain_id?: components["schemas"]["vaa.ChainID"];
            circulating_supply?: number;
            coingecko_id?: string;
            fully_diluted_valuation?: number;
            image?: {
                large?: string;
                small?: string;
                thumb?: string;
            };
            links?: {
                [key: string]: unknown;
            };
            market_cap?: number;
            platforms?: {
                [key: string]: string;
            };
            price?: number;
            price_change_percentage_24h?: number;
            symbol?: string;
            total_supply?: number;
            total_value_locked?: number;
            total_value_transferred?: number;
            volume_15d?: number;
            volume_1y?: number;
            volume_24h?: number;
            volume_30d?: number;
            volume_7d?: number;
            volume_90d?: number;
        };
        "stats.TokenInfoDTO": {
            circulating_supply?: number;
            coingecko_id?: string;
            fully_diluted_valuation?: number;
            image?: string;
            market_cap?: number;
            platforms?: {
                [key: string]: string;
            };
            price?: number;
            symbol?: string;
            total_supply?: number;
            total_value_locked?: number;
            total_value_transferred?: number;
            type?: components["schemas"]["stats.TokenType"];
            volume_15d?: number;
            volume_1y?: number;
            volume_24h?: number;
            volume_30d?: number;
            volume_7d?: number;
            volume_90d?: number;
        };
        "stats.TokenResult": {
            emitter_chain?: components["schemas"]["vaa.ChainID"];
            token_address?: string;
            token_chain?: components["schemas"]["vaa.ChainID"];
            txs?: number;
            volume?: number;
        };
        /** @enum {string} */
        "stats.TokenType": "NATIVE_TOKEN_TRANSFER" | "PORTAL_TOKEN_BRIDGE";
        "stats.TopCorridor": {
            emitter_chain?: components["schemas"]["vaa.ChainID"];
            target_chain?: components["schemas"]["vaa.ChainID"];
            token_address?: string;
            token_chain?: components["schemas"]["vaa.ChainID"];
            txs?: number;
        };
        "stats.TopCorridorsResult": {
            corridors?: components["schemas"]["stats.TopCorridor"][];
        };
        "stats.TopSymbolByVolumeResult": {
            symbols?: components["schemas"]["stats.TopSymbolResult"][];
        };
        "stats.TopSymbolResult": {
            symbol?: string;
            tokens?: components["schemas"]["stats.TokenResult"][];
            txs?: number;
            volume?: number;
        };
        "stats.image": {
            large?: string;
            small?: string;
            thumb?: string;
        };
        "supply.SupplyInfoResponse": {
            circulating_supply?: string;
            total_supply?: string;
        };
        "transactions.AssetWithVolume": {
            emitterChain?: components["schemas"]["vaa.ChainID"];
            symbol?: string;
            tokenAddress?: string;
            tokenChain?: components["schemas"]["vaa.ChainID"];
            volume?: string;
        };
        "transactions.AttributeDoc": {
            type?: string;
            value?: {
                [key: string]: unknown;
            };
        };
        "transactions.ChainActivity": {
            txs?: components["schemas"]["transactions.Tx"][];
        };
        "transactions.ChainActivityTopResult": {
            count?: number;
            destination_chain?: string;
            emitter_chain?: string;
            from?: string;
            to?: string;
            volume?: number;
        };
        "transactions.ChainPair": {
            destinationChain?: components["schemas"]["vaa.ChainID"];
            emitterChain?: components["schemas"]["vaa.ChainID"];
            numberOfTransfers?: string;
        };
        "transactions.Destination": {
            chain?: number;
            percentage?: number;
            volume?: number;
        };
        "transactions.DestinationTx": {
            blockNumber?: string;
            chainId?: components["schemas"]["vaa.ChainID"];
            from?: string;
            method?: string;
            status?: string;
            timestamp?: string;
            to?: string;
            txHash?: string;
            updatedAt?: string;
        };
        "transactions.GlobalTransactionDoc": {
            destinationTx?: components["schemas"]["transactions.DestinationTx"];
            id?: string;
            originTx?: components["schemas"]["transactions.OriginTx"];
        };
        "transactions.ListTransactionsResponse": {
            transactions?: components["schemas"]["transactions.TransactionDetail"][];
        };
        "transactions.OriginTx": {
            attribute?: components["schemas"]["transactions.AttributeDoc"];
            from?: string;
            status?: string;
            txHash?: string;
        };
        "transactions.ScorecardsResponse": {
            /** @description Number of VAAs emitted in the last 1 year (includes Pyth messages). */
            "1y_messages"?: string;
            /** @description Volume transferred through the token bridge in the last 1 year, in USD. */
            "1y_volume"?: string;
            /** @description Number of VAAs emitted in the last 24 hours (includes Pyth messages). */
            "24h_messages"?: string;
            /** @description Volume transferred through the token bridge in the last 24 hours, in USD. */
            "24h_volume"?: string;
            /** @description Number of VAAs emitted in the last 30 days (includes Pyth messages). */
            "30d_messages"?: string;
            /** @description Volume transferred through the token bridge in the last 30 days, in USD. */
            "30d_volume"?: string;
            /** @description Number of VAAs emitted in the last 7 days (includes Pyth messages). */
            "7d_messages"?: string;
            /** @description Volume transferred through the token bridge in the last 7 days, in USD. */
            "7d_volume"?: string;
            /** @description Number of VAAs emitted in the last 90 days (includes Pyth messages). */
            "90d_messages"?: string;
            /** @description Volume transferred through the token bridge in the last 90 days, in USD. */
            "90d_volume"?: string;
            /** @description Number of VAAs emitted since the creation of the network (includes Pyth messages). */
            total_messages?: string;
            /** @description Number of VAAs emitted since the creation of the network (does not include Pyth messages) */
            total_tx_count?: string;
            total_volume?: string;
            /** @description Total value locked in USD. */
            tvl?: string;
        };
        "transactions.Token": {
            coingeckoId?: string;
            decimals?: number;
            symbol?: string;
        };
        "transactions.TopAssetsResponse": {
            assets?: components["schemas"]["transactions.AssetWithVolume"][];
        };
        "transactions.TopChainPairsResponse": {
            chainPairs?: components["schemas"]["transactions.ChainPair"][];
        };
        "transactions.TransactionCountResult": {
            count?: number;
            time?: string;
        };
        "transactions.TransactionDetail": {
            /** @description EmitterAddress contains the VAA's emitter address, encoded in hex. */
            emitterAddress?: string;
            emitterChain?: components["schemas"]["vaa.ChainID"];
            /** @description EmitterNativeAddress contains the VAA's emitter address, encoded in the emitter chain's native format. */
            emitterNativeAddress?: string;
            globalTx?: components["schemas"]["transactions.GlobalTransactionDoc"];
            id?: string;
            payload?: {
                [key: string]: unknown;
            };
            standardizedProperties?: {
                [key: string]: unknown;
            };
            symbol?: string;
            timestamp?: string;
            tokenAmount?: string;
            txHash?: string;
            usdAmount?: string;
        };
        "transactions.Tx": {
            chain?: number;
            destinations?: components["schemas"]["transactions.Destination"][];
            percentage?: number;
            volume?: number;
        };
        /**
         * Format: int32
         * @enum {integer}
         */
        "vaa.ChainID": 0 | 1 | 2 | 4 | 5 | 6 | 8 | 13 | 14 | 15 | 16 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 29 | 30 | 31 | 32 | 33 | 38 | 39 | 40 | 41 | 42 | 44 | 45 | 46 | 47 | 48 | 49 | 50 | 51 | 52 | 53 | 54 | 55 | 56 | 57 | 58 | 59 | 60 | 61 | 62 | 63 | 64 | 65 | 66 | 67 | 68 | 69 | 70 | 71 | 3104 | 4000 | 4001 | 4002 | 4003 | 4004 | 4005 | 4006 | 4007 | 4008 | 4009 | 10002 | 10003 | 10004 | 10005 | 10006 | 10007 | 10009 | 65000;
        "vaa.VaaDoc": {
            digest?: string;
            emitterAddr?: string;
            emitterChain?: components["schemas"]["vaa.ChainID"];
            emitterNativeAddr?: string;
            guardianSetIndex?: number;
            id?: string;
            indexedAt?: string;
            isDuplicated?: boolean;
            /**
             * @description Payload is an extension field - it is not present in the guardian API.
             *     Indicates whether the VAA was emitted through a SVM Shim program
             */
            isSolanaShim?: boolean;
            /** @description Payload is an extension field - it is not present in the guardian API. */
            payload?: {
                [key: string]: unknown;
            };
            timestamp?: string;
            /** @description TxHash is an extension field - it is not present in the guardian API. */
            txHash?: string;
            updatedAt?: string;
            vaa?: number[];
            version?: number;
        };
        "vaa.VaaStats": {
            chainId?: components["schemas"]["vaa.ChainID"];
            count?: number;
        };
        "workflow.Event": {
            data?: unknown;
            error?: string;
            event?: components["schemas"]["workflow.EventType"];
            status?: components["schemas"]["workflow.EventStatus"];
            step?: number;
            subscriptionId?: string;
            timestamp?: string;
            totalSteps?: number;
        };
        /** @enum {string} */
        "workflow.EventStatus": "PENDING" | "DONE";
        /** @enum {string} */
        "workflow.EventType": "SOURCE_TX" | "GOVERNOR" | "SIGNED_VAA" | "VAA_REDEEMED" | "END_OF_WORKFLOW" | "ERROR" | "SEARCHING";
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    "find-address-by-id": {
        parameters: {
            query?: {
                /** @description Page number. Starts at 0. */
                page?: number;
                /** @description Number of elements per page. */
                pageSize?: number;
            };
            header?: never;
            path: {
                /** @description address */
                address: string;
            };
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
                    "*/*": components["schemas"]["response.Response-address_AddressOverview"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    "application-activity": {
        parameters: {
            query: {
                /** @description Time span, supported values: 1d, 1mo and 1y */
                timespan: string;
                /** @description From date, supported format 2006-01-02T15:04:05Z07:00 */
                from: string;
                /** @description To date, supported format 2006-01-02T15:04:05Z07:00 */
                to: string;
                /** @description Search by appId */
                appIds?: string;
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
                    "*/*": components["schemas"]["transactions.ChainActivityTopResult"][];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    "find-global-transaction-by-id": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description id of the blockchain */
                chain_id: number;
                /** @description address of the emitter */
                emitter: string;
                /** @description sequence of the VAA */
                seq: number;
            };
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
                    "*/*": components["schemas"]["transactions.Tx"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    "governor-config": {
        parameters: {
            query?: {
                /** @description Page number. */
                page?: number;
                /** @description Number of elements per page. */
                pageSize?: number;
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
                    "*/*": components["schemas"]["response.Response-governor_GovConfig"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    "governor-config-by-guardian-address": {
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
                    "*/*": components["schemas"]["response.Response-governor_GovConfig"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    "governor-enqueued-vaas": {
        parameters: {
            query?: {
                /** @description Page number. */
                page?: number;
                /** @description Number of elements per page. */
                pageSize?: number;
                /** @description Sort results in ascending or descending order. */
                sortOrder?: "ASC" | "DESC";
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
                    "*/*": components["schemas"]["response.Response-array_governor_EnqueuedVaas"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    "guardians-enqueued-vaas-by-chain": {
        parameters: {
            query?: {
                /** @description Page number. */
                page?: number;
                /** @description Number of elements per page. */
                pageSize?: number;
                /** @description Sort results in ascending or descending order. */
                sortOrder?: "ASC" | "DESC";
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
                    "*/*": components["schemas"]["response.Response-array_governor_EnqueuedVaaDetail"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    "governor-notional-limit": {
        parameters: {
            query?: {
                /** @description Page number. */
                page?: number;
                /** @description Number of elements per page. */
                pageSize?: number;
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
                    "*/*": components["schemas"]["response.Response-array_governor_GovernorLimit"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    "governor-notional-available": {
        parameters: {
            query?: {
                /** @description Page number. */
                page?: number;
                /** @description Number of elements per page. */
                pageSize?: number;
                /** @description Sort results in ascending or descending order. */
                sortOrder?: "ASC" | "DESC";
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
                    "*/*": components["schemas"]["response.Response-array_governor_NotionalAvailable"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    "governor-notional-available-by-chain": {
        parameters: {
            query?: {
                /** @description Page number. */
                page?: number;
                /** @description Number of elements per page. */
                pageSize?: number;
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
                    "*/*": components["schemas"]["response.Response-array_governor_NotionalAvailableDetail"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    "governor-notional-limit-detail": {
        parameters: {
            query?: {
                /** @description Page number. */
                page?: number;
                /** @description Number of elements per page. */
                pageSize?: number;
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
                    "*/*": components["schemas"]["response.Response-array_governor_NotionalLimitDetail"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    "governor-notional-limit-detail-by-chain": {
        parameters: {
            query?: {
                /** @description Page number. */
                page?: number;
                /** @description Number of elements per page. */
                pageSize?: number;
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
                    "*/*": components["schemas"]["response.Response-array_governor_NotionalLimitDetail"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    "governor-max-notional-available-by-chain": {
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
                    "*/*": components["schemas"]["response.Response-governor_MaxNotionalAvailableRecord"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    "governor-status": {
        parameters: {
            query?: {
                /** @description Page number. */
                page?: number;
                /** @description Number of elements per page. */
                pageSize?: number;
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
                    "*/*": components["schemas"]["response.Response-array_governor_GovStatus"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    "governor-status-by-guardian-address": {
        parameters: {
            query?: {
                /** @description Page number. */
                page?: number;
                /** @description Number of elements per page. */
                pageSize?: number;
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
                    "*/*": components["schemas"]["response.Response-governor_GovStatus"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    "governor-vaas": {
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
                    "*/*": components["schemas"]["response.Response-array_governor_GovernorVaasResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    "get-guardian-set": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Guardian set version (uint32) or the literal \ */
                version: string;
            };
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
                    "*/*": components["schemas"]["response.Response-guardian_sets_GuardianSetDoc"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    "health-check": {
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
                    "*/*": {
                        status?: string;
                    };
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    "get-last-transactions": {
        parameters: {
            query?: {
                /** @description Time Span, default: 1d, supported values: [1d, 1w, 1mo]. 1mo ​​is 30 days. */
                timeSpan?: string;
                /** @description Sample Rate, default: 1h, supported values: [1h, 1d]. Valid configurations with timeSpan: 1d/1h, 1w/1d, 1mo/1d */
                sampleRate?: string;
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
                    "*/*": components["schemas"]["transactions.TransactionCountResult"][];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    "live-tracking-subscribe": {
        parameters: {
            query?: {
                /** @description VAA ID to track */
                vaaID?: string;
                /** @description Transaction hash to track */
                txHash?: string;
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
                    "*/*": components["schemas"]["workflow.Event"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    "/api/v1/native-token-transfer/activity": {
        parameters: {
            query: {
                /** @description Symbol of the native-token-transfer token. */
                symbol: string;
                /** @description Renders the results using notional or tx count (default is notional). */
                by?: string;
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
                    "*/*": components["schemas"]["stats.NativeTokenTransferActivity"][];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    "/api/v1/native-token-transfer/summary": {
        parameters: {
            query: {
                /** @description coingecko_id of the desired token. */
                coingecko_id: string;
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
                    "*/*": components["schemas"]["stats.NativeTokenTransferSummary"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    "/api/v1/native-token-transfer/token-list": {
        parameters: {
            query: {
                /** @description Specify true/false if the response includes links. */
                withLinks: string;
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
                    "*/*": components["schemas"]["stats.Token"][];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    "/api/v1/native-token-transfer/top-address": {
        parameters: {
            query: {
                /** @description Symbol of the native-token-transfer token. */
                symbol: string;
                /** @description Renders the results using notional or tx count (default is notional). */
                by?: string;
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
                    "*/*": components["schemas"]["stats.NativeTokenTransferTopAddress"][];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    "/api/v1/native-token-transfer/top-holder": {
        parameters: {
            query: {
                /** @description Coingecko_id of the native-token-transfer token. */
                coingecko_id: string;
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
                    "*/*": components["schemas"]["stats.NativeTokenTransferTopHolder"][];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    "/api/v1/native-token-transfer/transfer-by-time": {
        parameters: {
            query: {
                /** @description From date, supported format 2006-01-02T15:04:05Z07:00 */
                from: string;
                /** @description To date, supported format 2006-01-02T15:04:05Z07:00 */
                to: string;
                /** @description Symbol of the native-token-transfer token. */
                symbol: string;
                /** @description Renders the results using notional or tx count (default is notional). */
                by?: string;
                /** @description Time Span, supported values: [1h, 1d, 1mo, 1y]. */
                timeSpan: string;
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
                    "*/*": components["schemas"]["stats.NativeTokenTransferByTime"][];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    "find-observations": {
        parameters: {
            query?: {
                /** @description Page number. */
                page?: number;
                /** @description Number of elements per page. */
                pageSize?: number;
                /** @description Transaction hash of the Observations */
                txHash?: string;
                /** @description Sort results in ascending or descending order. */
                sortOrder?: "ASC" | "DESC";
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
                    "*/*": components["schemas"]["observations.ObservationDoc"][];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    "find-observations-by-chain": {
        parameters: {
            query?: {
                /** @description Page number. */
                page?: number;
                /** @description Number of elements per page. */
                pageSize?: number;
                /** @description Sort results in ascending or descending order. */
                sortOrder?: "ASC" | "DESC";
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
                    "*/*": components["schemas"]["observations.ObservationDoc"][];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    "find-observations-by-emitter": {
        parameters: {
            query?: {
                /** @description Page number. */
                page?: number;
                /** @description Number of elements per page. */
                pageSize?: number;
                /** @description Sort results in ascending or descending order. */
                sortOrder?: "ASC" | "DESC";
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
                    "*/*": components["schemas"]["observations.ObservationDoc"][];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    "find-observations-by-sequence": {
        parameters: {
            query?: {
                /** @description Page number. */
                page?: number;
                /** @description Number of elements per page. */
                pageSize?: number;
                /** @description Sort results in ascending or descending order. */
                sortOrder?: "ASC" | "DESC";
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
                    "*/*": components["schemas"]["observations.ObservationDoc"][];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    "find-observations-by-id": {
        parameters: {
            query?: {
                /** @description Page number. */
                page?: number;
                /** @description Number of elements per page. */
                pageSize?: number;
                /** @description Sort results in ascending or descending order. */
                sortOrder?: "ASC" | "DESC";
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
                    "*/*": components["schemas"]["observations.ObservationDoc"][];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    "find-delegate-observations-by-chain": {
        parameters: {
            query?: {
                /** @description Page number */
                page?: number;
                /** @description Number of elements per page */
                pageSize?: number;
                /** @description ASC or DESC */
                sortOrder?: string;
            };
            header?: never;
            path: {
                /** @description Chain ID */
                chain_id: number;
            };
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
                    "*/*": components["schemas"]["delegate_observations.DelegateObservationDoc"][];
                };
            };
        };
    };
    "find-delegate-observations-by-emitter": {
        parameters: {
            query?: {
                /** @description Page number */
                page?: number;
                /** @description Number of elements per page */
                pageSize?: number;
                /** @description ASC or DESC */
                sortOrder?: string;
            };
            header?: never;
            path: {
                /** @description Chain ID */
                chain_id: number;
                /** @description Emitter address */
                emitter_address: string;
            };
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
                    "*/*": components["schemas"]["delegate_observations.DelegateObservationDoc"][];
                };
            };
        };
    };
    "find-delegate-observations-by-sequence": {
        parameters: {
            query?: {
                /** @description Page number */
                page?: number;
                /** @description Number of elements per page */
                pageSize?: number;
                /** @description ASC or DESC */
                sortOrder?: string;
            };
            header?: never;
            path: {
                /** @description Chain ID */
                chain_id: number;
                /** @description Emitter address */
                emitter_address: string;
                /** @description Sequence */
                sequence: number;
            };
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
                    "*/*": components["schemas"]["delegate_observations.DelegateObservationDoc"][];
                };
            };
        };
    };
    "find-delegate-observations-by-guardian": {
        parameters: {
            query?: {
                /** @description Page number */
                page?: number;
                /** @description Number of elements per page */
                pageSize?: number;
                /** @description ASC or DESC */
                sortOrder?: string;
            };
            header?: never;
            path: {
                /** @description Chain ID */
                chain_id: number;
                /** @description Emitter address */
                emitter_address: string;
                /** @description Sequence */
                sequence: number;
                /** @description Delegate guardian address */
                guardian_address: string;
            };
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
                    "*/*": components["schemas"]["delegate_observations.DelegateObservationDoc"][];
                };
            };
        };
    };
    "get-operations": {
        parameters: {
            query?: {
                /** @description address of the emitter */
                address?: string;
                /** @description hash of the transaction */
                txHash?: string;
                /** @description page number */
                page?: number;
                /** @description pageSize */
                pageSize?: number;
                /** @description source chains of the operation, separated by comma */
                sourceChain?: string;
                /** @description target chains of the operation, separated by comma */
                targetChain?: string;
                /** @description chains to match either source or target, separated by comma */
                includesChain?: string;
                /** @description appID of the operation */
                appId?: string;
                /** @description single appId of the operation */
                exclusiveAppId?: boolean;
                /** @description more than an amount in USD for address search */
                minAmount?: number;
                /** @description indicates the type of address for address search */
                addressType?: "from" | "to";
                /** @description beginning of period */
                from?: string;
                /** @description end of period */
                to?: string;
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
                    "*/*": components["schemas"]["operations.OperationResponse"][];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    "search-operations": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description list of txHash of source tx */
        requestBody: {
            content: {
                "application/json": string[];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["operations.OperationResponse"][];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    "get-operation-by-id": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description id of the blockchain */
                chain_id: number;
                /** @description address of the emitter */
                emitter: string;
                /** @description sequence of the VAA */
                seq: number;
            };
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
                    "*/*": components["schemas"]["operations.OperationResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    "get-top-protocols-stats": {
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
                    "*/*": components["schemas"]["protocols.ProtocolTotalValuesDTO"][];
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["protocols.ProtocolTotalValuesDTO"][];
                };
            };
        };
    };
    "get-protocol-network-pairs": {
        parameters: {
            query: {
                /** @description Start date in RFC3339 format (e.g., 2024-01-01T00:00:00Z) */
                from: string;
                /** @description End date in RFC3339 format (e.g., 2024-01-08T00:00:00Z) */
                to: string;
            };
            header?: never;
            path: {
                /** @description Protocol ID (e.g., PORTAL_TOKEN_BRIDGE, CCTP_WORMHOLE_INTEGRATION) */
                protocolId: string;
            };
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
                    "*/*": components["schemas"]["protocols.ProtocolNetworkPairResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["response.APIError"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["response.APIError"];
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["response.APIError"];
                };
            };
        };
    };
    "get-protocol-trending-tokens": {
        parameters: {
            query: {
                /** @description Start date in RFC3339 format (e.g., 2024-01-01T00:00:00Z) */
                from: string;
                /** @description End date in RFC3339 format (e.g., 2024-01-08T00:00:00Z) */
                to: string;
            };
            header?: never;
            path: {
                /** @description Protocol ID (e.g., PORTAL_TOKEN_BRIDGE, CCTP_WORMHOLE_INTEGRATION, CONNECT) */
                protocolId: string;
            };
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
                    "*/*": components["schemas"]["protocols.ProtocolTrendingTokensResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["response.APIError"];
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["response.APIError"];
                };
            };
        };
    };
    "ready-check": {
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
                    "*/*": {
                        ready?: string;
                    };
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    "find-relay-by-vaa-id": {
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
                    "*/*": components["schemas"]["relays.RelayResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    "get-scorecards": {
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
                    "*/*": components["schemas"]["transactions.ScorecardsResponse"];
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    "supply-info": {
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
                    "*/*": components["schemas"]["supply.SupplyInfoResponse"];
                };
            };
        };
    };
    "circulating-supply": {
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
                content?: never;
            };
        };
    };
    "total-supply": {
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
                content?: never;
            };
        };
    };
    "get-token-by-chain-and-address": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description id of the blockchain */
                chain_id: number;
                /** @description token address */
                token_address: string;
            };
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
                    "*/*": components["schemas"]["transactions.Token"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    "/api/v1/top-100-corridors": {
        parameters: {
            query?: {
                /** @description Time span, supported values: 2d and 7d (default is 2d). */
                timeSpan?: string;
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
                    "*/*": components["schemas"]["stats.TopCorridorsResult"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    "get-top-assets-by-volume": {
        parameters: {
            query: {
                /** @description Time span, supported values: 7d, 15d, 30d. */
                timeSpan: string;
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
                    "*/*": components["schemas"]["transactions.TopAssetsResponse"];
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    "get-top-chain-pairs-by-num-transfers": {
        parameters: {
            query: {
                /** @description Time span, supported values: 7d, 15d, 30d. */
                timeSpan: string;
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
                    "*/*": components["schemas"]["transactions.TopChainPairsResponse"];
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    "top-symbols-by-volume": {
        parameters: {
            query?: {
                /** @description Time span, supported values: 7d, 15d and 30d (default is 7d). */
                timeSpan?: string;
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
                    "*/*": components["schemas"]["stats.TopSymbolByVolumeResult"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    "list-transactions": {
        parameters: {
            query?: {
                /** @description Page number. Starts at 0. */
                page?: number;
                /** @description Number of elements per page. */
                pageSize?: number;
                /** @description Sort results in ascending or descending order. */
                sortOrder?: "ASC" | "DESC";
                /** @description Filter transactions by Address. */
                address?: string;
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
                    "*/*": components["schemas"]["transactions.ListTransactionsResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    "get-transaction-by-id": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description id of the blockchain */
                chain_id: number;
                /** @description address of the emitter */
                emitter: string;
                /** @description sequence of the VAA */
                seq: number;
            };
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
                    "*/*": components["schemas"]["transactions.TransactionDetail"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    "find-all-vaas": {
        parameters: {
            query?: {
                /** @description Page number. */
                page?: number;
                /** @description Number of elements per page. */
                pageSize?: number;
                /** @description Sort results in ascending or descending order. */
                sortOrder?: "ASC" | "DESC";
                /** @description Transaction hash of the VAA */
                txHash?: string;
                /** @description include the parsed contents of the VAA, if available */
                parsedPayload?: boolean;
                /** @description beginning of period (RFC3339, matches the VAA timestamp). Defaults to two weeks before 'to' when only 'to' is set. */
                from?: string;
                /** @description end of period (RFC3339, matches the VAA timestamp). Defaults to two weeks after 'from' when only 'from' is set. */
                to?: string;
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
                    "*/*": components["schemas"]["response.Response-array_vaa_VaaDoc"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    "find-vaas-by-chain": {
        parameters: {
            query?: {
                /** @description Page number. */
                page?: number;
                /** @description Number of elements per page. */
                pageSize?: number;
                /** @description Sort results in ascending or descending order. */
                sortOrder?: "ASC" | "DESC";
                /** @description beginning of period (RFC3339, matches the VAA timestamp). Defaults to two weeks before 'to' when only 'to' is set. */
                from?: string;
                /** @description end of period (RFC3339, matches the VAA timestamp). Defaults to two weeks after 'from' when only 'from' is set. */
                to?: string;
            };
            header?: never;
            path: {
                /** @description id of the blockchain */
                chain_id: number;
            };
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
                    "*/*": components["schemas"]["response.Response-array_vaa_VaaDoc"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    "find-vaas-by-emitter": {
        parameters: {
            query?: {
                /** @description destination chain (deprecated param) */
                toChain?: number;
                /** @description Page number. */
                page?: number;
                /** @description Number of elements per page. */
                pageSize?: number;
                /** @description Sort results in ascending or descending order. */
                sortOrder?: "ASC" | "DESC";
                /** @description beginning of period (RFC3339, matches the VAA timestamp). Defaults to two weeks before 'to' when only 'to' is set. */
                from?: string;
                /** @description end of period (RFC3339, matches the VAA timestamp). Defaults to two weeks after 'from' when only 'from' is set. */
                to?: string;
            };
            header?: never;
            path: {
                /** @description id of the blockchain */
                chain_id: number;
                /** @description address of the emitter */
                emitter: string;
            };
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
                    "*/*": components["schemas"]["response.Response-array_vaa_VaaDoc"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    "find-vaa-by-id": {
        parameters: {
            query?: {
                /** @description include the parsed contents of the VAA, if available */
                parsedPayload?: boolean;
            };
            header?: never;
            path: {
                /** @description id of the blockchain */
                chain_id: number;
                /** @description address of the emitter */
                emitter: string;
                /** @description sequence of the VAA */
                seq: number;
            };
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
                    "*/*": components["schemas"]["response.Response-array_vaa_VaaDoc"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    "find-duplicated-vaa-by-id": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description id of the blockchain */
                chain_id: number;
                /** @description address of the emitter */
                emitter: string;
                /** @description sequence of the VAA */
                seq: number;
            };
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
                    "*/*": components["schemas"]["response.Response-array_vaa_VaaDoc"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    "parse-vaa": {
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
                    "*/*": components["schemas"]["parser.ParseVaaWithStandarizedPropertiesdResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    "get-vaa-counts": {
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
                    "*/*": components["schemas"]["response.Response-array_vaa_VaaStats"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    "get-version": {
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
                    "*/*": components["schemas"]["infrastructure.VersionResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    "get-secured-tokens": {
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
                    "application/json": components["schemas"]["stats.TokenInfoDTO"][];
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    "x-chain-activity": {
        parameters: {
            query?: {
                /** @description Time span, supported values: 7d, 30d, 90d, 1y and all-time (default is 7d). */
                timeSpan?: string;
                /** @description Renders the results using notional or tx count (default is notional). */
                by?: string;
                /** @description List of apps separated by comma (default is all apps). */
                apps?: string;
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
                    "*/*": components["schemas"]["transactions.ChainActivity"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    "x-chain-activity-tops": {
        parameters: {
            query: {
                /** @description Time span, supported values: 1d, 1mo and 1y */
                timespan: string;
                /** @description From date, supported format 2006-01-02T15:04:05Z07:00 */
                from: string;
                /** @description To date, supported format 2006-01-02T15:04:05Z07:00 */
                to: string;
                /** @description Search by appId */
                appId?: string;
                /** @description Search by sourceChain */
                sourceChain?: string;
                /** @description Search by targetChain */
                targetChain?: string;
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
                    "*/*": components["schemas"]["transactions.ChainActivityTopResult"][];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    swagger: {
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
                    "*/*": Record<string, never>;
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    "governor-available-notional-by-chain": {
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
                    "*/*": components["schemas"]["governor.AvailableNotionalResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    "guardians-enqueued-vaas": {
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
                    "*/*": components["schemas"]["governor.EnqueuedVaaResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    "guardians-is-vaa-enqueued": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description id of the blockchain */
                chain_id: number;
                /** @description address of the emitter */
                emitter: string;
                /** @description sequence of the vaa */
                seq: number;
            };
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
                    "*/*": components["schemas"]["governor.EnqueuedVaaResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    "guardians-token-list": {
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
                    "*/*": components["schemas"]["governor.TokenList"][];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    "guardian-set": {
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
                    "*/*": components["schemas"]["guardian.GuardianSetResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    "guardians-hearbeats": {
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
                    "*/*": components["schemas"]["heartbeats.HeartbeatsResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    "guardians-find-signed-batch-vaa": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description id of the blockchain */
                chain_id: number;
                /** @description address of the emitter */
                emitter: string;
                /** @description sequence of the VAA */
                seq: number;
            };
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
                    "*/*": {
                        vaaBytes?: number[];
                    };
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    "guardians-find-signed-vaa": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description id of the blockchain */
                chain_id: number;
                /** @description address of the emitter */
                emitter: string;
                /** @description sequence of the VAA */
                seq: number;
            };
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
                    "*/*": {
                        vaaBytes?: number[];
                    };
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
}
