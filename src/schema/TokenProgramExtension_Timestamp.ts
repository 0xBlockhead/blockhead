// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.TokenProgramExtension_Timestamp,
	labels: {
		singular: 'token program extension timestamp',
		plural: 'token program extension observations',
	},
})({
	$assetInstance: {
		entityType: EntityType.AssetInstance,
		cardinality: EntityFieldCardinality.One,
	},
	extensionKind: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	extensionScope: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	config: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	authoritySelector: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	ledgerCoordinateKind: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	ledgerCoordinateValue: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		AssetInstanceExtensionKindExtensionScopeTimestampMsSource: [
			'$assetInstance',
			'extensionKind',
			'extensionScope',
			'timestampMs',
			'source',
		],
	},
})
