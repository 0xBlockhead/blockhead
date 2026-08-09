import bindings from '$/sources/Beacon/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Beacon,
	label: 'Beacon',
	sources: {
		[Source.Beacon_Rest]: {
			label: 'Beacon (consensus) REST',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
