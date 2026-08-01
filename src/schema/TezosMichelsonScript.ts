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
		entityType: EntityType.TezosNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	scriptHash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	codeHash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	parameterType: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	storageType: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	code: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	micheline: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	michelson: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	tzip16MetadataUri: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$contracts: {
		entityType: EntityType.TezosContract,
		cardinality: EntityFieldCardinality.Many,
	},
	$$entrypoints: {
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
