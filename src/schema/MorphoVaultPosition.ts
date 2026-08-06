// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { NonNegativeDecimalString } from '$/schema/NonNegativeDecimalString.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.MorphoVaultPosition,
	labels: {
		singular: 'Morpho vault position',
		plural: 'Morpho vault positions',
	},
	description: 'An account share balance in a MetaMorpho vault.',
})({
	$account: {
		entityType: EntityType.EvmNetworkAccount,
		cardinality: EntityFieldCardinality.One,
	},
	$vault: {
		entityType: EntityType.MorphoVault,
		cardinality: EntityFieldCardinality.One,
	},
	assets: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Morpho_Graphql,
		],
	},
	shares: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Morpho_Graphql,
		],
	},
	assetsUsd: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Morpho_Graphql,
		],
	},
})({
	selectors: {
		AccountVault: [
			'$account',
			'$vault',
		],
	},
})
