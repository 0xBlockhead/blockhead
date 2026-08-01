// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.TezosMichelsonScript,
	labels: {
		singular: 'tezos michelson script',
		plural: 'tezos michelson scripts',
	},
})({
	$network: {
		label: 'network',
		entityType: EntityType.TezosNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	scriptHash: {
		label: 'script hash',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	codeHash: {
		label: 'code hash',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	parameterType: {
		label: 'parameter type',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	storageType: {
		label: 'storage type',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	code: {
		label: 'code',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	micheline: {
		label: 'micheline',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	michelson: {
		label: 'michelson',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	tzip16MetadataUri: {
		label: 'tzip16 metadata URI',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$contracts: {
		label: 'contracts',
		entityType: EntityType.TezosContract,
		cardinality: EntityFieldCardinality.Many,
	},
	$$entrypoints: {
		label: 'entrypoints',
		entityType: EntityType.TezosEntrypoint,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkScriptHash: [
			'$network',
			'scriptHash',
		],
	},
})
