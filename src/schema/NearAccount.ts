// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

const nearRpcJsonRpcSources = [
	Source.NearRpc_JsonRpc,
] as const

export default entity({
	entityType: EntityType.NearAccount,
	labels: {
		singular: 'near account',
		plural: 'near accounts',
	},
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	accountId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	amountYoctoNear: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.NearRpc_JsonRpc,
			Source.NearBlocks_Rest,
		],
	},
	storageUsageBytes: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: nearRpcJsonRpcSources,
	},
	$contract: {
		entityType: EntityType.NearContract,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: nearRpcJsonRpcSources,
	},
	$$accessKeys: {
		entityType: EntityType.NearAccessKey,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: nearRpcJsonRpcSources,
	},
})({
	selectors: {
		NetworkAccountId: [
			'$network',
			'accountId',
		],
	},
})
