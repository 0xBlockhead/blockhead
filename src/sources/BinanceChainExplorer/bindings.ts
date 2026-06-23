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
	type SourceBinding,
} from '$/sources/SourceBinding.ts'

const binanceChainExplorerOrigin = 'https://explorer.binance.org' as const

export const binanceChainExplorerBindings = [
	{
		provider: SourceProvider.BinanceChainExplorer,
		source: Source.BinanceChainExplorer_Rest,
		target: {
			kind: SourceTargetKind.Global,
			key: 'binance-chain-explorer',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: binanceChainExplorerOrigin,
				origin: binanceChainExplorerOrigin,
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
				scope: SourceCredentialScope.None,
			},
		],
	},
] as const satisfies readonly SourceBinding[]
