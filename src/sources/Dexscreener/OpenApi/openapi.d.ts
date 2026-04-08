export interface paths {
    "/token-profiles/latest/v1": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get the latest token profiles (rate-limit 60 requests per minute) */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Ok */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["TokenProfile"];
                    };
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
    "/community-takeovers/latest/v1": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get the latest token community takeovers (rate-limit 60 requests per minute) */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Ok */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["CommunityTakeoverResponse"];
                    };
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
    "/ads/latest/v1": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get the latest ads (rate-limit 60 requests per minute) */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Ok */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["AdsResponse"];
                    };
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
    "/token-boosts/latest/v1": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get the latest boosted tokens (rate-limit 60 requests per minute) */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Ok */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["BoostsResponse"];
                    };
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
    "/token-boosts/top/v1": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get the tokens with most active boosts (rate-limit 60 requests per minute) */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Ok */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["BoostsResponse"];
                    };
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
    "/orders/v1/{chainId}/{tokenAddress}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Check paid orders for a token (rate-limit 60 requests per minute) */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @example solana */
                    chainId: string;
                    /** @example A55XjvzRU4KtR3Lrys8PpLZQvPojPqvnv5bJVHMYy3Jv */
                    tokenAddress: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Ok */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["OrdersResponse"];
                    };
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
    "/latest/dex/pairs/{chainId}/{pairId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get one or multiple pairs by chain and pair address (rate-limit 300 requests per minute) */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @example solana */
                    chainId: string;
                    /** @example JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN */
                    pairId: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Ok */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["PairsResponse"];
                    };
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
    "/tokens/v1/{chainId}/{tokenAddresses}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get one or multiple pairs by token address (rate-limit 300 requests per minute) */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @example solana */
                    chainId: string;
                    tokenAddresses: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Ok */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["TokensResponse"];
                    };
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
    "/token-pairs/v1/{chainId}/{tokenAddress}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get the pools of a given token address (rate-limit 300 requests per minute) */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    chainId: string;
                    tokenAddress: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Ok */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["TokensPairsResponse"];
                    };
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
    "/latest/dex/search": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Search for pairs matching query (rate-limit 300 requests per minute) */
        get: {
            parameters: {
                query: {
                    /** @example SOL/USDC */
                    q: string;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Ok */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["SearchResponse"];
                    };
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
        TokenProfile: {
            /** Format: uri */
            url?: string;
            chainId?: string;
            tokenAddress?: string;
            /** Format: uri */
            icon?: string;
            /** Format: uri */
            header?: string | null;
            description?: string | null;
            links?: {
                type?: string | null;
                label?: string | null;
                /** Format: uri */
                url?: string;
            }[] | null;
        };
        BoostsResponse: {
            /** Format: uri */
            url?: string;
            chainId?: string;
            tokenAddress?: string;
            amount?: number;
            totalAmount?: number;
            /** Format: uri */
            icon?: string | null;
            /** Format: uri */
            header?: string | null;
            description?: string | null;
            links?: {
                type?: string | null;
                label?: string | null;
                /** Format: uri */
                url?: string;
            }[] | null;
        };
        OrdersResponse: {
            /** @enum {string} */
            type?: "tokenProfile" | "communityTakeover" | "tokenAd" | "trendingBarAd";
            /** @enum {string} */
            status?: "processing" | "cancelled" | "on-hold" | "approved" | "rejected";
            paymentTimestamp?: number;
        }[];
        PairsResponse: {
            schemaVersion?: string;
            pairs?: components["schemas"]["Pair"][] | null;
        };
        TokensResponse: components["schemas"]["Pair"][];
        TokensPairsResponse: components["schemas"]["Pair"][];
        SearchResponse: {
            schemaVersion?: string;
            pairs?: components["schemas"]["Pair"][];
        };
        CommunityTakeoverResponse: components["schemas"]["CommunityTakeover"][];
        CommunityTakeover: {
            /** Format: uri */
            url?: string;
            chainId?: string;
            tokenAddress?: string;
            /** Format: uri */
            icon?: string;
            /** Format: uri */
            header?: string | null;
            description?: string | null;
            links?: {
                type?: string | null;
                label?: string | null;
                /** Format: uri */
                url?: string;
            }[] | null;
            /** Format: date-time */
            claimDate?: string;
        };
        AdsResponse: components["schemas"]["Ad"][];
        Ad: {
            /** Format: uri */
            url?: string;
            chainId?: string;
            tokenAddress?: string;
            /** Format: date-time */
            date?: string;
            type?: string;
            durationHours?: number | null;
            impressions?: number | null;
        };
        Pair: {
            chainId?: string;
            dexId?: string;
            /** Format: uri */
            url?: string;
            pairAddress?: string;
            labels?: string[] | null;
            baseToken?: {
                address?: string;
                name?: string;
                symbol?: string;
            };
            quoteToken?: {
                address?: string | null;
                name?: string | null;
                symbol?: string | null;
            };
            priceNative?: string;
            priceUsd?: string | null;
            txns?: {
                [key: string]: {
                    buys?: number;
                    sells?: number;
                };
            };
            volume?: {
                [key: string]: number;
            };
            priceChange?: {
                [key: string]: number;
            } | null;
            liquidity?: {
                usd?: number | null;
                base?: number;
                quote?: number;
            } | null;
            fdv?: number | null;
            marketCap?: number | null;
            pairCreatedAt?: number | null;
            info?: {
                /** Format: uri */
                imageUrl?: string | null;
                websites?: {
                    /** Format: uri */
                    url?: string;
                }[] | null;
                socials?: {
                    platform?: string;
                    handle?: string;
                }[] | null;
            };
            boosts?: {
                active?: number;
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
