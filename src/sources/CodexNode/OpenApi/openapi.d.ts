export interface paths {
    "/connect/{peerId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Connect to a peer
         * @description If `addrs` param is supplied, it will be used to dial the peer, otherwise the `peerId` is used
         *     to invoke peer discovery, if it succeeds the returned addresses will be used to dial.
         */
        get: operations["connectPeer"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/data": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Lists manifest CIDs stored locally in node. */
        get: operations["listData"];
        put?: never;
        /** Upload a file in a streaming manner. Once finished, the file is stored in the node and can be retrieved by any node in the network using the returned CID. */
        post: operations["upload"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/data/{cid}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Download a file from the local node in a streaming manner. If the file is not available locally, a 404 is returned. */
        get: operations["downloadLocal"];
        put?: never;
        post?: never;
        /** Deletes either a single block or an entire dataset from the local node. */
        delete: operations["deleteLocal"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/data/{cid}/network": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Download a file from the network to the local node if it's not available locally. Note: Download is performed async. Call can return before download is completed. */
        post: operations["downloadNetwork"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/data/{cid}/network/stream": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Download a file from the network in a streaming manner. If the file is not available locally, it will be retrieved from other nodes in the network if able. */
        get: operations["downloadNetworkStream"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/data/{cid}/network/manifest": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Download only the dataset manifest from the network to the local node if it's not available locally. */
        get: operations["downloadNetworkManifest"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/data/{cid}/exists": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Check if a block identified by CID exists in the local node. */
        get: operations["hasBlock"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/space": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Gets a summary of the storage space allocation of the node. */
        get: operations["space"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/spr": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get Node's SPR */
        get: operations["getSPR"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/peerid": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get Node's PeerID */
        get: operations["getPeerId"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/debug/chronicles/loglevel": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Set log level at run time */
        post: operations["setDebugLogLevel"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/debug/info": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Gets node information */
        get: operations["getDebugInfo"];
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
         * @description Address of node as specified by the multi-address specification https://multiformats.io/multiaddr/
         * @example /ip4/127.0.0.1/tcp/8080
         */
        MultiAddress: string;
        /**
         * @description Peer Identity reference as specified at https://docs.libp2p.io/concepts/fundamentals/peers/
         * @example QmYyQSo1c1Ym7orWxLYvCrM2EmxFTANf8wXmmE7DWjhx5N
         */
        PeerId: string;
        /**
         * @description 32bits identifier encoded in hex-decimal string.
         * @example 0x...
         */
        Id: string;
        /**
         * @description Content Identifier as specified at https://github.com/multiformats/cid
         * @example QmYyQSo1c1Ym7orWxLYvCrM2EmxFTANf8wXmmE7DWjhx5N
         */
        Cid: string;
        /**
         * @description One of the log levels: TRACE, DEBUG, INFO, NOTICE, WARN, ERROR or FATAL
         * @example DEBUG
         */
        LogLevel: string;
        /** @description Signed Peer Record (libp2p) */
        SPR: string;
        SPRRead: {
            spr: components["schemas"]["SPR"];
        };
        PeerIdRead: {
            id?: components["schemas"]["PeerId"];
        };
        Node: {
            nodeId: string;
            peerId: string;
            record: string;
            address: string;
            seen: boolean;
        };
        StorageVersion: {
            /** @example v0.1.7 */
            version?: string;
            /** @example 0c647d8 */
            revision?: string;
        };
        PeersTable: {
            localNode: components["schemas"]["Node"];
            nodes: components["schemas"]["Node"][];
        };
        DebugInfo: {
            id: components["schemas"]["PeerId"];
            addrs: components["schemas"]["MultiAddress"][];
            spr: components["schemas"]["SPR"];
            providerRecord?: components["schemas"]["SPR"];
            providerAddresses: components["schemas"]["MultiAddress"][];
            discoveryAddresses: components["schemas"]["MultiAddress"][];
            /** @description Hex-encoded libp2p public key of the node */
            libp2pPubKey: string;
            /** @description Hex-encoded mix public key (present only for nodes that support mix) */
            mixPubKey?: string | null;
            table: components["schemas"]["PeersTable"];
            storage: components["schemas"]["StorageVersion"];
            nat?: components["schemas"]["NatInfo"];
            connections?: components["schemas"]["Connection"][];
        };
        NatInfo: {
            /**
             * @description AutoNAT reachability status
             * @enum {string}
             */
            reachability: "Unknown" | "Reachable" | "NotReachable";
            /** @description Whether the DHT is running in client mode (not added to remote routing tables) */
            clientMode: boolean;
            /** @description Whether the AutoRelay service is currently running */
            relayRunning: boolean;
            /**
             * @description Active NAT port mapping type
             * @enum {string}
             */
            portMapping: "none" | "upnp" | "pmp" | "pcp" | "direct";
        };
        Connection: {
            peerId: components["schemas"]["PeerId"];
            /** @description Whether at least one connection to this peer is direct (not relayed) */
            direct: boolean;
        };
        DataList: {
            content: components["schemas"]["DataItem"][];
        };
        DataItem: {
            cid: components["schemas"]["Cid"];
            manifest: components["schemas"]["ManifestItem"];
        };
        ManifestItem: {
            /** @description Unique data identifier */
            treeCid: components["schemas"]["Cid"];
            /**
             * Format: int64
             * @description Length of original content in bytes
             */
            datasetSize: number;
            /** @description Size of blocks */
            blockSize: number;
            /**
             * @description The original name of the uploaded content (optional)
             * @example storage.png
             */
            filename?: string | null;
            /**
             * @description The original mimetype of the uploaded content (optional)
             * @example image/png
             */
            mimetype?: string | null;
        };
        Space: {
            /**
             * Format: int64
             * @description Number of blocks stored by the node
             */
            totalBlocks: number;
            /**
             * Format: int64
             * @description Maximum storage space (in bytes) available for the node in Logos Storage's local repository.
             */
            quotaMaxBytes: number;
            /**
             * Format: int64
             * @description Amount of storage space (in bytes) currently used for storing files in Logos Storage's local repository.
             */
            quotaUsedBytes: number;
            /**
             * Format: int64
             * @description Amount of storage reserved (in bytes) in the Logos Storage's local repository for future use when storage requests will be picked up and hosted by the node using node's availabilities. This does not include the storage currently in use.
             */
            quotaReservedBytes: number;
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
    connectPeer: {
        parameters: {
            query?: {
                /**
                 * @description If supplied, it will be used to dial the peer.
                 *     The address has to target the listening address of the peer,
                 *     which is /ip4/<listen-ip>/tcp/<listen-port>, where `listen-port` is
                 *     specified with the `--listen-port` CLI flag and `listen-ip` with the
                 *     `--listen-ip` CLI flag.
                 */
                addrs?: components["schemas"]["MultiAddress"][] | null;
            };
            header?: never;
            path: {
                /** @description Peer that should be dialed. */
                peerId: components["schemas"]["PeerId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successfully connected to peer */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Peer either not found or was not possible to dial */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    listData: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Retrieved list of content CIDs */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DataList"];
                };
            };
            /** @description Invalid CID is specified */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Content specified by the CID is not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description The content type is not a valid content type or the filename is not valid */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Well it was bad-bad */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    upload: {
        parameters: {
            query?: never;
            header?: {
                /** @description The content type of the file. Must be valid. */
                "content-type"?: string;
                /** @description The content disposition used to send the filename. */
                "content-disposition"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/octet-stream": string;
            };
        };
        responses: {
            /** @description CID of uploaded file */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": string;
                };
            };
            /** @description The mimetype of the filename is invalid */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Well it was bad-bad and the upload did not work out */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    downloadLocal: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description File to be downloaded. */
                cid: components["schemas"]["Cid"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Retrieved content specified by CID */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/octet-stream": string;
                };
            };
            /** @description Invalid CID is specified */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Content specified by the CID is unavailable locally */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Well it was bad-bad */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    deleteLocal: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Block or dataset to be deleted. */
                cid: components["schemas"]["Cid"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Data was successfully deleted. */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Invalid CID is specified */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description There was an error during deletion */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    downloadNetwork: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description File to be downloaded. */
                cid: components["schemas"]["Cid"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Manifest information for download that has been started. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DataItem"];
                };
            };
            /** @description Invalid CID is specified */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Failed to download dataset manifest */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Well it was bad-bad */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    downloadNetworkStream: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description File to be downloaded. */
                cid: components["schemas"]["Cid"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Retrieved content specified by CID */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/octet-stream": string;
                };
            };
            /** @description Invalid CID is specified */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Content specified by the CID is not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Well it was bad-bad */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    downloadNetworkManifest: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description File for which the manifest is to be downloaded. */
                cid: components["schemas"]["Cid"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Manifest information. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DataItem"];
                };
            };
            /** @description Invalid CID is specified */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Failed to download dataset manifest */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Well it was bad-bad */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    hasBlock: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description CID of the block to check. */
                cid: components["schemas"]["Cid"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Block existence information */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @description Indicates whether the block exists in the local node */
                        has?: boolean;
                    };
                };
            };
            /** @description Invalid CID is specified */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Well it was bad-bad */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    space: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Summary of storage allocation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Space"];
                };
            };
            /** @description It's not working as planned */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    getSPR: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Node's SPR */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["SPR"];
                    "application/json": components["schemas"]["SPRRead"];
                };
            };
            /** @description Node SPR not ready, try again later */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    getPeerId: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Node's Peer ID */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["PeerId"];
                    "application/json": components["schemas"]["PeerIdRead"];
                };
            };
        };
    };
    setDebugLogLevel: {
        parameters: {
            query: {
                level: components["schemas"]["LogLevel"];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successfully log level set */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Invalid or missing log level */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Well it was bad-bad */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    getDebugInfo: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Node's information */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DebugInfo"];
                };
            };
        };
    };
}
