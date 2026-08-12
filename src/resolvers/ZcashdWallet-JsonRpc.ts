import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'


const walletId = 'wallet-rpc'
const zcashNetwork = {
	caip2: 'bip122:00040fe8ec8471911baa1db1266ea15',
}

const assertWallet = (requestedWalletId: string) => {
	if (requestedWalletId !== walletId)
		throw new Error(`${Source.ZcashdWallet_JsonRpc}: unsupported wallet ${requestedWalletId}`)
}

const walletObservation = async () => {
	const { getWalletObservation } = await import('$/sources/Zcashd/WalletJsonRpc/queries.ts')
	return getWalletObservation()
}

export default {
	source: Source.ZcashdWallet_JsonRpc,

	resolvers: [
		defineResolver({
			entityType: EntityType.BlockheadZcashWalletState,
			resolve: {
				WalletId: {
					resolve: async ({ walletId: requestedWalletId }) => {
						assertWallet(requestedWalletId)

						return {
							walletId: requestedWalletId,
							$network: {
								[EntityMetaKey.Selector]: zcashNetwork,
							},
							$$timestamps: [{
								[EntityMetaKey.Selector]: {
									$walletState: { walletId: requestedWalletId },
									timestampMs: Date.now(),
									source: Source.ZcashdWallet_JsonRpc,
								},
							}],
						}
					},
				},
			},
		})({
			walletId: (wallet) => wallet.walletId,
			$network: (wallet) => wallet.$network,
			$$timestamps: (wallet) => wallet.$$timestamps,
		}),

		defineResolver({
			entityType: EntityType.BlockheadZcashWalletState_Timestamp,
			resolve: {
				WalletStateTimestampMsSource: {
					resolve: async ({
						$walletState,
						timestampMs,
						source,
					}) => {
						assertWallet($walletState.walletId)
						if (source !== Source.ZcashdWallet_JsonRpc)
							throw new Error(`${Source.ZcashdWallet_JsonRpc}: unsupported source ${source}`)

						return {
							$walletState: {
								[EntityMetaKey.Selector]: $walletState,
							},
							timestampMs,
							source,
							...await walletObservation(),
							lastSyncedAt: Date.now(),
						}
					},
				},
			},
		})({
			$walletState: (observation) => observation.$walletState,
			timestampMs: (observation) => observation.timestampMs,
			source: (observation) => observation.source,
			balanceZatoshis: (observation) => observation.balanceZatoshis,
			verifiedBalanceZatoshis: (observation) => observation.verifiedBalanceZatoshis,
			unshieldedBalanceZatoshis: (observation) => observation.unshieldedBalanceZatoshis,
			chainTipHeight: (observation) => observation.chainTipHeight,
			lastSyncedAt: (observation) => observation.lastSyncedAt,
		}),
	],
} satisfies RegisteredSourceResolverModule
