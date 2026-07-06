// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BlockheadMoneroTransferState_TimestampSelector {
	TransferStateTimestampMsSource = 'TransferStateTimestampMsSource',
}
export default {
	entityType: EntityType.BlockheadMoneroTransferState_Timestamp,
	label: 'blockhead monero transfer state timestamp',
	labelPlural: 'blockhead monero transfer state observations',
	selectors: [
		{
			name: BlockheadMoneroTransferState_TimestampSelector.TransferStateTimestampMsSource,
			fields: [
				'$transferState',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$transferState',
			label: 'transfer state',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.BlockheadMoneroTransferState,
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
			name: 'confirmations',
			label: 'confirmations',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'unlockTime',
			label: 'unlock time',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'spent',
			label: 'spent',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'lastCheckedAt',
			label: 'last checked AT',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
