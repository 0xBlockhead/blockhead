// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const superchainGithubSourceDefinition = {
	provider: SourceProvider.Superchain,
	source: Source.Superchain_Github,
	label: 'Superchain Registry GitHub',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default superchainGithubSourceDefinition
