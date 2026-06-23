import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum TokenProgramExtension_TimestampSelector {
	AssetInstanceExtensionKindExtensionScopeTimestampMsSource = '$assetInstance+extensionKind+extensionScope+timestampMs+source',
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
			label: 'asset instance',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.AssetInstance,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'extensionKind',
			label: 'extension kind',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'extensionScope',
			label: 'extension scope',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'timestampMs',
			label: 'Timestamp',
			description: 'The observation time in Unix milliseconds.',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'source',
			label: 'Source',
			description: 'The source that produced this observation.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'config',
			label: 'config',
			type: EntityFieldType.Primitive,
			primitiveType: type("unknown"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'authoritySelector',
			label: 'authority selector',
			type: EntityFieldType.Primitive,
			primitiveType: type("unknown"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'ledgerCoordinateKind',
			label: 'ledger coordinate kind',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'ledgerCoordinateValue',
			label: 'ledger coordinate value',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
