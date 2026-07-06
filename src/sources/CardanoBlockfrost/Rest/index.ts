// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const cardanoBlockfrostRestSourceDefinition = {
	provider: SourceProvider.CardanoBlockfrost,
	source: Source.CardanoBlockfrost_Rest,
	label: 'Cardano Blockfrost REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default cardanoBlockfrostRestSourceDefinition
