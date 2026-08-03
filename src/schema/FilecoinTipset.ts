// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

const lotusJsonRpcFilfoxRestSources = [
	Source.Lotus_JsonRpc,
	Source.Filfox_Rest,
] as const

export default entity({
	entityType: EntityType.FilecoinTipset,
	labels: {
		singular: 'filecoin tipset',
		plural: 'filecoin tipsets',
	},
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	height: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	tipsetKey: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$parent: {
		entityType: EntityType.FilecoinTipset,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: lotusJsonRpcFilfoxRestSources,
	},
	parentWeight: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Lotus_JsonRpc,
		],
	},
	timestampMs: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: lotusJsonRpcFilfoxRestSources,
	},
	$$blocks: {
		entityType: EntityType.FilecoinBlock,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: lotusJsonRpcFilfoxRestSources,
	},
})({
	selectors: {
		NetworkHeightTipsetKey: [
			'$network',
			'height',
			'tipsetKey',
		],
	},
})
