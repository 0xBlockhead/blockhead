// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const ensipsGithubSourceDefinition = {
	provider: SourceProvider.Ensips,
	source: Source.Ensips_Github,
	label: 'ENSIPs GitHub',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default ensipsGithubSourceDefinition
