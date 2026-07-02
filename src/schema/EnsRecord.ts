// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum EnsRecordSelector {
	NameRecordKey = 'NameRecordKey',
}
export default {
	entityType: EntityType.EnsRecord,
	label: 'ENS record',
	labelPlural: 'ENS records',
	selectors: [
		{
			name: EnsRecordSelector.NameRecordKey,
			fields: [
				'$name',
				'recordKey',
			],
		},
	],
	fields: [
		{
				name: '$name',
				label: 'Name',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.EnsName,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'recordKey',
				label: 'Record key',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'recordKind',
				label: 'Record kind',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'coinType',
				label: 'Coin type',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$$timestamps',
				label: 'Observations',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.EnsRecord_Timestamp,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
