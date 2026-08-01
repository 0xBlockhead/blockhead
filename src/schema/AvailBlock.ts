// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.AvailBlock,
	labels: {
		singular: 'avail block',
		plural: 'avail blocks',
	},
})({
	$network: {
		label: 'network',
		entityType: EntityType.AvailNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	blockNumber: {
		label: 'Block number',
		description: 'The block height or number in its network.',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	blockHash: {
		label: 'Block hash',
		description: 'The hash that identifies the block in its network.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	parentHash: {
		label: 'parent hash',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	stateRoot: {
		label: 'state root',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	extrinsicsRoot: {
		label: 'extrinsics root',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	extrinsicCount: {
		label: 'extrinsic count',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	dataSubmissionCount: {
		label: 'data submission count',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	appIdCount: {
		label: 'app ID count',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$parent: {
		label: 'parent',
		entityType: EntityType.AvailBlock,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$dataSubmissions: {
		label: 'data submissions',
		entityType: EntityType.AvailDataSubmission,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkBlockNumber: [
			'$network',
			'blockNumber',
		],
		NetworkBlockHash: [
			'$network',
			'blockHash',
		],
	},
})
