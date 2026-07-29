// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
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
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	contractId: {
		label: 'contract ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	evmAddress: {
		label: 'EVM address',
		type: EntityFieldType.Primitive,
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	createdTimestamp: {
		label: 'created timestamp',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$results: {
		label: 'results',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.HederaContractResult,
		cardinality: EntityFieldCardinality.Many,
	},
	$$logs: {
		label: 'logs',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.HederaContractLog,
		cardinality: EntityFieldCardinality.Many,
	},
	$$state: {
		label: 'state',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.HederaContractState_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
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
