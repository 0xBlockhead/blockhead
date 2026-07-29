// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
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
		type: EntityFieldType.EntityReference,
		entityType: EntityType.TronAccount,
		cardinality: EntityFieldCardinality.One,
	},
	$token: {
		label: 'Token',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.TronToken,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	blockHeight: {
		label: 'Block height',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	standard: {
		label: 'Standard',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.TronScan_Rest,
		],
	},
	balance: {
		label: 'Balance',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.TronScan_Rest,
		],
	},
	ownedSerialNumbers: {
		label: 'Owned serial numbers',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.Many,
	},
	tokenId: {
		label: 'Token ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.TronScan_Rest,
		],
	},
	tokenName: {
		label: 'Token name',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.TronScan_Rest,
		],
	},
	tokenSymbol: {
		label: 'Token symbol',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.TronScan_Rest,
		],
	},
	frozenBalance: {
		label: 'Frozen balance',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	delegatedBalance: {
		label: 'Delegated balance',
		type: EntityFieldType.Primitive,
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
