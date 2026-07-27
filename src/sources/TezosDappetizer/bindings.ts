// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBindingIndex } from '$/sources/SourceBinding.ts'
import { type as arktype } from 'arktype'

export default {
	[Source.TezosDappetizer_Postgres]: {
		source: Source.TezosDappetizer_Postgres,
		target: {
			kind: SourceTargetKind.SqlDataset,
			key: 'tezos-dappetizer-dataset',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.PostgresDsn,
				locator: 'env:TEZOS_DAPPETIZER_DATABASE_URL',
			},
		],
		wireProtocol: WireProtocol.Sql,
		apiFamily: ApiFamily.Postgres,
		operationGroups: [
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.ServerOnly,
		credentials: [
			{
				scope: SourceCredentialScope.RuntimeSecret,
				env: arktype({
					'TEZOS_DAPPETIZER_DATABASE_URL': 'string',
				}),
				keys: [
					'TEZOS_DAPPETIZER_DATABASE_URL',
				],
			},
		],
	},
} as const satisfies SourceBindingIndex
