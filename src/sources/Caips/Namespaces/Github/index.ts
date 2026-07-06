// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const caipNamespacesGithubSourceDefinition = {
	provider: SourceProvider.Caips,
	source: Source.CaipNamespaces_Github,
	label: 'CAIP namespaces GitHub',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default caipNamespacesGithubSourceDefinition
