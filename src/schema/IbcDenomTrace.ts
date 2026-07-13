// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum IbcDenomTraceSelector {
	NetworkTraceKey = 'NetworkTraceKey',
}
export const IbcDenomTrace = entity({
	entityType: EntityType.IbcDenomTrace,
	labels: {
		singular: 'IBC denom trace',
		plural: 'IBC denom traces',
	},
})({
	$network: {
		label: 'Network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	traceKey: {
		label: 'Trace key',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	denomHash: {
		label: 'Denom hash',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	path: {
		label: 'Path',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	baseDenom: {
		label: 'Base denom',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	displayDenom: {
		label: 'Display denom',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$cosmosDenom: {
		label: 'Cosmos denom',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.CosmosDenom,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$assetInstance: {
		label: 'Asset instance',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.AssetInstance,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$channel: {
		label: 'Channel',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.IbcChannel,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	sourcePort: {
		label: 'Source port',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	sourceChannel: {
		label: 'Source channel',
		type: EntityFieldType.Primitive,
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
