// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, indexSourceBindings, SourceArtifactKind, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBinding } from '$/sources/SourceBinding.ts'
import { type as arktype } from 'arktype'

const bindings = [
	{
		source: Source.Etherscan_Rest,
		target: {
			kind: SourceTargetKind.Global,
			key: 'etherscan-v2',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://api.etherscan.io/v2/api',
				origin: 'https://api.etherscan.io',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.EtherscanModuleAction,
		operationGroups: [
			SourceOperationGroup.EtherscanAccountModule,
			SourceOperationGroup.EtherscanContractModule,
			SourceOperationGroup.EvmRpcCore,
		],
		delivery: SourceDelivery.HttpProxy,
		credentials: [
			{
				scope: SourceCredentialScope.PublicConfig,
				env: arktype({
					'PUBLIC_ETHERSCAN_API_KEY': 'string',
				}),
				keys: [
					'PUBLIC_ETHERSCAN_API_KEY',
				],
			},
		],
		artifacts: [
			{
				kind: SourceArtifactKind.HandwrittenTypes,
				path: 'src/sources/Etherscan/Rest/types.ts',
				generated: false,
			},
		],
	},
] as const satisfies readonly SourceBinding[]

export default indexSourceBindings<{ readonly [Source.Etherscan_Rest]: typeof bindings[0] }>(bindings)
