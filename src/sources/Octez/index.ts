import bindings from '$/sources/Octez/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Octez,
	label: 'Octez',
	sources: {
		[Source.OctezNode]: {
			label: 'Octez Mainnet node',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
