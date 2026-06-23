import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum KaspaAcceptedTransactionSelector {
	AcceptingBlockTransaction = '$acceptingBlock+$transaction',
}
export default {
	entityType: EntityType.KaspaAcceptedTransaction,
	label: 'kaspa accepted transaction',
	labelPlural: 'kaspa accepted transactions',
	selectors: [
		{
			name: KaspaAcceptedTransactionSelector.AcceptingBlockTransaction,
			fields: [
				'$acceptingBlock',
				'$transaction',
			],
		},
	],
	fields: [
		{
			name: '$acceptingBlock',
			label: 'accepting block',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.KaspaBlock,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$transaction',
			label: 'transaction',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.KaspaTransaction,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'acceptedIndex',
			label: 'accepted index',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'acceptingBlockHash',
			label: 'accepting block hash',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'transactionId',
			label: 'transaction ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
	],
} as const satisfies EntityDefinition
