import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import { networkBySlug } from '$/constants/Network.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'
import type {
	TzktBigMapKey,
	TzktBigMapUpdate,
	TzktBlock,
	TzktContract,
	TzktOperation,
	TzktAccount,
	TzktToken,
	TzktTokenBalance,
	TzktTokenTransfer,
} from '$/sources/Tzkt/Rest/types.ts'

type NetworkId = EntitySelector<typeof schema, EntityType.Network>

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

const optionalBigInt = (value: number | undefined) => (
	value == null ?
		undefined
	:
		BigInt(value)
)

const operationFieldsFromWire = (operation: TzktOperation) => ({
	operationKind: operationKindFromWire(operation),
	...(operation.sender?.address != null && {
		sourceAddress: operation.sender.address,
	}),
	...(operation.target?.address != null && {
		destinationAddress: operation.target.address,
	}),
	...(operation.newDelegate?.address != null && {
		delegateAddress: operation.newDelegate.address,
	}),
	...(operation.originatedContract?.address != null && {
		contractAddress: operation.originatedContract.address,
	}),
	...(optionalBigInt(operation.counter) != null && {
		counter: optionalBigInt(operation.counter),
	}),
	...(optionalBigInt(operation.bakerFee) != null && {
		feeMutez: optionalBigInt(operation.bakerFee),
	}),
	...(optionalBigInt(operation.gasLimit) != null && {
		gasLimit: optionalBigInt(operation.gasLimit),
	}),
	...(optionalBigInt(operation.storageLimit) != null && {
		storageLimit: optionalBigInt(operation.storageLimit),
	}),
	...(optionalBigInt(operation.amount) != null && {
		amountMutez: optionalBigInt(operation.amount),
	}),
	...(operation.parameter != null && {
		parameters: operation.parameter,
	}),
	...(operation.status != null && {
		status: operation.status,
	}),
	...(optionalBigInt(operation.gasUsed) != null && {
		consumedGas: optionalBigInt(operation.gasUsed),
	}),
	...(optionalBigInt(operation.storageUsed) != null && {
		storageSize: optionalBigInt(operation.storageUsed),
	}),
	...((() => {
		const originatedContractAddresses = (
			operation.originatedContracts?.map((contract) => contract.address)
			?? (
				operation.originatedContract?.address == null ?
					[]
				:
					[operation.originatedContract.address]
			)
		)
		return originatedContractAddresses.length > 0 ?
			{
				originatedContractAddresses,
			}
		:
			{}
	})()),
})

const blockFieldsFromWire = (
	tezosNetwork: { $network: NetworkId },
	block: TzktBlock,
	level: bigint
) => {
	const timestampMs = timestampMsFromIso(block.timestamp)
	if (!Number.isFinite(timestampMs))
		throw new Error(`Tzkt_Rest: block ${level.toString()} has an invalid timestamp`)
	if (block.hash.trim() === '')
		throw new Error(`Tzkt_Rest: block ${level.toString()} has an empty hash`)
	if (BigInt(block.level) !== level)
		throw new Error(`Tzkt_Rest: block response level ${block.level} does not match ${level.toString()}`)

	return {
		$network: {
			[EntityMetaKey.Selector]: tezosNetwork,
		},
		level,
		hash: block.hash,
		timestampMs,
		...(block.protocol != null && block.protocol.length > 0 && {
			protocolHash: block.protocol,
		}),
		...(block.predecessor != null && block.predecessor.length > 0 && {
			predecessorHash: block.predecessor,
		}),
		...(block.baker?.address != null && {
			bakerAddress: block.baker.address,
		}),
		...(block.blockRound != null && {
			round: block.blockRound,
		}),
		...(block.cycle != null && {
			cycle: BigInt(block.cycle),
		}),
		...(block.payloadHash != null && block.payloadHash.length > 0 && {
			payloadHash: block.payloadHash,
		}),
		...(block.operationsHash != null && block.operationsHash.length > 0 && {
			operationsHash: block.operationsHash,
		}),
		...(block.fitness != null && {
			fitness: block.fitness,
		}),
	}
}

const contractFieldsFromWire = (
	tezosNetwork: { $network: NetworkId },
	address: string,
	contract: TzktContract
) => {
	if (contract.address !== address)
		throw new Error('Tzkt_Rest: contract response does not match the subject')

	return {
		$network: {
			[EntityMetaKey.Selector]: tezosNetwork,
		},
		address,
		...(contract.typeHash != null && {
			scriptHash: String(contract.typeHash),
		}),
		...(contract.codeHash != null && {
			codeHash: String(contract.codeHash),
		}),
		$account: {
			[EntityMetaKey.Selector]: {
				$network: tezosNetwork,
				address,
			},
		},
	}
}

const tokenMetadataNumber = (value: string | number | undefined) => {
	if (value == null)
		return undefined
	const number = typeof value === 'number' ? value : Number(value)
	if (!Number.isFinite(number))
		throw new Error('Tzkt_Rest: token metadata number is malformed')

	return number
}

