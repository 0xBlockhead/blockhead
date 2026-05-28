import { SourceProvider, type SourceProviderDefinition } from '$/sources/$SourceProvider.ts'
import DogecoinCoreJsonRpc from '$/sources/DogecoinCore/JsonRpc/index.ts'

export default {
	provider: SourceProvider.DogecoinCore,
	label: 'Dogecoin Core',
	origins: [
		{
			origin: 'http://127.0.0.1:22555',
			corsEnabled: false,
		},
	],
	sources: [
		DogecoinCoreJsonRpc,
	],
} as const satisfies SourceProviderDefinition
