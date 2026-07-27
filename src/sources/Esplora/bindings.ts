// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBindingIndex } from '$/sources/SourceBinding.ts'

const esploraRestGenericReadOperationGroups = [
	SourceOperationGroup.GenericRead,
] as const
const esploraRestCredentials = [
	{
		scope: SourceCredentialScope.None,
	},
] as const

export default {
	[Source.Esplora_Rest]: [
		{
			source: Source.Esplora_Rest,
			target: {
				kind: SourceTargetKind.Caip2Network,
				key: 'bip122:000000000019d6689c085ae165831e93',
			},
			endpoints: [
				{
					endpointKind: SourceEndpointKind.HttpUrl,
					locator: 'https://blockstream.info/api',
					origin: 'https://blockstream.info',
					corsEnabled: true,
				},
			],
			wireProtocol: WireProtocol.HttpRest,
			apiFamily: ApiFamily.RestJson,
			operationGroups: esploraRestGenericReadOperationGroups,
			delivery: SourceDelivery.BrowserDirect,
			credentials: esploraRestCredentials,
		},
		{
			source: Source.Esplora_Rest,
			target: {
				kind: SourceTargetKind.NetworkSlug,
				key: 'liquid',
			},
			endpoints: [
				{
					endpointKind: SourceEndpointKind.HttpUrl,
					locator: 'https://blockstream.info/liquid/api',
					origin: 'https://blockstream.info',
					corsEnabled: true,
				},
			],
			wireProtocol: WireProtocol.HttpRest,
			apiFamily: ApiFamily.RestJson,
			operationGroups: esploraRestGenericReadOperationGroups,
			delivery: SourceDelivery.BrowserDirect,
			credentials: esploraRestCredentials,
		},
	],
} as const satisfies SourceBindingIndex
