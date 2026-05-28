import { Source } from '$/sources/$Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/$SourceProvider.ts'

export default {
	provider: SourceProvider.BitcoinCashChips,
	label: 'Bitcoin Cash CHIPs',
	origins: [
		{
			origin: 'https://gitlab.com',
			corsEnabled: false,
		},
	],
	sources: [
		{
			provider: SourceProvider.BitcoinCashChips,
			source: Source.BitcoinCashChips_Gitlab,
			label: 'Bitcoin Cash CHIPs GitLab',
		},
	],
} as const satisfies SourceProviderDefinition