const tokenFieldsFromWire = (
	tezosNetwork: { $network: NetworkId },
	contractAddress: string,
	tokenId: bigint,
	token: TzktToken
) => {
	if (
		token.contract.address !== contractAddress
		|| token.tokenId !== tokenId.toString()
	)
		throw new Error(`Tzkt_Rest: token response does not match ${contractAddress}/${tokenId.toString()}`)

	return {
		$network: {
			[EntityMetaKey.Selector]: tezosNetwork,
		},
		contractAddress,
		tokenId,
		...(token.standard != null && {
			standard: token.standard,
		}),
		$contract: {
			[EntityMetaKey.Selector]: {
				$network: tezosNetwork,
				address: contractAddress,
			},
		},
	}
}

const tokenTimestampFieldsFromWire = (
	$token: {
		$network: { $network: NetworkId }
		contractAddress: string
		tokenId: bigint
	},
	level: bigint,
	source: string,
	token: TzktToken
) => {
	if (token.lastLevel == null || !Number.isSafeInteger(token.lastLevel) || token.lastLevel < 0)
		throw new Error('Tzkt_Rest: token response is missing a last level')
	if (BigInt(token.lastLevel) !== level)
		throw new Error(`Tzkt_Rest: token observation level ${token.lastLevel} does not match ${level.toString()}`)

	return {
		$token: {
			[EntityMetaKey.Selector]: $token,
		},
		level,
		source,
		...(token.metadataUri != null && {
			metadataUri: token.metadataUri,
		}),
		...(token.metadata?.name != null && {
			name: token.metadata.name,
		}),
		...(token.metadata?.symbol != null && {
			symbol: token.metadata.symbol,
		}),
		...(tokenMetadataNumber(token.metadata?.decimals) != null && {
			decimals: tokenMetadataNumber(token.metadata?.decimals),
		}),
		...(token.metadata?.artifactUri != null && {
			artifactUri: token.metadata.artifactUri,
		}),
		...(token.metadata?.displayUri != null && {
			displayUri: token.metadata.displayUri,
		}),
		...(token.metadata?.thumbnailUri != null && {
			thumbnailUri: token.metadata.thumbnailUri,
		}),
		...(token.totalSupply != null && /^\d+$/.test(token.totalSupply) && {
			totalSupply: BigInt(token.totalSupply),
		}),
		...(token.holdersCount != null && {
			holderCount: token.holdersCount,
		}),
		...(token.transfersCount != null && {
			transferCount: token.transfersCount,
		}),
	}
}

const operationGroupReference = (
	tezosNetwork: { $network: NetworkId },
	operationHash: string
) => ({
	[EntityMetaKey.Selector]: {
		$network: tezosNetwork,
		operationHash,
	},
})

const networkContinuation = (
	operation: string,
	offset: number,
	limit: number,
	rowCount: number
) => (
	rowCount < limit ?
		{
			operation,
			terminal: true,
		}
	:
		{
			operation,
			terminal: false,
			token: String(offset + rowCount),
		}
)

