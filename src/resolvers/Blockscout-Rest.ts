import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import { keccak256, toHex } from '@tevm/voltaire/Hash'
import { toBytes } from '@tevm/voltaire/Hex'
import { evmAbiFromJsonString } from '$/lib/evmAbi.ts'
import { optionalNonemptyString } from '$/lib/string.ts'
import { hexLowerOfByteSize, with0xHex, zeroExLowerCase } from '$/lib/hexLowerOfByteSize.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import type { Entity, EntityReferenceValue, EntitySelector, EntitySelectorForSelectorName } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import {
	blockscoutAccountAbstractionClient,
	blockscoutEtherscanClient,
	blockscoutRestClient,
} from '$/sources/Blockscout/Rest/client.ts'
import { Source } from '$/sources/Source.ts'
import {
	EvmInternalCallType,
	EvmTokenStandard,
	EvmTransactionEnvelopeType,
	EvmTransactionExecutionStatus,
	EvmTransactionKind,
} from '$/constants/Evm.ts'
import { MarketAssetKind, MarketKind } from '$/constants/Market.ts'
import { CoinInstanceType } from '$/schema/CoinInstanceType.ts'
import { seededCoinSpotUsdMarketByCoinId, type CatalogCoinCurrencyMarket } from '$/constants/MarketCatalog.ts'
import type {
	BlockscoutInternalTransaction,
	BlockscoutErc4337RegistryEntry,
	BlockscoutStats,
	BlockscoutTokenTransfer,
} from '$/sources/Blockscout/Rest/types.ts'
import type { RpcBlockHeader, RpcLog } from '$/sources/_shared/interfaces/EvmExecutionJsonRpc/types.ts'

type EvmNetworkId = EntitySelectorForSelectorName<typeof schema, EntityType.Network, 'Caip2'>
type NetworkCaip2Id = EntitySelectorForSelectorName<typeof schema, EntityType.Network, 'Caip2'>

const evmNetworkIdFromChainId = (chainId: number): EvmNetworkId => ({
	caip2: {
		namespace: 'eip155',
		reference: String(chainId),
	},
})

const chainIdFromEvmNetworkId = (network: EvmNetworkId | NetworkCaip2Id) => Number(network.caip2.reference)

const evmContractRuntimeCodeFromGetCodeHex = (
	codeHex: `0x${string}`
): `0x${string}` | undefined => (
	codeHex === '0x' || codeHex === '0x0' ?
		undefined
	:
		zeroExLowerCase(codeHex)
)

const evmContractBytecodeHashFromGetCodeHex = (
	codeHex: `0x${string}`
): `0x${string}` | undefined => {
	const runtimeCode = evmContractRuntimeCodeFromGetCodeHex(codeHex)
	return runtimeCode == null ?
		undefined
	:
		toHex(keccak256(toBytes(runtimeCode)))
}

const evmContractStorageSlotReadsFromEthGetStorageAt = async ({
	depth,
	getStorageAt,
}: {
	address: `0x${string}`
	depth: number
	getStorageAt: (slotQuantityHex: `0x${string}`) => Promise<`0x${string}`>
}) => {
	const storageSlots: {
		slot: `0x${string}`
		value: `0x${string}`
	}[] = []
	for (let slotIndex = 0; slotIndex < depth; slotIndex += 1) {
		const slotQuantityHex: `0x${string}` = `0x${BigInt(slotIndex).toString(16).padStart(64, '0')}`
		const valueHex = await getStorageAt(slotQuantityHex)
		const slotNormalized = hexLowerOfByteSize(slotQuantityHex, 32)
		const value = hexLowerOfByteSize(valueHex, 32)
		if (slotNormalized == null || value == null) continue
		storageSlots.push({
			slot: slotNormalized,
			value,
		})
	}
	return storageSlots
}

const evmLogIndexFromWire = (
	raw: string | undefined
): number | undefined => (
	raw == null ?
		undefined
	:
		((parsed) => (
		Number.isFinite(parsed) && Number.isInteger(parsed) && parsed >= 0 ?
			parsed
		:
			undefined
		))(
			raw.startsWith('0x') || raw.startsWith('0X') ?
				Number.parseInt(raw, 16)
			:
				Number(raw)
				)
)

const evmRpcQuantityToBigInt = (
	raw: string | undefined
): bigint | undefined => (
	raw == null ?
		undefined
	:
		((value) => (
		value < 0n ?
			undefined
		:
			value
		))(
			(() => {
				try {
					return BigInt(raw)
				} catch {
					return undefined
				}
			})() ?? -1n
		)
)

const evmLogEntitySelectorFromWire = ({
	$network,
	txHash,
	indexInTransaction,
}: {
	$network: EvmNetworkId
	txHash: string
	indexInTransaction: number
}) => {
	const normalizedTxHash = hexLowerOfByteSize(txHash, 32)
	return normalizedTxHash == null ?
		undefined
	:
		{
			$transaction: {
				$network,
				txHash: normalizedTxHash,
			},
			indexInTransaction,
		}
}

const evmLogEntityFromIdAndWire = (
	entitySelector: Entity<typeof schema, EntityType.EvmLog>[typeof EntityMetaKey.Selector],
	log: RpcLog
) => {
	const address = hexLowerOfByteSize(log.address ?? '', 20)
	const blockHash = hexLowerOfByteSize(log.blockHash ?? '', 32)
	const blockNumber = evmRpcQuantityToBigInt(log.blockNumber)
	const data = log.data == null ? undefined : with0xHex(log.data)
	const topics = (
		(log.topics ?? [])
			.flatMap((topic) => {
				const normalized = hexLowerOfByteSize(topic, 32)
				return normalized == null ? [] : [normalized]
			})
	)
	return {
		[EntityMetaKey.Selector]: entitySelector,
		$transaction: {
			[EntityMetaKey.Selector]: {
				$network: entitySelector.$transaction.$network,
				txHash: entitySelector.$transaction.txHash,
			},
		} satisfies Entity<typeof schema, EntityType.EvmTransaction>,
		...(blockHash != null && blockNumber != null && {
			$block: {
				[EntityMetaKey.Selector]: {
					$network: entitySelector.$transaction.$network,
					hash: blockHash,
				},
			} satisfies Entity<typeof schema, EntityType.EvmBlock>,
		}),
		$$topics: topics.map((hex) => ({
			[EntityMetaKey.Selector]: {
				hex,
			},
		} satisfies Entity<typeof schema, EntityType.EvmTopic>)),
		...(topics.at(0) != null && { topic0: topics.at(0) }),
		...(data != null && { data }),
		...(log.removed != null && { removed: log.removed }),
		...(address != null && {
			$emitter: {
				[EntityMetaKey.Selector]: {
					$network: entitySelector.$transaction.$network,
					address,
				},
			} satisfies Entity<typeof schema, EntityType.EvmContract>,
		}),
	}
}

const findReceiptLogWireForEvmLogId = (
	logs: readonly RpcLog[] | undefined,
	indexInTransaction: number
): RpcLog | undefined => logs?.at(indexInTransaction)

const evmTransactionEnvelopeTypeFromRpcTypeByte = (
	raw: number | undefined
): EvmTransactionEnvelopeType | undefined => (
	raw == null || !Number.isFinite(raw) || !Number.isInteger(raw) ?
		EvmTransactionEnvelopeType.Legacy
	:
		raw === 0 ?
			EvmTransactionEnvelopeType.Legacy
		:
			raw === 1 ?
				EvmTransactionEnvelopeType.AccessList
			:
				raw === 2 ?
				EvmTransactionEnvelopeType.FeeMarket
			:
				raw === 3 ?
				EvmTransactionEnvelopeType.Blob
			:
				raw === 4 ?
				EvmTransactionEnvelopeType.SetCode
			:
				EvmTransactionEnvelopeType.Unknown
)

const evmTransactionKindFromSignedFields = ({
	value,
	toAddress,
	input,
	createdContractAddress,
}: {
	value: bigint
	toAddress?: string
	input?: string
	createdContractAddress?: string
}): EvmTransactionKind => (
	createdContractAddress != null || toAddress == null ?
		EvmTransactionKind.ContractCreation
	:
		input != null && input !== '0x' && input.length > 2 ?
			value > 0n ?
				EvmTransactionKind.NativeTransferAndCall
			:
				EvmTransactionKind.ContractCall
		:
			value > 0n ?
				EvmTransactionKind.NativeTransfer
			:
				EvmTransactionKind.ContractCall
)

const evmInternalCallTypeFromWire = (
	raw: string | undefined
): EvmInternalCallType | undefined => (
	raw == null || raw === '' ?
		undefined
	:
		((normalized) => (
		normalized === 'call' ?
			EvmInternalCallType.Call
		:
			normalized === 'callcode' ?
				EvmInternalCallType.CallCode
			:
				normalized === 'delegatecall' ?
						EvmInternalCallType.DelegateCall
					:
						normalized === 'staticcall' ?
					EvmInternalCallType.StaticCall
				:
					normalized === 'create' ?
					EvmInternalCallType.Create
				:
					normalized === 'create2' ?
					EvmInternalCallType.Create2
				:
					normalized === 'suicide' || normalized === 'selfdestruct' ?
					EvmInternalCallType.SelfDestruct
				:
					EvmInternalCallType.Unknown
		))(raw.toLowerCase())
)

const blockscoutQuantityToBigInt = (
	raw: string | undefined
): bigint | undefined => (
	raw == null || raw === '' ?
		undefined
	:
		((value) => (
		value < 0n ?
			undefined
		:
			value
		))(
			(() => {
				try {
					return BigInt(raw)
				} catch {
				return undefined
				}
			})() ?? -1n
			)
)

const evmInternalTransferEntityFromWire = ({
	$network,
	txHash,
	wire,
}: {
	$network: EvmNetworkId
	txHash: `0x${string}`
	wire: BlockscoutInternalTransaction
}) => {
	const normalizedTxHash = hexLowerOfByteSize(txHash, 32)
	const internalIndex = wire.index
	if (normalizedTxHash == null || internalIndex == null || internalIndex < 0) return undefined
	const fromAddress = hexLowerOfByteSize(wire.from?.hash ?? '', 20)
	const toAddress = hexLowerOfByteSize(wire.to?.hash ?? '', 20)
	const createdAddress = hexLowerOfByteSize(wire.created_contract?.hash ?? '', 20)
	const value = blockscoutQuantityToBigInt(wire.value) ?? 0n
	const callType = evmInternalCallTypeFromWire(wire.type)
	if (callType == null) return undefined

	return {
		[EntityMetaKey.Selector]: {
			$transaction: {
				$network,
				txHash: normalizedTxHash,
			},
			indexInTransaction: internalIndex,
		},
		$transaction: {
			[EntityMetaKey.Selector]: {
				$network,
				txHash: normalizedTxHash,
			},
		} satisfies Entity<typeof schema, EntityType.EvmTransaction>,
		value,
		callType,
		...(wire.success != null && { success: wire.success }),
		...(fromAddress != null && {
			$from: {
				[EntityMetaKey.Selector]: { address: fromAddress },
			} satisfies Entity<typeof schema, EntityType.EvmAccount>,
		}),
		...(toAddress != null && {
			$to: {
				[EntityMetaKey.Selector]: { address: toAddress },
			} satisfies Entity<typeof schema, EntityType.EvmAccount>,
		}),
		...(createdAddress != null && (
			callType === EvmInternalCallType.Create
			|| callType === EvmInternalCallType.Create2
		) && {
			$createdContract: {
				[EntityMetaKey.Selector]: {
					$network,
					address: createdAddress,
				},
			} satisfies Entity<typeof schema, EntityType.EvmContract>,
		}),
	}
}

const evmInternalTransferEntitiesFromBlockscoutWires = ({
	$network,
	txHash,
	wires,
}: {
	$network: EvmNetworkId
	txHash: `0x${string}`
	wires: readonly BlockscoutInternalTransaction[]
}) => (
	wires.flatMap((wire) => {
		const entity = evmInternalTransferEntityFromWire({
			$network,
			txHash,
			wire,
		})
		return entity == null ? [] : [entity]
	})
)

const evmInternalTransferEntitiesFromBlockscoutAddressWires = ({
	$network,
	wires,
}: {
	$network: EvmNetworkId
	wires: readonly BlockscoutInternalTransaction[]
}) => {
	const wiresByTxHash = new Map<string, BlockscoutInternalTransaction[]>()
	for (const wire of wires) {
		const txHash = hexLowerOfByteSize(wire.transaction_hash ?? '', 32)
		if (txHash == null) continue
		const txWires = wiresByTxHash.get(txHash) ?? []
		txWires.push(wire)
		wiresByTxHash.set(txHash, txWires)
	}
	return (
		[...wiresByTxHash.entries()]
			.flatMap(([txHash, txWires]) => {
				const normalizedTxHash = hexLowerOfByteSize(txHash, 32)
				return normalizedTxHash == null ?
					[]
				:
					evmInternalTransferEntitiesFromBlockscoutWires({
						$network,
						txHash: normalizedTxHash,
						wires: txWires,
					})
			})
	)
}

