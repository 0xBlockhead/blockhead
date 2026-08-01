// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.HederaContract,
	labels: {
		singular: 'hedera contract',
		plural: 'hedera contracts',
	},
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	contractId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	evmAddress: {
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	createdTimestamp: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$results: {
		entityType: EntityType.HederaContractResult,
		cardinality: EntityFieldCardinality.Many,
	},
	$$logs: {
		entityType: EntityType.HederaContractLog,
		cardinality: EntityFieldCardinality.Many,
	},
	$$state: {
		entityType: EntityType.HederaContractState_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		entityType: EntityType.HederaContract_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkContractId: [
			'$network',
			'contractId',
		],
	},
})
