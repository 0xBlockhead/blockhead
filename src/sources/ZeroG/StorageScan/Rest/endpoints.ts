import { TransportType } from '$/constants/TransportType.ts'
import { sourceProviderDefinitions } from '$/sources/$sourceProviders.ts'
import { Source } from '$/sources/Source.ts'
import {
	SourceEndpointKind,
	SourceTargetKind,
} from '$/sources/SourceBinding.ts'

export const zeroGMainnetStorageEndpoints = sourceProviderDefinitions
	.flatMap((provider) => provider.bindings)
	.filter((binding) => (
		binding.source === Source.ZeroGStorageScan_Rest
		&& binding.target.kind === SourceTargetKind.Global
		&& binding.target.key === '0g-storage-scan'
	))
	.flatMap((binding) => binding.endpoints)
	.filter((endpoint) => endpoint.endpointKind === SourceEndpointKind.HttpUrl)
	.map((endpoint) => ({
		url: endpoint.locator,
		transportType: TransportType.Http,
		providerName: '0G StorageScan',
		origin: endpoint.origin ?? new URL(endpoint.locator).origin,
		corsEnabled: endpoint.corsEnabled === true,
	}))

export const zeroGOrigins = zeroGMainnetStorageEndpoints.map(({ origin, corsEnabled }) => ({
	origin,
	corsEnabled,
}))