const findBlockscoutInternalTransferWireForEntitySelector = (
	wires: readonly BlockscoutInternalTransaction[],
	entitySelector: Entity<typeof schema, EntityType.EvmInternalTransfer>[typeof EntityMetaKey.Selector]
): BlockscoutInternalTransaction | undefined => (
	wires.find((wire) => wire.index === entitySelector.indexInTransaction)
)

const blockscoutLogIndexFromWire = (
	raw: string | number | undefined
): number | undefined => (
	raw == null ?
		undefined
	:
		((parsed) => (
		Number.isFinite(parsed) && Number.isInteger(parsed) && parsed >= 0 ?
			parsed
		:
			undefined
		))(
			typeof raw === 'number' ?
			raw
		:
			raw.startsWith('0x') || raw.startsWith('0X') ?
				Number.parseInt(raw, 16)
			:
				Number(raw)
			)
)

const indexInTransactionForBlockscoutLogIndex = (
	receiptLogs: readonly RpcLog[],
	rawLogIndex: string | number | undefined
): number | undefined => {
	const logIndex = blockscoutLogIndexFromWire(rawLogIndex)
	if (logIndex == null) return undefined

	const indexInTransaction = receiptLogs.findIndex((log) => (
		evmLogIndexFromWire(log.logIndex) === logIndex
	))
	return indexInTransaction === -1 ? undefined : indexInTransaction
}

const evmTokenStandardFromBlockscoutWire = (
	wire: BlockscoutTokenTransfer
): EvmTokenStandard => {
	const tokenType = wire.token?.type?.toUpperCase() ?? ''
	if (tokenType.includes('721')) return EvmTokenStandard.Erc721
	if (tokenType.includes('1155')) return EvmTokenStandard.Erc1155
	return EvmTokenStandard.Erc20
}

const evmTokenTransferEntityFromFields = ({
	$network,
	txHash,
	indexInTransaction,
	indexInLog,
	standard,
	fromAddress,
	toAddress,
	tokenAddress,
	amount,
	tokenId,
	tokenSymbol,
	tokenName,
	tokenDecimals,
}: {
	$network: EvmNetworkId
	txHash: `0x${string}`
	indexInTransaction: number
	indexInLog: number
	standard: EvmTokenStandard
	fromAddress?: `0x${string}`
	toAddress?: `0x${string}`
	tokenAddress?: `0x${string}`
	amount: bigint
	tokenId?: bigint
	tokenSymbol?: string
	tokenName?: string
	tokenDecimals?: number
}) => ({
	[EntityMetaKey.Selector]: {
		$log: {
			$transaction: {
				$network,
				txHash,
			},
			indexInTransaction,
		},
		indexInLog,
	},
	$log: {
		[EntityMetaKey.Selector]: {
			$transaction: {
				$network,
				txHash,
			},
			indexInTransaction,
		},
	} satisfies Entity<typeof schema, EntityType.EvmLog>,
	standard,
	amount,
	...(tokenId != null && (
		standard === EvmTokenStandard.Erc721
		|| standard === EvmTokenStandard.Erc1155
	) && { tokenId }),
	...(tokenSymbol != null && { tokenSymbol }),
	...(tokenName != null && { tokenName }),
	...(tokenDecimals != null && Number.isFinite(tokenDecimals) && { tokenDecimals }),
	...(fromAddress != null && {
		$from: {
			[EntityMetaKey.Selector]: { address: fromAddress },
		} satisfies Entity<typeof schema, EntityType.EvmAccount>,
	}),
	...(toAddress != null && {
		$to: {
			[EntityMetaKey.Selector]: { address: toAddress },
		} satisfies Entity<typeof schema, EntityType.EvmAccount>,
	}),
	...(tokenAddress != null && {
		$tokenContract: {
			[EntityMetaKey.Selector]: {
				$network,
				address: tokenAddress,
			},
		} satisfies Entity<typeof schema, EntityType.EvmContract>,
		...(standard === EvmTokenStandard.Erc20 && {
			$coinInstance: {
				[EntityMetaKey.Selector]: {
					$network,
					type: CoinInstanceType.Erc20Token,
					$contract: {
						$network,
						address: tokenAddress,
					},
				},
			} satisfies Entity<typeof schema, EntityType.EvmCoinInstance>,
		}),
	}),
})

const evmTokenTransferEntityFromWire = ({
	$network,
	txHash,
	receiptLogs,
	wire,
	transferIndex,
}: {
	$network: EvmNetworkId
	txHash: `0x${string}`
	receiptLogs: readonly RpcLog[]
	wire: BlockscoutTokenTransfer
	transferIndex?: number
}) => {
	const normalizedTxHash = hexLowerOfByteSize(txHash, 32)
	const indexInTransaction = indexInTransactionForBlockscoutLogIndex(receiptLogs, wire.log_index)
	if (normalizedTxHash == null || indexInTransaction == null) return undefined
	const standard = evmTokenStandardFromBlockscoutWire(wire)
	const fromAddress = hexLowerOfByteSize(wire.from?.hash ?? '', 20)
	const toAddress = hexLowerOfByteSize(wire.to?.hash ?? '', 20)
	const tokenAddress = hexLowerOfByteSize(wire.token?.address_hash ?? '', 20)
	const tokenId = blockscoutQuantityToBigInt(wire.total?.token_id)
	const amount = (
		standard === EvmTokenStandard.Erc721 ?
			1n
		:
			blockscoutQuantityToBigInt(wire.total?.value) ?? 0n
	)
	const tokenDecimals = (
		wire.total?.decimals != null && wire.total.decimals !== '' ?
			Number(wire.total.decimals)
		:
			wire.token?.decimals != null && wire.token.decimals !== '' ?
				Number(wire.token.decimals)
			:
				undefined
	)
	return evmTokenTransferEntityFromFields({
		$network,
		txHash: normalizedTxHash,
		indexInTransaction,
		indexInLog: transferIndex ?? 0,
		standard,
		fromAddress: fromAddress ?? undefined,
		toAddress: toAddress ?? undefined,
		tokenAddress: tokenAddress ?? undefined,
		amount,
		tokenId,
		tokenSymbol: wire.token?.symbol,
		tokenName: wire.token?.name,
		tokenDecimals,
	})
}

const evmTokenTransferEntitiesFromBlockscoutWires = ({
	$network,
	txHash,
	receiptLogs,
	wires,
}: {
	$network: EvmNetworkId
	txHash: `0x${string}`
	receiptLogs: readonly RpcLog[]
	wires: readonly BlockscoutTokenTransfer[]
}) => (
	wires.flatMap((wire, index) => {
		const entity = evmTokenTransferEntityFromWire({
			$network,
			txHash,
			receiptLogs,
			transferIndex: wires
				.slice(0, index)
				.filter((previousWire) => (
					blockscoutLogIndexFromWire(previousWire.log_index)
					=== blockscoutLogIndexFromWire(wire.log_index)
				))
				.length,
			wire,
		})
		return entity == null ? [] : [entity]
	})
)

const evmTokenTransferEntitiesFromBlockscoutAddressWires = ({
	$network,
	client,
	wires,
}: {
	$network: EvmNetworkId
	client: ReturnType<typeof blockscoutRestClient>
	wires: readonly BlockscoutTokenTransfer[]
}) => {
	const wiresByTxHash = new Map<string, BlockscoutTokenTransfer[]>()
	for (const wire of wires) {
		const txHash = hexLowerOfByteSize(wire.transaction_hash ?? '', 32)
		if (txHash == null) continue
		const txWires = wiresByTxHash.get(txHash) ?? []
		txWires.push(wire)
		wiresByTxHash.set(txHash, txWires)
	}
	return Promise.all(
		[...wiresByTxHash.entries()]
			.map(async ([txHash, txWires]) => {
				const normalizedTxHash = hexLowerOfByteSize(txHash, 32)
				return normalizedTxHash == null ?
					[]
				:
					evmTokenTransferEntitiesFromBlockscoutWires({
						$network,
						txHash: normalizedTxHash,
						receiptLogs: await client.query(
							(await import('$/sources/Blockscout/Rest/queries.ts')).getTransactionLogs,
							{
								txHash: normalizedTxHash,
							}
						),
						wires: txWires,
					})
			})
	).then((transfers) => transfers.flat())
}

const findBlockscoutTokenTransferForEntitySelector = (
	wires: readonly BlockscoutTokenTransfer[],
	receiptLogs: readonly RpcLog[],
	entitySelector: Entity<typeof schema, EntityType.EvmTokenTransfer>[typeof EntityMetaKey.Selector]
): BlockscoutTokenTransfer | undefined => (
	wires
		.filter((wire) => (
			indexInTransactionForBlockscoutLogIndex(receiptLogs, wire.log_index)
			=== entitySelector.$log.indexInTransaction
		))
		.at(entitySelector.indexInLog)
)

const evmInternalTransferReference = (
	entity: NonNullable<ReturnType<typeof evmInternalTransferEntityFromWire>>
) => ({
	[EntityMetaKey.Selector]: entity[EntityMetaKey.Selector],
	[EntityMetaKey.Fields]: {
		[entityFieldAddressKey(EntityType.EvmInternalTransfer, [], '$transaction')]: entity.$transaction,
		[entityFieldAddressKey(EntityType.EvmInternalTransfer, [], 'value')]: entity.value,
		[entityFieldAddressKey(EntityType.EvmInternalTransfer, [], 'callType')]: entity.callType,
		...(entity.success != null && {
			[entityFieldAddressKey(EntityType.EvmInternalTransfer, [], 'success')]: entity.success,
		}),
		...(entity.$from != null && {
			[entityFieldAddressKey(EntityType.EvmInternalTransfer, [], '$from')]: entity.$from,
		}),
		...(entity.$to != null && {
			[entityFieldAddressKey(EntityType.EvmInternalTransfer, [], '$to')]: entity.$to,
		}),
		...(entity.$createdContract != null && {
			[entityFieldAddressKey(EntityType.EvmInternalTransfer, [], '$createdContract')]: entity.$createdContract,
		}),
	},
})

const evmTokenTransferReference = (
	entity: NonNullable<ReturnType<typeof evmTokenTransferEntityFromWire>>
) => ({
	[EntityMetaKey.Selector]: entity[EntityMetaKey.Selector],
	[EntityMetaKey.Fields]: {
		[entityFieldAddressKey(EntityType.EvmTokenTransfer, [], '$log')]: entity.$log,
		[entityFieldAddressKey(EntityType.EvmTokenTransfer, [], 'standard')]: entity.standard,
		[entityFieldAddressKey(EntityType.EvmTokenTransfer, [], 'amount')]: entity.amount,
		...(entity.tokenId != null && {
			[entityFieldAddressKey(EntityType.EvmTokenTransfer, ['Nft'], 'tokenId')]: entity.tokenId,
		}),
		...(entity.tokenSymbol != null && {
			[entityFieldAddressKey(EntityType.EvmTokenTransfer, [], 'tokenSymbol')]: entity.tokenSymbol,
		}),
		...(entity.tokenName != null && {
			[entityFieldAddressKey(EntityType.EvmTokenTransfer, [], 'tokenName')]: entity.tokenName,
		}),
		...(entity.tokenDecimals != null && {
			[entityFieldAddressKey(EntityType.EvmTokenTransfer, [], 'tokenDecimals')]: entity.tokenDecimals,
		}),
		...(entity.$from != null && {
			[entityFieldAddressKey(EntityType.EvmTokenTransfer, [], '$from')]: entity.$from,
		}),
		...(entity.$to != null && {
			[entityFieldAddressKey(EntityType.EvmTokenTransfer, [], '$to')]: entity.$to,
		}),
		...(entity.$tokenContract != null && {
			[entityFieldAddressKey(EntityType.EvmTokenTransfer, [], '$tokenContract')]: entity.$tokenContract,
		}),
		...(entity.$coinInstance != null && {
			[entityFieldAddressKey(EntityType.EvmTokenTransfer, [], '$coinInstance')]: entity.$coinInstance,
		}),
	},
})

const usdPriceStringToPrice1e8 = (
	raw: string | undefined
): bigint | undefined => {
	if (raw == null || raw === '') return undefined
	const usd = Number(raw)
	return Number.isFinite(usd) && usd >= 0 ?
		BigInt(Math.round(usd * 1e8))
	:
		undefined
}

const gasEstimateObservationFromBlockscoutStats = (
	stats: BlockscoutStats,
	fallbackTimestampMs = Date.now()
) => {
	const prices = stats.gas_prices
	if (prices == null) return null
	const hasTier = (
		prices.slow != null
		|| prices.average != null
		|| prices.fast != null
	)
	if (!hasTier) return null
	const updatedAtMs = (
		stats.gas_price_updated_at != null ?
			Date.parse(stats.gas_price_updated_at)
		:
			NaN
	)
	const timestampMs = (
		Number.isFinite(updatedAtMs) ?
			updatedAtMs
		:
			fallbackTimestampMs
	)
	return {
		timestampMs,
		...(prices.slow != null
			&& Number.isFinite(prices.slow)
			&& prices.slow >= 0 && {
				slowGwei: prices.slow,
			}),
		...(prices.average != null
			&& Number.isFinite(prices.average)
			&& prices.average >= 0 && {
				averageGwei: prices.average,
			}),
		...(prices.fast != null
			&& Number.isFinite(prices.fast)
			&& prices.fast >= 0 && {
				fastGwei: prices.fast,
			}),
		transport: 'blockscout-stats',
	}
}

