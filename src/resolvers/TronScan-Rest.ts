import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import { tronScanRestBaseUrl } from '$/constants/TronNetwork.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { TronTokenStandard } from '$/schema/TronToken.ts'
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
import { TronTransactionSelector } from '$/schema/TronTransaction.ts'
import { TronContractSelector } from '$/schema/TronContract.ts'
import { TronTokenSelector } from '$/schema/TronToken.ts'
import { TronTokenTransferSelector } from '$/schema/TronTokenTransfer.ts'

type NetworkId = { caip2: { namespace: string; reference: string } } | { networkSlug: string }

const assertTronMainnet = (network: NetworkId) => {
	if (!('networkSlug' in network) || network.networkSlug !== 'tron') {
		throw new Error('TronScan_Rest: unsupported network')
	}
}

const bigintFromWire = (value: number | string | null | undefined): bigint | undefined => (
	value == null || value === '' ?
		undefined
	:
		BigInt(value)
)

const tokenStandardFromWire = (value: string | undefined): TronTokenStandard | undefined => {
	if (value == null) return undefined
	const tokenStandard = value.toLowerCase().replace('-', '')
	return (
		tokenStandard === 'trc10' ?
			TronTokenStandard.Trc10
		: tokenStandard === 'trc20' ?
			TronTokenStandard.Trc20
		: tokenStandard === 'trc721' ?
			TronTokenStandard.Trc721
		: tokenStandard === 'trc1155' ?
			TronTokenStandard.Trc1155
		:
			undefined
	)
}

const accountReference = (
	network: NetworkId,
	address: string,
) => ({
	[EntityMetaKey.Selector]: {
		$network: network,
		address,
	},
})

const blockFieldsFromTronScanBlock = (
	network: NetworkId,
	block: TronScanBlock,
) => ({
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
})

const transactionFieldsFromTronScanTransaction = (
	network: NetworkId,
	transaction: TronScanTransaction,
) => {
	const blockHeight = transaction.block ?? transaction.blockNumber
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
	token: TronScanToken,
) => {
	const tokenId = tokenIdFromTronScanToken(token)
	const ownerAddress = token.ownerAddress ?? token.owner_address
	const standard = tokenStandardFromWire(token.tokenType ?? token.type)
	return {
		...(standard != null && {
			standard,
		}),
		name: token.name ?? token.tokenName,
		symbol: token.symbol ?? token.abbr ?? token.tokenAbbr,
		decimals: token.decimals ?? token.precision,
		totalSupply: bigintFromWire(token.totalSupply ?? token.total_supply),
		...(ownerAddress != null && {
			$owner: accountReference(network, ownerAddress),
		}),
		...(tokenId != null && standard !== TronTokenStandard.Trc10 && {
			$contract: {
				[EntityMetaKey.Selector]: {
					$network: network,
					address: tokenId,
				},
			},
		}),
		createdTimestampMs: token.dateCreated ?? token.createTime,
		holderCount: token.holderCount,
	}
}

