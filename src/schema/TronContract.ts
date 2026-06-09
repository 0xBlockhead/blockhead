import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import Network from '$/schema/Network.ts'
import { Source } from '$/sources/Source.ts'

const tronScanRestSources = [
	Source.TronScan_Rest,
]

export default {
	entityType: EntityType.TronContract,

	label: 'TRON Contract',
	labelPlural: 'TRON Contracts',

	id: type({
		$network: Network.id,
		address: 'string',
	}),

	fields: [
		{
			name: '$account',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.TronAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: tronScanRestSources,
		},
		{
			name: 'name',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: tronScanRestSources,
		},
		{
			name: 'compiler',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: tronScanRestSources,
		},
		{
			name: 'verifyStatus',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: tronScanRestSources,
		},
		{
			name: 'isProxy',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: tronScanRestSources,
		},
		{
			name: '$implementation',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.TronContract,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: tronScanRestSources,
		},
		{
			name: '$creator',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.TronAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: tronScanRestSources,
		},
		{
			name: '$creationTransaction',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.TronTransaction,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: tronScanRestSources,
		},
		{
			name: '$$tokens',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.TronToken,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: tronScanRestSources,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
