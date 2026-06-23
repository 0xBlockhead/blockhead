import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum AssetSupply_LedgerCoordinateSelector {
	AssetInstanceSupplyScopeKeyLedgerCoordinateKindLedgerCoordinateValueSource = '$assetInstance+supplyScopeKey+ledgerCoordinateKind+ledgerCoordinateValue+source',
}
export default {
	entityType: EntityType.AssetSupply_LedgerCoordinate,
	label: 'asset supply ledger coordinate',
	labelPlural: 'asset supply ledger coordinates',
	selectors: [
		{
			name: AssetSupply_LedgerCoordinateSelector.AssetInstanceSupplyScopeKeyLedgerCoordinateKindLedgerCoordinateValueSource,
			fields: [
				'$assetInstance',
				'supplyScopeKey',
				'ledgerCoordinateKind',
				'ledgerCoordinateValue',
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
			name: 'supplyScopeKey',
			label: 'supply scope key',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$class',
			label: 'class',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.AssetClass,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'classKey',
			label: 'class key',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'ledgerCoordinateKind',
			label: 'ledger coordinate kind',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'ledgerCoordinateValue',
			label: 'ledger coordinate value',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
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
			name: 'totalSupply',
			label: 'total supply',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'maxSupply',
			label: 'max supply',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'mintedSupply',
			label: 'minted supply',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'burnedSupply',
			label: 'burned supply',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
