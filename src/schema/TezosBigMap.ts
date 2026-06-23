import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum TezosBigMapSelector {
	ContractBigMapId = '$contract+bigMapId',
}
export default {
	entityType: EntityType.TezosBigMap,
	label: 'tezos big map',
	labelPlural: 'tezos big maps',
	selectors: [
		{
			name: TezosBigMapSelector.ContractBigMapId,
			fields: [
				'$contract',
				'bigMapId',
			],
		},
	],
	fields: [
		{
			name: '$contract',
			label: 'contract',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.TezosContract,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'bigMapId',
			label: 'big map ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'path',
			label: 'path',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'keyType',
			label: 'key type',
			type: EntityFieldType.Primitive,
			primitiveType: type("unknown"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'valueType',
			label: 'value type',
			type: EntityFieldType.Primitive,
			primitiveType: type("unknown"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$keys',
			label: 'keys',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.TezosBigMapKey,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$updates',
			label: 'updates',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.TezosBigMapDiff,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.TezosBigMap_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
