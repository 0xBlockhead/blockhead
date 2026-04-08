export interface paths {
    "/protocols": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List all protocols on defillama along with their tvl */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Array of all protocols with their TVL data */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @example 2269 */
                            id?: string;
                            /** @example Aave */
                            name?: string;
                            /** @example AAVE */
                            symbol?: string;
                            /** @example Lending */
                            category?: string;
                            /**
                             * @example [
                             *       "Ethereum",
                             *       "Polygon"
                             *     ]
                             */
                            chains?: string[];
                            /** @example 5200000000 */
                            tvl?: number;
                            /**
                             * @example {
                             *       "Ethereum": 3200000000,
                             *       "Polygon": 2000000000
                             *     }
                             */
                            chainTvls?: {
                                [key: string]: number;
                            };
                            /** @example 2.1 */
                            change_1d?: number;
                            /** @example -5.3 */
                            change_7d?: number;
                        }[];
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
    "/protocol/{protocol}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get historical TVL of a protocol and breakdowns by token and chain */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description protocol slug */
                    protocol: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Protocol details with historical TVL data and chain breakdowns */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @example parent#aave */
                            id?: string;
                            /** @example AAVE */
                            name?: string;
                            /** @example AAVE */
                            symbol?: string;
                            /** @example Lending */
                            category?: string;
                            /**
                             * @example [
                             *       "Ethereum",
                             *       "Polygon",
                             *       "Avalanche"
                             *     ]
                             */
                            chains?: string[];
                            /**
                             * @example {
                             *       "Ethereum": 3200000000,
                             *       "Polygon": 1500000000
                             *     }
                             */
                            currentChainTvls?: {
                                [key: string]: number;
                            };
                            chainTvls?: {
                                [key: string]: {
                                    tvl?: {
                                        /** @example 1609459200 */
                                        date?: number;
                                        /** @example 1000000 */
                                        totalLiquidityUSD?: number;
                                    }[];
                                    tokens?: {
                                        /** @example 1609459200 */
                                        date?: number;
                                        /**
                                         * @example {
                                         *       "USDC": 1000000,
                                         *       "USDT": 800000
                                         *     }
                                         */
                                        tokens?: {
                                            [key: string]: number;
                                        };
                                    }[];
                                };
                            };
                        };
                    };
                };
                /** @description Protocol not found */
                404: {
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
    "/v2/historicalChainTvl": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get historical TVL (excludes liquid staking and double counted tvl) of DeFi on all chains */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Historical TVL data for all chains combined */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /**
                             * @description Unix timestamp
                             * @example 1609459200
                             */
                            date?: number;
                            /**
                             * @description Total Value Locked in USD across all chains
                             * @example 15000000000
                             */
                            tvl?: number;
                        }[];
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
    "/v2/historicalChainTvl/{chain}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get historical TVL (excludes liquid staking and double counted tvl) of a chain */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description chain slug, you can get these from /chains or the chains property on /protocols */
                    chain: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Historical TVL data for the specified chain */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /**
                             * @description Unix timestamp
                             * @example 1609459200
                             */
                            date?: number;
                            /**
                             * @description Total Value Locked in USD for this chain
                             * @example 45000000000
                             */
                            tvl?: number;
                        }[];
                    };
                };
                /** @description Chain not found */
                404: {
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
    "/tvl/{protocol}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Simplified endpoint to get current TVL of a protocol
         * @description Simplified endpoint that only returns a number, the current TVL of a protocol
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description protocol slug */
                    protocol: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Current TVL of the protocol in USD */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": number;
                    };
                };
                /** @description Protocol not found */
                404: {
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
    "/v2/chains": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get current TVL of all chains */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Array of all chains with their TVL data */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /**
                             * @description CoinGecko ID for the chain's native token
                             * @example ethereum
                             */
                            gecko_id?: string | null;
                            /**
                             * @description Total Value Locked in USD
                             * @example 65998652431.40251
                             */
                            tvl?: number;
                            /**
                             * @description Native token symbol
                             * @example ETH
                             */
                            tokenSymbol?: string | null;
                            /**
                             * @description CoinMarketCap ID
                             * @example 1027
                             */
                            cmcId?: string | null;
                            /**
                             * @description Chain name
                             * @example Ethereum
                             */
                            name?: string;
                            /**
                             * @description Chain ID number
                             * @example 1
                             */
                            chainId?: number | null;
                        }[];
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
    "/prices/current/{coins}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get current prices of tokens by contract address
         * @description The goal of this API is to price as many tokens as possible, including exotic ones that never get traded, which makes them impossible to price by looking at markets.
         *
         *     The base of our data are prices pulled from coingecko, which is then extended through multiple means:
         *     - We price all bridged tokens by using the price of the token in it's original chain, so we fetch all bridged versions of USDC on arbitrum, fantom, avax... and price all them using the price for the token on Ethereum, which we know. Right now we support 10 different bridging protocols.
         *     - We have multiple adapters to price specialized sets of tokens by running custom code:
         *       - We price yearn's yToken LPs by checking how much underlying token can be withdrawn for each LP
         *       - Aave, compound and euler LP tokens are also priced based on their relationship against underlying tokens
         *       - Uniswap, curve, balancer and stargate LPs are priced using the underlying tokens in each pair
         *       - GMX's GLP token is priced based on the value of tokens given on withdrawal (which includes calculations based on trader's PnL)
         *
         *       - Synthetix tokens are priced using forex prices of the coin they are pegged to
         *     - For tokens that we haven't been able to price in any other way, we find the pool with most liquidity for each on uniswap, curve and serum and then use the prices provided on those exchanges.
         *
         *       Unlike all the other tokens, we can't confirm that these prices are correct, so we only ingest the ones that have sufficient liquidity and, even in that case, we attach a `confidence` value to them that is related to the depth of liquidity and which represents our confidence in the quality of each price. API consumers can choose to filter out prices with low confidence values.
         *
         *      Our API server is fully open source and we are constantly adding more pricing adapters, extending the amount of tokens we support.
         *
         *     Tokens are queried using {chain}:{address}, where chain is an identifier such as ethereum, bsc, polygon, avax... You can also get tokens by coingecko id by setting `coingecko` as the chain, eg: coingecko:ethereum, coingecko:bitcoin. Examples:
         *       - ethereum:0xdF574c24545E5FfEcb9a659c229253D4111d87e1
         *       - bsc:0x762539b45a1dcce3d36d080f74d1aed37844b878
         *       - coingecko:ethereum
         *       - arbitrum:0x4277f8f2c384827b5273592ff7cebd9f2c1ac258
         */
        get: {
            parameters: {
                query?: {
                    /** @description time range on either side to find price data, defaults to 6 hours */
                    searchWidth?: string;
                };
                header?: never;
                path: {
                    /** @description set of comma-separated tokens defined as {chain}:{address} */
                    coins: string;
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
                        "application/json": {
                            coins?: {
                                "ethereum:0xdF574c24545E5FfEcb9a659c229253D4111d87e1"?: {
                                    /** @example 8 */
                                    decimals?: number;
                                    /** @example 0.022053735051098835 */
                                    price?: number;
                                    /** @example cDAI */
                                    symbol?: string;
                                    /** @example 0.99 */
                                    timestamp?: number;
                                };
                            };
                        };
                    };
                };
                /** @description Internal error */
                502: {
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
    "/prices/historical/{timestamp}/{coins}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get historical prices of tokens by contract address
         * @description See /prices/current for explanation on how prices are sourced.
         */
        get: {
            parameters: {
                query?: {
                    /** @description time range on either side to find price data, defaults to 6 hours */
                    searchWidth?: string;
                };
                header?: never;
                path: {
                    /** @description set of comma-separated tokens defined as {chain}:{address} */
                    coins: string;
                    /** @description UNIX timestamp of time when you want historical prices */
                    timestamp: number;
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
                        "application/json": {
                            coins?: {
                                "ethereum:0xdF574c24545E5FfEcb9a659c229253D4111d87e1"?: {
                                    /** @example 8 */
                                    decimals?: number;
                                    /** @example 0.022053735051098835 */
                                    price?: number;
                                    /** @example cDAI */
                                    symbol?: string;
                                    /** @example 1648680149 */
                                    timestamp?: number;
                                };
                            };
                        };
                    };
                };
                /** @description Internal error */
                502: {
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
    "/batchHistorical": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get historical prices for multiple tokens at multiple different timestamps
         * @description Strings accepted by period and searchWidth:
         *     Can use regular chart candle notion like ‘4h’ etc where:
         *     W = week, D = day, H = hour, M = minute (not case sensitive)
         */
        get: {
            parameters: {
                query: {
                    /** @description object where keys are coins in the form {chain}:{address}, and values are arrays of requested timestamps */
                    coins: string;
                    /** @description time range on either side to find price data, defaults to 6 hours */
                    searchWidth?: string;
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
                        "application/json": {
                            coins?: {
                                "avax:0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e"?: {
                                    /** @example USDC */
                                    symbol?: string;
                                    prices?: {
                                        /** @example 1666876674 */
                                        timestamp?: number;
                                        /** @example 0.999436 */
                                        price?: number;
                                        /** @example 0.99 */
                                        confidence?: number;
                                    }[];
                                };
                            };
                        };
                    };
                };
                /** @description Internal error */
                502: {
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
    "/chart/{coins}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get token prices at regular time intervals
         * @description Strings accepted by period and searchWidth:
         *     Can use regular chart candle notion like ‘4h’ etc where:
         *     W = week, D = day, H = hour, M = minute (not case sensitive)
         */
        get: {
            parameters: {
                query?: {
                    /** @description unix timestamp of earliest data point requested */
                    start?: number;
                    /** @description unix timestamp of latest data point requested */
                    end?: number;
                    /** @description number of data points returned, defaults to 0 */
                    span?: number;
                    /** @description duration between data points, defaults to 24 hours */
                    period?: string;
                    /** @description time range on either side to find price data, defaults to 10% of period */
                    searchWidth?: string;
                };
                header?: never;
                path: {
                    /** @description set of comma-separated tokens defined as {chain}:{address} */
                    coins: string;
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
                        "application/json": {
                            coins?: {
                                "ethereum:0xdF574c24545E5FfEcb9a659c229253D4111d87e1"?: {
                                    /** @example 8 */
                                    decimals?: number;
                                    /** @example 0.99 */
                                    confidence?: number;
                                    prices?: {
                                        /** @example 1666790570 */
                                        timestamp?: number;
                                        /** @example 0.984519 */
                                        price?: number;
                                    }[];
                                    /** @example HUSD */
                                    symbol?: string;
                                };
                            };
                        };
                    };
                };
                /** @description Internal error */
                502: {
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
    "/percentage/{coins}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get percentage change in price over time
         * @description Strings accepted by period:
         *     Can use regular chart candle notion like ‘4h’ etc where:
         *     W = week, D = day, H = hour, M = minute (not case sensitive)
         */
        get: {
            parameters: {
                query?: {
                    /** @description timestamp of data point requested, defaults to time now */
                    timestamp?: number;
                    /** @description whether you want the duration after your given timestamp or not, defaults to false (looking back) */
                    lookForward?: boolean;
                    /** @description duration between data points, defaults to 24 hours */
                    period?: string;
                };
                header?: never;
                path: {
                    /** @description set of comma-separated tokens defined as {chain}:{address} */
                    coins: string;
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
                        "application/json": {
                            coins?: {
                                /** @example -2.3009954568977147 */
                                "ethereum:0xdF574c24545E5FfEcb9a659c229253D4111d87e1"?: number;
                            };
                        };
                    };
                };
                /** @description Internal error */
                502: {
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
    "/prices/first/{coins}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get earliest timestamp price record for coins */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description set of comma-separated tokens defined as {chain}:{address} */
                    coins: string;
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
                        "application/json": {
                            coins?: {
                                "ethereum:0xdF574c24545E5FfEcb9a659c229253D4111d87e1"?: {
                                    /** @example 0.9992047673109988 */
                                    price?: number;
                                    /** @example HUSD */
                                    symbol?: string;
                                    /** @example 1568883821 */
                                    timestamp?: number;
                                };
                            };
                        };
                    };
                };
                /** @description Internal error */
                502: {
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
    "/block/{chain}/{timestamp}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get the closest block to a timestamp
         * @description Runs binary search over a blockchain's blocks to get the closest one to a timestamp.
         *     Every time this is run we add new data to our database, so each query permanently speeds up future queries.
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description Chain which you want to get the block from */
                    chain: string;
                    /** @description UNIX timestamp of the block you are searching for */
                    timestamp: number;
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
                        "application/json": {
                            /**
                             * Format: uint
                             * @example 11150916
                             */
                            height?: number;
                            /**
                             * Format: uint
                             * @example 1603964988
                             */
                            timestamp?: number;
                        };
                    };
                };
                /** @description Invalid chain or timestamp provided */
                400: {
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
    "/stablecoins": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List all stablecoins along with their circulating amounts */
        get: {
            parameters: {
                query?: {
                    /** @description set whether to include current stablecoin prices */
                    includePrices?: boolean;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Array of all stablecoins with their circulation data */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            peggedAssets?: {
                                /** @example 1 */
                                id?: string;
                                /** @example Tether */
                                name?: string;
                                /** @example USDT */
                                symbol?: string;
                                /** @example peggedUSD */
                                pegType?: string;
                                /** @example fiat-backed */
                                pegMechanism?: string;
                                circulating?: {
                                    /** @example 159510682147.76874 */
                                    peggedUSD?: number;
                                };
                                /**
                                 * @example [
                                 *       "Ethereum",
                                 *       "Tron",
                                 *       "BSC"
                                 *     ]
                                 */
                                chains?: string[];
                                chainCirculating?: {
                                    [key: string]: {
                                        current?: {
                                            /** @example 50000000000 */
                                            peggedUSD?: number;
                                        };
                                    };
                                };
                                /** @example 1.001 */
                                price?: number;
                            }[];
                        };
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
    "/stablecoincharts/all": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get historical mcap sum of all stablecoins */
        get: {
            parameters: {
                query?: {
                    /** @description stablecoin ID, you can get these from /stablecoins */
                    stablecoin?: number;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Historical market cap data for all stablecoins */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @example 1609459200 */
                            date?: number;
                            totalCirculating?: {
                                /** @example 45000000000 */
                                peggedUSD?: number;
                            };
                        }[];
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
    "/stablecoincharts/{chain}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get historical mcap sum of all stablecoins in a chain */
        get: {
            parameters: {
                query?: {
                    /** @description stablecoin ID, you can get these from /stablecoins */
                    stablecoin?: number;
                };
                header?: never;
                path: {
                    /** @description chain slug, you can get these from /chains or the chains property on /protocols */
                    chain: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Historical market cap data for stablecoins on specified chain */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @example 1609459200 */
                            date?: number;
                            totalCirculating?: {
                                /** @example 12000000000 */
                                peggedUSD?: number;
                            };
                        }[];
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
    "/stablecoin/{asset}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get historical mcap and historical chain distribution of a stablecoin */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description stablecoin ID, you can get these from /stablecoins */
                    asset: number;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Historical market cap and chain distribution for specific stablecoin */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @example 1 */
                            id?: string;
                            /** @example Tether */
                            name?: string;
                            /** @example USDT */
                            symbol?: string;
                            totalCirculating?: {
                                /** @example 1609459200 */
                                date?: number;
                                /** @example 50000000000 */
                                totalCirculating?: number;
                            }[];
                            chainCirculating?: {
                                [key: string]: {
                                    /** @example 1609459200 */
                                    date?: number;
                                    /** @example 20000000000 */
                                    circulating?: number;
                                }[];
                            };
                        };
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
    "/stablecoinchains": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get current mcap sum of all stablecoins on each chain */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Current market cap of stablecoins by chain */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @example Ethereum */
                            name?: string;
                            totalCirculating?: {
                                /** @example 75000000000 */
                                peggedUSD?: number;
                            };
                        }[];
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
    "/stablecoinprices": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get historical prices of all stablecoins */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Historical prices for all stablecoins */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @example 1609459200 */
                            date?: number;
                            /**
                             * @example {
                             *       "USDT": 1.001,
                             *       "USDC": 0.999,
                             *       "DAI": 1.002
                             *     }
                             */
                            prices?: {
                                [key: string]: number;
                            };
                        }[];
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
    "/pools": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Retrieve the latest data for all pools, including enriched information such as predictions */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Array of all yield farming pools with their data */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @example success */
                            status?: string;
                            data?: {
                                /** @example Ethereum */
                                chain?: string;
                                /** @example lido */
                                project?: string;
                                /** @example STETH */
                                symbol?: string;
                                /** @example 32493036117 */
                                tvlUsd?: number;
                                /** @example 2.84 */
                                apyBase?: number;
                                /** @example null */
                                apyReward?: number | null;
                                /** @example 2.84 */
                                apy?: number;
                                /** @example null */
                                rewardTokens?: string[] | null;
                                /** @example 747c1d2a-c668-4682-b9f9-296708a3dd90 */
                                pool?: string;
                                /** @example -0.04 */
                                apyPct1D?: number;
                                /** @example -0.056 */
                                apyPct7D?: number;
                                /** @example null */
                                apyPct30D?: number | null;
                                /** @example false */
                                stablecoin?: boolean;
                                /** @example no */
                                ilRisk?: string;
                                /** @example single */
                                exposure?: string;
                                predictions?: {
                                    /** @example Stable/Up */
                                    predictedClass?: string;
                                    /** @example 74 */
                                    predictedProbability?: number;
                                    /** @example 2 */
                                    binnedConfidence?: number;
                                };
                                /** @example null */
                                poolMeta?: string | null;
                                /** @example 3.7747 */
                                mu?: number;
                                /** @example 0.05236 */
                                sigma?: number;
                                /** @example 1141 */
                                count?: number;
                                /** @example false */
                                outlier?: boolean;
                                /**
                                 * @example [
                                 *       "0x0000000000000000000000000000000000000000"
                                 *     ]
                                 */
                                underlyingTokens?: string[];
                                /** @example null */
                                il7d?: number | null;
                                /** @example null */
                                apyBase7d?: number | null;
                                /** @example 2.73539 */
                                apyMean30d?: number;
                                /** @example null */
                                volumeUsd1d?: number | null;
                                /** @example null */
                                volumeUsd7d?: number | null;
                                /** @example null */
                                apyBaseInception?: number | null;
                            }[];
                        };
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
    "/chart/{pool}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get historical APY and TVL of a pool */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description pool id, can be retrieved from /pools (property is called pool) */
                    pool: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Historical APY and TVL data for specified pool */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @example success */
                            status?: string;
                            data?: {
                                /** @example 2024-01-01T00:00:00.000Z */
                                timestamp?: string;
                                /** @example 1500000000 */
                                tvlUsd?: number;
                                /** @example 5.2 */
                                apy?: number;
                                /** @example 3.1 */
                                apyBase?: number;
                                /** @example 2.1 */
                                apyReward?: number;
                            }[];
                        };
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
    "/overview/dexs": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List all dexs along with summaries of their volumes and dataType history data */
        get: {
            parameters: {
                query: {
                    /** @description true to exclude aggregated chart from response */
                    excludeTotalDataChart: boolean;
                    /** @description true to exclude broken down chart from response */
                    excludeTotalDataChartBreakdown: boolean;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Overview of all DEXs with volume data */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            protocols?: {
                                /** @example Uniswap */
                                name?: string;
                                /** @example Uniswap V3 */
                                displayName?: string;
                                /** @example 1500000000 */
                                total24h?: number;
                                /** @example 10000000000 */
                                total7d?: number;
                                /** @example 5.2 */
                                change_1d?: number;
                                /** @example -2.1 */
                                change_7d?: number;
                                /**
                                 * @example [
                                 *       "Ethereum",
                                 *       "Polygon"
                                 *     ]
                                 */
                                chains?: string[];
                            }[];
                            totalDataChart?: (number | Record<string, never>)[][];
                            /**
                             * @example [
                             *       "Ethereum",
                             *       "BSC",
                             *       "Polygon"
                             *     ]
                             */
                            allChains?: string[];
                        };
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
    "/overview/dexs/{chain}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List all dexs along with summaries of their volumes and dataType history data filtering by chain */
        get: {
            parameters: {
                query: {
                    /** @description true to exclude aggregated chart from response */
                    excludeTotalDataChart: boolean;
                    /** @description true to exclude broken down chart from response */
                    excludeTotalDataChartBreakdown: boolean;
                };
                header?: never;
                path: {
                    /** @description chain name, list of all supported chains can be found under allChains attribute in /overview/dexs response */
                    chain: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Overview of DEXs on specified chain with volume data */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            protocols?: {
                                /** @example Uniswap */
                                name?: string;
                                /** @example 800000000 */
                                total24h?: number;
                                /** @example 3.2 */
                                change_1d?: number;
                            }[];
                            totalDataChart?: unknown[][];
                        };
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
    "/summary/dexs/{protocol}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get summary of dex volume with historical data */
        get: {
            parameters: {
                query: {
                    /** @description true to exclude aggregated chart from response */
                    excludeTotalDataChart: boolean;
                    /** @description true to exclude broken down chart from response */
                    excludeTotalDataChartBreakdown: boolean;
                };
                header?: never;
                path: {
                    /** @description protocol slug */
                    protocol: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description DEX protocol volume summary with historical data */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @example Uniswap */
                            name?: string;
                            /** @example 1500000000 */
                            total24h?: number;
                            /** @example 500000000000 */
                            totalAllTime?: number;
                            totalDataChart?: unknown[][];
                            totalDataChartBreakdown?: unknown[][];
                            /**
                             * @example [
                             *       "Ethereum",
                             *       "Polygon"
                             *     ]
                             */
                            chains?: string[];
                        };
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
    "/overview/options": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List all options dexs along with summaries of their volumes and dataType history data */
        get: {
            parameters: {
                query: {
                    /** @description true to exclude aggregated chart from response */
                    excludeTotalDataChart: boolean;
                    /** @description true to exclude broken down chart from response */
                    excludeTotalDataChartBreakdown: boolean;
                    /** @description Desired data type, dailyNotionalVolume by default. */
                    dataType?: "dailyPremiumVolume" | "dailyNotionalVolume";
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Overview of all options DEXs with volume data */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            protocols?: {
                                /** @example Deribit */
                                name?: string;
                                /** @example 500000000 */
                                total24h?: number;
                                /** @example 8.5 */
                                change_1d?: number;
                            }[];
                            totalDataChart?: unknown[][];
                        };
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
    "/overview/options/{chain}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List all options dexs along with summaries of their volumes and dataType history data filtering by chain */
        get: {
            parameters: {
                query: {
                    /** @description true to exclude aggregated chart from response */
                    excludeTotalDataChart: boolean;
                    /** @description true to exclude broken down chart from response */
                    excludeTotalDataChartBreakdown: boolean;
                    /** @description Desired data type, dailyNotionalVolume by default. */
                    dataType?: "dailyPremiumVolume" | "dailyNotionalVolume";
                };
                header?: never;
                path: {
                    /** @description chain name, list of all supported chains can be found under allChains attribute in /overview/options response */
                    chain: string;
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
    "/summary/options/{protocol}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get summary of options dex volume with historical data */
        get: {
            parameters: {
                query?: {
                    /** @description Desired data type, dailyNotionalVolume by default. */
                    dataType?: "dailyPremiumVolume" | "dailyNotionalVolume";
                };
                header?: never;
                path: {
                    /** @description protocol slug */
                    protocol: string;
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
    "/overview/open-interest": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List all open interest dex exchanges along with summaries of their open interest */
        get: {
            parameters: {
                query: {
                    /** @description true to exclude aggregated chart from response */
                    excludeTotalDataChart: boolean;
                    /** @description true to exclude broken down chart from response */
                    excludeTotalDataChartBreakdown: boolean;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Overview of all open interest DEXs */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            protocols?: {
                                /** @example Hyperliquid Perps */
                                name?: string;
                                /** @example Hyperliquid Perps */
                                displayName?: string;
                                /** @example 14304709847 */
                                total24h?: number;
                                /** @example 93112774041 */
                                total7d?: number;
                                /** @example 3.62 */
                                change_1d?: number;
                                /** @example 12.63 */
                                change_7d?: number;
                                /**
                                 * @example [
                                 *       "Hyperliquid L1"
                                 *     ]
                                 */
                                chains?: string[];
                            }[];
                            totalDataChart?: (number | Record<string, never>)[][];
                            /**
                             * @example [
                             *       "Hyperliquid L1",
                             *       "Off Chain",
                             *       "zkLighter"
                             *     ]
                             */
                            allChains?: string[];
                        };
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
    "/overview/fees": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List all protocols along with summaries of their fees and revenue and dataType history data */
        get: {
            parameters: {
                query: {
                    /** @description true to exclude aggregated chart from response */
                    excludeTotalDataChart: boolean;
                    /** @description true to exclude broken down chart from response */
                    excludeTotalDataChartBreakdown: boolean;
                    /** @description Desired data type, dailyFees by default. */
                    dataType?: "dailyFees" | "dailyRevenue" | "dailyHoldersRevenue";
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Overview of all protocols with fees and revenue data */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            protocols?: {
                                /** @example Uniswap */
                                name?: string;
                                /** @example 5000000 */
                                total24h?: number;
                                /** @example 2000000 */
                                revenue24h?: number;
                                /** @example 12.5 */
                                change_1d?: number;
                                /**
                                 * @example [
                                 *       "Ethereum",
                                 *       "Polygon"
                                 *     ]
                                 */
                                chains?: string[];
                            }[];
                            totalDataChart?: unknown[][];
                            totalDataChartBreakdown?: unknown[][];
                        };
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
    "/overview/fees/{chain}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List all protocols along with summaries of their fees and revenue and dataType history data by chain */
        get: {
            parameters: {
                query: {
                    /** @description true to exclude aggregated chart from response */
                    excludeTotalDataChart: boolean;
                    /** @description true to exclude broken down chart from response */
                    excludeTotalDataChartBreakdown: boolean;
                    /** @description Desired data type, dailyFees by default. */
                    dataType?: "dailyFees" | "dailyRevenue" | "dailyHoldersRevenue";
                };
                header?: never;
                path: {
                    /** @description chain name, list of all supported chains can be found under allChains attribute in /overview/fees response */
                    chain: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Overview of all protocols with fees and revenue data */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            protocols?: {
                                /** @example Uniswap */
                                name?: string;
                                /** @example 5000000 */
                                total24h?: number;
                                /** @example 2000000 */
                                revenue24h?: number;
                                /** @example 12.5 */
                                change_1d?: number;
                                /**
                                 * @example [
                                 *       "Ethereum",
                                 *       "Polygon"
                                 *     ]
                                 */
                                chains?: string[];
                            }[];
                            totalDataChart?: unknown[][];
                            totalDataChartBreakdown?: unknown[][];
                        };
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
    "/summary/fees/{protocol}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get summary of protocol fees and revenue with historical data */
        get: {
            parameters: {
                query?: {
                    /** @description Desired data type, dailyFees by default. */
                    dataType?: "dailyFees" | "dailyRevenue" | "dailyHoldersRevenue";
                };
                header?: never;
                path: {
                    /** @description protocol slug */
                    protocol: string;
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
                        /**
                         * @example {
                         *       "id": "parent#hyperliquid",
                         *       "name": "Hyperliquid",
                         *       "url": "https://hyperliquid.xyz",
                         *       "referralUrl": "https://app.hyperliquid.xyz/join/DEFILLAMAO",
                         *       "description": "Hyperliquid is a decentralized perpetual exchange with best-in-class speed, liquidity, and price",
                         *       "logo": "https://icons.llama.fi/hyperliquid.png",
                         *       "gecko_id": "hyperliquid",
                         *       "cmcId": "32196",
                         *       "chains": [
                         *         "Hyperliquid L1"
                         *       ],
                         *       "twitter": "HyperliquidX",
                         *       "github": [
                         *         "hyperliquid-dex"
                         *       ],
                         *       "symbol": "HYPE",
                         *       "address": "hyperliquid:0x0d01dc56dcaaca66ad901c959b4011ec",
                         *       "childProtocols": [
                         *         {}
                         *       ],
                         *       "linkedProtocols": [
                         *         "Hyperliquid",
                         *         "Hyperliquid Spot Orderbook"
                         *       ],
                         *       "defillamaId": "parent#hyperliquid",
                         *       "disabled": null,
                         *       "displayName": "Hyperliquid",
                         *       "module": null,
                         *       "category": null,
                         *       "methodologyURL": null,
                         *       "methodology": null,
                         *       "forkedFrom": null,
                         *       "audits": null,
                         *       "audit_links": null,
                         *       "versionKey": null,
                         *       "governanceID": null,
                         *       "treasury": null,
                         *       "parentProtocol": null,
                         *       "previousNames": null,
                         *       "latestFetchIsOk": true,
                         *       "slug": "hyperliquid",
                         *       "protocolType": "protocol",
                         *       "total24h": 4890250,
                         *       "total48hto24h": 4550411,
                         *       "total7d": 26184696,
                         *       "totalAllTime": 499292857,
                         *       "change_1d": 7.47,
                         *       "totalDataChart": [
                         *         [
                         *           1734912000,
                         *           1472923
                         *         ]
                         *       ],
                         *       "totalDataChartBreakdown": [
                         *         [
                         *           1734912000,
                         *           {
                         *             "Hyperliquid L1": {
                         *               "Hyperliquid Spot Orderbook": 1472923
                         *             }
                         *           }
                         *         ]
                         *       ]
                         *     }
                         */
                        "application/json": {
                            /** @description Protocol ID */
                            id?: string;
                            /** @description Protocol name */
                            name?: string;
                            /** @description Protocol URL */
                            url?: string;
                            /** @description Referral URL */
                            referralUrl?: string;
                            /** @description Protocol description */
                            description?: string;
                            /** @description Protocol logo URL */
                            logo?: string;
                            /** @description CoinGecko ID */
                            gecko_id?: string;
                            /** @description CoinMarketCap ID */
                            cmcId?: string;
                            /** @description Supported chains */
                            chains?: string[];
                            /** @description Twitter handle */
                            twitter?: string;
                            /** @description GitHub repositories */
                            github?: string[];
                            /** @description Token symbol */
                            symbol?: string;
                            /** @description Protocol address */
                            address?: string;
                            /** @description Child protocols */
                            childProtocols?: Record<string, never>[];
                            /** @description Linked protocols */
                            linkedProtocols?: string[];
                            /** @description DefiLlama protocol ID */
                            defillamaId?: string;
                            /** @description Whether protocol is disabled */
                            disabled?: boolean | null;
                            /** @description Display name */
                            displayName?: string;
                            /** @description Module name */
                            module?: string | null;
                            /** @description Protocol category */
                            category?: string | null;
                            /** @description Methodology URL */
                            methodologyURL?: string | null;
                            /** @description Methodology details */
                            methodology?: Record<string, never> | null;
                            /** @description Forked from protocol */
                            forkedFrom?: string | null;
                            /** @description Audit information */
                            audits?: unknown[] | null;
                            /** @description Audit links */
                            audit_links?: unknown[] | null;
                            /** @description Version key */
                            versionKey?: string | null;
                            /** @description Governance ID */
                            governanceID?: string | null;
                            /** @description Treasury address */
                            treasury?: string | null;
                            /** @description Parent protocol */
                            parentProtocol?: string | null;
                            /** @description Previous names */
                            previousNames?: unknown[] | null;
                            /** @description Latest fetch status */
                            latestFetchIsOk?: boolean;
                            /** @description Protocol slug */
                            slug?: string;
                            /** @description Protocol type */
                            protocolType?: string;
                            /** @description 24 hour fees */
                            total24h?: number;
                            /** @description 48h to 24h fees */
                            total48hto24h?: number;
                            /** @description 7 day fees */
                            total7d?: number;
                            /** @description All time fees */
                            totalAllTime?: number;
                            /** @description 1 day change percentage */
                            change_1d?: number;
                            /** @description Total data chart with timestamps and fees */
                            totalDataChart?: [
                                number,
                                number
                            ][];
                            /** @description Total data chart breakdown by chain and protocol */
                            totalDataChartBreakdown?: [
                                number,
                                Record<string, never>
                            ][];
                        };
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
    schemas: never;
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export type operations = Record<string, never>;