const blockscoutStatsForChain = async (
	chainId: number
): Promise<BlockscoutStats | null> => {
	const { getStats } = await import('$/sources/Blockscout/Rest/queries.ts')
	return blockscoutRestClient(chainId).query(getStats, {})
}

const blockscoutStatsForNativeCoinId = async (
	coinId: string
): Promise<BlockscoutStats | null> => {
	const { blockscoutHostedNetworks } = await import('$/sources/Blockscout/Rest/constants.ts')
	for (const { chainId, nativeCoinId } of blockscoutHostedNetworks) {
		if (nativeCoinId !== coinId) continue
		const stats = await blockscoutStatsForChain(chainId)
		if (stats != null) return stats
	}
	return null
}

const blockscoutCountFromDecimalString = (
	raw: string | number | null | undefined,
	label: string
) => {
	if (raw == null || String(raw).trim() === '')
		throw new Error(`Blockscout_Rest: missing ${label}`)

	const count = Number(raw)
	if (!Number.isSafeInteger(count) || count < 0)
		throw new Error(`Blockscout_Rest: invalid ${label}: ${String(raw)}`)

	return count
}

const erc4337ContractField = (
	{ $network, address }:
		| EntitySelector<typeof schema, EntityType.Erc4337SmartAccount>
		| EntitySelector<typeof schema, EntityType.Erc4337Paymaster>
		| EntitySelector<typeof schema, EntityType.Erc4337AccountFactory>
) => ({
	$contract: {
		[EntityMetaKey.Selector]: {
			$network: $network,
			address: address,
		},
	} satisfies Entity<typeof schema, EntityType.EvmContract>,
})

const erc4337RegistryEntitiesFromBlockscoutWires = <
	_Type extends
		| EntityType.Erc4337SmartAccount
		| EntityType.Erc4337Bundler
		| EntityType.Erc4337Paymaster
		| EntityType.Erc4337AccountFactory,
	>({
	chainId,
	items,
}: {
	chainId: number
	items: readonly { address?: { hash?: string } }[]
}) => {
	const entities = items.flatMap((smartContract) => {
		const address = hexLowerOfByteSize(smartContract.address?.hash ?? '', 20)
		return address == null ?
			[]
		:
			[{
				[EntityMetaKey.Selector]: {
					$network: evmNetworkIdFromChainId(chainId),
					address,
				},
			}]
	})
	return entities
}

const catalogCoinCurrencyMarketMatchesMarket = (
	catalogMarket: CatalogCoinCurrencyMarket,
	market: EntitySelector<typeof schema, EntityType.Market>
) => (
	market.marketKind === catalogMarket.marketKind
	&& market.$marketVenue.marketVenueId === catalogMarket.marketVenueId
	&& market.$base.kind === MarketAssetKind.Coin
	&& market.$base.assetKey === catalogMarket.baseCoinId
	&& market.$quote.kind === MarketAssetKind.Currency
	&& market.$quote.assetKey === catalogMarket.quoteIso4217
)

