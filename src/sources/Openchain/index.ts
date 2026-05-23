
import {
	type SourceProviderDefinition,
	SourceProvider,
} from '$/sources/$SourceProvider.ts'
import {
	directoryOrigin,
	signatureOrigin,
} from '$/sources/Openchain/Rest/constants.ts'
import OpenchainRestSource from '$/sources/Openchain/Rest/index.ts'

export default {
	provider: SourceProvider.Openchain,
	label: 'Openchain',
	origins: [
		{
			origin: signatureOrigin,
			corsEnabled: false,
		},
		{
			origin: directoryOrigin,
			corsEnabled: false,
		},
	],
	sources: [
		OpenchainRestSource,
	],
} satisfies SourceProviderDefinition
