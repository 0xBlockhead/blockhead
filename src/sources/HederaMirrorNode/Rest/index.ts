// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const hederaMirrorNodeRestSourceDefinition = {
	provider: SourceProvider.HederaMirrorNode,
	source: Source.HederaMirrorNode_Rest,
	label: 'Hedera mirror node REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default hederaMirrorNodeRestSourceDefinition
