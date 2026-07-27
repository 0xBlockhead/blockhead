// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
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
		type: EntityFieldType.EntityReference,
		entityType: EntityType.TezosNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	address: {
		label: 'Address',
		description: 'The address or account identifier used by the source protocol.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	scriptHash: {
		label: 'script hash',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	codeHash: {
		label: 'code hash',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	storageType: {
		label: 'storage type',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	parameterType: {
		label: 'parameter type',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$account: {
		label: 'account',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.TezosAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$script: {
		label: 'script',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.TezosMichelsonScript,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$entrypoints: {
		label: 'entrypoints',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.TezosEntrypoint,
		cardinality: EntityFieldCardinality.Many,
	},
	$$bigMaps: {
		label: 'big maps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.TezosBigMap,
		cardinality: EntityFieldCardinality.Many,
	},
	$$operations: {
		label: 'operations',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.TezosOperation,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
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
