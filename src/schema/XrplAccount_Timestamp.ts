// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.XrplAccount_Timestamp,
	labels: {
		singular: 'xrpl account timestamp',
		plural: 'xrpl account observations',
	},
})({
	$account: {
		entityType: EntityType.XrplAccount,
		cardinality: EntityFieldCardinality.One,
	},
	ledgerIndex: {
		primitiveType: type('bigint').narrow((value) => value >= 0n),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	balanceDrops: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Xrpl_Rippled,
			Source.XrpScan_Rest,
		],
	},
	ownerCount: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Xrpl_Rippled,
			Source.XrpScan_Rest,
		],
	},
	sequence: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Xrpl_Rippled,
			Source.XrpScan_Rest,
		],
	},
	flags: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Xrpl_Rippled,
			Source.XrpScan_Rest,
		],
	},
})({
	selectors: {
		AccountLedgerIndexSource: [
			'$account',
			'ledgerIndex',
			'source',
		],
	},
})
