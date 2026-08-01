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
		label: 'network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	contractId: {
		label: 'contract ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	evmAddress: {
		label: 'EVM address',
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	createdTimestamp: {
		label: 'created timestamp',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$results: {
		label: 'results',
		entityType: EntityType.HederaContractResult,
		cardinality: EntityFieldCardinality.Many,
	},
	$$logs: {
		label: 'logs',
		entityType: EntityType.HederaContractLog,
		cardinality: EntityFieldCardinality.Many,
	},
	$$state: {
		label: 'state',
		entityType: EntityType.HederaContractState_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'timestamps',
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
