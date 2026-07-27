// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BeaconSyncCommittee,
	labels: {
		singular: 'beacon sync committee',
		plural: 'Beacon sync committees',
	},
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
		primitiveType: type('number.integer >= 0'),
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
