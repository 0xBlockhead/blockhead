import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import LightningChannel from '$/schema/LightningChannel.ts'
import { Source } from '$/sources/Source.ts'

export enum LightningHtlcSelector {
	LightningChannelHtlcIndex = 'lightningChannelHtlcIndex',
}


export enum LightningHtlcDirection {
	Incoming = 'Incoming',
	Outgoing = 'Outgoing',
}

export default {
	entityType: EntityType.LightningHtlc,

	label: 'Lightning HTLC',
	labelPlural: 'Lightning HTLCs',

	selectors: [
		{
			name: LightningHtlcSelector.LightningChannelHtlcIndex,
			fields: [
				'$channel',
				'htlcIndex',
			],
		},
	],

	fields: [
		{
			name: '$channel',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.LightningChannel,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'htlcIndex',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'direction',
			type: EntityFieldType.Primitive,
			primitiveType: type.valueOf(LightningHtlcDirection),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.LightningLnd_Rest,
			],
		},
		{
			name: 'amountMsat',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'expiryHeight',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'hashLock',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'state',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
