import { TransportType } from '$/constants/TransportType.ts'
import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import {
	SourceEndpointKind,
	SourceTargetKind,
} from '$/sources/SourceBinding.ts'
import { voltaireBindings } from '$/sources/Voltaire/bindings.ts'

export const voltaireJsonRpcTransportCandidates = voltaireBindings.flatMap((binding) => (
	binding.target.kind === SourceTargetKind.Eip155Chain ?
		binding.endpoints.flatMap((endpoint) => (
			endpoint.endpointKind === SourceEndpointKind.HttpUrl
			|| endpoint.endpointKind === SourceEndpointKind.WebSocketUrl ?
				[{
					chainId: Number(binding.target.key),
					rpcUrl: endpoint.locator,
					transportType: (
						endpoint.endpointKind === SourceEndpointKind.WebSocketUrl ?
							TransportType.WebSocket
						:
							TransportType.Http
					),
				}]
			:
				[]
		))
	:
		[]
))

export const voltaireJsonRpcTransportCandidatesByChainId = Object.groupBy(
	voltaireJsonRpcTransportCandidates,
	(voltaireJsonRpcTransportCandidate) => voltaireJsonRpcTransportCandidate.chainId
)

export const voltaireJsonRpcTransportsWithOriginsByChainId = Object.fromEntries(
	Object.entries(voltaireJsonRpcTransportCandidatesByChainId)
			.map(([chainId, entries]) => [
				Number(chainId),
				entries.map((entry) => ({
				...entry,
				origins: voltaireBindings.flatMap((binding) => (
					binding.target.kind === SourceTargetKind.Eip155Chain
					&& binding.target.key === chainId ?
						binding.endpoints.flatMap((endpoint) => (
							endpoint.origin == null ?
								[]
							:
								[{
									origin: endpoint.origin,
									corsEnabled: endpoint.corsEnabled === true,
								}]
						))
					:
						[]
				)),
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

export default {
	provider: SourceProvider.Voltaire,
	label: 'Voltaire',
	sources: [
		{
			provider: SourceProvider.Voltaire,
			source: Source.Voltaire_JsonRpc,
			label: 'Voltaire JSON-RPC',
		},
	],
	bindings: voltaireBindings,
} satisfies SourceProviderDefinition
