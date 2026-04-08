export interface paths {
    "/global": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get global information */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description successful operation */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Global"][];
                    };
                };
                /** @description too many requests */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/coins": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get all coins listed on coinpaprika */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description successful operation */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Coin"][];
                    };
                };
                /** @description too many requests */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ticker": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get ticker information for all coins */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description successful operation */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Tick"][];
                    };
                };
                /** @description too many requests */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ticker/{coin_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get ticker information for specific coin */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description ID of coin to return e.g. btc-bitcoin, eth-ethereum */
                    coin_id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description successful operation */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Tick"];
                    };
                };
                /** @description coin not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description too many requests */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/search/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Search for currencies/icos/people/exchanges/tags */
        get: {
            parameters: {
                query: {
                    /** @description phrase for search eg. `btc` */
                    q: string;
                    /** @description one or more categories (comma separated) to search. Available options: `currencies|exchanges|icos|people|tags` */
                    c?: string;
                    /** @description limit of results per category (max 250) */
                    limit?: number;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description successful operation */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["SearchResults"];
                    };
                };
                /** @description invalid parameters */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description too many requests */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
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
        /** @description Tick response. Missing values are returned as empty string */
        Tick: {
            /** @example btc-bitcoin */
            id?: string;
            /** @example Bitcoin */
            name?: string;
            /** @example BTC */
            symbol?: string;
            /** @example 1 */
            rank?: string;
            /** @example 9259.01 */
            price_usd?: string;
            /** @example 1 */
            price_btc?: string;
            /** @example 8102619999 */
            volume_24h_usd?: string;
            /** @example 157468557128 */
            market_cap_usd?: string;
            /** @example 17007062 */
            circulating_supply?: string;
            /** @example 17007062 */
            total_supply?: string;
            /** @example 21000000 */
            max_supply?: string;
            /** @example -0.26 */
            percent_change_1h?: string;
            /** @example 0.22 */
            percent_change_24h?: string;
            /** @example 4.1 */
            percent_change_7d?: string;
            /** @example 1525088839 */
            last_updated?: string;
        };
        Coin: {
            /** @example btc-bitcoin */
            id?: string;
            /** @example Bitcoin */
            name?: string;
            /** @example BTC */
            symbol?: string;
            /** @example 1 */
            rank?: number;
            /**
             * @description If currency was added within last 5 days
             * @example false
             */
            is_new?: boolean;
            /** @example true */
            is_active?: boolean;
        };
        Global: {
            /** @example 430252937008 */
            market_cap_usd?: number;
            /** @example 430252937008 */
            volume_24h_usd?: number;
            /** @example 36.67 */
            bitcoin_dominance_percentage?: number;
            /** @example 1587 */
            cryptocurrencies_number?: number;
            /** @example 1525089441 */
            last_updated?: number;
        };
        SearchResults: {
            currencies?: components["schemas"]["Coin"][];
            icos?: {
                /** @example fil-filecoin-futures */
                id?: string;
                /** @example Filecoin */
                name?: string;
                /** @example FIL */
                symbol?: string;
                /**
                 * @description If ico was added within last 5 days
                 * @example false
                 */
                is_new?: boolean;
            }[];
            exchanges?: {
                /** @example binance */
                id?: string;
                /** @example Binance */
                name?: string;
                /** @example 1 */
                rank?: number;
            }[];
            people?: {
                /** @example vitalik-buterin */
                id?: string;
                /** @example Vitalik Buterin */
                name?: string;
                /**
                 * @description Number of teams where person is a member
                 * @example 5
                 */
                teams_count?: number;
            }[];
            tags?: {
                /** @example blockchain-service */
                id?: string;
                /** @example Blockchain Service */
                name?: string;
                /**
                 * @description Number of currencies with this tag
                 * @example 160
                 */
                coin_counter?: number;
                /**
                 * @description Number of icos with this tag
                 * @example 80
                 */
                ico_counter?: number;
            }[];
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
