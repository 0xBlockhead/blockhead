// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum ZeroGStorageLogEntrySelector {
	NetworkLogEntryId = 'NetworkLogEntryId',
}
export default {
	entityType: EntityType.ZeroGStorageLogEntry,
	label: 'zero g storage log entry',
	labelPlural: 'zero g storage log entries',
	selectors: [
		{
			name: ZeroGStorageLogEntrySelector.NetworkLogEntryId,
			fields: [
				'$network',
				'logEntryId',
			],
		},
	],
	fields: [
		{
			name: '$network',
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'logEntryId',
			label: 'log entry ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$dataBlob',
			label: 'data blob',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.ZeroGDataBlob,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$consensusNetwork',
			label: 'consensus network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.ZeroGConsensusNetwork,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'sequenceNumber',
			label: 'sequence number',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'commitment',
			label: 'commitment',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
