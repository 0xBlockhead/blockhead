import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

export enum BeaconSyncCommitteeSelector {
	EvmNetworkPeriod = 'evmNetworkPeriod',
}

export default {
	entityType: EntityType.BeaconSyncCommittee,

	label: 'Beacon sync committee',
	labelPlural: 'Beacon sync committees',

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
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'period',
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
