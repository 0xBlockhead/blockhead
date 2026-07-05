import type { SourceDefinition } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'


const BlobscanRestSource = {
	provider: SourceProvider.Blobscan,
	source: Source.Blobscan_Rest,
	label: 'Blobscan Rest',
} satisfies SourceDefinition

export default BlobscanRestSource
