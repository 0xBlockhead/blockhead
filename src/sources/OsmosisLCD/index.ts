// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/OsmosisLCD/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.OsmosisLCD,
	label: 'Osmosis LCD',
	sources: [
		{
			source: Source.Osmosis_LCD_Rest,
			label: 'Osmosis LCD REST',
		},
	],
	bindings: [bindings[Source.Osmosis_LCD_Rest]],
} satisfies SourceProviderDefinition
