import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum FilecoinSectorSelector {
	FilecoinMinerSectorNumber = 'filecoinMinerSectorNumber',
	MinerSectorNumber = '$miner+sectorNumber',
}
export default {
	entityType: EntityType.FilecoinSector,
	label: 'filecoin sector',
	labelPlural: 'filecoin sectors',
	selectors: [
		{
			name: FilecoinSectorSelector.FilecoinMinerSectorNumber,
			fields: [
				'$miner',
				'sectorNumber',
			],
		},
	],
	fields: [
		{
			name: '$miner',
			label: 'miner',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.FilecoinMiner,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'sectorNumber',
			label: 'sector number',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'sealedCid',
			label: 'sealed CID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'activationEpoch',
			label: 'activation epoch',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'expirationEpoch',
			label: 'expiration epoch',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
