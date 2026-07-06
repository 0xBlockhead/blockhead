// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const bigDipperRestSourceDefinition = {
	provider: SourceProvider.BigDipper,
	source: Source.BigDipper_Rest,
	label: 'Big Dipper REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default bigDipperRestSourceDefinition
