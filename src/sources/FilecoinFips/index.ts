// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const filecoinFipsGithubSourceDefinition = {
	provider: SourceProvider.FilecoinFips,
	source: Source.FilecoinFips_Github,
	label: 'Filecoin FIPs GitHub',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default filecoinFipsGithubSourceDefinition
