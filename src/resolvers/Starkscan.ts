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

type NetworkIdentity = EntitySelector<typeof schema, EntityType.Network>
type StarknetBlockIdentity = EntitySelector<typeof schema, EntityType.StarknetBlock>
type StarknetClassIdentity = EntitySelector<typeof schema, EntityType.StarknetClass>
type StarknetTokenHoldingIdentity = EntitySelector<typeof schema, EntityType.StarknetTokenHolding>
type StarkscanExactTokenHoldings = Awaited<ReturnType<
	(typeof import('$/sources/Starkscan/Rest/queries.ts'))['getExactTokenHoldings']
>>

const starknetContractApplicability = [
	{
		$network: {
			$network: {
				caip2: networkBySlug.starknet.caip2,
			},
		},
	},
	{
		$network: {
			$network: {
				slug: networkBySlug.starknet.slug,
			},
		},
	},
] as const

const starknetNestedNetworkApplicability = [
	{
		$network: {
			$network: {
				caip2: networkBySlug.starknet.caip2,
			},
		},
	},
	{
		$network: {
			$network: {
				slug: networkBySlug.starknet.slug,
			},
		},
	},
] as const

const assertStarknetMainnet = (network: NetworkIdentity) => {
	if (
		(
			'slug' in network
			&& network.slug === networkBySlug.starknet.slug
		)
		|| (
			'caip2' in network
			&& network.caip2.namespace === networkBySlug.starknet.caip2.namespace
			&& network.caip2.reference === networkBySlug.starknet.caip2.reference
		)
	)
		return

	throw new Error('Starkscan_Rest: unsupported network')
}

const canonicalFelt = (
	value: string,
	label: string
) => {
	if (!/^0[xX][\da-fA-F]{1,64}$/.test(value) || BigInt(value) >= 2n ** 251n)
		throw new Error(`Starkscan_Rest: malformed ${label}`)

	return `0x${BigInt(value).toString(16)}`
}

const gasPriceString = (
	gasPrice: {
		priceInWei: string | null
		priceInFri: string | null
	} | null,
	label: string
) => {
	if (gasPrice == null)
		return undefined
	const value = gasPrice.priceInWei ?? gasPrice.priceInFri
	if (value == null)
		return undefined
	if (!/^[0-9]+$/.test(value))
		throw new Error(`Starkscan_Rest: invalid ${label}`)
	return value
}

const starknetTokenHoldingObservation = (
	holding: StarknetTokenHoldingIdentity,
	token: StarkscanExactTokenHoldings['items'][number],
	fetchedAtMs: number
) => ({
	[EntityMetaKey.Selector]: {
		$holding: holding,
		timestampMs: fetchedAtMs,
		source: Source.Starkscan,
	},
	[EntityMetaKey.Fields]: {
		[entityFieldAddressKey(EntityType.StarknetTokenHolding_Timestamp, [], 'indexedBalanceRaw')]: BigInt(token.indexedBalanceRaw),
		...(token.symbol != null && {
			[entityFieldAddressKey(EntityType.StarknetTokenHolding_Timestamp, [], 'symbol')]: token.symbol,
		}),
		...(token.name != null && {
			[entityFieldAddressKey(EntityType.StarknetTokenHolding_Timestamp, [], 'name')]: token.name,
		}),
		...(token.decimals != null && {
			[entityFieldAddressKey(EntityType.StarknetTokenHolding_Timestamp, [], 'decimals')]: token.decimals,
		}),
	},
})

