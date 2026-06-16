import {
	type SourceProviderDefinition,
	SourceProvider,
} from '$/sources/SourceProvider.ts'
import { mevRelayHosts } from '$/constants/MevRelayHosts.ts'
import MevRelayRestSource from '$/sources/MevRelay/Rest/index.ts'

export default {
	provider: SourceProvider.MevRelay,
	label: 'MEV-Boost relay',
	origins: [...new Set(mevRelayHosts.map((row) => `https://${row.host}`))]
		.map((origin) => ({
			origin,
			corsEnabled: false,
		})),
	sources: [
		MevRelayRestSource,
	],
} satisfies SourceProviderDefinition
