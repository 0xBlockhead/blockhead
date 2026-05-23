import {
	type SourceProviderDefinition,
	SourceProvider,
} from '$/sources/$SourceProvider.ts'
import {
	githubApiOrigin,
	origin,
} from '$/sources/EthereumLists/Rest/constants.ts'
import EthereumListsRestSource from '$/sources/EthereumLists/Rest/index.ts'

export default {
	provider: SourceProvider.EthereumLists,
	label: 'ethereum-lists (chainid.network)',
	origins: [
		{
			origin,
			corsEnabled: false,
		},
		{
			origin: githubApiOrigin,
			corsEnabled: false,
		},
	],
	sources: [
		EthereumListsRestSource,
	],
} satisfies SourceProviderDefinition
