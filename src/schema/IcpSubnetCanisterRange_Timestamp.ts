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
		label: 'subnet',
		entityType: EntityType.IcpSubnet,
		cardinality: EntityFieldCardinality.One,
	},
	rangeStart: {
		label: 'range start',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	rangeEnd: {
		label: 'range end',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	registryVersion: {
		label: 'registry version',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
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
