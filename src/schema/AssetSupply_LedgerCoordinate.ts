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
		label: 'asset instance',
		entityType: EntityType.AssetInstance,
		cardinality: EntityFieldCardinality.One,
	},
	supplyScopeKey: {
		label: 'supply scope key',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$class: {
		label: 'class',
		entityType: EntityType.AssetClass,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	classKey: {
		label: 'class key',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	ledgerCoordinateKind: {
		label: 'ledger coordinate kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	ledgerCoordinateValue: {
		label: 'ledger coordinate value',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	totalSupply: {
		label: 'total supply',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	maxSupply: {
		label: 'max supply',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	mintedSupply: {
		label: 'minted supply',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	burnedSupply: {
		label: 'burned supply',
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
