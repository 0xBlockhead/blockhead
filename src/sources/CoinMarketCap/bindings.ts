import { type as arktype } from 'arktype'

import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import {
	ApiFamily,
	SourceArtifactKind,
	SourceCredentialScope,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'
import { origin } from '$/sources/CoinMarketCap/Rest/constants.ts'

export const coinMarketCapPublicEnv = arktype({
	PUBLIC_COINMARKETCAP_API_KEY: 'string > 0',
})

const coinMarketCapCredentials = [
	{
		scope: SourceCredentialScope.PublicConfig,
		env: coinMarketCapPublicEnv,
		keys: [
			'PUBLIC_COINMARKETCAP_API_KEY',
		],
	},
] as const

export const coinMarketCapBindings = [
	{
		provider: SourceProvider.CoinMarketCap,
		source: Source.CoinMarketCap_Rest,
		target: {
			kind: SourceTargetKind.Global,
			key: 'pro-api',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: origin,
				origin,
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.RestJson,
		operationGroups: [
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.HttpProxy,
		credentials: coinMarketCapCredentials,
		artifacts: [
			{
				kind: SourceArtifactKind.HandwrittenTypes,
				path: 'src/sources/CoinMarketCap/Rest/types.ts',
				generated: false,
			},
		],
	},
] as const satisfies readonly SourceBinding[]
