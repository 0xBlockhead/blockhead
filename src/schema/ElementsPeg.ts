// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { ElementsPegDirection } from '$/schema/ElementsPegDirection.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.ElementsPeg,
	labels: {
		singular: 'Elements peg',
		plural: 'Elements pegs',
	},
})({
	$network: {
		label: 'Network',
		entityType: EntityType.ElementsNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	pegTransactionId: {
		label: 'Peg transaction ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	direction: {
		label: 'Direction',
		primitiveType: type.enumerated(...Object.values(ElementsPegDirection)),
		cardinality: EntityFieldCardinality.One,
	},
	$bitcoinTransaction: {
		label: 'Bitcoin transaction',
		entityType: EntityType.UtxoTransaction,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$elementsTransaction: {
		label: 'Elements transaction',
		entityType: EntityType.UtxoTransaction,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	amountSats: {
		label: 'Amount sats',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	claimScript: {
		label: 'Claim script',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	pakProof: {
		label: 'PAK proof',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'Observations',
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
