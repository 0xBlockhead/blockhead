// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, indexSourceBindings, SourceArtifactKind, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBinding } from '$/sources/SourceBinding.ts'
import { type as arktype } from 'arktype'

const bindings = [
	{
		source: Source.LightningLnd_Grpc,
		target: {
			kind: SourceTargetKind.LocalDevice,
			key: 'lnd',
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
		source: Source.LightningLnd_Rest,
		target: {
			kind: SourceTargetKind.LocalDevice,
			key: 'lnd',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://127.0.0.1:8080',
				origin: 'https://127.0.0.1:8080',
				corsEnabled: false,
			},
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'http://127.0.0.1:8080',
				origin: 'http://127.0.0.1:8080',
				corsEnabled: false,
			},
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://localhost:8080',
				origin: 'https://localhost:8080',
				corsEnabled: false,
			},
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'http://localhost:8080',
				origin: 'http://localhost:8080',
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
					'PUBLIC_LND_MACAROON_HEX': 'string',
				}),
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
] as const satisfies readonly SourceBinding[]

export default indexSourceBindings<{
	readonly [Source.LightningLnd_Grpc]: typeof bindings[0]
	readonly [Source.LightningLnd_Rest]: typeof bindings[1]
}>(bindings)
