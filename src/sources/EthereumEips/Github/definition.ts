import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceDefinition } from '$/sources/$sources.ts'

const EthereumEipsGithubSource = {
	provider: SourceProvider.EthereumEips,
	source: Source.EthereumEips_Github,
	label: 'Ethereum Eips Github',
} satisfies SourceDefinition

export default EthereumEipsGithubSource
