import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'
import bindings from '$/sources/Sqd/bindings.ts'

export default {
	provider: SourceProvider.Sqd,
	label: 'SQD',
	sources: {
		[Source.SqdPortal_RawHttp]: {
			label: 'SQD Portal',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
