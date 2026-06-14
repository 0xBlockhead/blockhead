import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

export enum PolkadotValidatorSelector {
	NetworkStashAccountId = 'networkStashAccountId',
}

export default {
	entityType: EntityType.PolkadotValidator,

	label: 'Polkadot Validator',
	labelPlural: 'Polkadot Validators',

	selectors: [
		{
			name: PolkadotValidatorSelector.NetworkStashAccountId,
			fields: [
				'$network',
				'stashAccountId',
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
			name: 'stashAccountId',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$controller',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.PolkadotAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'commissionPerBillion',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'totalStakePlancks',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
