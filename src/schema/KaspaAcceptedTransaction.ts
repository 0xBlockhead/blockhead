// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.KaspaAcceptedTransaction,
	labels: {
		singular: 'kaspa accepted transaction',
		plural: 'kaspa accepted transactions',
	},
})({
	$acceptingBlock: {
		label: 'accepting block',
		entityType: EntityType.KaspaBlock,
		cardinality: EntityFieldCardinality.One,
	},
	$transaction: {
		label: 'transaction',
		entityType: EntityType.KaspaTransaction,
		cardinality: EntityFieldCardinality.One,
	},
	acceptedIndex: {
		label: 'accepted index',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	acceptingBlockHash: {
		label: 'accepting block hash',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	transactionId: {
		label: 'transaction ID',
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
