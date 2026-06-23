import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum BeaconSlashingSelector {
	EvmNetworkSlotKindIndex = 'evmNetworkSlotKindIndex',
	NetworkSlotKindIndex = '$network+slot+kind+index',
}
export default {
	entityType: EntityType.BeaconSlashing,
	label: 'beacon slashing',
	labelPlural: 'beacon slashings',
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
			name: 'kind',
			label: 'kind',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'index',
			label: 'index',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
	],
} as const satisfies EntityDefinition
