import {
	type SourceProviderDefinition,
	SourceProvider,
} from '$/sources/SourceProvider.ts'
import { metadataVisionOrigin } from '$/sources/MetadataVision/Rest/constants.ts'
import MetadataVisionRestSource from '$/sources/MetadataVision/Rest/index.ts'

export default {
	provider: SourceProvider.MetadataVision,
	label: 'Metadata Vision',
	origins: [
		{
			origin: new URL(metadataVisionOrigin).origin,
			corsEnabled: false,
		},
	],
	sources: [
		MetadataVisionRestSource,
	],
} satisfies SourceProviderDefinition
