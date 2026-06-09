// Types
import type { SourceOrigin } from '$/sources/SourceProvider.ts'

import { executionEndpoints } from '$/constants/ExecutionEndpoints.ts'
import { TransportType } from '$/constants/TransportType.ts'


// Constants

/** Host suffixes that allow browser cross-origin JSON-RPC POST without `/api-proxy`. */
const browserCorsJsonRpcOriginSuffixes = [
	'.publicnode.com',
	'.drpc.org',
] as const

const httpExecutionOrigins = [
	...new Set(
		executionEndpoints
			.filter((entry) => entry.transportType === TransportType.Http)
			.map((entry) => new URL(entry.url).origin),
	),
]


// Lookups

/** Catalog execution HTTP RPC hosts for `jsonRpc` routing and Voltaire `/api-proxy` allow-list. */
export const executionHttpRpcOrigins = (
	httpExecutionOrigins
		.map((origin) => (
			{
				origin,
				corsEnabled: browserCorsJsonRpcOriginSuffixes.some((suffix) => (
					origin.endsWith(suffix)
				)),
			}
		))
	) satisfies readonly SourceOrigin[]
