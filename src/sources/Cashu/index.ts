import { SourceProvider, type SourceProviderDefinition } from '$/sources/$SourceProvider.ts'
import CashuMintRest from '$/sources/Cashu/Mint/Rest/index.ts'

export default {
	provider: SourceProvider.Cashu,
	label: 'Cashu',
	origins: [
		{
			origin: 'https://8333.space:3338',
			corsEnabled: false,
		},
	],
	sources: [
		CashuMintRest,
	],
} as const satisfies SourceProviderDefinition
