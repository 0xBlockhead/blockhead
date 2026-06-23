import { TransportType } from '$/constants/TransportType.ts'
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

export const quilibriumDocsEndpoints = [
	{
		url: 'https://docs.quilibrium.com',
		transportType: TransportType.Http,
		providerName: 'Quilibrium docs',
	},
	{
		url: 'https://quilibrium.com',
		transportType: TransportType.Http,
		providerName: 'Quilibrium',
	},
] as const

export const quilibriumDocsBindings = [
	{
		provider: SourceProvider.QuilibriumDocs,
		source: Source.QuilibriumDocs_Rest,
		target: {
			kind: SourceTargetKind.Global,
			key: 'docs',
		},
		endpoints: quilibriumDocsEndpoints.map((endpoint) => ({
			endpointKind: SourceEndpointKind.HttpUrl,
			locator: endpoint.url,
			origin: new URL(endpoint.url).origin,
			corsEnabled: true,
		})),
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
	},
] as const satisfies readonly SourceBinding[]
