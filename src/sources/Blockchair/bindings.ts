// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBindingIndex } from '$/sources/SourceBinding.ts'
import { type as arktype } from 'arktype'

export default {
	[Source.Blockchair_Rest]: {
		source: Source.Blockchair_Rest,
		target: {
			kind: SourceTargetKind.Global,
			key: 'blockchair',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://api.blockchair.com',
				origin: 'https://api.blockchair.com',
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
				scope: SourceCredentialScope.PublicConfig,
				env: arktype({
					'PUBLIC_BLOCKCHAIR_API_KEY': 'string',
				}),
				keys: [
					'PUBLIC_BLOCKCHAIR_API_KEY',
				],
			},
		],
		proxyId: '["Blockchair_Rest","Global","blockchair","HttpProxy","RestJson"]',
	},
} as const satisfies SourceBindingIndex
