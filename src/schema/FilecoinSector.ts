import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

export enum FilecoinSectorSelector {
	FilecoinMinerSectorNumber = 'filecoinMinerSectorNumber',
}

export default {
	entityType: EntityType.FilecoinSector,

	label: 'Filecoin Sector',
	labelPlural: 'Filecoin Sectors',

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
			type: EntityFieldType.EntityReference,
			entityType: EntityType.FilecoinMiner,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'sectorNumber',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'sealedCid',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'activationEpoch',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'expirationEpoch',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
