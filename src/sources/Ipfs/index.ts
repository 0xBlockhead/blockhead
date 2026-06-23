import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { ipfsBindings } from '$/sources/Ipfs/bindings.ts'

export default {
	provider: SourceProvider.Ipfs,
	label: 'IPFS',
	sources: [
		{
			provider: SourceProvider.Ipfs,
			source: Source.Ipfs_Rest,
			label: 'IPFS Gateway',
		},
	],
	bindings: ipfsBindings,
} satisfies SourceProviderDefinition
