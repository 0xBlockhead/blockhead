import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

export enum BeaconSlashingSelector {
	EvmNetworkSlotKindIndex = 'evmNetworkSlotKindIndex',
}

export default {
	entityType: EntityType.BeaconSlashing,

	label: 'Beacon slashing',
	labelPlural: 'Beacon slashings',

	selectors: [
		{
			name: BeaconSlashingSelector.EvmNetworkSlotKindIndex,
			fields: [
				'$network',
				'slot',
				'kind',
				'index',
			],
		},
	],

	fields: [
		{
			name: '$network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'slot',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'kind',
			type: EntityFieldType.Primitive,
			primitiveType: type('"attester" | "proposer"'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'index',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
