import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceDefinition } from '$/sources/$sources.ts'

const EtherscanRestSource = {
	provider: SourceProvider.Etherscan,
	source: Source.Etherscan_Rest,
	label: 'Etherscan Rest',
} satisfies SourceDefinition

export default EtherscanRestSource
