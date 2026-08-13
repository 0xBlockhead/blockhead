// Generated from APP.ts.

import { EvmStateChangeKind } from '$/constants/Evm.ts'
import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.EvmStateChange,
	labels: {
		singular: 'EVM state change',
		plural: 'EVM state changes',
	},
	description: 'A transaction-anchored account balance effect reported by a source indexer.',
})({
	$transaction: {
		entityType: EntityType.EvmTransaction,
		cardinality: EntityFieldCardinality.One,
	},
	stateChangeKey: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$account: {
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Blockscout_Rest,
		],
	},
	kind: {
		primitiveType: type.enumerated(...Object.values(EvmStateChangeKind)),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Blockscout_Rest,
		],
	},
	$tokenContract: {
		entityType: EntityType.EvmContract,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockscout_Rest,
		],
	},
	tokenId: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockscout_Rest,
		],
	},
	balanceBefore: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockscout_Rest,
		],
	},
	balanceAfter: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockscout_Rest,
		],
	},
	delta: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockscout_Rest,
		],
	},
	isMiner: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Blockscout_Rest,
		],
	},
})({
	selectors: {
		TransactionStateChangeKey: [
			'$transaction',
			'stateChangeKey',
		],
	},
})
