import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import {
	Caip2Namespace,
	Caip2Reference,
	networkBySlug,
} from '$/constants/Network.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'
import type {
	TronScanBlock,
	TronScanContract,
	TronScanToken,
	TronScanTransaction,
	TronScanTrc20Transfer,
} from '$/sources/TronScan/Rest/types.ts'

type NetworkId = EntitySelector<typeof schema, EntityType.Network>

const tronMainnetCaip2 = {
	namespace: Caip2Namespace.Tron,
	reference: Caip2Reference.TronMainnet,
} as const

const tronNetworkApplicability = [
	{
		caip2: tronMainnetCaip2,
	},
	{
		slug: networkBySlug.tron.slug,
	},
] as const

const tronNetworkReferenceApplicability = [
	{
		$network: tronNetworkApplicability[0],
	},
	{
		$network: tronNetworkApplicability[1],
	},
] as const

const tronAccountTimestampApplicability = [
	{
		$account: tronNetworkReferenceApplicability[0],
		source: Source.TronScan_Rest,
	},
	{
		$account: tronNetworkReferenceApplicability[1],
		source: Source.TronScan_Rest,
	},
] as const

const tronContractTimestampApplicability = [
	{
		$contract: tronNetworkReferenceApplicability[0],
		source: Source.TronScan_Rest,
	},
	{
		$contract: tronNetworkReferenceApplicability[1],
		source: Source.TronScan_Rest,
	},
] as const

const tronTransactionReferenceApplicability = [
	{
		$transaction: tronNetworkReferenceApplicability[0],
	},
	{
		$transaction: tronNetworkReferenceApplicability[1],
	},
] as const

const tronTokenTimestampApplicability = [
	{
		$token: tronNetworkReferenceApplicability[0],
		source: Source.TronScan_Rest,
	},
	{
		$token: tronNetworkReferenceApplicability[1],
		source: Source.TronScan_Rest,
	},
] as const

const tronAccountTokenTimestampApplicability = [
	{
		$account: tronNetworkReferenceApplicability[0],
		$token: tronNetworkReferenceApplicability[0],
		source: Source.TronScan_Rest,
	},
	{
		$account: tronNetworkReferenceApplicability[1],
		$token: tronNetworkReferenceApplicability[1],
		source: Source.TronScan_Rest,
	},
] as const

const assertTronMainnet = (network: NetworkId) => {
	if (
		(
			'slug' in network
			&& network.slug === networkBySlug.tron.slug
		)
		|| (
			'caip2' in network
			&& network.caip2.namespace === tronMainnetCaip2.namespace
			&& network.caip2.reference === tronMainnetCaip2.reference
		)
	)
		return

	throw new Error('TronScan_Rest: unsupported network')
}

const bigintFromWire = (value: number | string | null | undefined): bigint | undefined => (
	value == null || value === '' ?
		undefined
	:
		BigInt(value)
)

const tokenStandardFromWire = (value: string | undefined) => {
	if (value == null) return undefined
	const tokenStandard = value.toLowerCase().replace('-', '')
	return (
		tokenStandard === 'trc10' ?
			'trc10'
		:
			tokenStandard === 'trc20' ?
				'trc20'
			:
				tokenStandard === 'trc721' ?
					'trc721'
				:
					tokenStandard === 'trc1155' ?
					'trc1155'
				:
					undefined
	)
}

const accountReference = (
	network: NetworkId,
	address: string
) => ({
	[EntityMetaKey.Selector]: {
		$network: network,
		address,
	},
})

