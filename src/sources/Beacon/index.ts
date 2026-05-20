import {
	type SourceProviderDefinition,
	SourceProvider,
} from '$/sources/$SourceProvider.ts'
import BeaconRestSource from '$/sources/Beacon/Rest/index.ts'

export default {
	provider: SourceProvider.Beacon,
	label: 'Beacon',
	origins: [
		{ origin: 'https://ethereum-beacon-api.publicnode.com', corsEnabled: true },
		{ origin: 'https://ethereum-sepolia-beacon-api.publicnode.com', corsEnabled: true },
		{ origin: 'https://ethereum-holesky-beacon-api.publicnode.com', corsEnabled: true },
	],
	sources: [
		BeaconRestSource,
	],
} satisfies SourceProviderDefinition
