import { networkBySlug } from '$/constants/Network.ts'
import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import { defineResolver, type RegisteredSourceResolverModule } from '$/resolvers/defineResolver.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import type { StellarExpertLedgerTimestampSequence } from '$/sources/StellarExpert/Rest/types.ts'

const assertStellarPublicNetwork = ($network: {
	$network: {
		slug: string
	}
}) => {
	if ($network.$network.slug !== networkBySlug.stellar.slug)
		throw new Error('StellarExpert: unsupported network')
}

const ledgerCloseTimeMs = (
	ledger: StellarExpertLedgerTimestampSequence,
	expectedSequence?: bigint
) => {
	if (
		expectedSequence != null
		&& BigInt(ledger.sequence) !== expectedSequence
	)
		throw new Error('StellarExpert: response ledger sequence does not match request')

	return {
		sequence: BigInt(ledger.sequence),
		closeTimeMs: ledger.timestamp * 1_000,
	}
}

const stellarAssetIdentity = (
	assetKey: string
) => {
	if (assetKey === 'XLM')
		return {
			assetKind: 'native',
			assetCode: 'XLM',
		} as const

	const match = /^([A-Za-z0-9]{1,12})-(G[A-Z2-7]{55})(?:-\d+)?$/.exec(assetKey)
	if (match == null)
		throw new Error('StellarExpert: malformed asset key')

	return {
		assetKind: match[1].length <= 4 ? 'credit_alphanum4' : 'credit_alphanum12',
		assetCode: match[1],
		issuer: match[2],
	} as const
}

const stellarAssetFields = (
	$network: {
		$network: {
			slug: string
		}
	},
	assetKey: string
) => {
	const identity = stellarAssetIdentity(assetKey)
	return {
		[entityFieldAddressKey(EntityType.StellarAsset, [], 'assetKind')]: identity.assetKind,
		[entityFieldAddressKey(EntityType.StellarAsset, [], 'assetCode')]: identity.assetCode,
		...('issuer' in identity && {
			[entityFieldAddressKey(EntityType.StellarAsset, [], 'issuer')]: identity.issuer,
			[entityFieldAddressKey(EntityType.StellarAsset, [], '$issuerAccount')]: {
				[EntityMetaKey.Selector]: {
					$network,
					accountId: identity.issuer,
				},
			},
		}),
	}
}

export default {
	source: Source.StellarExpert,

	resolvers: [
		defineResolver({
			entityType: EntityType.StellarLedger,
			resolve: {
				NetworkSequence: {
					resolve: async ({ $network, sequence }) => {
						assertStellarPublicNetwork($network)

						if (sequence < 1n || sequence > BigInt(Number.MAX_SAFE_INTEGER))
							throw new Error('StellarExpert: ledger sequence is not a positive safe integer')

						const { getTimestampFromSequence } = await import('$/sources/StellarExpert/Rest/queries.ts')
						return ledgerCloseTimeMs(
							await getTimestampFromSequence({
								network: 'public',
								sequence: Number(sequence),
							}),
							sequence
						)
					},
				},
			},
		})({
			closeTimeMs: (ledger) => ledger.closeTimeMs,
		}),

		defineResolver({
			entityType: EntityType.StellarNetwork_Timestamp,
			resolve: {
				NetworkTimestampMsSource: {
					resolve: async ({ $network, timestampMs, source }) => {
						assertStellarPublicNetwork($network)
						if (source !== Source.StellarExpert)
							throw new Error('StellarExpert: unsupported observation source')

						if (!Number.isSafeInteger(timestampMs) || timestampMs < 0)
							throw new Error('StellarExpert: observation timestamp is not a non-negative safe integer')

						const unixSeconds = Math.floor(timestampMs / 1_000)
						const { getSequenceFromTimestamp } = await import('$/sources/StellarExpert/Rest/queries.ts')
						const ledger = ledgerCloseTimeMs(
							await getSequenceFromTimestamp({
								network: 'public',
								timestamp: unixSeconds,
							})
						)
						if (ledger.closeTimeMs > timestampMs)
							throw new Error('StellarExpert: resolved ledger closes after the observation timestamp')

						return {
							latestLedger: ledger.sequence,
						}
					},
				},
			},
		})({
			latestLedger: (observation) => observation.latestLedger,
		}),

		defineResolver({
			entityType: EntityType.StellarAsset,
			resolve: {
				NetworkAssetKey: {
					resolve: async ({ $network, assetKey }) => {
						assertStellarPublicNetwork($network)
						const identity = stellarAssetIdentity(assetKey)
						const { getAssetRating } = await import('$/sources/StellarExpert/Rest/queries.ts')
						await getAssetRating({
							network: 'public',
							asset: assetKey,
						})
						return identity
					},
				},
			},
		})({
			assetKind: (asset) => asset.assetKind,
			assetCode: (asset) => asset.assetCode,
			issuer: (asset) => (
				'issuer' in asset ?
					asset.issuer
				:
					undefined
			),
			$issuerAccount: (asset, { $network }) => (
				'issuer' in asset ?
					{
						[EntityMetaKey.Selector]: {
							$network,
							accountId: asset.issuer,
						},
					}
				:
					undefined
			),
		}),

		defineResolver({
			entityType: EntityType.StellarNetwork,
			resolve: {
				Network: {
					resolve: async ($network, context) => {
						assertStellarPublicNetwork($network)
						const limit = Math.min(resolverContextRowLimit(context), 200)
						const cursorToken = context.providerContinuationToken
						const cursor = (
							cursorToken == null ?
								undefined
							: /^\d+$/.test(cursorToken) ?
								Number(cursorToken)
							:
								(() => {
									throw new Error('StellarExpert: invalid asset list continuation cursor')
								})()
						)
						const { getAllAssets } = await import('$/sources/StellarExpert/Rest/queries.ts')
						return {
							limit,
							page: await getAllAssets({
								network: 'public',
								sort: 'rating',
								order: 'desc',
								limit,
								...(cursor != null && { cursor }),
							}),
						}
					},
				},
			},
		})({
			$$assets: {
				select: ({ page }, $network) => (
					page._embedded.records.map((record) => ({
						[EntityMetaKey.Selector]: {
							$network,
							assetKey: record.asset,
						},
						[EntityMetaKey.Fields]: stellarAssetFields($network, record.asset),
					}))
				),
				continuation: ({ limit, page }, $network) => {
					const records = page._embedded.records
					const nextCursor = records.at(-1)?.paging_token
					return nextCursor == null || records.length < limit ?
						{
							operation: 'network-assets',
							target: $network.$network.slug,
							terminal: true,
						}
					:
						{
							operation: 'network-assets',
							target: $network.$network.slug,
							terminal: false,
							token: String(nextCursor),
						}
				},
			},
		}),
	],
} satisfies RegisteredSourceResolverModule
