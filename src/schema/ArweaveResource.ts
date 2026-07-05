// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum ArweaveResourceSelector {
	TransactionIdContentPath = 'TransactionIdContentPath',
}
export default {
	entityType: EntityType.ArweaveResource,
	label: 'arweave resource',
	labelPlural: 'arweave resources',
	selectors: [
		{
			name: ArweaveResourceSelector.TransactionIdContentPath,
			fields: [
				'transactionId',
				'contentPath',
			],
		},
	],
	fields: [
		{
				name: 'transactionId',
				label: 'transaction ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'contentPath',
				label: 'content path',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'canonicalUri',
				label: 'canonical URI',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$transaction',
				label: 'transaction',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.ArweaveTransaction,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$$timestamps',
				label: 'timestamps',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.ArweaveResource_Timestamp,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
