// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.NearAccessKey,
	labels: {
		singular: 'near access key',
		plural: 'near access keys',
	},
})({
	$account: {
		label: 'Account',
		entityType: EntityType.NearAccount,
		cardinality: EntityFieldCardinality.One,
	},
	publicKey: {
		label: 'Public key',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	nonce: {
		label: 'Nonce',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.NearRpc_JsonRpc,
		],
	},
	permission: {
		label: 'Permission',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.NearRpc_JsonRpc,
		],
	},
})({
	selectors: {
		NearAccountPublicKey: [
			'$account',
			'publicKey',
		],
	},
})
