// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.StarknetStateUpdate,
	labels: {
		singular: 'Starknet state update',
		plural: 'Starknet state updates',
	},
	description: 'A source-qualified global state transition committed by a Starknet block.',
})({
	$network: {
		entityType: EntityType.StarknetNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	blockHash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$block: {
		entityType: EntityType.StarknetBlock,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Pathfinder,
		],
	},
	oldRoot: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Pathfinder,
		],
	},
	newRoot: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Pathfinder,
		],
	},
	storageDiffs: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Pathfinder,
		],
	},
	deprecatedDeclaredClassHashes: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Pathfinder,
		],
	},
	declaredClasses: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Pathfinder,
		],
	},
	deployedContracts: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Pathfinder,
		],
	},
	replacedClasses: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Pathfinder,
		],
	},
	nonces: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Pathfinder,
		],
	},
})({
	selectors: {
		NetworkBlockHashSource: [
			'$network',
			'blockHash',
			'source',
		],
	},
})
