import { type as arktype } from 'arktype'

import {
	type SourceProviderDefinition,
	SourceProvider,
} from '$/sources/$SourceProvider.ts'
import { origin } from '$/sources/Etherscan/Rest/constants.ts'
import EtherscanRestSource from '$/sources/Etherscan/Rest/index.ts'

export default {
	provider: SourceProvider.Etherscan,
	label: 'Etherscan',
	env: arktype({
		PUBLIC_ETHERSCAN_API_KEY: 'string > 0?',
	}),
	origins: [
		{
			origin,
			corsEnabled: false,
		},
	],
	sources: [
		EtherscanRestSource,
	],
} satisfies SourceProviderDefinition
