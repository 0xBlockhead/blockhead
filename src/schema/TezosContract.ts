// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.TezosContract,
	labels: {
		singular: 'tezos contract',
		plural: 'tezos contracts',
	},
})({
	$network: {
		label: 'network',
		entityType: EntityType.TezosNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	address: {
		label: 'Address',
		description: 'The address or account identifier used by the source protocol.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	scriptHash: {
		label: 'script hash',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	codeHash: {
		label: 'code hash',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	storageType: {
		label: 'storage type',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	parameterType: {
		label: 'parameter type',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$account: {
		label: 'account',
		entityType: EntityType.TezosAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$script: {
		label: 'script',
		entityType: EntityType.TezosMichelsonScript,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$entrypoints: {
		label: 'entrypoints',
		entityType: EntityType.TezosEntrypoint,
		cardinality: EntityFieldCardinality.Many,
	},
	$$bigMaps: {
		label: 'big maps',
		entityType: EntityType.TezosBigMap,
		cardinality: EntityFieldCardinality.Many,
	},
	$$operations: {
		label: 'operations',
		entityType: EntityType.TezosOperation,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'timestamps',
		entityType: EntityType.TezosContract_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkAddress: [
			'$network',
			'address',
		],
	},
})
