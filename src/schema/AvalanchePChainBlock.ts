// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.AvalanchePChainBlock,
	labels: {
		singular: 'avalanche p chain block',
		plural: 'avalanche p chain blocks',
	},
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	height: {
		primitiveType: type('bigint').narrow((value) => value >= 0n),
		cardinality: EntityFieldCardinality.One,
	},
	blockId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.AvalanchePlatformVm_JsonRpc,
		],
	},
	parentBlockId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.AvalanchePlatformVm_JsonRpc,
		],
	},
	timestampMs: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.AvalanchePlatformVm_JsonRpc,
		],
	},
	encoding: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.AvalanchePlatformVm_JsonRpc,
		],
	},
	txCount: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.AvalanchePlatformVm_JsonRpc,
		],
	},
	$$transactions: {
		entityType: EntityType.AvalanchePChainTransaction,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.AvalanchePlatformVm_JsonRpc,
		],
	},
})({
	selectors: {
		NetworkHeight: [
			'$network',
			'height',
		],
		NetworkBlockId: [
			'$network',
			'blockId',
		],
	},
})
