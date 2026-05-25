import { Source } from '$/sources/$Source.ts'
import { SourceProvider } from '$/sources/$SourceProvider.ts'
import type { SourceDefinition } from '$/sources/$Source.ts'

const Eip8004ScanRestSource = {
	provider: SourceProvider.Eip8004Scan,
	source: Source.Eip8004Scan_Rest,
	label: '8004scan REST',
} satisfies SourceDefinition

export default Eip8004ScanRestSource
