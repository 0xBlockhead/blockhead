// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const ipfsRestSourceDefinition = {
	provider: SourceProvider.Ipfs,
	source: Source.Ipfs_Rest,
	label: 'IPFS gateway',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default ipfsRestSourceDefinition
