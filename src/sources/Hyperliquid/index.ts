import { SourceProvider, type SourceProviderDefinition } from '$/sources/$SourceProvider.ts'
import HyperliquidJsonRpc from '$/sources/Hyperliquid/JsonRpc/index.ts'
import HyperliquidRest from '$/sources/Hyperliquid/Rest/index.ts'

export default {
	provider: SourceProvider.Hyperliquid,
	label: 'Hyperliquid',
	origins: [
		{
			origin: 'https://api.hyperliquid.xyz',
			corsEnabled: true,
		},
		{
			origin: 'https://rpc.hyperliquid.xyz',
			corsEnabled: true,
		},
	],
	sources: [
		HyperliquidRest,
		HyperliquidJsonRpc,
	],
} as const satisfies SourceProviderDefinition
