// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { NonNegativeDecimalString } from '$/schema/NonNegativeDecimalString.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.EulerEvkVaultPosition,
	labels: {
		singular: 'Euler EVK vault position',
		plural: 'Euler EVK vault positions',
	},
	description: 'An account balance in an Euler v2 EVK vault (shares, assets, and debt).',
})({
	$account: {
		entityType: EntityType.EvmNetworkAccount,
		cardinality: EntityFieldCardinality.One,
	},
	$vault: {
		entityType: EntityType.EulerEvkVault,
		cardinality: EntityFieldCardinality.One,
	},
	vaultType: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Euler_Rest,
		],
	},
	assetAddress: {
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Euler_Rest,
		],
	},
	shares: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Euler_Rest,
		],
	},
	assets: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Euler_Rest,
		],
	},
	borrowed: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Euler_Rest,
		],
	},
	assetsValue: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Euler_Rest,
		],
	},
	debtValue: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Euler_Rest,
		],
	},
	isCollateral: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Euler_Rest,
		],
	},
	isController: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Euler_Rest,
		],
	},
	balanceForwarderEnabled: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Euler_Rest,
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
