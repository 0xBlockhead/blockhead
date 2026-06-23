import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum IbcDenomTraceSelector {
	NetworkTraceKey = '$network+traceKey',
}
export default {
	entityType: EntityType.IbcDenomTrace,
	label: 'ibc denom trace',
	labelPlural: 'ibc denom traces',
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
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'traceKey',
			label: 'trace key',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'denomHash',
			label: 'denom hash',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'path',
			label: 'path',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'baseDenom',
			label: 'base denom',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'displayDenom',
			label: 'display denom',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
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
			label: 'asset instance',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.AssetInstance,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$channel',
			label: 'channel',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.IbcChannel,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'sourcePort',
			label: 'source port',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'sourceChannel',
			label: 'source channel',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
