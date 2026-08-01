export interface paths {
    "/{networkName}/{contractAddress(0x[a-fA-F0-9]{40})}/{tokenId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description ENS NFT metadata */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    networkName: components["schemas"]["networkName"];
                    contractAddress: components["schemas"]["contractAddress"];
                    /**
                     * @description Labelhash(v1) /Namehash(v2) of your ENS name.
                     *
                     *     More: https://docs.ens.domains/contract-api-reference/name-processing#hashing-names
                     */
                    tokenId: components["schemas"]["tokenId"];
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Metadata object */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ENSMetadata"];
                        "application/xml": components["schemas"]["ENSMetadata"];
                    };
                };
                /** @description No results found */
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
                /** @description Unsupported network */
                501: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description Gateway Timeout */
                504: {
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
    "/{networkName}/{contractAddress(0x[a-fA-F0-9]{40})}/{tokenId}/image": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description ENS NFT image */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    networkName: components["schemas"]["networkName"];
                    contractAddress: components["schemas"]["contractAddress"];
                    /**
                     * @description Labelhash(v1) /Namehash(v2) of your ENS name.
                     *
                     *     More: https://docs.ens.domains/contract-api-reference/name-processing#hashing-names
                     */
                    tokenId: components["schemas"]["tokenId"];
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Image file */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description No results found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description Unsupported network */
                501: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description Gateway Timeout */
                504: {
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
    "/{networkName}/{contractAddress(0x[a-fA-F0-9]{40})}/{tokenId}/rasterize": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description ENS NFT image rasterization */
        get: {
            parameters: {
                query?: {
                    /** @description Resolution option for the rasterization. Available options: low (default) | high */
                    res?: components["schemas"]["res"];
                };
                header?: never;
                path: {
                    networkName: components["schemas"]["networkName"];
                    contractAddress: components["schemas"]["contractAddress"];
                    /**
                     * @description Labelhash(v1) /Namehash(v2) of your ENS name.
                     *
                     *     More: https://docs.ens.domains/contract-api-reference/name-processing#hashing-names
                     */
                    tokenId: components["schemas"]["tokenId"];
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Image file */
                200: {
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
                /** @description Unsupported network */
                501: {
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
    "/{networkName}/avatar/{name}/meta": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description ENS avatar metadata */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    networkName: components["schemas"]["networkName"];
                    /** @description ENS name */
                    name: components["schemas"]["ensName"];
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Metadata object */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["MediaMetadata"];
                        "application/xml": components["schemas"]["MediaMetadata"];
                    };
                };
                /** @description No results found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description Unsupported network */
                501: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description Gateway Timeout */
                504: {
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
    "/{networkName}/avatar/{name}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description ENS avatar image */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    networkName: components["schemas"]["networkName"];
                    /** @description ENS name */
                    name: components["schemas"]["ensName"];
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Image file */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description No results found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description Unsupported network */
                501: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description Gateway Timeout */
                504: {
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
    "/queryNFT": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Query endpoint for NFT URIs */
        get: {
            parameters: {
                query?: {
                    /** @description NFT URI as defined under CAIP-22 for erc721 assets and CAIP-29 for erc1155 assets. */
                    uri?: string;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description NFT metadata */
                200: {
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
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/preview/{name}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description ENS NFT preview */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description ENS name. */
                    name: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Image file */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description No results found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description Gateway Timeout */
                504: {
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
        MediaMetadata: {
            /** @example ENS name of avatar holder */
            uri: string;
            /** @example Ownership verification of NFT */
            is_owner?: string;
            host_meta?: {
                /** @example Chain ID where NFT resides */
                chain_id?: string;
                /** @example Type of NFT contract */
                namespace?: string;
                /** @example Contract address of NFT */
                contract_address?: string;
                /** @example Token ID of NFT */
                token_id?: string;
                /** @example Resolution query parameter for rasterization */
                res?: string;
                /** @example Marketplace URL of NFT */
                reference_url?: string;
            };
            /** @example Name of NFT */
            name: string;
            /** @example Description of NFT */
            description: string;
            /** @example Attributes of NFT */
            attributes: string;
            /** @example Image data/URL of NFT */
            image: string;
            /** @example Image data/URL of NFT */
            image_url?: string;
            /** @example Image data of NFT */
            image_data?: string;
            /** @example Background color of NFT */
            background_color?: string;
            /** @example Youtube URL of NFT */
            youtube_url?: string;
        };
        ENSMetadata: {
            /** @example ENS name */
            name: string;
            /** @example Short ENS name description */
            description: string;
            /** @example Custom traits about ENS */
            attributes: string;
            /** @example Character length of ens name */
            name_length: string;
            /** @example ENS App URL of the name */
            url: string;
            /** @example ENS NFT version */
            version: string;
            /** @example Origin URL of avatar image */
            background_image: string;
            /** @example URL of ENS NFT image */
            image_url: string;
        };
        /** @example 0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85 */
        contractAddress: string;
        /** @example nick.eth */
        ensName: string;
        /** @example 4221908525551133525058944220830153... */
        tokenId: string;
        /** @example high */
        res: string;
        /**
         * @description Name of the chain to query for.
         * @enum {string}
         */
        networkName: "mainnet" | "sepolia";
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export type operations = Record<string, never>;
