import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import EvmContract from '$/schema/EvmContract.ts'
import { Source } from '$/sources/Source.ts'

export enum EvmContractCompilationSelector {
	EvmContract = 'evmContract',
}

export default {
	entityType: EntityType.EvmContractCompilation,

	label: 'EVM contract compilation',
	labelPlural: 'EVM contract compilations',

	selectors: [
		{
			name: EvmContractCompilationSelector.EvmContract,
			fields: [
				'$contract',
			],
		},
	],

	fields: [
		{
			name: '$contract',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmContract,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'language',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Sourcify_Rest,
			],
		},
		{
			name: 'compiler',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Sourcify_Rest,
			],
		},
		{
			name: 'compilerVersion',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Sourcify_Rest,
			],
		},
		{
			name: 'name',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Sourcify_Rest,
			],
		},
		{
			name: 'fullyQualifiedName',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Sourcify_Rest,
			],
		},
		{
			name: 'compilerSettingsJson',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Sourcify_Rest,
			],
		},
		{
			name: 'storageLayoutJson',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Sourcify_Rest,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
