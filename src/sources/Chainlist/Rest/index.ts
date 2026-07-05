// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition } from '$/sources/index.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.Chainlist,
	source: Source.Chainlist_Rest,
	label: 'Chainlist REST',
} satisfies SourceDefinition
