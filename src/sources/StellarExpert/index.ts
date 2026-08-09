import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'
import bindings from '$/sources/StellarExpert/bindings.ts'

export default {
	provider: SourceProvider.StellarExpert,
	label: 'StellarExpert',
	sources: {
		[Source.StellarExpert]: {
			label: 'StellarExpert',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
