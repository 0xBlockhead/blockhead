// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, indexSourceBindings, SourceArtifactKind, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBinding } from '$/sources/SourceBinding.ts'
import { type as arktype } from 'arktype'

const bindings = [
	{
		source: Source.CoinMarketCap_Rest,
		target: {
			kind: SourceTargetKind.Global,
			key: 'pro-api',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://pro-api.coinmarketcap.com',
				origin: 'https://pro-api.coinmarketcap.com',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.RestJson,
		operationGroups: [
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.HttpProxy,
		credentials: [
			{
				scope: SourceCredentialScope.PublicConfig,
				env: arktype({
					'PUBLIC_COINMARKETCAP_API_KEY': 'string > 0',
				}),
				keys: [
					'PUBLIC_COINMARKETCAP_API_KEY',
				],
			},
		],
		artifacts: [
			{
				kind: SourceArtifactKind.HandwrittenTypes,
				path: 'src/sources/CoinMarketCap/Rest/types.ts',
				generated: false,
			},
		],
	},
] as const satisfies readonly SourceBinding[]

export default indexSourceBindings<{ readonly [Source.CoinMarketCap_Rest]: typeof bindings[0] }>(bindings)
