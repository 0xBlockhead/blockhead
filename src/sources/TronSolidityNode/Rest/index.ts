import { Source } from '$/sources/$Source.ts'
import { SourceProvider } from '$/sources/$SourceProvider.ts'
import type { SourceDefinition } from '$/sources/$Source.ts'

export default {
	provider: SourceProvider.TronSolidityNode,
	source: Source.TronSolidityNode_Rest,
	label: 'TRON SolidityNode REST',
} satisfies SourceDefinition
