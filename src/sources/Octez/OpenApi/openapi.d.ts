export interface paths {
    "/bls/aggregate_proofs": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** @description Aggregate BLS proofs. Return null if the provided proofs cannot be aggregated, or if their aggregation is not a valid proof for the provided public key. */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": {
                        public_key: components["schemas"]["Bls12_381.Public_key"];
                        proofs: components["schemas"]["Bls12_381_signature"][];
                    };
                };
            };
            responses: {
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Bls12_381_signature"] | null;
                    };
                };
                default: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": unknown;
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/bls/aggregate_public_keys": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** @description Aggregate BLS public keys after checking their BLS proofs */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": {
                        public_key: components["schemas"]["Bls12_381.Public_key"];
                        proof: components["schemas"]["Bls12_381_signature"];
                    }[];
                };
            };
            responses: {
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            public_key: components["schemas"]["Bls12_381.Public_key"];
                            public_key_hash: components["schemas"]["Bls12_381.Public_key_hash"];
                        } | null;
                    };
                };
                default: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": unknown;
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/bls/aggregate_signatures": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** @description Aggregate BLS signatures. Return null if the signatures cannot be aggregated, or if their aggregation is not a valid signature for the provided public key and message. */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": {
                        public_key: components["schemas"]["Bls12_381.Public_key"];
                        message: string;
                        signature_shares: components["schemas"]["Bls12_381_signature"][];
                    };
                };
            };
            responses: {
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Bls12_381_signature"] | null;
                    };
                };
                default: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": unknown;
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/bls/check_proof": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** @description Check a BLS proof */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": {
                        public_key: components["schemas"]["Bls12_381.Public_key"];
                        proof: components["schemas"]["Bls12_381_signature"];
                    };
                };
            };
            responses: {
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": boolean;
                    };
                };
                default: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": unknown;
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/bls/threshold_signatures": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** @description Threshold BLS signatures */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": {
                        public_key: components["schemas"]["Bls12_381.Public_key"];
                        message: string;
                        signature_shares: {
                            id: number;
                            signature: components["schemas"]["Bls12_381_signature"];
                        }[];
                    };
                };
            };
            responses: {
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Bls12_381_signature"] | null;
                    };
                };
                default: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": unknown;
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/chains/{chain_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /** @description Forcefully set the bootstrapped flag of the node */
        patch: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description A chain identifier. This is either a chain hash in Base58Check notation or a one the predefined aliases: 'main', 'test'. */
                    chain_id: string;
                };
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": {
                        bootstrapped: boolean;
                    };
                };
            };
            responses: {
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": unknown;
                    };
                };
                default: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": unknown;
                    };
                };
            };
        };
        trace?: never;
    };
    "/chains/{chain_id}/active_peers_heads": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description The heads of all active peers */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description A chain identifier. This is either a chain hash in Base58Check notation or a one the predefined aliases: 'main', 'test'. */
                    chain_id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            active_peers_heads: {
                                peer_id: components["schemas"]["Crypto_box.Public_key_hash"];
                                block_hash: components["schemas"]["block_hash"];
                                block_level: number;
                            }[];
                        };
                    };
                };
                default: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": unknown;
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
    "/chains/{chain_id}/blocks": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Lists block hashes from '<chain>', up to the last checkpoint, sorted with decreasing fitness. Without arguments it returns the head of the chain. Optional arguments allow to return the list of predecessors of a given block or of a set of blocks. */
        get: {
            parameters: {
                query?: {
                    /** @description The requested number of predecessors to return (per request; see next argument). */
                    length?: string;
                    /** @description block_hash (Base58Check-encoded) An empty argument requests blocks starting with the current head. A non empty list allows to request one or more specific fragments of the chain. */
                    head?: string;
                    /** @description A date in seconds from epoch When `min_date` is provided, blocks with a timestamp before `min_date` are filtered out. However, if the `length` parameter is also provided, then up to that number of predecessors will be returned regardless of their date. */
                    min_date?: string;
                };
                header?: never;
                path: {
                    /** @description A chain identifier. This is either a chain hash in Base58Check notation or a one the predefined aliases: 'main', 'test'. */
                    chain_id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["block_hash"][][];
                    };
                };
                default: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": unknown;
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
    "/chains/{chain_id}/chain_id": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description The chain unique identifier. */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description A chain identifier. This is either a chain hash in Base58Check notation or a one the predefined aliases: 'main', 'test'. */
                    chain_id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["unistring"];
                    };
                };
                default: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": unknown;
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
    "/chains/{chain_id}/delegators_contribution/{int32}/{pkh}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description A breakdown of all the contributions to the delegation portion of the baking power of the given delegate for the given cycle. */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description A chain identifier. This is either a chain hash in Base58Check notation or a one the predefined aliases: 'main', 'test'. */
                    chain_id: string;
                    int32: string;
                    /** @description A Secp256k1 of a Ed25519 public key hash (Base58Check-encoded) */
                    pkh: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            own_delegated: components["schemas"]["int64"];
                            external_delegators: {
                                delegator_contract_hash: components["schemas"]["unistring"];
                                contribution: components["schemas"]["int64"];
                            }[];
                            former_delegators_unstake_requests: components["schemas"]["int64"];
                            overstaked: components["schemas"]["int64"];
                            total_delegated_including_overdelegated: components["schemas"]["int64"];
                            total_delegated_after_limits: components["schemas"]["int64"];
                            overdelegated: components["schemas"]["int64"];
                        };
                    };
                };
                default: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": unknown;
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
    "/chains/{chain_id}/invalid_blocks": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Lists blocks that have been declared invalid along with the errors that led to them being declared invalid. */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description A chain identifier. This is either a chain hash in Base58Check notation or a one the predefined aliases: 'main', 'test'. */
                    chain_id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            block: components["schemas"]["block_hash"];
                            level: number;
                            errors: components["schemas"]["error"];
                        }[];
                    };
                };
                default: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": unknown;
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
    "/chains/{chain_id}/invalid_blocks/{block_hash}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description The errors that appears during the block (in)validation. */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description A chain identifier. This is either a chain hash in Base58Check notation or a one the predefined aliases: 'main', 'test'. */
                    chain_id: string;
                    /** @description block_hash (Base58Check-encoded) */
                    block_hash: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            block: components["schemas"]["block_hash"];
                            level: number;
                            errors: components["schemas"]["error"];
                        };
                    };
                };
                default: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": unknown;
                    };
                };
            };
        };
        put?: never;
        post?: never;
        /** @description Remove an invalid block for the tezos storage */
        delete: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description A chain identifier. This is either a chain hash in Base58Check notation or a one the predefined aliases: 'main', 'test'. */
                    chain_id: string;
                    /** @description block_hash (Base58Check-encoded) */
                    block_hash: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": Record<string, never>;
                    };
                };
                default: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": unknown;
                    };
                };
            };
        };
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/chains/{chain_id}/is_bootstrapped": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description The bootstrap status of a chain */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description A chain identifier. This is either a chain hash in Base58Check notation or a one the predefined aliases: 'main', 'test'. */
                    chain_id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            bootstrapped: boolean;
                            sync_state: components["schemas"]["chain_status"];
                        };
                    };
                };
                default: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": unknown;
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
    "/chains/{chain_id}/levels/caboose": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description The current caboose for this chain. */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description A chain identifier. This is either a chain hash in Base58Check notation or a one the predefined aliases: 'main', 'test'. */
                    chain_id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            block_hash: components["schemas"]["block_hash"];
                            level: number;
                        };
                    };
                };
                default: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": unknown;
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
    "/chains/{chain_id}/levels/checkpoint": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description The current checkpoint for this chain. */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description A chain identifier. This is either a chain hash in Base58Check notation or a one the predefined aliases: 'main', 'test'. */
                    chain_id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            block_hash: components["schemas"]["block_hash"];
                            level: number;
                        };
                    };
                };
                default: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": unknown;
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
    "/chains/{chain_id}/levels/savepoint": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description The current savepoint for this chain. */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description A chain identifier. This is either a chain hash in Base58Check notation or a one the predefined aliases: 'main', 'test'. */
                    chain_id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            block_hash: components["schemas"]["block_hash"];
                            level: number;
                        };
                    };
                };
                default: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": unknown;
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
    "/chains/{chain_id}/protocols": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Lists protocols of the chain. */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description A chain identifier. This is either a chain hash in Base58Check notation or a one the predefined aliases: 'main', 'test'. */
                    chain_id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            protocol: components["schemas"]["Protocol_hash"];
                            /** @description Level of protocol in the sequence of protocol activations. */
                            proto_level: number;
                            /** @description The activation block for a protocol is the migration block, i.e. the last level of the previous protocol. */
                            activation_block: {
                                block_hash: components["schemas"]["block_hash"];
                                level: number;
                            };
                        }[];
                    };
                };
                default: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": unknown;
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
    "/chains/{chain_id}/protocols/{Protocol_hash}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Information about a protocol of the chain. */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description A chain identifier. This is either a chain hash in Base58Check notation or a one the predefined aliases: 'main', 'test'. */
                    chain_id: string;
                    /** @description Protocol_hash (Base58Check-encoded) */
                    Protocol_hash: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            protocol: components["schemas"]["Protocol_hash"];
                            /** @description Level of protocol in the sequence of protocol activations. */
                            proto_level: number;
                            /** @description The activation block for a protocol is the migration block, i.e. the last level of the previous protocol. */
                            activation_block: {
                                block_hash: components["schemas"]["block_hash"];
                                level: number;
                            };
                        };
                    };
                };
                default: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": unknown;
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
    "/config": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Return the runtime node configuration (this takes into account the command-line arguments and the on-disk configuration file) */
        get: {
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
                        "application/json": {
                            /** @description Location of the data dir on disk. */
                            "data-dir"?: components["schemas"]["unistring"];
                            /** @description Disable the node configuration validation. */
                            "disable-config-validation"?: boolean;
                            /** @description Configuration of rpc parameters */
                            rpc?: {
                                /** @description Hosts to listen to. If the port is not specified, the default port 8732 will be assumed. */
                                "listen-addrs"?: components["schemas"]["unistring"][];
                                /** @description Hosts to listen to. If the port is not specified, the default port 8732 will be assumed. */
                                "external-listen-addrs"?: components["schemas"]["unistring"][];
                                /** @description Legacy value: Host to listen to */
                                "listen-addr"?: components["schemas"]["unistring"];
                                /** @description Cross Origin Resource Sharing parameters, see https://en.wikipedia.org/wiki/Cross-origin_resource_sharing. */
                                "cors-origin"?: components["schemas"]["unistring"][];
                                /** @description Cross Origin Resource Sharing parameters, see https://en.wikipedia.org/wiki/Cross-origin_resource_sharing. */
                                "cors-headers"?: components["schemas"]["unistring"][];
                                /** @description Certificate file (necessary when TLS is used). */
                                crt?: components["schemas"]["unistring"];
                                /** @description Key file (necessary when TLS is used). */
                                key?: components["schemas"]["unistring"];
                                /** @description A list of RPC ACLs for specific listening addresses. */
                                acl?: ({
                                    address: components["schemas"]["unistring"];
                                    whitelist: components["schemas"]["unistring"][];
                                } | {
                                    address: components["schemas"]["unistring"];
                                    blacklist: components["schemas"]["unistring"][];
                                })[];
                                /**
                                 * @description The media types supported by the server.
                                 * @enum {string}
                                 */
                                "media-type"?: "json" | "any" | "binary";
                                /** @description The maximum number of active connections per RPC endpoint. */
                                max_active_rpc_connections?: components["schemas"]["max_active_rpc_connections"];
                                /** @description Enables HTTP cache headers in the RPC response. When enabled, 'Cache-control' will be present with 'max-age' in the response header of relative queries (eg. head, head-n, head~n). The 'max-age' value indicates the duration of which the returned response is cacheable. It is an estimate of the remaining duration of the current round based on when the block was forged. Enabling this feature adds a performance overhead to all queries hence you should only do so if you are running the RPC server behind a caching server. The feature is implemented based on RFC9111 hence useful for reverse proxies with auto-caching mechanism. */
                                "enable-http-cache-headers"?: boolean;
                            };
                            /** @description Configuration of network parameters */
                            p2p?: {
                                /** @description Floating point number between 0 and 256 that represents a difficulty, 24 signifies for example that at least 24 leading zeroes are expected in the hash. */
                                "expected-proof-of-work"?: number;
                                /** @description List of hosts. Tezos can connect to both IPv6 and IPv4 hosts. If the port is not specified, default port 9732 will be assumed. */
                                "bootstrap-peers"?: components["schemas"]["unistring"][];
                                /** @description Host to listen to. If the port is not specified, the default port 9732 will be assumed. */
                                "listen-addr"?: components["schemas"]["unistring"];
                                /** @description Alternative port advertised to other peers to connect to. If the port is not specified, the port from listen-addr will be assumed. */
                                "advertised-net-port"?: number;
                                /** @description Host for local peer discovery. If the port is not specified, the default port 10732 will be assumed. */
                                "discovery-addr"?: components["schemas"]["unistring"] | null;
                                /** @description Specify if the node is in private mode or not. A node in private mode rejects incoming connections from untrusted peers and only opens outgoing connections to peers listed in 'bootstrap-peers' or provided with '--peer' option. Moreover, these peers will keep the identity and the address of the private node secret. */
                                "private-mode"?: boolean;
                                /** @description Network limits */
                                limits?: {
                                    /** @description Delay acceptable when initiating a connection to a new peer, in seconds. */
                                    "connection-timeout"?: components["schemas"]["timespan.system"];
                                    /** @description Delay granted to a peer to perform authentication, in seconds. */
                                    "authentication-timeout"?: components["schemas"]["timespan.system"];
                                    /** @description Strict minimum number of connections (triggers an urgent maintenance). */
                                    "min-connections"?: number;
                                    /** @description Targeted number of connections to reach when bootstrapping / maintaining. */
                                    "expected-connections"?: number;
                                    /** @description Maximum number of connections (exceeding peers are disconnected). */
                                    "max-connections"?: number;
                                    /** @description Number above which pending incoming connections are immediately rejected. */
                                    backlog?: number;
                                    /** @description Number above which pending incoming connections are immediately rejected. */
                                    "max-incoming-connections"?: number;
                                    /** @description Max download speeds in KiB/s. */
                                    "max-download-speed"?: number;
                                    /** @description Max upload speeds in KiB/s. */
                                    "max-upload-speed"?: number;
                                    "swap-linger"?: components["schemas"]["timespan.system"] | null;
                                    "binary-chunks-size"?: number;
                                    /** @description Size of the buffer passed to read(2). */
                                    "read-buffer-size"?: number;
                                    "read-queue-size"?: number | null;
                                    "write-queue-size"?: number | null;
                                    "incoming-app-message-queue-size"?: number | null;
                                    "incoming-message-queue-size"?: number | null;
                                    "outgoing-message-queue-size"?: number | null;
                                    /** @description The max and target size for the known address table. */
                                    max_known_points?: (number)[];
                                    /** @description The max and target size for the known peers table. */
                                    max_known_peer_ids?: (number)[];
                                    /** @description The number of peer_ids kept in the peer_id greylist. */
                                    peer_greylist_size?: number;
                                    /** @description The size of the IP address greylist (in kilobytes). */
                                    ip_greylist_size_in_kilobytes?: number;
                                    /** @description The time an IP address is kept in the greylist. */
                                    ip_greylist_cleanup_delay?: components["schemas"]["timespan.system"];
                                    /** @description GC delay for the greylists tables, in seconds. */
                                    "greylist-timeout"?: components["schemas"]["timespan.system"];
                                    /** @description How long to wait at most, in seconds, before running a maintenance loop. If null -- decoding to None -- is provided then the maintenance is disabled. */
                                    "maintenance-idle-time"?: components["schemas"]["timespan.system"] | null;
                                };
                                /** @description If set to [true], the node will not participate in the propagation of pending operations (mempool). Default value is [false]. It can be used to decrease the memory and computation footprints of the node. */
                                disable_mempool?: boolean;
                                /** @description DEPRECATED. If set to [true], the node will spawn a testchain during the protocol's testing voting period. Default value is [false]. It is disabled to decrease the node storage usage and computation by dropping the validation of the test network blocks. */
                                enable_testchain?: boolean;
                                /** @description The reconnection policy regulates the frequency with which the node tries to reconnect to an old known peer. */
                                greylisting_config?: {
                                    /** @description The factor by which the reconnection delay is increased when a peer that was previously disconnected is disconnected again. This value should be set to 1 for a linear back-off and to >1 for an exponential back-off. */
                                    factor?: number;
                                    /** @description The span of time a peer is disconnected for when it is first disconnected. */
                                    "initial-delay"?: components["schemas"]["timespan.system"];
                                    /** @description The span of time a peer is disconnected for when it is disconnected as the result of an error. */
                                    "disconnection-delay"?: components["schemas"]["timespan.system"];
                                    /** @description The maximum amount by which the reconnection is extended. This limits the rate of the exponential back-off, which eventually becomes linear when it reaches this limit. This limit is set to avoid reaching the End-of-Time when repeatedly reconnection a peer. */
                                    "increase-cap"?: components["schemas"]["timespan.system"];
                                };
                                /** @description This field should be used for testing purpose only. If set to [true], the node will not participate to the peer discovery mechanism. The node will not be able to find new peers to connect with. */
                                disable_peer_discovery?: boolean;
                            };
                            /** @description Configuration of the Lwt-log sink (part of the logging framework) */
                            log?: {
                                /** @description Output for the logging function. Either 'stdout', 'stderr' or the name of a log file . */
                                output?: components["schemas"]["unistring"];
                                /**
                                 * @description Verbosity level: one of 'fatal', 'error', 'warn','notice', 'info', 'debug'.
                                 * @enum {string}
                                 */
                                level?: "info" | "debug" | "error" | "fatal" | "warning" | "notice";
                                /** @description Enables light coloring in logs. */
                                colors?: boolean;
                                /** @description Fine-grained logging instructions. Same format as described in `octez-node run --help`, DEBUG section. In the example below, sections 'p2p' and all sections starting by 'client' will have their messages logged up to the debug level, whereas the rest of log sections will be logged up to the notice level. */
                                rules?: components["schemas"]["unistring"];
                                /** @description When `true`, advertises the level of an event in addition to its contents. */
                                advertises_level?: boolean;
                            };
                            /** @description Configuration of the structured logging framework */
                            "internal-events"?: {
                                /** @description List of URIs to activate/configure sinks. */
                                active_sinks?: components["schemas"]["unistring"][];
                            } | {
                                /** @description List of URIs to activate/configure sinks. */
                                activate?: components["schemas"]["unistring"][];
                            };
                            /** @description Configuration of network parameters */
                            shell?: {
                                peer_validator?: {
                                    block_header_request_timeout?: components["schemas"]["timespan.system"];
                                    block_operations_request_timeout?: components["schemas"]["timespan.system"];
                                    protocol_request_timeout?: components["schemas"]["timespan.system"];
                                    new_head_request_timeout?: components["schemas"]["timespan.system"];
                                };
                                block_validator?: {
                                    protocol_request_timeout?: components["schemas"]["timespan.system"];
                                    operation_metadata_size_limit?: components["schemas"]["operation_metadata_size_limit"];
                                };
                                prevalidator?: {
                                    operations_request_timeout?: components["schemas"]["timespan.system"];
                                    max_refused_operations?: number;
                                    operations_batch_size?: number;
                                };
                                chain_validator?: {
                                    /** @description [latency] is the time interval (in seconds) used to determine if a peer is synchronized with a chain. For instance, a peer whose known head has a timestamp T is considered synchronized if T >= now - latency. This parameter depends on the baking rate and the latency of the network. */
                                    latency?: number;
                                    /** @description The minimal number of peers this peer should be synchronized with in order to be bootstrapped. */
                                    synchronisation_threshold?: number;
                                } | {
                                    /** @description [DEPRECATED] Set the number of peers with whom a chain synchronisation must be completed to bootstrap the node. */
                                    bootstrap_threshold?: number;
                                };
                                history_mode?: components["schemas"]["history_mode"];
                                disable_context_pruning?: boolean;
                                storage_maintenance_delay?: components["schemas"]["storage_maintenance_delay"];
                            };
                            /** @description Configuration of which network/blockchain to connect to */
                            network?: "sandbox" | "mainnet" | "ghostnet" | "shadownet" | {
                                genesis: {
                                    timestamp: components["schemas"]["timestamp.protocol"];
                                    block: components["schemas"]["block_hash"];
                                    protocol: components["schemas"]["Protocol_hash"];
                                };
                                genesis_parameters?: {
                                    context_key?: components["schemas"]["unistring"];
                                    values: unknown;
                                };
                                chain_name: components["schemas"]["distributed_db_version.name"];
                                old_chain_name?: components["schemas"]["distributed_db_version.name"];
                                incompatible_chain_name?: components["schemas"]["distributed_db_version.name"];
                                sandboxed_chain_name: components["schemas"]["distributed_db_version.name"];
                                user_activated_upgrades?: components["schemas"]["user_activated.upgrades"];
                                user_activated_protocol_overrides?: components["schemas"]["user_activated.protocol_overrides"];
                                /** @description List of hosts to use if p2p.bootstrap_peers is unspecified. */
                                default_bootstrap_peers?: components["schemas"]["unistring"][];
                                /** @description USE FOR TESTING PURPOSE ONLY. Configuration for the data-availibility layer */
                                dal_config?: {
                                    activated?: boolean;
                                    bootstrap_peers: components["schemas"]["unistring"][];
                                };
                            };
                            /** @description Configuration of the Prometheus metrics endpoint */
                            metrics_addr?: components["schemas"]["unistring"][];
                            /** @description Configuration of profiling output */
                            profiling?: {
                                /** @description Number of days of profiling results to keep. Older profiling files are automatically deleted during daily rotation. */
                                "days-kept"?: number;
                                /** @description Per-profiler verbosity rules. Same format as the PROFILING environment variable, e.g. "chain_validator->debug;rpc_server->notice". When set, overrides the PROFILING environment variable. */
                                verbosity?: components["schemas"]["unistring"];
                                /** @description List of profiling backends to enable, e.g. ["txt", "json"]. When set, overrides the PROFILING_BACKENDS environment variable. */
                                backends?: components["schemas"]["unistring"][];
                                /** @description Override the profiling output directory. When set, overrides the PROFILING_OUTPUT_DIR environment variable. */
                                "output-dir"?: components["schemas"]["unistring"];
                            };
                        };
                    };
                };
                default: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": unknown;
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
    "/config/history_mode": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Returns the history mode of the node's underlying storage. In full or rolling mode, it provides the values of `additional_cycles` and `blocks_preservation_cycles`. The sum of these values is the total number of stored cycles. */
        get: {
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
                        "application/json": {
                            history_mode: components["schemas"]["history_mode"];
                            blocks_preservation_cycles?: number;
                        };
                    };
                };
                default: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": unknown;
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
    "/config/logging": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /** @description Replace the logging configuration of the node. */
        put: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": {
                        /** @description List of URIs to activate/configure sinks. */
                        active_sinks?: components["schemas"]["unistring"][];
                    } | {
                        /** @description List of URIs to activate/configure sinks. */
                        activate?: components["schemas"]["unistring"][];
                    };
                };
            };
            responses: {
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": Record<string, never>;
                    };
                };
                default: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": unknown;
                    };
                };
            };
        };
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/config/network/dal": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Configuration for the DAL */
        get: {
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
                        "application/json": {
                            activated?: boolean;
                            bootstrap_peers: components["schemas"]["unistring"][];
                        };
                    };
                };
                default: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": unknown;
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
    "/config/network/user_activated_protocol_overrides": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description List of protocols which replace other protocols */
        get: {
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
                        "application/json": {
                            replaced_protocol: components["schemas"]["Protocol_hash"];
                            replacement_protocol: components["schemas"]["Protocol_hash"];
                        }[];
                    };
                };
                default: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": unknown;
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
    "/config/network/user_activated_upgrades": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description List of protocols to switch to at given levels */
        get: {
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
                        "application/json": {
                            level: number;
                            replacement_protocol: components["schemas"]["Protocol_hash"];
                        }[];
                    };
                };
                default: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": unknown;
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
    "/errors": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Schema for all the RPC errors from the shell */
        get: {
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
                        "application/json": unknown;
                    };
                };
                default: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": unknown;
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
    "/fetch_protocol/{Protocol_hash}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Fetch a protocol from the network. */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description Protocol_hash (Base58Check-encoded) */
                    Protocol_hash: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": unknown;
                    };
                };
                default: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": unknown;
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
    "/gc/full": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** @description Trigger a full OCaml garbage collection cycle. This endpoint must be used with care. */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": unknown;
                };
            };
            responses: {
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": unknown;
                    };
                };
                default: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": unknown;
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/health/ready": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Returns whether or not the node is ready to answer to requests. */
        get: {
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
                        "application/json": {
                            ready: boolean;
                        };
                    };
                };
                default: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": unknown;
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
    "/injection/block": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** @description Inject a block in the node and broadcast it. The `operations` embedded in `blockHeader` might be pre-validated using a contextual RPCs from the latest block (e.g. '/blocks/head/context/preapply'). Returns the ID of the block. By default, the RPC will wait for the block to be validated before answering. If ?async is true, the function returns immediately. Otherwise, the block will be validated before the result is returned. If ?force is true, it will be injected even on non strictly increasing fitness. An optional ?chain parameter can be used to specify whether to inject on the test chain or the main chain. */
        post: {
            parameters: {
                query?: {
                    async?: string;
                    force?: string;
                    /** @description A chain identifier. This is either a chain hash in Base58Check notation or a one the predefined aliases: 'main', 'test'. */
                    chain?: string;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": {
                        data: string;
                        operations: components["schemas"]["operation"][][];
                    };
                };
            };
            responses: {
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["unistring"];
                    };
                };
                default: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": unknown;
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/injection/operation": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** @description Inject an operation in node and broadcast it. Returns the ID of the operation. The `signedOperationContents` should be constructed using contextual RPCs from the latest block and signed by the client. The injection of the operation will apply it on the current mempool context. This context may change at each operation injection or operation reception from peers. By default, the RPC will wait for the operation to be (pre-)validated before returning. However, if ?async is true, the function returns immediately. The optional ?chain parameter can be used to specify whether to inject on the test chain or the main chain. */
        post: {
            parameters: {
                query?: {
                    async?: string;
                    /** @description A chain identifier. This is either a chain hash in Base58Check notation or a one the predefined aliases: 'main', 'test'. */
                    chain?: string;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": string;
                };
            };
            responses: {
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["unistring"];
                    };
                };
                default: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": unknown;
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/injection/protocol": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** @description Inject a protocol in node. Returns the ID of the protocol. If ?async is true, the function returns immediately. Otherwise, the protocol will be validated before the result is returned. */
        post: {
            parameters: {
                query?: {
                    async?: string;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": {
                        expected_env_version: components["schemas"]["protocol.environment_version"];
                        components: {
                            name: components["schemas"]["unistring"];
                            interface?: components["schemas"]["unistring"];
                            implementation: components["schemas"]["unistring"];
                        }[];
                    };
                };
            };
            responses: {
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["unistring"];
                    };
                };
                default: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": unknown;
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/monitor/active_chains": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Monitor every chain creation and destruction. Currently active chains will be given as first elements */
        get: {
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
                        "application/json": ({
                            chain_id: components["schemas"]["Chain_id"];
                        } | {
                            chain_id: components["schemas"]["Chain_id"];
                            test_protocol: components["schemas"]["Protocol_hash"];
                            expiration_date: components["schemas"]["timestamp.protocol"];
                        } | {
                            stopping: components["schemas"]["Chain_id"];
                        })[];
                    };
                };
                default: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": unknown;
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
    "/monitor/applied_blocks": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Monitor all blocks that are successfully applied and stored by the node, disregarding whether they were selected as the new head or not. */
        get: {
            parameters: {
                query?: {
                    /** @description Protocol_hash (Base58Check-encoded) */
                    protocol?: string;
                    /** @description Protocol_hash (Base58Check-encoded) */
                    next_protocol?: string;
                    /** @description A chain identifier. This is either a chain hash in Base58Check notation or a one the predefined aliases: 'main', 'test'. */
                    chain?: string;
                };
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
                        "application/json": {
                            chain_id: components["schemas"]["Chain_id"];
                            hash: components["schemas"]["block_hash"];
                            header: components["schemas"]["block_header"];
                            operations: components["schemas"]["operation"][][];
                        };
                    };
                };
                default: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": unknown;
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
    "/monitor/bootstrapped": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Wait for the node to have synchronized its chain with a few peers (configured by the node's administrator), streaming head updates that happen during the bootstrapping process, and closing the stream at the end. If the node was already bootstrapped, returns the current head immediately. */
        get: {
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
                        "application/json": {
                            block: components["schemas"]["block_hash"];
                            timestamp: components["schemas"]["timestamp.protocol"];
                        };
                    };
                };
                default: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": unknown;
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
    "/monitor/heads/{chain_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Monitor all blocks that are successfully validated and applied by the node and selected as the new head of the given chain. */
        get: {
            parameters: {
                query?: {
                    /** @description Protocol_hash (Base58Check-encoded) */
                    protocol?: string;
                    /** @description Protocol_hash (Base58Check-encoded) */
                    next_protocol?: string;
                };
                header?: never;
                path: {
                    /** @description A chain identifier. This is either a chain hash in Base58Check notation or a one the predefined aliases: 'main', 'test'. */
                    chain_id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            hash: components["schemas"]["block_hash"];
                            level: number;
                            proto: number;
                            predecessor: components["schemas"]["block_hash"];
                            timestamp: components["schemas"]["timestamp.protocol"];
                            validation_pass: number;
                            operations_hash: components["schemas"]["Operation_list_list_hash"];
                            fitness: components["schemas"]["fitness"];
                            context: components["schemas"]["Context_hash"];
                            protocol_data: string;
                        };
                    };
                };
                default: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": unknown;
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
    "/monitor/protocols": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Monitor all economic protocols that are retrieved and successfully loaded and compiled by the node. */
        get: {
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
                        "application/json": components["schemas"]["unistring"];
                    };
                };
                default: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": unknown;
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
    "/monitor/received_blocks/{chain_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Monitor all newly received blocks that are not yet known by the store. */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description A chain identifier. This is either a chain hash in Base58Check notation or a one the predefined aliases: 'main', 'test'. */
                    chain_id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            hash: components["schemas"]["block_hash"];
                        };
                    };
                };
                default: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": unknown;
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
    "/monitor/validated_blocks": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Monitor all blocks that were successfully validated by the node but are not applied nor stored yet, disregarding whether they are going to be selected as the new head or not. */
        get: {
            parameters: {
                query?: {
                    /** @description Protocol_hash (Base58Check-encoded) */
                    protocol?: string;
                    /** @description Protocol_hash (Base58Check-encoded) */
                    next_protocol?: string;
                    /** @description A chain identifier. This is either a chain hash in Base58Check notation or a one the predefined aliases: 'main', 'test'. */
                    chain?: string;
                };
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
                        "application/json": {
                            chain_id: components["schemas"]["Chain_id"];
                            hash: components["schemas"]["block_hash"];
                            header: components["schemas"]["block_header"];
                            operations: components["schemas"]["operation"][][];
                        };
                    };
                };
                default: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": unknown;
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
    "/network/connections": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description List the running P2P connection. */
        get: {
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
                        "application/json": {
                            incoming: boolean;
                            peer_id: components["schemas"]["Crypto_box.Public_key_hash"];
                            id_point: components["schemas"]["p2p_connection.id"];
                            remote_socket_port: number;
                            announced_version: components["schemas"]["network_version"];
                            private: boolean;
                            local_metadata: {
                                disable_mempool: boolean;
                                private_node: boolean;
                            };
                            remote_metadata: {
                                disable_mempool: boolean;
                                private_node: boolean;
                            };
                        }[];
                    };
                };
                default: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": unknown;
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
    "/network/connections/{peer_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Details about the current P2P connection to the given peer. */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description A cryptographic node identity (Base58Check-encoded) */
                    peer_id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            incoming: boolean;
                            peer_id: components["schemas"]["Crypto_box.Public_key_hash"];
                            id_point: components["schemas"]["p2p_connection.id"];
                            remote_socket_port: number;
                            announced_version: components["schemas"]["network_version"];
                            private: boolean;
                            local_metadata: {
                                disable_mempool: boolean;
                                private_node: boolean;
                            };
                            remote_metadata: {
                                disable_mempool: boolean;
                                private_node: boolean;
                            };
                        };
                    };
                };
                default: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": unknown;
                    };
                };
            };
        };
        put?: never;
        post?: never;
        /** @description Forced close of the current P2P connection to the given peer. */
        delete: {
            parameters: {
                query?: {
                    wait?: string;
                };
                header?: never;
                path: {
                    /** @description A cryptographic node identity (Base58Check-encoded) */
                    peer_id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": Record<string, never>;
                    };
                };
                default: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": unknown;
                    };
                };
            };
        };
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/network/full_stat": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Full network statistics. */
        get: {
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
                        "application/json": {
                            stat: components["schemas"]["p2p_stat"];
                            incoming_connections: {
                                incoming: boolean;
                                peer_id: components["schemas"]["Crypto_box.Public_key_hash"];
                                id_point: components["schemas"]["p2p_connection.id"];
                                remote_socket_port: number;
                                announced_version: components["schemas"]["network_version"];
                                private: boolean;
                                local_metadata: {
                                    disable_mempool: boolean;
                                    private_node: boolean;
                                };
                                remote_metadata: {
                                    disable_mempool: boolean;
                                    private_node: boolean;
                                };
                            }[];
                            outgoing_connections: {
                                incoming: boolean;
                                peer_id: components["schemas"]["Crypto_box.Public_key_hash"];
                                id_point: components["schemas"]["p2p_connection.id"];
                                remote_socket_port: number;
                                announced_version: components["schemas"]["network_version"];
                                private: boolean;
                                local_metadata: {
                                    disable_mempool: boolean;
                                    private_node: boolean;
                                };
                                remote_metadata: {
                                    disable_mempool: boolean;
                                    private_node: boolean;
                                };
                            }[];
                            peers: (components["schemas"]["Crypto_box.Public_key_hash"] | {
                                score: number;
                                trusted: boolean;
                                conn_metadata?: {
                                    disable_mempool: boolean;
                                    private_node: boolean;
                                };
                                peer_metadata: {
                                    responses: {
                                        sent: {
                                            branch: components["schemas"]["bignum"];
                                            head: components["schemas"]["bignum"];
                                            block_header: components["schemas"]["bignum"];
                                            operations: components["schemas"]["bignum"];
                                            protocols: components["schemas"]["bignum"];
                                            operation_hashes_for_block: components["schemas"]["bignum"];
                                            operations_for_block: components["schemas"]["bignum"];
                                            checkpoint: components["schemas"]["bignum"];
                                            protocol_branch: components["schemas"]["bignum"];
                                            predecessor_header: components["schemas"]["bignum"];
                                            other: components["schemas"]["bignum"];
                                        } | {
                                            branch: components["schemas"]["bignum"];
                                            head: components["schemas"]["bignum"];
                                            block_header: components["schemas"]["bignum"];
                                            operations: components["schemas"]["bignum"];
                                            protocols: components["schemas"]["bignum"];
                                            operation_hashes_for_block: components["schemas"]["bignum"];
                                            operations_for_block: components["schemas"]["bignum"];
                                            other: components["schemas"]["bignum"];
                                        };
                                        failed: {
                                            branch: components["schemas"]["bignum"];
                                            head: components["schemas"]["bignum"];
                                            block_header: components["schemas"]["bignum"];
                                            operations: components["schemas"]["bignum"];
                                            protocols: components["schemas"]["bignum"];
                                            operation_hashes_for_block: components["schemas"]["bignum"];
                                            operations_for_block: components["schemas"]["bignum"];
                                            checkpoint: components["schemas"]["bignum"];
                                            protocol_branch: components["schemas"]["bignum"];
                                            predecessor_header: components["schemas"]["bignum"];
                                            other: components["schemas"]["bignum"];
                                        } | {
                                            branch: components["schemas"]["bignum"];
                                            head: components["schemas"]["bignum"];
                                            block_header: components["schemas"]["bignum"];
                                            operations: components["schemas"]["bignum"];
                                            protocols: components["schemas"]["bignum"];
                                            operation_hashes_for_block: components["schemas"]["bignum"];
                                            operations_for_block: components["schemas"]["bignum"];
                                            other: components["schemas"]["bignum"];
                                        };
                                        received: {
                                            branch: components["schemas"]["bignum"];
                                            head: components["schemas"]["bignum"];
                                            block_header: components["schemas"]["bignum"];
                                            operations: components["schemas"]["bignum"];
                                            protocols: components["schemas"]["bignum"];
                                            operation_hashes_for_block: components["schemas"]["bignum"];
                                            operations_for_block: components["schemas"]["bignum"];
                                            checkpoint: components["schemas"]["bignum"];
                                            protocol_branch: components["schemas"]["bignum"];
                                            predecessor_header: components["schemas"]["bignum"];
                                            other: components["schemas"]["bignum"];
                                        } | {
                                            branch: components["schemas"]["bignum"];
                                            head: components["schemas"]["bignum"];
                                            block_header: components["schemas"]["bignum"];
                                            operations: components["schemas"]["bignum"];
                                            protocols: components["schemas"]["bignum"];
                                            operation_hashes_for_block: components["schemas"]["bignum"];
                                            operations_for_block: components["schemas"]["bignum"];
                                            other: components["schemas"]["bignum"];
                                        };
                                        unexpected: components["schemas"]["bignum"];
                                        outdated: components["schemas"]["bignum"];
                                    };
                                    requests: {
                                        sent: {
                                            branch: components["schemas"]["bignum"];
                                            head: components["schemas"]["bignum"];
                                            block_header: components["schemas"]["bignum"];
                                            operations: components["schemas"]["bignum"];
                                            protocols: components["schemas"]["bignum"];
                                            operation_hashes_for_block: components["schemas"]["bignum"];
                                            operations_for_block: components["schemas"]["bignum"];
                                            checkpoint: components["schemas"]["bignum"];
                                            protocol_branch: components["schemas"]["bignum"];
                                            predecessor_header: components["schemas"]["bignum"];
                                            other: components["schemas"]["bignum"];
                                        } | {
                                            branch: components["schemas"]["bignum"];
                                            head: components["schemas"]["bignum"];
                                            block_header: components["schemas"]["bignum"];
                                            operations: components["schemas"]["bignum"];
                                            protocols: components["schemas"]["bignum"];
                                            operation_hashes_for_block: components["schemas"]["bignum"];
                                            operations_for_block: components["schemas"]["bignum"];
                                            other: components["schemas"]["bignum"];
                                        };
                                        received: {
                                            branch: components["schemas"]["bignum"];
                                            head: components["schemas"]["bignum"];
                                            block_header: components["schemas"]["bignum"];
                                            operations: components["schemas"]["bignum"];
                                            protocols: components["schemas"]["bignum"];
                                            operation_hashes_for_block: components["schemas"]["bignum"];
                                            operations_for_block: components["schemas"]["bignum"];
                                            checkpoint: components["schemas"]["bignum"];
                                            protocol_branch: components["schemas"]["bignum"];
                                            predecessor_header: components["schemas"]["bignum"];
                                            other: components["schemas"]["bignum"];
                                        } | {
                                            branch: components["schemas"]["bignum"];
                                            head: components["schemas"]["bignum"];
                                            block_header: components["schemas"]["bignum"];
                                            operations: components["schemas"]["bignum"];
                                            protocols: components["schemas"]["bignum"];
                                            operation_hashes_for_block: components["schemas"]["bignum"];
                                            operations_for_block: components["schemas"]["bignum"];
                                            other: components["schemas"]["bignum"];
                                        };
                                        failed: {
                                            branch: components["schemas"]["bignum"];
                                            head: components["schemas"]["bignum"];
                                            block_header: components["schemas"]["bignum"];
                                            operations: components["schemas"]["bignum"];
                                            protocols: components["schemas"]["bignum"];
                                            operation_hashes_for_block: components["schemas"]["bignum"];
                                            operations_for_block: components["schemas"]["bignum"];
                                            checkpoint: components["schemas"]["bignum"];
                                            protocol_branch: components["schemas"]["bignum"];
                                            predecessor_header: components["schemas"]["bignum"];
                                            other: components["schemas"]["bignum"];
                                        } | {
                                            branch: components["schemas"]["bignum"];
                                            head: components["schemas"]["bignum"];
                                            block_header: components["schemas"]["bignum"];
                                            operations: components["schemas"]["bignum"];
                                            protocols: components["schemas"]["bignum"];
                                            operation_hashes_for_block: components["schemas"]["bignum"];
                                            operations_for_block: components["schemas"]["bignum"];
                                            other: components["schemas"]["bignum"];
                                        };
                                        scheduled: {
                                            branch: components["schemas"]["bignum"];
                                            head: components["schemas"]["bignum"];
                                            block_header: components["schemas"]["bignum"];
                                            operations: components["schemas"]["bignum"];
                                            protocols: components["schemas"]["bignum"];
                                            operation_hashes_for_block: components["schemas"]["bignum"];
                                            operations_for_block: components["schemas"]["bignum"];
                                            checkpoint: components["schemas"]["bignum"];
                                            protocol_branch: components["schemas"]["bignum"];
                                            predecessor_header: components["schemas"]["bignum"];
                                            other: components["schemas"]["bignum"];
                                        } | {
                                            branch: components["schemas"]["bignum"];
                                            head: components["schemas"]["bignum"];
                                            block_header: components["schemas"]["bignum"];
                                            operations: components["schemas"]["bignum"];
                                            protocols: components["schemas"]["bignum"];
                                            operation_hashes_for_block: components["schemas"]["bignum"];
                                            operations_for_block: components["schemas"]["bignum"];
                                            other: components["schemas"]["bignum"];
                                        };
                                    };
                                    valid_blocks: components["schemas"]["bignum"];
                                    old_heads: components["schemas"]["bignum"];
                                    prevalidator_results: {
                                        cannot_download: components["schemas"]["bignum"];
                                        cannot_parse: components["schemas"]["bignum"];
                                        refused_by_prefilter: components["schemas"]["bignum"];
                                        refused_by_postfilter: components["schemas"]["bignum"];
                                        applied: components["schemas"]["bignum"];
                                        branch_delayed: components["schemas"]["bignum"];
                                        branch_refused: components["schemas"]["bignum"];
                                        refused: components["schemas"]["bignum"];
                                        duplicate: components["schemas"]["bignum"];
                                        outdated: components["schemas"]["bignum"];
                                    };
                                    unactivated_chains: components["schemas"]["bignum"];
                                    inactive_chains: components["schemas"]["bignum"];
                                    future_blocks_advertised: components["schemas"]["bignum"];
                                    unadvertised: {
                                        block: components["schemas"]["bignum"];
                                        operations: components["schemas"]["bignum"];
                                        protocol: components["schemas"]["bignum"];
                                    };
                                    advertisements: {
                                        sent: {
                                            head: components["schemas"]["bignum"];
                                            branch: components["schemas"]["bignum"];
                                        };
                                        received: {
                                            head: components["schemas"]["bignum"];
                                            branch: components["schemas"]["bignum"];
                                        };
                                    };
                                };
                                state: components["schemas"]["p2p_peer.state"];
                                reachable_at?: components["schemas"]["p2p_connection.id"];
                                stat: components["schemas"]["p2p_stat"];
                                last_failed_connection?: (components["schemas"]["p2p_connection.id"] | components["schemas"]["timestamp.system"])[];
                                last_rejected_connection?: (components["schemas"]["p2p_connection.id"] | components["schemas"]["timestamp.system"])[];
                                last_established_connection?: (components["schemas"]["p2p_connection.id"] | components["schemas"]["timestamp.system"])[];
                                last_disconnection?: (components["schemas"]["p2p_connection.id"] | components["schemas"]["timestamp.system"])[];
                                last_seen?: (components["schemas"]["p2p_connection.id"] | components["schemas"]["timestamp.system"])[];
                                last_miss?: (components["schemas"]["p2p_connection.id"] | components["schemas"]["timestamp.system"])[];
                            })[][];
                            points: (components["schemas"]["p2p_point.id"] | components["schemas"]["p2p_point.info"])[][];
                        };
                    };
                };
                default: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": unknown;
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
    "/network/greylist": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /** @description Clear all greylists tables. This will unban all addresses and peers automatically greylisted by the system. */
        delete: {
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
                        "application/json": Record<string, never>;
                    };
                };
                default: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": unknown;
                    };
                };
            };
        };
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/network/greylist/ips": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * @description Returns an object that contains a list of IP and the field "not_reliable_since".
         *                If the field "not_reliable_since" is None then the list contains the currently greylisted IP addresses.
         *                If the field "not_reliable_since" Contains a date, this means that the greylist has been overflowed and it is no more possible to obtain the exact list of greylisted IPs. Since the greylist of IP addresses has been design to work whatever his size, there is no security issue related to this overflow.
         *               Reinitialize the ACL structure by calling "delete /network/greylist" to get back this list reliable.
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
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            ips: components["schemas"]["p2p_address"][];
                            not_reliable_since: components["schemas"]["timestamp.system"] | null;
                        };
                    };
                };
                default: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": unknown;
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
    "/network/greylist/peers": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description List of the last greylisted peers. */
        get: {
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
                        "application/json": components["schemas"]["Crypto_box.Public_key_hash"][];
                    };
                };
                default: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": unknown;
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
    "/network/log": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Stream of all network events */
        get: {
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
                        "application/json": {
                            /** @enum {string} */
                            event: "too_few_connections";
                        } | {
                            /** @enum {string} */
                            event: "too_many_connections";
                        } | {
                            /** @enum {string} */
                            event: "new_point";
                            point: components["schemas"]["p2p_point.id"];
                        } | {
                            /** @enum {string} */
                            event: "new_peer";
                            peer_id: components["schemas"]["Crypto_box.Public_key_hash"];
                        } | {
                            /** @enum {string} */
                            event: "incoming_connection";
                            point: components["schemas"]["p2p_point.id"];
                        } | {
                            /** @enum {string} */
                            event: "outgoing_connection";
                            point: components["schemas"]["p2p_point.id"];
                        } | {
                            /** @enum {string} */
                            event: "authentication_failed";
                            point: components["schemas"]["p2p_point.id"];
                        } | {
                            /** @enum {string} */
                            event: "accepting_request";
                            point: components["schemas"]["p2p_point.id"];
                            id_point: components["schemas"]["p2p_connection.id"];
                            peer_id: components["schemas"]["Crypto_box.Public_key_hash"];
                        } | {
                            /** @enum {string} */
                            event: "rejecting_request";
                            point: components["schemas"]["p2p_point.id"];
                            id_point: components["schemas"]["p2p_connection.id"];
                            peer_id: components["schemas"]["Crypto_box.Public_key_hash"];
                        } | {
                            /** @enum {string} */
                            event: "request_rejected";
                            point: components["schemas"]["p2p_point.id"];
                            identity?: (components["schemas"]["p2p_connection.id"] | components["schemas"]["Crypto_box.Public_key_hash"])[];
                        } | {
                            /** @enum {string} */
                            event: "connection_established";
                            id_point: components["schemas"]["p2p_connection.id"];
                            peer_id: components["schemas"]["Crypto_box.Public_key_hash"];
                        } | {
                            /** @enum {string} */
                            event: "disconnection";
                            peer_id: components["schemas"]["Crypto_box.Public_key_hash"];
                        } | {
                            /** @enum {string} */
                            event: "external_disconnection";
                            peer_id: components["schemas"]["Crypto_box.Public_key_hash"];
                        } | {
                            /** @enum {string} */
                            event: "gc_points";
                        } | {
                            /** @enum {string} */
                            event: "gc_peer_ids";
                        } | {
                            /** @enum {string} */
                            event: "swap_request_received";
                            source: components["schemas"]["Crypto_box.Public_key_hash"];
                        } | {
                            /** @enum {string} */
                            event: "swap_ack_received";
                            source: components["schemas"]["Crypto_box.Public_key_hash"];
                        } | {
                            /** @enum {string} */
                            event: "swap_request_sent";
                            source: components["schemas"]["Crypto_box.Public_key_hash"];
                        } | {
                            /** @enum {string} */
                            event: "swap_ack_sent";
                            source: components["schemas"]["Crypto_box.Public_key_hash"];
                        } | {
                            /** @enum {string} */
                            event: "swap_request_ignored";
                            source: components["schemas"]["Crypto_box.Public_key_hash"];
                        } | {
                            /** @enum {string} */
                            event: "swap_success";
                            source: components["schemas"]["Crypto_box.Public_key_hash"];
                        } | {
                            /** @enum {string} */
                            event: "swap_failure";
                            source: components["schemas"]["Crypto_box.Public_key_hash"];
                        } | {
                            /** @enum {string} */
                            event: "bootstrap_sent";
                            source: components["schemas"]["Crypto_box.Public_key_hash"];
                        } | {
                            /** @enum {string} */
                            event: "bootstrap_received";
                            source: components["schemas"]["Crypto_box.Public_key_hash"];
                        } | {
                            /** @enum {string} */
                            event: "advertise_sent";
                            source: components["schemas"]["Crypto_box.Public_key_hash"];
                        } | {
                            /** @enum {string} */
                            event: "advertise_received";
                            source: components["schemas"]["Crypto_box.Public_key_hash"];
                        };
                    };
                };
                default: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": unknown;
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
    "/network/peers": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description List the peers the node ever met. */
        get: {
            parameters: {
                query?: {
                    filter?: string;
                };
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
                        "application/json": (components["schemas"]["Crypto_box.Public_key_hash"] | {
                            score: number;
                            trusted: boolean;
                            conn_metadata?: {
                                disable_mempool: boolean;
                                private_node: boolean;
                            };
                            peer_metadata: {
                                responses: {
                                    sent: {
                                        branch: components["schemas"]["bignum"];
                                        head: components["schemas"]["bignum"];
                                        block_header: components["schemas"]["bignum"];
                                        operations: components["schemas"]["bignum"];
                                        protocols: components["schemas"]["bignum"];
                                        operation_hashes_for_block: components["schemas"]["bignum"];
                                        operations_for_block: components["schemas"]["bignum"];
                                        checkpoint: components["schemas"]["bignum"];
                                        protocol_branch: components["schemas"]["bignum"];
                                        predecessor_header: components["schemas"]["bignum"];
                                        other: components["schemas"]["bignum"];
                                    } | {
                                        branch: components["schemas"]["bignum"];
                                        head: components["schemas"]["bignum"];
                                        block_header: components["schemas"]["bignum"];
                                        operations: components["schemas"]["bignum"];
                                        protocols: components["schemas"]["bignum"];
                                        operation_hashes_for_block: components["schemas"]["bignum"];
                                        operations_for_block: components["schemas"]["bignum"];
                                        other: components["schemas"]["bignum"];
                                    };
                                    failed: {
                                        branch: components["schemas"]["bignum"];
                                        head: components["schemas"]["bignum"];
                                        block_header: components["schemas"]["bignum"];
                                        operations: components["schemas"]["bignum"];
                                        protocols: components["schemas"]["bignum"];
                                        operation_hashes_for_block: components["schemas"]["bignum"];
                                        operations_for_block: components["schemas"]["bignum"];
                                        checkpoint: components["schemas"]["bignum"];
                                        protocol_branch: components["schemas"]["bignum"];
                                        predecessor_header: components["schemas"]["bignum"];
                                        other: components["schemas"]["bignum"];
                                    } | {
                                        branch: components["schemas"]["bignum"];
                                        head: components["schemas"]["bignum"];
                                        block_header: components["schemas"]["bignum"];
                                        operations: components["schemas"]["bignum"];
                                        protocols: components["schemas"]["bignum"];
                                        operation_hashes_for_block: components["schemas"]["bignum"];
                                        operations_for_block: components["schemas"]["bignum"];
                                        other: components["schemas"]["bignum"];
                                    };
                                    received: {
                                        branch: components["schemas"]["bignum"];
                                        head: components["schemas"]["bignum"];
                                        block_header: components["schemas"]["bignum"];
                                        operations: components["schemas"]["bignum"];
                                        protocols: components["schemas"]["bignum"];
                                        operation_hashes_for_block: components["schemas"]["bignum"];
                                        operations_for_block: components["schemas"]["bignum"];
                                        checkpoint: components["schemas"]["bignum"];
                                        protocol_branch: components["schemas"]["bignum"];
                                        predecessor_header: components["schemas"]["bignum"];
                                        other: components["schemas"]["bignum"];
                                    } | {
                                        branch: components["schemas"]["bignum"];
                                        head: components["schemas"]["bignum"];
                                        block_header: components["schemas"]["bignum"];
                                        operations: components["schemas"]["bignum"];
                                        protocols: components["schemas"]["bignum"];
                                        operation_hashes_for_block: components["schemas"]["bignum"];
                                        operations_for_block: components["schemas"]["bignum"];
                                        other: components["schemas"]["bignum"];
                                    };
                                    unexpected: components["schemas"]["bignum"];
                                    outdated: components["schemas"]["bignum"];
                                };
                                requests: {
                                    sent: {
                                        branch: components["schemas"]["bignum"];
                                        head: components["schemas"]["bignum"];
                                        block_header: components["schemas"]["bignum"];
                                        operations: components["schemas"]["bignum"];
                                        protocols: components["schemas"]["bignum"];
                                        operation_hashes_for_block: components["schemas"]["bignum"];
                                        operations_for_block: components["schemas"]["bignum"];
                                        checkpoint: components["schemas"]["bignum"];
                                        protocol_branch: components["schemas"]["bignum"];
                                        predecessor_header: components["schemas"]["bignum"];
                                        other: components["schemas"]["bignum"];
                                    } | {
                                        branch: components["schemas"]["bignum"];
                                        head: components["schemas"]["bignum"];
                                        block_header: components["schemas"]["bignum"];
                                        operations: components["schemas"]["bignum"];
                                        protocols: components["schemas"]["bignum"];
                                        operation_hashes_for_block: components["schemas"]["bignum"];
                                        operations_for_block: components["schemas"]["bignum"];
                                        other: components["schemas"]["bignum"];
                                    };
                                    received: {
                                        branch: components["schemas"]["bignum"];
                                        head: components["schemas"]["bignum"];
                                        block_header: components["schemas"]["bignum"];
                                        operations: components["schemas"]["bignum"];
                                        protocols: components["schemas"]["bignum"];
                                        operation_hashes_for_block: components["schemas"]["bignum"];
                                        operations_for_block: components["schemas"]["bignum"];
                                        checkpoint: components["schemas"]["bignum"];
                                        protocol_branch: components["schemas"]["bignum"];
                                        predecessor_header: components["schemas"]["bignum"];
                                        other: components["schemas"]["bignum"];
                                    } | {
                                        branch: components["schemas"]["bignum"];
                                        head: components["schemas"]["bignum"];
                                        block_header: components["schemas"]["bignum"];
                                        operations: components["schemas"]["bignum"];
                                        protocols: components["schemas"]["bignum"];
                                        operation_hashes_for_block: components["schemas"]["bignum"];
                                        operations_for_block: components["schemas"]["bignum"];
                                        other: components["schemas"]["bignum"];
                                    };
                                    failed: {
                                        branch: components["schemas"]["bignum"];
                                        head: components["schemas"]["bignum"];
                                        block_header: components["schemas"]["bignum"];
                                        operations: components["schemas"]["bignum"];
                                        protocols: components["schemas"]["bignum"];
                                        operation_hashes_for_block: components["schemas"]["bignum"];
                                        operations_for_block: components["schemas"]["bignum"];
                                        checkpoint: components["schemas"]["bignum"];
                                        protocol_branch: components["schemas"]["bignum"];
                                        predecessor_header: components["schemas"]["bignum"];
                                        other: components["schemas"]["bignum"];
                                    } | {
                                        branch: components["schemas"]["bignum"];
                                        head: components["schemas"]["bignum"];
                                        block_header: components["schemas"]["bignum"];
                                        operations: components["schemas"]["bignum"];
                                        protocols: components["schemas"]["bignum"];
                                        operation_hashes_for_block: components["schemas"]["bignum"];
                                        operations_for_block: components["schemas"]["bignum"];
                                        other: components["schemas"]["bignum"];
                                    };
                                    scheduled: {
                                        branch: components["schemas"]["bignum"];
                                        head: components["schemas"]["bignum"];
                                        block_header: components["schemas"]["bignum"];
                                        operations: components["schemas"]["bignum"];
                                        protocols: components["schemas"]["bignum"];
                                        operation_hashes_for_block: components["schemas"]["bignum"];
                                        operations_for_block: components["schemas"]["bignum"];
                                        checkpoint: components["schemas"]["bignum"];
                                        protocol_branch: components["schemas"]["bignum"];
                                        predecessor_header: components["schemas"]["bignum"];
                                        other: components["schemas"]["bignum"];
                                    } | {
                                        branch: components["schemas"]["bignum"];
                                        head: components["schemas"]["bignum"];
                                        block_header: components["schemas"]["bignum"];
                                        operations: components["schemas"]["bignum"];
                                        protocols: components["schemas"]["bignum"];
                                        operation_hashes_for_block: components["schemas"]["bignum"];
                                        operations_for_block: components["schemas"]["bignum"];
                                        other: components["schemas"]["bignum"];
                                    };
                                };
                                valid_blocks: components["schemas"]["bignum"];
                                old_heads: components["schemas"]["bignum"];
                                prevalidator_results: {
                                    cannot_download: components["schemas"]["bignum"];
                                    cannot_parse: components["schemas"]["bignum"];
                                    refused_by_prefilter: components["schemas"]["bignum"];
                                    refused_by_postfilter: components["schemas"]["bignum"];
                                    applied: components["schemas"]["bignum"];
                                    branch_delayed: components["schemas"]["bignum"];
                                    branch_refused: components["schemas"]["bignum"];
                                    refused: components["schemas"]["bignum"];
                                    duplicate: components["schemas"]["bignum"];
                                    outdated: components["schemas"]["bignum"];
                                };
                                unactivated_chains: components["schemas"]["bignum"];
                                inactive_chains: components["schemas"]["bignum"];
                                future_blocks_advertised: components["schemas"]["bignum"];
                                unadvertised: {
                                    block: components["schemas"]["bignum"];
                                    operations: components["schemas"]["bignum"];
                                    protocol: components["schemas"]["bignum"];
                                };
                                advertisements: {
                                    sent: {
                                        head: components["schemas"]["bignum"];
                                        branch: components["schemas"]["bignum"];
                                    };
                                    received: {
                                        head: components["schemas"]["bignum"];
                                        branch: components["schemas"]["bignum"];
                                    };
                                };
                            };
                            state: components["schemas"]["p2p_peer.state"];
                            reachable_at?: components["schemas"]["p2p_connection.id"];
                            stat: components["schemas"]["p2p_stat"];
                            last_failed_connection?: (components["schemas"]["p2p_connection.id"] | components["schemas"]["timestamp.system"])[];
                            last_rejected_connection?: (components["schemas"]["p2p_connection.id"] | components["schemas"]["timestamp.system"])[];
                            last_established_connection?: (components["schemas"]["p2p_connection.id"] | components["schemas"]["timestamp.system"])[];
                            last_disconnection?: (components["schemas"]["p2p_connection.id"] | components["schemas"]["timestamp.system"])[];
                            last_seen?: (components["schemas"]["p2p_connection.id"] | components["schemas"]["timestamp.system"])[];
                            last_miss?: (components["schemas"]["p2p_connection.id"] | components["schemas"]["timestamp.system"])[];
                        })[][];
                    };
                };
                default: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": unknown;
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
    "/network/peers/{peer_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Details about a given peer. */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description A cryptographic node identity (Base58Check-encoded) */
                    peer_id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            score: number;
                            trusted: boolean;
                            conn_metadata?: {
                                disable_mempool: boolean;
                                private_node: boolean;
                            };
                            peer_metadata: {
                                responses: {
                                    sent: {
                                        branch: components["schemas"]["bignum"];
                                        head: components["schemas"]["bignum"];
                                        block_header: components["schemas"]["bignum"];
                                        operations: components["schemas"]["bignum"];
                                        protocols: components["schemas"]["bignum"];
                                        operation_hashes_for_block: components["schemas"]["bignum"];
                                        operations_for_block: components["schemas"]["bignum"];
                                        checkpoint: components["schemas"]["bignum"];
                                        protocol_branch: components["schemas"]["bignum"];
                                        predecessor_header: components["schemas"]["bignum"];
                                        other: components["schemas"]["bignum"];
                                    } | {
                                        branch: components["schemas"]["bignum"];
                                        head: components["schemas"]["bignum"];
                                        block_header: components["schemas"]["bignum"];
                                        operations: components["schemas"]["bignum"];
                                        protocols: components["schemas"]["bignum"];
                                        operation_hashes_for_block: components["schemas"]["bignum"];
                                        operations_for_block: components["schemas"]["bignum"];
                                        other: components["schemas"]["bignum"];
                                    };
                                    failed: {
                                        branch: components["schemas"]["bignum"];
                                        head: components["schemas"]["bignum"];
                                        block_header: components["schemas"]["bignum"];
                                        operations: components["schemas"]["bignum"];
                                        protocols: components["schemas"]["bignum"];
                                        operation_hashes_for_block: components["schemas"]["bignum"];
                                        operations_for_block: components["schemas"]["bignum"];
                                        checkpoint: components["schemas"]["bignum"];
                                        protocol_branch: components["schemas"]["bignum"];
                                        predecessor_header: components["schemas"]["bignum"];
                                        other: components["schemas"]["bignum"];
                                    } | {
                                        branch: components["schemas"]["bignum"];
                                        head: components["schemas"]["bignum"];
                                        block_header: components["schemas"]["bignum"];
                                        operations: components["schemas"]["bignum"];
                                        protocols: components["schemas"]["bignum"];
                                        operation_hashes_for_block: components["schemas"]["bignum"];
                                        operations_for_block: components["schemas"]["bignum"];
                                        other: components["schemas"]["bignum"];
                                    };
                                    received: {
                                        branch: components["schemas"]["bignum"];
                                        head: components["schemas"]["bignum"];
                                        block_header: components["schemas"]["bignum"];
                                        operations: components["schemas"]["bignum"];
                                        protocols: components["schemas"]["bignum"];
                                        operation_hashes_for_block: components["schemas"]["bignum"];
                                        operations_for_block: components["schemas"]["bignum"];
                                        checkpoint: components["schemas"]["bignum"];
                                        protocol_branch: components["schemas"]["bignum"];
                                        predecessor_header: components["schemas"]["bignum"];
                                        other: components["schemas"]["bignum"];
                                    } | {
                                        branch: components["schemas"]["bignum"];
                                        head: components["schemas"]["bignum"];
                                        block_header: components["schemas"]["bignum"];
                                        operations: components["schemas"]["bignum"];
                                        protocols: components["schemas"]["bignum"];
                                        operation_hashes_for_block: components["schemas"]["bignum"];
                                        operations_for_block: components["schemas"]["bignum"];
                                        other: components["schemas"]["bignum"];
                                    };
                                    unexpected: components["schemas"]["bignum"];
                                    outdated: components["schemas"]["bignum"];
                                };
                                requests: {
                                    sent: {
                                        branch: components["schemas"]["bignum"];
                                        head: components["schemas"]["bignum"];
                                        block_header: components["schemas"]["bignum"];
                                        operations: components["schemas"]["bignum"];
                                        protocols: components["schemas"]["bignum"];
                                        operation_hashes_for_block: components["schemas"]["bignum"];
                                        operations_for_block: components["schemas"]["bignum"];
                                        checkpoint: components["schemas"]["bignum"];
                                        protocol_branch: components["schemas"]["bignum"];
                                        predecessor_header: components["schemas"]["bignum"];
                                        other: components["schemas"]["bignum"];
                                    } | {
                                        branch: components["schemas"]["bignum"];
                                        head: components["schemas"]["bignum"];
                                        block_header: components["schemas"]["bignum"];
                                        operations: components["schemas"]["bignum"];
                                        protocols: components["schemas"]["bignum"];
                                        operation_hashes_for_block: components["schemas"]["bignum"];
                                        operations_for_block: components["schemas"]["bignum"];
                                        other: components["schemas"]["bignum"];
                                    };
                                    received: {
                                        branch: components["schemas"]["bignum"];
                                        head: components["schemas"]["bignum"];
                                        block_header: components["schemas"]["bignum"];
                                        operations: components["schemas"]["bignum"];
                                        protocols: components["schemas"]["bignum"];
                                        operation_hashes_for_block: components["schemas"]["bignum"];
                                        operations_for_block: components["schemas"]["bignum"];
                                        checkpoint: components["schemas"]["bignum"];
                                        protocol_branch: components["schemas"]["bignum"];
                                        predecessor_header: components["schemas"]["bignum"];
                                        other: components["schemas"]["bignum"];
                                    } | {
                                        branch: components["schemas"]["bignum"];
                                        head: components["schemas"]["bignum"];
                                        block_header: components["schemas"]["bignum"];
                                        operations: components["schemas"]["bignum"];
                                        protocols: components["schemas"]["bignum"];
                                        operation_hashes_for_block: components["schemas"]["bignum"];
                                        operations_for_block: components["schemas"]["bignum"];
                                        other: components["schemas"]["bignum"];
                                    };
                                    failed: {
                                        branch: components["schemas"]["bignum"];
                                        head: components["schemas"]["bignum"];
                                        block_header: components["schemas"]["bignum"];
                                        operations: components["schemas"]["bignum"];
                                        protocols: components["schemas"]["bignum"];
                                        operation_hashes_for_block: components["schemas"]["bignum"];
                                        operations_for_block: components["schemas"]["bignum"];
                                        checkpoint: components["schemas"]["bignum"];
                                        protocol_branch: components["schemas"]["bignum"];
                                        predecessor_header: components["schemas"]["bignum"];
                                        other: components["schemas"]["bignum"];
                                    } | {
                                        branch: components["schemas"]["bignum"];
                                        head: components["schemas"]["bignum"];
                                        block_header: components["schemas"]["bignum"];
                                        operations: components["schemas"]["bignum"];
                                        protocols: components["schemas"]["bignum"];
                                        operation_hashes_for_block: components["schemas"]["bignum"];
                                        operations_for_block: components["schemas"]["bignum"];
                                        other: components["schemas"]["bignum"];
                                    };
                                    scheduled: {
                                        branch: components["schemas"]["bignum"];
                                        head: components["schemas"]["bignum"];
                                        block_header: components["schemas"]["bignum"];
                                        operations: components["schemas"]["bignum"];
                                        protocols: components["schemas"]["bignum"];
                                        operation_hashes_for_block: components["schemas"]["bignum"];
                                        operations_for_block: components["schemas"]["bignum"];
                                        checkpoint: components["schemas"]["bignum"];
                                        protocol_branch: components["schemas"]["bignum"];
                                        predecessor_header: components["schemas"]["bignum"];
                                        other: components["schemas"]["bignum"];
                                    } | {
                                        branch: components["schemas"]["bignum"];
                                        head: components["schemas"]["bignum"];
                                        block_header: components["schemas"]["bignum"];
                                        operations: components["schemas"]["bignum"];
                                        protocols: components["schemas"]["bignum"];
                                        operation_hashes_for_block: components["schemas"]["bignum"];
                                        operations_for_block: components["schemas"]["bignum"];
                                        other: components["schemas"]["bignum"];
                                    };
                                };
                                valid_blocks: components["schemas"]["bignum"];
                                old_heads: components["schemas"]["bignum"];
                                prevalidator_results: {
                                    cannot_download: components["schemas"]["bignum"];
                                    cannot_parse: components["schemas"]["bignum"];
                                    refused_by_prefilter: components["schemas"]["bignum"];
                                    refused_by_postfilter: components["schemas"]["bignum"];
                                    applied: components["schemas"]["bignum"];
                                    branch_delayed: components["schemas"]["bignum"];
                                    branch_refused: components["schemas"]["bignum"];
                                    refused: components["schemas"]["bignum"];
                                    duplicate: components["schemas"]["bignum"];
                                    outdated: components["schemas"]["bignum"];
                                };
                                unactivated_chains: components["schemas"]["bignum"];
                                inactive_chains: components["schemas"]["bignum"];
                                future_blocks_advertised: components["schemas"]["bignum"];
                                unadvertised: {
                                    block: components["schemas"]["bignum"];
                                    operations: components["schemas"]["bignum"];
                                    protocol: components["schemas"]["bignum"];
                                };
                                advertisements: {
                                    sent: {
                                        head: components["schemas"]["bignum"];
                                        branch: components["schemas"]["bignum"];
                                    };
                                    received: {
                                        head: components["schemas"]["bignum"];
                                        branch: components["schemas"]["bignum"];
                                    };
                                };
                            };
                            state: components["schemas"]["p2p_peer.state"];
                            reachable_at?: components["schemas"]["p2p_connection.id"];
                            stat: components["schemas"]["p2p_stat"];
                            last_failed_connection?: (components["schemas"]["p2p_connection.id"] | components["schemas"]["timestamp.system"])[];
                            last_rejected_connection?: (components["schemas"]["p2p_connection.id"] | components["schemas"]["timestamp.system"])[];
                            last_established_connection?: (components["schemas"]["p2p_connection.id"] | components["schemas"]["timestamp.system"])[];
                            last_disconnection?: (components["schemas"]["p2p_connection.id"] | components["schemas"]["timestamp.system"])[];
                            last_seen?: (components["schemas"]["p2p_connection.id"] | components["schemas"]["timestamp.system"])[];
                            last_miss?: (components["schemas"]["p2p_connection.id"] | components["schemas"]["timestamp.system"])[];
                        };
                    };
                };
                default: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": unknown;
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /** @description Change the permissions of a given peer. With `{acl: ban}`: blacklist the given peer and remove it from the whitelist if present. With `{acl: open}`: removes the peer from the blacklist and whitelist. With `{acl: trust}`: trust the given peer permanently and remove it from the blacklist if present. The peer cannot be blocked (but its host IP still can). */
        patch: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description A cryptographic node identity (Base58Check-encoded) */
                    peer_id: string;
                };
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": {
                        /** @enum {string} */
                        acl?: "open" | "trust" | "ban";
                    };
                };
            };
            responses: {
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            score: number;
                            trusted: boolean;
                            conn_metadata?: {
                                disable_mempool: boolean;
                                private_node: boolean;
                            };
                            peer_metadata: {
                                responses: {
                                    sent: {
                                        branch: components["schemas"]["bignum"];
                                        head: components["schemas"]["bignum"];
                                        block_header: components["schemas"]["bignum"];
                                        operations: components["schemas"]["bignum"];
                                        protocols: components["schemas"]["bignum"];
                                        operation_hashes_for_block: components["schemas"]["bignum"];
                                        operations_for_block: components["schemas"]["bignum"];
                                        checkpoint: components["schemas"]["bignum"];
                                        protocol_branch: components["schemas"]["bignum"];
                                        predecessor_header: components["schemas"]["bignum"];
                                        other: components["schemas"]["bignum"];
                                    } | {
                                        branch: components["schemas"]["bignum"];
                                        head: components["schemas"]["bignum"];
                                        block_header: components["schemas"]["bignum"];
                                        operations: components["schemas"]["bignum"];
                                        protocols: components["schemas"]["bignum"];
                                        operation_hashes_for_block: components["schemas"]["bignum"];
                                        operations_for_block: components["schemas"]["bignum"];
                                        other: components["schemas"]["bignum"];
                                    };
                                    failed: {
                                        branch: components["schemas"]["bignum"];
                                        head: components["schemas"]["bignum"];
                                        block_header: components["schemas"]["bignum"];
                                        operations: components["schemas"]["bignum"];
                                        protocols: components["schemas"]["bignum"];
                                        operation_hashes_for_block: components["schemas"]["bignum"];
                                        operations_for_block: components["schemas"]["bignum"];
                                        checkpoint: components["schemas"]["bignum"];
                                        protocol_branch: components["schemas"]["bignum"];
                                        predecessor_header: components["schemas"]["bignum"];
                                        other: components["schemas"]["bignum"];
                                    } | {
                                        branch: components["schemas"]["bignum"];
                                        head: components["schemas"]["bignum"];
                                        block_header: components["schemas"]["bignum"];
                                        operations: components["schemas"]["bignum"];
                                        protocols: components["schemas"]["bignum"];
                                        operation_hashes_for_block: components["schemas"]["bignum"];
                                        operations_for_block: components["schemas"]["bignum"];
                                        other: components["schemas"]["bignum"];
                                    };
                                    received: {
                                        branch: components["schemas"]["bignum"];
                                        head: components["schemas"]["bignum"];
                                        block_header: components["schemas"]["bignum"];
                                        operations: components["schemas"]["bignum"];
                                        protocols: components["schemas"]["bignum"];
                                        operation_hashes_for_block: components["schemas"]["bignum"];
                                        operations_for_block: components["schemas"]["bignum"];
                                        checkpoint: components["schemas"]["bignum"];
                                        protocol_branch: components["schemas"]["bignum"];
                                        predecessor_header: components["schemas"]["bignum"];
                                        other: components["schemas"]["bignum"];
                                    } | {
                                        branch: components["schemas"]["bignum"];
                                        head: components["schemas"]["bignum"];
                                        block_header: components["schemas"]["bignum"];
                                        operations: components["schemas"]["bignum"];
                                        protocols: components["schemas"]["bignum"];
                                        operation_hashes_for_block: components["schemas"]["bignum"];
                                        operations_for_block: components["schemas"]["bignum"];
                                        other: components["schemas"]["bignum"];
                                    };
                                    unexpected: components["schemas"]["bignum"];
                                    outdated: components["schemas"]["bignum"];
                                };
                                requests: {
                                    sent: {
                                        branch: components["schemas"]["bignum"];
                                        head: components["schemas"]["bignum"];
                                        block_header: components["schemas"]["bignum"];
                                        operations: components["schemas"]["bignum"];
                                        protocols: components["schemas"]["bignum"];
                                        operation_hashes_for_block: components["schemas"]["bignum"];
                                        operations_for_block: components["schemas"]["bignum"];
                                        checkpoint: components["schemas"]["bignum"];
                                        protocol_branch: components["schemas"]["bignum"];
                                        predecessor_header: components["schemas"]["bignum"];
                                        other: components["schemas"]["bignum"];
                                    } | {
                                        branch: components["schemas"]["bignum"];
                                        head: components["schemas"]["bignum"];
                                        block_header: components["schemas"]["bignum"];
                                        operations: components["schemas"]["bignum"];
                                        protocols: components["schemas"]["bignum"];
                                        operation_hashes_for_block: components["schemas"]["bignum"];
                                        operations_for_block: components["schemas"]["bignum"];
                                        other: components["schemas"]["bignum"];
                                    };
                                    received: {
                                        branch: components["schemas"]["bignum"];
                                        head: components["schemas"]["bignum"];
                                        block_header: components["schemas"]["bignum"];
                                        operations: components["schemas"]["bignum"];
                                        protocols: components["schemas"]["bignum"];
                                        operation_hashes_for_block: components["schemas"]["bignum"];
                                        operations_for_block: components["schemas"]["bignum"];
                                        checkpoint: components["schemas"]["bignum"];
                                        protocol_branch: components["schemas"]["bignum"];
                                        predecessor_header: components["schemas"]["bignum"];
                                        other: components["schemas"]["bignum"];
                                    } | {
                                        branch: components["schemas"]["bignum"];
                                        head: components["schemas"]["bignum"];
                                        block_header: components["schemas"]["bignum"];
                                        operations: components["schemas"]["bignum"];
                                        protocols: components["schemas"]["bignum"];
                                        operation_hashes_for_block: components["schemas"]["bignum"];
                                        operations_for_block: components["schemas"]["bignum"];
                                        other: components["schemas"]["bignum"];
                                    };
                                    failed: {
                                        branch: components["schemas"]["bignum"];
                                        head: components["schemas"]["bignum"];
                                        block_header: components["schemas"]["bignum"];
                                        operations: components["schemas"]["bignum"];
                                        protocols: components["schemas"]["bignum"];
                                        operation_hashes_for_block: components["schemas"]["bignum"];
                                        operations_for_block: components["schemas"]["bignum"];
                                        checkpoint: components["schemas"]["bignum"];
                                        protocol_branch: components["schemas"]["bignum"];
                                        predecessor_header: components["schemas"]["bignum"];
                                        other: components["schemas"]["bignum"];
                                    } | {
                                        branch: components["schemas"]["bignum"];
                                        head: components["schemas"]["bignum"];
                                        block_header: components["schemas"]["bignum"];
                                        operations: components["schemas"]["bignum"];
                                        protocols: components["schemas"]["bignum"];
                                        operation_hashes_for_block: components["schemas"]["bignum"];
                                        operations_for_block: components["schemas"]["bignum"];
                                        other: components["schemas"]["bignum"];
                                    };
                                    scheduled: {
                                        branch: components["schemas"]["bignum"];
                                        head: components["schemas"]["bignum"];
                                        block_header: components["schemas"]["bignum"];
                                        operations: components["schemas"]["bignum"];
                                        protocols: components["schemas"]["bignum"];
                                        operation_hashes_for_block: components["schemas"]["bignum"];
                                        operations_for_block: components["schemas"]["bignum"];
                                        checkpoint: components["schemas"]["bignum"];
                                        protocol_branch: components["schemas"]["bignum"];
                                        predecessor_header: components["schemas"]["bignum"];
                                        other: components["schemas"]["bignum"];
                                    } | {
                                        branch: components["schemas"]["bignum"];
                                        head: components["schemas"]["bignum"];
                                        block_header: components["schemas"]["bignum"];
                                        operations: components["schemas"]["bignum"];
                                        protocols: components["schemas"]["bignum"];
                                        operation_hashes_for_block: components["schemas"]["bignum"];
                                        operations_for_block: components["schemas"]["bignum"];
                                        other: components["schemas"]["bignum"];
                                    };
                                };
                                valid_blocks: components["schemas"]["bignum"];
                                old_heads: components["schemas"]["bignum"];
                                prevalidator_results: {
                                    cannot_download: components["schemas"]["bignum"];
                                    cannot_parse: components["schemas"]["bignum"];
                                    refused_by_prefilter: components["schemas"]["bignum"];
                                    refused_by_postfilter: components["schemas"]["bignum"];
                                    applied: components["schemas"]["bignum"];
                                    branch_delayed: components["schemas"]["bignum"];
                                    branch_refused: components["schemas"]["bignum"];
                                    refused: components["schemas"]["bignum"];
                                    duplicate: components["schemas"]["bignum"];
                                    outdated: components["schemas"]["bignum"];
                                };
                                unactivated_chains: components["schemas"]["bignum"];
                                inactive_chains: components["schemas"]["bignum"];
                                future_blocks_advertised: components["schemas"]["bignum"];
                                unadvertised: {
                                    block: components["schemas"]["bignum"];
                                    operations: components["schemas"]["bignum"];
                                    protocol: components["schemas"]["bignum"];
                                };
                                advertisements: {
                                    sent: {
                                        head: components["schemas"]["bignum"];
                                        branch: components["schemas"]["bignum"];
                                    };
                                    received: {
                                        head: components["schemas"]["bignum"];
                                        branch: components["schemas"]["bignum"];
                                    };
                                };
                            };
                            state: components["schemas"]["p2p_peer.state"];
                            reachable_at?: components["schemas"]["p2p_connection.id"];
                            stat: components["schemas"]["p2p_stat"];
                            last_failed_connection?: (components["schemas"]["p2p_connection.id"] | components["schemas"]["timestamp.system"])[];
                            last_rejected_connection?: (components["schemas"]["p2p_connection.id"] | components["schemas"]["timestamp.system"])[];
                            last_established_connection?: (components["schemas"]["p2p_connection.id"] | components["schemas"]["timestamp.system"])[];
                            last_disconnection?: (components["schemas"]["p2p_connection.id"] | components["schemas"]["timestamp.system"])[];
                            last_seen?: (components["schemas"]["p2p_connection.id"] | components["schemas"]["timestamp.system"])[];
                            last_miss?: (components["schemas"]["p2p_connection.id"] | components["schemas"]["timestamp.system"])[];
                        };
                    };
                };
                default: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": unknown;
                    };
                };
            };
        };
        trace?: never;
    };
    "/network/peers/{peer_id}/banned": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Check if a given peer is blacklisted or greylisted. */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description A cryptographic node identity (Base58Check-encoded) */
                    peer_id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": boolean;
                    };
                };
                default: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": unknown;
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
    "/network/peers/{peer_id}/log": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Monitor network events related to a given peer. */
        get: {
            parameters: {
                query?: {
                    monitor?: string;
                };
                header?: never;
                path: {
                    /** @description A cryptographic node identity (Base58Check-encoded) */
                    peer_id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["p2p_peer.pool_event"][];
                    };
                };
                default: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": unknown;
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
    "/network/points": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description List the pool of known `IP:port` used for establishing P2P connections. */
        get: {
            parameters: {
                query?: {
                    filter?: string;
                };
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
                        "application/json": (components["schemas"]["p2p_point.id"] | components["schemas"]["p2p_point.info"])[][];
                    };
                };
                default: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": unknown;
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
    "/network/points/{point}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Details about a given `IP:addr`. */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description A network point (ipv4:port or [ipv6]:port). */
                    point: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            trusted: boolean;
                            greylisted_until?: components["schemas"]["timestamp.system"];
                            state: components["schemas"]["p2p_point.state"];
                            p2p_peer_id?: components["schemas"]["Crypto_box.Public_key_hash"];
                            last_failed_connection?: components["schemas"]["timestamp.system"];
                            last_rejected_connection?: (components["schemas"]["Crypto_box.Public_key_hash"] | components["schemas"]["timestamp.system"])[];
                            last_established_connection?: (components["schemas"]["Crypto_box.Public_key_hash"] | components["schemas"]["timestamp.system"])[];
                            last_disconnection?: (components["schemas"]["Crypto_box.Public_key_hash"] | components["schemas"]["timestamp.system"])[];
                            last_seen?: (components["schemas"]["Crypto_box.Public_key_hash"] | components["schemas"]["timestamp.system"])[];
                            last_miss?: components["schemas"]["timestamp.system"];
                            expected_peer_id?: components["schemas"]["Crypto_box.Public_key_hash"];
                        };
                    };
                };
                default: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": unknown;
                    };
                };
            };
        };
        /** @description Connect to a peer */
        put: {
            parameters: {
                query: {
                    /** @description A span of time in seconds */
                    timeout: string;
                };
                header?: never;
                path: {
                    /** @description A network point (ipv4:port or [ipv6]:port). */
                    point: string;
                };
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": Record<string, never>;
                };
            };
            responses: {
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": Record<string, never>;
                    };
                };
                default: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": unknown;
                    };
                };
            };
        };
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /** @description Change the connectivity state of a given `IP:addr`. With `{acl : ban}`: blacklist the given address and remove it from the whitelist if present. With `{acl: open}`: removes an address from the blacklist and whitelist. With `{acl: trust}`: trust a given address permanently and remove it from the blacklist if present. With `{peer_id: <id>}` set the peerId of the point. Connections from this address can still be closed on authentication if the peer is greylisted. */
        patch: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description A network point (ipv4:port or [ipv6]:port). */
                    point: string;
                };
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": {
                        /** @enum {string} */
                        acl?: "open" | "trust" | "ban";
                        peer_id?: components["schemas"]["Crypto_box.Public_key_hash"];
                    };
                };
            };
            responses: {
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            trusted: boolean;
                            greylisted_until?: components["schemas"]["timestamp.system"];
                            state: components["schemas"]["p2p_point.state"];
                            p2p_peer_id?: components["schemas"]["Crypto_box.Public_key_hash"];
                            last_failed_connection?: components["schemas"]["timestamp.system"];
                            last_rejected_connection?: (components["schemas"]["Crypto_box.Public_key_hash"] | components["schemas"]["timestamp.system"])[];
                            last_established_connection?: (components["schemas"]["Crypto_box.Public_key_hash"] | components["schemas"]["timestamp.system"])[];
                            last_disconnection?: (components["schemas"]["Crypto_box.Public_key_hash"] | components["schemas"]["timestamp.system"])[];
                            last_seen?: (components["schemas"]["Crypto_box.Public_key_hash"] | components["schemas"]["timestamp.system"])[];
                            last_miss?: components["schemas"]["timestamp.system"];
                            expected_peer_id?: components["schemas"]["Crypto_box.Public_key_hash"];
                        };
                    };
                };
                default: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": unknown;
                    };
                };
            };
        };
        trace?: never;
    };
    "/network/points/{point}/banned": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Check if a given address is blacklisted or greylisted. Port component is unused. */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description A network point (ipv4:port or [ipv6]:port). */
                    point: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": boolean;
                    };
                };
                default: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": unknown;
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
    "/network/points/{point}/log": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Monitor network events related to an `IP:addr`. */
        get: {
            parameters: {
                query?: {
                    monitor?: string;
                };
                header?: never;
                path: {
                    /** @description A network point (ipv4:port or [ipv6]:port). */
                    point: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["p2p_point.pool_event"][];
                    };
                };
                default: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": unknown;
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
    "/network/self": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Return the node's peer id */
        get: {
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
                        "application/json": components["schemas"]["unistring"];
                    };
                };
                default: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": unknown;
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
    "/network/stat": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Global network bandwidth statistics in B/s. */
        get: {
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
                        "application/json": {
                            total_sent: components["schemas"]["int64"];
                            total_recv: components["schemas"]["int64"];
                            current_inflow: number;
                            current_outflow: number;
                        };
                    };
                };
                default: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": unknown;
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
    "/profiler/registered_backend": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Registered backend. */
        get: {
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
                        "application/json": {
                            registered_backends: ("opentelemetry" | "prometheus" | "plain_text" | "json")[];
                            backends: components["schemas"]["backends_encoding"];
                        };
                    };
                };
                default: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": unknown;
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
    "/protocols": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description the list of protocols supported by the node */
        get: {
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
                        "application/json": components["schemas"]["Protocol_hash"][];
                    };
                };
                default: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": unknown;
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
    "/protocols/{Protocol_hash}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description the interface of a protocol grouped by its implementing modules */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description Protocol_hash (Base58Check-encoded) */
                    Protocol_hash: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            expected_env_version: components["schemas"]["protocol.environment_version"];
                            components: {
                                name: components["schemas"]["unistring"];
                                interface?: components["schemas"]["unistring"];
                                implementation: components["schemas"]["unistring"];
                            }[];
                        };
                    };
                };
                default: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": unknown;
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
    "/protocols/{Protocol_hash}/environment": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description the protocol environment version required by a protocol */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description Protocol_hash (Base58Check-encoded) */
                    Protocol_hash: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": number;
                    };
                };
                default: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": unknown;
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
    "/stats/gc": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Gets stats from the OCaml Garbage Collector */
        get: {
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
                        "application/json": {
                            minor_words: number;
                            promoted_words: number;
                            major_words: number;
                            minor_collections: number;
                            major_collections: number;
                            forced_major_collections: number;
                            heap_words: number;
                            heap_chunks: number;
                            live_words: number;
                            live_blocks: number;
                            free_words: number;
                            free_blocks: number;
                            largest_free: number;
                            fragments: number;
                            compactions: number;
                            top_heap_words: number;
                            stack_size: number;
                        };
                    };
                };
                default: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": unknown;
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
    "/stats/memory": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Gets memory usage stats */
        get: {
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
                        "application/json": {
                            page_size: number;
                            size: components["schemas"]["int64"];
                            resident: components["schemas"]["int64"];
                            shared: components["schemas"]["int64"];
                            text: components["schemas"]["int64"];
                            lib: components["schemas"]["int64"];
                            data: components["schemas"]["int64"];
                            dt: components["schemas"]["int64"];
                        } | {
                            page_size: number;
                            mem: number;
                            resident: components["schemas"]["int64"];
                        };
                    };
                };
                default: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": unknown;
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
    "/version": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Get information on the node version */
        get: {
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
                        "application/json": {
                            version: {
                                major: number;
                                minor: number;
                                build: number;
                                additional_info: "dev" | {
                                    rc: number;
                                } | "release" | {
                                    rc_dev: number;
                                } | {
                                    beta: number;
                                } | {
                                    beta_dev: number;
                                };
                            };
                            network_version: components["schemas"]["network_version"];
                            commit_info: {
                                commit_hash: components["schemas"]["unistring"];
                                commit_date: components["schemas"]["unistring"];
                            } | null;
                        };
                    };
                };
                default: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": unknown;
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
    "/workers/block_validator": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Introspect the state of the block_validator worker. */
        get: {
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
                        "application/json": {
                            status: {
                                /** @enum {string} */
                                phase: "launching";
                                since: components["schemas"]["timestamp.system"];
                            } | {
                                /** @enum {string} */
                                phase: "running";
                                since: components["schemas"]["timestamp.system"];
                            } | {
                                /** @enum {string} */
                                phase: "closing";
                                birth: components["schemas"]["timestamp.system"];
                                since: components["schemas"]["timestamp.system"];
                            } | {
                                /** @enum {string} */
                                phase: "closed";
                                birth: components["schemas"]["timestamp.system"];
                                since: components["schemas"]["timestamp.system"];
                            } | {
                                /** @enum {string} */
                                phase: "crashed";
                                birth: components["schemas"]["timestamp.system"];
                                since: components["schemas"]["timestamp.system"];
                                errors: components["schemas"]["error"];
                            };
                            pending_requests: {
                                pushed: components["schemas"]["timestamp.system"];
                                request: {
                                    block: components["schemas"]["block_hash"];
                                    chain_id: components["schemas"]["Chain_id"];
                                    peer?: components["schemas"]["Crypto_box.Public_key_hash"];
                                } | {
                                    chain_id: components["schemas"]["Chain_id"];
                                    level: number;
                                };
                            }[];
                            current_request?: {
                                pushed: components["schemas"]["timestamp.system"];
                                treated: components["schemas"]["timestamp.system"];
                                request: {
                                    block: components["schemas"]["block_hash"];
                                    chain_id: components["schemas"]["Chain_id"];
                                    peer?: components["schemas"]["Crypto_box.Public_key_hash"];
                                } | {
                                    chain_id: components["schemas"]["Chain_id"];
                                    level: number;
                                };
                            };
                        };
                    };
                };
                default: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": unknown;
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
    "/workers/chain_validators": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Lists the chain validator workers and their status. */
        get: {
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
                        "application/json": {
                            chain_id: components["schemas"]["Chain_id"];
                            status: {
                                /** @enum {string} */
                                phase: "launching";
                                since: components["schemas"]["timestamp.system"];
                            } | {
                                /** @enum {string} */
                                phase: "running";
                                since: components["schemas"]["timestamp.system"];
                            } | {
                                /** @enum {string} */
                                phase: "closing";
                                birth: components["schemas"]["timestamp.system"];
                                since: components["schemas"]["timestamp.system"];
                            } | {
                                /** @enum {string} */
                                phase: "closed";
                                birth: components["schemas"]["timestamp.system"];
                                since: components["schemas"]["timestamp.system"];
                            } | {
                                /** @enum {string} */
                                phase: "crashed";
                                birth: components["schemas"]["timestamp.system"];
                                since: components["schemas"]["timestamp.system"];
                                errors: components["schemas"]["error"];
                            };
                            information: {
                                instances: number;
                                status: {
                                    /** @enum {string} */
                                    phase: "launching";
                                    since: components["schemas"]["timestamp.system"];
                                } | {
                                    /** @enum {string} */
                                    phase: "running";
                                    since: components["schemas"]["timestamp.system"];
                                } | {
                                    /** @enum {string} */
                                    phase: "closing";
                                    birth: components["schemas"]["timestamp.system"];
                                    since: components["schemas"]["timestamp.system"];
                                } | {
                                    /** @enum {string} */
                                    phase: "closed";
                                    birth: components["schemas"]["timestamp.system"];
                                    since: components["schemas"]["timestamp.system"];
                                } | {
                                    /** @enum {string} */
                                    phase: "crashed";
                                    birth: components["schemas"]["timestamp.system"];
                                    since: components["schemas"]["timestamp.system"];
                                    errors: components["schemas"]["error"];
                                };
                                queue_length: number;
                            };
                            pipelines: number;
                        }[];
                    };
                };
                default: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": unknown;
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
    "/workers/chain_validators/{chain_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Introspect the state of a chain validator worker. */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description A chain identifier. This is either a chain hash in Base58Check notation or a one the predefined aliases: 'main', 'test'. */
                    chain_id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            status: {
                                /** @enum {string} */
                                phase: "launching";
                                since: components["schemas"]["timestamp.system"];
                            } | {
                                /** @enum {string} */
                                phase: "running";
                                since: components["schemas"]["timestamp.system"];
                            } | {
                                /** @enum {string} */
                                phase: "closing";
                                birth: components["schemas"]["timestamp.system"];
                                since: components["schemas"]["timestamp.system"];
                            } | {
                                /** @enum {string} */
                                phase: "closed";
                                birth: components["schemas"]["timestamp.system"];
                                since: components["schemas"]["timestamp.system"];
                            } | {
                                /** @enum {string} */
                                phase: "crashed";
                                birth: components["schemas"]["timestamp.system"];
                                since: components["schemas"]["timestamp.system"];
                                errors: components["schemas"]["error"];
                            };
                            pending_requests: {
                                pushed: components["schemas"]["timestamp.system"];
                                request: {
                                    hash: components["schemas"]["block_hash"];
                                } | {
                                    peer_id: components["schemas"]["Crypto_box.Public_key_hash"];
                                };
                            }[];
                            current_request?: {
                                pushed: components["schemas"]["timestamp.system"];
                                treated: components["schemas"]["timestamp.system"];
                                request: {
                                    hash: components["schemas"]["block_hash"];
                                } | {
                                    peer_id: components["schemas"]["Crypto_box.Public_key_hash"];
                                };
                            };
                        };
                    };
                };
                default: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": unknown;
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
    "/workers/chain_validators/{chain_id}/ddb": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Introspect the state of the DDB attached to a chain validator worker. */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description A chain identifier. This is either a chain hash in Base58Check notation or a one the predefined aliases: 'main', 'test'. */
                    chain_id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            p2p_readers: number;
                            active_chains: number;
                            operation_db: {
                                table_length: number;
                                scheduler_length: number;
                            };
                            operations_db: {
                                table_length: number;
                                scheduler_length: number;
                            };
                            block_header_db: {
                                table_length: number;
                                scheduler_length: number;
                            };
                            active_connections: number;
                            active_peers: number;
                        };
                    };
                };
                default: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": unknown;
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
    "/workers/chain_validators/{chain_id}/peers_validators": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Lists the peer validator workers and their status. */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description A chain identifier. This is either a chain hash in Base58Check notation or a one the predefined aliases: 'main', 'test'. */
                    chain_id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            peer_id: components["schemas"]["Crypto_box.Public_key_hash"];
                            status: {
                                /** @enum {string} */
                                phase: "launching";
                                since: components["schemas"]["timestamp.system"];
                            } | {
                                /** @enum {string} */
                                phase: "running";
                                since: components["schemas"]["timestamp.system"];
                            } | {
                                /** @enum {string} */
                                phase: "closing";
                                birth: components["schemas"]["timestamp.system"];
                                since: components["schemas"]["timestamp.system"];
                            } | {
                                /** @enum {string} */
                                phase: "closed";
                                birth: components["schemas"]["timestamp.system"];
                                since: components["schemas"]["timestamp.system"];
                            } | {
                                /** @enum {string} */
                                phase: "crashed";
                                birth: components["schemas"]["timestamp.system"];
                                since: components["schemas"]["timestamp.system"];
                                errors: components["schemas"]["error"];
                            };
                            information: {
                                instances: number;
                                status: {
                                    /** @enum {string} */
                                    phase: "launching";
                                    since: components["schemas"]["timestamp.system"];
                                } | {
                                    /** @enum {string} */
                                    phase: "running";
                                    since: components["schemas"]["timestamp.system"];
                                } | {
                                    /** @enum {string} */
                                    phase: "closing";
                                    birth: components["schemas"]["timestamp.system"];
                                    since: components["schemas"]["timestamp.system"];
                                } | {
                                    /** @enum {string} */
                                    phase: "closed";
                                    birth: components["schemas"]["timestamp.system"];
                                    since: components["schemas"]["timestamp.system"];
                                } | {
                                    /** @enum {string} */
                                    phase: "crashed";
                                    birth: components["schemas"]["timestamp.system"];
                                    since: components["schemas"]["timestamp.system"];
                                    errors: components["schemas"]["error"];
                                };
                                queue_length: number;
                            };
                            pipelines: {
                                fetched_headers: number;
                                fetched_blocks: number;
                            };
                        }[];
                    };
                };
                default: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": unknown;
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
    "/workers/chain_validators/{chain_id}/peers_validators/{peer_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Introspect the state of a peer validator worker. */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description A chain identifier. This is either a chain hash in Base58Check notation or a one the predefined aliases: 'main', 'test'. */
                    chain_id: string;
                    /** @description A cryptographic node identity (Base58Check-encoded) */
                    peer_id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            status: {
                                /** @enum {string} */
                                phase: "launching";
                                since: components["schemas"]["timestamp.system"];
                            } | {
                                /** @enum {string} */
                                phase: "running";
                                since: components["schemas"]["timestamp.system"];
                            } | {
                                /** @enum {string} */
                                phase: "closing";
                                birth: components["schemas"]["timestamp.system"];
                                since: components["schemas"]["timestamp.system"];
                            } | {
                                /** @enum {string} */
                                phase: "closed";
                                birth: components["schemas"]["timestamp.system"];
                                since: components["schemas"]["timestamp.system"];
                            } | {
                                /** @enum {string} */
                                phase: "crashed";
                                birth: components["schemas"]["timestamp.system"];
                                since: components["schemas"]["timestamp.system"];
                                errors: components["schemas"]["error"];
                            };
                            pending_requests: {
                                pushed: components["schemas"]["timestamp.system"];
                                request: {
                                    /** @enum {string} */
                                    request: "new_head";
                                    block: components["schemas"]["block_hash"];
                                } | {
                                    /** @enum {string} */
                                    request: "new_branch";
                                    block: components["schemas"]["block_hash"];
                                    locators: number;
                                };
                            }[];
                            current_request?: {
                                pushed: components["schemas"]["timestamp.system"];
                                treated: components["schemas"]["timestamp.system"];
                                request: {
                                    /** @enum {string} */
                                    request: "new_head";
                                    block: components["schemas"]["block_hash"];
                                } | {
                                    /** @enum {string} */
                                    request: "new_branch";
                                    block: components["schemas"]["block_hash"];
                                    locators: number;
                                };
                            };
                        };
                    };
                };
                default: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": unknown;
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
    "/workers/prevalidators": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Lists the Prevalidator workers and their status. */
        get: {
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
                        "application/json": {
                            chain_id: components["schemas"]["Chain_id"];
                            status: {
                                /** @enum {string} */
                                phase: "launching";
                                since: components["schemas"]["timestamp.system"];
                            } | {
                                /** @enum {string} */
                                phase: "running";
                                since: components["schemas"]["timestamp.system"];
                            } | {
                                /** @enum {string} */
                                phase: "closing";
                                birth: components["schemas"]["timestamp.system"];
                                since: components["schemas"]["timestamp.system"];
                            } | {
                                /** @enum {string} */
                                phase: "closed";
                                birth: components["schemas"]["timestamp.system"];
                                since: components["schemas"]["timestamp.system"];
                            } | {
                                /** @enum {string} */
                                phase: "crashed";
                                birth: components["schemas"]["timestamp.system"];
                                since: components["schemas"]["timestamp.system"];
                                errors: components["schemas"]["error"];
                            };
                            information: {
                                instances: number;
                                status: {
                                    /** @enum {string} */
                                    phase: "launching";
                                    since: components["schemas"]["timestamp.system"];
                                } | {
                                    /** @enum {string} */
                                    phase: "running";
                                    since: components["schemas"]["timestamp.system"];
                                } | {
                                    /** @enum {string} */
                                    phase: "closing";
                                    birth: components["schemas"]["timestamp.system"];
                                    since: components["schemas"]["timestamp.system"];
                                } | {
                                    /** @enum {string} */
                                    phase: "closed";
                                    birth: components["schemas"]["timestamp.system"];
                                    since: components["schemas"]["timestamp.system"];
                                } | {
                                    /** @enum {string} */
                                    phase: "crashed";
                                    birth: components["schemas"]["timestamp.system"];
                                    since: components["schemas"]["timestamp.system"];
                                    errors: components["schemas"]["error"];
                                };
                                queue_length: number;
                            };
                            pipelines: number;
                        }[];
                    };
                };
                default: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": unknown;
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
    "/workers/prevalidators/{chain_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Introspect the state of prevalidator workers. */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description A chain identifier. This is either a chain hash in Base58Check notation or a one the predefined aliases: 'main', 'test'. */
                    chain_id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            status: {
                                /** @enum {string} */
                                phase: "launching";
                                since: components["schemas"]["timestamp.system"];
                            } | {
                                /** @enum {string} */
                                phase: "running";
                                since: components["schemas"]["timestamp.system"];
                            } | {
                                /** @enum {string} */
                                phase: "closing";
                                birth: components["schemas"]["timestamp.system"];
                                since: components["schemas"]["timestamp.system"];
                            } | {
                                /** @enum {string} */
                                phase: "closed";
                                birth: components["schemas"]["timestamp.system"];
                                since: components["schemas"]["timestamp.system"];
                            } | {
                                /** @enum {string} */
                                phase: "crashed";
                                birth: components["schemas"]["timestamp.system"];
                                since: components["schemas"]["timestamp.system"];
                                errors: components["schemas"]["error"];
                            };
                            pending_requests: {
                                pushed: components["schemas"]["timestamp.system"];
                                request: {
                                    /** @enum {string} */
                                    request: "flush";
                                    block: components["schemas"]["block_hash"];
                                    event: components["schemas"]["chain_update"];
                                } | {
                                    /** @enum {string} */
                                    request: "notify";
                                    peer: components["schemas"]["Crypto_box.Public_key_hash"];
                                    mempool: components["schemas"]["mempool"];
                                } | {
                                    /** @enum {string} */
                                    request: "inject";
                                    operation: components["schemas"]["operation"];
                                    force: boolean;
                                } | {
                                    /** @enum {string} */
                                    request: "arrived";
                                    operation_hash: components["schemas"]["Operation_hash"];
                                    operation: components["schemas"]["operation"];
                                } | {
                                    /** @enum {string} */
                                    request: "advertise";
                                } | {
                                    /** @enum {string} */
                                    request: "leftover";
                                } | {
                                    /** @enum {string} */
                                    request: "ban";
                                    operation_hash: components["schemas"]["Operation_hash"];
                                };
                            }[];
                            current_request?: {
                                pushed: components["schemas"]["timestamp.system"];
                                treated: components["schemas"]["timestamp.system"];
                                request: {
                                    /** @enum {string} */
                                    request: "flush";
                                    block: components["schemas"]["block_hash"];
                                    event: components["schemas"]["chain_update"];
                                } | {
                                    /** @enum {string} */
                                    request: "notify";
                                    peer: components["schemas"]["Crypto_box.Public_key_hash"];
                                    mempool: components["schemas"]["mempool"];
                                } | {
                                    /** @enum {string} */
                                    request: "inject";
                                    operation: components["schemas"]["operation"];
                                    force: boolean;
                                } | {
                                    /** @enum {string} */
                                    request: "arrived";
                                    operation_hash: components["schemas"]["Operation_hash"];
                                    operation: components["schemas"]["operation"];
                                } | {
                                    /** @enum {string} */
                                    request: "advertise";
                                } | {
                                    /** @enum {string} */
                                    request: "leftover";
                                } | {
                                    /** @enum {string} */
                                    request: "ban";
                                    operation_hash: components["schemas"]["Operation_hash"];
                                };
                            };
                        };
                    };
                };
                default: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": unknown;
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
        /** A Bls12_381 public key (Base58Check-encoded) */
        "Bls12_381.Public_key": components["schemas"]["unistring"];
        /** A Bls12_381 public key hash (Base58Check-encoded) */
        "Bls12_381.Public_key_hash": components["schemas"]["unistring"];
        /** A Bls12_381 signature (Base58Check-encoded) */
        Bls12_381_signature: components["schemas"]["unistring"];
        /** Network identifier (Base58Check-encoded) */
        Chain_id: components["schemas"]["unistring"];
        /** A hash of context (Base58Check-encoded) */
        Context_hash: components["schemas"]["unistring"];
        /** A Cryptobox public key ID (Base58Check-encoded) */
        "Crypto_box.Public_key_hash": components["schemas"]["unistring"];
        /** A Tezos operation ID (Base58Check-encoded) */
        Operation_hash: components["schemas"]["unistring"];
        /** A list of list of operations (Base58Check-encoded) */
        Operation_list_list_hash: components["schemas"]["unistring"];
        /** A Tezos protocol ID (Base58Check-encoded) */
        Protocol_hash: components["schemas"]["unistring"];
        /**
         * Backends encoding
         * @description Backends encoding
         */
        backends_encoding: (components["schemas"]["unistring"] | ("opentelemetry" | "prometheus" | "plain_text" | "json"))[][];
        /**
         * Big number
         * @description Decimal representation of a big number
         */
        bignum: string;
        /** A block identifier (Base58Check-encoded) */
        block_hash: components["schemas"]["unistring"];
        /**
         * Block header
         * @description Block header. It contains both shell and protocol specific data.
         */
        block_header: {
            level: number;
            proto: number;
            predecessor: components["schemas"]["block_hash"];
            timestamp: components["schemas"]["timestamp.protocol"];
            validation_pass: number;
            operations_hash: components["schemas"]["Operation_list_list_hash"];
            fitness: components["schemas"]["fitness"];
            context: components["schemas"]["Context_hash"];
            protocol_data: string;
        };
        /**
         * @description If 'unsynced', the node is not currently synchronized with of its peers (it is probably still bootstrapping and its head is lagging behind the chain's).
         *     If 'synced', the node considers itself synchronized with its peers and the current head timestamp is recent.
         *     If 'stuck', the node considers itself synchronized with its peers but the chain seems to be halted from its viewpoint.
         * @enum {string}
         */
        chain_status: "stuck" | "synced" | "unsynced";
        /**
         * @description If 'ignored', the new validated block is ignored since the current head fitness is better. If 'branch', we have set our head to a new validated block which is not the direct successor of the previous head. If 'increment', the new validated head is the direct successor of the previous head.
         * @enum {string}
         */
        chain_update: "branch" | "ignored" | "increment";
        /** @description A version number for the distributed DB protocol */
        distributed_db_version: number;
        /** @description A name for the distributed DB protocol */
        "distributed_db_version.name": components["schemas"]["unistring"];
        /** @description An error trace. The full list of errors is available with the global RPC `GET errors` */
        error: unknown;
        /**
         * Block fitness
         * @description The fitness, or score, of a block, that allow the Tezos to decide which chain is the best. A fitness value is a list of byte sequences. They are compared as follows: shortest lists are smaller; lists of the same length are compared according to the lexicographical order.
         */
        fitness: string[];
        /**
         * history mode
         * @description Storage mode for the Tezos shell.
         */
        history_mode: "archive" | {
            full: {
                /**
                 * additional cycles
                 * @description Number of additional cycles preserved below the savepoint. By default: 1 additional cycles will be stored.
                 */
                additional_cycles: number;
            };
        } | {
            rolling: {
                /**
                 * additional cycles
                 * @description Number of additional cycles preserved below the savepoint. By default: 1 additional cycles will be stored.
                 */
                additional_cycles: number;
            };
        } | "full" | "rolling";
        /**
         * 64 bit integers
         * @description Decimal representation of 64 bit integers
         */
        int64: string;
        /**
         * max_active_rpc_connections
         * @description The maximum alowed number of RPC connections
         */
        max_active_rpc_connections: "unlimited" | number;
        /** @description A batch of operation. This format is used to gossip operations between peers. */
        mempool: {
            known_valid: components["schemas"]["Operation_hash"][];
            pending: components["schemas"]["Operation_hash"][];
        };
        /** @description A version number for the network protocol (includes distributed DB version and p2p version) */
        network_version: {
            chain_name: components["schemas"]["distributed_db_version.name"];
            distributed_db_version: components["schemas"]["distributed_db_version"];
            p2p_version: components["schemas"]["p2p_version"];
        };
        /** @description An operation. The shell_header part indicates a block an operation is meant to apply on top of. The proto part is protocol-specific and appears as a binary blob. */
        operation: {
            branch: components["schemas"]["block_hash"];
            data: string;
        };
        /**
         * operation_metadata_size_limit
         * @description The operation metadata size limit
         */
        operation_metadata_size_limit: "unlimited" | number;
        /** @description An address for locating peers. */
        p2p_address: components["schemas"]["unistring"];
        /** @description The identifier for a p2p connection. It includes an address and a port number. */
        "p2p_connection.id": {
            addr: components["schemas"]["p2p_address"];
            port?: number;
        };
        /** @description An event that may happen during maintenance of and other operations on the connection to a specific peer. */
        "p2p_peer.pool_event": {
            /** @enum {string} */
            kind: "rejecting_request" | "incoming_request" | "disconnection" | "external_disconnection" | "connection_established" | "request_rejected";
            timestamp: components["schemas"]["timestamp.system"];
            addr: components["schemas"]["p2p_address"];
            port?: number;
        };
        /**
         * @description The state a peer connection can be in: accepted (when the connection is being established), running (when the connection is already established), disconnected (otherwise).
         * @enum {string}
         */
        "p2p_peer.state": "running" | "accepted" | "disconnected";
        /** @description Identifier for a peer point */
        "p2p_point.id": components["schemas"]["unistring"];
        /** @description Information about a peer point. Includes flags, state, and records about past events. */
        "p2p_point.info": {
            trusted: boolean;
            greylisted_until?: components["schemas"]["timestamp.system"];
            state: components["schemas"]["p2p_point.state"];
            p2p_peer_id?: components["schemas"]["Crypto_box.Public_key_hash"];
            last_failed_connection?: components["schemas"]["timestamp.system"];
            last_rejected_connection?: (components["schemas"]["Crypto_box.Public_key_hash"] | components["schemas"]["timestamp.system"])[];
            last_established_connection?: (components["schemas"]["Crypto_box.Public_key_hash"] | components["schemas"]["timestamp.system"])[];
            last_disconnection?: (components["schemas"]["Crypto_box.Public_key_hash"] | components["schemas"]["timestamp.system"])[];
            last_seen?: (components["schemas"]["Crypto_box.Public_key_hash"] | components["schemas"]["timestamp.system"])[];
            last_miss?: components["schemas"]["timestamp.system"];
            expected_peer_id?: components["schemas"]["Crypto_box.Public_key_hash"];
        };
        /** @description Events happening during maintenance of and operations on a peer point pool (such as connections, disconnections, connection requests). */
        "p2p_point.pool_event": (components["schemas"]["timestamp.system"] | ({
            /** @enum {string} */
            event_kind: "outgoing_request";
        } | {
            /** @enum {string} */
            event_kind: "accepting_request";
            p2p_peer_id: components["schemas"]["Crypto_box.Public_key_hash"];
        } | {
            /** @enum {string} */
            event_kind: "rejecting_request";
            p2p_peer_id: components["schemas"]["Crypto_box.Public_key_hash"];
        } | {
            /** @enum {string} */
            event_kind: "request_rejected";
            p2p_peer_id?: components["schemas"]["Crypto_box.Public_key_hash"];
        } | {
            /** @enum {string} */
            event_kind: "rejecting_request";
            p2p_peer_id: components["schemas"]["Crypto_box.Public_key_hash"];
        } | {
            /** @enum {string} */
            event_kind: "rejecting_request";
            p2p_peer_id: components["schemas"]["Crypto_box.Public_key_hash"];
        } | {
            /** @enum {string} */
            event_kind: "rejecting_request";
            p2p_peer_id: components["schemas"]["Crypto_box.Public_key_hash"];
        }))[];
        /** @description The state a connection to a peer point can be in: requested (connection open from here), accepted (handshake), running (connection already established), disconnected (no connection). */
        "p2p_point.state": {
            /** @enum {string} */
            event_kind: "requested";
        } | {
            /** @enum {string} */
            event_kind: "accepted";
            p2p_peer_id: components["schemas"]["Crypto_box.Public_key_hash"];
        } | {
            /** @enum {string} */
            event_kind: "running";
            p2p_peer_id: components["schemas"]["Crypto_box.Public_key_hash"];
        } | {
            /** @enum {string} */
            event_kind: "disconnected";
        };
        /** @description Statistics about the p2p network. */
        p2p_stat: {
            total_sent: components["schemas"]["int64"];
            total_recv: components["schemas"]["int64"];
            current_inflow: number;
            current_outflow: number;
        };
        /** @description A version number for the p2p layer. */
        p2p_version: number;
        "protocol.environment_version": number;
        /**
         * storage maintenance delay
         * @description Delay prior to the storage maintenance trigger
         */
        storage_maintenance_delay: "disabled" | {
            custom: number;
        } | "auto";
        /** @description A span of time, as seen by the local computer. */
        "timespan.system": number;
        /** @description A timestamp as seen by the protocol: second-level precision, epoch based. */
        "timestamp.protocol": components["schemas"]["unistring"];
        /**
         * RFC 3339 formatted timestamp
         * @description A date in RFC 3339 notation.
         */
        "timestamp.rfc": components["schemas"]["unistring"];
        /** @description A timestamp as seen by the underlying, local computer: subsecond-level precision, epoch or rfc3339 based. */
        "timestamp.system": components["schemas"]["timestamp.rfc"] | components["schemas"]["int64"];
        /**
         * Universal string representation
         * @description Either a plain UTF8 string, or a sequence of bytes for strings that contain invalid byte sequences.
         */
        unistring: string | {
            invalid_utf8_string: number[];
        };
        /**
         * User activated protocol overrides
         * @description User activated protocol overrides: activate a protocol instead of another.
         */
        "user_activated.protocol_overrides": {
            replaced_protocol: components["schemas"]["Protocol_hash"];
            replacement_protocol: components["schemas"]["Protocol_hash"];
        }[];
        /**
         * User activated upgrades
         * @description User activated upgrades: at given level, switch to given protocol.
         */
        "user_activated.upgrades": {
            level: number;
            replacement_protocol: components["schemas"]["Protocol_hash"];
        }[];
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export type operations = Record<string, never>;
