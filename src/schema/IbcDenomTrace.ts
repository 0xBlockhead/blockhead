// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum IbcDenomTraceSelector {
	NetworkTraceKey = 'NetworkTraceKey',
}
export default {
	entityType: EntityType.IbcDenomTrace,
	label: 'IBC denom trace',
	labelPlural: 'IBC denom traces',
	selectors: [
		{
			name: IbcDenomTraceSelector.NetworkTraceKey,
			fields: [
				'$network',
				'traceKey',
			],
		},
	],
	fields: [
		{
				name: '$network',
				label: 'Network',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.Network,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'traceKey',
				label: 'Trace key',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'denomHash',
				label: 'Denom hash',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'path',
				label: 'Path',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'baseDenom',
				label: 'Base denom',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'displayDenom',
				label: 'Display denom',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$cosmosDenom',
				label: 'Cosmos denom',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.CosmosDenom,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$assetInstance',
				label: 'Asset instance',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.AssetInstance,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$channel',
				label: 'Channel',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.IbcChannel,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'sourcePort',
				label: 'Source port',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'sourceChannel',
				label: 'Source channel',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
