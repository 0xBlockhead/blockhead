// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum FilecoinTipsetSelector {
	NetworkHeightTipsetKey = 'NetworkHeightTipsetKey',
}
export default {
	entityType: EntityType.FilecoinTipset,
	label: 'filecoin tipset',
	labelPlural: 'filecoin tipsets',
	selectors: [
		{
			name: FilecoinTipsetSelector.NetworkHeightTipsetKey,
			fields: [
				'$network',
				'height',
				'tipsetKey',
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
				name: 'height',
				label: 'Height',
				description: 'The block height.',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'tipsetKey',
				label: 'Tipset key',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$parent',
				label: 'Parent',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.FilecoinTipset,
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Lotus_JsonRpc,
					Source.Filfox_Rest,
				],
		},
		{
				name: 'parentWeight',
				label: 'Parent weight',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Lotus_JsonRpc,
				],
		},
		{
				name: 'timestampMs',
				label: 'Timestamp',
				description: 'The observation time in Unix milliseconds.',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Lotus_JsonRpc,
					Source.Filfox_Rest,
				],
		},
		{
				name: '$$blocks',
				label: 'Blocks',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.FilecoinBlock,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Lotus_JsonRpc,
					Source.Filfox_Rest,
				],
		},
	],
} as const satisfies EntityDefinition
