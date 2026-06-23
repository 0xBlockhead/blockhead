import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum BeaconSyncCommitteeSelector {
	EvmNetworkPeriod = 'evmNetworkPeriod',
	NetworkPeriod = '$network+period',
}
export default {
	entityType: EntityType.BeaconSyncCommittee,
	label: 'beacon sync committee',
	labelPlural: 'beacon sync committees',
	selectors: [
		{
			name: BeaconSyncCommitteeSelector.EvmNetworkPeriod,
			fields: [
				'$network',
				'period',
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
			name: 'period',
			label: 'period',
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
