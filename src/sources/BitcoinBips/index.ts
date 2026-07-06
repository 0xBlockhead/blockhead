// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const bitcoinBipsGithubSourceDefinition = {
	provider: SourceProvider.BitcoinBips,
	source: Source.BitcoinBips_Github,
	label: 'Bitcoin BIPs GitHub',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default bitcoinBipsGithubSourceDefinition
