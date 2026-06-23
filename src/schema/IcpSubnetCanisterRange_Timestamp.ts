import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum IcpSubnetCanisterRange_TimestampSelector {
	SubnetRangeStartRangeEndRegistryVersionSource = '$subnet+rangeStart+rangeEnd+registryVersion+source',
}
export default {
	entityType: EntityType.IcpSubnetCanisterRange_Timestamp,
	label: 'icp subnet canister range timestamp',
	labelPlural: 'icp subnet canister range observations',
	selectors: [
		{
			name: IcpSubnetCanisterRange_TimestampSelector.SubnetRangeStartRangeEndRegistryVersionSource,
			fields: [
				'$subnet',
				'rangeStart',
				'rangeEnd',
				'registryVersion',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$subnet',
			label: 'subnet',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.IcpSubnet,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'rangeStart',
			label: 'range start',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'rangeEnd',
			label: 'range end',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'registryVersion',
			label: 'registry version',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'source',
			label: 'Source',
			description: 'The source that produced this observation.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'timestampMs',
			label: 'Timestamp',
			description: 'The observation time in Unix milliseconds.',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
