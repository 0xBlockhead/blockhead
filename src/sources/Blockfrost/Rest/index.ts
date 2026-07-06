// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const blockfrostRestSourceDefinition = {
	provider: SourceProvider.Blockfrost,
	source: Source.Blockfrost_Rest,
	label: 'Blockfrost REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default blockfrostRestSourceDefinition
