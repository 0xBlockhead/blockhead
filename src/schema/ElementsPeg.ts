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
		entityType: EntityType.ElementsNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	pegTransactionId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	direction: {
		primitiveType: type.enumerated(...Object.values(ElementsPegDirection)),
		cardinality: EntityFieldCardinality.One,
	},
	$bitcoinTransaction: {
		entityType: EntityType.UtxoTransaction,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$elementsTransaction: {
		entityType: EntityType.UtxoTransaction,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	amountSats: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	claimScript: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	pakProof: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
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
