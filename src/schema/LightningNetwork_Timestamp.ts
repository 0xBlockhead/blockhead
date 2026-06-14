import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import LightningNetwork from '$/schema/LightningNetwork.ts'
import { Source } from '$/sources/Source.ts'

export enum LightningNetwork_TimestampSelector {
	LightningNetworkTimestampMs = 'lightningNetworkTimestampMs',
}

export default {
	entityType: EntityType.LightningNetwork_Timestamp,

	label: 'Lightning Network snapshot',
	labelPlural: 'Lightning Network snapshots',

	selectors: [
		{
			name: LightningNetwork_TimestampSelector.LightningNetworkTimestampMs,
			fields: [
				'$lightningNetwork',
				'timestampMs',
			],
		},
	],

	fields: [
		{
			name: '$lightningNetwork',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.LightningNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'timestampMs',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'nodeCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.LightningMempoolSpace_Rest,
			],
		},
		{
			name: 'channelCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.LightningMempoolSpace_Rest,
			],
		},
		{
			name: 'totalCapacitySats',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.LightningMempoolSpace_Rest,
			],
		},
		{
			name: 'torNodeCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'clearnetNodeCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'unannouncedNodeCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'averageCapacitySats',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'medianCapacitySats',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'averageFeeRatePpm',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'medianFeeRatePpm',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
