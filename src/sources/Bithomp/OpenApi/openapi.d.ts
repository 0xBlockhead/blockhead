export interface paths {
    "/d995db530-7e57-46d1-ac8a-76324794e0c9/address/{address}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get username and address information
         * @description Retrieves a username and other details for a requested XRPL address.
         */
        get: operations["getAccount"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/d995db530-7e57-46d1-ac8a-76324794e0c9/amms": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get AMMs
         * @description Returns a list of AMM pools.
         */
        get: operations["getAMMs"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/d995db530-7e57-46d1-ac8a-76324794e0c9/amm/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get AMM Pool
         * @description Retrieves information for a requested AMM pool.
         */
        get: operations["getPools"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/d995db530-7e57-46d1-ac8a-76324794e0c9/search/{value}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Search for a value
         * @description Search for a given value (could be address, tx hash, username, etc.).
         */
        get: operations["getSearch"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/d995db530-7e57-46d1-ac8a-76324794e0c9/username/{username}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get username details
         * @description Retrieves the account associated with a requested username.
         */
        get: operations["getUsername"];
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
export interface operations {
    getAccount: {
        parameters: {
            query?: {
                /** @description If set to true, the result will include a username. */
                username?: boolean;
                /** @description If set to true, the result will include service details. */
                service?: boolean;
                /** @description If set true, the result will include a verified domain if such exists. */
                verifiedDomain?: boolean;
                /** @description If set to true, the result will include inception details. */
                inception?: boolean;
                /** @description If set to true, the result will include ledger info. */
                ledgerInfo?: boolean;
            };
            header?: never;
            path: {
                /** @description The XRPL address, can be r-address or X-address */
                address: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successfully retrieved address information */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        address?: string;
                        xAddress?: string;
                        username?: string;
                        service?: {
                            name?: string;
                            domain?: string;
                            socialAccounts?: {
                                [key: string]: string;
                            };
                        };
                        verifiedDomain?: string;
                        inception?: number;
                        initialBalance?: number;
                        genesis?: boolean;
                        ledgerInfo?: {
                            activated?: boolean;
                            error?: string;
                            ledger?: number;
                            ledgerTimestamp?: number;
                            balance?: string;
                            flags?: {
                                [key: string]: boolean;
                            };
                            ownerCount?: number;
                            previousTxnID?: string;
                            previousTxnLgrSeq?: number;
                            sequence?: number;
                            accountTxnID?: string;
                            mintedTokens?: number;
                            burnedTokens?: number;
                            regularKey?: string;
                            ticketCount?: number;
                            signerList?: {
                                previousTxnID?: string;
                                previousTxnLgrSeq?: number;
                                signerQuorum?: number;
                                flags?: {
                                    [key: string]: boolean;
                                };
                                signerEntries?: {
                                    account?: string;
                                    signerWeight?: number;
                                }[];
                            };
                            domain?: string;
                            emailHash?: string;
                            messageKey?: string;
                            tickSize?: number;
                            transferRate?: number;
                            blackholed?: boolean;
                        };
                    };
                };
            };
        };
    };
    getAMMs: {
        parameters: {
            query?: {
                /** @description Order of returned AMMs (createdOld, createdNew, updatedOld, updatedNew) */
                order?: string;
                /** @description Currency to sort by (when order is currencyHigh) */
                sortCurrency?: string;
                /** @description Currency issuer for sortCurrency */
                sortCurrencyIssuer?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successfully retrieved AMM pools */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        order?: string;
                        marker?: string;
                        amms?: {
                            ammID?: string;
                            createdAt?: number;
                            createdLedgerIndex?: number;
                            createdTxHash?: string;
                            updatedAt?: number;
                            updatedLedgerIndex?: number;
                            updatedTxHash?: string;
                            account?: string;
                            accountDetails?: {
                                username?: string;
                                service?: string;
                            };
                            ownerNode?: string;
                            amount?: string;
                            amount2?: {
                                currency?: string;
                                issuer?: string;
                                value?: string;
                                issuerDetails?: {
                                    username?: string;
                                    service?: string;
                                };
                            };
                            tradingFee?: number;
                            auctionSlot?: {
                                account?: string;
                                accountDetails?: {
                                    username?: string;
                                    service?: string;
                                };
                                discountedFee?: number;
                                expiration?: number;
                                price?: {
                                    currency?: string;
                                    issuer?: string;
                                    value?: string;
                                    issuerDetails?: {
                                        username?: string;
                                        service?: string;
                                    };
                                };
                            };
                            lpTokenBalance?: {
                                currency?: string;
                                issuer?: string;
                                value?: string;
                                issuerDetails?: {
                                    username?: string;
                                    service?: string;
                                };
                            };
                            voteSlots?: {
                                createdAt?: number;
                                createdLedgerIndex?: number;
                                createdTxHash?: string;
                                updatedAt?: number;
                                updatedLedgerIndex?: number;
                                updatedTxHash?: string;
                                account?: string;
                                accountDetails?: {
                                    username?: string;
                                    service?: string;
                                };
                                tradingFee?: number;
                                voteWeight?: number;
                            }[];
                        }[];
                    };
                };
            };
        };
    };
    getPools: {
        parameters: {
            query?: {
                /** @description Ledger index */
                ledgerIndex?: number;
                /** @description Ledger timestamp */
                ledgerTimestamp?: number;
            };
            header?: never;
            path: {
                /** @description AMM ID, LP token currency code or AMM account address */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successfully retrieved AMM pool information */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        ammID?: string;
                        createdAt?: number;
                        createdLedgerIndex?: number;
                        createdTxHash?: string;
                        updatedAt?: number;
                        updatedLedgerIndex?: number;
                        updatedTxHash?: string;
                        account?: string;
                        accountDetails?: {
                            username?: string;
                            service?: string;
                        };
                        ownerNode?: string;
                        amount?: string;
                        amount2?: {
                            currency?: string;
                            issuer?: string;
                            value?: string;
                            issuerDetails?: {
                                username?: string;
                                service?: string;
                            };
                        };
                        tradingFee?: number;
                        auctionSlot?: {
                            account?: string;
                            accountDetails?: {
                                username?: string;
                                service?: string;
                            };
                            discountedFee?: number;
                            expiration?: number;
                            price?: {
                                currency?: string;
                                issuer?: string;
                                value?: string;
                                issuerDetails?: {
                                    username?: string;
                                    service?: string;
                                };
                            };
                        };
                        lpTokenBalance?: {
                            currency?: string;
                            issuer?: string;
                            value?: string;
                            issuerDetails?: {
                                username?: string;
                                service?: string;
                            };
                        };
                        voteSlots?: {
                            createdAt?: number;
                            createdLedgerIndex?: number;
                            createdTxHash?: string;
                            updatedAt?: number;
                            updatedLedgerIndex?: number;
                            updatedTxHash?: string;
                            account?: string;
                            accountDetails?: {
                                username?: string;
                                service?: string;
                            };
                            tradingFee?: number;
                            voteWeight?: number;
                        }[];
                    };
                };
            };
        };
    };
    getSearch: {
        parameters: {
            query?: {
                /** @description Type of value to search for (address, username, service, etc.) */
                type?: string;
            };
            header?: never;
            path: {
                /** @description Search value */
                value: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successfully performed search */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        value?: string;
                        type?: string;
                        result?: {
                            address?: string;
                            transaction?: string;
                            username?: string;
                            service?: {
                                name?: string;
                                domain?: string;
                                socialAccounts?: {
                                    [key: string]: string;
                                };
                            };
                        };
                    };
                };
            };
        };
    };
    getUsername: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description The username to look up */
                username: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successfully retrieved username details */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        account?: string;
                        service?: string;
                        domain?: string;
                        domain_verified?: boolean;
                        created?: number;
                    };
                };
            };
        };
    };
}
