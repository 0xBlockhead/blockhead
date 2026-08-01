// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadFedimintClientState_Timestamp,
	labels: {
		singular: 'blockhead Fedimint client state timestamp',
		plural: 'blockhead Fedimint client state observations',
	},
})({
	$clientState: {
		label: 'client state',
		entityType: EntityType.BlockheadFedimintClientState,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	balanceMsat: {
		label: 'balance msat',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	ecashBalanceMsat: {
		label: 'ecash balance msat',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	lightningBalanceMsat: {
		label: 'Lightning balance msat',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	onchainBalanceSats: {
		label: 'onchain balance sats',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	recoveryState: {
		label: 'recovery state',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	lastSyncedAt: {
		label: 'last synced AT',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	ecashNoteCountsJson: {
		label: 'ecash note counts JSON',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	oobNotesJson: {
		label: 'oob notes JSON',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	operationSummaryJson: {
		label: 'operation summary JSON',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		ClientStateTimestampMsSource: [
			'$clientState',
			'timestampMs',
			'source',
		],
	},
})
