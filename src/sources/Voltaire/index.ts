import { executionEndpoints } from '$/constants/ExecutionEndpoints.ts'
import { TransportType } from '$/constants/TransportType.ts'
import { type SourceProviderDefinition, SourceProvider } from '$/sources/SourceProvider.ts'
import VoltaireJsonRpcSource from '$/sources/Voltaire/JsonRpc/index.ts'


// Constants

/** Host suffixes that allow browser cross-origin JSON-RPC POST without `/api-proxy`. */
const browserCorsJsonRpcOriginSuffixes = [
	'.drpc.org',
] as const

export default {
	provider: SourceProvider.Voltaire,
	label: 'Voltaire',
	origins: [
		...new Set(
			executionEndpoints
				.filter((entry) => entry.transportType === TransportType.Http)
				.map((entry) => new URL(entry.url).origin)
		),
	]
		.map((origin) => ({
			origin,
			corsEnabled: browserCorsJsonRpcOriginSuffixes.some((suffix) => origin.endsWith(suffix)),
		})),
	sources: [
		VoltaireJsonRpcSource,
	],
} satisfies SourceProviderDefinition
