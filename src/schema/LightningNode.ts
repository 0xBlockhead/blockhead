// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum LightningNodeSelector {
	NetworkPublicKey = 'NetworkPublicKey',
}
export default {
	entityType: EntityType.LightningNode,
	label: 'Lightning node',
	labelPlural: 'Lightning nodes',
	selectors: [
		{
			name: LightningNodeSelector.NetworkPublicKey,
			fields: [
				'$network',
				'publicKey',
			],
		},
	],
	fields: [
		{
				name: '$network',
				label: 'Network',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.Network,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'publicKey',
				label: 'Public key',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'alias',
				label: 'Alias',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'capacitySats',
				label: 'Capacity sats',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'channelCount',
				label: 'Channels',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'countryCode',
				label: 'Country',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'city',
				label: 'City',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'networkAddresses',
				label: 'Network addresses',
				type: EntityFieldType.Primitive,
				primitiveType: type('string').array(),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$$timestamps',
				label: 'Observations',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.LightningNode_Timestamp,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$channels',
				label: 'Channels',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.LightningChannel,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
