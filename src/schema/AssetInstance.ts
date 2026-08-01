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
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	kind: {
		primitiveType: type.enumerated(...Object.values(AssetInstanceKind)),
		cardinality: EntityFieldCardinality.One,
	},
	assetKey: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	coinId: {
		primitiveType: type.enumerated(...Object.values(CoinId)),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	name: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	symbol: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	decimals: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$icon: {
		entityType: EntityType.Media,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$formats: {
		entityType: EntityType.AssetFormatSupport_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$metadata: {
		entityType: EntityType.TokenMetadataDocument,
		cardinality: EntityFieldCardinality.Many,
	},
	$$tokenProgramExtensions: {
		entityType: EntityType.TokenProgramExtension_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$regulatedProfiles: {
		entityType: EntityType.RegulatedAssetProfile,
		cardinality: EntityFieldCardinality.Many,
	},
	$$transferRestrictions: {
		entityType: EntityType.TransferRestriction,
		cardinality: EntityFieldCardinality.Many,
	},
	$$nftCollections: {
		entityType: EntityType.NftCollection,
		cardinality: EntityFieldCardinality.Many,
	},
	$$payouts: {
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
