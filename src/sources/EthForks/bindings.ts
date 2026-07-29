// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, indexSourceBindings, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBinding } from '$/sources/SourceBinding.ts'

const bindings = [
	{
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
	},
] as const satisfies readonly SourceBinding[]

export default indexSourceBindings<{ readonly [Source.EthForks_Rest]: typeof bindings[0] }>(bindings)
