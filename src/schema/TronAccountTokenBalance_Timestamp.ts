// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.TronAccountTokenBalance_Timestamp,
	labels: {
		singular: 'tron account token balance timestamp',
		plural: 'tron account token balance observations',
	},
})({
	$account: {
		label: 'Account',
		entityType: EntityType.TronAccount,
		cardinality: EntityFieldCardinality.One,
	},
	$token: {
		label: 'Token',
		entityType: EntityType.TronToken,
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
	blockHeight: {
		label: 'Block height',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	standard: {
		label: 'Standard',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.TronScan_Rest,
		],
	},
	balance: {
		label: 'Balance',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.TronScan_Rest,
		],
	},
	ownedSerialNumbers: {
		label: 'Owned serial numbers',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.Many,
	},
	tokenId: {
		label: 'Token ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.TronScan_Rest,
		],
	},
	tokenName: {
		label: 'Token name',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.TronScan_Rest,
		],
	},
	tokenSymbol: {
		label: 'Token symbol',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.TronScan_Rest,
		],
	},
	frozenBalance: {
		label: 'Frozen balance',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	delegatedBalance: {
		label: 'Delegated balance',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		AccountTokenTimestampMsSource: [
			'$account',
			'$token',
			'timestampMs',
			'source',
		],
	},
})
