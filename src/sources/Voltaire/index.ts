import { TransportType } from '$/constants/TransportType.ts'
import { type SourceProviderDefinition, SourceProvider } from '$/sources/SourceProvider.ts'
import VoltaireJsonRpcSource from '$/sources/Voltaire/JsonRpc/index.ts'
import { executionEndpoints } from '$/sources/Voltaire/JsonRpc/executionEndpoints.ts'


// Constants
export const voltaireJsonRpcTransportCandidates = executionEndpoints.map((executionEndpoint) => ({
	chainId: executionEndpoint.chainId,
	rpcUrl: executionEndpoint.url,
	transportType: executionEndpoint.transportType,
}))

export const voltaireJsonRpcTransportCandidatesByChainId = Object.groupBy(
	voltaireJsonRpcTransportCandidates,
	(voltaireJsonRpcTransportCandidate) => voltaireJsonRpcTransportCandidate.chainId
)

/** Host suffixes that allow browser cross-origin JSON-RPC POST without `/api-proxy`. */
const browserCorsJsonRpcOriginSuffixes = [
	'.drpc.org',
] as const

const origins = [
	...new Set(
		voltaireJsonRpcTransportCandidates
			.filter((entry) => entry.transportType === TransportType.Http)
			.map((entry) => new URL(entry.rpcUrl).origin)
	),
]
	.map((origin) => ({
		origin,
		corsEnabled: browserCorsJsonRpcOriginSuffixes.some((suffix) => origin.endsWith(suffix)),
	}))

export const voltaireJsonRpcTransportsWithOriginsByChainId = Object.fromEntries(
	Object.entries(voltaireJsonRpcTransportCandidatesByChainId)
		.map(([chainId, entries]) => [
			Number(chainId),
			(entries ?? []).map((entry) => ({
				...entry,
				origins,
			})),
		])
)

export const voltaireJsonRpcTransportWithOriginsByChainId = Object.fromEntries(
	Object.entries(voltaireJsonRpcTransportsWithOriginsByChainId)
		.flatMap(([chainId, entries]) => {
			const httpExecutionEndpoint = entries.find((entry) => entry.transportType === TransportType.Http)
			const executionEndpoint = httpExecutionEndpoint ?? entries.at(0)
			return executionEndpoint == null ?
				[]
			:
				[[
					Number(chainId),
					executionEndpoint,
				]]
		})
)

const Voltaire = {
	provider: SourceProvider.Voltaire,
	label: 'Voltaire',
	origins,
	sources: [
		VoltaireJsonRpcSource,
	],
} satisfies SourceProviderDefinition

export default Voltaire
