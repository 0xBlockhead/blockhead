// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBindingIndex } from '$/sources/SourceBinding.ts'

export default {
	[Source.Ipfs_Rest]: {
		source: Source.Ipfs_Rest,
		target: {
			kind: SourceTargetKind.ContentAddressScheme,
			key: 'ipfs',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://ipfs.io',
				origin: 'https://ipfs.io',
				corsEnabled: false,
			},
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://dweb.link',
				origin: 'https://dweb.link',
				corsEnabled: true,
			},
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://cloudflare-ipfs.com',
				origin: 'https://cloudflare-ipfs.com',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.IpfsGateway,
		operationGroups: [
			SourceOperationGroup.ContentGatewayRead,
		],
		delivery: SourceDelivery.HttpProxy,
		credentials: [
			{
				scope: SourceCredentialScope.None,
			},
		],
		proxyId: '["Ipfs_Rest","ContentAddressScheme","ipfs","HttpProxy","IpfsGateway"]',
	},
} as const satisfies SourceBindingIndex
