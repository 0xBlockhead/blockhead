// Generated from APP.ts.

import { dispatchAddress, dispatchEvidence } from '$/actions/execution.ts'
import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Hash32 } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadActionDispatchOccurrence,
	labels: {
		singular: 'dispatch occurrence',
		plural: 'dispatch occurrences',
	},
	description: 'One durable local record for one actual effectful boundary call.',
})({
	id: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$authorityRequest: {
		entityType: EntityType.BlockheadActionAuthorityRequest,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$walletConnection: {
		entityType: EntityType.BlockheadWalletConnection,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	address: {
		primitiveType: dispatchAddress,
		cardinality: EntityFieldCardinality.One,
	},
	startedAt: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	localEffectFingerprint: {
		primitiveType: Hash32,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	evidence: {
		primitiveType: dispatchEvidence,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$evmTransactions: {
		entityType: EntityType.EvmTransaction,
		cardinality: EntityFieldCardinality.Many,
	},
	$$xrplTransactions: {
		entityType: EntityType.XrplTransaction,
		cardinality: EntityFieldCardinality.Many,
	},
	$$cosmosTransactions: {
		entityType: EntityType.CosmosTransaction,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		Id: [
			'id',
		],
	},
})
