import { TransportType } from '$/constants/TransportType.ts'
import { sourceProviderDefinitions } from '$/sources/$sourceProviders.ts'
import { Source } from '$/sources/Source.ts'
import {
	SourceEndpointKind,
	SourceTargetKind,
} from '$/sources/SourceBinding.ts'

export const zeroGMainnetExplorerEndpoints = sourceProviderDefinitions
	.flatMap((provider) => provider.bindings)
	.filter((binding) => (
		binding.source === Source.ZeroGChainScan_Rest
		&& binding.target.kind === SourceTargetKind.Eip155Chain
		&& binding.target.key === '16661'
	))
	.flatMap((binding) => binding.endpoints)
	.filter((endpoint) => endpoint.endpointKind === SourceEndpointKind.HttpUrl)
	.map((endpoint) => ({
		url: endpoint.locator,
		transportType: TransportType.Http,
		providerName: '0G ChainScan',
		origin: endpoint.origin ?? new URL(endpoint.locator).origin,
		corsEnabled: endpoint.corsEnabled === true,
	}))

export const zeroGOrigins = zeroGMainnetExplorerEndpoints.map(({ origin, corsEnabled }) => ({
	origin,
	corsEnabled,
}))
