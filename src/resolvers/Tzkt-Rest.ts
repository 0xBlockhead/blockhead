import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import { networkBySlug } from '$/constants/Network.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { sourceProviderDefinitions } from '$/sources/$sourceProviders.ts'
import { SourceTargetKind } from '$/sources/SourceBinding.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type {
	TzktBigMap,
	TzktBigMapKey,
	TzktBigMapUpdate,
	TzktOperation,
	TzktAccount,
	TzktTokenBalance,
	TzktTokenTransfer,
} from '$/sources/Tzkt/Rest/types.ts'
import { TezosAccountSelector } from '$/schema/TezosAccount.ts'
import { TezosNetworkSelector } from '$/schema/TezosNetwork.ts'
import { TezosContractSelector } from '$/schema/TezosContract.ts'
import { TezosOperationGroupSelector } from '$/schema/TezosOperationGroup.ts'
import { TezosOperationSelector } from '$/schema/TezosOperation.ts'
import { TezosBigMapSelector } from '$/schema/TezosBigMap.ts'
import { TezosBigMap_TimestampSelector } from '$/schema/TezosBigMap_Timestamp.ts'
import { TezosBigMapDiffSelector } from '$/schema/TezosBigMapDiff.ts'
import { TezosBigMapKeySelector } from '$/schema/TezosBigMapKey.ts'
import { TezosBigMapKey_TimestampSelector } from '$/schema/TezosBigMapKey_Timestamp.ts'
import { TezosBlockSelector } from '$/schema/TezosBlock.ts'

type NetworkId = { caip2: {
	namespace: string
	reference: string
} } | { slug: string }

const tzktRestBindings = sourceProviderDefinitions
	.flatMap((provider) => provider.bindings)
	.filter((binding) => (
		binding.provider === SourceProvider.Tzkt
		&& binding.source === Source.Tzkt_Rest
		&& binding.target.kind === SourceTargetKind.Caip2Network
		&& binding.target.key === 'tezos:NetXdQprcVkpaWU'
	))

if (tzktRestBindings.length !== 1)
	throw new Error('Tzkt_Rest: canonical Tezos mainnet source binding is missing or ambiguous')

const [tzktRestBinding] = tzktRestBindings

const assertTezosMainnet = (network: NetworkId) => {
	if (
		('slug' in network && network.slug === networkBySlug.tezos.slug)
		|| (
			'caip2' in network
			&& network.caip2.namespace === networkBySlug.tezos.caip2.namespace
			&& network.caip2.reference === networkBySlug.tezos.caip2.reference
		)
	)
		return

	throw new Error('Tzkt_Rest: unsupported network')
}

const timestampMsFromIso = (iso: string) => (
	Date.parse(iso)
)

const accountOffset = (token: string | undefined) => {
	if (token == null)
		return 0

	const offset = Number(token)
	if (!Number.isSafeInteger(offset) || offset < 0 || String(offset) !== token)
		throw new Error('Tzkt_Rest: invalid account continuation')

	return offset
}

const accountContinuation = (
	operation: string,
	address: string,
	offset: number,
	limit: number,
	rowCount: number
) => (
	rowCount < limit ?
		{
			operation,
			target: address,
			terminal: true,
		}
	:
		{
			operation,
			target: address,
			terminal: false,
			token: String(offset + rowCount),
		}
)

const assertAccount = (
	address: string,
	account: TzktAccount
) => {
	if (account.address !== address)
		throw new Error('Tzkt_Rest: account response does not match the subject')
	if (
		account.type.length === 0
		|| !Number.isSafeInteger(account.lastLevel)
		|| account.lastLevel < 0
		|| !Number.isSafeInteger(account.balance)
		|| account.balance < 0
		|| (
			account.counter != null
			&& (!Number.isSafeInteger(account.counter) || account.counter < 0)
		)
	)
		throw new Error('Tzkt_Rest: account response is malformed')
	if (!Number.isSafeInteger(timestampMsFromIso(account.lastActivity)))
		throw new Error('Tzkt_Rest: account response has an invalid activity timestamp')
}

const bigMapFieldsFromWire = (
	$contract: { $network: { $network: NetworkId }, address: string },
	bigMap: TzktBigMap,
	bigMapId = BigInt(bigMap.ptr)
) => ({
	[EntityMetaKey.Fields]: {
		[entityFieldAddressKey(EntityType.TezosBigMap, [], '$contract')]: {
			[EntityMetaKey.Selector]: $contract,
		},
	},
		bigMapId,
		path: bigMap.path,
		...(bigMap.keyType != null && {
			keyType: bigMap.keyType,
		}),
	...(bigMap.valueType != null && {
		valueType: bigMap.valueType,
	}),
})

const bigMapKeyFieldsFromWire = (
	$bigMap: { $contract: { $network: { $network: NetworkId }, address: string }, bigMapId: bigint },
	key: TzktBigMapKey
) => ({
	[EntityMetaKey.Fields]: {
		[entityFieldAddressKey(EntityType.TezosBigMapKey, [], '$bigMap')]: {
			[EntityMetaKey.Selector]: $bigMap,
		},
	},
	keyHash: key.hash,
})

