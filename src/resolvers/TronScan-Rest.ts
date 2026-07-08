import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import type {
	TronScanBlock,
	TronScanContract,
	TronScanToken,
	TronScanTransaction,
	TronScanTrc20Transfer,
} from '$/sources/TronScan/Rest/types.ts'
import { TronBlockSelector } from '$/schema/TronBlock.ts'
import { TronAccountSelector } from '$/schema/TronAccount.ts'
import { TronAccount_TimestampSelector } from '$/schema/TronAccount_Timestamp.ts'
import { TronTransactionSelector } from '$/schema/TronTransaction.ts'
import { TronContractSelector } from '$/schema/TronContract.ts'
import { TronContract_TimestampSelector } from '$/schema/TronContract_Timestamp.ts'
import { TronTokenSelector } from '$/schema/TronToken.ts'
import { TronToken_TimestampSelector } from '$/schema/TronToken_Timestamp.ts'
import { TronAccountTokenBalance_TimestampSelector } from '$/schema/TronAccountTokenBalance_Timestamp.ts'
import { TronTokenTransferSelector } from '$/schema/TronTokenTransfer.ts'
import { TronTransactionReceiptSelector } from '$/schema/TronTransactionReceipt.ts'

type NetworkId = { caip2: {
	namespace: string
	reference: string
} } | { slug: string }

const tronScanRestBaseUrl = async () => (
	(await import('$/sources/TronScan/Rest/queries.ts')).tronScanRestEndpoints[0].restBaseUrl
)

