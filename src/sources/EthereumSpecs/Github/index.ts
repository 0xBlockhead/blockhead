// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const ethereumSpecsGithubSourceDefinition = {
	provider: SourceProvider.EthereumSpecs,
	source: Source.EthereumSpecs_Github,
	label: 'Ethereum specs GitHub',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default ethereumSpecsGithubSourceDefinition
