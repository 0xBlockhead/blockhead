import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import Network from '$/schema/Network.ts'
import { TronTokenStandard } from '$/schema/TronToken.ts'
import { Source } from '$/sources/Source.ts'

const tronScanRestSources = [
	Source.TronScan_Rest,
]

export default {
	entityType: EntityType.TronTokenTransfer,

	label: 'TRON Token Transfer',
	labelPlural: 'TRON Token Transfers',

	id: type({
		$network: Network.id,
		transactionId: 'string',
		transferIndex: 'number',
	}),

	fields: [
		{
			name: '$transaction',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.TronTransaction,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: tronScanRestSources,
		},
		{
			name: '$token',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.TronToken,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: tronScanRestSources,
		},
		{
			name: 'standard',
			type: EntityFieldType.Primitive,
			primitiveType: type.valueOf(TronTokenStandard),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: tronScanRestSources,
		},
		{
			name: '$from',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.TronAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: tronScanRestSources,
		},
		{
			name: '$to',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.TronAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: tronScanRestSources,
		},
		{
			name: 'amount',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: tronScanRestSources,
		},
		{
			name: 'timestampMs',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: tronScanRestSources,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
