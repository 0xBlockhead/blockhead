import { Source } from '$/sources/$Source.ts'
import { SourceProvider } from '$/sources/$SourceProvider.ts'
import type { SourceDefinition } from '$/sources/$Source.ts'

const GithubRestSource = {
	provider: SourceProvider.Github,
	source: Source.Github_Rest,
	label: 'Github Rest',
} satisfies SourceDefinition

export default GithubRestSource