export default {
	source: Source.Blockscout_Rest,

	resolvers: [
		defineResolver(Source.Blockscout_Rest, {
			entityType: EntityType.EvmBlock,
			resolve: {
				EvmNetworkBlockNumber: {
					resolve: async ({ $network, blockNumber }) => {
						const { getBlockByNumber } = await import('$/sources/Blockscout/Rest/queries.ts')
						const chainId = chainIdFromEvmNetworkId($network)
						const client = blockscoutRestClient(chainId)
						const header = await client.query(getBlockByNumber, {
							blockNumber: blockNumber,
						})
						if (header == null)
							throw new Error('Blockscout_Rest: block header not returned for EvmBlock')
						const parentBlockNumber = blockNumber > 0n ? blockNumber - 1n : undefined
						const blockHash = (
							header.hash != null ?
								hexLowerOfByteSize(header.hash, 32)
							:
								undefined
						)
						if (blockHash == null)
							throw new Error('Blockscout_Rest: block header missing hash for EvmBlock')

						const parentBlockHash = (
							header.parentHash != null ?
								hexLowerOfByteSize(header.parentHash, 32)
							:
								undefined
						)
						const timestampSeconds = (
							header.timestamp != null ? ((parsed) => (
								Number.isFinite(parsed) && Number.isInteger(parsed) && parsed >= 0 ?
									parsed
								:
									NaN
							))(Number(header.timestamp))
							:
								NaN
						)
						const gasUsed = (
							header.gasUsed != null ? ((value) => (
								value == null || value < 0n ? undefined : value
							))((() => {
								try {
									return BigInt(header.gasUsed)
								} catch {
									return undefined
								}
							})())
							:
								undefined
						)
						const gasLimit = (
							header.gasLimit != null ? ((value) => (
								value == null || value < 0n ? undefined : value
							))((() => {
								try {
									return BigInt(header.gasLimit)
								} catch {
									return undefined
								}
							})())
							:
								undefined
						)
						const baseFeePerGas = (
							header.baseFeePerGas != null ? ((value) => (
								value == null || value < 0n ? undefined : value
							))((() => {
								try {
									return BigInt(header.baseFeePerGas)
								} catch {
									return undefined
								}
							})())
							:
								undefined
						)
						const blobGasUsed = (
							header.blobGasUsed != null ? ((value) => (
								value == null || value < 0n ? undefined : value
							))((() => {
								try {
									return BigInt(header.blobGasUsed)
								} catch {
									return undefined
								}
							})())
							:
								undefined
						)
						const excessBlobGas = (
							header.excessBlobGas != null ? ((value) => (
								value == null || value < 0n ? undefined : value
							))((() => {
								try {
									return BigInt(header.excessBlobGas)
								} catch {
									return undefined
								}
							})())
							:
								undefined
						)
						const miner = (
							header.miner != null ?
								hexLowerOfByteSize(header.miner, 20)
							:
								undefined
						)
						const base = {
							[EntityMetaKey.Selector]: {
								$network: evmNetworkIdFromChainId(chainId),
								blockNumber,
							},
							hash: blockHash,
							...(parentBlockHash != null && { parentHash: parentBlockHash }),
							blockNumber,
							timestamp: ((timestampSeconds) => (
								Number.isFinite(timestampSeconds) ? timestampSeconds * 1000 : undefined
							))(timestampSeconds),
							gasUsed,
							gasLimit,
							baseFeePerGas,
							blobGasUsed,
							excessBlobGas,
							transactionCount: (header.transactions ?? []).length,
						}
						return {
							...base,
							...(parentBlockNumber != null && parentBlockHash != null && {
								$parent: {
									[EntityMetaKey.Selector]: {
										$network: evmNetworkIdFromChainId(chainId),
										blockNumber: parentBlockNumber,
									},
									[EntityMetaKey.Fields]: {
										[entityFieldAddressKey(EntityType.EvmBlock, [], 'hash')]: parentBlockHash,
										[entityFieldAddressKey(EntityType.EvmBlock, [], 'blockNumber')]: parentBlockNumber,
									},
								} satisfies EntityReferenceValue<typeof schema, EntityType.EvmBlock>,
							}),
							...(miner != null && {
								$miner: {
									[EntityMetaKey.Selector]: {
										address: miner,
									},
								},
							}),
						}
					},
				}
			},
		})({
				hash: (block) => block.hash,
				parentHash: (block) => block.parentHash,
				blockNumber: (block) => block.blockNumber,
				$parent: (block) => block.$parent,
				timestamp: (block) => block.timestamp,
				$miner: (block) => block.$miner,
				gasUsed: (block) => block.gasUsed,
				gasLimit: (block) => block.gasLimit,
				baseFeePerGas: (block) => block.baseFeePerGas,
				blobGasUsed: (block) => block.blobGasUsed,
				excessBlobGas: (block) => block.excessBlobGas,
				transactionCount: (block) => block.transactionCount,
			}),

		defineResolver(Source.Blockscout_Rest, {
			entityType: EntityType.EvmTransaction,
			resolve: {
				EvmNetworkTxHash: {
					resolve: async ({ $network, txHash: txHashSelector }) => {
						const {
							blockscoutTransactionWireAsRpcReceipt,
							blockscoutTransactionWireAsRpcTransaction,
							getTransactionLogs,
							getTransactionWireByHash,
						} = await import('$/sources/Blockscout/Rest/queries.ts')
						const client = blockscoutRestClient(chainIdFromEvmNetworkId($network))
						const blockscoutTransaction = await client.query(getTransactionWireByHash, {
							txHash: txHashSelector,
						})
						if (blockscoutTransaction == null)
							throw new Error('Blockscout_Rest: transaction not returned for EvmTransaction')
						const jsonRpcTransaction = blockscoutTransactionWireAsRpcTransaction(blockscoutTransaction)
						const networkChainId = chainIdFromEvmNetworkId($network)
						const containingBlockNumber = (
							jsonRpcTransaction.blockNumber != null ? ((value) => (
							value == null || value < 0n ? undefined : value
							))((() => {
							try {
								return BigInt(jsonRpcTransaction.blockNumber)
							} catch {
								return undefined
							}
							})())
							:
								undefined
						)
						const txHash = (
							jsonRpcTransaction.hash != null ?
								(hexLowerOfByteSize(jsonRpcTransaction.hash, 32) ?? txHashSelector)
							:
								txHashSelector
						)
						const from = (
							jsonRpcTransaction.from != null ?
								hexLowerOfByteSize(jsonRpcTransaction.from, 20)
							:
								undefined
						)
						const to = (
							jsonRpcTransaction.to != null ?
								hexLowerOfByteSize(jsonRpcTransaction.to, 20)
							:
								undefined
						)
						const rpcTypeByte = (
							jsonRpcTransaction.type != null ? ((parsed) => (
							Number.isFinite(parsed) && Number.isInteger(parsed) && parsed >= 0 ?
								parsed
							:
								undefined
							))(Number(jsonRpcTransaction.type))
							:
								undefined
						)
						const envelopeType = evmTransactionEnvelopeTypeFromRpcTypeByte(rpcTypeByte)
						const base = {
							[EntityMetaKey.Selector]: {
								$network: evmNetworkIdFromChainId(networkChainId),
								txHash,
							},
							...(containingBlockNumber != null && {
								$block: {
									[EntityMetaKey.Selector]: {
										$network: evmNetworkIdFromChainId(networkChainId),
										blockNumber: containingBlockNumber,
									},
								} satisfies Entity<typeof schema, EntityType.EvmBlock>,
							}),
							...(from != null && {
								$from: {
									[EntityMetaKey.Selector]: {
										address: from,
									},
								} satisfies Entity<typeof schema, EntityType.EvmAccount>,
							}),
							...(to != null && {
								$to: {
									[EntityMetaKey.Selector]: {
										address: to,
									},
								} satisfies Entity<typeof schema, EntityType.EvmAccount>,
							}),
							indexInBlock: (
								jsonRpcTransaction.transactionIndex != null ? ((parsed) => (
								Number.isFinite(parsed) && Number.isInteger(parsed) && parsed >= 0 ?
									parsed
								:
									undefined
								))(Number(jsonRpcTransaction.transactionIndex))
								:
									undefined
							),
							value: (
								jsonRpcTransaction.value != null ? ((value) => (
								value == null || value < 0n ? 0n : value
								))((() => {
								try {
									return BigInt(jsonRpcTransaction.value)
								} catch {
									return undefined
								}
								})())
								:
									0n
							),
							nonce: (
								jsonRpcTransaction.nonce != null ? ((parsed) => (
								Number.isFinite(parsed) && Number.isInteger(parsed) && parsed >= 0 ?
									parsed
								:
									undefined
								))(Number(jsonRpcTransaction.nonce))
								:
									undefined
							),
							...(jsonRpcTransaction.input != null && { input: with0xHex(jsonRpcTransaction.input) }),
							gas: (
								jsonRpcTransaction.gas != null ? ((value) => (
								value == null || value < 0n ? undefined : value
								))((() => {
								try {
									return BigInt(jsonRpcTransaction.gas)
								} catch {
									return undefined
								}
								})())
								:
									undefined
							),
							gasPrice: (
								jsonRpcTransaction.gasPrice != null ? ((value) => (
								value == null || value < 0n ? undefined : value
								))((() => {
								try {
									return BigInt(jsonRpcTransaction.gasPrice)
								} catch {
									return undefined
								}
								})())
								:
									undefined
							),
							...(
								(
								envelopeType === EvmTransactionEnvelopeType.FeeMarket
								|| envelopeType === EvmTransactionEnvelopeType.Blob
								|| envelopeType === EvmTransactionEnvelopeType.SetCode
								) && {
									maxFeePerGas: (
									jsonRpcTransaction.maxFeePerGas != null ? ((value) => (
										value == null || value < 0n ? undefined : value
									))((() => {
										try {
											return BigInt(jsonRpcTransaction.maxFeePerGas)
										} catch {
											return undefined
										}
									})())
									:
										undefined
									),
									maxPriorityFeePerGas: (
									jsonRpcTransaction.maxPriorityFeePerGas != null ? ((value) => (
										value == null || value < 0n ? undefined : value
									))((() => {
										try {
											return BigInt(jsonRpcTransaction.maxPriorityFeePerGas)
										} catch {
											return undefined
										}
									})())
									:
										undefined
									),
								}
							),
						}
						const receiptLogs = await client.query(getTransactionLogs, {
							txHash: txHash,
						})
						const receipt = blockscoutTransactionWireAsRpcReceipt(
							blockscoutTransaction,
							receiptLogs
						)
						const createdContractAddress = (
							receipt.contractAddress != null ?
								hexLowerOfByteSize(receipt.contractAddress, 20)
							:
								undefined
						)
						return {
							...base,
							envelopeType,
							kind: evmTransactionKindFromSignedFields({
								value: base.value,
								toAddress: to,
								input: jsonRpcTransaction.input,
								createdContractAddress,
							}),
							...(Number(receipt.status) === 1 && { executionStatus: EvmTransactionExecutionStatus.Success }),
							...(Number(receipt.status) === 0 && { executionStatus: EvmTransactionExecutionStatus.Failed }),
							...(receipt.gasUsed != null && ((value) => (
								value != null
							&& !(value < 0n)
							&& { gasUsed: value }
							))((() => {
							try {
								return BigInt(receipt.gasUsed)
							} catch {
								return undefined
							}
							})())),
							...(receipt.cumulativeGasUsed != null && ((value) => (
								value != null
							&& !(value < 0n)
							&& { cumulativeGasUsed: value }
							))((() => {
							try {
								return BigInt(receipt.cumulativeGasUsed)
							} catch {
								return undefined
							}
							})())),
							...(receipt.effectiveGasPrice != null && ((value) => (
								value != null
							&& !(value < 0n)
							&& { effectiveGasPrice: value }
							))((() => {
							try {
								return BigInt(receipt.effectiveGasPrice)
							} catch {
								return undefined
							}
							})())),
							...(receipt.contractAddress != null && ((address) => (
								address != null && {
									$contract: {
										[EntityMetaKey.Selector]: {
											$network,
											address,
										},
									} satisfies Entity<typeof schema, EntityType.EvmContract>,
								}
							))(createdContractAddress)),
							$$logs: (
								(receipt.logs ?? [])
									.flatMap((log, indexInTransaction) => {
										const id = evmLogEntitySelectorFromWire({
											$network,
											txHash,
											indexInTransaction,
										})
										return id == null ?
											[]
										:
											[evmLogEntityFromIdAndWire(id, log)]
									})
							),
						}
					},
				}
			},
		})({
				$from: (transaction) => {
						if (transaction.$from == null)
							throw new Error('Blockscout_Rest: transaction is missing from address')

						return transaction.$from
				},
				$to: (transaction) => transaction.$to,
				ContractCreation: {
					$contract: (transaction) => transaction.$contract,
				},
				indexInBlock: (transaction) => transaction.indexInBlock,
				value: (transaction) => transaction.value,
				nonce: (transaction) => transaction.nonce,
				input: (transaction) => transaction.input,
				gas: (transaction) => transaction.gas,
				kind: (transaction) => transaction.kind,
				envelopeType: (transaction) => {
						if (transaction.envelopeType == null)
							throw new Error('Blockscout_Rest: transaction has unsupported envelope type')

						return transaction.envelopeType
				},
				executionStatus: (transaction) => transaction.executionStatus,
				gasPrice: (transaction) => transaction.gasPrice,
				gasUsed: (transaction) => transaction.gasUsed,
				cumulativeGasUsed: (transaction) => transaction.cumulativeGasUsed,
				effectiveGasPrice: (transaction) => transaction.effectiveGasPrice,
				FeeMarket: {
					maxFeePerGas: (transaction) => transaction.maxFeePerGas,
					maxPriorityFeePerGas: (transaction) => transaction.maxPriorityFeePerGas,
				},
				$$logs: {
					select: (transaction) => transaction.$$logs.map((log) => ({
						[EntityMetaKey.Selector]: log[EntityMetaKey.Selector],
						[EntityMetaKey.Fields]: {
							[entityFieldAddressKey(EntityType.EvmLog, [], '$transaction')]: log.$transaction,
							[entityFieldAddressKey(EntityType.EvmLog, [], '$$topics')]: log.$$topics,
							...(log.$block != null && {
								[entityFieldAddressKey(EntityType.EvmLog, [], '$block')]: log.$block,
							}),
							...(log.topic0 != null && {
								[entityFieldAddressKey(EntityType.EvmLog, [], 'topic0')]: log.topic0,
							}),
							...(log.data != null && {
								[entityFieldAddressKey(EntityType.EvmLog, [], 'data')]: log.data,
							}),
							...(log.removed != null && {
								[entityFieldAddressKey(EntityType.EvmLog, [], 'removed')]: log.removed,
							}),
							...(log.$emitter != null && {
								[entityFieldAddressKey(EntityType.EvmLog, [], '$emitter')]: log.$emitter,
							}),
						},
					})),
					resolveCount: (transaction) => transaction.$$logs.length,
				},
			}),

		defineResolver(Source.Blockscout_Rest, {
			entityType: EntityType.EvmLog,
			resolve: {
				TransactionIndexInTransaction: {
					resolve: async (entitySelector) => {
						const { getTransactionLogs } = await import('$/sources/Blockscout/Rest/queries.ts')
						const client = blockscoutRestClient(chainIdFromEvmNetworkId(entitySelector.$transaction.$network))
						const logs = await client.query(getTransactionLogs, {
							txHash: entitySelector.$transaction.txHash,
						})
						const log = findReceiptLogWireForEvmLogId(logs, entitySelector.indexInTransaction)
						if (log == null)
							throw new Error('Blockscout_Rest: receipt log not found for EvmLog')
						return evmLogEntityFromIdAndWire(entitySelector, log)
					},
				}
			},
		})({
				$$topics: (log) => log.$$topics,
				topic0: (log) => log.topic0,
				$transaction: (log) => log.$transaction,
				indexInTransaction: (log) => log[EntityMetaKey.Selector].indexInTransaction,
				$block: (log) => log.$block,
				data: (log) => log.data,
				removed: (log) => log.removed,
				$emitter: (log) => log.$emitter,
				Event: {
					signatureHash: (log) => log.topic0,
				},
			}),

		defineResolver(Source.Blockscout_Rest, {
			entityType: EntityType.EvmLog,
			resolve: {
				TransactionIndexInTransaction: {
					resolve: async ({
						$transaction,
						indexInTransaction,
					}, context) => {
						const {
							blockscoutV2ItemsCountMax,
						} = await import('$/sources/Blockscout/Rest/constants.ts')
						const {
							getTransactionLogs,
							getTransactionTokenTransfers,
						} = await import('$/sources/Blockscout/Rest/queries.ts')
						const client = blockscoutRestClient(
							chainIdFromEvmNetworkId($transaction.$network)
						)
						return evmTokenTransferEntitiesFromBlockscoutWires({
							$network: $transaction.$network,
							txHash: $transaction.txHash,
							receiptLogs: await client.query(getTransactionLogs, {
								txHash: $transaction.txHash,
							}),
							wires: await client.query(getTransactionTokenTransfers, {
								txHash: $transaction.txHash,
								limit: Math.min(
									resolverContextRowLimit(context),
									blockscoutV2ItemsCountMax
								),
							}),
						})
							.filter((transfer) => (
								transfer[EntityMetaKey.Selector].$log.indexInTransaction === indexInTransaction
							))
							.map((transfer) => ({
								[EntityMetaKey.Selector]: transfer[EntityMetaKey.Selector],
							}))
					},
				}
			},
		})({
				Event: {
					TokenTransfer: {
						$$tokenTransfers: (transfers) => transfers,
					},
				},
			}),

		defineResolver(Source.Blockscout_Rest, {
			entityType: EntityType.EvmTokenTransfer,
			resolve: {
				LogIndexInLog: {
					resolve: async (entitySelector) => {
						const {
							blockscoutV2ItemsCountMax,
						} = await import('$/sources/Blockscout/Rest/constants.ts')
						const {
							getTransactionLogs,
							getTransactionTokenTransfers,
						} = await import('$/sources/Blockscout/Rest/queries.ts')
						const client = blockscoutRestClient(chainIdFromEvmNetworkId(entitySelector.$log.$transaction.$network))
						const wires = await client.query(getTransactionTokenTransfers, {
							txHash: entitySelector.$log.$transaction.txHash,
							limit: blockscoutV2ItemsCountMax,
						})
						const receiptLogs = await client.query(getTransactionLogs, {
							txHash: entitySelector.$log.$transaction.txHash,
						})
						const wire = findBlockscoutTokenTransferForEntitySelector(wires, receiptLogs, entitySelector)
						if (wire == null)
							throw new Error('Blockscout_Rest: token transfer not found for EvmTokenTransfer')
						const entity = evmTokenTransferEntityFromWire({
							$network: entitySelector.$log.$transaction.$network,
							txHash: entitySelector.$log.$transaction.txHash,
							receiptLogs,
							transferIndex: entitySelector.indexInLog,
							wire,
						})
						if (entity == null)
							throw new Error('Blockscout_Rest: token transfer wire did not map to EvmTokenTransfer')
						return entity
					},
				}
			},
		})({
				standard: (transfer) => transfer.standard,
				$log: (transfer) => transfer.$log,
				indexInLog: (transfer) => transfer[EntityMetaKey.Selector].indexInLog,
				$from: (transfer) => transfer.$from,
				$to: (transfer) => transfer.$to,
				$tokenContract: (transfer) => transfer.$tokenContract,
				$coinInstance: (transfer) => transfer.$coinInstance,
				amount: (transfer) => transfer.amount,
				tokenSymbol: (transfer) => transfer.tokenSymbol,
				tokenName: (transfer) => transfer.tokenName,
				tokenDecimals: (transfer) => transfer.tokenDecimals,
				Nft: {
					tokenId: (transfer) => transfer.tokenId,
				},
			}),

		defineResolver(Source.Blockscout_Rest, {
			entityType: EntityType.EvmCoinInstance,
			resolve: {
				NetworkTypeContract: {
					resolve: async ({ $contract, $network, type }) => {
						if (type !== CoinInstanceType.Erc20Token)
							throw new Error('Blockscout_Rest: EvmCoinInstance requires ERC-20 token contract selector')
						const client = blockscoutRestClient(chainIdFromEvmNetworkId($network))
						const { getAddressDetails } = await import('$/sources/Blockscout/Rest/queries.ts')
						const detail = await client.query(getAddressDetails, {
							address: $contract.address,
						})
						const token = detail.token
						if (token == null)
							throw new Error('Blockscout_Rest: address detail missing token metadata for EvmCoinInstance')
						return {
							[EntityMetaKey.Selector]: {
								$network,
								type,
								$contract,
							},
							$network: {
								[EntityMetaKey.Selector]: $network,
							} satisfies Entity<typeof schema, EntityType.Network>,
							type,
							$contract: {
								[EntityMetaKey.Selector]: $contract,
							} satisfies Entity<typeof schema, EntityType.EvmContract>,
							coinId: `${$network.caip2.namespace}:${$network.caip2.reference}/erc20:${$contract.address}`,
							name: token.name,
							symbol: token.symbol ?? $contract.address,
							decimals: Number(token.decimals ?? 0),
							iconUrl: token.icon_url,
						}
					},
				},
			},
		})({
				Erc20Token: {
					coinId: (coinInstance) => coinInstance.coinId,
					name: (coinInstance) => coinInstance.name,
					symbol: (coinInstance) => coinInstance.symbol,
					decimals: (coinInstance) => coinInstance.decimals,
					iconUrl: (coinInstance) => coinInstance.iconUrl,
				},
			}),

		defineResolver(Source.Blockscout_Rest, {
			entityType: EntityType.EvmInternalTransfer,
			resolve: {
				TransactionIndexInTransaction: {
					resolve: async (entitySelector) => {
						const {
							blockscoutV2ItemsCountMax,
						} = await import('$/sources/Blockscout/Rest/constants.ts')
						const { getTransactionInternalTransactions } = await import('$/sources/Blockscout/Rest/queries.ts')
						const client = blockscoutRestClient(chainIdFromEvmNetworkId(entitySelector.$transaction.$network))
						const wires = await client.query(getTransactionInternalTransactions, {
							txHash: entitySelector.$transaction.txHash,
							limit: blockscoutV2ItemsCountMax,
						})
						const wire = findBlockscoutInternalTransferWireForEntitySelector(wires, entitySelector)
						if (wire == null)
							throw new Error('Blockscout_Rest: internal transfer not found for EvmInternalTransfer')
						const entity = evmInternalTransferEntityFromWire({
							$network: entitySelector.$transaction.$network,
							txHash: entitySelector.$transaction.txHash,
							wire,
						})
						if (entity == null)
							throw new Error('Blockscout_Rest: internal transfer wire did not map to EvmInternalTransfer')
						return entity
					},
				}
			},
		})({
				$transaction: (transfer) => transfer.$transaction,
				indexInTransaction: (transfer) => transfer[EntityMetaKey.Selector].indexInTransaction,
				$from: (transfer) => transfer.$from,
				$to: (transfer) => transfer.$to,
				value: (transfer) => transfer.value,
				callType: ({ callType }) => callType,
				success: (transfer) => transfer.success,
				$createdContract: (transfer) => transfer.$createdContract,
			}),

		defineResolver(Source.Blockscout_Rest, {
			entityType: EntityType.Erc4337SmartAccount,
			resolve: {
				EvmNetworkAddress: {
					resolve: async (entitySelector) => erc4337ContractField(entitySelector),
				},
			},
		})({
				$contract: (account) => account.$contract,
			}),

		defineResolver(Source.Blockscout_Rest, {
			entityType: EntityType.Erc4337SmartAccount,
			resolve: {
				EvmNetworkAddress: {
					resolve: async (entitySelector) => {
						const { getErc4337SmartAccountDetail } = await import('$/sources/Blockscout/Rest/queries.ts')
						const client = blockscoutAccountAbstractionClient(
							chainIdFromEvmNetworkId(entitySelector.$network)
						)
						const wire = await client.query(getErc4337SmartAccountDetail, {
							address: entitySelector.address,
						})
						const factoryAddress = (
							wire.factory?.hash != null ?
								hexLowerOfByteSize(wire.factory.hash, 20)
							:
								undefined
						)
						return {
							...(factoryAddress != null && {
								$factory: {
									[EntityMetaKey.Selector]: {
										$network: entitySelector.$network,
										address: factoryAddress,
									},
								} satisfies Entity<typeof schema, EntityType.Erc4337AccountFactory>,
							}),
							$$timestamps: [
								{
									[EntityMetaKey.Selector]: {
										$account: entitySelector,
										timestampMs: Date.now(),
										source: Source.Blockscout_Rest,
									},
									userOperationsCount: wire.total_ops,
								},
							],
						}
					},
				}
			},
		})({
				$factory: (account) => account.$factory,
				$$timestamps: (account) => account.$$timestamps.map((timestamp) => ({
					[EntityMetaKey.Selector]: timestamp[EntityMetaKey.Selector],
				})),
			}),

		defineResolver(Source.Blockscout_Rest, {
			entityType: EntityType.Erc4337SmartAccount_Timestamp,
			resolve: {
				AccountTimestampMsSource: {
					resolve: async ({ $account, timestampMs, source }) => {
						if (source !== Source.Blockscout_Rest)
							throw new Error(`Blockscout_Rest: unsupported source ${source}`)
						const { getErc4337SmartAccountDetail } = await import('$/sources/Blockscout/Rest/queries.ts')
						const client = blockscoutAccountAbstractionClient(
							chainIdFromEvmNetworkId($account.$network)
						)

						return {
							$account,
							timestampMs,
							source,
							userOperationsCount: (await client.query(getErc4337SmartAccountDetail, {
								address: $account.address,
							})).total_ops,
						}
					},
				},
			},
		})({
				$account: (timestamp) => ({
					[EntityMetaKey.Selector]: timestamp.$account,
				}),
				timestampMs: (timestamp) => timestamp.timestampMs,
				source: (timestamp) => timestamp.source,
				userOperationsCount: (timestamp) => timestamp.userOperationsCount,
			}),

		defineResolver(Source.Blockscout_Rest, {
			entityType: EntityType.Erc4337Paymaster,
			resolve: {
				EvmNetworkAddress: {
					resolve: async (entitySelector) => erc4337ContractField(entitySelector),
				}
			},
		})({
				$contract: (paymaster) => paymaster.$contract,
			}),

		defineResolver(Source.Blockscout_Rest, {
			entityType: EntityType.Erc4337AccountFactory,
			resolve: {
				EvmNetworkAddress: {
					resolve: async (entitySelector) => erc4337ContractField(entitySelector),
				},
			},
		})({
				$contract: (factory) => factory.$contract,
			}),

		defineResolver(Source.Blockscout_Rest, {
			entityType: EntityType.EvmUserOperation,
			resolve: {
				EvmNetworkHash: {
					resolve: async ({ $network, hash }) => {
						const {
							getUserOperationDetail,
						} = await import('$/sources/Blockscout/Rest/queries.ts')
						const client = blockscoutAccountAbstractionClient(
							chainIdFromEvmNetworkId($network)
						)
						const wire = await client.query(getUserOperationDetail, {
							hash: hash,
						})
						const bundledTransactionHash = (
							wire.transaction_hash != null ?
								hexLowerOfByteSize(wire.transaction_hash, 32)
							:
								undefined
						)
						const senderAddress = hexLowerOfByteSize(
							wire.sender?.hash ?? wire.address?.hash ?? '',
							20
						)
						const paymasterAddress = (
							wire.paymaster?.hash != null ?
								hexLowerOfByteSize(wire.paymaster.hash, 20)
							:
								undefined
						)
						const bundlerAddress = (
							wire.bundler?.hash != null ?
								hexLowerOfByteSize(wire.bundler.hash, 20)
							:
								undefined
						)
						const entryPointAddress = (
							wire.entry_point?.hash != null ?
								hexLowerOfByteSize(wire.entry_point.hash, 20)
							:
								undefined
						)
						const initCode = (
							wire.raw?.init_code != null
						&& wire.raw.init_code !== '0x' ?
								with0xHex(wire.raw.init_code)
							:
								undefined
						)
						const callData = (
							wire.raw?.call_data != null
						&& wire.raw.call_data !== '0x' ?
								with0xHex(wire.raw.call_data)
							:
								undefined
						)
						const paymasterAndData = (
							wire.raw?.paymaster_and_data != null
						&& wire.raw.paymaster_and_data !== '0x' ?
								with0xHex(wire.raw.paymaster_and_data)
							:
								undefined
						)
						const signature = (
							wire.raw?.signature != null
						&& wire.raw.signature !== '0x' ?
								with0xHex(wire.raw.signature)
							:
								undefined
						)
						const blockNumberRaw = wire.block_number
						const blockNumber = (
							blockNumberRaw === null || blockNumberRaw === undefined ?
								undefined
							:
								(() => {
								try {
									return BigInt(`${blockNumberRaw}`)
								} catch {
									return undefined
								}
								})()
						)
						const timestampMs = (
							wire.timestamp != null ? ((time) => (
							Number.isFinite(time) && time >= 0 ? time : undefined
							))(Date.parse(wire.timestamp))
							:
								undefined
						)
						const fee = optionalNonemptyString(wire.fee)
						const optionalBigIntFromWire = (
							value: string | number | null | undefined
						) => (
							value === null || value === undefined ?
								undefined
							:
								(() => {
								try {
									return BigInt(`${value}`)
								} catch {
									return undefined
								}
								})()
						)
						const nonce = optionalBigIntFromWire(wire.nonce)
						const callGasLimit = optionalBigIntFromWire(wire.call_gas_limit)
						const verificationGasLimit = optionalBigIntFromWire(wire.verification_gas_limit)
						const preVerificationGas = optionalBigIntFromWire(wire.pre_verification_gas)
						const maxFeePerGas = optionalBigIntFromWire(wire.max_fee_per_gas)
						const maxPriorityFeePerGas = optionalBigIntFromWire(wire.max_priority_fee_per_gas)
						const gas = optionalBigIntFromWire(wire.gas)
						const gasUsed = optionalBigIntFromWire(wire.gas_used)
						const gasPrice = optionalBigIntFromWire(wire.gas_price)
						const entryPointVersion = optionalNonemptyString(wire.entry_point_version)
						const sponsorType = optionalNonemptyString(wire.sponsor_type)
						return {
							...(bundledTransactionHash != null && {
								$bundledTransaction: {
									[EntityMetaKey.Selector]: {
										$network: $network,
										txHash: bundledTransactionHash,
									},
								} satisfies Entity<typeof schema, EntityType.EvmTransaction>,
							}),
							...(senderAddress != null && {
								$sender: {
									[EntityMetaKey.Selector]: {
										$network: $network,
										address: senderAddress,
									},
								} satisfies Entity<typeof schema, EntityType.Erc4337SmartAccount>,
							}),
							...(paymasterAddress != null && {
								$paymaster: {
									[EntityMetaKey.Selector]: {
										$network: $network,
										address: paymasterAddress,
									},
								} satisfies Entity<typeof schema, EntityType.Erc4337Paymaster>,
							}),
							...(bundlerAddress != null && {
								$bundler: {
									[EntityMetaKey.Selector]: {
										$network: $network,
										address: bundlerAddress,
									},
								} satisfies Entity<typeof schema, EntityType.Erc4337Bundler>,
							}),
							...(entryPointAddress != null && {
								$entryPoint: {
									[EntityMetaKey.Selector]: {
										$network: $network,
										address: entryPointAddress,
									},
								} satisfies Entity<typeof schema, EntityType.EvmContract>,
							}),
							...(blockNumber != null && {
								$block: {
									[EntityMetaKey.Selector]: {
										$network: $network,
										blockNumber,
									},
								} satisfies Entity<typeof schema, EntityType.EvmBlock>,
							}),
							...(timestampMs != undefined && { timestampMs }),
							...{
								...(
									wire.status === false || wire.status === true ?
										{ successful: wire.status }
									:
										{}
								),
								...(fee != null && { fee }),
								...(nonce != null && { nonce }),
								...(callGasLimit != null && { callGasLimit }),
								...(verificationGasLimit != null && { verificationGasLimit }),
								...(preVerificationGas != null && { preVerificationGas }),
								...(maxFeePerGas != null && { maxFeePerGas }),
								...(maxPriorityFeePerGas != null && { maxPriorityFeePerGas }),
								...(gas != null && { gas }),
								...(gasUsed != null && { gasUsed }),
								...(gasPrice != null && { gasPrice }),
								...(entryPointVersion != null && { entryPointVersion }),
								...(initCode != null && { initCode }),
								...(callData != null && { callData }),
								...(sponsorType != null && { sponsorType }),
								...(paymasterAndData != null && { paymasterAndData }),
								...(signature != null && { signature }),
							},
						}
					},
				}
			},
		})({
				$bundledTransaction: (userOperation) => userOperation.$bundledTransaction,
				$sender: (userOperation) => userOperation.$sender,
				$block: (userOperation) => userOperation.$block,
				timestampMs: (userOperation) => userOperation.timestampMs,
				successful: (userOperation) => userOperation.successful,
				fee: (userOperation) => userOperation.fee,
				nonce: (userOperation) => userOperation.nonce,
				callGasLimit: (userOperation) => userOperation.callGasLimit,
				verificationGasLimit: (userOperation) => userOperation.verificationGasLimit,
				preVerificationGas: (userOperation) => userOperation.preVerificationGas,
				maxFeePerGas: (userOperation) => userOperation.maxFeePerGas,
				maxPriorityFeePerGas: (userOperation) => userOperation.maxPriorityFeePerGas,
				gas: (userOperation) => userOperation.gas,
				gasUsed: (userOperation) => userOperation.gasUsed,
				gasPrice: (userOperation) => userOperation.gasPrice,
				entryPointVersion: (userOperation) => userOperation.entryPointVersion,
				$entryPoint: (userOperation) => userOperation.$entryPoint,
				initCode: (userOperation) => userOperation.initCode,
				callData: (userOperation) => userOperation.callData,
				sponsorType: (userOperation) => userOperation.sponsorType,
				paymasterAndData: (userOperation) => userOperation.paymasterAndData,
				signature: (userOperation) => userOperation.signature,
				$paymaster: (userOperation) => userOperation.$paymaster,
				$bundler: (userOperation) => userOperation.$bundler,
			}),

		defineResolver(Source.Blockscout_Rest, {
			entityType: EntityType.Market_Timestamp,
			resolve: {
				MarketTimestampMsFeedKey: {
					resolve: async ({ $market, feedKey, timestampMs: timestampMsSelector }) => {
						if ($market.marketKind !== MarketKind.Spot)
							throw new Error('Blockscout_Rest: Market_Timestamp is spot-only')
						const coinId = (
							$market.$base.kind === MarketAssetKind.Coin ?
								$market.$base.assetKey
							:
								undefined
						)
						if (coinId == null)
							throw new Error('Blockscout_Rest: market base is not a catalog coin')
						if (feedKey !== coinId)
							throw new Error('Blockscout_Rest: Market_Timestamp feedKey does not match catalog coin id')
						if (!catalogCoinCurrencyMarketMatchesMarket(seededCoinSpotUsdMarketByCoinId[coinId], $market))
							throw new Error('Blockscout_Rest: Market_Timestamp only supports catalog USD spot markets')
						const stats = await blockscoutStatsForNativeCoinId(coinId)
						const price = usdPriceStringToPrice1e8(stats?.coin_price)
						if (stats == null || price == null)
							throw new Error(`Blockscout_Rest: Market_Timestamp unsupported for coin ${coinId}`)
						const timestampMs = Date.parse(stats.gas_price_updated_at ?? '')
						if (!Number.isFinite(timestampMs))
							throw new Error(`Blockscout_Rest: Market_Timestamp price clock missing for coin ${coinId}`)
						if (timestampMs !== timestampMsSelector)
							throw new Error('Blockscout_Rest: Market_Timestamp id does not match stats clock')
						return {
							price,
							transport: 'blockscout-stats-usd-1e8',
							providerAssetId: coinId,
						}
					},
				}
			},
		})({
				price: (quote) => quote.price,
				transport: (quote) => quote.transport,
				providerAssetId: (quote) => quote.providerAssetId,
			}),

		defineResolver(Source.Blockscout_Rest, {
				entityType: EntityType.EvmNetwork_GasEstimate_Timestamp,
				resolve: {
					NetworkTimestampMsSource: {
						resolve: async ({ $network, timestampMs, source }) => {
							if (source !== Source.Blockscout_Rest)
								throw new Error('Blockscout_Rest: EvmNetwork_GasEstimate_Timestamp selector source mismatch')

							const stats = await blockscoutStatsForChain(chainIdFromEvmNetworkId($network))
							if (stats == null)
								throw new Error(
								`Blockscout_Rest: EvmNetwork_GasEstimate_Timestamp unsupported for chain ${String(chainIdFromEvmNetworkId($network))}`
						)
						const observation = gasEstimateObservationFromBlockscoutStats(stats, timestampMs)
						if (observation == null)
							throw new Error('Blockscout_Rest: stats missing gas_prices tiers')
						if (timestampMs !== observation.timestampMs)
							throw new Error('Blockscout_Rest: EvmNetwork_GasEstimate_Timestamp id does not match stats clock')
						return {
							...(observation.slowGwei != null && { slowGwei: observation.slowGwei }),
							...(observation.averageGwei != null && { averageGwei: observation.averageGwei }),
							...(observation.fastGwei != null && { fastGwei: observation.fastGwei }),
							transport: observation.transport,
						}
					},
					}
			},
		})({
				slowGwei: (gasEstimate) => gasEstimate.slowGwei,
				averageGwei: (gasEstimate) => gasEstimate.averageGwei,
				fastGwei: (gasEstimate) => gasEstimate.fastGwei,
				transport: (gasEstimate) => gasEstimate.transport,
			}),

		defineResolver(Source.Blockscout_Rest, {
			entityType: EntityType.Coin_Timestamp,
			resolve: {
				CoinTimestampMsSource: {
					resolve: async ({ $coin, timestampMs: timestampMsSelector }) => {
						const stats = await blockscoutStatsForNativeCoinId($coin.coinId)
						if (stats == null)
							throw new Error(`Blockscout_Rest: Coin_Timestamp unsupported for coin ${$coin.coinId}`)
						const timestampMs = Date.parse(stats.gas_price_updated_at ?? '')
						if (!Number.isFinite(timestampMs))
							throw new Error(`Blockscout_Rest: Coin_Timestamp clock missing for coin ${$coin.coinId}`)
						if (timestampMs !== timestampMsSelector)
							throw new Error(`Blockscout_Rest: Coin_Timestamp id does not match stats clock for coin ${$coin.coinId}`)
						const marketCapUsd = (() => {
							const raw = stats.market_cap
							if (raw == null || raw === '') return undefined
							const usd = Number(raw)
							return (
								Number.isFinite(usd) && usd >= 0 ?
									usd
								:
									undefined
							)
						})()
						return {
							...(marketCapUsd != null && {
								marketCap: BigInt(Math.round(marketCapUsd)),
								marketCapUsd,
							}),
							...(stats.coin_price_change_percentage != null
							&& Number.isFinite(stats.coin_price_change_percentage) && {
								change24hPercent: stats.coin_price_change_percentage,
							}),
							transport: 'blockscout-stats',
							providerAssetId: $coin.coinId,
						}
					},
				}
			},
		})({
				marketCap: (coinTimestamp) => coinTimestamp.marketCap,
				marketCapUsd: (coinTimestamp) => coinTimestamp.marketCapUsd,
				change24hPercent: (coinTimestamp) => coinTimestamp.change24hPercent,
				transport: (coinTimestamp) => coinTimestamp.transport,
				providerAssetId: (coinTimestamp) => coinTimestamp.providerAssetId,
			}),
		defineResolver(Source.Blockscout_Rest, {
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async (entitySelector) => {
						const stats = await blockscoutStatsForChain(chainIdFromEvmNetworkId(entitySelector))
						if (stats == null)
							throw new Error(`Blockscout_Rest: no stats for chain ${chainIdFromEvmNetworkId(entitySelector)}`)

						return blockscoutCountFromDecimalString(
							stats.total_transactions,
							'total_transactions'
						)
					},
				}
			},
		})({
				Evm: {
					$$transactions: {
						resolveCount: (count) => count,
					},
				},
			}),

		defineResolver(Source.Blockscout_Rest, {
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async (entitySelector) => {
							const stats = await blockscoutStatsForChain(chainIdFromEvmNetworkId(entitySelector))
							if (stats == null)
							throw new Error(`Blockscout_Rest: no stats for chain ${chainIdFromEvmNetworkId(entitySelector)}`)

							return blockscoutCountFromDecimalString(
								stats.total_blocks,
								'total_blocks'
						)
					},
				}
			},
		})({
				Evm: {
					$$blocks: {
						resolveCount: (count) => count,
					},
				},
			}),

		defineResolver(Source.Blockscout_Rest, {
			entityType: EntityType.EvmNetworkAccount,
			resolve: {
				EvmNetworkEvmAccount: {
					resolve: async ({ $actor, $network }) => {
						const { getAddressCounters } = await import('$/sources/Blockscout/Rest/queries.ts')
						const client = blockscoutRestClient(
							chainIdFromEvmNetworkId($network)
						)
						const address = hexLowerOfByteSize($actor.address, 20)
						if (address == null)
							throw new Error('Blockscout_Rest: EvmNetworkAccount wallet address not normalized')

						return blockscoutCountFromDecimalString(
							(await client.query(getAddressCounters, {
								address,
							})).transactions_count,
							'transactions_count'
						)
					},
				}
			},
		})({
				$$transactions: {
					resolveCount: (count) => count,
				},
			}),

		defineResolver(Source.Blockscout_Rest, {
			entityType: EntityType.EvmNetworkAccount,
			resolve: {
				EvmNetworkEvmAccount: {
					resolve: async ({ $actor, $network }) => {
						const { getAddressCounters } = await import('$/sources/Blockscout/Rest/queries.ts')
						const client = blockscoutRestClient(chainIdFromEvmNetworkId($network))
						const address = hexLowerOfByteSize($actor.address, 20)
						if (address == null)
							throw new Error('Blockscout_Rest: EvmNetworkAccount wallet address not normalized')

						return blockscoutCountFromDecimalString(
							(await client.query(getAddressCounters, {
								address,
							})).token_transfers_count,
							'token_transfers_count'
						)
					},
				}
			},
		})({
				$$tokenTransfers: {
					resolveCount: (count) => count,
				},
			}),

		defineResolver(Source.Blockscout_Rest, {
			entityType: EntityType.EvmBlock,
			resolve: {
				EvmNetworkBlockNumber: {
					resolve: async ({ $network, blockNumber }) => {
						const { getBlockByNumber } = await import('$/sources/Blockscout/Rest/queries.ts')
						const client = blockscoutRestClient(chainIdFromEvmNetworkId($network))
						const header = await client.query(getBlockByNumber, {
							blockNumber: blockNumber,
						})
						if (header == null)
							throw new Error('Blockscout_Rest: block header not returned for EvmBlock count')
						if (header.transactions == null)
							throw new Error('Blockscout_Rest: block header missing transaction count')

						return header.transactions.length
					},
				}
			},
		})({
				$$transactions: {
					resolveCount: (count) => count,
				},
			}),
		defineResolver(Source.Blockscout_Rest, {
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async (entitySelector, context) => {
						const {
							blockscoutV2ItemsCountMax,
						} = await import('$/sources/Blockscout/Rest/constants.ts')
						const limit = Math.min(
							resolverContextRowLimit(context),
							blockscoutV2ItemsCountMax
						)
						const { getBlocks } = await import('$/sources/Blockscout/Rest/queries.ts')
						const client = blockscoutRestClient(chainIdFromEvmNetworkId(entitySelector))
						const wires = await client.query(getBlocks, {
							limit,
						})
						return (
							wires.flatMap((wire) => {
							const height = evmRpcQuantityToBigInt(wire.number)
							const blockNumber = (
								height != null && height >= 0n ?
									height
								:
									null
							)
							if (blockNumber == null)
								return []
							return [
								{
									[EntityMetaKey.Selector]: {
										$network: evmNetworkIdFromChainId(chainIdFromEvmNetworkId(entitySelector)),
										blockNumber,
									},
								} satisfies Entity<typeof schema, EntityType.EvmBlock>,
							]
							})
						)
					},
				}
			},
		})({
				Evm: {
					$$blocks: (entity) => entity,
				},
			}),

		defineResolver(Source.Blockscout_Rest, {
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async (entitySelector, context) => {
							const {
								blockscoutV2ItemsCountMax,
							} = await import('$/sources/Blockscout/Rest/constants.ts')
							const limit = Math.min(
								resolverContextRowLimit(context),
								blockscoutV2ItemsCountMax
						)
							const { getTransactions } = await import('$/sources/Blockscout/Rest/queries.ts')
							const client = blockscoutRestClient(chainIdFromEvmNetworkId(entitySelector))
							const wires = await client.query(getTransactions, {
								limit,
							})
							return (
								wires
									.flatMap((wire) => {
								const txHash = wire.hash != null ?
									hexLowerOfByteSize(wire.hash, 32)
								:
									undefined

								return (
									txHash == null ?
										[]
									:
										[{
											[EntityMetaKey.Selector]: {
												$network: evmNetworkIdFromChainId(chainIdFromEvmNetworkId(entitySelector)),
												txHash,
											},
										}]
								)
									})
							)
					},
				}
			},
		})({
				Evm: {
					$$transactions: (entity) => entity,
				},
			}),

		defineResolver(Source.Blockscout_Rest, {
			entityType: EntityType.EvmNetworkAccount,
			resolve: {
				EvmNetworkEvmAccount: {
					resolve: async ({ $actor, $network }, context) => {
							const {
								blockscoutV2ItemsCountMax,
							} = await import('$/sources/Blockscout/Rest/constants.ts')
							const limit = Math.min(
								resolverContextRowLimit(context),
								blockscoutV2ItemsCountMax
						)
							const { getAddressTransactions } = await import('$/sources/Blockscout/Rest/queries.ts')
							const client = blockscoutRestClient(chainIdFromEvmNetworkId($network))
							const address = hexLowerOfByteSize($actor.address, 20)
							if (address == null)
								throw new Error('Blockscout_Rest: EvmNetworkAccount wallet address not normalized')
							const wires = await client.query(getAddressTransactions, {
								address,
								limit,
							})
							return (
								wires
									.flatMap((wire) => {
								const txHash = wire.hash != null ?
									hexLowerOfByteSize(wire.hash, 32)
								:
									undefined

								return (
									txHash == null ?
										[]
									:
										[{
											[EntityMetaKey.Selector]: {
												$network: evmNetworkIdFromChainId(chainIdFromEvmNetworkId($network)),
												txHash,
											},
										}]
								)
									})
							)
					},
				}
			},
		})({
				$$transactions: (entity) => entity,
			}),

		defineResolver(Source.Blockscout_Rest, {
			entityType: EntityType.EvmNetworkAccount,
			resolve: {
				EvmNetworkEvmAccount: {
					resolve: async ({ $actor, $network }, context) => {
							const {
								blockscoutV2ItemsCountMax,
							} = await import('$/sources/Blockscout/Rest/constants.ts')
							const {
								getAddressTokenTransfers,
							} = await import('$/sources/Blockscout/Rest/queries.ts')
							const limit = Math.min(
								resolverContextRowLimit(context),
								blockscoutV2ItemsCountMax
						)
							const client = blockscoutRestClient(chainIdFromEvmNetworkId($network))
							const address = hexLowerOfByteSize($actor.address, 20)
							if (address == null)
								throw new Error('Blockscout_Rest: EvmNetworkAccount wallet address not normalized')
							const wires = await client.query(getAddressTokenTransfers, {
								address,
								limit,
							})
							return (
								await evmTokenTransferEntitiesFromBlockscoutAddressWires({
									$network: $network,
									client,
									wires,
								})
							)
					},
				}
			},
		})({
				$$tokenTransfers: (entity) => entity.map(evmTokenTransferReference),
			}),

		defineResolver(Source.Blockscout_Rest, {
			entityType: EntityType.EvmNetworkAccount,
			resolve: {
				EvmNetworkEvmAccount: {
					resolve: async ({ $actor, $network }, context) => {
						const {
							blockscoutV2ItemsCountMax,
						} = await import('$/sources/Blockscout/Rest/constants.ts')
						const {
							getAddressInternalTransactions,
						} = await import('$/sources/Blockscout/Rest/queries.ts')
						const limit = Math.min(
							resolverContextRowLimit(context),
							blockscoutV2ItemsCountMax
						)
						const client = blockscoutRestClient(chainIdFromEvmNetworkId($network))
						const address = hexLowerOfByteSize($actor.address, 20)
						if (address == null)
							throw new Error('Blockscout_Rest: EvmNetworkAccount wallet address not normalized')
						const wires = await client.query(getAddressInternalTransactions, {
							address,
							limit,
						})
						return evmInternalTransferEntitiesFromBlockscoutAddressWires({
							$network: $network,
							wires,
						})
					},
				}
			},
		})({
				$$internalTransfers: (entity) => entity.map(evmInternalTransferReference),
			}),

		defineResolver(Source.Blockscout_Rest, {
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async (entitySelector, context) => {
						const {
							blockscoutV2ItemsCountMax,
						} = await import('$/sources/Blockscout/Rest/constants.ts')
						const {
							getTransactionLogs,
							getTokenTransfers,
						} = await import('$/sources/Blockscout/Rest/queries.ts')
						const chainId = chainIdFromEvmNetworkId(entitySelector)
						const client = blockscoutRestClient(chainId)
						const limit = Math.min(
							resolverContextRowLimit(context),
							blockscoutV2ItemsCountMax
						)
						const wiresByTxHash = Object.groupBy(
							await client.query(getTokenTransfers, {
								limit: blockscoutV2ItemsCountMax,
							}),
							(wire) => wire.transaction_hash ?? ''
						)
						const tokenTransfers = (
							await Promise.all(
								Object.entries(wiresByTxHash).flatMap(([rawTxHash, wires]) => {
									const txHash = hexLowerOfByteSize(rawTxHash, 32)
									return txHash == null ?
										[]
									:
										[(
											client.query(getTransactionLogs, {
												txHash,
											})
												.then((receiptLogs) => evmTokenTransferEntitiesFromBlockscoutWires({
									$network: entitySelector,
									txHash,
									receiptLogs,
									wires,
												}))
												.catch(() => [])
										)]
								})
							)
						).flat()
						return {
							erc20: tokenTransfers
								.filter((tokenTransfer) => tokenTransfer.standard === EvmTokenStandard.Erc20)
								.slice(0, limit),
							nft: tokenTransfers
								.filter((tokenTransfer) => (
									tokenTransfer.standard === EvmTokenStandard.Erc721
									|| tokenTransfer.standard === EvmTokenStandard.Erc1155
								))
								.slice(0, limit),
						}
					},
				}
			},
		})({
			Evm: {
				$$erc20TokenTransfers: (snapshot) => snapshot.erc20.map(evmTokenTransferReference),
				$$nftTokenTransfers: (snapshot) => snapshot.nft.map(evmTokenTransferReference),
			},
		}),

		defineResolver(Source.Blockscout_Rest, {
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async (entitySelector, context) => {
						const {
							blockscoutV2ItemsCountMax,
						} = await import('$/sources/Blockscout/Rest/constants.ts')
						const limit = Math.min(
							resolverContextRowLimit(context),
							blockscoutV2ItemsCountMax
						)
						const {
							normalizeAddressFromContractListWire,
							getSmartContracts,
						} = await import('$/sources/Blockscout/Rest/queries.ts')
						const client = blockscoutRestClient(chainIdFromEvmNetworkId(entitySelector))
						const smartContracts = await client.query(getSmartContracts, {
							limit,
						})
						const entities = (
							smartContracts
								.flatMap((w) => {
								const address = normalizeAddressFromContractListWire(w)
								return address == null ?
									[]
								:
									[{
										[EntityMetaKey.Selector]: {
											$network: evmNetworkIdFromChainId(chainIdFromEvmNetworkId(entitySelector)),
											address,
										},
									} satisfies Entity<typeof schema, EntityType.EvmContract>]
								})
						)
						return entities
					},
				}
			},
		})({
				Evm: {
					$$contracts: (entity) => entity,
				},
			}),

		defineResolver(Source.Blockscout_Rest, {
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async (entitySelector, context) => {
						const {
							blockscoutErc4337OperationSupportByChainId,
							blockscoutV2ItemsCountMax,
						} = await import('$/sources/Blockscout/Rest/constants.ts')
						const chainId = chainIdFromEvmNetworkId(entitySelector)
						if (blockscoutErc4337OperationSupportByChainId[chainId] == null)
							return []

						const limit = Math.min(
							resolverContextRowLimit(context),
							blockscoutV2ItemsCountMax
						)
						const { getErc4337SmartAccountList } = await import('$/sources/Blockscout/Rest/queries.ts')
						const client = blockscoutAccountAbstractionClient(chainId)
						const wires = await client.query(getErc4337SmartAccountList, {
							limit,
						})
						return erc4337RegistryEntitiesFromBlockscoutWires<EntityType.Erc4337SmartAccount>({
							chainId,
							items: wires,
						})
					},
				}
			},
		})({
				Evm: {
					$$erc4337SmartAccounts: (entity) => entity,
				},
			}),

		defineResolver(Source.Blockscout_Rest, {
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async (entitySelector, context) => {
						const {
							blockscoutErc4337RegistryListSupportByChainId,
							blockscoutV2ItemsCountMax,
						} = await import('$/sources/Blockscout/Rest/constants.ts')
						const chainId = chainIdFromEvmNetworkId(entitySelector)
						if (blockscoutErc4337RegistryListSupportByChainId[chainId] == null)
							return []

						const limit = Math.min(
							resolverContextRowLimit(context),
							blockscoutV2ItemsCountMax
						)
						const { getErc4337BundlerList } = await import('$/sources/Blockscout/Rest/queries.ts')
						const client = blockscoutAccountAbstractionClient(chainId)
						let wires: BlockscoutErc4337RegistryEntry[]
						try {
							wires = await client.query(getErc4337BundlerList, {
								limit,
							})
						} catch {
							return []
						}
						return erc4337RegistryEntitiesFromBlockscoutWires<EntityType.Erc4337Bundler>({
							chainId,
							items: wires,
						})
					},
				}
			},
		})({
				Evm: {
					$$erc4337Bundlers: (entity) => entity,
				},
			}),

		defineResolver(Source.Blockscout_Rest, {
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async (entitySelector, context) => {
						const {
							blockscoutErc4337RegistryListSupportByChainId,
							blockscoutV2ItemsCountMax,
						} = await import('$/sources/Blockscout/Rest/constants.ts')
						const chainId = chainIdFromEvmNetworkId(entitySelector)
						if (blockscoutErc4337RegistryListSupportByChainId[chainId] == null)
							return []

						const limit = Math.min(
							resolverContextRowLimit(context),
							blockscoutV2ItemsCountMax
						)
						const { getErc4337PaymasterList } = await import('$/sources/Blockscout/Rest/queries.ts')
						const client = blockscoutAccountAbstractionClient(chainId)
						let wires: BlockscoutErc4337RegistryEntry[]
						try {
							wires = await client.query(getErc4337PaymasterList, {
								limit,
							})
						} catch {
							return []
						}
						return erc4337RegistryEntitiesFromBlockscoutWires<EntityType.Erc4337Paymaster>({
							chainId,
							items: wires,
						})
					},
				}
			},
		})({
				Evm: {
					$$erc4337Paymasters: (entity) => entity,
				},
			}),

		defineResolver(Source.Blockscout_Rest, {
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async (entitySelector, context) => {
						const {
							blockscoutErc4337RegistryListSupportByChainId,
							blockscoutV2ItemsCountMax,
						} = await import('$/sources/Blockscout/Rest/constants.ts')
						const chainId = chainIdFromEvmNetworkId(entitySelector)
						if (blockscoutErc4337RegistryListSupportByChainId[chainId] == null)
							return []

						const limit = Math.min(
							resolverContextRowLimit(context),
							blockscoutV2ItemsCountMax
						)
						const { getErc4337AccountFactoryList } = await import('$/sources/Blockscout/Rest/queries.ts')
						const client = blockscoutAccountAbstractionClient(chainId)
						let wires: BlockscoutErc4337RegistryEntry[]
						try {
							wires = await client.query(getErc4337AccountFactoryList, {
								limit,
							})
						} catch {
							return []
						}
						return erc4337RegistryEntitiesFromBlockscoutWires<EntityType.Erc4337AccountFactory>({
							chainId,
							items: wires,
						})
					},
				}
			},
		})({
				Evm: {
					$$erc4337AccountFactories: (entity) => entity,
				},
			}),

		defineResolver(Source.Blockscout_Rest, {
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async (entitySelector, context) => {
						const {
							blockscoutErc4337OperationSupportByChainId,
							blockscoutV2ItemsCountMax,
						} = await import('$/sources/Blockscout/Rest/constants.ts')
						const chainId = chainIdFromEvmNetworkId(entitySelector)
						if (blockscoutErc4337OperationSupportByChainId[chainId] == null)
							return []

						const limit = Math.min(
							resolverContextRowLimit(context),
							blockscoutV2ItemsCountMax
						)
						const { getUserOperationsPage } = await import('$/sources/Blockscout/Rest/queries.ts')
						const client = blockscoutAccountAbstractionClient(chainId)
						const wires = await client.query(getUserOperationsPage, {
							limit,
						})
						const entities = (
							wires.flatMap((w) => {
							const hashRaw = w.hash != null ?
								hexLowerOfByteSize(w.hash, 32)
							:
								undefined

							return hashRaw == null ?
								[]
							:
								[{
									[EntityMetaKey.Selector]: {
										$network: evmNetworkIdFromChainId(chainId),
										hash: hashRaw,
									},
									[EntityMetaKey.Fields]: {
										[entityFieldAddressKey(EntityType.EvmUserOperation, [], 'successful')]: w.status,
										[entityFieldAddressKey(EntityType.EvmUserOperation, [], 'timestampMs')]: (
											w.timestamp == null ?
												undefined
											:
												((timestampMs) => Number.isFinite(timestampMs) ? timestampMs : undefined)(
													Date.parse(w.timestamp)
												)
										),
										[entityFieldAddressKey(EntityType.EvmUserOperation, [], 'fee')]: optionalNonemptyString(w.fee),
										[entityFieldAddressKey(EntityType.EvmUserOperation, [], 'nonce')]: undefined,
									},
								} satisfies Entity<typeof schema, EntityType.EvmUserOperation>]
							})
						)
						return entities
					},
				}
			},
		})({
				Evm: {
					$$userOperations: (entity) => entity,
				},
			}),

		defineResolver(Source.Blockscout_Rest, {
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
						resolve: async (entitySelector) => {
							const stats = await blockscoutStatsForChain(chainIdFromEvmNetworkId(entitySelector))
							if (stats == null) return []
							const observation = gasEstimateObservationFromBlockscoutStats(stats)
							if (observation == null) return []
							return [
							{
								[EntityMetaKey.Selector]: {
									$network: entitySelector,
									timestampMs: observation.timestampMs,
									source: Source.Blockscout_Rest,
								},
								[EntityMetaKey.Fields]: {
									...(observation.slowGwei != null && {
										[entityFieldAddressKey(EntityType.EvmNetwork_GasEstimate_Timestamp, [], 'slowGwei')]: observation.slowGwei,
									}),
									...(observation.averageGwei != null && {
										[entityFieldAddressKey(EntityType.EvmNetwork_GasEstimate_Timestamp, [], 'averageGwei')]: observation.averageGwei,
									}),
									...(observation.fastGwei != null && {
										[entityFieldAddressKey(EntityType.EvmNetwork_GasEstimate_Timestamp, [], 'fastGwei')]: observation.fastGwei,
									}),
									[entityFieldAddressKey(EntityType.EvmNetwork_GasEstimate_Timestamp, [], 'transport')]: observation.transport,
								},
							},
						]
					},
				}
			},
		})({
				Evm: {
					$$gasEstimateTimestamps: (entity) => entity,
				},
			}),

		defineResolver(Source.Blockscout_Rest, {
			entityType: EntityType.Coin,
			resolve: {
				CoinId: {
					resolve: async ({ coinId }) => {
						const stats = await blockscoutStatsForNativeCoinId(coinId)
						if (stats == null)
							throw new Error(`Blockscout_Rest: no native stats for coin ${coinId}`)
						const updatedAtMs = (
							stats.gas_price_updated_at != null ?
								Date.parse(stats.gas_price_updated_at)
							:
								NaN
						)
						if (!Number.isFinite(updatedAtMs))
							throw new Error(`Blockscout_Rest: Coin_Timestamp clock missing for coin ${coinId}`)
						return [
							{
								[EntityMetaKey.Selector]: {
									$coin: { coinId: coinId },
									timestampMs: updatedAtMs,
									source: Source.Blockscout_Rest,
								},
							},
						]
					},
				}
			},
		})({
				$$timestamps: (entity) => entity,
			}),

		defineResolver(Source.Blockscout_Rest, {
			entityType: EntityType.MarketPrice,
			resolve: {
				Market: {
					resolve: async ({ $market }) => {
						if ($market.marketKind !== MarketKind.Spot)
							return []
						const coinId = (
							$market.$base.kind === MarketAssetKind.Coin ?
								$market.$base.assetKey
							:
								undefined
						)
						if (coinId == null)
							return []
						if (!catalogCoinCurrencyMarketMatchesMarket(seededCoinSpotUsdMarketByCoinId[coinId], $market))
							return []
						const stats = await blockscoutStatsForNativeCoinId(coinId)
						const price = usdPriceStringToPrice1e8(stats?.coin_price)
						if (stats == null || price == null)
							return []
						const updatedAtMs = (
							stats.gas_price_updated_at != null ?
								Date.parse(stats.gas_price_updated_at)
							:
								NaN
						)
						if (!Number.isFinite(updatedAtMs))
							throw new Error(`Blockscout_Rest: no native USD quote stats clock for coin ${coinId}`)
						return [
							{
								[EntityMetaKey.Selector]: {
									$market: $market,
									timestampMs: updatedAtMs,
									feedKey: coinId,
								},
							},
						]
					},
				}
			},
		})({
				$$quotes: (entity) => entity,
			}),

		defineResolver(Source.Blockscout_Rest, {
			entityType: EntityType.EvmTransaction,
			resolve: {
				EvmNetworkTxHash: {
					resolve: async ({ $network, txHash }, context) => {
						const {
							blockscoutV2ItemsCountMax,
						} = await import('$/sources/Blockscout/Rest/constants.ts')
						const {
							getTransactionLogs,
							getTransactionTokenTransfers,
						} = await import('$/sources/Blockscout/Rest/queries.ts')
						const limit = Math.min(
							resolverContextRowLimit(context),
							blockscoutV2ItemsCountMax
						)
						const client = blockscoutRestClient(
							chainIdFromEvmNetworkId($network)
						)
						const wires = await client.query(getTransactionTokenTransfers, {
							txHash: txHash,
							limit,
						})
						return evmTokenTransferEntitiesFromBlockscoutWires({
							$network,
							txHash,
							receiptLogs: await client.query(getTransactionLogs, {
								txHash,
							}),
							wires,
						})
					},
				}
			},
		})({
				$$tokenTransfers: (entity) => entity.map(evmTokenTransferReference),
			}),

		defineResolver(Source.Blockscout_Rest, {
			entityType: EntityType.EvmTransaction,
			resolve: {
				EvmNetworkTxHash: {
					resolve: async ({ $network, txHash }, context) => {
						const {
							blockscoutV2ItemsCountMax,
						} = await import('$/sources/Blockscout/Rest/constants.ts')
						const { getTransactionInternalTransactions } = await import('$/sources/Blockscout/Rest/queries.ts')
						const limit = Math.min(
							resolverContextRowLimit(context),
							blockscoutV2ItemsCountMax
						)
						const client = blockscoutRestClient(
							chainIdFromEvmNetworkId($network)
						)
						const wires = await client.query(getTransactionInternalTransactions, {
							txHash: txHash,
							limit,
						})
						return (
							evmInternalTransferEntitiesFromBlockscoutWires({
								$network: $network,
								txHash: txHash,
								wires,
							})
						)
					},
				}
			},
		})({
				$$internalTransfers: (entity) => entity.map(evmInternalTransferReference),
			}),

		defineResolver(Source.Blockscout_Rest, {
			entityType: EntityType.EvmTransaction,
			resolve: {
				EvmNetworkTxHash: {
					resolve: async ({ $network, txHash }, context) => {
						const {
							blockscoutV2ItemsCountMax,
							blockscoutErc4337OperationSupportByChainId,
						} = await import('$/sources/Blockscout/Rest/constants.ts')
						if (blockscoutErc4337OperationSupportByChainId[chainIdFromEvmNetworkId($network)] == null)
							return []
						const limit = Math.min(
							resolverContextRowLimit(context),
							blockscoutV2ItemsCountMax
						)
						const { getUserOperationsByTransaction } = await import('$/sources/Blockscout/Rest/queries.ts')
						const client = blockscoutAccountAbstractionClient(
							chainIdFromEvmNetworkId($network)
						)
						const wires = await client.query(getUserOperationsByTransaction, {
							txHash: txHash,
							limit,
						})
						return (
							wires.flatMap((w) => {
							const hashRaw = w.hash != null ?
								hexLowerOfByteSize(w.hash, 32)
							:
								undefined

							return hashRaw == null ?
								[]
							:
								[{
									[EntityMetaKey.Selector]: {
										$network,
										hash: hashRaw,
									},
									[EntityMetaKey.Fields]: {
										[entityFieldAddressKey(EntityType.EvmUserOperation, [], 'successful')]: w.status,
										[entityFieldAddressKey(EntityType.EvmUserOperation, [], 'timestampMs')]: (
											w.timestamp == null ?
												undefined
											:
												((timestampMs) => Number.isFinite(timestampMs) ? timestampMs : undefined)(
													Date.parse(w.timestamp)
												)
										),
										[entityFieldAddressKey(EntityType.EvmUserOperation, [], 'fee')]: optionalNonemptyString(w.fee),
										[entityFieldAddressKey(EntityType.EvmUserOperation, [], 'nonce')]: undefined,
									},
								} satisfies Entity<typeof schema, EntityType.EvmUserOperation>]
							})
						)
					},
				}
			},
		})({
				$$userOperations: (entity) => entity,
			}),

		defineResolver(Source.Blockscout_Rest, {
			entityType: EntityType.EvmBlock,
			resolve: {
				EvmNetworkBlockNumber: {
					resolve: async ({ $network, blockNumber }, context) => {
							const {
								blockscoutV2ItemsCountMax,
							} = await import('$/sources/Blockscout/Rest/constants.ts')
							const limit = Math.min(
								resolverContextRowLimit(context),
								blockscoutV2ItemsCountMax
						)
							const { getBlockTransactions } = await import('$/sources/Blockscout/Rest/queries.ts')
							const client = blockscoutRestClient(chainIdFromEvmNetworkId($network))
							const wires = await client.query(getBlockTransactions, {
								blockNumber: blockNumber,
								limit,
							})
							return (
								wires
									.flatMap((w) => {
								const txHash = w.hash != null ?
									hexLowerOfByteSize(w.hash, 32)
								:
									undefined

								return txHash == null ?
									[]
								:
									[{
										[EntityMetaKey.Selector]: {
											$network: evmNetworkIdFromChainId(chainIdFromEvmNetworkId($network)),
											txHash,
										},
									}]
									})
							)
					},
				}
			},
		})({
				$$transactions: (entity) => entity,
			}),

		defineResolver(Source.Blockscout_Rest, {
			entityType: EntityType.EvmContract,
			resolve: {
				EvmNetworkAddress: {
					resolve: async ({ $network, address: addressSelector }) => {
						const { getAddressDetails } = await import('$/sources/Blockscout/Rest/queries.ts')
						const client = blockscoutRestClient(chainIdFromEvmNetworkId($network))
						const address = hexLowerOfByteSize(addressSelector, 20)
						if (address == null)
							throw new Error('Blockscout_Rest: address not normalized')
						const details = await client.query(getAddressDetails, {
							address,
						})
						const creator = details.creator_address_hash
						if (creator == null) return undefined
						const creatorAddress = hexLowerOfByteSize(creator, 20)
						if (creatorAddress == null) return undefined
						return {
							[EntityMetaKey.Selector]: {
								address: creatorAddress,
							},
						}
					},
				}
			},
		})({
				$deployer: (entity) => entity,
			}),

		defineResolver(Source.Blockscout_Rest, {
			entityType: EntityType.EvmContract,
			resolve: {
				EvmNetworkAddress: {
					resolve: async ({ $network, address: addressSelector }) => {
						const { getAddressDetails } = await import('$/sources/Blockscout/Rest/queries.ts')
						const client = blockscoutRestClient(chainIdFromEvmNetworkId($network))
						const address = hexLowerOfByteSize(addressSelector, 20)
						if (address == null)
							throw new Error('Blockscout_Rest: address not normalized')
						const details = await client.query(getAddressDetails, {
							address,
						})
						const txHash = details.creation_transaction_hash
						if (txHash == null) return undefined
						const normalized = hexLowerOfByteSize(txHash, 32)
						if (normalized == null) return undefined
						return {
							[EntityMetaKey.Selector]: {
								$network: $network,
								txHash: normalized,
							},
						}
					},
				}
			},
		})({
				$creationTransaction: (entity) => entity,
			}),

		defineResolver(Source.Blockscout_Rest, {
			entityType: EntityType.EvmContract,
			resolve: {
				EvmNetworkAddress: {
					resolve: async ({ $network, address: addressSelector }) => {
						const { getAddressDetails } = await import('$/sources/Blockscout/Rest/queries.ts')
						const client = blockscoutRestClient(chainIdFromEvmNetworkId($network))
						const address = hexLowerOfByteSize(addressSelector, 20)
						if (address == null)
							throw new Error('Blockscout_Rest: address not normalized')
						const details = await client.query(getAddressDetails, {
							address,
						})
						const implementationAddress = details.implementations?.[0]?.address_hash
						if (implementationAddress != null) {
							const normalized = hexLowerOfByteSize(implementationAddress, 20)
							if (normalized != null)
								return {
									[EntityMetaKey.Selector]: {
										$network: $network,
										address: normalized,
									},
								}
						}
						const { getContractSourceCodeRow } = await import('$/sources/Blockscout/Rest/queries.ts')
						const sourceRow = await blockscoutEtherscanClient(
								chainIdFromEvmNetworkId($network)
							).query(getContractSourceCodeRow, {
							address,
						})
						const legacyImplementation = sourceRow?.Implementation
						if (legacyImplementation == null || legacyImplementation === '') return undefined
						const normalized = hexLowerOfByteSize(legacyImplementation, 20)
						if (normalized == null) return undefined
						return {
							[EntityMetaKey.Selector]: {
								$network: $network,
								address: normalized,
							},
						}
					},
				}
			},
		})({
				$implementation: (entity) => entity,
			}),

		defineResolver(Source.Blockscout_Rest, {
			entityType: EntityType.EvmContract,
			resolve: {
				EvmNetworkAddress: {
					resolve: async ({ $network, address: addressSelector }) => {
						const { getContractAbiJsonString } = await import('$/sources/Blockscout/Rest/queries.ts')
						const client = blockscoutEtherscanClient(
							chainIdFromEvmNetworkId($network)
						)
						const address = hexLowerOfByteSize(addressSelector, 20)
						if (address == null)
							throw new Error('Blockscout_Rest: address not normalized')
						const abi = await client.query(getContractAbiJsonString, {
							address,
						})
						return abi == null ? undefined : evmAbiFromJsonString(abi)
					},
				}
			},
		})({
				abi: (entity) => entity,
			}),

		defineResolver(Source.Blockscout_Rest, {
			entityType: EntityType.EvmContract,
			resolve: {
				EvmNetworkAddress: {
					resolve: async ({ $network, address: addressSelector }) => {
						const { getCode } = await import('$/sources/Blockscout/Rest/queries.ts')
						const client = blockscoutRestClient(chainIdFromEvmNetworkId($network))
						const address = hexLowerOfByteSize(addressSelector, 20)
						if (address == null)
							throw new Error('Blockscout_Rest: address not normalized')
						const codeHex = await client.query(getCode, {
							address,
						})
						if (codeHex == null) return undefined
						return evmContractRuntimeCodeFromGetCodeHex(codeHex)
					},
				}
			},
		})({
				code: (entity) => entity,
			}),

		defineResolver(Source.Blockscout_Rest, {
			entityType: EntityType.EvmContract,
			resolve: {
				EvmNetworkAddress: {
					resolve: async ({ $network, address: addressSelector }) => {
						const { getCode } = await import('$/sources/Blockscout/Rest/queries.ts')
						const client = blockscoutRestClient(chainIdFromEvmNetworkId($network))
						const address = hexLowerOfByteSize(addressSelector, 20)
						if (address == null)
							throw new Error('Blockscout_Rest: address not normalized')
						const codeHex = await client.query(getCode, {
							address,
						})
						if (codeHex == null) return undefined
						return evmContractBytecodeHashFromGetCodeHex(codeHex)
					},
				}
			},
		})({
				codeHash: (entity) => entity,
			}),

		defineResolver(Source.Blockscout_Rest, {
			entityType: EntityType.EvmContract,
			resolve: {
				EvmNetworkAddress: {
					resolve: async ({ $network, address: addressSelector }, context) => {
						const { getStorageAt } = await import('$/sources/Blockscout/Rest/queries.ts')
						const client = blockscoutRestClient(chainIdFromEvmNetworkId($network))
						const address = hexLowerOfByteSize(addressSelector, 20)
						if (address == null)
							throw new Error('Blockscout_Rest: EvmContract address not normalized')
						const depth = Math.min(32, Math.max(1, resolverContextRowLimit(context)))
						return evmContractStorageSlotReadsFromEthGetStorageAt({
							address,
							depth,
							getStorageAt: (slotQuantityHex) => (
								client.query(getStorageAt, {
									address,
									slotQuantityHex,
								}).then((valueHex) => {
								if (valueHex == null) throw new Error('Blockscout_Rest: eth_getStorageAt returned no result')
								return valueHex
								})
							),
						})
					},
				}
			},
		})({
				storageSlotReads: (entity) => entity,
			}),
	],
}
