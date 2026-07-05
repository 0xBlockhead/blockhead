// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum FilecoinMinerSelector {
	NetworkMinerAddress = 'NetworkMinerAddress',
}
export default {
	entityType: EntityType.FilecoinMiner,
	label: 'filecoin miner',
	labelPlural: 'filecoin miners',
	selectors: [
		{
			name: FilecoinMinerSelector.NetworkMinerAddress,
			fields: [
				'$network',
				'minerAddress',
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
				name: 'minerAddress',
				label: 'Miner address',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$owner',
				label: 'Owner',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.FilecoinActor,
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Lotus_JsonRpc,
					Source.Filfox_Rest,
				],
		},
		{
				name: '$worker',
				label: 'Worker',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.FilecoinActor,
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Lotus_JsonRpc,
					Source.Filfox_Rest,
				],
		},
		{
				name: 'peerId',
				label: 'Peer ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Lotus_JsonRpc,
					Source.Filfox_Rest,
				],
		},
		{
				name: 'qualityAdjustedPower',
				label: 'Quality adjusted power',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Lotus_JsonRpc,
					Source.Filfox_Rest,
				],
		},
		{
				name: '$$sectors',
				label: 'Sectors',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.FilecoinSector,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Lotus_JsonRpc,
				],
		},
	],
} as const satisfies EntityDefinition
