// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum ElementsPegDirection {
	PegIn = 'PegIn',
	PegOut = 'PegOut',
}
export enum ElementsPegSelector {
	ElementsNetworkPegTransactionIdDirection = 'ElementsNetworkPegTransactionIdDirection',
}
export default {
	entityType: EntityType.ElementsPeg,
	label: 'Elements peg',
	labelPlural: 'Elements pegs',
	selectors: [
		{
			name: ElementsPegSelector.ElementsNetworkPegTransactionIdDirection,
			fields: [
				'$network',
				'pegTransactionId',
				'direction',
			],
		},
	],
	fields: [
		{
				name: '$network',
				label: 'Network',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.ElementsNetwork,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'pegTransactionId',
				label: 'Peg transaction ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'direction',
				label: 'Direction',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$bitcoinTransaction',
				label: 'Bitcoin transaction',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.UtxoTransaction,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$elementsTransaction',
				label: 'Elements transaction',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.UtxoTransaction,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'amountSats',
				label: 'Amount sats',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'claimScript',
				label: 'Claim script',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'pakProof',
				label: 'PAK proof',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$$timestamps',
				label: 'Observations',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.ElementsPeg_Timestamp,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
