import {
	type SourceProviderDefinition,
	SourceProvider,
} from '$/sources/SourceProvider.ts'
import { blobscanRestOrigins } from '$/sources/Blobscan/Rest/constants.ts'
import BlobscanRestSource from '$/sources/Blobscan/Rest/index.ts'


export default {
	provider: SourceProvider.Blobscan,
	label: 'Blobscan',
	origins: blobscanRestOrigins,
	sources: [
		BlobscanRestSource,
	],
} satisfies SourceProviderDefinition
