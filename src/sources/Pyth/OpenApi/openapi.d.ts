export interface paths {
    "/api/get_price_feed": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * **Deprecated: use /v2/updates/price/{publish_time} instead**
         * @deprecated
         * @description **Deprecated: use /v2/updates/price/{publish_time} instead**
         *
         *     Get a price update for a price feed with a specific timestamp
         *
         *     Given a price feed id and timestamp, retrieve the Pyth price update closest to that timestamp.
         */
        get: operations["get_price_feed"];
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
         * **Deprecated: use /v2/updates/price/{publish_time} instead**
         * @deprecated
         * @description **Deprecated: use /v2/updates/price/{publish_time} instead**
         *
         *     Get a VAA for a price feed with a specific timestamp
         *
         *     Given a price feed id and timestamp, retrieve the Pyth price update closest to that timestamp.
         */
        get: operations["get_vaa"];
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
         * **Deprecated: use /v2/updates/price/{publish_time} instead**
         * @deprecated
         * @description **Deprecated: use /v2/updates/price/{publish_time} instead**
         *
         *     Get a VAA for a price feed using CCIP
         *
         *     This endpoint accepts a single argument which is a hex-encoded byte string of the following form:
         *     `<price feed id (32 bytes> <publish time as unix timestamp (8 bytes, big endian)>`
         */
        get: operations["get_vaa_ccip"];
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
         * **Deprecated: use /v2/updates/price/latest instead**
         * @deprecated
         * @description **Deprecated: use /v2/updates/price/latest instead**
         *
         *     Get the latest price updates by price feed id.
         *
         *     Given a collection of price feed ids, retrieve the latest Pyth price for each price feed.
         */
        get: operations["latest_price_feeds"];
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
         * **Deprecated: use /v2/updates/price/latest instead**
         * @deprecated
         * @description **Deprecated: use /v2/updates/price/latest instead**
         *
         *     Get VAAs for a set of price feed ids.
         *
         *     Given a collection of price feed ids, retrieve the latest VAA for each. The returned VAA(s) can
         *     be submitted to the Pyth contract to update the on-chain price. If VAAs are not found for every
         *     provided price ID the call will fail.
         */
        get: operations["latest_vaas"];
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
         * **Deprecated: use /v2/price_feeds instead**
         * @deprecated
         * @description **Deprecated: use /v2/price_feeds instead**
         *
         *     Get the set of price feed IDs.
         *
         *     This endpoint fetches all of the price feed IDs for which price updates can be retrieved.
         */
        get: operations["price_feed_ids"];
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
         * Get the latest price updates by price feed id.
         * @description Get the latest price updates by price feed id.
         *
         *     Given a collection of price feed ids, retrieve the latest Pyth price for each price feed.
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
    "/v2/updates/publisher_stake_caps/latest": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get the most recent publisher stake caps update data.
         * @description Get the most recent publisher stake caps update data.
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
        EncodingType: "hex" | "base64";
        /** Format: binary */
        GetVaaCcipInput: string;
        GetVaaCcipResponse: {
            data: string;
        };
        GetVaaResponse: {
            /**
             * Format: int64
             * @example 1690576641
             */
            publishTime: number;
            /**
             * @description The VAA binary represented as a base64 string.
             * @example UE5BVQEAAAADuAEAAAADDQC1H7meY5fTed0FsykIb8dt+7nKpbuzfvU2DplDi+dcUl8MC+UIkS65+rkiq+zmNBxE2gaxkBkjdIicZ/fBo+X7AAEqp+WtlWb84np8jJfLpuQ2W+l5KXTigsdAhz5DyVgU3xs+EnaIZxBwcE7EKzjMam+V9rlRy0CGsiQ1kjqqLzfAAQLsoVO0Vu5gVmgc8XGQ7xYhoz36rsBgMjG+e3l/B01esQi/KzPuBf/Ar8Sg5aSEOvEU0muSDb+KIr6d8eEC+FtcAAPZEaBSt4ysXVL84LUcJemQD3SiG30kOfUpF8o7/wI2M2Jf/LyCsbKEQUyLtLbZqnJBSfZJR5AMsrnHDqngMLEGAAY4UDG9GCpRuPvg8hOlsrXuPP3zq7yVPqyG0SG+bNo8rEhP5b1vXlHdG4bZsutX47d5VZ6xnFROKudx3T3/fnWUAQgAU1+kUFc3e0ZZeX1dLRVEryNIVyxMQIcxWwdey+jlIAYowHRM0fJX3Scs80OnT/CERwh5LMlFyU1w578NqxW+AQl2E/9fxjgUTi8crOfDpwsUsmOWw0+Q5OUGhELv/2UZoHAjsaw9OinWUggKACo4SdpPlHYldoWF+J2yGWOW+F4iAQre4c+ocb6a9uSWOnTldFkioqhd9lhmV542+VonCvuy4Tu214NP+2UNd/4Kk3KJCf3iziQJrCBeLi1cLHdLUikgAQtvRFR/nepcF9legl+DywAkUHi5/1MNjlEQvlHyh2XbMiS85yu7/9LgM6Sr+0ukfZY5mSkOcvUkpHn+T+Nw/IrQAQ7lty5luvKUmBpI3ITxSmojJ1aJ0kj/dc0ZcQk+/qo0l0l3/eRLkYjw5j+MZKA8jEubrHzUCke98eSoj8l08+PGAA+DAKNtCwNZe4p6J1Ucod8Lo5RKFfA84CPLVyEzEPQFZ25U9grUK6ilF4GhEia/ndYXLBt3PGW3qa6CBBPM7rH3ABGAyYEtUwzB4CeVedA5o6cKpjRkIebqDNSOqltsr+w7kXdfFVtsK2FMGFZNt5rbpIR+ppztoJ6eOKHmKmi9nQ99ARKkTxRErOs9wJXNHaAuIRV38o1pxRrlQRzGsRuKBqxcQEpC8OPFpyKYcp6iD5l7cO/gRDTamLFyhiUBwKKMP07FAWTEJv8AAAAAABrhAfrtrFhR4yubI7X5QRqMK6xKrj7U3XuBHdGnLqSqcQAAAAAAGp0GAUFVV1YAAAAAAAUYUmIAACcQBsfKUtr4PgZbIXRxRESU79PjE4IBAFUA5i32yLSoX+GmfbRNwS3l2zMPesZrctxliv7fD0pBW0MAAAKqqMJFwAAAAAAqE/NX////+AAAAABkxCb7AAAAAGTEJvoAAAKqIcWxYAAAAAAlR5m4CP/mPsh1IezjYpDlJ4GRb5q4fTs2LjtyO6M0XgVimrIQ4kSh1qg7JKW4gbGkyRntVFR9JO/GNd3FPDit0BK6M+JzXh/h12YNCz9wxlZTvXrNtWNbzqT+91pvl5cphhSPMfAHyEzTPaGR9tKDy9KNu56pmhaY32d2vfEWQmKo22guegeR98oDxs67MmnUraco46a3zEnac2Bm80pasUgMO24=
             */
            vaa: string;
        };
        LatestPublisherStakeCapsUpdateDataResponse: {
            binary: components["schemas"]["BinaryUpdate"];
            parsed?: components["schemas"]["ParsedPublisherStakeCapsUpdate"][] | null;
        };
        ParsedPriceUpdate: {
            ema_price: components["schemas"]["RpcPrice"];
            id: components["schemas"]["RpcPriceIdentifier"];
            metadata: components["schemas"]["RpcPriceFeedMetadataV2"];
            price: components["schemas"]["RpcPrice"];
        };
        ParsedPublisherStakeCap: {
            /** Format: int64 */
            cap: number;
            publisher: string;
        };
        ParsedPublisherStakeCapsUpdate: {
            publisher_stake_caps: components["schemas"]["ParsedPublisherStakeCap"][];
        };
        PriceFeedMetadata: {
            attributes: {
                [key: string]: string;
            };
            id: components["schemas"]["RpcPriceIdentifier"];
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
        PriceUpdate: {
            binary: components["schemas"]["BinaryUpdate"];
            parsed?: components["schemas"]["ParsedPriceUpdate"][] | null;
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
        RpcPriceFeed: {
            ema_price: components["schemas"]["RpcPrice"];
            id: components["schemas"]["RpcPriceIdentifier"];
            metadata?: components["schemas"]["RpcPriceFeedMetadata"] | null;
            price: components["schemas"]["RpcPrice"];
            /**
             * @description The VAA binary represented as a base64 string.
             * @example UE5BVQEAAAADuAEAAAADDQC1H7meY5fTed0FsykIb8dt+7nKpbuzfvU2DplDi+dcUl8MC+UIkS65+rkiq+zmNBxE2gaxkBkjdIicZ/fBo+X7AAEqp+WtlWb84np8jJfLpuQ2W+l5KXTigsdAhz5DyVgU3xs+EnaIZxBwcE7EKzjMam+V9rlRy0CGsiQ1kjqqLzfAAQLsoVO0Vu5gVmgc8XGQ7xYhoz36rsBgMjG+e3l/B01esQi/KzPuBf/Ar8Sg5aSEOvEU0muSDb+KIr6d8eEC+FtcAAPZEaBSt4ysXVL84LUcJemQD3SiG30kOfUpF8o7/wI2M2Jf/LyCsbKEQUyLtLbZqnJBSfZJR5AMsrnHDqngMLEGAAY4UDG9GCpRuPvg8hOlsrXuPP3zq7yVPqyG0SG+bNo8rEhP5b1vXlHdG4bZsutX47d5VZ6xnFROKudx3T3/fnWUAQgAU1+kUFc3e0ZZeX1dLRVEryNIVyxMQIcxWwdey+jlIAYowHRM0fJX3Scs80OnT/CERwh5LMlFyU1w578NqxW+AQl2E/9fxjgUTi8crOfDpwsUsmOWw0+Q5OUGhELv/2UZoHAjsaw9OinWUggKACo4SdpPlHYldoWF+J2yGWOW+F4iAQre4c+ocb6a9uSWOnTldFkioqhd9lhmV542+VonCvuy4Tu214NP+2UNd/4Kk3KJCf3iziQJrCBeLi1cLHdLUikgAQtvRFR/nepcF9legl+DywAkUHi5/1MNjlEQvlHyh2XbMiS85yu7/9LgM6Sr+0ukfZY5mSkOcvUkpHn+T+Nw/IrQAQ7lty5luvKUmBpI3ITxSmojJ1aJ0kj/dc0ZcQk+/qo0l0l3/eRLkYjw5j+MZKA8jEubrHzUCke98eSoj8l08+PGAA+DAKNtCwNZe4p6J1Ucod8Lo5RKFfA84CPLVyEzEPQFZ25U9grUK6ilF4GhEia/ndYXLBt3PGW3qa6CBBPM7rH3ABGAyYEtUwzB4CeVedA5o6cKpjRkIebqDNSOqltsr+w7kXdfFVtsK2FMGFZNt5rbpIR+ppztoJ6eOKHmKmi9nQ99ARKkTxRErOs9wJXNHaAuIRV38o1pxRrlQRzGsRuKBqxcQEpC8OPFpyKYcp6iD5l7cO/gRDTamLFyhiUBwKKMP07FAWTEJv8AAAAAABrhAfrtrFhR4yubI7X5QRqMK6xKrj7U3XuBHdGnLqSqcQAAAAAAGp0GAUFVV1YAAAAAAAUYUmIAACcQBsfKUtr4PgZbIXRxRESU79PjE4IBAFUA5i32yLSoX+GmfbRNwS3l2zMPesZrctxliv7fD0pBW0MAAAKqqMJFwAAAAAAqE/NX////+AAAAABkxCb7AAAAAGTEJvoAAAKqIcWxYAAAAAAlR5m4CP/mPsh1IezjYpDlJ4GRb5q4fTs2LjtyO6M0XgVimrIQ4kSh1qg7JKW4gbGkyRntVFR9JO/GNd3FPDit0BK6M+JzXh/h12YNCz9wxlZTvXrNtWNbzqT+91pvl5cphhSPMfAHyEzTPaGR9tKDy9KNu56pmhaY32d2vfEWQmKo22guegeR98oDxs67MmnUraco46a3zEnac2Bm80pasUgMO24=
             */
            vaa?: string | null;
        };
        RpcPriceFeedMetadata: {
            /**
             * Format: int32
             * @example 26
             */
            emitter_chain: number;
            /**
             * Format: int64
             * @example 1717632000
             */
            prev_publish_time?: number | null;
            /**
             * Format: int64
             * @example 1717632000
             */
            price_service_receive_time?: number | null;
            /**
             * Format: int64
             * @example 85480034
             */
            slot?: number | null;
        };
        RpcPriceFeedMetadataV2: {
            /**
             * Format: int64
             * @example 1717632000
             */
            prev_publish_time?: number | null;
            /**
             * Format: int64
             * @example 1717632000
             */
            proof_available_time?: number | null;
            /**
             * Format: int64
             * @example 85480034
             */
            slot?: number | null;
        };
        /** @example e62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43 */
        RpcPriceIdentifier: string;
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    get_price_feed: {
        parameters: {
            query: {
                /** @description The id of the price feed to get an update for. */
                id: components["schemas"]["PriceIdInput"];
                /**
                 * @description The unix timestamp in seconds. This endpoint will return the first update whose
                 *     publish_time is >= the provided value.
                 * @example 1717632000
                 */
                publish_time: number;
                /**
                 * @description If true, include the `metadata` field in the response with additional metadata about the
                 *     price update.
                 */
                verbose?: boolean;
                /**
                 * @description If true, include the binary price update in the `vaa` field of each returned feed. This
                 *     binary data can be submitted to Pyth contracts to update the on-chain price.
                 */
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
                    "application/json": components["schemas"]["RpcPriceFeed"];
                };
            };
        };
    };
    get_vaa: {
        parameters: {
            query: {
                /** @description The ID of the price feed to get an update for. */
                id: components["schemas"]["PriceIdInput"];
                /**
                 * @description The unix timestamp in seconds. This endpoint will return the first update whose
                 *     publish_time is >= the provided value.
                 * @example 1690576641
                 */
                publish_time: number;
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
                    "application/json": components["schemas"]["GetVaaResponse"];
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
    get_vaa_ccip: {
        parameters: {
            query: {
                data: components["schemas"]["GetVaaCcipInput"];
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
                    "application/json": components["schemas"]["GetVaaCcipResponse"];
                };
            };
        };
    };
    latest_price_feeds: {
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
                /**
                 * @description If true, include the `metadata` field in the response with additional metadata about
                 *     the price update.
                 */
                verbose?: boolean;
                /**
                 * @description If true, include the binary price update in the `vaa` field of each returned feed.
                 *     This binary data can be submitted to Pyth contracts to update the on-chain price.
                 */
                binary?: boolean;
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
                    "application/json": components["schemas"]["RpcPriceFeed"][];
                };
            };
        };
    };
    latest_vaas: {
        parameters: {
            query: {
                /**
                 * @description Get the VAAs for this set of price feed ids.
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
                    /**
                     * @example [
                     *       "UE5BVQEAAAADuAEAAAADDQC1H7meY5fTed0FsykIb8dt+7nKpbuzfvU2DplDi+dcUl8MC+UIkS65+rkiq+zmNBxE2gaxkBkjdIicZ/fBo+X7AAEqp+WtlWb84np8jJfLpuQ2W+l5KXTigsdAhz5DyVgU3xs+EnaIZxBwcE7EKzjMam+V9rlRy0CGsiQ1kjqqLzfAAQLsoVO0Vu5gVmgc8XGQ7xYhoz36rsBgMjG+e3l/B01esQi/KzPuBf/Ar8Sg5aSEOvEU0muSDb+KIr6d8eEC+FtcAAPZEaBSt4ysXVL84LUcJemQD3SiG30kOfUpF8o7/wI2M2Jf/LyCsbKEQUyLtLbZqnJBSfZJR5AMsrnHDqngMLEGAAY4UDG9GCpRuPvg8hOlsrXuPP3zq7yVPqyG0SG+bNo8rEhP5b1vXlHdG4bZsutX47d5VZ6xnFROKudx3T3/fnWUAQgAU1+kUFc3e0ZZeX1dLRVEryNIVyxMQIcxWwdey+jlIAYowHRM0fJX3Scs80OnT/CERwh5LMlFyU1w578NqxW+AQl2E/9fxjgUTi8crOfDpwsUsmOWw0+Q5OUGhELv/2UZoHAjsaw9OinWUggKACo4SdpPlHYldoWF+J2yGWOW+F4iAQre4c+ocb6a9uSWOnTldFkioqhd9lhmV542+VonCvuy4Tu214NP+2UNd/4Kk3KJCf3iziQJrCBeLi1cLHdLUikgAQtvRFR/nepcF9legl+DywAkUHi5/1MNjlEQvlHyh2XbMiS85yu7/9LgM6Sr+0ukfZY5mSkOcvUkpHn+T+Nw/IrQAQ7lty5luvKUmBpI3ITxSmojJ1aJ0kj/dc0ZcQk+/qo0l0l3/eRLkYjw5j+MZKA8jEubrHzUCke98eSoj8l08+PGAA+DAKNtCwNZe4p6J1Ucod8Lo5RKFfA84CPLVyEzEPQFZ25U9grUK6ilF4GhEia/ndYXLBt3PGW3qa6CBBPM7rH3ABGAyYEtUwzB4CeVedA5o6cKpjRkIebqDNSOqltsr+w7kXdfFVtsK2FMGFZNt5rbpIR+ppztoJ6eOKHmKmi9nQ99ARKkTxRErOs9wJXNHaAuIRV38o1pxRrlQRzGsRuKBqxcQEpC8OPFpyKYcp6iD5l7cO/gRDTamLFyhiUBwKKMP07FAWTEJv8AAAAAABrhAfrtrFhR4yubI7X5QRqMK6xKrj7U3XuBHdGnLqSqcQAAAAAAGp0GAUFVV1YAAAAAAAUYUmIAACcQBsfKUtr4PgZbIXRxRESU79PjE4IBAFUA5i32yLSoX+GmfbRNwS3l2zMPesZrctxliv7fD0pBW0MAAAKqqMJFwAAAAAAqE/NX////+AAAAABkxCb7AAAAAGTEJvoAAAKqIcWxYAAAAAAlR5m4CP/mPsh1IezjYpDlJ4GRb5q4fTs2LjtyO6M0XgVimrIQ4kSh1qg7JKW4gbGkyRntVFR9JO/GNd3FPDit0BK6M+JzXh/h12YNCz9wxlZTvXrNtWNbzqT+91pvl5cphhSPMfAHyEzTPaGR9tKDy9KNu56pmhaY32d2vfEWQmKo22guegeR98oDxs67MmnUraco46a3zEnac2Bm80pasUgMO24="
                     *     ]
                     */
                    "application/json": string[];
                };
            };
        };
    };
    price_feed_ids: {
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
                asset_type?: components["schemas"]["AssetType"] | null;
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
                /** @description Optional encoding type. If true, return the price update in the encoding specified by the encoding parameter. Default is `hex`. */
                encoding?: components["schemas"]["EncodingType"];
                /** @description If true, include the parsed price update in the `parsed` field of each returned feed. Default is `true`. */
                parsed?: boolean;
                /** @description If true, invalid price IDs in the `ids` parameter are ignored. Only applicable to the v2 APIs. Default is `false`. */
                ignore_invalid_price_ids?: boolean;
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
    latest_publisher_stake_caps: {
        parameters: {
            query?: {
                /**
                 * @description Get the most recent publisher stake caps update data.
                 *     Optional encoding type. If true, return the message in the encoding specified by the encoding parameter. Default is `hex`.
                 */
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
        };
    };
}
