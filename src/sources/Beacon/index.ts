import {
	type SourceProviderDefinition,
	SourceProvider,
} from '$/sources/$SourceProvider.ts'
import BeaconRestSource from '$/sources/Beacon/Rest/index.ts'

export default {
	provider: SourceProvider.Beacon,
	label: 'Beacon',
	origins: [
		{ origin: 'https://ethereum-beacon-api.publicnode.com', corsEnabled: false },
		{ origin: 'https://ethereum-sepolia-beacon-api.publicnode.com', corsEnabled: false },
		{ origin: 'https://ethereum-holesky-beacon-api.publicnode.com', corsEnabled: false },
	],
	sources: [
		BeaconRestSource,
	],
} satisfies SourceProviderDefinition
