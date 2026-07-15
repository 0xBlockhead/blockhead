// Generated from APP.ts. Do not edit by hand.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum ElementsPegDirection {
	PegIn = 'PegIn',
	PegOut = 'PegOut',
}
export enum ElementsPegSelector {
	ElementsNetworkPegTransactionIdDirection = 'ElementsNetworkPegTransactionIdDirection',
}
export const ElementsPeg = entity({
	entityType: EntityType.ElementsPeg,
	labels: {
		singular: 'Elements peg',
		plural: 'Elements pegs',
	},
})({
	$network: {
		label: 'Network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.ElementsNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	pegTransactionId: {
		label: 'Peg transaction ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	direction: {
		label: 'Direction',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$bitcoinTransaction: {
		label: 'Bitcoin transaction',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.UtxoTransaction,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$elementsTransaction: {
		label: 'Elements transaction',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.UtxoTransaction,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	amountSats: {
		label: 'Amount sats',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	claimScript: {
		label: 'Claim script',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	pakProof: {
		label: 'PAK proof',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'Observations',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.ElementsPeg_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		ElementsNetworkPegTransactionIdDirection: [
			'$network',
			'pegTransactionId',
			'direction',
		],
	},
})
