import { networkBySlug } from '$/constants/Network.ts'
import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import { defineResolver, type RegisteredSourceResolverModule } from '$/resolvers/defineResolver.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'

type AlgorandNetworkId = EntitySelector<typeof schema, EntityType.AlgorandNetwork>

const algorandAccountApplicability = [{
	$network: {
		$network: {
			slug: networkBySlug.algorand.slug,
		},
	},
}] as const

const assertAlgorandMainnet = (
	network: AlgorandNetworkId
) => {
	if (
		'slug' in network.$network
		&& network.$network.slug === networkBySlug.algorand.slug
	)
		return

	throw new Error('AlgorandIndexer_Rest: unsupported network')
}

export default {
	source: Source.Nodely,

	resolvers: [
		defineResolver({
			entityType: EntityType.AlgorandAccount,
			resolve: {
				NetworkAddress: {
					appliesTo: algorandAccountApplicability,
					resolve: async (account, context) => {
						assertAlgorandMainnet(account.$network)
						const { getAccountAssets } = await import('$/sources/AlgorandIndexer/Rest/queries.ts')
						return getAccountAssets({
							address: account.address,
							limit: Math.min(resolverContextRowLimit(context), 1_000),
							next: context.providerContinuationToken,
						})
					},
				},
			},
		})({
			$$assetHoldingRounds: {
				select: (page, account) => page.assets.map((holding) => ({
					[EntityMetaKey.Selector]: {
						$account: account,
						$asset: {
							$network: account.$network,
							assetId: BigInt(holding['asset-id']),
						},
						round: BigInt(page['current-round']),
						source: Source.Nodely,
					},
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.AlgorandAssetHolding_Round, [], 'amount')]: BigInt(holding.amount),
						[entityFieldAddressKey(EntityType.AlgorandAssetHolding_Round, [], 'frozen')]: holding['is-frozen'],
						[entityFieldAddressKey(EntityType.AlgorandAssetHolding_Round, [], 'optedInAtRound')]: (
							holding['opted-in-at-round'] == null ?
								undefined
							:
								BigInt(holding['opted-in-at-round'])
						),
						[entityFieldAddressKey(EntityType.AlgorandAssetHolding_Round, [], 'deleted')]: holding.deleted,
					},
				})),
				continuation: (page, account) => (
					page['next-token'] == null ?
						{
							operation: 'account-asset-holdings',
							target: account.address,
							terminal: true,
						}
					:
						{
							operation: 'account-asset-holdings',
							target: account.address,
							terminal: false,
							token: page['next-token'],
						}
				),
			},
		}),

		defineResolver({
			entityType: EntityType.AlgorandAccount,
			resolve: {
				NetworkAddress: {
					appliesTo: algorandAccountApplicability,
					resolve: async (account, context) => {
						assertAlgorandMainnet(account.$network)
						if (resolverContextRowLimit(context) === 0)
							return []

						const { getAccount } = await import('$/sources/AlgorandIndexer/Rest/queries.ts')
						const response = await getAccount(account.address)
						return [{
							[EntityMetaKey.Selector]: {
								$account: account,
								round: BigInt(response['current-round']),
								source: Source.Nodely,
							},
							[EntityMetaKey.Fields]: {
								[entityFieldAddressKey(EntityType.AlgorandAccount_Timestamp, [], 'amount')]: BigInt(response.account.amount),
								[entityFieldAddressKey(EntityType.AlgorandAccount_Timestamp, [], 'pendingRewards')]: (
									response.account['pending-rewards'] == null ?
										undefined
									:
										BigInt(response.account['pending-rewards'])
								),
								[entityFieldAddressKey(EntityType.AlgorandAccount_Timestamp, [], 'rewardsBase')]: (
									response.account['reward-base'] == null ?
										undefined
									:
										BigInt(response.account['reward-base'])
								),
								[entityFieldAddressKey(EntityType.AlgorandAccount_Timestamp, [], 'status')]: response.account.status,
							},
						}]
					},
				},
			},
		})({
			$$timestamps: (timestamps) => timestamps,
		}),
	],
} satisfies RegisteredSourceResolverModule
