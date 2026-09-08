// Generated from APP.ts.

import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	indexSourceBindings,
	SourceCredentialScope,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
} from '$/sources/SourceBinding.ts'
import { type as arktype } from 'arktype'

export default indexSourceBindings([
	{
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
					TEZOS_DAPPETIZER_DATABASE_URL: 'string',
				}),
				keys: [
					'TEZOS_DAPPETIZER_DATABASE_URL',
				],
			},
		],
	},
])
