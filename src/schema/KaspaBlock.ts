// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.KaspaBlock,
	labels: {
		singular: 'kaspa block',
		plural: 'kaspa blocks',
	},
})({
	$network: {
		label: 'network',
		entityType: EntityType.KaspaNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	blockHash: {
		label: 'Block hash',
		description: 'The hash that identifies the block in its network.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	version: {
		label: 'version',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	blueScore: {
		label: 'blue score',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	daaScore: {
		label: 'daa score',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	bits: {
		label: 'bits',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	nonce: {
		label: 'nonce',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	hashMerkleRoot: {
		label: 'hash merkle root',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	acceptedIdMerkleRoot: {
		label: 'accepted ID merkle root',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	utxoCommitment: {
		label: 'UTXO commitment',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	selectedParentHash: {
		label: 'selected parent hash',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	parentHashes: {
		label: 'parent hashes',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	mergeSetBlues: {
		label: 'merge set blues',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	mergeSetReds: {
		label: 'merge set reds',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	$$acceptedTransactions: {
		label: 'accepted transactions',
		entityType: EntityType.KaspaAcceptedTransaction,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkBlockHash: [
			'$network',
			'blockHash',
		],
	},
})
