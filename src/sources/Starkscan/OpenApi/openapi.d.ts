export interface paths {
    "/v1/{chain}/staking": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Prepared finalized staking summary
         * @description DB-only prepared staking facts; no RPC, provider, raw-event, historical-price, or request-time complete-set scan.
         */
        get: operations["getStakingSummary"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/{chain}/staking/validators": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Page prepared finalized validators */
        get: operations["listStakingValidators"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/{chain}/staking/validators/{address}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Prepared validator detail with per-token pools and address histories */
        get: operations["getStakingValidator"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/{chain}/staking/validators/{address}/delegators": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Page prepared finalized delegators */
        get: operations["listStakingDelegators"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/{chain}/staking/activity": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Page prepared transaction-linked staking activity */
        get: operations["listStakingActivity"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/{chain}/staking/address/{address}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Prepared address staking positions and history */
        get: operations["getAddressStaking"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/.well-known/starkscan-agent.json": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Agent-readable Starkscan memory contract
         * @description Public machine-readable discovery document for agents. It points agents
         *     at the authenticated meta routes, route families, operating rules, and
         *     typed artifact contract without requiring chat history.
         */
        get: {
            parameters: {
                query?: never;
                header?: {
                    /** @description Optional caller-supplied correlation ID echoed back in the response. */
                    "X-Request-Id"?: components["parameters"]["RequestIdHeader"];
                };
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Agent-readable discovery and operating contract */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["AgentMemoryContract"];
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
    "/v1/meta/capabilities": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Agent-readable API capabilities
         * @description Authenticated route-family catalog for agents and developers. Hosted external clients call `/v1/meta/capabilities` with `X-Starkscan-Api-Key`. Same-origin explorer traffic uses this `/v1` route through the trusted edge. Use this before selecting the smallest route set for a task. A chain-specific token-holder registry is omitted with `policy_registry_chain_mismatch` when it does not match the deployment's default chain.
         */
        get: {
            parameters: {
                query?: never;
                header?: {
                    /** @description Optional caller-supplied correlation ID echoed back in the response. */
                    "X-Request-Id"?: components["parameters"]["RequestIdHeader"];
                };
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Capability and route-family catalog */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["MetaCapabilitiesView"];
                    };
                };
                401: components["responses"]["UnauthorizedText"];
                403: components["responses"]["ForbiddenText"];
                429: components["responses"]["RateLimited"];
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
    "/v1/meta/chains": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Supported chain ids for this deployment
         * @description Authenticated chain catalog. Hosted external clients call `/v1/meta/chains` with `X-Starkscan-Api-Key`. Same-origin explorer traffic uses this `/v1` route through the trusted edge.
         */
        get: {
            parameters: {
                query?: never;
                header?: {
                    /** @description Optional caller-supplied correlation ID echoed back in the response. */
                    "X-Request-Id"?: components["parameters"]["RequestIdHeader"];
                };
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Supported chain metadata */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["MetaChainsView"];
                    };
                };
                401: components["responses"]["UnauthorizedText"];
                403: components["responses"]["ForbiddenText"];
                429: components["responses"]["RateLimited"];
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
    "/v1/meta/agent-context": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Full agent context contract
         * @description Authenticated context document that combines the public agent-memory contract with handoff artifact guidance. Hosted external clients call `/v1/meta/agent-context` with `X-Starkscan-Api-Key`. Same-origin explorer traffic uses this `/v1` route through the trusted edge.
         */
        get: {
            parameters: {
                query?: never;
                header?: {
                    /** @description Optional caller-supplied correlation ID echoed back in the response. */
                    "X-Request-Id"?: components["parameters"]["RequestIdHeader"];
                };
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Full agent context contract */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["MetaAgentContextView"];
                    };
                };
                401: components["responses"]["UnauthorizedText"];
                403: components["responses"]["ForbiddenText"];
                429: components["responses"]["RateLimited"];
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
    "/v1/meta/status": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Reject the non-chain meta status alias
         * @description `meta` is a discovery namespace, not a Starknet chain. This route always returns a typed HTTP 404 so agents cannot mistake an all-null pseudo-chain payload for a health check. Read `/v1/meta/chains`, then request `/v1/{chain}/status` for a supported chain. The trusted app-host `/v1/*` lane supplies internal authentication; direct API-host callers retain the normal Starkscan API-key boundary.
         */
        get: {
            parameters: {
                query?: never;
                header?: {
                    /** @description Optional caller-supplied correlation ID echoed back in the response. */
                    "X-Request-Id"?: components["parameters"]["RequestIdHeader"];
                };
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                401: components["responses"]["UnauthorizedText"];
                403: components["responses"]["ForbiddenText"];
                /** @description The meta namespace is not a chain. */
                404: {
                    headers: {
                        "X-Request-Id": components["headers"]["RequestId"];
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                429: components["responses"]["RateLimited"];
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
    "/v1/{chain}/status": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Chain status
         * @description Current indexed, finalized, and L1 evidence status for a supported Starknet chain. `meta` is a discovery namespace, not a chain; `/v1/meta/status` returns a typed HTTP 404. Read `/v1/meta/chains`, then use one of the returned chain ids here.
         */
        get: {
            parameters: {
                query?: never;
                header?: {
                    /** @description Optional caller-supplied correlation ID echoed back in the response. */
                    "X-Request-Id"?: components["parameters"]["RequestIdHeader"];
                };
                path: {
                    /** @example SN_MAIN */
                    chain: components["parameters"]["ChainParam"];
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Current indexed and finalized head status */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ExplorerStatusView"];
                    };
                };
                401: components["responses"]["UnauthorizedText"];
                403: components["responses"]["ForbiddenText"];
                429: components["responses"]["RateLimited"];
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
    "/v1/{chain}/status/indexing-freshness": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Indexing freshness health
         * @description Fail-closed semantic health check for external monitoring. Compares one bounded live Starknet RPC head lookup with Starkscan's indexed read-model watermark. Returns HTTP 200 only when both facts are available, internally consistent, and no more than 20 blocks apart; otherwise returns HTTP 503. This endpoint evaluates Starkscan indexing freshness only and does not attribute a failure to Starknet or an upstream provider. The chain path parameter must match the chain served by the deployment; other chains return HTTP 404 without querying an RPC.
         */
        get: {
            parameters: {
                query?: never;
                header?: {
                    /** @description Optional caller-supplied correlation ID echoed back in the response. */
                    "X-Request-Id"?: components["parameters"]["RequestIdHeader"];
                };
                path: {
                    /** @example SN_MAIN */
                    chain: components["parameters"]["ChainParam"];
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Starkscan indexing is within the monitored freshness threshold */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["IndexingFreshnessHealthView"];
                    };
                };
                /** @description Chain is not served by this deployment. */
                404: {
                    headers: {
                        "X-Request-Id": components["headers"]["RequestId"];
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                429: components["responses"]["RateLimited"];
                503: components["responses"]["IndexingFreshnessDegraded"];
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
    "/v1/{chain}/status/l1-finality-quorum": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * L1 finality quorum health
         * @description Fail-closed semantic health check for external monitoring. Reads only Starkscan's materialized status facts and returns HTTP 200 when every L1 evidence component required for the served chain has a complete, agreeing quorum from at least two configured endpoints and the oldest observation is no more than five minutes old. Missing, stale, failed, degraded, diverged, or inconsistent evidence returns HTTP 503. This route does not call Ethereum and does not identify or blame an upstream provider or Starknet. The credential-free status monitor uses the trusted app-host `/v1/*` lane; direct API-host callers retain the normal Starkscan API-key boundary.
         */
        get: {
            parameters: {
                query?: never;
                header?: {
                    /** @description Optional caller-supplied correlation ID echoed back in the response. */
                    "X-Request-Id"?: components["parameters"]["RequestIdHeader"];
                };
                path: {
                    /** @example SN_MAIN */
                    chain: components["parameters"]["ChainParam"];
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Starkscan has a fresh, complete, agreeing L1 evidence quorum. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["L1FinalityQuorumHealthView"];
                    };
                };
                401: components["responses"]["UnauthorizedText"];
                403: components["responses"]["ForbiddenText"];
                /** @description Chain is not served by this deployment. */
                404: {
                    headers: {
                        "X-Request-Id": components["headers"]["RequestId"];
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                429: components["responses"]["RateLimited"];
                503: components["responses"]["L1FinalityQuorumDegraded"];
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
    "/v1/{chain}/status/l1-finality-freshness": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * L1 finality freshness health
         * @description Fail-closed semantic health check for external monitoring. Reads only Starkscan's materialized L1 accepted proof watermark and returns HTTP 200 when the watermark and its non-negative age are available and no more than five minutes old. Missing, stale, or inconsistent evidence returns HTTP 503. This route does not call Ethereum and does not identify or blame an upstream provider or Starknet. The credential-free status monitor uses the trusted app-host `/v1/*` lane; direct API-host callers retain the normal Starkscan API-key boundary.
         */
        get: {
            parameters: {
                query?: never;
                header?: {
                    /** @description Optional caller-supplied correlation ID echoed back in the response. */
                    "X-Request-Id"?: components["parameters"]["RequestIdHeader"];
                };
                path: {
                    /** @example SN_MAIN */
                    chain: components["parameters"]["ChainParam"];
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Starkscan's materialized L1 finality watermark is fresh. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["L1FinalityFreshnessHealthView"];
                    };
                };
                401: components["responses"]["UnauthorizedText"];
                403: components["responses"]["ForbiddenText"];
                /** @description Chain is not served by this deployment. */
                404: {
                    headers: {
                        "X-Request-Id": components["headers"]["RequestId"];
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                429: components["responses"]["RateLimited"];
                503: components["responses"]["L1FinalityFreshnessDegraded"];
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
    "/v1/{chain}/rpc": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Starknet JSON-RPC gateway
         * @description Bounded Starknet JSON-RPC gateway. Read methods are forwarded through Starkscan's rate-limited upstream pool; write methods remain gated by the RPC pilot controls. Accepts a single JSON-RPC request object or a batch of up to 50 request objects. The serialized aggregate batch response is capped at 16 MiB and fails closed with per-request `batch_response_too_large` JSON-RPC errors when that cap is exceeded. JSON parse errors, invalid JSON-RPC payloads, and authentication failures are returned as JSON-RPC error envelopes so clients can keep standard JSON-RPC handling. Authentication failures retain their HTTP 400, 401, 403, or 503 status. HTTP 401 and 403 responses preserve the WWW-Authenticate challenge; retryable 503 responses preserve Retry-After.
         */
        post: {
            parameters: {
                query?: never;
                header?: {
                    /** @description Optional caller-supplied correlation ID echoed back in the response. */
                    "X-Request-Id"?: components["parameters"]["RequestIdHeader"];
                };
                path: {
                    /** @example SN_MAIN */
                    chain: components["parameters"]["ChainParam"];
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["JsonRpcRequest"] | components["schemas"]["JsonRpcBatchRequest"];
                };
            };
            responses: {
                /** @description JSON-RPC response or JSON-RPC error envelope forwarded from the gateway */
                200: {
                    headers: {
                        /** @description Quota and routing class applied to this JSON-RPC response. */
                        "X-Starkscan-Rpc-Class"?: string;
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["JsonRpcResponse"] | components["schemas"]["JsonRpcBatchResponse"];
                    };
                };
                /** @description Malformed or conflicting authentication credential as a JSON-RPC error envelope. */
                400: {
                    headers: {
                        /** @description Canonical request correlation header for support and tracing. */
                        "X-Request-Id"?: string;
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["JsonRpcResponse"];
                    };
                };
                /** @description Missing or invalid credential as a JSON-RPC error envelope. */
                401: {
                    headers: {
                        "WWW-Authenticate"?: string;
                        "X-Request-Id"?: string;
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["JsonRpcResponse"];
                    };
                };
                /** @description Valid credential lacks the required scope; returned as a JSON-RPC error envelope. */
                403: {
                    headers: {
                        "WWW-Authenticate"?: string;
                        "X-Request-Id"?: string;
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["JsonRpcResponse"];
                    };
                };
                429: components["responses"]["RateLimited"];
                /** @description Authentication lookup or authorization provider temporarily unavailable as a JSON-RPC error envelope. */
                503: {
                    headers: {
                        /** @description Canonical request correlation header for support and tracing. */
                        "X-Request-Id"?: string;
                        /** @description Seconds to wait before retrying when the unavailable path supplies a retry delay. */
                        "Retry-After"?: number;
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["JsonRpcResponse"];
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
    "/v1/{chain}/rpc/ws": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Starknet JSON-RPC WebSocket proxy
         * @description Beta WebSocket upgrade route for Starknet JSON-RPC subscription clients. The route is disabled unless the deployment explicitly enables `RPC_WSS_ENABLED` and configures a Starknet WebSocket upstream. After a successful protocol upgrade, clients send and receive Starknet JSON-RPC subscription messages over the WebSocket connection. This lane is certified separately from the HTTP JSON-RPC gateway.
         */
        get: {
            parameters: {
                query?: never;
                header?: {
                    /** @description Optional caller-supplied correlation ID echoed back in the response. */
                    "X-Request-Id"?: components["parameters"]["RequestIdHeader"];
                };
                path: {
                    /** @example SN_MAIN */
                    chain: components["parameters"]["ChainParam"];
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description WebSocket protocol upgrade accepted. */
                101: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                401: components["responses"]["UnauthorizedText"];
                403: components["responses"]["ForbiddenText"];
                /** @description Chain is not served by this deployment. */
                404: {
                    headers: {
                        "X-Request-Id": components["headers"]["RequestId"];
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                429: components["responses"]["RateLimited"];
                503: components["responses"]["ServiceUnavailable"];
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
    "/v1/{chain}/block/{number_or_hash}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Block detail by number or hash */
        get: {
            parameters: {
                query?: {
                    /**
                     * @description Max block transactions returned (clamped to 1..200). Defaults to `50` when omitted.
                     * @example 50
                     */
                    tx_limit?: number;
                };
                header?: {
                    /** @description Optional caller-supplied correlation ID echoed back in the response. */
                    "X-Request-Id"?: components["parameters"]["RequestIdHeader"];
                };
                path: {
                    /** @example SN_MAIN */
                    chain: components["parameters"]["ChainParam"];
                    /** @example 7550747 */
                    number_or_hash: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Block detail with transaction preview */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["BlockView"];
                    };
                };
                401: components["responses"]["UnauthorizedText"];
                403: components["responses"]["ForbiddenText"];
                /** @description Block not found */
                404: {
                    headers: {
                        "X-Request-Id": components["headers"]["RequestId"];
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description The requested Sepolia block was intentionally removed by the rolling indexed-history policy. */
                410: {
                    headers: {
                        /** @description Canonical request correlation header for support and tracing. */
                        "X-Request-Id"?: string;
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["HistoryExpiredErrorResponse"];
                    };
                };
                429: components["responses"]["RateLimited"];
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
    "/v1/{chain}/block-at-timestamp": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Resolve timestamp to indexed block
         * @description Resolve a Unix seconds or RFC3339 timestamp to the closest indexed Starknet block. `closest=before` is the default and is the right choice for accounting "as of" balance snapshots such as calendar close. The route is served from indexed block facts only; RPC is used by the correctness gate, not by the request path.
         */
        get: {
            parameters: {
                query: {
                    /**
                     * @description Unix seconds or RFC3339 timestamp with timezone.
                     * @example 2025-12-31T23:59:59Z
                     */
                    timestamp: string;
                    /**
                     * @description Direction for the selected block. `before` returns the last indexed block at or before the timestamp; `after` returns the first indexed block at or after the timestamp.
                     * @example before
                     */
                    closest?: "before" | "after";
                };
                header?: {
                    /** @description Optional caller-supplied correlation ID echoed back in the response. */
                    "X-Request-Id"?: components["parameters"]["RequestIdHeader"];
                };
                path: {
                    /** @example SN_MAIN */
                    chain: components["parameters"]["ChainParam"];
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Timestamp resolution with inclusive indexed bounds */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["BlockAtTimestampView"];
                    };
                };
                400: components["responses"]["BadRequest"];
                401: components["responses"]["UnauthorizedText"];
                403: components["responses"]["ForbiddenText"];
                /** @description No indexed block exists in the requested closest direction */
                404: {
                    headers: {
                        "X-Request-Id": components["headers"]["RequestId"];
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                410: components["responses"]["HistoryExpired"];
                429: components["responses"]["RateLimited"];
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
    "/v1/{chain}/blocks": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Paginated latest blocks feed */
        get: {
            parameters: {
                query?: {
                    /**
                     * @description Optional block number cursor for reverse pagination.
                     * @example 8279910
                     */
                    cursor?: number;
                    /**
                     * @description Page size (clamped to 1..200). Defaults to `25` when omitted.
                     * @example 25
                     */
                    limit?: number;
                };
                header?: {
                    /** @description Optional caller-supplied correlation ID echoed back in the response. */
                    "X-Request-Id"?: components["parameters"]["RequestIdHeader"];
                };
                path: {
                    /** @example SN_MAIN */
                    chain: components["parameters"]["ChainParam"];
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Chain blocks page */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ChainBlockListPage"];
                    };
                };
                400: components["responses"]["BadRequest"];
                401: components["responses"]["UnauthorizedText"];
                403: components["responses"]["ForbiddenText"];
                410: components["responses"]["HistoryExpired"];
                429: components["responses"]["RateLimited"];
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
    "/v1/{chain}/block/{number}/txs": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Paginated transactions for one block */
        get: {
            parameters: {
                query?: {
                    /**
                     * @description Optional transaction index cursor for reverse pagination.
                     * @example 0
                     */
                    cursor?: number;
                    /**
                     * @description Page size (clamped to 1..100). Defaults to `25` when omitted.
                     * @example 25
                     */
                    limit?: number;
                };
                header?: {
                    /** @description Optional caller-supplied correlation ID echoed back in the response. */
                    "X-Request-Id"?: components["parameters"]["RequestIdHeader"];
                };
                path: {
                    /** @example SN_MAIN */
                    chain: components["parameters"]["ChainParam"];
                    /** @example 8279910 */
                    number: number;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Block transaction page */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["BlockTransactionPage"];
                    };
                };
                400: components["responses"]["BadRequest"];
                401: components["responses"]["UnauthorizedText"];
                403: components["responses"]["ForbiddenText"];
                /** @description Block not found */
                404: {
                    headers: {
                        "X-Request-Id": components["headers"]["RequestId"];
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                410: components["responses"]["HistoryExpired"];
                429: components["responses"]["RateLimited"];
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
    "/v1/{chain}/tx/previews": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Batch transaction previews by hash
         * @description Advanced utility route. This helper is externally supported, but it requires a broader utility-access key than the baseline read tier and is not the default starting point for new integrations.
         */
        post: {
            parameters: {
                query?: never;
                header?: {
                    /** @description Optional caller-supplied correlation ID echoed back in the response. */
                    "X-Request-Id"?: components["parameters"]["RequestIdHeader"];
                };
                path: {
                    /** @example SN_MAIN */
                    chain: components["parameters"]["ChainParam"];
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["TransactionPreviewBatchRequest"];
                };
            };
            responses: {
                /** @description Ordered transaction preview results */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["TransactionPreviewBatchView"];
                    };
                };
                400: components["responses"]["BadRequest"];
                401: components["responses"]["UnauthorizedText"];
                403: components["responses"]["ForbiddenText"];
                410: components["responses"]["HistoryExpired"];
                429: components["responses"]["RateLimited"];
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/{chain}/tx/{tx_hash}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Transaction detail by hash */
        get: {
            parameters: {
                query?: {
                    /**
                     * @description Maximum number of event logs returned in the transaction detail payload. Defaults to `96` when omitted.
                     * @example 96
                     */
                    logLimit?: number;
                };
                header?: {
                    /** @description Optional caller-supplied correlation ID echoed back in the response. */
                    "X-Request-Id"?: components["parameters"]["RequestIdHeader"];
                };
                path: {
                    /** @example SN_MAIN */
                    chain: components["parameters"]["ChainParam"];
                    /** @example 0x054bfd961fb8b156c77ffa0f7882b8fcc1836753c2d3d88435b640d6300c8bd9 */
                    tx_hash: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Transaction detail */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["TransactionDetailView"];
                    };
                };
                401: components["responses"]["UnauthorizedText"];
                403: components["responses"]["ForbiddenText"];
                /** @description Transaction not found */
                404: {
                    headers: {
                        "X-Request-Id": components["headers"]["RequestId"];
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description The requested Sepolia transaction was intentionally removed by the rolling indexed-history policy. */
                410: {
                    headers: {
                        /** @description Canonical request correlation header for support and tracing. */
                        "X-Request-Id"?: string;
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["HistoryExpiredErrorResponse"];
                    };
                };
                429: components["responses"]["RateLimited"];
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
    "/v1/{chain}/txs": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Paginated latest transactions feed */
        get: {
            parameters: {
                query?: {
                    /** @description Optional cursor encoded as `block:tx`. */
                    cursor?: string;
                    /** @description Page size (clamped to 1..200). */
                    limit?: number;
                };
                header?: {
                    /** @description Optional caller-supplied correlation ID echoed back in the response. */
                    "X-Request-Id"?: components["parameters"]["RequestIdHeader"];
                };
                path: {
                    /** @example SN_MAIN */
                    chain: components["parameters"]["ChainParam"];
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Chain transactions page */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ChainTransactionListPage"];
                    };
                };
                400: components["responses"]["BadRequest"];
                401: components["responses"]["UnauthorizedText"];
                403: components["responses"]["ForbiddenText"];
                410: components["responses"]["HistoryExpired"];
                429: components["responses"]["RateLimited"];
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
    "/v1/{chain}/bridge/starkgate/resolve": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Resolve StarkGate bridge activity
         * @description Resolves StarkGate lifecycle rows from indexed L1/L2 protocol message and bridge facts. At least one of `txHash`, `messageHash`, `address`, `token`, or `bridge` is required.
         */
        get: {
            parameters: {
                query?: {
                    /** @description Optional Starknet transaction hash to resolve. */
                    txHash?: string;
                    /** @description Optional protocol message hash to resolve. */
                    messageHash?: string;
                    /** @description Optional sender or recipient address filter. */
                    address?: string;
                    /** @description Optional token address filter. */
                    token?: string;
                    /** @description Optional L1 or L2 bridge contract address filter. */
                    bridge?: string;
                    /** @description Optional message direction filter. */
                    direction?: "all" | "l1_to_l2" | "l2_to_l1";
                    /** @description Page size for resolver matches (clamped to 1..25). */
                    limit?: number;
                };
                header?: {
                    /** @description Optional caller-supplied correlation ID echoed back in the response. */
                    "X-Request-Id"?: components["parameters"]["RequestIdHeader"];
                };
                path: {
                    /** @example SN_MAIN */
                    chain: components["parameters"]["ChainParam"];
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description StarkGate transfer resolution */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["StarkgateTransferResolutionView"];
                    };
                };
                400: components["responses"]["BadRequest"];
                401: components["responses"]["UnauthorizedText"];
                403: components["responses"]["ForbiddenText"];
                429: components["responses"]["RateLimited"];
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
    "/v1/{chain}/bridge/starkgate/transfers": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Paginated StarkGate bridge transfers */
        get: {
            parameters: {
                query?: {
                    /** @description Optional exact protocol message hash filter. */
                    messageHash?: string;
                    /** @description Optional sender or recipient address filter. */
                    address?: string;
                    /** @description Optional token address filter. */
                    token?: string;
                    /** @description Optional L1 or L2 bridge contract address filter. */
                    bridge?: string;
                    /** @description Optional transfer status filter. `pending_l1_claim` is retained as a compatibility filter for uncleared withdrawals. Claimability is sourced from a finalized StarknetCore registry snapshot; missing evidence returns `claimability_unavailable` and snapshots older than five minutes return `claimability_stale` rather than being reused as current readiness. */
                    status?: "l1_observed" | "consumed_on_l2" | "l2_only_signal" | "pending_l1_claim" | "pending_l1_proof" | "claimability_ambiguous" | "claimability_unavailable" | "claimability_stale" | "ready_to_claim_on_l1" | "cleared_on_l1" | "unpaired";
                    /** @description Optional message direction filter. */
                    direction?: "all" | "l1_to_l2" | "l2_to_l1";
                    /** @description Optional opaque StarkGate transfer cursor returned from `nextCursor`. New cursors are integrity-protected, expire after five minutes, and pin both the L1 accepted watermark and registry-freshness cutoff for stable claimability pagination. Clients must return the value unchanged and restart pagination after `400`; legacy position-only cursors remain accepted, while unsigned snapshot-bound cursors fail closed. */
                    cursor?: string;
                    /** @description Page size (clamped to 1..100). */
                    limit?: number;
                };
                header?: {
                    /** @description Optional caller-supplied correlation ID echoed back in the response. */
                    "X-Request-Id"?: components["parameters"]["RequestIdHeader"];
                };
                path: {
                    /** @example SN_MAIN */
                    chain: components["parameters"]["ChainParam"];
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description StarkGate transfer page */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["StarkgateTransferPageView"];
                    };
                };
                400: components["responses"]["BadRequest"];
                401: components["responses"]["UnauthorizedText"];
                403: components["responses"]["ForbiddenText"];
                429: components["responses"]["RateLimited"];
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
    "/v1/{chain}/bridge/starkgate/transfer/{message_hash}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Resolve StarkGate bridge transfers by message hash
         * @description Resolver endpoint for one protocol message hash. Returns the indexed resolution view, which may contain zero or more matching transfer rows and explicit coverage metadata.
         */
        get: {
            parameters: {
                query?: never;
                header?: {
                    /** @description Optional caller-supplied correlation ID echoed back in the response. */
                    "X-Request-Id"?: components["parameters"]["RequestIdHeader"];
                };
                path: {
                    /** @example SN_MAIN */
                    chain: components["parameters"]["ChainParam"];
                    /**
                     * @description Protocol message hash.
                     * @example 0x0123456789abcdef0123456789abcdef
                     */
                    message_hash: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description StarkGate transfer resolver results for one message hash */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["StarkgateTransferResolutionView"];
                    };
                };
                400: components["responses"]["BadRequest"];
                401: components["responses"]["UnauthorizedText"];
                403: components["responses"]["ForbiddenText"];
                429: components["responses"]["RateLimited"];
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
    "/v1/{chain}/messages": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Paginated canonical cross-layer messages
         * @description Global cross-layer message feed served only from indexed StarknetCore protocol message facts. Rows are keyed by protocol message hash, not token-transfer or bridge-adapter activity. Coverage metadata is explicit because a data plane may still be backfilling protocol message facts.
         */
        get: {
            parameters: {
                query?: {
                    /** @description Optional message direction filter. */
                    direction?: "all" | "l1_to_l2" | "l2_to_l1";
                    /** @description Optional transaction hash filter. */
                    txHash?: string;
                    /** @description Optional protocol message hash filter. */
                    messageHash?: string;
                    /** @description Optional opaque cursor returned unchanged from `nextCursor`. New responses use `m1:block:tx:message:tx_hash:message_hash:direction:source_tier` so pagination remains stable when multiple messages share the same numeric tuple. Legacy `block:tx:message` cursors remain accepted for older clients. */
                    cursor?: string;
                    /** @description Page size (defaults to the full bounded pool directory page; clamped to 1..100). */
                    limit?: number;
                };
                header?: {
                    /** @description Optional caller-supplied correlation ID echoed back in the response. */
                    "X-Request-Id"?: components["parameters"]["RequestIdHeader"];
                };
                path: {
                    /** @example SN_MAIN */
                    chain: components["parameters"]["ChainParam"];
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Global message page with explicit coverage metadata */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["MessagePage"];
                    };
                };
                400: components["responses"]["BadRequest"];
                401: components["responses"]["UnauthorizedText"];
                403: components["responses"]["ForbiddenText"];
                429: components["responses"]["RateLimited"];
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
    "/v1/{chain}/message/{message_hash}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Canonical cross-layer message detail
         * @description Message detail served only from indexed StarknetCore protocol message facts. Bridge adapter lifecycle facts and token-transfer-derived bridge activity are excluded.
         */
        get: {
            parameters: {
                query?: {
                    /** @description Optional opaque cursor returned from `nextCursor` when a message hash has more lifecycle rows. */
                    cursor?: string;
                    /** @description Page size for lifecycle rows (clamped to 1..100, default 100). */
                    limit?: number;
                };
                header?: {
                    /** @description Optional caller-supplied correlation ID echoed back in the response. */
                    "X-Request-Id"?: components["parameters"]["RequestIdHeader"];
                };
                path: {
                    /** @example SN_MAIN */
                    chain: components["parameters"]["ChainParam"];
                    /** @example 0x0123456789abcdef0123456789abcdef */
                    message_hash: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Message detail with explicit coverage metadata */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["MessageDetailView"];
                    };
                };
                400: components["responses"]["BadRequest"];
                401: components["responses"]["UnauthorizedText"];
                403: components["responses"]["ForbiddenText"];
                /** @description Message hash has no indexed StarknetCore protocol lifecycle rows */
                404: {
                    headers: {
                        "X-Request-Id": components["headers"]["RequestId"];
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                429: components["responses"]["RateLimited"];
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
    "/v1/{chain}/tx/{tx_hash}/trace": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Transaction Cairo trace by hash */
        get: {
            parameters: {
                query?: never;
                header?: {
                    /** @description Optional caller-supplied correlation ID echoed back in the response. */
                    "X-Request-Id"?: components["parameters"]["RequestIdHeader"];
                };
                path: {
                    /** @example SN_MAIN */
                    chain: components["parameters"]["ChainParam"];
                    /** @example 0x054bfd961fb8b156c77ffa0f7882b8fcc1836753c2d3d88435b640d6300c8bd9 */
                    tx_hash: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Transaction trace payload */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ContractTransactionTraceView"];
                    };
                };
                400: components["responses"]["BadRequest"];
                401: components["responses"]["UnauthorizedText"];
                403: components["responses"]["ForbiddenText"];
                /** @description Transaction trace not found */
                404: {
                    headers: {
                        "X-Request-Id": components["headers"]["RequestId"];
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                410: components["responses"]["HistoryExpired"];
                429: components["responses"]["RateLimited"];
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
    "/v1/{chain}/address/{address}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Address aggregate summary */
        get: {
            parameters: {
                query?: never;
                header?: {
                    /** @description Optional caller-supplied correlation ID echoed back in the response. */
                    "X-Request-Id"?: components["parameters"]["RequestIdHeader"];
                };
                path: {
                    /** @example SN_MAIN */
                    chain: components["parameters"]["ChainParam"];
                    /** @example 0x0123456789abcdef */
                    address: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Address summary */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["AddressSummaryView"];
                    };
                };
                401: components["responses"]["UnauthorizedText"];
                403: components["responses"]["ForbiddenText"];
                429: components["responses"]["RateLimited"];
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
    "/v1/{chain}/address/{address}/attribution": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Indexed address attribution
         * @description Address-oriented attribution lookup backed by indexed metadata. Use this when a partner workflow starts from an address and needs a readable label/protocol attribution without calling RPC on the request path.
         */
        get: {
            parameters: {
                query?: never;
                header?: {
                    /** @description Optional caller-supplied correlation ID echoed back in the response. */
                    "X-Request-Id"?: components["parameters"]["RequestIdHeader"];
                };
                path: {
                    /** @example SN_MAIN */
                    chain: components["parameters"]["ChainParam"];
                    /** @example 0x0123456789abcdef */
                    address: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Indexed address attribution metadata */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["AddressAttributionView"];
                    };
                };
                400: components["responses"]["BadRequest"];
                401: components["responses"]["UnauthorizedText"];
                403: components["responses"]["ForbiddenText"];
                429: components["responses"]["RateLimited"];
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
    "/v1/{chain}/address/summaries": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Batch address aggregate summaries
         * @description Utility-tier batch helper for bounded address hydration. The route returns request-ordered indexed summary facts for up to 128 addresses and intentionally avoids raw activity scans, deployment repair, and RPC calls on the request path. `totalActivityCount=null` with `activityCountExact=false` means no trustworthy numeric statement is available; numeric zero is reserved for a certified exhaustive range.
         *
         *     Advanced utility route. This helper is externally supported, but it requires a broader utility-access key than the baseline read tier and is not the default starting point for new integrations.
         */
        post: {
            parameters: {
                query?: never;
                header?: {
                    /** @description Optional caller-supplied correlation ID echoed back in the response. */
                    "X-Request-Id"?: components["parameters"]["RequestIdHeader"];
                };
                path: {
                    /** @example SN_MAIN */
                    chain: components["parameters"]["ChainParam"];
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["AddressSummaryBatchRequest"];
                };
            };
            responses: {
                /** @description Ordered address summary results */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["AddressSummaryBatchView"];
                    };
                };
                400: components["responses"]["BadRequest"];
                401: components["responses"]["UnauthorizedText"];
                403: components["responses"]["ForbiddenText"];
                429: components["responses"]["RateLimited"];
                503: components["responses"]["ServiceUnavailable"];
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/{chain}/address/intelligence": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Batch address deployment, attribution, typed activity, and inbound-funds intelligence
         * @description Utility-tier batch helper for wallet, paymaster, migration, and compliance-adjacent clients that need factual classification for a bounded list of up to 128 addresses. The route returns whether each address has indexed deployment evidence, optional readable attribution, whether indexed token-transfer rows show the address as a recipient, and typed activity coverage. Successful finalized account-sender, trace-backed finalized contract-call, and canonical finalized contract-emitted event evidence preserves the proved latest block while its total remains null until a success-only exhaustive aggregate is certified; unknown or unmaterialized totals are null, while a certified exhaustive genuine zero is 0; reorgable head rows are not promoted. It is backed by read-model indexes only; it does not call RPC on the request path and does not perform risk scoring or sanctions screening.
         *
         *     Advanced utility route. This helper is externally supported, but it requires a broader utility-access key than the baseline read tier and is not the default starting point for new integrations.
         */
        post: {
            parameters: {
                query?: never;
                header?: {
                    /** @description Optional caller-supplied correlation ID echoed back in the response. */
                    "X-Request-Id"?: components["parameters"]["RequestIdHeader"];
                };
                path: {
                    /** @example SN_MAIN */
                    chain: components["parameters"]["ChainParam"];
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["AddressSummaryBatchRequest"];
                };
            };
            responses: {
                /** @description Ordered address intelligence results */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["AddressIntelligenceBatchView"];
                    };
                };
                400: components["responses"]["BadRequest"];
                401: components["responses"]["UnauthorizedText"];
                403: components["responses"]["ForbiddenText"];
                429: components["responses"]["RateLimited"];
                503: components["responses"]["ServiceUnavailable"];
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/{chain}/classes": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Materialized class directory
         * @description Pages bounded indexed class facts without request-path raw-table aggregation or live RPC. `instances_desc` is the compatibility default for observed class associations. `declared_at_desc` and `origin_asc` page the complete indexed DECLARE and legacy DEPLOY origin catalog newest or oldest first; instance and ABI fields are optional observed enrichment. `classLabel` is a reviewed class-family label when available, not exact source verification.
         */
        get: {
            parameters: {
                query?: {
                    /** @description Opaque cursor returned from `nextCursor`; cursors are sort-specific (`c1` for `instances_desc`, `c2` for `declared_at_desc` or `origin_asc`). */
                    cursor?: string;
                    /** @description `instances_desc` preserves the observed-instance directory default; `declared_at_desc` and `origin_asc` return the complete indexed class-origin catalog newest or oldest first. */
                    sort?: "instances_desc" | "declared_at_desc" | "origin_asc";
                    /** @description Page size (clamped to 1..100, default 50). */
                    limit?: number;
                };
                header?: {
                    /** @description Optional caller-supplied correlation ID echoed back in the response. */
                    "X-Request-Id"?: components["parameters"]["RequestIdHeader"];
                };
                path: {
                    /** @example SN_MAIN */
                    chain: components["parameters"]["ChainParam"];
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Materialized class directory page */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ClassDirectoryPageView"];
                    };
                };
                400: components["responses"]["BadRequest"];
                401: components["responses"]["UnauthorizedText"];
                403: components["responses"]["ForbiddenText"];
                429: components["responses"]["RateLimited"];
                503: components["responses"]["ServiceUnavailable"];
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
    "/v1/{chain}/class/{class_hash}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Materialized class detail
         * @description Returns one indexed declaration or observed class record and a bounded page of observed contract/account instances. Declaration-only classes resolve with honest zero/null observation fields. This endpoint reads indexed facts only; it does not call RPC on the request path and does not claim exact source verification unless future verification tiers say so explicitly.
         */
        get: {
            parameters: {
                query?: {
                    /** @description Address order is the compatibility default; newest order exposes the latest block-backed relationship evidence first. */
                    instanceSort?: "address_asc" | "newest_desc";
                    /** @description Sort-specific cursor returned from `nextInstanceCursor`; an address for `address_asc` or a `c3` cursor for `newest_desc`. */
                    instanceCursor?: string;
                    /** @description Instance page size (clamped to 1..100, default 25). */
                    instanceLimit?: number;
                };
                header?: {
                    /** @description Optional caller-supplied correlation ID echoed back in the response. */
                    "X-Request-Id"?: components["parameters"]["RequestIdHeader"];
                };
                path: {
                    /** @example SN_MAIN */
                    chain: components["parameters"]["ChainParam"];
                    /**
                     * @description Starknet class hash.
                     * @example 0x0123456789abcdef
                     */
                    class_hash: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Materialized class detail and bounded indexed instances */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ClassDetailView"];
                    };
                };
                400: components["responses"]["BadRequest"];
                401: components["responses"]["UnauthorizedText"];
                403: components["responses"]["ForbiddenText"];
                /** @description Class has no indexed declaration or observed-class fact */
                404: {
                    headers: {
                        "X-Request-Id": components["headers"]["RequestId"];
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                429: components["responses"]["RateLimited"];
                503: components["responses"]["ServiceUnavailable"];
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
    "/v1/{chain}/query/wallet-paymaster-view": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Wallet/paymaster query bundle
         * @description Partner Query Plane bundle for wallet and paymaster backends. The first slice returns bounded, request-ordered address identity, account state, and proof-backed L1 finality metadata for up to 32 unique addresses. It is backed by indexed read-model facts only and does not call RPC or scan raw activity on the request path. Token holdings, recent transactions, bridge/message rollups, and row-level provenance details are reserved for forward-compatible request shapes; when enabled in v1 they fail closed with `unsupported_section` instead of returning partial success.
         */
        post: {
            parameters: {
                query?: never;
                header?: {
                    /** @description Optional caller-supplied correlation ID echoed back in the response. */
                    "X-Request-Id"?: components["parameters"]["RequestIdHeader"];
                };
                path: {
                    /** @example SN_MAIN */
                    chain: components["parameters"]["ChainParam"];
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["WalletPaymasterViewRequest"];
                };
            };
            responses: {
                /** @description Wallet/paymaster bundle envelope */
                200: {
                    headers: {
                        /** @description Route budget class for class-specific backoff. */
                        "X-Starkscan-Route-Class"?: "batch";
                        /** @description Query Plane bundle class used for accounting and support. */
                        "X-Starkscan-Query-Class"?: "wallet_paymaster";
                        /** @description Cost units charged for this Query Plane request. Wallet/paymaster formula: 2 base units + 1 unit per requested address + 1 unit per 8 addresses when `accountState` is enabled + 1 unit when `finality` is enabled. Forward-compatible unsupported sections have reserved costs and fail closed in v1. */
                        "X-Starkscan-Cost-Units"?: number;
                        "x-ratelimit-limit"?: number;
                        "x-ratelimit-remaining"?: number;
                        "x-ratelimit-policy"?: string;
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["WalletPaymasterQueryEnvelope"];
                    };
                };
                400: components["responses"]["BadRequest"];
                401: components["responses"]["UnauthorizedText"];
                403: components["responses"]["ForbiddenText"];
                409: components["responses"]["Conflict"];
                429: components["responses"]["RateLimited"];
                503: components["responses"]["ServiceUnavailable"];
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/{chain}/query/wallet-state": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Verify one wallet's fungible state at one immutable block
         * @description One bounded wallet-screen operation. Candidate discovery and balance correctness are separate contracts. Every returned balance, optional nonce, and optional class hash is read from the dedicated RPC serving pool at the same resolved block hash. The server never substitutes an indexed balance and never converts an RPC error to zero. In require_complete mode, any failed value returns HTTP 503 without a partial success payload. verified_partial mode returns typed per-item failures and walletSafe=false. The current public contract accepts at most 25 candidates. The 26-50 band remains unavailable until dedicated-pool and clean-window capacity certification plus a coordinated schema and client release.
         */
        post: {
            parameters: {
                query?: never;
                header?: {
                    /** @description Optional caller-supplied correlation ID echoed back in the response. */
                    "X-Request-Id"?: components["parameters"]["RequestIdHeader"];
                };
                path: {
                    /** @example SN_MAIN */
                    chain: components["parameters"]["ChainParam"];
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["WalletStateRequest"];
                };
            };
            responses: {
                /** @description Block-pinned complete or typed-partial wallet state */
                200: {
                    headers: {
                        "X-Starkscan-Query-Class"?: "wallet_state";
                        /** @description One partner operation within the bounded 1-25 token band. */
                        "X-Starkscan-Cost-Units"?: 1;
                        "x-ratelimit-limit"?: number;
                        "x-ratelimit-remaining"?: number;
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["WalletStateResponse"];
                    };
                };
                400: components["responses"]["BadRequest"];
                401: components["responses"]["UnauthorizedText"];
                403: components["responses"]["ForbiddenText"];
                429: components["responses"]["RateLimited"];
                503: components["responses"]["ServiceUnavailable"];
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/{chain}/query/defi-lending-market-view": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * DeFi lending market query bundle
         * @description Partner Query Plane bundle for Vesu-style lending markets, DeFi frontends, risk monitors, and liquidation services. The first slice returns request-ordered market selectors, bounded indexed contract identity, token address echoes, proof-backed L1 finality metadata, and simulation boundary metadata. It is backed by indexed read-model facts only and does not call RPC, scan events, compute risk, or read signed payloads on the request path. State samples, events, recent transactions, and row-level provenance details are reserved for forward-compatible request shapes; when enabled in v1 they fail closed with `unsupported_section`.
         */
        post: {
            parameters: {
                query?: never;
                header?: {
                    /** @description Optional caller-supplied correlation ID echoed back in the response. */
                    "X-Request-Id"?: components["parameters"]["RequestIdHeader"];
                };
                path: {
                    /** @example SN_MAIN */
                    chain: components["parameters"]["ChainParam"];
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["DefiLendingMarketViewRequest"];
                };
            };
            responses: {
                /** @description DeFi lending market bundle envelope */
                200: {
                    headers: {
                        /** @description Route budget class for class-specific backoff. */
                        "X-Starkscan-Route-Class"?: "batch";
                        /** @description Query Plane bundle class used for accounting and support. */
                        "X-Starkscan-Query-Class"?: "defi_lending";
                        /** @description Cost units charged for this Query Plane request. DeFi lending formula: 5 base units + 3 units per requested market + 1 unit per 16 requested contracts when `contractIdentity` is enabled + 1 unit per requested market when `simulationMetadata` is enabled. */
                        "X-Starkscan-Cost-Units"?: number;
                        "x-ratelimit-limit"?: number;
                        "x-ratelimit-remaining"?: number;
                        "x-ratelimit-policy"?: string;
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["DefiLendingMarketQueryEnvelope"];
                    };
                };
                400: components["responses"]["BadRequest"];
                401: components["responses"]["UnauthorizedText"];
                403: components["responses"]["ForbiddenText"];
                409: components["responses"]["Conflict"];
                429: components["responses"]["RateLimited"];
                503: components["responses"]["ServiceUnavailable"];
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/{chain}/query/support-proof-bundle": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Support/proof query bundle
         * @description Partner Query Plane bundle for support, bridge/message debugging, and customer-success proof packets. The v1 slice accepts exactly one incident selector (`txHash` or `messageHash`) and returns bounded indexed transaction detail, protocol-message lifecycle rows, StarkGate transfer resolution, and proof-backed L1 finality metadata. It is backed by indexed read-model facts only and does not call RPC, Ethereum RPC, or provider comparison endpoints on the request path. Row-level provenance details and shareable redacted proof links are reserved for forward-compatible request shapes; when enabled in v1 they fail closed with `unsupported_section`.
         */
        post: {
            parameters: {
                query?: never;
                header?: {
                    /** @description Optional caller-supplied correlation ID echoed back in the response. */
                    "X-Request-Id"?: components["parameters"]["RequestIdHeader"];
                };
                path: {
                    /** @example SN_MAIN */
                    chain: components["parameters"]["ChainParam"];
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["SupportProofBundleRequest"];
                };
            };
            responses: {
                /** @description Support/proof bundle envelope */
                200: {
                    headers: {
                        /** @description Route budget class for class-specific backoff. */
                        "X-Starkscan-Route-Class"?: "batch";
                        /** @description Query Plane bundle class used for accounting and support. */
                        "X-Starkscan-Query-Class"?: "support_proof";
                        /** @description Cost units charged for this Query Plane request. Support/proof formula: 8 base units + 4 units each for requested `transaction`, `protocolMessages`, and `starkgate` sections + 1 unit when `finality` is enabled. */
                        "X-Starkscan-Cost-Units"?: number;
                        "x-ratelimit-limit"?: number;
                        "x-ratelimit-remaining"?: number;
                        "x-ratelimit-policy"?: string;
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["SupportProofBundleEnvelope"];
                    };
                };
                400: components["responses"]["BadRequest"];
                401: components["responses"]["UnauthorizedText"];
                403: components["responses"]["ForbiddenText"];
                409: components["responses"]["Conflict"];
                429: components["responses"]["RateLimited"];
                503: components["responses"]["ServiceUnavailable"];
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/{chain}/address/{address}/assets/discovery": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Discover bounded fungible asset candidates for one wallet
         * @description Returns token candidates and evidence only; it never returns or implies a current balance. Follow nextCursor while hasMore is true. Coverage describes completeness only within the declared standard-fungible discovery scope. globallyComplete remains false because non-standard or unregistered assets may not be discoverable. Use wallet-state to verify balances at one immutable block hash.
         */
        get: {
            parameters: {
                query?: {
                    /** @description `discovered` returns candidates observed for this wallet. The default `discovered_plus_registry` also evaluates the curated registry, which can paginate even for a wallet with no observed assets. */
                    scope?: "discovered" | "discovered_plus_registry";
                    /** @description Authenticated opaque nextCursor returned by the previous discovery page. It pins one candidate snapshot, expires five minutes after the first page, and must be returned unchanged with the same scope. Restart from the first page after an invalid_cursor response. */
                    cursor?: string;
                    limit?: number;
                };
                header?: {
                    /** @description Optional caller-supplied correlation ID echoed back in the response. */
                    "X-Request-Id"?: components["parameters"]["RequestIdHeader"];
                };
                path: {
                    /** @example SN_MAIN */
                    chain: components["parameters"]["ChainParam"];
                    /** @example 0x0123456789abcdef */
                    address: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Candidate page with explicit discovery coverage */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["WalletAssetDiscoveryPage"];
                    };
                };
                400: components["responses"]["BadRequest"];
                401: components["responses"]["UnauthorizedText"];
                403: components["responses"]["ForbiddenText"];
                429: components["responses"]["RateLimited"];
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
    "/v1/{chain}/address/{address}/transactions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Paginated transaction summaries touching one address */
        get: {
            parameters: {
                query?: {
                    /** @description Optional cursor encoded as `block:tx:log:transfer[:kind[:txHash[:source]]]`. */
                    cursor?: string;
                    /** @description Page size (clamped to 1..100). */
                    limit?: number;
                };
                header?: {
                    /** @description Optional caller-supplied correlation ID echoed back in the response. */
                    "X-Request-Id"?: components["parameters"]["RequestIdHeader"];
                };
                path: {
                    /** @example SN_MAIN */
                    chain: components["parameters"]["ChainParam"];
                    /** @example 0x0123456789abcdef */
                    address: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Address transaction page */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["AddressTransactionPage"];
                    };
                };
                400: components["responses"]["BadRequest"];
                401: components["responses"]["UnauthorizedText"];
                403: components["responses"]["ForbiddenText"];
                410: components["responses"]["HistoryExpired"];
                429: components["responses"]["RateLimited"];
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
    "/v1/{chain}/address/{address}/token-holdings": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Retired indexed-balance route
         * @deprecated
         * @description Always returns HTTP 410 with no holdings data. The old contract mixed asset discovery with event-derived balance observations and could not satisfy wallet-grade correctness. Use assets/discovery for candidate enumeration and query/wallet-state for balances pinned to one block. The response includes Deprecation, Sunset, and successor Link headers.
         */
        get: {
            parameters: {
                query?: never;
                header?: {
                    /** @description Optional caller-supplied correlation ID echoed back in the response. */
                    "X-Request-Id"?: components["parameters"]["RequestIdHeader"];
                };
                path: {
                    /** @example SN_MAIN */
                    chain: components["parameters"]["ChainParam"];
                    /** @example 0x0123456789abcdef */
                    address: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                401: components["responses"]["UnauthorizedText"];
                403: components["responses"]["ForbiddenText"];
                /** @description Route retired; migrate to discovery plus wallet-state */
                410: {
                    headers: {
                        Deprecation?: "true";
                        Sunset?: string;
                        Link?: string;
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["RetiredTokenHoldingsResponse"];
                    };
                };
                429: components["responses"]["RateLimited"];
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
    "/v1/{chain}/contract/{address}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Indexed contract metadata
         * @description Lightweight contract metadata for migration clients. The response is composed from one stable snapshot of indexed read-model facts. A syntactically valid address with no indexed contract identity returns 404 rather than an all-null success envelope. Nullable token fields mean the contract is not currently identified as token metadata in the index, not that it is provably not a token. Class-hash provenance fields state exactly which indexed fact backs classHash.
         */
        get: {
            parameters: {
                query?: never;
                header?: {
                    /** @description Optional caller-supplied correlation ID echoed back in the response. */
                    "X-Request-Id"?: components["parameters"]["RequestIdHeader"];
                };
                path: {
                    /** @example SN_MAIN */
                    chain: components["parameters"]["ChainParam"];
                    /** @example 0x0123456789abcdef */
                    address: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Indexed contract metadata */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ContractMetadataView"];
                    };
                };
                400: components["responses"]["BadRequest"];
                401: components["responses"]["UnauthorizedText"];
                403: components["responses"]["ForbiddenText"];
                /** @description No indexed contract identity exists for this address */
                404: {
                    headers: {
                        "X-Request-Id": components["headers"]["RequestId"];
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                429: components["responses"]["RateLimited"];
                503: components["responses"]["ServiceUnavailable"];
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
    "/v1/{chain}/contract/{address}/verification": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Legacy contract verification migration state
         * @deprecated
         * @description Legacy migration state only. It is not reproducible source evidence and never establishes `verified_exact`.
         */
        get: {
            parameters: {
                query?: never;
                header?: {
                    /** @description Optional caller-supplied correlation ID echoed back in the response. */
                    "X-Request-Id"?: components["parameters"]["RequestIdHeader"];
                };
                path: {
                    /** @example SN_MAIN */
                    chain: components["parameters"]["ChainParam"];
                    /** @example 0x0123456789abcdef */
                    address: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Legacy migration record; not reproducible source evidence */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ContractVerificationView"];
                    };
                };
                400: components["responses"]["BadRequest"];
                401: components["responses"]["UnauthorizedText"];
                403: components["responses"]["ForbiddenText"];
                /** @description Contract verification record not found */
                404: {
                    headers: {
                        "X-Request-Id": components["headers"]["RequestId"];
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                429: components["responses"]["RateLimited"];
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
    "/v1/{chain}/contract/{address}/classes": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Observed contract class epochs
         * @description Bounded, newest-first class epochs from event-time ABI observations. This is partial evidence, not an exhaustive upgrade ledger: changes without an indexed ABI observation can be absent. `truncated` only reports page truncation and must not be interpreted as source coverage.
         */
        get: {
            parameters: {
                query?: {
                    /** @description Maximum class epochs to return (clamped to 1..100; default 25). */
                    limit?: number;
                };
                header?: {
                    /** @description Optional caller-supplied correlation ID echoed back in the response. */
                    "X-Request-Id"?: components["parameters"]["RequestIdHeader"];
                };
                path: {
                    /** @example SN_MAIN */
                    chain: components["parameters"]["ChainParam"];
                    /** @example 0x0123456789abcdef */
                    address: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Partial, observation-backed class epochs for the contract */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ContractClassHistoryView"];
                    };
                };
                400: components["responses"]["BadRequest"];
                401: components["responses"]["UnauthorizedText"];
                403: components["responses"]["ForbiddenText"];
                429: components["responses"]["RateLimited"];
                503: components["responses"]["ServiceUnavailable"];
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
    "/v1/{chain}/contract/{address}/entrypoints": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Contract class entrypoints
         * @description Resolves latest, a block number, or a block hash to one canonical block hash, then reads the contract class hash and ABI at that hash. Use the returned `blockTag` for the paired contract call. Pending is rejected because it cannot be certified across separate requests.
         */
        get: {
            parameters: {
                query?: {
                    /** @description latest, an explicit non-negative block number, or a 0x-prefixed block hash. The response returns the resolved canonical hash. */
                    block_tag?: string;
                };
                header?: {
                    /** @description Optional caller-supplied correlation ID echoed back in the response. */
                    "X-Request-Id"?: components["parameters"]["RequestIdHeader"];
                };
                path: {
                    /** @example SN_MAIN */
                    chain: components["parameters"]["ChainParam"];
                    /** @example 0x0123456789abcdef */
                    address: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Contract entrypoint selectors grouped by type */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ContractEntrypointsView"];
                    };
                };
                400: components["responses"]["BadRequest"];
                401: components["responses"]["UnauthorizedText"];
                403: components["responses"]["ForbiddenText"];
                /** @description Contract/class not found */
                404: {
                    headers: {
                        "X-Request-Id": components["headers"]["RequestId"];
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                429: components["responses"]["RateLimited"];
                503: components["responses"]["ServiceUnavailable"];
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
    "/v1/{chain}/contract/{address}/events": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Paginated contract event logs
         * @description Canonical paginated event/log surface for one contract. Use server-side topic and block filters before applying client-side protocol interpretation. Results are returned newest first in deterministic on-chain order (`blockNumber` DESC, `txIndex` DESC, `logIndex` DESC). `topic0..topic15` address exact key positions: repeated values at one position are OR alternatives, populated positions are ANDed, and omitted positions are wildcards. Each position accepts at most 128 distinct felts and the request accepts at most 256 total. Any `topic1..topic15` filter requires a non-empty `topic0` plus explicit numeric `from_block` and `to_block` values. Ordinary read keys may span at most 10,000 blocks inclusive. For a DB-backed Wallet workspace, every numeric subrange of a declared selector's certified contiguous coverage uses the positional index, including sub-10,000-block windows; narrowing a certified request never selects the raw scan. A Wallet workspace may request a larger range only when every requested selector has certified contiguous index coverage at one common non-zero anchor position. The server chooses the populated position with the fewest requested values, breaking ties by lower position number. Additional populated later positions are applied to those anchor candidates and do not need separate coverage. A selector with no full-range declaration returns `422 full_range_selector_not_supported`; a declared selector whose coverage is not ready for the requested range returns `503 event_key_index_coverage_unavailable`. An uncertified bounded raw scan that exceeds its fixed budget returns `503 event_positional_scan_timeout`; a certified index timeout returns `503 event_positional_index_timeout`. Neither path returns an incomplete page. `selector` aliases `topic0`; `key`/`keys` compatibility inputs fill sequential singleton positions after topic0 on this contract-scoped route only. The request `cursor` is exclusive and resumes after the last seen `(blockNumber, txIndex, logIndex)` tuple. Pass `nextCursor` from the previous response to continue without gaps or duplicates.
         */
        get: {
            parameters: {
                query?: {
                    /** @description Optional repeated exact matches for event key position 0; repeated values are OR, while populated positions are AND. */
                    topic0?: components["schemas"]["EventKeyFeltFilter"];
                    /** @description Optional repeated exact matches for event key position 1; repeated values are OR, while populated positions are AND. */
                    topic1?: components["schemas"]["EventKeyFeltFilter"];
                    /** @description Optional repeated exact matches for event key position 2; repeated values are OR, while populated positions are AND. */
                    topic2?: components["schemas"]["EventKeyFeltFilter"];
                    /** @description Optional repeated exact matches for event key position 3; repeated values are OR, while populated positions are AND. */
                    topic3?: components["schemas"]["EventKeyFeltFilter"];
                    /** @description Optional repeated exact matches for event key position 4; repeated values are OR, while populated positions are AND. */
                    topic4?: components["schemas"]["EventKeyFeltFilter"];
                    /** @description Optional repeated exact matches for event key position 5; repeated values are OR, while populated positions are AND. */
                    topic5?: components["schemas"]["EventKeyFeltFilter"];
                    /** @description Optional repeated exact matches for event key position 6; repeated values are OR, while populated positions are AND. */
                    topic6?: components["schemas"]["EventKeyFeltFilter"];
                    /** @description Optional repeated exact matches for event key position 7; repeated values are OR, while populated positions are AND. */
                    topic7?: components["schemas"]["EventKeyFeltFilter"];
                    /** @description Optional repeated exact matches for event key position 8; repeated values are OR, while populated positions are AND. */
                    topic8?: components["schemas"]["EventKeyFeltFilter"];
                    /** @description Optional repeated exact matches for event key position 9; repeated values are OR, while populated positions are AND. */
                    topic9?: components["schemas"]["EventKeyFeltFilter"];
                    /** @description Optional repeated exact matches for event key position 10; repeated values are OR, while populated positions are AND. */
                    topic10?: components["schemas"]["EventKeyFeltFilter"];
                    /** @description Optional repeated exact matches for event key position 11; repeated values are OR, while populated positions are AND. */
                    topic11?: components["schemas"]["EventKeyFeltFilter"];
                    /** @description Optional repeated exact matches for event key position 12; repeated values are OR, while populated positions are AND. */
                    topic12?: components["schemas"]["EventKeyFeltFilter"];
                    /** @description Optional repeated exact matches for event key position 13; repeated values are OR, while populated positions are AND. */
                    topic13?: components["schemas"]["EventKeyFeltFilter"];
                    /** @description Optional repeated exact matches for event key position 14; repeated values are OR, while populated positions are AND. */
                    topic14?: components["schemas"]["EventKeyFeltFilter"];
                    /** @description Optional repeated exact matches for event key position 15; repeated values are OR, while populated positions are AND. */
                    topic15?: components["schemas"]["EventKeyFeltFilter"];
                    /** @description Repeated alias for `topic0`. `topic0` and `selector` share one 128-item filter budget for key position 0 before duplicate-equivalent values are removed. */
                    selector?: components["schemas"]["EventKeyFeltFilter"];
                    /** @description Contract-route compatibility alias. Repeated values fill the next available singleton positions from `topic1` through `topic15`; `key`, `keys`, and `keys[]` share one 15-value sequential budget and cannot express positional ORs. */
                    key?: components["schemas"]["SequentialEventKeyCompatibilityFilter"];
                    /** @description Alias for `key`; repeated values fill sequential singleton positions from `topic1` through `topic15` and share the same 15-value budget. */
                    keys?: components["schemas"]["SequentialEventKeyCompatibilityFilter"];
                    /** @description Bracket-form alias for `key`; repeated values fill sequential singleton positions from `topic1` through `topic15` and share the same 15-value budget. */
                    "keys[]"?: components["schemas"]["SequentialEventKeyCompatibilityFilter"];
                    /** @description Optional inclusive lower block bound. */
                    from_block?: number;
                    /** @description Optional inclusive upper block bound. */
                    to_block?: number;
                    /** @description Optional cursor in `block:tx:log` numeric format. */
                    cursor?: string;
                    /** @description Page size (clamped to 1..100). */
                    limit?: number;
                };
                header?: {
                    /** @description Optional caller-supplied correlation ID echoed back in the response. */
                    "X-Request-Id"?: components["parameters"]["RequestIdHeader"];
                };
                path: {
                    /** @example SN_MAIN */
                    chain: components["parameters"]["ChainParam"];
                    /** @example 0x0123456789abcdef */
                    address: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Contract event page */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ContractEventPage"];
                    };
                };
                400: components["responses"]["BadRequest"];
                401: components["responses"]["UnauthorizedText"];
                403: components["responses"]["ForbiddenText"];
                /** @description An explicit Sepolia block bound or cursor is outside the rolling indexed-history window. */
                410: {
                    headers: {
                        /** @description Canonical request correlation header for support and tracing. */
                        "X-Request-Id"?: string;
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["HistoryExpiredErrorResponse"];
                    };
                };
                /** @description One or more selectors are not declared for full-range positional search. */
                422: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                429: components["responses"]["RateLimited"];
                503: components["responses"]["ServiceUnavailable"];
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
    "/v1/{chain}/contract/{address}/messages": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Paginated canonical messages for one contract
         * @description Contract-scoped cross-layer message rows served only from indexed StarknetCore protocol message facts. Starkscan does not infer Messages rows from bridge adapter pairing facts, generic transactions, events, or token transfers. Coverage metadata is explicit because a data plane may still be backfilling protocol message facts.
         */
        get: {
            parameters: {
                query?: {
                    /** @description Optional message direction filter. */
                    direction?: "all" | "l1_to_l2" | "l2_to_l1";
                    /** @description Optional transaction hash filter. */
                    txHash?: string;
                    /** @description Optional protocol message hash filter. */
                    messageHash?: string;
                    /** @description Optional opaque cursor returned unchanged from `nextCursor`. New responses use `m1:block:tx:message:tx_hash:message_hash:direction:source_tier` so pagination remains stable when multiple messages share the same numeric tuple. Legacy `block:tx:message` cursors remain accepted for older clients. */
                    cursor?: string;
                    /** @description Page size (clamped to 1..100). */
                    limit?: number;
                };
                header?: {
                    /** @description Optional caller-supplied correlation ID echoed back in the response. */
                    "X-Request-Id"?: components["parameters"]["RequestIdHeader"];
                };
                path: {
                    /** @example SN_MAIN */
                    chain: components["parameters"]["ChainParam"];
                    /** @example 0x0123456789abcdef */
                    address: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Contract message page with explicit coverage metadata */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["MessagePage"];
                    };
                };
                400: components["responses"]["BadRequest"];
                401: components["responses"]["UnauthorizedText"];
                403: components["responses"]["ForbiddenText"];
                429: components["responses"]["RateLimited"];
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
    "/v1/{chain}/contract/{address}/bridge-signals": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Paginated L2 bridge signal activity for one contract
         * @description Returns low-latency bridge rows derived from indexed L2 token-transfer bridge signals, bridge registry matches, and bridge-asset mint/burn signals. This endpoint explicitly reports `coverage.status=partial` until L1 message pairing and cross-layer completion facts are indexed; clients must not treat these rows as complete L1/L2 lifecycle records.
         */
        get: {
            parameters: {
                query?: {
                    /** @description Optional cursor in `block:tx:log:transfer` numeric format. */
                    cursor?: string;
                    /** @description Page size (clamped to 1..100). */
                    limit?: number;
                };
                header?: {
                    /** @description Optional caller-supplied correlation ID echoed back in the response. */
                    "X-Request-Id"?: components["parameters"]["RequestIdHeader"];
                };
                path: {
                    /** @example SN_MAIN */
                    chain: components["parameters"]["ChainParam"];
                    /** @example 0x0123456789abcdef */
                    address: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Contract bridge signal page with explicit coverage metadata */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ContractBridgeTransactionPage"];
                    };
                };
                400: components["responses"]["BadRequest"];
                401: components["responses"]["UnauthorizedText"];
                403: components["responses"]["ForbiddenText"];
                410: components["responses"]["HistoryExpired"];
                429: components["responses"]["RateLimited"];
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
    "/v1/{chain}/contract/{address}/read": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Read-only contract call */
        get: {
            parameters: {
                query: {
                    /**
                     * @description 0x-prefixed entrypoint selector felt
                     * @example 0x0123456789abcdef
                     */
                    selector: string;
                    /** @description Optional felt/decimal calldata values (repeat key for multiple values). */
                    calldata?: string[];
                    /** @description State reference used for call execution. Use `latest` or `pending` for live reads, or pass a block number/hash for deterministic correctness checks. */
                    block_tag?: components["schemas"]["BlockReference"];
                };
                header?: {
                    /** @description Optional caller-supplied correlation ID echoed back in the response. */
                    "X-Request-Id"?: components["parameters"]["RequestIdHeader"];
                };
                path: {
                    /** @example SN_MAIN */
                    chain: components["parameters"]["ChainParam"];
                    /** @example 0x0123456789abcdef */
                    address: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Read call result */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ContractReadResultView"];
                    };
                };
                400: components["responses"]["BadRequest"];
                401: components["responses"]["UnauthorizedText"];
                403: components["responses"]["ForbiddenText"];
                /** @description Contract or entrypoint not found */
                404: {
                    headers: {
                        "X-Request-Id": components["headers"]["RequestId"];
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                429: components["responses"]["RateLimited"];
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
    "/v1/{chain}/contract/{address}/storage": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Read one raw contract storage slot
         * @description Reads one storage slot at a validated Starknet block reference. The response echoes the normalized contract address and slot key plus the validated caller block-reference text used for the read.
         */
        get: {
            parameters: {
                query: {
                    /**
                     * @description Storage-slot key as a 0x-prefixed felt or decimal felt.
                     * @example 0x0
                     */
                    key: string;
                    /** @description State reference used for the storage read. Use `latest` or `pending` for live reads, or pass a block number/hash for deterministic correctness checks. */
                    block_tag?: components["schemas"]["BlockReference"];
                };
                header?: {
                    /** @description Optional caller-supplied correlation ID echoed back in the response. */
                    "X-Request-Id"?: components["parameters"]["RequestIdHeader"];
                };
                path: {
                    /** @example SN_MAIN */
                    chain: components["parameters"]["ChainParam"];
                    /** @example 0x0123456789abcdef */
                    address: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Storage-slot value */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ContractStorageResultView"];
                    };
                };
                400: components["responses"]["BadRequest"];
                401: components["responses"]["UnauthorizedText"];
                403: components["responses"]["ForbiddenText"];
                /** @description Contract or block not found */
                404: {
                    headers: {
                        "X-Request-Id": components["headers"]["RequestId"];
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                429: components["responses"]["RateLimited"];
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
    "/v1/{chain}/address/{address}/activity": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Paginated address activity */
        get: {
            parameters: {
                query?: {
                    /** @description Optional opaque cursor returned unchanged from `nextCursor`. New responses use `block:tx:log:transfer:kind:txHash[:source]` so pagination remains stable when multiple activity rows share the same numeric tuple. Legacy `block:tx:log:transfer` cursors remain accepted for older clients. */
                    cursor?: string;
                    /** @description Page size (clamped to 1..100). */
                    limit?: number;
                };
                header?: {
                    /** @description Optional caller-supplied correlation ID echoed back in the response. */
                    "X-Request-Id"?: components["parameters"]["RequestIdHeader"];
                };
                path: {
                    /** @example SN_MAIN */
                    chain: components["parameters"]["ChainParam"];
                    /** @example 0x0123456789abcdef */
                    address: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Address activity page */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["AddressActivityPage"];
                    };
                };
                401: components["responses"]["UnauthorizedText"];
                403: components["responses"]["ForbiddenText"];
                410: components["responses"]["HistoryExpired"];
                429: components["responses"]["RateLimited"];
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
    "/v1/{chain}/address/{address}/transfers": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Paginated token transfers touching one address
         * @description Address-scoped transfer history backed by the indexed global transfer table. Direction, token, block, cursor, and limit filters are applied before pagination. `any` returns transfers where the address is either sender or recipient; self-transfers are returned once. `in` returns recipient-side rows and `out` returns sender-side rows, so a self-transfer appears in both directional views. Rows are newest-first by `(blockNumber, txIndex, logIndex, transferIndex)`; `nextCursor` is an exclusive continuation boundary and must be passed back unchanged.
         */
        get: {
            parameters: {
                query?: {
                    /** @description Optional direction relative to the path address: `any`, `in`, or `out`. */
                    direction?: "any" | "in" | "out";
                    /** @description Optional repeated token-address filter. */
                    token?: string[];
                    /** @description Indexed transfer-standard filter. Friendly aliases `fungible`, `ft`, `nft`, and `multitoken` are accepted. */
                    type?: "erc20" | "erc721" | "erc1155" | "unknown" | "fungible" | "ft" | "nft" | "multitoken";
                    /** @description Exact case-insensitive indexed token-symbol filter. Ambiguous symbols matching more than 128 contracts fail closed. */
                    symbol?: string;
                    /** @description Inclusive lower timestamp resolved once through the indexed block-timestamp read model before transfer pagination. */
                    timestampFrom?: string | number;
                    /** @description Case-insensitive indexed transaction-type filter for the transfer's transaction. Canonical values are `DECLARE`, `DEPLOY`, `DEPLOY_ACCOUNT`, `INVOKE`, and `L1_HANDLER`; Xverse aliases such as `execute` are normalized to `INVOKE`. */
                    invocationType?: string;
                    /** @description Optional inclusive lower block bound. */
                    from_block?: number;
                    /** @description Optional inclusive upper block bound. */
                    to_block?: number;
                    /** @description Optional opaque continuation cursor returned by `nextCursor`. The current representation is `block:tx:log:transfer`; pass it back unchanged and do not construct or advance it client-side. */
                    cursor?: string;
                    /** @description Page size (clamped to 1..100). */
                    limit?: number;
                };
                header?: {
                    /** @description Optional caller-supplied correlation ID echoed back in the response. */
                    "X-Request-Id"?: components["parameters"]["RequestIdHeader"];
                };
                path: {
                    /** @example SN_MAIN */
                    chain: components["parameters"]["ChainParam"];
                    /** @example 0x0123456789abcdef */
                    address: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Address transfer page */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["GlobalTransferPage"];
                    };
                };
                400: components["responses"]["BadRequest"];
                401: components["responses"]["UnauthorizedText"];
                403: components["responses"]["ForbiddenText"];
                410: components["responses"]["HistoryExpired"];
                429: components["responses"]["RateLimited"];
                503: components["responses"]["ServiceUnavailable"];
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
    "/v1/{chain}/token/{token}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Token aggregate summary
         * @description Token metadata plus versioned transfer aggregates. Read `summaryCacheStatus` before interpreting counts: `stale` aggregates can lag the independently indexed transfer feed, while `metadata_only` returns null aggregate counts and can still expose an independently known `latestTransferBlock`. Never coerce unavailable counts to zero.
         */
        get: {
            parameters: {
                query?: never;
                header?: {
                    /** @description Optional caller-supplied correlation ID echoed back in the response. */
                    "X-Request-Id"?: components["parameters"]["RequestIdHeader"];
                };
                path: {
                    /** @example SN_MAIN */
                    chain: components["parameters"]["ChainParam"];
                    /** @example 0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d */
                    token: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Token summary */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["TokenSummaryView"];
                    };
                };
                401: components["responses"]["UnauthorizedText"];
                403: components["responses"]["ForbiddenText"];
                /** @description Token not found */
                404: {
                    headers: {
                        "X-Request-Id": components["headers"]["RequestId"];
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                429: components["responses"]["RateLimited"];
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
    "/v1/{chain}/token/{token}/total-supply": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Standard-token totalSupply read */
        get: {
            parameters: {
                query?: {
                    /**
                     * @description State reference used for call execution. Use `latest` or `pending` for live reads, or pass a block number/hash for deterministic correctness checks.
                     * @example latest
                     */
                    block_tag?: components["schemas"]["BlockReference"];
                };
                header?: {
                    /** @description Optional caller-supplied correlation ID echoed back in the response. */
                    "X-Request-Id"?: components["parameters"]["RequestIdHeader"];
                };
                path: {
                    /** @example SN_MAIN */
                    chain: components["parameters"]["ChainParam"];
                    /** @example 0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d */
                    token: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Standard-token totalSupply result */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["TokenTotalSupplyView"];
                    };
                };
                400: components["responses"]["BadRequest"];
                401: components["responses"]["UnauthorizedText"];
                403: components["responses"]["ForbiddenText"];
                /** @description Contract does not expose a supported totalSupply selector */
                404: {
                    headers: {
                        "X-Request-Id": components["headers"]["RequestId"];
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                429: components["responses"]["RateLimited"];
                503: components["responses"]["ServiceUnavailable"];
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
    "/v1/{chain}/token/{token}/balance-of/{address}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Standard-token balanceOf read */
        get: {
            parameters: {
                query?: {
                    /**
                     * @description State reference used for call execution. Use `latest` or `pending` for live reads, or pass a block number/hash for deterministic correctness checks.
                     * @example latest
                     */
                    block_tag?: components["schemas"]["BlockReference"];
                };
                header?: {
                    /** @description Optional caller-supplied correlation ID echoed back in the response. */
                    "X-Request-Id"?: components["parameters"]["RequestIdHeader"];
                };
                path: {
                    /** @example SN_MAIN */
                    chain: components["parameters"]["ChainParam"];
                    /** @example 0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d */
                    token: string;
                    /** @example 0x00ca1702e64c81d9a07b86bd2c540188d92a2c73cf5cc0e508d949015e7e84a7 */
                    address: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Standard-token balanceOf result */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["TokenBalanceOfView"];
                    };
                };
                400: components["responses"]["BadRequest"];
                401: components["responses"]["UnauthorizedText"];
                403: components["responses"]["ForbiddenText"];
                /** @description Contract does not expose a supported balanceOf selector */
                404: {
                    headers: {
                        "X-Request-Id": components["headers"]["RequestId"];
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                429: components["responses"]["RateLimited"];
                503: components["responses"]["ServiceUnavailable"];
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
    "/v1/{chain}/token/{token}/holders": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Gap-free token-holder pagination over an immutable indexed generation
         * @description Partner-tier endpoint for token-contract-first holder enumeration. The first page selects a sealed finalized holder generation and v3 cursors retain that generation under concurrent transfers until `snapshot.expiresAt`. The default cursor/retired-generation retention is six hours; the response deadline is authoritative. An unchanged active generation does not expire merely because no transfer arrived. Follow `nextCursor` to null and require one stable snapshot identity plus contiguous ranks through `holderCount` for a complete walk. The generation queue covers every indexed ERC-20 token discovered from finalized fungible balances or ERC-20 metadata, not a top-token allowlist. Results come from Starkscan's indexed ledger, not a request-time transfer scan or RPC enumeration. RPC has no all-holder enumeration method; `balanceOf` is used only for bounded deterministic certification samples at the exact snapshot block hash.
         *
         *     Partner-tier route backed by materialized serving tables. It is intended for bounded indexed reads and must not run request-time scans or repairs.
         */
        get: {
            parameters: {
                query?: {
                    /** @description Optional opaque v3 cursor returned unchanged from `nextCursor` in the previous response. It is scoped to one chain, token, immutable generation, block identity, row anchor, and expiry. Never parse or construct it. Invalid, cross-scope, revoked, or expired cursors return typed `400 invalid_request` restart guidance and never fall back to the first page. A temporarily unavailable holder generation returns retryable `503 service_unavailable` with `Retry-After`; retry the same cursor rather than restarting the walk. */
                    cursor?: string;
                    /** @description Page size (clamped to 1..100). */
                    limit?: number;
                };
                header?: {
                    /** @description Optional caller-supplied correlation ID echoed back in the response. */
                    "X-Request-Id"?: components["parameters"]["RequestIdHeader"];
                };
                path: {
                    /** @example SN_MAIN */
                    chain: components["parameters"]["ChainParam"];
                    /** @example 0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d */
                    token: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description One immutable holder-generation page. Ordinary pagination does not set `completeness.truncated`; `nextCursor` alone describes page coverage, while `completeness.exact` and `certification` describe correctness of the full generation. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["TokenHolderPage"];
                    };
                };
                400: components["responses"]["BadRequest"];
                401: components["responses"]["UnauthorizedText"];
                403: components["responses"]["ForbiddenText"];
                /** @description Token contract not found or not recognized as a fungible token. */
                404: {
                    headers: {
                        "X-Request-Id": components["headers"]["RequestId"];
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                429: components["responses"]["RateLimited"];
                503: components["responses"]["ServiceUnavailable"];
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
    "/v1/{chain}/token/{token}/holders/screening": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Bounded immutable top-holder screening projection
         * @description Partner-tier whale screening backed only by an offline immutable top-K projection. K is address-keyed policy (200, 100, 50, or 10 for the launch cohort; 10 by default). Page size remains at most 100. Exhausting `nextCursor` proves only that this projection is exhausted, never that the token's holder population is complete. The response therefore keeps `screening.populationComplete=false` and `screening.exact=false`. Use `/holders` and its coverage plus certification evidence for a complete exact walk. Both routes use balance-descending, canonical-address ordering and make no request-time RPC or historical scan. When no immutable screening generation is published yet, the route returns a retryable `503` with `Retry-After`.
         */
        get: {
            parameters: {
                query?: {
                    /** @description Opaque generation-bound cursor returned by the previous screening page. Pass it back unchanged before `snapshot.expiresAt`; the service default retention is six hours, but that timestamp is authoritative. Restart from page one after expiry. */
                    cursor?: string;
                    /** @description Page size (clamped to 1..100); this does not change policy Top-N. */
                    limit?: number;
                };
                header?: {
                    /** @description Optional caller-supplied correlation ID echoed back in the response. */
                    "X-Request-Id"?: components["parameters"]["RequestIdHeader"];
                };
                path: {
                    /** @example SN_MAIN */
                    chain: components["parameters"]["ChainParam"];
                    /** @example 0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d */
                    token: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description One immutable bounded screening page. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["TokenHolderScreeningPage"];
                    };
                };
                400: components["responses"]["BadRequest"];
                401: components["responses"]["UnauthorizedText"];
                403: components["responses"]["ForbiddenText"];
                429: components["responses"]["RateLimited"];
                503: components["responses"]["ServiceUnavailable"];
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
    "/v1/{chain}/token/{token}/holders/analytics": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Generation-bound token holder concentration analytics
         * @description Returns concentration metrics computed from the complete sealed holder generation, never from the loaded holder page. Generation-bound results repeat `generationId`, `asOfBlock`, `asOfBlockHash`, and `rowDigest` so consumers can prove that analytics and holder pages refer to the same population. `expiresAt` is a response-specific continuation deadline, not part of the durable generation identity. `computedAt` records the offline refresh time. Missing generation identity or `completeness.exact=false` is a degraded signal, not a fresh exact analytics claim. The request path performs no holder scan or RPC call.
         *
         *     Partner-tier route backed by materialized serving tables. It is intended for bounded indexed reads and must not run request-time scans or repairs.
         */
        get: {
            parameters: {
                query?: never;
                header?: {
                    /** @description Optional caller-supplied correlation ID echoed back in the response. */
                    "X-Request-Id"?: components["parameters"]["RequestIdHeader"];
                };
                path: {
                    /** @example SN_MAIN */
                    chain: components["parameters"]["ChainParam"];
                    /** @example 0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d */
                    token: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Token holder analytics snapshot */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["TokenHolderAnalyticsSnapshot"];
                    };
                };
                400: components["responses"]["BadRequest"];
                401: components["responses"]["UnauthorizedText"];
                403: components["responses"]["ForbiddenText"];
                /** @description Token contract not found or not recognized as a fungible token. */
                404: {
                    headers: {
                        "X-Request-Id": components["headers"]["RequestId"];
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                429: components["responses"]["RateLimited"];
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
    "/v1/{chain}/token/{token}/controls": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Indexed token control facts
         * @description Returns the latest operator-materialized token control snapshot. Results are served from `token_controls_snapshot`; the request path does not run live RPC, public explorer calls, request-time ABI probes, or Account Calls.
         */
        get: {
            parameters: {
                query?: never;
                header?: {
                    /** @description Optional caller-supplied correlation ID echoed back in the response. */
                    "X-Request-Id"?: components["parameters"]["RequestIdHeader"];
                };
                path: {
                    /** @example SN_MAIN */
                    chain: components["parameters"]["ChainParam"];
                    /** @example 0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d */
                    token: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Token controls snapshot or a typed not-indexed response */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["TokenControlsView"];
                    };
                };
                400: components["responses"]["BadRequest"];
                401: components["responses"]["UnauthorizedText"];
                403: components["responses"]["ForbiddenText"];
                /** @description Token contract not found or not recognized as a fungible token. */
                404: {
                    headers: {
                        "X-Request-Id": components["headers"]["RequestId"];
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                429: components["responses"]["RateLimited"];
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
    "/v1/{chain}/token/{token}/markets/pools": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Materialized token DEX pool facts
         * @description Partner-tier endpoint for token-contract-first pool facts. Rows are served from `token_market_pool_snapshot`; token-level totals are served from the materialized rollup and are not recomputed on request. The route never performs request-time DEX, RPC, transfer, or Account Calls probes.
         *
         *     Partner-tier route backed by materialized serving tables. It is intended for bounded indexed reads and must not run request-time scans or repairs.
         */
        get: {
            parameters: {
                query?: {
                    /** @description Page size (clamped to 1..100). */
                    limit?: number;
                };
                header?: {
                    /** @description Optional caller-supplied correlation ID echoed back in the response. */
                    "X-Request-Id"?: components["parameters"]["RequestIdHeader"];
                };
                path: {
                    /** @example SN_MAIN */
                    chain: components["parameters"]["ChainParam"];
                    /** @example 0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d */
                    token: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Token market pool page */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["TokenMarketPoolPage"];
                    };
                };
                400: components["responses"]["BadRequest"];
                401: components["responses"]["UnauthorizedText"];
                403: components["responses"]["ForbiddenText"];
                /** @description Token contract not found or not recognized as a fungible token. */
                404: {
                    headers: {
                        "X-Request-Id": components["headers"]["RequestId"];
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                429: components["responses"]["RateLimited"];
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
    "/v1/{chain}/token/{token}/transfers": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Paginated token transfers with optional address and block filters
         * @description Rows are newest-first by `(blockNumber, txIndex, logIndex, transferIndex)`. `nextCursor` is an exclusive continuation boundary and must be passed back unchanged. List rows may intentionally omit historical USD enrichment (`historicalUsd: null`); null is not a current or zero price.
         */
        get: {
            parameters: {
                query?: {
                    /** @description Optional repeated wallet/address filter; matches transfers where either side is in the supplied set. */
                    address?: string[];
                    /** @description Optional inclusive lower block bound. */
                    from_block?: number;
                    /** @description Optional inclusive upper block bound. */
                    to_block?: number;
                    /** @description Optional exclusive cursor returned by `nextCursor` in `block:tx:log:transfer` numeric format. Pass it back unchanged. */
                    cursor?: string;
                    /** @description Page size (clamped to 1..100). */
                    limit?: number;
                };
                header?: {
                    /** @description Optional caller-supplied correlation ID echoed back in the response. */
                    "X-Request-Id"?: components["parameters"]["RequestIdHeader"];
                };
                path: {
                    /** @example SN_MAIN */
                    chain: components["parameters"]["ChainParam"];
                    /** @example 0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d */
                    token: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Token transfer page */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["TokenTransferPage"];
                    };
                };
                401: components["responses"]["UnauthorizedText"];
                403: components["responses"]["ForbiddenText"];
                410: components["responses"]["HistoryExpired"];
                429: components["responses"]["RateLimited"];
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
    "/v1/{chain}/events": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Paginated raw events with optional address, positional key, and block filters
         * @description Protocol-neutral indexed event search. `topic0..topic15` address exact key positions: repeated values at one position are OR alternatives, populated positions are ANDed, and omitted positions are wildcards. Each position accepts at most 128 distinct felts and the request accepts at most 256 total. `key`, `keys`, and `keys[]` are intentionally rejected on this global route because they do not identify a key position. Any `topic1..topic15` filter requires a non-empty `topic0` plus explicit numeric `from_block` and `to_block` values. Ordinary read keys may span at most 10,000 blocks inclusive; DB-backed Wallet workspaces use the positional index for every numeric subrange of declared, certified contiguous coverage, including sub-10,000-block windows. They may request larger ranges only when every requested selector has certified contiguous coverage at one common non-zero anchor position. The server chooses the populated position with the fewest requested values, breaking ties by lower position number. Additional populated later positions are applied to those anchor candidates and do not need separate coverage. A selector with no full-range declaration returns `422 full_range_selector_not_supported`; a declared selector whose coverage is not ready for the requested range returns `503 event_key_index_coverage_unavailable`. An uncertified bounded raw scan that exceeds its fixed budget returns `503 event_positional_scan_timeout`; a certified index timeout returns `503 event_positional_index_timeout`. Neither path returns a partial page. Address filters do not replace the topic0 anchor. For later-position global searches, address-by-topic0 fanout is capped at 256 pairs after expanding accepted canonical and legacy felt spellings.
         */
        get: {
            parameters: {
                query?: {
                    /** @description Optional repeated contract/address filter. */
                    address?: string[];
                    /** @description Alias for repeated `address` filters, matching Voyager-style `/events?contract=...` clients. `address`, `contract`, and `contractAddress` share one 128-item filter budget before duplicate-equivalent values are removed. */
                    contract?: string[];
                    /** @description Alias for repeated `address` filters. `address`, `contract`, and `contractAddress` share one 128-item filter budget before duplicate-equivalent values are removed. */
                    contractAddress?: string[];
                    /** @description Optional repeated exact matches for event key position 0; repeated values are OR, while populated positions are AND. */
                    topic0?: components["schemas"]["EventKeyFeltFilter"];
                    /** @description Optional repeated exact matches for event key position 1; repeated values are OR, while populated positions are AND. */
                    topic1?: components["schemas"]["EventKeyFeltFilter"];
                    /** @description Optional repeated exact matches for event key position 2; repeated values are OR, while populated positions are AND. */
                    topic2?: components["schemas"]["EventKeyFeltFilter"];
                    /** @description Optional repeated exact matches for event key position 3; repeated values are OR, while populated positions are AND. */
                    topic3?: components["schemas"]["EventKeyFeltFilter"];
                    /** @description Optional repeated exact matches for event key position 4; repeated values are OR, while populated positions are AND. */
                    topic4?: components["schemas"]["EventKeyFeltFilter"];
                    /** @description Optional repeated exact matches for event key position 5; repeated values are OR, while populated positions are AND. */
                    topic5?: components["schemas"]["EventKeyFeltFilter"];
                    /** @description Optional repeated exact matches for event key position 6; repeated values are OR, while populated positions are AND. */
                    topic6?: components["schemas"]["EventKeyFeltFilter"];
                    /** @description Optional repeated exact matches for event key position 7; repeated values are OR, while populated positions are AND. */
                    topic7?: components["schemas"]["EventKeyFeltFilter"];
                    /** @description Optional repeated exact matches for event key position 8; repeated values are OR, while populated positions are AND. */
                    topic8?: components["schemas"]["EventKeyFeltFilter"];
                    /** @description Optional repeated exact matches for event key position 9; repeated values are OR, while populated positions are AND. */
                    topic9?: components["schemas"]["EventKeyFeltFilter"];
                    /** @description Optional repeated exact matches for event key position 10; repeated values are OR, while populated positions are AND. */
                    topic10?: components["schemas"]["EventKeyFeltFilter"];
                    /** @description Optional repeated exact matches for event key position 11; repeated values are OR, while populated positions are AND. */
                    topic11?: components["schemas"]["EventKeyFeltFilter"];
                    /** @description Optional repeated exact matches for event key position 12; repeated values are OR, while populated positions are AND. */
                    topic12?: components["schemas"]["EventKeyFeltFilter"];
                    /** @description Optional repeated exact matches for event key position 13; repeated values are OR, while populated positions are AND. */
                    topic13?: components["schemas"]["EventKeyFeltFilter"];
                    /** @description Optional repeated exact matches for event key position 14; repeated values are OR, while populated positions are AND. */
                    topic14?: components["schemas"]["EventKeyFeltFilter"];
                    /** @description Optional repeated exact matches for event key position 15; repeated values are OR, while populated positions are AND. */
                    topic15?: components["schemas"]["EventKeyFeltFilter"];
                    /** @description Repeated alias for `topic0`. `topic0` and `selector` share one 128-item filter budget for key position 0 before duplicate-equivalent values are removed. */
                    selector?: components["schemas"]["EventKeyFeltFilter"];
                    /** @description Optional inclusive lower block bound. */
                    from_block?: number;
                    /** @description Optional inclusive upper block bound. */
                    to_block?: number;
                    /** @description Optional cursor in `block:tx:log` numeric format. */
                    cursor?: string;
                    /** @description Page size (clamped to 1..100). */
                    limit?: number;
                };
                header?: {
                    /** @description Optional caller-supplied correlation ID echoed back in the response. */
                    "X-Request-Id"?: components["parameters"]["RequestIdHeader"];
                };
                path: {
                    /** @example SN_MAIN */
                    chain: components["parameters"]["ChainParam"];
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Global raw event page */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["GlobalEventPage"];
                    };
                };
                400: components["responses"]["BadRequest"];
                401: components["responses"]["UnauthorizedText"];
                403: components["responses"]["ForbiddenText"];
                410: components["responses"]["HistoryExpired"];
                /** @description One or more selectors are not declared for full-range positional search. */
                422: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                429: components["responses"]["RateLimited"];
                503: components["responses"]["ServiceUnavailable"];
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
    "/v1/{chain}/transfers": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Paginated normalized transfers with optional address, token, and block filters
         * @description Rows are newest-first by `(blockNumber, txIndex, logIndex, transferIndex)`. `nextCursor` is an exclusive continuation boundary and must be passed back unchanged. List rows may intentionally omit historical USD enrichment (`historicalUsd: null`); null is not a current or zero price.
         */
        get: {
            parameters: {
                query?: {
                    /** @description Optional repeated wallet/address filter; matches transfers where either side is in the supplied set. */
                    address?: string[];
                    /** @description Optional repeated token-address filter. */
                    token?: string[];
                    /** @description Indexed transfer-standard filter. Friendly aliases `fungible`, `ft`, `nft`, and `multitoken` are accepted. */
                    type?: "erc20" | "erc721" | "erc1155" | "unknown" | "fungible" | "ft" | "nft" | "multitoken";
                    /** @description Exact case-insensitive indexed token-symbol filter. Ambiguous symbols matching more than 128 contracts fail closed. */
                    symbol?: string;
                    /** @description Inclusive lower timestamp resolved once through the indexed block-timestamp read model before transfer pagination. */
                    timestampFrom?: string | number;
                    /** @description Case-insensitive indexed transaction-type filter for the transfer's transaction. Canonical values are `DECLARE`, `DEPLOY`, `DEPLOY_ACCOUNT`, `INVOKE`, and `L1_HANDLER`; Xverse aliases such as `execute` are normalized to `INVOKE`. */
                    invocationType?: string;
                    /** @description Optional direction relative to supplied address filters. Requires at least one `address` filter. */
                    direction?: "any" | "in" | "out";
                    /** @description Optional inclusive lower block bound. */
                    from_block?: number;
                    /** @description Optional inclusive upper block bound. */
                    to_block?: number;
                    /** @description Optional exclusive cursor returned by `nextCursor` in `block:tx:log:transfer` numeric format. Pass it back unchanged. */
                    cursor?: string;
                    /** @description Page size (clamped to 1..100). */
                    limit?: number;
                };
                header?: {
                    /** @description Optional caller-supplied correlation ID echoed back in the response. */
                    "X-Request-Id"?: components["parameters"]["RequestIdHeader"];
                };
                path: {
                    /** @example SN_MAIN */
                    chain: components["parameters"]["ChainParam"];
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Global transfer page */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["GlobalTransferPage"];
                    };
                };
                400: components["responses"]["BadRequest"];
                401: components["responses"]["UnauthorizedText"];
                403: components["responses"]["ForbiddenText"];
                410: components["responses"]["HistoryExpired"];
                429: components["responses"]["RateLimited"];
                503: components["responses"]["ServiceUnavailable"];
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
    "/v1/{chain}/historical-pricing/coverage": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Prepared historical transaction-time USD coverage summary
         * @description Returns one prepared finalized coverage row for the bounded historical pricing contract. The request never scans transfers, calls a price provider, or substitutes current/spot prices for missing transaction-time evidence. `pendingMaterializationTransfers` means an eligible transfer has no fact yet; typed-unavailable reasons are materialized facts and must not be presented as current valuations.
         */
        get: {
            parameters: {
                query?: never;
                header?: {
                    /** @description Optional caller-supplied correlation ID echoed back in the response. */
                    "X-Request-Id"?: components["parameters"]["RequestIdHeader"];
                };
                path: {
                    /** @example SN_MAIN */
                    chain: components["parameters"]["ChainParam"];
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Prepared bounded historical-pricing coverage summary */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["TokenTransferUsdCoverageSnapshot"];
                    };
                };
                400: components["responses"]["BadRequest"];
                401: components["responses"]["UnauthorizedText"];
                403: components["responses"]["ForbiddenText"];
                /** @description No prepared coverage snapshot exists for this chain yet. */
                404: {
                    headers: {
                        "X-Request-Id": components["headers"]["RequestId"];
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                429: components["responses"]["RateLimited"];
                503: components["responses"]["ServiceUnavailable"];
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
    "/v1/{chain}/privacy-pool/events": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Paginated privacy-pool public events
         * @description v1 supports server-side filtering by `event` only. Contract/transaction/block filters shown in the UI are client-side over loaded windows.
         */
        get: operations["listPrivacyPoolEvents"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/{chain}/privacy-pool/commitments": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Paginated privacy-pool commitment facts
         * @description Cursor-backed commitment evidence from durable privacy-pool serving tables. This endpoint exposes public commitment facts only; it does not infer ownership, linkage, balances, anonymity set size, or note state.
         */
        get: operations["listPrivacyPoolCommitments"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/{chain}/privacy-pool/nullifiers": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Paginated privacy-pool nullifier facts
         * @description Cursor-backed nullifier evidence from durable privacy-pool serving tables. This endpoint exposes public nullifier facts only; it does not infer which commitment was spent, owner linkage, balances, or anonymity set size.
         */
        get: operations["listPrivacyPoolNullifiers"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/{chain}/privacy-pool/status": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Privacy-pool public status counters
         * @description Counter-focused public status snapshot for v1. Includes decoded counters plus raw-vs-decoded event cursor freshness so clients can detect materialization lag without querying RPC.
         */
        get: operations["getPrivacyPoolStatus"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/{chain}/privacy-pool/analytics": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Privacy-pool analytics snapshot
         * @description Low-latency analytics derived from indexed privacy-pool event rows and token metadata. This route intentionally avoids per-request RPC and external price calls; unavailable metrics explain which additional data sources or attribution rules are still required.
         */
        get: operations["getPrivacyPoolAnalytics"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/{chain}/privacy-pool/tvl": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Finalized Privacy Pool public-flow snapshot
         * @description Partner-oriented, versioned snapshot of public deposits minus public withdrawals from Starkscan's depth-confirmed indexed finalized tier. `finalizedOnly` does not mean L1 settlement: clients may call the snapshot L1-accepted only when `coverage.asOfL1Accepted` is true. The route reads a bounded materialized snapshot plus indexed latest-cursor and L1-acceptance evidence; it never scans event history or calls RPC on request. Raw token amounts, token addresses, and decimals are the supported integration inputs. Legacy price, valueUsd, valuation, and totalUsd fields are compatibility-only and must not be used as a new integration's pricing or accounting source. External integrations should call the authenticated https://api.starkscan.co/v1/{chain}/privacy-pool/tvl endpoint, or /api/v1/{chain}/privacy-pool/tvl on an app-origin deployment. Responses include weak ETag and Last-Modified validators. If-None-Match takes precedence over If-Modified-Since and a matching conditional read returns 304 with no body. Authenticated external responses remain private; validators reduce transfer and serialization work but do not authorize a shared cache to reuse keyed responses.
         */
        get: operations["getPrivacyPoolTvl"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/{chain}/privacy-pool/tvl/series": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Finalized Privacy Pool hourly protected-value history
         * @description Oldest-first hourly cumulative public deposits minus public withdrawals from Starkscan's prepared finalized ledger. Raw address-keyed token amounts are authoritative. Historical USD fields are intentionally null: clients must apply their own token price at each point timestamp. The request path reads only bounded hourly serving rows and indexed token metadata; it never scans events or calls RPC, Voyager, or a price provider. Responses include weak ETag and Last-Modified validators. If-None-Match takes precedence over If-Modified-Since and a matching conditional read returns 304 with no body.
         */
        get: operations["listPrivacyPoolTvlHourlyPoints"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/{chain}/privacy-pool/metric-buckets": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Privacy-pool public metric buckets
         * @description Precomputed daily buckets for tiny public-metric histograms. This route reads a bounded serving table only; it does not scan raw events, call RPC, infer ownership, link notes, or estimate anonymity k.
         */
        get: operations["listPrivacyPoolMetricBuckets"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/{chain}/privacy-pool/metrics/series": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Privacy-pool prepared metric series
         * @description Precomputed public metric series for charting viewing-key growth and token shielded supply. This route reads prepared buckets only; it does not scan raw events on request, call RPC, infer private ownership, link notes, or estimate anonymity k.
         */
        get: operations["getPrivacyPoolMetricSeries"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/{chain}/metrics/network": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Prepared Starknet network metrics
         * @description Bounded finalized Starknet network metrics for dashboarding. This route serves metric values from prepared buckets only; it does not aggregate raw blocks, logs, or transactions on the request path, call an upstream RPC provider, or represent ERC-4337 user operations. Returned coverage and lag metadata uses one indexed finalized-tip lookup so staged backfills cannot appear as complete history.
         */
        get: {
            parameters: {
                query?: {
                    /** @description Requested prepared metrics window. Starkscan exposes product periods only: `30d`, `90d`, `ytd`, and `all`. The backend reads bounded hourly prepared buckets and returns calendar display buckets: daily for `30d`/`90d`, January-1-anchored weekly for `ytd`, and monthly for `all`. `all` is explicitly bounded to the latest 9,000 prepared hours, not full raw chain history. The response coverage timestamps remain exact prepared-source bounds, so a partial calendar bucket never appears complete. */
                    window?: "30d" | "90d" | "ytd" | "all";
                };
                header?: {
                    /** @description Optional caller-supplied correlation ID echoed back in the response. */
                    "X-Request-Id"?: components["parameters"]["RequestIdHeader"];
                };
                path: {
                    /** @example SN_MAIN */
                    chain: components["parameters"]["ChainParam"];
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Prepared finalized Starknet network metric series with explicit materializer coverage status. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["NetworkMetricSeriesPage"];
                    };
                };
                400: components["responses"]["BadRequest"];
                401: components["responses"]["UnauthorizedText"];
                403: components["responses"]["ForbiddenText"];
                429: components["responses"]["RateLimited"];
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
    "/v1/{chain}/metrics/wallets": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Prepared wallet-provider metrics
         * @description Finalized account metrics grouped by known wallet implementation families. The route reads a prepared snapshot only. Priced fungible value is a lower bound over positive finalized balances with non-stale USD quotes; NFTs, DeFi and LP positions, lending collateral, and unpriced assets are excluded. OpenZeppelin-based accounts are an implementation family, not a wallet brand or user identity.
         */
        get: {
            parameters: {
                query?: never;
                header?: {
                    /** @description Optional caller-supplied correlation ID echoed back in the response. */
                    "X-Request-Id"?: components["parameters"]["RequestIdHeader"];
                };
                path: {
                    /** @example SN_MAIN */
                    chain: components["parameters"]["ChainParam"];
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Prepared finalized wallet-provider metrics with explicit classification and freshness coverage. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["WalletProviderMetricPage"];
                    };
                };
                401: components["responses"]["UnauthorizedText"];
                403: components["responses"]["ForbiddenText"];
                429: components["responses"]["RateLimited"];
                503: components["responses"]["ServiceUnavailable"];
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
    "/v1/{chain}/prove": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Submit one STRK20 proof request
         * @description Invite-only, mainnet-only asynchronous relay for an already formed STRK20 transaction. A mandatory Idempotency-Key absorbs safe client retries before upstream dispatch. Poll the returned jobId; a terminal unknown_delivery status is non-retryable because the prover may have received the request even though no complete response reached Starkscan. The route is absent when the relay is disabled.
         */
        post: {
            parameters: {
                query?: never;
                header: {
                    /**
                     * @description Stable unique key for this exact proof request.
                     * @example starkscan-example-proof-request-0001
                     */
                    "Idempotency-Key": string;
                    /** @description Optional caller-supplied correlation ID echoed back in the response. */
                    "X-Request-Id"?: components["parameters"]["RequestIdHeader"];
                };
                path: {
                    /** @example SN_MAIN */
                    chain: components["parameters"]["ChainParam"];
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["ProveRequest"];
                };
            };
            responses: {
                /** @description An idempotent replay returned the original job. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ProveJobView"];
                    };
                };
                /** @description A new proof job was accepted. */
                202: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ProveJobView"];
                    };
                };
                400: components["responses"]["BadRequest"];
                401: components["responses"]["UnauthorizedText"];
                403: components["responses"]["ForbiddenText"];
                /** @description Relay disabled or unsupported chain. */
                404: {
                    headers: {
                        "X-Request-Id": components["headers"]["RequestId"];
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                409: components["responses"]["Conflict"];
                /** @description Request body exceeds the one-megabyte bound. */
                413: {
                    headers: {
                        /** @description Canonical request correlation header for support and tracing. */
                        "X-Request-Id"?: string;
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                429: components["responses"]["RateLimited"];
                503: components["responses"]["ServiceUnavailable"];
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/{chain}/prove/{job_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Poll one STRK20 proof job
         * @description Returns a workspace-owned proof job. Stop polling when terminal is true. Never automatically resubmit a job whose status is unknown_delivery. The route is absent when the relay is disabled.
         */
        get: {
            parameters: {
                query?: never;
                header?: {
                    /** @description Optional caller-supplied correlation ID echoed back in the response. */
                    "X-Request-Id"?: components["parameters"]["RequestIdHeader"];
                };
                path: {
                    /** @example SN_MAIN */
                    chain: components["parameters"]["ChainParam"];
                    /** @example prv_0123456789abcdefghijklmn */
                    job_id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Current job state and terminal result or error when available. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ProveJobView"];
                    };
                };
                401: components["responses"]["UnauthorizedText"];
                403: components["responses"]["ForbiddenText"];
                /** @description Relay disabled, unsupported chain, or job not found for this workspace. */
                404: {
                    headers: {
                        "X-Request-Id": components["headers"]["RequestId"];
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                429: components["responses"]["RateLimited"];
                503: components["responses"]["ServiceUnavailable"];
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
    "/v1/me/api-keys": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List self-serve API keys for the authenticated workspace
         * @description Returns metadata for the current workspace's self-serve Starkscan API keys. Secrets are never returned by this route. Hosted browser sessions may authenticate this safe read with Better Auth cookies or an explicit bearer session token.
         */
        get: {
            parameters: {
                query?: never;
                header?: {
                    /** @description Optional caller-supplied correlation ID echoed back in the response. */
                    "X-Request-Id"?: components["parameters"]["RequestIdHeader"];
                };
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Self-serve API key list */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["SelfServeApiKeyListResponse"];
                    };
                };
                401: components["responses"]["UnauthorizedSelfServeSession"];
                429: components["responses"]["RateLimited"];
                503: components["responses"]["ServiceUnavailable"];
            };
        };
        put?: never;
        /**
         * Issue or rotate the default self-serve API key for the authenticated workspace
         * @description Issues a live API key with read, batch, and write scopes for the current workspace. Write scope is an entitlement only: execution remains gated by forwarding availability, structural payload validation, a dedicated upstream, plan limits and credits, and the global kill switch. If an active default key already exists, the old key is revoked and replaced in the same operation. This mutating route requires `Authorization: Bearer <better_auth_session_token>` and rejects cookie-only calls.
         */
        post: {
            parameters: {
                query?: never;
                header?: {
                    /** @description Optional caller-supplied correlation ID echoed back in the response. */
                    "X-Request-Id"?: components["parameters"]["RequestIdHeader"];
                };
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Issued self-serve API key */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["SelfServeIssueApiKeyResult"];
                    };
                };
                401: components["responses"]["UnauthorizedSelfServeSession"];
                403: components["responses"]["ForbiddenSelfServeMutation"];
                429: components["responses"]["RateLimited"];
                503: components["responses"]["ServiceUnavailable"];
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/me/api-keys/{public_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /**
         * Revoke one self-serve API key for the authenticated workspace
         * @description Revokes the selected self-serve API key and returns its final metadata snapshot. This mutating route requires `Authorization: Bearer <better_auth_session_token>` and rejects cookie-only calls.
         */
        delete: {
            parameters: {
                query?: never;
                header?: {
                    /** @description Optional caller-supplied correlation ID echoed back in the response. */
                    "X-Request-Id"?: components["parameters"]["RequestIdHeader"];
                };
                path: {
                    /** @example example_key_01 */
                    public_id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Revoked self-serve API key */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["SelfServeApiKeyDeleteResponse"];
                    };
                };
                401: components["responses"]["UnauthorizedSelfServeSession"];
                403: components["responses"]["ForbiddenSelfServeMutation"];
                /** @description Self-serve API key not found */
                404: {
                    headers: {
                        "X-Request-Id": components["headers"]["RequestId"];
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                429: components["responses"]["RateLimited"];
                503: components["responses"]["ServiceUnavailable"];
            };
        };
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/me/redeem-code": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Redeem a single-use workspace-plan access code
         * @description Atomically consumes one labeled, unexpired and unrevoked access code and applies its plan to the authenticated workspace. Codes are single-use; missing, expired, revoked and already-used values share the same error. This mutating route requires `Authorization: Bearer <better_auth_session_token>` and rejects cookie-only calls.
         */
        post: {
            parameters: {
                query?: never;
                header?: {
                    /** @description Optional caller-supplied correlation ID echoed back in the response. */
                    "X-Request-Id"?: components["parameters"]["RequestIdHeader"];
                };
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["SelfServePartnerAccessCodeRequest"];
                };
            };
            responses: {
                /** @description Access code consumed and workspace plan updated */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["SelfServePartnerAccessCodeResponse"];
                    };
                };
                400: components["responses"]["BadRequest"];
                401: components["responses"]["UnauthorizedSelfServeSession"];
                403: components["responses"]["ForbiddenSelfServeMutation"];
                429: components["responses"]["RateLimited"];
                503: components["responses"]["ServiceUnavailable"];
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/me/usage": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Load recent self-serve API usage for the authenticated workspace
         * @description Returns a recent usage window, per-key aggregates, recent requests, and recent failures for the current self-serve workspace. Hosted browser sessions may authenticate this safe read with Better Auth cookies or an explicit bearer session token.
         */
        get: {
            parameters: {
                query?: never;
                header?: {
                    /** @description Optional caller-supplied correlation ID echoed back in the response. */
                    "X-Request-Id"?: components["parameters"]["RequestIdHeader"];
                };
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Self-serve usage snapshot */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["SelfServeUsageSnapshot"];
                    };
                };
                401: components["responses"]["UnauthorizedSelfServeSession"];
                429: components["responses"]["RateLimited"];
                503: components["responses"]["ServiceUnavailable"];
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
    "/v1/{chain}/search": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Universal search
         * @description Identifier-only search for recognized transaction hashes, block references, and addresses. It is not ticker, symbol, or free-text search; the response has separate `blocks`, `transactions`, and `addresses` arrays, not a generic `results` field.
         */
        get: {
            parameters: {
                query: {
                    /**
                     * @description Required exact or prefix identifier query. Missing or empty values return 400. Exact hash/address-style queries resolve first match in this order: transaction hash -> address -> block hash (single category returned). Prefix address matching reads address-activity tables only; addresses that appear exclusively in token-transfer activity remain accessible via `/v1/{chain}/address/{address}` but are not returned by `/search`.
                     * @example 0x054bfd961fb8b156c77ffa0f7882b8fcc1836753c2d3d88435b640d6300c8bd9
                     */
                    q: string;
                };
                header?: {
                    /** @description Optional caller-supplied correlation ID echoed back in the response. */
                    "X-Request-Id"?: components["parameters"]["RequestIdHeader"];
                };
                path: {
                    /** @example SN_MAIN */
                    chain: components["parameters"]["ChainParam"];
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Search results */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["SearchView"];
                    };
                };
                401: components["responses"]["UnauthorizedText"];
                403: components["responses"]["ForbiddenText"];
                410: components["responses"]["HistoryExpired"];
                429: components["responses"]["RateLimited"];
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
        EventKeyFeltFilter: string[];
        SequentialEventKeyCompatibilityFilter: string[];
        StakingRatio: {
            numeratorRaw: string;
            denominatorRaw: string;
        };
        StakingCoverage: {
            /** @enum {string} */
            status: "prepared" | "catching_up" | "unavailable";
            reasonCode: string;
            /** @constant */
            finalizedOnly: true;
            /** Format: int64 */
            materializedThroughBlock: number | null;
            materializedThroughHash: string | null;
            /** Format: int64 */
            sourceLatestFinalizedBlock: number | null;
            /** Format: int64 */
            lagBlocks: number | null;
            /** @description True when the prepared activity feed retains only its newest bounded window; full finalized history remains in the immutable source ledger. */
            activityHistoryTruncated: boolean;
            gapIntervals: components["schemas"]["StakingCoverageGap"][];
            outstandingMaterializationIntervals: components["schemas"]["StakingCoverageGap"][];
            metricDefinitionVersion: string | null;
            /** Format: date-time */
            lastSuccessfulRunAtIso: string | null;
        };
        StakingCoverageGap: {
            reasonCode: string;
            /** Format: int64 */
            fromBlock: number | null;
            /** Format: int64 */
            throughBlock: number | null;
            terminal: boolean;
        };
        StakingTokenAmount: {
            tokenAddress: string;
            symbol: string | null;
            decimals: number | null;
            selfStakeRaw: string | null;
            delegatedStakeRaw: string | null;
            totalStakeRaw: string | null;
            pendingExitRaw: string | null;
            networkShare: components["schemas"]["StakingRatio"] | null;
            metricValueReason: string | null;
        };
        StakingPool: {
            tokenAddress: string;
            address: string;
            generationRaw: string;
            /** @enum {string} */
            status: "active" | "retired";
            top1Share: components["schemas"]["StakingRatio"] | null;
            top5Share: components["schemas"]["StakingRatio"] | null;
            hhi: components["schemas"]["StakingRatio"] | null;
            metricValueReason: string | null;
        };
        StakingNetworkToken: {
            tokenAddress: string;
            symbol: string | null;
            decimals: number | null;
            totalStakeRaw: string | null;
            /** Format: int64 */
            nakamoto33Count: number | null;
            metricValueReason: string | null;
        };
        StakingAddressHistory: {
            /** @enum {string} */
            role: "reward" | "operational";
            address: string;
            /** Format: int64 */
            effectiveFromBlock: number;
            effectiveFromBlockHash: string;
            /** Format: int32 */
            effectiveFromTxIndex: number;
            effectiveFromTxHash: string;
            /** Format: int32 */
            effectiveFromLogIndex: number;
            /** Format: int32 */
            effectiveFromFactIndex: number;
            emitterAddress: string;
            contractClassHash: string;
            decoderVersion: string;
            decoderFingerprint: string;
            /** @constant */
            finality: "finalized";
            callPath: unknown;
            callPathReasonCode: unknown;
            /** Format: int64 */
            effectiveToBlock: number | null;
        } & components["schemas"]["StakingCallPathAvailability"];
        StakingCallPathAvailability: {
            callPath: number[];
            callPathReasonCode: null;
        } | {
            callPath: null;
            /** @constant */
            callPathReasonCode: "call_path_unavailable";
        };
        StakingDelegator: {
            validatorGenerationId: string;
            validatorAddress: string;
            tokenAddress: string;
            poolAddress: string;
            address: string;
            delegatedRaw: string;
            pendingExitRaw: string | null;
            /** @enum {string} */
            status: "active" | "exiting";
            share: components["schemas"]["StakingRatio"] | null;
        };
        StakingActivity: {
            validatorGenerationId: string;
            validatorAddress: string;
            /** Format: int64 */
            blockNumber: number;
            /** Format: int32 */
            transactionIndex: number;
            /** Format: int32 */
            logIndex: number;
            factIndex: number;
            transactionHash: string;
            /** Format: date-time */
            timestampIso: string;
            emitterAddress: string;
            contractClassHash: string;
            decoderVersion: string;
            /** @constant */
            finality: "finalized";
            callPath: unknown;
            callPathReasonCode: unknown;
            /** @enum {string} */
            kind: "validator_registered" | "validator_deleted" | "staker_exit_intent" | "pool_registered" | "pool_retired" | "stake_own_balance_changed" | "stake_delegated_balance_changed" | "pool_member_registered" | "pool_member_balance_changed" | "exit_intent" | "exit_action" | "pool_member_switched";
            participantAddress: string | null;
            tokenAddress: string | null;
            amountRaw: string | null;
        } & components["schemas"]["StakingCallPathAvailability"];
        StakingReward: {
            tokenAddress: string;
            accruedSnapshotRaw: string | null;
            claimedWithinCoverageRaw: string;
            /** Format: int64 */
            coverageFromBlock: number;
            /** Format: int64 */
            coverageThroughBlock: number;
            /** @enum {string} */
            accountingStatus: "exact" | "unavailable";
            accountingReasonCode: string | null;
            realizedYield: components["schemas"]["StakingRatio"] | null;
            /** @enum {string} */
            yieldStatus: "exact" | "unavailable";
            /** @enum {string|null} */
            yieldReasonCode: "stake_time_coverage_incomplete" | "reward_token_scope_unavailable" | "position_history_gap" | null;
        };
        StakingValidator: {
            validatorGenerationId: string;
            address: string;
            name: string | null;
            protocolSlug: string | null;
            website: string | null;
            /** @enum {string|null} */
            status: "active" | "inactive" | "exiting" | null;
            rewardAddress: string | null;
            operationalAddress: string | null;
            commission: components["schemas"]["StakingRatio"] | null;
            /** Format: int64 */
            delegatorCount: number | null;
            liveness30d: components["schemas"]["StakingRatio"] | null;
            liveness30dReasonCode: string | null;
            liveness90d: components["schemas"]["StakingRatio"] | null;
            liveness90dReasonCode: string | null;
            lastAttestationEpochRaw: string | null;
            /** Format: int64 */
            missedStreak: number | null;
            metricValueReason: string | null;
            stake: components["schemas"]["StakingTokenAmount"][];
            pools: components["schemas"]["StakingPool"][];
            rewards: components["schemas"]["StakingReward"][];
        };
        StakingSummaryPage: {
            chainId: string;
            currentEpochRaw: string | null;
            /** Format: int64 */
            validatorCount: number | null;
            /** Format: int64 */
            delegatorCount: number | null;
            networkLiveness: components["schemas"]["StakingRatio"] | null;
            networkLivenessReasonCode: string | null;
            networkEffectiveness: components["schemas"]["StakingRatio"] | null;
            networkEffectivenessReasonCode: string | null;
            normalizedPowerUnit: string | null;
            normalizationRevision: string | null;
            metricValueReason: string | null;
            tokens: components["schemas"]["StakingNetworkToken"][];
            tokensTruncated: boolean;
            coverage: components["schemas"]["StakingCoverage"];
            /** @constant */
            source: "finalized_prepared_staking_snapshot";
        };
        StakingValidatorPage: {
            chainId: string;
            items: components["schemas"]["StakingValidator"][];
            nextCursor: string | null;
            coverage: components["schemas"]["StakingCoverage"];
            /** @constant */
            source: "finalized_prepared_staking_snapshot";
        };
        StakingValidatorDetail: {
            chainId: string;
            validator: components["schemas"]["StakingValidator"] | null;
            addressHistory: components["schemas"]["StakingAddressHistory"][];
            addressHistoryTruncated: boolean;
            coverage: components["schemas"]["StakingCoverage"];
            /** @constant */
            source: "finalized_prepared_staking_snapshot";
        };
        StakingDelegatorPage: {
            chainId: string;
            items: components["schemas"]["StakingDelegator"][];
            nextCursor: string | null;
            coverage: components["schemas"]["StakingCoverage"];
            /** @constant */
            source: "finalized_prepared_staking_snapshot";
        };
        StakingActivityPage: {
            chainId: string;
            items: components["schemas"]["StakingActivity"][];
            nextCursor: string | null;
            coverage: components["schemas"]["StakingCoverage"];
            /** @constant */
            source: "finalized_prepared_staking_snapshot";
        };
        StakingAddressView: {
            chainId: string;
            address: string;
            positions: components["schemas"]["StakingDelegator"][];
            positionsTruncated: boolean;
            history: components["schemas"]["StakingActivity"][];
            nextHistoryCursor: string | null;
            coverage: components["schemas"]["StakingCoverage"];
            /** @constant */
            source: "finalized_prepared_staking_snapshot";
        };
        /** @description State reference. Block hashes are validated against the Starknet field range; decimal block numbers must be non-negative signed 64-bit values. */
        BlockReference: ("latest" | "pending") | string;
        /** @description Machine-readable error envelope. JSON error responses also emit `X-Request-Id` as the canonical correlation header when the request has one; `requestId` mirrors it when available inside the handler. */
        ErrorResponse: {
            /** @enum {string} */
            code: "invalid_request" | "invalid_cursor" | "unauthorized" | "forbidden" | "not_found" | "conflict" | "rate_limited" | "service_unavailable" | "event_positional_scan_timeout" | "event_positional_index_timeout" | "event_key_index_coverage_unavailable" | "full_range_selector_not_supported" | "internal_error" | "api_error";
            message: string;
            /** @description Stable docs slug agents can use for next-step guidance. */
            docSlug: string;
            /** @description Mirrors `X-Request-Id` when available inside the handler; the response header is canonical. */
            requestId: string | null;
            /**
             * Format: int64
             * @description Highest `to_block` proved servable for the exact failed selector/key request. Present only for coverage-unavailable errors with a safe non-empty prefix.
             */
            maxServableToBlock?: number;
        };
        /** @description Explicit Sepolia response for a request before the certified fixed indexed-history boundary. It is distinct from an unknown resource (`404`) and from indexer lag. */
        HistoryExpiredErrorResponse: {
            /** @enum {string} */
            code: "history_expired";
            message: string;
            /** @description Stable docs slug agents can use for next-step guidance. */
            docSlug: string;
            /** @description Mirrors `X-Request-Id` when available inside the handler; the response header is canonical. */
            requestId: string | null;
            /** @enum {string} */
            historyPolicy: "fixed_start";
            /** @enum {string} */
            historyCompleteness: "complete_from_earliest_available";
            /**
             * Format: int32
             * @description Legacy rolling-window duration. Omitted for the fixed-start Sepolia policy.
             */
            retentionDays?: number;
            /** Format: int64 */
            earliestAvailableBlock: number;
            /** Format: date-time */
            earliestAvailableAt: string;
        };
        /** @description Starknet JSON-RPC 2.0 request object accepted by the gateway. */
        JsonRpcRequest: {
            /** @enum {string} */
            jsonrpc: "2.0";
            method: string;
            params?: unknown[] | {
                [key: string]: unknown;
            } | null;
            id?: string | number | null;
        } & {
            [key: string]: unknown;
        };
        /** @description JSON-RPC batch request accepted by the gateway pilot. */
        JsonRpcBatchRequest: components["schemas"]["JsonRpcRequest"][];
        JsonRpcError: {
            code: number;
            message: string;
            /** @description Optional JSON-RPC error data payload; may be any JSON value. */
            data?: unknown;
        } & {
            [key: string]: unknown;
        };
        /** @description Starknet JSON-RPC 2.0 result or error envelope. */
        JsonRpcResponse: ({
            /** @enum {string} */
            jsonrpc: "2.0";
            id: string | number | null;
            result?: unknown;
            error?: components["schemas"]["JsonRpcError"];
        } & {
            [key: string]: unknown;
        }) & (unknown | unknown);
        /** @description JSON-RPC batch response from the gateway, bounded to 16 MiB serialized. */
        JsonRpcBatchResponse: components["schemas"]["JsonRpcResponse"][];
        AgentMemoryContract: {
            /** @enum {string} */
            kind: "starkscan.agent_memory";
            /** @example 2026-05-02 */
            schemaVersion: string;
            /** @enum {string} */
            generatedFor: "agents";
            auth: {
                /** @example X-Starkscan-Api-Key */
                header: string;
                /** @example /v1 */
                externalBasePath: string;
                /** @example SN_MAIN */
                defaultChain: string;
            } & {
                [key: string]: unknown;
            };
            firstCalls: components["schemas"]["AgentFirstCall"][];
            routeFamilies: components["schemas"]["AgentMemoryRouteFamily"][];
            workspaceMemory: components["schemas"]["AgentWorkspaceMemoryContract"];
            operatingRules: string[];
            issueReportContract: components["schemas"]["AgentIssueReportContract"];
        } & {
            [key: string]: unknown;
        };
        AgentFirstCall: {
            /** @example GET */
            method: string;
            /** @example /v1/meta/capabilities */
            path: string;
            purpose: string;
        } & {
            [key: string]: unknown;
        };
        /** @description One caller-eligible operation from the runtime correctness manifest. Use openapiOperationRef against MetaCapabilitiesView.documentation.openapiUrl as a URI fragment, percent-decode the fragment once, then use the resulting JSON Pointer to retrieve parameters, request bodies, response schemas, and examples. */
        AgentRouteOperation: {
            /** @example GET */
            method: string;
            /** @example /api/v1/{chain}/status */
            path: string;
            /** @example /v1/{chain}/status */
            openapiPath: string;
            /**
             * @example get
             * @enum {string}
             */
            openapiMethod: "get" | "post" | "put" | "patch" | "delete" | "head" | "options";
            /** @example #/paths/~1v1~1%7Bchain%7D~1status/get */
            openapiOperationRef: string;
            /**
             * @description Value returned in `X-Starkscan-Route-Class` for this operation. Use it with the rate-limit response headers for class-specific backoff.
             * @enum {string}
             */
            rateLimitClass: "light" | "heavy" | "batch";
            summary: string;
        };
        AgentRouteFamily: {
            name: string;
            /** @enum {string} */
            tier: "read" | "batch";
            routes: string[];
            operations: components["schemas"]["AgentRouteOperation"][];
            useWhen: string;
        } & {
            [key: string]: unknown;
        };
        /** @description Public route-family summary from the unauthenticated agent-memory document. Detailed operations are intentionally omitted until a caller proves its API-key scope through the capabilities endpoint. */
        AgentMemoryRouteFamily: {
            name: string;
            /** @enum {string} */
            tier: "read" | "batch";
            routes: string[];
            useWhen: string;
        } & {
            [key: string]: unknown;
        };
        CapabilitiesDocumentation: {
            /**
             * Format: uri
             * @description Canonical public URL for the OpenAPI artifact. This is absolute because api.starkscan.co is API-only and does not serve documentation artifacts.
             * @constant
             */
            openapiUrl: "https://starkscan.co/starkscan-openapi.yaml";
            /** @constant */
            openapiPath: "/starkscan-openapi.yaml";
            /** @constant */
            openapiFormat: "OpenAPI 3.1";
            /** @constant */
            operationReferenceFormat: "URI-encoded JSON Pointer fragment";
            operationLookup: string;
        };
        /** @description Authenticated capability view for agents and developers. */
        MetaCapabilitiesView: {
            /** @enum {string} */
            kind: "starkscan.meta.capabilities";
            schemaVersion: string;
            defaultChain: string;
            /** @example X-Starkscan-Api-Key */
            authHeader: string;
            /** @enum {string} */
            externalBasePath: "/v1" | "/api/v1";
            firstCalls: components["schemas"]["AgentFirstCall"][];
            documentation: components["schemas"]["CapabilitiesDocumentation"];
            rateLimit: components["schemas"]["CapabilitiesRateLimit"];
            routeFamilies: components["schemas"]["AgentRouteFamily"][];
            sessionControl: components["schemas"]["SessionControlCapability"];
            apiKeyLifecycle: components["schemas"]["ApiKeyLifecycleCapability"];
            caller: components["schemas"]["CallerCapabilities"];
            eventSearch: components["schemas"]["PositionalEventSearchCapability"];
            rpcProvider: components["schemas"]["RpcProviderCapability"];
            walletInteraction: components["schemas"]["WalletInteractionCapability"];
            operatingRules: string[];
            issueReportContract: components["schemas"]["AgentIssueReportContract"];
        } & {
            [key: string]: unknown;
        };
        /** @description Caller-specific positional event-search contract. The bounded path is available to ordinary read callers. External full-range search additionally requires a DB-backed Wallet workspace; the authenticated loopback internal operator lane is also entitled. Both paths require certified contiguous index coverage for every requested selector at one common non-zero anchor position. The server chooses the populated position with the fewest requested values, breaking ties by lower position number. Additional populated later positions are applied to those anchor candidates and do not need separate coverage; entitlement alone never makes incomplete index data serveable. */
        PositionalEventSearchCapability: {
            chain: string;
            positions: {
                /** @enum {integer} */
                minimum: 0;
                /** @enum {integer} */
                maximum: 15;
            };
            bounded: {
                /** @enum {boolean} */
                enabled: true;
                /** @enum {integer} */
                maximumBlocksInclusive: 10000;
            };
            fullRange: {
                entitled: boolean;
                /**
                 * @description Required for external callers; an authenticated loopback internal caller is an explicit alternative entitlement.
                 * @enum {string}
                 */
                requiredWorkspacePlan: "wallet";
                /** @enum {string} */
                coverageContract: "certified_per_selector_position";
                /** @enum {string} */
                unsupportedResponse: "422_full_range_selector_not_supported";
                /** @enum {string} */
                unavailableResponse: "503_event_key_index_coverage_unavailable";
                /**
                 * @description `available` means selectorCoverage is the complete bounded lookup result and every returned row is currently ready through its observed source high-water. `partial` means the lookup succeeded but selectorCoverage is a bounded prefix or at least one returned row is stale/building/failed. Clients must use row-level throughBlock and freshnessStatus before planning a wide request, and must not infer that an omitted selector lacks coverage when this value is `partial`. `unavailable` means the lookup failed or timed out.
                 * @enum {string}
                 */
                coverageAvailability: "available" | "partial" | "unavailable";
                /** @description Current selector-position coverage facts for this chain. Clients must only request full-range filtering when every selected topic0 is ready at the same anchor position and the requested numeric range is covered. Before matching, clients must canonicalize each requested topic0 to compact lowercase `0x` form by lowercasing hex digits and removing leading zeroes. Padded or uppercase request spellings are accepted as filters but never appear in `selector`. The server chooses the populated anchor position with the fewest requested values, breaking ties by lower position number. Additional populated later positions are applied to the anchor candidates and do not need separate coverage. A full-range request joins adjacent tier intervals in one repeatable-read snapshot: `finalized` is the retained historical prefix and `head` is the current moving source tail. `head.fromBlock` can increase when promoted rows leave the head table; that does not mean history is absent when the preceding finalized interval is adjacent. `throughBlock` remains each tier's only certified upper bound. openEnded and liveMaintenance describe a maintained projection, not an unbounded serving promise. The server rejects a request unless the exact tier intervals form a gap-free union for the requested numeric range. Compare sourceHighWaterBlock, lagBlocks, and freshnessStatus before planning a wide request; `stale` is an honest coverage gap, while `unavailable` means lifecycle coverage is not ready or that tier has no indexed block watermark. Both receive the typed unavailable response rather than a partial result. */
                selectorCoverage: components["schemas"]["EventKeySelectorCoverage"][];
            };
        };
        EventKeySelectorCoverage: {
            /** @description Canonical compact topic0 selector covered by this record. */
            selector: string;
            position: number;
            /**
             * @description `finalized` is the retained historical prefix. `head` is the moving current source tail and is joined to finalized coverage by the server on one repeatable-read snapshot.
             * @enum {string}
             */
            sourceTier: "finalized" | "head";
            /** @description Lowest block in this tier's contiguous certified interval. A finalized fromBlock is its retained-history floor. A head fromBlock is the current moving tail floor and can increase after finalization; it does not by itself signal a history gap. */
            fromBlock: number;
            /** @description Highest block in this tier's contiguous source/index interval verified by the most recent bounded parity certification. It is that tier's hard upper bound for full-range serving; the server requires adjacent finalized/head intervals rather than treating either tier as a separate all-history promise. */
            throughBlock: number;
            openEnded: boolean;
            liveMaintenance: boolean;
            /** @enum {string} */
            status: "building" | "ready" | "failed";
            /** Format: date-time */
            verifiedAt: string | null;
            /** @description Latest indexed block observed for this source tier while capabilities were built. It is informational and may advance before coverage is certified. */
            sourceHighWaterBlock: number | null;
            /** @description Non-negative difference between sourceHighWaterBlock and throughBlock. For head this measures the current moving-tail lag, not retained-history coverage. Null only when the source tier has no indexed high-water observation. */
            lagBlocks: number | null;
            /**
             * @description `current` means this tier's certified interval reaches its observed source high-water; `stale` means it does not; `unavailable` means lifecycle coverage is not ready or this tier has no indexed block watermark. Never infer current coverage from openEnded or liveMaintenance alone.
             * @enum {string}
             */
            freshnessStatus: "current" | "stale" | "unavailable";
        } & (unknown & unknown & unknown & unknown);
        /** @description Public HTTP rate-limit/backoff contract. It intentionally names only response headers and classes, never a key, workspace, or internal limiter bucket. */
        CapabilitiesRateLimit: {
            responseHeaders: {
                /** @enum {string} */
                routeClass: "X-Starkscan-Route-Class";
                /** @enum {string} */
                limit: "x-ratelimit-limit";
                /** @enum {string} */
                remaining: "x-ratelimit-remaining";
                /** @enum {string} */
                policy: "x-ratelimit-policy";
                /** @enum {string} */
                retryAfter: "Retry-After";
            };
            classes: ("light" | "heavy" | "batch")[];
            operationDisclosure: string;
            retryRule: string;
        };
        /** @description Separate dashboard workspace control-plane boundary. It is visible in API-key capabilities so clients do not mistake a typed 401 on `/v1/me/*` for an API-key failure, but API keys must never authorize these routes. */
        SessionControlCapability: {
            /** @enum {string} */
            status: "separate_dashboard_session_control_plane";
            /** @enum {string} */
            pathPrefix: "/v1/me";
            /** @enum {string} */
            apiKeyAccess: "not_supported";
            safeReadAuth: ("better_auth_session_cookie" | "bearer_session_token")[];
            /** @enum {string} */
            mutationAuth: "bearer_session_token";
            /** @enum {string} */
            documentationPath: "/docs/api/self-serve";
        };
        /** @description API-key lifecycle contract. Inactive credentials deliberately receive a generic OAuth-compatible 401 response; lifecycle reason is never exposed. Rate-limit decisions stay distinct as 429 with Retry-After. */
        ApiKeyLifecycleCapability: {
            /** @enum {string} */
            inactiveKeyResponse: "generic_401_invalid_token";
            /**
             * @description Exact challenge returned for revoked or expired API keys; the generic response does not disclose which lifecycle state applied.
             * @enum {string}
             */
            inactiveKeyWwwAuthenticate: "Bearer realm=\"starkscan\", error=\"invalid_token\"";
            /** @enum {string} */
            rateLimitResponse: "429_with_retry_after";
            /** @enum {string} */
            ownerInspectionPath: "/v1/me/api-keys";
            /** @enum {string} */
            internalObservability: "sanitized_lifecycle_reason_metrics";
        };
        RpcProviderCapability: {
            /** @enum {string} */
            status: "enrolled_http_beta" | "authenticated_http_beta";
            /** @example /api/v1/SN_MAIN/rpc */
            endpoint: string;
            /** @example /api/v1/{chain}/rpc */
            endpointTemplate: string;
            /** @example X-Starkscan-Api-Key */
            authHeader: string;
            /** @example 0.10.2 */
            minimumSpecVersion: string;
            /** @example 0.10.2 */
            publicSpecVersion: string;
            /** @enum {string} */
            specVersionContract: "gateway_declared_compatibility";
            /** @enum {string} */
            specVersionMethod: "starknet_specVersion";
            supportedBlockTags: ("latest" | "pending" | "pre_confirmed" | "l1_accepted")[];
            conditionalBlockTags: {
                l1_accepted: {
                    advertised: boolean;
                    /** @enum {string} */
                    evidence: "indexed_canonical_l1_accepted_watermark";
                };
            };
            batch: {
                supported: boolean;
                maxItems: number;
                maxResponseBytes: number;
                /** @enum {string} */
                accounting: "Each JSON-RPC child request is classified and rate-limited independently.";
            };
            storageProofBeta: components["schemas"]["StorageProofCapability"];
            writeBeta: {
                enabled: boolean;
                /** @enum {string} */
                status: "enrolled_write_scoped_keys_only" | "disabled_until_operator_enabled" | "all_api_keys_signed_payloads_only";
                openToAllApiKeys: boolean;
                methods: ("starknet_addInvokeTransaction" | "starknet_addDeclareTransaction" | "starknet_addDeployAccountTransaction")[];
                payloadPolicy: string;
                /** @enum {string} */
                quotaClass: "rpc_write";
            };
            traceBeta: {
                /** @enum {string} */
                status: "operator_scoped";
                /** @enum {string} */
                scope: "trace";
                methods: ("starknet_traceTransaction" | "starknet_traceBlockTransactions")[];
                /** @enum {string} */
                quotaClass: "rpc_trace";
                maxResponseBytes: number;
                /** @enum {string} */
                stateDiffPolicy: "omitted_use_starknet_getStateUpdate";
                /** @enum {string} */
                incompleteResponsePolicy: "fail_closed_trace_response_incomplete";
                policy: string;
            };
            quotaClasses: {
                rpc_read_light: ("rpc.discover" | "starknet_chainId" | "starknet_specVersion" | "starknet_blockNumber" | "starknet_blockHashAndNumber" | "starknet_syncing")[];
                rpc_read_state: ("starknet_call" | "starknet_getStorageAt" | "starknet_getStorageProof" | "starknet_getClass" | "starknet_getClassHashAt" | "starknet_getClassAt" | "starknet_getCompiledCasm" | "starknet_getNonce")[];
                rpc_read_history: ("starknet_getBlockWithTxHashes" | "starknet_getBlockWithTxs" | "starknet_getBlockWithReceipts" | "starknet_getBlockTransactionCount" | "starknet_getTransactionByBlockIdAndIndex" | "starknet_getTransactionByHash" | "starknet_getTransactionReceipt" | "starknet_getTransactionStatus" | "starknet_getMessagesStatus" | "starknet_getStateUpdate" | "starknet_getEvents")[];
                rpc_simulation: ("starknet_simulateTransactions" | "starknet_estimateFee" | "starknet_estimateMessageFee")[];
                rpc_write: ("starknet_addInvokeTransaction" | "starknet_addDeclareTransaction" | "starknet_addDeployAccountTransaction")[];
                rpc_trace: ("starknet_traceTransaction" | "starknet_traceBlockTransactions")[];
            };
            unsupportedUntilCertified: ("websocket_subscriptions" | "broad_trace_methods" | "archive_history_full_provider" | "no_key_public_rpc")[];
        } & {
            [key: string]: unknown;
        };
        StorageProofCapability: {
            /** @enum {boolean} */
            enabled: true;
            /** @enum {string} */
            status: "bounded_upstream_passthrough";
            /** @enum {string} */
            availability: "upstream_dependent";
            /** @enum {string} */
            method: "starknet_getStorageProof";
            /** @enum {string} */
            quotaClass: "rpc_read_state";
            acceptedBlockIds: ("latest" | "block_number" | "block_hash")[];
            rejectedBlockTags: ("pending" | "pre_confirmed")[];
            limits: {
                /** @enum {integer} */
                maxClassHashes: 8;
                /** @enum {integer} */
                maxContractAddresses: 8;
                /** @enum {integer} */
                maxContractStoragePairs: 8;
                /** @enum {integer} */
                maxStorageKeysPerContract: 16;
                /** @enum {integer} */
                maxTotalTargets: 32;
                /** @enum {string} */
                totalTargetCounting: "class_hashes_plus_contract_addresses_plus_individual_storage_keys";
                /** @enum {integer} */
                maxResponseBytes: 1048576;
            };
            historicalHorizon: {
                /** @enum {boolean} */
                advertised: false;
                /** @enum {string} */
                status: "not_certified";
                guaranteedBlocksBehindHead: null;
                /** @enum {integer} */
                certificationTargetBlocksBehindHead: 50000;
                policy: string;
            };
            stateDiffCommitment: {
                /** @enum {boolean} */
                advertised: false;
                /** @enum {boolean} */
                guaranteed: false;
                /** @enum {string} */
                status: "not_in_starknet_openrpc_0_10_2";
                /** @enum {string} */
                passthroughPolicy: "preserved_if_returned_by_upstream_not_synthesized_or_certified";
                policy: string;
            };
            /** @enum {string} */
            responseValidation: "opaque_upstream_result_size_bounded";
        };
        CallerCapabilities: {
            authenticated: boolean;
            authType: string;
            keyClass: string | null;
            scopes: ("read" | "batch" | "write" | "prove" | "trace")[];
            /** @enum {string} */
            scopeDisclosure: "exact_for_api_key" | "not_available_for_auth_type" | "not_bound_to_request" | "operator_internal";
            /** @enum {string} */
            routeFamilyDisclosure: "exact_for_api_key" | "verified_read_lower_bound" | "global_operator_view" | "global_unbound" | "fail_closed";
            /** @description Durable workspace plan for a DB-backed API key. Null when no workspace entitlement is safely bound to this request. */
            workspacePlan: null | ("free" | "developer" | "growth" | "business" | "enterprise" | "wallet");
            rateLimit: null | {
                /** @enum {string} */
                loadClass: "light" | "heavy";
                limitPerMinute: number;
                remaining: number;
                retryAfterSeconds: number;
                /** @enum {string} */
                bucketScope: "key" | "workspace";
            };
        };
        WalletInteractionCapability: {
            enabled: boolean;
            /** @enum {string} */
            status: "disabled_until_operator_enabled" | "sepolia_basic_submission_pilot";
            supportedChains: "SN_SEPOLIA"[];
            contractAllowlist: string[];
            transactionPolicy: {
                maxCalls: number;
                /** @enum {boolean} */
                entryPointNameRequired: true;
                /** @enum {boolean} */
                rawCalldataEnabled: false;
                /** @enum {string} */
                mainnet: "disabled";
            };
            limits: {
                /** @enum {integer} */
                maxCalls: 1;
                /** @enum {integer} */
                maxCalldataFelts: 256;
                /** @enum {integer} */
                maxArguments: 64;
                /** @enum {integer} */
                maxStringBytes: 4096;
            };
            simulation: {
                /**
                 * @description `certified` is required before a Starkscan browser wallet flow may enable signing. `not_certified` keeps the flow fail-closed.
                 * @enum {string}
                 */
                status: "not_certified" | "certified";
                /** @description Must be true with `status=certified` before a Starkscan browser wallet flow may enable signing. */
                required: boolean;
            } & ({
                /** @constant */
                status?: "not_certified";
                /** @constant */
                required?: false;
            } | {
                /** @constant */
                status?: "certified";
                /** @constant */
                required?: true;
            });
        };
        MetaChainsView: {
            /** @enum {string} */
            kind: "starkscan.meta.chains";
            schemaVersion: string;
            defaultChain: string;
            chains: ({
                chainId: string;
                statusPath: string;
                statusPathTemplate: string;
            } & {
                [key: string]: unknown;
            })[];
            selectionRule?: string;
        } & {
            [key: string]: unknown;
        };
        MetaAgentContextView: {
            /** @enum {string} */
            kind: "starkscan.meta.agent_context";
            schemaVersion: string;
            agentMemory: components["schemas"]["AgentMemoryContract"];
            workspaceMemory: components["schemas"]["AgentWorkspaceMemoryContract"];
            /** @example application/jsonl */
            preferredArtifactFormat: string;
        } & {
            [key: string]: unknown;
        };
        AgentWorkspaceMemoryContract: {
            /** @enum {string} */
            status: "no_public_write_api";
            /** @enum {boolean} */
            publicWriteApi: false;
            /** @example not available in this deployment */
            serverStoredArtifacts: string;
            /** @example not exposed in this deployment */
            writeSurface: string;
            localWorkspace: components["schemas"]["AgentLocalWorkspaceContract"];
            handoffContract: components["schemas"]["AgentHandoffContract"];
            rules?: string[];
        };
        AgentLocalWorkspaceContract: {
            /** @enum {string} */
            status: "internal_local_only";
            /** @example .codex/handoffs/ */
            defaultDirectory: string;
            /** @example .codex/handoffs/{taskId}.jsonl */
            artifactPattern: string;
            /** @example docs/maintainers/schemas/agent-handoff-artifact.schema.json */
            schemaPath: string;
            /** @example /agent-handoff-artifact.schema.json */
            schemaUrl: string;
            /** @example /agent-workspace.md */
            guideUrl: string;
            /** @example python3 scripts/ci/agent-handoff.py validate .codex/handoffs/{taskId}.jsonl */
            validatorCommand: string;
            /** @example python3 scripts/ci/agent-handoff.py sample --task-id <task-id> --created-by <agent> */
            sampleCommand: string;
        };
        AgentHandoffContract: {
            /** @example typed JSON/JSONL artifacts, not chat history */
            sourceOfTruth: string;
            artifactKinds: string[];
            requiredFields: string[];
            evidenceRule: string;
            formats: string[];
        };
        AgentIssueReportContract: {
            /**
             * @example [
             *       "route",
             *       "queryParams",
             *       "requestBody",
             *       "responseStatus",
             *       "responseSnippet",
             *       "xRequestId"
             *     ]
             */
            requiredFields: string[];
            rule: string;
        };
        HealthResponse: {
            ok: boolean;
            databaseOk: boolean;
        };
        ReadyzResponse: {
            ready: boolean;
            databaseOk: boolean;
        };
        LivezResponse: {
            alive: boolean;
        };
        ExplorerStatusView: {
            chainId: string;
            /** Format: int64 */
            headBlockNumber: number | null;
            headBlockHash: string | null;
            /** Format: int64 */
            finalizedBlockNumber: number | null;
            /**
             * Format: int64
             * @description Latest Starknet block number covered by explicit L1 accepted proof, separate from finalized indexed storage.
             */
            latestL1AcceptedBlockNumber: number | null;
            l1AcceptedProof: components["schemas"]["L1AcceptedProofView"] | null;
            l1Finality: components["schemas"]["L1FinalityView"];
            /** Format: int64 */
            latestIndexedBlockNumber: number | null;
            /** Format: int64 */
            earliestIndexedBlockNumber: number | null;
            /** Format: int64 */
            indexedBlockSpan: number | null;
            /** Format: int64 */
            lagBlocks: number | null;
            /** Format: int64 */
            l1SettlementLatencySeconds: number | null;
            /**
             * @description Indexed-history availability policy. SN_SEPOLIA uses a fixed inclusive starting boundary that does not advance with time.
             * @enum {string|null}
             */
            historyPolicy?: "fixed_start" | null;
            /**
             * @description Honest completeness claim for the indexed-history window. boundary_unavailable means the fixed boundary could not be derived and clients must not infer it from another field.
             * @enum {string|null}
             */
            historyCompleteness?: "complete_from_earliest_available" | "boundary_unavailable" | null;
            /**
             * Format: int32
             * @description Rolling indexed-history duration configured for this chain. Present only when retention is active.
             */
            retentionDays?: number | null;
            /**
             * Format: int64
             * @description Inclusive lower block boundary currently available from the indexed API. For fixed_start this is the permanent indexed-history floor, not a rolling cutoff.
             */
            earliestAvailableBlock?: number | null;
            /**
             * Format: date-time
             * @description UTC timestamp represented by the inclusive indexed-history boundary.
             */
            earliestAvailableAt?: string | null;
            /** @description Durable status of the most recent indexed-history retention attempt. */
            retentionStatus?: string | null;
            /** Format: date-time */
            retentionLastSuccessAt?: string | null;
            /** @description Whether additional rows older than the current boundary remain for a later bounded pass. */
            retentionBacklogRemaining?: boolean | null;
        };
        IndexingFreshnessHealthView: {
            chainId: string;
            /** @enum {string} */
            classification: "operational" | "degraded" | "evidence_unavailable" | "evidence_inconsistent";
            evidenceAvailable: boolean;
            /** Format: int64 */
            headBlockNumber: number | null;
            /** Format: int64 */
            latestIndexedBlockNumber: number | null;
            /** Format: int64 */
            lagBlocks: number | null;
            /**
             * Format: int64
             * @constant
             */
            thresholdLagBlocks: 20;
            /** @enum {string|null} */
            headSource: "configured_starknet_rpc" | null;
            /** @description Explicitly limits this signal to Starkscan indexing freshness. */
            trustBoundary: string;
        };
        L1FinalityQuorumHealthView: {
            chainId: string;
            /** @enum {string} */
            classification: "operational" | "degraded" | "failed" | "diverged" | "stale" | "evidence_unavailable" | "evidence_inconsistent";
            evidenceAvailable: boolean;
            /** @enum {string} */
            status: "healthy" | "degraded" | "failed" | "diverged" | "stale" | "not_reported";
            /** Format: int64 */
            endpointsConfigured: number | null;
            /** Format: int64 */
            endpointsHealthy: number | null;
            /** Format: date-time */
            observedAt: string | null;
            /** Format: int64 */
            evidenceAgeSeconds: number | null;
            /**
             * Format: int64
             * @constant
             */
            thresholdAgeSeconds: 300;
            /** @description Limits the signal to Starkscan's sanitized materialized L1 quorum evidence. */
            trustBoundary: string;
        };
        L1FinalityFreshnessHealthView: {
            chainId: string;
            /** @enum {string} */
            classification: "operational" | "stale" | "evidence_unavailable" | "evidence_inconsistent";
            evidenceAvailable: boolean;
            /** Format: int64 */
            watermarkBlockNumber: number | null;
            /**
             * Format: int64
             * @description Signed age computed by PostgreSQL from its own clock; a negative value is inconsistent evidence and the route returns HTTP 503.
             */
            watermarkAgeSeconds: number | null;
            /**
             * Format: int64
             * @constant
             */
            thresholdAgeSeconds: 300;
            /** @description Limits the signal to Starkscan's materialized L1 finality watermark. */
            trustBoundary: string;
        };
        L1FinalityView: {
            /**
             * Format: int64
             * @description Starknet block number covered by the current proof-backed L1 accepted watermark.
             */
            watermarkBlockNumber: number | null;
            /**
             * Format: int64
             * @description Signed seconds since the served L1 accepted watermark proof was indexed, computed in PostgreSQL's clock domain. A negative value denotes inconsistent future-dated evidence.
             */
            watermarkAgeSeconds: number | null;
            quorum: components["schemas"]["L1FinalityQuorumView"];
            /**
             * Format: date-time
             * @description Most recent persisted L1 RPC quorum divergence timestamp across required evidence components; null when no divergence has been observed.
             */
            lastDivergenceAt: string | null;
        };
        L1FinalityQuorumView: {
            /**
             * Format: int64
             * @description Opaque minimum configured-endpoint count across every required L1 evidence component; null until every component has reported. Configuration separately requires at least two distinct RPC origins.
             */
            endpointsConfigured: number | null;
            /**
             * Format: int64
             * @description Opaque minimum agreeing-endpoint count across every required L1 evidence component; null for missing, stale, failed, or diverged evidence.
             */
            endpointsHealthy: number | null;
            /**
             * @description Strict aggregate of state-update, message-origin, and message-consumption observations for SN_SEPOLIA. Other chains additionally require the StarkGate-registry observation. Healthy requires every component required for the requested chain to have a fresh agreeing observation from every configured endpoint, with configuration independently requiring at least two distinct RPC origins.
             * @enum {string}
             */
            status: "healthy" | "degraded" | "failed" | "diverged" | "stale" | "not_reported";
            /**
             * Format: date-time
             * @description Oldest observation timestamp across every component required for the requested chain; null until every required component has reported.
             */
            observedAt: string | null;
        };
        L1AcceptedProofView: {
            /** @enum {string} */
            source: "ethereum_starknet_core_log_state_update";
            /** Format: int64 */
            starknetBlockNumber: number;
            starknetBlockHash: string;
            starknetGlobalRoot: string;
            /** Format: int64 */
            l1BlockNumber: number;
            l1BlockHash: string | null;
            l1TxHash: string;
            /** Format: date-time */
            updatedAt: string;
        };
        OAuthProtectedResourceMetadata: {
            authorization_servers: string[];
            resource: string;
            bearer_methods_supported: string[];
            scopes_supported: string[];
        };
        ChainBlockListItem: {
            /** Format: int64 */
            blockNumber: number;
            blockHash: string;
            parentHash: string;
            timestampIso: string;
            /** Format: int64 */
            txCount: number;
            finalityStatus: string;
        };
        ChainBlockListPage: {
            items: components["schemas"]["ChainBlockListItem"][];
            nextCursor: string | null;
        };
        BlockAtTimestampQueryView: {
            /** Format: date-time */
            timestampIso: string;
            /** Format: int64 */
            timestampUnix: number;
            /** @enum {string} */
            closest: "before" | "after";
        };
        BlockAtTimestampBlockView: {
            /** Format: int64 */
            blockNumber: number;
            blockHash: string;
            /** Format: date-time */
            timestampIso: string;
            /** Format: int64 */
            timestampUnix: number;
            finalityStatus: string;
        };
        BlockAtTimestampView: {
            chainId: string;
            query: components["schemas"]["BlockAtTimestampQueryView"];
            block: components["schemas"]["BlockAtTimestampBlockView"];
            /** @description Always present; inclusive indexed lower bound at or before the requested timestamp, or null when unavailable. */
            previousBlock: components["schemas"]["BlockAtTimestampBlockView"] | null;
            /** @description Always present; inclusive indexed upper bound at or after the requested timestamp, or null when unavailable. */
            nextBlock: components["schemas"]["BlockAtTimestampBlockView"] | null;
            /** @enum {string} */
            source: "indexed_blocks";
        };
        ChainTransactionListItem: {
            /** Format: int64 */
            blockNumber: number;
            timestampIso: string;
            txHash: string;
            /** Format: int32 */
            txIndex: number;
            txType: string;
            fromAddress: string | null;
            toAddress: string | null;
            executionStatus: string | null;
            finalityStatus: string;
        };
        ChainTransactionListPage: {
            items: components["schemas"]["ChainTransactionListItem"][];
            nextCursor: string | null;
        };
        BlockTransactionView: {
            txHash: string;
            /** Format: int32 */
            txIndex: number;
            txCursor: string;
            fromAddress: string | null;
            toAddress: string | null;
            executionStatus: string | null;
            finalityStatus: string | null;
        };
        BlockGasPriceView: {
            priceInWei: string | null;
            priceInFri: string | null;
        };
        BlockView: {
            chainId: string;
            /** Format: int64 */
            blockNumber: number;
            blockHash: string;
            parentHash: string;
            timestampIso: string;
            /** Format: int64 */
            txCount: number;
            rawObjectKey: string;
            /** @description Canonical Starknet block state root when indexed from the raw block payload. */
            stateRoot: string | null;
            /** @description Sequencer address reported by the Starknet block header when available. */
            sequencerAddress: string | null;
            /** @description L1 data availability mode reported by the Starknet block header when available. */
            l1DataAvailabilityMode: string | null;
            /** @description Starknet protocol version reported by the block header when available. */
            starknetVersion: string | null;
            l1GasPrice: components["schemas"]["BlockGasPriceView"] | null;
            l2GasPrice: components["schemas"]["BlockGasPriceView"] | null;
            l1DataGasPrice: components["schemas"]["BlockGasPriceView"] | null;
            transactions: components["schemas"]["BlockTransactionView"][];
        };
        BlockTransactionPage: {
            items: components["schemas"]["BlockTransactionView"][];
            nextCursor: string | null;
        };
        ExplorerLiveFeedSnapshot: {
            /** Format: int32 */
            schemaVersion: number;
            emittedAtIso: string;
            status: components["schemas"]["ExplorerStatusView"];
            blocks: components["schemas"]["BlockView"][];
        };
        TransactionReceiptView: {
            executionStatus: string | null;
            finalityStatus: string | null;
            gasUsed: string | null;
            effectiveGasPrice: string | null;
            /** @description Receipt-reported total fee amount as a Starknet felt hex string. */
            actualFeeAmount: string | null;
            /**
             * @description Receipt-reported fee unit.
             * @enum {string|null}
             */
            actualFeeUnit: "WEI" | "FRI" | null;
            revertReason: string | null;
        };
        TransactionLogView: {
            /** Format: int32 */
            logIndex: number;
            address: string;
            /** @description Canonical on-chain event key array in indexed payload order. Legacy rows lacking `payload.keys` reconstruct only `topic0` through `topic3`, so their key array can be incomplete; raw keys/data are authoritative. */
            keys: string[];
            topic0: string | null;
            topic1: string | null;
            topic2: string | null;
            topic3: string | null;
            data: string[];
            /**
             * @description Server-certified event decode state. `name_only` and `unknown` preserve the authoritative raw payload as available; legacy rows may expose a reconstructed, incomplete `keys[]` per the keys field description.
             * @enum {string}
             */
            decodingStatus: "decoded" | "name_only" | "unknown";
            /** @description Reviewed or ABI-derived event name when Starkscan can attribute the selector. */
            eventName?: string | null;
            /** @description Provenance for eventName. */
            eventNameSource?: string | null;
            /** @enum {string|null} */
            eventNameUnavailableReason?: "event_time_class_epoch_unavailable" | null;
            /** @description Exact materialized ABI fields when available. Raw keys/data remain authoritative. */
            decodedFields?: components["schemas"]["EventDecodedField"][];
            decodedFieldsSource?: string | null;
            /** @enum {string|null} */
            decodedFieldsUnavailableReason?: "schema_unavailable" | "selector_only_attribution" | "payload_shape_mismatch" | "schema_shape_unsupported" | null;
        };
        TransactionTransferView: {
            /** Format: int32 */
            logIndex: number;
            /** Format: int32 */
            transferIndex: number;
            tokenAddress: string;
            fromAddress: string | null;
            toAddress: string | null;
            amount: string | null;
            tokenId: string | null;
            standard: string;
            /** @description Transaction-time USD coverage when this route includes price materialization. Transaction-detail and token-transfer responses report a priced, typed-unpriced, or pending result. `outside_history_window` is terminal provider-policy coverage; `price_missing` is a repairable in-horizon gap. Lightweight preview/list responses that intentionally omit this enrichment may return null. Never treat a null or unpriced result as a live/current market price. */
            historicalUsd: components["schemas"]["TokenTransferHistoricalUsd"] | null;
        };
        /** @description Historical-USD coverage for one transfer. This is exactly one of: a priced transaction-time valuation; a typed unpriced result; or a pending materialization result. Clients must branch on `coverageStatus` and `coverageReasonCode`; null price fields are never a request to substitute a current/spot price. */
        TokenTransferHistoricalUsd: {
            amountDecimal: string | null;
            /** @description Token unit price in USD for `priceHourIso`, not current spot price. */
            priceUsd: string | null;
            /** @description Transfer USD value at `priceHourIso`, not current spot value. */
            valueUsd: string | null;
            /** Format: date-time */
            priceHourIso: string | null;
            /**
             * Format: date-time
             * @description Timestamp of the provider observation used for this historical price.
             */
            priceSourceTimestampIso: string | null;
            priceSource: string | null;
            provider: string | null;
            providerAssetId: string | null;
            quoteCurrency: string;
            /** @enum {string} */
            coverageStatus: "priced" | "unpriced" | "pending";
            /** @enum {string} */
            coverageReasonCode: "priced" | "causal_hourly_price" | "token_unmapped" | "metadata_missing" | "non_fungible" | "amount_missing" | "price_missing" | "provider_granularity_daily" | "outside_history_window" | "materialization_pending";
            /** Format: date-time */
            indexedAt: string | null;
        } & ({
            /** @constant */
            coverageStatus?: "priced";
            /** @enum {unknown} */
            coverageReasonCode?: "priced" | "causal_hourly_price";
        } | {
            /** @constant */
            coverageStatus?: "unpriced";
            /** @enum {unknown} */
            coverageReasonCode?: "token_unmapped" | "metadata_missing" | "non_fungible" | "amount_missing" | "price_missing" | "provider_granularity_daily" | "outside_history_window";
        } | {
            /** @constant */
            coverageStatus?: "pending";
            /** @constant */
            coverageReasonCode?: "materialization_pending";
        });
        /** @description One offline-prepared snapshot over the provider's bounded trailing history window. This is coverage telemetry, not a price feed. A transaction-time USD value is authoritative only when its individual transfer fact has `coverageStatus=priced`. Eligible and covered block/timestamp bounds are each either fully null or fully present; covered bounds always stay inside the eligible window. */
        TokenTransferUsdCoverageSnapshot: {
            chainId: string;
            provider: string;
            quoteCurrency: string;
            /** Format: int32 */
            maxHistoryDays: number;
            /** @constant */
            sourcePolicy: "hourly_causal_no_forward_fill";
            /** Format: int64 */
            eligibleFromBlock: number | null;
            /** Format: int64 */
            eligibleToBlock: number | null;
            /** Format: date-time */
            eligibleFromTimestamp: string | null;
            /** Format: date-time */
            eligibleToTimestamp: string | null;
            /** Format: int64 */
            coveredFromBlock: number | null;
            /** Format: int64 */
            coveredThroughBlock: number | null;
            /** Format: date-time */
            coveredFromTimestamp: string | null;
            /** Format: date-time */
            coveredThroughTimestamp: string | null;
            /** Format: int64 */
            pricedTransfers: number;
            /** Format: int64 */
            typedUnavailableTransfers: number;
            /** Format: int64 */
            pendingMaterializationTransfers: number;
            /** @description Materialized unpriced outcomes by reason. `provider_granularity_daily` is deliberately unpriced and must not be included in `pricedTransfers`. */
            typedUnavailableByReason: {
                /** Format: int64 */
                token_unmapped?: number;
                /** Format: int64 */
                metadata_missing?: number;
                /** Format: int64 */
                non_fungible?: number;
                /** Format: int64 */
                amount_missing?: number;
                /** Format: int64 */
                price_missing?: number;
                /** Format: int64 */
                provider_granularity_daily?: number;
            };
            /** Format: date-time */
            latestSuccessfulRunAt: string | null;
            /** Format: date-time */
            measuredAt: string;
            /** @enum {string|null} */
            nextMaterializerDirection: "forward" | "backfill" | null;
            /**
             * Format: int64
             * @description Reviewed direct-price assets enrolled for compact hourly history.
             */
            compactQuoteAssetsExpected: number;
            /**
             * Format: int64
             * @description Enrolled assets whose bounded 365-day hourly recovery cursor is complete.
             */
            compactQuoteAssetsComplete: number;
            /**
             * Format: int64
             * @description Enrolled assets still advancing through bounded hourly recovery.
             */
            compactQuoteAssetsIncomplete: number;
            /**
             * Format: date-time
             * @description Common factual hourly-quote floor when every enrolled asset has quote rows.
             */
            compactQuoteCoveredFromTimestamp: string | null;
            /**
             * Format: date-time
             * @description Common factual hourly-quote ceiling when every enrolled asset has quote rows.
             */
            compactQuoteCoveredThroughTimestamp: string | null;
            /** @constant */
            exact: true;
            /** @constant */
            scope: "eligible_finalized_transfers_in_bounded_provider_history_window";
            /** @enum {string} */
            status: "current" | "catching_up" | "stale" | "degraded";
        };
        /** @enum {string} */
        BridgeIntentKind: "deposit" | "withdraw" | "bridge_unknown";
        /**
         * @description Confidence for emitted bridge intents. Low-confidence candidates are intentionally omitted from `bridgeIntent`.
         * @enum {string}
         */
        BridgeIntentConfidence: "high" | "medium";
        BridgeIntentView: {
            kind: components["schemas"]["BridgeIntentKind"];
            protocol: string | null;
            confidence: components["schemas"]["BridgeIntentConfidence"];
            reasons: string[];
        };
        TransactionPreviewLogView: {
            /** Format: int32 */
            logIndex: number;
            address: string;
            topic0: string | null;
        };
        TransactionPreviewContractCallView: {
            contractAddress: string;
            /** Format: int32 */
            callIndex: number;
            entryPointSelector: string | null;
            methodName: string | null;
        };
        TransactionPreviewView: {
            timestampIso: string | null;
            chainId: string;
            /** Format: int64 */
            blockNumber: number;
            /** Format: int32 */
            txIndex: number;
            txHash: string;
            txCursor: string;
            fromAddress: string | null;
            toAddress: string | null;
            executionStatus: string | null;
            finalityStatus: string | null;
            txType: string | null;
            /** @description Optional additive projection of unique targets from an exactly decoded, bounded signed INVOKE call array. This records signed intent and does not claim that every call executed. */
            signedCallTargets?: string[];
            /** Format: int64 */
            transferCount: number;
            tokenTransfersTruncated: boolean;
            tokenTransfers: components["schemas"]["TransactionTransferView"][];
            /** @description Trace-backed calls selected by exact reviewed swap entrypoint selectors. Empty unless requested. */
            exchangeCalls: components["schemas"]["TransactionPreviewContractCallView"][];
            exchangeCallsTruncated: boolean;
            hasBurnToZero?: boolean;
            hasMintFromZero?: boolean;
            bridgeSignalContracts?: string[];
            bridgeIntent?: components["schemas"]["BridgeIntentView"] | null;
            /** Format: int64 */
            logCount?: number;
            logsTruncated?: boolean;
            logs?: components["schemas"]["TransactionPreviewLogView"][];
        };
        TransactionPreviewBatchView: {
            items: components["schemas"]["TransactionPreviewView"][];
        };
        TransactionPreviewBatchRequest: {
            hashes: string[];
            /** @description Include bounded preview logs for each transaction. Defaults to `false` when omitted. */
            includeLogs?: boolean | null;
            /** @description Include exact log counts even when logs are not requested. When omitted, defaults to the same value as `includeLogs`. */
            includeLogCounts?: boolean | null;
            /**
             * @description Include bridge transfer signal detection (`hasMintFromZero`, `hasBurnToZero`, `bridgeSignalContracts`, `bridgeIntent`). Defaults to `true` when omitted.
             * @default true
             */
            includeBridgeSignals: boolean | null;
            /**
             * @description Include up to 16 trace-backed calls per transaction whose selector is an exact reviewed swap entrypoint. Defaults to `false` when omitted.
             * @default false
             */
            includeExchangeCalls: boolean | null;
            /**
             * Format: int32
             * @description Maximum number of logs returned per transaction when `includeLogs` is enabled. Defaults to `64` when omitted.
             * @default 64
             */
            logLimitPerTx: number | null;
        };
        TransactionAccountCallView: {
            /** @description Contract address targeted by this account call. */
            to: string;
            /** @description Entry-point selector invoked by this account call. */
            selector: string;
            /**
             * Format: int32
             * @description Number of calldata felts supplied to this account call.
             */
            calldataLen: number;
        };
        TransactionDetailView: {
            chainId: string;
            /** Format: int64 */
            blockNumber: number;
            /** Format: date-time */
            timestampIso?: string | null;
            /** Format: int32 */
            txIndex: number;
            txHash: string;
            txCursor: string;
            fromAddress: string | null;
            toAddress: string | null;
            executionStatus: string | null;
            finalityStatus: string | null;
            txType: string | null;
            rawObjectKey: string;
            receipt: components["schemas"]["TransactionReceiptView"] | null;
            logsTruncated: boolean;
            /** @description True only when the optional server attribution lookup failed operationally. Individual unknown events do not set this flag. */
            eventDecodingDegraded: boolean;
            logs: components["schemas"]["TransactionLogView"][];
            calldata: string[];
            /**
             * Format: int32
             * @description Number of calls decoded from a well-formed INVOKE account call array; null when the payload is not applicable or cannot be decoded safely.
             */
            accountCallCount: number | null;
            /** @description Ordered calls decoded from the transaction's account call array. */
            accountCalls: components["schemas"]["TransactionAccountCallView"][];
            /**
             * Format: int64
             * @description Sender-declared `resource_bounds.l2_gas.max_amount`; null when the transaction does not declare an L2 gas bound.
             */
            declaredL2GasCap: number | null;
            tokenTransfers: components["schemas"]["TransactionTransferView"][];
            messages: components["schemas"]["MessageItem"][];
            messagesCoverage: components["schemas"]["MessageCoverageView"];
            bridgeIntent: components["schemas"]["BridgeIntentView"] | null;
        };
        /** @description Time-bounded fixed-finalized-block evidence that the address had no deployed contract at the observed block. Operational RPC failures never produce this object. */
        AddressContractExistenceView: {
            /** @enum {string} */
            status: "not_deployed";
            /** @enum {string} */
            reasonCode: "contract_not_found";
            /** @enum {string} */
            evidenceSource: "finalized_class_hash_at";
            /** Format: int64 */
            observedBlockNumber: number;
            observedBlockHash: string;
            /** Format: date-time */
            expiresAtIso: string;
        };
        /** @description Canonical creation-block evidence plus fail-closed transaction-trace attribution. DEPLOY_ACCOUNT and legacy DEPLOY intentionally do not fabricate a self-deployer. */
        AddressDeploymentProvenanceView: {
            /**
             * @description Whether transaction-trace attribution is exact, intentionally inapplicable, or not yet certified.
             * @enum {string}
             */
            status: "known" | "not_applicable" | "unavailable";
            /** @enum {string} */
            reasonCode: "trace_certified" | "deploy_account_has_no_external_deployer" | "legacy_deploy_has_no_external_deployer" | "transaction_trace_not_certified";
            /** @enum {string} */
            evidenceSource: "state_update_and_transaction_trace" | "starknet_state_diff_boundary";
            /** Format: int64 */
            deployedAtBlock: number;
            deployedAtBlockHash: string;
            transactionHash: string | null;
            /** @enum {string|null} */
            deploymentKind: "deploy_account" | "invoke_factory" | "legacy_deploy" | null;
            /** @description Transaction sender for a trace-certified factory or UDC deployment. Null when no external deployer exists or attribution is unavailable. */
            originAddress: string | null;
            /** @description Constructor caller for a trace-certified factory or UDC deployment. */
            factoryAddress: string | null;
        } & ({
            /** @constant */
            status?: "known";
            /** @constant */
            reasonCode?: "trace_certified";
            /** @constant */
            evidenceSource?: "state_update_and_transaction_trace";
            transactionHash?: string;
            /** @constant */
            deploymentKind?: "invoke_factory";
            originAddress?: string;
            factoryAddress?: string;
        } | ({
            /** @constant */
            status?: "not_applicable";
            /** @constant */
            evidenceSource?: "state_update_and_transaction_trace";
            transactionHash?: string;
            originAddress?: null;
            factoryAddress?: null;
        } & ({
            /** @constant */
            reasonCode?: "deploy_account_has_no_external_deployer";
            /** @constant */
            deploymentKind?: "deploy_account";
        } | {
            /** @constant */
            reasonCode?: "legacy_deploy_has_no_external_deployer";
            /** @constant */
            deploymentKind?: "legacy_deploy";
        })) | {
            /** @constant */
            status?: "unavailable";
            /** @constant */
            reasonCode?: "transaction_trace_not_certified";
            /** @constant */
            evidenceSource?: "starknet_state_diff_boundary";
            transactionHash?: null;
            deploymentKind?: null;
            originAddress?: null;
            factoryAddress?: null;
        });
        AddressSummaryView: {
            address: string;
            /**
             * Format: int64
             * @description Exhaustive count, a documented positive lower bound, or null when activity is unknown/partial and no safe numeric lower bound exists. Zero is valid only with activityCountExact=true.
             */
            totalActivityCount: number | null;
            /**
             * Format: int64
             * @description Highest proved indexed activity block for this aggregate summary. It is null when totalActivityCount is null; use address/intelligence for independently typed latest-activity evidence with an unmaterialized total.
             */
            latestActivityBlock: number | null;
            activityCountExact?: boolean | null;
            /** @description Starknet contract class hash (0x-prefixed felt hex), null when unavailable. */
            classHash?: string | null;
            /** @description True if the class behaves as an account contract, null when unknown. */
            isAccount?: boolean | null;
            createdOnIso?: string | null;
            deployedAtTxHash?: string | null;
            deployedByAddress?: string | null;
            /** @description Present for a deployed address with a canonical creation boundary; omitted when no deployment evidence exists. A present value with status unavailable means the creation boundary is known but transaction-trace attribution is not certified. */
            deploymentProvenance?: components["schemas"]["AddressDeploymentProvenanceView"];
            /** @description Present only while contract-not-found evidence is fresh and no positive class fact wins. */
            contractExistence?: components["schemas"]["AddressContractExistenceView"] | null;
        };
        ContractMetadataView: {
            chainId: string;
            address: string;
            /** @description Compatibility class hash backed by classHashSource. Uses currentClassHash when a trusted indexed runtime observation exists, otherwise deploymentClassHash; null is possible only when another indexed identity fact, such as token metadata, keeps the response addressable. */
            classHash: string | null;
            /** @description Newest trusted indexed runtime class observation. Read with classHashAsOfBlock and classHashAsOfBlockHash; it is not a claim about blocks after that boundary. Null does not imply that the address is undeployed. */
            currentClassHash: string | null;
            /** @description Original indexed deployment class hash only when authoritative deployment evidence proves it. Null when unavailable; never inferred from current class or first activity. */
            deploymentClassHash: string | null;
            /** @description Provenance source for classHash. */
            classHashSource: string | null;
            /**
             * Format: int64
             * @description Exact evidence block for classHash when the source has a canonical block.
             */
            classHashAsOfBlock: number | null;
            /** @description Canonical block hash paired with classHashAsOfBlock. */
            classHashAsOfBlockHash: string | null;
            /**
             * @description Finality of the classHash evidence; null means the exact-block observation does not assert finalized status.
             * @enum {string|null}
             */
            classHashFinality: "finalized" | null;
            /**
             * Format: int64
             * @description Deployment block from canonical indexed state-update facts when available.
             */
            deployedAtBlock: number | null;
            /** @description Deployment transaction hash when an indexed deployment transaction is known. */
            deployedAtTx: string | null;
            /** Format: date-time */
            createdOnIso: string | null;
            deployedByAddress: string | null;
            /** @description Present for a deployed address with a canonical creation boundary; omitted when no deployment evidence exists. A present value with status unavailable means the creation boundary is known but transaction-trace attribution is not certified. */
            deploymentProvenance?: components["schemas"]["AddressDeploymentProvenanceView"];
            isAccount: boolean | null;
            /**
             * @description True when token metadata exists; null means not identified in the indexed token metadata table.
             * @enum {boolean|null}
             */
            isToken: true | null;
            /** @enum {string|null} */
            tokenKind: "erc20" | "erc721" | "erc1155" | "unknown" | null;
            /** @description Token name or symbol when indexed token metadata is available. */
            alias: string | null;
            /** @description True when both class hash and canonical deployment block are available. */
            metadataCompleteness: boolean;
            /** @enum {string} */
            source: "indexed_read_model";
        } & ({
            isToken: null;
            tokenKind: null;
            alias: null;
        } | {
            /** @enum {boolean} */
            isToken: true;
            /** @enum {string} */
            tokenKind: "erc20" | "erc721" | "erc1155" | "unknown";
        });
        AddressSummaryBatchRequest: {
            addresses: string[];
        };
        /** @description Ordered indexed address summaries. Bulk responses favor predictable latency over cold repair; nullable fields and `activityCountExact=false` mean Starkscan does not have complete indexed evidence for that field in this batch response. */
        AddressSummaryBatchView: {
            items: components["schemas"]["AddressSummaryView"][];
        };
        AddressIntelligenceItemBaseView: {
            address: string;
            /** @description Human-readable protocol, project, or token label when indexed attribution is known. */
            label: string | null;
            /**
             * @description Machine-readable provenance for `label`; null when no label is resolved.
             * @enum {string|null}
             */
            labelSource: "indexed_protocol_registry" | "indexed_token_metadata" | "curated_known_token_metadata" | null;
            /** @description Human-readable account/contract type label derived from indexed account-kind evidence. This is separate from `label` and must not be treated as a curated counterparty name. */
            typeLabel: string | null;
            /**
             * @description Machine-readable provenance for `typeLabel`; null when no type label is resolved.
             * @enum {string|null}
             */
            typeLabelSource: "indexed_account_kind" | null;
            protocol: components["schemas"]["AddressAttributionProtocolView"] | null;
            /** @description True only when authoritative indexed deployment/class evidence exists for the address. */
            isDeployed: boolean;
            /** @description Compatibility class hash. Uses currentClassHash when a trusted indexed current observation exists, otherwise deploymentClassHash. */
            classHash: string | null;
            /** @description Newest trusted indexed runtime class observation. Read with classHashAsOfBlock and classHashAsOfBlockHash; it is not a claim about blocks after that boundary. */
            currentClassHash: string | null;
            /** @description Original indexed deployment class only when authoritative deployment evidence proves it. Null when unavailable; never inferred from current class or first activity. */
            deploymentClassHash: string | null;
            /** @description Evidence source for classHash. */
            classHashSource: string | null;
            /**
             * Format: int64
             * @description Exact evidence block for classHash when available.
             */
            classHashAsOfBlock: number | null;
            /** @description Canonical block hash paired with classHashAsOfBlock. */
            classHashAsOfBlockHash: string | null;
            /**
             * @description Finality of classHash evidence; null means the exact-block observation has not asserted finalized status.
             * @enum {string|null}
             */
            classHashFinality: "finalized" | null;
            /** @description Human-readable class-family label when `classHash` matches a reviewed official class registry. This is separate from `label` and must not be treated as a curated address name tag. */
            classLabel: string | null;
            /**
             * @description Machine-readable provenance for `classLabel`; null when no class-family label is resolved.
             * @enum {string|null}
             */
            classLabelSource: "official_class_registry" | null;
            isAccount: boolean | null;
            /**
             * Format: date-time
             * @description Indexed canonical deployment timestamp when authoritative deployment evidence exists.
             */
            createdOnIso: string | null;
            /** @description Indexed deployment transaction hash when authoritative deployment evidence exists. */
            deployedAtTxHash: string | null;
            /** @description Indexed deployer/factory address when authoritative deployment attribution exists. */
            deployedByAddress: string | null;
            /** @description Present for a deployed address with a canonical creation boundary; omitted when no deployment evidence exists. A present value with status unavailable means the creation boundary is known but transaction-trace attribution is not certified. */
            deploymentProvenance?: components["schemas"]["AddressDeploymentProvenanceView"];
            /** @description True when indexed token-transfer rows show the address as recipient. */
            hasReceivedFunds: boolean;
            /** Format: int64 */
            latestActivityBlock: number | null;
            /**
             * Format: int64
             * @description Exhaustive count, a positive lower bound when one is actually materialized, or null. Proved activity may have a latestActivityBlock with a null total. Zero is valid only when activityCountExact=true and activityCoverage.status=exhaustive.
             */
            totalActivityCount: number | null;
            /** @description True only when the returned activity count is exhaustive for the certified source range. False or null means the count is non-exact: it may be a positive lower bound or null. A null count can accompany a proved latest block when no numeric total is materialized. Only true makes zero trustworthy. */
            activityCountExact: boolean | null;
            activityCoverage: components["schemas"]["AddressActivityCoverageView"];
            /** @enum {string} */
            source: "indexed_partner_address_evidence";
        };
        AddressActivityCoverageView: {
            /** @enum {string} */
            status: "exhaustive" | "lower_bound" | "partial" | "stale" | "unavailable";
            /** @enum {string} */
            reasonCode: "sealed_success_only_range" | "success_only_total_not_materialized" | "no_indexed_activity_evidence" | "activity_beyond_indexed_watermark" | "activity_evidence_unavailable" | "projection_watermark_unavailable" | "watermark_unavailable" | "indexed_watermark_lag";
            /** @enum {string} */
            evidenceSource: "indexed_successful_transaction_and_activity_summary";
            /** Format: int64 */
            fromBlock: number | null;
            /** Format: int64 */
            throughBlock: number | null;
            /** Format: int64 */
            sourceWatermarkBlock: number | null;
            sourceWatermarkHash: string | null;
        };
        AddressIntelligenceItemView: (components["schemas"]["AddressIntelligenceItemBaseView"] & {
            /** @constant */
            isDeployed: true;
            classHash: string;
        }) | (components["schemas"]["AddressIntelligenceItemBaseView"] & {
            /** @constant */
            isDeployed: false;
            classHash: null;
            createdOnIso: null;
            deployedAtTxHash: null;
            deployedByAddress: null;
        });
        AddressAttributionProtocolView: {
            /** @description Human-readable protocol, project, or token label. */
            name: string;
            /** @description Indexed protocol or token kind when known. */
            kind: string | null;
        };
        AddressAttributionBaseView: {
            chainId: string;
            /** @description Address supplied by the client after path validation. */
            requestedAddress: string;
            /** @description Canonical indexed Starknet address used for lookup. */
            canonicalAddress: string;
            /** @description True when Starkscan has a readable label/protocol attribution. */
            known: boolean;
            /** @description Human-readable label when known. */
            label: string | null;
            /**
             * @description Confidence bucket for the resolved label.
             * @enum {string}
             */
            confidence: "high" | "none";
            /** @enum {string} */
            source: "indexed_address_attribution" | "indexed_protocol_registry" | "indexed_token_metadata" | "curated_known_token_metadata";
            protocol: components["schemas"]["AddressAttributionProtocolView"] | null;
        };
        AddressAttributionView: (components["schemas"]["AddressAttributionBaseView"] & {
            /** @constant */
            known: true;
            label: string;
            /** @constant */
            confidence: "high";
            protocol: components["schemas"]["AddressAttributionProtocolView"];
        }) | (components["schemas"]["AddressAttributionBaseView"] & {
            /** @constant */
            known: false;
            label: null;
            /** @constant */
            confidence: "none";
            /** @constant */
            source: "indexed_address_attribution";
            protocol: null;
        });
        AddressIntelligenceBatchView: {
            /**
             * @description Version of the public activity truth and correlation contract.
             * @constant
             */
            contractVersion: "starkscan.address_activity_truth.v1";
            /**
             * @description Version of the bounded indexed evidence sources used by this response.
             * @constant
             */
            sourceContractVersion: "indexed_successful_transaction_and_activity_summary.v1";
            items: components["schemas"]["AddressIntelligenceItemView"][];
        };
        /** @description Indexed class fact derived from its earliest canonical DECLARE or legacy DEPLOY origin with optional deployment, ABI/class, and verification enrichment. A legacy deployment origin is not a declaration. `classLabel` is a reviewed class family label, not exact source verification. */
        ClassDirectoryItemView: {
            chainId: string;
            classHash: string;
            /** @description Human-readable class-family label when the class hash matches the reviewed official class registry. */
            classLabel: string | null;
            /**
             * @description Machine-readable provenance for `classLabel`; null when no class-family label is resolved.
             * @enum {string|null}
             */
            classLabelSource: "official_class_registry" | null;
            /**
             * @description Class verification tier. Values are ordered by evidence strength for this materialized directory: `verified_exact` means Starkscan has an active successful immutable verification receipt whose produced canonical class hash matches this class under an accepted verifier policy; `verified_external` is reserved for trusted third-party verification; `official_release` is reserved for official project release metadata; `source_candidate` is reserved for unverified source-candidate evidence; `abi_declared` means indexed ABI/class metadata is available but source is not verified; `class_family` means the class hash belongs to a reviewed official class-family registry and is not exact source verification; `unverified` means no verification, ABI, or class-family evidence was materialized.
             * @enum {string}
             */
            verificationTier: "verified_exact" | "verified_external" | "official_release" | "source_candidate" | "abi_declared" | "class_family" | "unverified";
            /** @description Machine-readable source family for the verification claim. `receipt` identifies an active Starkscan exact receipt; `federated_external` identifies retained provider evidence. */
            verificationSource: string | null;
            /** @description Verification provider. `starkscan` identifies independently rebuilt exact receipt evidence; external values identify the observing provider and do not imply a Starkscan rebuild. */
            verificationProvider: string | null;
            /** @description Content digest for the active exact receipt candidate or immutable build evidence, or for the retained external claim, when available. */
            verificationEvidenceDigest: string | null;
            /**
             * Format: date-time
             * @description Exact receipt completion time or external claim observation time, depending on `verificationSource`.
             */
            verificationObservedAtIso: string | null;
            /**
             * Format: int64
             * @description Number of active exact receipts or retained external claims supporting this materialized tier.
             */
            verificationClaimCount: number | null;
            /**
             * @description How the class first entered the indexed chain. Legacy deployment is explicitly not declaration proof.
             * @enum {string|null}
             */
            originKind: "declare" | "legacy_deploy" | null;
            /** @description Transaction containing the canonical indexed class origin. */
            originTransactionHash: string | null;
            /** Format: int64 */
            originatedAtBlock: number | null;
            /** Format: date-time */
            originatedAtIso: string | null;
            /** @enum {string|null} */
            originSource: "indexed_finalized_declare_tx" | "indexed_head_declare_tx" | "indexed_finalized_legacy_deploy_tx" | "indexed_head_legacy_deploy_tx" | null;
            /** @enum {string|null} */
            originFinalityStatus: "finalized" | "head" | null;
            /** Format: date-time */
            originRefreshedAtIso: string | null;
            /** @description Declaration transaction hash when indexed; null for legacy deployment-only or observation-only rows. */
            declarationTxHash: string | null;
            /** Format: int64 */
            declaredAtBlock: number | null;
            /** Format: date-time */
            declaredAtIso: string | null;
            /** @description Compiled class hash when supplied by indexed declaration metadata. */
            compiledClassHash: string | null;
            /** @description Indexed class kind when supplied by declaration metadata. */
            classKind: string | null;
            /** @description Cairo or class-version metadata when materialized. */
            classVersion: string | null;
            abiAvailable: boolean;
            abiSource: string | null;
            /** Format: int64 */
            instanceCount: number;
            /**
             * Format: int64
             * @description Computed count of indexed addresses with a current ABI/class observation for this class. This is not a current-class-hash guarantee.
             */
            currentInstanceCount: number;
            /**
             * Format: int64
             * @description Count of indexed instances with explicit account evidence.
             */
            accountInstanceCount: number;
            /**
             * Format: int64
             * @description Count of indexed instances with explicit non-account evidence.
             */
            contractInstanceCount: number;
            /**
             * Format: int64
             * @description Count of indexed instances without authoritative account-or-contract kind evidence. instanceCount equals accountInstanceCount plus contractInstanceCount plus unknownInstanceCount.
             */
            unknownInstanceCount: number;
            /** Format: int64 */
            verifiedInstanceCount: number;
            instanceCoverage: components["schemas"]["ClassInstanceCoverageView"];
            /**
             * Format: int64
             * @description Earliest block from one paired indexed class-association evidence row; never derived from an unrelated address creation timestamp.
             */
            firstSeenBlockNumber: number | null;
            /**
             * Format: int64
             * @description Highest indexed relationship-evidence block included in the materialized usage counts.
             */
            usageAsOfBlock: number | null;
            /**
             * Format: date-time
             * @description Timestamp from the same evidence row as firstSeenBlockNumber.
             */
            firstSeenAtIso: string | null;
            sampleContractAddress: string | null;
            /**
             * @description Evidence backing this row. Origin sources do not imply source-code verification.
             * @enum {string}
             */
            source: "indexed_class_observation" | "indexed_finalized_declare_tx" | "indexed_head_declare_tx" | "indexed_finalized_legacy_deploy_tx" | "indexed_head_legacy_deploy_tx";
            /**
             * Format: date-time
             * @description Last refresh of usage counts and instance enrichment, separate from origin provenance freshness.
             */
            usageRefreshedAtIso: string | null;
            /** Format: date-time */
            refreshedAtIso: string;
        };
        /** @description Scope and classification evidence for class instance counts. Class counts are indexed observations, not a chain-wide census; consumers must not infer omitted instances from a numeric count. */
        ClassInstanceCoverageView: {
            /**
             * @description `partial` means the usage projection produced a bounded indexed-observation window; `unavailable` means no trustworthy usage watermark exists.
             * @enum {string}
             */
            coverageStatus: "partial" | "unavailable";
            /** @enum {string} */
            reasonCode: "indexed_observation_window" | "usage_projection_unavailable";
            /**
             * Format: int64
             * @description Inclusive earliest materialized class-association evidence block, not necessarily the class's first chain occurrence.
             */
            observedFromBlock: number | null;
            /**
             * Format: int64
             * @description Inclusive usage-projection watermark for the materialized observation window.
             */
            observedThroughBlock: number | null;
            /**
             * @description `known_for_observed_instances` applies only to materialized rows; it is not a claim of chain-wide account-or-contract classification.
             * @enum {string}
             */
            classificationCoverage: "partial" | "known_for_observed_instances" | "unavailable";
            /** @description True only when an observation window exists and the numeric counts can safely be treated as lower bounds. */
            isLowerBound: boolean;
            /**
             * @description Always false for the indexed-observation directory; it is not a global class-instance census.
             * @enum {boolean}
             */
            isExhaustive: false;
        } & ({
            /** @constant */
            coverageStatus?: "partial";
            /** @constant */
            reasonCode?: "indexed_observation_window";
            observedFromBlock?: number;
            observedThroughBlock?: number;
            /** @enum {unknown} */
            classificationCoverage?: "partial" | "known_for_observed_instances";
            /** @constant */
            isLowerBound?: true;
        } | {
            /** @constant */
            coverageStatus?: "unavailable";
            /** @constant */
            reasonCode?: "usage_projection_unavailable";
            observedFromBlock?: null;
            observedThroughBlock?: null;
            /** @constant */
            classificationCoverage?: "unavailable";
            /** @constant */
            isLowerBound?: false;
        });
        ClassDirectoryPageView: {
            items: components["schemas"]["ClassDirectoryItemView"][];
            nextCursor: string | null;
            /** @enum {string} */
            source: "indexed_class_observation" | "indexed_class_origin";
            /**
             * Format: int64
             * @description Total materialized canonical class origins for this chain, independent of the loaded page or filters.
             */
            catalogTotal: number | null;
            /**
             * Format: int64
             * @description Number of classes with materialized usage relationships. The instances_desc page is bounded to this cohort; it is separate from catalogTotal.
             */
            usageCohortTotal: number | null;
            /**
             * Format: int64
             * @description Highest contiguous indexed block reconciled into the canonical class-origin catalog, beginning at block 0. Null means contiguous historical certification has not yet been established.
             */
            catalogAsOfBlock: number | null;
            /** @description Deterministic digest of the sorted canonical class-hash set for reconciliation evidence. */
            originSetDigest: string | null;
            /**
             * Format: date-time
             * @description Last successful canonical class-origin materialization time.
             */
            originRefreshedAtIso: string | null;
            /**
             * Format: int64
             * @description Indexed transaction head recorded when the off-request-path usage projection completed. This is a freshness reference, not proof that every relationship changed at that block; use latestRelationshipEvidenceBlock for the newest carried relationship evidence.
             */
            usageAsOfBlock: number | null;
            /**
             * Format: int64
             * @description Highest block carried by a materialized class-relationship evidence row; may trail usageAsOfBlock when no relationship changed recently.
             */
            latestRelationshipEvidenceBlock: number | null;
            /**
             * Format: date-time
             * @description Last successful class-usage projection refresh time.
             */
            usageRefreshedAtIso: string | null;
        };
        ClassInstanceView: {
            address: string;
            isAccount: boolean | null;
            /**
             * @description Evidence-specific relationship between this address and class.
             * @enum {string}
             */
            relationshipKind: "deployed_as_class" | "current_class" | "abi_observed_class" | "historical_class_epoch" | "observed_class";
            /** Format: int64 */
            evidenceBlockNumber: number | null;
            evidenceTransactionHash: string | null;
            /** Format: date-time */
            evidenceAtIso: string | null;
            evidenceSource: string;
            /** Format: int64 */
            deployedAtBlock: number | null;
            deployedAtTxHash: string | null;
            deployedByAddress: string | null;
            /** Format: date-time */
            createdOnIso: string | null;
            /**
             * Format: int64
             * @description Observation block for non-deployment class evidence; never presented as deployment proof.
             */
            observedAtBlock: number | null;
            /** Format: date-time */
            observedAtIso: string | null;
            observationSource: string | null;
            source: string;
        };
        ClassDetailView: {
            class: components["schemas"]["ClassDirectoryItemView"];
            instances: components["schemas"]["ClassInstanceView"][];
            nextInstanceCursor: string | null;
        };
        WalletAssetDiscoveryMetadata: {
            symbol: string | null;
            name: string | null;
            decimals: number | null;
            /** @enum {string} */
            source: "reviewed_registry" | "indexed_metadata" | "unavailable";
            trusted: boolean;
            /**
             * @description Spam classification is not currently performed. `not_assessed` must not be interpreted as safe, trusted, or non-spam.
             * @constant
             */
            spamStatus: "not_assessed";
        };
        WalletAssetDiscoveryEvidence: {
            /** @enum {string} */
            tier: "reviewed_registry" | "indexed_discovery";
            /** @enum {string} */
            source: "checked_in_registry" | "fungible_transfer_evidence";
            /** Format: int64 */
            lastObservedBlock: number | null;
            /**
             * Format: int64
             * @description Monotonic lower bound on indexed transfer evidence for this owner-token pair. It is the greatest idempotently observed batch count, not a cumulative or exact event count, and never a balance.
             */
            evidenceCountLowerBound: number | null;
        };
        WalletAssetDiscoveryItem: {
            tokenAddress: string;
            evidence: components["schemas"]["WalletAssetDiscoveryEvidence"][];
            metadata: components["schemas"]["WalletAssetDiscoveryMetadata"];
        };
        WalletAssetDiscoveryCoverage: {
            /** @enum {string} */
            declaredScope: "standard_fungible_transfer_evidence" | "caller_explicit";
            completeWithinScope: boolean;
            /** @constant */
            globallyComplete: false;
            reasonCodes: ("seed_incomplete" | "source_truncated" | "tail_stale" | "unsupported_nonstandard")[];
            /**
             * Format: int64
             * @description Last block included in the completed historical discovery seed. This is not the current transfer-tail watermark.
             */
            coveredThroughBlock: number | null;
            /**
             * Format: int64
             * @description Target block for the historical discovery seed. Seed progress is complete only when coveredThroughBlock reaches this boundary.
             */
            targetThroughBlock: number | null;
            /**
             * Format: int64
             * @description Last block observed by the bounded standard ERC-20 transfer tail. This does not cover nonstandard token patterns; globallyComplete remains false with unsupported_nonstandard.
             */
            tailObservedThroughBlock: number | null;
        };
        WalletAssetDiscoveryPage: {
            /** @constant */
            schemaVersion: "starkscan.wallet_asset_discovery.v1";
            chainId: string;
            ownerAddress: string;
            /** @enum {string} */
            scope: "discovered" | "discovered_plus_registry";
            snapshotId: string;
            items: components["schemas"]["WalletAssetDiscoveryItem"][];
            hasMore: boolean;
            nextCursor: string | null;
            coverage: components["schemas"]["WalletAssetDiscoveryCoverage"];
        };
        RetiredTokenHoldingsResponse: {
            /** @constant */
            schemaVersion: "starkscan.retirement.v1";
            /** @constant */
            code: "token_holdings_retired";
            message: string;
            migrationGuide: string;
            successors: {
                /** @enum {string} */
                rel: "asset_discovery" | "wallet_state";
                /** @enum {string} */
                method: "GET" | "POST";
                path: string;
            }[];
            chainId: string;
            ownerAddress: string;
            requestId: string;
        };
        WalletStateIncludeRequest: {
            /** @default false */
            nonce: boolean;
            /** @default false */
            classHash: boolean;
        };
        WalletStateRequest: {
            ownerAddress: string;
            /**
             * @default require_complete
             * @enum {string}
             */
            mode: "require_complete" | "verified_partial";
            /**
             * @description `discovered` uses wallet-observed candidates only. `discovered_plus_registry` also evaluates the curated registry and can require pagination even when no wallet-observed asset exists.
             * @enum {string}
             */
            scope?: "explicit" | "discovered" | "discovered_plus_registry";
            tokenAddresses?: string[];
            cursor?: string;
            /** @default 25 */
            limit: number;
            /**
             * @default latest_accepted_l2
             * @enum {string}
             */
            blockPreference: "latest_accepted_l2" | "l1_accepted" | "explicit";
            blockHash?: string;
            /** Format: int64 */
            blockNumber?: number;
            include?: components["schemas"]["WalletStateIncludeRequest"];
        };
        WalletStateBlock: {
            preference: string;
            /** Format: int64 */
            blockNumber: number;
            blockHash: string;
            /** @enum {string} */
            finalityStatus: "accepted_on_l2" | "accepted_on_l1" | "explicit";
        };
        WalletStatePrice: {
            /**
             * @description `priced` is valid only with `fresh_exact_cached_price` and a non-null unit price. `valueUsd` is non-null only when the wallet balance was verified and value calculation succeeded. `unavailable` preserves the non-zero holding but excludes it from wallet totals.
             * @enum {string}
             */
            status: "priced" | "unavailable";
            /**
             * @description Stable machine-readable reason for the pricing decision. A missing, empty, or unknown value is a response-contract violation; retain the response x-request-id and report it.
             * @enum {string}
             */
            reasonCode: "fresh_exact_cached_price" | "price_metadata_unavailable" | "token_metadata_missing" | "token_unmapped" | "price_not_exact" | "price_missing" | "price_stale" | "value_calculation_failed";
            /** @constant */
            quoteCurrency: "usd";
            priceUsd: string | null;
            valueUsd: string | null;
            source: string | null;
            provider: string | null;
            confidence: string | null;
            /**
             * Format: date-time
             * @description Provider quote timestamp used for the freshness decision; distinct from observedAt, which is materialization time.
             */
            priceTimestamp: string | null;
            /**
             * Format: date-time
             * @description Time Starkscan materialized the quote; not the provider quote timestamp.
             */
            observedAt: string | null;
            maxAgeSeconds: number | null;
        };
        WalletStateAsset: {
            tokenAddress: string;
            /** @description Present only when balanceOf succeeded at block.blockHash. Never indexed or synthesized from an error. */
            balanceRaw: string | null;
            /** @enum {string} */
            status: "ok" | "unsupported" | "timeout" | "error";
            metadata: components["schemas"]["WalletAssetDiscoveryMetadata"];
            price: components["schemas"]["WalletStatePrice"];
        };
        WalletStateVerification: {
            /** @description Token candidates selected for block-pinned balance verification. Account-state reads are not included. */
            selected: number;
            /** @description Token balanceOf calls that succeeded at block.blockHash, including verified zeros. */
            verified: number;
            /** @description Verified non-zero token balances returned in items. */
            visibleNonZero: number;
            /** @description Verified zero token balances intentionally omitted from items. */
            verifiedZeroHidden: number;
            /** @description Token balance verification failures only. Inspect accountState statuses separately. */
            failed: number;
            /** @description Failed token verifications classified as timeouts. */
            timedOut: number;
            /** @description Failed token verifications classified as unsupported balanceOf behavior. */
            unsupported: number;
        };
        WalletStateAccountState: {
            nonce: string | null;
            /** @enum {string} */
            nonceStatus: "not_requested" | "verified" | "timeout" | "error";
            classHash: string | null;
            /** @enum {string} */
            classHashStatus: "not_requested" | "verified" | "timeout" | "error";
        };
        WalletStateValuation: {
            /**
             * @description Valuation counters and totalUsd cover only items in this response page.
             * @constant
             */
            scope: "page";
            /** @description True only when this discovery walk began without a cursor and the first response is terminal. It says the page is the whole selected discovery walk; it never describes a continuation page or a caller-supplied explicit token subset. */
            singlePageComplete: boolean;
            /**
             * @deprecated
             * @description Deprecated compatibility alias for singlePageComplete. On raw scope=page responses this is not a wallet-wide valuation guarantee. Use hasMore=false or nextCursor=null to detect walk termination, or the SDK aggregate's scope=wallet result for wallet-wide valuation.
             */
            completeForWallet: boolean;
            /** @description Exact decimal subtotal for priced assets in this response page. Raw scope=page responses never make this a wallet-wide total. */
            totalUsd: string | null;
            pricedAssetCount: number;
            unpricedNonZeroAssetCount: number;
            /** @description True means unpriced non-zero assets remain visible but are excluded from totalUsd; they are never counted as zero. */
            excludedUnpricedAssets: boolean;
        };
        WalletStateResponse: {
            /** @constant */
            schemaVersion: "starkscan.wallet_state.v1";
            chainId: string;
            ownerAddress: string;
            requestId: string;
            block: components["schemas"]["WalletStateBlock"];
            /**
             * @description `discovered` uses wallet-observed candidates only. `discovered_plus_registry` also evaluates the curated registry and can require pagination even when no wallet-observed asset exists.
             * @enum {string}
             */
            scope: "explicit" | "discovered" | "discovered_plus_registry";
            coverage: components["schemas"]["WalletAssetDiscoveryCoverage"];
            /** @enum {string} */
            correctness: "verified_complete" | "verified_partial";
            partial: boolean;
            /** @description True only when verification is complete, the page has no continuation, and discovery is complete within its declared scope. */
            walletSafe: boolean;
            items: components["schemas"]["WalletStateAsset"][];
            verification: components["schemas"]["WalletStateVerification"];
            accountState: components["schemas"]["WalletStateAccountState"];
            valuation: components["schemas"]["WalletStateValuation"];
            hasMore: boolean;
            nextCursor: string | null;
        };
        WalletPaymasterViewRequest: {
            addresses: string[];
            include?: components["schemas"]["WalletPaymasterViewInclude"];
            freshness?: components["schemas"]["WalletPaymasterViewFreshness"];
        };
        WalletPaymasterViewInclude: {
            /** @default true */
            identity: boolean;
            /** @default true */
            accountState: boolean;
            /** @description Reserved for forward-compatible requests. When omitted, null, or disabled it is ignored; when enabled in v1 the request fails closed with unsupported_section. */
            tokenHoldings?: components["schemas"]["WalletPaymasterLimitedSectionRequest"] | null;
            /** @description Reserved for forward-compatible requests. When omitted, null, or disabled it is ignored; when enabled in v1 the request fails closed with unsupported_section. */
            recentTransactions?: components["schemas"]["WalletPaymasterRecentTransactionsRequest"] | null;
            /**
             * @description Reserved for forward-compatible requests. In v1, true fails closed with unsupported_section.
             * @default false
             */
            bridgeAndMessages: boolean;
            /** @default true */
            finality: boolean;
            /**
             * @description Reserved for forward-compatible requests. In v1, true fails closed with unsupported_section; row-level details are not exposed in the first slice.
             * @default false
             */
            provenanceDetails: boolean;
        };
        WalletPaymasterLimitedSectionRequest: {
            enabled?: boolean | null;
            /** Format: int32 */
            limit?: number | null;
            cursorsByAddress?: {
                [key: string]: string | null;
            };
            /** @default false */
            includeSpam: boolean;
        };
        WalletPaymasterRecentTransactionsRequest: {
            enabled?: boolean | null;
            /** Format: int32 */
            limit?: number | null;
            cursorsByAddress?: {
                [key: string]: string | null;
            };
            /** @default false */
            includeReceipts: boolean;
        };
        WalletPaymasterViewFreshness: {
            /**
             * Format: int64
             * @description Accepted for forward-compatible requests; current responses warn that millisecond freshness is unavailable.
             */
            maxIndexedLagMs?: number | null;
            /** @default false */
            requireFresh: boolean;
        };
        DefiLendingMarketViewRequest: {
            markets: components["schemas"]["DefiLendingMarketSelectorRequest"][];
            include?: components["schemas"]["DefiLendingMarketViewInclude"];
            freshness?: components["schemas"]["DefiLendingMarketViewFreshness"];
        };
        DefiLendingMarketSelectorRequest: {
            /** @description Client-supplied stable market identifier, for example `vesu-main`. */
            marketId: string;
            /** @description Lending market, pool, singleton, vToken, periphery, oracle, or liquidation-helper contracts to hydrate from indexed address summaries. */
            contracts?: string[];
            /** @description Token addresses relevant to the selected market; echoed back for stable partner request correlation. */
            tokenAddresses?: string[];
        };
        DefiLendingMarketViewInclude: {
            /** @default true */
            contractIdentity: boolean;
            /** @description Reserved for forward-compatible requests. When omitted, null, or disabled it is ignored; when enabled in v1 the request fails closed with unsupported_section. */
            stateSamples?: components["schemas"]["DefiLendingStateSamplesRequest"] | null;
            /** @description Reserved for forward-compatible requests. When omitted, null, or disabled it is ignored; when enabled in v1 the request fails closed with unsupported_section. */
            events?: components["schemas"]["DefiLendingEventsRequest"] | null;
            /** @description Reserved for forward-compatible requests. When omitted, null, or disabled it is ignored; when enabled in v1 the request fails closed with unsupported_section. */
            recentTransactions?: components["schemas"]["DefiLendingRecentTransactionsRequest"] | null;
            /**
             * @description Returns the Query Plane boundary that simulation and signed-write execution remain on JSON-RPC.
             * @default true
             */
            simulationMetadata: boolean;
            /**
             * @description Reserved for forward-compatible requests. In v1, true fails closed with unsupported_section; row-level details are not exposed in the first slice.
             * @default false
             */
            provenanceDetails: boolean;
        };
        DefiLendingStateSamplesRequest: {
            enabled?: boolean | null;
            keys?: string[];
            /** Format: int32 */
            maxSamplesPerContract?: number | null;
        };
        DefiLendingEventsRequest: {
            enabled?: boolean | null;
            eventSelectors?: string[];
            /** Format: int64 */
            fromBlock?: number | null;
            /** Format: int64 */
            toBlock?: number | null;
            /** Format: int32 */
            limit?: number | null;
            cursorsByMarketId?: {
                [key: string]: string | null;
            };
        };
        DefiLendingRecentTransactionsRequest: {
            enabled?: boolean | null;
            /** Format: int32 */
            limit?: number | null;
            cursorsByMarketId?: {
                [key: string]: string | null;
            };
        };
        DefiLendingMarketViewFreshness: {
            /**
             * Format: int64
             * @description Accepted for forward-compatible requests; current responses warn that millisecond freshness is unavailable.
             */
            maxIndexedLagMs?: number | null;
            /** @default false */
            requireFresh: boolean;
        };
        SupportProofBundleRequest: {
            /** @description Incident transaction hash. Exactly one of `txHash` or `messageHash` is required. */
            txHash?: string | null;
            /** @description Incident protocol-message hash. Exactly one of `txHash` or `messageHash` is required. */
            messageHash?: string | null;
            /** @description Optional customer-support ticket, case, or incident id echoed back for operator correlation. */
            supportCorrelationId?: string | null;
            include?: components["schemas"]["SupportProofBundleInclude"];
            freshness?: components["schemas"]["SupportProofBundleFreshness"];
        };
        SupportProofBundleInclude: {
            /**
             * @description Return transaction detail when the incident selector is `txHash`; message-hash incidents return a warning instead of doing a reverse scan.
             * @default true
             */
            transaction: boolean;
            /** @default true */
            protocolMessages: boolean;
            /** @default true */
            starkgate: boolean;
            /** @default true */
            finality: boolean;
            /**
             * @description Reserved for forward-compatible requests. In v1, true fails closed with unsupported_section; row-level details are not exposed in the first slice.
             * @default false
             */
            provenanceDetails: boolean;
        };
        SupportProofBundleFreshness: {
            /**
             * Format: int64
             * @description Accepted for forward-compatible requests; current responses warn that millisecond freshness is unavailable.
             */
            maxIndexedLagMs?: number | null;
            /** @default false */
            requireFresh: boolean;
        };
        WalletPaymasterQueryEnvelope: {
            /** @enum {string} */
            schemaVersion: "starkscan.query.wallet_paymaster_view.v1";
            chain: string;
            requestId: string;
            snapshot: components["schemas"]["QueryPlaneSnapshot"];
            provenance: components["schemas"]["QueryPlaneProvenance"][];
            /** @description True when requested sections or source rows are unavailable and warnings explain the gap. */
            partial: boolean;
            warnings: components["schemas"]["QueryPlaneWarning"][];
            data: components["schemas"]["WalletPaymasterViewData"];
        };
        DefiLendingMarketQueryEnvelope: {
            /** @enum {string} */
            schemaVersion: "starkscan.query.defi_lending_market_view.v1";
            chain: string;
            requestId: string;
            snapshot: components["schemas"]["QueryPlaneSnapshot"];
            provenance: components["schemas"]["QueryPlaneProvenance"][];
            /** @description True when requested sections or source rows are unavailable and warnings explain the gap. */
            partial: boolean;
            warnings: components["schemas"]["QueryPlaneWarning"][];
            data: components["schemas"]["DefiLendingMarketViewData"];
        };
        SupportProofBundleEnvelope: {
            /** @enum {string} */
            schemaVersion: "starkscan.query.support_proof_bundle.v1";
            chain: string;
            requestId: string;
            snapshot: components["schemas"]["QueryPlaneSnapshot"];
            provenance: components["schemas"]["QueryPlaneProvenance"][];
            /** @description True when requested sections or source rows are unavailable and warnings explain the gap. */
            partial: boolean;
            warnings: components["schemas"]["QueryPlaneWarning"][];
            data: components["schemas"]["SupportProofBundleData"];
        };
        QueryPlaneSnapshot: {
            /** Format: int64 */
            blockNumber: number | null;
            blockHash: string | null;
            /** Format: int64 */
            l1AcceptedBlockNumber: number | null;
            l1AcceptedSource: string | null;
            /** @enum {string} */
            finalityStatus: "l1_accepted" | "l2_accepted" | "unknown";
            /** Format: int64 */
            freshnessMs: number | null;
            /** @enum {string} */
            watermarkSource: "indexed_read_model";
        };
        QueryPlaneProvenance: {
            fact: string;
            source: string;
            /** Format: int64 */
            blockNumber: number | null;
            coverage: string;
        };
        QueryPlaneWarning: {
            warningCode: string;
            section?: string;
            source?: string;
            /** Format: int64 */
            sourceBlockNumber?: number;
            /**
             * Format: int64
             * @description Bundle snapshot block number associated with this warning. This is the indexed Query Plane snapshot block, not the live head unless the bundle snapshot itself falls back to the live head.
             */
            bundleBlockNumber?: number;
            message: string;
        };
        WalletPaymasterViewData: {
            addresses: components["schemas"]["WalletPaymasterAddressView"][];
        };
        WalletPaymasterAddressView: {
            address: string;
            identity?: components["schemas"]["WalletPaymasterIdentityView"];
            accountState?: components["schemas"]["WalletPaymasterAccountStateView"];
            /** @description Present as null only when requested; first slice returns an unsupported-section warning. */
            tokenHoldings?: null;
            /** @description Present as null only when requested; first slice returns an unsupported-section warning. */
            recentTransactions?: null;
            /** @description Present as null only when requested; first slice returns an unsupported-section warning. */
            bridgeAndMessages?: null;
            finality?: components["schemas"]["WalletPaymasterFinalityView"];
        };
        WalletPaymasterIdentityView: {
            label: string | null;
            /** @description Indexed protocol attribution object when available. */
            protocol: {
                [key: string]: unknown;
            } | null;
            isAccount: boolean | null;
            /** @enum {string} */
            source: "starkscan_address_summary_read_model";
        };
        WalletPaymasterAccountStateView: {
            classHash: string | null;
            nonce: string | null;
            deployed: boolean | null;
            /** Format: int64 */
            latestObservedBlock: number | null;
            /** Format: int64 */
            activityCount: number | null;
            activityCountExact: boolean | null;
            /** Format: date-time */
            createdOnIso: string | null;
            deployedAtTxHash: string | null;
            deployedByAddress: string | null;
        };
        WalletPaymasterFinalityView: {
            /** Format: int64 */
            latestL1AcceptedBlockNumber: number | null;
            source: string | null;
        };
        DefiLendingMarketViewData: {
            markets: components["schemas"]["DefiLendingMarketView"][];
        };
        DefiLendingMarketView: {
            marketId: string;
            tokenAddresses: string[];
            contracts?: components["schemas"]["DefiLendingContractIdentityView"][];
            simulationMetadata?: components["schemas"]["DefiLendingSimulationMetadataView"];
        };
        DefiLendingContractIdentityView: {
            address: string;
            classHash: string | null;
            deployed: boolean | null;
            /** Format: int64 */
            latestObservedBlock: number | null;
            /** Format: int64 */
            activityCount: number | null;
            activityCountExact: boolean | null;
            /** @enum {string} */
            source: "starkscan_address_summary_read_model";
        };
        DefiLendingSimulationMetadataView: {
            /** @enum {boolean} */
            supported: false;
            /** @description Query Plane v1 boundary. Simulation and signed-write execution remain on the JSON-RPC compatibility plane. */
            boundary: string;
            /** @enum {string} */
            source: "starkscan_query_plane_contract";
        };
        SupportProofBundleData: {
            incident: components["schemas"]["SupportProofIncidentView"];
            /** @description Present when requested and the incident selector is a transaction hash. */
            transaction?: components["schemas"]["TransactionDetailView"] | null;
            /** @description Protocol-message lifecycle rows for the incident selector. */
            protocolMessages?: components["schemas"]["MessagePage"] | null;
            /** @description StarkGate transfer resolution for the incident selector. */
            starkgate?: components["schemas"]["StarkgateTransferResolutionView"] | null;
            finality?: components["schemas"]["SupportProofFinalityView"] | null;
        };
        SupportProofIncidentView: {
            txHash: string | null;
            messageHash: string | null;
            supportCorrelationId: string | null;
        };
        SupportProofFinalityView: {
            /** Format: int64 */
            latestL1AcceptedBlockNumber: number | null;
            source: string | null;
            /** @enum {string} */
            bundleFinalityStatus: "l1_accepted" | "l2_accepted" | "unknown";
        };
        ContractVerificationView: {
            chainId: string;
            contractAddress: string;
            classHash: string | null;
            sourceRef: string | null;
            language: string | null;
            compilerVersion: string | null;
            /**
             * @description Legacy migration state only; never establishes source verification.
             * @enum {string}
             */
            verificationStatus: "pending" | "failed";
            verificationError: string | null;
            requestedAtIso: string;
            verifiedAtIso: string | null;
            updatedAtIso: string;
            metadata: Record<string, never>;
        };
        ContractEntrypointItem: {
            selector: string;
            name: string | null;
            stateMutability: string | null;
            inputs: components["schemas"]["ContractAbiParameterView"][];
            outputs: components["schemas"]["ContractAbiParameterView"][];
        };
        ContractAbiParameterView: {
            name: string | null;
            type: string;
        };
        ContractAbiTypeView: {
            name: string;
            /** @enum {string} */
            kind: "struct" | "enum";
            members: components["schemas"]["ContractAbiParameterView"][];
        };
        ContractEntrypointsView: {
            chainId: string;
            contractAddress: string;
            /** @description Class hash resolved at blockTag. */
            classHash: string;
            /** @description Caller-supplied latest, block number, or block hash reference. */
            requestedBlockTag: string;
            /** @description Canonical block hash used for the class hash, class ABI, and paired contract call. */
            blockTag: string;
            /** Format: int64 */
            blockNumber: number;
            /** @enum {string} */
            finalityStatus: "ACCEPTED_ON_L1" | "ACCEPTED_ON_L2";
            external: components["schemas"]["ContractEntrypointItem"][];
            constructor: components["schemas"]["ContractEntrypointItem"][];
            l1Handler: components["schemas"]["ContractEntrypointItem"][];
            abiTypes: components["schemas"]["ContractAbiTypeView"][];
            abiTypesTruncated: boolean;
        };
        ContractClassEpochView: {
            classHash: string;
            /** Format: int64 */
            fromBlockNumber: number;
            /** Format: int32 */
            fromTxIndex: number;
            /** Format: int64 */
            toBlockNumber: number | null;
            /** Format: int32 */
            toTxIndex: number | null;
            /** @description Compatibility name for the newest open observed epoch; not proof of the class currently in force. */
            isCurrent: boolean;
            source: string;
            confidence: string;
            incompleteReason: string | null;
        };
        ContractClassHistoryView: {
            address: string;
            /** Format: int64 */
            limit: number;
            /** @description Newest-first observed epochs. This array can omit unobserved class changes. */
            epochs: components["schemas"]["ContractClassEpochView"][];
            /** @description True only when more observed rows exist than this bounded page returns; false does not certify complete upgrade history. */
            truncated: boolean;
            coverage: components["schemas"]["ContractClassHistoryCoverageView"];
        };
        ContractClassHistoryCoverageView: {
            /** @enum {string} */
            status: "partial";
            /** @enum {string} */
            source: "event_time_abi_observations";
            /** @enum {string} */
            reasonCode: "observation_backed_not_exhaustive";
            /** @description Human-readable warning that unobserved class changes can be absent. */
            message: string;
        };
        EventDecodedField: {
            label: string;
            /** @description Cairo ABI type used for this decoded field when available. */
            type: string | null;
            /** @enum {string} */
            source: "key" | "data";
            /** @enum {string} */
            kind: "address" | "hash" | "bool" | "u256" | "felt" | "text";
            /** @enum {string} */
            status: "decoded" | "partial" | "raw";
            rawValues: string[];
            originIndexes: number[];
            displayValue: string;
            addressValue: string | null;
            numericValue: string | null;
            textValue: string | null;
            boolValue: boolean | null;
        };
        ContractEventItem: {
            /** Format: int64 */
            blockNumber: number;
            /** Format: date-time */
            timestampIso: string;
            txHash: string;
            /** Format: int32 */
            txIndex: number;
            /** Format: int32 */
            logIndex: number;
            address: string;
            /** @description Reviewed indexed/token/protocol label for the emitting contract when available. It is presentation metadata and never affects raw event data or decoding provenance. */
            contractAlias?: string | null;
            /** @description Reviewed class-family label for the emitting contract's indexed class when available. It is presentation metadata and never affects raw event data or decoding provenance. */
            classAlias?: string | null;
            /** @description Canonical on-chain event key array in indexed payload order. Legacy rows lacking `payload.keys` reconstruct only `topic0` through `topic3`, so their key array can be incomplete; raw keys/data are authoritative. */
            keys: string[];
            topic0: string | null;
            topic1: string | null;
            topic2: string | null;
            topic3: string | null;
            data: string[];
            /**
             * @description Server-certified event decode state. `name_only` and `unknown` preserve the authoritative raw payload as available; legacy rows may expose a reconstructed, incomplete `keys[]` per the keys field description.
             * @enum {string}
             */
            decodingStatus: "decoded" | "name_only" | "unknown";
            /** @description Reviewed or ABI-derived event name when Starkscan can attribute topic0. */
            eventName?: string | null;
            /** @description Attribution source for eventName. Current values include verified_abi, class_abi, selector_unique, and curated_selector; clients should treat unknown strings as forward-compatible provenance labels. */
            eventNameSource?: string | null;
            /**
             * @description Reason eventName is omitted even though Starkscan has contract-scoped epoch facts for this event. Raw topic/data fields remain authoritative.
             * @enum {string|null}
             */
            eventNameUnavailableReason?: "event_time_class_epoch_unavailable" | null;
            /** @description Decoded key/data fields only when an exact materialized ABI schema or a reviewed standard selector-and-arity schema consumes the full payload. Raw topic/data fields remain authoritative. */
            decodedFields?: components["schemas"]["EventDecodedField"][];
            /** @description Attribution source used for decodedFields when present. */
            decodedFieldsSource?: string | null;
            /**
             * @description Reason decodedFields is omitted for an attributed event. Selector-only attribution names the event but does not prove the field layout; raw topic/data fields remain authoritative.
             * @enum {string|null}
             */
            decodedFieldsUnavailableReason?: "schema_unavailable" | "selector_only_attribution" | "payload_shape_mismatch" | "schema_shape_unsupported" | null;
        };
        ContractEventPage: {
            items: components["schemas"]["ContractEventItem"][];
            nextCursor: string | null;
            /** @description True only when the optional server attribution lookup failed operationally. Individual unknown events do not set this flag. */
            eventDecodingDegraded: boolean;
        };
        ContractAdvancedCoverageView: {
            /** @enum {string} */
            status: "exact" | "partial" | "unavailable";
            /** @enum {string} */
            source: "trace_facts" | "l2_bridge_signals" | "bridge_adapter_events" | "bridge_message_facts";
            /**
             * @description Reason the contract coverage view is not exact. Each value identifies the unavailable or incomplete coverage evidence for this contract.
             * @enum {string}
             */
            reasonCode: "indexed_trace_facts" | "no_matching_trace_rows" | "trace_tables_unavailable" | "trace_extraction_truncated" | "trace_projection_stale" | "indexed_bridge_pairing_facts" | "l1_pairing_not_indexed" | "bridge_message_facts_unavailable" | "adapter_pairing_facts_unavailable" | "query_timeout";
            message: string;
            /** Format: int64 */
            latestIndexedBlockNumber?: number | null;
            /** Format: int64 */
            chainHeadBlockNumber?: number | null;
            /** Format: int64 */
            lagBlocks?: number | null;
        };
        ContractAccountCallItem: {
            id: string;
            /** Format: int64 */
            blockNumber: number;
            /** Format: date-time */
            timestampIso: string | null;
            /** Format: int32 */
            txIndex: number;
            /** Format: int32 */
            callIndex: number;
            tracePath: string | null;
            txHash: string;
            methodName: string | null;
            entryPointSelector: string | null;
            senderAddress: string | null;
            callerAddress: string | null;
            calleeAddress: string;
            executionStatus: string | null;
            finalityStatus: string | null;
            /** @enum {string} */
            sourceTier: "head" | "finalized";
            extractionTruncated: boolean;
        };
        ContractAccountCallPage: {
            chainId: string;
            contractAddress: string;
            items: components["schemas"]["ContractAccountCallItem"][];
            nextCursor: string | null;
            coverage: components["schemas"]["ContractAdvancedCoverageView"];
        };
        ContractBridgeTransactionItem: {
            id: string;
            /** Format: int64 */
            blockNumber: number;
            /** Format: date-time */
            timestampIso: string | null;
            /** Format: int32 */
            txIndex: number;
            /** Format: int32 */
            logIndex: number;
            /** Format: int32 */
            transferIndex: number;
            txHash: string;
            status: string;
            /** @enum {string|null} */
            direction: "inbound" | "outbound" | null;
            messageHash: string | null;
            l1Hash: string | null;
            l2Hash: string | null;
            l1ContractAddress: string | null;
            l2ContractAddress: string | null;
            tokenAddress: string | null;
            tokenSymbol: string | null;
            /** Format: int32 */
            tokenDecimals: number | null;
            amountRaw: string | null;
            fromAddress: string | null;
            toAddress: string | null;
            /** @enum {string} */
            pairingConfidence: "message_pairing_fact" | "adapter_pairing_fact" | "unpaired_l2_only";
            /** @enum {string} */
            sourceTier: "head" | "finalized";
        };
        ContractBridgeTransactionPage: {
            chainId: string;
            contractAddress: string;
            items: components["schemas"]["ContractBridgeTransactionItem"][];
            nextCursor: string | null;
            coverage: components["schemas"]["ContractAdvancedCoverageView"];
        };
        StarkgateTransferCoverageView: {
            status: string;
            source: string;
            reasonCode: string;
            message: string;
        };
        StarkgateTransferStageView: {
            key: string;
            label: string;
            status: string;
            chain: string;
            txHash: string | null;
            /** Format: int64 */
            blockNumber: number | null;
        };
        StarkgateTransferItem: {
            id: string;
            messageHash: string;
            direction: string;
            status: string;
            statusLabel: string;
            nextAction: string;
            tokenAddress: string | null;
            tokenSymbol: string | null;
            tokenName: string | null;
            /** Format: int32 */
            tokenDecimals: number | null;
            /** @description Pinned official registry revision or explicit native-ETH payload rule used for metadata; null means Starkscan has no reviewed metadata source. */
            tokenMetadataSource: string | null;
            amountRaw: string | null;
            l1BridgeAddress: string | null;
            l2BridgeAddress: string | null;
            l1SenderAddress: string | null;
            l1RecipientAddress: string | null;
            l2SenderAddress: string | null;
            l2RecipientAddress: string | null;
            l1TxHash: string | null;
            l2TxHash: string | null;
            /** Format: int64 */
            l1BlockNumber: number | null;
            /** Format: int64 */
            l2BlockNumber: number | null;
            /**
             * @description Withdrawal claimability is scoped to every identical L2-to-L1 message represented by the same canonical message hash; StarknetCore does not expose per-emission registry slots.
             * @enum {string}
             */
            claimabilityScope: "message_hash_group" | "not_applicable";
            /** @description True when finalized emissions, consumptions, or the finalized registry show multiplicity, violate R + C <= M, or fail R + C = M after finalized L1 proof covers the represented emission, so no individual emission can be attributed to a claim. */
            claimabilityAmbiguous: boolean;
            /**
             * Format: int64
             * @description Count of distinct finalized Starknet L2-to-L1 emissions in this message-hash group, deduplicated by transaction hash and message index. Head-only observations do not contribute.
             */
            matchingL2MessageCount: number;
            /**
             * Format: int64
             * @description Count of indexed canonical StarknetCore ConsumedMessageToL1 logs in this message-hash group.
             */
            l1ConsumedMessageCount: number;
            /** @description StarknetCore l2ToL1Messages(messageHash) uint256 value at the exact finalized Ethereum snapshot, or null when no trustworthy snapshot is materialized. */
            registryClaimableMessageCount: string | null;
            /** Format: int64 */
            registrySnapshotBlockNumber: number | null;
            /** @description Canonical Ethereum block hash agreed by the configured RPC quorum for the registry snapshot. */
            registrySnapshotBlockHash: string | null;
            registrySnapshotSource: string | null;
            /** Format: date-time */
            registrySnapshotObservedAt: string | null;
            /** @description True only when the complete finalized registry snapshot is no more than five minutes old. Ready and cleared statuses require this freshness. */
            registrySnapshotFresh: boolean;
            /** @description True only when the represented emission is finalized and the group has M = 1, R = 1, and C = 0 at a complete finalized StarknetCore registry snapshot. Recheck the registry before submitting a claim because this is snapshot evidence, not a request-time RPC promise. */
            readyToClaimOnL1: boolean;
            /** @description True only when the represented emission is finalized, the group has M = 1, R = 0, and C = 1, and a finalized L1 state-update proof covers the represented withdrawal block. */
            completedOnL1: boolean;
            /** Format: int64 */
            l1AcceptedBlockNumber: number | null;
            /** @description Latest indexed proof source used for L1 readiness decisions. */
            proofSource: string | null;
            /**
             * Format: int64
             * @description Ethereum block number for the latest indexed StarknetCore state-update proof.
             */
            proofL1BlockNumber: number | null;
            /** @description Ethereum transaction hash for the latest indexed StarknetCore state-update proof. */
            proofL1TxHash: string | null;
            /** @description Ethereum consensus finality level required by Starkscan before marking ready-to-claim state. */
            proofEthereumFinality: string | null;
            /**
             * Format: date-time
             * @description Timestamp when Starkscan last updated the indexed proof row.
             */
            proofUpdatedAt: string | null;
            selector: string | null;
            nonce: string | null;
            payload: string[];
            payloadTruncated: boolean;
            sourceTier: string;
            evidence: string[];
            missingFacts: string[];
            stages: components["schemas"]["StarkgateTransferStageView"][];
        };
        StarkgateTransferQueryView: {
            txHash: string | null;
            messageHash: string | null;
            address: string | null;
            token: string | null;
            bridge: string | null;
            status: string | null;
            cursor: string | null;
            direction: string | null;
            /** Format: int64 */
            limit: number;
        };
        StarkgateTransferResolutionView: {
            chainId: string;
            query: components["schemas"]["StarkgateTransferQueryView"];
            items: components["schemas"]["StarkgateTransferItem"][];
            coverage: components["schemas"]["StarkgateTransferCoverageView"];
        };
        StarkgateTransferPageView: {
            chainId: string;
            query: components["schemas"]["StarkgateTransferQueryView"];
            items: components["schemas"]["StarkgateTransferItem"][];
            nextCursor: string | null;
            coverage: components["schemas"]["StarkgateTransferCoverageView"];
        };
        MessageCoverageView: {
            /** @enum {string} */
            status: "exact" | "partial" | "unavailable";
            /** @enum {string} */
            source: "starknet_protocol_messages";
            /** @enum {string} */
            reasonCode: "indexed_protocol_message_facts" | "no_matching_message_rows" | "message_not_found" | "message_detail_page_exhausted" | "message_facts_unavailable" | "message_detail_truncated" | "transaction_messages_truncated" | "query_timeout";
            message: string;
        };
        MessageTokenInterpretationView: {
            symbol: string;
            name: string;
            decimals: number;
        };
        /** @description Additive, fail-closed semantics from one reviewed exact protocol adapter. Raw message fields remain authoritative; unknown or near-match payloads use null. */
        MessageInterpretationView: {
            protocol: string;
            /** @enum {string} */
            kind: "token_transfer" | "cairo_fact";
            /** @enum {string} */
            action: "deposit" | "withdrawal" | "fact_delivery";
            summary: string;
            /** @enum {string} */
            source: "reviewed_protocol_adapter";
            matchRule: string;
            token: components["schemas"]["MessageTokenInterpretationView"] | null;
            amountRaw: string | null;
            amount: string | null;
            sender: string | null;
            recipient: string | null;
            factHash: string | null;
            mocked: boolean | null;
        };
        MessageItem: {
            id: string;
            /** Format: int64 */
            blockNumber: number;
            /** Format: date-time */
            timestampIso: string | null;
            /** Format: int32 */
            txIndex: number;
            /** Format: int32 */
            logIndex: number;
            messageHash: string;
            /** @enum {string} */
            direction: "l1_to_l2" | "l2_to_l1" | "unknown";
            fromAddress: string | null;
            toAddress: string | null;
            txHash: string;
            l1Hash: string | null;
            l2Hash: string | null;
            /**
             * Format: int64
             * @description Latest indexed canonical Ethereum block associated with this message hash. For L1-to-L2 messages where l1SentCount > 1, this is the latest indexed L1 send block. Null when the relevant L1 origin or consumption fact has not been indexed.
             */
            l1BlockNumber: number | null;
            /** @description Canonical StarknetCore LogMessageToL2 fee for L1-to-L2 origins, encoded as a hex quantity when indexed. When l1SentCount > 1, this is the fee from the latest indexed L1 send, the same send reflected by l1BlockNumber. Null for L2-to-L1 messages or when no L1 origin has been indexed. */
            l1Fee: string | null;
            l1ContractAddress: string | null;
            l2ContractAddress: string | null;
            bridgeContractAddress: string | null;
            status: string;
            /**
             * Format: int64
             * @description Count of indexed canonical StarknetCore L1 origin logs sharing this L1-to-L2 message hash.
             */
            l1SentCount: number;
            /**
             * Format: int64
             * @description Count of indexed canonical L2 emissions sharing this message hash.
             */
            l2SentCount: number;
            /**
             * Format: int64
             * @description Count of indexed canonical StarknetCore L1 consumption logs sharing this message hash.
             */
            l1ConsumedCount: number;
            /**
             * Format: int64
             * @description Non-negative pending lifecycle count for this message hash: L1 origins minus L2 consumptions for L1-to-L2, or L2 emissions minus canonical L1 consumptions for L2-to-L1.
             */
            pendingCount: number;
            nonce: string | null;
            selector: string | null;
            payload: string[];
            payloadTruncated: boolean;
            /** @enum {string} */
            sourceTier: "head" | "finalized";
            /** @description Null unless one exact reviewed protocol adapter matches. */
            interpretation: components["schemas"]["MessageInterpretationView"] | null;
        };
        MessagePage: {
            chainId: string;
            contractAddress: string | null;
            items: components["schemas"]["MessageItem"][];
            nextCursor: string | null;
            coverage: components["schemas"]["MessageCoverageView"];
        };
        MessageDetailView: {
            chainId: string;
            messageHash: string;
            items: components["schemas"]["MessageItem"][];
            nextCursor: string | null;
            coverage: components["schemas"]["MessageCoverageView"];
        };
        ContractReadResultView: {
            chainId: string;
            contractAddress: string;
            selector: string;
            /** @description Echoed validated caller text used for execution (`latest`, `pending`, block number, or block hash). */
            blockTag: components["schemas"]["BlockReference"];
            result: string[];
        };
        ContractStorageResultView: {
            chainId: string;
            contractAddress: string;
            /** @description Normalized storage-slot key. */
            key: string;
            /** @description Echoed validated caller text used for the read (`latest`, `pending`, block number, or block hash). */
            blockTag: components["schemas"]["BlockReference"];
            /** @description Felt stored at the slot, or `0x0` when the slot has never been written. */
            value: string;
        };
        ContractWritePayloadRequest: {
            selector: string;
            /** @default [] */
            calldata: string[];
        };
        ContractWritePayloadView: {
            chainId: string;
            contractAddress: string;
            selector: string;
            calldata: string[];
            call: Record<string, never>;
        };
        ContractTransactionTraceView: {
            chainId: string;
            txHash: string;
            trace: Record<string, never>;
        };
        AddressActivityItem: {
            /** Format: int64 */
            blockNumber: number;
            /** Format: date-time */
            timestampIso: string | null;
            /** Format: int32 */
            txIndex: number;
            /** Format: int32 */
            logIndex: number | null;
            /** Format: int32 */
            transferIndex: number | null;
            txHash: string;
            txCursor: string;
            kind: string;
            counterparty: string | null;
            tokenAddress: string | null;
            amount: string | null;
            tokenId: string | null;
        };
        AddressActivityPage: {
            items: components["schemas"]["AddressActivityItem"][];
            nextCursor: string | null;
        };
        AddressTransactionListItem: {
            /** Format: int64 */
            blockNumber: number;
            /** Format: date-time */
            timestampIso: string | null;
            /** Format: int32 */
            txIndex: number;
            txHash: string;
            kinds: string[];
            counterparty: string | null;
            txType: string | null;
            executionStatus: string | null;
            finalityStatus: string | null;
            fromAddress: string | null;
            toAddress: string | null;
            primaryMethod: string | null;
            /** Format: int32 */
            callCount: number | null;
            methodsDiffer: boolean | null;
            /** Format: int32 */
            transferCount: number | null;
            topTransferTokenAddress: string | null;
            topTransferAmount: string | null;
            topTransferStandard: string | null;
        };
        AddressTransactionPage: {
            items: components["schemas"]["AddressTransactionListItem"][];
            nextCursor: string | null;
        };
        AddressTokenHoldingItemView: {
            /** @description Token contract address as stored by the indexed balance source. */
            tokenAddress: string;
            /** @description Lowercase compact `0x` token address for stable agent comparisons. */
            normalizedTokenAddress: string;
            /** @description Decimal (base-10) balance served for this row. The legacy field name is retained for compatibility. On paginated responses, `balanceSource` states whether the value is transfer-derived or was replaced by a pinned RPC `balanceOf` result. */
            indexedBalanceRaw: string;
            /** @description Token symbol from trusted token-metadata data (token metadata indexes) or from known safe defaults when available. */
            symbol: string | null;
            /** @description Token name from trusted token-metadata data (token metadata indexes) or from known safe defaults when available. */
            name: string | null;
            /**
             * Format: int32
             * @description Token decimals from trusted token-metadata data (token metadata indexes) or from known safe defaults when available.
             */
            decimals: number | null;
            usd: components["schemas"]["AddressTokenHoldingUsdView"];
            /**
             * @description Whether this holding has a fresh exact cached USD price.
             * @enum {string}
             */
            priceStatus: "priced" | "unavailable";
            /**
             * @description Typed reason for `priceStatus`; unavailable never means a zero-dollar holding.
             * @enum {string}
             */
            priceReasonCode: "fresh_exact_cached_price" | "token_unmapped" | "price_not_exact" | "price_missing" | "price_stale" | "token_metadata_missing" | "value_calculation_failed" | "valuation_not_loaded";
            /** @description Exact cached USD unit price string when `priceStatus=priced`. */
            priceUsd: string | null;
            /** @description Exact decimal multiplication of indexedBalanceRaw and priceUsd when priced. */
            valueUsd: string | null;
            priceSource: string | null;
            priceProvider: string | null;
            /** @enum {string|null} */
            priceConfidence: "exact" | "proxy" | null;
            /** Format: date-time */
            priceTimestampIso: string | null;
            /** Format: date-time */
            priceObservedAtIso: string | null;
        };
        AddressTokenHoldingUsdView: {
            /**
             * @description `priced` only when an exact, fresh prepared USD fact can value this indexed balance.
             * @enum {string}
             */
            status: "priced" | "unavailable";
            /** @enum {string} */
            reasonCode: "fresh_exact_cached_price" | "price_metadata_unavailable" | "token_metadata_missing" | "balance_invalid" | "token_unmapped" | "price_not_exact" | "price_missing" | "price_stale" | "valuation_calculation_failed";
            /** @constant */
            quoteCurrency: "usd";
            /** @description Exact decimal balance derived from `indexedBalanceRaw`; never a floating-point value. */
            balanceDecimal: string | null;
            /** @description Prepared USD price string. Null unless `status=priced`. */
            priceUsd: string | null;
            /** @description Exact decimal multiplication of the indexed balance and prepared price. Null unless `status=priced`. */
            valueUsd: string | null;
            provider: string | null;
            source: string | null;
            confidence: string | null;
            /** Format: date-time */
            priceTimestamp: string | null;
            /** Format: date-time */
            observedAt: string | null;
            /** Format: int32 */
            maxAgeSeconds: number | null;
        };
        /**
         * @description `complete` means the full inventory and every returned balance are independently certified for portfolio parity checks. Other values are useful evidence but not exact portfolio ground truth. `lagBlocks` measures indexed-source lag only and must not be interpreted as per-token `balanceOf` freshness.
         * @enum {string}
         */
        TokenHoldingsCompletenessReasonCode: "complete" | "indexLag" | "boundedComputation" | "responseCap" | "metadataPending" | "degradedFallback" | "unknown";
        AddressTokenHoldingsCompletenessView: {
            /** @description Mirrors the top-level `exact` field. */
            exact: boolean;
            /** @description Mirrors the top-level `truncated` field. */
            truncated: boolean;
            /** @description True only when the response is exact, not truncated, and `reasonCode=complete`. */
            complete: boolean;
            reasonCode: components["schemas"]["TokenHoldingsCompletenessReasonCode"];
            /** @description Human-readable explanation for the current completeness state. */
            reason: string;
            /**
             * Format: int64
             * @description Indexed-source lag in blocks when known. Zero does not certify that any token balance equals on-chain `balanceOf`. Null means the route cannot attribute index lag for this response.
             */
            lagBlocks: number | null;
            /** @description True when a response cap affected the result. */
            capped: boolean;
            /**
             * Format: int32
             * @description Effective response cap when capped, otherwise null.
             */
            cap: number | null;
        };
        AddressTokenHoldingsView: {
            chainId: string;
            ownerAddress: string;
            /** @description Legacy bounded indexed observations embedded in a larger explorer response. These rows are not wallet-safe balance authority. Use assets/discovery for candidates and query/wallet-state for balances verified at one immutable block hash. */
            items: components["schemas"]["AddressTokenHoldingItemView"][];
            /** @description True only when the complete token inventory and every returned balance are independently certified at one chain snapshot. Transfer-derived materialization alone never satisfies this field. */
            exact: boolean;
            /** @description True when this response is a bounded subset of the holdings snapshot. */
            truncated: boolean;
            completeness: components["schemas"]["AddressTokenHoldingsCompletenessView"];
        };
        AddressTokenHoldingsPageView: {
            chainId: string;
            ownerAddress: string;
            /** @description One page of non-zero holdings, capped at 256 items. Curated known tokens rank before unknown tokens; each group then uses descending raw balance and ascending normalized token address. When `nextCursor` is non-null, follow it to retrieve the remaining rows. */
            items: components["schemas"]["AddressTokenHoldingItemView"][];
            /** @description True only when this response alone contains a complete token inventory whose balances are independently certified at one chain snapshot. Transfer-derived materialization alone never satisfies this field. Multi-page responses remain false because no single page contains the complete portfolio. */
            exact: boolean;
            /** @description True when this response is a bounded subset of the holdings snapshot. */
            truncated: boolean;
            completeness: components["schemas"]["AddressTokenHoldingsCompletenessView"];
            /**
             * @description Provenance for every `indexedBalanceRaw` value in this page. `pinnedRpcBalanceOf` is emitted only after every returned indexed candidate was verified successfully at one block and verified zeros were removed.
             * @enum {string}
             */
            balanceSource: "indexedTransferLedger" | "pinnedRpcBalanceOf";
            /** @description Pinned block hash when `balanceSource=pinnedRpcBalanceOf`; null for transfer-derived or legacy fallback pages. */
            balanceVerifiedAtBlock: string | null;
            /** @description Opaque keyset cursor for the next page, or null on the terminal page. */
            nextCursor: string | null;
            /** @description Address holdings version pinned by this cursor sequence. Null only for a non-pageable compatibility response while the versioned read model is warming. */
            snapshotId: string | null;
            /** @description True when all pages identified by snapshotId describe one stable indexed holdings snapshot. This is cursor-consistency provenance only: it does not certify token discovery or `balanceOf` values and can be true while top-level `exact` is false. */
            snapshotExact: boolean;
            /** @description True exactly when nextCursor is non-null. */
            hasMore: boolean;
            /**
             * Format: int32
             * @description Effective item limit applied to this response page.
             */
            pageLimit: number;
            /**
             * @description Deterministic ordering applied to the response. Clients may page only knownFirstBalanceDescTokenAsc responses with a non-null nextCursor; legacyBalanceDescTokenAsc is a bounded, non-pageable warmup fallback with hasMore=false.
             * @enum {string}
             */
            sort: "knownFirstBalanceDescTokenAsc" | "legacyBalanceDescTokenAsc";
        } & (unknown & unknown & unknown);
        StakingValidatorCoverageView: {
            /** @enum {string} */
            status: "indexed" | "not_indexed" | "unavailable";
            reasonCode: string;
            reason: string;
        };
        StakingValidatorDetailsView: {
            chainId: string;
            requestedAddress: string;
            /** @description Prepared validator detail fact. Null when coverage is not indexed or unavailable. */
            validator: Record<string, never> | null;
            description: string | null;
            delegators: Record<string, never>[];
            /** Format: int64 */
            delegatorTotal: number;
            activity: Record<string, never>[];
            coverage: components["schemas"]["StakingValidatorCoverageView"];
        };
        ContractSnapshotView: {
            chainId: string;
            address: string;
            summary: components["schemas"]["AddressSummaryView"];
            activityPage: components["schemas"]["AddressActivityPage"];
            transactionsPage: components["schemas"]["AddressTransactionPage"];
            tokenHoldings: components["schemas"]["AddressTokenHoldingsView"];
            summaryCompleteness: boolean;
            activityCompleteness: boolean;
            holdingsCompleteness: boolean;
        };
        TokenSummaryView: {
            chainId: string;
            tokenAddress: string;
            symbol: string | null;
            name: string | null;
            /** Format: int32 */
            decimals: number | null;
            standard: string;
            /** Format: date-time */
            metadataUpdatedAtIso: string | null;
            /** Format: int64 */
            summaryVersion: number;
            /** Format: date-time */
            summaryVersionUpdatedAtIso: string | null;
            /** @enum {string} */
            summaryCacheStatus: "current" | "stale" | "metadata_only" | "computed";
            /** Format: date-time */
            summaryCacheUpdatedAtIso: string | null;
            /**
             * Format: int64
             * @description Null when summaryCacheStatus is metadata_only because transfer aggregates are not yet known.
             */
            transferCount: number | null;
            /**
             * Format: int64
             * @description Null when summaryCacheStatus is metadata_only because transfer aggregates are not yet known.
             */
            distinctFromCount: number | null;
            /**
             * Format: int64
             * @description Null when summaryCacheStatus is metadata_only because transfer aggregates are not yet known.
             */
            distinctToCount: number | null;
            /**
             * Format: int64
             * @description Latest independently indexed transfer block when known; this can remain populated while aggregate counts are null in metadata_only responses.
             */
            latestTransferBlock: number | null;
            /** @description Decimal string from the row-backed token_supply_snapshot read model when available. */
            totalSupplyRaw: string | null;
            /** @description Source label for the row-backed total supply snapshot. */
            totalSupplySource: string | null;
            /**
             * Format: int64
             * @description Block number associated with the total supply snapshot when available.
             */
            totalSupplyBlockNumber: number | null;
            /**
             * Format: date-time
             * @description Timestamp when the total supply snapshot row was last updated.
             */
            totalSupplyUpdatedAtIso: string | null;
        } & ({
            totalSupplyRaw: string;
            totalSupplySource: string;
            /** Format: int64 */
            totalSupplyBlockNumber: number;
            /** Format: date-time */
            totalSupplyUpdatedAtIso: string;
        } | {
            totalSupplyRaw: null;
            totalSupplySource: null;
            totalSupplyBlockNumber: null;
            totalSupplyUpdatedAtIso: null;
        });
        TokenBalanceOfView: {
            chainId: string;
            tokenAddress: string;
            ownerAddress: string;
            /** @description Echoed validated caller text used for execution (`latest`, `pending`, block number, or block hash). */
            blockTag: components["schemas"]["BlockReference"];
            /** @description Decimal (base-10) string representation of the U256 balanceOf result. */
            balanceRaw: string;
        };
        TokenTotalSupplyView: {
            chainId: string;
            tokenAddress: string;
            /** @description Echoed validated caller text used for execution (`latest`, `pending`, block number, or block hash). */
            blockTag: components["schemas"]["BlockReference"];
            /** @description Decimal (base-10) string representation of the U256 totalSupply result. */
            totalSupplyRaw: string;
        };
        TokenHolderItem: {
            /**
             * Format: int64
             * @description One-based rank by descending indexed balance, then address ascending.
             */
            rank: number;
            address: string;
            /** @description Decimal (base-10) indexed balance string. */
            balanceRaw: string;
            /** Format: int64 */
            lastUpdatedBlock: number;
            /** Format: date-time */
            lastUpdatedTimestampIso: string | null;
        };
        /** @description Identity, provenance, and observable freshness for one holder population. `generationId`, `asOfBlockHash`, `rowDigest`, `expiresAt`, `updatedAt`, and `lagBlocks` are optional for legacy compatibility, but all six are present together for immutable complete-population and Top-N screening generations. Pages in one cursor walk preserve the generation identity. Analytics comparisons use `generationId`, block/hash, and `rowDigest`; `expiresAt` is a response-specific continuation deadline. `updatedAt` records publication time and `lagBlocks` compares the pinned snapshot to the indexed finalized head observed for this response. Clients must not fabricate an omitted field. */
        TokenHolderSnapshot: {
            /**
             * Format: int64
             * @description Finalized generation block number when generation-bound; nullable for a missing or legacy snapshot.
             */
            asOfBlock: number | null;
            /** @description Exact finalized block hash for an immutable generation. */
            asOfBlockHash?: string;
            /**
             * Format: int64
             * @description Server-assigned immutable holder generation identifier.
             */
            generationId?: number;
            /** @description SHA-256 identity of the complete ordered holder row population. It is response evidence, not a cursor field clients should construct. */
            rowDigest?: string;
            /**
             * Format: date-time
             * @description Retention deadline through which continuation cursors for this immutable generation can be served. The service default is six hours, but this timestamp is authoritative.
             */
            expiresAt?: string;
            /**
             * Format: date-time
             * @description Time at which this immutable generation was published and became available for reads.
             */
            updatedAt?: string;
            /**
             * Format: int64
             * @description Difference between the indexed finalized head observed for this response and the generation snapshot block.
             */
            lagBlocks?: number;
            /** @enum {string} */
            source: "materialized_fungible_balances" | "sealed_finalized_holder_generation" | "sealed_finalized_holder_screening_projection";
            /** @enum {string} */
            freshness: "head_plus_finalized" | "analytics_snapshot" | "finalized_generation" | "finalized_screening_generation";
        } & (unknown & unknown);
        TokenHolderScreeningSnapshot: components["schemas"]["TokenHolderSnapshot"] & {
            /** Format: int64 */
            asOfBlock: number;
            /** @constant */
            source: "sealed_finalized_holder_screening_projection";
            /** @constant */
            freshness: "finalized_screening_generation";
        };
        TokenHolderCompleteness: {
            /** @description Whether Starkscan has established that the generation represents the token's full holder population. This is independent of cursor pagination and sampled `balanceOf` checks. A full cursor walk with this field set to `false` is only a complete walk of the published subset, not a complete ownership population. */
            populationComplete: boolean;
            /**
             * @description Population-coverage evidence state. `complete_canonical_transfer_coverage` requires canonical transfer coverage and generation-bound reconstruction. `population_coverage_unproven` means the returned rows are useful indexed evidence but must not be used to make a complete-holder or supply-concentration claim.
             * @enum {string}
             */
            populationReasonCode: "complete_canonical_transfer_coverage" | "population_coverage_unproven";
            /** @description Correctness of the complete holder generation, not coverage of the current page. True only when certification binds the exact chain, token, generation, finalized block number/hash, and row digest. */
            exact: boolean;
            /** @description True only when the holder evidence/result was capped before a complete snapshot could be represented. Normal pagination is represented by `nextCursor` and does not make this field true; immutable holder pages therefore remain `truncated=false` while more pages exist. */
            truncated: boolean;
            /**
             * @description Completeness and certification reason for the holder generation. It is always present and must be interpreted alongside `exact`; `materialized_snapshot`, for example, can accompany `exact=true`. `cursor_snapshot_drift` means the cursor no longer matches the served snapshot identity; restart the holder walk from the first page rather than retrying or combining pages from that cursor.
             * @enum {string}
             */
            reasonCode: "materialized_snapshot" | "uncertified_materialized_snapshot" | "certification_not_run" | "certification_table_missing" | "revoked" | "stale" | "unavailable" | "audit_failed" | "cursor_snapshot_drift";
        } & ({
            /** @constant */
            populationComplete?: true;
            /** @constant */
            populationReasonCode?: "complete_canonical_transfer_coverage";
        } | {
            /** @constant */
            populationComplete?: false;
            /** @constant */
            populationReasonCode?: "population_coverage_unproven";
        });
        /** @description Certification state for the complete holder generation. `validatedAgainst=starknet_rpc_balanceOf` means bounded deterministic balances were sampled at the exact snapshot block. RPC does not enumerate holders and is not the population-completeness authority; exactness also requires complete canonical transfer coverage and generation-bound ledger reconstruction. */
        TokenHolderCertification: {
            /** @enum {string} */
            status: "certified";
            /**
             * @description Bounded exact-block balance sample oracle, not a holder enumeration source.
             * @enum {string}
             */
            validatedAgainst: "starknet_rpc_balanceOf";
            /** Format: date-time */
            checkedAt: string;
            /** @enum {string} */
            reasonCode: "materialized_snapshot";
        } | {
            /** @enum {string} */
            status: "uncertified";
            /** @enum {string|null} */
            validatedAgainst: "starknet_rpc_balanceOf" | null;
            /** Format: date-time */
            checkedAt: string | null;
            /** @enum {string} */
            reasonCode: "uncertified_materialized_snapshot" | "certification_not_run" | "certification_table_missing";
        } | {
            /** @enum {string} */
            status: "revoked";
            /** @enum {string|null} */
            validatedAgainst: "starknet_rpc_balanceOf" | null;
            /** Format: date-time */
            checkedAt: string | null;
            /** @enum {string} */
            reasonCode: "revoked";
        } | {
            /** @enum {string} */
            status: "stale";
            /** @enum {string|null} */
            validatedAgainst: "starknet_rpc_balanceOf" | null;
            /** Format: date-time */
            checkedAt: string | null;
            /** @enum {string} */
            reasonCode: "stale";
        } | {
            /** @enum {string} */
            status: "unavailable";
            /** @enum {string|null} */
            validatedAgainst: "starknet_rpc_balanceOf" | null;
            /** Format: date-time */
            checkedAt: string | null;
            /** @enum {string} */
            reasonCode: "unavailable";
        } | {
            /** @enum {string} */
            status: "audit_failed";
            /** @enum {string|null} */
            validatedAgainst: "starknet_rpc_balanceOf" | null;
            /** Format: date-time */
            checkedAt: string | null;
            /** @enum {string} */
            reasonCode: "audit_failed";
        };
        TokenHolderLimits: {
            /** Format: int64 */
            maxPageSize: number;
            /** @enum {string} */
            tier: "partner";
        };
        TokenHolderScreeningCoverage: {
            /** @constant */
            kind: "top_k_screening";
            /**
             * Format: int32
             * @description Server-resolved Top-N from the address-keyed screening policy; clients do not supply this value.
             */
            requestedTopN: number;
            /**
             * Format: int32
             * @description Total rows materialized in this bounded projection across all pages, not the current page length or the token's holderCount.
             */
            returnedCount: number;
            /** @constant */
            populationComplete: false;
            /** @constant */
            exact: false;
            /** @constant */
            reasonCode: "screening_projection_not_population_proof";
        };
        TokenHolderScreeningPage: {
            chainId: string;
            tokenAddress: string;
            snapshot: components["schemas"]["TokenHolderScreeningSnapshot"];
            screening: components["schemas"]["TokenHolderScreeningCoverage"];
            items: components["schemas"]["TokenHolderItem"][];
            /** @description Opaque continuation for this projection. Null proves only projection exhaustion. */
            nextCursor: string | null;
            limits: components["schemas"]["TokenHolderLimits"];
        };
        /** @description One balance-ranked page from a token holder population. A complete immutable walk follows `nextCursor` to null while preserving the full snapshot identity, contiguous ranks, and stable count/total. Exactness is certification metadata and is independent of page coverage. */
        TokenHolderPage: {
            chainId: string;
            tokenAddress: string;
            snapshot: components["schemas"]["TokenHolderSnapshot"];
            /**
             * Format: int64
             * @description Exact number of positive-balance rows in the immutable generation. When a non-serving certification state redacts public rows, zero is a redaction value and not proof that the token has no holders. A redacted response has `holderBalanceTotalRaw=null`; use that signal and the accompanying `certification.status`/`reasonCode` before treating zero as an empty population.
             */
            holderCount: number;
            /** @description Snapshot-aligned sum of every positive holder balance used as the analytics denominator. Null when holder rows are redacted. */
            holderBalanceTotalRaw: string | null;
            /** @description Page rows ordered by balanceRaw descending and canonical holder address ascending, with one-based contiguous generation ranks. */
            items: components["schemas"]["TokenHolderItem"][];
            /** @description Opaque immutable-generation v3 cursor for the next holder page. Non-null means more rows are available. Pass it back unchanged before `snapshot.expiresAt`; never decode, construct, or reuse it for another chain or token. */
            nextCursor: string | null;
            completeness: components["schemas"]["TokenHolderCompleteness"];
            certification: components["schemas"]["TokenHolderCertification"];
            limits: components["schemas"]["TokenHolderLimits"];
        };
        TokenControlFact: {
            /** @enum {string} */
            status: "fixed" | "mintable" | "minter_detected" | "pausable" | "freezable" | "blocklist_detected" | "not_detected" | "admin_detected" | "renounced" | "proxy_admin_detected" | "immutable_class" | "unknown";
            /** @description Indexed actor address when the status has a proven controlling actor. */
            actor: string | null;
        };
        TokenSupplyControlFact: components["schemas"]["TokenControlFact"] & {
            /** @enum {string} */
            status?: "fixed" | "mintable" | "minter_detected" | "unknown";
        };
        TokenTransferControlFact: components["schemas"]["TokenControlFact"] & {
            /** @enum {string} */
            status?: "pausable" | "freezable" | "blocklist_detected" | "not_detected" | "unknown";
        };
        TokenMetadataAdminControlFact: components["schemas"]["TokenControlFact"] & {
            /** @enum {string} */
            status?: "admin_detected" | "renounced" | "unknown";
        };
        TokenUpgradeControlFact: components["schemas"]["TokenControlFact"] & {
            /** @enum {string} */
            status?: "proxy_admin_detected" | "immutable_class" | "unknown";
        };
        TokenControlEvidenceItem: {
            /** @description Evidence record kind, for example cached selector read, ABI scan, or operator proof. */
            kind: string;
            source?: string | null;
            contractAddress?: string | null;
            selector?: string | null;
            txHash?: string | null;
            /** Format: int64 */
            blockNumber?: number | null;
            /** Format: int64 */
            block?: number | null;
            actor?: string | null;
            status?: string | null;
            note?: string | null;
        } & {
            [key: string]: unknown;
        };
        TokenControlsSnapshot: {
            supplyControl: components["schemas"]["TokenSupplyControlFact"];
            transferControl: components["schemas"]["TokenTransferControlFact"];
            metadataAdmin: components["schemas"]["TokenMetadataAdminControlFact"];
            upgradeControl: components["schemas"]["TokenUpgradeControlFact"];
            /** @description Compact provenance records collected outside the request path. */
            evidence: components["schemas"]["TokenControlEvidenceItem"][];
            /** Format: int64 */
            asOfBlock: number;
            source: string;
            /** Format: date-time */
            indexedAtIso: string;
        };
        TokenControlsView: {
            chainId: string;
            tokenAddress: string;
            indexed: boolean;
            /** @enum {string} */
            reasonCode: "materialized_controls_snapshot" | "controls_snapshot_missing";
            snapshot: components["schemas"]["TokenControlsSnapshot"] | null;
        };
        TokenMarketPoolItem: {
            /** @description Stable market identity. For singleton protocols this can identify a market inside the same pool contract. */
            marketId: string;
            /** @enum {string} */
            marketKind: "pool_contract" | "singleton_pool" | "orderbook";
            /** @description Protocol-native pool or market key when distinct from the contract address. */
            poolKey: string | null;
            /** @description Human label for the market when materialized offline. */
            displayName: string | null;
            protocolSlug: string | null;
            protocolName: string;
            /** @enum {string|null} */
            poolType: "cl" | "cpmm" | "stable" | "orderbook" | "unknown" | null;
            /** @description Legacy DEX label retained for compatibility; prefer protocolName/protocolSlug for new clients. */
            dex: string;
            poolAddress: string;
            pairedTokenAddress: string | null;
            pairedTokenSymbol: string | null;
            /** Format: int32 */
            feeBps: number | null;
            /** @description Decimal USD price string from the materialized snapshot. */
            priceUsd: string | null;
            /** @description Decimal USD TVL string from the materialized snapshot. */
            tvlUsd: string | null;
            /** @description Decimal USD 24h volume string from the materialized snapshot. */
            volume24hUsd: string | null;
            /** @description Decimal USD previous-window 24h volume used for delta display. */
            volume24hPrevUsd: string | null;
            /**
             * Format: int32
             * @description Signed basis-point change from previous 24h volume to current 24h volume.
             */
            volume24hChangeBps: number | null;
            /**
             * Format: int64
             * @description Unix timestamp for the inclusive start of the indexed 24h metric window.
             */
            volumeWindowStartUnix: number | null;
            /**
             * Format: int64
             * @description Unix timestamp for the exclusive end of the indexed 24h metric window.
             */
            volumeWindowEndUnix: number | null;
            /** Format: int64 */
            trades24h: number | null;
            /** Format: int64 */
            traders24h: number | null;
            /** Format: int64 */
            lastTradeBlock: number | null;
            /** Format: int64 */
            snapshotBlock: number | null;
            source: string;
            /** Format: date-time */
            updatedAtIso: string;
        };
        TokenMarketPoolCoverage: {
            exact: boolean;
            /** @enum {string} */
            reasonCode: "materialized_pool_snapshot" | "pool_snapshot_missing" | "pool_rollup_missing";
        };
        TokenMarketPoolLimits: {
            /** Format: int64 */
            maxPageSize: number;
            /** @enum {string} */
            tier: "partner";
        };
        TokenMarketPoolPage: {
            chainId: string;
            tokenAddress: string;
            /** Format: int64 */
            totalPairs: number | null;
            /** @description Indexed total TVL from the materialized token market pool rollup for this token, or null when that rollup value is not materialized. */
            totalTvlUsd: string | null;
            /** @description Indexed total 24h volume from the materialized token market pool rollup for this token, or null when that rollup window is not materialized. */
            totalVolume24hUsd: string | null;
            /**
             * Format: int64
             * @description Highest pool snapshot block included in the token-level rollup.
             */
            snapshotBlock: number | null;
            /**
             * Format: date-time
             * @description Latest indexed pool snapshot timestamp included in the token-level rollup.
             */
            updatedAtIso: string | null;
            /**
             * Format: int64
             * @description Earliest imported 24h metric window start across pool rows in the rollup.
             */
            volumeWindowStartUnix: number | null;
            /**
             * Format: int64
             * @description Latest imported 24h metric window end across pool rows in the rollup.
             */
            volumeWindowEndUnix: number | null;
            items: components["schemas"]["TokenMarketPoolItem"][];
            coverage: components["schemas"]["TokenMarketPoolCoverage"];
            limits: components["schemas"]["TokenMarketPoolLimits"];
        };
        TokenHolderTierDistributionItem: {
            tier: string;
            /** Format: int64 */
            minShareBps: number;
            /** Format: int64 */
            holderCount: number;
            /** Format: int64 */
            shareBps: number;
        };
        TokenHolderThresholdCountItem: {
            label: string;
            /** Format: int64 */
            thresholdBps: number;
            /** Format: int64 */
            holderCount: number;
        };
        TokenHolderAnalyticsMetrics: {
            holderBalanceTotalRaw: string;
            top5BalanceRaw: string;
            top10BalanceRaw: string;
            top100BalanceRaw: string;
            /** Format: int64 */
            top5ShareBps: number;
            /** Format: int64 */
            top10ShareBps: number;
            /** Format: int64 */
            top100ShareBps: number;
            /** Format: int64 */
            whaleCount: number;
            /** Format: int64 */
            whaleShareBps: number;
            /** Format: int64 */
            giniScorePpm: number;
            /** Format: int64 */
            nakamoto50Count: number | null;
            /** Format: int64 */
            holdersAbove1Percent: number;
            /** @description Fixed four-bucket holder concentration distribution. */
            tierDistribution: components["schemas"]["TokenHolderTierDistributionItem"][];
            /** @description Fixed three-threshold holder counts for >=1%, >=0.1%, and >=0.01%. */
            thresholdCounts: components["schemas"]["TokenHolderThresholdCountItem"][];
        };
        /** @description Offline concentration analytics for the full holder population. A fresh generation-bound response repeats the immutable holder snapshot identity, including `rowDigest`; compare all identity fields before combining these metrics with holder pages. Metrics are never computed from one loaded page or by request-time RPC. */
        TokenHolderAnalyticsSnapshot: {
            chainId: string;
            tokenAddress: string;
            snapshot: components["schemas"]["TokenHolderSnapshot"];
            /**
             * Format: int64
             * @description Holder population used for every metric in this snapshot. Zero when no prepared analytics snapshot exists (`computedAt=null` and `metrics=null`); clients must check `metrics` before treating this value as an authoritative empty population.
             */
            holderCount: number;
            /**
             * Format: date-time
             * @description Offline analytics computation time. Null means no prepared analytics snapshot exists.
             */
            computedAt: string | null;
            /** @description Complete-generation metrics, or null when the prepared analytics snapshot is missing or incomplete. */
            metrics: components["schemas"]["TokenHolderAnalyticsMetrics"] | null;
            completeness: components["schemas"]["TokenHolderCompleteness"];
        };
        SelfServeApiRateLimitPolicySummary: {
            policyKey: string;
            policyDisplayName: string;
            /** Format: int64 */
            lightPerMinute: number;
            /** Format: int64 */
            heavyPerMinute: number;
            /** Format: int64 */
            burst: number;
            /** Format: int64 */
            maxActiveKeys: number;
        };
        SelfServeApiKeySummary: {
            publicId: string;
            label: string;
            /** @enum {string} */
            environment: "test" | "live";
            scopes: ("read" | "batch" | "write" | "prove" | "trace")[];
            /** @enum {string} */
            status: "active" | "revoked";
            secretHint: string;
            maskedKey: string;
            rateLimitPolicy: components["schemas"]["SelfServeApiRateLimitPolicySummary"];
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            lastUsedAt: string | null;
            /** Format: date-time */
            expiresAt: string | null;
            /** Format: date-time */
            revokedAt: string | null;
        };
        SelfServeIssueApiKeyResult: {
            /** @enum {string} */
            action: "created" | "rotated";
            plaintextKey: string;
            apiKey: components["schemas"]["SelfServeApiKeySummary"];
            revokedPublicIds: string[];
        };
        SelfServePartnerAccessCodeRequest: {
            /** @description Single-use partner access code. Trim surrounding whitespace before sending; these constraints apply to the exact request value. Case is not significant because the server uppercases before matching. */
            code: string;
        };
        SelfServePartnerAccessCodeResponse: {
            /** @enum {string} */
            plan: "free" | "developer" | "growth" | "business" | "enterprise" | "wallet";
        };
        SelfServeRateLimitState: {
            loadClass: string;
            /** Format: int64 */
            limitPerMinute: number;
            /** Format: int64 */
            remaining: number;
            policy: string;
            /** Format: int64 */
            retryAfterSeconds: number | null;
            /** Format: date-time */
            observedAt: string;
        };
        SelfServeUsageEvent: {
            requestId: string;
            apiKeyPublicId: string;
            apiKeyLabel: string;
            /** @enum {string} */
            apiKeyEnvironment: "test" | "live";
            apiKeyScopes: ("read" | "batch" | "write" | "prove" | "trace")[];
            method: string;
            routePath: string;
            loadClass: string;
            /** Format: int64 */
            statusCode: number;
            latencyMs: number | null;
            rateLimitState: components["schemas"]["SelfServeRateLimitState"] | null;
            /** Format: date-time */
            observedAt: string;
        };
        SelfServePerKeyUsage: {
            apiKey: components["schemas"]["SelfServeApiKeySummary"];
            /** Format: int64 */
            totalRequests: number;
            /** Format: int64 */
            successCount: number;
            /** Format: int64 */
            failureCount: number;
            /** Format: date-time */
            lastRequestAt: string | null;
            /** Format: date-time */
            lastFailureAt: string | null;
            latestRateLimitState: components["schemas"]["SelfServeRateLimitState"] | null;
        };
        SelfServeUsageSnapshot: {
            /** Format: date-time */
            windowStart: string;
            /** Format: date-time */
            windowEnd: string;
            /** Format: int64 */
            totalRequests: number;
            /** Format: int64 */
            totalFailures: number;
            /** @description Per-key aggregates for the bounded recent usage window. */
            perKey: components["schemas"]["SelfServePerKeyUsage"][];
            /** @description True when older keys fell outside the bounded per-key window. */
            perKeyTruncated: boolean;
            /** @description Most recent request events in the bounded usage window. */
            recentRequests: components["schemas"]["SelfServeUsageEvent"][];
            /** @description True when more recent request events exist outside the returned slice. */
            recentRequestsTruncated: boolean;
            /** @description Most recent failure events in the bounded usage window. */
            recentFailures: components["schemas"]["SelfServeUsageEvent"][];
            /** @description True when more failure events exist outside the returned slice. */
            recentFailuresTruncated: boolean;
        };
        SelfServeApiKeyListResponse: {
            /** @description Newest-first self-serve API key metadata slice for the authenticated workspace. */
            items: components["schemas"]["SelfServeApiKeySummary"][];
            /** @description True when older historical keys exist outside the returned slice. */
            truncated: boolean;
        };
        SelfServeApiKeyDeleteResponse: {
            apiKey: components["schemas"]["SelfServeApiKeySummary"];
        };
        TokenTransferActionContext: {
            /** @enum {string} */
            actionKind: "transfer" | "mint" | "burn" | "swap_leg" | "bridge_leg" | "lp_add" | "lp_remove" | "fee" | "internal_routing" | "unknown";
            actionLabel: string;
            methodLabel: string | null;
            protocolSlug: string | null;
            protocolName: string | null;
            reasonCode: string;
            /** @enum {string} */
            confidence: "exact" | "partial" | "heuristic" | "unknown";
            isInternalRouting: boolean;
            source: string;
            /** Format: date-time */
            indexedAt: string | null;
        };
        TokenTransferItem: {
            /** Format: int64 */
            blockNumber: number;
            /** Format: date-time */
            timestampIso: string | null;
            /** Format: int32 */
            txIndex: number;
            /** Format: int32 */
            logIndex: number;
            /** Format: int32 */
            transferIndex: number;
            txHash: string;
            fromAddress: string | null;
            toAddress: string | null;
            amount: string | null;
            rawValue: string | null;
            tokenId: string | null;
            standard: string;
            /** @description Indexed or reviewed token symbol for display; null when unavailable. */
            tokenSymbol: string | null;
            /** @description Indexed or reviewed token display name; null when unavailable. */
            tokenName: string | null;
            /**
             * Format: int32
             * @description Indexed or reviewed token decimals for amount formatting; null when unavailable.
             */
            tokenDecimals: number | null;
            actionContext: components["schemas"]["TokenTransferActionContext"] | null;
            /** @description Transaction-time USD coverage when this route includes price materialization. Transaction-detail and token-transfer responses report a priced, typed-unpriced, or pending result. `outside_history_window` is terminal provider-policy coverage; `price_missing` is a repairable in-horizon gap. Lightweight preview/list responses that intentionally omit this enrichment may return null. Never treat a null or unpriced result as a live/current market price. */
            historicalUsd: components["schemas"]["TokenTransferHistoricalUsd"] | null;
            /** @enum {string} */
            sourceTier: "head" | "finalized";
        };
        TokenTransferPage: {
            items: components["schemas"]["TokenTransferItem"][];
            nextCursor: string | null;
        };
        GlobalTransferItem: {
            /** Format: int64 */
            blockNumber: number;
            /** Format: date-time */
            timestampIso: string | null;
            /** Format: int32 */
            txIndex: number;
            /** Format: int32 */
            logIndex: number;
            /** Format: int32 */
            transferIndex: number;
            txHash: string;
            tokenAddress: string;
            fromAddress: string | null;
            toAddress: string | null;
            amount: string | null;
            rawValue: string | null;
            tokenId: string | null;
            standard: string;
            /** @description Indexed or reviewed token symbol for display; null when unavailable. */
            tokenSymbol: string | null;
            /** @description Indexed or reviewed token display name; null when unavailable. */
            tokenName: string | null;
            /**
             * Format: int32
             * @description Indexed or reviewed token decimals for amount formatting; null when unavailable.
             */
            tokenDecimals: number | null;
            /** @enum {string} */
            sourceTier: "head" | "finalized";
            actionContext: components["schemas"]["TokenTransferActionContext"] | null;
            /** @description Transaction-time USD coverage for this transfer. A null result is an explicit omission or unavailable fact, never a current-price substitute. */
            historicalUsd: components["schemas"]["TokenTransferHistoricalUsd"] | null;
        };
        GlobalTransferPage: {
            items: components["schemas"]["GlobalTransferItem"][];
            nextCursor: string | null;
        };
        GlobalEventItem: {
            /** Format: int64 */
            blockNumber: number;
            /** Format: date-time */
            timestampIso: string | null;
            /** Format: int32 */
            txIndex: number;
            /** Format: int32 */
            logIndex: number;
            txHash: string;
            address: string;
            /** @description Reviewed indexed/token/protocol label for the emitting contract when available. It is presentation metadata and never affects raw event data or decoding provenance. */
            contractAlias?: string | null;
            /** @description Reviewed class-family label for the emitting contract's indexed class when available. It is presentation metadata and never affects raw event data or decoding provenance. */
            classAlias?: string | null;
            /** @description Canonical on-chain event key array in indexed payload order. Legacy rows lacking `payload.keys` reconstruct only `topic0` through `topic3`, so their key array can be incomplete; raw keys/data are authoritative. */
            keys: string[];
            topic0: string | null;
            topic1: string | null;
            topic2: string | null;
            topic3: string | null;
            data: string[];
            /**
             * @description Server-certified event decode state. `name_only` and `unknown` preserve the authoritative raw payload as available; legacy rows may expose a reconstructed, incomplete `keys[]` per the keys field description.
             * @enum {string}
             */
            decodingStatus: "decoded" | "name_only" | "unknown";
            /** @description Reviewed or ABI-derived event name when Starkscan can attribute topic0. */
            eventName?: string | null;
            /** @description Attribution source for eventName. Current values include verified_abi, class_abi, selector_unique, and curated_selector; clients should treat unknown strings as forward-compatible provenance labels. */
            eventNameSource?: string | null;
            /**
             * @description Reason eventName is omitted even though Starkscan has contract-scoped epoch facts for this event. Raw topic/data fields remain authoritative.
             * @enum {string|null}
             */
            eventNameUnavailableReason?: "event_time_class_epoch_unavailable" | null;
            /** @description Decoded key/data fields only when an exact materialized ABI schema or a reviewed standard selector-and-arity schema consumes the full payload. Raw topic/data fields remain authoritative. */
            decodedFields?: components["schemas"]["EventDecodedField"][];
            /** @description Attribution source used for decodedFields when present. */
            decodedFieldsSource?: string | null;
            /**
             * @description Reason decodedFields is omitted for an attributed event. Selector-only attribution names the event but does not prove the field layout; raw topic/data fields remain authoritative.
             * @enum {string|null}
             */
            decodedFieldsUnavailableReason?: "schema_unavailable" | "selector_only_attribution" | "payload_shape_mismatch" | "schema_shape_unsupported" | null;
            /** @description Exact execution class selected from the emitting contract's applicable on-chain class epoch at this event. Omitted when event-time class evidence is absent or ambiguous; the current contract class is never substituted. */
            eventTimeClassHash?: string | null;
            /** @enum {string} */
            sourceTier: "head" | "finalized";
        };
        GlobalEventPage: {
            items: components["schemas"]["GlobalEventItem"][];
            nextCursor: string | null;
            /** @description True only when the optional server attribution lookup failed operationally. Individual unknown events do not set this flag. */
            eventDecodingDegraded: boolean;
        };
        StrkbtcShieldEventItem: {
            /** Format: int64 */
            blockNumber: number;
            /** Format: int32 */
            txIndex: number;
            /** Format: int32 */
            logIndex: number;
            txHash: string;
            contractAddress: string;
            topic0: string;
            /** @enum {string} */
            direction: "shield" | "unshield";
            commitmentOrNullifier: string;
            publicAmount: string | null;
        };
        StrkbtcShieldEventPage: {
            items: components["schemas"]["StrkbtcShieldEventItem"][];
            nextCursor: string | null;
        };
        StrkbtcCommitmentItem: {
            /** Format: int64 */
            blockNumber: number;
            /** Format: int32 */
            txIndex: number;
            /** Format: int32 */
            logIndex: number;
            txHash: string;
            commitmentHash: string;
        };
        StrkbtcCommitmentPage: {
            items: components["schemas"]["StrkbtcCommitmentItem"][];
            nextCursor: string | null;
        };
        StrkbtcNullifierItem: {
            /** Format: int64 */
            blockNumber: number;
            /** Format: int32 */
            txIndex: number;
            /** Format: int32 */
            logIndex: number;
            txHash: string;
            nullifierHash: string;
        };
        StrkbtcNullifierPage: {
            items: components["schemas"]["StrkbtcNullifierItem"][];
            nextCursor: string | null;
        };
        StrkbtcPoolStatusView: {
            chainId: string;
            /** Format: int64 */
            commitmentCount: number;
            /** Format: int64 */
            nullifierCount: number;
            /** Format: int64 */
            netOpenCount: number;
            /** Format: int64 */
            version: number;
            updatedAtIso: string;
        };
        /** @enum {string} */
        PrivacyPoolPublicVisibility: "public" | "partial" | "hidden_by_design";
        PrivacyPoolTokenView: {
            address: string;
            symbol: string | null;
            name: string | null;
            /**
             * Format: int32
             * @description Token decimals from authoritative indexed metadata, with an address-keyed two-provider-audited Privacy Pool manifest fallback on SN_MAIN only when indexed metadata is missing or incomplete. Null when neither source provides decimals; no request-time RPC lookup is performed.
             */
            decimals: number | null;
        };
        PrivacyPoolPublicFieldsView: {
            visibility: components["schemas"]["PrivacyPoolPublicVisibility"];
            /** @description Public on-chain actor address when the decoded event exposes one, such as a depositor. Null when absent, partial, or hidden by the event shape. */
            actorAddress: string | null;
            /** @description Public on-chain recipient address when the decoded event exposes one, such as a withdrawal recipient. Null when absent, partial, or hidden by the event shape. */
            toAddress: string | null;
            token: components["schemas"]["PrivacyPoolTokenView"] | null;
            amountRaw: string | null;
            noteId: string | null;
            nullifier: string | null;
            auditorPublicKey: string | null;
        };
        PrivacyPoolFeeEvidenceView: {
            tokenAddress: string;
            amountRaw: string;
            collectorAddress: string;
            /** Format: int32 */
            transferLogIndex: number;
            /** Format: int32 */
            transferIndex: number;
            /** Format: int64 */
            feeCollectorConfigBlockNumber: number;
            /** Format: int32 */
            feeCollectorConfigTxIndex: number;
            /** Format: int32 */
            feeCollectorConfigLogIndex: number;
            /** Format: int64 */
            feeAmountConfigBlockNumber: number;
            /** Format: int32 */
            feeAmountConfigTxIndex: number;
            /** Format: int32 */
            feeAmountConfigLogIndex: number;
        };
        PrivacyPoolEventItem: {
            /** Format: int64 */
            blockNumber: number;
            /**
             * Format: date-time
             * @description UTC block timestamp when the indexed block is available.
             */
            timestampIso: string | null;
            /** Format: int32 */
            txIndex: number;
            /** Format: int32 */
            logIndex: number;
            txHash: string;
            contractAddress: string;
            topic0: string;
            /**
             * @description Indexed snake_case privacy-pool event name.
             * @example deposit
             * @example withdrawal
             * @example proof_validity_blocks_set
             * @example protocol_event
             */
            eventName: string;
            key1: string | null;
            key2: string | null;
            data0: string | null;
            data1: string | null;
            data2: string | null;
            /** @description Raw Starknet event keys as stored by the indexer. Payload-backed rows expose the full receipt keys array with the selector at index 0. Legacy rows without payload arrays expose only the indexed selector/key subset and must not be treated as receipt-complete evidence until verified against the transaction receipt. */
            keys: string[];
            /** @description Raw Starknet event data as stored by the indexer. Payload-backed rows expose the full receipt data array. Legacy rows without payload arrays expose only the indexed data subset and must not be treated as receipt-complete evidence until verified against the transaction receipt. */
            data: string[];
            publicFields: components["schemas"]["PrivacyPoolPublicFieldsView"];
            /** @description Public fee-transfer evidence for the same transaction, deduped per Activity row; empty when no configured privacy-pool fee transfer is present. */
            privacyFees: components["schemas"]["PrivacyPoolFeeEvidenceView"][];
        };
        PrivacyPoolEventPage: {
            items: components["schemas"]["PrivacyPoolEventItem"][];
            nextCursor: string | null;
        };
        PrivacyPoolCommitmentFactItem: {
            /** Format: int64 */
            blockNumber: number;
            /** Format: int32 */
            txIndex: number;
            /** Format: int32 */
            logIndex: number;
            txHash: string;
            poolContractAddress: string;
            eventName: string;
            commitmentHash: string;
            tokenAddress: string | null;
            amountRaw: string | null;
        };
        PrivacyPoolCommitmentFactPage: {
            items: components["schemas"]["PrivacyPoolCommitmentFactItem"][];
            nextCursor: string | null;
        };
        PrivacyPoolNullifierFactItem: {
            /** Format: int64 */
            blockNumber: number;
            /** Format: int32 */
            txIndex: number;
            /** Format: int32 */
            logIndex: number;
            txHash: string;
            poolContractAddress: string;
            eventName: string;
            nullifierHash: string;
        };
        PrivacyPoolNullifierFactPage: {
            items: components["schemas"]["PrivacyPoolNullifierFactItem"][];
            nextCursor: string | null;
        };
        PrivacyPoolRootFactItem: {
            /** Format: int64 */
            blockNumber: number;
            /** Format: int32 */
            txIndex: number;
            /** Format: int32 */
            logIndex: number;
            txHash: string;
            poolContractAddress: string;
            eventName: string;
            rootHash: string;
            treeSize: string | null;
        };
        PrivacyPoolRootFactPage: {
            items: components["schemas"]["PrivacyPoolRootFactItem"][];
            nextCursor: string | null;
        };
        PrivacyPoolStatusView: {
            chainId: string;
            /** Format: int64 */
            totalEvents: number;
            /** Format: int64 */
            depositCount: number;
            /** Format: int64 */
            withdrawalCount: number;
            /** Format: int64 */
            openNoteCreatedCount: number;
            /** Format: int64 */
            openNoteDepositedCount: number;
            /** Format: int64 */
            encNoteCreatedCount: number;
            /** Format: int64 */
            noteUsedCount: number;
            /** Format: int64 */
            auditorPublicKeySetCount: number;
            /**
             * Format: int64
             * @description Number of indexed public ViewingKeySet event rows.
             */
            viewingKeySetCount: number;
            /**
             * Format: int64
             * @description Distinct public user addresses that registered a viewing key.
             */
            registeredUserCount: number;
            noteState: components["schemas"]["PrivacyPoolNoteStateView"];
            /** @description Complete partition of indexed privacy-pool events by event name. */
            eventBreakdown: components["schemas"]["PrivacyPoolCountView"][];
            /**
             * Format: int64
             * @description Backwards-compatible alias for the latest decoded/materialized privacy-pool event block.
             */
            latestEventBlock: number | null;
            /**
             * Format: int32
             * @description Backwards-compatible alias for the latest decoded/materialized privacy-pool event transaction index.
             */
            latestEventTxIndex: number | null;
            /**
             * Format: int32
             * @description Backwards-compatible alias for the latest decoded/materialized privacy-pool event log index.
             */
            latestEventLogIndex: number | null;
            /** @description Backwards-compatible alias for the latest decoded/materialized privacy-pool event cursor as block:tx:log. */
            latestEventCursor: string | null;
            /**
             * Format: int64
             * @description Latest privacy-pool event block that has passed decoding and materialization.
             */
            latestDecodedEventBlock: number | null;
            /**
             * Format: int32
             * @description Transaction index component of the latest decoded/materialized privacy-pool event cursor.
             */
            latestDecodedEventTxIndex: number | null;
            /**
             * Format: int32
             * @description Log index component of the latest decoded/materialized privacy-pool event cursor.
             */
            latestDecodedEventLogIndex: number | null;
            /** @description Exact latest decoded/materialized privacy-pool event cursor as block:tx:log. */
            latestDecodedEventCursor: string | null;
            /**
             * Format: int64
             * @description Latest raw privacy-pool contract event block observed by the source-event filter, when available.
             */
            latestRawEventBlock: number | null;
            /**
             * Format: int32
             * @description Transaction index component of the latest raw privacy-pool source-event cursor, when available.
             */
            latestRawEventTxIndex: number | null;
            /**
             * Format: int32
             * @description Log index component of the latest raw privacy-pool source-event cursor, when available.
             */
            latestRawEventLogIndex: number | null;
            /** @description Exact latest raw privacy-pool source-event cursor as block:tx:log, when available. */
            latestRawEventCursor: string | null;
            /**
             * Format: int64
             * @description Raw-event block minus decoded/materialized event block when the raw source-event filter is available.
             */
            eventLagBlocks: number | null;
            /** @description True when a raw source-event filter is configured but exceeds the bounded serving-path candidate limit, so raw freshness cannot be certified. This is distinct from no raw filter being configured. */
            rawEventFilterTruncated: boolean;
            /** @description True when decoded privacy-pool materialization is caught up with raw event evidence; null when no raw source-event filter is configured or raw freshness is unavailable. Check rawEventFilterTruncated to distinguish the bounded-filter case. */
            materializationFresh: boolean | null;
        };
        PrivacyPoolNoteStateView: {
            /**
             * Format: int64
             * @description Count of public commitment facts indexed for the pool.
             */
            commitmentCount: number;
            /**
             * Format: int64
             * @description Count of public nullifier facts indexed for the pool.
             */
            nullifierCount: number;
            /** Format: int64 */
            openNoteCreatedCount: number;
            /** Format: int64 */
            openNoteDepositedCount: number;
            /** Format: int64 */
            encNoteCreatedCount: number;
            /** Format: int64 */
            noteUsedCount: number;
            /**
             * Format: int64
             * @description Public spent-note proxy equal to the nullifier count; notes are not linked.
             */
            spentNoteProxyCount: number;
            /**
             * Format: int64
             * @description Public unspent-note proxy computed as commitments minus nullifiers, floored at zero.
             */
            unspentNoteProxyCount: number;
            /** @enum {string} */
            source: "public_decoded_event_rows";
            /**
             * @description Explicit caveat that this is not exact anonymity k.
             * @constant
             */
            caveat: "Public note/nullifier proxy only; not exact anonymity k; exact anonymity requires root-time state and denomination semantics.";
        };
        PrivacyPoolTvlAsOfView: {
            /** Format: int64 */
            blockNumber: number | null;
            blockHash: string | null;
            /** Format: date-time */
            blockTimestamp: string | null;
            /** Format: date-time */
            materializedAt: string | null;
        };
        PrivacyPoolTvlCoverageView: {
            /** @enum {string} */
            status: "complete" | "partial" | "unavailable";
            /** @enum {string} */
            reasonCode: "finalized_public_flow_ledger" | "incomplete_finalized_flow_ledger" | "no_finalized_flow_snapshot" | "decoded_materialization_lag" | "materialization_freshness_unavailable" | "raw_event_filter_truncated";
            /**
             * @description True because the ledger reads Starkscan's depth-confirmed indexed finalized tier. This does not by itself assert Starknet L1 acceptance.
             * @constant
             */
            finalizedOnly: true;
            /**
             * @description Exact meaning of `finalizedOnly`; this is an indexed confirmation tier, not an L1-settlement claim.
             * @constant
             */
            finalityBasis: "starkscan_indexed_finalized_tier";
            /**
             * Format: int64
             * @description Latest indexed Starknet block proven accepted on L1, or null when that evidence is unavailable.
             */
            latestL1AcceptedBlockNumber: number | null;
            /** @description True only when `asOf.blockNumber` is at or below `latestL1AcceptedBlockNumber`; null when either comparison input is unavailable. */
            asOfL1Accepted: boolean | null;
            /** Format: int64 */
            fromBlockNumber: number | null;
            /** Format: int64 */
            throughBlockNumber: number | null;
            /** Format: int64 */
            latestEventBlockNumber: number | null;
            /** @description Canonical block:tx:log position of the latest public deposit or withdrawal included in the ledger. This is the precise same-block reconciliation watermark. */
            latestEventCursor: string | null;
            /** Format: int64 */
            poolContractCount: number;
            /**
             * Format: int64
             * @description Number of served assets. Known zero-balance tokens are omitted; amount-incomplete tokens remain included with degraded status.
             */
            tokenCount: number;
            /** Format: int64 */
            missingAmountEventCount: number;
            /** @description True when finalized decoded deposit/withdrawal facts are caught up to matching raw finalized logs; null when the raw comparison filter is not configured or was truncated and therefore cannot certify completeness. */
            decodedMaterializationFresh: boolean | null;
            /**
             * Format: int64
             * @description Raw finalized deposit/withdrawal block minus the latest decoded finalized flow block. Cursor-level lag can still exist when this value is zero.
             */
            decodedEventLagBlocks: number | null;
        };
        /**
         * @deprecated
         * @description Legacy compatibility valuation. Not a supported Privacy Pool pricing or accounting input; consumers must price raw address-keyed token amounts independently.
         */
        PrivacyPoolTvlPriceView: {
            /** @enum {string} */
            status: "priced" | "unavailable";
            /** @enum {string} */
            reasonCode: "fresh_exact_cached_price" | "amount_decode_incomplete" | "negative_protected_amount" | "token_metadata_missing" | "token_unmapped" | "price_not_exact" | "price_missing" | "price_stale";
            priceUsd: string | null;
            source: string | null;
            provider: string | null;
            confidence: string | null;
            /** Format: date-time */
            priceTimestamp: string | null;
            /** Format: date-time */
            observedAt: string | null;
            /** Format: int32 */
            maxAgeSeconds: number | null;
        } & ({
            /** @constant */
            status: "priced";
            /** @constant */
            reasonCode: "fresh_exact_cached_price";
            priceUsd: string;
        } | {
            /** @constant */
            status: "unavailable";
            /** @enum {unknown} */
            reasonCode: "amount_decode_incomplete" | "negative_protected_amount" | "token_metadata_missing" | "token_unmapped" | "price_not_exact" | "price_missing" | "price_stale";
            priceUsd: string | null;
        });
        PrivacyPoolTvlAssetView: {
            token: components["schemas"]["PrivacyPoolTokenView"];
            /** @enum {string} */
            status: "complete" | "degraded";
            /** @enum {string} */
            reasonCode: "finalized_public_flow_ledger" | "amount_decode_incomplete" | "negative_protected_amount";
            /** Format: int64 */
            poolContractCount: number;
            /** Format: int64 */
            depositEventCount: number;
            /** Format: int64 */
            withdrawalEventCount: number;
            depositAmountRaw: string;
            withdrawalAmountRaw: string;
            protectedAmountRaw: string;
            /** @description Exact normalized protected amount derived from protectedAmountRaw using indexed decimals, or audited SN_MAIN manifest decimals when indexed metadata is missing or incomplete. Null when decimals are unavailable or the raw amount cannot be safely normalized, including incomplete amount decoding or a negative protected amount. */
            protectedAmount: string | null;
            /** Format: int64 */
            missingAmountEventCount: number;
            /**
             * @deprecated
             * @description Legacy compatibility valuation. Do not use as a pricing or accounting input.
             */
            price: components["schemas"]["PrivacyPoolTvlPriceView"];
            /**
             * @deprecated
             * @description Legacy compatibility display value. Do not use as a pricing or accounting input.
             */
            valueUsd: string | null;
        } & (({
            /** @constant */
            status: "complete";
            price: components["schemas"]["PrivacyPoolTvlPriceView"] & {
                /** @constant */
                status?: "priced";
            };
            valueUsd: string;
        } | {
            price: components["schemas"]["PrivacyPoolTvlPriceView"] & {
                /** @constant */
                status?: "unavailable";
            };
            valueUsd: null;
        }) & ({
            /** @constant */
            status: "complete";
            /** @constant */
            reasonCode: "finalized_public_flow_ledger";
        } | {
            /** @constant */
            status: "degraded";
            /** @enum {unknown} */
            reasonCode: "amount_decode_incomplete" | "negative_protected_amount";
        }));
        /**
         * @deprecated
         * @description Legacy compatibility aggregate valuation. Consumers must price raw address-keyed token amounts independently.
         */
        PrivacyPoolTvlValuationView: {
            /** @enum {string} */
            status: "complete" | "unavailable";
            /** @enum {string} */
            reasonCode: "all_assets_fresh_exact_cached_price" | "one_or_more_assets_unpriced" | "no_finalized_flow_snapshot" | "coverage_incomplete";
            /** @constant */
            quoteCurrency: "USD";
            totalUsd: string | null;
        } & ({
            /** @constant */
            status: "complete";
            /** @constant */
            reasonCode: "all_assets_fresh_exact_cached_price";
            totalUsd: string;
        } | {
            /** @constant */
            status: "unavailable";
            /** @enum {unknown} */
            reasonCode: "one_or_more_assets_unpriced" | "no_finalized_flow_snapshot" | "coverage_incomplete";
            totalUsd: null;
        });
        PrivacyPoolTvlView: {
            /** @constant */
            schemaVersion: "1";
            chainId: string;
            /** @constant */
            scope: "strk20_privacy_pool";
            /** @constant */
            accountingMethod: "finalized_public_flow_ledger_v1";
            /** @enum {string} */
            status: "complete" | "degraded" | "unavailable";
            asOf: components["schemas"]["PrivacyPoolTvlAsOfView"];
            coverage: components["schemas"]["PrivacyPoolTvlCoverageView"];
            /**
             * @deprecated
             * @description Legacy compatibility valuation. Not part of the supported Privacy Pool accounting contract.
             */
            valuation: components["schemas"]["PrivacyPoolTvlValuationView"];
            /** @description Canonical-address-sorted nonzero public-flow amounts plus amount-incomplete degraded entries. Known zero-flow tokens are omitted. Consumers must use coverage and status fields and must not infer a custody balance from an empty array. */
            assets: components["schemas"]["PrivacyPoolTvlAssetView"][];
            caveat: string;
        };
        PrivacyPoolTvlHourlyAsOfView: {
            /** Format: int64 */
            blockNumber: number;
            blockHash: string;
            /** Format: date-time */
            blockTimestamp: string;
            latestEventCursor: string | null;
            /** Format: date-time */
            materializedAt: string;
        };
        PrivacyPoolTvlHourlyAssetView: {
            token: components["schemas"]["PrivacyPoolTokenView"];
            /** @enum {string} */
            status: "complete" | "degraded";
            /** @enum {string} */
            reasonCode: "finalized_public_flow_ledger" | "amount_decode_incomplete" | "negative_protected_amount";
            /** Format: int64 */
            poolContractCount: number;
            /** Format: int64 */
            depositEventCount: number;
            /** Format: int64 */
            withdrawalEventCount: number;
            depositAmountRaw: string;
            withdrawalAmountRaw: string;
            protectedAmountRaw: string;
            protectedAmount: string | null;
            /** Format: int64 */
            missingAmountEventCount: number;
            /** @description Historical USD pricing is consumer-owned for this contract. */
            valueUsd: null;
        } & ({
            /** @constant */
            status?: "complete";
            /** @constant */
            reasonCode?: "finalized_public_flow_ledger";
        } | {
            /** @constant */
            status?: "degraded";
            /** @enum {unknown} */
            reasonCode?: "amount_decode_incomplete" | "negative_protected_amount";
        });
        PrivacyPoolTvlHourlyPointView: {
            /**
             * Format: date-time
             * @description Start of this inclusive UTC-hour bucket.
             */
            timestamp: string;
            /** @enum {string} */
            status: "complete" | "degraded";
            /** @enum {string} */
            reasonCode: "finalized_public_flow_ledger" | "incomplete_finalized_flow_ledger";
            /** @constant */
            accountingMethod: "finalized_public_flow_ledger_v1";
            asOf: components["schemas"]["PrivacyPoolTvlHourlyAsOfView"];
            /** Format: int64 */
            poolContractCount: number;
            /** Format: int64 */
            tokenCount: number;
            /** Format: int64 */
            missingAmountEventCount: number;
            valuation: {
                /** @constant */
                status: "unavailable";
                /** @constant */
                reasonCode: "consumer_price_at_timestamp_required";
                /** @constant */
                quoteCurrency: "USD";
                totalUsd: null;
            };
            /** @description Nonzero protected-value assets plus amount-incomplete assets. Known zero-balance tokens are omitted until reactivated. */
            assets: components["schemas"]["PrivacyPoolTvlHourlyAssetView"][];
        } & ({
            /** @constant */
            status?: "complete";
            /** @constant */
            reasonCode?: "finalized_public_flow_ledger";
        } | {
            /** @constant */
            status?: "degraded";
            /** @constant */
            reasonCode?: "incomplete_finalized_flow_ledger";
        });
        PrivacyPoolTvlHourlyPageView: {
            /** @constant */
            schemaVersion: "1";
            chainId: string;
            /** @constant */
            scope: "strk20_privacy_pool";
            /** @constant */
            granularity: "hour";
            /** @constant */
            order: "ascending";
            /** Format: date-time */
            from: string;
            /** Format: date-time */
            to: string;
            limit: number;
            coverage: components["schemas"]["PrivacyPoolTvlHourlyCoverageView"];
            freshness: components["schemas"]["PrivacyPoolTvlHourlyFreshnessView"];
            items: components["schemas"]["PrivacyPoolTvlHourlyPointView"][];
            nextCursor: string | null;
            caveat: string;
        };
        PrivacyPoolTvlHourlyCoverageView: {
            /** @enum {string} */
            status: "complete" | "degraded";
            /** @enum {string} */
            reasonCode: "prepared_hourly_coverage_complete" | "prepared_hourly_point_missing";
            /** Format: date-time */
            pageFrom: string;
            /** Format: date-time */
            pageTo: string;
            expectedPointCount: number;
            availablePointCount: number;
            missingPointCount: number;
        } & ({
            /** @constant */
            status?: "complete";
            /** @constant */
            reasonCode?: "prepared_hourly_coverage_complete";
            /** @constant */
            missingPointCount?: 0;
        } | {
            /** @constant */
            status?: "degraded";
            /** @constant */
            reasonCode?: "prepared_hourly_point_missing";
        });
        PrivacyPoolTvlHourlyFreshnessView: {
            /** @enum {string} */
            status: "fresh" | "stale" | "unavailable";
            /** @enum {string} */
            reasonCode: "prepared_hourly_tail_current" | "prepared_hourly_tail_behind_finalized" | "prepared_hourly_tail_missing" | "finalized_hour_unavailable";
            /** Format: date-time */
            finalizedThrough: string | null;
            /** Format: date-time */
            materializedThrough: string | null;
            lagHours: number | null;
        } & ({
            /** @constant */
            status?: "fresh";
            /** @constant */
            reasonCode?: "prepared_hourly_tail_current";
            /** Format: date-time */
            finalizedThrough?: string;
            /** Format: date-time */
            materializedThrough?: string;
            /** @constant */
            lagHours?: 0;
        } | {
            /** @constant */
            status?: "stale";
            /** @constant */
            reasonCode?: "prepared_hourly_tail_behind_finalized";
            /** Format: date-time */
            finalizedThrough?: string;
            /** Format: date-time */
            materializedThrough?: string;
            lagHours?: number;
        } | {
            /** @constant */
            status?: "unavailable";
            /** @constant */
            reasonCode?: "prepared_hourly_tail_missing";
            /** Format: date-time */
            finalizedThrough?: string;
            materializedThrough?: null;
            lagHours?: null;
        } | {
            /** @constant */
            status?: "unavailable";
            /** @constant */
            reasonCode?: "finalized_hour_unavailable";
            finalizedThrough?: null;
            lagHours?: null;
        });
        PrivacyPoolCountView: {
            /**
             * @description Breakdown bucket name. Event breakdowns use indexed privacy-pool snake_case event names; visibility breakdowns use `public`, `partial`, or `hidden_by_design`.
             * @example deposit
             * @example protocol_event
             * @example hidden_by_design
             */
            name: string;
            /** Format: int64 */
            count: number;
        };
        PrivacyPoolTokenFlowView: {
            token: components["schemas"]["PrivacyPoolTokenView"];
            /** Format: int64 */
            eventCount: number;
            /** Format: int64 */
            depositEventCount: number;
            /** Format: int64 */
            withdrawalEventCount: number;
            observableDepositAmountRaw: string;
            observableWithdrawalAmountRaw: string;
            observableNetAmountRaw: string;
            /** Format: int64 */
            missingAmountEventCount: number;
        };
        PrivacyPoolUnavailableMetricView: {
            /** @enum {string} */
            metric: "tvlUsd" | "privateSwapVolume" | "exactAnonymitySet" | "privateActivity";
            /** @enum {string} */
            reasonCode: "requires_balance_and_price_snapshots" | "volume_pricing_not_certified" | "commitment_state_materializer_required" | "historical_materialization_not_reconciled" | "source_coverage_stale" | "private_activity_metrics_not_migrated";
            reason: string;
        } & ({
            /** @constant */
            metric?: "tvlUsd";
            /** @constant */
            reasonCode?: "requires_balance_and_price_snapshots";
        } | {
            /** @constant */
            metric?: "privateSwapVolume";
            /** @constant */
            reasonCode?: "volume_pricing_not_certified";
        } | {
            /** @constant */
            metric?: "exactAnonymitySet";
            /** @constant */
            reasonCode?: "commitment_state_materializer_required";
        } | {
            /** @constant */
            metric?: "privateActivity";
            /** @enum {unknown} */
            reasonCode?: "historical_materialization_not_reconciled" | "source_coverage_stale" | "private_activity_metrics_not_migrated";
        });
        PrivacyPoolMetricBucketItem: {
            /** Format: date-time */
            bucketStartIso: string;
            /** @enum {string} */
            bucketGranularity: "day";
            /** Format: int64 */
            newViewingKeyWallets: number;
            /** Format: int64 */
            cumulativeViewingKeyWallets: number;
            /** Format: int64 */
            visibleDeposits: number;
            /** Format: int64 */
            visibleWithdrawals: number;
            /** Format: int64 */
            noteUsedEvents: number;
            /** Format: int64 */
            latestBlockNumber: number | null;
        };
        PrivacyPoolMetricBucketPage: {
            chainId: string;
            /** @enum {string} */
            bucketGranularity: "day";
            items: components["schemas"]["PrivacyPoolMetricBucketItem"][];
        };
        PrivacyPoolWalletMetricSeriesItem: {
            /** Format: date-time */
            bucketStartIso: string;
            /** @enum {string} */
            bucketGranularity: "hour" | "day" | "week";
            /** Format: int64 */
            newViewingKeyWallets: number;
            /** Format: int64 */
            cumulativeViewingKeyWallets: number;
            /** Format: int64 */
            latestBlockNumber: number | null;
        };
        PrivacyPoolShieldedSupplySeriesItem: {
            /** Format: date-time */
            bucketStartIso: string;
            /** @enum {string} */
            bucketGranularity: "hour" | "day" | "week";
            tokenAddress: string;
            depositedRaw: string;
            withdrawnRaw: string;
            shieldedSupplyRaw: string;
            /** Format: int64 */
            latestBlockNumber: number | null;
        };
        PrivacyPoolFeeMetricSeriesItem: {
            /** Format: date-time */
            bucketStartIso: string;
            /** @enum {string} */
            bucketGranularity: "hour" | "day" | "week";
            tokenAddress: string;
            feeAmountRaw: string;
            cumulativeFeeAmountRaw: string;
            /** Format: int64 */
            feeTransferCount: number;
            /** Format: int64 */
            latestBlockNumber: number | null;
        };
        PrivacyPoolMetricSeriesPage: {
            chainId: string;
            /** @enum {string} */
            range: "24h" | "7d" | "30d" | "all";
            /** @enum {string} */
            bucketGranularity: "hour" | "day" | "week";
            token: components["schemas"]["PrivacyPoolTokenView"];
            walletSeries: components["schemas"]["PrivacyPoolWalletMetricSeriesItem"][];
            shieldedSupplySeries: components["schemas"]["PrivacyPoolShieldedSupplySeriesItem"][];
            privacyFeeSeries: components["schemas"]["PrivacyPoolFeeMetricSeriesItem"][];
        };
        ProveRequest: {
            /** @description Starknet block identifier forwarded to the prover unchanged. */
            block_id: unknown;
            /** @description STRK20 transaction payload forwarded to the prover unchanged. */
            transaction: unknown;
        };
        ProveJobView: {
            jobId: string;
            /** @enum {string} */
            status: "queued" | "dispatched" | "succeeded" | "failed" | "unavailable" | "unknown_delivery";
            /** @description Stop polling when true. */
            terminal: boolean;
            /** Format: int32 */
            attemptCount: number;
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            completedAt?: string;
            /** Format: int64 */
            queuePosition?: number;
            /** Format: int64 */
            pollAfterSeconds?: number;
            /** @description Prover result, passed through verbatim and available briefly after successful completion. Carries proof, proof_facts and l2_to_l1_messages, and for screened deposits also additional_data with the screening attestation. Persist the whole object on the first successful poll; a deposit is unusable on chain without additional_data. */
            result?: unknown;
            /** @enum {string} */
            resultUnavailableReason?: "delivered_or_expired";
            /** @description Caller-safe terminal error. unknown_delivery errors are non-retryable. */
            error?: {
                [key: string]: unknown;
            };
        };
        NetworkMetricSeriesItem: {
            /** Format: date-time */
            bucketStartIso: string;
            /**
             * @description Calendar display resolution for this requested window.
             * @enum {string}
             */
            bucketGranularity: "day" | "week" | "month";
            /** Format: int64 */
            blockCount: number;
            /** Format: int64 */
            transactionCount: number;
            /**
             * Format: int64
             * @description Finalized Starknet INVOKE transactions. This is not an ERC-4337 user-operation count.
             */
            invokeTransactionCount: number;
            /** Format: int64 */
            eventCount: number;
            /** Format: int64 */
            l1ToL2MessageCount: number;
            /** Format: int64 */
            l2ToL1MessageCount: number;
            /** Format: int64 */
            activeSenderCount: number;
            averageTransactionsPerBlock: number;
            maxTransactionsPerSecond: number | null;
            /** Format: int64 */
            latestBlockNumber: number | null;
            /**
             * Format: int64
             * @description Positive consecutive finalized-block intervals in this bucket. Null means resource enrichment has not reached the bucket.
             */
            blockIntervalSampleCount: number | null;
            /** @description Approximate floating-point sum of positive finalized-block intervals in seconds for weighted aggregation. This display metric is not an exact decimal contract. */
            blockIntervalSecondsSum: number | null;
            averageBlockIntervalSeconds: number | null;
            maxBlockIntervalSeconds: number | null;
            /** @description Exact canonical receipt actual-fee total in WEI. Kept separate from FRI. Zero means a complete enriched bucket had no WEI fees; null means enrichment or expected finalized-receipt coverage is incomplete. */
            actualFeeWeiTotalRaw: string | null;
            /** @description Exact canonical receipt actual-fee total in FRI. Kept separate from WEI. Zero means a complete enriched bucket had no FRI fees; null means enrichment or expected finalized-receipt coverage is incomplete. */
            actualFeeFriTotalRaw: string | null;
            /** Format: int64 */
            actualFeeKnownUnitCount: number | null;
            /**
             * Format: int64
             * @description Receipts with missing, malformed, or unsupported canonical fee data, plus expected finalized receipt rows not indexed yet.
             */
            actualFeeUnclassifiedCount: number | null;
            /**
             * Format: int64
             * @description Classes declared by finalized DECLARE transactions in this bucket. Null means adoption enrichment has not reached the bucket.
             */
            finalizedClassDeclarationCount: number | null;
            /**
             * Format: int64
             * @description Canonical deployments classified as accounts in this bucket.
             */
            deployedAccountCount: number | null;
            /**
             * Format: int64
             * @description Canonical deployments classified as non-account contracts in this bucket.
             */
            deployedContractCount: number | null;
            /**
             * Format: int64
             * @description Canonical deployments whose account-versus-contract classification is not yet known.
             */
            unclassifiedDeploymentCount: number | null;
        };
        NetworkMetricSeriesPage: {
            chainId: string;
            /** @enum {string} */
            window: "30d" | "90d" | "ytd" | "all";
            /**
             * @description Calendar display resolution for this requested window.
             * @enum {string}
             */
            bucketGranularity: "day" | "week" | "month";
            items: components["schemas"]["NetworkMetricSeriesItem"][];
            /** Format: date-time */
            preparedCoverageStartIso: string | null;
            /** Format: date-time */
            preparedCoverageEndIso: string | null;
            /** Format: int64 */
            latestBlockNumber: number | null;
            /** Format: date-time */
            updatedAtIso: string | null;
            /**
             * @description Serving source. This route reads prepared finalized buckets, not raw chain facts.
             * @enum {string}
             */
            source: "finalized_materialized_buckets";
            /**
             * @description Version of the checked-in metric definition.
             * @enum {string}
             */
            metricDefinitionVersion: "network_metrics_v3";
            /**
             * @description Whether the prepared materialization covers the latest finalized source block.
             * @enum {string}
             */
            coverageStatus: "prepared" | "partial" | "unavailable";
            /**
             * @description Machine-readable explanation of the coverage status. A prepared response requires the global materializer watermark to match the observed finalized source tip.
             * @enum {string}
             */
            coverageReasonCode: "finalized_materialized_buckets" | "materializer_lagging" | "materializer_state_unavailable" | "materialized_ahead_of_source_tip" | "no_prepared_buckets" | "source_tip_unavailable";
            /**
             * Format: int64
             * @description Latest finalized block incorporated by the prepared materializer when known.
             */
            materializedThroughBlockNumber: number | null;
            /**
             * Format: int64
             * @description Latest finalized source block observed by the read store when known.
             */
            sourceLatestFinalizedBlockNumber: number | null;
            /**
             * Format: int64
             * @description Difference between the source finalized tip and materialized watermark. Zero means current.
             */
            replicationLagBlocks: number | null;
            /**
             * @description Independent coverage state for finalized block timing and canonical receipt fees.
             * @enum {string}
             */
            resourceCoverageStatus: "prepared" | "partial" | "unavailable";
            /** @enum {string} */
            resourceCoverageReasonCode: "finalized_resource_buckets" | "no_prepared_resource_buckets" | "resource_metrics_not_materialized" | "resource_metrics_partial_window" | "resource_receipts_incomplete" | "resource_materializer_lagging" | "resource_materializer_state_unavailable" | "resource_materialized_ahead_of_source_tip" | "source_tip_unavailable";
            /** Format: int64 */
            resourceMaterializedThroughBlockNumber: number | null;
            /** Format: int64 */
            resourceReplicationLagBlocks: number | null;
            /**
             * @description Independent coverage state for finalized declarations and canonical deployments.
             * @enum {string}
             */
            adoptionCoverageStatus: "prepared" | "partial" | "unavailable";
            /** @enum {string} */
            adoptionCoverageReasonCode: "finalized_adoption_buckets" | "no_prepared_adoption_buckets" | "adoption_metrics_not_materialized" | "adoption_metrics_partial_window" | "adoption_materializer_lagging" | "adoption_materializer_state_unavailable" | "adoption_materialized_ahead_of_source_tip" | "source_tip_unavailable";
            /** Format: int64 */
            adoptionMaterializedThroughBlockNumber: number | null;
            /** Format: int64 */
            adoptionReplicationLagBlocks: number | null;
        };
        WalletProviderMetricItem: {
            /** @description Stable machine-readable wallet-provider origin family. */
            providerFamily: string;
            /** @description Human-readable wallet-provider label. */
            providerLabel: string;
            /**
             * Format: int64
             * @description Distinct recognized wallet-provider deployment origins. Canonical deployment facts or finalized immutable deployment-class evidence is sufficient even when the derived address-activity summary has not been populated yet.
             */
            knownDeployedAccountCount: number;
            /**
             * Format: int64
             * @description Classified accounts that sent a successful finalized transaction in the trailing 30 days.
             */
            activeAccount30dCount: number;
            /** @description Lower-bound USD value as a decimal string to avoid JavaScript precision loss. */
            pricedFungibleValueUsd: string;
            /** Format: int64 */
            pricedAccountCount: number;
            /** Format: int64 */
            unpricedBalanceAccountCount: number;
            /**
             * Format: int64
             * @description Accounts whose priced finalized fungible balance is strictly greater than 10 USD.
             */
            accountsOver10Usd: number;
            /**
             * Format: int64
             * @description Accounts whose priced finalized fungible balance is strictly greater than 100 USD.
             */
            accountsOver100Usd: number;
            /**
             * Format: int64
             * @description Accounts whose priced finalized fungible balance is strictly greater than 1,000 USD.
             */
            accountsOver1000Usd: number;
            /** @enum {string} */
            classificationSource: "deployment_origin_with_current_class_fallback";
        };
        WalletImplementationMetricItem: {
            /** @description Stable machine-readable current account-code lineage. */
            implementationFamily: string;
            /** @description Human-readable current account-code lineage label. */
            implementationLabel: string;
            /** Format: int64 */
            knownAccountCount: number;
            /** @enum {string} */
            classificationSource: "finalized_current_class";
        };
        WalletProviderMetricPage: {
            chainId: string;
            items: components["schemas"]["WalletProviderMetricItem"][];
            /** @description Current account-code lineage, separate from immutable wallet-provider origin. */
            implementationItems: components["schemas"]["WalletImplementationMetricItem"][];
            /**
             * Format: int64
             * @description Distinct account contracts known through finalized account summaries, account-marked deployment facts, or a recognized wallet-provider deployment origin backed by canonical deployment facts or finalized immutable deployment-class evidence.
             */
            sourceKnownAccountCount: number;
            /** Format: int64 */
            trackedProviderAccountCount: number;
            /** @description Share of indexed account contracts attributed to a tracked original wallet provider. This is not a claim that every account is classified. */
            trackedProviderAccountSharePercent: number;
            /** Format: int64 */
            pricedTokenCount: number;
            /** Format: int64 */
            unpricedTokenCount: number;
            classificationSource: string;
            /** Format: int64 */
            sourceLatestFinalizedBlockNumber: number | null;
            /** Format: int64 */
            materializedThroughBlockNumber: number | null;
            /** Format: int64 */
            replicationLagBlocks: number | null;
            /** @enum {string} */
            coverageStatus: "prepared" | "partial" | "unavailable";
            /** @enum {string} */
            coverageReasonCode: "finalized_materialized_snapshot" | "materializer_stale" | "materializer_state_unavailable" | "materialized_ahead_of_source_tip" | "no_prepared_snapshot" | "source_contract_mismatch" | "source_tip_unavailable";
            /** @enum {string} */
            metricDefinitionVersion: "wallet_provider_metrics_v1" | "wallet_provider_metrics_v2" | "wallet_provider_metrics_v3" | "wallet_provider_metrics_v4";
            /** @enum {string} */
            source: "finalized_materialized_snapshot";
            caveat: string;
            /** Format: date-time */
            updatedAtIso: string | null;
        };
        PrivacyPoolDashboardView: {
            status: components["schemas"]["PrivacyPoolStatusView"];
            analytics: components["schemas"]["PrivacyPoolAnalyticsView"];
            events: components["schemas"]["PrivacyPoolEventPage"];
        };
        PrivacyPoolPrivateActivityMetricView: {
            /** @enum {string} */
            activityKind: "private_swap";
            protocolSlug: string;
            protocolName: string;
            helperAddress: string;
            helperLabel: string;
            /** @enum {string} */
            confidence: "certified" | "candidate" | "unavailable";
            /** @description Versioned public attribution rule. AVNU helper-attributed Privacy Pool activity uses private_swap_v2 (finalized event quartet, AVNU Router calldata marker, and changed token set); it is not AVNU's total swap count or volume. */
            attributionRuleVersion: string;
            /** Format: int64 */
            txCount: number;
            /** Format: int64 */
            noteUsedEventCount: number;
            /** Format: int64 */
            openNoteCreatedEventCount: number;
            /** Format: int64 */
            openNoteDepositedEventCount: number;
            /**
             * Format: int64
             * @description Certified public EncNoteCreated count, or null when the serving snapshot does not carry that evidence. Null must not be interpreted as zero.
             */
            encNoteCreatedEventCount: number | null;
            /** Format: int64 */
            helperWithdrawalEventCount: number;
            /** Format: int64 */
            latestBlockNumber: number | null;
            latestTxHash: string | null;
        };
        PrivacyPoolPrivateActivitySourceProvenanceView: {
            /** Format: int64 */
            generation: number;
            definitionFingerprint: string;
            /** Format: int64 */
            sourceCommitSeq: number;
            sourceRangeDigest: string;
            /** Format: int64 */
            terminalBlockNumber: number;
            terminalBlockHash: string;
        };
        PrivacyPoolPrivateActivityView: {
            source: string;
            /**
             * @description Only `complete` permits clients to treat the returned counters as lifetime totals. `stale` and `unavailable` fail closed and return no lifetime counter.
             * @enum {string}
             */
            coverageStatus: "complete" | "stale" | "unavailable";
            /**
             * @description Stable reason lifetime coverage is not complete. `source_coverage_stale` means a sealed source exists but finalized source facts extend beyond it. `historical_materialization_not_reconciled` means older finalized routes have not been reconciled into the serving aggregate. `private_activity_metrics_not_migrated` means the serving migration is not available.
             * @enum {string|null}
             */
            coverageReasonCode: "historical_materialization_not_reconciled" | "source_coverage_stale" | "private_activity_metrics_not_migrated" | null;
            sourceProvenance: components["schemas"]["PrivacyPoolPrivateActivitySourceProvenanceView"] | null;
            caveat: string;
            /** Format: int64 */
            totalPrivateActionTxCount: number | null;
            /** Format: int64 */
            totalHelperWithdrawalEventCount: number | null;
            /** Format: int64 */
            totalNoteUsedEventCount: number | null;
            /** Format: int64 */
            totalOpenNoteDepositedEventCount: number | null;
            /** Format: int64 */
            metricsLimit: number;
            metricsTruncated: boolean;
            metrics: components["schemas"]["PrivacyPoolPrivateActivityMetricView"][];
        } & ({
            /** @constant */
            coverageStatus: "complete";
            /** @constant */
            coverageReasonCode: unknown;
            sourceProvenance: components["schemas"]["PrivacyPoolPrivateActivitySourceProvenanceView"];
            /** Format: int64 */
            totalPrivateActionTxCount?: number;
            /** Format: int64 */
            totalHelperWithdrawalEventCount?: number;
            /** Format: int64 */
            totalNoteUsedEventCount?: number;
            /** Format: int64 */
            totalOpenNoteDepositedEventCount?: number;
            metrics?: (components["schemas"]["PrivacyPoolPrivateActivityMetricView"] & {
                /** @constant */
                confidence: "certified";
            })[];
        } | {
            /** @constant */
            coverageStatus: "stale";
            /** @constant */
            coverageReasonCode: "source_coverage_stale";
            sourceProvenance: components["schemas"]["PrivacyPoolPrivateActivitySourceProvenanceView"];
            /** @constant */
            totalPrivateActionTxCount?: unknown;
            /** @constant */
            totalHelperWithdrawalEventCount?: unknown;
            /** @constant */
            totalNoteUsedEventCount?: unknown;
            /** @constant */
            totalOpenNoteDepositedEventCount?: unknown;
            metrics?: unknown;
            /** @constant */
            metricsTruncated?: false;
        } | {
            /** @constant */
            coverageStatus: "unavailable";
            /** @constant */
            coverageReasonCode: "historical_materialization_not_reconciled";
            /** @constant */
            sourceProvenance: unknown;
            /** @constant */
            totalPrivateActionTxCount?: unknown;
            /** @constant */
            totalHelperWithdrawalEventCount?: unknown;
            /** @constant */
            totalNoteUsedEventCount?: unknown;
            /** @constant */
            totalOpenNoteDepositedEventCount?: unknown;
            metrics?: unknown;
            /** @constant */
            metricsTruncated?: false;
        } | {
            /** @constant */
            coverageStatus: "unavailable";
            /** @constant */
            coverageReasonCode: "private_activity_metrics_not_migrated";
            /** @constant */
            sourceProvenance: unknown;
            /** @constant */
            totalPrivateActionTxCount?: unknown;
            /** @constant */
            totalHelperWithdrawalEventCount?: unknown;
            /** @constant */
            totalNoteUsedEventCount?: unknown;
            /** @constant */
            totalOpenNoteDepositedEventCount?: unknown;
            metrics?: unknown;
            /** @constant */
            metricsTruncated?: false;
        });
        PrivacyPoolAnalyticsView: {
            chainId: string;
            /** Format: int64 */
            totalEvents: number;
            /** Format: int64 */
            uniqueTransactionCount: number;
            /** Format: int64 */
            contractCount: number;
            /** Format: int64 */
            latestEventBlock: number | null;
            eventBreakdown: components["schemas"]["PrivacyPoolCountView"][];
            visibilityBreakdown: components["schemas"]["PrivacyPoolCountView"][];
            tokenFlows: components["schemas"]["PrivacyPoolTokenFlowView"][];
            /** Format: int64 */
            tokenFlowsLimit: number;
            tokenFlowsTruncated: boolean;
            /**
             * Format: int64
             * @description Source event window used to derive tokenFlows. A value of 0 means the route is using all-history indexed public token-flow facts instead of deriving metrics from a bounded recent event sample.
             */
            tokenFlowSourceEventLimit: number;
            /** @description True when tokenFlows were derived from a clipped source event window. False for all-history fact-backed token-flow metrics. */
            tokenFlowSourceEventsTruncated: boolean;
            /** Format: int64 */
            missingAmountEventCount: number;
            strkbtcObserved: boolean;
            /** Format: int64 */
            unknownTokenCount: number;
            privateActivity: components["schemas"]["PrivacyPoolPrivateActivityView"];
            unavailableMetrics: components["schemas"]["PrivacyPoolUnavailableMetricView"][];
        };
        SearchBlockItem: {
            /** Format: int64 */
            blockNumber: number;
            blockHash: string;
        };
        SearchTransactionItem: {
            txHash: string;
            /** Format: int64 */
            blockNumber: number;
            /** Format: int32 */
            txIndex: number;
        };
        SearchView: {
            blocks: components["schemas"]["SearchBlockItem"][];
            transactions: components["schemas"]["SearchTransactionItem"][];
            addresses: string[];
        };
    };
    responses: {
        /** @description Invalid request shape, path parameter, query parameter, or body. */
        BadRequest: {
            headers: {
                "X-Request-Id": components["headers"]["RequestId"];
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorResponse"];
            };
        };
        /** @description Cookie-authenticated mutations are not allowed on self-serve routes. */
        ForbiddenSelfServeMutation: {
            headers: {
                "X-Request-Id": components["headers"]["RequestId"];
                "WWW-Authenticate": components["headers"]["WwwAuthenticate"];
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorResponse"];
            };
        };
        /** @description Missing or invalid Starkscan credential. */
        UnauthorizedText: {
            headers: {
                "X-Request-Id": components["headers"]["RequestId"];
                "WWW-Authenticate": components["headers"]["WwwAuthenticate"];
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorResponse"];
            };
        };
        /** @description Missing, invalid, or expired self-serve session. */
        UnauthorizedSelfServeSession: {
            headers: {
                "X-Request-Id": components["headers"]["RequestId"];
                "WWW-Authenticate": components["headers"]["WwwAuthenticate"];
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorResponse"];
            };
        };
        /** @description Rate limit hit for the current route class. */
        RateLimited: {
            headers: {
                "X-Request-Id": components["headers"]["RequestId"];
                "Retry-After": components["headers"]["RetryAfter"];
                "X-Starkscan-Route-Class": components["headers"]["StarkscanRouteClass"];
                "x-ratelimit-limit": components["headers"]["RateLimitLimit"];
                "x-ratelimit-remaining": components["headers"]["RateLimitRemaining"];
                "x-ratelimit-policy": components["headers"]["RateLimitPolicy"];
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorResponse"];
            };
        };
        /** @description The request explicitly targets Sepolia indexed history below the published rolling-history floor. Current state and preserved lifecycle facts remain available; advance to `oldestAvailableBlock` or begin a new cursor traversal. */
        HistoryExpired: {
            headers: {
                /** @description Canonical request correlation header for support and tracing. */
                "X-Request-Id"?: string;
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["HistoryExpiredErrorResponse"];
            };
        };
        /** @description The route is temporarily unavailable. */
        ServiceUnavailable: {
            headers: {
                "X-Request-Id": components["headers"]["RequestId"];
                "Retry-After": components["headers"]["RetryAfter"];
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorResponse"];
            };
        };
        /** @description The Privacy Pool route is temporarily unavailable. */
        PrivacyPoolServiceUnavailable: {
            headers: {
                "X-Request-Id": components["headers"]["RequestId"];
                "X-Starkscan-Route-Stability": components["headers"]["PrivacyPoolBetaStability"];
                "Retry-After": components["headers"]["RetryAfter"];
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorResponse"];
            };
        };
        /** @description Indexing is stale or required freshness evidence is unavailable or inconsistent. */
        IndexingFreshnessDegraded: {
            headers: {
                /** @description Canonical request correlation header for support and tracing. */
                "X-Request-Id"?: string;
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["IndexingFreshnessHealthView"];
            };
        };
        /** @description Required L1 quorum evidence is missing, stale, failed, degraded, diverged, or inconsistent. */
        L1FinalityQuorumDegraded: {
            headers: {
                /** @description Canonical request correlation header for support and tracing. */
                "X-Request-Id"?: string;
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["L1FinalityQuorumHealthView"];
            };
        };
        /** @description The materialized L1 finality watermark is missing, stale, or inconsistent. */
        L1FinalityFreshnessDegraded: {
            headers: {
                /** @description Canonical request correlation header for support and tracing. */
                "X-Request-Id"?: string;
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["L1FinalityFreshnessHealthView"];
            };
        };
        /** @description Invalid Privacy Pool path, query parameter, or cursor. */
        PrivacyPoolBadRequest: {
            headers: {
                "X-Request-Id": components["headers"]["RequestId"];
                "X-Starkscan-Route-Stability": components["headers"]["PrivacyPoolBetaStability"];
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorResponse"];
            };
        };
        /** @description Valid Starkscan credential lacks the required scope. */
        ForbiddenText: {
            headers: {
                "X-Request-Id": components["headers"]["RequestId"];
                "WWW-Authenticate": components["headers"]["WwwAuthenticate"];
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorResponse"];
            };
        };
        /** @description The requested route or resource was not found. */
        NotFound: {
            headers: {
                "X-Request-Id": components["headers"]["RequestId"];
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorResponse"];
            };
        };
        /** @description The request conflicts with the current resource state. */
        Conflict: {
            headers: {
                "X-Request-Id": components["headers"]["RequestId"];
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorResponse"];
            };
        };
    };
    parameters: {
        /** @example SN_MAIN */
        ChainParam: string;
        /** @description Optional caller-supplied correlation ID echoed back in the response. */
        RequestIdHeader: string;
    };
    requestBodies: never;
    headers: {
        /** @description Machine-readable lifecycle marker for the beta Privacy Pool public route. */
        PrivacyPoolBetaStability: "beta";
        /** @description Canonical request correlation header for support and tracing. */
        RequestId: string;
        /** @description Authentication or scope hint when the request is rejected. */
        WwwAuthenticate: string;
        /** @description Seconds to wait before retrying this route class. */
        RetryAfter: number;
        /** @description Route budget class for class-specific backoff. */
        StarkscanRouteClass: "light" | "heavy" | "batch";
        /** @description Maximum request budget for the current route-class window. */
        RateLimitLimit: number;
        /** @description Remaining request budget for the current route-class window. */
        RateLimitRemaining: number;
        /** @description Opaque rate-limit policy identifier for the current route class. */
        RateLimitPolicy: string;
    };
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    getStakingSummary: {
        parameters: {
            query?: never;
            header?: {
                /** @description Optional caller-supplied correlation ID echoed back in the response. */
                "X-Request-Id"?: components["parameters"]["RequestIdHeader"];
            };
            path: {
                /** @example SN_MAIN */
                chain: components["parameters"]["ChainParam"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Prepared summary with typed coverage */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["StakingSummaryPage"];
                };
            };
            401: components["responses"]["UnauthorizedText"];
            403: components["responses"]["ForbiddenText"];
            429: components["responses"]["RateLimited"];
        };
    };
    listStakingValidators: {
        parameters: {
            query?: {
                cursor?: string;
                limit?: number;
            };
            header?: {
                /** @description Optional caller-supplied correlation ID echoed back in the response. */
                "X-Request-Id"?: components["parameters"]["RequestIdHeader"];
            };
            path: {
                /** @example SN_MAIN */
                chain: components["parameters"]["ChainParam"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Bounded keyset page */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["StakingValidatorPage"];
                };
            };
            401: components["responses"]["UnauthorizedText"];
            403: components["responses"]["ForbiddenText"];
            429: components["responses"]["RateLimited"];
        };
    };
    getStakingValidator: {
        parameters: {
            query?: never;
            header?: {
                /** @description Optional caller-supplied correlation ID echoed back in the response. */
                "X-Request-Id"?: components["parameters"]["RequestIdHeader"];
            };
            path: {
                /** @example SN_MAIN */
                chain: components["parameters"]["ChainParam"];
                /** @example 0x0123456789abcdef */
                address: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Prepared validator detail */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["StakingValidatorDetail"];
                };
            };
            401: components["responses"]["UnauthorizedText"];
            403: components["responses"]["ForbiddenText"];
            404: components["responses"]["NotFound"];
            429: components["responses"]["RateLimited"];
        };
    };
    listStakingDelegators: {
        parameters: {
            query?: {
                cursor?: string;
                limit?: number;
            };
            header?: {
                /** @description Optional caller-supplied correlation ID echoed back in the response. */
                "X-Request-Id"?: components["parameters"]["RequestIdHeader"];
            };
            path: {
                /** @example SN_MAIN */
                chain: components["parameters"]["ChainParam"];
                /** @example 0x0123456789abcdef */
                address: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Bounded delegator page */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["StakingDelegatorPage"];
                };
            };
            401: components["responses"]["UnauthorizedText"];
            403: components["responses"]["ForbiddenText"];
            429: components["responses"]["RateLimited"];
        };
    };
    listStakingActivity: {
        parameters: {
            query?: {
                validator?: string;
                cursor?: string;
                limit?: number;
            };
            header?: {
                /** @description Optional caller-supplied correlation ID echoed back in the response. */
                "X-Request-Id"?: components["parameters"]["RequestIdHeader"];
            };
            path: {
                /** @example SN_MAIN */
                chain: components["parameters"]["ChainParam"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Bounded activity page */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["StakingActivityPage"];
                };
            };
            401: components["responses"]["UnauthorizedText"];
            403: components["responses"]["ForbiddenText"];
            429: components["responses"]["RateLimited"];
        };
    };
    getAddressStaking: {
        parameters: {
            query?: {
                cursor?: string;
                limit?: number;
            };
            header?: {
                /** @description Optional caller-supplied correlation ID echoed back in the response. */
                "X-Request-Id"?: components["parameters"]["RequestIdHeader"];
            };
            path: {
                /** @example SN_MAIN */
                chain: components["parameters"]["ChainParam"];
                /** @example 0x0123456789abcdef */
                address: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Prepared positions and bounded history */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["StakingAddressView"];
                };
            };
            401: components["responses"]["UnauthorizedText"];
            403: components["responses"]["ForbiddenText"];
            429: components["responses"]["RateLimited"];
        };
    };
    listPrivacyPoolEvents: {
        parameters: {
            query?: {
                /** @description Optional privacy-pool event-name filter. Use the indexed snake_case name, for example `deposit`, `proof_validity_blocks_set`, or `protocol_event`. */
                event?: string;
                /** @description Optional cursor in `block:tx:log` numeric format. */
                cursor?: string;
                /** @description Page size (clamped to 1..100). */
                limit?: number;
            };
            header?: {
                /** @description Optional caller-supplied correlation ID echoed back in the response. */
                "X-Request-Id"?: components["parameters"]["RequestIdHeader"];
            };
            path: {
                /** @example SN_MAIN */
                chain: components["parameters"]["ChainParam"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Privacy-pool event page */
            200: {
                headers: {
                    "X-Starkscan-Route-Stability": components["headers"]["PrivacyPoolBetaStability"];
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PrivacyPoolEventPage"];
                };
            };
            400: components["responses"]["PrivacyPoolBadRequest"];
            401: components["responses"]["UnauthorizedText"];
            403: components["responses"]["ForbiddenText"];
            429: components["responses"]["RateLimited"];
        };
    };
    listPrivacyPoolCommitments: {
        parameters: {
            query?: {
                /** @description Optional 0x-prefixed pool contract address for a single-pool cursor scan. */
                pool?: string;
                /** @description Optional cursor in `block:tx:log` numeric format. */
                cursor?: string;
                /** @description Page size (clamped to 1..100). */
                limit?: number;
            };
            header?: {
                /** @description Optional caller-supplied correlation ID echoed back in the response. */
                "X-Request-Id"?: components["parameters"]["RequestIdHeader"];
            };
            path: {
                /** @example SN_MAIN */
                chain: components["parameters"]["ChainParam"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Privacy-pool commitment fact page */
            200: {
                headers: {
                    "X-Starkscan-Route-Stability": components["headers"]["PrivacyPoolBetaStability"];
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PrivacyPoolCommitmentFactPage"];
                };
            };
            400: components["responses"]["PrivacyPoolBadRequest"];
            401: components["responses"]["UnauthorizedText"];
            403: components["responses"]["ForbiddenText"];
            429: components["responses"]["RateLimited"];
        };
    };
    listPrivacyPoolNullifiers: {
        parameters: {
            query?: {
                /** @description Optional 0x-prefixed pool contract address for a single-pool cursor scan. */
                pool?: string;
                /** @description Optional cursor in `block:tx:log` numeric format. */
                cursor?: string;
                /** @description Page size (clamped to 1..100). */
                limit?: number;
            };
            header?: {
                /** @description Optional caller-supplied correlation ID echoed back in the response. */
                "X-Request-Id"?: components["parameters"]["RequestIdHeader"];
            };
            path: {
                /** @example SN_MAIN */
                chain: components["parameters"]["ChainParam"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Privacy-pool nullifier fact page */
            200: {
                headers: {
                    "X-Starkscan-Route-Stability": components["headers"]["PrivacyPoolBetaStability"];
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PrivacyPoolNullifierFactPage"];
                };
            };
            400: components["responses"]["PrivacyPoolBadRequest"];
            401: components["responses"]["UnauthorizedText"];
            403: components["responses"]["ForbiddenText"];
            429: components["responses"]["RateLimited"];
        };
    };
    getPrivacyPoolStatus: {
        parameters: {
            query?: never;
            header?: {
                /** @description Optional caller-supplied correlation ID echoed back in the response. */
                "X-Request-Id"?: components["parameters"]["RequestIdHeader"];
            };
            path: {
                /** @example SN_MAIN */
                chain: components["parameters"]["ChainParam"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Privacy-pool status */
            200: {
                headers: {
                    "X-Starkscan-Route-Stability": components["headers"]["PrivacyPoolBetaStability"];
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PrivacyPoolStatusView"];
                };
            };
            401: components["responses"]["UnauthorizedText"];
            403: components["responses"]["ForbiddenText"];
            429: components["responses"]["RateLimited"];
        };
    };
    getPrivacyPoolAnalytics: {
        parameters: {
            query?: never;
            header?: {
                /** @description Optional caller-supplied correlation ID echoed back in the response. */
                "X-Request-Id"?: components["parameters"]["RequestIdHeader"];
            };
            path: {
                /** @example SN_MAIN */
                chain: components["parameters"]["ChainParam"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Privacy-pool analytics */
            200: {
                headers: {
                    "X-Starkscan-Route-Stability": components["headers"]["PrivacyPoolBetaStability"];
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PrivacyPoolAnalyticsView"];
                };
            };
            401: components["responses"]["UnauthorizedText"];
            403: components["responses"]["ForbiddenText"];
            429: components["responses"]["RateLimited"];
        };
    };
    getPrivacyPoolTvl: {
        parameters: {
            query?: never;
            header?: {
                /** @description Weak or strong entity tag, comma-separated tag list, or `*`. Takes precedence over If-Modified-Since. */
                "If-None-Match"?: string;
                /** @description HTTP date for a best-effort cache-generation-time check. ETag is the authoritative validator. */
                "If-Modified-Since"?: string;
                /** @description Optional caller-supplied correlation ID echoed back in the response. */
                "X-Request-Id"?: components["parameters"]["RequestIdHeader"];
            };
            path: {
                /** @example SN_MAIN */
                chain: components["parameters"]["ChainParam"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Finalized Privacy Pool protected-value snapshot */
            200: {
                headers: {
                    "X-Starkscan-Route-Stability": components["headers"]["PrivacyPoolBetaStability"];
                    /** @description Weak SHA-256 validator over the exact uncompressed JSON response bytes. */
                    ETag?: string;
                    /** @description HTTP date for the in-process cache generation represented by this response. */
                    "Last-Modified"?: string;
                    /** @description Public on the trusted same-origin lane and rewritten to private after successful external API-key authentication. */
                    "Cache-Control"?: string;
                    /** @description Includes the TVL cache outcome (`pp_tvl_cache_hit` or `pp_tvl_cache_miss`) and request-path timing metrics. */
                    "Server-Timing"?: string;
                    /** @description Correlation identifier on authenticated private responses. Shared-cacheable trusted responses omit request-specific identifiers. */
                    "X-Request-Id"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PrivacyPoolTvlView"];
                };
            };
            /** @description A supplied validator matches the current in-process cached representation. The response has no body and authentication and rate limiting still apply. */
            304: {
                headers: {
                    "X-Starkscan-Route-Stability": components["headers"]["PrivacyPoolBetaStability"];
                    /** @description Validator for the current JSON representation. */
                    ETag?: string;
                    /** @description HTTP date for the current in-process cache generation. */
                    "Last-Modified"?: string;
                    /** @description Cache policy for the authenticated request lane. */
                    "Cache-Control"?: string;
                    /** @description Includes the TVL cache outcome and request-path timing metrics for the conditional read. */
                    "Server-Timing"?: string;
                    /** @description Correlation identifier on authenticated private responses. Shared-cacheable trusted responses omit request-specific identifiers. */
                    "X-Request-Id"?: string;
                    [name: string]: unknown;
                };
                content?: never;
            };
            401: components["responses"]["UnauthorizedText"];
            403: components["responses"]["ForbiddenText"];
            429: components["responses"]["RateLimited"];
            503: components["responses"]["PrivacyPoolServiceUnavailable"];
        };
    };
    listPrivacyPoolTvlHourlyPoints: {
        parameters: {
            query: {
                /**
                 * @description Inclusive RFC3339 timestamp aligned to a UTC hour.
                 * @example 2026-08-10T00:00:00Z
                 */
                from: string;
                /**
                 * @description Inclusive RFC3339 timestamp aligned to a UTC hour.
                 * @example 2026-08-10T23:00:00Z
                 */
                to: string;
                /** @example hour */
                granularity: "hour";
                /** @description Opaque `nextCursor` value returned by the preceding page. */
                cursor?: string;
                /** @description Hour points per page; defaults to 24. */
                limit?: number;
            };
            header?: {
                /** @description Weak or strong entity tag, comma-separated tag list, or `*`. Takes precedence over If-Modified-Since. */
                "If-None-Match"?: string;
                /** @description HTTP date compared with the newest materialization timestamp in the page. ETag is authoritative. */
                "If-Modified-Since"?: string;
                /** @description Optional caller-supplied correlation ID echoed back in the response. */
                "X-Request-Id"?: components["parameters"]["RequestIdHeader"];
            };
            path: {
                /** @example SN_MAIN */
                chain: components["parameters"]["ChainParam"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Bounded finalized Privacy Pool hourly history page */
            200: {
                headers: {
                    "X-Starkscan-Route-Stability": components["headers"]["PrivacyPoolBetaStability"];
                    /** @description Weak SHA-256 validator over the exact uncompressed JSON response bytes. */
                    ETag?: string;
                    /** @description Newest materialization timestamp in this page, or the Unix epoch for an empty page. */
                    "Last-Modified"?: string;
                    /** @description Public on the trusted same-origin lane and rewritten to private after successful external API-key authentication. */
                    "Cache-Control"?: string;
                    /** @description Includes request-path timing metrics for the hourly TVL read. */
                    "Server-Timing"?: string;
                    /** @description Correlation identifier on authenticated private responses. Shared-cacheable trusted responses omit request-specific identifiers. */
                    "X-Request-Id"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PrivacyPoolTvlHourlyPageView"];
                };
            };
            /** @description A supplied validator matches the current hourly page representation. The response has no body and authentication and rate limiting still apply. */
            304: {
                headers: {
                    "X-Starkscan-Route-Stability": components["headers"]["PrivacyPoolBetaStability"];
                    /** @description Validator for the current JSON representation. */
                    ETag?: string;
                    /** @description Newest materialization timestamp in the current page, or the Unix epoch for an empty page. */
                    "Last-Modified"?: string;
                    /** @description Cache policy for the authenticated request lane. */
                    "Cache-Control"?: string;
                    /** @description Includes request-path timing metrics for the conditional hourly TVL read. */
                    "Server-Timing"?: string;
                    /** @description Correlation identifier on authenticated private responses. Shared-cacheable trusted responses omit request-specific identifiers. */
                    "X-Request-Id"?: string;
                    [name: string]: unknown;
                };
                content?: never;
            };
            400: components["responses"]["PrivacyPoolBadRequest"];
            401: components["responses"]["UnauthorizedText"];
            403: components["responses"]["ForbiddenText"];
            429: components["responses"]["RateLimited"];
            503: components["responses"]["PrivacyPoolServiceUnavailable"];
        };
    };
    listPrivacyPoolMetricBuckets: {
        parameters: {
            query?: {
                /** @description Number of daily buckets to return, newest-first in storage and chronological in response. */
                limit?: number;
            };
            header?: {
                /** @description Optional caller-supplied correlation ID echoed back in the response. */
                "X-Request-Id"?: components["parameters"]["RequestIdHeader"];
            };
            path: {
                /** @example SN_MAIN */
                chain: components["parameters"]["ChainParam"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Privacy-pool public metric bucket page */
            200: {
                headers: {
                    "X-Starkscan-Route-Stability": components["headers"]["PrivacyPoolBetaStability"];
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PrivacyPoolMetricBucketPage"];
                };
            };
            401: components["responses"]["UnauthorizedText"];
            403: components["responses"]["ForbiddenText"];
            429: components["responses"]["RateLimited"];
        };
    };
    getPrivacyPoolMetricSeries: {
        parameters: {
            query?: {
                /** @description Time range to return from prepared buckets. */
                range?: "24h" | "7d" | "30d" | "all";
                /** @description Prepared bucket granularity. `range=all&granularity=hour` returns the latest 720 prepared hourly buckets to keep this chart route bounded. */
                granularity?: "hour" | "day" | "week";
                /** @description 0x-prefixed token contract address/felt for the shielded-supply series. Omit this parameter to use Starkscan's tracked strkBTC token address. */
                token?: string;
            };
            header?: {
                /** @description Optional caller-supplied correlation ID echoed back in the response. */
                "X-Request-Id"?: components["parameters"]["RequestIdHeader"];
            };
            path: {
                /** @example SN_MAIN */
                chain: components["parameters"]["ChainParam"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Privacy-pool prepared metric series */
            200: {
                headers: {
                    "X-Starkscan-Route-Stability": components["headers"]["PrivacyPoolBetaStability"];
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PrivacyPoolMetricSeriesPage"];
                };
            };
            400: components["responses"]["PrivacyPoolBadRequest"];
            401: components["responses"]["UnauthorizedText"];
            403: components["responses"]["ForbiddenText"];
            429: components["responses"]["RateLimited"];
        };
    };
}
