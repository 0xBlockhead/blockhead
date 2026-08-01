// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.KaspaTransaction,
	labels: {
		singular: 'kaspa transaction',
		plural: 'kaspa transactions',
	},
})({
	$network: {
		label: 'network',
		entityType: EntityType.KaspaNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	transactionId: {
		label: 'transaction ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	version: {
		label: 'version',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	lockTime: {
		label: 'lock time',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	subnetworkId: {
		label: 'subnetwork ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	gas: {
		label: 'gas',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	payloadHash: {
		label: 'payload hash',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	payloadLength: {
		label: 'payload length',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	mass: {
		label: 'mass',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	blockHashes: {
		label: 'block hashes',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	$$inputs: {
		label: 'inputs',
		entityType: EntityType.UtxoInput,
		cardinality: EntityFieldCardinality.Many,
	},
	$$outputs: {
		label: 'outputs',
		entityType: EntityType.UtxoOutput,
		cardinality: EntityFieldCardinality.Many,
	},
	$$acceptances: {
		label: 'acceptances',
		entityType: EntityType.KaspaAcceptedTransaction,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkTransactionId: [
			'$network',
			'transactionId',
		],
	},
})
