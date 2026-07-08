// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BeaconSyncCommitteeSelector {
	EvmNetworkPeriod = 'EvmNetworkPeriod',
}
export const BeaconSyncCommittee = entity({
	entityType: EntityType.BeaconSyncCommittee,
	label: 'beacon sync committee',
	labelPlural: 'Beacon sync committees',
})({
	$network: {
		label: 'Network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	period: {
		label: 'Period',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	validatorIndices: {
		label: 'Validator indices',
		type: EntityFieldType.Primitive,
		primitiveType: type('number').array(),
		cardinality: EntityFieldCardinality.One,
	},
})({
	selectors: {
		EvmNetworkPeriod: [
			'$network',
			'period',
		],
	},
})
