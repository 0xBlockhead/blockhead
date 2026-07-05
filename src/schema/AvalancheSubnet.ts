// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum AvalancheSubnetSelector {
	SubnetId = 'SubnetId',
}
export default {
	entityType: EntityType.AvalancheSubnet,
	label: 'avalanche subnet',
	labelPlural: 'avalanche subnets',
	selectors: [
		{
			name: AvalancheSubnetSelector.SubnetId,
			fields: [
				'subnetId',
			],
		},
	],
	fields: [
		{
				name: 'subnetId',
				label: 'subnet ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'label',
				label: 'Label',
				description: 'A human-readable name for the subject.',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'ownerAddresses',
				label: 'owner addresses',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: 'threshold',
				label: 'threshold',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'controlKeys',
				label: 'control keys',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$blockchains',
				label: 'blockchains',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.AvalancheBlockchain,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$validators',
				label: 'validators',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.AvalancheValidator,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$delegators',
				label: 'delegators',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.AvalancheDelegator,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$timestamps',
				label: 'timestamps',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.AvalancheSubnet_Timestamp,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
