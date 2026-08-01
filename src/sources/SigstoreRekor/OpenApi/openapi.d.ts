export interface paths {
    "/api/v1/index/retrieve": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Searches index by entry metadata
         * @deprecated
         * @description EXPERIMENTAL - this endpoint is offered as best effort only and may be changed or removed in future releases.
         *     The results returned from this endpoint may be incomplete.
         */
        post: operations["searchIndex"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/log": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get information about the current state of the transparency log
         * @description Returns the current root hash and size of the merkle tree used to store the log entries.
         */
        get: operations["getLogInfo"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/log/publicKey": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Retrieve the public key that can be used to validate the signed tree head
         * @description Returns the public key that can be used to validate the signed tree head
         */
        get: operations["getPublicKey"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/log/proof": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get information required to generate a consistency proof for the transparency log
         * @description Returns a list of hashes for specified tree sizes that can be used to confirm the consistency of the transparency log
         */
        get: operations["getLogProof"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/log/entries": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Retrieves an entry and inclusion proof from the transparency log (if it exists) by index */
        get: operations["getLogEntryByIndex"];
        put?: never;
        /**
         * Creates an entry in the transparency log
         * @description Creates an entry in the transparency log for a detached signature, public key, and content.
         */
        post: operations["createLogEntry"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/log/entries/{entryUUID}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get log entry and information required to generate an inclusion proof for the entry in the transparency log
         * @description Returns the entry, root hash, tree size, and a list of hashes that can be used to calculate proof of an entry being included in the transparency log
         */
        get: operations["getLogEntryByUUID"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/log/entries/retrieve": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Searches transparency log for one or more log entries */
        post: operations["searchLogQuery"];
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
        ProposedEntry: {
            kind: string;
        };
        /** @description Rekord object */
        rekord: {
            kind: "rekord";
        } & (Omit<components["schemas"]["ProposedEntry"], "kind"> & {
            apiVersion: string;
            /**
             * Rekor Schema
             * @description Schema for Rekord objects
             */
            spec: {
                /** @description Information about the detached signature associated with the entry */
                signature: {
                    /**
                     * @description Specifies the format of the signature
                     * @enum {string}
                     */
                    format: "pgp" | "minisign" | "x509" | "ssh";
                    /**
                     * Format: byte
                     * @description Specifies the content of the signature inline within the document
                     */
                    content: string;
                    /** @description The public key that can verify the signature */
                    publicKey: {
                        /**
                         * Format: byte
                         * @description Specifies the content of the public key inline within the document
                         */
                        content: string;
                    };
                };
                /** @description Information about the content associated with the entry */
                data: {
                    /** @description Specifies the hash algorithm and value for the content */
                    readonly hash?: {
                        /**
                         * @description The hashing function used to compute the hash value
                         * @enum {string}
                         */
                        algorithm: "sha256";
                        /** @description The hash value for the content */
                        value: string;
                    };
                    /**
                     * Format: byte
                     * @description Specifies the content inline within the document
                     */
                    content?: string;
                } & (unknown | unknown);
            };
        });
        /** @description Hashed Rekord object */
        hashedrekord: {
            kind: "hashedrekord";
        } & (Omit<components["schemas"]["ProposedEntry"], "kind"> & {
            apiVersion: string;
            /**
             * Hashedrekord Schema
             * @description Schema for Hashedrekord objects
             */
            spec: {
                /** @description Information about the detached signature associated with the entry */
                signature: {
                    /**
                     * Format: byte
                     * @description Specifies the content of the signature inline within the document
                     */
                    content?: string;
                    /** @description The public key that can verify the signature; this can also be an X509 code signing certificate that contains the raw public key information */
                    publicKey?: {
                        /**
                         * Format: byte
                         * @description Specifies the content of the public key or code signing certificate inline within the document
                         */
                        content?: string;
                    };
                };
                /** @description Information about the content associated with the entry */
                data: {
                    /** @description Specifies the hash algorithm and value for the content */
                    hash?: {
                        /**
                         * @description The hashing function used to compute the hash value
                         * @enum {string}
                         */
                        algorithm: "sha256" | "sha384" | "sha512";
                        /** @description The hash value for the content, as represented by a lower case hexadecimal string */
                        value: string;
                    };
                };
            };
        });
        /** @description RPM package */
        rpm: {
            kind: "rpm";
        } & (Omit<components["schemas"]["ProposedEntry"], "kind"> & {
            apiVersion: string;
            /**
             * RPM Schema
             * @description Schema for RPM objects
             */
            spec: {
                /** @description The PGP public key that can verify the RPM signature */
                publicKey: {
                    /**
                     * Format: byte
                     * @description Specifies the content of the public key inline within the document
                     */
                    content: string;
                };
                /** @description Information about the package associated with the entry */
                package: {
                    /** @description Values of the RPM headers */
                    readonly headers?: {
                        [key: string]: string;
                    };
                    /** @description Specifies the hash algorithm and value for the package */
                    hash?: {
                        /**
                         * @description The hashing function used to compute the hash value
                         * @enum {string}
                         */
                        algorithm: "sha256";
                        /** @description The hash value for the package */
                        value: string;
                    };
                    /**
                     * Format: byte
                     * @description Specifies the package inline within the document
                     */
                    content?: string;
                } & (unknown | unknown);
            };
        });
        /** @description TUF metadata */
        tuf: {
            kind: "tuf";
        } & (Omit<components["schemas"]["ProposedEntry"], "kind"> & {
            apiVersion: string;
            /**
             * TUF Schema
             * @description Schema for TUF metadata objects
             */
            spec: {
                /** @description TUF specification version */
                readonly spec_version?: string;
                /** @description TUF metadata */
                metadata: {
                    /** @description Specifies the metadata inline within the document */
                    content: {
                        [key: string]: unknown;
                    };
                };
                /** @description root metadata containing about the public keys used to sign the manifest */
                root: {
                    /** @description Specifies the metadata inline within the document */
                    content: {
                        [key: string]: unknown;
                    };
                };
            };
        });
        /** @description Alpine package */
        alpine: {
            kind: "alpine";
        } & (Omit<components["schemas"]["ProposedEntry"], "kind"> & {
            apiVersion: string;
            /**
             * Alpine Package Schema
             * @description Schema for Alpine package objects
             */
            spec: {
                /** @description The public key that can verify the package signature */
                publicKey: {
                    /**
                     * Format: byte
                     * @description Specifies the content of the public key inline within the document
                     */
                    content: string;
                };
                /** @description Information about the package associated with the entry */
                package: {
                    /** @description Values of the .PKGINFO key / value pairs */
                    readonly pkginfo?: {
                        [key: string]: string;
                    };
                    /** @description Specifies the hash algorithm and value for the package */
                    readonly hash?: {
                        /**
                         * @description The hashing function used to compute the hash value
                         * @enum {string}
                         */
                        algorithm: "sha256";
                        /** @description The hash value for the package */
                        value: string;
                    };
                    /**
                     * Format: byte
                     * @description Specifies the package inline within the document
                     */
                    content?: string;
                } & (unknown | unknown);
            };
        });
        /** @description Helm chart */
        helm: {
            kind: "helm";
        } & (Omit<components["schemas"]["ProposedEntry"], "kind"> & {
            apiVersion: string;
            /**
             * Helm Schema
             * @description Schema for Helm objects
             */
            spec: {
                /** @description The public key that can verify the package signature */
                publicKey: {
                    /**
                     * Format: byte
                     * @description Specifies the content of the public key inline within the document
                     */
                    content: string;
                };
                /** @description Information about the Helm chart associated with the entry */
                chart: {
                    /** @description Specifies the hash algorithm and value for the chart */
                    readonly hash?: {
                        /**
                         * @description The hashing function used to compute the hash value
                         * @enum {string}
                         */
                        algorithm: "sha256";
                        /** @description The hash value for the chart */
                        value: string;
                    };
                    /** @description The provenance entry associated with the signed Helm Chart */
                    provenance: {
                        /** @description Information about the included signature in the provenance file */
                        readonly signature?: {
                            /**
                             * Format: byte
                             * @description Specifies the signature embedded within the provenance file
                             */
                            readonly content: string;
                        };
                        /**
                         * Format: byte
                         * @description Specifies the content of the provenance file inline within the document
                         */
                        content?: string;
                    } & (unknown | unknown);
                };
            };
        });
        /** @description Intoto object */
        intoto: {
            kind: "intoto";
        } & (Omit<components["schemas"]["ProposedEntry"], "kind"> & {
            apiVersion: string;
            /**
             * Intoto Schema
             * @description Intoto for Rekord objects
             */
            spec: {
                content: {
                    /** @description envelope */
                    envelope?: string;
                    /** @description Specifies the hash algorithm and value encompassing the entire signed envelope; this is computed by the rekor server, client-provided values are ignored */
                    readonly hash?: {
                        /**
                         * @description The hashing function used to compute the hash value
                         * @enum {string}
                         */
                        algorithm: "sha256";
                        /** @description The hash value for the archive */
                        value: string;
                    };
                    /** @description Specifies the hash algorithm and value covering the payload within the DSSE envelope; this is computed by the rekor server, client-provided values are ignored */
                    readonly payloadHash?: {
                        /**
                         * @description The hashing function used to compute the hash value
                         * @enum {string}
                         */
                        algorithm: "sha256";
                        /** @description The hash value for the envelope's payload */
                        value: string;
                    };
                };
                /**
                 * Format: byte
                 * @description The public key that can verify the signature
                 */
                publicKey: string;
            } | {
                content: {
                    /** @description dsse envelope */
                    envelope: {
                        /**
                         * Format: byte
                         * @description payload of the envelope
                         */
                        payload?: string;
                        /** @description type describing the payload */
                        payloadType: string;
                        /** @description collection of all signatures of the envelope's payload */
                        signatures: {
                            /** @description optional id of the key used to create the signature */
                            keyid?: string;
                            /**
                             * Format: byte
                             * @description signature of the payload
                             */
                            sig: string;
                            /**
                             * Format: byte
                             * @description public key that corresponds to this signature
                             */
                            publicKey: string;
                        }[];
                    };
                    /** @description Specifies the hash algorithm and value encompassing the entire signed envelope */
                    readonly hash?: {
                        /**
                         * @description The hashing function used to compute the hash value
                         * @enum {string}
                         */
                        algorithm: "sha256";
                        /** @description The hash value for the archive */
                        value: string;
                    };
                    /** @description Specifies the hash algorithm and value covering the payload within the DSSE envelope */
                    readonly payloadHash?: {
                        /**
                         * @description The hashing function used to compute the hash value
                         * @enum {string}
                         */
                        algorithm: "sha256";
                        /** @description The hash value of the payload */
                        value: string;
                    };
                };
            };
        });
        /** @description COSE object */
        cose: {
            kind: "cose";
        } & (Omit<components["schemas"]["ProposedEntry"], "kind"> & {
            apiVersion: string;
            /**
             * COSE Schema
             * @description COSE for Rekord objects
             */
            spec: {
                /**
                 * Format: byte
                 * @description The COSE Sign1 Message
                 */
                message?: string;
                /**
                 * Format: byte
                 * @description The public key that can verify the signature
                 */
                publicKey: string;
                /** @description Information about the content associated with the entry */
                data?: {
                    /** @description Specifies the hash algorithm and value for the content */
                    readonly payloadHash?: {
                        /**
                         * @description The hashing function used to compute the hash value
                         * @enum {string}
                         */
                        algorithm: "sha256";
                        /** @description The hash value for the content */
                        value: string;
                    };
                    /** @description Specifies the hash algorithm and value for the COSE envelope */
                    readonly envelopeHash?: {
                        /**
                         * @description The hashing function used to compute the hash value
                         * @enum {string}
                         */
                        algorithm: "sha256";
                        /** @description The hash value for the envelope */
                        value: string;
                    };
                    /**
                     * Format: byte
                     * @description Specifies the additional authenticated data required to verify the signature
                     */
                    aad?: string;
                };
            };
        });
        /** @description Java Archive (JAR) */
        jar: {
            kind: "jar";
        } & (Omit<components["schemas"]["ProposedEntry"], "kind"> & {
            apiVersion: string;
            /**
             * JAR Schema
             * @description Schema for JAR objects
             */
            spec: {
                /** @description Information about the included signature in the JAR file */
                signature?: {
                    /**
                     * Format: byte
                     * @description Specifies the PKCS7 signature embedded within the JAR file
                     */
                    readonly content: string;
                    /** @description The X509 certificate containing the public key JAR which verifies the signature of the JAR */
                    readonly publicKey: {
                        /**
                         * Format: byte
                         * @description Specifies the content of the X509 certificate containing the public key used to verify the signature
                         */
                        content: string;
                    };
                };
                /** @description Information about the archive associated with the entry */
                archive: {
                    /** @description Specifies the hash algorithm and value encompassing the entire signed archive */
                    hash?: {
                        /**
                         * @description The hashing function used to compute the hash value
                         * @enum {string}
                         */
                        algorithm: "sha256";
                        /** @description The hash value for the archive */
                        value: string;
                    };
                    /**
                     * Format: byte
                     * @description Specifies the archive inline within the document
                     */
                    content?: string;
                } & (unknown | unknown);
            };
        });
        /** @description RFC3161 Timestamp */
        rfc3161: {
            kind: "rfc3161";
        } & (Omit<components["schemas"]["ProposedEntry"], "kind"> & {
            apiVersion: string;
            /**
             * Timestamp Schema
             * @description Schema for RFC 3161 timestamp objects
             */
            spec: {
                /** @description Information about the tsr file associated with the entry */
                tsr: {
                    /**
                     * Format: byte
                     * @description Specifies the tsr file content inline within the document
                     */
                    content: string;
                };
            };
        });
        /** @description DSSE envelope */
        dsse: {
            kind: "dsse";
        } & (Omit<components["schemas"]["ProposedEntry"], "kind"> & {
            apiVersion: string;
            /**
             * DSSE Schema
             * @description log entry schema for dsse envelopes
             */
            spec: {
                proposedContent?: {
                    /** @description DSSE envelope specified as a stringified JSON object */
                    envelope: string;
                    /** @description collection of all verification material (e.g. public keys or certificates) used to verify signatures over envelope's payload, specified as base64-encoded strings */
                    verifiers: string[];
                };
                /** @description extracted collection of all signatures of the envelope's payload; elements will be sorted by lexicographical order of the base64 encoded signature strings */
                readonly signatures?: {
                    /** @description base64 encoded signature of the payload */
                    signature: string;
                    /**
                     * Format: byte
                     * @description verification material that was used to verify the corresponding signature, specified as a base64 encoded string
                     */
                    verifier: string;
                }[];
                /** @description Specifies the hash algorithm and value encompassing the entire envelope sent to Rekor */
                readonly envelopeHash?: {
                    /**
                     * @description The hashing function used to compute the hash value
                     * @enum {string}
                     */
                    algorithm: "sha256";
                    /** @description The value of the computed digest over the entire envelope */
                    value: string;
                };
                /** @description Specifies the hash algorithm and value covering the payload within the DSSE envelope */
                readonly payloadHash?: {
                    /**
                     * @description The hashing function used to compute the hash value
                     * @enum {string}
                     */
                    algorithm: "sha256";
                    /** @description The value of the computed digest over the payload within the envelope */
                    value: string;
                };
            } & (unknown | unknown);
        });
        LogEntry: {
            [key: string]: {
                /** @description This is the SHA256 hash of the DER-encoded public key for the log at the time the entry was included in the log */
                logID: string;
                logIndex: number;
                body: {
                    [key: string]: unknown;
                };
                /** @description The time the entry was added to the log as a Unix timestamp in seconds */
                integratedTime: number;
                /** Format: byte */
                attestation?: {
                    /** Format: byte */
                    data?: unknown;
                };
                verification?: {
                    inclusionProof?: components["schemas"]["InclusionProof"];
                    /**
                     * Format: byte
                     * @description Signature over the logID, logIndex, body and integratedTime.
                     */
                    signedEntryTimestamp?: string;
                };
            };
        };
        SearchIndex: {
            /** Format: email */
            email?: string;
            /** @description A SAN value (URI, DNS, IP, OtherName) as stored on the entry. Lookup is case-insensitive — e.g. a GitHub OIDC SAN such as `https://github.com/owner/repo/.github/workflows/build.yml@refs/heads/main`. */
            subject?: string;
            publicKey?: {
                /** @enum {string} */
                format: "pgp" | "x509" | "minisign" | "ssh" | "tuf";
                /** Format: byte */
                content?: string;
            };
            hash?: string;
            /** @enum {string} */
            operator?: "and" | "or";
        };
        SearchLogQuery: {
            entryUUIDs?: string[];
            logIndexes?: number[];
            entries?: components["schemas"]["ProposedEntry"][];
        };
        LogInfo: {
            /** @description The current hash value stored at the root of the merkle tree */
            rootHash: string;
            /** @description The current number of nodes in the merkle tree */
            treeSize: number;
            /**
             * Format: signedCheckpoint
             * @description The current signed tree head
             */
            signedTreeHead: string;
            /** @description The current treeID */
            treeID: string;
            inactiveShards?: components["schemas"]["InactiveShardLogInfo"][];
        };
        InactiveShardLogInfo: {
            /** @description The current hash value stored at the root of the merkle tree */
            rootHash: string;
            /** @description The current number of nodes in the merkle tree */
            treeSize: number;
            /**
             * Format: signedCheckpoint
             * @description The current signed tree head
             */
            signedTreeHead: string;
            /** @description The current treeID */
            treeID: string;
        };
        ConsistencyProof: {
            /** @description The hash value stored at the root of the merkle tree at the time the proof was generated */
            rootHash: string;
            hashes: string[];
        };
        InclusionProof: {
            /** @description The index of the entry in the transparency log */
            logIndex: number;
            /** @description The hash value stored at the root of the merkle tree at the time the proof was generated */
            rootHash: string;
            /** @description The size of the merkle tree at the time the inclusion proof was generated */
            treeSize: number;
            /** @description A list of hashes required to compute the inclusion proof, sorted in order from leaf to root */
            hashes: string[];
            /**
             * Format: signedCheckpoint
             * @description The checkpoint (signed tree head) that the inclusion proof is based on
             */
            checkpoint: string;
        };
        Error: {
            code?: number;
            message?: string;
        };
    };
    responses: {
        /** @description The content supplied to the server was invalid */
        BadContent: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["Error"];
            };
        };
        /** @description The request conflicts with the current state of the transparency log */
        Conflict: {
            headers: {
                Location?: string;
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["Error"];
            };
        };
        /** @description The content requested could not be found */
        NotFound: {
            headers: {
                [name: string]: unknown;
            };
            content?: never;
        };
        /** @description There was an internal error in the server while processing the request */
        InternalServerError: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["Error"];
            };
        };
        /** @description The server understood the request but is unable to process the contained instructions */
        UnprocessableEntity: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["Error"];
            };
        };
    };
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    searchIndex: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SearchIndex"];
            };
        };
        responses: {
            /** @description Returns zero or more entry UUIDs from the transparency log based on search query */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": string[];
                };
            };
            400: components["responses"]["BadContent"];
            default: components["responses"]["InternalServerError"];
        };
    };
    getLogInfo: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description A JSON object with the root hash and tree size as properties */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LogInfo"];
                };
            };
            default: components["responses"]["InternalServerError"];
        };
    };
    getPublicKey: {
        parameters: {
            query?: {
                /** @description The tree ID of the tree you wish to get a public key for */
                treeID?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The public key */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/x-pem-file": string;
                };
            };
            default: components["responses"]["InternalServerError"];
        };
    };
    getLogProof: {
        parameters: {
            query: {
                /** @description The size of the tree that you wish to prove consistency from (1 means the beginning of the log) Defaults to 1 if not specified */
                firstSize?: number;
                /** @description The size of the tree that you wish to prove consistency to */
                lastSize: number;
                /** @description The tree ID of the tree that you wish to prove consistency for */
                treeID?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description All hashes required to compute the consistency proof */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ConsistencyProof"];
                };
            };
            400: components["responses"]["BadContent"];
            default: components["responses"]["InternalServerError"];
        };
    };
    getLogEntryByIndex: {
        parameters: {
            query: {
                /** @description specifies the index of the entry in the transparency log to be retrieved */
                logIndex: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description the entry in the transparency log requested along with an inclusion proof */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LogEntry"];
                };
            };
            404: components["responses"]["NotFound"];
            default: components["responses"]["InternalServerError"];
        };
    };
    createLogEntry: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ProposedEntry"];
            };
        };
        responses: {
            /** @description Returns the entry created in the transparency log */
            201: {
                headers: {
                    /** @description UUID of log entry */
                    ETag?: string;
                    /** @description URI location of log entry */
                    Location?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LogEntry"];
                };
            };
            400: components["responses"]["BadContent"];
            409: components["responses"]["Conflict"];
            default: components["responses"]["InternalServerError"];
        };
    };
    getLogEntryByUUID: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description the UUID of the entry for which the inclusion proof information should be returned */
                entryUUID: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Information needed for a client to compute the inclusion proof */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LogEntry"];
                };
            };
            404: components["responses"]["NotFound"];
            default: components["responses"]["InternalServerError"];
        };
    };
    searchLogQuery: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SearchLogQuery"];
            };
        };
        responses: {
            /** @description Returns zero or more entries from the transparency log, according to how many were included in request query */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LogEntry"][];
                };
            };
            400: components["responses"]["BadContent"];
            422: components["responses"]["UnprocessableEntity"];
            default: components["responses"]["InternalServerError"];
        };
    };
}
