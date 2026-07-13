// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum TezosMichelsonScriptSelector {
	NetworkScriptHash = 'NetworkScriptHash',
}
export const TezosMichelsonScript = entity({
	entityType: EntityType.TezosMichelsonScript,
	labels: {
		singular: 'tezos michelson script',
		plural: 'tezos michelson scripts',
	},
})({
	$network: {
		label: 'network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.TezosNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	scriptHash: {
		label: 'script hash',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	codeHash: {
		label: 'code hash',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	parameterType: {
		label: 'parameter type',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	storageType: {
		label: 'storage type',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	code: {
		label: 'code',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	micheline: {
		label: 'micheline',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	michelson: {
		label: 'michelson',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	tzip16MetadataUri: {
		label: 'tzip16 metadata URI',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$contracts: {
		label: 'contracts',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.TezosContract,
		cardinality: EntityFieldCardinality.Many,
	},
	$$entrypoints: {
		label: 'entrypoints',
		type: EntityFieldType.EntitiesReference,
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
