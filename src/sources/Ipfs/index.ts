// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Ipfs/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.Ipfs,
	label: 'IPFS',
	sources: [
		{
			source: Source.Ipfs_Rest,
			label: 'IPFS Gateway',
		},
	],
	bindings: [bindings[Source.Ipfs_Rest]],
} satisfies SourceProviderDefinition
