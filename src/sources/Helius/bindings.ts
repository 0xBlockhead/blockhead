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

const heliusOrigin = 'https://api-mainnet.helius-rpc.com' as const

export const heliusPublicEnv = arktype({
	PUBLIC_HELIUS_API_KEY: 'string',
})

export const heliusBindings = [
	{
		provider: SourceProvider.Helius,
		source: Source.Helius_Rest,
		target: {
			kind: SourceTargetKind.Caip2Network,
			key: 'solana:mainnet',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: heliusOrigin,
				origin: heliusOrigin,
				corsEnabled: true,
			},
		],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.RestJson,
		operationGroups: [
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.BrowserDirect,
		credentials: [
			{
				scope: SourceCredentialScope.PublicConfig,
				env: heliusPublicEnv,
				keys: [
					'PUBLIC_HELIUS_API_KEY',
				],
			},
		],
		artifacts: [
			{
				kind: SourceArtifactKind.HandwrittenTypes,
				path: 'src/sources/Helius/Rest/types.ts',
				generated: false,
			},
		],
	},
] as const satisfies readonly SourceBinding[]
