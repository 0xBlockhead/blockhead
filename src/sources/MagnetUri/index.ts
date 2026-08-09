import bindings from '$/sources/MagnetUri/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.MagnetUri,
	label: 'Magnet URI',
	sources: {
		[Source.MagnetUri_Uri]: {
			label: 'Magnet URI parser',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
