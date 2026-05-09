import {
	type SourceProviderDefinition,
	SourceProvider,
} from '$/sources/$SourceProvider.ts'
import { gatewayUrls } from '$/sources/Swarm/Rest/constants.ts'
import SwarmRestSource from '$/sources/Swarm/Rest/index.ts'

export default {
	provider: SourceProvider.Swarm,
	label: 'Swarm',
	origins: gatewayUrls.map((origin) => ({
		origin,
		corsEnabled: false,
	})),
	sources: [
		SwarmRestSource,
	],
} satisfies SourceProviderDefinition
