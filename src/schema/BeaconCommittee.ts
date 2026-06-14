import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

export enum BeaconCommitteeSelector {
	EvmNetworkSlotIndex = 'evmNetworkSlotIndex',
}

export default {
	entityType: EntityType.BeaconCommittee,

	label: 'Beacon committee',
	labelPlural: 'Beacon committees',

	selectors: [
		{
			name: BeaconCommitteeSelector.EvmNetworkSlotIndex,
			fields: [
				'$network',
				'slot',
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
			name: 'index',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'validatorIndices',
			type: EntityFieldType.Primitive,
			primitiveType: type('number[]'),
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Beacon_Rest,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