const bigMapDiffFieldsFromWire = ({
	$contract,
	bigMapId,
	keyHash,
	update,
	operationSelector,
}: {
	$contract: { $network: { $network: NetworkId }, address: string }
	bigMapId: bigint
	keyHash: string
	update: TzktBigMapUpdate
	operationSelector: {
		$operationGroup: {
			$network: { $network: NetworkId }
			operationHash: string
		}
		contentIndex: number
	}
}) => ({
	[EntityMetaKey.Fields]: {
		[entityFieldAddressKey(EntityType.TezosBigMapDiff, [], '$operation')]: {
			[EntityMetaKey.Selector]: operationSelector,
		},
		[entityFieldAddressKey(EntityType.TezosBigMapDiff, [], '$bigMap')]: {
			[EntityMetaKey.Selector]: {
				$contract,
				bigMapId,
			},
		},
	},
	bigMapId,
	keyHash,
	action: update.action,
	...(update.content?.key != null && {
		key: update.content.key,
	}),
	...(update.content?.value != null && {
		value: update.content.value,
	}),
})

const operationKindFromWire = (operation: TzktOperation) => (
	operation.parameter?.entrypoint != null ?
		`${operation.type}:${operation.parameter.entrypoint}`
	:
		operation.type
)

const operationGroupReference = (
	tezosNetwork: { $network: NetworkId },
	operationHash: string
) => ({
	[EntityMetaKey.Selector]: {
		$network: tezosNetwork,
		operationHash,
	},
})

