import { Source } from '$/sources/$Source.ts'
import { SourceProvider } from '$/sources/$SourceProvider.ts'
import type { SourceDefinition } from '$/sources/$Source.ts'

const SuperchainGithubSource = {
	provider: SourceProvider.Superchain,
	source: Source.Superchain_Github,
	label: 'Superchain Github',
} satisfies SourceDefinition

export default SuperchainGithubSource