const blockFieldsFromTronScanBlock = (
	network: NetworkId,
	block: TronScanBlock
) => {
	if (block.hash == null)
		throw new Error('TronScan_Rest: block is missing hash')

	return {
		hash: block.hash,
		...(block.number > 0 && block.parentHash != null && {
			$parent: {
				[EntityMetaKey.Selector]: {
					$network: network,
					height: BigInt(block.number - 1),
					hash: block.parentHash,
				},
			},
		}),
		parentHash: block.parentHash,
		timestampMs: block.timestamp,
		...(block.witnessAddress != null && {
			$witness: {
				[EntityMetaKey.Selector]: {
					$network: network,
					address: block.witnessAddress,
				},
			},
		}),
		txTrieRoot: block.txTrieRoot,
		...(block.version != null && Number.isFinite(Number(block.version)) && {
			version: Number(block.version),
		}),
		transactionCount: block.transactionCount ?? block.nrOfTrx,
	}
}

const transactionFieldsFromTronScanTransaction = (
	network: NetworkId,
	transaction: TronScanTransaction
) => {
	const blockHeight = transaction.block ?? transaction.blockNumber
	const transactionId = transaction.hash ?? transaction.transactionHash
	const ownerAddress = transaction.contractData?.owner_address ?? transaction.ownerAddress
	const toAddress = transaction.contractData?.to_address ?? transaction.toAddress
	const contractAddress = transaction.contractData?.contract_address ?? transaction.contractAddress
	const amountSun = bigintFromWire(transaction.contractData?.amount ?? transaction.amount)
	return {
		...(blockHeight != null && {
			$block: {
				[EntityMetaKey.Selector]: {
					$network: network,
					height: BigInt(blockHeight),
				},
			},
			blockHeight: BigInt(blockHeight),
		}),
		timestampMs: transaction.timestamp,
		contractType: transaction.contractType?.toString(),
		result: transaction.contractRet ?? transaction.result,
		feeSun: bigintFromWire(transaction.cost?.fee),
		...(transactionId != null && {
			$receipt: {
				[EntityMetaKey.Selector]: {
					$transaction: {
						$network: network,
						transactionId,
					},
				},
			},
		}),
		...(ownerAddress != null && {
			$owner: accountReference(network, ownerAddress),
		}),
		...(toAddress != null && {
			$to: accountReference(network, toAddress),
		}),
		...(contractAddress != null && {
			$contract: {
				[EntityMetaKey.Selector]: {
					$network: network,
					address: contractAddress,
				},
			},
		}),
		...(amountSun != null && {
			amountSun,
		}),
		assetName: transaction.contractData?.asset_name,
	}
}

const tokenIdFromTronScanToken = (token: TronScanToken): string | undefined => (
	token.contractAddress ?? token.address ?? token.tokenId?.toString() ?? token.id?.toString()
)

const tokenFieldsFromTronScanToken = (
	network: NetworkId,
	token: TronScanToken
) => {
	const tokenId = tokenIdFromTronScanToken(token)
	const ownerAddress = token.ownerAddress ?? token.owner_address
	const standard = tokenStandardFromWire(token.tokenType ?? token.type)
	return {
		...(standard != null && {
			standard,
		}),
		...(ownerAddress != null && {
			$owner: accountReference(network, ownerAddress),
		}),
		...(tokenId != null && standard !== 'trc10' && {
			$contract: {
				[EntityMetaKey.Selector]: {
					$network: network,
					address: tokenId,
				},
			},
		}),
		createdTimestampMs: token.dateCreated ?? token.createTime,
		...(tokenId != null && {
			$$timestamps: [
				{
					[EntityMetaKey.Selector]: {
						$token: {
							$network: network,
							tokenId,
						},
						timestampMs: Date.now(),
						source: Source.TronScan_Rest,
					},
				},
			],
		}),
	}
}

