import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceDefinition } from '$/sources/index.ts'

const BeaconchaInRestSource = {
	provider: SourceProvider.BeaconchaIn,
	source: Source.BeaconchaIn_Rest,
	label: 'Beaconcha.in Rest',
} satisfies SourceDefinition

export default BeaconchaInRestSource
