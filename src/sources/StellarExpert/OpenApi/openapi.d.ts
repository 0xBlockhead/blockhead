export interface paths {
    "/explorer/directory": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Directory entries
         * @description Returns the list of directory entries with paging navigation links. Optionally filtered by address, tag, or arbitrary search string. This API endpoint follows Stellar Horizon API response format convention. A response result contains records and navigation links.
         *     #### Query examples:
         *     Fetch information about multiple accounts in one call
         *
         *     `curl -g "https://api.stellar.expert/explorer/directory?address[]=GA6HCMBLTZS5VYYBCATRBRZ3BZJMAFUDKYYF6AH6MVCMGWMRDNSWJPIH&address[]=GAP5LETOV6YIE62YAM56STDANPRDO7ZFDBGSNHJQIYGGKSMOZAHOOS2S"`
         *
         *     Search for Kraken's deposit account
         *
         *     `curl "https://api.stellar.expert/explorer/directory?search=kraken"`
         *
         *     Find accounts tagged as malicious or unsafe
         *
         *     `curl -g "https://api.stellar.expert/explorer/directory?tag[]=malicious&tag[]=unsafe"`
         *
         *     Lookup addresses reported for "staking"-related scams
         *
         *     `curl -g "https://api.stellar.expert/explorer/directory?tag[]=malicious&search=stacking"`
         */
        get: operations["listDirectoryEntries"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/explorer/directory/{address}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Address Directory info
         * @description Returns Directory information for a given account address.
         */
        get: operations["getDirectoryEntry"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/explorer/directory/tags": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * All Directory tags
         * @description Returns a list of all categories that can be used to tag accounts.
         */
        get: operations["getDirectoryTags"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/explorer/directory/blocked-domains": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Blocked domains list
         * @description Returns the list of domains reported by the community for fraudulent acitivity. This API endpoint follows Stellar Horizon API response format convention. A response result contains records and navigation links.
         */
        get: operations["listBlockedDomains"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/explorer/directory/blocked-domains/{domain}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Check domain
         * @description Searches through the blocked malicious domains list to determine if the requested domain or its top-level domain is in the blocklist.
         */
        get: operations["isDomainBlocked"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/explorer/{network}/asset": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List of assets
         * @description Returns a list of assets that exist on Stellar network. It support searching by asset code, issuer, home domain, and metadata from associated `stellar.toml` file.
         *
         *     Possible sorting options:
         *     - `rating` - composite asset rating derived from on-chain stats
         *     - `created` - asset age
         *     - `payments` - total number of payments
         *     - `trades` - total number of trades
         *     - `trustlines` - number of established trustlines
         *     - `volume` - overall trading volume
         *     - `volume7d` - weekly trading volume
         */
        get: operations["getAllAssets"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/explorer/{network}/asset/{asset}/rating": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Asset rating
         * @description To solve the problem of assets ranking on StellarExpert, we designed a system of technical indicators based purely on the ledger activity, including
         *
         *       - asset age (time elapsed sisnce the first payment)
         *       - established trustlines
         *       - total number of payments
         *       - total number of trades
         *       - weekly trading volume
         *       - market liquidity (based on the relative slippage of {ASSET}/XLM market)
         *       - asset interoperability (based on additional asset metadata and supported SEP standards)
         *
         *     All indicators are calculated on the logarithmic scale to normalize distribution for assets with high trading/transfer activity. The compound rating calculated as the average of all seven indicators can be used to roughly estimate the popularity of any Stellar asset purely from the technical point of view.
         */
        get: operations["getAssetRating"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/explorer/{network}/asset/{asset}/holders": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Asset holders list
         * @description Returns a list of all accounts holding non-zero amount of the given asset sorted by the balance size. Accounts with an established trustline but with zero balance excluded from the results set.
         *     This API endpoint follows Stellar Horizon API response format convention. A response result contains records and navigation links.
         */
        get: operations["getAssetHolders"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/explorer/{network}/asset/{asset}/position": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Asset holder rank
         * @description Retrieves a relative account balance position among all accounts holding a particular asset.
         */
        get: operations["getAssetHolderPosition"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/explorer/{network}/asset/{asset}/supply": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Asset supply
         * @description Asset supply endpoint returns the total issued supply for an asset. It is handy for displaying the total number of tokens on the website or providing relevant information to third-party platforms. For example, aggregators often require an API endpoint to track the asset supply.
         */
        get: operations["getAssetSupply"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/explorer/{network}/ledger/sequence-from-timestamp": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Find sequence by timestamp
         * @description Resolves ledger sequence with a finalization time equal or less than a given timestamp. If the timestamp indicates some time in the future or, vise versa, less than the closing time of the first ledger, server returns 404 Not Found error.
         */
        get: operations["getSequenceFromTimestamp"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/explorer/{network}/ledger/timestamp-from-sequence": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Find timestamp by sequence
         * @description Resolves ledger closing timestamp for a give ledger sequence.
         */
        get: operations["getTimestampFromSequence"];
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
        /**
         * @description Unix timestamp (UTC)
         * @example 1615892870
         */
        UnixTime: number;
        /**
         * @description Stellar network
         * @example public
         * @enum {string}
         */
        Network: "public" | "testnet";
        /**
         * @description Account address (ED25519 public key)
         * @example GAB6FD5BCBVVQINU5USYV5K4JDAEO6RDL2GZU4K5BILPI6B4FIOF6QWW
         */
        AccountAddress: string;
        /**
         * @description Operation amount
         * @example 145.67
         */
        Amount: string;
        /**
         * @description An asset in the format {CODE}-{ISSUER} (or "XLM" for Stellar lumens)
         * @example BTC-GDKIIIL2YPRSCSFAYT7FQCH4VXF34YNBIORTYCOKJK5CZ762LX2ND4L4
         */
        Asset: string;
        /**
         * @description Results sorting order
         * @example desc
         * @enum {string}
         */
        ResultsSortOrder: "asc" | "desc";
        /**
         * @description Results data page size
         * @default 10
         * @example 10
         */
        ResultsLimit: number;
        /**
         * @description Results data page size
         * @default 1000
         * @example 100
         */
        HugeResultsLimit: number;
        /** @description List API response */
        ListApiResponse: {
            _links?: {
                self?: components["schemas"]["ListApiResponseNavLink"];
                prev?: components["schemas"]["ListApiResponseNavLink"];
                next?: components["schemas"]["ListApiResponseNavLink"];
            };
            _embedded?: {
                records?: unknown[];
            };
        };
        ListApiResponseNavLink: {
            href?: string;
        };
        /** @description Directory entry info */
        DirectoryEntry: {
            /** @description Account address */
            address: components["schemas"]["AccountAddress"];
            /** @description Cursor value for results paging */
            paging_token: components["schemas"]["AccountAddress"];
            /** @description Entry friendly name */
            name: string;
            /** @description Entry friendly name */
            tags: string[];
            /** @description Domain associated with entry if any */
            domain?: string;
        };
        /** @description Directory tag descriptor */
        DirectoryTagDescription: {
            /**
             * @description Tag name
             * @example exchange
             */
            name: string;
            /**
             * @description User-friendly tag description
             * @example Centralized exchange account
             */
            description: string;
        };
        /** @description Payment info */
        PaymentEntry: {
            /**
             * @description Operation unique id
             * @example 86172183717662720
             */
            id?: string;
            /**
             * @description Paging token
             * @example 86172183717662720
             */
            paging_token?: string;
            /** @description Operation type */
            optype?: number;
            /**
             * @description Ledger containing the payment operation
             * @example 1640731
             */
            ledger?: number;
            /**
             * @description Transaction unique id
             * @example 86172183717662720
             */
            tx_id?: string;
            /**
             * Format: date-time
             * @description Operation timestamp
             * @example 2018-09-19T12:23:16.000Z
             */
            ts?: string;
            /** @description Source account */
            from?: components["schemas"]["AccountAddress"];
            /** @description Source asset */
            source_asset?: components["schemas"]["Asset"];
            /** @description Source amount */
            source_amount?: components["schemas"]["Amount"];
            /** @description Destination account */
            to?: components["schemas"]["AccountAddress"];
            /** @description Destination asset */
            asset?: components["schemas"]["Asset"];
            /** @description Destination amount */
            amount?: components["schemas"]["Amount"];
        };
        /** @description General asset info */
        AssetInfo: {
            /** @description Asset identifier */
            asset?: components["schemas"]["Asset"];
            /** @description Total traded amount (in stroops) */
            traded_amount?: number;
            /** @description Total payments amount (in stroops) */
            payments_amount?: number;
            /** @description Timestamp of the first recorder operation with asset */
            created?: components["schemas"]["UnixTime"];
            /** @description Total issued asset supply */
            supply?: number;
            /** @description Trustlines established to an asset */
            trustlines?: {
                /** @description Total number of trustlines */
                total?: number;
                /** @description Trustlines authorized by the issuer */
                authorized?: number;
                /** @description Trustlines with non-zero balance */
                funded?: number;
            };
            /** @description Total number of trades */
            trades?: number;
            /** @description Total number of payments */
            payments?: number;
            /** @description Associated `home_domain` */
            domain?: string;
            /** @description Asset information from stellar.toml file */
            tomlInfo?: Record<string, never>;
            /** @description Composite asset rating */
            rating?: components["schemas"]["AssetRating"];
            /** @description Paging token */
            paging_token?: number;
        };
        /** @description Asset rating info */
        AssetRating: {
            asset?: components["schemas"]["Asset"];
            rating?: {
                age?: number;
                trages?: number;
                payments?: number;
                trustlines?: number;
                volume7d?: number;
                interop?: number;
                liqidity?: number;
                average?: number;
            };
        };
        /** @description Asset holder description */
        AssetHolder: {
            /** @description Account address */
            account?: components["schemas"]["AccountAddress"];
            /** @description Asset balance in stroops */
            balance?: string;
            /** @description Paging token */
            paging_token?: string;
        };
        /**
         * @description Ledger sequence-timestamp pair
         * @example {
         *       "sequence": 42431435,
         *       "timestamp": 1661781078,
         *       "date": "2022-08-29T13:51:18.000Z"
         *     }
         */
        LedgerTimestampSequenceInfo: {
            /** @description Ledger sequence */
            sequence?: number;
            /** @description Ledger UNIX timestamp */
            timestamp?: components["schemas"]["UnixTime"];
            /**
             * Format: date-time
             * @description Ledger date
             */
            date?: string;
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
    listDirectoryEntries: {
        parameters: {
            query?: {
                /**
                 * @description Applies a filter by the addresses list (up to 50 per request)
                 * @example [
                 *       "GA2VRL65L3ZFEDDJ357RGI3MAOKPJZ2Z3IJTPSC24I4KDTNFSVEQURRA"
                 *     ]
                 */
                address?: components["schemas"]["AccountAddress"][];
                /**
                 * @description Applies a filter by tags
                 * @example [
                 *       "custodian",
                 *       "anchor"
                 *     ]
                 */
                tag?: string[];
                /** @description Applies a full-test search filter by an entry address, name, or domain */
                search?: string;
                /** @description An address from which to continue search (refers to the `paging_token` value from a results set) */
                cursor?: components["schemas"]["AccountAddress"];
                /** @description Results sorting order */
                order?: components["schemas"]["ResultsSortOrder"];
                /** @description Results data page size */
                limit?: components["schemas"]["ResultsLimit"];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Directory entries fetched */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "_links": {
                     *         "self": {
                     *           "href": "/explorer/directory?sort=address&order=asc&limit=2"
                     *         },
                     *         "prev": {
                     *           "href": "/explorer/directory?sort=address&order=desc&cursor=GA272U6UMNKYOBDCLH5CDAPZVDG4WAGJWFY2S2RV2DN6YSSOGYECEVOF&limit=2"
                     *         },
                     *         "next": {
                     *           "href": "/explorer/directory?sort=address&order=asc&cursor=GA2VRL65L3ZFEDDJ357RGI3MAOKPJZ2Z3IJTPSC24I4KDTNFSVEQURRA&limit=2"
                     *         }
                     *       },
                     *       "_embedded": {
                     *         "records": [
                     *           {
                     *             "address": "GA272U6UMNKYOBDCLH5CDAPZVDG4WAGJWFY2S2RV2DN6YSSOGYECEVOF",
                     *             "paging_token": "GA272U6UMNKYOBDCLH5CDAPZVDG4WAGJWFY2S2RV2DN6YSSOGYECEVOF",
                     *             "name": "Phishing account",
                     *             "tags": [
                     *               "malicious"
                     *             ]
                     *           },
                     *           {
                     *             "address": "GA2VRL65L3ZFEDDJ357RGI3MAOKPJZ2Z3IJTPSC24I4KDTNFSVEQURRA",
                     *             "paging_token": "GA2VRL65L3ZFEDDJ357RGI3MAOKPJZ2Z3IJTPSC24I4KDTNFSVEQURRA",
                     *             "domain": "stellar.org",
                     *             "name": "SDF Escrow Jan 1 2023",
                     *             "tags": [
                     *               "sdf",
                     *               "custodian"
                     *             ]
                     *           }
                     *         ]
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ListApiResponse"] & {
                        _embedded?: {
                            records?: components["schemas"]["DirectoryEntry"][];
                        };
                    };
                };
            };
            /** @description Invalid request parameters */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    getDirectoryEntry: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /**
                 * @description The address of the account to check
                 * @example GA2VRL65L3ZFEDDJ357RGI3MAOKPJZ2Z3IJTPSC24I4KDTNFSVEQURRA
                 */
                address: components["schemas"]["AccountAddress"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Directory entry fetched */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "address": "GA2VRL65L3ZFEDDJ357RGI3MAOKPJZ2Z3IJTPSC24I4KDTNFSVEQURRA",
                     *       "paging_token": "GA2VRL65L3ZFEDDJ357RGI3MAOKPJZ2Z3IJTPSC24I4KDTNFSVEQURRA",
                     *       "domain": "stellar.org",
                     *       "name": "SDF Escrow Jan 1 2023",
                     *       "tags": [
                     *         "sdf",
                     *         "custodian"
                     *       ]
                     *     }
                     */
                    "application/json": components["schemas"]["DirectoryEntry"];
                };
            };
            /** @description Invalid request parameters */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Entry not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    getDirectoryTags: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Available Directory tags fetched */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DirectoryTagDescription"][];
                };
            };
        };
    };
    listBlockedDomains: {
        parameters: {
            query?: {
                /** @description Case-insesitive search by domain or part of the domain */
                search?: string;
                /** @description An address from which to continue search (refers to the `paging_token` value from a results set) */
                cursor?: string;
                /** @description Results sorting order */
                order?: components["schemas"]["ResultsSortOrder"];
                /** @description Results data page size */
                limit?: components["schemas"]["HugeResultsLimit"];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Blocked domains fetched */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "_links": {
                     *         "self": {
                     *           "href": "/explorer/directory/blocked-domains/?order=asc&limit=2"
                     *         },
                     *         "prev": {
                     *           "href": "/explorer/directory/blocked-domains/?order=desc&limit=2&cursor=agrogenesis.in"
                     *         },
                     *         "next": {
                     *           "href": "/explorer/directory/blocked-domains/?order=asc&limit=2&cursor=airdrop-info.vwv.pw"
                     *         }
                     *       },
                     *       "_embedded": {
                     *         "records": [
                     *           {
                     *             "domain": "agrogenesis.in",
                     *             "paging_token": "agrogenesis.in"
                     *           },
                     *           {
                     *             "domain": "airdrop-info.vwv.pw",
                     *             "paging_token": "airdrop-info.vwv.pw"
                     *           }
                     *         ]
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ListApiResponse"] & {
                        _embedded?: {
                            records?: {
                                /** @description Fully-qualified domain name */
                                domain?: string;
                                /** @description Cursor value for results paging */
                                paging_token?: string;
                            }[];
                        };
                    };
                };
            };
            /** @description Invalid request parameters */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    isDomainBlocked: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Domain to verify (case-insensitive) */
                domain: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Domain verified */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "domain": "sub.stellar.org.am",
                     *       "blocked": true
                     *     }
                     */
                    "application/json": {
                        /** @example stellar.org.am */
                        domain?: string;
                        /**
                         * @description Whether the domain should be blocked
                         * @example true
                         */
                        blocked?: boolean;
                    };
                };
            };
            /** @description Invalid request parameters */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    getAllAssets: {
        parameters: {
            query?: {
                /**
                 * @description Arbitrary search term (asset code, issuer, associated home domain, or information from asset TOML metadata)
                 * @example dollar
                 */
                search?: string;
                /** @description Results sorting parameter */
                sort?: "rating" | "created" | "payments" | "trades" | "trustlines" | "volume" | "volume7d";
                /** @description Results sorting order */
                order?: components["schemas"]["ResultsSortOrder"];
                /** @description Results data page size */
                limit?: components["schemas"]["ResultsLimit"];
                /** @description A position from which to continue search (refers to the `paging_token` value from a results set) */
                cursor?: number;
            };
            header?: never;
            path: {
                /**
                 * @description Stellar network
                 * @example testnet
                 */
                network: components["schemas"]["Network"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Asset list fetched */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "_links": {
                     *         "self": {
                     *           "href": "/explorer/public/asset?order=desc&limit=2"
                     *         },
                     *         "prev": {
                     *           "href": "/explorer/public/asset?order=asc&limit=2&cursor=1"
                     *         },
                     *         "next": {
                     *           "href": "/explorer/public/asset?order=desc&limit=2&cursor=2"
                     *         }
                     *       },
                     *       "_embedded": {
                     *         "records": [
                     *           {
                     *             "asset": "yXLM-GARDNV3Q7YGT4AKSDF25LT32YSCCW4EV22Y2TV3I2PU2MMXJTEDL5T55-1",
                     *             "traded_amount": 102588436626011460,
                     *             "payments_amount": 12492248403205108,
                     *             "created": 1615892870,
                     *             "supply": 1669015135707318,
                     *             "trustlines": {
                     *               "total": 32266,
                     *               "authorized": 32266,
                     *               "funded": 19335
                     *             },
                     *             "trades": 13363178,
                     *             "payments": 13405766,
                     *             "domain": "ultrastellar.com",
                     *             "tomlInfo": {
                     *               "orgName": "Ultra Stellar LLC dba Ultra Stellar",
                     *               "orgLogo": "https://ultrastellar.com/static/images/org_logo.png",
                     *               "image": "https://ultrastellar.com/static/images/icons/yXLM.png",
                     *               "status": "live",
                     *               "anchorAssetType": "crypto",
                     *               "anchorAsset": "XLM"
                     *             },
                     *             "rating": {
                     *               "age": 7,
                     *               "trades": 10,
                     *               "payments": 9,
                     *               "trustlines": 7,
                     *               "volume7d": 10,
                     *               "interop": 10,
                     *               "liquidity": 10,
                     *               "average": 9
                     *             },
                     *             "paging_token": 1
                     *           },
                     *           {
                     *             "asset": "USDC-GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN-1",
                     *             "traded_amount": 18134208266562304,
                     *             "payments_amount": 24664489154530540,
                     *             "created": 1611089770,
                     *             "supply": 1800404216565311,
                     *             "trustlines": {
                     *               "total": 138801,
                     *               "authorized": 138801,
                     *               "funded": 27503
                     *             },
                     *             "trades": 20324688,
                     *             "payments": 2862354,
                     *             "domain": "centre.io",
                     *             "tomlInfo": {
                     *               "orgName": "Centre Consortium LLC dba Centre Consortium",
                     *               "orgLogo": "https://www.centre.io/images/logo-icon.png",
                     *               "name": "USD Coin",
                     *               "image": "https://www.centre.io/images/usdc/usdc-icon-86074d9d49.png",
                     *               "anchorAssetType": "fiat",
                     *               "anchorAsset": "USD"
                     *             },
                     *             "rating": {
                     *               "age": 7,
                     *               "trades": 10,
                     *               "payments": 8,
                     *               "trustlines": 8,
                     *               "volume7d": 10,
                     *               "interop": 4,
                     *               "liquidity": 10,
                     *               "average": 8.1
                     *             },
                     *             "paging_token": 2
                     *           }
                     *         ]
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ListApiResponse"] & {
                        _embedded?: {
                            records?: components["schemas"]["AssetInfo"][];
                        };
                    };
                };
            };
            /** @description Invalid request parameters */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    getAssetRating: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /**
                 * @description Stellar network
                 * @example testnet
                 */
                network: components["schemas"]["Network"];
                /** @description Target asset */
                asset: components["schemas"]["Asset"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Asset rating fetched */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "asset": "ABC-GAKP6AHQM4JDI55SK2FGEPLOZU7BTEODS3Y5QNT3VMQQIU3WM99T0L4C-1",
                     *       "rating": {
                     *         "age": 9,
                     *         "trades": 6,
                     *         "payments": 10,
                     *         "trustlines": 10,
                     *         "volume7d": 10,
                     *         "interop": 3,
                     *         "liquidty": 8,
                     *         "average": 8
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["AssetRating"];
                };
            };
            /** @description Invalid request parameters */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Asset not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    getAssetHolders: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /**
                 * @description Stellar network
                 * @example testnet
                 */
                network: components["schemas"]["Network"];
                /** @description Target asset */
                asset: components["schemas"]["Asset"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Asset holders fetched */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "_links": {
                     *         "self": {
                     *           "href": "/explorer/public/asset/EURT-GAP5LETOV6YIE62YAM56STDANPRDO7ZFDBGSNHJQIYGGKSMOZAHOOS2S/holders?order=desc&limit=2"
                     *         },
                     *         "prev": {
                     *           "href": "/explorer/public/asset/EURT-GAP5LETOV6YIE62YAM56STDANPRDO7ZFDBGSNHJQIYGGKSMOZAHOOS2S/holders?order=asc&limit=2&cursor=AAAFOSpHRlQAeBsb"
                     *         },
                     *         "next": {
                     *           "href": "/explorer/public/asset/EURT-GAP5LETOV6YIE62YAM56STDANPRDO7ZFDBGSNHJQIYGGKSMOZAHOOS2S/holders?order=desc&limit=2&cursor=AAACXn0v0QUAsZIb"
                     *         }
                     *       },
                     *       "_embedded": {
                     *         "records": [
                     *           {
                     *             "account": "GCWGHBQLVZ6QXV7OLHBCFHNPWOCSWGRZ7DTW44BN4IQ7QYVRX3JYPJ7E",
                     *             "balance": "5965453988886",
                     *             "paging_token": "AAAFOSpHRlQAeBsb"
                     *           },
                     *           {
                     *             "account": "GAFBGZANI7JRXABPEERQGBTFS3AG67M4ZQTMT2VIMWZ6BY4K64QK3D3U",
                     *             "balance": "2604850467077",
                     *             "paging_token": "AAACXn0v0QUAsZIb"
                     *           }
                     *         ]
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ListApiResponse"] & {
                        _embedded?: {
                            records?: components["schemas"]["AssetHolder"][];
                        };
                    };
                };
            };
            /** @description Invalid request parameters */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Asset not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    getAssetHolderPosition: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /**
                 * @description Stellar network
                 * @example testnet
                 */
                network: components["schemas"]["Network"];
                /** @description Asset used for rating calculation */
                asset: components["schemas"]["Asset"];
                /** @description Account address to check */
                account: components["schemas"]["AccountAddress"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Asset holder rank info fetched */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "account": "GDKIJJIKXLOM2NRMPNQZUUYK24ZPVFC6426GZAEP3KUK6KEJLACCWNMX",
                     *       "asset": "XLM",
                     *       "balance": "39065991792893022",
                     *       "position": 3,
                     *       "total": 7159959
                     *     }
                     */
                    "application/json": {
                        /** @description Account address to check */
                        account?: components["schemas"]["AccountAddress"];
                        /** @description Asset used for rating calculation */
                        asset?: components["schemas"]["Asset"];
                        /** @description Asset balance owned by the account */
                        balance?: string;
                        /** @description Position among all accounts holding a particular asset */
                        position?: number;
                        /** @description Total number of accounts with non-zero balance */
                        total?: number;
                    };
                };
            };
            /** @description Invalid request parameters */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Asset not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    getAssetSupply: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /**
                 * @description Stellar network
                 * @example testnet
                 */
                network: components["schemas"]["Network"];
                /**
                 * @description Target asset
                 * @example EURT-GAP5LETOV6YIE62YAM56STDANPRDO7ZFDBGSNHJQIYGGKSMOZAHOOS2S
                 */
                asset: components["schemas"]["Asset"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Asset supply fetched */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /** @example 1203229.6298700 */
                    "text/plain; charset=utf-8": string;
                };
            };
            /** @description Asset not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    getSequenceFromTimestamp: {
        parameters: {
            query: {
                /**
                 * @description Timestamp to search (UNIX time or RFC 3339 timestamp)
                 * @example 1642597270
                 */
                timestamp: string | number;
            };
            header?: never;
            path: {
                /**
                 * @description Stellar network
                 * @example public
                 */
                network: components["schemas"]["Network"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Ledger sequence resolved */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LedgerTimestampSequenceInfo"];
                };
            };
            /** @description Invalid timestamp */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Ledger sequence cannot be resolved */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    getTimestampFromSequence: {
        parameters: {
            query: {
                /**
                 * @description Ledger sequence
                 * @example 32590807
                 */
                sequence: number;
            };
            header?: never;
            path: {
                /**
                 * @description Stellar network
                 * @example public
                 */
                network: components["schemas"]["Network"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Timestamp resolved */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LedgerTimestampSequenceInfo"];
                };
            };
            /** @description Invalid sequence */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Ledger with a given sequence cannot be found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
}
