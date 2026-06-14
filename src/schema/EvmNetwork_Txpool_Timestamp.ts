import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import Network from '$/schema/EvmNetwork.ts'
import { Source } from '$/sources/Source.ts'

export enum EvmNetwork_Txpool_TimestampSelector {
	EvmNetworkTimestampMs = 'evmNetworkTimestampMs',
}

export default {
	entityType: EntityType.EvmNetwork_Txpool_Timestamp,

	label: 'Network txpool snapshot',
	labelPlural: 'Network txpool snapshots',

	selectors: [
		{
			name: EvmNetwork_Txpool_TimestampSelector.EvmNetworkTimestampMs,
			fields: [
				'$network',
				'timestampMs',
			],
		},
	],

	fields: [
		{
			name: '$network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'timestampMs',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'pendingCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Voltaire_JsonRpc,
			],
		},
		{
			name: 'queuedCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Voltaire_JsonRpc,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
