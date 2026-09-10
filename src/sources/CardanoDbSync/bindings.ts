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
		source: Source.CardanoDbSync_Postgres,
		target: {
			kind: SourceTargetKind.SqlDataset,
			key: 'cardano-db-sync',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.PostgresDsn,
				locator: 'env:CARDANO_DB_SYNC_DATABASE_URL',
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
					CARDANO_DB_SYNC_DATABASE_URL: 'string',
				}),
				keys: [
					'CARDANO_DB_SYNC_DATABASE_URL',
				],
			},
		],
	},
])
