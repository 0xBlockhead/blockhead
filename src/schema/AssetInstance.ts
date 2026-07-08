// Generated from APP.ts. Do not edit by hand.

import { CoinId } from '$/constants/Coin.ts'
import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum AssetInstanceKind {
	Native = 'Native',
	Token = 'Token',
	Denom = 'Denom',
	Mint = 'Mint',
}
export enum AssetInstanceSelector {
	NetworkKindAssetKey = 'NetworkKindAssetKey',
}
export const AssetInstance = entity({
	entityType: EntityType.AssetInstance,
	label: 'Asset instance',
	labelPlural: 'asset instances',
	description: 'A concrete asset on a specific network or venue, such as a native coin, token, share, or collectible.',
})({
	$network: {
		label: 'Network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	kind: {
		label: 'Kind',
		type: EntityFieldType.Primitive,
		primitiveType: type.enumerated(...Object.values(AssetInstanceKind)),
		cardinality: EntityFieldCardinality.One,
	},
	assetKey: {
		label: 'Asset key',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	coinId: {
		label: 'Coin ID',
		type: EntityFieldType.Primitive,
		primitiveType: type.enumerated(...Object.values(CoinId)),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	name: {
		label: 'Name',
		description: 'The human-readable name of the subject.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	symbol: {
		label: 'Symbol',
		description: 'The short ticker or symbol used for display.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	decimals: {
		label: 'Decimals',
		description: 'The number of decimal places used to display the amount.',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$icon: {
		label: 'Icon',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Media,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$formats: {
		label: 'Formats',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.AssetFormatSupport_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$metadata: {
		label: 'Metadata',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.TokenMetadataDocument,
		cardinality: EntityFieldCardinality.Many,
	},
	$$tokenProgramExtensions: {
		label: 'Token program extensions',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.TokenProgramExtension_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$regulatedProfiles: {
		label: 'regulated profiles',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.RegulatedAssetProfile,
		cardinality: EntityFieldCardinality.Many,
	},
	$$transferRestrictions: {
		label: 'transfer restrictions',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.TransferRestriction,
		cardinality: EntityFieldCardinality.Many,
	},
	$$nftCollections: {
		label: 'NFT collections',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.NftCollection,
		cardinality: EntityFieldCardinality.Many,
	},
	$$payouts: {
		label: 'payouts',
		type: EntityFieldType.EntitiesReference,
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
