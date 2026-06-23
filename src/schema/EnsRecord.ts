import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum EnsRecordSelector {
	NameRecordKey = '$name+recordKey',
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
			description: 'The human-readable name of the subject.',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EnsName,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'recordKey',
			label: 'record key',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'recordKind',
			label: 'record kind',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'coinType',
			label: 'coin type',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EnsRecord_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
