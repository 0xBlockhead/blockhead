// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const x402HttpSourceDefinition = {
	provider: SourceProvider.X402,
	source: Source.X402_Http,
	label: 'x402 HTTP',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default x402HttpSourceDefinition
