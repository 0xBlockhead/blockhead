import { Source } from '$/sources/$Source.ts'
import { SourceProvider } from '$/sources/$SourceProvider.ts'
import type { SourceDefinition } from '$/sources/$Source.ts'

const CaipNamespacesGithubSource = {
	provider: SourceProvider.Caips,
	source: Source.CaipNamespaces_Github,
	label: 'CAIP namespaces GitHub',
} satisfies SourceDefinition

export default CaipNamespacesGithubSource