const contractFieldsFromTronScanContract = (
	network: NetworkId,
	contractAddress: string,
	contract: TronScanContract
) => ({
	$account: {
		[EntityMetaKey.Selector]: {
			$network: network,
			address: contractAddress,
		},
	},
	name: contract.name ?? contract.contractName,
	...((creatorAddress) => (
		creatorAddress != null && {
			$creator: accountReference(network, creatorAddress),
		}
	))(contract.creator?.address ?? contract.creator_address),
	...(contract.create_tx_hash != null && {
		$creationTransaction: {
			[EntityMetaKey.Selector]: {
				$network: network,
				transactionId: contract.create_tx_hash,
			},
		},
	}),
	$$timestamps: [
		{
			[EntityMetaKey.Selector]: {
				$contract: {
					$network: network,
					address: contractAddress,
				},
				timestampMs: Date.now(),
				source: Source.TronScan_Rest,
			},
		},
	],
	$$tokens: [
		contract.trc20token,
		contract.trc10token,
	].flatMap((token) => {
		const tokenId = tokenIdFromTronScanToken(token ?? {})
		return (
			tokenId == null ?
				[]
			:
				[
					{
						[EntityMetaKey.Selector]: {
							$network: network,
							tokenId,
						},
						[EntityMetaKey.Fields]: Object.fromEntries(
							Object.entries(tokenFieldsFromTronScanToken(network, token ?? {})).map(([fieldName, value]) => [
								entityFieldAddressKey(EntityType.TronToken, [], fieldName),
								value,
							])
						),
					},
				]
		)
	}),
})

const tokenTransferFieldsFromTronScanTransfer = (
	network: NetworkId,
	transfer: TronScanTrc20Transfer,
	transferIndex: number
) => {
	const transactionId = transfer.transaction_id ?? transfer.transactionHash
	if (transactionId == null)
		throw new Error('TronScan_Rest: token transfer is missing transaction id')

	const tokenId = (
		transfer.contract_address
		?? transfer.contractAddress
		?? tokenIdFromTronScanToken(transfer.tokenInfo ?? {})
	)
	return {
		[EntityMetaKey.Selector]: {
			$network: network,
			transactionId,
			transferIndex,
		},
		$transaction: {
			[EntityMetaKey.Selector]: {
				$network: network,
				transactionId,
			},
		},
		...(tokenId != null && {
			$token: {
				[EntityMetaKey.Selector]: {
					$network: network,
					tokenId,
				},
			},
		}),
		standard: 'trc20',
		...(transfer.from_address != null && {
			$from: accountReference(network, transfer.from_address),
		}),
		...(transfer.from_address == null && transfer.fromAddress != null && {
			$from: accountReference(network, transfer.fromAddress),
		}),
		...(transfer.to_address != null && {
			$to: accountReference(network, transfer.to_address),
		}),
		...(transfer.to_address == null && transfer.toAddress != null && {
			$to: accountReference(network, transfer.toAddress),
		}),
		amount: bigintFromWire(transfer.quant ?? transfer.amount),
		timestampMs: transfer.block_ts ?? transfer.timestamp,
	}
}

const accountTokenBalanceTimestampFieldsFromTronScanToken = (
	token: TronScanToken
) => ({
	...(tokenStandardFromWire(token.tokenType ?? token.type) != null && {
		standard: tokenStandardFromWire(token.tokenType ?? token.type),
	}),
	balance: bigintFromWire(token.balance ?? token.balanceStr),
	tokenId: tokenIdFromTronScanToken(token),
	tokenName: token.name ?? token.tokenName,
	tokenSymbol: token.symbol ?? token.abbr ?? token.tokenAbbr,
})

