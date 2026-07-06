// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum TezosMichelsonScriptSelector {
	NetworkScriptHash = 'NetworkScriptHash',
}
export default {
	entityType: EntityType.TezosMichelsonScript,
	label: 'tezos michelson script',
	labelPlural: 'tezos michelson scripts',
	selectors: [
		{
			name: TezosMichelsonScriptSelector.NetworkScriptHash,
			fields: [
				'$network',
				'scriptHash',
			],
		},
	],
	fields: [
		{
			name: '$network',
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.TezosNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'scriptHash',
			label: 'script hash',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'codeHash',
			label: 'code hash',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'parameterType',
			label: 'parameter type',
			type: EntityFieldType.Primitive,
			primitiveType: type('unknown'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'storageType',
			label: 'storage type',
			type: EntityFieldType.Primitive,
			primitiveType: type('unknown'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'code',
			label: 'code',
			type: EntityFieldType.Primitive,
			primitiveType: type('unknown'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'micheline',
			label: 'micheline',
			type: EntityFieldType.Primitive,
			primitiveType: type('unknown'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'michelson',
			label: 'michelson',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'tzip16MetadataUri',
			label: 'tzip16 metadata URI',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$contracts',
			label: 'contracts',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.TezosContract,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$entrypoints',
			label: 'entrypoints',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.TezosEntrypoint,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
