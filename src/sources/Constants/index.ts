
import { type SourceProviderDefinition, SourceProvider } from '$/sources/$SourceProvider.ts'
import ConstantsInternalSource from '$/sources/Constants/Internal/index.ts'

export default {
	provider: SourceProvider._Constants,
	label: 'Constants',
	sources: [
		ConstantsInternalSource,
	],
} satisfies SourceProviderDefinition
