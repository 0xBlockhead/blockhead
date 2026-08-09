// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.IcpSubnetCanisterRange_Timestamp,
	labels: {
		singular: 'icp subnet canister range timestamp',
		plural: 'icp subnet canister range observations',
	},
})({
	$subnet: {
		entityType: EntityType.IcpSubnet,
		cardinality: EntityFieldCardinality.One,
	},
	rangeStart: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	rangeEnd: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	registryVersion: {
		primitiveType: type('bigint').narrow((value) => value >= 0n),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		SubnetRangeStartRangeEndRegistryVersionSource: [
			'$subnet',
			'rangeStart',
			'rangeEnd',
			'registryVersion',
			'source',
		],
	},
})