export default {
	source: Source.Tzkt_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.TezosNetwork,
			resolve: {
				Network: {
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

		defineResolver({
			entityType: EntityType.TezosAccount,
			resolve: {
				NetworkAddress: {
					resolve: async (account) => {
						assertTezosMainnet(account.$network.$network)
						const { getAccount } = await import('$/sources/Tzkt/Rest/queries.ts')
						const snapshot = await getAccount({
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

		defineResolver({
			entityType: EntityType.TezosAccount,
			resolve: {
				NetworkAddress: {
					resolve: async (account, context) => {
						assertTezosMainnet(account.$network.$network)
						const offset = accountOffset(context.providerContinuationToken)
						const limit = Math.min(resolverContextRowLimit(context), 1_000)
						const {
							listAccountOperations,
							listOperationsByHash,
						} = await import('$/sources/Tzkt/Rest/queries.ts')
						const operations = await listAccountOperations({
							address: account.address,
							offset,
							limit,
						})
						const operationGroupsByHash = new Map<string, TzktOperation[]>()
						await Promise.all(
							[...new Set(operations.map((operation) => operation.hash))]
								.map(async (operationHash) => {
									const operationGroup = await listOperationsByHash({
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

		defineResolver({
			entityType: EntityType.TezosAccount,
			resolve: {
				NetworkAddress: {
					resolve: async (account, context) => {
						assertTezosMainnet(account.$network.$network)
						const offset = accountOffset(context.providerContinuationToken)
						const limit = Math.min(resolverContextRowLimit(context), 1_000)
						const { listAccountTokenBalances } = await import('$/sources/Tzkt/Rest/queries.ts')
						const balances = await listAccountTokenBalances({
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

		defineResolver({
			entityType: EntityType.TezosAccount,
			resolve: {
				NetworkAddress: {
					resolve: async (account, context) => {
						assertTezosMainnet(account.$network.$network)
						const offset = accountOffset(context.providerContinuationToken)
						const limit = Math.min(resolverContextRowLimit(context), 1_000)
						const { listAccountTokenTransfers } = await import('$/sources/Tzkt/Rest/queries.ts')
						const transfers = await listAccountTokenTransfers({
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

		defineResolver({
			entityType: EntityType.TezosBlock,
			resolve: {
				NetworkLevel: {
					resolve: async ({ $network, level }) => {
						assertTezosMainnet($network.$network)
						if (level < 0n || level > BigInt(Number.MAX_SAFE_INTEGER))
							throw new Error(`Tzkt_Rest: unsupported block level ${level.toString()}`)

						const { getBlock } = await import('$/sources/Tzkt/Rest/queries.ts')
						return blockFieldsFromWire(
							$network,
							await getBlock({
								level,
							}),
							level
						)
					},
				},
			},
		})({
			$network: (block) => block.$network,
			level: (block) => block.level,
			hash: (block) => block.hash,
			timestampMs: (block) => block.timestampMs,
			protocolHash: (block) => block.protocolHash,
			predecessorHash: (block) => block.predecessorHash,
			bakerAddress: (block) => block.bakerAddress,
			round: (block) => block.round,
			cycle: (block) => block.cycle,
			payloadHash: (block) => block.payloadHash,
			operationsHash: (block) => block.operationsHash,
			fitness: (block) => block.fitness,
		}),

		defineResolver({
			entityType: EntityType.TezosNetwork,
			resolve: {
				Network: {
					resolve: async ({ $network }, context) => {
						assertTezosMainnet($network)
						const offset = accountOffset(context.providerContinuationToken)
						const limit = Math.min(resolverContextRowLimit(context), 1_000)
						const { listBlocks } = await import('$/sources/Tzkt/Rest/queries.ts')
						const blocks = await listBlocks({
							offset,
							limit,
						})
						return {
							blocks,
							limit,
							offset,
						}
					},
				},
			},
		})({
			$$blocks: {
				select: (page, { $network }) => page.blocks.map((block: TzktBlock) => ({
					[EntityMetaKey.Selector]: {
						$network: { $network },
						level: BigInt(block.level),
					},
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.TezosBlock, [], 'hash')]: block.hash,
						[entityFieldAddressKey(EntityType.TezosBlock, [], 'timestampMs')]: timestampMsFromIso(block.timestamp),
					},
				})),
				continuation: (page) => networkContinuation(
					'network-blocks',
					page.offset,
					page.limit,
					page.blocks.length
				),
			},
		}),

		defineResolver({
			entityType: EntityType.TezosNetwork,
			resolve: {
				Network: {
					resolve: async ({ $network }, context) => {
						assertTezosMainnet($network)
						const offset = accountOffset(context.providerContinuationToken)
						const limit = Math.min(resolverContextRowLimit(context), 1_000)
						const { listContracts } = await import('$/sources/Tzkt/Rest/queries.ts')
						const contracts = await listContracts({
							offset,
							limit,
						})
						for (const contract of contracts) {
							if (contract.address.length === 0)
								throw new Error('Tzkt_Rest: contract list returned an empty address')
						}
						return {
							contracts,
							limit,
							offset,
						}
					},
				},
			},
		})({
			$$contracts: {
				select: (page, { $network }) => page.contracts.map((contract: TzktContract) => ({
					[EntityMetaKey.Selector]: {
						$network: { $network },
						address: contract.address,
					},
				})),
				continuation: (page) => networkContinuation(
					'network-contracts',
					page.offset,
					page.limit,
					page.contracts.length
				),
			},
		}),

		defineResolver({
			entityType: EntityType.TezosNetwork,
			resolve: {
				Network: {
					resolve: async ({ $network }, context) => {
						assertTezosMainnet($network)
						const offset = accountOffset(context.providerContinuationToken)
						const limit = Math.min(resolverContextRowLimit(context), 1_000)
						const { listTokens } = await import('$/sources/Tzkt/Rest/queries.ts')
						const tokens = await listTokens({
							offset,
							limit,
						})
						for (const token of tokens) {
							if (
								token.contract.address.length === 0
								|| !/^\d+$/.test(token.tokenId)
							)
								throw new Error('Tzkt_Rest: token list returned a malformed identity')
						}
						return {
							limit,
							offset,
							tokens,
						}
					},
				},
			},
		})({
			$$tokens: {
				select: (page, { $network }) => page.tokens.map((token: TzktToken) => ({
					[EntityMetaKey.Selector]: {
						$network: { $network },
						contractAddress: token.contract.address,
						tokenId: BigInt(token.tokenId),
					},
					...(token.standard != null && {
						[EntityMetaKey.Fields]: {
							[entityFieldAddressKey(EntityType.TezosToken, [], 'standard')]: token.standard,
						},
					}),
				})),
				continuation: (page) => networkContinuation(
					'network-tokens',
					page.offset,
					page.limit,
					page.tokens.length
				),
			},
		}),

		defineResolver({
			entityType: EntityType.TezosNetwork,
			resolve: {
				Network: {
					resolve: async ({ $network }, context) => {
						assertTezosMainnet($network)
						const offset = accountOffset(context.providerContinuationToken)
						const limit = Math.min(resolverContextRowLimit(context), 1_000)
						const { listTokenTransfers } = await import('$/sources/Tzkt/Rest/queries.ts')
						const transfers = await listTokenTransfers({
							offset,
							limit,
						})
						for (const transfer of transfers) {
							if (
								!Number.isSafeInteger(transfer.id)
								|| transfer.id < 0
								|| !Number.isSafeInteger(transfer.level)
								|| transfer.level < 0
								|| !/^\d+$/.test(transfer.amount)
								|| transfer.token.contract.address.length === 0
								|| !/^\d+$/.test(transfer.token.tokenId)
								|| !Number.isSafeInteger(timestampMsFromIso(transfer.timestamp))
							)
								throw new Error('Tzkt_Rest: network token transfer response is malformed')
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
				select: (page, { $network }) => page.transfers.map((transfer: TzktTokenTransfer) => ({
					[EntityMetaKey.Selector]: {
						$network: { $network },
						transferId: String(transfer.id),
						source: Source.Tzkt_Rest,
					},
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.TezosTokenTransfer, [], '$token')]: {
							[EntityMetaKey.Selector]: {
								$network: { $network },
								contractAddress: transfer.token.contract.address,
								tokenId: BigInt(transfer.token.tokenId),
							},
						},
						[entityFieldAddressKey(EntityType.TezosTokenTransfer, [], 'level')]: BigInt(transfer.level),
						[entityFieldAddressKey(EntityType.TezosTokenTransfer, [], 'timestampMs')]: timestampMsFromIso(transfer.timestamp),
						[entityFieldAddressKey(EntityType.TezosTokenTransfer, [], 'amount')]: BigInt(transfer.amount),
					},
				})),
				continuation: (page) => networkContinuation(
					'network-token-transfers',
					page.offset,
					page.limit,
					page.transfers.length
				),
			},
		}),

		defineResolver({
			entityType: EntityType.TezosNetwork,
			resolve: {
				Network: {
					resolve: async ({ $network }) => {
						assertTezosMainnet($network)
						const {
							getCurrentStatistics,
							getHead,
						} = await import('$/sources/Tzkt/Rest/queries.ts')
						const [
							head,
							statistics,
						] = await Promise.all([
							getHead(),
							getCurrentStatistics(),
						])
						if (head.chainId !== networkBySlug.tezos.caip2.reference)
							throw new Error(`Tzkt_Rest: head chainId ${head.chainId} is not Tezos mainnet`)
						if (statistics.level !== head.level)
							throw new Error('Tzkt_Rest: statistics level does not match head')
						const timestampMs = timestampMsFromIso(head.timestamp)
						if (!Number.isSafeInteger(timestampMs))
							throw new Error('Tzkt_Rest: head timestamp is invalid')

						return [{
							[EntityMetaKey.Selector]: {
								$network: { $network },
								timestampMs,
								source: Source.Tzkt_Rest,
							},
							[EntityMetaKey.Fields]: {
								[entityFieldAddressKey(EntityType.TezosNetwork_Timestamp, [], 'latestLevel')]: BigInt(head.level),
								[entityFieldAddressKey(EntityType.TezosNetwork_Timestamp, [], 'protocolHash')]: head.protocol,
								[entityFieldAddressKey(EntityType.TezosNetwork_Timestamp, [], 'cycle')]: BigInt(head.cycle),
								[entityFieldAddressKey(EntityType.TezosNetwork_Timestamp, [], 'totalSupplyMutez')]: BigInt(statistics.totalSupply),
								[entityFieldAddressKey(EntityType.TezosNetwork_Timestamp, [], 'indexerLagBlocks')]: (
									head.knownLevel == null ?
										0
									:
										Math.max(0, head.knownLevel - head.level)
								),
							},
						}]
					},
				},
			},
		})({
			$$timestamps: (timestamps) => timestamps,
		}),

		defineResolver({
			entityType: EntityType.TezosNetwork,
			resolve: {
				Network: {
					resolve: async ({ $network }, context) => {
						assertTezosMainnet($network)
						const { listBigMaps } = await import('$/sources/Tzkt/Rest/queries.ts')
						return (await listBigMaps({
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

		defineResolver({
			entityType: EntityType.TezosNetwork,
			resolve: {
				Network: {
					resolve: async ({ $network }, context) => {
						assertTezosMainnet($network)
						const { listBigMapUpdates } = await import('$/sources/Tzkt/Rest/queries.ts')
						return (await listBigMapUpdates({
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

		defineResolver({
			entityType: EntityType.TezosNetwork,
			resolve: {
				Network: {
					resolve: async ({ $network }, context) => {
						assertTezosMainnet($network)
						const { listBigMaps, listBigMapKeys } = await import('$/sources/Tzkt/Rest/queries.ts')
						const bigMaps = await listBigMaps({
							limit: Math.min(resolverContextRowLimit(context), 5),
						})
						const keyRows = (
							await Promise.all(
								bigMaps.map(async (bigMap) => ({
									bigMap,
									keys: await listBigMapKeys({
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

		defineResolver({
			entityType: EntityType.TezosNetwork,
			resolve: {
				Network: {
					resolve: async ({ $network }, context) => {
						assertTezosMainnet($network)
						const { listBigMaps, listBigMapKeys } = await import('$/sources/Tzkt/Rest/queries.ts')
						const bigMaps = await listBigMaps({
							limit: Math.min(resolverContextRowLimit(context), 5),
						})
						const keyRows = (
							await Promise.all(
								bigMaps.map(async (bigMap) => ({
									bigMap,
									keys: await listBigMapKeys({
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

		defineResolver({
			entityType: EntityType.TezosContract,
			resolve: {
				NetworkAddress: {
					resolve: async ({ $network, address }) => {
						assertTezosMainnet($network.$network)
						const { getContract } = await import('$/sources/Tzkt/Rest/queries.ts')
						return contractFieldsFromWire(
							$network,
							address,
							await getContract({
								address,
							})
						)
					},
				},
			},
		})({
				$network: (contract) => contract.$network,
				address: (contract) => contract.address,
				scriptHash: (contract) => contract.scriptHash,
				codeHash: (contract) => contract.codeHash,
				$account: (contract) => contract.$account,
			}),

		defineResolver({
			entityType: EntityType.TezosContract,
			resolve: {
				NetworkAddress: {
					resolve: async ({ $network, address }, context) => {
						assertTezosMainnet($network.$network)
						const { listBigMaps } = await import('$/sources/Tzkt/Rest/queries.ts')
						return (await listBigMaps({
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

		defineResolver({
			entityType: EntityType.TezosOperationGroup,
			resolve: {
				NetworkOperationHash: {
					resolve: async ({ $network, operationHash }) => {
						assertTezosMainnet($network.$network)
						const { listOperationsByHash } = await import('$/sources/Tzkt/Rest/queries.ts')
						const operations = await listOperationsByHash({
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

		defineResolver({
			entityType: EntityType.TezosOperationGroup,
			resolve: {
				NetworkOperationHash: {
					resolve: async ({ $network, operationHash }) => {
						assertTezosMainnet($network.$network)
						const { listOperationsByHash } = await import('$/sources/Tzkt/Rest/queries.ts')
						const operations = await listOperationsByHash({
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

		defineResolver({
			entityType: EntityType.TezosOperation,
			resolve: {
				OperationGroupContentIndex: {
					resolve: async ({ $operationGroup, contentIndex }) => {
						assertTezosMainnet($operationGroup.$network.$network)
						const { listOperationsByHash } = await import('$/sources/Tzkt/Rest/queries.ts')
						const operations = await listOperationsByHash({
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
							...operationFieldsFromWire(operation),
							...(operation.level != null && {
								$block: {
									[EntityMetaKey.Selector]: {
										$network: $operationGroup.$network,
										level: BigInt(operation.level),
									},
								},
							}),
						}
					},
				},
			},
		})({
				$operationGroup: (operation) => operation.$operationGroup,
				contentIndex: (operation) => operation.contentIndex,
				operationKind: (operation) => operation.operationKind,
				sourceAddress: (operation) => operation.sourceAddress,
				destinationAddress: (operation) => operation.destinationAddress,
				delegateAddress: (operation) => operation.delegateAddress,
				contractAddress: (operation) => operation.contractAddress,
				counter: (operation) => operation.counter,
				feeMutez: (operation) => operation.feeMutez,
				gasLimit: (operation) => operation.gasLimit,
				storageLimit: (operation) => operation.storageLimit,
				amountMutez: (operation) => operation.amountMutez,
				parameters: (operation) => operation.parameters,
				status: (operation) => operation.status,
				consumedGas: (operation) => operation.consumedGas,
				storageSize: (operation) => operation.storageSize,
				originatedContractAddresses: (operation) => operation.originatedContractAddresses,
				$block: (operation) => operation.$block,
			}),

		defineResolver({
			entityType: EntityType.TezosOperation,
			resolve: {
				OperationGroupContentIndex: {
					resolve: async ({ $operationGroup, contentIndex }) => {
						assertTezosMainnet($operationGroup.$network.$network)
						const { listOperationsByHash, listBigMapUpdates } = await import('$/sources/Tzkt/Rest/queries.ts')
						const operations = await listOperationsByHash({
							operationHash: $operationGroup.operationHash,
						})
						const operation = operations.at(contentIndex)
						if (operation == null)
							throw new Error(`Tzkt_Rest: operation ${$operationGroup.operationHash}[${contentIndex}] not found`)
						const updates = await listBigMapUpdates({
							level: operation.level,
						})
						return updates.flatMap((update) => (
							update.content?.hash == null || update.contract?.address == null ?
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

		defineResolver({
			entityType: EntityType.TezosBigMap,
			resolve: {
				ContractBigMapId: {
					resolve: async ({ $contract, bigMapId }) => {
						assertTezosMainnet($contract.$network.$network)
						const { getBigMap } = await import('$/sources/Tzkt/Rest/queries.ts')
						const bigMap = await getBigMap({
							bigMapId,
						})
						if (BigInt(bigMap.ptr) !== bigMapId)
							throw new Error(`Tzkt_Rest: big map ${bigMapId.toString()} not found`)
						return {
							$contract: {
								[EntityMetaKey.Selector]: $contract,
							},
							bigMapId,
							path: bigMap.path,
							...(bigMap.keyType != null && {
								keyType: bigMap.keyType,
							}),
							...(bigMap.valueType != null && {
								valueType: bigMap.valueType,
							}),
						}
					},
				},
			},
		})({
				$contract: (bigMap) => bigMap.$contract,
				bigMapId: (bigMap) => bigMap.bigMapId,
				path: (bigMap) => bigMap.path,
				keyType: (bigMap) => bigMap.keyType,
				valueType: (bigMap) => bigMap.valueType,
			}),

		defineResolver({
			entityType: EntityType.TezosBigMap,
			resolve: {
				ContractBigMapId: {
					resolve: async ({ $contract, bigMapId }, context) => {
						assertTezosMainnet($contract.$network.$network)
						const { listBigMapKeys } = await import('$/sources/Tzkt/Rest/queries.ts')
						return (await listBigMapKeys({
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

		defineResolver({
			entityType: EntityType.TezosBigMap,
			resolve: {
				ContractBigMapId: {
					resolve: async ({ $contract, bigMapId }, context) => {
						assertTezosMainnet($contract.$network.$network)
						const { listBigMapUpdates } = await import('$/sources/Tzkt/Rest/queries.ts')
						return (await listBigMapUpdates({
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

		defineResolver({
			entityType: EntityType.TezosBigMapKey,
			resolve: {
				BigMapKeyHash: {
					resolve: async ({ $bigMap, keyHash }, context) => {
						assertTezosMainnet($bigMap.$contract.$network.$network)
						const { listBigMapUpdates } = await import('$/sources/Tzkt/Rest/queries.ts')
						return (await listBigMapUpdates({
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

		defineResolver({
			entityType: EntityType.TezosBigMap_Timestamp,
			resolve: {
				BigMapLevelSource: {
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
								bigMapId: $bigMap.bigMapId,
								level,
							}),
							getBlock({
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

		defineResolver({
			entityType: EntityType.TezosBigMapDiff,
			resolve: {
				OperationBigMapIdKeyHash: {
					resolve: async ({
						$operation,
						bigMapId,
						keyHash,
					}) => {
						assertTezosMainnet($operation.$operationGroup.$network.$network)
						const { listOperationsByHash, listBigMapUpdates } = await import('$/sources/Tzkt/Rest/queries.ts')
						const operations = await listOperationsByHash({
							operationHash: $operation.$operationGroup.operationHash,
						})
						const operation = operations.at($operation.contentIndex)
						if (operation == null)
							throw new Error(`Tzkt_Rest: operation ${$operation.$operationGroup.operationHash}[${$operation.contentIndex}] not found`)
						const updates = await listBigMapUpdates({
							bigMapId,
							level: operation.level,
						})
						const update = updates.find((row) => row.content?.hash === keyHash)
						if (update == null)
							throw new Error(`Tzkt_Rest: big map diff ${bigMapId.toString()}/${keyHash} not found at level ${operation.level}`)
						if (update.contract?.address == null)
							throw new Error(`Tzkt_Rest: big map diff ${bigMapId.toString()}/${keyHash} is missing a contract`)
						return bigMapDiffFieldsFromWire({
							$contract: {
								$network: $operation.$operationGroup.$network,
								address: update.contract.address,
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

		defineResolver({
			entityType: EntityType.TezosBigMapKey,
			resolve: {
				BigMapKeyHash: {
					resolve: async ({ $bigMap, keyHash }) => {
						assertTezosMainnet($bigMap.$contract.$network.$network)
						const { getBigMapKey } = await import('$/sources/Tzkt/Rest/queries.ts')
						const key = await getBigMapKey({
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

		defineResolver({
			entityType: EntityType.TezosBigMapKey_Timestamp,
			resolve: {
				BigMapKeyLevelSource: {
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
								bigMapId: $bigMapKey.$bigMap.bigMapId,
								keyHash: $bigMapKey.keyHash,
								level,
							}),
							getBlock({
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

		defineResolver({
			entityType: EntityType.TezosToken,
			resolve: {
				NetworkContractAddressTokenId: {
					resolve: async ({
						$network,
						contractAddress,
						tokenId,
					}) => {
						assertTezosMainnet($network.$network)
						if (tokenId < 0n)
							throw new Error(`Tzkt_Rest: unsupported token id ${tokenId.toString()}`)
						const { getToken } = await import('$/sources/Tzkt/Rest/queries.ts')
						return tokenFieldsFromWire(
							$network,
							contractAddress,
							tokenId,
							await getToken({
								contractAddress,
								tokenId,
							})
						)
					},
				},
			},
		})({
			$network: (token) => token.$network,
			contractAddress: (token) => token.contractAddress,
			tokenId: (token) => token.tokenId,
			standard: (token) => token.standard,
			$contract: (token) => token.$contract,
		}),

		defineResolver({
			entityType: EntityType.TezosToken,
			resolve: {
				NetworkContractAddressTokenId: {
					resolve: async ({
						$network,
						contractAddress,
						tokenId,
					}) => {
						assertTezosMainnet($network.$network)
						const { getToken } = await import('$/sources/Tzkt/Rest/queries.ts')
						const token = await getToken({
							contractAddress,
							tokenId,
						})
						if (token.lastLevel == null)
							throw new Error('Tzkt_Rest: token response is missing a last level')
						return [{
							[EntityMetaKey.Selector]: {
								$token: {
									$network,
									contractAddress,
									tokenId,
								},
								level: BigInt(token.lastLevel),
								source: Source.Tzkt_Rest,
							},
						}]
					},
				},
			},
		})({
			$$timestamps: (timestamps) => timestamps,
		}),

		defineResolver({
			entityType: EntityType.TezosToken_Timestamp,
			resolve: {
				TokenLevelSource: {
					resolve: async ({
						$token,
						level,
						source,
					}) => {
						assertTezosMainnet($token.$network.$network)
						if (source !== Source.Tzkt_Rest)
							throw new Error(`Tzkt_Rest: unsupported observation source ${source}`)
						const { getToken } = await import('$/sources/Tzkt/Rest/queries.ts')
						return tokenTimestampFieldsFromWire(
							$token,
							level,
							source,
							await getToken({
								contractAddress: $token.contractAddress,
								tokenId: $token.tokenId,
							})
						)
					},
				},
			},
		})({
			$token: (timestamp) => timestamp.$token,
			level: (timestamp) => timestamp.level,
			source: (timestamp) => timestamp.source,
			metadataUri: (timestamp) => timestamp.metadataUri,
			name: (timestamp) => timestamp.name,
			symbol: (timestamp) => timestamp.symbol,
			decimals: (timestamp) => timestamp.decimals,
			artifactUri: (timestamp) => timestamp.artifactUri,
			displayUri: (timestamp) => timestamp.displayUri,
			thumbnailUri: (timestamp) => timestamp.thumbnailUri,
			totalSupply: (timestamp) => timestamp.totalSupply,
			holderCount: (timestamp) => timestamp.holderCount,
			transferCount: (timestamp) => timestamp.transferCount,
		}),

		defineResolver({
			entityType: EntityType.TezosAccount_Timestamp,
			resolve: {
				AccountLevelSource: {
					resolve: async ({
						$account,
						level,
						source,
					}) => {
						assertTezosMainnet($account.$network.$network)
						if (source !== Source.Tzkt_Rest)
							throw new Error(`Tzkt_Rest: unsupported observation source ${source}`)
						const { getAccount } = await import('$/sources/Tzkt/Rest/queries.ts')
						const snapshot = await getAccount({
							address: $account.address,
							level,
						})
						assertAccount($account.address, snapshot)
						if (BigInt(snapshot.lastLevel) !== level)
							throw new Error(`Tzkt_Rest: account observation level ${snapshot.lastLevel} does not match ${level.toString()}`)

						return {
							$account: {
								[EntityMetaKey.Selector]: $account,
							},
							level,
							source,
							timestampMs: timestampMsFromIso(snapshot.lastActivity),
							balanceMutez: BigInt(snapshot.balance),
							...(snapshot.counter != null && {
								counter: BigInt(snapshot.counter),
							}),
							...(snapshot.delegate?.address != null && {
								delegate: snapshot.delegate.address,
							}),
							...(snapshot.revealed != null && {
								isRevealed: snapshot.revealed,
							}),
							...(snapshot.publicKey != null && {
								publicKey: snapshot.publicKey,
							}),
						}
					},
				},
			},
		})({
			$account: (timestamp) => timestamp.$account,
			level: (timestamp) => timestamp.level,
			source: (timestamp) => timestamp.source,
			timestampMs: (timestamp) => timestamp.timestampMs,
			balanceMutez: (timestamp) => timestamp.balanceMutez,
			counter: (timestamp) => timestamp.counter,
			delegate: (timestamp) => timestamp.delegate,
			isRevealed: (timestamp) => timestamp.isRevealed,
			publicKey: (timestamp) => timestamp.publicKey,
		}),

		defineResolver({
			entityType: EntityType.TezosNetwork_Timestamp,
			resolve: {
				NetworkTimestampMsSource: {
					resolve: async ({
						$network,
						timestampMs,
						source,
					}) => {
						assertTezosMainnet($network.$network)
						if (source !== Source.Tzkt_Rest)
							throw new Error(`Tzkt_Rest: unsupported observation source ${source}`)
						const {
							getCurrentStatistics,
							getHead,
						} = await import('$/sources/Tzkt/Rest/queries.ts')
						const [
							head,
							statistics,
						] = await Promise.all([
							getHead(),
							getCurrentStatistics(),
						])
						const headTimestampMs = timestampMsFromIso(head.timestamp)
						if (headTimestampMs !== timestampMs)
							throw new Error(`Tzkt_Rest: network observation timestamp ${headTimestampMs} does not match ${timestampMs}`)
						if (statistics.level !== head.level)
							throw new Error('Tzkt_Rest: statistics level does not match head')

						return {
							$network: {
								[EntityMetaKey.Selector]: $network,
							},
							timestampMs,
							source,
							latestLevel: BigInt(head.level),
							protocolHash: head.protocol,
							cycle: BigInt(head.cycle),
							totalSupplyMutez: BigInt(statistics.totalSupply),
							indexerLagBlocks: (
								head.knownLevel == null ?
									0
								:
									Math.max(0, head.knownLevel - head.level)
							),
						}
					},
				},
			},
		})({
			$network: (timestamp) => timestamp.$network,
			timestampMs: (timestamp) => timestamp.timestampMs,
			source: (timestamp) => timestamp.source,
			latestLevel: (timestamp) => timestamp.latestLevel,
			protocolHash: (timestamp) => timestamp.protocolHash,
			cycle: (timestamp) => timestamp.cycle,
			totalSupplyMutez: (timestamp) => timestamp.totalSupplyMutez,
			indexerLagBlocks: (timestamp) => timestamp.indexerLagBlocks,
		}),

		defineResolver({
			entityType: EntityType.TezosContract,
			resolve: {
				NetworkAddress: {
					resolve: async ({
						$network,
						address,
					}) => {
						assertTezosMainnet($network.$network)
						const { getContract } = await import('$/sources/Tzkt/Rest/queries.ts')
						const contract = await getContract({
							address,
						})
						if (contract.address !== address)
							throw new Error('Tzkt_Rest: contract response does not match the subject')
						if (
							contract.lastActivity == null
							|| !Number.isSafeInteger(contract.lastActivity)
							|| contract.lastActivity < 0
						)
							throw new Error('Tzkt_Rest: contract response is missing last activity')

						return [{
							[EntityMetaKey.Selector]: {
								$contract: {
									$network,
									address,
								},
								level: BigInt(contract.lastActivity),
								source: Source.Tzkt_Rest,
							},
							[EntityMetaKey.Fields]: {
								...(contract.balance != null && {
									[entityFieldAddressKey(EntityType.TezosContract_Timestamp, [], 'balanceMutez')]: BigInt(contract.balance),
								}),
								...(contract.lastActivityTime != null && {
									[entityFieldAddressKey(EntityType.TezosContract_Timestamp, [], 'timestampMs')]: timestampMsFromIso(contract.lastActivityTime),
								}),
								...(contract.delegate?.address != null && {
									[entityFieldAddressKey(EntityType.TezosContract_Timestamp, [], 'delegate')]: contract.delegate.address,
								}),
							},
						}]
					},
				},
			},
		})({
			$$timestamps: (timestamps) => timestamps,
		}),

		defineResolver({
			entityType: EntityType.TezosContract_Timestamp,
			resolve: {
				ContractLevelSource: {
					resolve: async ({
						$contract,
						level,
						source,
					}) => {
						assertTezosMainnet($contract.$network.$network)
						if (source !== Source.Tzkt_Rest)
							throw new Error(`Tzkt_Rest: unsupported observation source ${source}`)
						const { getContract } = await import('$/sources/Tzkt/Rest/queries.ts')
						const contract = await getContract({
							address: $contract.address,
						})
						if (contract.address !== $contract.address)
							throw new Error('Tzkt_Rest: contract response does not match the subject')
						if (contract.lastActivity == null || BigInt(contract.lastActivity) !== level)
							throw new Error(`Tzkt_Rest: contract observation level does not match ${level.toString()}`)

						return {
							$contract: {
								[EntityMetaKey.Selector]: $contract,
							},
							level,
							source,
							...(contract.lastActivityTime != null && {
								timestampMs: timestampMsFromIso(contract.lastActivityTime),
							}),
							...(contract.balance != null && {
								balanceMutez: BigInt(contract.balance),
							}),
							...(contract.delegate?.address != null && {
								delegate: contract.delegate.address,
							}),
						}
					},
				},
			},
		})({
			$contract: (timestamp) => timestamp.$contract,
			level: (timestamp) => timestamp.level,
			source: (timestamp) => timestamp.source,
			timestampMs: (timestamp) => timestamp.timestampMs,
			balanceMutez: (timestamp) => timestamp.balanceMutez,
			delegate: (timestamp) => timestamp.delegate,
		}),
	],
} satisfies RegisteredSourceResolverModule
