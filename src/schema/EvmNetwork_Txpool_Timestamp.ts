// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum EvmNetwork_Txpool_TimestampSelector {
	NetworkTimestampMsSource = 'NetworkTimestampMsSource',
}
export default {
	entityType: EntityType.EvmNetwork_Txpool_Timestamp,
	label: 'EVM network txpool timestamp',
	labelPlural: 'EVM network txpool observations',
	selectors: [
		{
			name: EvmNetwork_Txpool_TimestampSelector.NetworkTimestampMsSource,
			fields: [
				'$network',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$network',
			label: 'Network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmNetwork,
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
			name: 'pendingCount',
			label: 'Pending',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'queuedCount',
			label: 'Queued',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
	],
} as const satisfies EntityDefinition
