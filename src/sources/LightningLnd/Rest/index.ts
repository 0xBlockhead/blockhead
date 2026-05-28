import { Source } from '$/sources/$Source.ts'
import { SourceProvider } from '$/sources/$SourceProvider.ts'
import type { SourceDefinition } from '$/sources/$Source.ts'

export default {
	provider: SourceProvider.LightningLnd,
	source: Source.LightningLnd_Rest,
	label: 'LND REST',
} satisfies SourceDefinition