export default {
	source: Source.TronScan_Rest,

	resolvers: [
		defineResolver(Source.TronScan_Rest, {
			entityType: EntityType.TronBlock,
			resolve: {
				NetworkHeightHash: {
					appliesTo: tronNetworkReferenceApplicability,
					resolve: async ({ $network, height }) => {
						assertTronMainnet($network)
						const { getBlock } = await import('$/sources/TronScan/Rest/queries.ts')
						const block = (await getBlock(
							height
						)).data.at(0)
						if (block == null) throw new Error(`TronScan_Rest: block not found for ${height.toString()}`)
						return blockFieldsFromTronScanBlock($network, block)
					},
				}
			},
		})({
				hash: (block) => block.hash,
				$parent: (block) => block.$parent,
				parentHash: (block) => block.parentHash,
				timestampMs: (block) => block.timestampMs,
				$witness: (block) => block.$witness,
				txTrieRoot: (block) => block.txTrieRoot,
				version: (block) => block.version,
				transactionCount: (block) => block.transactionCount,
			}),

		defineResolver(Source.TronScan_Rest, {
			entityType: EntityType.TronAccount,
			resolve: {
				NetworkAddress: {
					appliesTo: tronNetworkReferenceApplicability,
					resolve: async ({ $network, address }) => {
						assertTronMainnet($network)
						const { getAccount } = await import('$/sources/TronScan/Rest/queries.ts')
						const account = await getAccount(address)
						return {
							name: account.name,
							...(account.contractMap?.[address] === true && {
								$contract: {
									[EntityMetaKey.Selector]: {
										$network: $network,
										address: address,
									},
								},
							}),
							$$timestamps: [
								{
									[EntityMetaKey.Selector]: {
										$account: {
											$network,
											address,
										},
										timestampMs: Date.now(),
										source: Source.TronScan_Rest,
									},
								},
							],
						}
					},
				}
			},
		})({
				name: (account) => account.name,
				$contract: (account) => account.$contract,
				$$timestamps: (account) => account.$$timestamps,
			}),

		defineResolver(Source.TronScan_Rest, {
			entityType: EntityType.TronAccount,
			resolve: {
				NetworkAddress: {
					appliesTo: tronNetworkReferenceApplicability,
					resolve: async ({ $network, address }, context) => {
						assertTronMainnet($network)
						const start = context.providerContinuationToken == null ?
							0
						:
							Number(context.providerContinuationToken)
						if (!Number.isSafeInteger(start) || start < 0 || start > 10_000)
							throw new Error('TronScan_Rest: invalid account transaction continuation')

						const limit = Math.min(
							resolverContextRowLimit(context),
							50,
							10_000 - start
						)
						if (limit === 0)
							return {
								limit,
								start,
								total: start,
								transactions: [],
							}

						const { getAccountTransactions } = await import('$/sources/TronScan/Rest/queries.ts')
						const page = await getAccountTransactions(
							address,
							limit,
							start
						)

						return {
							limit,
							start,
							total: page.total,
							transactions: page.data.map((transaction) => ({
								[EntityMetaKey.Selector]: {
									$network,
									transactionId: transaction.hash,
								},
							})),
						}
					},
				}
			},
		})({
			$$transactions: {
				select: (page) => page.transactions,
				continuation: (page, account) => {
					const nextStart = page.start + page.transactions.length
					return (
						page.limit === 0
						|| page.transactions.length < page.limit
						|| nextStart >= Math.min(page.total, 10_000) ?
							{
								operation: 'account-transactions',
								target: account.address,
								terminal: true,
							}
						:
							{
								operation: 'account-transactions',
								target: account.address,
								terminal: false,
								token: nextStart.toString(),
							}
					)
				},
			},
		}),

		defineResolver(Source.TronScan_Rest, {
			entityType: EntityType.TronAccount_Timestamp,
			resolve: {
				AccountTimestampMsSource: {
					appliesTo: tronAccountTimestampApplicability,
					resolve: async ({ $account }) => {
						assertTronMainnet($account.$network)
						const { getAccount } = await import('$/sources/TronScan/Rest/queries.ts')
						const account = await getAccount($account.address)
						return {
							balanceSun: bigintFromWire(account.balanceStr ?? account.balance),
							createdTimestampMs: account.date_created,
							latestOperationTimestampMs: account.latest_operation_time,
							totalTransactionCount: account.totalTransactionCount ?? account.transactions,
							netLimit: bigintFromWire(account.bandwidth?.netRemaining ?? account.bandwidth?.freeNetRemaining),
							energyLimit: bigintFromWire(account.accountResource?.energyRemaining),
							isContract: account.contractMap?.[$account.address],
						}
					},
				}
			},
		})({
				balanceSun: (account) => account.balanceSun,
				createdTimestampMs: (account) => account.createdTimestampMs,
				latestOperationTimestampMs: (account) => account.latestOperationTimestampMs,
				totalTransactionCount: (account) => account.totalTransactionCount,
				netLimit: (account) => account.netLimit,
				energyLimit: (account) => account.energyLimit,
				isContract: (account) => account.isContract,
			}),

		defineResolver(Source.TronScan_Rest, {
			entityType: EntityType.TronTransaction,
			resolve: {
				NetworkTransactionId: {
					appliesTo: tronNetworkReferenceApplicability,
					resolve: async ({ $network, transactionId }) => {
						assertTronMainnet($network)
						const { getTransaction } = await import('$/sources/TronScan/Rest/queries.ts')
						const detail = await getTransaction(transactionId)
						return transactionFieldsFromTronScanTransaction(
							$network,
							detail.data?.[0] ?? detail
						)
					},
				}
			},
		})({
				$block: (transaction) => transaction.$block,
				blockHeight: (transaction) => transaction.blockHeight,
				timestampMs: (transaction) => transaction.timestampMs,
				contractType: (transaction) => transaction.contractType,
				result: (transaction) => transaction.result,
				feeSun: (transaction) => transaction.feeSun,
				$receipt: (transaction) => transaction.$receipt,
				$owner: (transaction) => transaction.$owner,
				$to: (transaction) => transaction.$to,
				$contract: (transaction) => transaction.$contract,
				amountSun: (transaction) => transaction.amountSun,
				assetName: (transaction) => transaction.assetName,
			}),

		defineResolver(Source.TronScan_Rest, {
			entityType: EntityType.TronContract,
			resolve: {
				NetworkAddress: {
					appliesTo: tronNetworkReferenceApplicability,
					resolve: async ({ $network, address }) => {
						assertTronMainnet($network)
						const { getContract } = await import('$/sources/TronScan/Rest/queries.ts')
						const contract = (await getContract(address)).data.at(0)
						if (contract == null) throw new Error(`TronScan_Rest: contract not found for ${address}`)
						return contractFieldsFromTronScanContract($network, address, contract)
					},
				}
			},
		})({
				$account: (contract) => contract.$account,
				name: (contract) => contract.name,
				$creator: (contract) => contract.$creator,
				$creationTransaction: (contract) => contract.$creationTransaction,
				$$timestamps: (contract) => contract.$$timestamps,
				$$tokens: (contract) => contract.$$tokens,
			}),

		defineResolver(Source.TronScan_Rest, {
			entityType: EntityType.TronContract_Timestamp,
			resolve: {
				ContractTimestampMsSource: {
					appliesTo: tronContractTimestampApplicability,
					resolve: async ({ $contract }) => {
						assertTronMainnet($contract.$network)
						const { getContract } = await import('$/sources/TronScan/Rest/queries.ts')
						const contract = (await getContract(
							$contract.address
						)).data.at(0)
						if (contract == null) throw new Error(`TronScan_Rest: contract not found for ${$contract.address}`)
						return {
							compiler: contract.compiler,
							verifyStatus: contract.verifyStatus ?? contract.verify_status?.toString(),
							isProxy: contract.is_proxy,
							...(contract.proxy_implementation != null && {
								$implementation: {
									[EntityMetaKey.Selector]: {
										$network: $contract.$network,
										address: contract.proxy_implementation,
									},
								},
							}),
						}
					},
				}
			},
		})({
				compiler: (contract) => contract.compiler,
				verifyStatus: (contract) => contract.verifyStatus,
				isProxy: (contract) => contract.isProxy,
				$implementation: (contract) => contract.$implementation,
			}),

		defineResolver(Source.TronScan_Rest, {
			entityType: EntityType.TronTransactionReceipt,
			resolve: {
				Transaction: {
					appliesTo: tronTransactionReferenceApplicability,
					resolve: async ({ $transaction }) => {
						assertTronMainnet($transaction.$network)
						const { getTransaction } = await import('$/sources/TronScan/Rest/queries.ts')
						const transaction = await getTransaction(
							$transaction.transactionId
						)
						return transactionFieldsFromTronScanTransaction(
							$transaction.$network,
							transaction.data?.[0] ?? transaction
						)
					},
				}
			},
		})({
				feeSun: (receipt) => receipt.feeSun,
				result: (receipt) => receipt.result,
			}),

		defineResolver(Source.TronScan_Rest, {
			entityType: EntityType.TronToken,
			resolve: {
				NetworkTokenId: {
					appliesTo: tronNetworkReferenceApplicability,
					resolve: async ({ $network, tokenId }) => {
						assertTronMainnet($network)
						const {
							getTokenOverview,
							getTrc10Token,
						} = await import('$/sources/TronScan/Rest/queries.ts')
						const token = (
							(await getTokenOverview(tokenId)).tokens[0]
						?? (await getTrc10Token(tokenId)).data.at(0)
						)
						return tokenFieldsFromTronScanToken($network, token)
					},
				}
			},
		})({
				standard: (token) => token.standard,
				$owner: (token) => token.$owner,
				$contract: (token) => token.$contract,
				createdTimestampMs: (token) => token.createdTimestampMs,
				$$timestamps: (token) => token.$$timestamps ?? [],
			}),

		defineResolver(Source.TronScan_Rest, {
			entityType: EntityType.TronToken_Timestamp,
			resolve: {
				TokenTimestampMsSource: {
					appliesTo: tronTokenTimestampApplicability,
					resolve: async ({ $token }) => {
						assertTronMainnet($token.$network)
						const {
							getTokenOverview,
							getTrc10Token,
						} = await import('$/sources/TronScan/Rest/queries.ts')
						const token = (
							(await getTokenOverview($token.tokenId)).tokens[0]
						?? (await getTrc10Token($token.tokenId)).data.at(0)
						)
						return {
							name: token.name ?? token.tokenName,
							symbol: token.symbol ?? token.abbr ?? token.tokenAbbr,
							decimals: token.decimals ?? token.precision,
							totalSupply: bigintFromWire(token.totalSupply ?? token.total_supply),
							holderCount: token.holderCount,
						}
					},
				}
			},
		})({
				name: (token) => token.name,
				symbol: (token) => token.symbol,
				decimals: (token) => token.decimals,
				totalSupply: (token) => token.totalSupply,
				holderCount: (token) => token.holderCount,
			}),

		defineResolver(Source.TronScan_Rest, {
			entityType: EntityType.TronTokenTransfer,
			resolve: {
				NetworkTransactionIdTransferIndex: {
					appliesTo: tronNetworkReferenceApplicability,
					resolve: async ({ $network, transactionId, transferIndex }) => {
						assertTronMainnet($network)
						const { getTrc20Transfers } = await import('$/sources/TronScan/Rest/queries.ts')
						const transfer = (
							(await getTrc20Transfers(
								transactionId,
								transferIndex + 1
							)).token_transfers
						?? []
						).at(transferIndex)
						if (transfer == null) throw new Error(`TronScan_Rest: token transfer not found for ${transactionId}:${transferIndex.toString()}`)
						return tokenTransferFieldsFromTronScanTransfer(
							$network,
							transfer,
							transferIndex
						)
					},
				}
			},
		})({
				$transaction: (transfer) => transfer.$transaction,
				$token: (transfer) => transfer.$token,
				standard: (transfer) => transfer.standard,
				$from: (transfer) => transfer.$from,
				$to: (transfer) => transfer.$to,
				amount: (transfer) => transfer.amount,
				timestampMs: (transfer) => transfer.timestampMs,
			}),

		defineResolver(Source.TronScan_Rest, {
			entityType: EntityType.TronAccountTokenBalance_Timestamp,
			resolve: {
				AccountTokenTimestampMsSource: {
					appliesTo: tronAccountTokenTimestampApplicability,
					resolve: async ({ $account, $token }, context) => {
						assertTronMainnet($token.$network)
						assertTronMainnet($account.$network)
						const { getAccountTokens } = await import('$/sources/TronScan/Rest/queries.ts')
						const token = (await getAccountTokens(
							$account.address,
							resolverContextRowLimit(context)
						)).data.find((accountToken) => (
							tokenIdFromTronScanToken(accountToken) === $token.tokenId
						))
						if (token == null)
							throw new Error(`TronScan_Rest: account token balance not found for ${$account.address}:${$token.tokenId}`)
						return accountTokenBalanceTimestampFieldsFromTronScanToken(token)
					},
				}
			},
		})({
				standard: (timestamp) => timestamp.standard,
				balance: (timestamp) => timestamp.balance,
				tokenId: (timestamp) => timestamp.tokenId,
				tokenName: (timestamp) => timestamp.tokenName,
				tokenSymbol: (timestamp) => timestamp.tokenSymbol,
			}),

		defineResolver(Source.TronScan_Rest, {
			entityType: EntityType.TronAccount,
			resolve: {
				NetworkAddress: {
					appliesTo: tronNetworkReferenceApplicability,
					resolve: async ({ $network, address }, context) => {
						assertTronMainnet($network)
						const { getAccountTokens } = await import('$/sources/TronScan/Rest/queries.ts')
							return (await getAccountTokens(
								address,
								resolverContextRowLimit(context)
							)).data.flatMap((token) => {
								const tokenId = tokenIdFromTronScanToken(token)
								return (
									tokenId == null ?
										[]
									:
										[
											{
												[EntityMetaKey.Selector]: {
													$account: {
														$network,
														address,
													},
													$token: {
														$network,
														tokenId,
													},
													timestampMs: Date.now(),
													source: Source.TronScan_Rest,
												},
												[EntityMetaKey.Fields]: Object.fromEntries(
													Object.entries({
														$token: {
															[EntityMetaKey.Selector]: {
																$network,
																tokenId,
															},
														},
														...accountTokenBalanceTimestampFieldsFromTronScanToken(token),
													}).map(([fieldName, value]) => [
														entityFieldAddressKey(EntityType.TronAccountTokenBalance_Timestamp, [], fieldName),
														value,
													])
												),
											},
										]
								)
						})
					},
				}
			},
			})({
					$$tokenBalanceTimestamps: (timestamps) => timestamps,
				}),

		defineResolver(Source.TronScan_Rest, {
			entityType: EntityType.TronContract,
			resolve: {
				NetworkAddress: {
					appliesTo: tronNetworkReferenceApplicability,
					resolve: async ({ $network, address }) => {
						assertTronMainnet($network)
						const { getContract } = await import('$/sources/TronScan/Rest/queries.ts')
						const contract = (await getContract(address)).data.at(0)
						if (contract == null) throw new Error(`TronScan_Rest: contract not found for ${address}`)
						return contractFieldsFromTronScanContract($network, address, contract).$$tokens
					},
				}
			},
		})({
				$$tokens: (tokens) => tokens,
			}),

		defineResolver(Source.TronScan_Rest, {
			entityType: EntityType.TronTransaction,
			resolve: {
				NetworkTransactionId: {
					appliesTo: tronNetworkReferenceApplicability,
					resolve: async ({ $network, transactionId }, context) => {
						assertTronMainnet($network)
						const { getTrc20Transfers } = await import('$/sources/TronScan/Rest/queries.ts')
						return (
							(await getTrc20Transfers(
								transactionId,
								resolverContextRowLimit(context)
							)).token_transfers
						?? []
						).map((transfer, transferIndex) => (
							tokenTransferFieldsFromTronScanTransfer(
								$network,
								transfer,
								transferIndex
						)
						))
					},
				}
			},
		})({
				$$tokenTransfers: (tokenTransfers) => tokenTransfers,
			}),
	],
}
