// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BeaconSyncCommitteeSelector {
	EvmNetworkPeriod = 'EvmNetworkPeriod',
}
export default {
	entityType: EntityType.BeaconSyncCommittee,
	label: 'beacon sync committee',
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
			label: 'Network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'period',
			label: 'Period',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'validatorIndices',
			label: 'Validator indices',
			type: EntityFieldType.Primitive,
			primitiveType: type('number').array(),
			cardinality: EntityFieldCardinality.One,
		},
	],
} as const satisfies EntityDefinition
