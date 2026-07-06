// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum TezosBakingRightSelector {
	NetworkCycleLevelRightKindBakerAddressSource = 'NetworkCycleLevelRightKindBakerAddressSource',
}
export default {
	entityType: EntityType.TezosBakingRight,
	label: 'tezos baking right',
	labelPlural: 'tezos baking rights',
	selectors: [
		{
			name: TezosBakingRightSelector.NetworkCycleLevelRightKindBakerAddressSource,
			fields: [
				'$network',
				'cycle',
				'level',
				'rightKind',
				'bakerAddress',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$network',
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.TezosNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'cycle',
			label: 'cycle',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'level',
			label: 'level',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'rightKind',
			label: 'right kind',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'bakerAddress',
			label: 'baker address',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'source',
			label: 'Source',
			description: 'The source that produced this observation.',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$baker',
			label: 'baker',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.TezosBaker,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'round',
			label: 'round',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'slots',
			label: 'slots',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'priority',
			label: 'priority',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.TezosBakingRight_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
