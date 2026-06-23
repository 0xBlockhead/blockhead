import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { ociRegistryBindings } from '$/sources/OciRegistry/bindings.ts'

export default {
	provider: SourceProvider.OciRegistry,
	label: 'OCI Registry',
	sources: [
		{
			provider: SourceProvider.OciRegistry,
			source: Source.OciRegistry_Distribution,
			label: 'OCI distribution registry',
		},
	],
	bindings: ociRegistryBindings,
} satisfies SourceProviderDefinition
