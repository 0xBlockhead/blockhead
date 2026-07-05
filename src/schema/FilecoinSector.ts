// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum FilecoinSectorSelector {
	FilecoinMinerSectorNumber = 'FilecoinMinerSectorNumber',
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
				label: 'Miner',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.FilecoinMiner,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'sectorNumber',
				label: 'Sector number',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'sealedCid',
				label: 'Sealed CID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Lotus_JsonRpc,
				],
		},
		{
				name: 'activationEpoch',
				label: 'Activation epoch',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Lotus_JsonRpc,
				],
		},
		{
				name: 'expirationEpoch',
				label: 'Expiration epoch',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Lotus_JsonRpc,
				],
		},
	],
} as const satisfies EntityDefinition
