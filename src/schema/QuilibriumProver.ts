// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.QuilibriumProver,
	labels: {
		singular: 'quilibrium prover',
		plural: 'quilibrium provers',
	},
})({
	$network: {
		label: 'network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	proverPeerId: {
		label: 'prover peer ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	publicKey: {
		label: 'public key',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	version: {
		label: 'version',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	lastSeenAt: {
		label: 'last seen AT',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$frames: {
		label: 'frames',
		entityType: EntityType.QuilibriumFrame,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkProverPeerId: [
			'$network',
			'proverPeerId',
		],
	},
})