export default {
	source: Source.Tzkt_Rest,

	resolvers: [
		defineResolver(Source.Tzkt_Rest, {
			entityType: EntityType.TezosNetwork,
			resolve: {
				[TezosNetworkSelector.Network]: {
					resolve: async ({ $network }) => {
						assertTezosMainnet($network)
						return {
							$network: {
								[EntityMetaKey.Selector]: $network,
							},
						}
					},
				},
			},
		})({
				$network: (network) => network.$network,
			}),

		defineResolver(Source.Tzkt_Rest, {
			entityType: EntityType.TezosAccount,
			resolve: {
				[TezosAccountSelector.NetworkAddress]: {
					resolve: async (account) => {
						assertTezosMainnet(account.$network.$network)
						const { getAccount } = await import('$/sources/Tzkt/Rest/queries.ts')
						const snapshot = await getAccount({
							binding: tzktRestBinding,
							address: account.address,
						})
						assertAccount(account.address, snapshot)

						return {
							accountKind: snapshot.type,
							$$timestamps: [{
								[EntityMetaKey.Selector]: {
									$account: account,
									level: BigInt(snapshot.lastLevel),
									source: Source.Tzkt_Rest,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.TezosAccount_Timestamp, [], 'timestampMs')]: timestampMsFromIso(snapshot.lastActivity),
									[entityFieldAddressKey(EntityType.TezosAccount_Timestamp, [], 'balanceMutez')]: BigInt(snapshot.balance),
									...(snapshot.counter != null && {
										[entityFieldAddressKey(EntityType.TezosAccount_Timestamp, [], 'counter')]: BigInt(snapshot.counter),
									}),
									...(snapshot.delegate?.address != null && {
										[entityFieldAddressKey(EntityType.TezosAccount_Timestamp, [], 'delegate')]: snapshot.delegate.address,
									}),
									...(snapshot.revealed != null && {
										[entityFieldAddressKey(EntityType.TezosAccount_Timestamp, [], 'isRevealed')]: snapshot.revealed,
									}),
									...(snapshot.publicKey != null && {
										[entityFieldAddressKey(EntityType.TezosAccount_Timestamp, [], 'publicKey')]: snapshot.publicKey,
									}),
								},
							}],
						}
					},
				},
			},
		})({
			accountKind: (account) => account.accountKind,
			$$timestamps: (account) => account.$$timestamps,
		}),

		defineResolver(Source.Tzkt_Rest, {
			entityType: EntityType.TezosAccount,
			resolve: {
				[TezosAccountSelector.NetworkAddress]: {
					resolve: async (account, context) => {
						assertTezosMainnet(account.$network.$network)
						const offset = accountOffset(context.providerContinuationToken)
						const limit = Math.min(resolverContextRowLimit(context), 1_000)
						const {
							listAccountOperations,
							listOperationsByHash,
						} = await import('$/sources/Tzkt/Rest/queries.ts')
						const operations = await listAccountOperations({
							binding: tzktRestBinding,
							address: account.address,
							offset,
							limit,
						})
						const operationGroupsByHash = new Map<string, TzktOperation[]>()
						await Promise.all(
							[...new Set(operations.map((operation) => operation.hash))]
								.map(async (operationHash) => {
									const operationGroup = await listOperationsByHash({
										binding: tzktRestBinding,
										operationHash,
									})
									const operationIds = new Set<number>()
									for (const operation of operationGroup) {
										if (
											operation.hash !== operationHash
											|| !Number.isSafeInteger(operation.id)
											|| operation.id < 0
											|| operationIds.has(operation.id)
											|| !Number.isSafeInteger(operation.level)
											|| operation.level < 0
											|| operation.type.length === 0
											|| !Number.isSafeInteger(timestampMsFromIso(operation.timestamp))
										)
											throw new Error(`Tzkt_Rest: operation group ${operationHash} is malformed or inconsistent`)

										operationIds.add(operation.id)
									}

									operationGroupsByHash.set(operationHash, operationGroup)
								})
						)

						return {
							limit,
							offset,
							operations: operations.map((operation) => {
								const operationGroup = operationGroupsByHash.get(operation.hash)
								if (operationGroup == null)
									throw new Error(`Tzkt_Rest: operation group ${operation.hash} is missing`)

								const contentIndex = operationGroup.findIndex((candidate) => candidate.id === operation.id)
								const canonicalOperation = operationGroup.at(contentIndex)
								if (
									contentIndex < 0
									|| canonicalOperation == null
									|| canonicalOperation.type !== operation.type
									|| canonicalOperation.level !== operation.level
									|| canonicalOperation.timestamp !== operation.timestamp
									|| canonicalOperation.counter !== operation.counter
									|| canonicalOperation.nonce !== operation.nonce
									|| canonicalOperation.initiator?.address !== operation.initiator?.address
									|| canonicalOperation.sender?.address !== operation.sender?.address
									|| canonicalOperation.target?.address !== operation.target?.address
									|| canonicalOperation.status !== operation.status
									|| canonicalOperation.parameter?.entrypoint !== operation.parameter?.entrypoint
								)
									throw new Error(`Tzkt_Rest: account operation ${operation.id} does not match operation group ${operation.hash}`)

								return {
									contentIndex,
									operation: canonicalOperation,
								}
							}),
						}
					},
				},
			},
		})({
			$$operations: {
				select: (page, account) => page.operations.map(({
					contentIndex,
					operation,
				}) => ({
					[EntityMetaKey.Selector]: {
						$operationGroup: {
							$network: account.$network,
							operationHash: operation.hash,
						},
						contentIndex,
					},
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.TezosOperation, [], 'operationKind')]: operationKindFromWire(operation),
					},
				})),
				continuation: (page, account) => accountContinuation(
					'account-operations',
					account.address,
					page.offset,
					page.limit,
					page.operations.length
				),
			},
		}),

		defineResolver(Source.Tzkt_Rest, {
			entityType: EntityType.TezosAccount,
			resolve: {
				[TezosAccountSelector.NetworkAddress]: {
					resolve: async (account, context) => {
						assertTezosMainnet(account.$network.$network)
						const offset = accountOffset(context.providerContinuationToken)
						const limit = Math.min(resolverContextRowLimit(context), 1_000)
						const { listAccountTokenBalances } = await import('$/sources/Tzkt/Rest/queries.ts')
						const balances = await listAccountTokenBalances({
							binding: tzktRestBinding,
							address: account.address,
							offset,
							limit,
						})
						const identities = new Set<string>()
						for (const balance of balances) {
							const identity = `${balance.token.contract.address}:${balance.token.tokenId}`
							if (
								balance.account.address !== account.address
								|| balance.token.contract.address.length === 0
								|| !/^\d+$/.test(balance.token.tokenId)
								|| !/^\d+$/.test(balance.balance)
								|| !Number.isSafeInteger(balance.lastLevel)
								|| balance.lastLevel < 0
								|| !Number.isSafeInteger(balance.firstLevel)
								|| balance.firstLevel < 0
								|| !Number.isSafeInteger(balance.transfersCount)
								|| balance.transfersCount < 0
							)
								throw new Error('Tzkt_Rest: token balance response is malformed or foreign')
							if (identities.has(identity))
								throw new Error('Tzkt_Rest: token balance response contains duplicate identities')

							identities.add(identity)
						}

						return {
							balances,
							limit,
							offset,
						}
					},
				},
			},
		})({
			$$tokenBalanceTimestamps: {
				select: (page, account) => page.balances.map((balance: TzktTokenBalance) => ({
					[EntityMetaKey.Selector]: {
						$account: account,
						$token: {
							$network: account.$network,
							contractAddress: balance.token.contract.address,
							tokenId: BigInt(balance.token.tokenId),
						},
						level: BigInt(balance.lastLevel),
						source: Source.Tzkt_Rest,
					},
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.TezosTokenBalance_Timestamp, [], 'balance')]: BigInt(balance.balance),
						[entityFieldAddressKey(EntityType.TezosTokenBalance_Timestamp, [], 'contractAddress')]: balance.token.contract.address,
						[entityFieldAddressKey(EntityType.TezosTokenBalance_Timestamp, [], 'tokenId')]: BigInt(balance.token.tokenId),
						[entityFieldAddressKey(EntityType.TezosTokenBalance_Timestamp, [], 'firstLevel')]: BigInt(balance.firstLevel),
						[entityFieldAddressKey(EntityType.TezosTokenBalance_Timestamp, [], 'lastLevel')]: BigInt(balance.lastLevel),
						[entityFieldAddressKey(EntityType.TezosTokenBalance_Timestamp, [], 'transferCount')]: balance.transfersCount,
					},
				})),
				continuation: (page, account) => accountContinuation(
					'account-token-balances',
					account.address,
					page.offset,
					page.limit,
					page.balances.length
				),
			},
		}),

		defineResolver(Source.Tzkt_Rest, {
			entityType: EntityType.TezosAccount,
			resolve: {
				[TezosAccountSelector.NetworkAddress]: {
					resolve: async (account, context) => {
						assertTezosMainnet(account.$network.$network)
						const offset = accountOffset(context.providerContinuationToken)
						const limit = Math.min(resolverContextRowLimit(context), 1_000)
						const { listAccountTokenTransfers } = await import('$/sources/Tzkt/Rest/queries.ts')
						const transfers = await listAccountTokenTransfers({
							binding: tzktRestBinding,
							address: account.address,
							offset,
							limit,
						})
						const identities = new Set<number>()
						for (const transfer of transfers) {
							if (
								transfer.from?.address !== account.address
								&& transfer.to?.address !== account.address
							)
								throw new Error('Tzkt_Rest: token transfer response contains a foreign row')
							if (
								!Number.isSafeInteger(transfer.id)
								|| transfer.id < 0
								|| identities.has(transfer.id)
								|| !Number.isSafeInteger(transfer.level)
								|| transfer.level < 0
								|| !/^\d+$/.test(transfer.amount)
								|| transfer.token.contract.address.length === 0
								|| !/^\d+$/.test(transfer.token.tokenId)
								|| !Number.isSafeInteger(timestampMsFromIso(transfer.timestamp))
							)
								throw new Error('Tzkt_Rest: token transfer response is malformed')

							identities.add(transfer.id)
						}

						return {
							limit,
							offset,
							transfers,
						}
					},
				},
			},
		})({
			$$tokenTransfers: {
				select: (page, account) => page.transfers.map((transfer: TzktTokenTransfer) => ({
					[EntityMetaKey.Selector]: {
						$network: account.$network,
						transferId: String(transfer.id),
						source: Source.Tzkt_Rest,
					},
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.TezosTokenTransfer, [], '$token')]: {
							[EntityMetaKey.Selector]: {
								$network: account.$network,
								contractAddress: transfer.token.contract.address,
								tokenId: BigInt(transfer.token.tokenId),
							},
						},
						...(transfer.from != null && {
							[entityFieldAddressKey(EntityType.TezosTokenTransfer, [], '$from')]: {
								[EntityMetaKey.Selector]: {
									$network: account.$network,
									address: transfer.from.address,
								},
							},
						}),
						...(transfer.to != null && {
							[entityFieldAddressKey(EntityType.TezosTokenTransfer, [], '$to')]: {
								[EntityMetaKey.Selector]: {
									$network: account.$network,
									address: transfer.to.address,
								},
							},
						}),
						[entityFieldAddressKey(EntityType.TezosTokenTransfer, [], 'level')]: BigInt(transfer.level),
						[entityFieldAddressKey(EntityType.TezosTokenTransfer, [], 'timestampMs')]: timestampMsFromIso(transfer.timestamp),
						[entityFieldAddressKey(EntityType.TezosTokenTransfer, [], 'contractAddress')]: transfer.token.contract.address,
						[entityFieldAddressKey(EntityType.TezosTokenTransfer, [], 'tokenId')]: BigInt(transfer.token.tokenId),
						[entityFieldAddressKey(EntityType.TezosTokenTransfer, [], 'amount')]: BigInt(transfer.amount),
						...(transfer.token.standard != null && {
							[entityFieldAddressKey(EntityType.TezosTokenTransfer, [], 'standard')]: transfer.token.standard,
						}),
						...(transfer.transactionId != null && {
							[entityFieldAddressKey(EntityType.TezosTokenTransfer, [], 'transactionId')]: String(transfer.transactionId),
						}),
					},
				})),
				continuation: (page, account) => accountContinuation(
					'account-token-transfers',
					account.address,
					page.offset,
					page.limit,
					page.transfers.length
				),
			},
		}),

		defineResolver(Source.Tzkt_Rest, {
			entityType: EntityType.TezosBlock,
			resolve: {
				[TezosBlockSelector.NetworkLevel]: {
					resolve: async ({ $network, level }) => {
						assertTezosMainnet($network.$network)
						if (level < 0n || level > BigInt(Number.MAX_SAFE_INTEGER))
							throw new Error(`Tzkt_Rest: unsupported block level ${level.toString()}`)

						const { getBlock } = await import('$/sources/Tzkt/Rest/queries.ts')
						const block = await getBlock({
							binding: tzktRestBinding,
							level,
						})
						if (BigInt(block.level) !== level)
							throw new Error(`Tzkt_Rest: block response level ${block.level} does not match ${level.toString()}`)
						if (block.hash.trim() === '')
							throw new Error(`Tzkt_Rest: block ${level.toString()} has an empty hash`)

						const timestampMs = timestampMsFromIso(block.timestamp)
						if (!Number.isFinite(timestampMs))
							throw new Error(`Tzkt_Rest: block ${level.toString()} has an invalid timestamp`)

						return {
							$network: {
								[EntityMetaKey.Selector]: $network,
							},
							level,
							hash: block.hash,
							timestampMs,
						}
					},
				},
			},
		})({
			$network: (block) => block.$network,
			level: (block) => block.level,
			hash: (block) => block.hash,
			timestampMs: (block) => block.timestampMs,
		}),

		defineResolver(Source.Tzkt_Rest, {
			entityType: EntityType.TezosNetwork,
			resolve: {
				[TezosNetworkSelector.Network]: {
					resolve: async ({ $network }, context) => {
						assertTezosMainnet($network)
						const { listBigMaps } = await import('$/sources/Tzkt/Rest/queries.ts')
						return (await listBigMaps({
							binding: tzktRestBinding,
							limit: resolverContextRowLimit(context),
						})).map((bigMap) => ({
							[EntityMetaKey.Selector]: {
								$contract: {
									$network: { $network: $network },
									address: bigMap.contract.address,
								},
								bigMapId: BigInt(bigMap.ptr),
							},
						}))
					},
				},
			},
		})({
				$$bigMaps: (bigMaps) => bigMaps,
			}),

		defineResolver(Source.Tzkt_Rest, {
			entityType: EntityType.TezosNetwork,
			resolve: {
				[TezosNetworkSelector.Network]: {
					resolve: async ({ $network }, context) => {
						assertTezosMainnet($network)
						const { listBigMapUpdates } = await import('$/sources/Tzkt/Rest/queries.ts')
						return (await listBigMapUpdates({
							binding: tzktRestBinding,
							limit: resolverContextRowLimit(context),
						})).flatMap((update) => (
							update.contract?.address == null ?
								[]
							:
								[
									{
										[EntityMetaKey.Selector]: {
											$bigMap: {
												$contract: {
													$network: { $network: $network },
													address: update.contract.address,
												},
												bigMapId: BigInt(update.bigmap),
											},
											level: BigInt(update.level),
											source: Source.Tzkt_Rest,
										},
									},
								]
						))
					},
				},
			},
		})({
				$$bigMapTimestamps: (timestamps) => timestamps,
			}),

		defineResolver(Source.Tzkt_Rest, {
			entityType: EntityType.TezosNetwork,
			resolve: {
				[TezosNetworkSelector.Network]: {
					resolve: async ({ $network }, context) => {
						assertTezosMainnet($network)
						const { listBigMaps, listBigMapKeys } = await import('$/sources/Tzkt/Rest/queries.ts')
						const bigMaps = await listBigMaps({
							binding: tzktRestBinding,
							limit: Math.min(resolverContextRowLimit(context), 5),
						})
						const keyRows = (
							await Promise.all(
								bigMaps.map(async (bigMap) => ({
									bigMap,
									keys: await listBigMapKeys({
										binding: tzktRestBinding,
										bigMapId: bigMap.ptr,
										limit: Math.max(1, Math.floor(resolverContextRowLimit(context) / Math.max(bigMaps.length, 1))),
									}),
								}))
							)
						).flatMap(({ bigMap, keys }) => (
							keys.flatMap((key) => (
								key.updates === 0 ?
									[]
								:
									[
										{
											[EntityMetaKey.Selector]: {
												$bigMapKey: {
													$bigMap: {
														$contract: {
															$network: { $network: $network },
															address: bigMap.contract.address,
														},
														bigMapId: BigInt(bigMap.ptr),
													},
													keyHash: key.hash,
												},
												level: BigInt(key.firstLevel),
												source: Source.Tzkt_Rest,
											},
										},
									]
							))
						))
						return keyRows
					},
				},
			},
		})({
				$$bigMapKeyTimestamps: (timestamps) => timestamps,
			}),

		defineResolver(Source.Tzkt_Rest, {
			entityType: EntityType.TezosNetwork,
			resolve: {
				[TezosNetworkSelector.Network]: {
					resolve: async ({ $network }, context) => {
						assertTezosMainnet($network)
						const { listBigMaps, listBigMapKeys } = await import('$/sources/Tzkt/Rest/queries.ts')
						const bigMaps = await listBigMaps({
							binding: tzktRestBinding,
							limit: Math.min(resolverContextRowLimit(context), 5),
						})
						const keyRows = (
							await Promise.all(
								bigMaps.map(async (bigMap) => ({
									bigMap,
									keys: await listBigMapKeys({
										binding: tzktRestBinding,
										bigMapId: bigMap.ptr,
										limit: Math.max(1, Math.floor(resolverContextRowLimit(context) / Math.max(bigMaps.length, 1))),
									}),
								}))
							)
						).flatMap(({ bigMap, keys }) => (
							keys.map((key) => ({
								bigMap,
								key,
							}))
						))
						return keyRows.map(({ bigMap, key }) => ({
							[EntityMetaKey.Selector]: {
								$bigMap: {
									$contract: {
										$network: { $network: $network },
										address: bigMap.contract.address,
									},
									bigMapId: BigInt(bigMap.ptr),
								},
								keyHash: key.hash,
							},
						}))
					},
				},
			},
		})({
				$$bigMapKeys: (keys) => keys,
			}),

		defineResolver(Source.Tzkt_Rest, {
			entityType: EntityType.TezosContract,
			resolve: {
				[TezosContractSelector.NetworkAddress]: {
					resolve: async ({ $network, address }) => {
						assertTezosMainnet($network.$network)
						const { getContract } = await import('$/sources/Tzkt/Rest/queries.ts')
						await getContract({
							binding: tzktRestBinding,
							address,
						})
						return {
							$network: {
								[EntityMetaKey.Selector]: $network,
							},
							address,
						}
					},
				},
			},
		})({
				$network: (contract) => contract.$network,
				address: (contract) => contract.address,
			}),

		defineResolver(Source.Tzkt_Rest, {
			entityType: EntityType.TezosContract,
			resolve: {
				[TezosContractSelector.NetworkAddress]: {
					resolve: async ({ $network, address }, context) => {
						assertTezosMainnet($network.$network)
						const { listBigMaps } = await import('$/sources/Tzkt/Rest/queries.ts')
						return (await listBigMaps({
							binding: tzktRestBinding,
							contract: address,
							limit: resolverContextRowLimit(context),
						})).map((bigMap) => ({
							[EntityMetaKey.Selector]: {
								$contract: {
									$network: $network,
									address,
								},
								bigMapId: BigInt(bigMap.ptr),
							},
						}))
					},
				},
			},
		})({
				$$bigMaps: (bigMaps) => bigMaps,
			}),

		defineResolver(Source.Tzkt_Rest, {
			entityType: EntityType.TezosOperationGroup,
			resolve: {
				[TezosOperationGroupSelector.NetworkOperationHash]: {
					resolve: async ({ $network, operationHash }) => {
						assertTezosMainnet($network.$network)
						const { listOperationsByHash } = await import('$/sources/Tzkt/Rest/queries.ts')
						const operations = await listOperationsByHash({
							binding: tzktRestBinding,
							operationHash,
						})
						if (operations.length === 0)
							throw new Error(`Tzkt_Rest: operation group ${operationHash} not found`)
						return {
							$network: {
								[EntityMetaKey.Selector]: $network,
							},
							operationHash,
						}
					},
				},
			},
		})({
				$network: (operationGroup) => operationGroup.$network,
				operationHash: (operationGroup) => operationGroup.operationHash,
			}),

		defineResolver(Source.Tzkt_Rest, {
			entityType: EntityType.TezosOperationGroup,
			resolve: {
				[TezosOperationGroupSelector.NetworkOperationHash]: {
					resolve: async ({ $network, operationHash }) => {
						assertTezosMainnet($network.$network)
						const { listOperationsByHash } = await import('$/sources/Tzkt/Rest/queries.ts')
						const operations = await listOperationsByHash({
							binding: tzktRestBinding,
							operationHash,
						})
						return operations.map((operation, contentIndex) => ({
							[EntityMetaKey.Selector]: {
								$operationGroup: {
									$network,
									operationHash,
								},
								contentIndex,
							},
							[EntityMetaKey.Fields]: {
								[entityFieldAddressKey(EntityType.TezosOperation, [], 'operationKind')]: operationKindFromWire(operation),
							},
						}))
					},
				},
			},
		})({
				$$operations: (operations) => operations,
			}),

		defineResolver(Source.Tzkt_Rest, {
			entityType: EntityType.TezosOperation,
			resolve: {
				[TezosOperationSelector.OperationGroupContentIndex]: {
					resolve: async ({ $operationGroup, contentIndex }) => {
						assertTezosMainnet($operationGroup.$network.$network)
						const { listOperationsByHash } = await import('$/sources/Tzkt/Rest/queries.ts')
						const operations = await listOperationsByHash({
							binding: tzktRestBinding,
							operationHash: $operationGroup.operationHash,
						})
						const operation = operations.at(contentIndex)
						if (operation == null)
							throw new Error(`Tzkt_Rest: operation ${$operationGroup.operationHash}[${contentIndex}] not found`)
						return {
							$operationGroup: operationGroupReference(
								$operationGroup.$network,
								$operationGroup.operationHash
							),
							contentIndex,
							operationKind: operationKindFromWire(operation),
						}
					},
				},
			},
		})({
				$operationGroup: (operation) => operation.$operationGroup,
				contentIndex: (operation) => operation.contentIndex,
				operationKind: (operation) => operation.operationKind,
			}),

		defineResolver(Source.Tzkt_Rest, {
			entityType: EntityType.TezosOperation,
			resolve: {
				[TezosOperationSelector.OperationGroupContentIndex]: {
					resolve: async ({ $operationGroup, contentIndex }) => {
						assertTezosMainnet($operationGroup.$network.$network)
						const { listOperationsByHash, listBigMapUpdates } = await import('$/sources/Tzkt/Rest/queries.ts')
						const operations = await listOperationsByHash({
							binding: tzktRestBinding,
							operationHash: $operationGroup.operationHash,
						})
						const operation = operations.at(contentIndex)
						if (operation == null) return []
						const updates = await listBigMapUpdates({
							binding: tzktRestBinding,
							level: operation.level,
						})
						return updates.flatMap((update) => (
							update.content?.hash == null ?
								[]
							:
								[
									{
										[EntityMetaKey.Selector]: {
											$operation: {
												$operationGroup: $operationGroup,
												contentIndex,
											},
											bigMapId: BigInt(update.bigmap),
											keyHash: update.content.hash,
										},
									},
								]
						))
					},
				},
			},
		})({
				$$bigMapDiffs: (diffs) => diffs,
			}),

		defineResolver(Source.Tzkt_Rest, {
			entityType: EntityType.TezosBigMap,
			resolve: {
				[TezosBigMapSelector.ContractBigMapId]: {
					resolve: async ({ $contract, bigMapId }) => {
						assertTezosMainnet($contract.$network.$network)
						const { getBigMap } = await import('$/sources/Tzkt/Rest/queries.ts')
						const bigMap = await getBigMap({
							binding: tzktRestBinding,
							bigMapId,
						})
						if (BigInt(bigMap.ptr) !== bigMapId)
							throw new Error(`Tzkt_Rest: big map ${bigMapId.toString()} not found`)
						return bigMapFieldsFromWire($contract, bigMap, bigMapId)
					},
				},
			},
		})({
				$contract: (bigMap) => bigMap[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.TezosBigMap, [], '$contract')],
				bigMapId: (bigMap) => bigMap.bigMapId,
				path: (bigMap) => bigMap.path,
				keyType: (bigMap) => bigMap.keyType,
				valueType: (bigMap) => bigMap.valueType,
			}),

		defineResolver(Source.Tzkt_Rest, {
			entityType: EntityType.TezosBigMap,
			resolve: {
				[TezosBigMapSelector.ContractBigMapId]: {
					resolve: async ({ $contract, bigMapId }, context) => {
						assertTezosMainnet($contract.$network.$network)
						const { listBigMapKeys } = await import('$/sources/Tzkt/Rest/queries.ts')
						return (await listBigMapKeys({
							binding: tzktRestBinding,
							bigMapId,
							limit: resolverContextRowLimit(context),
						})).map((key) => ({
							[EntityMetaKey.Selector]: {
								$bigMap: {
									$contract: $contract,
									bigMapId,
								},
								keyHash: key.hash,
							},
						}))
					},
				},
			},
		})({
				$$keys: (keys) => keys,
			}),

		defineResolver(Source.Tzkt_Rest, {
			entityType: EntityType.TezosBigMap,
			resolve: {
				[TezosBigMapSelector.ContractBigMapId]: {
					resolve: async ({ $contract, bigMapId }, context) => {
						assertTezosMainnet($contract.$network.$network)
						const { listBigMapUpdates } = await import('$/sources/Tzkt/Rest/queries.ts')
						return (await listBigMapUpdates({
							binding: tzktRestBinding,
							bigMapId,
							limit: resolverContextRowLimit(context),
						})).map((update) => ({
							[EntityMetaKey.Selector]: {
								$bigMap: {
									$contract: $contract,
									bigMapId,
								},
								level: BigInt(update.level),
								source: Source.Tzkt_Rest,
							},
						}))
					},
				},
			},
		})({
				$$timestamps: (timestamps) => timestamps,
			}),

		defineResolver(Source.Tzkt_Rest, {
			entityType: EntityType.TezosBigMapKey,
			resolve: {
				[TezosBigMapKeySelector.BigMapKeyHash]: {
					resolve: async ({ $bigMap, keyHash }, context) => {
						assertTezosMainnet($bigMap.$contract.$network.$network)
						const { listBigMapUpdates } = await import('$/sources/Tzkt/Rest/queries.ts')
						return (await listBigMapUpdates({
							binding: tzktRestBinding,
							bigMapId: $bigMap.bigMapId,
							keyHash,
							limit: resolverContextRowLimit(context),
						})).map((update) => ({
							[EntityMetaKey.Selector]: {
								$bigMapKey: {
									$bigMap: $bigMap,
									keyHash,
								},
								level: BigInt(update.level),
								source: Source.Tzkt_Rest,
							},
						}))
					},
				},
			},
		})({
				$$timestamps: (timestamps) => timestamps,
			}),

		defineResolver(Source.Tzkt_Rest, {
			entityType: EntityType.TezosBigMap_Timestamp,
			resolve: {
				[TezosBigMap_TimestampSelector.BigMapLevelSource]: {
					resolve: async ({ $bigMap, level, source }) => {
						assertTezosMainnet($bigMap.$contract.$network.$network)
						if (source !== Source.Tzkt_Rest)
							throw new Error(`Tzkt_Rest: unsupported observation source ${source}`)
						const { getBigMap, getBlock } = await import('$/sources/Tzkt/Rest/queries.ts')
						const [
							bigMap,
							block,
						] = await Promise.all([
							getBigMap({
								binding: tzktRestBinding,
								bigMapId: $bigMap.bigMapId,
								level,
							}),
							getBlock({
								binding: tzktRestBinding,
								level,
							}),
						])
						return {
							$bigMap: {
								[EntityMetaKey.Selector]: $bigMap,
							},
							level,
							source,
							timestampMs: timestampMsFromIso(block.timestamp),
							active: (
								level >= BigInt(bigMap.firstLevel)
								&& level <= BigInt(bigMap.lastLevel)
							),
							keyCount: bigMap.activeKeys,
							updateCount: bigMap.updates,
						}
					},
				},
			},
		})({
				$bigMap: (timestamp) => timestamp.$bigMap,
				level: (timestamp) => timestamp.level,
				source: (timestamp) => timestamp.source,
				timestampMs: (timestamp) => timestamp.timestampMs,
				active: (timestamp) => timestamp.active,
				keyCount: (timestamp) => timestamp.keyCount,
				updateCount: (timestamp) => timestamp.updateCount,
			}),

		defineResolver(Source.Tzkt_Rest, {
			entityType: EntityType.TezosBigMapDiff,
			resolve: {
				[TezosBigMapDiffSelector.OperationBigMapIdKeyHash]: {
					resolve: async ({
						$operation,
						bigMapId,
						keyHash,
					}) => {
						assertTezosMainnet($operation.$operationGroup.$network.$network)
						const { listOperationsByHash, listBigMapUpdates } = await import('$/sources/Tzkt/Rest/queries.ts')
						const operations = await listOperationsByHash({
							binding: tzktRestBinding,
							operationHash: $operation.$operationGroup.operationHash,
						})
						const operation = operations.at($operation.contentIndex)
						if (operation == null)
							throw new Error(`Tzkt_Rest: operation ${$operation.$operationGroup.operationHash}[${$operation.contentIndex}] not found`)
						const updates = await listBigMapUpdates({
							binding: tzktRestBinding,
							bigMapId,
							level: operation.level,
						})
						const update = updates.find((row) => row.content?.hash === keyHash)
						if (update == null)
							throw new Error(`Tzkt_Rest: big map diff ${bigMapId.toString()}/${keyHash} not found at level ${operation.level}`)
						return bigMapDiffFieldsFromWire({
							$contract: {
								$network: $operation.$operationGroup.$network,
								address: update.contract?.address ?? '',
							},
							bigMapId,
							keyHash,
							update,
							operationSelector: $operation,
						})
					},
				},
			},
		})({
				$operation: (diff) => diff.$operation,
				bigMapId: (diff) => diff.bigMapId,
				keyHash: (diff) => diff.keyHash,
				action: (diff) => diff.action,
				key: (diff) => diff.key,
				value: (diff) => diff.value,
				$bigMap: (diff) => diff.$bigMap,
			}),

		defineResolver(Source.Tzkt_Rest, {
			entityType: EntityType.TezosBigMapKey,
			resolve: {
				[TezosBigMapKeySelector.BigMapKeyHash]: {
					resolve: async ({ $bigMap, keyHash }) => {
						assertTezosMainnet($bigMap.$contract.$network.$network)
						const { getBigMapKey } = await import('$/sources/Tzkt/Rest/queries.ts')
						const key = await getBigMapKey({
							binding: tzktRestBinding,
							bigMapId: $bigMap.bigMapId,
							keyHash,
						})
						return bigMapKeyFieldsFromWire($bigMap, key)
					},
				},
			},
		})({
				$bigMap: (key) => key.$bigMap,
				keyHash: (key) => key.keyHash,
			}),

		defineResolver(Source.Tzkt_Rest, {
			entityType: EntityType.TezosBigMapKey_Timestamp,
			resolve: {
				[TezosBigMapKey_TimestampSelector.BigMapKeyLevelSource]: {
					resolve: async ({
						$bigMapKey,
						level,
						source,
					}) => {
						assertTezosMainnet($bigMapKey.$bigMap.$contract.$network.$network)
						if (source !== Source.Tzkt_Rest)
							throw new Error(`Tzkt_Rest: unsupported observation source ${source}`)
						const { getBigMapKey, getBlock } = await import('$/sources/Tzkt/Rest/queries.ts')
						const [
							key,
							block,
						] = await Promise.all([
							getBigMapKey({
								binding: tzktRestBinding,
								bigMapId: $bigMapKey.$bigMap.bigMapId,
								keyHash: $bigMapKey.keyHash,
								level,
							}),
							getBlock({
								binding: tzktRestBinding,
								level,
							}),
						])
						return {
							$bigMapKey: {
								[EntityMetaKey.Selector]: {
									$bigMap: $bigMapKey.$bigMap,
									keyHash: $bigMapKey.keyHash,
								},
							},
							level,
							source,
							timestampMs: timestampMsFromIso(block.timestamp),
							key: key.key,
							value: key.value,
							firstLevel: BigInt(key.firstLevel),
							lastLevel: BigInt(key.lastLevel),
							updateCount: key.updates,
							active: key.active,
						}
					},
				},
			},
		})({
				$bigMapKey: (timestamp) => timestamp.$bigMapKey,
				level: (timestamp) => timestamp.level,
				source: (timestamp) => timestamp.source,
				timestampMs: (timestamp) => timestamp.timestampMs,
				key: (timestamp) => timestamp.key,
				value: (timestamp) => timestamp.value,
				firstLevel: (timestamp) => timestamp.firstLevel,
				lastLevel: (timestamp) => timestamp.lastLevel,
				updateCount: (timestamp) => timestamp.updateCount,
				active: (timestamp) => timestamp.active,
			}),
	],
}
