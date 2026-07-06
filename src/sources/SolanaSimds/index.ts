// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const solanaSimdsGithubSourceDefinition = {
	provider: SourceProvider.SolanaSimds,
	source: Source.SolanaSimds_Github,
	label: 'Solana SIMDs GitHub',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default solanaSimdsGithubSourceDefinition
