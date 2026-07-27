// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBindingIndex } from '$/sources/SourceBinding.ts'

export default {
	[Source.HederaMirrorNode_Rest]: {
		source: Source.HederaMirrorNode_Rest,
		target: {
			kind: SourceTargetKind.Caip2Network,
			key: 'hedera:mainnet',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://mainnet-public.mirrornode.hedera.com',
				origin: 'https://mainnet-public.mirrornode.hedera.com',
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
		proxyId: '["HederaMirrorNode_Rest","Caip2Network","hedera:mainnet","HttpProxy","RestJson"]',
	},
} as const satisfies SourceBindingIndex
