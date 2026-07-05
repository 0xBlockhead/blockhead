// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition } from '$/sources/index.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.Blockchair,
	source: Source.Blockchair_Rest,
	label: 'Blockchair REST',
} satisfies SourceDefinition
