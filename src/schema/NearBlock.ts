// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum NearBlockSelector {
	NetworkHeight = 'NetworkHeight',
	NetworkHeightHash = 'NetworkHeightHash',
}
export default {
	entityType: EntityType.NearBlock,
	label: 'near block',
	labelPlural: 'near blocks',
	selectors: [
		{
			name: NearBlockSelector.NetworkHeight,
			fields: [
				'$network',
				'height',
			],
		},
		{
			name: NearBlockSelector.NetworkHeightHash,
			fields: [
				'$network',
				'height',
				'hash',
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
				name: 'hash',
				label: 'Hash',
				description: 'The hash that identifies this object in its protocol.',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$parent',
				label: 'Parent',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.NearBlock,
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.NearRpc_JsonRpc,
					Source.NearBlocks_Rest,
					Source.ThreeXpl_Rest,
				],
		},
		{
				name: 'epochId',
				label: 'Epoch ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.NearRpc_JsonRpc,
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
					Source.NearRpc_JsonRpc,
					Source.NearBlocks_Rest,
					Source.ThreeXpl_Rest,
				],
		},
		{
				name: '$$chunks',
				label: 'Chunks',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.NearChunk,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.NearRpc_JsonRpc,
				],
		},
	],
} as const satisfies EntityDefinition
