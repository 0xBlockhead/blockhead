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
	type SourceEndpoint,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'

const lightningLndEndpointOrigins = [
	'https://127.0.0.1:8080',
	'http://127.0.0.1:8080',
	'https://localhost:8080',
	'http://localhost:8080',
] as const

export const lightningLndPublicEnv = arktype({
	PUBLIC_LND_MACAROON_HEX: 'string',
})

export const lightningLndBindings = [
	{
		provider: SourceProvider.LightningLnd,
		source: Source.LightningLnd_Grpc,
		target: {
			kind: SourceTargetKind.LocalDevice,
			key: 'configured-lnd-node',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.TcpAddress,
				locator: 'env:LIGHTNING_LND_GRPC_ENDPOINT',
			},
		],
		wireProtocol: WireProtocol.Grpc,
		apiFamily: ApiFamily.GrpcService,
		operationGroups: [
			SourceOperationGroup.GenericRead,
			SourceOperationGroup.WalletAccountRead,
		],
		delivery: SourceDelivery.ServerOnly,
		credentials: [
			{
				scope: SourceCredentialScope.LocalSecret,
			},
		],
	},
	{
		provider: SourceProvider.LightningLnd,
		source: Source.LightningLnd_Rest,
		target: {
			kind: SourceTargetKind.LocalDevice,
			key: 'lnd',
		},
		endpoints: lightningLndEndpointOrigins.map((origin): SourceEndpoint => ({
			endpointKind: SourceEndpointKind.HttpUrl,
			locator: origin,
			origin,
			corsEnabled: false,
		})),
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.RestJson,
		operationGroups: [
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.HttpProxy,
		credentials: [
			{
				scope: SourceCredentialScope.PublicConfig,
				keys: [
					'PUBLIC_LND_MACAROON_HEX',
				],
			},
		],
		artifacts: [
			{
				kind: SourceArtifactKind.HandwrittenTypes,
				path: 'src/sources/LightningLnd/Rest/types.ts',
				generated: false,
			},
		],
	},
] satisfies readonly SourceBinding[]
