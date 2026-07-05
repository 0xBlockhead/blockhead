import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.SubstrateSidecar,
	source: Source.SubstrateSidecar_Rest,
	label: 'Substrate API Sidecar REST',
} as const
