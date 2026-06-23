import { TransportType } from '$/constants/TransportType.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import {
	ApiFamily,
	SourceArtifactKind,
	SourceCredentialScope,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
	type SourceEndpoint,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'
import {
	executionEndpoints,
} from '$/sources/Voltaire/JsonRpc/executionEndpoints.ts'

const browserCorsJsonRpcOriginSuffixes = [
	'.drpc.org',
] as const

const evmExecutionJsonRpcArtifacts = [
	{
		kind: SourceArtifactKind.OpenRpcSpec,
		path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
		generated: false,
	},
	{
		kind: SourceArtifactKind.GenerationManifest,
		path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
		generated: false,
	},
] as const

const executionEndpointByChainId = Object.groupBy(
	executionEndpoints,
	(endpoint) => endpoint.chainId
)

export const voltaireBindings: readonly SourceBinding[] = Object.entries(executionEndpointByChainId)
	.flatMap(([chainId, endpoints]): SourceBinding[] => {
		const httpEndpoints = endpoints
			.filter((endpoint) => endpoint.transportType === TransportType.Http)
			.map((endpoint): SourceEndpoint => {
				const origin = new URL(endpoint.url).origin
				return {
					endpointKind: SourceEndpointKind.HttpUrl,
					locator: endpoint.url,
					origin,
					corsEnabled: browserCorsJsonRpcOriginSuffixes.some((suffix) => origin.endsWith(suffix)),
				}
			})
		const webSocketEndpoints = endpoints
			.filter((endpoint) => endpoint.transportType === TransportType.WebSocket)
			.map((endpoint): SourceEndpoint => ({
				endpointKind: SourceEndpointKind.WebSocketUrl,
				locator: endpoint.url,
			}))

		return [
			...(httpEndpoints.length === 0 ? [] : [{
				provider: SourceProvider.Voltaire,
				source: Source.Voltaire_JsonRpc,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: String(chainId),
				},
				endpoints: httpEndpoints,
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.EvmExecutionJsonRpc,
				operationGroups: [
					SourceOperationGroup.EvmRpcCore,
					SourceOperationGroup.EvmRpcTrace,
					SourceOperationGroup.EvmRpcTxpool,
				],
				delivery: (
					httpEndpoints.every((endpoint) => endpoint.corsEnabled) ?
						SourceDelivery.BrowserDirect
					:
						SourceDelivery.HttpProxy
				),
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				artifacts: evmExecutionJsonRpcArtifacts,
			}]),
			...(webSocketEndpoints.length === 0 ? [] : [{
				provider: SourceProvider.Voltaire,
				source: Source.Voltaire_JsonRpc,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key: String(chainId),
				},
				endpoints: webSocketEndpoints,
				wireProtocol: WireProtocol.JsonRpc2,
				apiFamily: ApiFamily.EvmExecutionJsonRpc,
				operationGroups: [
					SourceOperationGroup.EvmRpcSubscribe,
				],
				delivery: SourceDelivery.RemoteLive,
				credentials: [
					{
						scope: SourceCredentialScope.None,
					},
				],
				artifacts: evmExecutionJsonRpcArtifacts,
			}]),
		]
	})
