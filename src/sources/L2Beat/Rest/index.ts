// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition } from '$/sources/index.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.L2Beat,
	source: Source.L2Beat_Rest,
	label: 'L2Beat REST',
} satisfies SourceDefinition
