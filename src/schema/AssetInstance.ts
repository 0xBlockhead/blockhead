// Generated from APP.ts.

import { CoinId } from '$/constants/Coin.ts'
import { entity } from '$/schema/$schema.ts'
import { AssetInstanceKind } from '$/schema/AssetInstanceKind.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.AssetInstance,
	labels: {
		singular: 'Asset instance',
		plural: 'asset instances',
	},
	description: 'A concrete asset on a specific network or venue, such as a native coin, token, share, or collectible.',
})({
	$network: {
		label: 'Network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	kind: {
		label: 'Kind',
		primitiveType: type.enumerated(...Object.values(AssetInstanceKind)),
		cardinality: EntityFieldCardinality.One,
	},
	assetKey: {
		label: 'Asset key',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	coinId: {
		label: 'Coin ID',
		primitiveType: type.enumerated(...Object.values(CoinId)),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	name: {
		label: 'Name',
		description: 'The human-readable name of the subject.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	symbol: {
		label: 'Symbol',
		description: 'The short ticker or symbol used for display.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	decimals: {
		label: 'Decimals',
		description: 'The number of decimal places used to display the amount.',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$icon: {
		label: 'Icon',
		entityType: EntityType.Media,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$formats: {
		label: 'Formats',
		entityType: EntityType.AssetFormatSupport_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$metadata: {
		label: 'Metadata',
		entityType: EntityType.TokenMetadataDocument,
		cardinality: EntityFieldCardinality.Many,
	},
	$$tokenProgramExtensions: {
		label: 'Token program extensions',
		entityType: EntityType.TokenProgramExtension_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$regulatedProfiles: {
		label: 'regulated profiles',
		entityType: EntityType.RegulatedAssetProfile,
		cardinality: EntityFieldCardinality.Many,
	},
	$$transferRestrictions: {
		label: 'transfer restrictions',
		entityType: EntityType.TransferRestriction,
		cardinality: EntityFieldCardinality.Many,
	},
	$$nftCollections: {
		label: 'NFT collections',
		entityType: EntityType.NftCollection,
		cardinality: EntityFieldCardinality.Many,
	},
	$$payouts: {
		label: 'payouts',
		entityType: EntityType.Payout,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkKindAssetKey: [
			'$network',
			'kind',
			'assetKey',
		],
	},
})
