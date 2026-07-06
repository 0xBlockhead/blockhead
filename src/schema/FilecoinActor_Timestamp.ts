// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum FilecoinActor_TimestampSelector {
	ActorTimestampMsSource = 'ActorTimestampMsSource',
}
export default {
	entityType: EntityType.FilecoinActor_Timestamp,
	label: 'filecoin actor timestamp',
	labelPlural: 'filecoin actor observations',
	selectors: [
		{
			name: FilecoinActor_TimestampSelector.ActorTimestampMsSource,
			fields: [
				'$actor',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$actor',
			label: 'Actor',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.FilecoinActor,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'timestampMs',
			label: 'Timestamp',
			description: 'The observation time in Unix milliseconds.',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
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
			name: 'height',
			label: 'Height',
			description: 'The block height.',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'tipsetKey',
			label: 'Tipset key',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$tipset',
			label: 'Tipset',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.FilecoinTipset,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'actorCodeCid',
			label: 'Actor code CID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Lotus_JsonRpc,
			],
		},
		{
			name: 'nonce',
			label: 'Nonce',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Lotus_JsonRpc,
			],
		},
		{
			name: 'balanceAttoFil',
			label: 'Balance attoFIL',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Lotus_JsonRpc,
			],
		},
		{
			name: 'stateRootCid',
			label: 'State root CID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Lotus_JsonRpc,
			],
		},
	],
} as const satisfies EntityDefinition
