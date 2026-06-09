import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceDefinition } from '$/sources/index.ts'

const EnsipsGithubSource = {
	provider: SourceProvider.Ensips,
	source: Source.Ensips_Github,
	label: 'Ensips Github',
} satisfies SourceDefinition

export default EnsipsGithubSource
