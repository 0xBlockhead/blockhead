// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const ethereumEipsGithubSourceDefinition = {
	provider: SourceProvider.EthereumEips,
	source: Source.EthereumEips_Github,
	label: 'Ethereum EIPs GitHub',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default ethereumEipsGithubSourceDefinition
