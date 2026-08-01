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
		entityType: EntityType.KaspaBlock,
		cardinality: EntityFieldCardinality.One,
	},
	$transaction: {
		entityType: EntityType.KaspaTransaction,
		cardinality: EntityFieldCardinality.One,
	},
	acceptedIndex: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	acceptingBlockHash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	transactionId: {
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
