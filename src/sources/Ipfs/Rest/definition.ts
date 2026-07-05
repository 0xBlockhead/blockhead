import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceDefinition } from '$/sources/$sources.ts'

const IpfsRestSource = {
	provider: SourceProvider.Ipfs,
	source: Source.Ipfs_Rest,
	label: 'Ipfs Rest',
} satisfies SourceDefinition

export default IpfsRestSource
