import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import {
	ApiFamily,
	SourceCredentialScope,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
	type SourceEndpoint,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'
import {
	blockscoutExplorerRestV2OriginByChainId,
} from '$/sources/Blockscout/Http/BlockscoutRestV2/constants.ts'

const blockscoutHttpEndpointByChainId = Object.fromEntries(
	Object.entries(blockscoutExplorerRestV2OriginByChainId)
		.map(([chainId, origin]) => [
			Number(chainId),
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: origin,
				origin,
				corsEnabled: true,
			} satisfies SourceEndpoint,
		])
)

export const blockscoutBindings = Object.entries(blockscoutHttpEndpointByChainId)
	.flatMap(([chainId, endpoint]): SourceBinding[] => [
		{
			provider: SourceProvider.Blockscout,
			source: Source.Blockscout_Rest,
			target: {
				kind: SourceTargetKind.Eip155Chain,
				key: String(chainId),
			},
			endpoints: [endpoint],
			wireProtocol: WireProtocol.HttpRest,
			apiFamily: ApiFamily.BlockscoutRestV2,
			operationGroups: [
				SourceOperationGroup.GenericRead,
				SourceOperationGroup.BlockscoutAccountAbstraction,
			],
			delivery: SourceDelivery.BrowserDirect,
			credentials: [
				{
					scope: SourceCredentialScope.None,
				},
			],
		},
		{
			provider: SourceProvider.Blockscout,
			source: Source.Blockscout_Rest,
			target: {
				kind: SourceTargetKind.Eip155Chain,
				key: String(chainId),
			},
			endpoints: [endpoint],
			wireProtocol: WireProtocol.HttpRest,
			apiFamily: ApiFamily.EtherscanModuleAction,
			operationGroups: [
				SourceOperationGroup.EtherscanAccountModule,
				SourceOperationGroup.EtherscanContractModule,
			],
			delivery: SourceDelivery.BrowserDirect,
			credentials: [
				{
					scope: SourceCredentialScope.None,
				},
			],
		},
	])
