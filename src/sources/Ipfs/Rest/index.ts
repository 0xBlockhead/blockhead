// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition } from '$/sources/index.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.Ipfs,
	source: Source.Ipfs_Rest,
	label: 'IPFS gateway',
} satisfies SourceDefinition
