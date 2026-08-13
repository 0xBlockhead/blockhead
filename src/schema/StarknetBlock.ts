// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.StarknetBlock,
	labels: {
		singular: 'starknet block',
		plural: 'starknet blocks',
	},
})({
	$network: {
		entityType: EntityType.StarknetNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	blockNumber: {
		primitiveType: type('bigint').narrow((value) => value >= 0n),
		cardinality: EntityFieldCardinality.One,
	},
	blockHash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	parentHash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	newRoot: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	timestampMs: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	sequencerAddress: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	l1GasPrice: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	l1DataGasPrice: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	status: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$stateUpdates: {
		entityType: EntityType.StarknetStateUpdate,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Pathfinder,
		],
	},
	$$transactions: {
		entityType: EntityType.StarknetTransaction,
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
