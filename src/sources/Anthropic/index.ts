// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition } from '$/sources/index.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.Anthropic,
	source: Source.Anthropic_Rest,
	label: 'Anthropic REST',
} satisfies SourceDefinition
