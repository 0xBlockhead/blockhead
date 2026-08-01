// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
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
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	period: {
		label: 'Period',
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	validatorIndices: {
		label: 'Validator indices',
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
