import { TransportType } from '$/constants/TransportType.ts'
import { sourceProviderDefinitions } from '$/sources/$sourceProviders.ts'
import { Source } from '$/sources/Source.ts'
import {
	SourceEndpointKind,
	SourceTargetKind,
} from '$/sources/SourceBinding.ts'

export const zeroGStorageNodeRpcEndpoints = sourceProviderDefinitions
	.flatMap((provider) => provider.bindings)
	.filter((binding) => (
		binding.source === Source.ZeroGStorageNode_JsonRpc
		&& binding.target.kind === SourceTargetKind.LocalDevice
		&& binding.target.key === 'local-0g-storage-node'
	))
	.flatMap((binding) => binding.endpoints)
	.filter((endpoint) => endpoint.endpointKind === SourceEndpointKind.HttpUrl)
	.map((endpoint) => ({
		url: endpoint.locator,
		transportType: TransportType.Http,
		providerName: 'Local 0G storage node',
		origin: endpoint.origin ?? new URL(endpoint.locator).origin,
		corsEnabled: endpoint.corsEnabled === true,
	}))

export const zeroGOrigins = zeroGStorageNodeRpcEndpoints.map(({ origin, corsEnabled }) => ({
	origin,
	corsEnabled,
}))
