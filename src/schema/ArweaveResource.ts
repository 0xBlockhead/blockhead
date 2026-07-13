// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum ArweaveResourceSelector {
	TransactionIdContentPath = 'TransactionIdContentPath',
}
export const ArweaveResource = entity({
	entityType: EntityType.ArweaveResource,
	labels: {
		singular: 'arweave resource',
		plural: 'arweave resources',
	},
})({
	transactionId: {
		label: 'transaction ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	contentPath: {
		label: 'content path',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	canonicalUri: {
		label: 'canonical URI',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$transaction: {
		label: 'transaction',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.ArweaveTransaction,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
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
