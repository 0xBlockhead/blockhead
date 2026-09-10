export interface paths {
    "/api/tokenProtocols/{symbol}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Lists the amount of a certain token within all protocols. Data for the Token Usage page */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description token slug */
                    symbol: string;
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
                            /** @example Portal */
                            name?: string;
                            /** @example Bridge */
                            category?: string;
                            /**
                             * @example {
                             *       "coingecko:tether-avalanche-bridged-usdt-e": 6485.2310529788765,
                             *       "coingecko:xcusdt": 45.514624238131,
                             *       "coingecko:layerzero-bridged-usdt-aptos": 7312.740629193999
                             *     }
                             */
                            amountUsd?: {
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
    "/api/inflows/{protocol}/{timestamp}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Lists the amount of inflows and outflows for a protocol at a given date */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description protocol slug */
                    protocol: string;
                    /** @description unix timestamp */
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
                            /** @example -160563462.23474675 */
                            outflows?: number;
                            oldTokens?: {
                                /** @example 1700005031 */
                                date?: number;
                                /**
                                 * @example {
                                 *       "POLYGONUSDC": 2800590.050521,
                                 *       "STMATIC": 5910852.971103674,
                                 *       "USDC.E": 213182.234023,
                                 *       "WETH": 138751.92261049704,
                                 *       "WSTETH": 21205.858768287606,
                                 *       "COMP": 899912.2484411557,
                                 *       "ARB": 5191395.55706979,
                                 *       "UNI": 3276947.8126982865,
                                 *       "WBTC": 15237.12702489,
                                 *       "WMATIC": 4316699.376111328,
                                 *       "USDBC": 1567657.999816,
                                 *       "GMX": 44027.42587184711,
                                 *       "CBETH": 10011.824096757742,
                                 *       "LINK": 2915041.329272804,
                                 *       "USDC": 27302168.767972,
                                 *       "MATICX": 5999572.681088426
                                 *     }
                                 */
                                tvl?: {
                                    [key: string]: number;
                                };
                            };
                            currentTokens?: {
                                /** @example 1752771743 */
                                date?: number;
                                /**
                                 * @example {
                                 *       "SKY": 1839111.3665808514,
                                 *       "WSUPEROETHB": 610.1258731272615,
                                 *       "RETH": 335.9162918778323,
                                 *       "WEETH": 21264.320107593303,
                                 *       "STMATIC": 43248.612454883136,
                                 *       "TETH": 7537.467077317422,
                                 *       "USDT": 23936602.852221,
                                 *       "USDC.E": 457484.93217,
                                 *       "USDS": 986286.7461886762,
                                 *       "FBTC": 7.88084468,
                                 *       "WUSDM": 9912.583708525639,
                                 *       "COMP": 199962.19982196926,
                                 *       "UNI": 748399.6623864435,
                                 *       "WRON": 48676.91287257022,
                                 *       "WBTC": 8346.44481716,
                                 *       "EZETH": 9378.908917279387,
                                 *       "SDEUSD": 4476349.521512799,
                                 *       "OSETH": 1751.011747340086,
                                 *       "USDT0": 4807642.14842,
                                 *       "LINK": 629790.4518594383,
                                 *       "DEUSD": 14779291.40757071,
                                 *       "MATICX": 239292.60540364735,
                                 *       "ETHX": 7.643953648e-9,
                                 *       "POLYGONUSDC": 1130561.097829,
                                 *       "OP": 474055.27558234957,
                                 *       "RSWETH": 0.7588296185577288,
                                 *       "SFRAX": 32550977.989188965,
                                 *       "METH": 1256.0286269578846,
                                 *       "WETH": 106772.79955793211,
                                 *       "WSTETH": 127030.77547884149,
                                 *       "ARB": 8082828.497277849,
                                 *       "RSETH": 13198.88264941232,
                                 *       "WMATIC": 1192273.6401273129,
                                 *       "GMX": 6408.6736121308695,
                                 *       "USDBC": 200217.562935,
                                 *       "CBETH": 2094.7317932368333,
                                 *       "USDE": 1660443.2086449957,
                                 *       "ETH": 657.5898609775202,
                                 *       "SUSDS": 2360827.122683512,
                                 *       "USDC": 67152880.13345899,
                                 *       "TBTC": 297.109236856541,
                                 *       "AXS": 156.95240126041227,
                                 *       "CBBTC": 722.70428829,
                                 *       "WRSETH": 208.78735872239974,
                                 *       "AERO": 3582072.5610455093
                                 *     }
                                 */
                                tvl?: {
                                    [key: string]: number;
                                };
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
    "/api/chainAssets": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get assets of all chains */
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
                        "application/json": {
                            chain?: {
                                canonical?: {
                                    /** @example 4482065428.82707789718257509123 */
                                    total?: string;
                                    /**
                                     * @example {
                                     *       "AGLD": "8.25709",
                                     *       "STPT": "263726.9847408758",
                                     *       "APU": "43899.14483171882",
                                     *       "CTX": "595333.6768847435",
                                     *       "APW": "37727.892544515686"
                                     *     }
                                     */
                                    breakdown?: {
                                        [key: string]: string;
                                    };
                                };
                                native?: {
                                    /** @example 10848868127.0093572327157505031494340578574406321858 */
                                    total?: string;
                                    /**
                                     * @example {
                                     *       "BENI": "1322294.3731837485",
                                     *       "ANIME": "10.7583162713828217314035397949084",
                                     *       "SACA": "114132.47631920826",
                                     *       "HOKK": "4966.3804669563400723148947324498025",
                                     *       "TOSHI": "91927630.6839119443580116994151258714"
                                     *     }
                                     */
                                    breakdown?: {
                                        [key: string]: string;
                                    };
                                };
                                thirdParty?: {
                                    /** @example 3182802062.49398527398560408906 */
                                    total?: string;
                                    /**
                                     * @example {
                                     *       "BRZ": "1810685.01887618296911",
                                     *       "BOBA": "0",
                                     *       "BURN": "0",
                                     *       "GGTK": "0.6545695",
                                     *       "GYFI": "2618437.7978"
                                     *     }
                                     */
                                    breakdown?: {
                                        [key: string]: string;
                                    };
                                };
                                total?: {
                                    /** @example 18513735618.330420403 */
                                    total?: string;
                                    /**
                                     * @example {
                                     *       "AGLD": "8.25709",
                                     *       "STPT": "263726.9847408758",
                                     *       "APU": "43899.14483171882",
                                     *       "CTX": "595333.6768847435",
                                     *       "APW": "37727.892544515686"
                                     *     }
                                     */
                                    breakdown?: {
                                        [key: string]: string;
                                    };
                                };
                            };
                            /** @example 1752843956 */
                            timestamp?: number;
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
    "/api/emissions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List of all tokens along with basic info for each */
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
                        "application/json": {
                            /** @example coingecko:whitebit */
                            token?: string;
                            /**
                             * @example [
                             *       "https://cdn.whitebit.com/wbt/whitepaper-en.pdf"
                             *     ]
                             */
                            sources?: string[];
                            /** @example 6143 */
                            protocolId?: string;
                            /** @example WhiteBIT */
                            name?: string;
                            /** @example 293500000 */
                            circSupply?: number;
                            /** @example 293500000 */
                            circSupply30d?: number;
                            /** @example 81500000 */
                            totalLocked?: number;
                            /** @example 375000000 */
                            maxSupply?: number;
                            /** @example whitebit */
                            gecko_id?: string;
                            events?: {
                                /** @example A cliff of {tokens[0]} tokens was unlocked from Funds 1 on {timestamp} */
                                description?: string;
                                /** @example 1659657600 */
                                timestamp?: number;
                                /**
                                 * @example [
                                 *       120000000
                                 *     ]
                                 */
                                noOfTokens?: number[];
                                /** @example noncirculating */
                                category?: string;
                                /** @example cliff */
                                unlockType?: string;
                            }[];
                            nextEvent?: {
                                /** @example 1773360001 */
                                date?: number;
                                /** @example 81500000 */
                                toUnlock?: number;
                            };
                            /** @example 0 */
                            unlocksPerDay?: number;
                            /** @example 6577845629.249915 */
                            mcap?: number;
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
    "/api/emission/{protocol}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Unlocks data for a given token/protocol. You can find a list of available slugs to query by querying /emissions and then extracting the key `gecko_id` */
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
                /** @description successful operation */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            body?: {
                                documentedData?: {
                                    data?: {
                                        /** @example Hyper Foundation Budget */
                                        label?: string;
                                        data?: {
                                            /** @example 1732838400 */
                                            timestamp?: number;
                                            /** @example 60000000 */
                                            unlocked?: number;
                                            /** @example 60000000 */
                                            rawEmission?: number;
                                            /** @example 0 */
                                            burned?: number;
                                        }[];
                                    }[];
                                    tokenAllocation?: {
                                        current?: {
                                            /** @example 16 */
                                            insiders?: number;
                                            /** @example 0.8 */
                                            noncirculating?: number;
                                            /** @example 0 */
                                            publicSale?: number;
                                            /** @example 82.5 */
                                            airdrop?: number;
                                            /** @example 0.7 */
                                            farming?: number;
                                        };
                                        final?: {
                                            /** @example 45.8 */
                                            insiders?: number;
                                            /** @example 0.5 */
                                            noncirculating?: number;
                                            /** @example 0 */
                                            publicSale?: number;
                                            /** @example 47.7 */
                                            airdrop?: number;
                                            /** @example 6 */
                                            farming?: number;
                                        };
                                        progress?: {
                                            /** @example 20.1 */
                                            insiders?: number;
                                            /** @example 100 */
                                            noncirculating?: number;
                                            /** @example 100 */
                                            publicSale?: number;
                                            /** @example 100 */
                                            airdrop?: number;
                                            /** @example 6.5 */
                                            farming?: number;
                                        };
                                    };
                                };
                                metadata?: {
                                    /**
                                     * @example [
                                     *       "The Community Rewards schedule has been linearly extrapolated using the rate of unlocks as of 4 March 2025.",
                                     *       "The remaining allocation, not shown on the chart, belongs to Community Rewards. It has been excluded here to avoid obscuring the remaining data.",
                                     *       "Most vesting schedules will complete between 2027–2028; some will continue after 2028. Here we have used an end date of end of 2027.",
                                     *       "Although the full allocations for Hyper Foundation Budget and Community Grants were unlocked at TGE it is unclear what their spend rate is."
                                     *     ]
                                     */
                                    notes?: string[];
                                    /** @example coingecko:hyperliquid */
                                    token?: string;
                                    /**
                                     * @example [
                                     *       "https://hyperfnd.medium.com/hype-genesis-1830a4dc2e3f"
                                     *     ]
                                     */
                                    sources?: string[];
                                    /**
                                     * @example [
                                     *       "4481",
                                     *       "5448",
                                     *       "5507",
                                     *       "5761"
                                     *     ]
                                     */
                                    protocolIds?: string[];
                                    /** @example 1000000000 */
                                    total?: number;
                                    /** @example hyperliquid */
                                    chain?: string;
                                    /** @example Hyperliquid */
                                    name?: string;
                                    /** @example hyperliquid */
                                    gecko_id?: string;
                                    /**
                                     * @example [
                                     *       "4481"
                                     *     ]
                                     */
                                    defillamaIds?: string[];
                                    categories?: {
                                        /**
                                         * @example [
                                         *       "Core Contributors",
                                         *       "Hyper Foundation Budget"
                                         *     ]
                                         */
                                        insiders?: string[];
                                        /**
                                         * @example [
                                         *       "Community Grants"
                                         *     ]
                                         */
                                        noncirculating?: string[];
                                        /**
                                         * @example [
                                         *       "HIP-2"
                                         *     ]
                                         */
                                        publicSale?: string[];
                                        /**
                                         * @example [
                                         *       "Genesis Distribution"
                                         *     ]
                                         */
                                        airdrop?: string[];
                                        /**
                                         * @example [
                                         *       "Community Rewards"
                                         *     ]
                                         */
                                        farming?: string[];
                                    };
                                    /** @example Bridge */
                                    protocolCategory?: string;
                                    /** @example Hyperliquid L1 */
                                    chainName?: string;
                                    /** @example 4481 */
                                    pId?: string;
                                };
                            };
                            /** @example 2025-07-18T13:30:56.000Z */
                            lastModified?: string;
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
    "/api/categories": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Overview of all categories accross all protocols */
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
                        "application/json": {
                            /**
                             * @example {
                             *       "1747440000": {
                             *         "Bridge": {
                             *           "tvl": 45997965191.323425,
                             *           "staking": 117946591.34734812,
                             *           "pool2": 4467.975298299099,
                             *           "doublecounted": 1259137973.0377812,
                             *           "borrowed": 714082.8186222482,
                             *           "offers": 0,
                             *           "vesting": 0.0009596433739281769
                             *         }
                             *       }
                             *     }
                             */
                            chart?: {
                                [key: string]: {
                                    [key: string]: {
                                        /** @example 45997965191.323425 */
                                        tvl?: number;
                                        /** @example 117946591.34734812 */
                                        staking?: number;
                                        /** @example 4467.975298299099 */
                                        pool2?: number;
                                        /** @example 1259137973.0377812 */
                                        doublecounted?: number;
                                        /** @example 714082.8186222482 */
                                        borrowed?: number;
                                        /** @example 0 */
                                        offers?: number;
                                        /** @example 0.0009596433739281769 */
                                        vesting?: number;
                                        /** @example 11142.746348986766 */
                                        treasury?: number;
                                        /** @example 20838772668.74201 */
                                        liquidstaking?: number;
                                        /** @example 24954437702.556156 */
                                        dcAndLsOverlap?: number;
                                    };
                                };
                            };
                            /**
                             * @example {
                             *       "Bridge": [
                             *         "WBTC",
                             *         "RenVM",
                             *         "The Tokenized Bitcoin",
                             *         "hBTC",
                             *         "Rhino.fi",
                             *         "Strudel Finance",
                             *         "Connext",
                             *         "Injective Bridge",
                             *         "pNetwork",
                             *         "Allbridge Classic",
                             *         "Multichain"
                             *       ],
                             *       "Risk Curators": [
                             *         "9Summits",
                             *         "Alphaping",
                             *         "Apostro",
                             *         "B.Protocol Curator",
                             *         "Block Analitica",
                             *         "Clearstar",
                             *         "Euler DAO",
                             *         "Fence Finance",
                             *         "Gauntlet",
                             *         "Hakutora",
                             *         "Hyperithm",
                             *         "K3 Capital",
                             *         "LlamaRisk",
                             *         "M11 Credit",
                             *         "MEV Capital",
                             *         "Ouroboros Capital",
                             *         "Re7 Labs",
                             *         "Relend Network",
                             *         "Steakhouse Financial",
                             *         "Tulipa Capital",
                             *         "Alterscope",
                             *         "Yearn Curating",
                             *         "CIAN Curating",
                             *         "Vault Bridge"
                             *       ],
                             *       "DAO Service Provider": [
                             *         "CreateDAO"
                             *       ]
                             *     }
                             */
                            categories?: {
                                [key: string]: string[];
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
    "/api/forks": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Overview of all forks accross all protocols */
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
                        "application/json": {
                            /**
                             * @example {
                             *       "1752624000": {
                             *         "Uniswap V2": {
                             *           "staking": 712008453.6943725,
                             *           "tvl": 2580053162.908216,
                             *           "pool2": 146782.46894897142,
                             *           "doublecounted": 3013724.782369083,
                             *           "borrowed": 925950.5791909688,
                             *           "vesting": 0.0033932788318303733
                             *         }
                             *       }
                             *     }
                             */
                            chart?: {
                                [key: string]: {
                                    [key: string]: {
                                        /** @example 712008453.6943725 */
                                        staking?: number;
                                        /** @example 2580053162.908216 */
                                        tvl?: number;
                                        /** @example 146782.46894897142 */
                                        pool2?: number;
                                        /** @example 3013724.782369083 */
                                        doublecounted?: number;
                                        /** @example 925950.5791909688 */
                                        borrowed?: number;
                                        /** @example 0.0033932788318303733 */
                                        vesting?: number;
                                        /** @example 1184348.1365500058 */
                                        liquidstaking?: number;
                                        /** @example 1184348.1365500058 */
                                        dcAndLsOverlap?: number;
                                    };
                                };
                            };
                            /**
                             * @example {
                             *       "Uniswap V2": [
                             *         "SushiSwap",
                             *         "Varen",
                             *         "PancakeSwap AMM",
                             *         "Defi Swap",
                             *         "Energiswap",
                             *         "Pangolin",
                             *         "Cometh",
                             *         "Honeyswap",
                             *         "0.exchange",
                             *         "YetiSwap",
                             *         "Swapr V2",
                             *         "Lydia",
                             *         "Levinswap",
                             *         "SpookySwap V2",
                             *         "Quickswap Dex",
                             *         "SpiritSwap AMM",
                             *         "ViperSwap",
                             *         "HyperJump",
                             *         "Dfyn Network",
                             *         "Unicly"
                             *       ]
                             *     }
                             */
                            forks?: {
                                [key: string]: string[];
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
    "/api/oracles": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Overview of all oracles accross all protocols */
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
                        "application/json": {
                            /**
                             * @example {
                             *       "1752624000": {
                             *         "Chainlink": {
                             *           "tvl": 48896114862.57202,
                             *           "staking": 1564643922.8114228,
                             *           "pool2": 107245076.47312777,
                             *           "borrowed": 25132031822.258495,
                             *           "treasury": 52.078623852211784,
                             *           "vesting": 3347.9893057455306
                             *         }
                             *       }
                             *     }
                             */
                            chart?: {
                                [key: string]: {
                                    [key: string]: {
                                        /** @example 48896114862.57202 */
                                        tvl?: number;
                                        /** @example 1564643922.8114228 */
                                        staking?: number;
                                        /** @example 107245076.47312777 */
                                        pool2?: number;
                                        /** @example 25132031822.258495 */
                                        borrowed?: number;
                                        /** @example 52.078623852211784 */
                                        treasury?: number;
                                        /** @example 3347.9893057455306 */
                                        vesting?: number;
                                    };
                                };
                            };
                            /**
                             * @example {
                             *       "Chainlink": [
                             *         "AAVE V2",
                             *         "Compound V2",
                             *         "Synthetix v1+v2",
                             *         "CREAM Lending"
                             *       ]
                             *     }
                             */
                            oracles?: {
                                [key: string]: string[];
                            };
                            /**
                             * @example {
                             *       "Chainlink": [
                             *         "Ethereum",
                             *         "Arbitrum",
                             *         "BSC",
                             *         "Avalanche",
                             *         "Base",
                             *         "Solana",
                             *         "Polygon",
                             *         "OP Mainnet",
                             *         "Linea"
                             *       ]
                             *     }
                             */
                            chainsByOracle?: {
                                [key: string]: string[];
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
    "/api/hacks": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Overview of all hacks on our Hacks dashboard */
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
                        "application/json": {
                            /** @example 1711065600 */
                            date?: number;
                            /** @example Super Sushi Samurai */
                            name?: string;
                            /** @example Protocol Logic */
                            classification?: string;
                            /** @example Infinite Mint and Dump */
                            technique?: string;
                            /** @example 4800000 */
                            amount?: number;
                            /**
                             * @example [
                             *       "Blast"
                             *     ]
                             */
                            chain?: string[];
                            /** @example false */
                            bridgeHack?: boolean;
                            /** @example Gaming */
                            targetType?: string;
                            /** @example https://rekt.news/sss-rekt/ */
                            source?: string;
                            /** @example null */
                            returnedFunds?: number | null;
                            /** @example null */
                            defillamaId?: number | null;
                            /** @example Solidity */
                            language?: string | null;
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
    "/api/raises": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Overview of all raises on our Raises dashboard */
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
                        "application/json": {
                            raises?: {
                                /** @example 1740528000 */
                                date?: number;
                                /** @example Ethena Labs */
                                name?: string;
                                /** @example Strategic */
                                round?: string;
                                /** @example 16 */
                                amount?: number;
                                /**
                                 * @example [
                                 *       "Ethereum"
                                 *     ]
                                 */
                                chains?: string[];
                                /** @example Ethena is a synthetic dollar protocol built on Ethereum */
                                sector?: string;
                                /** @example DeFi */
                                category?: string;
                                /** @example DeFi & CeFi */
                                categoryGroup?: string;
                                /** @example https://www.benzinga.com/pressreleases/25/02/g43966782/mexc-invests-20-million-in-usde-to-drive-stablecoin-adoption-launches-1-000-000-reward-event */
                                source?: string;
                                /**
                                 * @example [
                                 *       "MEXC Ventures"
                                 *     ]
                                 */
                                leadInvestors?: string[];
                                /** @example [] */
                                otherInvestors?: string[];
                                /** @example null */
                                valuation?: number | null;
                                /** @example parent#ethena */
                                defillamaId?: string;
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
    "/api/treasuries": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List all protocols on our Treasuries dashboard */
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
                        "application/json": {
                            /** @example 6355-treasury */
                            id?: string;
                            /** @example SharpLink Gaming (treasury) */
                            name?: string;
                            /** @example null */
                            address?: string | null;
                            /** @example - */
                            symbol?: string;
                            /** @example https://www.sharplink.com/ */
                            url?: string;
                            /** @example SharpLink is one of the first Nasdaq-listed companies to develop a treasury strategy centered on ETH */
                            description?: string;
                            /** @example Ethereum */
                            chain?: string;
                            /** @example https://icons.llama.fi/sharplink-gaming.jpg */
                            logo?: string;
                            /** @example 0 */
                            audits?: string;
                            /** @example null */
                            audit_note?: string | null;
                            /** @example null */
                            gecko_id?: string | null;
                            /** @example null */
                            cmcId?: string | null;
                            /** @example Treasury Manager */
                            category?: string;
                            /**
                             * @example [
                             *       "Ethereum"
                             *     ]
                             */
                            chains?: string[];
                            /** @example treasury/sharplink-gaming.js */
                            module?: string;
                            /** @example sharplink-gaming.js */
                            treasury?: string;
                            /** @example [] */
                            forkedFromIds?: string[];
                            /** @example SharpLinkGaming */
                            twitter?: string;
                            /** @example sharplink-gaming-(treasury) */
                            slug?: string;
                            /** @example 976150507.157045 */
                            tvl?: number;
                            /**
                             * @example {
                             *       "Ethereum": 976150507.157045
                             *     }
                             */
                            chainTvls?: {
                                [key: string]: number;
                            };
                            /** @example -1.1231970563777622 */
                            change_1h?: number;
                            /** @example 15.845546813803097 */
                            change_1d?: number;
                            /** @example 75.57040101595928 */
                            change_7d?: number;
                            tokenBreakdowns?: {
                                /** @example 0 */
                                ownTokens?: number;
                                /** @example 0.003 */
                                stablecoins?: number;
                                /** @example 67481592.5634468 */
                                majors?: number;
                                /** @example 908668914.5905982 */
                                others?: number;
                            };
                            /** @example null */
                            mcap?: number | null;
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
    "/api/entities": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List all entities */
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
                        "application/json": {
                            /** @example entity-8 */
                            id?: string;
                            /** @example Blockchain Capital */
                            name?: string;
                            /** @example https://blockchain.capital */
                            url?: string;
                            /** @example Blockchain Capital is a leading venture firm in the blockchain industry. In the last 9 years we have made over 160 investments in companies and protocols in the sector, across different stages, geographies and asset types. */
                            description?: string;
                            /** @example https://icons.llama.fi/blockchain-capital.jpg */
                            logo?: string;
                            /** @example VC */
                            category?: string;
                            /** @example entities/blockchain-capital.js */
                            module?: string;
                            /** @example blockchaincap */
                            twitter?: string;
                            /** @example  */
                            symbol?: string;
                            /** @example Ethereum */
                            chain?: string;
                            /** @example null */
                            gecko_id?: string | null;
                            /** @example null */
                            cmcId?: string | null;
                            /**
                             * @example [
                             *       "Ethereum"
                             *     ]
                             */
                            chains?: string[];
                            /** @example blockchain-capital */
                            slug?: string;
                            /** @example 131402986.1539898 */
                            tvl?: number;
                            /**
                             * @example {
                             *       "Ethereum": 131402986.1539898
                             *     }
                             */
                            chainTvls?: {
                                [key: string]: number;
                            };
                            /** @example 0.5368786705972184 */
                            change_1h?: number;
                            /** @example 5.632604890674784 */
                            change_1d?: number;
                            /** @example 11.27548502629729 */
                            change_7d?: number;
                            tokenBreakdowns?: {
                                /** @example 0 */
                                ownTokens?: number;
                                /** @example 0.06493662312 */
                                stablecoins?: number;
                                /** @example 29628575.4114822 */
                                majors?: number;
                                /** @example 101774410.67757098 */
                                others?: number;
                            };
                            /** @example null */
                            mcap?: number | null;
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
    "/api/historicalLiquidity/{token}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Provides the name of contracts on a determined chain */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description token slug */
                    token: string;
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
    "/api/overview/derivatives": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Lists all derivatives along summaries of their volumes filtering by chain */
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
                /** @description successful operation */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "totalDataChart": [
                         *         [
                         *           1614211200,
                         *           24949
                         *         ],
                         *         [
                         *           1614297600,
                         *           103833
                         *         ],
                         *         [
                         *           1614384000,
                         *           49317
                         *         ]
                         *       ],
                         *       "totalDataChartBreakdown": [
                         *         [
                         *           1614211200,
                         *           {
                         *             "dYdX V3": 24949
                         *           }
                         *         ],
                         *         [
                         *           1614297600,
                         *           {
                         *             "dYdX V3": 103833
                         *           }
                         *         ]
                         *       ],
                         *       "breakdown24h": null,
                         *       "breakdown30d": null,
                         *       "chain": null,
                         *       "allChains": [
                         *         "Hyperliquid L1",
                         *         "Solana",
                         *         "Ethereum",
                         *         "Arbitrum"
                         *       ],
                         *       "total24h": 23537303133,
                         *       "total48hto24h": 20741840211,
                         *       "total7d": 125290755214,
                         *       "total14dto7d": 71055642206,
                         *       "total60dto30d": 397917690387,
                         *       "total30d": 383278222548,
                         *       "total1y": 3515064792266,
                         *       "change_1d": 13.48,
                         *       "change_7d": 40.49,
                         *       "change_1m": 35.06,
                         *       "change_7dover7d": 76.33,
                         *       "change_30dover30d": -3.68,
                         *       "total7DaysAgo": 16753244737,
                         *       "total30DaysAgo": 17427351125,
                         *       "totalAllTime": 6567303144819,
                         *       "protocols": [
                         *         {
                         *           "total24h": 8479946,
                         *           "total48hto24h": 3440780,
                         *           "total7d": 78424631,
                         *           "total14dto7d": 60033358,
                         *           "total60dto30d": 92505218,
                         *           "total30d": 166435382,
                         *           "total1y": 9698297388,
                         *           "totalAllTime": 55654843707,
                         *           "average1y": 26865089.717451524,
                         *           "change_1d": 146.45,
                         *           "change_7d": -55.7,
                         *           "change_1m": 1226.98,
                         *           "change_7dover7d": 30.64,
                         *           "change_30dover30d": 79.92,
                         *           "breakdown24h": {
                         *             "optimism": {
                         *               "Synthetix v1+v2": 3547540
                         *             }
                         *           },
                         *           "breakdown30d": {
                         *             "optimism": {
                         *               "Synthetix v1+v2": 166435382
                         *             }
                         *           },
                         *           "total7DaysAgo": 19143749,
                         *           "total30DaysAgo": 639043,
                         *           "defillamaId": "115",
                         *           "name": "Synthetix v1+v2",
                         *           "displayName": "Synthetix v1+v2",
                         *           "module": "synthetix",
                         *           "category": "Synthetics",
                         *           "logo": "https://icons.llamao.fi/icons/protocols/synthetix.png",
                         *           "chains": [
                         *             "OP Mainnet"
                         *           ],
                         *           "protocolType": "protocol",
                         *           "methodologyURL": "https://github.com/DefiLlama/dimension-adapters/blob/master/dexs/synthetix",
                         *           "methodology": {
                         *             "UserFees": "Fees paid by users",
                         *             "Fees": "Fees paid by users",
                         *             "Revenue": "Fees paid by users",
                         *             "ProtocolRevenue": "Percentage of fees going to treasury",
                         *             "SupplySideRevenue": "LPs revenue"
                         *           },
                         *           "latestFetchIsOk": true,
                         *           "parentProtocol": "parent#synthetix",
                         *           "slug": "synthetix-v1+v2",
                         *           "linkedProtocols": [
                         *             "Synthetix",
                         *             "Synthetix v1+v2",
                         *             "Synthetix V3"
                         *           ],
                         *           "id": "115"
                         *         }
                         *       ]
                         *     }
                         */
                        "application/json": {
                            /** @description Total data chart with timestamps and volumes */
                            totalDataChart?: [
                                number,
                                number
                            ][];
                            /** @description Total data chart breakdown by protocol */
                            totalDataChartBreakdown?: [
                                number,
                                Record<string, never>
                            ][];
                            /** @description 24 hour breakdown */
                            breakdown24h?: Record<string, never> | null;
                            /** @description 30 day breakdown */
                            breakdown30d?: Record<string, never> | null;
                            /** @description Chain filter */
                            chain?: string | null;
                            /** @description All available chains */
                            allChains?: string[];
                            /** @description Total 24 hour volume */
                            total24h?: number;
                            /** @description Total 48h to 24h volume */
                            total48hto24h?: number;
                            /** @description Total 7 day volume */
                            total7d?: number;
                            /** @description Total 14d to 7d volume */
                            total14dto7d?: number;
                            /** @description Total 60d to 30d volume */
                            total60dto30d?: number;
                            /** @description Total 30 day volume */
                            total30d?: number;
                            /** @description Total 1 year volume */
                            total1y?: number;
                            /** @description 1 day change percentage */
                            change_1d?: number;
                            /** @description 7 day change percentage */
                            change_7d?: number;
                            /** @description 1 month change percentage */
                            change_1m?: number;
                            /** @description 7d over 7d change percentage */
                            change_7dover7d?: number;
                            /** @description 30d over 30d change percentage */
                            change_30dover30d?: number;
                            /** @description Total volume 7 days ago */
                            total7DaysAgo?: number;
                            /** @description Total volume 30 days ago */
                            total30DaysAgo?: number;
                            /** @description Total all time volume */
                            totalAllTime?: number;
                            /** @description List of protocols */
                            protocols?: {
                                /** @description Protocol 24 hour volume */
                                total24h?: number;
                                /** @description Protocol 48h to 24h volume */
                                total48hto24h?: number;
                                /** @description Protocol 7 day volume */
                                total7d?: number;
                                /** @description Protocol 14d to 7d volume */
                                total14dto7d?: number;
                                /** @description Protocol 60d to 30d volume */
                                total60dto30d?: number;
                                /** @description Protocol 30 day volume */
                                total30d?: number;
                                /** @description Protocol 1 year volume */
                                total1y?: number;
                                /** @description Protocol all time volume */
                                totalAllTime?: number;
                                /** @description Protocol average 1 year volume */
                                average1y?: number;
                                /** @description Protocol 1 day change percentage */
                                change_1d?: number;
                                /** @description Protocol 7 day change percentage */
                                change_7d?: number;
                                /** @description Protocol 1 month change percentage */
                                change_1m?: number;
                                /** @description Protocol 7d over 7d change percentage */
                                change_7dover7d?: number;
                                /** @description Protocol 30d over 30d change percentage */
                                change_30dover30d?: number;
                                /** @description Protocol 24 hour breakdown */
                                breakdown24h?: Record<string, never>;
                                /** @description Protocol 30 day breakdown */
                                breakdown30d?: Record<string, never>;
                                /** @description Protocol volume 7 days ago */
                                total7DaysAgo?: number;
                                /** @description Protocol volume 30 days ago */
                                total30DaysAgo?: number;
                                /** @description DefiLlama protocol ID */
                                defillamaId?: string;
                                /** @description Protocol name */
                                name?: string;
                                /** @description Protocol display name */
                                displayName?: string;
                                /** @description Protocol module */
                                module?: string;
                                /** @description Protocol category */
                                category?: string;
                                /** @description Protocol logo URL */
                                logo?: string;
                                /** @description Protocol chains */
                                chains?: string[];
                                /** @description Protocol type */
                                protocolType?: string;
                                /** @description Methodology URL */
                                methodologyURL?: string;
                                /** @description Methodology details */
                                methodology?: Record<string, never>;
                                /** @description Latest fetch status */
                                latestFetchIsOk?: boolean;
                                /** @description Parent protocol */
                                parentProtocol?: string;
                                /** @description Protocol slug */
                                slug?: string;
                                /** @description Linked protocols */
                                linkedProtocols?: string[];
                                /** @description Protocol ID */
                                id?: string;
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
    "/api/summary/derivatives/{protocol}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Volume Details about a specific perp protocol */
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
                         *         "Hyperliquid Perps"
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
                         *       "total24h": 16946528076,
                         *       "total48hto24h": 14792562336,
                         *       "total7d": 86747987334,
                         *       "totalAllTime": 2003035982525,
                         *       "totalDataChart": [
                         *         [
                         *           1752710400,
                         *           16946528076
                         *         ],
                         *         [
                         *           1752796800,
                         *           21220070880
                         *         ]
                         *       ],
                         *       "totalDataChartBreakdown": [
                         *         [
                         *           1752710400,
                         *           {
                         *             "Hyperliquid L1": {
                         *               "Hyperliquid Perps": 16946528076
                         *             }
                         *           }
                         *         ],
                         *         [
                         *           1752796800,
                         *           {
                         *             "Hyperliquid L1": {
                         *               "Hyperliquid Perps": 21220070880
                         *             }
                         *           }
                         *         ]
                         *       ],
                         *       "change_1d": 14.56
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
                            /** @description 24 hour volume */
                            total24h?: number;
                            /** @description 48h to 24h volume */
                            total48hto24h?: number;
                            /** @description 7 day volume */
                            total7d?: number;
                            /** @description All time volume */
                            totalAllTime?: number;
                            /** @description Total data chart with timestamps and volumes */
                            totalDataChart?: [
                                number,
                                number
                            ][];
                            /** @description Total data chart breakdown by chain and protocol */
                            totalDataChartBreakdown?: [
                                number,
                                Record<string, never>
                            ][];
                            /** @description 1 day change percentage */
                            change_1d?: number;
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
    "/api/protocols": {
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
    "/api/protocol/{protocol}": {
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
    "/api/v2/historicalChainTvl": {
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
    "/api/v2/historicalChainTvl/{chain}": {
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
    "/api/tvl/{protocol}": {
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
    "/api/v2/chains": {
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
    "/api/v2/metrics/tvl/protocol/{protocol}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get aggregate TVL metrics for a protocol
         * @description Returns protocol metadata along with current TVL figures, chain breakdowns, and other aggregate metrics.
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
                /** @description Protocol TVL metrics */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @example parent#aave */
                            id?: string;
                            /** @example Aave */
                            name?: string;
                            /** @example 0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9 */
                            address?: string | null;
                            /** @example AAVE */
                            symbol?: string | null;
                            /** @example https://aave.com */
                            url?: string;
                            referralUrl?: string | null;
                            /** @example Aave is an Open Source and Non-Custodial protocol to earn interest on deposits & borrow assets */
                            description?: string;
                            /** @example Multi-Chain */
                            chain?: string;
                            /** @example https://icons.llama.fi/aave.png */
                            logo?: string;
                            audits?: string | null;
                            audit_note?: string | null;
                            /** @example aave */
                            gecko_id?: string | null;
                            /** @example 7278 */
                            cmcId?: string | null;
                            /** @example Lending */
                            category?: string;
                            tags?: string[] | null;
                            /**
                             * @example [
                             *       "Ethereum",
                             *       "Polygon",
                             *       "Avalanche"
                             *     ]
                             */
                            chains?: string[];
                            module?: string | null;
                            treasury?: string | null;
                            /** @example AaveAave */
                            twitter?: string;
                            audit_links?: string[];
                            openSource?: boolean;
                            forkedFrom?: string[];
                            /**
                             * @example {
                             *       "Ethereum": [
                             *         "Chainlink"
                             *       ],
                             *       "Polygon": [
                             *         "Chainlink"
                             *       ]
                             *     }
                             */
                            oraclesByChain?: {
                                [key: string]: string[];
                            };
                            parentProtocol?: string;
                            governanceID?: string[];
                            github?: string[];
                            /**
                             * @example {
                             *       "Ethereum": 3200000000,
                             *       "Polygon": 1500000000
                             *     }
                             */
                            currentChainTvls?: {
                                [key: string]: number;
                            };
                            isParentProtocol?: boolean;
                            /** @example 2400000000 */
                            mcap?: number | null;
                            methodology?: string | null;
                            raises?: {
                                /** @example Series A */
                                round?: string;
                                /** @example 25000000 */
                                amount?: number;
                                valuation?: string;
                                source?: string;
                                /** @example 1601510400 */
                                date?: number;
                                defillamaId?: string;
                                leadInvestors?: string[];
                                otherInvestors?: string[];
                                investors?: string[];
                            }[];
                            otherProtocols?: string[];
                            /** @description Notable events in the protocol's history as [timestamp, description] pairs */
                            hallmarks?: unknown[][];
                            stablecoins?: string[];
                            misrepresentedTokens?: boolean;
                            deprecated?: boolean;
                            rugged?: boolean;
                            deadUrl?: boolean;
                            warningBanners?: {
                                message?: string;
                                until?: string | null;
                                /** @enum {string} */
                                level?: "low" | "alert" | "rug";
                            }[];
                            /** @description Token governance and value accrual rights */
                            tokenRights?: Record<string, never>;
                            wrongLiquidity?: boolean;
                            /** @description Path to the TVL adapter source code */
                            tvlCodePath?: string;
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
    "/api/v2/chart/tvl/protocol/{protocol}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get historical TVL chart for a protocol
         * @description Returns an array of [timestamp, value] pairs representing the protocol's TVL over time. By default returns the base TVL metric. Use the `key` parameter to select a different metric or aggregate all metrics.
         */
        get: {
            parameters: {
                query?: {
                    /** @description Metric to return. Omit for default TVL. Use "all" for the sum of tvl+borrowed+staking+pool2+vesting, or a specific metric like "staking", "borrowed", "vesting", "pool2". */
                    key?: "all" | "staking" | "borrowed" | "vesting" | "pool2";
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
                /** @description Array of [timestamp, value] pairs */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": number[][];
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
    "/api/v2/chart/tvl/protocol/{protocol}/chain-breakdown": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get historical TVL chart for a protocol broken down by chain
         * @description Returns an array of [timestamp, { chain: value }] pairs showing the selected metric per chain over time.
         */
        get: {
            parameters: {
                query?: {
                    /** @description Metric to return. Omit for default TVL. Use "all" for the sum of tvl+borrowed+staking+pool2+vesting, or a specific metric like "staking", "borrowed", "vesting", "pool2". */
                    key?: "all" | "staking" | "borrowed" | "vesting" | "pool2";
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
                /** @description Array of [timestamp, chainBreakdown] pairs. Each entry is a two-element array: first element is a unix timestamp, second is an object mapping chain names to values. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": unknown[];
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
    "/api/v2/chart/tvl/protocol/{protocol}/token-breakdown": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get historical TVL chart for a protocol broken down by token
         * @description Returns an array of [timestamp, { token: value }] pairs showing TVL per token over time. Values are in USD by default, set currency=tokens for raw token amounts.
         */
        get: {
            parameters: {
                query?: {
                    /** @description Metric to return. Omit for default TVL. Use "all" for the sum of tvl+borrowed+staking+pool2+vesting, or a specific metric like "staking", "borrowed", "vesting", "pool2". */
                    key?: "all" | "staking" | "borrowed" | "vesting" | "pool2";
                    /** @description Set to "tokens" to return values denominated in raw token amounts instead of USD */
                    currency?: "usd" | "token" | "raw";
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
                /** @description Array of [timestamp, tokenBreakdown] pairs. Each entry is a two-element array: first element is a unix timestamp, second is an object mapping token names to values (USD by default, raw token amounts if currency=tokens). */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": unknown[];
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
    "/api/v2/metrics/treasury/protocol/{protocol}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get aggregate treasury metrics for a protocol
         * @description Returns protocol metadata along with current treasury figures and chain breakdowns.
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
                /** @description Protocol treasury metrics */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @example parent#aave */
                            id?: string;
                            /** @example Aave */
                            name?: string;
                            /** @example 0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9 */
                            address?: string | null;
                            /** @example AAVE */
                            symbol?: string | null;
                            /** @example https://aave.com */
                            url?: string;
                            referralUrl?: string | null;
                            /** @example Aave is an Open Source and Non-Custodial protocol to earn interest on deposits & borrow assets */
                            description?: string;
                            /** @example Multi-Chain */
                            chain?: string;
                            /** @example https://icons.llama.fi/aave.png */
                            logo?: string;
                            audits?: string | null;
                            audit_note?: string | null;
                            /** @example aave */
                            gecko_id?: string | null;
                            /** @example 7278 */
                            cmcId?: string | null;
                            /** @example Lending */
                            category?: string;
                            tags?: string[] | null;
                            /**
                             * @example [
                             *       "Ethereum",
                             *       "Polygon",
                             *       "Avalanche"
                             *     ]
                             */
                            chains?: string[];
                            module?: string | null;
                            treasury?: string | null;
                            /** @example AaveAave */
                            twitter?: string;
                            audit_links?: string[];
                            openSource?: boolean;
                            forkedFrom?: string[];
                            /**
                             * @example {
                             *       "Ethereum": [
                             *         "Chainlink"
                             *       ],
                             *       "Polygon": [
                             *         "Chainlink"
                             *       ]
                             *     }
                             */
                            oraclesByChain?: {
                                [key: string]: string[];
                            };
                            parentProtocol?: string;
                            governanceID?: string[];
                            github?: string[];
                            /**
                             * @example {
                             *       "Ethereum": 80000000,
                             *       "Polygon": 20000000
                             *     }
                             */
                            currentChainTvls?: {
                                [key: string]: number;
                            };
                            isParentProtocol?: boolean;
                            /** @example 2400000000 */
                            mcap?: number | null;
                            methodology?: string | null;
                            raises?: {
                                /** @example Series A */
                                round?: string;
                                /** @example 25000000 */
                                amount?: number;
                                valuation?: string;
                                source?: string;
                                /** @example 1601510400 */
                                date?: number;
                                defillamaId?: string;
                                leadInvestors?: string[];
                                otherInvestors?: string[];
                                investors?: string[];
                            }[];
                            otherProtocols?: string[];
                            /** @description Notable events in the protocol's history as [timestamp, description] pairs */
                            hallmarks?: unknown[][];
                            stablecoins?: string[];
                            misrepresentedTokens?: boolean;
                            deprecated?: boolean;
                            rugged?: boolean;
                            deadUrl?: boolean;
                            warningBanners?: {
                                message?: string;
                                until?: string | null;
                                /** @enum {string} */
                                level?: "low" | "alert" | "rug";
                            }[];
                            /** @description Token governance and value accrual rights */
                            tokenRights?: Record<string, never>;
                            wrongLiquidity?: boolean;
                            /** @description Path to the TVL adapter source code */
                            tvlCodePath?: string;
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
    "/api/v2/chart/treasury/protocol/{protocol}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get historical treasury chart for a protocol
         * @description Returns an array of [timestamp, value] pairs representing the protocol's treasury value over time. By default excludes the protocol's own tokens (OwnTokens).
         */
        get: {
            parameters: {
                query?: {
                    /** @description Token filter. Omit to exclude OwnTokens (default). Use "OwnTokens" to return only the protocol's own tokens, or "all" for the sum of all tokens including OwnTokens. */
                    key?: "OwnTokens" | "all";
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
                /** @description Array of [timestamp, value] pairs */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": number[][];
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
    "/api/v2/chart/treasury/protocol/{protocol}/chain-breakdown": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get historical treasury chart for a protocol broken down by chain
         * @description Returns an array of [timestamp, { chain: value }] pairs showing treasury value per chain over time. By default excludes the protocol's own tokens.
         */
        get: {
            parameters: {
                query?: {
                    /** @description Token filter. Omit to exclude OwnTokens (default). Use "OwnTokens" to return only the protocol's own tokens, or "all" for the sum of all tokens including OwnTokens. */
                    key?: "OwnTokens" | "all";
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
                /** @description Array of [timestamp, chainBreakdown] pairs. Each entry is a two-element array: first element is a unix timestamp, second is an object mapping chain names to treasury values. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": unknown[];
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
    "/api/v2/chart/treasury/protocol/{protocol}/token-breakdown": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get historical treasury chart for a protocol broken down by token
         * @description Returns an array of [timestamp, { token: value }] pairs showing treasury value per token over time. By default excludes OwnTokens and values are in USD. Use key and currency params to customize.
         */
        get: {
            parameters: {
                query?: {
                    /** @description Token filter. Omit to exclude OwnTokens (default). Use "OwnTokens" to return only the protocol's own tokens, or "all" for the sum of all tokens including OwnTokens. */
                    key?: "OwnTokens" | "all";
                    /** @description Set to "tokens" to return values denominated in raw token amounts instead of USD */
                    currency?: "usd" | "token" | "raw";
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
                /** @description Array of [timestamp, tokenBreakdown] pairs. Each entry is a two-element array: first element is a unix timestamp, second is an object mapping token names to treasury values (USD by default, raw token amounts if currency=tokens). */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": unknown[];
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
    "/api/v2/metrics/oracle": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get oracle data overview
         * @description Returns an object mapping oracle names to arrays of protocol names that use each oracle.
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Oracle data overview */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /**
                             * @description Mapping of oracle names to arrays of protocol names using that oracle
                             * @example {
                             *       "Chainlink": [
                             *         "Aave V2",
                             *         "Compound V2",
                             *         "Synthetix v1+v2"
                             *       ],
                             *       "Band": [
                             *         "Mirror",
                             *         "Anchor"
                             *       ],
                             *       "TWAP": [
                             *         "Uniswap V3"
                             *       ]
                             *     }
                             */
                            oracles?: {
                                [key: string]: string[];
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
    "/api/v2/chart/oracle": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get timeseries chart data for all oracles
         * @description Returns an array of [timestamp, value] pairs representing total TVL across all oracles over time.
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Array of [timestamp, value] pairs */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": number[][];
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
    "/api/v2/chart/oracle/chain-breakdown": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get timeseries chart data breakdown by chain
         * @description Returns an array of objects with a timestamp and TVL values broken down by chain.
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Array of timestamped chain breakdowns */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": ({
                            /**
                             * @description Unix timestamp
                             * @example 1546560000
                             */
                            timestamp?: number;
                        } & {
                            [key: string]: number;
                        })[];
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
    "/api/v2/chart/oracle/protocol-breakdown": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get timeseries chart data breakdown by protocol
         * @description Returns an array of objects with a timestamp and TVL values broken down by oracle/protocol.
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Array of timestamped protocol breakdowns */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": ({
                            /**
                             * @description Unix timestamp
                             * @example 1546560000
                             */
                            timestamp?: number;
                        } & {
                            [key: string]: number;
                        })[];
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
    "/api/v2/chart/oracle/protocol/{protocol}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get timeseries chart data by protocol/oracle
         * @description Returns an array of [timestamp, value] pairs representing TVL over time for a specific oracle/protocol.
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description oracle/protocol name */
                    protocol: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Array of [timestamp, value] pairs */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": number[][];
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
    "/api/v2/chart/oracle/protocol/{protocol}/chain-breakdown": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get chain breakdown timeseries chart data by protocol/oracle
         * @description Returns an array of objects with a timestamp and TVL values broken down by chain for a specific oracle/protocol.
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description oracle/protocol name */
                    protocol: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Array of timestamped chain breakdowns */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": ({
                            /**
                             * @description Unix timestamp
                             * @example 1557273600
                             */
                            timestamp?: number;
                        } & {
                            [key: string]: number;
                        })[];
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
    "/api/v2/chart/oracle/chain/{chain}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get timeseries chart data by chain
         * @description Returns an array of [timestamp, value] pairs representing oracle TVL over time for a specific chain.
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description chain name */
                    chain: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Array of [timestamp, value] pairs */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": number[][];
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
    "/api/v2/chart/oracle/chain/{chain}/protocol-breakdown": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get protocol breakdown timeseries chart data by chain
         * @description Returns an array of objects with a timestamp and TVL values broken down by oracle/protocol for a specific chain.
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description chain name */
                    chain: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Array of timestamped protocol breakdowns */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": ({
                            /**
                             * @description Unix timestamp
                             * @example 1546560000
                             */
                            timestamp?: number;
                        } & {
                            [key: string]: number;
                        })[];
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
    "/api/v2/metrics/fork": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get fork data overview
         * @description Returns an object mapping fork names to arrays of protocol names that are forks of each protocol.
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Fork data overview */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            [key: string]: string[];
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
    "/api/v2/chart/fork/protocol-breakdown": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get timeseries chart data breakdown by protocol
         * @description Returns an array of objects with a timestamp and TVL values broken down by fork protocol.
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Array of timestamped protocol breakdowns */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": ({
                            /**
                             * @description Unix timestamp
                             * @example 1599264000
                             */
                            timestamp?: number;
                        } & {
                            [key: string]: number;
                        })[];
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
    "/api/v2/chart/fork/protocol/{protocol}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get timeseries chart data by protocol
         * @description Returns an array of [timestamp, value] pairs representing TVL over time for all forks of a specific protocol.
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
                /** @description Array of [timestamp, value] pairs */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": number[][];
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
    "/api/overview/dexs": {
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
    "/api/overview/dexs/{chain}": {
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
    "/api/summary/dexs/{protocol}": {
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
    "/api/overview/options": {
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
    "/api/overview/options/{chain}": {
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
                    content: {
                        /**
                         * @example {
                         *       "totalDataChart": [
                         *         [
                         *           1656201600,
                         *           3947
                         *         ]
                         *       ],
                         *       "totalDataChartBreakdown": [
                         *         [
                         *           1656201600,
                         *           {
                         *             "Premia V2": 3947
                         *           }
                         *         ],
                         *         [
                         *           1656288000,
                         *           {
                         *             "Premia V2": 4716
                         *           }
                         *         ],
                         *         [
                         *           1656374400,
                         *           {
                         *             "Premia V2": 4716
                         *           }
                         *         ]
                         *       ],
                         *       "breakdown24h": null,
                         *       "breakdown30d": null,
                         *       "chain": "Ethereum",
                         *       "allChains": [
                         *         "Hyperliquid L1",
                         *         "Derive Chain",
                         *         "Arbitrum",
                         *         "Ethereum",
                         *         "Base",
                         *         "Berachain",
                         *         "Sui",
                         *         "OP Mainnet",
                         *         "Polygon",
                         *         "Fantom",
                         *         "Sonic",
                         *         "Blast",
                         *         "Mantle",
                         *         "Bitlayer",
                         *         "BSC",
                         *         "Sei",
                         *         "TON"
                         *       ],
                         *       "total24h": 38508,
                         *       "total48hto24h": 57674,
                         *       "total7d": 244966,
                         *       "total14dto7d": 181066,
                         *       "total60dto30d": 1543832,
                         *       "total30d": 715276,
                         *       "total1y": 38047667,
                         *       "change_1d": -33.23,
                         *       "change_7d": -0.13,
                         *       "change_1m": 619.37,
                         *       "change_7dover7d": 35.29,
                         *       "change_30dover30d": -53.67,
                         *       "total7DaysAgo": 38559,
                         *       "total30DaysAgo": 5353,
                         *       "totalAllTime": 212572409,
                         *       "protocols": [
                         *         {
                         *           "total24h": 0,
                         *           "total48hto24h": 0,
                         *           "total7d": 0,
                         *           "total14dto7d": 0,
                         *           "total60dto30d": 0,
                         *           "total30d": 0,
                         *           "total1y": 0,
                         *           "totalAllTime": 920677,
                         *           "total7DaysAgo": 0,
                         *           "total30DaysAgo": 0,
                         *           "defillamaId": "381",
                         *           "name": "Premia V2",
                         *           "displayName": "Premia V2",
                         *           "module": "premia-v2",
                         *           "category": "Options",
                         *           "logo": "https://icons.llamao.fi/icons/protocols/premia-v2.jpg",
                         *           "chains": [
                         *             "Ethereum",
                         *             "Arbitrum",
                         *             "Fantom",
                         *             "OP Mainnet"
                         *           ],
                         *           "protocolType": "protocol",
                         *           "methodologyURL": "https://github.com/DefiLlama/dimension-adapters/blob/master/options/premia-v2.ts",
                         *           "methodology": {
                         *             "UserFees": "Traders pay taker fees on each trade up to 3% of the option premium.",
                         *             "Fees": "Fees paid by users",
                         *             "Revenue": "Treasury and token holders revenue",
                         *             "ProtocolRevenue": "The protocol collects 20% of the taker fees.",
                         *             "HoldersRevenue": "vxPREMIA holders collect 80% of the taker fees.",
                         *             "SupplySideRevenue": "Liquidity providers earn revenue from market-making options."
                         *           },
                         *           "latestFetchIsOk": true,
                         *           "parentProtocol": "parent#premia",
                         *           "slug": "premia-v2",
                         *           "linkedProtocols": [
                         *             "Premia",
                         *             "Premia V2",
                         *             "Premia V3"
                         *           ],
                         *           "id": "381"
                         *         }
                         *       ]
                         *     }
                         */
                        "application/json": {
                            /** @description Historical chart data with timestamps and total volumes */
                            totalDataChart?: [
                                number,
                                number
                            ][];
                            /** @description Historical chart data broken down by protocol */
                            totalDataChartBreakdown?: [
                                number,
                                {
                                    [key: string]: number;
                                }
                            ][];
                            /** @description 24-hour breakdown data */
                            breakdown24h?: Record<string, never> | null;
                            /** @description 30-day breakdown data */
                            breakdown30d?: Record<string, never> | null;
                            /** @description Chain name */
                            chain?: string;
                            /** @description List of all supported chains */
                            allChains?: string[];
                            /** @description Total 24-hour volume */
                            total24h?: number;
                            /** @description Total 48-hour to 24-hour volume */
                            total48hto24h?: number;
                            /** @description Total 7-day volume */
                            total7d?: number;
                            /** @description Total 14-day to 7-day volume */
                            total14dto7d?: number;
                            /** @description Total 60-day to 30-day volume */
                            total60dto30d?: number;
                            /** @description Total 30-day volume */
                            total30d?: number;
                            /** @description Total 1-year volume */
                            total1y?: number;
                            /** @description 1-day change percentage */
                            change_1d?: number;
                            /** @description 7-day change percentage */
                            change_7d?: number;
                            /** @description 1-month change percentage */
                            change_1m?: number;
                            /** @description 7-day over 7-day change percentage */
                            change_7dover7d?: number;
                            /** @description 30-day over 30-day change percentage */
                            change_30dover30d?: number;
                            /** @description Total volume 7 days ago */
                            total7DaysAgo?: number;
                            /** @description Total volume 30 days ago */
                            total30DaysAgo?: number;
                            /** @description Total all-time volume */
                            totalAllTime?: number;
                            /** @description List of protocols with their volume data */
                            protocols?: {
                                /** @description 24-hour volume */
                                total24h?: number;
                                /** @description 48-hour to 24-hour volume */
                                total48hto24h?: number;
                                /** @description 7-day volume */
                                total7d?: number;
                                /** @description 14-day to 7-day volume */
                                total14dto7d?: number;
                                /** @description 60-day to 30-day volume */
                                total60dto30d?: number;
                                /** @description 30-day volume */
                                total30d?: number;
                                /** @description 1-year volume */
                                total1y?: number;
                                /** @description All-time volume */
                                totalAllTime?: number;
                                /** @description Volume 7 days ago */
                                total7DaysAgo?: number;
                                /** @description Volume 30 days ago */
                                total30DaysAgo?: number;
                                /** @description Average 1-year volume */
                                average1y?: number;
                                /** @description 1-day change percentage */
                                change_1d?: number;
                                /** @description 7-day change percentage */
                                change_7d?: number;
                                /** @description 1-month change percentage */
                                change_1m?: number;
                                /** @description 7-day over 7-day change percentage */
                                change_7dover7d?: number;
                                /** @description 30-day over 30-day change percentage */
                                change_30dover30d?: number;
                                /** @description DefiLlama protocol ID */
                                defillamaId?: string;
                                /** @description Protocol name */
                                name?: string;
                                /** @description Protocol display name */
                                displayName?: string;
                                /** @description Protocol module name */
                                module?: string;
                                /** @description Protocol category */
                                category?: string;
                                /** @description Protocol logo URL */
                                logo?: string;
                                /** @description Supported chains */
                                chains?: string[];
                                /** @description Protocol type */
                                protocolType?: string;
                                /** @description Methodology documentation URL */
                                methodologyURL?: string;
                                /** @description Protocol methodology details */
                                methodology?: {
                                    [key: string]: string;
                                };
                                /** @description Whether the latest data fetch was successful */
                                latestFetchIsOk?: boolean;
                                /** @description Parent protocol identifier */
                                parentProtocol?: string;
                                /** @description Protocol slug */
                                slug?: string;
                                /** @description Linked protocol names */
                                linkedProtocols?: string[];
                                /** @description Protocol ID */
                                id?: string;
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
    "/api/summary/options/{protocol}": {
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
                    content: {
                        /**
                         * @example {
                         *       "id": "parent#lyra",
                         *       "name": "Derive",
                         *       "url": "https://derive.xyz",
                         *       "description": "Trade options & perps. Earn yield with restaking derivatives.",
                         *       "logo": "https://icons.llama.fi/derive.png",
                         *       "gecko_id": "derive",
                         *       "cmcId": "35014",
                         *       "chains": [
                         *         "OP Mainnet",
                         *         "Arbitrum",
                         *         "Derive Chain"
                         *       ],
                         *       "twitter": "derivexyz",
                         *       "governanceID": [
                         *         "snapshot:lyra.eth"
                         *       ],
                         *       "github": [
                         *         "lyra-finance"
                         *       ],
                         *       "treasury": "lyra.js",
                         *       "symbol": "DRV",
                         *       "address": "0xb1d1eae60eea9525032a6dcb4c1ce336a1de71be",
                         *       "childProtocols": [
                         *         {},
                         *         {}
                         *       ],
                         *       "linkedProtocols": [
                         *         "Derive",
                         *         "Derive V2",
                         *         "Derive Options"
                         *       ],
                         *       "defillamaId": "parent#lyra",
                         *       "disabled": null,
                         *       "displayName": "Derive",
                         *       "module": null,
                         *       "category": null,
                         *       "methodologyURL": null,
                         *       "methodology": null,
                         *       "forkedFrom": null,
                         *       "audits": null,
                         *       "audit_links": null,
                         *       "versionKey": null,
                         *       "parentProtocol": null,
                         *       "previousNames": null,
                         *       "latestFetchIsOk": true,
                         *       "slug": "derive",
                         *       "protocolType": "protocol",
                         *       "total24h": 849389,
                         *       "total48hto24h": 529694,
                         *       "total7d": 2327481,
                         *       "totalAllTime": 156317108,
                         *       "totalDataChart": [
                         *         [
                         *           1702684800,
                         *           15019
                         *         ],
                         *         [
                         *           1702771200,
                         *           15019
                         *         ]
                         *       ],
                         *       "totalDataChartBreakdown": [
                         *         [
                         *           1702684800,
                         *           {
                         *             "Ethereum": {
                         *               "Derive V2": 15019
                         *             }
                         *           }
                         *         ],
                         *         [
                         *           1702771200,
                         *           {
                         *             "Derive Chain": {
                         *               "Derive V2": 15019
                         *             }
                         *           }
                         *         ]
                         *       ],
                         *       "change_1d": 60.35
                         *     }
                         */
                        "application/json": {
                            /** @description Protocol ID */
                            id?: string;
                            /** @description Protocol name */
                            name?: string;
                            /** @description Protocol website URL */
                            url?: string;
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
                            /** @description Governance identifiers */
                            governanceID?: string[];
                            /** @description GitHub repositories */
                            github?: string[];
                            /** @description Treasury information */
                            treasury?: string;
                            /** @description Token symbol */
                            symbol?: string;
                            /** @description Token contract address */
                            address?: string;
                            /** @description Child protocols */
                            childProtocols?: Record<string, never>[];
                            /** @description Linked protocol names */
                            linkedProtocols?: string[];
                            /** @description DefiLlama protocol ID */
                            defillamaId?: string;
                            /** @description Disabled status */
                            disabled?: Record<string, never> | null;
                            /** @description Protocol display name */
                            displayName?: string;
                            /** @description Protocol module */
                            module?: Record<string, never> | null;
                            /** @description Protocol category */
                            category?: Record<string, never> | null;
                            /** @description Methodology documentation URL */
                            methodologyURL?: Record<string, never> | null;
                            /** @description Protocol methodology details */
                            methodology?: Record<string, never> | null;
                            /** @description Forked from protocol */
                            forkedFrom?: Record<string, never> | null;
                            /** @description Audit information */
                            audits?: Record<string, never> | null;
                            /** @description Audit links */
                            audit_links?: Record<string, never> | null;
                            /** @description Version key */
                            versionKey?: Record<string, never> | null;
                            /** @description Parent protocol */
                            parentProtocol?: Record<string, never> | null;
                            /** @description Previous protocol names */
                            previousNames?: Record<string, never> | null;
                            /** @description Whether the latest data fetch was successful */
                            latestFetchIsOk?: boolean;
                            /** @description Protocol slug */
                            slug?: string;
                            /** @description Protocol type */
                            protocolType?: string;
                            /** @description 24-hour volume */
                            total24h?: number;
                            /** @description 48-hour to 24-hour volume */
                            total48hto24h?: number;
                            /** @description 7-day volume */
                            total7d?: number;
                            /** @description All-time volume */
                            totalAllTime?: number;
                            /** @description Historical chart data with timestamps and volumes */
                            totalDataChart?: [
                                number,
                                number
                            ][];
                            /** @description Historical chart data broken down by chain and protocol */
                            totalDataChartBreakdown?: [
                                number,
                                {
                                    [key: string]: {
                                        [key: string]: number;
                                    };
                                }
                            ][];
                            /** @description 1-day change percentage */
                            change_1d?: number;
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
    "/api/overview/open-interest": {
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
    "/api/overview/fees": {
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
    "/api/overview/fees/{chain}": {
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
    "/api/summary/fees/{protocol}": {
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
    "/api/v2/metrics/{metric}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get dimension data overview
         * @description Returns aggregate metrics for the specified dimension including totals and percentage changes across different time periods.
         */
        get: {
            parameters: {
                query?: {
                    /**
                     * @description Metric-specific data type to return. Supported values per metric:
                     *     - **fees**: dailyFees (default), dailyRevenue, dailySupplySideRevenue, dailyHoldersRevenue, dailyProtocolRevenue
                     *     - **liquidations**: dailyLiquidationsVolume (default), dailyCollateralLiquidated
                     *     - **dexs**: dailyVolume (default), dailyNotionalVolume
                     *     - **derivatives**: dailyVolume (default), dailyNotionalVolume
                     *     - **options**: dailyNotionalVolume (default), dailyPremiumVolume
                     *     - **aggregators**: dailyVolume (default)
                     *     - **bridge-aggregators**: dailyBridgeVolume (default)
                     *     - **open-interest**: openInterestAtEnd (default), shortOpenInterestAtEnd, longOpenInterestAtEnd
                     *     - **normalized-volume**: dailyNormalizedVolume (default), dailyActiveLiquidity
                     *     - **active-users**: dailyActiveUsers (default), dailyTransactionCount, dailyGasUsed
                     */
                    dataType?: string;
                };
                header?: never;
                path: {
                    /** @description The dimension metric type */
                    metric: "fees" | "liquidations" | "dexs" | "derivatives" | "options" | "aggregators" | "bridge-aggregators" | "open-interest" | "normalized-volume" | "active-users";
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Dimension metrics overview */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /**
                             * @example [
                             *       "Ethereum",
                             *       "Solana",
                             *       "BSC",
                             *       "Base"
                             *     ]
                             */
                            allChains?: string[];
                            /** @example 42000000 */
                            total24h?: number;
                            /** @example 38000000 */
                            total48hto24h?: number;
                            /** @example 280000000 */
                            total7d?: number;
                            /** @example 260000000 */
                            total14dto7d?: number;
                            /** @example 1100000000 */
                            total60dto30d?: number;
                            /** @example 1200000000 */
                            total30d?: number;
                            /** @example 15000000000 */
                            total1y?: number;
                            /** @example 10.5 */
                            change_1d?: number;
                            /** @example 7.8 */
                            change_7d?: number;
                            /** @example 9.1 */
                            change_1m?: number;
                            /** @example 5.2 */
                            change_7dover7d?: number;
                            /** @example 8.3 */
                            change_30dover30d?: number;
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
    "/api/v2/chart/{metric}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get historical timeseries chart data
         * @description Returns an array of [timestamp, value] pairs representing the total metric value over time.
         */
        get: {
            parameters: {
                query?: {
                    /**
                     * @description Metric-specific data type to return. Supported values per metric:
                     *     - **fees**: dailyFees (default), dailyRevenue, dailySupplySideRevenue, dailyHoldersRevenue, dailyProtocolRevenue
                     *     - **liquidations**: dailyLiquidationsVolume (default), dailyCollateralLiquidated
                     *     - **dexs**: dailyVolume (default), dailyNotionalVolume
                     *     - **derivatives**: dailyVolume (default), dailyNotionalVolume
                     *     - **options**: dailyNotionalVolume (default), dailyPremiumVolume
                     *     - **aggregators**: dailyVolume (default)
                     *     - **bridge-aggregators**: dailyBridgeVolume (default)
                     *     - **open-interest**: openInterestAtEnd (default), shortOpenInterestAtEnd, longOpenInterestAtEnd
                     *     - **normalized-volume**: dailyNormalizedVolume (default), dailyActiveLiquidity
                     *     - **active-users**: dailyActiveUsers (default), dailyTransactionCount, dailyGasUsed
                     */
                    dataType?: string;
                };
                header?: never;
                path: {
                    /** @description The dimension metric type */
                    metric: "fees" | "liquidations" | "dexs" | "derivatives" | "options" | "aggregators" | "bridge-aggregators" | "open-interest" | "normalized-volume" | "active-users";
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Array of [timestamp, value] pairs */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": number[][];
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
    "/api/v2/chart/{metric}/chain-breakdown": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get historical timeseries chart data breakdown by chain
         * @description Returns an array of [timestamp, {chain: value}] pairs showing the metric broken down by chain over time.
         */
        get: {
            parameters: {
                query?: {
                    /**
                     * @description Metric-specific data type to return. Supported values per metric:
                     *     - **fees**: dailyFees (default), dailyRevenue, dailySupplySideRevenue, dailyHoldersRevenue, dailyProtocolRevenue
                     *     - **liquidations**: dailyLiquidationsVolume (default), dailyCollateralLiquidated
                     *     - **dexs**: dailyVolume (default), dailyNotionalVolume
                     *     - **derivatives**: dailyVolume (default), dailyNotionalVolume
                     *     - **options**: dailyNotionalVolume (default), dailyPremiumVolume
                     *     - **aggregators**: dailyVolume (default)
                     *     - **bridge-aggregators**: dailyBridgeVolume (default)
                     *     - **open-interest**: openInterestAtEnd (default), shortOpenInterestAtEnd, longOpenInterestAtEnd
                     *     - **normalized-volume**: dailyNormalizedVolume (default), dailyActiveLiquidity
                     *     - **active-users**: dailyActiveUsers (default), dailyTransactionCount, dailyGasUsed
                     */
                    dataType?: string;
                };
                header?: never;
                path: {
                    /** @description The dimension metric type */
                    metric: "fees" | "liquidations" | "dexs" | "derivatives" | "options" | "aggregators" | "bridge-aggregators" | "open-interest" | "normalized-volume" | "active-users";
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Array of [timestamp, chainBreakdown] pairs */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": unknown[];
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
    "/api/v2/chart/{metric}/protocol-breakdown": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get historical timeseries chart data breakdown by protocol
         * @description Returns an array of [timestamp, {protocol: value}] pairs showing the metric broken down by protocol over time.
         */
        get: {
            parameters: {
                query?: {
                    /**
                     * @description Metric-specific data type to return. Supported values per metric:
                     *     - **fees**: dailyFees (default), dailyRevenue, dailySupplySideRevenue, dailyHoldersRevenue, dailyProtocolRevenue
                     *     - **liquidations**: dailyLiquidationsVolume (default), dailyCollateralLiquidated
                     *     - **dexs**: dailyVolume (default), dailyNotionalVolume
                     *     - **derivatives**: dailyVolume (default), dailyNotionalVolume
                     *     - **options**: dailyNotionalVolume (default), dailyPremiumVolume
                     *     - **aggregators**: dailyVolume (default)
                     *     - **bridge-aggregators**: dailyBridgeVolume (default)
                     *     - **open-interest**: openInterestAtEnd (default), shortOpenInterestAtEnd, longOpenInterestAtEnd
                     *     - **normalized-volume**: dailyNormalizedVolume (default), dailyActiveLiquidity
                     */
                    dataType?: string;
                };
                header?: never;
                path: {
                    /** @description The dimension metric type */
                    metric: "fees" | "liquidations" | "dexs" | "derivatives" | "options" | "aggregators" | "bridge-aggregators" | "open-interest" | "normalized-volume";
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Array of [timestamp, protocolBreakdown] pairs */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": unknown[];
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
    "/api/v2/metrics/{metric}/chain/{chain}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get chain dimension data overview
         * @description Returns aggregate metrics for the specified dimension filtered by a specific chain.
         */
        get: {
            parameters: {
                query?: {
                    /**
                     * @description Metric-specific data type to return. Supported values per metric:
                     *     - **fees**: dailyFees (default), dailyRevenue, dailySupplySideRevenue, dailyHoldersRevenue, dailyProtocolRevenue
                     *     - **liquidations**: dailyLiquidationsVolume (default), dailyCollateralLiquidated
                     *     - **dexs**: dailyVolume (default), dailyNotionalVolume
                     *     - **derivatives**: dailyVolume (default), dailyNotionalVolume
                     *     - **options**: dailyNotionalVolume (default), dailyPremiumVolume
                     *     - **aggregators**: dailyVolume (default)
                     *     - **bridge-aggregators**: dailyBridgeVolume (default)
                     *     - **open-interest**: openInterestAtEnd (default), shortOpenInterestAtEnd, longOpenInterestAtEnd
                     *     - **normalized-volume**: dailyNormalizedVolume (default), dailyActiveLiquidity
                     */
                    dataType?: string;
                };
                header?: never;
                path: {
                    /** @description The dimension metric type */
                    metric: "fees" | "liquidations" | "dexs" | "derivatives" | "options" | "aggregators" | "bridge-aggregators" | "open-interest" | "normalized-volume";
                    /** @description chain name */
                    chain: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Chain dimension metrics overview */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /**
                             * @example [
                             *       "Ethereum",
                             *       "Solana",
                             *       "BSC",
                             *       "Base"
                             *     ]
                             */
                            allChains?: string[];
                            /** @example 42000000 */
                            total24h?: number;
                            /** @example 38000000 */
                            total48hto24h?: number;
                            /** @example 280000000 */
                            total7d?: number;
                            /** @example 260000000 */
                            total14dto7d?: number;
                            /** @example 1100000000 */
                            total60dto30d?: number;
                            /** @example 1200000000 */
                            total30d?: number;
                            /** @example 15000000000 */
                            total1y?: number;
                            /** @example 10.5 */
                            change_1d?: number;
                            /** @example 7.8 */
                            change_7d?: number;
                            /** @example 9.1 */
                            change_1m?: number;
                            /** @example 5.2 */
                            change_7dover7d?: number;
                            /** @example 8.3 */
                            change_30dover30d?: number;
                            /** @example Ethereum */
                            chain?: string;
                        };
                    };
                };
                /** @description Not found */
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
    "/api/v2/chart/{metric}/chain/{chain}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get chain historical timeseries chart data
         * @description Returns an array of [timestamp, value] pairs for the metric filtered by a specific chain.
         */
        get: {
            parameters: {
                query?: {
                    /**
                     * @description Metric-specific data type to return. Supported values per metric:
                     *     - **fees**: dailyFees (default), dailyRevenue, dailySupplySideRevenue, dailyHoldersRevenue, dailyProtocolRevenue
                     *     - **liquidations**: dailyLiquidationsVolume (default), dailyCollateralLiquidated
                     *     - **dexs**: dailyVolume (default), dailyNotionalVolume
                     *     - **derivatives**: dailyVolume (default), dailyNotionalVolume
                     *     - **options**: dailyNotionalVolume (default), dailyPremiumVolume
                     *     - **aggregators**: dailyVolume (default)
                     *     - **bridge-aggregators**: dailyBridgeVolume (default)
                     *     - **open-interest**: openInterestAtEnd (default), shortOpenInterestAtEnd, longOpenInterestAtEnd
                     *     - **normalized-volume**: dailyNormalizedVolume (default), dailyActiveLiquidity
                     */
                    dataType?: string;
                };
                header?: never;
                path: {
                    /** @description The dimension metric type */
                    metric: "fees" | "liquidations" | "dexs" | "derivatives" | "options" | "aggregators" | "bridge-aggregators" | "open-interest" | "normalized-volume";
                    /** @description chain name */
                    chain: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Array of [timestamp, value] pairs */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": number[][];
                    };
                };
                /** @description Not found */
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
    "/api/v2/chart/{metric}/chain/{chain}/protocol-breakdown": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get chain timeseries chart data breakdown by protocol
         * @description Returns an array of [timestamp, {protocol: value}] pairs showing the metric on a specific chain broken down by protocol.
         */
        get: {
            parameters: {
                query?: {
                    /**
                     * @description Metric-specific data type to return. Supported values per metric:
                     *     - **fees**: dailyFees (default), dailyRevenue, dailySupplySideRevenue, dailyHoldersRevenue, dailyProtocolRevenue
                     *     - **liquidations**: dailyLiquidationsVolume (default), dailyCollateralLiquidated
                     *     - **dexs**: dailyVolume (default), dailyNotionalVolume
                     *     - **derivatives**: dailyVolume (default), dailyNotionalVolume
                     *     - **options**: dailyNotionalVolume (default), dailyPremiumVolume
                     *     - **aggregators**: dailyVolume (default)
                     *     - **bridge-aggregators**: dailyBridgeVolume (default)
                     *     - **open-interest**: openInterestAtEnd (default), shortOpenInterestAtEnd, longOpenInterestAtEnd
                     *     - **normalized-volume**: dailyNormalizedVolume (default), dailyActiveLiquidity
                     */
                    dataType?: string;
                };
                header?: never;
                path: {
                    /** @description The dimension metric type */
                    metric: "fees" | "liquidations" | "dexs" | "derivatives" | "options" | "aggregators" | "bridge-aggregators" | "open-interest" | "normalized-volume";
                    /** @description chain name */
                    chain: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Array of [timestamp, protocolBreakdown] pairs */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": unknown[];
                    };
                };
                /** @description Not found */
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
    "/api/v2/metrics/{metric}/protocol/{protocol}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get protocol dimension data overview
         * @description Returns protocol metadata along with aggregate metrics for the specified dimension.
         */
        get: {
            parameters: {
                query?: {
                    /**
                     * @description Metric-specific data type to return. Supported values per metric:
                     *     - **fees**: dailyFees (default), dailyRevenue, dailySupplySideRevenue, dailyHoldersRevenue, dailyProtocolRevenue
                     *     - **liquidations**: dailyLiquidationsVolume (default), dailyCollateralLiquidated
                     *     - **dexs**: dailyVolume (default), dailyNotionalVolume
                     *     - **derivatives**: dailyVolume (default), dailyNotionalVolume
                     *     - **options**: dailyNotionalVolume (default), dailyPremiumVolume
                     *     - **aggregators**: dailyVolume (default)
                     *     - **bridge-aggregators**: dailyBridgeVolume (default)
                     *     - **open-interest**: openInterestAtEnd (default), shortOpenInterestAtEnd, longOpenInterestAtEnd
                     *     - **normalized-volume**: dailyNormalizedVolume (default), dailyActiveLiquidity
                     */
                    dataType?: string;
                };
                header?: never;
                path: {
                    /** @description The dimension metric type */
                    metric: "fees" | "liquidations" | "dexs" | "derivatives" | "options" | "aggregators" | "bridge-aggregators" | "open-interest" | "normalized-volume";
                    /** @description protocol slug (slugified protocol name) */
                    protocol: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Protocol dimension metrics overview */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @example 2196 */
                            id?: string;
                            /** @example Aave */
                            name?: string;
                            /** @example https://aave.com */
                            url?: string;
                            description?: string;
                            /** @example https://icons.llama.fi/aave.png */
                            logo?: string;
                            /**
                             * @example [
                             *       "Ethereum",
                             *       "Polygon",
                             *       "Avalanche"
                             *     ]
                             */
                            chains?: string[];
                            /** @example aave */
                            gecko_id?: string | null;
                            /** @example 7278 */
                            cmcId?: string | null;
                            /** @example AAVE */
                            symbol?: string | null;
                            twitter?: string | null;
                            github?: string[] | null;
                            treasury?: string | null;
                            governanceID?: string[] | null;
                            wrongLiquidity?: boolean | null;
                            stablecoins?: string[] | null;
                            /** @example 1200000 */
                            total24h?: number;
                            /** @example 1100000 */
                            total48hto24h?: number;
                            /** @example 8000000 */
                            total7d?: number;
                            /** @example 35000000 */
                            total30d?: number;
                            /** @example 400000000 */
                            total1y?: number;
                            /** @example 9.1 */
                            change_1d?: number;
                            /** @example 5.3 */
                            change_7d?: number;
                            /** @example 12.4 */
                            change_1m?: number;
                        };
                    };
                };
                /** @description Not found */
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
    "/api/v2/chart/{metric}/protocol/{protocol}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get protocol historical timeseries chart data
         * @description Returns an array of [timestamp, value] pairs for the metric of a specific protocol.
         */
        get: {
            parameters: {
                query?: {
                    /**
                     * @description Metric-specific data type to return. Supported values per metric:
                     *     - **fees**: dailyFees (default), dailyRevenue, dailySupplySideRevenue, dailyHoldersRevenue, dailyProtocolRevenue
                     *     - **liquidations**: dailyLiquidationsVolume (default), dailyCollateralLiquidated
                     *     - **dexs**: dailyVolume (default), dailyNotionalVolume
                     *     - **derivatives**: dailyVolume (default), dailyNotionalVolume
                     *     - **options**: dailyNotionalVolume (default), dailyPremiumVolume
                     *     - **aggregators**: dailyVolume (default)
                     *     - **bridge-aggregators**: dailyBridgeVolume (default)
                     *     - **open-interest**: openInterestAtEnd (default), shortOpenInterestAtEnd, longOpenInterestAtEnd
                     *     - **normalized-volume**: dailyNormalizedVolume (default), dailyActiveLiquidity
                     */
                    dataType?: string;
                };
                header?: never;
                path: {
                    /** @description The dimension metric type */
                    metric: "fees" | "liquidations" | "dexs" | "derivatives" | "options" | "aggregators" | "bridge-aggregators" | "open-interest" | "normalized-volume";
                    /** @description protocol slug (slugified protocol name) */
                    protocol: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Array of [timestamp, value] pairs */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": number[][];
                    };
                };
                /** @description Not found */
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
    "/api/v2/chart/{metric}/protocol/{protocol}/chain-breakdown": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get protocol timeseries chart data breakdown by chain
         * @description Returns an array of [timestamp, {chain: value}] pairs showing the metric for a specific protocol broken down by chain.
         */
        get: {
            parameters: {
                query?: {
                    /**
                     * @description Metric-specific data type to return. Supported values per metric:
                     *     - **fees**: dailyFees (default), dailyRevenue, dailySupplySideRevenue, dailyHoldersRevenue, dailyProtocolRevenue
                     *     - **liquidations**: dailyLiquidationsVolume (default), dailyCollateralLiquidated
                     *     - **dexs**: dailyVolume (default), dailyNotionalVolume
                     *     - **derivatives**: dailyVolume (default), dailyNotionalVolume
                     *     - **options**: dailyNotionalVolume (default), dailyPremiumVolume
                     *     - **aggregators**: dailyVolume (default)
                     *     - **bridge-aggregators**: dailyBridgeVolume (default)
                     *     - **open-interest**: openInterestAtEnd (default), shortOpenInterestAtEnd, longOpenInterestAtEnd
                     *     - **normalized-volume**: dailyNormalizedVolume (default), dailyActiveLiquidity
                     */
                    dataType?: string;
                };
                header?: never;
                path: {
                    /** @description The dimension metric type */
                    metric: "fees" | "liquidations" | "dexs" | "derivatives" | "options" | "aggregators" | "bridge-aggregators" | "open-interest" | "normalized-volume";
                    /** @description protocol slug (slugified protocol name) */
                    protocol: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Array of [timestamp, chainBreakdown] pairs */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": unknown[];
                    };
                };
                /** @description Not found */
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
    "/api/v2/chart/{metric}/protocol/{protocol}/version-breakdown": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get protocol timeseries chart data breakdown by version
         * @description Returns an array of [timestamp, {version: value}] pairs showing the metric for a specific protocol broken down by version (e.g. Aave V2, Aave V3).
         */
        get: {
            parameters: {
                query?: {
                    /**
                     * @description Metric-specific data type to return. Supported values per metric:
                     *     - **fees**: dailyFees (default), dailyRevenue, dailySupplySideRevenue, dailyHoldersRevenue, dailyProtocolRevenue
                     *     - **liquidations**: dailyLiquidationsVolume (default), dailyCollateralLiquidated
                     *     - **dexs**: dailyVolume (default), dailyNotionalVolume
                     *     - **derivatives**: dailyVolume (default), dailyNotionalVolume
                     *     - **options**: dailyNotionalVolume (default), dailyPremiumVolume
                     *     - **aggregators**: dailyVolume (default)
                     *     - **bridge-aggregators**: dailyBridgeVolume (default)
                     *     - **open-interest**: openInterestAtEnd (default), shortOpenInterestAtEnd, longOpenInterestAtEnd
                     *     - **normalized-volume**: dailyNormalizedVolume (default), dailyActiveLiquidity
                     */
                    dataType?: string;
                };
                header?: never;
                path: {
                    /** @description The dimension metric type */
                    metric: "fees" | "liquidations" | "dexs" | "derivatives" | "options" | "aggregators" | "bridge-aggregators" | "open-interest" | "normalized-volume";
                    /** @description protocol slug (slugified protocol name) */
                    protocol: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Array of [timestamp, versionBreakdown] pairs */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": unknown[];
                    };
                };
                /** @description Not found */
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
    "/api/v2/chart/{metric}/protocol/{protocol}/label-breakdown": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get protocol timeseries chart data breakdown by label
         * @description Returns an array of [timestamp, {label: value}] pairs showing the metric for a specific protocol broken down by label (e.g. Borrow Interest, Flash Loans). Currently only supported for metric=fees.
         */
        get: {
            parameters: {
                query?: {
                    /**
                     * @description Metric-specific data type to return. Supported values per metric:
                     *     - **fees**: dailyFees (default), dailyRevenue, dailySupplySideRevenue, dailyHoldersRevenue, dailyProtocolRevenue
                     *     - **liquidations**: dailyLiquidationsVolume (default), dailyCollateralLiquidated
                     *     - **dexs**: dailyVolume (default), dailyNotionalVolume
                     *     - **derivatives**: dailyVolume (default), dailyNotionalVolume
                     *     - **options**: dailyNotionalVolume (default), dailyPremiumVolume
                     *     - **aggregators**: dailyVolume (default)
                     *     - **bridge-aggregators**: dailyBridgeVolume (default)
                     *     - **open-interest**: openInterestAtEnd (default), shortOpenInterestAtEnd, longOpenInterestAtEnd
                     *     - **normalized-volume**: dailyNormalizedVolume (default), dailyActiveLiquidity
                     */
                    dataType?: string;
                };
                header?: never;
                path: {
                    /** @description The dimension metric type */
                    metric: "fees" | "liquidations" | "dexs" | "derivatives" | "options" | "aggregators" | "bridge-aggregators" | "open-interest" | "normalized-volume";
                    /** @description protocol slug (slugified protocol name) */
                    protocol: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Array of [timestamp, labelBreakdown] pairs */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": unknown[];
                    };
                };
                /** @description Not found */
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
    "/api/v2/metrics/{metric}/category/{category}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get category dimension data overview
         * @description Returns aggregate metrics for the specified dimension filtered by a specific category.
         */
        get: {
            parameters: {
                query?: {
                    /**
                     * @description Metric-specific data type to return. Supported values per metric:
                     *     - **fees**: dailyFees (default), dailyRevenue, dailySupplySideRevenue, dailyHoldersRevenue, dailyProtocolRevenue
                     *     - **liquidations**: dailyLiquidationsVolume (default), dailyCollateralLiquidated
                     *     - **dexs**: dailyVolume (default), dailyNotionalVolume
                     *     - **derivatives**: dailyVolume (default), dailyNotionalVolume
                     *     - **options**: dailyNotionalVolume (default), dailyPremiumVolume
                     *     - **aggregators**: dailyVolume (default)
                     *     - **bridge-aggregators**: dailyBridgeVolume (default)
                     *     - **open-interest**: openInterestAtEnd (default), shortOpenInterestAtEnd, longOpenInterestAtEnd
                     *     - **normalized-volume**: dailyNormalizedVolume (default), dailyActiveLiquidity
                     */
                    dataType?: string;
                };
                header?: never;
                path: {
                    /** @description The dimension metric type */
                    metric: "fees" | "liquidations" | "dexs" | "derivatives" | "options" | "aggregators" | "bridge-aggregators" | "open-interest" | "normalized-volume";
                    /** @description category slug (slugified category name, e.g. 'dexs', 'prediction-market', 'options') */
                    category: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Category dimension metrics overview */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /**
                             * @example [
                             *       "Ethereum",
                             *       "Solana",
                             *       "BSC",
                             *       "Base"
                             *     ]
                             */
                            allChains?: string[];
                            /** @example 42000000 */
                            total24h?: number;
                            /** @example 38000000 */
                            total48hto24h?: number;
                            /** @example 280000000 */
                            total7d?: number;
                            /** @example 260000000 */
                            total14dto7d?: number;
                            /** @example 1100000000 */
                            total60dto30d?: number;
                            /** @example 1200000000 */
                            total30d?: number;
                            /** @example 15000000000 */
                            total1y?: number;
                            /** @example 10.5 */
                            change_1d?: number;
                            /** @example 7.8 */
                            change_7d?: number;
                            /** @example 9.1 */
                            change_1m?: number;
                            /** @example 5.2 */
                            change_7dover7d?: number;
                            /** @example 8.3 */
                            change_30dover30d?: number;
                            /** @example Dexs */
                            category?: string;
                            /**
                             * @example [
                             *       "Dexs",
                             *       "Lending",
                             *       "Bridge",
                             *       "Derivatives"
                             *     ]
                             */
                            allCategories?: string[];
                        };
                    };
                };
                /** @description Not found */
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
    "/api/v2/chart/{metric}/category/{category}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get category historical timeseries chart data
         * @description Returns an array of [timestamp, value] pairs for the metric filtered by a specific category.
         */
        get: {
            parameters: {
                query?: {
                    /**
                     * @description Metric-specific data type to return. Supported values per metric:
                     *     - **fees**: dailyFees (default), dailyRevenue, dailySupplySideRevenue, dailyHoldersRevenue, dailyProtocolRevenue
                     *     - **liquidations**: dailyLiquidationsVolume (default), dailyCollateralLiquidated
                     *     - **dexs**: dailyVolume (default), dailyNotionalVolume
                     *     - **derivatives**: dailyVolume (default), dailyNotionalVolume
                     *     - **options**: dailyNotionalVolume (default), dailyPremiumVolume
                     *     - **aggregators**: dailyVolume (default)
                     *     - **bridge-aggregators**: dailyBridgeVolume (default)
                     *     - **open-interest**: openInterestAtEnd (default), shortOpenInterestAtEnd, longOpenInterestAtEnd
                     *     - **normalized-volume**: dailyNormalizedVolume (default), dailyActiveLiquidity
                     */
                    dataType?: string;
                };
                header?: never;
                path: {
                    /** @description The dimension metric type */
                    metric: "fees" | "liquidations" | "dexs" | "derivatives" | "options" | "aggregators" | "bridge-aggregators" | "open-interest" | "normalized-volume";
                    /** @description category slug (slugified category name, e.g. 'dexs', 'prediction-market', 'options') */
                    category: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Array of [timestamp, value] pairs */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": number[][];
                    };
                };
                /** @description Not found */
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
    "/api/v2/chart/{metric}/category/{category}/chain-breakdown": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get category timeseries chart data breakdown by chain
         * @description Returns an array of [timestamp, {chain: value}] pairs showing the metric for a specific category broken down by chain.
         */
        get: {
            parameters: {
                query?: {
                    /**
                     * @description Metric-specific data type to return. Supported values per metric:
                     *     - **fees**: dailyFees (default), dailyRevenue, dailySupplySideRevenue, dailyHoldersRevenue, dailyProtocolRevenue
                     *     - **liquidations**: dailyLiquidationsVolume (default), dailyCollateralLiquidated
                     *     - **dexs**: dailyVolume (default), dailyNotionalVolume
                     *     - **derivatives**: dailyVolume (default), dailyNotionalVolume
                     *     - **options**: dailyNotionalVolume (default), dailyPremiumVolume
                     *     - **aggregators**: dailyVolume (default)
                     *     - **bridge-aggregators**: dailyBridgeVolume (default)
                     *     - **open-interest**: openInterestAtEnd (default), shortOpenInterestAtEnd, longOpenInterestAtEnd
                     *     - **normalized-volume**: dailyNormalizedVolume (default), dailyActiveLiquidity
                     */
                    dataType?: string;
                };
                header?: never;
                path: {
                    /** @description The dimension metric type */
                    metric: "fees" | "liquidations" | "dexs" | "derivatives" | "options" | "aggregators" | "bridge-aggregators" | "open-interest" | "normalized-volume";
                    /** @description category slug (slugified category name, e.g. 'dexs', 'prediction-market', 'options') */
                    category: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Array of [timestamp, chainBreakdown] pairs */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": unknown[];
                    };
                };
                /** @description Not found */
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
    "/api/v2/chart/{metric}/category/{category}/protocol-breakdown": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get category timeseries chart data breakdown by protocol
         * @description Returns an array of [timestamp, {protocol: value}] pairs showing the metric for a specific category broken down by protocol.
         */
        get: {
            parameters: {
                query?: {
                    /**
                     * @description Metric-specific data type to return. Supported values per metric:
                     *     - **fees**: dailyFees (default), dailyRevenue, dailySupplySideRevenue, dailyHoldersRevenue, dailyProtocolRevenue
                     *     - **liquidations**: dailyLiquidationsVolume (default), dailyCollateralLiquidated
                     *     - **dexs**: dailyVolume (default), dailyNotionalVolume
                     *     - **derivatives**: dailyVolume (default), dailyNotionalVolume
                     *     - **options**: dailyNotionalVolume (default), dailyPremiumVolume
                     *     - **aggregators**: dailyVolume (default)
                     *     - **bridge-aggregators**: dailyBridgeVolume (default)
                     *     - **open-interest**: openInterestAtEnd (default), shortOpenInterestAtEnd, longOpenInterestAtEnd
                     *     - **normalized-volume**: dailyNormalizedVolume (default), dailyActiveLiquidity
                     */
                    dataType?: string;
                };
                header?: never;
                path: {
                    /** @description The dimension metric type */
                    metric: "fees" | "liquidations" | "dexs" | "derivatives" | "options" | "aggregators" | "bridge-aggregators" | "open-interest" | "normalized-volume";
                    /** @description category slug (slugified category name, e.g. 'dexs', 'prediction-market', 'options') */
                    category: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Array of [timestamp, protocolBreakdown] pairs */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": unknown[];
                    };
                };
                /** @description Not found */
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
    "/api/v2/metrics/{metric}/category/{category}/chain/{chain}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get category chain dimension data overview
         * @description Returns aggregate metrics for the specified dimension filtered by both category and chain.
         */
        get: {
            parameters: {
                query?: {
                    /**
                     * @description Metric-specific data type to return. Supported values per metric:
                     *     - **fees**: dailyFees (default), dailyRevenue, dailySupplySideRevenue, dailyHoldersRevenue, dailyProtocolRevenue
                     *     - **liquidations**: dailyLiquidationsVolume (default), dailyCollateralLiquidated
                     *     - **dexs**: dailyVolume (default), dailyNotionalVolume
                     *     - **derivatives**: dailyVolume (default), dailyNotionalVolume
                     *     - **options**: dailyNotionalVolume (default), dailyPremiumVolume
                     *     - **aggregators**: dailyVolume (default)
                     *     - **bridge-aggregators**: dailyBridgeVolume (default)
                     *     - **open-interest**: openInterestAtEnd (default), shortOpenInterestAtEnd, longOpenInterestAtEnd
                     *     - **normalized-volume**: dailyNormalizedVolume (default), dailyActiveLiquidity
                     */
                    dataType?: string;
                };
                header?: never;
                path: {
                    /** @description The dimension metric type */
                    metric: "fees" | "liquidations" | "dexs" | "derivatives" | "options" | "aggregators" | "bridge-aggregators" | "open-interest" | "normalized-volume";
                    /** @description category slug (slugified category name, e.g. 'dexs', 'prediction-market', 'options') */
                    category: string;
                    /** @description chain name */
                    chain: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Category chain dimension metrics overview */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /**
                             * @example [
                             *       "Ethereum",
                             *       "Solana",
                             *       "BSC",
                             *       "Base"
                             *     ]
                             */
                            allChains?: string[];
                            /** @example 42000000 */
                            total24h?: number;
                            /** @example 38000000 */
                            total48hto24h?: number;
                            /** @example 280000000 */
                            total7d?: number;
                            /** @example 260000000 */
                            total14dto7d?: number;
                            /** @example 1100000000 */
                            total60dto30d?: number;
                            /** @example 1200000000 */
                            total30d?: number;
                            /** @example 15000000000 */
                            total1y?: number;
                            /** @example 10.5 */
                            change_1d?: number;
                            /** @example 7.8 */
                            change_7d?: number;
                            /** @example 9.1 */
                            change_1m?: number;
                            /** @example 5.2 */
                            change_7dover7d?: number;
                            /** @example 8.3 */
                            change_30dover30d?: number;
                            /** @example Dexs */
                            category?: string;
                            /**
                             * @example [
                             *       "Dexs",
                             *       "Lending",
                             *       "Bridge",
                             *       "Derivatives"
                             *     ]
                             */
                            allCategories?: string[];
                            /** @example Ethereum */
                            chain?: string;
                        };
                    };
                };
                /** @description Not found */
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
    "/api/v2/chart/{metric}/category/{category}/chain/{chain}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get category chain historical timeseries chart data
         * @description Returns an array of [timestamp, value] pairs for the metric filtered by both category and chain.
         */
        get: {
            parameters: {
                query?: {
                    /**
                     * @description Metric-specific data type to return. Supported values per metric:
                     *     - **fees**: dailyFees (default), dailyRevenue, dailySupplySideRevenue, dailyHoldersRevenue, dailyProtocolRevenue
                     *     - **liquidations**: dailyLiquidationsVolume (default), dailyCollateralLiquidated
                     *     - **dexs**: dailyVolume (default), dailyNotionalVolume
                     *     - **derivatives**: dailyVolume (default), dailyNotionalVolume
                     *     - **options**: dailyNotionalVolume (default), dailyPremiumVolume
                     *     - **aggregators**: dailyVolume (default)
                     *     - **bridge-aggregators**: dailyBridgeVolume (default)
                     *     - **open-interest**: openInterestAtEnd (default), shortOpenInterestAtEnd, longOpenInterestAtEnd
                     *     - **normalized-volume**: dailyNormalizedVolume (default), dailyActiveLiquidity
                     */
                    dataType?: string;
                };
                header?: never;
                path: {
                    /** @description The dimension metric type */
                    metric: "fees" | "liquidations" | "dexs" | "derivatives" | "options" | "aggregators" | "bridge-aggregators" | "open-interest" | "normalized-volume";
                    /** @description category slug (slugified category name, e.g. 'dexs', 'prediction-market', 'options') */
                    category: string;
                    /** @description chain name */
                    chain: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Array of [timestamp, value] pairs */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": number[][];
                    };
                };
                /** @description Not found */
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
    "/api/v2/chart/{metric}/category/{category}/chain/{chain}/protocol-breakdown": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get category chain timeseries chart data breakdown by protocol
         * @description Returns an array of [timestamp, {protocol: value}] pairs showing the metric filtered by both category and chain, broken down by protocol.
         */
        get: {
            parameters: {
                query?: {
                    /**
                     * @description Metric-specific data type to return. Supported values per metric:
                     *     - **fees**: dailyFees (default), dailyRevenue, dailySupplySideRevenue, dailyHoldersRevenue, dailyProtocolRevenue
                     *     - **liquidations**: dailyLiquidationsVolume (default), dailyCollateralLiquidated
                     *     - **dexs**: dailyVolume (default), dailyNotionalVolume
                     *     - **derivatives**: dailyVolume (default), dailyNotionalVolume
                     *     - **options**: dailyNotionalVolume (default), dailyPremiumVolume
                     *     - **aggregators**: dailyVolume (default)
                     *     - **bridge-aggregators**: dailyBridgeVolume (default)
                     *     - **open-interest**: openInterestAtEnd (default), shortOpenInterestAtEnd, longOpenInterestAtEnd
                     *     - **normalized-volume**: dailyNormalizedVolume (default), dailyActiveLiquidity
                     */
                    dataType?: string;
                };
                header?: never;
                path: {
                    /** @description The dimension metric type */
                    metric: "fees" | "liquidations" | "dexs" | "derivatives" | "options" | "aggregators" | "bridge-aggregators" | "open-interest" | "normalized-volume";
                    /** @description category slug (slugified category name, e.g. 'dexs', 'prediction-market', 'options') */
                    category: string;
                    /** @description chain name */
                    chain: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Array of [timestamp, protocolBreakdown] pairs */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": unknown[];
                    };
                };
                /** @description Not found */
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
    "/api/v2/metrics/financial-statement/protocol/{protocol}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get protocol income statement report
         * @description Returns protocol metadata, methodology details, and aggregated financial statement data (yearly, quarterly, monthly). Each period contains line items such as Gross Protocol Revenue, Cost Of Revenue, Gross Profit, Token Holder Net Income, Incentives, and Earnings, with values and optional label breakdowns.
         *
         *     When querying a parent protocol (e.g. `aave`), the response includes a `childProtocols` array with per-version methodology. When querying a child protocol (e.g. `aave-v3`), methodology and breakdownMethodology are at the top level.
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description protocol slug (e.g. aave-v3, hyperliquid) */
                    protocol: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Protocol income statement report */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /**
                             * @description Protocol ID. Parent protocols use 'parent#slug' format.
                             * @example 1599
                             */
                            id?: string;
                            /** @example Aave V3 */
                            name?: string;
                            /** @example 0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9 */
                            address?: string | null;
                            /** @example AAVE */
                            symbol?: string | null;
                            /** @example https://aave.com */
                            url?: string;
                            /** @example Earn interest, borrow assets, and build applications */
                            description?: string;
                            /**
                             * @description Primary chain (present for child protocols)
                             * @example Optimism
                             */
                            chain?: string | null;
                            /** @example https://icons.llamao.fi/icons/protocols/aave-v3.png */
                            logo?: string;
                            /** @example 2 */
                            audits?: string | null;
                            /**
                             * @example [
                             *       "https://aave.com/security"
                             *     ]
                             */
                            audit_links?: string[] | null;
                            /**
                             * @description Protocol category (present for child protocols)
                             * @example Lending
                             */
                            category?: string | null;
                            /**
                             * @example [
                             *       "Polygon",
                             *       "Arbitrum",
                             *       "Avalanche",
                             *       "OP Mainnet",
                             *       "Ethereum",
                             *       "Base"
                             *     ]
                             */
                            chains?: string[];
                            /** @description Oracles used by the protocol */
                            oraclesBreakdown?: {
                                /** @example Chainlink */
                                name?: string;
                                /** @example Primary */
                                type?: string;
                                proof?: string[];
                            }[] | null;
                            /** @example aave-v3 */
                            module?: string | null;
                            /** @example aave */
                            twitter?: string | null;
                            github?: string[] | null;
                            /**
                             * @description Unix timestamp when protocol was listed
                             * @example 1648776877
                             */
                            listedAt?: number | null;
                            /**
                             * @description Parent protocol ID (present for child protocols)
                             * @example parent#aave
                             */
                            parentProtocol?: string | null;
                            /**
                             * @description Available dimension adapters for this protocol
                             * @example {
                             *       "fees": {
                             *         "genuineSpikes": [
                             *           [
                             *             "2024-08-05",
                             *             "-"
                             *           ]
                             *         ],
                             *         "adapter": "aave-v3"
                             *       },
                             *       "liquidations": "aave-v3"
                             *     }
                             */
                            dimensions?: {
                                [key: string]: string | {
                                    adapter?: string;
                                    genuineSpikes?: unknown[];
                                };
                            } | null;
                            /**
                             * @description Maps line item names to descriptions. Present at top level for child protocols, inside childProtocols for parent protocols.
                             * @example {
                             *       "Gross Protocol Revenue": "Include borrow interest, flashloan fee, liquidation fee, penalty paid by borrowers and swap fees from Paraswap.",
                             *       "Cost Of Revenue": "Amount of fees distributed to suppliers.",
                             *       "Gross Profit": "Amount of fees go to Aave treasury.",
                             *       "Token Holder Net Income": "Aave starts buy back AAVE tokens using Aave Treasury after 9th April 2025."
                             *     }
                             */
                            methodology?: {
                                [key: string]: string;
                            } | null;
                            /**
                             * @description Maps line item names to objects mapping label names to descriptions. Present at top level for child protocols, inside childProtocols for parent protocols.
                             * @example {
                             *       "Gross Protocol Revenue": {
                             *         "Borrow Interest": "All interest paid by borrowers from all markets (excluding GHO).",
                             *         "Borrow Interest GHO": "All interest paid by borrowers from GHO only.",
                             *         "Liquidation Fees": "Fees from liquidation penalty and bonuses.",
                             *         "Flashloan Fees": "Flashloan fees paid by flashloan borrowers and executors.",
                             *         "Paraswap Partner Fees": "Swap fees share from Paraswap from users by using Aave frontend."
                             *       },
                             *       "Cost Of Revenue": {
                             *         "Borrow Interest": "Amount of interest distributed to lenders from all markets (excluding GHO).",
                             *         "Liquidation Fees": "Fees from liquidation penalty and bonuses are distributed to lenders."
                             *       },
                             *       "Gross Profit": {
                             *         "Borrow Interest": "A portion of interest paid by borrowers from all markets (excluding GHO).",
                             *         "Borrow Interest GHO": "All 100% interest paid by GHO borrowers.",
                             *         "Liquidation Fees": "A portion of fees from liquidation penalty and bonuses."
                             *       },
                             *       "Token Holder Net Income": {
                             *         "Token Buy Back": "Aave starts buy back AAVE tokens using Aave Treasury after 9th April 2025."
                             *       }
                             *     }
                             */
                            breakdownMethodology?: {
                                [key: string]: {
                                    [key: string]: string;
                                };
                            } | null;
                            /** @example https://github.com/DefiLlama/dimension-adapters/blob/master/fees/aave-v3.ts */
                            methodologyURL?: string | null;
                            /** @example https://github.com/DefiLlama/DefiLlama-Adapters/blob/main/projects/aave-v3/index.js */
                            tvlCodePath?: string | null;
                            /**
                             * @description Notable events as [timestamp, description] pairs
                             * @example [
                             *       [
                             *         1650412800,
                             *         "Start AVAX Rewards"
                             *       ],
                             *       [
                             *         1659571200,
                             *         "Start OP Rewards"
                             *       ]
                             *     ]
                             */
                            hallmarks?: unknown[][] | null;
                            /**
                             * @example [
                             *       "Aave",
                             *       "Aave V2",
                             *       "Aave V3"
                             *     ]
                             */
                            linkedProtocols?: string[];
                            /** @description Child protocol versions with their methodology details. Only present for parent protocols. */
                            childProtocols?: {
                                /** @example Aave V3 */
                                name?: string;
                                /** @example 1599 */
                                defillamaId?: string;
                                displayName?: string;
                                methodologyURL?: string | null;
                                methodology?: {
                                    [key: string]: string;
                                };
                                breakdownMethodology?: {
                                    [key: string]: {
                                        [key: string]: string;
                                    };
                                };
                            }[] | null;
                            /** @example true */
                            hasLabelBreakdown?: boolean;
                            /** @example 1599 */
                            defillamaId?: string;
                            /** @example Aave V3 */
                            displayName?: string;
                            /** @example aave-v3 */
                            slug?: string;
                            /** @example protocol */
                            protocolType?: string;
                            /** @description Financial data aggregated by time period */
                            aggregates?: {
                                /** @description Keyed by year (e.g. '2024'). Each value is an object of line items. */
                                yearly?: {
                                    [key: string]: {
                                        [key: string]: {
                                            /**
                                             * @description Total USD value for this line item in the period
                                             * @example 456472580
                                             */
                                            value?: number;
                                            /**
                                             * @description Breakdown by label (e.g. Borrow Interest, Liquidation Fees, Flash Loans). Not present for all line items.
                                             * @example {
                                             *       "Borrow Interest": 416862749,
                                             *       "Liquidation Fees": 31413361,
                                             *       "Flashloan Fees": 1441
                                             *     }
                                             */
                                            "by-label"?: {
                                                [key: string]: number;
                                            } | null;
                                        };
                                    };
                                };
                                /** @description Keyed by quarter (e.g. '2024-Q1'). Each value is an object of line items. */
                                quarterly?: {
                                    [key: string]: {
                                        [key: string]: {
                                            /**
                                             * @description Total USD value for this line item in the period
                                             * @example 456472580
                                             */
                                            value?: number;
                                            /** @description Breakdown by label. Not present for all line items. */
                                            "by-label"?: {
                                                [key: string]: number;
                                            } | null;
                                        };
                                    };
                                };
                                /** @description Keyed by month (e.g. '2024-01'). Each value is an object of line items. */
                                monthly?: {
                                    [key: string]: {
                                        [key: string]: {
                                            /**
                                             * @description Total USD value for this line item in the period
                                             * @example 456472580
                                             */
                                            value?: number;
                                            /** @description Breakdown by label. Not present for all line items. */
                                            "by-label"?: {
                                                [key: string]: number;
                                            } | null;
                                        };
                                    };
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
    "/stablecoins/stablecoindominance/{chain}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get stablecoin dominance per chain along with the info about the larges coin in a chain */
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
                /** @description successful operation */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @example 1752796800 */
                            date?: string;
                            totalCirculatingUSD?: {
                                /** @example 129531632690.44954 */
                                peggedUSD?: number;
                                /** @example 100466426.71408615 */
                                peggedVAR?: number;
                                /** @example 286714265.91542196 */
                                peggedEUR?: number;
                            };
                            greatestMcap?: {
                                /** @example tether */
                                gecko_id?: string;
                                /** @example USDT */
                                symbol?: string;
                                /** @example 65836754910.17763 */
                                mcap?: number;
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
    "/yields/pools": {
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
    "/yields/poolsOld": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Same as /pools but it also includes a new parameter `pool_old` which usually contains pool address (but not guaranteed) */
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
                        "application/json": {
                            /** @example success */
                            status?: string;
                            data?: {
                                /** @example 747c1d2a-c668-4682-b9f9-296708a3dd90 */
                                pool?: string;
                                /** @example 2025-07-18T16:01:37.482Z */
                                timestamp?: string;
                                /** @example lido */
                                project?: string;
                                /** @example Ethereum */
                                chain?: string;
                                /** @example STETH */
                                symbol?: string;
                                /** @example null */
                                poolMeta?: string | null;
                                /**
                                 * @example [
                                 *       "0x0000000000000000000000000000000000000000"
                                 *     ]
                                 */
                                underlyingTokens?: string[];
                                /** @example null */
                                rewardTokens?: string[] | null;
                                /** @example 32414496934 */
                                tvlUsd?: number;
                                /** @example 2.84 */
                                apy?: number;
                                /** @example 2.84 */
                                apyBase?: number;
                                /** @example null */
                                apyReward?: number | null;
                                /** @example null */
                                il7d?: number | null;
                                /** @example null */
                                apyBase7d?: number | null;
                                /** @example null */
                                volumeUsd1d?: number | null;
                                /** @example null */
                                volumeUsd7d?: number | null;
                                /** @example null */
                                apyBaseInception?: number | null;
                                /** @example https://lido.fi/#networks */
                                url?: string;
                                /** @example -0.04 */
                                apyPct1D?: number;
                                /** @example -0.056 */
                                apyPct7D?: number;
                                /** @example null */
                                apyPct30D?: number | null;
                                /** @example 2.73524 */
                                apyMean30d?: number;
                                /** @example false */
                                stablecoin?: boolean;
                                /** @example no */
                                ilRisk?: string;
                                /** @example single */
                                exposure?: string;
                                /** @example 0.00008 */
                                return?: number;
                                /** @example 1141 */
                                count?: number;
                                /** @example 3.77993 */
                                apyMeanExpanding?: number;
                                /** @example 1.04969 */
                                apyStdExpanding?: number;
                                /** @example 3.7747 */
                                mu?: number;
                                /** @example 0.05236 */
                                sigma?: number;
                                /** @example false */
                                outlier?: boolean;
                                /** @example -1 */
                                project_factorized?: number;
                                /** @example 0 */
                                chain_factorized?: number;
                                predictions?: {
                                    /** @example Stable/Up */
                                    predictedClass?: string;
                                    /** @example 74 */
                                    predictedProbability?: number;
                                    /** @example 2 */
                                    binnedConfidence?: number;
                                };
                                /** @example 0xae7ab96520de3a18e5e111b5eaab095312d7fe84-ethereum */
                                pool_old?: string;
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
    "/yields/chart/{pool}": {
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
                /** @description successful operation */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @example success */
                            status?: string;
                            data?: {
                                /** @example 2022-05-03T00:00:00.000Z */
                                timestamp?: string;
                                /** @example 11074372760 */
                                tvlUsd?: number;
                                /** @example 3.6 */
                                apy?: number;
                                /** @example 3.6 */
                                apyBase?: number;
                                /** @example null */
                                apyReward?: number | null;
                                /** @example null */
                                il7d?: number | null;
                                /** @example null */
                                apyBase7d?: number | null;
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
    "/yields/poolsBorrow": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Borrow costs APY of assets from lending markets */
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
                        "application/json": {
                            /** @example success */
                            status?: string;
                            data?: {
                                /** @example Ethereum */
                                chain?: string;
                                /** @example aave-v3 */
                                project?: string;
                                /** @example WETH */
                                symbol?: string;
                                /** @example 604781668 */
                                tvlUsd?: number;
                                /** @example 3.98975 */
                                apyBase?: number;
                                /** @example null */
                                apyReward?: number | null;
                                /** @example 3.98975 */
                                apy?: number;
                                /** @example null */
                                rewardTokens?: string[] | null;
                                /** @example e880e828-ca59-4ec6-8d4f-27182a4dc23d */
                                pool?: string;
                                /** @example 0.54117 */
                                apyPct1D?: number;
                                /** @example 1.93811 */
                                apyPct7D?: number;
                                /** @example 2.08545 */
                                apyPct30D?: number;
                                /** @example false */
                                stablecoin?: boolean;
                                /** @example no */
                                ilRisk?: string;
                                /** @example single */
                                exposure?: string;
                                predictions?: {
                                    /** @example Stable/Up */
                                    predictedClass?: string;
                                    /** @example 72 */
                                    predictedProbability?: number;
                                    /** @example 2 */
                                    binnedConfidence?: number;
                                };
                                /** @example null */
                                poolMeta?: string | null;
                                /** @example 0.02094 */
                                sigma?: number;
                                /** @example 891 */
                                count?: number;
                                /** @example false */
                                outlier?: boolean;
                                /**
                                 * @example [
                                 *       "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
                                 *     ]
                                 */
                                underlyingTokens?: string[];
                                /** @example null */
                                il7d?: number | null;
                                /** @example null */
                                apyBase7d?: number | null;
                                /** @example 2.15424 */
                                apyMean30d?: number;
                                /** @example null */
                                volumeUsd1d?: number | null;
                                /** @example null */
                                volumeUsd7d?: number | null;
                                /** @example null */
                                apyBaseInception?: number | null;
                                /** @example 5.0324 */
                                apyBaseBorrow?: number;
                                /** @example null */
                                apyRewardBorrow?: number | null;
                                /** @example 8988967658 */
                                totalSupplyUsd?: number;
                                /** @example 8384185990 */
                                totalBorrowUsd?: number;
                                /** @example null */
                                debtCeilingUsd?: number | null;
                                /** @example 0.805 */
                                ltv?: number;
                                /** @example true */
                                borrowable?: boolean;
                                /** @example null */
                                mintedCoin?: string | null;
                                /** @example null */
                                borrowFactor?: number | null;
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
    "/yields/chartLendBorrow/{pool}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Historical borrow cost APY from a pool on a lending market, pool ids should be obtained from /poolsBorrow */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description pool id, can be retrieved from /poolsBorrow (property is called pool) */
                    pool: string;
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
                            /** @example success */
                            status?: string;
                            data?: {
                                /** @example 2023-02-06T23:01:24.670Z */
                                timestamp?: string;
                                /** @example 60767153 */
                                totalSupplyUsd?: number | null;
                                /** @example 33150230 */
                                totalBorrowUsd?: number | null;
                                /** @example null */
                                debtCeilingUsd?: number | null;
                                /** @example 1.66533 */
                                apyBase?: number | null;
                                /** @example null */
                                apyReward?: number | null;
                                /** @example 3.59132 */
                                apyBaseBorrow?: number | null;
                                /** @example null */
                                apyRewardBorrow?: number | null;
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
    "/yields/perps": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Funding rates and Open Interest of perps across exchanges, including both Decentralized and Centralized */
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
                        "application/json": {
                            /** @example success */
                            status?: string;
                            data?: {
                                /** @example 61533906-1626-45fc-b3ed-9a1103705373 */
                                perp_id?: string;
                                /** @example 2025-07-18T18:01:44.811Z */
                                timestamp?: string;
                                /** @example Binance */
                                marketplace?: string;
                                /** @example 1000000BOBUSDT */
                                market?: string;
                                /** @example 1000000BOT */
                                baseAsset?: string;
                                /** @example 0.00005 */
                                fundingRate?: number;
                                /** @example 0.00045224 */
                                fundingRatePrevious?: number;
                                /** @example 1752854400000 */
                                fundingTimePrevious?: number;
                                /** @example 51144394 */
                                openInterest?: number;
                                /** @example 0.05108 */
                                indexPrice?: number;
                                /** @example null */
                                fundingRate7dAverage?: number | null;
                                /** @example null */
                                fundingRate7dSum?: number | null;
                                /** @example null */
                                fundingRate30dAverage?: number | null;
                                /** @example null */
                                fundingRate30dSum?: number | null;
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
    "/api/lstRates": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Exchange rates and ETH peg of liquid staking tokens
         * @description Latest expected (contract) redemption rate, executable market rate and resulting ETH peg for major LSTs.
         */
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
                        /**
                         * @example [
                         *       {
                         *         "name": "Lido",
                         *         "symbol": "stETH",
                         *         "address": "0xae7ab96520de3a18e5e111b5eaab095312d7fe84",
                         *         "type": "rebase",
                         *         "expectedRate": 1,
                         *         "marketRate": 0.9997,
                         *         "ethPeg": -0.03,
                         *         "fee": 0.1
                         *       },
                         *       {
                         *         "name": "StakeWise V3",
                         *         "symbol": "osETH",
                         *         "address": "0xf1C9acDc66974dFB6dEcB12aA385b9cD01190E38",
                         *         "type": "accruing",
                         *         "expectedRate": 1.0775,
                         *         "marketRate": 1.0615,
                         *         "ethPeg": -1.48,
                         *         "fee": 0.05
                         *       },
                         *       {
                         *         "name": "Bifrost Liquid Staking",
                         *         "symbol": "vETH",
                         *         "address": "0x4Bc3263Eb5bb2Ef7Ad9aB6FB68be80E43b43801F",
                         *         "type": "accruing",
                         *         "expectedRate": 1.1353,
                         *         "marketRate": null,
                         *         "ethPeg": null,
                         *         "fee": null
                         *       }
                         *     ]
                         */
                        "application/json": {
                            /** @description The name of the protocol issuing the LST */
                            name?: string;
                            /** @description The symbol of the LST */
                            symbol?: string | null;
                            /** @description The contract address of the LST */
                            address?: string;
                            /** @description The type of the LST (rebase or accruing) */
                            type?: string | null;
                            /** @description ETH per token owed by the protocol, read from its contract */
                            expectedRate?: number | null;
                            /** @description Executable market rate in ETH per token; null when no credible market quote exists */
                            marketRate?: number | null;
                            /** @description Percent deviation of the market rate from the expected rate */
                            ethPeg?: number | null;
                            /** @description The protocol fee percentage */
                            fee?: number | null;
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
    "/yields/v2/earn": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Retrieve the latest data for all earn pools
         * @description Returns every tracked earn pool (supply-side yield), sorted by TVL descending. APY values are percentages, attributed into `base` (organic), `reward` (incentive emissions) and `total` (base + reward) over `current`, `avg_7d` and `avg_30d` windows. Pools whose underlying token is itself yield-bearing additionally report that yield under `intrinsic`; it is not included in the pool APY. For a filtered, paginated variant of the same rows use `/yields/v2/earn/query`.
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Array of all earn pools */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data?: {
                                /**
                                 * @description Pool id (UUID). Same id space as the v1 yields API pool field.
                                 * @example 747c1d2a-c668-4682-b9f9-296708a3dd90
                                 */
                                id?: string;
                                /**
                                 * @description Stable pool key.
                                 * @example 0xae7ab96520de3a18e5e111b5eaab095312d7fe84-ethereum
                                 */
                                pool_key?: string;
                                /** @description Receipt / vault token representing the position; null when the pool has no transferable pool token */
                                pool_token?: {
                                    /** @example 0xae7ab96520de3a18e5e111b5eaab095312d7fe84 */
                                    address?: string;
                                    /** @example stETH */
                                    symbol?: string | null;
                                    /** @example Liquid staked Ether 2.0 */
                                    name?: string | null;
                                } | null;
                                /** @description Display strings for listings */
                                display?: {
                                    /** @example stETH */
                                    label?: string | null;
                                    /** @example Liquid staked Ether 2.0 */
                                    detail?: string | null;
                                };
                                /**
                                 * @description The asset you provide to enter the pool (e.g. ETH, USDC, BTC)
                                 * @example ETH
                                 */
                                reference_asset_symbol?: string | null;
                                /**
                                 * @description Pool page on the protocol app
                                 * @example https://lido.fi/#networks
                                 */
                                url?: string | null;
                                /**
                                 * @description Protocol display name
                                 * @example Lido
                                 */
                                protocol?: string;
                                /**
                                 * @description Chain display name
                                 * @example Ethereum
                                 */
                                chain?: string;
                                /** @description Tokens deposited into the pool */
                                underlying_tokens?: {
                                    /** @example 0x0000000000000000000000000000000000000000 */
                                    address?: string;
                                    /** @example ETH */
                                    symbol?: string | null;
                                    /** @example 18 */
                                    decimals?: number | null;
                                }[];
                                /** @description Incentive tokens currently emitted to the pool; empty when there are none */
                                reward_tokens?: {
                                    /** @example 0xd533a949740bb3306d119cc777fa900ba034cd52 */
                                    address?: string;
                                    /** @example CRV */
                                    symbol?: string | null;
                                    /** @example 18 */
                                    decimals?: number | null;
                                }[];
                                /**
                                 * @description Total value locked in USD
                                 * @example 18050422129
                                 */
                                tvl_usd?: number | null;
                                /** @description Supply APY in percent, attributed into base (organic) and reward (incentive emissions) components */
                                apy?: {
                                    /** @description Latest observed values */
                                    current?: {
                                        /**
                                         * @description Organic APY in percent, excluding incentive rewards
                                         * @example 2.206
                                         */
                                        base?: number | null;
                                        /**
                                         * @description APY in percent from incentive token emissions; null when there are none
                                         * @example null
                                         */
                                        reward?: number | null;
                                        /**
                                         * @description base plus reward, in percent
                                         * @example 2.206
                                         */
                                        total?: number | null;
                                    };
                                    /** @description Trailing 7-day average */
                                    avg_7d?: {
                                        /**
                                         * @description Organic APY in percent, excluding incentive rewards
                                         * @example 2.18932
                                         */
                                        base?: number | null;
                                        /**
                                         * @description APY in percent from incentive token emissions; null when there are none
                                         * @example null
                                         */
                                        reward?: number | null;
                                        /**
                                         * @description base plus reward, in percent
                                         * @example 2.18932
                                         */
                                        total?: number | null;
                                    };
                                    /** @description Trailing 30-day average */
                                    avg_30d?: {
                                        /**
                                         * @description Organic APY in percent, excluding incentive rewards
                                         * @example 2.22409
                                         */
                                        base?: number | null;
                                        /**
                                         * @description APY in percent from incentive token emissions; null when there are none
                                         * @example null
                                         */
                                        reward?: number | null;
                                        /**
                                         * @description base plus reward, in percent
                                         * @example 2.22409
                                         */
                                        total?: number | null;
                                    };
                                };
                                /** @description Yield accruing inside a yield-bearing underlying token, e.g. the stETH staking yield inside a wstETH pool. Intrinsic yield is reported separately and is NOT included in the base/reward/total APY. Null when there is no intrinsic yield source. */
                                intrinsic?: {
                                    /** @description Intrinsic APY in percent */
                                    apy?: {
                                        /** @description Latest observed value */
                                        current?: {
                                            /** @example 3.11 */
                                            base?: number | null;
                                        };
                                        /** @description Trailing 7-day average */
                                        avg_7d?: {
                                            /** @example 3.05 */
                                            base?: number | null;
                                        };
                                        /** @description Trailing 30-day average */
                                        avg_30d?: {
                                            /** @example 3.02 */
                                            base?: number | null;
                                        };
                                    };
                                    source_pool?: {
                                        /**
                                         * @description Earn pool the intrinsic yield is sourced from
                                         * @example 747c1d2a-c668-4682-b9f9-296708a3dd90
                                         */
                                        id?: string;
                                        /**
                                         * @description Address of the yield-bearing token
                                         * @example 0xae7ab96520de3a18e5e111b5eaab095312d7fe84
                                         */
                                        pool_token?: string;
                                        /** @example stETH */
                                        symbol?: string | null;
                                    };
                                } | null;
                                /** @description Stability score (0 to 1) of the trailing 30-day APY series, computed as 1 / (1 + coefficient of variation); higher is steadier. Keyed by APY composition: read the leaf matching the APY components you consume (base, base + reward, base + intrinsic, base + reward + intrinsic). */
                                stability_30d?: {
                                    /** @example 0.9804 */
                                    base?: number | null;
                                    /** @example 0.9804 */
                                    base_reward?: number | null;
                                    /** @example 0.9804 */
                                    base_intrinsic?: number | null;
                                    /** @example 0.9804 */
                                    base_reward_intrinsic?: number | null;
                                };
                                /**
                                 * @description Pool token price per share for vault-style pools; null otherwise
                                 * @example null
                                 */
                                price_per_share?: number | null;
                                /**
                                 * @description Trailing 24h trading volume in USD for DEX pools; null otherwise
                                 * @example null
                                 */
                                volume_1d_usd?: number | null;
                                /** @description Boolean attributes, also available as filters on /yields/v2/earn/query */
                                attributes?: {
                                    /**
                                     * @description All pool assets are stablecoins
                                     * @example false
                                     */
                                    stablecoin_only?: boolean;
                                    /**
                                     * @description Position is exposed to a single asset
                                     * @example true
                                     */
                                    single_asset_exposure?: boolean;
                                    /**
                                     * @description Position can suffer impermanent loss
                                     * @example false
                                     */
                                    impermanent_loss_risk?: boolean;
                                };
                                /** @description Pool token holder statistics; values are null where holder data is not tracked */
                                holders?: {
                                    /**
                                     * @description Number of pool token holders
                                     * @example 618311
                                     */
                                    count?: number | null;
                                    /**
                                     * @description Average position size in USD
                                     * @example 29423.56
                                     */
                                    avg_position_usd?: number | null;
                                    /**
                                     * @description Share of supply held by the top 10 holders, in percent
                                     * @example 61.97
                                     */
                                    top_10_share_pct?: number | null;
                                };
                                /**
                                 * @description Remaining deposit capacity in USD for lending pools with a supply cap (cap minus TVL, floored at 0); null when the pool has no cap
                                 * @example null
                                 */
                                available_supply_usd?: number | null;
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
    "/yields/v2/earn/query": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Retrieve a filtered, paginated page of earn pools
         * @description Same rows as `/yields/v2/earn`, filtered and paginated server-side while keeping the TVL-descending order. All filters combine with AND; `chain` and `protocol` may be repeated to match any of up to 20 values. Unknown query parameters and out-of-range values are rejected with `400 INVALID_QUERY_PARAM`. Without parameters the top 100 pools by TVL are returned.
         */
        get: {
            parameters: {
                query?: {
                    /** @description Chain slug (lowercase). Repeat the parameter to match any of several chains, e.g. chain=ethereum&chain=arbitrum (at most 20 values) */
                    chain?: string;
                    /** @description Protocol slug (lowercase, e.g. aave-v3). Repeat the parameter to match any of several protocols (at most 20 values) */
                    protocol?: string;
                    /** @description true keeps only pools whose assets are all stablecoins, false only the rest */
                    stablecoin?: boolean;
                    /** @description true keeps only pools exposed to a single asset, false only the rest */
                    single_asset_exposure?: boolean;
                    /** @description true keeps only pools with impermanent loss risk, false only the rest */
                    impermanent_loss_risk?: boolean;
                    /** @description Minimum pool TVL in USD (inclusive) */
                    min_tvl?: number;
                    /** @description 1-based page number; default 1 */
                    page?: number;
                    /** @description Page size between 1 and 300; default 100. Values above 300 are rejected, not clamped */
                    limit?: number;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Page of earn pools matching the filters */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data?: {
                                /**
                                 * @description Pool id (UUID). Same id space as the v1 yields API pool field.
                                 * @example 747c1d2a-c668-4682-b9f9-296708a3dd90
                                 */
                                id?: string;
                                /**
                                 * @description Stable pool key.
                                 * @example 0xae7ab96520de3a18e5e111b5eaab095312d7fe84-ethereum
                                 */
                                pool_key?: string;
                                /** @description Receipt / vault token representing the position; null when the pool has no transferable pool token */
                                pool_token?: {
                                    /** @example 0xae7ab96520de3a18e5e111b5eaab095312d7fe84 */
                                    address?: string;
                                    /** @example stETH */
                                    symbol?: string | null;
                                    /** @example Liquid staked Ether 2.0 */
                                    name?: string | null;
                                } | null;
                                /** @description Display strings for listings */
                                display?: {
                                    /** @example stETH */
                                    label?: string | null;
                                    /** @example Liquid staked Ether 2.0 */
                                    detail?: string | null;
                                };
                                /**
                                 * @description The asset you provide to enter the pool (e.g. ETH, USDC, BTC)
                                 * @example ETH
                                 */
                                reference_asset_symbol?: string | null;
                                /**
                                 * @description Pool page on the protocol app
                                 * @example https://lido.fi/#networks
                                 */
                                url?: string | null;
                                /**
                                 * @description Protocol display name
                                 * @example Lido
                                 */
                                protocol?: string;
                                /**
                                 * @description Chain display name
                                 * @example Ethereum
                                 */
                                chain?: string;
                                /** @description Tokens deposited into the pool */
                                underlying_tokens?: {
                                    /** @example 0x0000000000000000000000000000000000000000 */
                                    address?: string;
                                    /** @example ETH */
                                    symbol?: string | null;
                                    /** @example 18 */
                                    decimals?: number | null;
                                }[];
                                /** @description Incentive tokens currently emitted to the pool; empty when there are none */
                                reward_tokens?: {
                                    /** @example 0xd533a949740bb3306d119cc777fa900ba034cd52 */
                                    address?: string;
                                    /** @example CRV */
                                    symbol?: string | null;
                                    /** @example 18 */
                                    decimals?: number | null;
                                }[];
                                /**
                                 * @description Total value locked in USD
                                 * @example 18050422129
                                 */
                                tvl_usd?: number | null;
                                /** @description Supply APY in percent, attributed into base (organic) and reward (incentive emissions) components */
                                apy?: {
                                    /** @description Latest observed values */
                                    current?: {
                                        /**
                                         * @description Organic APY in percent, excluding incentive rewards
                                         * @example 2.206
                                         */
                                        base?: number | null;
                                        /**
                                         * @description APY in percent from incentive token emissions; null when there are none
                                         * @example null
                                         */
                                        reward?: number | null;
                                        /**
                                         * @description base plus reward, in percent
                                         * @example 2.206
                                         */
                                        total?: number | null;
                                    };
                                    /** @description Trailing 7-day average */
                                    avg_7d?: {
                                        /**
                                         * @description Organic APY in percent, excluding incentive rewards
                                         * @example 2.18932
                                         */
                                        base?: number | null;
                                        /**
                                         * @description APY in percent from incentive token emissions; null when there are none
                                         * @example null
                                         */
                                        reward?: number | null;
                                        /**
                                         * @description base plus reward, in percent
                                         * @example 2.18932
                                         */
                                        total?: number | null;
                                    };
                                    /** @description Trailing 30-day average */
                                    avg_30d?: {
                                        /**
                                         * @description Organic APY in percent, excluding incentive rewards
                                         * @example 2.22409
                                         */
                                        base?: number | null;
                                        /**
                                         * @description APY in percent from incentive token emissions; null when there are none
                                         * @example null
                                         */
                                        reward?: number | null;
                                        /**
                                         * @description base plus reward, in percent
                                         * @example 2.22409
                                         */
                                        total?: number | null;
                                    };
                                };
                                /** @description Yield accruing inside a yield-bearing underlying token, e.g. the stETH staking yield inside a wstETH pool. Intrinsic yield is reported separately and is NOT included in the base/reward/total APY. Null when there is no intrinsic yield source. */
                                intrinsic?: {
                                    /** @description Intrinsic APY in percent */
                                    apy?: {
                                        /** @description Latest observed value */
                                        current?: {
                                            /** @example 3.11 */
                                            base?: number | null;
                                        };
                                        /** @description Trailing 7-day average */
                                        avg_7d?: {
                                            /** @example 3.05 */
                                            base?: number | null;
                                        };
                                        /** @description Trailing 30-day average */
                                        avg_30d?: {
                                            /** @example 3.02 */
                                            base?: number | null;
                                        };
                                    };
                                    source_pool?: {
                                        /**
                                         * @description Earn pool the intrinsic yield is sourced from
                                         * @example 747c1d2a-c668-4682-b9f9-296708a3dd90
                                         */
                                        id?: string;
                                        /**
                                         * @description Address of the yield-bearing token
                                         * @example 0xae7ab96520de3a18e5e111b5eaab095312d7fe84
                                         */
                                        pool_token?: string;
                                        /** @example stETH */
                                        symbol?: string | null;
                                    };
                                } | null;
                                /** @description Stability score (0 to 1) of the trailing 30-day APY series, computed as 1 / (1 + coefficient of variation); higher is steadier. Keyed by APY composition: read the leaf matching the APY components you consume (base, base + reward, base + intrinsic, base + reward + intrinsic). */
                                stability_30d?: {
                                    /** @example 0.9804 */
                                    base?: number | null;
                                    /** @example 0.9804 */
                                    base_reward?: number | null;
                                    /** @example 0.9804 */
                                    base_intrinsic?: number | null;
                                    /** @example 0.9804 */
                                    base_reward_intrinsic?: number | null;
                                };
                                /**
                                 * @description Pool token price per share for vault-style pools; null otherwise
                                 * @example null
                                 */
                                price_per_share?: number | null;
                                /**
                                 * @description Trailing 24h trading volume in USD for DEX pools; null otherwise
                                 * @example null
                                 */
                                volume_1d_usd?: number | null;
                                /** @description Boolean attributes, also available as filters on /yields/v2/earn/query */
                                attributes?: {
                                    /**
                                     * @description All pool assets are stablecoins
                                     * @example false
                                     */
                                    stablecoin_only?: boolean;
                                    /**
                                     * @description Position is exposed to a single asset
                                     * @example true
                                     */
                                    single_asset_exposure?: boolean;
                                    /**
                                     * @description Position can suffer impermanent loss
                                     * @example false
                                     */
                                    impermanent_loss_risk?: boolean;
                                };
                                /** @description Pool token holder statistics; values are null where holder data is not tracked */
                                holders?: {
                                    /**
                                     * @description Number of pool token holders
                                     * @example 618311
                                     */
                                    count?: number | null;
                                    /**
                                     * @description Average position size in USD
                                     * @example 29423.56
                                     */
                                    avg_position_usd?: number | null;
                                    /**
                                     * @description Share of supply held by the top 10 holders, in percent
                                     * @example 61.97
                                     */
                                    top_10_share_pct?: number | null;
                                };
                                /**
                                 * @description Remaining deposit capacity in USD for lending pools with a supply cap (cap minus TVL, floored at 0); null when the pool has no cap
                                 * @example null
                                 */
                                available_supply_usd?: number | null;
                            }[];
                            pagination?: {
                                /**
                                 * @description Total number of rows matching the filters, across all pages
                                 * @example 4519
                                 */
                                total?: number;
                                /** @example 1 */
                                page?: number;
                                /** @example 100 */
                                limit?: number;
                            };
                        };
                    };
                };
                /** @description Unknown query parameter or invalid value */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error?: {
                                /** @example INVALID_QUERY_PARAM */
                                code?: string;
                                /** @example unknown query parameter: chains */
                                message?: string;
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
    "/yields/v2/earn/{id}/history": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Retrieve daily history for an earn pool
         * @description Daily TVL, attributed APY and price per share for one earn pool, oldest first. APY carries `avg_1d` (that day), `avg_7d` and `avg_30d` (trailing averages ending that day) windows, each attributed into base/reward/total.
         */
        get: {
            parameters: {
                query?: {
                    /** @description History window; defaults to max (the full series) */
                    range?: "30d" | "90d" | "max";
                };
                header?: never;
                path: {
                    /** @description Earn pool id (UUID) */
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Daily history rows, oldest first */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data?: {
                                /**
                                 * @description Day (UTC)
                                 * @example 2026-07-27
                                 */
                                date?: string;
                                /**
                                 * @description Total value locked in USD at that day
                                 * @example 18233358161
                                 */
                                tvl_usd?: number | null;
                                /** @description Supply APY in percent, attributed into base (organic) and reward (incentive emissions) components */
                                apy?: {
                                    /** @description Average over that day */
                                    avg_1d?: {
                                        /**
                                         * @description Organic APY in percent, excluding incentive rewards
                                         * @example 2.26695
                                         */
                                        base?: number | null;
                                        /**
                                         * @description APY in percent from incentive token emissions; null when there are none
                                         * @example null
                                         */
                                        reward?: number | null;
                                        /**
                                         * @description base plus reward, in percent
                                         * @example 2.26695
                                         */
                                        total?: number | null;
                                    };
                                    /** @description Trailing 7-day average */
                                    avg_7d?: {
                                        /**
                                         * @description Organic APY in percent, excluding incentive rewards
                                         * @example 2.18878
                                         */
                                        base?: number | null;
                                        /**
                                         * @description APY in percent from incentive token emissions; null when there are none
                                         * @example null
                                         */
                                        reward?: number | null;
                                        /**
                                         * @description base plus reward, in percent
                                         * @example 2.18878
                                         */
                                        total?: number | null;
                                    };
                                    /** @description Trailing 30-day average */
                                    avg_30d?: {
                                        /**
                                         * @description Organic APY in percent, excluding incentive rewards
                                         * @example 2.22396
                                         */
                                        base?: number | null;
                                        /**
                                         * @description APY in percent from incentive token emissions; null when there are none
                                         * @example null
                                         */
                                        reward?: number | null;
                                        /**
                                         * @description base plus reward, in percent
                                         * @example 2.22396
                                         */
                                        total?: number | null;
                                    };
                                };
                                /** @description Intrinsic yield of a yield-bearing underlying token. Intrinsic yield is reported separately and is NOT included in the base/reward/total APY. Null when there is no intrinsic yield source. */
                                intrinsic?: {
                                    /** @description Intrinsic APY in percent */
                                    apy?: {
                                        /** @description Average over that day */
                                        avg_1d?: {
                                            /** @example 3.11 */
                                            base?: number | null;
                                        };
                                        /** @description Trailing 7-day average */
                                        avg_7d?: {
                                            /** @example 3.05 */
                                            base?: number | null;
                                        };
                                        /** @description Trailing 30-day average */
                                        avg_30d?: {
                                            /** @example 3.02 */
                                            base?: number | null;
                                        };
                                    };
                                } | null;
                                /**
                                 * @description Pool token price per share for vault-style pools; null otherwise
                                 * @example null
                                 */
                                price_per_share?: number | null;
                            }[];
                        };
                    };
                };
                /** @description No earn pool with this id */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error?: {
                                /** @example POOL_NOT_FOUND */
                                code?: string;
                                /** @example earn pool not found */
                                message?: string;
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
    "/yields/v2/borrow/markets": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Retrieve the latest data for all borrow markets
         * @description One row per borrow market: collateral and debt token, maximum loan-to-value, USD supply/borrow totals and attributed APY for both sides over `current`, `avg_7d` and `avg_30d` windows. Reward emissions offset borrowing costs, so `borrow_cost_apy` totals can be negative (the borrower is net paid).
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Array of all borrow markets */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data?: {
                                /**
                                 * @description Market id (UUID)
                                 * @example e880e828-ca59-4ec6-8d4f-27182a4dc23d
                                 */
                                id?: string;
                                /**
                                 * @description Stable market key.
                                 * @example 0x4d5f47fa6a74757f35c14fd3a6ef8e3c9bc514e8-ethereum
                                 */
                                pool_key?: string;
                                /** @description Receipt / vault token representing the position; null when the market has no transferable pool token */
                                pool_token?: {
                                    /** @example 0x4d5f47fa6a74757f35c14fd3a6ef8e3c9bc514e8 */
                                    address?: string;
                                    /** @example aEthWETH */
                                    symbol?: string | null;
                                    /** @example Aave Ethereum WETH */
                                    name?: string | null;
                                } | null;
                                /** @description Display strings for listings */
                                display?: {
                                    /**
                                     * @description Collateral symbol, or "COLLATERAL / DEBT" for isolated pairs
                                     * @example WETH
                                     */
                                    label?: string | null;
                                    /** @example null */
                                    detail?: string | null;
                                };
                                /**
                                 * @description Market page on the protocol app
                                 * @example https://app.aave.com/reserve-overview/?underlyingAsset=0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2&marketName=proto_mainnet_v3
                                 */
                                url?: string | null;
                                /**
                                 * @description Protocol display name
                                 * @example Aave V3
                                 */
                                protocol?: string;
                                /**
                                 * @description Chain display name
                                 * @example Ethereum
                                 */
                                chain?: string;
                                /** @description Token supplied as collateral; null when unknown */
                                collateral_token?: {
                                    /** @example 0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2 */
                                    address?: string;
                                    /** @example WETH */
                                    symbol?: string | null;
                                    /** @example 18 */
                                    decimals?: number | null;
                                };
                                /** @description Token borrowed from the market; null when unknown */
                                borrow_token?: {
                                    /** @example 0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2 */
                                    address?: string;
                                    /** @example WETH */
                                    symbol?: string | null;
                                    /** @example 18 */
                                    decimals?: number | null;
                                };
                                /** @description Incentive tokens currently emitted to the market; empty when there are none */
                                reward_tokens?: {
                                    /** @example 0xd533a949740bb3306d119cc777fa900ba034cd52 */
                                    address?: string;
                                    /** @example CRV */
                                    symbol?: string | null;
                                    /** @example 18 */
                                    decimals?: number | null;
                                }[];
                                /**
                                 * @description Maximum loan-to-value as a fraction (0.805 = 80.5%)
                                 * @example 0.805
                                 */
                                loan_to_value?: number | null;
                                /**
                                 * @description Total supplied to the market, in USD
                                 * @example 3683494475
                                 */
                                total_supply_usd?: number | null;
                                /**
                                 * @description Total borrowed from the market, in USD
                                 * @example 3022727877
                                 */
                                total_borrow_usd?: number | null;
                                /**
                                 * @description Liquidity still available to borrow, in USD
                                 * @example 568755149
                                 */
                                available_borrow_usd?: number | null;
                                /** @description APY in percent earned by suppliers */
                                supply_apy?: {
                                    /** @description Latest observed values */
                                    current?: {
                                        /**
                                         * @description Organic APY in percent, excluding incentive rewards
                                         * @example 1.49954
                                         */
                                        base?: number | null;
                                        /**
                                         * @description APY in percent from incentive token emissions; null when there are none
                                         * @example null
                                         */
                                        reward?: number | null;
                                        /**
                                         * @description base plus reward, in percent
                                         * @example 1.49954
                                         */
                                        total?: number | null;
                                    };
                                    /** @description Trailing 7-day average */
                                    avg_7d?: {
                                        /**
                                         * @description Organic APY in percent, excluding incentive rewards
                                         * @example 1.46669
                                         */
                                        base?: number | null;
                                        /**
                                         * @description APY in percent from incentive token emissions; null when there are none
                                         * @example null
                                         */
                                        reward?: number | null;
                                        /**
                                         * @description base plus reward, in percent
                                         * @example 1.46669
                                         */
                                        total?: number | null;
                                    };
                                    /** @description Trailing 30-day average */
                                    avg_30d?: {
                                        /**
                                         * @description Organic APY in percent, excluding incentive rewards
                                         * @example 1.40929
                                         */
                                        base?: number | null;
                                        /**
                                         * @description APY in percent from incentive token emissions; null when there are none
                                         * @example null
                                         */
                                        reward?: number | null;
                                        /**
                                         * @description base plus reward, in percent
                                         * @example 1.40929
                                         */
                                        total?: number | null;
                                    };
                                };
                                /** @description APY in percent paid by borrowers. Reward emissions reduce the cost, so total = base - reward and can be negative */
                                borrow_cost_apy?: {
                                    /** @description Latest observed values */
                                    current?: {
                                        /**
                                         * @description Organic APY in percent, excluding incentive rewards
                                         * @example 2.14984
                                         */
                                        base?: number | null;
                                        /**
                                         * @description APY in percent from incentive token emissions; null when there are none
                                         * @example null
                                         */
                                        reward?: number | null;
                                        /**
                                         * @description base minus reward, in percent; negative means the borrower is net paid
                                         * @example 2.14984
                                         */
                                        total?: number | null;
                                    };
                                    /** @description Trailing 7-day average */
                                    avg_7d?: {
                                        /**
                                         * @description Organic APY in percent, excluding incentive rewards
                                         * @example 2.12582
                                         */
                                        base?: number | null;
                                        /**
                                         * @description APY in percent from incentive token emissions; null when there are none
                                         * @example null
                                         */
                                        reward?: number | null;
                                        /**
                                         * @description base minus reward, in percent; negative means the borrower is net paid
                                         * @example 2.12582
                                         */
                                        total?: number | null;
                                    };
                                    /** @description Trailing 30-day average */
                                    avg_30d?: {
                                        /**
                                         * @description Organic APY in percent, excluding incentive rewards
                                         * @example 2.08412
                                         */
                                        base?: number | null;
                                        /**
                                         * @description APY in percent from incentive token emissions; null when there are none
                                         * @example null
                                         */
                                        reward?: number | null;
                                        /**
                                         * @description base minus reward, in percent; negative means the borrower is net paid
                                         * @example 2.08412
                                         */
                                        total?: number | null;
                                    };
                                };
                                /** @description Intrinsic yield of yield-bearing tokens on either side of the market */
                                intrinsic?: {
                                    /** @description Intrinsic yield of the supply-side token. Intrinsic yield is reported separately and is NOT included in the base/reward/total APY. Null when there is no intrinsic yield source. */
                                    supply?: {
                                        /** @description Intrinsic APY in percent */
                                        apy?: {
                                            /** @description Latest observed value */
                                            current?: {
                                                /** @example 3.11 */
                                                base?: number | null;
                                            };
                                            /** @description Trailing 7-day average */
                                            avg_7d?: {
                                                /** @example 3.05 */
                                                base?: number | null;
                                            };
                                            /** @description Trailing 30-day average */
                                            avg_30d?: {
                                                /** @example 3.02 */
                                                base?: number | null;
                                            };
                                        };
                                        source_pool?: {
                                            /**
                                             * @description Earn pool the intrinsic yield is sourced from
                                             * @example 747c1d2a-c668-4682-b9f9-296708a3dd90
                                             */
                                            id?: string;
                                            /**
                                             * @description Address of the yield-bearing token
                                             * @example 0xae7ab96520de3a18e5e111b5eaab095312d7fe84
                                             */
                                            pool_token?: string;
                                            /** @example stETH */
                                            symbol?: string | null;
                                        };
                                    } | null;
                                    /** @description Intrinsic yield of the borrowed token. Borrowing a yield-bearing token adds this rate to the effective borrow cost, since the debt appreciates by it. Intrinsic yield is reported separately and is NOT included in the base/reward/total APY. Null when there is no intrinsic yield source. */
                                    borrow?: {
                                        /** @description Intrinsic APY in percent */
                                        apy?: {
                                            /** @description Latest observed value */
                                            current?: {
                                                /** @example 3.11 */
                                                base?: number | null;
                                            };
                                            /** @description Trailing 7-day average */
                                            avg_7d?: {
                                                /** @example 3.05 */
                                                base?: number | null;
                                            };
                                            /** @description Trailing 30-day average */
                                            avg_30d?: {
                                                /** @example 3.02 */
                                                base?: number | null;
                                            };
                                        };
                                        source_pool?: {
                                            /**
                                             * @description Earn pool the intrinsic yield is sourced from
                                             * @example 747c1d2a-c668-4682-b9f9-296708a3dd90
                                             */
                                            id?: string;
                                            /**
                                             * @description Address of the yield-bearing token
                                             * @example 0xae7ab96520de3a18e5e111b5eaab095312d7fe84
                                             */
                                            pool_token?: string;
                                            /** @example stETH */
                                            symbol?: string | null;
                                        };
                                    } | null;
                                };
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
    "/yields/v2/borrow/markets/{id}/history": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Retrieve daily borrow-side history for a borrow market
         * @description Daily borrow totals and borrow-cost APY for one market, oldest first. APY carries `avg_1d` (that day), `avg_7d` and `avg_30d` (trailing averages ending that day) windows, each attributed into base/reward/total. Supply-side history for the same id lives at `/yields/v2/earn/{id}/history`.
         */
        get: {
            parameters: {
                query?: {
                    /** @description History window; defaults to max (the full series) */
                    range?: "30d" | "90d" | "max";
                };
                header?: never;
                path: {
                    /** @description Borrow market id (UUID) */
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Daily history rows, oldest first */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data?: {
                                /**
                                 * @description Day (UTC)
                                 * @example 2026-08-10
                                 */
                                date?: string;
                                /**
                                 * @description Total borrowed from the market, in USD
                                 * @example 3339035741
                                 */
                                total_borrow_usd?: number | null;
                                /**
                                 * @description Liquidity still available to borrow, in USD
                                 * @example 733495225
                                 */
                                available_borrow_usd?: number | null;
                                /** @description APY in percent paid by borrowers. Reward emissions reduce the cost, so total = base - reward and can be negative */
                                borrow_cost_apy?: {
                                    /** @description Average over that day */
                                    avg_1d?: {
                                        /**
                                         * @description Organic APY in percent, excluding incentive rewards
                                         * @example 2.09904
                                         */
                                        base?: number | null;
                                        /**
                                         * @description APY in percent from incentive token emissions; null when there are none
                                         * @example null
                                         */
                                        reward?: number | null;
                                        /**
                                         * @description base minus reward, in percent; negative means the borrower is net paid
                                         * @example 2.09904
                                         */
                                        total?: number | null;
                                    };
                                    /** @description Trailing 7-day average */
                                    avg_7d?: {
                                        /**
                                         * @description Organic APY in percent, excluding incentive rewards
                                         * @example 2.10884
                                         */
                                        base?: number | null;
                                        /**
                                         * @description APY in percent from incentive token emissions; null when there are none
                                         * @example null
                                         */
                                        reward?: number | null;
                                        /**
                                         * @description base minus reward, in percent; negative means the borrower is net paid
                                         * @example 2.10884
                                         */
                                        total?: number | null;
                                    };
                                    /** @description Trailing 30-day average */
                                    avg_30d?: {
                                        /**
                                         * @description Organic APY in percent, excluding incentive rewards
                                         * @example 2.09608
                                         */
                                        base?: number | null;
                                        /**
                                         * @description APY in percent from incentive token emissions; null when there are none
                                         * @example null
                                         */
                                        reward?: number | null;
                                        /**
                                         * @description base minus reward, in percent; negative means the borrower is net paid
                                         * @example 2.09608
                                         */
                                        total?: number | null;
                                    };
                                };
                                /** @description Intrinsic yield of the borrowed token. Borrowing a yield-bearing token adds this rate to the effective borrow cost, since the debt appreciates by it. Intrinsic yield is reported separately and is NOT included in the base/reward/total APY. Null when there is no intrinsic yield source. */
                                intrinsic?: {
                                    /** @description Intrinsic APY in percent */
                                    apy?: {
                                        /** @description Average over that day */
                                        avg_1d?: {
                                            /** @example 2.76481 */
                                            base?: number | null;
                                        };
                                        /** @description Trailing 7-day average */
                                        avg_7d?: {
                                            /** @example 3.97675 */
                                            base?: number | null;
                                        };
                                        /** @description Trailing 30-day average */
                                        avg_30d?: {
                                            /** @example 4.99742 */
                                            base?: number | null;
                                        };
                                    };
                                } | null;
                            }[];
                        };
                    };
                };
                /** @description No borrow market with this id */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error?: {
                                /** @example BORROW_MARKET_NOT_FOUND */
                                code?: string;
                                /** @example borrow market not found */
                                message?: string;
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
    "/yields/v2/borrow/routes": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Retrieve the latest data for all borrow routes
         * @description Every supported borrowing route: a collateral position paired with a debt market on the same protocol and chain. Each row reports the collateral side (supply APY earned on the collateral), the borrow side (cost APY of the debt token) and `net_apy` (collateral yield minus borrow cost). Negative net APY means the position costs more than the collateral earns.
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Array of all borrow routes */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data?: {
                                /** @description Display strings for listings */
                                display?: {
                                    /**
                                     * @description Market variant label; null when there is only one market
                                     * @example Prime Instance
                                     */
                                    detail?: string | null;
                                };
                                /**
                                 * @description Protocol display name
                                 * @example Aave V3
                                 */
                                protocol?: string;
                                /**
                                 * @description Chain display name
                                 * @example Ethereum
                                 */
                                chain?: string;
                                /** @description The supplied collateral position */
                                collateral?: {
                                    /**
                                     * @description Collateral pool id (UUID)
                                     * @example ef8c5c38-6a41-4383-9dc8-6fb31e69a0c9
                                     */
                                    id?: string;
                                    /**
                                     * @description Stable pool key of the collateral pool
                                     * @example 0xfa1fdbbd71b0aa16162d76914d69cd8cb3ef92da-lido
                                     */
                                    pool_key?: string;
                                    /** @example https://app.aave.com/reserve-overview/?underlyingAsset=0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2&marketName=proto_lido_v3 */
                                    url?: string | null;
                                    /** @description Token supplied as collateral */
                                    token?: {
                                        /** @example 0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2 */
                                        address?: string;
                                        /** @example WETH */
                                        symbol?: string | null;
                                        /** @example 18 */
                                        decimals?: number | null;
                                    };
                                    /**
                                     * @description Maximum loan-to-value as a fraction (0.84 = 84%)
                                     * @example 0.84
                                     */
                                    loan_to_value?: number | null;
                                    /**
                                     * @description Total supplied to the collateral pool, in USD
                                     * @example 35187139
                                     */
                                    total_supply_usd?: number | null;
                                    /** @description Supply APY in percent earned on the collateral */
                                    apy?: {
                                        /** @description Latest observed values */
                                        current?: {
                                            /**
                                             * @description Organic APY in percent, excluding incentive rewards
                                             * @example 1.56065
                                             */
                                            base?: number | null;
                                            /**
                                             * @description APY in percent from incentive token emissions; null when there are none
                                             * @example null
                                             */
                                            reward?: number | null;
                                            /**
                                             * @description base plus reward, in percent
                                             * @example 1.56065
                                             */
                                            total?: number | null;
                                        };
                                        /** @description Trailing 7-day average */
                                        avg_7d?: {
                                            /**
                                             * @description Organic APY in percent, excluding incentive rewards
                                             * @example 1.48621
                                             */
                                            base?: number | null;
                                            /**
                                             * @description APY in percent from incentive token emissions; null when there are none
                                             * @example null
                                             */
                                            reward?: number | null;
                                            /**
                                             * @description base plus reward, in percent
                                             * @example 1.48621
                                             */
                                            total?: number | null;
                                        };
                                        /** @description Trailing 30-day average */
                                        avg_30d?: {
                                            /**
                                             * @description Organic APY in percent, excluding incentive rewards
                                             * @example 1.46718
                                             */
                                            base?: number | null;
                                            /**
                                             * @description APY in percent from incentive token emissions; null when there are none
                                             * @example null
                                             */
                                            reward?: number | null;
                                            /**
                                             * @description base plus reward, in percent
                                             * @example 1.46718
                                             */
                                            total?: number | null;
                                        };
                                    };
                                    /** @description Intrinsic yield of the collateral token. Intrinsic yield is reported separately and is NOT included in the base/reward/total APY. Null when there is no intrinsic yield source. */
                                    intrinsic?: {
                                        /** @description Intrinsic APY in percent */
                                        apy?: {
                                            /** @description Latest observed value */
                                            current?: {
                                                /** @example 3.11 */
                                                base?: number | null;
                                            };
                                            /** @description Trailing 7-day average */
                                            avg_7d?: {
                                                /** @example 3.05 */
                                                base?: number | null;
                                            };
                                            /** @description Trailing 30-day average */
                                            avg_30d?: {
                                                /** @example 3.02 */
                                                base?: number | null;
                                            };
                                        };
                                        source_pool?: {
                                            /**
                                             * @description Earn pool the intrinsic yield is sourced from
                                             * @example 747c1d2a-c668-4682-b9f9-296708a3dd90
                                             */
                                            id?: string;
                                            /**
                                             * @description Address of the yield-bearing token
                                             * @example 0xae7ab96520de3a18e5e111b5eaab095312d7fe84
                                             */
                                            pool_token?: string;
                                            /** @example stETH */
                                            symbol?: string | null;
                                        };
                                    } | null;
                                    /** @description Incentive tokens emitted to the collateral side; empty when there are none */
                                    reward_tokens?: {
                                        /** @example 0xd533a949740bb3306d119cc777fa900ba034cd52 */
                                        address?: string;
                                        /** @example CRV */
                                        symbol?: string | null;
                                        /** @example 18 */
                                        decimals?: number | null;
                                    }[];
                                };
                                /** @description The borrowed debt position */
                                borrow?: {
                                    /**
                                     * @description Debt market id (UUID)
                                     * @example effcb4a4-4dcb-45e5-935d-f15542c13e6b
                                     */
                                    id?: string;
                                    /**
                                     * @description Stable pool key of the debt market
                                     * @example 0x2a1fbcb52ed4d9b23dad17e1e8aed4bb0e6079b8-lido
                                     */
                                    pool_key?: string;
                                    /** @example https://app.aave.com/reserve-overview/?underlyingAsset=0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48&marketName=proto_lido_v3 */
                                    url?: string | null;
                                    /** @description Token borrowed */
                                    token?: {
                                        /** @example 0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48 */
                                        address?: string;
                                        /** @example USDC */
                                        symbol?: string | null;
                                        /** @example 6 */
                                        decimals?: number | null;
                                    };
                                    /**
                                     * @description Total borrowed from the market, in USD
                                     * @example 3377912
                                     */
                                    total_borrow_usd?: number | null;
                                    /**
                                     * @description Liquidity still available to borrow, in USD
                                     * @example 1838568
                                     */
                                    available_borrow_usd?: number | null;
                                    /** @description Borrow cost APY in percent. Reward emissions reduce the cost, so total = base - reward and can be negative */
                                    cost_apy?: {
                                        /** @description Latest observed values */
                                        current?: {
                                            /**
                                             * @description Organic APY in percent, excluding incentive rewards
                                             * @example 3.8712
                                             */
                                            base?: number | null;
                                            /**
                                             * @description APY in percent from incentive token emissions; null when there are none
                                             * @example null
                                             */
                                            reward?: number | null;
                                            /**
                                             * @description base minus reward, in percent; negative means the borrower is net paid
                                             * @example 3.8712
                                             */
                                            total?: number | null;
                                        };
                                        /** @description Trailing 7-day average */
                                        avg_7d?: {
                                            /**
                                             * @description Organic APY in percent, excluding incentive rewards
                                             * @example 3.895
                                             */
                                            base?: number | null;
                                            /**
                                             * @description APY in percent from incentive token emissions; null when there are none
                                             * @example null
                                             */
                                            reward?: number | null;
                                            /**
                                             * @description base minus reward, in percent; negative means the borrower is net paid
                                             * @example 3.895
                                             */
                                            total?: number | null;
                                        };
                                        /** @description Trailing 30-day average */
                                        avg_30d?: {
                                            /**
                                             * @description Organic APY in percent, excluding incentive rewards
                                             * @example 3.89527
                                             */
                                            base?: number | null;
                                            /**
                                             * @description APY in percent from incentive token emissions; null when there are none
                                             * @example null
                                             */
                                            reward?: number | null;
                                            /**
                                             * @description base minus reward, in percent; negative means the borrower is net paid
                                             * @example 3.89527
                                             */
                                            total?: number | null;
                                        };
                                    };
                                    /** @description Intrinsic yield of the borrowed token. Borrowing a yield-bearing token adds this rate to the effective borrow cost, since the debt appreciates by it. Intrinsic yield is reported separately and is NOT included in the base/reward/total APY. Null when there is no intrinsic yield source. */
                                    intrinsic?: {
                                        /** @description Intrinsic APY in percent */
                                        apy?: {
                                            /** @description Latest observed value */
                                            current?: {
                                                /** @example 3.11 */
                                                base?: number | null;
                                            };
                                            /** @description Trailing 7-day average */
                                            avg_7d?: {
                                                /** @example 3.05 */
                                                base?: number | null;
                                            };
                                            /** @description Trailing 30-day average */
                                            avg_30d?: {
                                                /** @example 3.02 */
                                                base?: number | null;
                                            };
                                        };
                                        source_pool?: {
                                            /**
                                             * @description Earn pool the intrinsic yield is sourced from
                                             * @example 747c1d2a-c668-4682-b9f9-296708a3dd90
                                             */
                                            id?: string;
                                            /**
                                             * @description Address of the yield-bearing token
                                             * @example 0xae7ab96520de3a18e5e111b5eaab095312d7fe84
                                             */
                                            pool_token?: string;
                                            /** @example stETH */
                                            symbol?: string | null;
                                        };
                                    } | null;
                                    /** @description Incentive tokens emitted to the borrow side; empty when there are none */
                                    reward_tokens?: {
                                        /** @example 0xd533a949740bb3306d119cc777fa900ba034cd52 */
                                        address?: string;
                                        /** @example CRV */
                                        symbol?: string | null;
                                        /** @example 18 */
                                        decimals?: number | null;
                                    }[];
                                };
                                /** @description Net APY in percent: collateral supply APY minus borrow cost. Keyed by APY composition: read the leaf matching the APY components you consume (base, base + reward, base + intrinsic, base + reward + intrinsic). */
                                net_apy?: {
                                    /** @description Latest observed values */
                                    current?: {
                                        /** @example -2.31055 */
                                        base?: number | null;
                                        /** @example -2.31055 */
                                        base_reward?: number | null;
                                        /** @example -2.31055 */
                                        base_intrinsic?: number | null;
                                        /** @example -2.31055 */
                                        base_reward_intrinsic?: number | null;
                                    };
                                    /** @description Trailing 7-day average */
                                    avg_7d?: {
                                        /** @example -2.40879 */
                                        base?: number | null;
                                        /** @example -2.40879 */
                                        base_reward?: number | null;
                                        /** @example -2.40879 */
                                        base_intrinsic?: number | null;
                                        /** @example -2.40879 */
                                        base_reward_intrinsic?: number | null;
                                    };
                                    /** @description Trailing 30-day average */
                                    avg_30d?: {
                                        /** @example -2.42809 */
                                        base?: number | null;
                                        /** @example -2.42809 */
                                        base_reward?: number | null;
                                        /** @example -2.42809 */
                                        base_intrinsic?: number | null;
                                        /** @example -2.42809 */
                                        base_reward_intrinsic?: number | null;
                                    };
                                };
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
    "/yields/v2/loops": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Retrieve the latest data for all loop strategies
         * @description Leveraged looping opportunities: supply a token, borrow against it and re-supply, repeated `loop_count` times at the market maximum loan-to-value. `loop_apy.total` is the resulting net APY at that leverage; `leverage` reports the accumulated supply and borrow multipliers relative to the initial capital. Borrow reward emissions offset the borrowing cost, so looped APY can exceed the plain supply APY substantially.
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Array of all loop strategies */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data?: {
                                /**
                                 * @description Collateral pool id (UUID)
                                 * @example f2e554c5-2099-46cf-9fa6-918fb41a3297
                                 */
                                id?: string;
                                /** @description Display strings for listings */
                                display?: {
                                    /**
                                     * @description Market variant label; null when there is only one market
                                     * @example null
                                     */
                                    detail?: string | null;
                                };
                                /**
                                 * @description Protocol display name
                                 * @example Scallop Lend
                                 */
                                protocol?: string;
                                /**
                                 * @description Chain display name
                                 * @example Sui
                                 */
                                chain?: string;
                                /** @description Token being looped (supplied and borrowed) */
                                token?: {
                                    /** @example 0x0041f9f9344cac094454cd574e333c4fdb132d7bcc9379bcd4aab485b2a63942::wbtc::wbtc */
                                    address?: string;
                                    /** @example WBTC */
                                    symbol?: string | null;
                                    /** @example 8 */
                                    decimals?: number | null;
                                };
                                /**
                                 * @description Market page on the protocol app
                                 * @example https://app.scallop.io/
                                 */
                                url?: string | null;
                                /**
                                 * @description Maximum loan-to-value as a fraction (0.7 = 70%)
                                 * @example 0.7
                                 */
                                loan_to_value?: number | null;
                                /**
                                 * @description Total supplied to the market, in USD
                                 * @example 99384
                                 */
                                total_supply_usd?: number | null;
                                /**
                                 * @description Total borrowed from the market, in USD
                                 * @example 40704
                                 */
                                total_borrow_usd?: number | null;
                                /**
                                 * @description Liquidity still available to borrow, in USD
                                 * @example 58680
                                 */
                                available_borrow_usd?: number | null;
                                /** @description Unlevered supply APY in percent */
                                supply_apy?: {
                                    /** @description Latest observed values */
                                    current?: {
                                        /**
                                         * @description Organic APY in percent, excluding incentive rewards
                                         * @example 2.50779
                                         */
                                        base?: number | null;
                                        /**
                                         * @description APY in percent from incentive token emissions; null when there are none
                                         * @example null
                                         */
                                        reward?: number | null;
                                        /**
                                         * @description base plus reward, in percent
                                         * @example 2.50779
                                         */
                                        total?: number | null;
                                    };
                                    /** @description Trailing 7-day average */
                                    avg_7d?: {
                                        /**
                                         * @description Organic APY in percent, excluding incentive rewards
                                         * @example 2.38329
                                         */
                                        base?: number | null;
                                        /**
                                         * @description APY in percent from incentive token emissions; null when there are none
                                         * @example null
                                         */
                                        reward?: number | null;
                                        /**
                                         * @description base plus reward, in percent
                                         * @example 2.38329
                                         */
                                        total?: number | null;
                                    };
                                    /** @description Trailing 30-day average */
                                    avg_30d?: {
                                        /**
                                         * @description Organic APY in percent, excluding incentive rewards
                                         * @example 2.35421
                                         */
                                        base?: number | null;
                                        /**
                                         * @description APY in percent from incentive token emissions; null when there are none
                                         * @example null
                                         */
                                        reward?: number | null;
                                        /**
                                         * @description base plus reward, in percent
                                         * @example 2.35421
                                         */
                                        total?: number | null;
                                    };
                                };
                                /** @description Borrow cost APY in percent. Reward emissions reduce the cost, so total = base - reward and can be negative */
                                borrow_cost_apy?: {
                                    /** @description Latest observed values */
                                    current?: {
                                        /**
                                         * @description Organic APY in percent, excluding incentive rewards
                                         * @example 7.852
                                         */
                                        base?: number | null;
                                        /**
                                         * @description APY in percent from incentive token emissions; null when there are none
                                         * @example 21.73055
                                         */
                                        reward?: number | null;
                                        /**
                                         * @description base minus reward, in percent; negative means the borrower is net paid
                                         * @example -13.87855
                                         */
                                        total?: number | null;
                                    };
                                    /** @description Trailing 7-day average */
                                    avg_7d?: {
                                        /**
                                         * @description Organic APY in percent, excluding incentive rewards
                                         * @example 7.74822
                                         */
                                        base?: number | null;
                                        /**
                                         * @description APY in percent from incentive token emissions; null when there are none
                                         * @example 38.54927
                                         */
                                        reward?: number | null;
                                        /**
                                         * @description base minus reward, in percent; negative means the borrower is net paid
                                         * @example -30.80105
                                         */
                                        total?: number | null;
                                    };
                                    /** @description Trailing 30-day average */
                                    avg_30d?: {
                                        /**
                                         * @description Organic APY in percent, excluding incentive rewards
                                         * @example 7.70641
                                         */
                                        base?: number | null;
                                        /**
                                         * @description APY in percent from incentive token emissions; null when there are none
                                         * @example 25.32701
                                         */
                                        reward?: number | null;
                                        /**
                                         * @description base minus reward, in percent; negative means the borrower is net paid
                                         * @example -17.6206
                                         */
                                        total?: number | null;
                                    };
                                };
                                /** @description Looped position APY */
                                loop_apy?: {
                                    /**
                                     * @description Number of borrow/re-supply iterations
                                     * @example 5
                                     */
                                    loop_count?: number | null;
                                    /**
                                     * @description Net APY in percent of the looped position at loop_count iterations
                                     * @example 34.31646
                                     */
                                    total?: number | null;
                                };
                                /** @description Accumulated leverage after loop_count iterations */
                                leverage?: {
                                    /**
                                     * @description Total supplied relative to initial capital
                                     * @example 2.94117
                                     */
                                    supply_multiplier?: number | null;
                                    /**
                                     * @description Total borrowed relative to initial capital
                                     * @example 1.94117
                                     */
                                    borrow_multiplier?: number | null;
                                };
                                /** @description Intrinsic yield of the looped token. Intrinsic yield is reported separately and is NOT included in the base/reward/total APY. Null when there is no intrinsic yield source. */
                                intrinsic?: {
                                    /** @description Intrinsic APY in percent */
                                    apy?: {
                                        /** @description Latest observed value */
                                        current?: {
                                            /** @example 3.11 */
                                            base?: number | null;
                                        };
                                        /** @description Trailing 7-day average */
                                        avg_7d?: {
                                            /** @example 3.05 */
                                            base?: number | null;
                                        };
                                        /** @description Trailing 30-day average */
                                        avg_30d?: {
                                            /** @example 3.02 */
                                            base?: number | null;
                                        };
                                    };
                                    source_pool?: {
                                        /**
                                         * @description Earn pool the intrinsic yield is sourced from
                                         * @example 747c1d2a-c668-4682-b9f9-296708a3dd90
                                         */
                                        id?: string;
                                        /**
                                         * @description Address of the yield-bearing token
                                         * @example 0xae7ab96520de3a18e5e111b5eaab095312d7fe84
                                         */
                                        pool_token?: string;
                                        /** @example stETH */
                                        symbol?: string | null;
                                    };
                                } | null;
                                /** @description Incentive tokens per market side; empty arrays when there are none */
                                reward_tokens?: {
                                    /** @description Incentive tokens emitted to the supply side */
                                    supply?: {
                                        /** @example 0x5ca17430c1d046fae9edeaa8fd76c7b4193a00d764a0ecfa9418d733ad27bc1e::scallop_sca::scallop_sca */
                                        address?: string;
                                        /** @example sSCA */
                                        symbol?: string | null;
                                        /** @example 9 */
                                        decimals?: number | null;
                                    }[];
                                    /** @description Incentive tokens emitted to the borrow side */
                                    borrow?: {
                                        /** @example 0x5ca17430c1d046fae9edeaa8fd76c7b4193a00d764a0ecfa9418d733ad27bc1e::scallop_sca::scallop_sca */
                                        address?: string;
                                        /** @example sSCA */
                                        symbol?: string | null;
                                        /** @example 9 */
                                        decimals?: number | null;
                                    }[];
                                };
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
    "/etfs/snapshot": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get ETFs and their metrics (aum, flows, fees...) */
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
                        /**
                         * @example [
                         *       {
                         *         "ticker": "IBIT",
                         *         "timestamp": 1755612389,
                         *         "asset": "bitcoin",
                         *         "issuer": "Blackrock",
                         *         "etf_name": "iShares Bitcoin Trust",
                         *         "custodian": "Coinbase",
                         *         "pct_fee": 0.25,
                         *         "url": "https://www.blackrock.com/us/individual/products/333011/ishares-bitcoin-trust",
                         *         "flows": -68700000,
                         *         "aum": 87276718199,
                         *         "volume": 453293317.84999996
                         *       }
                         *     ]
                         */
                        "application/json": {
                            /** @description ETF ticker symbol */
                            ticker?: string;
                            /** @description Current timestamp */
                            timestamp?: number;
                            /** @description Asset name */
                            asset?: string;
                            /** @description ETF issuer name */
                            issuer?: string;
                            /** @description Full ETF name */
                            etf_name?: string;
                            /** @description Custodian name */
                            custodian?: string;
                            /** @description Percentage fee */
                            pct_fee?: number;
                            /** @description ETF URL */
                            url?: string;
                            /** @description Net flows */
                            flows?: number;
                            /** @description Assets under management */
                            aum?: number;
                            /** @description Trading volume */
                            volume?: number;
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
    "/etfs/flows": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Historical Flows at the Asset Level */
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
                        /**
                         * @example [
                         *       {
                         *         "gecko_id": "bitcoin",
                         *         "day": "2024-01-11T00:00:00.000Z",
                         *         "total_flow_usd": 655300000
                         *       }
                         *     ]
                         */
                        "application/json": {
                            /** @description CoinGecko ID */
                            gecko_id?: string;
                            /** @description Day */
                            day?: string;
                            /** @description Sum of all USD flows per asset */
                            total_flow_usd?: number;
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
    "/fdv/performance/{period}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get chart of narratives based on category performance (with individual coins weighted by mcap) */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description One of ['7', '30', 'ytd', '365'] */
                    period: string;
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
                         * @example [
                         *       {
                         *         "date": 1751846400,
                         *         "Analytics": 0,
                         *         "Artificial Intelligence (AI)": 0,
                         *         "Bitcoin": 0,
                         *         "Bridge Governance Tokens": 0,
                         *         "Centralized Exchange (CEX) Token": 0,
                         *         "Data Availability": 0,
                         *         "Decentralized Finance (DeFi)": 0,
                         *         "Decentralized Identifier (DID)": 0,
                         *         "DePIN": 0,
                         *         "Ethereum": 0,
                         *         "Gaming (GameFi)": 0,
                         *         "Liquid Staking Governance Tokens": 0,
                         *         "Meme": 0,
                         *         "NFT Marketplace": 0,
                         *         "Oracle": 0,
                         *         "PolitiFi": 0,
                         *         "Prediction Markets": 0,
                         *         "Real World Assets (RWA)": 0,
                         *         "Rollup": 0,
                         *         "Smart Contract Platform": 0,
                         *         "SocialFi": 0,
                         *         "Solana": 0
                         *       }
                         *     ]
                         */
                        "application/json": {
                            /** @description Date timestamp */
                            date?: number;
                            /** @description Analytics category performance */
                            Analytics?: number;
                            /** @description AI category performance */
                            "Artificial Intelligence (AI)"?: number;
                            /** @description Bitcoin category performance */
                            Bitcoin?: number;
                            /** @description Bridge governance tokens category performance */
                            "Bridge Governance Tokens"?: number;
                            /** @description CEX token category performance */
                            "Centralized Exchange (CEX) Token"?: number;
                            /** @description Data availability category performance */
                            "Data Availability"?: number;
                            /** @description DeFi category performance */
                            "Decentralized Finance (DeFi)"?: number;
                            /** @description DID category performance */
                            "Decentralized Identifier (DID)"?: number;
                            /** @description DePIN category performance */
                            DePIN?: number;
                            /** @description Ethereum category performance */
                            Ethereum?: number;
                            /** @description Gaming category performance */
                            "Gaming (GameFi)"?: number;
                            /** @description Liquid staking governance tokens category performance */
                            "Liquid Staking Governance Tokens"?: number;
                            /** @description Meme category performance */
                            Meme?: number;
                            /** @description NFT marketplace category performance */
                            "NFT Marketplace"?: number;
                            /** @description Oracle category performance */
                            Oracle?: number;
                            /** @description PolitiFi category performance */
                            PolitiFi?: number;
                            /** @description Prediction markets category performance */
                            "Prediction Markets"?: number;
                            /** @description RWA category performance */
                            "Real World Assets (RWA)"?: number;
                            /** @description Rollup category performance */
                            Rollup?: number;
                            /** @description Smart contract platform category performance */
                            "Smart Contract Platform"?: number;
                            /** @description SocialFi category performance */
                            SocialFi?: number;
                            /** @description Solana category performance */
                            Solana?: number;
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
    "/bridges/bridges": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List all bridges along with summaries of recent bridge volumes. */
        get: {
            parameters: {
                query?: {
                    /** @description set whether to include current previous day volume breakdown by chain */
                    includeChains?: boolean;
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
                        /**
                         * @example {
                         *       "bridges": [
                         *         {
                         *           "id": 80,
                         *           "name": "hyperliquid",
                         *           "displayName": "Hyperliquid",
                         *           "icon": "icons:hyperliquid",
                         *           "volumePrevDay": 245562283.16810948,
                         *           "volumePrev2Day": 205702464.62591228,
                         *           "lastHourlyVolume": 0,
                         *           "last24hVolume": 245562283.16810948,
                         *           "lastDailyVolume": 245562283.16810948,
                         *           "dayBeforeLastVolume": 205702464.62591228,
                         *           "weeklyVolume": 1700279485.290507,
                         *           "monthlyVolume": 3986810177.448681,
                         *           "chains": [
                         *             "Arbitrum",
                         *             "Hyperliquid"
                         *           ],
                         *           "destinationChain": "Hyperliquid",
                         *           "url": "https://app.hyperliquid.xyz/trade",
                         *           "slug": "hyperliquid-bridge"
                         *         }
                         *       ]
                         *     }
                         */
                        "application/json": {
                            /** @description List of bridges */
                            bridges?: {
                                /** @description Bridge ID */
                                id?: number;
                                /** @description Bridge name */
                                name?: string;
                                /** @description Bridge display name */
                                displayName?: string;
                                /** @description Bridge icon */
                                icon?: string;
                                /** @description Previous day volume */
                                volumePrevDay?: number;
                                /** @description Previous 2 days volume */
                                volumePrev2Day?: number;
                                /** @description Last hourly volume */
                                lastHourlyVolume?: number;
                                /** @description Last 24 hours volume */
                                last24hVolume?: number;
                                /** @description Last daily volume */
                                lastDailyVolume?: number;
                                /** @description Day before last volume */
                                dayBeforeLastVolume?: number;
                                /** @description Weekly volume */
                                weeklyVolume?: number;
                                /** @description Monthly volume */
                                monthlyVolume?: number;
                                /** @description Supported chains */
                                chains?: string[];
                                /** @description Destination chain */
                                destinationChain?: string;
                                /** @description Bridge URL */
                                url?: string;
                                /** @description Bridge slug */
                                slug?: string;
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
    "/bridges/bridge/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get summary of bridge volume and volume breakdown by chain */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description bridge ID, you can get these from /bridges */
                    id: number;
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
                         *       "id": 1,
                         *       "name": "polygon",
                         *       "displayName": "Polygon PoS Bridge",
                         *       "lastHourlyVolume": 118020.67633222912,
                         *       "currentDayVolume": 0,
                         *       "lastDailyVolume": 28740605.36474136,
                         *       "dayBeforeLastVolume": 17294645.046479236,
                         *       "weeklyVolume": 71188570.7201651,
                         *       "monthlyVolume": 490635601.59313035,
                         *       "lastHourlyTxs": {
                         *         "deposits": 10,
                         *         "withdrawals": 5
                         *       },
                         *       "currentDayTxs": {
                         *         "deposits": 0,
                         *         "withdrawals": 0
                         *       },
                         *       "prevDayTxs": {
                         *         "deposits": 153,
                         *         "withdrawals": 150
                         *       },
                         *       "dayBeforeLastTxs": {
                         *         "deposits": 173,
                         *         "withdrawals": 195
                         *       },
                         *       "weeklyTxs": {
                         *         "deposits": 2095,
                         *         "withdrawals": 1752
                         *       },
                         *       "monthlyTxs": {
                         *         "deposits": 6945,
                         *         "withdrawals": 5537
                         *       },
                         *       "chainBreakdown": {
                         *         "Polygon": {
                         *           "lastHourlyVolume": 118020.67633222912,
                         *           "currentDayVolume": 0,
                         *           "lastDailyVolume": 28740605.36474136,
                         *           "dayBeforeLastVolume": 17294645.046479236,
                         *           "weeklyVolume": 71188570.7201651,
                         *           "monthlyVolume": 490635601.59313035,
                         *           "last24hVolume": 34766385.06231544,
                         *           "lastHourlyTxs": {
                         *             "deposits": 10,
                         *             "withdrawals": 5
                         *           },
                         *           "currentDayTxs": {
                         *             "deposits": 0,
                         *             "withdrawals": 0
                         *           },
                         *           "prevDayTxs": {
                         *             "deposits": 153,
                         *             "withdrawals": 150
                         *           },
                         *           "dayBeforeLastTxs": {
                         *             "deposits": 173,
                         *             "withdrawals": 195
                         *           },
                         *           "weeklyTxs": {
                         *             "deposits": 2095,
                         *             "withdrawals": 1752
                         *           },
                         *           "monthlyTxs": {
                         *             "deposits": 6945,
                         *             "withdrawals": 5537
                         *           }
                         *         },
                         *         "Ethereum": {
                         *           "lastHourlyVolume": 118020.67633222912,
                         *           "currentDayVolume": 0,
                         *           "lastDailyVolume": 28740605.36474136,
                         *           "dayBeforeLastVolume": 17294645.046479236,
                         *           "weeklyVolume": 71188570.7201651,
                         *           "monthlyVolume": 490635601.59313035,
                         *           "last24hVolume": 34766385.06231544,
                         *           "lastHourlyTxs": {
                         *             "deposits": 10,
                         *             "withdrawals": 5
                         *           },
                         *           "currentDayTxs": {
                         *             "deposits": 0,
                         *             "withdrawals": 0
                         *           },
                         *           "prevDayTxs": {
                         *             "deposits": 153,
                         *             "withdrawals": 150
                         *           },
                         *           "dayBeforeLastTxs": {
                         *             "deposits": 173,
                         *             "withdrawals": 195
                         *           },
                         *           "weeklyTxs": {
                         *             "deposits": 2095,
                         *             "withdrawals": 1752
                         *           },
                         *           "monthlyTxs": {
                         *             "deposits": 6945,
                         *             "withdrawals": 5537
                         *           }
                         *         }
                         *       },
                         *       "destinationChain": "Polygon"
                         *     }
                         */
                        "application/json": {
                            /** @description Bridge ID */
                            id?: number;
                            /** @description Bridge name */
                            name?: string;
                            /** @description Bridge display name */
                            displayName?: string;
                            /** @description Last hourly volume */
                            lastHourlyVolume?: number;
                            /** @description Current day volume */
                            currentDayVolume?: number;
                            /** @description Last daily volume */
                            lastDailyVolume?: number;
                            /** @description Day before last volume */
                            dayBeforeLastVolume?: number;
                            /** @description Weekly volume */
                            weeklyVolume?: number;
                            /** @description Monthly volume */
                            monthlyVolume?: number;
                            /** @description Last hourly transactions */
                            lastHourlyTxs?: {
                                /** @description Number of deposits */
                                deposits?: number;
                                /** @description Number of withdrawals */
                                withdrawals?: number;
                            };
                            /** @description Current day transactions */
                            currentDayTxs?: {
                                /** @description Number of deposits */
                                deposits?: number;
                                /** @description Number of withdrawals */
                                withdrawals?: number;
                            };
                            /** @description Previous day transactions */
                            prevDayTxs?: {
                                /** @description Number of deposits */
                                deposits?: number;
                                /** @description Number of withdrawals */
                                withdrawals?: number;
                            };
                            /** @description Day before last transactions */
                            dayBeforeLastTxs?: {
                                /** @description Number of deposits */
                                deposits?: number;
                                /** @description Number of withdrawals */
                                withdrawals?: number;
                            };
                            /** @description Weekly transactions */
                            weeklyTxs?: {
                                /** @description Number of deposits */
                                deposits?: number;
                                /** @description Number of withdrawals */
                                withdrawals?: number;
                            };
                            /** @description Monthly transactions */
                            monthlyTxs?: {
                                /** @description Number of deposits */
                                deposits?: number;
                                /** @description Number of withdrawals */
                                withdrawals?: number;
                            };
                            /** @description Volume breakdown by chain */
                            chainBreakdown?: Record<string, never>;
                            /** @description Destination chain */
                            destinationChain?: string;
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
    "/bridges/bridgevolume/{chain}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get historical volumes for a bridge, chain, or bridge on a particular chain */
        get: {
            parameters: {
                query?: {
                    /** @description bridge ID, you can get these from /bridges */
                    id?: number;
                };
                header?: never;
                path: {
                    /** @description chain slug, you can get these from /chains. Call also use 'all' for volume on all chains. */
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
                    content: {
                        /**
                         * @example [
                         *       {
                         *         "date": "1665964800",
                         *         "depositUSD": 11121806.082658675,
                         *         "withdrawUSD": 13970177.335270314,
                         *         "depositTxs": 218,
                         *         "withdrawTxs": 56
                         *       },
                         *       {
                         *         "date": "1666051200",
                         *         "depositUSD": 32940139.204768553,
                         *         "withdrawUSD": 157541586.9492474,
                         *         "depositTxs": 2042,
                         *         "withdrawTxs": 708
                         *       }
                         *     ]
                         */
                        "application/json": {
                            /** @description Date timestamp */
                            date?: string;
                            /** @description Deposit volume in USD */
                            depositUSD?: number;
                            /** @description Withdrawal volume in USD */
                            withdrawUSD?: number;
                            /** @description Number of deposit transactions */
                            depositTxs?: number;
                            /** @description Number of withdrawal transactions */
                            withdrawTxs?: number;
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
    "/bridges/bridgedaystats/{timestamp}/{chain}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get a 24hr token and address volume breakdown for a bridge */
        get: {
            parameters: {
                query?: {
                    /** @description bridge ID, you can get these from /bridges */
                    id?: number;
                };
                header?: never;
                path: {
                    /** @description Unix timestamp. Data returned will be for the 24hr period starting at 00:00 UTC that the timestamp lands in. */
                    timestamp: number;
                    /** @description chain slug, you can get these from /chains. */
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
                    content: {
                        /**
                         * @example {
                         *       "date": 1752796800,
                         *       "totalTokensDeposited": {
                         *         "ethereum:0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48": {
                         *           "usdValue": 8538374.477027368,
                         *           "amount": "17379331182",
                         *           "symbol": "USDC",
                         *           "decimals": 6
                         *         },
                         *         "ethereum:0x6De037ef9aD2725EB40118Bb1702EBb27e4Aeb24": {
                         *           "usdValue": 2123785.5869,
                         *           "amount": "2123785.5869",
                         *           "symbol": "RNDR",
                         *           "decimals": 18
                         *         }
                         *       },
                         *       "totalTokensWithdrawn": {
                         *         "ethereum:0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48": {
                         *           "usdValue": 3020623.745962119,
                         *           "amount": "14680842655",
                         *           "symbol": "USDC",
                         *           "decimals": 6
                         *         },
                         *         "ethereum:0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2": {
                         *           "usdValue": 2214456.1061736266,
                         *           "amount": "28501633217143430245",
                         *           "symbol": "WETH",
                         *           "decimals": 18
                         *         }
                         *       },
                         *       "totalAddressDeposited": {
                         *         "ethereum:0x3a23F943181408EAC424116Af7b7790c94Cb97a5": {
                         *           "usdValue": 2447787.602843585,
                         *           "txs": 13
                         *         },
                         *         "ethereum:0x348C31025754113F599ccEa72747A726a133799b": {
                         *           "usdValue": 2115000,
                         *           "txs": 1
                         *         }
                         *       },
                         *       "totalAddressWithdrawn": {
                         *         "ethereum:0xb60d0C2E8309518373b40f8Eaa2CAd0d1De3deCb": {
                         *           "usdValue": 1196415.6440843595,
                         *           "txs": 2
                         *         },
                         *         "ethereum:0x49c3FeaFDdaefC3Bed06F4ff87CE86610C2c1076": {
                         *           "usdValue": 565794.5181076665,
                         *           "txs": 1
                         *         }
                         *       }
                         *     }
                         */
                        "application/json": {
                            /** @description Date timestamp */
                            date?: number;
                            /** @description Total tokens deposited with their details */
                            totalTokensDeposited?: {
                                [key: string]: {
                                    /** @description USD value of the token */
                                    usdValue?: number;
                                    /** @description Token amount as string */
                                    amount?: string;
                                    /** @description Token symbol */
                                    symbol?: string;
                                    /** @description Token decimals */
                                    decimals?: number;
                                };
                            };
                            /** @description Total tokens withdrawn with their details */
                            totalTokensWithdrawn?: {
                                [key: string]: {
                                    /** @description USD value of the token */
                                    usdValue?: number;
                                    /** @description Token amount as string */
                                    amount?: string;
                                    /** @description Token symbol */
                                    symbol?: string;
                                    /** @description Token decimals */
                                    decimals?: number;
                                };
                            };
                            /** @description Total addresses that deposited with their details */
                            totalAddressDeposited?: {
                                [key: string]: {
                                    /** @description Total USD value deposited by this address */
                                    usdValue?: number;
                                    /** @description Number of transactions from this address */
                                    txs?: number;
                                };
                            };
                            /** @description Total addresses that withdrew with their details */
                            totalAddressWithdrawn?: {
                                [key: string]: {
                                    /** @description Total USD value withdrawn by this address */
                                    usdValue?: number;
                                    /** @description Number of transactions from this address */
                                    txs?: number;
                                };
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
    "/bridges/transactions/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get all transactions for a bridge within a date range */
        get: {
            parameters: {
                query?: {
                    /** @description start timestamp (Unix Timestamp) for date range */
                    starttimestamp?: number;
                    /** @description end timestamp (Unix timestamp) for date range */
                    endtimestamp?: number;
                    /** @description Returns only transactions that are bridging from the specified source chain. */
                    sourcechain?: string;
                    /** @description Returns only transactions with specified address as "from" or "to". Addresses are quried in the form {chain}:{address}, where chain is an identifier such as ethereum, bsc, polygon, avax... . */
                    address?: string;
                    /** @description limit to number of transactions returned, maximum is 6000 */
                    limit?: number;
                };
                header?: never;
                path: {
                    /** @description bridge ID, you can get these from /bridges */
                    id: number;
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
                         *       "id": 1,
                         *       "name": "polygon",
                         *       "displayName": "Polygon PoS Bridge",
                         *       "lastHourlyVolume": 118020.67633222912,
                         *       "currentDayVolume": 0,
                         *       "lastDailyVolume": 28740605.36474136,
                         *       "dayBeforeLastVolume": 17294645.046479236,
                         *       "weeklyVolume": 71188570.7201651,
                         *       "monthlyVolume": 490635601.59313035,
                         *       "lastHourlyTxs": {
                         *         "deposits": 10,
                         *         "withdrawals": 5
                         *       },
                         *       "currentDayTxs": {
                         *         "deposits": 0,
                         *         "withdrawals": 0
                         *       },
                         *       "prevDayTxs": {
                         *         "deposits": 153,
                         *         "withdrawals": 150
                         *       },
                         *       "dayBeforeLastTxs": {
                         *         "deposits": 173,
                         *         "withdrawals": 195
                         *       },
                         *       "weeklyTxs": {
                         *         "deposits": 2095,
                         *         "withdrawals": 1752
                         *       },
                         *       "monthlyTxs": {
                         *         "deposits": 6945,
                         *         "withdrawals": 5537
                         *       },
                         *       "chainBreakdown": {
                         *         "Polygon": {
                         *           "lastHourlyVolume": 118020.67633222912,
                         *           "currentDayVolume": 0,
                         *           "lastDailyVolume": 28740605.36474136,
                         *           "dayBeforeLastVolume": 17294645.046479236,
                         *           "weeklyVolume": 71188570.7201651,
                         *           "monthlyVolume": 490635601.59313035,
                         *           "last24hVolume": 34766385.06231544,
                         *           "lastHourlyTxs": {
                         *             "deposits": 10,
                         *             "withdrawals": 5
                         *           },
                         *           "currentDayTxs": {
                         *             "deposits": 0,
                         *             "withdrawals": 0
                         *           },
                         *           "prevDayTxs": {
                         *             "deposits": 153,
                         *             "withdrawals": 150
                         *           },
                         *           "dayBeforeLastTxs": {
                         *             "deposits": 173,
                         *             "withdrawals": 195
                         *           },
                         *           "weeklyTxs": {
                         *             "deposits": 2095,
                         *             "withdrawals": 1752
                         *           },
                         *           "monthlyTxs": {
                         *             "deposits": 6945,
                         *             "withdrawals": 5537
                         *           }
                         *         },
                         *         "Ethereum": {
                         *           "lastHourlyVolume": 118020.67633222912,
                         *           "currentDayVolume": 0,
                         *           "lastDailyVolume": 28740605.36474136,
                         *           "dayBeforeLastVolume": 17294645.046479236,
                         *           "weeklyVolume": 71188570.7201651,
                         *           "monthlyVolume": 490635601.59313035,
                         *           "last24hVolume": 34766385.06231544,
                         *           "lastHourlyTxs": {
                         *             "deposits": 10,
                         *             "withdrawals": 5
                         *           },
                         *           "currentDayTxs": {
                         *             "deposits": 0,
                         *             "withdrawals": 0
                         *           },
                         *           "prevDayTxs": {
                         *             "deposits": 153,
                         *             "withdrawals": 150
                         *           },
                         *           "dayBeforeLastTxs": {
                         *             "deposits": 173,
                         *             "withdrawals": 195
                         *           },
                         *           "weeklyTxs": {
                         *             "deposits": 2095,
                         *             "withdrawals": 1752
                         *           },
                         *           "monthlyTxs": {
                         *             "deposits": 6945,
                         *             "withdrawals": 5537
                         *           }
                         *         }
                         *       },
                         *       "destinationChain": "Polygon"
                         *     }
                         */
                        "application/json": {
                            /** @description Bridge ID */
                            id?: number;
                            /** @description Bridge name */
                            name?: string;
                            /** @description Bridge display name */
                            displayName?: string;
                            /** @description Last hourly volume */
                            lastHourlyVolume?: number;
                            /** @description Current day volume */
                            currentDayVolume?: number;
                            /** @description Last daily volume */
                            lastDailyVolume?: number;
                            /** @description Day before last volume */
                            dayBeforeLastVolume?: number;
                            /** @description Weekly volume */
                            weeklyVolume?: number;
                            /** @description Monthly volume */
                            monthlyVolume?: number;
                            lastHourlyTxs?: {
                                /** @description Number of deposit transactions */
                                deposits?: number;
                                /** @description Number of withdrawal transactions */
                                withdrawals?: number;
                            };
                            currentDayTxs?: {
                                /** @description Number of deposit transactions */
                                deposits?: number;
                                /** @description Number of withdrawal transactions */
                                withdrawals?: number;
                            };
                            prevDayTxs?: {
                                /** @description Number of deposit transactions */
                                deposits?: number;
                                /** @description Number of withdrawal transactions */
                                withdrawals?: number;
                            };
                            dayBeforeLastTxs?: {
                                /** @description Number of deposit transactions */
                                deposits?: number;
                                /** @description Number of withdrawal transactions */
                                withdrawals?: number;
                            };
                            weeklyTxs?: {
                                /** @description Number of deposit transactions */
                                deposits?: number;
                                /** @description Number of withdrawal transactions */
                                withdrawals?: number;
                            };
                            monthlyTxs?: {
                                /** @description Number of deposit transactions */
                                deposits?: number;
                                /** @description Number of withdrawal transactions */
                                withdrawals?: number;
                            };
                            chainBreakdown?: {
                                [key: string]: {
                                    /** @description Last hourly volume */
                                    lastHourlyVolume?: number;
                                    /** @description Current day volume */
                                    currentDayVolume?: number;
                                    /** @description Last daily volume */
                                    lastDailyVolume?: number;
                                    /** @description Day before last volume */
                                    dayBeforeLastVolume?: number;
                                    /** @description Weekly volume */
                                    weeklyVolume?: number;
                                    /** @description Monthly volume */
                                    monthlyVolume?: number;
                                    /** @description Last 24 hour volume */
                                    last24hVolume?: number;
                                    lastHourlyTxs?: {
                                        /** @description Number of deposit transactions */
                                        deposits?: number;
                                        /** @description Number of withdrawal transactions */
                                        withdrawals?: number;
                                    };
                                    currentDayTxs?: {
                                        /** @description Number of deposit transactions */
                                        deposits?: number;
                                        /** @description Number of withdrawal transactions */
                                        withdrawals?: number;
                                    };
                                    prevDayTxs?: {
                                        /** @description Number of deposit transactions */
                                        deposits?: number;
                                        /** @description Number of withdrawal transactions */
                                        withdrawals?: number;
                                    };
                                    dayBeforeLastTxs?: {
                                        /** @description Number of deposit transactions */
                                        deposits?: number;
                                        /** @description Number of withdrawal transactions */
                                        withdrawals?: number;
                                    };
                                    weeklyTxs?: {
                                        /** @description Number of deposit transactions */
                                        deposits?: number;
                                        /** @description Number of withdrawal transactions */
                                        withdrawals?: number;
                                    };
                                    monthlyTxs?: {
                                        /** @description Number of deposit transactions */
                                        deposits?: number;
                                        /** @description Number of withdrawal transactions */
                                        withdrawals?: number;
                                    };
                                };
                            };
                            /** @description Destination chain */
                            destinationChain?: string;
                        } | {
                            /** @description Transaction hash */
                            tx_hash?: string;
                            /** @description Timestamp in ISO format */
                            ts?: string;
                            /** @description Block number */
                            tx_block?: number;
                            /** @description From address */
                            tx_from?: string;
                            /** @description To address */
                            tx_to?: string;
                            /** @description Token contract address */
                            token?: string;
                            /** @description Transaction amount */
                            amount?: string;
                            /** @description Blockchain name */
                            chain?: string;
                            /** @description Bridge name */
                            bridge_name?: string;
                            /** @description USD value of transaction */
                            usd_value?: number | null;
                            /** @description Source chain name */
                            sourceChain?: string;
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
    "/usage/APIKEY": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get amount of credits left in the api key, these reset on the 1st of each month */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description credits left */
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
    "/coins/prices/current/{coins}": {
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
                                    /**
                                     * @description Token decimals. Omitted for coingecko-native assets (e.g. coingecko:ethereum).
                                     * @example 8
                                     */
                                    decimals?: number;
                                    /** @example 0.022053735051098835 */
                                    price: number;
                                    /** @example cDAI */
                                    symbol: string;
                                    /** @example 0.99 */
                                    timestamp: number;
                                    /**
                                     * @description Confidence score between 0 and 1 indicating the reliability of the price.
                                     * @example 0.99
                                     */
                                    confidence?: number;
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
    "/coins/prices/historical/{timestamp}/{coins}": {
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
                query?: never;
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
                                    /**
                                     * @description Token decimals. Omitted for coingecko-native assets (e.g. coingecko:ethereum).
                                     * @example 8
                                     */
                                    decimals?: number;
                                    /** @example 0.022053735051098835 */
                                    price: number;
                                    /** @example cDAI */
                                    symbol: string;
                                    /** @example 1648680149 */
                                    timestamp: number;
                                    /**
                                     * @description Confidence score between 0 and 1 indicating the reliability of the price.
                                     * @example 0.99
                                     */
                                    confidence?: number;
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
    "/coins/batchHistorical": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get historical prices for multiple tokens at multiple different timestamps */
        get: {
            parameters: {
                query: {
                    /** @description object where keys are coins in the form {chain}:{address}, and values are arrays of requested timestamps */
                    coins: string;
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
    "/coins/chart/{coins}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get token prices at regular time intervals
         * @description Strings accepted by period:
         *     Can use regular chart candle notion like '4h' etc where:
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
                                    /**
                                     * @description Token decimals. Omitted for coingecko-native assets (e.g. coingecko:ethereum).
                                     * @example 8
                                     */
                                    decimals?: number;
                                    /**
                                     * @description Confidence score between 0 and 1 indicating the reliability of the price.
                                     * @example 0.99
                                     */
                                    confidence: number;
                                    prices: {
                                        /** @example 1666790570 */
                                        timestamp?: number;
                                        /** @example 0.984519 */
                                        price?: number;
                                    }[];
                                    /** @example HUSD */
                                    symbol: string;
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
    "/coins/percentage/{coins}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get percentage change in price over time
         * @description Strings accepted by period:
         *     Can use regular chart candle notion like '4h' etc where:
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
    "/coins/prices/first/{coins}": {
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
    "/coins/block/{chain}/{timestamp}": {
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
    "/stablecoins/stablecoins": {
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
    "/stablecoins/stablecoincharts/all": {
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
    "/stablecoins/stablecoincharts/{chain}": {
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
    "/stablecoins/stablecoin/{asset}": {
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
    "/stablecoins/stablecoinchains": {
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
    "/stablecoins/stablecoinprices": {
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
    "/dat/institutions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get list of all institutions with Digital Asset Treasury data
         * @description Returns comprehensive data about institutions holding digital assets, including mNAV calculations (realized, realistic, maximum) as described in the [DAT Methodology](https://docs.llama.fi/analysts/dat-methodology)
         */
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
                        "application/json": {
                            institutionMetadata?: {
                                [key: string]: {
                                    /** @description Unique institution identifier */
                                    institutionId?: number;
                                    /**
                                     * @description Institution ticker symbol
                                     * @example MSTR
                                     */
                                    ticker?: string;
                                    /**
                                     * @description Institution name
                                     * @example Strategy, Inc. (Formerly: MicroStrategy Inc.)
                                     */
                                    name?: string;
                                    /**
                                     * @description Institution type
                                     * @example Stock
                                     */
                                    type?: string;
                                    /** @description Current share price */
                                    price?: number;
                                    /** @description 24h price change percentage */
                                    priceChange24h?: number;
                                    /** @description 24h trading volume */
                                    volume24h?: number;
                                    /** @description Market cap using current outstanding shares */
                                    mcapRealized?: number;
                                    /** @description Market cap accounting for unavoidable dilution */
                                    mcapRealistic?: number;
                                    /** @description Market cap under maximum dilution scenario */
                                    mcapMax?: number;
                                    /** @description Ratio of marketcap to crypto treasury using current shares */
                                    realized_mNAV?: number;
                                    /** @description Ratio accounting for unavoidable dilution */
                                    realistic_mNAV?: number;
                                    /** @description Ratio under maximum dilution scenario */
                                    max_mNAV?: number;
                                    /** @description Total USD value of crypto holdings */
                                    totalUsdValue?: number;
                                    /** @description Total cost basis of crypto holdings */
                                    totalCost?: number;
                                    holdings?: {
                                        [key: string]: {
                                            /** @description Amount of asset held */
                                            amount?: number;
                                            /** @description Average purchase price */
                                            avgPrice?: number;
                                            /** @description Current USD value */
                                            usdValue?: number;
                                            /** @description Total cost basis */
                                            cost?: number;
                                            /** @description Number of transactions */
                                            transactionCount?: number;
                                            /**
                                             * Format: date
                                             * @description Date of first announcement
                                             */
                                            firstAnnouncementDate?: string;
                                            /**
                                             * Format: date
                                             * @description Date of last announcement
                                             */
                                            lastAnnouncementDate?: string;
                                            /** @description Percentage of total supply held */
                                            supplyPercentage?: number;
                                        };
                                    };
                                };
                            };
                            assetMetadata?: {
                                [key: string]: {
                                    /**
                                     * @description Asset name
                                     * @example Bitcoin
                                     */
                                    name?: string;
                                    /**
                                     * @description Asset ticker
                                     * @example BTC
                                     */
                                    ticker?: string;
                                    /** @description CoinGecko ID */
                                    geckoId?: string;
                                    /** @description Number of companies holding this asset */
                                    companies?: number;
                                    /** @description Total amount held across all institutions */
                                    totalAmount?: number;
                                    /** @description Total USD value across all institutions */
                                    totalUsdValue?: number;
                                    /** @description Percentage of circulating supply held */
                                    circSupplyPerc?: number;
                                };
                            };
                            institutions?: {
                                /** @description Institution ID */
                                institutionId?: number;
                                /** @description Total USD value of holdings */
                                totalUsdValue?: number;
                                /** @description Total cost basis */
                                totalCost?: number;
                            }[];
                            assets?: {
                                [key: string]: {
                                    /** @description Institution ID */
                                    institutionId?: number;
                                    /** @description USD value of holding */
                                    usdValue?: number;
                                    /** @description Amount held */
                                    amount?: number;
                                }[];
                            };
                            /** @description Total number of companies tracked */
                            totalCompanies?: number;
                            flows?: {
                                [key: string]: [
                                    number,
                                    number,
                                    number,
                                    number,
                                    number,
                                    number
                                ][];
                            };
                            mNAV?: {
                                [key: string]: {
                                    [key: string]: [
                                        number,
                                        number,
                                        number,
                                        number
                                    ][];
                                };
                            };
                            /**
                             * Format: date-time
                             * @description Last update timestamp
                             */
                            lastUpdated?: string;
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
    "/dat/institutions/{symbol}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get individual institution Digital Asset Treasury details
         * @description Returns detailed data for a specific institution, including mNAV calculations (realized, realistic, maximum) as described in the [DAT Methodology](https://docs.llama.fi/analysts/dat-methodology)
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description Institution ticker symbol (e.g., MSTR for MicroStrategy) */
                    symbol: string;
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
                            /** @description Unique institution identifier */
                            institutionId?: number;
                            /**
                             * @description Institution ticker symbol
                             * @example MSTR
                             */
                            ticker?: string;
                            /**
                             * @description Institution name
                             * @example Strategy, Inc. (Formerly: MicroStrategy Inc.)
                             */
                            name?: string;
                            /**
                             * @description Institution type
                             * @example Stock
                             */
                            type?: string;
                            /** @description Institution rank */
                            rank?: number;
                            /** @description Current share price */
                            price?: number;
                            /** @description 24h price change percentage */
                            priceChange24h?: number;
                            /** @description 24h trading volume */
                            volume24h?: number;
                            /** @description Fully diluted shares - realized count */
                            fd_realized?: string;
                            /** @description Fully diluted shares - realistic count */
                            fd_realistic?: string;
                            /** @description Fully diluted shares - maximum count */
                            fd_max?: string;
                            /** @description Market cap using realized share count */
                            mcap_realized?: number;
                            /** @description Market cap using realistic share count */
                            mcap_realistic?: number;
                            /** @description Market cap using maximum share count */
                            mcap_max?: number;
                            /** @description Realized mNAV ratio */
                            realized_mNAV?: number;
                            /** @description Realistic mNAV ratio */
                            realistic_mNAV?: number;
                            /** @description Maximum mNAV ratio */
                            max_mNAV?: number;
                            /** @description Total cost basis of crypto holdings */
                            totalCost?: number;
                            /** @description Total USD value of crypto holdings */
                            totalUsdValue?: number;
                            /** @description Asset holdings by asset type */
                            assets?: {
                                [key: string]: {
                                    /** @description Amount of asset held */
                                    amount?: number;
                                    /** @description Average purchase price */
                                    avgPrice?: number;
                                    /** @description Current USD value */
                                    usdValue?: number;
                                    /** @description Total cost basis */
                                    cost?: number;
                                };
                            };
                            /** @description Metadata for assets held */
                            assetsMeta?: {
                                [key: string]: {
                                    /**
                                     * @description Asset name
                                     * @example Bitcoin
                                     */
                                    name?: string;
                                    /**
                                     * @description Asset ticker
                                     * @example BTC
                                     */
                                    ticker?: string;
                                };
                            };
                            /** @description Historical OHLCV data */
                            ohlcv?: [
                                number,
                                number,
                                number,
                                number,
                                number,
                                number
                            ][];
                            /** @description Historical asset value data */
                            assetValue?: [
                                number,
                                number
                            ][];
                            /** @description Compact historical stats: [timestamp, fd_realized, fd_realistic, fd_maximum, mcap_realized, mcap_realistic, mcap_max, mnav_realized, mnav_realistic, mnav_max] */
                            stats?: [
                                number,
                                number,
                                number,
                                number,
                                number,
                                number,
                                number,
                                number,
                                number,
                                number
                            ][];
                            /** @description Transaction history */
                            transactions?: {
                                /** @description Transaction ID */
                                id?: number;
                                /**
                                 * @description Asset type
                                 * @example bitcoin
                                 */
                                asset?: string;
                                /** @description Amount transacted */
                                amount?: string;
                                /** @description Average price per unit */
                                avg_price?: string;
                                /** @description Total USD value */
                                usd_value?: string;
                                /**
                                 * Format: date
                                 * @description Transaction start date
                                 */
                                start_date?: string;
                                /**
                                 * Format: date
                                 * @description Transaction end date
                                 */
                                end_date?: string;
                                /**
                                 * Format: date
                                 * @description Report date
                                 */
                                report_date?: string;
                                /**
                                 * @description Transaction type
                                 * @example purchase
                                 */
                                type?: string;
                                /**
                                 * @description Source type
                                 * @example filing
                                 */
                                source_type?: string;
                                /** @description Source URL */
                                source_url?: string;
                                /** @description Source note with transaction details */
                                source_note?: string;
                                /** @description Whether transaction is approved */
                                is_approved?: boolean;
                                /** @description Rejection reason if not approved */
                                reject_reason?: string | null;
                                /**
                                 * Format: date-time
                                 * @description Last update timestamp
                                 */
                                last_updated?: string;
                                /** @description Institution ticker */
                                ticker?: string;
                                /** @description Asset name */
                                assetName?: string;
                                /** @description Asset ticker */
                                assetTicker?: string;
                            }[];
                            /**
                             * Format: date-time
                             * @description Last update timestamp
                             */
                            lastUpdated?: string;
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
    "/equities/v1/companies-list": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get list of all tracked public companies
         * @description Returns a list of all publicly traded companies tracked by DefiLlama, with company identity and country.
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Successful operation */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @example NVDA */
                            ticker?: string;
                            /** @example NVIDIA Corporation */
                            companyName?: string;
                            /** @example US */
                            country?: string;
                            /** @example United States */
                            countryName?: string;
                        }[];
                    };
                };
                /** @description Unauthorized */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description Internal server error */
                500: {
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
    "/equities/v1/statements": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get financial statements for a company
         * @description Returns income statement, balance sheet, and cash flow statement for the given ticker, broken down by quarterly and annual periods.
         */
        get: {
            parameters: {
                query: {
                    /** @description Stock ticker symbol (case-insensitive) */
                    ticker: string;
                    /** @description Two-letter country code (ISO 3166-1 alpha-2) for the company, as returned by `GET /equities/v1/companies-list` (case-insensitive). */
                    country: string;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Successful operation */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "incomeStatement": {
                         *         "labels": [
                         *           "Revenue",
                         *           "Cost of Revenue",
                         *           "Gross Profit",
                         *           "Operating Expenses",
                         *           "Operating Income",
                         *           "Non-Operating Items",
                         *           "Income Before Tax",
                         *           "Income Tax",
                         *           "Net Income",
                         *           "Minority Interests",
                         *           "Preferred Stock Dividends",
                         *           "Net Income to Common",
                         *           "Shares Outstanding (Basic)",
                         *           "Shares Outstanding (Diluted)",
                         *           "EPS (Basic)",
                         *           "EPS (Diluted)",
                         *           "EBIT",
                         *           "EBITDA"
                         *         ],
                         *         "children": {
                         *           "quarterly": {
                         *             "Operating Expenses": {
                         *               "labels": [
                         *                 "Research and Development",
                         *                 "Selling, General, and Administrative",
                         *                 "Other Operating Expenses"
                         *               ]
                         *             },
                         *             "Non-Operating Items": {
                         *               "labels": [
                         *                 "Non-Operating Interest Income",
                         *                 "Non-Operating Interest Expense",
                         *                 "Other Income/Expense"
                         *               ]
                         *             }
                         *           },
                         *           "annual": {
                         *             "Operating Expenses": {
                         *               "labels": [
                         *                 "Research and Development",
                         *                 "Selling, General, and Administrative",
                         *                 "Other Operating Expenses"
                         *               ]
                         *             },
                         *             "Non-Operating Items": {
                         *               "labels": [
                         *                 "Non-Operating Interest Income",
                         *                 "Non-Operating Interest Expense",
                         *                 "Other Income/Expense"
                         *               ]
                         *             }
                         *           }
                         *         },
                         *         "quarterly": {
                         *           "periodEnding": [
                         *             "2024-03-31",
                         *             "2024-06-30",
                         *             "2024-09-30",
                         *             "2024-12-31"
                         *           ],
                         *           "values": [
                         *             [
                         *               1801112000,
                         *               2227962000,
                         *               1311908000,
                         *               2498462000
                         *             ],
                         *             [
                         *               234066000,
                         *               335426000,
                         *               197251000,
                         *               501181000
                         *             ],
                         *             [
                         *               1567046000,
                         *               1892536000,
                         *               1114657000,
                         *               1997281000
                         *             ],
                         *             [
                         *               987713000,
                         *               874725000,
                         *               791808000,
                         *               922324000
                         *             ],
                         *             [
                         *               579333000,
                         *               1017811000,
                         *               322849000,
                         *               1074957000
                         *             ],
                         *             [
                         *               8953000,
                         *               -5844000,
                         *               -20948000,
                         *               -31784000
                         *             ],
                         *             [
                         *               588286000,
                         *               1011967000,
                         *               301901000,
                         *               1043173000
                         *             ],
                         *             [
                         *               123540000,
                         *               212513000,
                         *               63399000,
                         *               219066000
                         *             ],
                         *             [
                         *               464746000,
                         *               799454000,
                         *               238502000,
                         *               824107000
                         *             ],
                         *             [
                         *               0,
                         *               0,
                         *               0,
                         *               0
                         *             ],
                         *             [
                         *               0,
                         *               0,
                         *               0,
                         *               0
                         *             ],
                         *             [
                         *               464746000,
                         *               799454000,
                         *               238502000,
                         *               824107000
                         *             ],
                         *             [
                         *               243000000,
                         *               245000000,
                         *               247000000,
                         *               249000000
                         *             ],
                         *             [
                         *               256000000,
                         *               258000000,
                         *               260000000,
                         *               262000000
                         *             ],
                         *             [
                         *               1.91,
                         *               3.26,
                         *               0.97,
                         *               3.31
                         *             ],
                         *             [
                         *               1.82,
                         *               3.1,
                         *               0.92,
                         *               3.15
                         *             ],
                         *             [
                         *               588286000,
                         *               1011967000,
                         *               301901000,
                         *               1043173000
                         *             ],
                         *             [
                         *               678286000,
                         *               1101967000,
                         *               391901000,
                         *               1133173000
                         *             ]
                         *           ],
                         *           "children": {
                         *             "Operating Expenses": {
                         *               "values": [
                         *                 [
                         *                   184225000,
                         *                   291461000,
                         *                   356264000,
                         *                   459611000
                         *                 ],
                         *                 [
                         *                   682257000,
                         *                   535713000,
                         *                   405395000,
                         *                   461678000
                         *                 ],
                         *                 [
                         *                   121231000,
                         *                   47551000,
                         *                   30149000,
                         *                   1035000
                         *                 ]
                         *               ]
                         *             },
                         *             "Non-Operating Items": {
                         *               "values": [
                         *                 [
                         *                   25000000,
                         *                   28000000,
                         *                   30000000,
                         *                   32000000
                         *                 ],
                         *                 [
                         *                   -12000000,
                         *                   -30000000,
                         *                   -45000000,
                         *                   -58000000
                         *                 ],
                         *                 [
                         *                   -4047000,
                         *                   -3844000,
                         *                   -5948000,
                         *                   -5784000
                         *                 ]
                         *               ]
                         *             }
                         *           }
                         *         },
                         *         "annual": {
                         *           "periodEnding": [
                         *             "2023-12-31",
                         *             "2024-12-31"
                         *           ],
                         *           "values": [
                         *             [
                         *               3037428000,
                         *               7839444000
                         *             ],
                         *             [
                         *               811923000,
                         *               1267924000
                         *             ],
                         *             [
                         *               2225505000,
                         *               6571520000
                         *             ],
                         *             [
                         *               2890526000,
                         *               3576570000
                         *             ],
                         *             [
                         *               -665021000,
                         *               2994950000
                         *             ],
                         *             [
                         *               -54982000,
                         *               -49623000
                         *             ],
                         *             [
                         *               -720003000,
                         *               2945327000
                         *             ],
                         *             [
                         *               -110000000,
                         *               615000000
                         *             ],
                         *             [
                         *               -610003000,
                         *               2330327000
                         *             ],
                         *             [
                         *               0,
                         *               0
                         *             ],
                         *             [
                         *               0,
                         *               0
                         *             ],
                         *             [
                         *               -610003000,
                         *               2330327000
                         *             ],
                         *             [
                         *               235000000,
                         *               246000000
                         *             ],
                         *             [
                         *               235000000,
                         *               259000000
                         *             ],
                         *             [
                         *               -2.6,
                         *               9.47
                         *             ],
                         *             [
                         *               -2.6,
                         *               9
                         *             ],
                         *             [
                         *               -720003000,
                         *               2945327000
                         *             ],
                         *             [
                         *               -540000000,
                         *               3300000000
                         *             ]
                         *           ],
                         *           "children": {
                         *             "Operating Expenses": {
                         *               "values": [
                         *                 [
                         *                   955264000,
                         *                   1291561000
                         *                 ],
                         *                 [
                         *                   1623040000,
                         *                   2085743000
                         *                 ],
                         *                 [
                         *                   312222000,
                         *                   199266000
                         *                 ]
                         *               ]
                         *             },
                         *             "Non-Operating Items": {
                         *               "values": [
                         *                 [
                         *                   85000000,
                         *                   115000000
                         *                 ],
                         *                 [
                         *                   -95000000,
                         *                   -145000000
                         *                 ],
                         *                 [
                         *                   -44982000,
                         *                   -19623000
                         *                 ]
                         *               ]
                         *             }
                         *           }
                         *         }
                         *       },
                         *       "balanceSheet": {
                         *         "labels": [
                         *           "Total Current Assets",
                         *           "Total Non-Current Assets",
                         *           "Total Assets",
                         *           "Total Current Liabilities",
                         *           "Total Non-Current Liabilities",
                         *           "Total Liabilities",
                         *           "Total Shareholders Equity",
                         *           "Minority Interest",
                         *           "Total Equity",
                         *           "Total Liabilities and Equity"
                         *         ],
                         *         "children": {
                         *           "quarterly": {
                         *             "Total Current Assets": {
                         *               "labels": [
                         *                 "Cash",
                         *                 "Cash Equivalents",
                         *                 "Cash and Cash Equivalents",
                         *                 "Other Short-Term Investments",
                         *                 "Accounts Receivable",
                         *                 "Other Receivables",
                         *                 "Inventory",
                         *                 "Prepaid Assets",
                         *                 "Restricted Cash",
                         *                 "Assets Held for Sale",
                         *                 "Hedging Assets",
                         *                 "Other Current Assets"
                         *               ]
                         *             },
                         *             "Total Non-Current Assets": {
                         *               "labels": [
                         *                 "Properties",
                         *                 "Land and Improvements",
                         *                 "Machinery, Furniture and Equipment",
                         *                 "Construction in Progress",
                         *                 "Leases",
                         *                 "Accumulated Depreciation",
                         *                 "Goodwill",
                         *                 "Investment Properties",
                         *                 "Financial Assets",
                         *                 "Intangible Assets",
                         *                 "Investments and Advances",
                         *                 "Other Non-Current Assets"
                         *               ]
                         *             },
                         *             "Total Current Liabilities": {
                         *               "labels": [
                         *                 "Accounts Payable",
                         *                 "Accrued Expenses",
                         *                 "Short-Term Debt",
                         *                 "Deferred Revenue",
                         *                 "Tax Payable",
                         *                 "Pensions",
                         *                 "Other Current Liabilities"
                         *               ]
                         *             },
                         *             "Total Non-Current Liabilities": {
                         *               "labels": [
                         *                 "Long-Term Provisions",
                         *                 "Long-Term Debt",
                         *                 "Provision for Risks and Charges",
                         *                 "Deferred Liabilities",
                         *                 "Derivative Product Liabilities",
                         *                 "Other Non-Current Liabilities"
                         *               ]
                         *             },
                         *             "Total Shareholders Equity": {
                         *               "labels": [
                         *                 "Common Stock",
                         *                 "Retained Earnings",
                         *                 "Other Shareholders' Equity",
                         *                 "Additional Paid-In Capital",
                         *                 "Treasury Stock"
                         *               ]
                         *             }
                         *           },
                         *           "annual": {
                         *             "Total Current Assets": {
                         *               "labels": [
                         *                 "Cash",
                         *                 "Cash Equivalents",
                         *                 "Cash and Cash Equivalents",
                         *                 "Other Short-Term Investments",
                         *                 "Accounts Receivable",
                         *                 "Other Receivables",
                         *                 "Inventory",
                         *                 "Prepaid Assets",
                         *                 "Restricted Cash",
                         *                 "Assets Held for Sale",
                         *                 "Hedging Assets",
                         *                 "Other Current Assets"
                         *               ]
                         *             },
                         *             "Total Non-Current Assets": {
                         *               "labels": [
                         *                 "Properties",
                         *                 "Land and Improvements",
                         *                 "Machinery, Furniture and Equipment",
                         *                 "Construction in Progress",
                         *                 "Leases",
                         *                 "Accumulated Depreciation",
                         *                 "Goodwill",
                         *                 "Investment Properties",
                         *                 "Financial Assets",
                         *                 "Intangible Assets",
                         *                 "Investments and Advances",
                         *                 "Other Non-Current Assets"
                         *               ]
                         *             },
                         *             "Total Current Liabilities": {
                         *               "labels": [
                         *                 "Accounts Payable",
                         *                 "Accrued Expenses",
                         *                 "Short-Term Debt",
                         *                 "Deferred Revenue",
                         *                 "Tax Payable",
                         *                 "Pensions",
                         *                 "Other Current Liabilities"
                         *               ]
                         *             },
                         *             "Total Non-Current Liabilities": {
                         *               "labels": [
                         *                 "Long-Term Provisions",
                         *                 "Long-Term Debt",
                         *                 "Provision for Risks and Charges",
                         *                 "Deferred Liabilities",
                         *                 "Derivative Product Liabilities",
                         *                 "Other Non-Current Liabilities"
                         *               ]
                         *             },
                         *             "Total Shareholders Equity": {
                         *               "labels": [
                         *                 "Common Stock",
                         *                 "Retained Earnings",
                         *                 "Other Shareholders' Equity",
                         *                 "Additional Paid-In Capital",
                         *                 "Treasury Stock"
                         *               ]
                         *             }
                         *           }
                         *         },
                         *         "quarterly": {
                         *           "periodEnding": [
                         *             "2024-03-31",
                         *             "2024-06-30",
                         *             "2024-09-30",
                         *             "2024-12-31"
                         *           ],
                         *           "values": [
                         *             [
                         *               79373000,
                         *               204728000,
                         *               209604000,
                         *               215571000
                         *             ],
                         *             [
                         *               126996000,
                         *               248147000,
                         *               250536000,
                         *               254181000
                         *             ],
                         *             [
                         *               206369000,
                         *               452875000,
                         *               460140000,
                         *               469752000
                         *             ],
                         *             [
                         *               108736000,
                         *               110517000,
                         *               111958000,
                         *               113465000
                         *             ],
                         *             [
                         *               108736000,
                         *               110517000,
                         *               111958000,
                         *               113465000
                         *             ],
                         *             [
                         *               217472000,
                         *               221034000,
                         *               223916000,
                         *               226930000
                         *             ],
                         *             [
                         *               231489000,
                         *               234641000,
                         *               237270000,
                         *               314164000
                         *             ],
                         *             [
                         *               0,
                         *               0,
                         *               0,
                         *               0
                         *             ],
                         *             [
                         *               231489000,
                         *               234641000,
                         *               237270000,
                         *               314164000
                         *             ],
                         *             [
                         *               448961000,
                         *               455675000,
                         *               461186000,
                         *               541094000
                         *             ]
                         *           ],
                         *           "children": {}
                         *         },
                         *         "annual": {
                         *           "periodEnding": [
                         *             "2023-12-31",
                         *             "2024-12-31"
                         *           ],
                         *           "values": [
                         *             [
                         *               217472000,
                         *               226930000
                         *             ],
                         *             [
                         *               217472000,
                         *               226930000
                         *             ],
                         *             [
                         *               434944000,
                         *               453860000
                         *             ],
                         *             [
                         *               110517000,
                         *               113465000
                         *             ],
                         *             [
                         *               110517000,
                         *               113465000
                         *             ],
                         *             [
                         *               221034000,
                         *               226930000
                         *             ],
                         *             [
                         *               234641000,
                         *               314164000
                         *             ],
                         *             [
                         *               0,
                         *               0
                         *             ],
                         *             [
                         *               234641000,
                         *               314164000
                         *             ],
                         *             [
                         *               455675000,
                         *               541094000
                         *             ]
                         *           ],
                         *           "children": {}
                         *         }
                         *       },
                         *       "cashflow": {
                         *         "labels": [
                         *           "Cash Flow from Operating Activities",
                         *           "Cash Flow from Investing Activities",
                         *           "Cash Flow from Financing Activities",
                         *           "Net Cash Flow",
                         *           "Free Cash Flow",
                         *           "End Cash Position",
                         *           "Income Tax Paid",
                         *           "Interest Paid"
                         *         ],
                         *         "children": {
                         *           "quarterly": {
                         *             "Cash Flow from Operating Activities": {
                         *               "labels": [
                         *                 "Net Income",
                         *                 "Depreciation",
                         *                 "Deferred Taxes",
                         *                 "Stock-Based Compensation",
                         *                 "Other Non-Cash Items",
                         *                 "Accounts Receivable",
                         *                 "Accounts Payable",
                         *                 "Other Assets and Liabilities"
                         *               ]
                         *             },
                         *             "Cash Flow from Investing Activities": {
                         *               "labels": [
                         *                 "Capital Expenditures",
                         *                 "Net Intangibles",
                         *                 "Net Acquisitions",
                         *                 "Purchase of Investments",
                         *                 "Sale of Investments",
                         *                 "Other Investing Activity"
                         *               ]
                         *             },
                         *             "Cash Flow from Financing Activities": {
                         *               "labels": [
                         *                 "Long-Term Debt Issuance",
                         *                 "Long-Term Debt Payments",
                         *                 "Short-Term Debt Issuance",
                         *                 "Common Stock Issuance",
                         *                 "Common Stock Repurchase",
                         *                 "Common Dividends",
                         *                 "Other Financing Charges"
                         *               ]
                         *             }
                         *           },
                         *           "annual": {
                         *             "Cash Flow from Operating Activities": {
                         *               "labels": [
                         *                 "Net Income",
                         *                 "Depreciation",
                         *                 "Deferred Taxes",
                         *                 "Stock-Based Compensation",
                         *                 "Other Non-Cash Items",
                         *                 "Accounts Receivable",
                         *                 "Accounts Payable",
                         *                 "Other Assets and Liabilities"
                         *               ]
                         *             },
                         *             "Cash Flow from Investing Activities": {
                         *               "labels": [
                         *                 "Capital Expenditures",
                         *                 "Net Intangibles",
                         *                 "Net Acquisitions",
                         *                 "Purchase of Investments",
                         *                 "Sale of Investments",
                         *                 "Other Investing Activity"
                         *               ]
                         *             },
                         *             "Cash Flow from Financing Activities": {
                         *               "labels": [
                         *                 "Long-Term Debt Issuance",
                         *                 "Long-Term Debt Payments",
                         *                 "Short-Term Debt Issuance",
                         *                 "Common Stock Issuance",
                         *                 "Common Stock Repurchase",
                         *                 "Common Dividends",
                         *                 "Other Financing Charges"
                         *               ]
                         *             }
                         *           }
                         *         },
                         *         "quarterly": {
                         *           "periodEnding": [
                         *             "2024-03-31",
                         *             "2024-06-30",
                         *             "2024-09-30",
                         *             "2024-12-31"
                         *           ],
                         *           "values": [
                         *             [
                         *               234066000,
                         *               335426000,
                         *               197251000,
                         *               501181000
                         *             ],
                         *             [
                         *               -121231000,
                         *               -248195000,
                         *               -242642000,
                         *               -297324000
                         *             ],
                         *             [
                         *               -98771300,
                         *               -87472500,
                         *               -29180800,
                         *               -92232400
                         *             ],
                         *             [
                         *               14063400,
                         *               -291300,
                         *               -74572000,
                         *               111624400
                         *             ],
                         *             [
                         *               112835000,
                         *               87231000,
                         *               -45391000,
                         *               203857000
                         *             ],
                         *             [
                         *               450000000,
                         *               449708700,
                         *               375136700,
                         *               486761100
                         *             ],
                         *             [
                         *               123540000,
                         *               212513000,
                         *               63399000,
                         *               219066000
                         *             ],
                         *             [
                         *               12000000,
                         *               30000000,
                         *               45000000,
                         *               58000000
                         *             ]
                         *           ],
                         *           "children": {}
                         *         },
                         *         "annual": {
                         *           "periodEnding": [
                         *             "2023-12-31",
                         *             "2024-12-31"
                         *           ],
                         *           "values": [
                         *             [
                         *               277826000,
                         *               317042000
                         *             ],
                         *             [
                         *               -413578000,
                         *               -362519000
                         *             ],
                         *             [
                         *               -55446300,
                         *               103406900
                         *             ],
                         *             [
                         *               -191198300,
                         *               57929900
                         *             ],
                         *             [
                         *               -135752000,
                         *               -45477000
                         *             ],
                         *             [
                         *               450000000,
                         *               507929900
                         *             ],
                         *             [
                         *               110000000,
                         *               615000000
                         *             ],
                         *             [
                         *               95000000,
                         *               145000000
                         *             ]
                         *           ],
                         *           "children": {}
                         *         }
                         *       }
                         *     }
                         */
                        "application/json": {
                            /** @description Income statement data. The `labels` array defines the rows; `values` is a parallel array of arrays where each inner array holds one row's values across all periods. */
                            incomeStatement?: {
                                /**
                                 * @description Ordered list of income statement line items. Each index corresponds to an inner array in `quarterly.values` and `annual.values`.
                                 * @example [
                                 *       "Revenue",
                                 *       "Cost of Revenue",
                                 *       "Gross Profit",
                                 *       "Operating Expenses",
                                 *       "Operating Income",
                                 *       "Non-Operating Items",
                                 *       "Income Before Tax",
                                 *       "Income Tax",
                                 *       "Net Income",
                                 *       "Minority Interests",
                                 *       "Preferred Stock Dividends",
                                 *       "Net Income to Common",
                                 *       "Shares Outstanding (Basic)",
                                 *       "Shares Outstanding (Diluted)",
                                 *       "EPS (Basic)",
                                 *       "EPS (Diluted)",
                                 *       "EBIT",
                                 *       "EBITDA"
                                 *     ]
                                 */
                                labels?: string[];
                                /** @description Metadata describing which top-level labels have child breakdowns and what those child labels are, separately for quarterly and annual periods. */
                                children?: {
                                    /** @description Child label definitions for quarterly data. Keys are parent label names from `labels`. */
                                    quarterly?: {
                                        [key: string]: {
                                            /** @description Child line item names for this parent. Each index corresponds to an inner array in `quarterly.children[label].values`. */
                                            labels?: string[];
                                        };
                                    };
                                    /** @description Child label definitions for annual data. Keys are parent label names from `labels`. */
                                    annual?: {
                                        [key: string]: {
                                            labels?: string[];
                                        };
                                    };
                                };
                                /** @description Quarterly period data for the income statement. */
                                quarterly?: {
                                    /**
                                     * @description ISO 8601 date each quarter ended.
                                     * @example [
                                     *       "2024-03-31",
                                     *       "2024-06-30",
                                     *       "2024-09-30",
                                     *       "2024-12-31"
                                     *     ]
                                     */
                                    periodEnding?: string[];
                                    /** @description Parallel to `labels`. Each inner array contains the values for that row across all `periodEnding` entries. Values may be `null` when not reported. */
                                    values?: (number | null)[][];
                                    /** @description Breakdown data for parent labels that have sub-components. Keys match parent label names. Child labels are defined in `children.quarterly[label].labels`. */
                                    children?: {
                                        [key: string]: {
                                            /** @description One inner array per child label, each containing values across all periods. Values may be `null`. */
                                            values?: (number | null)[][];
                                        };
                                    };
                                };
                                /** @description Annual period data for the income statement. */
                                annual?: {
                                    /**
                                     * @description ISO 8601 date each fiscal year ended.
                                     * @example [
                                     *       "2022-12-31",
                                     *       "2023-12-31",
                                     *       "2024-12-31"
                                     *     ]
                                     */
                                    periodEnding?: string[];
                                    /** @description Parallel to `labels`. Each inner array contains the values for that row across all `periodEnding` entries. Values may be `null`. */
                                    values?: (number | null)[][];
                                    /** @description Breakdown data for parent labels that have sub-components. Child labels are defined in `children.annual[label].labels`. */
                                    children?: {
                                        [key: string]: {
                                            values?: (number | null)[][];
                                        };
                                    };
                                };
                            };
                            /** @description Balance sheet data. Follows the same structure as `incomeStatement`: top-level `labels`, `children` metadata, and `quarterly`/`annual` period objects each containing `periodEnding`, `values`, and `children`. */
                            balanceSheet?: {
                                /**
                                 * @description Ordered list of balance sheet line items.
                                 * @example [
                                 *       "Total Current Assets",
                                 *       "Total Non-Current Assets",
                                 *       "Total Assets",
                                 *       "Total Current Liabilities",
                                 *       "Total Non-Current Liabilities",
                                 *       "Total Liabilities",
                                 *       "Total Shareholders Equity",
                                 *       "Minority Interest",
                                 *       "Total Equity",
                                 *       "Total Liabilities and Equity"
                                 *     ]
                                 */
                                labels?: string[];
                                children?: {
                                    quarterly?: {
                                        [key: string]: {
                                            labels?: string[];
                                        };
                                    };
                                    annual?: {
                                        [key: string]: {
                                            labels?: string[];
                                        };
                                    };
                                };
                                quarterly?: {
                                    periodEnding?: string[];
                                    values?: (number | null)[][];
                                    children?: {
                                        [key: string]: {
                                            values?: (number | null)[][];
                                        };
                                    };
                                };
                                annual?: {
                                    periodEnding?: string[];
                                    values?: (number | null)[][];
                                    children?: {
                                        [key: string]: {
                                            values?: (number | null)[][];
                                        };
                                    };
                                };
                            };
                            /** @description Cash flow statement data. Follows the same structure as `incomeStatement`: top-level `labels`, `children` metadata, and `quarterly`/`annual` period objects each containing `periodEnding`, `values`, and `children`. */
                            cashflow?: {
                                /**
                                 * @description Ordered list of cash flow line items.
                                 * @example [
                                 *       "Cash Flow from Operating Activities",
                                 *       "Cash Flow from Investing Activities",
                                 *       "Cash Flow from Financing Activities",
                                 *       "Net Cash Flow",
                                 *       "Free Cash Flow",
                                 *       "End Cash Position",
                                 *       "Income Tax Paid",
                                 *       "Interest Paid"
                                 *     ]
                                 */
                                labels?: string[];
                                children?: {
                                    quarterly?: {
                                        [key: string]: {
                                            labels?: string[];
                                        };
                                    };
                                    annual?: {
                                        [key: string]: {
                                            labels?: string[];
                                        };
                                    };
                                };
                                quarterly?: {
                                    periodEnding?: string[];
                                    values?: (number | null)[][];
                                    children?: {
                                        [key: string]: {
                                            values?: (number | null)[][];
                                        };
                                    };
                                };
                                annual?: {
                                    periodEnding?: string[];
                                    values?: (number | null)[][];
                                    children?: {
                                        [key: string]: {
                                            values?: (number | null)[][];
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
                /** @description Missing required ticker parameter */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description Unauthorized */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description Ticker not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description Internal server error */
                500: {
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
    "/equities/v1/dimensions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get financial dimensions for a company
         * @description Returns time-series financial dimension metrics (revenue, holders revenue, earnings, and basic shares outstanding) for the given ticker, each broken down into annual and quarterly series. Every data point is a two-element array: ISO 8601 period-ending date, then the numeric value. Series are sorted by date descending (newest first).
         */
        get: {
            parameters: {
                query: {
                    /** @description Stock ticker symbol (case-insensitive) */
                    ticker: string;
                    /** @description Two-letter country code (ISO 3166-1 alpha-2) for the company, as returned by `GET /equities/v1/companies-list` (case-insensitive). */
                    country: string;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Successful operation */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            [key: string]: {
                                /** @description Annual data points, newest first. Each item is `[periodEnding, value]`. */
                                annual?: (string | number)[][];
                                /** @description Quarterly data points, newest first. Each item is `[periodEnding, value]`. */
                                quarterly?: (string | number)[][];
                            };
                        };
                    };
                };
                /** @description Missing required ticker parameter */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description Unauthorized */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description Ticker not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description Internal server error */
                500: {
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
    "/equities/v1/price-history": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get historical price data for a company
         * @description Returns closing prices as two-element arrays: ISO 8601 date-time string, then numeric price. Sorted by date descending (newest first). Resolution follows `timeframe`: `1D`, `7D` and `1W` are 5-minute intraday bars whose date-time carries a real time of day, while `1M` and longer are daily closes stamped `T00:00:00Z`.
         */
        get: {
            parameters: {
                query: {
                    /** @description Stock ticker symbol (case-insensitive) */
                    ticker: string;
                    /** @description Two-letter country code (ISO 3166-1 alpha-2) for the company, as returned by `GET /equities/v1/companies-list` (case-insensitive). */
                    country: string;
                    /** @description Optional lookback window (case-insensitive). `1D` returns the most recent trading session and `7D`/`1W` (aliases) the last 7 days, both at 5-minute resolution; `1M` and longer are daily. `YTD` runs from January 1 of the current year. Omit or empty for full history (`MAX`). Intraday coverage is best-effort — a ticker without intraday data falls back to daily bars, and `1D` then returns the single most recent daily bar. */
                    timeframe?: "1D" | "7D" | "1W" | "1M" | "3M" | "6M" | "YTD" | "1Y" | "5Y" | "MAX";
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Successful operation */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": (string | number)[][];
                    };
                };
                /** @description Missing required `ticker` or invalid `timeframe` */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @example Invalid timeframe */
                            error?: string;
                            /**
                             * @example [
                             *       "1D",
                             *       "7D",
                             *       "1W",
                             *       "1M",
                             *       "3M",
                             *       "6M",
                             *       "YTD",
                             *       "1Y",
                             *       "5Y",
                             *       "MAX"
                             *     ]
                             */
                            validTimeframes?: string[];
                        };
                    };
                };
                /** @description Unauthorized */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description Prices not found for ticker */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description Internal server error */
                500: {
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
    "/equities/v1/ohlcv": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get OHLCV candle data for a company
         * @description Returns OHLCV bars as six-number arrays: Unix timestamp in seconds (UTC), open, high, low, close, volume. Sorted by time descending (newest first). Optional `timeframe` controls both how far back data goes and the bar resolution: `1D`, `7D` and `1W` return 5-minute bars, `1M` and longer return daily bars. Omit or empty for full history (`MAX`).
         */
        get: {
            parameters: {
                query: {
                    /** @description Stock ticker symbol (case-insensitive) */
                    ticker: string;
                    /** @description Two-letter country code (ISO 3166-1 alpha-2) for the company, as returned by `GET /equities/v1/companies-list` (case-insensitive). */
                    country: string;
                    /** @description Optional lookback window (case-insensitive), same values as price history. `1D` returns the most recent trading session and `7D`/`1W` (aliases) the last 7 days, both as 5-minute bars; `1M` and longer are daily bars. `YTD` runs from January 1 of the current year. Omit or empty for full history (`MAX`). Intraday coverage is best-effort — a ticker without intraday data falls back to daily bars. */
                    timeframe?: "1D" | "7D" | "1W" | "1M" | "3M" | "6M" | "YTD" | "1Y" | "5Y" | "MAX";
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Successful operation */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": number[][];
                    };
                };
                /** @description Missing required `ticker` or invalid `timeframe` */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @example Invalid timeframe */
                            error?: string;
                            /**
                             * @example [
                             *       "1D",
                             *       "7D",
                             *       "1W",
                             *       "1M",
                             *       "3M",
                             *       "6M",
                             *       "YTD",
                             *       "1Y",
                             *       "5Y",
                             *       "MAX"
                             *     ]
                             */
                            validTimeframes?: string[];
                        };
                    };
                };
                /** @description Unauthorized */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description OHLCV not found for ticker */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description Internal server error */
                500: {
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
    "/equities/v1/summary": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get live market summary for a company
         * @description Returns current market data for a single ticker. This is a compact snapshot (no `ticker` / `name` fields); use `GET /equities/v1/companies-list` for the list of tracked companies with their identity details.
         */
        get: {
            parameters: {
                query: {
                    /** @description Stock ticker symbol (case-insensitive) */
                    ticker: string;
                    /** @description Two-letter country code (ISO 3166-1 alpha-2) for the company, as returned by `GET /equities/v1/companies-list` (case-insensitive). */
                    country: string;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Successful operation */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @example 159.73 */
                            currentPrice?: number;
                            /** @example 6475902 */
                            volume?: number;
                            /** @example 42074657239.22 */
                            marketCap?: number;
                            /** @example 35036279538.35 */
                            circulatingMarketCap?: number | null;
                            /** @example 39601081568.22 */
                            enterpriseValue?: number | null;
                            /** @example 444.65 */
                            fiftyTwoWeekHigh?: number;
                            /** @example 139.36 */
                            fiftyTwoWeekLow?: number;
                            /** @example null */
                            dividendYield?: number | null;
                            /** @example 52.55 */
                            trailingPE?: number | null;
                            /** @example 6.414 */
                            priceToRevenue?: number | null;
                            /** @example -0.4363 */
                            priceChangePercentage1d?: number;
                            /** @example 4.843 */
                            priceChangePercentage7d?: number;
                            /** @example -20.82 */
                            priceChangePercentage1m?: number;
                            /** @example -0.7 */
                            priceChange1d?: number;
                            /** @example -184387779.8 */
                            marketCapChange1d?: number;
                            /** @example 3.121 */
                            priceToBook?: number | null;
                            /** @example 40.48 */
                            enterpriseValueToEbitda?: number | null;
                            /** @example 2.525 */
                            holdersYield?: number | null;
                            /**
                             * Format: date-time
                             * @example 2026-06-12T19:59:00Z
                             */
                            updatedAt?: string;
                            /** @example 6560012000 */
                            revenueTTM?: number | null;
                            /** @example 4812835000 */
                            grossProfitTTM?: number | null;
                            /** @example 800602000 */
                            earningsTTM?: number | null;
                            /** @example 978345000 */
                            ebitdaTTM?: number | null;
                            /** @example 11.12 */
                            operatingProfitMarginTTM?: number | null;
                            /** @example 1062234000 */
                            holdersRevenueTTM?: number | null;
                            /** @example 1062234000 */
                            holderEarningsTTM?: number | null;
                            /** @example 0 */
                            dividendsTTM?: number | null;
                            /** @example 1062234000 */
                            stockRepurchaseTTM?: number | null;
                            /** @example 0 */
                            stockIssuanceTTM?: number | null;
                            /** @example 896766000 */
                            stockBasedCompensationTTM?: number | null;
                            /** @example 10205022000 */
                            cashAndCashEquivalents?: number | null;
                            /** @example 28848792000 */
                            totalAssets?: number | null;
                            /** @example 15368219000 */
                            totalLiabilities?: number | null;
                            /** @example 13480573000 */
                            totalShareholdersEquity?: number | null;
                            /** @example 7964423000 */
                            totalDebt?: number | null;
                            /** @example 219346895 */
                            circulatingSupply?: number | null;
                            /** @example 263411114 */
                            totalSupply?: number | null;
                            /** @example 4951 */
                            employeeCount?: number | null;
                        };
                    };
                };
                /** @description Missing required ticker parameter */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description Unauthorized */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description Summary not found for ticker */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description Internal server error */
                500: {
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
    "/equities/v1/filings": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get filings for a company
         * @description Returns a list of company filings (such as annual reports, quarterly reports, and other important filings) for the given ticker, sorted by filing date descending (newest first).
         */
        get: {
            parameters: {
                query: {
                    /** @description Stock ticker symbol (case-insensitive) */
                    ticker: string;
                    /** @description Two-letter country code (ISO 3166-1 alpha-2) for the company, as returned by `GET /equities/v1/companies-list` (case-insensitive). */
                    country: string;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Successful operation */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /**
                             * Format: date
                             * @example 2025-02-28
                             */
                            filingDate?: string;
                            /**
                             * Format: date
                             * @example 2024-12-31
                             */
                            reportDate?: string;
                            /** @example 10-K */
                            form?: string;
                            /**
                             * Format: uri
                             * @example https://www.sec.gov/Archives/edgar/data/1679788/0001679788-25-000123/0001679788-25-000123.htm
                             */
                            primaryDocumentUrl?: string;
                            /** @example Annual Report */
                            documentDescription?: string;
                        }[];
                    };
                };
                /** @description Missing required ticker parameter */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description Unauthorized */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description Filings not found for ticker */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description Internal server error */
                500: {
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
    "/equities/v1/onchain": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get on-chain tradeable markets for a company
         * @description Returns where the stock can be traded on-chain: `perps` are perpetual futures markets across exchanges, and `tokens` are tokenised-equity issuers. This is a live snapshot refreshed hourly and no history is kept. On-chain data is only collected for US-listed tickers, so a ticker in another market comes back with empty `perps` and `tokens` arrays rather than an error.
         */
        get: {
            parameters: {
                query: {
                    /** @description Stock ticker symbol (case-insensitive) */
                    ticker: string;
                    /** @description Two-letter country code (ISO 3166-1 alpha-2) for the company, as returned by `GET /equities/v1/companies-list` (case-insensitive). */
                    country: string;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Successful operation */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @description Perpetual futures markets tracking the stock. */
                            perps?: {
                                /**
                                 * @description Market pair as the venue names it.
                                 * @example AAPL-USDC
                                 */
                                pair?: string;
                                /**
                                 * @description Last traded price of the contract, in USD.
                                 * @example 307.86
                                 */
                                price?: number | null;
                                /**
                                 * @description 24 hour volume, in USD.
                                 * @example 1823545.15
                                 */
                                volume24h?: number | null;
                                /**
                                 * @description Open interest, in USD.
                                 * @example 24278916.49
                                 */
                                openInterest?: number | null;
                                /**
                                 * @description Annualised funding rate, in percent, so `-70.13` is -70.13% a year. Negative means shorts pay longs.
                                 * @example -70.13
                                 */
                                annualizedFundingRate?: number | null;
                                /**
                                 * @description Direct link to the market on the venue.
                                 * @example https://app.hyperliquid.xyz/trade/xyz:AAPL
                                 */
                                tradeUrl?: string;
                                /**
                                 * @description DefiLlama market identifier, `{venue}:{symbol}`.
                                 * @example xyz:AAPL
                                 */
                                contractSlug?: string;
                                /**
                                 * @description DefiLlama protocol slug for the exchange, when it has one.
                                 * @example hyperliquid-perps
                                 */
                                exchangeProtocolSlug?: string;
                                /**
                                 * @description DefiLlama RWA platform slug for the venue, when it has one.
                                 * @example trade-xyz
                                 */
                                rwaPlatformSlug?: string;
                                /**
                                 * @description Whether the venue is a centralised or an on-chain exchange.
                                 * @example DEX
                                 * @enum {string}
                                 */
                                exchangeType?: "CEX" | "DEX";
                                /**
                                 * Format: date-time
                                 * @description When this market was last refreshed.
                                 * @example 2026-06-07T10:04:21Z
                                 */
                                updatedAt?: string;
                            }[];
                            /** @description Tokenised equity products tracking the stock. */
                            tokens?: {
                                /**
                                 * @description Legal entity issuing the tokenised share, not the listed company.
                                 * @example Backed Assets (JE) Limited
                                 */
                                issuer?: string;
                                /**
                                 * @description DefiLlama RWA platform slug for the issuer.
                                 * @example backed-finance
                                 */
                                issuerRwaPlatformSlug?: string;
                                /**
                                 * @description Token price, in USD.
                                 * @example 308.7
                                 */
                                price?: number | null;
                                /**
                                 * @description Token symbol as the issuer lists it.
                                 * @example AAPLx
                                 */
                                assetSlug?: string;
                                /**
                                 * @description Market cap of the token across active markets, in USD. `null` when no market reports one.
                                 * @example 30068771
                                 */
                                activeMarketcap?: number | null;
                            }[];
                        };
                    };
                };
                /** @description Missing required `ticker` or `country` */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description Unauthorized */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description On-chain data not found for ticker */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description Internal server error */
                500: {
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
    "/pre-ipo/v1/companies-list": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get list of all tracked pre-IPO companies
         * @description Returns every private company in the pre-IPO registry with its latest estimated valuation and derived funding metrics. Use this to discover valid `company` ids for the other pre-IPO endpoints. Companies come back in registry order, so the list is not sorted by valuation.
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Successful operation */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /**
                             * Format: date-time
                             * @description When this snapshot was generated.
                             * @example 2026-08-26T08:58:51.554Z
                             */
                            updatedAt?: string;
                            data?: {
                                /**
                                 * @description Company id. Pass this as the `company` query parameter on the other pre-IPO endpoints.
                                 * @example anthropic
                                 */
                                id?: string;
                                /** @example Anthropic */
                                name?: string;
                                /** @example Anthropic is an AI safety and research company founded by former OpenAI executives, including siblings Dario and Daniela Amodei. */
                                description?: string;
                                /** @example https://anthropic.com */
                                website?: string;
                                /** @example Artificial Intelligence */
                                sector?: string;
                                /**
                                 * @description Most recent monthly secondary-market estimate, in USD. Falls back to the latest funding round post-money valuation when no marketplace lists the company.
                                 * @example 1377871934500
                                 */
                                latestEstimatedValuation?: number | null;
                                /**
                                 * @description Amount raised in the most recent funding round, in USD.
                                 * @example 3566564608
                                 */
                                latestRaise?: number | null;
                                /**
                                 * @description Post-money valuation of the most recent funding round, in USD.
                                 * @example 964999970816
                                 */
                                latestFundingValuation?: number | null;
                                /**
                                 * Format: date
                                 * @example 2026-05-28
                                 */
                                latestFundingDate?: string | null;
                                /**
                                 * Format: date
                                 * @description Date of the most recent secondary mark behind `latestEstimatedValuation`.
                                 * @example 2026-08-25
                                 */
                                lastValuationDate?: string | null;
                                /**
                                 * @description Sum of all disclosed funding rounds, in USD.
                                 * @example 52036464736
                                 */
                                totalRaised?: number | null;
                                /**
                                 * @description Change in the secondary estimate against the same month a year earlier, in percent. `null` when the company has no secondary marks.
                                 * @example 715.68
                                 */
                                valuationChange1YPercentage?: number | null;
                                /**
                                 * @description Premium of the secondary estimate over the latest round post-money valuation, in percent. `null` when the company has no secondary marks.
                                 * @example 42.78
                                 */
                                premiumVsLatestFundingPercentage?: number | null;
                            }[];
                        };
                    };
                };
                /** @description Unauthorized */
                401: {
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
    "/pre-ipo/v1/valuations": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get valuation history for a pre-IPO company
         * @description Returns one aggregated valuation point per calendar month, oldest first. Within a month every source's marks are averaged and then the source averages are averaged, so a source that reports daily does not outvote one that reports monthly. Points are rounded to the nearest 100 and dated `YYYY-MM-01`; months with no data are skipped, and the current month is month-to-date.
         */
        get: {
            parameters: {
                query: {
                    /** @description Company id from `GET /pre-ipo/v1/companies-list` (case-insensitive). The display `name` is not accepted. */
                    company: string;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Successful operation */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /**
                             * Format: date-time
                             * @description When this snapshot was generated.
                             * @example 2026-08-26T08:58:51.554Z
                             */
                            updatedAt?: string;
                            /**
                             * @example [
                             *       {
                             *         "date": "2026-06-01",
                             *         "estimatedValuation": 1412295009600
                             *       },
                             *       {
                             *         "date": "2026-07-01",
                             *         "estimatedValuation": 1414523445700
                             *       },
                             *       {
                             *         "date": "2026-08-01",
                             *         "estimatedValuation": 1377871934500
                             *       }
                             *     ]
                             */
                            data?: {
                                /**
                                 * Format: date
                                 * @description First day of the month the point covers.
                                 * @example 2026-08-01
                                 */
                                date?: string;
                                /**
                                 * @description Aggregated valuation estimate for that month, in USD.
                                 * @example 1377871934500
                                 */
                                estimatedValuation?: number;
                            }[];
                        };
                    };
                };
                /** @description Unauthorized */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description Unknown `company`, or no snapshot has been generated for it yet. The pre-IPO section is served as static files, so anything other than `200` means there is no such file. */
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
    "/pre-ipo/v1/raises": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get funding rounds for a pre-IPO company
         * @description Returns disclosed funding rounds, oldest first. The same round is usually reported by several sources with different dates and amounts, so rounds are reconciled before being served: each cluster collapses to one canonical raise taking the earliest date, the median amount, the median valuation, and the highest-ranked series label.
         */
        get: {
            parameters: {
                query: {
                    /** @description Company id from `GET /pre-ipo/v1/companies-list` (case-insensitive). The display `name` is not accepted. */
                    company: string;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Successful operation */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /**
                             * Format: date-time
                             * @description When this snapshot was generated.
                             * @example 2026-08-26T08:58:51.554Z
                             */
                            updatedAt?: string;
                            /**
                             * @example [
                             *       {
                             *         "date": "2025-09-02",
                             *         "amountRaised": 420020512,
                             *         "valuation": 183000006656,
                             *         "series": "Series F-2"
                             *       },
                             *       {
                             *         "date": "2026-02-12",
                             *         "amountRaised": 30600000000,
                             *         "valuation": 380000000000,
                             *         "series": "Series G"
                             *       },
                             *       {
                             *         "date": "2026-05-28",
                             *         "amountRaised": 3566564608,
                             *         "valuation": 964999970816,
                             *         "series": "Series H-4"
                             *       }
                             *     ]
                             */
                            data?: {
                                /**
                                 * Format: date
                                 * @description Date the round was announced.
                                 * @example 2026-05-28
                                 */
                                date?: string;
                                /**
                                 * @description Amount raised in the round, in USD.
                                 * @example 3566564608
                                 */
                                amountRaised?: number;
                                /**
                                 * @description Post-money valuation of the round, in USD. `null` when no source disclosed one.
                                 * @example 964999970816
                                 */
                                valuation?: number | null;
                                /**
                                 * @description Round label, for example `Series C` or `Series H-4`.
                                 * @example Series H-4
                                 */
                                series?: string;
                            }[];
                        };
                    };
                };
                /** @description Unauthorized */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description Unknown `company`, or no snapshot has been generated for it yet. The pre-IPO section is served as static files, so anything other than `200` means there is no such file. */
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
    "/pre-ipo/v1/summary": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get profile and latest valuation for a pre-IPO company
         * @description Returns the company profile together with its latest estimated valuation and its most recent funding round.
         */
        get: {
            parameters: {
                query: {
                    /** @description Company id from `GET /pre-ipo/v1/companies-list` (case-insensitive). The display `name` is not accepted. */
                    company: string;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Successful operation */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /**
                             * Format: date-time
                             * @description When this snapshot was generated.
                             * @example 2026-08-26T08:58:51.554Z
                             */
                            updatedAt?: string;
                            data?: {
                                /** @example anthropic */
                                id?: string;
                                /** @example Anthropic */
                                name?: string;
                                /** @example Anthropic is an AI safety and research company founded by former OpenAI executives, including siblings Dario and Daniela Amodei. */
                                description?: string;
                                /**
                                 * @description Short-form company summary. Currently identical to `description`.
                                 * @example Anthropic is an AI safety and research company founded by former OpenAI executives, including siblings Dario and Daniela Amodei.
                                 */
                                summary?: string;
                                /** @example https://anthropic.com */
                                website?: string;
                                /** @example Artificial Intelligence */
                                sector?: string;
                                /**
                                 * @description Most recent monthly secondary-market estimate, in USD. Falls back to the latest funding round post-money valuation when no marketplace lists the company.
                                 * @example 1377871934500
                                 */
                                latestEstimatedValuation?: number | null;
                                /**
                                 * Format: date
                                 * @example 2026-08-25
                                 */
                                lastValuationDate?: string | null;
                                /** @description Most recent funding round, or `null` when no round is on record. */
                                latestRaise?: {
                                    /**
                                     * Format: date
                                     * @description Date the round was announced.
                                     * @example 2026-05-28
                                     */
                                    date?: string;
                                    /**
                                     * @description Amount raised in the round, in USD.
                                     * @example 3566564608
                                     */
                                    amountRaised?: number;
                                    /**
                                     * @description Post-money valuation of the round, in USD. `null` when no source disclosed one.
                                     * @example 964999970816
                                     */
                                    valuation?: number | null;
                                    /**
                                     * @description Round label, for example `Series C` or `Series H-4`.
                                     * @example Series H-4
                                     */
                                    series?: string;
                                } | null;
                            };
                        };
                    };
                };
                /** @description Unauthorized */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description Unknown `company`, or no snapshot has been generated for it yet. The pre-IPO section is served as static files, so anything other than `200` means there is no such file. */
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
    "/pre-ipo/v1/integrations": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get tradeable markets for a pre-IPO company
         * @description Returns where the company can actually be traded right now: perpetual futures venues and tokenised-share issuers. A pre-IPO perp settles in stablecoins against the venue's reference price, so no shares change hands and the same company can trade at a slightly different price on every venue. This is a live snapshot refreshed hourly and no history is kept. Every company in the registry gets a response: one with no listings returns empty `perps` and `tokenIssuers` arrays rather than a miss.
         */
        get: {
            parameters: {
                query: {
                    /** @description Company id from `GET /pre-ipo/v1/companies-list` (case-insensitive). The display `name` is not accepted. */
                    company: string;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Successful operation */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /**
                             * Format: date-time
                             * @description When this snapshot was generated.
                             * @example 2026-08-26T08:58:51.554Z
                             */
                            updatedAt?: string;
                            /**
                             * @example {
                             *       "perps": [
                             *         {
                             *           "exchangeName": "Gate",
                             *           "platformSlug": "gate",
                             *           "defillamaContract": "gate:ANDURIL_USDT",
                             *           "exchangeType": "CEX",
                             *           "openInterest": 53713.26,
                             *           "volume": 1889,
                             *           "price": 129.83,
                             *           "annualizedFundingRate": 0,
                             *           "tradeUrl": "https://www.gate.com/futures/USDT/ANDURIL_USDT",
                             *           "estimatedValuation": 129830000000
                             *         }
                             *       ],
                             *       "tokenIssuers": [
                             *         {
                             *           "issuerName": "PreStocks",
                             *           "slug": "prestocks",
                             *           "backing": "SPV interest",
                             *           "productUrl": "https://prestocks.com/anduril",
                             *           "price": 137.47,
                             *           "marketCap": 1406088.07,
                             *           "estimatedValuation": 111741315858
                             *         }
                             *       ]
                             *     }
                             */
                            data?: {
                                /** @description Perpetual futures markets tracking the company. */
                                perps?: {
                                    /** @example Gate */
                                    exchangeName?: string;
                                    /**
                                     * @description DefiLlama slug for the venue.
                                     * @example gate
                                     */
                                    platformSlug?: string;
                                    /**
                                     * @description DefiLlama market identifier, `{venue}:{pair}`.
                                     * @example gate:ANDURIL_USDT
                                     */
                                    defillamaContract?: string;
                                    /**
                                     * @description Whether the venue is a centralised or an on-chain exchange.
                                     * @example CEX
                                     * @enum {string}
                                     */
                                    exchangeType?: "CEX" | "DEX";
                                    /**
                                     * @description Open interest, in USD.
                                     * @example 53713.26
                                     */
                                    openInterest?: number | null;
                                    /**
                                     * @description 24 hour volume, in USD.
                                     * @example 1889
                                     */
                                    volume?: number | null;
                                    /**
                                     * @description Last traded price of the contract, in USD.
                                     * @example 129.83
                                     */
                                    price?: number;
                                    /**
                                     * @description Annualised funding rate, in percent, so `5.2` is 5.2% a year. Negative means shorts pay longs.
                                     * @example 0
                                     */
                                    annualizedFundingRate?: number | null;
                                    /** @example https://www.gate.com/futures/USDT/ANDURIL_USDT */
                                    tradeUrl?: string;
                                    /**
                                     * @description Company valuation implied by this venue's price, in USD.
                                     * @example 129830000000
                                     */
                                    estimatedValuation?: number | null;
                                }[];
                                /** @description Tokenised exposure to the company's private shares. */
                                tokenIssuers?: {
                                    /**
                                     * @description The token issuer, not the private company.
                                     * @example PreStocks
                                     */
                                    issuerName?: string;
                                    /**
                                     * @description DefiLlama RWA platform slug for the issuer, when it has one.
                                     * @example prestocks
                                     */
                                    slug?: string | null;
                                    /**
                                     * @description What the token is a claim on, ordered from the most direct claim on the underlying shares to the least. `Direct shares` and `Trust-held SPV` are asset-backed and bankruptcy-remote, `SPV interest` is asset-backed but held one layer removed through a vehicle, and `Unsecured note` and `Synthetic` are not asset-backed at all.
                                     * @example SPV interest
                                     * @enum {string}
                                     */
                                    backing?: "Direct shares" | "Trust-held SPV" | "SPV interest" | "Unsecured note" | "Synthetic";
                                    /** @example https://prestocks.com/anduril */
                                    productUrl?: string;
                                    /**
                                     * @description Token price, in USD.
                                     * @example 137.47
                                     */
                                    price?: number;
                                    /**
                                     * @description Market cap of the token, in USD. Only populated for issuers that publish one.
                                     * @example 1406088.07
                                     */
                                    marketCap?: number | null;
                                    /**
                                     * @description Company valuation implied by the token price, in USD.
                                     * @example 111741315858
                                     */
                                    estimatedValuation?: number | null;
                                }[];
                            };
                        };
                    };
                };
                /** @description Unauthorized */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description Unknown `company`, or no snapshot has been generated for it yet. The pre-IPO section is served as static files, so anything other than `200` means there is no such file. */
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
    "/rwa/current": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List all current RWA assets
         * @description Returns current Real World Asset rows with per-chain onchain market cap, active market cap, and DeFi active TVL maps.
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Array of current RWA assets */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @example ondo-usdy */
                            id?: string;
                            /** @example ondo/usdy */
                            canonicalMarketId?: string | null;
                            /** @example USDY */
                            ticker?: string;
                            /** @example Ondo US Dollar Yield */
                            assetName?: string | null;
                            /** @example Treasuries */
                            assetGroup?: string | null;
                            /** @example Ethereum */
                            primaryChain?: string | null;
                            /**
                             * @example [
                             *       "Ethereum",
                             *       "Solana"
                             *     ]
                             */
                            chain?: string[] | null;
                            /**
                             * @example [
                             *       "Treasuries"
                             *     ]
                             */
                            category?: string[] | null;
                            /**
                             * @example [
                             *       "Fixed Income"
                             *     ]
                             */
                            assetClass?: string[] | null;
                            /** @example Asset */
                            type?: string | null;
                            /** @example Tokenized Asset */
                            rwaClassification?: string | null;
                            /** @example Permissioned */
                            accessModel?: string | null;
                            /** @example Ondo Finance */
                            issuer?: string | null;
                            /** @example Ondo Finance */
                            parentPlatform?: string | null;
                            /** @example false */
                            stablecoin?: boolean | null;
                            /** @example false */
                            governance?: boolean | null;
                            /**
                             * @description Current onchain market cap by chain.
                             * @example {
                             *       "Ethereum": 125000000,
                             *       "Solana": 45000000
                             *     }
                             */
                            onChainMcap?: {
                                [key: string]: number;
                            };
                            /**
                             * @description Current active market cap by chain.
                             * @example {
                             *       "Ethereum": 125000000,
                             *       "Solana": 45000000
                             *     }
                             */
                            activeMcap?: {
                                [key: string]: number;
                            };
                            /**
                             * @description Current DeFi active TVL by chain and tracked protocol.
                             * @example {
                             *       "Ethereum": {
                             *         "aave-v3": 1500000,
                             *         "morpho": 850000
                             *       }
                             *     }
                             */
                            defiActiveTvl?: {
                                [key: string]: {
                                    [key: string]: number;
                                };
                            };
                            /** @example 1.04 */
                            price?: number | null;
                            /** @example true */
                            activeMcapData?: boolean;
                            /** @example ondo-us-dollar-yield */
                            coingeckoId?: string | null;
                            /** @example https://icons.llamao.fi/icons/protocols/ondo.jpg */
                            logo?: string | null;
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
    "/rwa/stats": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get aggregate RWA stats by chain, category, platform, and asset group
         * @description Returns RWA aggregates. For the default per-chain table, read byChain[chain].base: assetIssuers.length, assetCount, activeMcap, onChainMcap, and defiActiveTvl. Add stablecoinsOnly, governanceOnly, and stablecoinsAndGovernance when those buckets should be included.
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Aggregate RWA stats */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @example 25000000000 */
                            totalOnChainMcap?: number;
                            /** @example 22000000000 */
                            totalActiveMcap?: number;
                            /** @example 800000000 */
                            totalDefiActiveTvl?: number;
                            /** @example 320 */
                            assetCount?: number;
                            /** @example 120 */
                            assetIssuers?: number;
                            byChain?: {
                                [key: string]: {
                                    /** @description Default RWA bucket. The chain table uses this bucket unless stablecoins or governance assets are explicitly included. */
                                    base?: {
                                        /** @example 125000000 */
                                        onChainMcap?: number;
                                        /** @example 118000000 */
                                        activeMcap?: number;
                                        /** @example 2500000 */
                                        defiActiveTvl?: number;
                                        /** @example 42 */
                                        assetCount?: number;
                                        /**
                                         * @example [
                                         *       "Ondo Finance",
                                         *       "BlackRock"
                                         *     ]
                                         */
                                        assetIssuers?: string[];
                                    };
                                    stablecoinsOnly?: {
                                        /** @example 125000000 */
                                        onChainMcap?: number;
                                        /** @example 118000000 */
                                        activeMcap?: number;
                                        /** @example 2500000 */
                                        defiActiveTvl?: number;
                                        /** @example 42 */
                                        assetCount?: number;
                                        /**
                                         * @example [
                                         *       "Ondo Finance",
                                         *       "BlackRock"
                                         *     ]
                                         */
                                        assetIssuers?: string[];
                                    };
                                    governanceOnly?: {
                                        /** @example 125000000 */
                                        onChainMcap?: number;
                                        /** @example 118000000 */
                                        activeMcap?: number;
                                        /** @example 2500000 */
                                        defiActiveTvl?: number;
                                        /** @example 42 */
                                        assetCount?: number;
                                        /**
                                         * @example [
                                         *       "Ondo Finance",
                                         *       "BlackRock"
                                         *     ]
                                         */
                                        assetIssuers?: string[];
                                    };
                                    stablecoinsAndGovernance?: {
                                        /** @example 125000000 */
                                        onChainMcap?: number;
                                        /** @example 118000000 */
                                        activeMcap?: number;
                                        /** @example 2500000 */
                                        defiActiveTvl?: number;
                                        /** @example 42 */
                                        assetCount?: number;
                                        /**
                                         * @example [
                                         *       "Ondo Finance",
                                         *       "BlackRock"
                                         *     ]
                                         */
                                        assetIssuers?: string[];
                                    };
                                };
                            };
                            byCategory?: {
                                [key: string]: {
                                    /** @description Default RWA bucket. The chain table uses this bucket unless stablecoins or governance assets are explicitly included. */
                                    base?: {
                                        /** @example 125000000 */
                                        onChainMcap?: number;
                                        /** @example 118000000 */
                                        activeMcap?: number;
                                        /** @example 2500000 */
                                        defiActiveTvl?: number;
                                        /** @example 42 */
                                        assetCount?: number;
                                        /**
                                         * @example [
                                         *       "Ondo Finance",
                                         *       "BlackRock"
                                         *     ]
                                         */
                                        assetIssuers?: string[];
                                    };
                                    stablecoinsOnly?: {
                                        /** @example 125000000 */
                                        onChainMcap?: number;
                                        /** @example 118000000 */
                                        activeMcap?: number;
                                        /** @example 2500000 */
                                        defiActiveTvl?: number;
                                        /** @example 42 */
                                        assetCount?: number;
                                        /**
                                         * @example [
                                         *       "Ondo Finance",
                                         *       "BlackRock"
                                         *     ]
                                         */
                                        assetIssuers?: string[];
                                    };
                                    governanceOnly?: {
                                        /** @example 125000000 */
                                        onChainMcap?: number;
                                        /** @example 118000000 */
                                        activeMcap?: number;
                                        /** @example 2500000 */
                                        defiActiveTvl?: number;
                                        /** @example 42 */
                                        assetCount?: number;
                                        /**
                                         * @example [
                                         *       "Ondo Finance",
                                         *       "BlackRock"
                                         *     ]
                                         */
                                        assetIssuers?: string[];
                                    };
                                    stablecoinsAndGovernance?: {
                                        /** @example 125000000 */
                                        onChainMcap?: number;
                                        /** @example 118000000 */
                                        activeMcap?: number;
                                        /** @example 2500000 */
                                        defiActiveTvl?: number;
                                        /** @example 42 */
                                        assetCount?: number;
                                        /**
                                         * @example [
                                         *       "Ondo Finance",
                                         *       "BlackRock"
                                         *     ]
                                         */
                                        assetIssuers?: string[];
                                    };
                                };
                            };
                            byPlatform?: {
                                [key: string]: {
                                    /** @description Default RWA bucket. The chain table uses this bucket unless stablecoins or governance assets are explicitly included. */
                                    base?: {
                                        /** @example 125000000 */
                                        onChainMcap?: number;
                                        /** @example 118000000 */
                                        activeMcap?: number;
                                        /** @example 2500000 */
                                        defiActiveTvl?: number;
                                        /** @example 42 */
                                        assetCount?: number;
                                        /**
                                         * @example [
                                         *       "Ondo Finance",
                                         *       "BlackRock"
                                         *     ]
                                         */
                                        assetIssuers?: string[];
                                    };
                                    stablecoinsOnly?: {
                                        /** @example 125000000 */
                                        onChainMcap?: number;
                                        /** @example 118000000 */
                                        activeMcap?: number;
                                        /** @example 2500000 */
                                        defiActiveTvl?: number;
                                        /** @example 42 */
                                        assetCount?: number;
                                        /**
                                         * @example [
                                         *       "Ondo Finance",
                                         *       "BlackRock"
                                         *     ]
                                         */
                                        assetIssuers?: string[];
                                    };
                                    governanceOnly?: {
                                        /** @example 125000000 */
                                        onChainMcap?: number;
                                        /** @example 118000000 */
                                        activeMcap?: number;
                                        /** @example 2500000 */
                                        defiActiveTvl?: number;
                                        /** @example 42 */
                                        assetCount?: number;
                                        /**
                                         * @example [
                                         *       "Ondo Finance",
                                         *       "BlackRock"
                                         *     ]
                                         */
                                        assetIssuers?: string[];
                                    };
                                    stablecoinsAndGovernance?: {
                                        /** @example 125000000 */
                                        onChainMcap?: number;
                                        /** @example 118000000 */
                                        activeMcap?: number;
                                        /** @example 2500000 */
                                        defiActiveTvl?: number;
                                        /** @example 42 */
                                        assetCount?: number;
                                        /**
                                         * @example [
                                         *       "Ondo Finance",
                                         *       "BlackRock"
                                         *     ]
                                         */
                                        assetIssuers?: string[];
                                    };
                                };
                            };
                            byAssetGroup?: {
                                [key: string]: {
                                    /** @description Default RWA bucket. The chain table uses this bucket unless stablecoins or governance assets are explicitly included. */
                                    base?: {
                                        /** @example 125000000 */
                                        onChainMcap?: number;
                                        /** @example 118000000 */
                                        activeMcap?: number;
                                        /** @example 2500000 */
                                        defiActiveTvl?: number;
                                        /** @example 42 */
                                        assetCount?: number;
                                        /**
                                         * @example [
                                         *       "Ondo Finance",
                                         *       "BlackRock"
                                         *     ]
                                         */
                                        assetIssuers?: string[];
                                    };
                                    stablecoinsOnly?: {
                                        /** @example 125000000 */
                                        onChainMcap?: number;
                                        /** @example 118000000 */
                                        activeMcap?: number;
                                        /** @example 2500000 */
                                        defiActiveTvl?: number;
                                        /** @example 42 */
                                        assetCount?: number;
                                        /**
                                         * @example [
                                         *       "Ondo Finance",
                                         *       "BlackRock"
                                         *     ]
                                         */
                                        assetIssuers?: string[];
                                    };
                                    governanceOnly?: {
                                        /** @example 125000000 */
                                        onChainMcap?: number;
                                        /** @example 118000000 */
                                        activeMcap?: number;
                                        /** @example 2500000 */
                                        defiActiveTvl?: number;
                                        /** @example 42 */
                                        assetCount?: number;
                                        /**
                                         * @example [
                                         *       "Ondo Finance",
                                         *       "BlackRock"
                                         *     ]
                                         */
                                        assetIssuers?: string[];
                                    };
                                    stablecoinsAndGovernance?: {
                                        /** @example 125000000 */
                                        onChainMcap?: number;
                                        /** @example 118000000 */
                                        activeMcap?: number;
                                        /** @example 2500000 */
                                        defiActiveTvl?: number;
                                        /** @example 42 */
                                        assetCount?: number;
                                        /**
                                         * @example [
                                         *       "Ondo Finance",
                                         *       "BlackRock"
                                         *     ]
                                         */
                                        assetIssuers?: string[];
                                    };
                                };
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
    "/rwa/list": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List RWA ids and filter values
         * @description Returns lightweight RWA lists used for discovery, search, and filters.
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description RWA list metadata */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /**
                             * @example [
                             *       "ondo/usdy",
                             *       "blackrock/buidl"
                             *     ]
                             */
                            canonicalMarketIds?: string[];
                            /**
                             * @example [
                             *       "Ondo Finance",
                             *       "Securitize"
                             *     ]
                             */
                            platforms?: string[];
                            /**
                             * @example [
                             *       "Ethereum",
                             *       "Solana"
                             *     ]
                             */
                            chains?: string[];
                            /**
                             * @example [
                             *       "Treasuries",
                             *       "Private Credit"
                             *     ]
                             */
                            categories?: string[];
                            /**
                             * @example [
                             *       "Treasuries"
                             *     ]
                             */
                            assetGroups?: string[];
                            /**
                             * @example {
                             *       "ondo/usdy": "ondo-usdy"
                             *     }
                             */
                            idMap?: {
                                [key: string]: string;
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
    "/rwa/chain/{chain}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List current RWA assets on a chain
         * @description Returns current RWA assets that have onchain market cap, active market cap, or DeFi active TVL on the requested chain.
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description Chain display name, case-insensitive. */
                    chain: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description RWA assets for the chain */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data?: {
                                /** @example ondo-usdy */
                                id?: string;
                                /** @example ondo/usdy */
                                canonicalMarketId?: string | null;
                                /** @example USDY */
                                ticker?: string;
                                /** @example Ondo US Dollar Yield */
                                assetName?: string | null;
                                /** @example Treasuries */
                                assetGroup?: string | null;
                                /** @example Ethereum */
                                primaryChain?: string | null;
                                /**
                                 * @example [
                                 *       "Ethereum",
                                 *       "Solana"
                                 *     ]
                                 */
                                chain?: string[] | null;
                                /**
                                 * @example [
                                 *       "Treasuries"
                                 *     ]
                                 */
                                category?: string[] | null;
                                /**
                                 * @example [
                                 *       "Fixed Income"
                                 *     ]
                                 */
                                assetClass?: string[] | null;
                                /** @example Asset */
                                type?: string | null;
                                /** @example Tokenized Asset */
                                rwaClassification?: string | null;
                                /** @example Permissioned */
                                accessModel?: string | null;
                                /** @example Ondo Finance */
                                issuer?: string | null;
                                /** @example Ondo Finance */
                                parentPlatform?: string | null;
                                /** @example false */
                                stablecoin?: boolean | null;
                                /** @example false */
                                governance?: boolean | null;
                                /**
                                 * @description Current onchain market cap by chain.
                                 * @example {
                                 *       "Ethereum": 125000000,
                                 *       "Solana": 45000000
                                 *     }
                                 */
                                onChainMcap?: {
                                    [key: string]: number;
                                };
                                /**
                                 * @description Current active market cap by chain.
                                 * @example {
                                 *       "Ethereum": 125000000,
                                 *       "Solana": 45000000
                                 *     }
                                 */
                                activeMcap?: {
                                    [key: string]: number;
                                };
                                /**
                                 * @description Current DeFi active TVL by chain and tracked protocol.
                                 * @example {
                                 *       "Ethereum": {
                                 *         "aave-v3": 1500000,
                                 *         "morpho": 850000
                                 *       }
                                 *     }
                                 */
                                defiActiveTvl?: {
                                    [key: string]: {
                                        [key: string]: number;
                                    };
                                };
                                /** @example 1.04 */
                                price?: number | null;
                                /** @example true */
                                activeMcapData?: boolean;
                                /** @example ondo-us-dollar-yield */
                                coingeckoId?: string | null;
                                /** @example https://icons.llamao.fi/icons/protocols/ondo.jpg */
                                logo?: string | null;
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
    "/rwa/chart/chain/{chain}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get historical RWA chart data for a chain
         * @description Returns historical onchain market cap, active market cap, and DeFi active TVL totals for a chain.
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description Chain display name. The API normalizes it to the internal RWA slug. */
                    chain: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Historical RWA chain chart */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @example 1716163200 */
                            timestamp?: number;
                            /** @example 125000000 */
                            onChainMcap?: number | null;
                            /** @example 118000000 */
                            activeMcap?: number | null;
                            /** @example 2500000 */
                            defiActiveTvl?: number | null;
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
    "/rwa/chart/chain-breakdown": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get historical RWA metric breakdown by chain
         * @description Returns time series rows with one column per chain for the selected RWA metric.
         */
        get: {
            parameters: {
                query?: {
                    /** @description Metric to break down by chain. Defaults to onChainMcap. */
                    key?: "onChainMcap" | "activeMcap" | "defiActiveTvl";
                    /** @description Include stablecoin-token assets in the chart totals. */
                    includeStablecoin?: boolean;
                    /** @description Include governance-token assets in the chart totals. */
                    includeGovernance?: boolean;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Historical chain breakdown rows */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": ({
                            /** @example 1716163200 */
                            timestamp: number;
                        } & {
                            [key: string]: number;
                        })[];
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
