import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { osmosisLCDBindings } from '$/sources/OsmosisLCD/bindings.ts'

export default {
	provider: SourceProvider.OsmosisLCD,
	label: 'Osmosis LCD',
	sources: [
		{
			provider: SourceProvider.OsmosisLCD,
			source: Source.Osmosis_LCD_Rest,
			label: 'Osmosis LCD REST',
		},
	],
	bindings: osmosisLCDBindings,
} satisfies SourceProviderDefinition
