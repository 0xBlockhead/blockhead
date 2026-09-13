export interface paths {
    "/api/get_price_feed": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * **Deprecated: use /v2/updates/price/{publish_time} instead** Get a single price update at or after a given publish time.
         * @deprecated
         * @description **Deprecated: use /v2/updates/price/{publish_time} instead**
         *
         *     Get a single price update at or after a given publish time.
         *
         *     Given a price feed id and a publish time, retrieve the first Pyth price update whose publish_time is >= the provided value.
         */
        get: operations["get_price_feed_deprecated"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/get_vaa": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * **Deprecated: use /v2/updates/price/{publish_time} instead** Get a VAA for a single price feed at or after a publish time.
         * @deprecated
         * @description **Deprecated: use /v2/updates/price/{publish_time} instead**
         *
         *     Get a VAA for a single price feed at or after a publish time.
         *
         *     Given a price feed id and a publish time, retrieve the first Pyth VAA whose publish_time is >= the provided value.
         */
        get: operations["get_vaa_deprecated"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/get_vaa_ccip": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * **Deprecated: use /v2/updates/price/{publish_time} instead** Get a VAA in CCIP-compatible format.
         * @deprecated
         * @description **Deprecated: use /v2/updates/price/{publish_time} instead**
         *
         *     Get a VAA in a format consumable by Chainlink CCIP off-chain reads.
         *
         *     The `data` parameter is a 40-byte hex payload: 32 bytes of price feed id followed by an 8-byte big-endian unix timestamp.
         */
        get: operations["get_vaa_ccip_deprecated"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/latest_price_feeds": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * **Deprecated: use /v2/updates/price/latest instead** Get the latest price updates by price feed id.
         * @deprecated
         * @description **Deprecated: use /v2/updates/price/latest instead**
         *
         *     Get the latest price updates by price feed id.
         *
         *     Given a collection of price feed ids, retrieve the latest Pyth price for each price feed.
         */
        get: operations["latest_price_feeds_deprecated"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/latest_vaas": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * **Deprecated: use /v2/updates/price/latest instead** Get the latest VAAs by price feed id.
         * @deprecated
         * @description **Deprecated: use /v2/updates/price/latest instead**
         *
         *     Get the latest VAAs for a set of price feed ids.
         *
         *     Given a collection of price feed ids, retrieve the latest binary VAAs that bundle price updates for those feeds. The returned blobs can be submitted to Pyth contracts to update the on-chain price. If VAAs are not found for every provided price id the call will fail.
         */
        get: operations["latest_vaas_deprecated"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/price_feed_ids": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * **Deprecated: use /v2/price_feeds instead** Get the set of price feed IDs.
         * @deprecated
         * @description **Deprecated: use /v2/price_feeds instead**
         *
         *     Get the set of price feed IDs.
         *
         *     This endpoint fetches all of the price feed IDs for which price updates can be retrieved.
         */
        get: operations["price_feed_ids_deprecated"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/live": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Liveness check.
         * @description Returns OK when the process is running.
         */
        get: operations["hermes_live_check"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ready": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Readiness check.
         * @description Ready once at least one channel holds a fresh VAA -- the state every Hermes
         *     price endpoint reads from. Channels are reported individually so a partial
         *     outage is visible, but a single fresh channel is enough to serve traffic: a
         *     shard need not produce updates for every rate.
         */
        get: operations["hermes_ready_check"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/guardian_set_upgrade_vaa": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get the guardian set upgrade VAA.
         * @description Queries all configured router guardians for their signed guardian set upgrade data, verifies signatures, assembles a complete Wormhole VAA, and returns it.
         */
        get: operations["guardian_set_upgrade_vaa"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/price_feeds": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get the set of price feeds.
         * @description Get the set of price feeds.
         *
         *     This endpoint fetches all price feeds from the Pyth network. It can be filtered by asset type
         *     and query string.
         */
        get: operations["price_feeds_metadata"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/price_feeds/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get a single price feed by id.
         * @description Get a single price feed by id.
         *
         *     Returns the same metadata the `/v2/price_feeds` list returns for this feed. Feeds that are absent from that list are not reachable here either.
         */
        get: operations["price_feed_metadata_by_id"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/updates/price/latest": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get the latest price updates by price feed id.
         * @description Get the latest price updates by price feed id.
         *
         *     Given a collection of price feed ids, retrieve the latest Pyth price for each price feed.
         */
        get: operations["latest_price_updates"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/updates/price/stream": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * SSE route handler for streaming price updates.
         * @description SSE route handler for streaming price updates.
         *
         *     The connection will automatically close after 24 hours to prevent resource leaks.
         *     Clients should implement reconnection logic to maintain continuous price updates.
         */
        get: operations["price_stream_sse_handler"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/updates/price/{publish_time}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get price updates at or after a specific publish time.
         * @description Get price updates at or after a specific publish time.
         *
         *     Given a collection of price feed ids and a publish time, retrieve the first Pyth price update whose publish_time is >= the provided value.
         */
        get: operations["timestamp_price_updates"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/updates/price/{publish_time}/{interval}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get price updates within a time interval.
         * @description Get price updates within a time interval.
         *
         *     Given a collection of price feed ids, a publish time and an interval, retrieve every Pyth price update whose publish_time falls within the interval. The interval may not exceed 60 seconds, and a request may name at most 100 price feed ids.
         */
        get: operations["interval_price_updates"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/updates/publisher_stake_caps/latest": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get the most recent publisher stake caps update data.
         * @description Queries all configured router guardians for their share of the publisher stake caps VAA, assembles it, and returns the update data. Lazer does not compute stake caps, so it republishes the caps of the final Pythnet update.
         */
        get: operations["latest_publisher_stake_caps"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ws": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description WebSocket endpoint. Clients send JSON subscribe/unsubscribe messages and receive `price_update` payloads. */
        get: operations["websocket_endpoint"];
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
        /** @enum {string} */
        AssetType: "crypto" | "fx" | "equity" | "metal" | "rates" | "crypto_redemption_rate" | "commodities" | "crypto_index" | "crypto_nav" | "eco" | "kalshi";
        BinaryUpdate: {
            data: string[];
            encoding: components["schemas"]["EncodingType"];
        };
        /** @enum {string} */
        ChannelSchemaRepr: "real_time" | "fixed_rate@50ms" | "fixed_rate@200ms" | "fixed_rate@1000ms";
        DependencyReadiness: {
            name: string;
            ready: boolean;
            reason?: string | null;
        };
        /** @enum {string} */
        EncodingType: "hex" | "base64";
        GetPriceFeedQueryParams: {
            /** @description If true, include the binary price update in the `vaa` field. This binary data can be submitted to Pyth contracts to update the on-chain price. */
            binary?: boolean;
            /** @description The id of the price feed to query. */
            id: components["schemas"]["PriceIdInput"];
            /**
             * Format: u-int32
             * @description The unix timestamp in seconds. This endpoint will return the first update whose
             *     publish_time is >= the provided value.
             */
            publish_time: number;
            /** @description If true, include the `metadata` field in the response with additional metadata about the price update. */
            verbose?: boolean;
        };
        GetVaaCcipQueryParams: {
            /**
             * @description 40-byte hex-encoded payload (with optional `0x`/`0X` prefix). Bytes 0..32 are the
             *     price feed id; bytes 32..40 are the publish time as an `i64` big-endian unix
             *     timestamp.
             */
            data: string;
        };
        GetVaaCcipResponse: {
            /** @description The CCIP-formatted response payload as a `0x`-prefixed lower-case hex string. */
            data: string;
        };
        GetVaaQueryParams: {
            /** @description The id of the price feed to query. */
            id: components["schemas"]["PriceIdInput"];
            /**
             * Format: u-int32
             * @description The unix timestamp in seconds. This endpoint will return the first update whose
             *     publish_time is >= the provided value.
             */
            publish_time: number;
        };
        GetVaaResponse: {
            /**
             * Format: int64
             * @description The unix timestamp of the price update.
             */
            publishTime: number;
            /** @description The VAA binary represented as a base64 string. */
            vaa: string;
        };
        GuardianSetUpgradeVaaResponse: {
            /** @description Hex-encoded serialized VAA bytes. */
            vaa: string;
        };
        /** @description Incoming JSON on Hermes WebSocket `/ws` (legacy Hermes wire format; flat `type` + fields). */
        HermesWsClientMessage: {
            allow_out_of_order?: boolean;
            binary?: boolean;
            ids: components["schemas"]["PriceIdInput"][];
            ignore_invalid_price_ids?: boolean;
            /** @enum {string} */
            type: "subscribe";
            verbose?: boolean;
        } | {
            ids: components["schemas"]["PriceIdInput"][];
            /** @enum {string} */
            type: "unsubscribe";
        };
        /** @description Outgoing JSON on Hermes WebSocket `/ws` (legacy Hermes wire format). */
        HermesWsServerMessage: (components["schemas"]["HermesWsServerResponse"] & {
            /** @enum {string} */
            type: "response";
        }) | {
            price_feed: components["schemas"]["WsPriceFeed"];
            /** @enum {string} */
            type: "price_update";
        };
        /** @description Body of a `{"type":"response",...}` message (`status` + optional `error`). */
        HermesWsServerResponse: {
            /** @enum {string} */
            status: "success";
        } | {
            error: string;
            /** @enum {string} */
            status: "error";
        };
        LatestPriceFeedsQueryParams: {
            /** @description If true, include the binary price update in the `vaa` field of each returned feed. This binary data can be submitted to Pyth contracts to update the on-chain price. */
            binary?: boolean;
            /** @description The channel to query for price updates. Defaults to `fixed_rate@1000ms` if not specified. */
            channel?: components["schemas"]["ChannelSchemaRepr"];
            /**
             * @description Get the most recent price update for this set of price feed ids.
             *
             *     This parameter can be provided multiple times to retrieve multiple price updates,
             *     for example see the following query string:
             *
             *     ```
             *     ?ids[]=a12...&ids[]=b4c...
             *     ```
             */
            "ids[]": components["schemas"]["PriceIdInput"][];
            /** @description If true, include the `metadata` field in the response with additional metadata about the price update. */
            verbose?: boolean;
        };
        LatestPriceParams: {
            /** @description The channel to query for price updates. Defaults to `fixed_rate@1000ms` if not specified. */
            channel?: components["schemas"]["ChannelSchemaRepr"];
            /** @description Encoding of the returned price update. Defaults to `hex` if not specified. */
            encoding?: components["schemas"]["EncodingType"];
            /**
             * @description Get the most recent price update for this set of price feed ids.
             *
             *     This parameter can be provided multiple times to retrieve multiple price updates,
             *     for example see the following query string:
             *
             *     ```
             *     ?ids[]=a12...&ids[]=b4c...
             *     ```
             */
            "ids[]": components["schemas"]["PriceIdInput"][];
            /** @description If true, invalid price IDs in the `ids` parameter are ignored. Only applicable to the v2 APIs. Default is `false`. */
            ignore_invalid_price_ids?: boolean;
            /** @description If true, include the parsed price update in the `parsed` field of each returned feed. Default is `true`. */
            parsed?: boolean;
        };
        LatestPublisherStakeCapsParams: {
            /** @description Optional encoding type. If true, return the message in the encoding specified by the encoding parameter. Default is `hex`. */
            encoding?: components["schemas"]["EncodingType"];
            /** @description If true, include the parsed update in the `parsed` field of each returned feed. Default is `true`. */
            parsed?: boolean;
        };
        LatestPublisherStakeCapsUpdateDataResponse: {
            binary: components["schemas"]["BinaryUpdate"];
            parsed?: components["schemas"]["ParsedPublisherStakeCapsUpdate"][] | null;
        };
        LatestVaasQueryParams: {
            /** @description The channel to query for price updates. Defaults to `fixed_rate@1000ms` if not specified. */
            channel?: components["schemas"]["ChannelSchemaRepr"];
            /**
             * @description Get the most recent VAA for this set of price feed ids.
             *
             *     This parameter can be provided multiple times to retrieve multiple price updates,
             *     for example see the following query string:
             *
             *     ```
             *     ?ids[]=a12...&ids[]=b4c...
             *     ```
             */
            "ids[]": components["schemas"]["PriceIdInput"][];
        };
        MarketHours: {
            is_open: boolean;
            /**
             * Format: int64
             * @example 1717632000
             */
            next_close: number | null;
            /**
             * Format: int64
             * @example 1717632000
             */
            next_open: number | null;
        };
        ParsedPriceUpdate: {
            ema_price: components["schemas"]["RpcPrice"];
            id: components["schemas"]["RpcPriceIdentifier"];
            metadata: components["schemas"]["RpcPriceFeedMetadataV2"];
            price: components["schemas"]["RpcPrice"];
        };
        ParsedPublisherStakeCap: {
            /** Format: u-int64 */
            cap: number;
            publisher: string;
        };
        ParsedPublisherStakeCapsUpdate: {
            publisher_stake_caps: components["schemas"]["ParsedPublisherStakeCap"][];
        };
        PriceAtOrAfterParams: {
            /** @description Optional encoding type. If true, return the price update in the encoding specified by the encoding parameter. Default is `hex`. */
            encoding?: components["schemas"]["EncodingType"];
            /**
             * @description Get the most recent price update for this set of price feed ids.
             *
             *     This parameter can be provided multiple times to retrieve multiple price updates,
             *     for example see the following query string:
             *
             *     ```
             *     ?ids[]=a12...&ids[]=b4c...
             *     ```
             */
            "ids[]": components["schemas"]["PriceIdInput"][];
            /** @description If true, invalid price IDs in the `ids` parameter are ignored. Only applicable to the v2 APIs. Default is `false`. */
            ignore_invalid_price_ids?: boolean;
            /** @description If true, include the parsed price update in the `parsed` field of each returned feed. Default is `true`. */
            parsed?: boolean;
        };
        PriceFeedAttributes: {
            asset_type: string;
            base?: string | null;
            cms_symbol?: string | null;
            country?: string | null;
            cqs_symbol?: string | null;
            description: string;
            display_symbol: string;
            generic_symbol?: string | null;
            min_channel: components["schemas"]["ChannelSchemaRepr"];
            nasdaq_symbol?: string | null;
            publish_interval?: string | null;
            quote_currency?: string | null;
            schedule?: string | null;
            symbol: string;
        };
        PriceFeedIdPath: {
            /** @description The id of the price feed to query, with or without the `0x` prefix. Case insensitive. */
            id: components["schemas"]["PriceIdInput"];
        };
        PriceFeedMetadata: {
            attributes: components["schemas"]["PriceFeedAttributes"];
            id: components["schemas"]["RpcPriceIdentifier"];
            market_hours: null | components["schemas"]["MarketHours"];
        };
        PriceFeedsParams: {
            asset_type?: null | components["schemas"]["AssetType"];
            /** @description Optional query parameter. If provided, the results will be filtered to all price feeds whose symbol contains the query string. Query string is case insensitive. */
            query?: string | null;
        };
        /**
         * @description A price id is a 32-byte hex string, optionally prefixed with "0x".
         *     Price ids are case insensitive.
         *
         *     Examples:
         *     * 0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43
         *     * e62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43
         *
         *     See https://pyth.network/developers/price-feed-ids for a list of all price feed ids.
         * @example e62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43
         */
        PriceIdInput: string;
        PriceIntervalParams: {
            /** @description Optional encoding type. If true, return the price update in the encoding specified by the encoding parameter. Default is `hex`. */
            encoding?: components["schemas"]["EncodingType"];
            /**
             * @description Get the price updates within the requested interval for this set of price feed ids.
             *
             *     This parameter can be provided multiple times to retrieve multiple price updates,
             *     for example see the following query string:
             *
             *     ```
             *     ?ids[]=a12...&ids[]=b4c...
             *     ```
             *
             *     The unbracketed spelling `?ids=a12...&ids=b4c...` is accepted as well.
             *     Providing both spellings in one request is an error.
             */
            "ids[]": components["schemas"]["PriceIdInput"][];
            /** @description If true, invalid price IDs in the `ids` parameter are ignored. Only applicable to the v2 APIs. Default is `false`. */
            ignore_invalid_price_ids?: boolean;
            /** @description If true, include the parsed price update in the `parsed` field of each returned feed. Default is `true`. */
            parsed?: boolean;
            /**
             * @description If true, only count the first update at each publish time, so a price
             *     republished within a second appears once. Default is `true`.
             */
            unique?: boolean;
        };
        PricePublishTimeIntervalPath: {
            /**
             * Format: u-int32
             * @description The length of the requested interval in seconds, added to `publish_time` to give
             *     the inclusive end of the interval. May not exceed 60.
             */
            interval: number;
            /**
             * Format: u-int32
             * @description The unix timestamp in seconds of the start of the requested interval, inclusive.
             */
            publish_time: number;
        };
        PricePublishTimePath: {
            /**
             * Format: u-int32
             * @description The unix timestamp in seconds. This endpoint will return the first update whose
             *     publish_time is >= the provided value.
             */
            publish_time: number;
        };
        PriceUpdate: {
            binary: components["schemas"]["BinaryUpdate"];
            parsed?: components["schemas"]["ParsedPriceUpdate"][] | null;
        };
        ReadinessMetadata: {
            dependencies: components["schemas"]["DependencyReadiness"][];
            ready: boolean;
        };
        /**
         * @description A price with a degree of uncertainty at a certain time, represented as a price +- a confidence
         *     interval.
         *
         *     The confidence interval roughly corresponds to the standard error of a normal distribution.
         *     Both the price and confidence are stored in a fixed-point numeric representation, `x *
         *     10^expo`, where `expo` is the exponent. For example:
         */
        RpcPrice: {
            /**
             * @description The confidence interval associated with the price, stored as a string to avoid precision loss
             * @example 509500001
             */
            conf: string;
            /**
             * Format: int32
             * @description The exponent associated with both the price and confidence interval. Multiply those values
             *     by `10^expo` to get the real value.
             * @example -8
             */
            expo: number;
            /**
             * @description The price itself, stored as a string to avoid precision loss
             * @example 2920679499999
             */
            price: string;
            /**
             * Format: int64
             * @description When the price was published. The `publish_time` is a unix timestamp, i.e., the number of
             *     seconds since the Unix epoch (00:00:00 UTC on 1 Jan 1970).
             * @example 1717632000
             */
            publish_time: number;
        };
        RpcPriceFeedMetadataV2: {
            /**
             * Format: int64
             * @example 1717632000
             */
            prev_publish_time: number;
            /**
             * Format: int64
             * @example 1717632000
             */
            proof_available_time: number;
            /**
             * Format: int64
             * @example 85480034
             */
            slot: number;
        };
        /** @example e62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43 */
        RpcPriceIdentifier: string;
        StreamPriceParams: {
            /** @description If true, allows unordered price updates to be included in the stream. */
            allow_unordered?: boolean;
            /** @description If true, only include benchmark prices that are the initial price updates at a given timestamp (i.e., prevPubTime != pubTime). */
            benchmarks_only?: boolean;
            /** @description The channel to query for price updates. Defaults to `fixed_rate@1000ms` if not specified. */
            channel?: components["schemas"]["ChannelSchemaRepr"];
            /** @description Optional encoding type. If true, return the price update in the encoding specified by the encoding parameter. Default is `hex`. */
            encoding?: components["schemas"]["EncodingType"];
            /**
             * @description Get the most recent price update for this set of price feed ids.
             *
             *     This parameter can be provided multiple times to retrieve multiple price updates,
             *     for example see the following query string:
             *
             *     ```
             *     ?ids[]=a12...&ids[]=b4c...
             *     ```
             */
            "ids[]": components["schemas"]["PriceIdInput"][];
            /** @description If true, invalid price IDs in the `ids` parameter are ignored. Only applicable to the v2 APIs. Default is `false`. */
            ignore_invalid_price_ids?: boolean;
            /** @description If true, include the parsed price update in the `parsed` field of each returned feed. Default is `true`. */
            parsed?: boolean;
        };
        WsPriceFeed: {
            ema_price: components["schemas"]["RpcPrice"];
            id: components["schemas"]["RpcPriceIdentifier"];
            metadata?: null | components["schemas"]["WsPriceFeedMetadata"];
            price: components["schemas"]["RpcPrice"];
            vaa?: string | null;
        };
        WsPriceFeedMetadata: {
            /** Format: u-int16 */
            emitter_chain: number;
            /** Format: int64 */
            prev_publish_time: number;
            /** Format: int64 */
            price_service_receive_time: number;
            /** Format: u-int64 */
            slot: number;
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
    get_price_feed_deprecated: {
        parameters: {
            query: {
                /**
                 * @description The id of the price feed to query.
                 * @example e62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43
                 */
                id: components["schemas"]["PriceIdInput"];
                /**
                 * @description The unix timestamp in seconds. This endpoint will return the first update whose
                 *     publish_time is >= the provided value.
                 * @example 1717632000
                 */
                publish_time: number;
                /** @description If true, include the `metadata` field in the response with additional metadata about the price update. */
                verbose?: boolean;
                /** @description If true, include the binary price update in the `vaa` field. This binary data can be submitted to Pyth contracts to update the on-chain price. */
                binary?: boolean;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Price update retrieved successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WsPriceFeed"];
                };
            };
            /** @description Price update not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": string;
                };
            };
        };
    };
    get_vaa_deprecated: {
        parameters: {
            query: {
                /**
                 * @description The id of the price feed to query.
                 * @example e62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43
                 */
                id: components["schemas"]["PriceIdInput"];
                /**
                 * @description The unix timestamp in seconds. This endpoint will return the first update whose
                 *     publish_time is >= the provided value.
                 * @example 1717632000
                 */
                publish_time: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description VAA retrieved successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GetVaaResponse"];
                };
            };
            /** @description VAA not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": string;
                };
            };
        };
    };
    get_vaa_ccip_deprecated: {
        parameters: {
            query: {
                /**
                 * @description 40-byte hex-encoded payload (with optional `0x`/`0X` prefix). Bytes 0..32 are the
                 *     price feed id; bytes 32..40 are the publish time as an `i64` big-endian unix
                 *     timestamp.
                 */
                data: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description VAA retrieved successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GetVaaCcipResponse"];
                };
            };
            /** @description VAA not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": string;
                };
            };
        };
    };
    latest_price_feeds_deprecated: {
        parameters: {
            query: {
                /**
                 * @description Get the most recent price update for this set of price feed ids.
                 *
                 *     This parameter can be provided multiple times to retrieve multiple price updates,
                 *     for example see the following query string:
                 *
                 *     ```
                 *     ?ids[]=a12...&ids[]=b4c...
                 *     ```
                 * @example e62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43
                 */
                "ids[]": components["schemas"]["PriceIdInput"][];
                /** @description If true, include the `metadata` field in the response with additional metadata about the price update. */
                verbose?: boolean;
                /** @description If true, include the binary price update in the `vaa` field of each returned feed. This binary data can be submitted to Pyth contracts to update the on-chain price. */
                binary?: boolean;
                /**
                 * @description The channel to query for price updates. Defaults to `fixed_rate@1000ms` if not specified.
                 * @example fixed_rate@1000ms
                 */
                channel?: components["schemas"]["ChannelSchemaRepr"];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Price updates retrieved successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WsPriceFeed"][];
                };
            };
            /** @description Price ids not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": string;
                };
            };
        };
    };
    latest_vaas_deprecated: {
        parameters: {
            query: {
                /**
                 * @description Get the most recent VAA for this set of price feed ids.
                 *
                 *     This parameter can be provided multiple times to retrieve multiple price updates,
                 *     for example see the following query string:
                 *
                 *     ```
                 *     ?ids[]=a12...&ids[]=b4c...
                 *     ```
                 * @example e62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43
                 */
                "ids[]": components["schemas"]["PriceIdInput"][];
                /**
                 * @description The channel to query for price updates. Defaults to `fixed_rate@1000ms` if not specified.
                 * @example fixed_rate@1000ms
                 */
                channel?: components["schemas"]["ChannelSchemaRepr"];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description VAAs retrieved successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": string[];
                };
            };
            /** @description Price ids not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": string;
                };
            };
        };
    };
    price_feed_ids_deprecated: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Price feed ids retrieved successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RpcPriceIdentifier"][];
                };
            };
        };
    };
    hermes_live_check: {
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
                    /** @example OK */
                    "text/plain": string;
                };
            };
        };
    };
    hermes_ready_check: {
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
                    /** @example OK */
                    "text/plain": string;
                };
            };
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReadinessMetadata"];
                };
            };
        };
    };
    guardian_set_upgrade_vaa: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Guardian set upgrade VAA assembled successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GuardianSetUpgradeVaaResponse"];
                };
            };
            /** @description No guardian set upgrade in progress */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": string;
                };
            };
            /** @description Internal server error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": string;
                };
            };
        };
    };
    price_feeds_metadata: {
        parameters: {
            query?: {
                /**
                 * @description Optional query parameter. If provided, the results will be filtered to all price feeds whose symbol contains the query string. Query string is case insensitive.
                 * @example bitcoin
                 */
                query?: string | null;
                /**
                 * @description Optional query parameter. If provided, the results will be filtered by asset type. Possible values are crypto, equity, fx, metal, rates. Filter string is case insensitive.
                 * @example crypto
                 */
                asset_type?: null | components["schemas"]["AssetType"];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Price feeds metadata retrieved successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PriceFeedMetadata"][];
                };
            };
        };
    };
    price_feed_metadata_by_id: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /**
                 * @description The id of the price feed to query, with or without the `0x` prefix. Case insensitive.
                 * @example e62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43
                 */
                id: components["schemas"]["PriceIdInput"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Price feed metadata retrieved successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PriceFeedMetadata"];
                };
            };
            /** @description Price feed not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": string;
                };
            };
            /** @description Invalid id */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": string;
                };
            };
        };
    };
    latest_price_updates: {
        parameters: {
            query: {
                /**
                 * @description Get the most recent price update for this set of price feed ids.
                 *
                 *     This parameter can be provided multiple times to retrieve multiple price updates,
                 *     for example see the following query string:
                 *
                 *     ```
                 *     ?ids[]=a12...&ids[]=b4c...
                 *     ```
                 * @example e62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43
                 */
                "ids[]": components["schemas"]["PriceIdInput"][];
                /** @description Encoding of the returned price update. Defaults to `hex` if not specified. */
                encoding?: components["schemas"]["EncodingType"];
                /** @description If true, include the parsed price update in the `parsed` field of each returned feed. Default is `true`. */
                parsed?: boolean;
                /** @description If true, invalid price IDs in the `ids` parameter are ignored. Only applicable to the v2 APIs. Default is `false`. */
                ignore_invalid_price_ids?: boolean;
                /**
                 * @description The channel to query for price updates. Defaults to `fixed_rate@1000ms` if not specified.
                 * @example fixed_rate@1000ms
                 */
                channel?: components["schemas"]["ChannelSchemaRepr"];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Price updates retrieved successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PriceUpdate"];
                };
            };
            /** @description Price ids not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": string;
                };
            };
        };
    };
    price_stream_sse_handler: {
        parameters: {
            query: {
                /**
                 * @description Get the most recent price update for this set of price feed ids.
                 *
                 *     This parameter can be provided multiple times to retrieve multiple price updates,
                 *     for example see the following query string:
                 *
                 *     ```
                 *     ?ids[]=a12...&ids[]=b4c...
                 *     ```
                 * @example e62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43
                 */
                "ids[]": components["schemas"]["PriceIdInput"][];
                /** @description Optional encoding type. If true, return the price update in the encoding specified by the encoding parameter. Default is `hex`. */
                encoding?: components["schemas"]["EncodingType"];
                /** @description If true, include the parsed price update in the `parsed` field of each returned feed. Default is `true`. */
                parsed?: boolean;
                /** @description If true, allows unordered price updates to be included in the stream. */
                allow_unordered?: boolean;
                /** @description If true, only include benchmark prices that are the initial price updates at a given timestamp (i.e., prevPubTime != pubTime). */
                benchmarks_only?: boolean;
                /** @description If true, invalid price IDs in the `ids` parameter are ignored. Only applicable to the v2 APIs. Default is `false`. */
                ignore_invalid_price_ids?: boolean;
                /**
                 * @description The channel to query for price updates. Defaults to `fixed_rate@1000ms` if not specified.
                 * @example fixed_rate@1000ms
                 */
                channel?: components["schemas"]["ChannelSchemaRepr"];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Price updates retrieved successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/event-stream": components["schemas"]["PriceUpdate"];
                };
            };
            /** @description Price ids not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": string;
                };
            };
        };
    };
    timestamp_price_updates: {
        parameters: {
            query: {
                /**
                 * @description Get the most recent price update for this set of price feed ids.
                 *
                 *     This parameter can be provided multiple times to retrieve multiple price updates,
                 *     for example see the following query string:
                 *
                 *     ```
                 *     ?ids[]=a12...&ids[]=b4c...
                 *     ```
                 * @example e62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43
                 */
                "ids[]": components["schemas"]["PriceIdInput"][];
                /** @description Optional encoding type. If true, return the price update in the encoding specified by the encoding parameter. Default is `hex`. */
                encoding?: components["schemas"]["EncodingType"];
                /** @description If true, include the parsed price update in the `parsed` field of each returned feed. Default is `true`. */
                parsed?: boolean;
                /** @description If true, invalid price IDs in the `ids` parameter are ignored. Only applicable to the v2 APIs. Default is `false`. */
                ignore_invalid_price_ids?: boolean;
            };
            header?: never;
            path: {
                /**
                 * @description The unix timestamp in seconds. This endpoint will return the first update whose
                 *     publish_time is >= the provided value.
                 * @example 1717632000
                 */
                publish_time: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Price updates retrieved successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PriceUpdate"];
                };
            };
            /** @description Price ids not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": string;
                };
            };
        };
    };
    interval_price_updates: {
        parameters: {
            query: {
                /**
                 * @description Get the price updates within the requested interval for this set of price feed ids.
                 *
                 *     This parameter can be provided multiple times to retrieve multiple price updates,
                 *     for example see the following query string:
                 *
                 *     ```
                 *     ?ids[]=a12...&ids[]=b4c...
                 *     ```
                 *
                 *     The unbracketed spelling `?ids=a12...&ids=b4c...` is accepted as well.
                 *     Providing both spellings in one request is an error.
                 * @example e62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43
                 */
                "ids[]": components["schemas"]["PriceIdInput"][];
                /** @description Optional encoding type. If true, return the price update in the encoding specified by the encoding parameter. Default is `hex`. */
                encoding?: components["schemas"]["EncodingType"];
                /** @description If true, include the parsed price update in the `parsed` field of each returned feed. Default is `true`. */
                parsed?: boolean;
                /** @description If true, invalid price IDs in the `ids` parameter are ignored. Only applicable to the v2 APIs. Default is `false`. */
                ignore_invalid_price_ids?: boolean;
                /**
                 * @description If true, only count the first update at each publish time, so a price
                 *     republished within a second appears once. Default is `true`.
                 */
                unique?: boolean;
            };
            header?: never;
            path: {
                /**
                 * @description The unix timestamp in seconds of the start of the requested interval, inclusive.
                 * @example 1717632000
                 */
                publish_time: number;
                /**
                 * @description The length of the requested interval in seconds, added to `publish_time` to give
                 *     the inclusive end of the interval. May not exceed 60.
                 * @example 60
                 */
                interval: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Price updates retrieved successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PriceUpdate"][];
                };
            };
            /** @description Invalid interval or price ids */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": string;
                };
            };
            /** @description Price ids not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": string;
                };
            };
        };
    };
    latest_publisher_stake_caps: {
        parameters: {
            query?: {
                /** @description Optional encoding type. If true, return the message in the encoding specified by the encoding parameter. Default is `hex`. */
                encoding?: components["schemas"]["EncodingType"];
                /** @description If true, include the parsed update in the `parsed` field of each returned feed. Default is `true`. */
                parsed?: boolean;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Publisher stake caps update data retrieved successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LatestPublisherStakeCapsUpdateDataResponse"];
                };
            };
            /** @description Internal server error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": string;
                };
            };
        };
    };
    websocket_endpoint: {
        parameters: {
            query?: {
                /**
                 * @description The channel to query for price updates. Defaults to `fixed_rate@1000ms` if not specified.
                 * @example fixed_rate@1000ms
                 */
                channel?: components["schemas"]["ChannelSchemaRepr"];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Reference only: after the WebSocket upgrade, clients may send one of these JSON messages over the WebSocket connection. */
        requestBody: {
            content: {
                "application/json": components["schemas"]["HermesWsClientMessage"];
            };
        };
        responses: {
            /** @description Reference only: after the WebSocket upgrade, the server sends this success message after a valid subscribe or unsubscribe request */
            101: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": "success",
                     *       "type": "response"
                     *     }
                     */
                    "application/json": components["schemas"]["HermesWsServerMessage"];
                };
            };
            /** @description Reference only: after the WebSocket upgrade, the server sends this error message when a client message is invalid, a price id is malformed, requested feeds are not found, or the 24 hour connection timeout is reached */
            102: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "error": "Price ID not valid: abc123",
                     *       "status": "error",
                     *       "type": "response"
                     *     }
                     */
                    "application/json": components["schemas"]["HermesWsServerMessage"];
                };
            };
            /** @description Reference only: after the WebSocket upgrade, the server sends this message whenever a subscribed feed receives a new update */
            103: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "price_feed": {
                     *         "ema_price": {
                     *           "conf": "478300000",
                     *           "expo": -8,
                     *           "price": "2920100000000",
                     *           "publish_time": 1717632000
                     *         },
                     *         "id": "e62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43",
                     *         "metadata": {
                     *           "emitter_chain": 26,
                     *           "prev_publish_time": 1717631940,
                     *           "price_service_receive_time": 1717632000,
                     *           "slot": 85480034
                     *         },
                     *         "price": {
                     *           "conf": "509500001",
                     *           "expo": -8,
                     *           "price": "2920679499999",
                     *           "publish_time": 1717632000
                     *         },
                     *         "vaa": "AQAAAAABAAAAAAAAAA=="
                     *       },
                     *       "type": "price_update"
                     *     }
                     */
                    "application/json": components["schemas"]["HermesWsServerMessage"];
                };
            };
        };
    };
}
