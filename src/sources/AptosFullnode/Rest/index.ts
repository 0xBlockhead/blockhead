// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const aptosFullnodeRestSourceDefinition = {
	provider: SourceProvider.AptosFullnode,
	source: Source.AptosFullnode_Rest,
	label: 'Aptos fullnode REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default aptosFullnodeRestSourceDefinition
