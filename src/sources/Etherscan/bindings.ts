// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, SourceArtifactKind, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBindingIndex } from '$/sources/SourceBinding.ts'
import { type as arktype } from 'arktype'

export default {
	[Source.Etherscan_Rest]: {
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
		proxyId: '["Etherscan_Rest","Global","etherscan-v2","HttpProxy","EtherscanModuleAction"]',
		artifacts: [
			{
				kind: SourceArtifactKind.HandwrittenTypes,
				path: 'src/sources/Etherscan/Rest/types.ts',
				generated: false,
			},
		],
	},
} as const satisfies SourceBindingIndex
