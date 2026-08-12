import bindings from '$/sources/FourByteDirectory/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.FourByteDirectory,
	label: '4byte.directory',
	sources: {
		[Source.FourByteDirectory_Rest]: {
			label: '4byte.directory REST',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
