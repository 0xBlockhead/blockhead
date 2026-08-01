// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.TonJettonBalance_Timestamp,
	labels: {
		singular: 'ton jetton balance timestamp',
		plural: 'ton jetton balance observations',
	},
})({
	$account: {
		label: 'account',
		entityType: EntityType.TonAccount,
		cardinality: EntityFieldCardinality.One,
	},
	$jetton: {
		label: 'jetton',
		entityType: EntityType.TonJetton,
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
	jettonWalletAddress: {
		label: 'jetton wallet address',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	balanceNano: {
		label: 'balance nano',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	ownerAddress: {
		label: 'owner address',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	masterAddress: {
		label: 'master address',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	lastTransactionLt: {
		label: 'last transaction lt',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	locked: {
		label: 'locked',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		AccountJettonTimestampMsSource: [
			'$account',
			'$jetton',
			'timestampMs',
			'source',
		],
	},
})