const contractFieldsFromTronScanContract = (
	network: NetworkId,
	contractAddress: string,
	contract: TronScanContract,
) => ({
	$account: {
		[EntityMetaKey.Selector]: {
			$network: network,
			address: contractAddress,
		},
	},
	name: contract.name ?? contract.contractName,
	compiler: contract.compiler,
	verifyStatus: contract.verifyStatus ?? contract.verify_status?.toString(),
	isProxy: contract.is_proxy,
	...(contract.proxy_implementation != null && {
		$implementation: {
			[EntityMetaKey.Selector]: {
				$network: network,
				address: contract.proxy_implementation,
			},
		},
	}),
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
	transferIndex: number,
) => {
	const transactionId = transfer.transaction_id ?? transfer.transactionHash ?? ''
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
		standard: TronTokenStandard.Trc20,
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
					restBaseUrl: tronScanRestBaseUrl,
					height: height,
				})).data.at(0)
				if (block == null) throw new Error(`TronScan_Rest: block not found for ${height.toString()}`)
				return blockFieldsFromTronScanBlock($network, block)
			}
			}
		})({
				fields: {
			hash: (block) => block.hash,
			$parent: (block) => block.$parent,
			parentHash: (block) => block.parentHash,
			timestampMs: (block) => block.timestampMs,
			$witness: (block) => block.$witness,
			txTrieRoot: (block) => block.txTrieRoot,
			version: (block) => block.version,
			transactionCount: (block) => block.transactionCount,
		},
			}),

		defineResolver(Source.TronScan_Rest, {
			entityType: EntityType.TronAccount,
			resolve: {
				[TronAccountSelector.NetworkAddress]: async ({ $network, address }) => {
				assertTronMainnet($network)
				const { getAccount } = await import('$/sources/TronScan/Rest/queries.ts')
				const account = await getAccount({
					restBaseUrl: tronScanRestBaseUrl,
					address: address,
				})
				return {
					name: account.name,
					balanceSun: bigintFromWire(account.balanceStr ?? account.balance),
					createdTimestampMs: account.date_created,
					latestOperationTimestampMs: account.latest_operation_time,
					totalTransactionCount: account.totalTransactionCount ?? account.transactions,
					bandwidthRemaining: bigintFromWire(
						account.bandwidth?.netRemaining ?? account.bandwidth?.freeNetRemaining,
					),
					energyRemaining: bigintFromWire(account.accountResource?.energyRemaining),
					isContract: account.contractMap?.[address],
					...(account.contractMap?.[address] === true && {
						$contract: {
							[EntityMetaKey.Selector]: {
								$network: $network,
								address: address,
							},
						},
					}),
				}
			}
			}
		})({
				fields: {
			name: (account) => account.name,
			balanceSun: (account) => account.balanceSun,
			createdTimestampMs: (account) => account.createdTimestampMs,
			latestOperationTimestampMs: (account) => account.latestOperationTimestampMs,
			totalTransactionCount: (account) => account.totalTransactionCount,
			bandwidthRemaining: (account) => account.bandwidthRemaining,
			energyRemaining: (account) => account.energyRemaining,
			isContract: (account) => account.isContract,
			$contract: (account) => account.$contract,
		},
			}),

		defineResolver(Source.TronScan_Rest, {
			entityType: EntityType.TronTransaction,
			resolve: {
				[TronTransactionSelector.NetworkTransactionId]: async ({ $network, transactionId }) => {
				assertTronMainnet($network)
				const { getTransaction } = await import('$/sources/TronScan/Rest/queries.ts')
				const detail = await getTransaction({
					restBaseUrl: tronScanRestBaseUrl,
					transactionId: transactionId,
				})
				return transactionFieldsFromTronScanTransaction(
					$network,
					detail.data?.[0] ?? detail,
				)
			}
			}
		})({
				fields: {
			$block: (transaction) => transaction.$block,
			blockHeight: (transaction) => transaction.blockHeight,
			timestampMs: (transaction) => transaction.timestampMs,
			contractType: (transaction) => transaction.contractType,
			result: (transaction) => transaction.result,
			feeSun: (transaction) => transaction.feeSun,
			$owner: (transaction) => transaction.$owner,
			$to: (transaction) => transaction.$to,
			$contract: (transaction) => transaction.$contract,
			amountSun: (transaction) => transaction.amountSun,
			assetName: (transaction) => transaction.assetName,
		},
			}),

		defineResolver(Source.TronScan_Rest, {
			entityType: EntityType.TronContract,
			resolve: {
				[TronContractSelector.NetworkAddress]: async ({ $network, address }) => {
				assertTronMainnet($network)
				const { getContract } = await import('$/sources/TronScan/Rest/queries.ts')
				const contract = (await getContract({
					restBaseUrl: tronScanRestBaseUrl,
					address: address,
				})).data.at(0)
				if (contract == null) throw new Error(`TronScan_Rest: contract not found for ${address}`)
				return contractFieldsFromTronScanContract($network, address, contract)
			}
			}
		})({
				fields: {
			$account: (contract) => contract.$account,
			name: (contract) => contract.name,
			compiler: (contract) => contract.compiler,
			verifyStatus: (contract) => contract.verifyStatus,
			isProxy: (contract) => contract.isProxy,
			$implementation: (contract) => contract.$implementation,
			$creator: (contract) => contract.$creator,
			$creationTransaction: (contract) => contract.$creationTransaction,
			$$tokens: (contract) => contract.$$tokens,
		},
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
						restBaseUrl: tronScanRestBaseUrl,
						tokenId: tokenId,
					})).tokens[0]
					?? (await getTrc10Token({
						restBaseUrl: tronScanRestBaseUrl,
						tokenId: tokenId,
					})).data.at(0)
				)
				return tokenFieldsFromTronScanToken($network, token)
			}
			}
		})({
				fields: {
			standard: (token) => token.standard,
			name: (token) => token.name,
			symbol: (token) => token.symbol,
			decimals: (token) => token.decimals,
			totalSupply: (token) => token.totalSupply,
			$owner: (token) => token.$owner,
			$contract: (token) => token.$contract,
			createdTimestampMs: (token) => token.createdTimestampMs,
			holderCount: (token) => token.holderCount,
		},
			}),

		defineResolver(Source.TronScan_Rest, {
			entityType: EntityType.TronTokenTransfer,
			resolve: {
				[TronTokenTransferSelector.NetworkTransactionIdTransferIndex]: async ({ $network, transactionId, transferIndex }) => {
				assertTronMainnet($network)
				const { getTrc20Transfers } = await import('$/sources/TronScan/Rest/queries.ts')
				const transfer = (
					(await getTrc20Transfers({
						restBaseUrl: tronScanRestBaseUrl,
						transactionId: transactionId,
						limit: transferIndex + 1,
					})).token_transfers
					?? []
				).at(transferIndex)
				if (transfer == null) throw new Error(`TronScan_Rest: token transfer not found for ${transactionId}:${transferIndex.toString()}`)
				return tokenTransferFieldsFromTronScanTransfer(
					$network,
					transfer,
					transferIndex,
				)
			}
			}
		})({
				fields: {
			$transaction: (transfer) => transfer.$transaction,
			$token: (transfer) => transfer.$token,
			standard: (transfer) => transfer.standard,
			$from: (transfer) => transfer.$from,
			$to: (transfer) => transfer.$to,
			amount: (transfer) => transfer.amount,
			timestampMs: (transfer) => transfer.timestampMs,
		},
			}),

		defineResolver(Source.TronScan_Rest, {
			entityType: EntityType.TronAccount,
			resolve: {
				[TronAccountSelector.NetworkAddress]: async ({ $network, address }, context) => {
				assertTronMainnet($network)
				const { getAccountTokens } = await import('$/sources/TronScan/Rest/queries.ts')
				return (await getAccountTokens({
					restBaseUrl: tronScanRestBaseUrl,
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
										$network: entitySelector.$network,
										tokenId,
									},
									...tokenFieldsFromTronScanToken(entitySelector.$network, token),
								},
							]
					)
				})
			}
			}
		})({
				fields: {
			$$tokens: (tokens) => tokens,
		},
			}),

		defineResolver(Source.TronScan_Rest, {
			entityType: EntityType.TronContract,
			resolve: {
				[TronContractSelector.NetworkAddress]: async ({ $network, address }) => {
				assertTronMainnet($network)
				const { getContract } = await import('$/sources/TronScan/Rest/queries.ts')
				const contract = (await getContract({
					restBaseUrl: tronScanRestBaseUrl,
					address: address,
				})).data.at(0)
				if (contract == null) throw new Error(`TronScan_Rest: contract not found for ${address}`)
				return contractFieldsFromTronScanContract($network, address, contract).$$tokens
			}
			}
		})({
				fields: {
			$$tokens: (tokens) => tokens,
		},
			}),

		defineResolver(Source.TronScan_Rest, {
			entityType: EntityType.TronTransaction,
			resolve: {
				[TronTransactionSelector.NetworkTransactionId]: async ({ $network, transactionId }, context) => {
				assertTronMainnet($network)
				const { getTrc20Transfers } = await import('$/sources/TronScan/Rest/queries.ts')
				return (
					(await getTrc20Transfers({
						restBaseUrl: tronScanRestBaseUrl,
						transactionId: transactionId,
						limit: resolverContextRowLimit(context),
					})).token_transfers
					?? []
				).map((transfer, transferIndex) => (
					tokenTransferFieldsFromTronScanTransfer(
						entitySelector.$network,
						transfer,
						transferIndex,
					)
				))
			}
			}
		})({
				fields: {
			$$tokenTransfers: (tokenTransfers) => tokenTransfers,
		},
			}),
	],
}
