import { SourceProvider, type SourceProviderDefinition } from '$/sources/$SourceProvider.ts'
import NearRpcJsonRpc from '$/sources/NearRpc/JsonRpc/index.ts'

export default {
	provider: SourceProvider.NearRpc,
	label: 'NEAR RPC',
	origins: [
		{
			origin: 'https://rpc.mainnet.near.org',
			corsEnabled: true,
		},
	],
	sources: [
		NearRpcJsonRpc,
	],
} as const satisfies SourceProviderDefinition
