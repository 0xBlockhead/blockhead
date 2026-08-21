export interface paths {
    "/v1/attestations/{messageHash}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get an attestation
         * @description Retrieves the signed attestation for a USDC burn event on the source chain.
         */
        get: operations["getAttestation"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/publicKeys": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List attestation public keys
         * @description Retrieves a list of the currently active public keys for verifying attestation signatures.
         */
        get: operations["getPublicKeys"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/messages/{sourceDomainId}/{transactionHash}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get a list of messages
         * @description Retrieves message and attestation details for CCTP V1 messages.
         */
        get: operations["getMessages"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/publicKeys": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get public keys
         * @description Returns the public keys for validating attestations across all supported versions of CCTP.
         */
        get: operations["getPublicKeysV2"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/messages/{sourceDomainId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get messages and attestations
         * @description Retrieves messages and attestations for a given transaction hash or nonce. Each message for a given transaction hash is ordered by ascending log index.
         */
        get: operations["getMessagesV2"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/reattest/{nonce}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Re-attest a pre-finality message
         * @description The re-attestation flow allows the relayer to obtain a higher level of finality than was originally requested on the source chain, while still being forced to pay the fee since allowance was reserved. This flow resolves the case where a sender specifies a finality threshold lower than the destination chain recipient requires.
         */
        post: operations["reattestMessage"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/fastBurn/USDC/allowance": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get USDC Fast Transfer allowance
         * @description Retrieves the available USDC Fast Transfer allowance remaining.
         */
        get: operations["getFastBurnUsdcAllowance"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/burn/USDC/fees/{sourceDomainId}/{destDomainId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get USDC transfer fees
         * @description Retrieves the applicable fees for a USDC transfer between the specified source and destination domains. The fee is returned in basis points (1 = 0.01%).
         */
        get: operations["getBurnUsdcFees"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/quote/burn/usdc/{sourceDomainId}/{destDomainId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Create a USDC transfer quote
         * @description Returns a signed, time-bound fee quote for a native USDC transfer. A quote prices the fees a caller must pay and includes a `signedQuote` blob that the `TokenMessengerWithFees` contract verifies onchain.
         *
         *     The `requests` array selects which fees to price: a `FORWARD` request prices destination-chain forwarding, while a `PRE_FINALITY` request prices faster-than-finality settlement. Include at most one request per type.
         */
        post: operations["createUsdcBurnQuote"];
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
         * @description Status of the attestation, whether it is signed or awaiting more block confirmations.
         * @enum {string}
         */
        AttestationStatus: "complete" | "pending_confirmations";
        /**
         * GetAttestationSuccessResponse
         * @description Signed or pending attestation.
         */
        GetAttestationV1Response: {
            /**
             * @description Signed attestation corresponding to the given `messageHash` parameter. This is null if the event has been seen but the attestation is still pending block confirmations.
             * @example 0x6edd90f4a0ad0212fd9fbbd5058a25aa8ee10ce77e4fc143567bbe73fb6e164f384a3e14d350c8a4fc50b781177297e03c16b304e8d7656391df0f59a75a271f1b
             */
            attestation?: string | null;
            status: components["schemas"]["AttestationStatus"];
        };
        /**
         * Format: uuid
         * @description A unique identifier, which can be helpful for identifying a request when communicating with Circle support.
         * @example 2adba88e-9d63-44bc-b975-9b6ae3440dde
         */
        XRequestId: string;
        /** @description An array of public keys as strings. */
        PublicKeysV1Response: {
            publicKeys: string[];
        };
        /**
         * @description The nonce associated with the message.
         * @example 9682
         */
        MessageNonce: string;
        MessageV1: {
            /**
             * @description Signed attestation. This is 'PENDING' if the event has been seen but the attestation is still pending block confirmations.
             * @example 0x6edd90f4a0ad0212fd9fbbd5058a25aa8ee10ce77e4fc143567bbe73fb6e164f384a3e14d350c8a4fc50b781177297e03c16b304e8d7656391df0f59a75a271f1b
             */
            attestation: string;
            /**
             * @description Raw message bytes returned in hex format.
             * @example 0x00000000000000050000000300000000000194c2a65fc943419a5ad590042fd67c9791fd015acf53a54cc823edb8ff81b9ed722e00000000000000000000000019330d10d9cc8751218eaf51e8885d058642e08a000000000000000000000000fc05ad74c6fe2e7046e091d6ad4f660d2a15976200000000c6fa7af3bedbad3a3d65f36aabc97431b1bbe4c2d2f6e0e47ca60203452f5d610000000000000000000000002d475f4746419c83be23056309a8e2ac33b30e3b0000000000000000000000000000000000000000000000000000000002b67df0feae5e08f5e6bf04d8c1de7dada9235c56996f4420b14371d6c6f3ddd2f2da78
             */
            message: string;
            eventNonce: components["schemas"]["MessageNonce"];
        };
        /**
         * GetMessagesResponse
         * @description CCTP messages corresponding to a given transaction hash and source domain ID.
         */
        MessagesV1Response: {
            messages: components["schemas"]["MessageV1"][];
        };
        /**
         * @example 2
         * @enum {integer}
         */
        CctpVersion: 1 | 2;
        PublicKey: {
            /** @example 0x04fc192351b97838713efbc63351e3b71607cc7fc0a74fadaa12d39a693713529bf392c0eeaff62eff2f06b47a4c7cd5f83159e4145444f817d5e7f24e256c6278 */
            publicKey?: string;
            cctpVersion?: components["schemas"]["CctpVersion"];
        };
        /** GetPublicKeysResponse */
        PublicKeysV2Response: {
            publicKeys?: components["schemas"]["PublicKey"][];
        };
        /**
         * @description The ID of a CCTP domain.
         * @example 0
         */
        DomainId: string;
        /**
         * @description Blockchain generated unique identifier, associated with wallet (account), smart contract or other blockchain objects.
         * @example 0xca9142d0b9804ef5e239d3bc1c7aa0d1c74e7350
         */
        Address: string;
        /** @description Decoded representation of the message body. Null or empty if decoding fails or is not applicable. */
        DecodedMessageBodyV2: {
            burnToken?: components["schemas"]["Address"];
            mintRecipient?: components["schemas"]["Address"];
            /**
             * @description Amount of burned tokens
             * @example 10000
             */
            amount?: string;
            messageSender?: components["schemas"]["Address"];
            /**
             * @description Maximum fee to pay on the destination domain, specified in units of `burnToken`.
             * @example 1000
             */
            maxFee?: string;
            /**
             * @description Actual fee charged on the destination domain, specified in units of `burnToken`.
             * @example 1000
             */
            feeExecuted?: string;
            /**
             * @description Block number at which the message expires.
             * @example 12345678
             */
            expirationBlock?: string;
            /** @description Arbitrary data to be included in the `depositForBurn` on source domain that is executed on destination domain. */
            hookData?: string;
        } | null;
        /** @description Decoded representation of the message. Null or empty if decoding fails. */
        DecodedMessageV2: {
            sourceDomain?: components["schemas"]["DomainId"];
            destinationDomain?: components["schemas"]["DomainId"];
            nonce?: components["schemas"]["MessageNonce"];
            sender?: components["schemas"]["Address"];
            recipient?: components["schemas"]["Address"];
            destinationCaller?: components["schemas"]["Address"];
            /**
             * @description Minimum finality threshold before allowed to attest.
             * @enum {string}
             */
            minFinalityThreshold?: "1000" | "2000";
            /**
             * @description Actual finality threshold executed from source chain.
             * @enum {string}
             */
            finalityThresholdExecuted?: "1000" | "2000";
            /** @description Application-specific message to be handled by recipient. */
            messageBody?: string;
            decodedMessageBody?: components["schemas"]["DecodedMessageBodyV2"];
        } | null;
        /**
         * @description Reason for message processing delay.
         * @enum {string|null}
         */
        DelayReason: "insufficient_fee" | "amount_above_max" | "insufficient_allowance_available" | null;
        /**
         * @description The state of the forward transaction.
         * @example PENDING
         */
        ForwardState: string;
        MessageV2: {
            /**
             * @description The hex-encoded message. `0x` if the attestation is not yet available.
             * @example 0x00000000000000050000000300000000000194c2a65fc943419a5ad590042fd67c9791fd015acf53a54cc823edb8ff81b9ed722e00000000000000000000000019330d10d9cc8751218eaf51e8885d058642e08a000000000000000000000000fc05ad74c6fe2e7046e091d6ad4f660d2a15976200000000c6fa7af3bedbad3a3d65f36aabc97431b1bbe4c2d2f6e0e47ca60203452f5d610000000000000000000000002d475f4746419c83be23056309a8e2ac33b30e3b0000000000000000000000000000000000000000000000000000000002b67df0feae5e08f5e6bf04d8c1de7dada9235c56996f4420b14371d6c6f3ddd2f2da78
             */
            message?: string;
            eventNonce?: components["schemas"]["MessageNonce"];
            /**
             * @description The attestation. `PENDING` if the attestation is not yet available.
             * @example 0x6edd90f4a0ad0212fd9fbbd5058a25aa8ee10ce77e4fc143567bbe73fb6e164f384a3e14d350c8a4fc50b781177297e03c16b304e8d7656391df0f59a75a271f1b
             */
            attestation?: string | null;
            decodedMessage?: components["schemas"]["DecodedMessageV2"];
            cctpVersion?: components["schemas"]["CctpVersion"];
            status?: components["schemas"]["AttestationStatus"];
            delayReason?: components["schemas"]["DelayReason"];
            forwardState?: components["schemas"]["ForwardState"];
            /**
             * @description The transaction hash of the forward transaction.
             * @example 0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890
             */
            forwardTxHash?: string;
        };
        /** GetMessagesResponse */
        MessagesV2Response: {
            messages: components["schemas"]["MessageV2"][];
            /**
             * @description The source burn transaction hash, shared by all messages in the response.
             * @example 0x912f22a13e9ccb979b621500f6952b2afd6e75be7eadaed93fc2625fe11c52a2
             */
            sourceTxHash: string;
        };
        /** ReattestMessageResponse */
        ReattestationResponseV2: {
            /**
             * @description Confirmation that the re-attestation process has started.
             * @example Re-attestation successfully requested for nonce.
             */
            message?: string;
            nonce?: components["schemas"]["MessageNonce"];
        };
        /**
         * Format: date-time
         * @description A UTC timestamp in ISO 8601 format, representing the date and time of an event.
         * @example 2025-01-23T10:00:00Z
         */
        UtcTimestamp: string;
        /** GetFastBurnUSDCAllowanceResponse */
        USDCFastBurnAllowanceResponseV2: {
            /**
             * @description The current USDC Fast Burn allowance remaining, in full units of USDC up to 6 decimals.
             * @example 123999.999999
             */
            allowance?: number;
            lastUpdated?: components["schemas"]["UtcTimestamp"];
        };
        /**
         * GetBurnUSDCFeesResponse
         * @example [
         *       {
         *         "finalityThreshold": 1000,
         *         "minimumFee": 1,
         *         "forwardFee": {
         *           "low": 90,
         *           "medium": 110,
         *           "high": 160
         *         }
         *       },
         *       {
         *         "finalityThreshold": 2000,
         *         "minimumFee": 0,
         *         "forwardFee": {
         *           "low": 90,
         *           "medium": 110,
         *           "high": 160
         *         }
         *       }
         *     ]
         */
        USDCBurnFeesResponseV2: {
            /** @description The finality threshold, such as block confirmations, used to determine whether the transfer qualifies as a Fast or Standard Transfer. */
            finalityThreshold: number;
            /** @description Minimum fees for the transfer, expressed in basis points (bps). For example, 1 = 0.01%. */
            minimumFee: number;
            /** @description Gas and forwarding fees for using the Circle Forwarder in USDC minor units. */
            forwardFee?: {
                /**
                 * @description The low gas estimate plus forwarding fee.
                 * @example 90
                 */
                low?: number;
                /**
                 * @description The medium gas estimate plus forwarding fee.
                 * @example 110
                 */
                medium?: number;
                /**
                 * @description The high gas estimate plus forwarding fee.
                 * @example 160
                 */
                high?: number;
            };
        }[];
        /**
         * CreateUsdcBurnQuoteRequest
         * @description Specifies the transfer amount, fee token, and fees to price for a USDC transfer quote.
         */
        CreateUsdcBurnQuoteRequest: {
            /**
             * @description The transfer amount in USDC minor units, as a positive decimal integer string.
             * @example 1000000
             */
            amount: string;
            /**
             * @description The token used to pay fees, as a source-chain EVM address. Defaults to the zero address, which requests fees in the source-chain native gas token.
             * @default 0x0000000000000000000000000000000000000000
             */
            feeToken: string;
            /**
             * @description The fees to price. Include a `FORWARD` request, a `PRE_FINALITY` request, or both. Each type may appear at most once.
             * @example [
             *       {
             *         "type": "FORWARD"
             *       },
             *       {
             *         "type": "PRE_FINALITY"
             *       }
             *     ]
             */
            requests: ({
                /**
                 * @description Requests a Forwarding Service fee. The destination blockchain must support the Forwarding Service.
                 * @enum {string}
                 */
                type: "FORWARD";
                /** @description Forwarding parameters. Defaults to an empty object. */
                params?: {
                    /** @description Optional hook data to execute on the destination chain, as 0x-prefixed even-length hexadecimal. If supplied, it must contain forwarding hook data (with `cctp-forward` magic bytes). Omit to price the destination chain's default forwarding behavior. */
                    hookData?: string;
                    /**
                     * @description The address authorized to finalize the transfer on the destination chain, as a 20-byte EVM address or a 32-byte value. Defaults to the zero address, which authorizes any caller.
                     * @default 0x0000000000000000000000000000000000000000
                     */
                    destinationCaller: string;
                };
            } | {
                /**
                 * @description Requests a Fast Transfer fee. The source blockchain must support Fast Transfer.
                 * @enum {string}
                 */
                type: "PRE_FINALITY";
            })[];
        };
        /**
         * UsdcBurnQuoteResponse
         * @description A signed, time-bound fee quote for a USDC transfer.
         */
        UsdcBurnQuoteResponse: {
            /**
             * @description The signed quote blob to submit to the `TokenMessengerWithFees` contract.
             * @example 0xabcdef
             */
            signedQuote: string;
            /**
             * @description The server time the quote was issued, as a Unix timestamp in seconds. Compute remaining validity relative to this value rather than the client clock.
             * @example 1735689540
             */
            issuedAt: number;
            /** @description The quote's expiry. The `mode` field discriminates the shape: `TIMESTAMP` exposes an exact wall-clock `expiresAt`, while `BLOCK_NUMBER` exposes the authoritative onchain `expiresAtBlock` alongside an advisory `blockEstimatedAt`. */
            expiry: {
                /**
                 * @description The expiry encoding used by this quote.
                 * @enum {string}
                 */
                mode: "TIMESTAMP";
                /**
                 * @description The exact wall-clock time at which the quote expires, as a Unix timestamp in seconds.
                 * @example 1735689600
                 */
                expiresAt: number;
            } | {
                /**
                 * @description The expiry encoding used by this quote.
                 * @enum {string}
                 */
                mode: "BLOCK_NUMBER";
                /**
                 * @description The authoritative source-chain block at which the quote expires.
                 * @example 21000000
                 */
                expiresAtBlock: number;
                /**
                 * @description An advisory wall-clock estimate of when `expiresAtBlock` is reached, as a Unix timestamp in seconds, assuming the configured block time.
                 * @example 1735689600
                 */
                blockEstimatedAt: number;
            };
            /**
             * @description The total fee across all items, in the fee token's minor units, as a decimal integer string.
             * @example 1000
             */
            feeTotalAmount: string;
            /**
             * @description The token the fees are denominated in, as a source-chain EVM address.
             * @example 0x0000000000000000000000000000000000000000
             */
            feeToken: string;
            /** @description The individual fees that sum to `feeTotalAmount`, one per fee type. */
            items: {
                /**
                 * @description The fee category this item prices.
                 * @enum {string}
                 */
                type: "FORWARD" | "PRE_FINALITY";
                /**
                 * @description The fee amount in the fee token's minor units, as a decimal integer string.
                 * @example 1000
                 */
                amount: string;
                /**
                 * @description The ABI-encoded arguments the `TokenMessengerWithFees` contract verifies for this item.
                 * @example [
                 *       "0x0000000000000000000000000000000000000000000000000000000000000001"
                 *     ]
                 */
                args: string[];
                /**
                 * @description The keccak-256 hash of `args` as a 32-byte hexadecimal string.
                 * @example 0x1234567890123456789012345678901234567890123456789012345678901234
                 */
                argsHash: string;
            }[];
            /**
             * @description Reserved for future use as a unique identifier for the quote. The `TokenMessengerWithFees` contract currently enforces a zero nonce.
             * @example 0
             */
            nonce: string;
            /** @description Optional pricing metadata. Present when exchange-rate conversion was applied. */
            metadata?: {
                exchangeRates: {
                    /**
                     * @description The USD price of the fee token used for conversion.
                     * @example 1.00
                     */
                    feeTokenUsd: string;
                    /**
                     * @description The USD price of the destination token used for conversion.
                     * @example 1.00
                     */
                    destinationTokenUsd: string;
                };
            };
        };
        /**
         * QuoteErrorResponse
         * @description A Quote API error.
         */
        QuoteErrorResponse: {
            /**
             * @description A stable, client-facing error identifier.
             * @example VALIDATION_ERROR
             * @enum {string}
             */
            errorCode: "UNKNOWN_DOMAIN" | "UNSUPPORTED_ROUTE" | "UNSUPPORTED_FEE_TOKEN" | "SERVICE_NOT_CONFIGURED" | "SERVICE_NOT_ENABLED" | "RPC_UNAVAILABLE" | "PRICING_UNAVAILABLE" | "PRE_FINALITY_UNAVAILABLE" | "PRE_FINALITY_INSUFFICIENT_ALLOWANCE" | "INVALID_PAYLOAD" | "UNAUTHORIZED_TRANSACTION_TYPE" | "UNSUPPORTED_CHAIN" | "UNSUPPORTED_WORKFLOW" | "VALIDATION_ERROR";
            /**
             * @description A human-readable description of the error.
             * @example Source and destination domain cannot be the same
             */
            error: string;
        };
    };
    responses: {
        /** @description Specified resource was not found. */
        NotFound: {
            headers: {
                "X-Request-Id": components["headers"]["XRequestId"];
                [name: string]: unknown;
            };
            content: {
                "application/json": {
                    /** @description Code that corresponds to the error. */
                    code: number;
                    /** @description Message that describes the error. */
                    message: string;
                };
            };
        };
        /** @description Request cannot be processed due to a client error. */
        BadRequest: {
            headers: {
                "X-Request-Id": components["headers"]["XRequestId"];
                [name: string]: unknown;
            };
            content: {
                "application/json": {
                    /** @description Code that corresponds to the error. */
                    code: number;
                    /** @description Message that describes the error. */
                    message: string;
                };
            };
        };
    };
    parameters: {
        /** @description Message hash for the message being bridged. This can be generated using the `keccak256` hash of the message bytes emitted by the `MessageSent` event. */
        MessageHashPath: string;
        /** @description Source domain identifier for a blockchain on CCTP. */
        SourceDomainIdPath: number;
        /** @description Transaction hash that contains the message being transferred. */
        TransactionHashPath: string;
        /** @description The transaction hash to filter messages. At least one of `transactionHash` or `nonce` is required. */
        TransactionHashQuery: string;
        /** @description The nonce to filter messages. At least one of `transactionHash` or `nonce` is required. */
        NonceQuery: string;
        /** @description The nonce of the pre-finality message to re-attest as finalized. */
        NoncePath: string;
        /** @description Destination domain identifier for a blockchain on CCTP. */
        DestinationDomainIdPath: number;
    };
    requestBodies: never;
    headers: {
        /** @description Developer-provided header parameter or Circle-generated universally unique identifier (UUID v4). Useful for identifying a specific request when communicating with Circle Support. */
        XRequestId: components["schemas"]["XRequestId"];
    };
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    getAttestation: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Message hash for the message being bridged. This can be generated using the `keccak256` hash of the message bytes emitted by the `MessageSent` event. */
                messageHash: components["parameters"]["MessageHashPath"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successfully retrieved either the signed attestation or the message is still pending block confirmations. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GetAttestationV1Response"];
                };
            };
            404: components["responses"]["NotFound"];
        };
    };
    getPublicKeys: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successfully retrieved public keys. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PublicKeysV1Response"];
                };
            };
        };
    };
    getMessages: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Source domain identifier for a blockchain on CCTP. */
                sourceDomainId: components["parameters"]["SourceDomainIdPath"];
                /** @description Transaction hash that contains the message being transferred. */
                transactionHash: components["parameters"]["TransactionHashPath"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successfully retrieved messages for the given domain and transaction hash. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MessagesV1Response"];
                };
            };
            404: components["responses"]["NotFound"];
        };
    };
    getPublicKeysV2: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successfully retrieved a list of public keys with their respective CCTP versions. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PublicKeysV2Response"];
                };
            };
            400: components["responses"]["BadRequest"];
        };
    };
    getMessagesV2: {
        parameters: {
            query?: {
                /** @description The transaction hash to filter messages. At least one of `transactionHash` or `nonce` is required. */
                transactionHash?: components["parameters"]["TransactionHashQuery"];
                /** @description The nonce to filter messages. At least one of `transactionHash` or `nonce` is required. */
                nonce?: components["parameters"]["NonceQuery"];
            };
            header?: never;
            path: {
                /** @description Source domain identifier for a blockchain on CCTP. */
                sourceDomainId: components["parameters"]["SourceDomainIdPath"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successfully retrieved messages. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MessagesV2Response"];
                };
            };
            400: components["responses"]["BadRequest"];
            404: components["responses"]["NotFound"];
        };
    };
    reattestMessage: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description The nonce of the pre-finality message to re-attest as finalized. */
                nonce: components["parameters"]["NoncePath"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successfully started the re-attestation process. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReattestationResponseV2"];
                };
            };
            400: components["responses"]["BadRequest"];
            404: components["responses"]["NotFound"];
        };
    };
    getFastBurnUsdcAllowance: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successfully retrieved the available USDC Fast Burn allowance. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["USDCFastBurnAllowanceResponseV2"];
                };
            };
        };
    };
    getBurnUsdcFees: {
        parameters: {
            query?: {
                /** @description Whether to include fees for using the Circle Forwarder in the return value. */
                forward?: boolean;
                /** @description Whether to include the forwarding fee for depositing into HyperCore in the return value. This parameter should only be used if the `forward` parameter is set to `true` and the destination domain is HyperEVM. */
                hyperCoreDeposit?: boolean;
            };
            header?: never;
            path: {
                /** @description Source domain identifier for a blockchain on CCTP. */
                sourceDomainId: components["parameters"]["SourceDomainIdPath"];
                /** @description Destination domain identifier for a blockchain on CCTP. */
                destDomainId: components["parameters"]["DestinationDomainIdPath"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successfully retrieved the USDC transfer fees. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["USDCBurnFeesResponseV2"];
                };
            };
            400: components["responses"]["BadRequest"];
            404: components["responses"]["NotFound"];
        };
    };
    createUsdcBurnQuote: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /**
                 * @description Source domain identifier for the blockchain the transfer starts from. Must be an EVM blockchain where upfront fees are supported, and must satisfy the applicable source-side requirements for included request types. For example, a `PRE_FINALITY` request requires a source blockchain where Fast Transfer is supported.
                 * @example 0
                 */
                sourceDomainId: number;
                /**
                 * @description Destination domain identifier for the blockchain the transfer settles on. Must differ from `sourceDomainId` and must satisfy the applicable destination-side requirements for included request types. For example, a `FORWARD` request requires a destination blockchain where the Forwarding Service is supported.
                 * @example 1
                 */
                destDomainId: number;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateUsdcBurnQuoteRequest"];
            };
        };
        responses: {
            /** @description Successfully created a signed USDC transfer quote. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UsdcBurnQuoteResponse"];
                };
            };
            /** @description The request is invalid, references an unknown domain or fee token, or specifies an unsupported route. */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["QuoteErrorResponse"];
                };
            };
            /** @description The requested transaction type is not authorized for this route. */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["QuoteErrorResponse"];
                };
            };
            /** @description The pre-finality fee is unavailable or the allowance is insufficient for this route. */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["QuoteErrorResponse"];
                };
            };
            /** @description The quote service is not configured or enabled, or is temporarily unavailable. */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["QuoteErrorResponse"];
                };
            };
        };
    };
}
