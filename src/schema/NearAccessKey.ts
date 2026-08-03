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
	entityType: EntityType.NearAccessKey,
	labels: {
		singular: 'near access key',
		plural: 'near access keys',
	},
})({
	$account: {
		entityType: EntityType.NearAccount,
		cardinality: EntityFieldCardinality.One,
	},
	publicKey: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	nonce: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: nearRpcJsonRpcSources,
	},
	permission: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: nearRpcJsonRpcSources,
	},
})({
	selectors: {
		NearAccountPublicKey: [
			'$account',
			'publicKey',
		],
	},
})
