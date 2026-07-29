// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/OsmosisLCD/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.OsmosisLCD,
	label: 'Osmosis LCD',
	sources: [
		{
			source: Source.Osmosis_LCD_Rest,
			label: 'Osmosis LCD REST',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
