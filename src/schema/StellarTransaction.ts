// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum StellarTransactionSelector {
	NetworkHash = 'NetworkHash',
}
export default {
	entityType: EntityType.StellarTransaction,
	label: 'stellar transaction',
	labelPlural: 'stellar transactions',
	selectors: [
		{
			name: StellarTransactionSelector.NetworkHash,
			fields: [
				'$network',
				'hash',
			],
		},
	],
	fields: [
		{
			name: '$network',
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.StellarNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'hash',
			label: 'Hash',
			description: 'The hash that identifies this object in its protocol.',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'sourceAccount',
			label: 'source account',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.StellarTransaction_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$operations',
			label: 'operations',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.StellarOperation,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
