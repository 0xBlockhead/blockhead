// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const osmosisLCDRestSourceDefinition = {
	provider: SourceProvider.OsmosisLCD,
	source: Source.Osmosis_LCD_Rest,
	label: 'Osmosis LCD REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default osmosisLCDRestSourceDefinition
