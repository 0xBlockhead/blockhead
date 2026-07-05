// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition } from '$/sources/index.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.Rss2Json,
	source: Source.Rss2Json_Rest,
	label: 'rss2json REST',
} satisfies SourceDefinition
