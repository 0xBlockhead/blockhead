import {
	type SourceProviderDefinition,
	SourceProvider,
} from '$/sources/$SourceProvider.ts'
import { mevRelayHttpsOrigins } from '$/constants/MevRelayHosts.ts'
import MevRelayRestSource from '$/sources/MevRelay/Rest/index.ts'

export default {
	provider: SourceProvider.MevRelay,
	label: 'MEV-Boost relay',
	origins: mevRelayHttpsOrigins,
	sources: [
		MevRelayRestSource,
	],
} satisfies SourceProviderDefinition
