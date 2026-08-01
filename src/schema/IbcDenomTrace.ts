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
		label: 'Network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	traceKey: {
		label: 'Trace key',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	denomHash: {
		label: 'Denom hash',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	path: {
		label: 'Path',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	baseDenom: {
		label: 'Base denom',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	displayDenom: {
		label: 'Display denom',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$cosmosDenom: {
		label: 'Cosmos denom',
		entityType: EntityType.CosmosDenom,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$assetInstance: {
		label: 'Asset instance',
		entityType: EntityType.AssetInstance,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$channel: {
		label: 'Channel',
		entityType: EntityType.IbcChannel,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	sourcePort: {
		label: 'Source port',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	sourceChannel: {
		label: 'Source channel',
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
