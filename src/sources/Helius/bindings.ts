// Generated from APP.ts.

import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	indexSourceBindings,
	SourceArtifactKind,
	SourceCredentialScope,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'
import { type as arktype } from 'arktype'

const heliusGenericReadOperationGroups = [
	SourceOperationGroup.GenericRead,
] as const
const heliusCredentials = [
	{
		scope: SourceCredentialScope.PublicConfig,
		env: arktype({
			'PUBLIC_HELIUS_API_KEY': 'string',
		}),
	},
] as const

const bindings = [
	{
		source: Source.Helius,
		target: {
			kind: SourceTargetKind.Caip2Network,
			key: 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://api-mainnet.helius-rpc.com',
				corsEnabled: true,
			},
		],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.RestJson,
		operationGroups: heliusGenericReadOperationGroups,
		delivery: SourceDelivery.BrowserDirect,
		credentials: heliusCredentials,
		artifacts: [
			{
				kind: SourceArtifactKind.HandwrittenTypes,
				path: 'src/sources/Helius/Rest/types.ts',
			},
		],
	},
	{
		source: Source.Helius,
		target: {
			kind: SourceTargetKind.Caip2Network,
			key: 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://mainnet.helius-rpc.com',
				corsEnabled: true,
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.MetaplexDasJsonRpc,
		operationGroups: heliusGenericReadOperationGroups,
		delivery: SourceDelivery.BrowserDirect,
		credentials: heliusCredentials,
		artifacts: [
			{
				kind: SourceArtifactKind.OpenRpcSpec,
				path: 'src/sources/_shared/interfaces/MetaplexDasJsonRpc/OpenRpc/metaplex-das-api.json',
			},
			{
				kind: SourceArtifactKind.GenerationManifest,
				path: 'src/sources/_shared/interfaces/MetaplexDasJsonRpc/OpenRpc/schema-source.ts',
			},
		],
	},
] as const satisfies readonly SourceBinding[]

export default indexSourceBindings(bindings)
