import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceDefinition } from '$/sources/index.ts'

const CaipsGithubSource = {
	provider: SourceProvider.Caips,
	source: Source.Caips_Github,
	label: 'Caips Github',
} satisfies SourceDefinition

export default CaipsGithubSource
