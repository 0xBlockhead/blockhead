// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BlockheadFedimintClientState_TimestampSelector {
	ClientStateTimestampMsSource = 'ClientStateTimestampMsSource',
}
export default {
	entityType: EntityType.BlockheadFedimintClientState_Timestamp,
	label: 'blockhead Fedimint client state timestamp',
	labelPlural: 'blockhead Fedimint client state observations',
	selectors: [
		{
			name: BlockheadFedimintClientState_TimestampSelector.ClientStateTimestampMsSource,
			fields: [
				'$clientState',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
				name: '$clientState',
				label: 'client state',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.BlockheadFedimintClientState,
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
				name: 'balanceMsat',
				label: 'balance msat',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'ecashBalanceMsat',
				label: 'ecash balance msat',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'lightningBalanceMsat',
				label: 'Lightning balance msat',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'onchainBalanceSats',
				label: 'onchain balance sats',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'recoveryState',
				label: 'recovery state',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'lastSyncedAt',
				label: 'last synced AT',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'ecashNoteCountsJson',
				label: 'ecash note counts JSON',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'oobNotesJson',
				label: 'oob notes JSON',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'operationSummaryJson',
				label: 'operation summary JSON',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
