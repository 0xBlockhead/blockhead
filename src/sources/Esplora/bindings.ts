import {
	bitcoinNetworkBySlug,
} from '$/constants/BitcoinNetwork.ts'
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

export const liquidMainnetEsploraRestEndpoints = [
	{
		restBaseUrl: 'https://blockstream.info/liquid/api',
	},
] as const satisfies readonly {
	restBaseUrl: string
}[]

export const esploraRestBaseUrlByNetworkKey = {
	[`${bitcoinNetworkBySlug.bitcoin.caip2.namespace}:${bitcoinNetworkBySlug.bitcoin.caip2.reference}`]: bitcoinNetworkBySlug.bitcoin.esploraRestBaseUrl,
	liquid: liquidMainnetEsploraRestEndpoints[0].restBaseUrl,
} as const satisfies Partial<Record<string, string>>

export const esploraBindings = Object.entries(esploraRestBaseUrlByNetworkKey)
	.map(([networkKey, restBaseUrl]) => ({
		provider: SourceProvider.Esplora,
		source: Source.Esplora_Rest,
		target: {
			kind: SourceTargetKind.Caip2Network,
			key: networkKey,
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: restBaseUrl,
				origin: new URL(restBaseUrl).origin,
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
				scope: SourceCredentialScope.None,
			},
		],
	})) satisfies SourceBinding[]
