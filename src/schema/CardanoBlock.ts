// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.CardanoBlock,
	labels: {
		singular: 'cardano block',
		plural: 'cardano blocks',
	},
})({
	$network: {
		label: 'network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	hash: {
		label: 'Hash',
		description: 'The hash that identifies this object in its protocol.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	slot: {
		label: 'slot',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	blockNo: {
		label: 'block no',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	epoch: {
		label: 'epoch',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	era: {
		label: 'era',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	issuerVkey: {
		label: 'issuer vkey',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$transactions: {
		label: 'transactions',
		entityType: EntityType.CardanoTransaction,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkHash: [
			'$network',
			'hash',
		],
		NetworkSlot: [
			'$network',
			'slot',
		],
		NetworkBlockNo: [
			'$network',
			'blockNo',
		],
	},
})
