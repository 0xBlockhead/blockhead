import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	genericReadOperationGroups,
	indexSourceBindings,
	SourceCredentialScope,
	SourceDelivery,
	SourceEndpointKind,
	SourceTargetKind,
	WireProtocol,
} from '$/sources/SourceBinding.ts'
import { type as arktype } from 'arktype'

export default indexSourceBindings([
	{
		source: Source.Conseil_Postgres,
		target: {
			kind: SourceTargetKind.SqlDataset,
			key: 'conseil',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.PostgresDsn,
				locator: 'env:CONSEIL_DATABASE_URL',
			},
		],
		wireProtocol: WireProtocol.Sql,
		apiFamily: ApiFamily.Postgres,
		operationGroups: genericReadOperationGroups,
		delivery: SourceDelivery.ServerOnly,
		credentials: [
			{
				scope: SourceCredentialScope.RuntimeSecret,
				env: arktype({
					'CONSEIL_DATABASE_URL': 'string',
				}),
				keys: [
					'CONSEIL_DATABASE_URL',
				],
			},
		],
	},
])
