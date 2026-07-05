// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum TokenProgramExtension_TimestampSelector {
	AssetInstanceExtensionKindExtensionScopeTimestampMsSource = 'AssetInstanceExtensionKindExtensionScopeTimestampMsSource',
}
export default {
	entityType: EntityType.TokenProgramExtension_Timestamp,
	label: 'token program extension timestamp',
	labelPlural: 'token program extension observations',
	selectors: [
		{
			name: TokenProgramExtension_TimestampSelector.AssetInstanceExtensionKindExtensionScopeTimestampMsSource,
			fields: [
				'$assetInstance',
				'extensionKind',
				'extensionScope',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
				name: '$assetInstance',
				label: 'Asset instance',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.AssetInstance,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'extensionKind',
				label: 'Extension kind',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'extensionScope',
				label: 'Extension scope',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'timestampMs',
				label: 'Timestamp',
				description: 'The observation time in Unix milliseconds.',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'source',
				label: 'Source',
				description: 'The source that produced this observation.',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'config',
				label: 'Config',
				type: EntityFieldType.Primitive,
				primitiveType: type('unknown'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'authoritySelector',
				label: 'Authority selector',
				type: EntityFieldType.Primitive,
				primitiveType: type('unknown'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'ledgerCoordinateKind',
				label: 'Ledger coordinate kind',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'ledgerCoordinateValue',
				label: 'Ledger coordinate value',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
