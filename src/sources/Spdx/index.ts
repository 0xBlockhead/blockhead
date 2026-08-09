import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'
import bindings from '$/sources/Spdx/bindings.ts'

export default {
	provider: SourceProvider.Spdx,
	label: 'SPDX',
	sources: {
		[Source.SpdxDocument_Local]: {
			label: 'SPDX document',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
