import { networkBySlug } from '$/constants/Network.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'

type NetworkId = EntitySelector<typeof schema, EntityType.Network>

const assertQuilibriumMainnet = (network: NetworkId) => {
	if (!('slug' in network) || network.slug !== networkBySlug.quilibrium.slug)
		throw new Error('QuilibriumNodeRpc_Grpc: unsupported network')
}

const accountKindForAddress = async (
	accountAddress: string
) => {
	const { implicitAccountReference } = await import('$/sources/QuilibriumNodeRpc/Grpc/queries.ts')
	try {
		implicitAccountReference(accountAddress)
		return 'implicit' as const
	} catch {
		return 'originated' as const
	}
}

export default {
	source: Source.QuilibriumNodeRpc_Grpc,

	resolvers: [
		defineResolver({
			entityType: EntityType.QuilibriumAccount,
			resolve: {
				NetworkAccountAddress: {
					resolve: async ({ $network, accountAddress }) => {
						assertQuilibriumMainnet($network)
						const { implicitAccountReference } = await import('$/sources/QuilibriumNodeRpc/Grpc/queries.ts')
						implicitAccountReference(accountAddress)
						return {
							accountKind: 'implicit',
						}
					},
				},
			},
		})({
			accountKind: (account) => account.accountKind,
		}),

		defineResolver({
			entityType: EntityType.BlockheadQuilibriumAccountState,
			resolve: {
				ConnectionIdNetworkAccountAddress: {
					resolve: async ({ connectionId, $network, accountAddress }) => {
						assertQuilibriumMainnet($network)
						const {
							accountReferenceForAddress,
							getAccountBalance,
							requireAccountAuth,
						} = await import('$/sources/QuilibriumNodeRpc/Grpc/queries.ts')
						const {
							accountAddressFromAccountReference,
							bigintFromBalanceBytes,
							hexAddressFromBytes,
						} = await import('$/sources/QuilibriumNodeRpc/Grpc/types.ts')
						const account = accountReferenceForAddress(accountAddress)
						const auth = requireAccountAuth({
							connectionId,
							accountAddress,
						})
						const response = await getAccountBalance({
							request: {
								request: {
									account,
									...(auth.allowance != null && { allowance: auth.allowance }),
									...(auth.signature != null && { signature: auth.signature }),
								},
								keyRing: auth.keyRing,
							},
						})
						const timestampMs = Date.now()
						return {
							connectionId,
							$network: {
								[EntityMetaKey.Selector]: $network,
							},
							$account: {
								[EntityMetaKey.Selector]: {
									$network,
									accountAddress,
								},
							},
							accountAddress: accountAddressFromAccountReference(account),
							accountKind: await accountKindForAddress(accountAddress),
							...(
								auth.allowance != null
								&& {
									allowanceAddress: hexAddressFromBytes(auth.allowance.address),
								}
							),
							...(
								auth.signature != null
								&& {
									signatureKeyAddress: hexAddressFromBytes(auth.signature.key.address),
								}
							),
							keyRingRefCount: auth.keyRing.keys.length,
							$$timestamps: [
								{
									[EntityMetaKey.Selector]: {
										$accountState: {
											connectionId,
											$network,
											accountAddress,
										},
										timestampMs,
										source: Source.QuilibriumNodeRpc_Grpc,
									},
									[EntityMetaKey.Fields]: {
										[entityFieldAddressKey(EntityType.BlockheadQuilibriumAccountState_Timestamp, [], 'balance')]: bigintFromBalanceBytes(response.balance),
										[entityFieldAddressKey(EntityType.BlockheadQuilibriumAccountState_Timestamp, [], 'balanceObservedAt')]: timestampMs,
									},
								},
							],
						}
					},
				},
			},
		})({
			connectionId: (state) => state.connectionId,
			$network: (state) => state.$network,
			$account: (state) => state.$account,
			accountAddress: (state) => state.accountAddress,
			accountKind: (state) => state.accountKind,
			allowanceAddress: (state) => state.allowanceAddress,
			signatureKeyAddress: (state) => state.signatureKeyAddress,
			keyRingRefCount: (state) => state.keyRingRefCount,
			$$timestamps: (state) => state.$$timestamps,
		}),

		defineResolver({
			entityType: EntityType.BlockheadQuilibriumAccountState,
			resolve: {
				ConnectionIdNetworkAccountAddress: {
					resolve: async ({ connectionId, $network, accountAddress }) => {
						assertQuilibriumMainnet($network)
						const {
							accountReferenceForAddress,
							listPendingTransactions,
							requireAccountAuth,
						} = await import('$/sources/QuilibriumNodeRpc/Grpc/queries.ts')
						const { hexAddressFromBytes } = await import('$/sources/QuilibriumNodeRpc/Grpc/types.ts')
						const auth = requireAccountAuth({
							connectionId,
							accountAddress,
						})
						const response = await listPendingTransactions({
							request: {
								request: {
									account: accountReferenceForAddress(accountAddress),
									...(auth.allowance != null && { allowance: auth.allowance }),
									...(auth.signature != null && { signature: auth.signature }),
								},
								keyRing: auth.keyRing,
								...(auth.deliveryMethod != null && { deliveryMethod: auth.deliveryMethod }),
							},
						})
						return response.pendingTransactions.map((pending) => ({
							[EntityMetaKey.Selector]: {
								$accountState: {
									connectionId,
									$network,
									accountAddress,
								},
								transactionAddress: hexAddressFromBytes(pending.pendingTransaction.address),
							},
						}))
					},
				},
			},
		})({
			$$pendingTransactions: (pendingTransactions) => pendingTransactions,
		}),

		defineResolver({
			entityType: EntityType.BlockheadQuilibriumPendingTransaction,
			resolve: {
				AccountStateTransactionAddress: {
					resolve: async ({ $accountState, transactionAddress }) => {
						assertQuilibriumMainnet($accountState.$network)
						const {
							accountReferenceForAddress,
							listPendingTransactions,
							requireAccountAuth,
						} = await import('$/sources/QuilibriumNodeRpc/Grpc/queries.ts')
						const {
							accountAddressFromAccountReference,
							bigintFromBalanceBytes,
							hexAddressFromBytes,
						} = await import('$/sources/QuilibriumNodeRpc/Grpc/types.ts')
						const auth = requireAccountAuth({
							connectionId: $accountState.connectionId,
							accountAddress: $accountState.accountAddress,
						})
						const observedAt = Date.now()
						const response = await listPendingTransactions({
							request: {
								request: {
									account: accountReferenceForAddress($accountState.accountAddress),
									...(auth.allowance != null && { allowance: auth.allowance }),
									...(auth.signature != null && { signature: auth.signature }),
								},
								keyRing: auth.keyRing,
								...(auth.deliveryMethod != null && { deliveryMethod: auth.deliveryMethod }),
							},
						})
						const pending = response.pendingTransactions.find((candidate) => (
							hexAddressFromBytes(candidate.pendingTransaction.address).toLowerCase() === transactionAddress.toLowerCase()
						))
						if (pending == null)
							throw new Error(`QuilibriumNodeRpc_Grpc: pending transaction not found ${transactionAddress}`)

						const refundAccountAddress = accountAddressFromAccountReference(pending.refundAccount)
						return {
							$account: {
								[EntityMetaKey.Selector]: {
									$network: $accountState.$network,
									accountAddress: $accountState.accountAddress,
								},
							},
							$refundAccount: {
								[EntityMetaKey.Selector]: {
									$network: $accountState.$network,
									accountAddress: refundAccountAddress,
								},
							},
							coinAddress: hexAddressFromBytes(pending.coin.coin.address),
							amount: bigintFromBalanceBytes(pending.coin.balance),
							...(
								auth.deliveryMethod != null
								&& {
									deliveryType: String(auth.deliveryMethod.deliveryType),
									...(
										auth.deliveryMethod.address != null
										&& {
											deliveryAddress: hexAddressFromBytes(auth.deliveryMethod.address),
										}
									),
								}
							),
							observedAt,
						}
					},
				},
			},
		})({
			$account: (pending) => pending.$account,
			$refundAccount: (pending) => pending.$refundAccount,
			coinAddress: (pending) => pending.coinAddress,
			amount: (pending) => pending.amount,
			deliveryType: (pending) => pending.deliveryType,
			deliveryAddress: (pending) => pending.deliveryAddress,
			observedAt: (pending) => pending.observedAt,
		}),
	],
} satisfies RegisteredSourceResolverModule
