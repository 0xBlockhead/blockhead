import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZcashShieldedActionKind } from '$/schema/ZcashShieldedActionKind.ts'
import { ZcashShieldedPoolKind } from '$/schema/ZcashShieldedPoolKind.ts'
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

const noteReference = (
	note: Awaited<ReturnType<typeof import('$/sources/Zcashd/WalletJsonRpc/queries.ts')['getWalletNotes']>>[number]
) => {
	const pool = (
		note.pool === 'sprout' ?
			ZcashShieldedPoolKind.Sprout
		: note.pool === 'sapling' ?
			ZcashShieldedPoolKind.Sapling
		:
			ZcashShieldedPoolKind.Orchard
	)
	const actionKind = (
		pool === ZcashShieldedPoolKind.Sprout ?
			ZcashShieldedActionKind.JoinSplit
		: pool === ZcashShieldedPoolKind.Sapling ?
			ZcashShieldedActionKind.Output
		:
			ZcashShieldedActionKind.Action
	)
	const indexInTransaction = pool === ZcashShieldedPoolKind.Sprout ? note.jsindex : note.outindex
	if (indexInTransaction == null)
		throw new Error(`${Source.ZcashdWallet_JsonRpc}: note action coordinate is absent`)

	const noteSelector = {
		walletId,
		pool,
		noteCommitment: note.noteCommitment,
	}
	return {
		[EntityMetaKey.Selector]: noteSelector,
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.BlockheadZcashNoteState, [], '$shieldedAction')]: {
				[EntityMetaKey.Selector]: {
					$transaction: {
						$network: zcashNetwork,
						txId: note.txid,
					},
					pool,
					actionKind,
					indexInTransaction,
				},
			},
			[entityFieldAddressKey(EntityType.BlockheadZcashNoteState, [], 'valueZatoshis')]: note.valueZatoshis,
			[entityFieldAddressKey(EntityType.BlockheadZcashNoteState, [], 'memo')]: note.memoStr ?? note.memo,
			...(note.address != null && {
				[entityFieldAddressKey(EntityType.BlockheadZcashNoteState, [], 'recipientAddress')]: note.address,
			}),
			[entityFieldAddressKey(EntityType.BlockheadZcashNoteState, [], 'receivedTransactionId')]: note.txid,
			...(note.receivedAtHeight != null && {
				[entityFieldAddressKey(EntityType.BlockheadZcashNoteState, [], 'receivedAtHeight')]: note.receivedAtHeight,
			}),
			[entityFieldAddressKey(EntityType.BlockheadZcashNoteState, [], '$$timestamps')]: [{
				[EntityMetaKey.Selector]: {
					$noteState: noteSelector,
					timestampMs: note.observedAtMs,
					source: Source.ZcashdWallet_JsonRpc,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.BlockheadZcashNoteState_Timestamp, [], 'spent')]: false,
					[entityFieldAddressKey(EntityType.BlockheadZcashNoteState_Timestamp, [], 'confirmations')]: note.confirmations,
				},
			}],
		},
	}
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
			entityType: EntityType.BlockheadZcashWalletState,
			resolve: {
				WalletId: {
					resolve: async ({ walletId: requestedWalletId }, context) => {
						assertWallet(requestedWalletId)
						const { getWalletNotes } = await import('$/sources/Zcashd/WalletJsonRpc/queries.ts')
						return getWalletNotes(resolverContextRowLimit(context))
					},
				},
			},
		})({
			$$notes: (notes) => notes.map(noteReference),
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
