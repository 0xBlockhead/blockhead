// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum IcpSubnetCanisterRange_TimestampSelector {
	SubnetRangeStartRangeEndRegistryVersionSource = 'SubnetRangeStartRangeEndRegistryVersionSource',
}
export const IcpSubnetCanisterRange_Timestamp = entity({
	entityType: EntityType.IcpSubnetCanisterRange_Timestamp,
	label: 'icp subnet canister range timestamp',
	labelPlural: 'icp subnet canister range observations',
})({
	$subnet: {
		label: 'subnet',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.IcpSubnet,
		cardinality: EntityFieldCardinality.One,
	},
	rangeStart: {
		label: 'range start',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	rangeEnd: {
		label: 'range end',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	registryVersion: {
		label: 'registry version',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		type: EntityFieldType.Primitive,
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
