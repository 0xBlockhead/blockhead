import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

export enum ZeroGStorageLogEntrySelector {
	NetworkLogEntryId = 'networkLogEntryId',
}

export default {
	entityType: EntityType.ZeroGStorageLogEntry,

	label: '0G storage log entry',
	labelPlural: '0G storage log entries',

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
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'logEntryId',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$dataBlob',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.ZeroGDataBlob,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$consensusNetwork',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.ZeroGConsensusNetwork,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'sequenceNumber',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'commitment',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
