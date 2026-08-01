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
		label: 'transaction ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	contentPath: {
		label: 'content path',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	canonicalUri: {
		label: 'canonical URI',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$transaction: {
		label: 'transaction',
		entityType: EntityType.ArweaveTransaction,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'timestamps',
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