const resolveBlockSnapshot = async (
	block: StarknetBlockIdentity,
	numberOrHash: string
) => {
	assertStarknetMainnet(block.$network.$network)
	const { getBlock } = await import('$/sources/Starkscan/Rest/queries.ts')
	const details = await getBlock(numberOrHash)
	const network = block.$network
	const blockNumber = BigInt(details.blockNumber)
	const blockHash = canonicalFelt(details.blockHash, 'block hash')
	const timestampMs = Date.parse(details.timestampIso)
	if (!Number.isSafeInteger(timestampMs) || timestampMs < 0)
		throw new Error('Starkscan_Rest: invalid block timestamp')

	return {
		blockNumber,
		blockHash,
		parentHash: canonicalFelt(details.parentHash, 'parent hash'),
		newRoot: (
			details.stateRoot == null ?
				undefined
			:
				canonicalFelt(details.stateRoot, 'state root')
		),
		timestampMs,
		sequencerAddress: (
			details.sequencerAddress == null ?
				undefined
			:
				canonicalFelt(details.sequencerAddress, 'sequencer address')
		),
		l1GasPrice: gasPriceString(details.l1GasPrice, 'l1 gas price'),
		l1DataGasPrice: gasPriceString(details.l1DataGasPrice, 'l1 data gas price'),
		status: details.starknetVersion ?? undefined,
		$$transactions: details.transactions.map((transaction) => {
			const senderAddress = (
				transaction.fromAddress == null ?
					undefined
				:
					canonicalFelt(transaction.fromAddress, 'block transaction sender')
			)

			return {
				[EntityMetaKey.Selector]: {
					$network: network,
					transactionHash: canonicalFelt(transaction.txHash, 'block transaction hash'),
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.StarknetTransaction, [], '$block')]: {
						[EntityMetaKey.Selector]: {
							$network: network,
							blockNumber,
						},
					},
					[entityFieldAddressKey(EntityType.StarknetTransaction, [], 'senderAddress')]: senderAddress,
					[entityFieldAddressKey(EntityType.StarknetTransaction, [], '$senderContract')]: (
						senderAddress == null ?
							undefined
						:
							{
								[EntityMetaKey.Selector]: {
									$network: network,
									address: senderAddress,
								},
							}
					),
					[entityFieldAddressKey(EntityType.StarknetTransaction, [], '$$timestamps')]: [{
						[EntityMetaKey.Selector]: {
							$transaction: {
								$network: network,
								transactionHash: canonicalFelt(transaction.txHash, 'block transaction hash'),
							},
							timestampMs,
							source: Source.Starkscan,
						},
						[EntityMetaKey.Fields]: {
							[entityFieldAddressKey(EntityType.StarknetTransaction_Timestamp, [], 'blockNumber')]: blockNumber,
							[entityFieldAddressKey(EntityType.StarknetTransaction_Timestamp, [], 'finalityStatus')]: transaction.finalityStatus ?? undefined,
							[entityFieldAddressKey(EntityType.StarknetTransaction_Timestamp, [], 'executionStatus')]: transaction.executionStatus ?? undefined,
						},
					}],
				},
			}
		}),
	}
}

