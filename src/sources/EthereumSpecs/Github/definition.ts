import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceDefinition } from '$/sources/$sources.ts'

const EthereumSpecsGithubSource = {
	provider: SourceProvider.EthereumSpecs,
	source: Source.EthereumSpecs_Github,
	label: 'Ethereum specs (GitHub)',
} satisfies SourceDefinition

export default EthereumSpecsGithubSource
