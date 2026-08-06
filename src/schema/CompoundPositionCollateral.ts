// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { NonNegativeDecimalString } from '$/schema/NonNegativeDecimalString.ts'
import { Source } from '$/sources/Source.ts'

export default entity({
	entityType: EntityType.CompoundPositionCollateral,
	labels: {
		singular: 'Compound position collateral',
		plural: 'Compound position collaterals',
	},
	description: 'An account collateral token balance within one Compound III Comet position.',
})({
	$position: {
		entityType: EntityType.CompoundPosition,
		cardinality: EntityFieldCardinality.One,
	},
	$asset: {
		entityType: EntityType.CompoundCometAsset,
		cardinality: EntityFieldCardinality.One,
	},
	balance: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Compound_Rest,
		],
	},
})({
	selectors: {
		PositionAsset: [
			'$position',
			'$asset',
		],
	},
})
