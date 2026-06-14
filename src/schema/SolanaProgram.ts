import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

export enum SolanaProgramSelector {
	NetworkProgramId = 'networkProgramId',
}

export default {
	entityType: EntityType.SolanaProgram,

	label: 'Solana Program',
	labelPlural: 'Solana Programs',

	selectors: [
		{
			name: SolanaProgramSelector.NetworkProgramId,
			fields: [
				'$network',
				'programId',
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
			name: 'programId',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'name',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$programAccount',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.SolanaAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$upgradeAuthority',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.SolanaAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
