// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.AssetSupply_LedgerCoordinate,
	labels: {
		singular: 'asset supply ledger coordinate',
		plural: 'asset supply ledger coordinates',
	},
})({
	$assetInstance: {
		entityType: EntityType.AssetInstance,
		cardinality: EntityFieldCardinality.One,
	},
	supplyScopeKey: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$class: {
		entityType: EntityType.AssetClass,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	classKey: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	ledgerCoordinateKind: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	ledgerCoordinateValue: {
		primitiveType: type('bigint').narrow((value) => value >= 0n),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	totalSupply: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	maxSupply: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	mintedSupply: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	burnedSupply: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		AssetInstanceSupplyScopeKeyLedgerCoordinateKindLedgerCoordinateValueSource: [
			'$assetInstance',
			'supplyScopeKey',
			'ledgerCoordinateKind',
			'ledgerCoordinateValue',
			'source',
		],
	},
})
