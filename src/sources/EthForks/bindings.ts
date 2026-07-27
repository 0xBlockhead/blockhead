// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBindingIndex } from '$/sources/SourceBinding.ts'

export default {
	[Source.EthForks_Rest]: {
		source: Source.EthForks_Rest,
		target: {
			kind: SourceTargetKind.Global,
			key: 'eth-forks',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://eth-forks.github.io',
				origin: 'https://eth-forks.github.io',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.RestJson,
		operationGroups: [
			SourceOperationGroup.GenericRead,
			SourceOperationGroup.RepositoryMetadata,
		],
		delivery: SourceDelivery.HttpProxy,
		credentials: [
			{
				scope: SourceCredentialScope.None,
			},
		],
		proxyId: '["EthForks_Rest","Global","eth-forks","HttpProxy","RestJson"]',
	},
} as const satisfies SourceBindingIndex
