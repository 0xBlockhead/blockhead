import bindings from '$/sources/Osmosis/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Osmosis,
	label: 'Osmosis',
	sources: {
		[Source.Osmosis_LCD_Rest]: {
			label: 'Osmosis LCD REST',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
