import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum MoneroKeyImageSelector {
	MoneroTransactionInputIndexKeyImage = 'moneroTransactionInputIndexKeyImage',
	TransactionInputIndexKeyImage = '$transaction+inputIndex+keyImage',
}
export default {
	entityType: EntityType.MoneroKeyImage,
	label: 'monero key image',
	labelPlural: 'monero key images',
	selectors: [
		{
			name: MoneroKeyImageSelector.MoneroTransactionInputIndexKeyImage,
			fields: [
				'$transaction',
				'inputIndex',
				'keyImage',
			],
		},
	],
	fields: [
		{
			name: '$transaction',
			label: 'transaction',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.MoneroTransaction,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'inputIndex',
			label: 'input index',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'keyImage',
			label: 'key image',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$ring',
			label: 'ring',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.MoneroRing,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
