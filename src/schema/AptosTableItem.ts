import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum AptosTableItemSelector {
	NetworkTableHandleKeyHash = '$network+tableHandle+keyHash',
}
export default {
	entityType: EntityType.AptosTableItem,
	label: 'aptos table item',
	labelPlural: 'aptos table items',
	selectors: [
		{
			name: AptosTableItemSelector.NetworkTableHandleKeyHash,
			fields: [
				'$network',
				'tableHandle',
				'keyHash',
			],
		},
	],
	fields: [
		{
			name: '$network',
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.AptosNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'tableHandle',
			label: 'table handle',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'keyHash',
			label: 'key hash',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'key',
			label: 'key',
			type: EntityFieldType.Primitive,
			primitiveType: type("unknown"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'keyType',
			label: 'key type',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'valueType',
			label: 'value type',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.AptosTableItem_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
