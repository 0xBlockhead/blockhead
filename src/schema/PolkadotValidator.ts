import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum PolkadotValidatorSelector {
	NetworkStashAccountId = 'networkStashAccountId',
}
export default {
	entityType: EntityType.PolkadotValidator,
	label: 'polkadot validator',
	labelPlural: 'polkadot validators',
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
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'stashAccountId',
			label: 'stash account ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$$eras',
			label: 'eras',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.PolkadotValidator_Era,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
