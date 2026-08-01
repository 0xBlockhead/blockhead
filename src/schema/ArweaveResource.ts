// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.ArweaveResource,
	labels: {
		singular: 'arweave resource',
		plural: 'arweave resources',
	},
})({
	transactionId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	contentPath: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	canonicalUri: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$transaction: {
		entityType: EntityType.ArweaveTransaction,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		entityType: EntityType.ArweaveResource_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		TransactionIdContentPath: [
			'transactionId',
			'contentPath',
		],
	},
})
