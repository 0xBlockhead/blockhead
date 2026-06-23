import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { cycloneDxBindings } from '$/sources/CycloneDx/bindings.ts'

export default {
	provider: SourceProvider.CycloneDx,
	label: 'CycloneDX',
	sources: [
		{
			provider: SourceProvider.CycloneDx,
			source: Source.CycloneDxDocument_Local,
			label: 'CycloneDX document',
		},
	],
	bindings: cycloneDxBindings,
} satisfies SourceProviderDefinition
