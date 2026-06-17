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

const Voltaire = {
	provider: SourceProvider.Voltaire,
	label: 'Voltaire',
	origins: [
		...new Set(
			voltaireJsonRpcTransportCandidates
				.filter((entry) => entry.transportType === TransportType.Http)
				.map((entry) => new URL(entry.rpcUrl).origin)
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

export const voltaireJsonRpcUrlWithTransportForChain = (
	chainId: number
) => {
	const executionEndpointList = voltaireJsonRpcTransportCandidatesByChainId[chainId] ?? []
	const httpExecutionEndpoint = executionEndpointList
		.find((endpoint) => endpoint.transportType === TransportType.Http)
	const executionEndpoint = httpExecutionEndpoint ?? executionEndpointList.at(0)
	if (executionEndpoint == null) return undefined
	return {
		...executionEndpoint,
		origins: Voltaire.origins,
	}
}

export const voltaireJsonRpcTransportCandidatesForChain = (
	chainId: number
) => (
	(voltaireJsonRpcTransportCandidatesByChainId[chainId] ?? [])
		.map((jsonRpcTransportCandidate) => ({
			...jsonRpcTransportCandidate,
			origins: Voltaire.origins,
		}))
)

export default Voltaire
