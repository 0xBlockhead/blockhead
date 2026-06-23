import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum BeaconCommitteeSelector {
	EvmNetworkSlotIndex = 'evmNetworkSlotIndex',
	NetworkSlotIndex = '$network+slot+index',
}
export default {
	entityType: EntityType.BeaconCommittee,
	label: 'beacon committee',
	labelPlural: 'beacon committees',
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
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'slot',
			label: 'slot',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'index',
			label: 'index',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'validatorIndices',
			label: 'validator indices',
			type: EntityFieldType.Primitive,
			primitiveType: type("number[]"),
			cardinality: EntityFieldCardinality.One,
		},
	],
} as const satisfies EntityDefinition