export default {
	source: Source.Starkscan,

	resolvers: [
		defineResolver({
			entityType: EntityType.StarknetContract,
			resolve: {
				NetworkAddress: {
					appliesTo: starknetContractApplicability,
					resolve: async (contract) => {
						assertStarknetMainnet(contract.$network.$network)
						const { getAddressSummary } = await import('$/sources/Starkscan/Rest/queries.ts')
						return getAddressSummary(canonicalFelt(contract.address, 'contract address'))
					},
				},
			},
		})({
			$$accountStates: (summary, contract) => {
				if (summary.contractExistence != null)
					return [{
						[EntityMetaKey.Selector]: {
							$contract: contract,
							blockNumber: BigInt(summary.contractExistence.observedBlockNumber),
							source: Source.Starkscan,
						},
						[EntityMetaKey.Fields]: {
							[entityFieldAddressKey(EntityType.StarknetAccount_Timestamp, [], 'found')]: false,
						},
					}]
				if (summary.classHash == null || summary.latestActivityBlock == null)
					throw new Error('Starkscan_Rest: address summary lacks contract existence evidence')

				return [{
					[EntityMetaKey.Selector]: {
						$contract: contract,
						blockNumber: BigInt(summary.latestActivityBlock),
						source: Source.Starkscan,
					},
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.StarknetAccount_Timestamp, [], 'classHash')]: (
							canonicalFelt(summary.classHash, 'class hash')
						),
						[entityFieldAddressKey(EntityType.StarknetAccount_Timestamp, [], 'found')]: true,
					},
				}]
			},
		}),

		defineResolver({
			entityType: EntityType.StarknetContract,
			resolve: {
				NetworkAddress: {
					appliesTo: starknetContractApplicability,
					resolve: async (owner, context) => {
						assertStarknetMainnet(owner.$network.$network)
						if (
							context.providerContinuationToken != null
							&& !/^(0|[1-9][0-9]*)$/.test(context.providerContinuationToken)
						)
							throw new Error('Starkscan_Rest: invalid token holdings continuation')

						const offset = (
							context.providerContinuationToken == null ?
								context.pagination.offset ?? 0
							:
								Number(context.providerContinuationToken)
						)
						if (!Number.isSafeInteger(offset) || offset < 0)
							throw new Error('Starkscan_Rest: invalid token holdings continuation')

						const { getExactTokenHoldings } = await import('$/sources/Starkscan/Rest/queries.ts')
						const holdings = await getExactTokenHoldings(canonicalFelt(owner.address, 'owner address'))
						return {
							offset,
							total: holdings.items.length,
							rows: holdings.items
								.slice(offset, offset + resolverContextRowLimit(context))
								.map((token) => {
									const holding = {
										$owner: owner,
										$tokenContract: {
											$network: owner.$network,
											address: canonicalFelt(token.normalizedTokenAddress, 'token address'),
										},
									}

									return {
										[EntityMetaKey.Selector]: holding,
										[EntityMetaKey.Fields]: {
											[entityFieldAddressKey(EntityType.StarknetTokenHolding, [], '$$timestamps')]: [
												starknetTokenHoldingObservation(
													holding,
													token,
													holdings.fetchedAtMs
												),
											],
										},
									}
								}),
						}
					},
				},
			},
		})({
			$$tokenHoldings: {
				select: (snapshot) => snapshot.rows,
				resolveCount: (snapshot) => snapshot.total,
				continuation: (snapshot) => {
					const nextOffset = snapshot.offset + snapshot.rows.length
					const terminal = snapshot.rows.length === 0 || nextOffset >= snapshot.total

					return {
						operation: 'contract-token-holdings',
						target: 'starkscan',
						terminal,
						...(!terminal && { token: String(nextOffset) }),
					}
				},
			},
		}),

		defineResolver({
			entityType: EntityType.StarknetTokenHolding,
			resolve: {
				OwnerTokenContract: {
					resolve: async (holding) => {
						assertStarknetMainnet(holding.$owner.$network.$network)
						assertStarknetMainnet(holding.$tokenContract.$network.$network)

						const ownerAddress = canonicalFelt(holding.$owner.address, 'owner address')
						const tokenAddress = canonicalFelt(holding.$tokenContract.address, 'token address')
						const { getExactTokenHoldings } = await import('$/sources/Starkscan/Rest/queries.ts')
						const holdings = await getExactTokenHoldings(ownerAddress)
						const token = holdings.items.find((item) => (
							canonicalFelt(item.normalizedTokenAddress, 'token address') === tokenAddress
						))
						if (token == null)
							throw new Error('Starkscan_Rest: token holding was not found')

						return {
							fetchedAtMs: holdings.fetchedAtMs,
							token,
						}
					},
				},
			},
		})({
			$$timestamps: (snapshot, holding) => [
				starknetTokenHoldingObservation(
					holding,
					snapshot.token,
					snapshot.fetchedAtMs
				),
			],
		}),

		defineResolver({
			entityType: EntityType.StarknetAccount_Timestamp,
			resolve: {
				ContractBlockNumberSource: {
					appliesTo: [
						{
							$contract: starknetContractApplicability[0],
							source: Source.Starkscan,
						},
						{
							$contract: starknetContractApplicability[1],
							source: Source.Starkscan,
						},
					],
					resolve: async ({
						$contract,
						blockNumber,
						source,
					}) => {
						if (source !== Source.Starkscan)
							throw new Error('Starkscan_Rest: account observation source does not match')
						assertStarknetMainnet($contract.$network.$network)
						if (blockNumber > BigInt(Number.MAX_SAFE_INTEGER))
							throw new Error('Starkscan_Rest: account observation block number is too large')

						const { getAddressSummary } = await import('$/sources/Starkscan/Rest/queries.ts')
						const summary = await getAddressSummary(canonicalFelt($contract.address, 'contract address'))
						if (summary.contractExistence != null) {
							if (BigInt(summary.contractExistence.observedBlockNumber) !== blockNumber)
								throw new Error('Starkscan_Rest: account observation block does not match')
							return {
								found: false,
							}
						}
						if (summary.classHash == null || summary.latestActivityBlock == null)
							throw new Error('Starkscan_Rest: address summary lacks contract existence evidence')
						if (BigInt(summary.latestActivityBlock) !== blockNumber)
							throw new Error('Starkscan_Rest: account observation block does not match')

						return {
							classHash: canonicalFelt(summary.classHash, 'class hash'),
							found: true,
						}
					},
				},
			},
		})({
			classHash: (state) => state.classHash,
			found: (state) => state.found,
		}),

		defineResolver({
			entityType: EntityType.StarknetContract,
			resolve: {
				NetworkAddress: {
					appliesTo: starknetContractApplicability,
					resolve: async (contract, context) => {
						assertStarknetMainnet(contract.$network.$network)
						const limit = Math.min(resolverContextRowLimit(context), 100)
						const { getContractEvents } = await import('$/sources/Starkscan/Rest/queries.ts')

						return {
							limit,
							page: await getContractEvents(
								{
									address: canonicalFelt(contract.address, 'contract address'),
									limit,
									cursor: context.providerContinuationToken,
								}
							),
						}
					},
				},
			},
		})({
			$$events: {
				select: ({ page }, contract) => page.items.map((event) => ({
					[EntityMetaKey.Selector]: {
						$transaction: {
							$network: contract.$network,
							transactionHash: canonicalFelt(event.txHash, 'event transaction hash'),
						},
						eventIndex: event.logIndex,
					},
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.StarknetEvent, [], '$fromContract')]: {
							[EntityMetaKey.Selector]: contract,
						},
						[entityFieldAddressKey(EntityType.StarknetEvent, [], 'keys')]: event.keys.map((key) => (
							canonicalFelt(key, 'event key')
						)),
						[entityFieldAddressKey(EntityType.StarknetEvent, [], 'data')]: event.data.map((value) => (
							canonicalFelt(value, 'event data')
						)),
					},
				})),
				continuation: ({ limit, page }, contract) => (
					limit === 0 || page.nextCursor == null ?
						{
							operation: 'contract-events',
							target: contract.address,
							terminal: true,
						}
					:
						{
							operation: 'contract-events',
							target: contract.address,
							terminal: false,
							token: page.nextCursor,
						}
				),
			},
		}),

		defineResolver({
			entityType: EntityType.StarknetContract,
			resolve: {
				NetworkAddress: {
					appliesTo: starknetContractApplicability,
					resolve: async (contract, context) => {
						assertStarknetMainnet(contract.$network.$network)
						const limit = Math.min(resolverContextRowLimit(context), 100)
						const { getAddressTransactions } = await import('$/sources/Starkscan/Rest/queries.ts')

						return {
							limit,
							page: await getAddressTransactions(
								{
									address: canonicalFelt(contract.address, 'contract address'),
									limit,
									cursor: context.providerContinuationToken,
								}
							),
						}
					},
				},
			},
		})({
			$$transactions: {
				select: ({ page }, contract) => page.items.map((transaction) => {
					const transactionSelector = {
						$network: contract.$network,
						transactionHash: canonicalFelt(transaction.txHash, 'transaction hash'),
					}
					const senderAddress = (
						transaction.fromAddress == null ?
							undefined
						:
							canonicalFelt(transaction.fromAddress, 'sender address')
					)

					return {
						[EntityMetaKey.Selector]: transactionSelector,
						[EntityMetaKey.Fields]: {
							[entityFieldAddressKey(EntityType.StarknetTransaction, [], 'transactionKind')]: transaction.txType ?? undefined,
							[entityFieldAddressKey(EntityType.StarknetTransaction, [], '$block')]: {
								[EntityMetaKey.Selector]: {
									$network: contract.$network,
									blockNumber: BigInt(transaction.blockNumber),
								},
							},
							[entityFieldAddressKey(EntityType.StarknetTransaction, [], 'senderAddress')]: senderAddress,
							[entityFieldAddressKey(EntityType.StarknetTransaction, [], '$senderContract')]: (
								senderAddress == null ?
									undefined
								:
									{
										[EntityMetaKey.Selector]: (
											BigInt(senderAddress) === BigInt(contract.address) ?
												contract
											:
												{
													$network: contract.$network,
													address: senderAddress,
												}
										),
									}
							),
							[entityFieldAddressKey(EntityType.StarknetTransaction, [], '$$timestamps')]: (
								transaction.timestampIso == null ?
									[]
								:
									[{
										[EntityMetaKey.Selector]: {
											$transaction: transactionSelector,
											timestampMs: Date.parse(transaction.timestampIso),
											source: Source.Starkscan,
										},
										[EntityMetaKey.Fields]: {
											[entityFieldAddressKey(EntityType.StarknetTransaction_Timestamp, [], 'blockNumber')]: BigInt(transaction.blockNumber),
											[entityFieldAddressKey(EntityType.StarknetTransaction_Timestamp, [], 'finalityStatus')]: transaction.finalityStatus ?? undefined,
											[entityFieldAddressKey(EntityType.StarknetTransaction_Timestamp, [], 'executionStatus')]: transaction.executionStatus ?? undefined,
										},
									}]
							),
						},
					}
				}),
				continuation: ({ limit, page }, contract) => (
					limit === 0 || page.nextCursor == null ?
						{
							operation: 'contract-transactions',
							target: contract.address,
							terminal: true,
						}
					:
						{
							operation: 'contract-transactions',
							target: contract.address,
							terminal: false,
							token: page.nextCursor,
						}
				),
			},
		}),

		defineResolver({
			entityType: EntityType.StarknetBlock,
			resolve: {
				NetworkBlockNumber: {
					appliesTo: starknetNestedNetworkApplicability,
					resolve: async (block) => {
						if (block.blockNumber > BigInt(Number.MAX_SAFE_INTEGER))
							throw new Error('Starkscan_Rest: block number is too large')

						return resolveBlockSnapshot(block, block.blockNumber.toString())
					},
				},
				NetworkBlockHash: {
					appliesTo: starknetNestedNetworkApplicability,
					resolve: async (block) => (
						resolveBlockSnapshot(block, canonicalFelt(block.blockHash, 'block hash'))
					),
				},
			},
		})({
			blockNumber: (snapshot) => snapshot.blockNumber,
			blockHash: (snapshot) => snapshot.blockHash,
			parentHash: (snapshot) => snapshot.parentHash,
			newRoot: (snapshot) => snapshot.newRoot,
			timestampMs: (snapshot) => snapshot.timestampMs,
			sequencerAddress: (snapshot) => snapshot.sequencerAddress,
			l1GasPrice: (snapshot) => snapshot.l1GasPrice,
			l1DataGasPrice: (snapshot) => snapshot.l1DataGasPrice,
			status: (snapshot) => snapshot.status,
			$$transactions: {
				select: (snapshot) => snapshot.$$transactions,
				resolveCount: (snapshot) => snapshot.$$transactions.length,
			},
		}),

		defineResolver({
			entityType: EntityType.StarknetTransaction,
			resolve: {
				NetworkTransactionHash: {
					appliesTo: starknetNestedNetworkApplicability,
					resolve: async (transaction) => {
						assertStarknetMainnet(transaction.$network.$network)
						const transactionHash = canonicalFelt(transaction.transactionHash, 'transaction hash')
						const { getTransaction } = await import('$/sources/Starkscan/Rest/queries.ts')
						const details = await getTransaction(transactionHash)
						const senderAddress = (
							details.fromAddress == null ?
								undefined
							:
								canonicalFelt(details.fromAddress, 'transaction sender')
						)
						const timestampMs = (
							details.timestampIso == null ?
								undefined
							:
								Date.parse(details.timestampIso)
						)
						if (timestampMs != null && (!Number.isSafeInteger(timestampMs) || timestampMs < 0))
							throw new Error('Starkscan_Rest: invalid transaction timestamp')

						return {
							transactionKind: details.txType ?? undefined,
							$block: {
								[EntityMetaKey.Selector]: {
									$network: transaction.$network,
									blockNumber: BigInt(details.blockNumber),
								},
							},
							senderAddress,
							$senderContract: (
								senderAddress == null ?
									undefined
								:
									{
										[EntityMetaKey.Selector]: {
											$network: transaction.$network,
											address: senderAddress,
										},
									}
							),
							calldata: details.calldata.map((value) => (
								canonicalFelt(value, 'transaction calldata')
							)),
							$$events: details.logs.map((log) => ({
								[EntityMetaKey.Selector]: {
									$transaction: {
										$network: transaction.$network,
										transactionHash,
									},
									eventIndex: log.logIndex,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.StarknetEvent, [], '$fromContract')]: {
										[EntityMetaKey.Selector]: {
											$network: transaction.$network,
											address: canonicalFelt(log.address, 'transaction log address'),
										},
									},
									[entityFieldAddressKey(EntityType.StarknetEvent, [], 'keys')]: log.keys.map((key) => (
										canonicalFelt(key, 'transaction log key')
									)),
									[entityFieldAddressKey(EntityType.StarknetEvent, [], 'data')]: log.data.map((value) => (
										canonicalFelt(value, 'transaction log data')
									)),
								},
							})),
							$$timestamps: (
								timestampMs == null ?
									[]
								:
									[{
										[EntityMetaKey.Selector]: {
											$transaction: {
												$network: transaction.$network,
												transactionHash,
											},
											timestampMs,
											source: Source.Starkscan,
										},
										[EntityMetaKey.Fields]: {
											[entityFieldAddressKey(EntityType.StarknetTransaction_Timestamp, [], 'blockNumber')]: BigInt(details.blockNumber),
											[entityFieldAddressKey(EntityType.StarknetTransaction_Timestamp, [], 'finalityStatus')]: (
												(
													details.receipt == null ?
														details.finalityStatus
													:
														details.receipt.finalityStatus ?? details.finalityStatus
												)
												?? undefined
											),
											[entityFieldAddressKey(EntityType.StarknetTransaction_Timestamp, [], 'executionStatus')]: (
												(
													details.receipt == null ?
														details.executionStatus
													:
														details.receipt.executionStatus ?? details.executionStatus
												)
												?? undefined
											),
											[entityFieldAddressKey(EntityType.StarknetTransaction_Timestamp, [], 'revertReason')]: (
												details.receipt == null ?
													undefined
												:
													details.receipt.revertReason ?? undefined
											),
											[entityFieldAddressKey(EntityType.StarknetTransaction_Timestamp, [], 'eventsCount')]: details.logs.length,
										},
									}]
							),
						}
					},
				},
			},
		})({
			transactionKind: (snapshot) => snapshot.transactionKind,
			$block: (snapshot) => snapshot.$block,
			senderAddress: (snapshot) => snapshot.senderAddress,
			$senderContract: (snapshot) => snapshot.$senderContract,
			calldata: (snapshot) => snapshot.calldata,
			$$events: {
				select: (snapshot) => snapshot.$$events,
				resolveCount: (snapshot) => snapshot.$$events.length,
			},
			$$timestamps: {
				select: (snapshot) => snapshot.$$timestamps,
				resolveCount: (snapshot) => snapshot.$$timestamps.length,
			},
		}),

		defineResolver({
			entityType: EntityType.StarknetClass,
			resolve: {
				NetworkClassHash: {
					appliesTo: starknetNestedNetworkApplicability,
					resolve: async (klass, context) => {
						assertStarknetMainnet(klass.$network.$network)
						const classHash = canonicalFelt(klass.classHash, 'class hash')
						const requestedLimit = Math.min(resolverContextRowLimit(context), 100)
						const { getClass } = await import('$/sources/Starkscan/Rest/queries.ts')
						const detail = await getClass({
							classHash,
							limit: Math.max(requestedLimit, 1),
							cursor: context.providerContinuationToken,
						})

						return {
							requestedLimit,
							classHash: canonicalFelt(detail.class.classHash, 'class hash'),
							contractClassVersion: detail.class.classVersion ?? undefined,
							casmClassHash: (
								detail.class.compiledClassHash == null ?
									undefined
								:
									canonicalFelt(detail.class.compiledClassHash, 'compiled class hash')
							),
							declaredAtBlockNumber: (
								detail.class.declaredAtBlock == null ?
									undefined
								:
									BigInt(detail.class.declaredAtBlock)
							),
							declaredByTransactionHash: (
								detail.class.declarationTxHash == null ?
									undefined
								:
									canonicalFelt(detail.class.declarationTxHash, 'declaration transaction hash')
							),
							instances: (
								requestedLimit === 0 ?
									[]
								:
									detail.instances
							),
							nextInstanceCursor: (
								requestedLimit === 0 ?
									null
								:
									detail.nextInstanceCursor
							),
						}
					},
				},
			},
		})({
			classHash: (snapshot) => snapshot.classHash,
			contractClassVersion: (snapshot) => snapshot.contractClassVersion,
			casmClassHash: (snapshot) => snapshot.casmClassHash,
			declaredAtBlockNumber: (snapshot) => snapshot.declaredAtBlockNumber,
			declaredByTransactionHash: (snapshot) => snapshot.declaredByTransactionHash,
			$$contracts: {
				select: ({ instances }, klass) => instances.map((instance) => ({
					[EntityMetaKey.Selector]: {
						$network: klass.$network,
						address: canonicalFelt(instance.address, 'class instance address'),
					},
				})),
				continuation: ({ requestedLimit, nextInstanceCursor }, klass: StarknetClassIdentity) => (
					requestedLimit === 0 || nextInstanceCursor == null ?
						{
							operation: 'class-instances',
							target: klass.classHash,
							terminal: true,
						}
					:
						{
							operation: 'class-instances',
							target: klass.classHash,
							terminal: false,
							token: nextInstanceCursor,
						}
				),
			},
		}),

		defineResolver({
			entityType: EntityType.StarknetClass,
			resolve: {
				NetworkClassHash: {
					appliesTo: starknetNestedNetworkApplicability,
					resolve: async (klass) => {
						assertStarknetMainnet(klass.$network.$network)
						const { getClass } = await import('$/sources/Starkscan/Rest/queries.ts')

						return (await getClass({
							classHash: canonicalFelt(klass.classHash, 'class hash'),
							limit: 1,
						})).class.instanceCount
					},
				},
			},
		})({
			$$contracts: {
				resolveCount: (count) => count,
			},
		}),
	],
} satisfies RegisteredSourceResolverModule
