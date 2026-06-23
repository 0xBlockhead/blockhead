import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum FilecoinMinerSelector {
	NetworkMinerAddress = 'networkMinerAddress',
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
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'minerAddress',
			label: 'miner address',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$owner',
			label: 'owner',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.FilecoinActor,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$worker',
			label: 'worker',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.FilecoinActor,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'peerId',
			label: 'peer ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'qualityAdjustedPower',
			label: 'quality adjusted power',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$sectors',
			label: 'sectors',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.FilecoinSector,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
