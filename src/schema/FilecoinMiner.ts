import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

export enum FilecoinMinerSelector {
	NetworkMinerAddress = 'networkMinerAddress',
}

export default {
	entityType: EntityType.FilecoinMiner,

	label: 'Filecoin Miner',
	labelPlural: 'Filecoin Miners',

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
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'minerAddress',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$owner',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.FilecoinActor,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$worker',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.FilecoinActor,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'peerId',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'qualityAdjustedPower',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$sectors',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.FilecoinSector,
			cardinality: EntityFieldCardinality.ZeroOrMany,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
