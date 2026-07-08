// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum KaspaAcceptedTransactionSelector {
	AcceptingBlockTransaction = 'AcceptingBlockTransaction',
}
export const KaspaAcceptedTransaction = entity({
	entityType: EntityType.KaspaAcceptedTransaction,
	label: 'kaspa accepted transaction',
	labelPlural: 'kaspa accepted transactions',
})({
	$acceptingBlock: {
		label: 'accepting block',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.KaspaBlock,
		cardinality: EntityFieldCardinality.One,
	},
	$transaction: {
		label: 'transaction',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.KaspaTransaction,
		cardinality: EntityFieldCardinality.One,
	},
	acceptedIndex: {
		label: 'accepted index',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	acceptingBlockHash: {
		label: 'accepting block hash',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	transactionId: {
		label: 'transaction ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
})({
	selectors: {
		AcceptingBlockTransaction: [
			'$acceptingBlock',
			'$transaction',
		],
	},
})
