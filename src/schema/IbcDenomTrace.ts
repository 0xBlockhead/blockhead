// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.IbcDenomTrace,
	labels: {
		singular: 'IBC denom trace',
		plural: 'IBC denom traces',
	},
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	traceKey: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	denomHash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	path: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	baseDenom: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	displayDenom: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$cosmosDenom: {
		entityType: EntityType.CosmosDenom,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$assetInstance: {
		entityType: EntityType.AssetInstance,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$channel: {
		entityType: EntityType.IbcChannel,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	sourcePort: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	sourceChannel: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		NetworkTraceKey: [
			'$network',
			'traceKey',
		],
	},
})