const assertTronMainnet = (network: NetworkId) => {
	if (!('slug' in network) || network.slug !== 'tron')
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
		version: block.version,
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
		result: transaction.contractRet,
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
	...(contract.creator != null && {
		$creator: accountReference(network, contract.creator),
	}),
	...(contract.creator == null && contract.creator_address != null && {
		$creator: accountReference(network, contract.creator_address),
	}),
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
						...tokenFieldsFromTronScanToken(network, token ?? {}),
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
				[TronBlockSelector.NetworkHeightHash]: async ({ $network, height }) => {
					assertTronMainnet($network)
					const { getBlock } = await import('$/sources/TronScan/Rest/queries.ts')
					const block = (await getBlock({
						restBaseUrl: await tronScanRestBaseUrl(),
						height: height,
					})).data.at(0)
					if (block == null) throw new Error(`TronScan_Rest: block not found for ${height.toString()}`)
					return blockFieldsFromTronScanBlock($network, block)
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
				[TronAccountSelector.NetworkAddress]: async ({ $network, address }) => {
					assertTronMainnet($network)
					const { getAccount } = await import('$/sources/TronScan/Rest/queries.ts')
					const account = await getAccount({
						restBaseUrl: await tronScanRestBaseUrl(),
						address: address,
					})
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
				}
			},
		})({
				name: (account) => account.name,
				$contract: (account) => account.$contract,
				$$timestamps: (account) => account.$$timestamps,
			}),

		defineResolver(Source.TronScan_Rest, {
			entityType: EntityType.TronAccount_Timestamp,
			resolve: {
				[TronAccount_TimestampSelector.AccountTimestampMsSource]: async ({ $account }) => {
					assertTronMainnet($account.$network)
					const { getAccount } = await import('$/sources/TronScan/Rest/queries.ts')
					const account = await getAccount({
						restBaseUrl: await tronScanRestBaseUrl(),
						address: $account.address,
					})
					return {
						balanceSun: bigintFromWire(account.balanceStr ?? account.balance),
						createdTimestampMs: account.date_created,
						latestOperationTimestampMs: account.latest_operation_time,
						totalTransactionCount: account.totalTransactionCount ?? account.transactions,
						netLimit: bigintFromWire(account.bandwidth?.netRemaining ?? account.bandwidth?.freeNetRemaining),
						energyLimit: bigintFromWire(account.accountResource?.energyRemaining),
						isContract: account.contractMap?.[$account.address],
					}
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
				[TronTransactionSelector.NetworkTransactionId]: async ({ $network, transactionId }) => {
					assertTronMainnet($network)
					const { getTransaction } = await import('$/sources/TronScan/Rest/queries.ts')
					const detail = await getTransaction({
						restBaseUrl: await tronScanRestBaseUrl(),
						transactionId: transactionId,
					})
					return transactionFieldsFromTronScanTransaction(
						$network,
						detail.data?.[0] ?? detail
					)
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
				[TronContractSelector.NetworkAddress]: async ({ $network, address }) => {
					assertTronMainnet($network)
					const { getContract } = await import('$/sources/TronScan/Rest/queries.ts')
					const contract = (await getContract({
						restBaseUrl: await tronScanRestBaseUrl(),
						address: address,
					})).data.at(0)
					if (contract == null) throw new Error(`TronScan_Rest: contract not found for ${address}`)
					return contractFieldsFromTronScanContract($network, address, contract)
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
				[TronContract_TimestampSelector.ContractTimestampMsSource]: async ({ $contract }) => {
					assertTronMainnet($contract.$network)
					const { getContract } = await import('$/sources/TronScan/Rest/queries.ts')
					const contract = (await getContract({
						restBaseUrl: await tronScanRestBaseUrl(),
						address: $contract.address,
					})).data.at(0)
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
				[TronTransactionReceiptSelector.Transaction]: async ({ $transaction }) => {
					assertTronMainnet($transaction.$network)
					const { getTransaction } = await import('$/sources/TronScan/Rest/queries.ts')
					const transaction = await getTransaction({
						restBaseUrl: await tronScanRestBaseUrl(),
						transactionId: $transaction.transactionId,
					})
					return transactionFieldsFromTronScanTransaction(
						$transaction.$network,
						transaction.data?.[0] ?? transaction
					)
				}
			},
		})({
				feeSun: (receipt) => receipt.feeSun,
				result: (receipt) => receipt.result,
			}),

		defineResolver(Source.TronScan_Rest, {
			entityType: EntityType.TronToken,
			resolve: {
				[TronTokenSelector.NetworkTokenId]: async ({ $network, tokenId }) => {
					assertTronMainnet($network)
					const {
						getTokenOverview,
						getTrc10Token,
					} = await import('$/sources/TronScan/Rest/queries.ts')
					const token = (
						(await getTokenOverview({
							restBaseUrl: await tronScanRestBaseUrl(),
							tokenId: tokenId,
						})).tokens[0]
					?? (await getTrc10Token({
						restBaseUrl: await tronScanRestBaseUrl(),
						tokenId: tokenId,
					})).data.at(0)
					)
					return tokenFieldsFromTronScanToken($network, token)
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
				[TronToken_TimestampSelector.TokenTimestampMsSource]: async ({ $token }) => {
					assertTronMainnet($token.$network)
					const {
						getTokenOverview,
						getTrc10Token,
					} = await import('$/sources/TronScan/Rest/queries.ts')
					const token = (
						(await getTokenOverview({
							restBaseUrl: await tronScanRestBaseUrl(),
							tokenId: $token.tokenId,
						})).tokens[0]
					?? (await getTrc10Token({
						restBaseUrl: await tronScanRestBaseUrl(),
						tokenId: $token.tokenId,
					})).data.at(0)
					)
					return {
						name: token.name ?? token.tokenName,
						symbol: token.symbol ?? token.abbr ?? token.tokenAbbr,
						decimals: token.decimals ?? token.precision,
						totalSupply: bigintFromWire(token.totalSupply ?? token.total_supply),
						holderCount: token.holderCount,
					}
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
				[TronTokenTransferSelector.NetworkTransactionIdTransferIndex]: async ({ $network, transactionId, transferIndex }) => {
					assertTronMainnet($network)
					const { getTrc20Transfers } = await import('$/sources/TronScan/Rest/queries.ts')
					const transfer = (
						(await getTrc20Transfers({
							restBaseUrl: await tronScanRestBaseUrl(),
							transactionId: transactionId,
							limit: transferIndex + 1,
						})).token_transfers
					?? []
					).at(transferIndex)
					if (transfer == null) throw new Error(`TronScan_Rest: token transfer not found for ${transactionId}:${transferIndex.toString()}`)
					return tokenTransferFieldsFromTronScanTransfer(
						$network,
						transfer,
						transferIndex
					)
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
				[TronAccountTokenBalance_TimestampSelector.AccountTokenTimestampMsSource]: async ({ $account, $token }, context) => {
					assertTronMainnet($account.$network)
					const { getAccountTokens } = await import('$/sources/TronScan/Rest/queries.ts')
					const token = (await getAccountTokens({
						restBaseUrl: await tronScanRestBaseUrl(),
						address: $account.address,
						limit: resolverContextRowLimit(context),
					})).data.find((accountToken) => (
						tokenIdFromTronScanToken(accountToken) === $token.tokenId
					))
					if (token == null)
						throw new Error(`TronScan_Rest: account token balance not found for ${$account.address}:${$token.tokenId}`)
					return accountTokenBalanceTimestampFieldsFromTronScanToken(token)
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
				[TronAccountSelector.NetworkAddress]: async ({ $network, address }, context) => {
					assertTronMainnet($network)
					const { getAccountTokens } = await import('$/sources/TronScan/Rest/queries.ts')
						return (await getAccountTokens({
							restBaseUrl: await tronScanRestBaseUrl(),
							address: address,
							limit: resolverContextRowLimit(context),
						})).data.flatMap((token) => {
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
											$token: {
												[EntityMetaKey.Selector]: {
													$network,
													tokenId,
												},
											},
											...accountTokenBalanceTimestampFieldsFromTronScanToken(token),
										},
									]
							)
					})
				}
			},
			})({
					$$tokenBalanceTimestamps: (timestamps) => timestamps,
				}),

		defineResolver(Source.TronScan_Rest, {
			entityType: EntityType.TronContract,
			resolve: {
				[TronContractSelector.NetworkAddress]: async ({ $network, address }) => {
					assertTronMainnet($network)
					const { getContract } = await import('$/sources/TronScan/Rest/queries.ts')
					const contract = (await getContract({
						restBaseUrl: await tronScanRestBaseUrl(),
						address: address,
					})).data.at(0)
					if (contract == null) throw new Error(`TronScan_Rest: contract not found for ${address}`)
					return contractFieldsFromTronScanContract($network, address, contract).$$tokens
				}
			},
		})({
				$$tokens: (tokens) => tokens,
			}),

		defineResolver(Source.TronScan_Rest, {
			entityType: EntityType.TronTransaction,
			resolve: {
				[TronTransactionSelector.NetworkTransactionId]: async ({ $network, transactionId }, context) => {
					assertTronMainnet($network)
					const { getTrc20Transfers } = await import('$/sources/TronScan/Rest/queries.ts')
					return (
						(await getTrc20Transfers({
							restBaseUrl: await tronScanRestBaseUrl(),
							transactionId: transactionId,
							limit: resolverContextRowLimit(context),
						})).token_transfers
					?? []
					).map((transfer, transferIndex) => (
						tokenTransferFieldsFromTronScanTransfer(
							$network,
							transfer,
							transferIndex
					)
					))
				}
			},
		})({
				$$tokenTransfers: (tokenTransfers) => tokenTransfers,
			}),
	],
}
