import bindings from '$/sources/LightningLnd/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.LightningLnd,
	label: 'LND',
	sources: {
		[Source.LightningLnd_Rest]: {
			label: 'LND REST',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
