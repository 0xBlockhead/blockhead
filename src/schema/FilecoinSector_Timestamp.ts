// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum FilecoinSector_TimestampSelector {
	SectorTimestampMsSource = 'SectorTimestampMsSource',
}
export default {
	entityType: EntityType.FilecoinSector_Timestamp,
	label: 'filecoin sector timestamp',
	labelPlural: 'filecoin sector observations',
	selectors: [
		{
			name: FilecoinSector_TimestampSelector.SectorTimestampMsSource,
			fields: [
				'$sector',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
				name: '$sector',
				label: 'Sector',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.FilecoinSector,
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
				name: 'sealedCid',
				label: 'Sealed CID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Lotus_JsonRpc,
				],
		},
		{
				name: 'activationEpoch',
				label: 'Activation epoch',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Lotus_JsonRpc,
				],
		},
		{
				name: 'expirationEpoch',
				label: 'Expiration epoch',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Lotus_JsonRpc,
				],
		},
		{
				name: 'dealIds',
				label: 'Deal IDs',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
