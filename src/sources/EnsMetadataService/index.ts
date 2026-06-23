import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { ensMetadataServiceBindings } from '$/sources/EnsMetadataService/bindings.ts'

export default {
	provider: SourceProvider.EnsMetadataService,
	label: 'ENS metadata service',
	sources: [
		{
			provider: SourceProvider.EnsMetadataService,
			source: Source.EnsMetadataService_Rest,
			label: 'ENS metadata service REST',
		},
	],
	bindings: ensMetadataServiceBindings,
} satisfies SourceProviderDefinition
