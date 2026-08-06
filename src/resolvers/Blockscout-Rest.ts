import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import { keccak256, toHex } from '@tevm/voltaire/Hash'
import { toBytes } from '@tevm/voltaire/Hex'
import { evmAbiFromJsonString } from '$/lib/evmAbi.ts'
import { optionalNonemptyString } from '$/lib/string.ts'
import { hexLowerOfByteSize, with0xHex, zeroExLowerCase } from '$/lib/hexLowerOfByteSize.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import {
	evmChainIdFromNetworkSelector,
	evmNetworkSelectorFromChainId,
} from '$/resolvers/evm.ts'
import { isSeededCoinCurrencyMarket } from '$/resolvers/market.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import type { Entity, EntityReferenceValue, EntitySelector } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import {
	blockscoutGenericReadChainIds,
	blockscoutAccountAbstractionChainIds,
} from '$/sources/Blockscout/Rest/queries.ts'
import { Source } from '$/sources/Source.ts'
import {
	EvmInternalCallType,
	EvmTokenStandard,
	EvmTransactionEnvelopeType,
	EvmTransactionExecutionStatus,
	EvmTransactionKind,
} from '$/constants/Evm.ts'
import { CoinId } from '$/constants/Coin.ts'
import { CoinInstanceType } from '$/schema/CoinInstanceType.ts'
import type {
	BlockscoutAddress,
	BlockscoutInternalTransaction,
	BlockscoutErc4337RegistryEntry,
	BlockscoutStats,
	BlockscoutTokenTransfer,
	BlockscoutTransactionLog,
	BlockscoutUserOperationListItem,
} from '$/sources/Blockscout/Rest/types.ts'

type EvmNetworkId = EntitySelector<typeof schema, EntityType.Network>

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
		if (slotNormalized == null || value == null)
			continue

		storageSlots.push({
			slot: slotNormalized,
			value,
		})
	}
	return storageSlots
}

const nonnegativeIntegerFromWire = (
	raw: string | number | null | undefined
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
			: raw.startsWith('0x') || raw.startsWith('0X') ?
				Number.parseInt(raw, 16)
			:
				Number(raw)
		)
)

const blockscoutQuantityToBigInt = (
	raw: string | number | bigint | null | undefined
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

const blockscoutQuantityToBigIntStrict = (
	raw: string | null | undefined
) => (
	raw == null || raw === '' ?
		undefined
	:
		BigInt(raw)
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
	log: BlockscoutTransactionLog
) => {
	const address = hexLowerOfByteSize(log.address.hash, 20)
	const data = with0xHex(log.data)
	const topics = (
		log.topics
			.flatMap((topic) => {
				if (topic == null)
					return []

				const normalized = hexLowerOfByteSize(topic, 32)
				return normalized == null ? [] : [normalized]
			})
	)
	const blockNumber = nonnegativeIntegerFromWire(log.block_number)
	return {
		[EntityMetaKey.Selector]: entitySelector,
		$transaction: {
			[EntityMetaKey.Selector]: {
				$network: entitySelector.$transaction.$network,
				txHash: entitySelector.$transaction.txHash,
			},
		} satisfies Entity<typeof schema, EntityType.EvmTransaction>,
		...(blockNumber != null && {
			$block: {
				[EntityMetaKey.Selector]: {
					$network: entitySelector.$transaction.$network,
					blockNumber: BigInt(blockNumber),
				},
			} satisfies Entity<typeof schema, EntityType.EvmBlock>,
		}),
		$$topics: topics.map((hex) => ({
			[EntityMetaKey.Selector]: {
				hex,
			},
		} satisfies Entity<typeof schema, EntityType.EvmTopic>)),
		...(topics.at(0) != null && { topic0: topics.at(0) }),
		data,
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

const evmInternalTransferEntityFromWire = ({
	$network,
	txHash,
	wire,
}: {
	$network: EvmNetworkId
	txHash: string
	wire: BlockscoutInternalTransaction
}) => {
	const normalizedTxHash = hexLowerOfByteSize(txHash, 32)
	const internalIndex = wire.index
	if (normalizedTxHash == null || internalIndex < 0)
		return undefined

	const fromAddress = hexLowerOfByteSize(wire.from.hash, 20)
	const toAddress = hexLowerOfByteSize(wire.to?.hash ?? '', 20)
	const createdAddress = hexLowerOfByteSize(wire.created_contract?.hash ?? '', 20)
	const value = blockscoutQuantityToBigInt(wire.value) ?? 0n
	const callType = evmInternalCallTypeFromWire(wire.type)
	if (callType == null)
		return undefined

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
		success: wire.success,
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
	txHash: string
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
		const txHash = hexLowerOfByteSize(wire.transaction_hash, 32)
		if (txHash == null)
			continue

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

const indexInTransactionForBlockscoutLogIndex = (
	receiptLogs: readonly BlockscoutTransactionLog[],
	logIndex: number
): number | undefined => {
	const indexInTransaction = receiptLogs.findIndex((log) => log.index === logIndex)
	return indexInTransaction === -1 ? undefined : indexInTransaction
}

const evmTokenStandardFromBlockscoutWire = (
	wire: BlockscoutTokenTransfer
): EvmTokenStandard => (
	wire.token_type === 'ERC-721' ?
		EvmTokenStandard.Erc721
	: wire.token_type === 'ERC-1155' ?
		EvmTokenStandard.Erc1155
	:
		EvmTokenStandard.Erc20
)

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
	txHash: string
	receiptLogs: readonly BlockscoutTransactionLog[]
	wire: BlockscoutTokenTransfer
	transferIndex?: number
}) => {
	const normalizedTxHash = hexLowerOfByteSize(txHash, 32)
	const indexInTransaction = indexInTransactionForBlockscoutLogIndex(receiptLogs, wire.log_index)
	if (normalizedTxHash == null || indexInTransaction == null)
		return undefined

	const standard = evmTokenStandardFromBlockscoutWire(wire)
	const fromAddress = hexLowerOfByteSize(wire.from.hash, 20)
	const toAddress = hexLowerOfByteSize(wire.to.hash, 20)
	const tokenAddress = hexLowerOfByteSize(wire.token.address_hash, 20)
	const tokenId = (
		wire.token_type === 'ERC-721' || wire.token_type === 'ERC-1155' ?
			blockscoutQuantityToBigInt(wire.total?.token_id)
		:
			undefined
	)
	const amount = (
		wire.token_type === 'ERC-721' ?
			1n
		:
			blockscoutQuantityToBigInt(wire.total?.value) ?? 0n
	)
	const tokenDecimals = (
		wire.token_type !== 'ERC-721' && wire.total?.decimals != null && wire.total.decimals !== '' ?
			Number(wire.total.decimals)
		:
			wire.token.decimals != null && wire.token.decimals !== '' ?
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
		fromAddress,
		toAddress,
		tokenAddress,
		amount,
		tokenId,
		tokenSymbol: wire.token.symbol ?? undefined,
		tokenName: wire.token.name ?? undefined,
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
	txHash: string
	receiptLogs: readonly BlockscoutTransactionLog[]
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
					nonnegativeIntegerFromWire(previousWire.log_index)
					=== nonnegativeIntegerFromWire(wire.log_index)
				))
				.length,
			wire,
		})
		return entity == null ? [] : [entity]
	})
)

const evmTokenTransferEntitiesFromBlockscoutAddressWires = ({
	$network,
	chainId,
	wires,
}: {
	$network: EvmNetworkId
	chainId: number
	wires: readonly BlockscoutTokenTransfer[]
}) => {
	const wiresByTxHash = new Map<string, BlockscoutTokenTransfer[]>()
	for (const wire of wires) {
		const txHash = hexLowerOfByteSize(wire.transaction_hash, 32)
		if (txHash == null)
			continue

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
							receiptLogs: await (await import('$/sources/Blockscout/Rest/queries.ts')).getTransactionLogs({
								chainId,
								txHash: normalizedTxHash,
							}),
							wires: txWires,
						})
			})
	).then((transfers) => transfers.flat())
}

const findBlockscoutTokenTransferForEntitySelector = (
	wires: readonly BlockscoutTokenTransfer[],
	receiptLogs: readonly BlockscoutTransactionLog[],
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
		[entityFieldAddressKey(EntityType.EvmInternalTransfer, [], 'success')]: entity.success,
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
	raw: string | null | undefined
): bigint | undefined => {
	if (raw == null || raw === '')
		return undefined

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
	if (
		prices == null
		|| (
			prices.slow == null
			&& prices.average == null
			&& prices.fast == null
		)
	)
		return null

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
) => {
	const { getStats } = await import('$/sources/Blockscout/Rest/queries.ts')
	return getStats({ chainId })
}

const blockscoutStatsForNativeCoinId = async (
	coinId: string
) => {
	const { blockscoutNativeCoinOverrides } = await import('$/sources/Blockscout/Rest/constants.ts')
	for (const chainId of blockscoutGenericReadChainIds) {
		const nativeCoinId = (
			blockscoutNativeCoinOverrides.find((override) => override.chainId === chainId)?.nativeCoinId
			?? CoinId.ETH
		)
		if (nativeCoinId !== coinId)
			continue

		const stats = await blockscoutStatsForChain(chainId)
		if (stats != null)
			return stats
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

const blockscoutNativeCoinForChain = async (
	chainId: number
) => {
	const { blockscoutNativeCoinOverrides } = await import('$/sources/Blockscout/Rest/constants.ts')
	const { coinById } = await import('$/constants/Coin.ts')
	const nativeCoinId = (
		blockscoutNativeCoinOverrides.find((override) => override.chainId === chainId)?.nativeCoinId
		?? CoinId.ETH
	)
	const coin = coinById[nativeCoinId]
	if (coin == null || coin.symbol.trim() === '')
		throw new Error(`Blockscout_Rest: native coin missing for chain ${chainId}`)

	return {
		nativeCoinId,
		symbol: coin.symbol.toUpperCase(),
		decimals: 18,
	}
}

const blockscoutTipBlockObservationClock = async (
	chainId: number
) => {
	const { getBlocks } = await import('$/sources/Blockscout/Rest/queries.ts')
	const [tip] = await getBlocks({
		chainId,
		limit: 1,
	})
	if (tip == null || !Number.isSafeInteger(tip.height) || tip.height < 0)
		throw new Error('Blockscout_Rest: tip block missing for balance observation clock')

	const { getBlockByNumber } = await import('$/sources/Blockscout/Rest/queries.ts')
	const tipDetail = await getBlockByNumber({
		chainId,
		blockNumber: BigInt(tip.height),
	})
	const timestampMs = Math.floor(Date.parse(tipDetail.timestamp) / 1_000) * 1_000
	if (!Number.isFinite(timestampMs) || timestampMs < 0)
		throw new Error('Blockscout_Rest: tip block timestamp missing for balance observation clock')

	return {
		blockNumber: BigInt(tip.height),
		timestampMs,
	}
}

const blockscoutNativeBalanceObservation = ({
	actorCoin,
	value,
	blockNumber,
	blockTimestamp,
	exchangeRate,
}: {
	actorCoin: EntitySelector<typeof schema, EntityType.EvmNetworkActorCoinBalance>
	value: string
	blockNumber: number
	blockTimestamp: string
	exchangeRate?: string | null
}) => {
	if (!/^(0|[1-9][0-9]*)$/.test(value))
		throw new Error('Blockscout_Rest: native coin balance amount missing')
	if (!Number.isSafeInteger(blockNumber) || blockNumber < 0)
		throw new Error('Blockscout_Rest: native coin balance block missing')

	const timestampMs = Math.floor(Date.parse(blockTimestamp) / 1_000) * 1_000
	if (!Number.isFinite(timestampMs) || timestampMs < 0)
		throw new Error('Blockscout_Rest: native coin balance timestamp missing')

	const priceUsd = (
		exchangeRate == null || exchangeRate === '' ?
			undefined
		:
			Number(exchangeRate)
	)

	return {
		[EntityMetaKey.Selector]: {
			$actorCoin: actorCoin,
			timestampMs,
			source: Source.Blockscout_Rest,
		},
		balance: BigInt(value),
		blockNumber: BigInt(blockNumber),
		...(priceUsd != null && Number.isFinite(priceUsd) && {
			priceUsd,
		}),
	}
}

const blockscoutErc20BalanceObservation = ({
	actorCoin,
	value,
	blockNumber,
	timestampMs,
	exchangeRate,
}: {
	actorCoin: EntitySelector<typeof schema, EntityType.EvmNetworkActorCoinBalance>
	value: string
	blockNumber: bigint
	timestampMs: number
	exchangeRate?: string | null
}) => {
	if (!/^(0|[1-9][0-9]*)$/.test(value))
		throw new Error('Blockscout_Rest: ERC-20 balance amount missing')
	if (!Number.isSafeInteger(timestampMs) || timestampMs < 0)
		throw new Error('Blockscout_Rest: ERC-20 balance tip clock missing')

	const priceUsd = (
		exchangeRate == null || exchangeRate === '' ?
			undefined
		:
			Number(exchangeRate)
	)

	return {
		[EntityMetaKey.Selector]: {
			$actorCoin: actorCoin,
			timestampMs,
			source: Source.Blockscout_Rest,
		},
		balance: BigInt(value),
		blockNumber,
		...(priceUsd != null && Number.isFinite(priceUsd) && {
			priceUsd,
		}),
	}
}

const erc4337ContractField = (
	{ $network, address }:
		| EntitySelector<typeof schema, EntityType.Erc4337SmartAccount>
		| EntitySelector<typeof schema, EntityType.Erc4337Bundler>
		| EntitySelector<typeof schema, EntityType.Erc4337Paymaster>
		| EntitySelector<typeof schema, EntityType.Erc4337AccountFactory>
) => ({
	$contract: {
		[EntityMetaKey.Selector]: {
			$network,
			address,
		},
	} satisfies Entity<typeof schema, EntityType.EvmContract>,
})

const erc4337RegistryEntitiesFromBlockscoutWires = ({
	chainId,
	items,
}: {
	chainId: number
	items: readonly BlockscoutErc4337RegistryEntry[]
}) => (
	items.flatMap((smartContract) => {
		const address = hexLowerOfByteSize(smartContract.address.hash, 20)
		return address == null ?
			[]
		:
			[{
				[EntityMetaKey.Selector]: {
					$network: evmNetworkSelectorFromChainId(chainId),
					address,
				},
			}]
	})
)

const evmUserOperationReferenceFromBlockscoutWire = ({
	$network,
	wire,
}: {
	$network: EvmNetworkId
	wire: BlockscoutUserOperationListItem
}) => {
	const hash = hexLowerOfByteSize(wire.hash, 32)
	if (hash == null)
		return undefined

	const timestampMs = wire.timestamp == null ? undefined : Date.parse(wire.timestamp)
	const fee = optionalNonemptyString(wire.fee)
	return {
		[EntityMetaKey.Selector]: {
			$network,
			hash,
		},
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.EvmUserOperation, [], 'successful')]: wire.status,
			...(timestampMs != null && Number.isFinite(timestampMs) && {
				[entityFieldAddressKey(EntityType.EvmUserOperation, [], 'timestampMs')]: timestampMs,
			}),
			...(fee != null && {
				[entityFieldAddressKey(EntityType.EvmUserOperation, [], 'fee')]: fee,
			}),
		},
	}
}

const erc4337UserOperationsForAddressFilter = async ({
	$network,
	address,
	filter,
	context,
}: {
	$network: EvmNetworkId
	address: `0x${string}`
	filter: 'sender' | 'bundler' | 'paymaster' | 'factory'
	context: Parameters<typeof resolverContextRowLimit>[0]
}) => {
	const {
		blockscoutV2ItemsCountMax,
	} = await import('$/sources/Blockscout/Rest/constants.ts')
	const chainId = evmChainIdFromNetworkSelector($network)
	if (!blockscoutAccountAbstractionChainIds.has(chainId))
		return []

	const limit = Math.min(
		resolverContextRowLimit(context),
		blockscoutV2ItemsCountMax
	)
	const { getUserOperationsPage } = await import('$/sources/Blockscout/Rest/queries.ts')
	const wires = await getUserOperationsPage({
		chainId,
		limit,
		[filter]: address,
	})
	return wires.flatMap((wire) => {
		const reference = evmUserOperationReferenceFromBlockscoutWire({
			$network,
			wire,
		})
		return reference == null ? [] : [reference]
	})
}

export default {
	source: Source.Blockscout_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.EvmBlock,
			resolve: {
				EvmNetworkBlockNumber: {
					resolve: async ({ $network, blockNumber }) => {
						const { getBlockByNumber } = await import('$/sources/Blockscout/Rest/queries.ts')
						const chainId = evmChainIdFromNetworkSelector($network)
						const wire = await getBlockByNumber({
							chainId,
							blockNumber,
						})
						const parentBlockNumber = blockNumber > 0n ? blockNumber - 1n : undefined
						const blockHash = hexLowerOfByteSize(wire.hash, 32)
						if (blockHash == null)
							throw new Error('Blockscout_Rest: block missing hash for EvmBlock')

						const parentBlockHash = hexLowerOfByteSize(wire.parent_hash, 32)
						const miner = hexLowerOfByteSize(wire.miner.hash, 20)
						return {
							[EntityMetaKey.Selector]: {
								$network: evmNetworkSelectorFromChainId(chainId),
								blockNumber,
							},
							hash: blockHash,
							...(parentBlockHash != null && { parentHash: parentBlockHash }),
							blockNumber,
							timestamp: ((timestampMs) => (
								Number.isFinite(timestampMs) && timestampMs >= 0 ?
									timestampMs
								:
									undefined
							))(Math.floor(Date.parse(wire.timestamp) / 1_000) * 1_000),
							gasUsed: blockscoutQuantityToBigInt(wire.gas_used),
							gasLimit: blockscoutQuantityToBigInt(wire.gas_limit),
							baseFeePerGas: blockscoutQuantityToBigInt(wire.base_fee_per_gas),
							transactionCount: wire.transactions_count,
							...(parentBlockNumber != null && parentBlockHash != null && {
								$parent: {
									[EntityMetaKey.Selector]: {
										$network: evmNetworkSelectorFromChainId(chainId),
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
			transactionCount: (block) => block.transactionCount,
		}),

		defineResolver({
			entityType: EntityType.EvmTransaction,
			resolve: {
				EvmNetworkTxHash: {
					resolve: async ({ $network, txHash: txHashSelector }) => {
						const {
							getTransactionByHash,
							getTransactionLogs,
						} = await import('$/sources/Blockscout/Rest/queries.ts')
						const transaction = await getTransactionByHash({
							chainId: evmChainIdFromNetworkSelector($network),
							txHash: txHashSelector,
						})
						if (transaction == null)
							throw new Error('Blockscout_Rest: transaction hash is not valid')

						const networkChainId = evmChainIdFromNetworkSelector($network)
						const containingBlockNumber = blockscoutQuantityToBigInt(transaction.block_number)
						const txHash = hexLowerOfByteSize(transaction.hash, 32) ?? txHashSelector
						const from = hexLowerOfByteSize(transaction.from.hash, 20)
						const to = hexLowerOfByteSize(transaction.to.hash, 20)
						const envelopeType = evmTransactionEnvelopeTypeFromRpcTypeByte(
							nonnegativeIntegerFromWire(transaction.type)
						)
						const base = {
							[EntityMetaKey.Selector]: {
								$network: evmNetworkSelectorFromChainId(networkChainId),
								txHash,
							},
							...(containingBlockNumber != null && {
								$block: {
									[EntityMetaKey.Selector]: {
										$network: evmNetworkSelectorFromChainId(networkChainId),
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
							indexInBlock: nonnegativeIntegerFromWire(transaction.position),
							value: blockscoutQuantityToBigInt(transaction.value) ?? 0n,
							nonce: nonnegativeIntegerFromWire(transaction.nonce),
							input: with0xHex(transaction.raw_input),
							gas: blockscoutQuantityToBigIntStrict(transaction.gas_limit),
							gasPrice: blockscoutQuantityToBigIntStrict(transaction.gas_price),
							...(
								(
									envelopeType === EvmTransactionEnvelopeType.FeeMarket
									|| envelopeType === EvmTransactionEnvelopeType.Blob
									|| envelopeType === EvmTransactionEnvelopeType.SetCode
								) && {
									maxFeePerGas: blockscoutQuantityToBigIntStrict(transaction.max_fee_per_gas),
									maxPriorityFeePerGas: blockscoutQuantityToBigIntStrict(transaction.max_priority_fee_per_gas),
								}
							),
						}
							const receiptLogs = await getTransactionLogs({
								chainId: evmChainIdFromNetworkSelector($network),
								txHash,
						})
						const createdContractAddress = (
							transaction.created_contract != null ?
								hexLowerOfByteSize(transaction.created_contract.hash, 20)
							:
								undefined
						)
						return {
							...base,
							envelopeType,
							kind: evmTransactionKindFromSignedFields({
								value: base.value,
								toAddress: to,
								input: transaction.raw_input,
								createdContractAddress,
							}),
							...(transaction.status === 'ok' && { executionStatus: EvmTransactionExecutionStatus.Success }),
							...(transaction.status === 'error' && { executionStatus: EvmTransactionExecutionStatus.Failed }),
							...((gasUsed) => gasUsed != null && { gasUsed })(
								blockscoutQuantityToBigIntStrict(transaction.gas_used)
							),
							...((effectiveGasPrice) => effectiveGasPrice != null && { effectiveGasPrice })(
								blockscoutQuantityToBigIntStrict(transaction.gas_price)
							),
							...(transaction.created_contract != null && ((address) => (
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
								receiptLogs.flatMap((log, indexInTransaction) => {
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
						[entityFieldAddressKey(EntityType.EvmLog, [], 'data')]: log.data,
						...(log.$emitter != null && {
							[entityFieldAddressKey(EntityType.EvmLog, [], '$emitter')]: log.$emitter,
						}),
					},
				})),
				resolveCount: (transaction) => transaction.$$logs.length,
			},
		}),

		defineResolver({
			entityType: EntityType.EvmLog,
			resolve: {
				TransactionIndexInTransaction: {
					resolve: async (entitySelector) => {
						const { getTransactionLogs } = await import('$/sources/Blockscout/Rest/queries.ts')
						const logs = await getTransactionLogs({
							chainId: evmChainIdFromNetworkSelector(entitySelector.$transaction.$network),
							txHash: entitySelector.$transaction.txHash,
						})
						const log = logs.at(entitySelector.indexInTransaction)
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
			$emitter: (log) => log.$emitter,
			Event: {
				signatureHash: (log) => {
					if (log.topic0 == null)
						throw new Error('Blockscout_Rest: event log is missing topic 0')

					return log.topic0
				},
			},
		}),

		defineResolver({
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
						return evmTokenTransferEntitiesFromBlockscoutWires({
							$network: $transaction.$network,
							txHash: $transaction.txHash,
							receiptLogs: await getTransactionLogs({
								chainId: evmChainIdFromNetworkSelector($transaction.$network),
								txHash: $transaction.txHash,
							}),
							wires: await getTransactionTokenTransfers({
								chainId: evmChainIdFromNetworkSelector($transaction.$network),
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

		defineResolver({
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
						const wires = await getTransactionTokenTransfers({
							chainId: evmChainIdFromNetworkSelector(entitySelector.$log.$transaction.$network),
							txHash: entitySelector.$log.$transaction.txHash,
							limit: blockscoutV2ItemsCountMax,
						})
						const receiptLogs = await getTransactionLogs({
							chainId: evmChainIdFromNetworkSelector(entitySelector.$log.$transaction.$network),
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
				tokenId: (transfer) => {
					if (transfer.tokenId == null)
						throw new Error('Blockscout_Rest: NFT transfer is missing token ID')

					return transfer.tokenId
				},
			},
		}),

		defineResolver({
			entityType: EntityType.EvmCoinInstance,
			resolve: {
				NetworkTypeContract: {
					resolve: async ({ $contract, $network, type }) => {
						if (type !== CoinInstanceType.Erc20Token)
							throw new Error('Blockscout_Rest: EvmCoinInstance requires ERC-20 token contract selector')

						const chainId = evmChainIdFromNetworkSelector($network)
						const { getAddressDetails } = await import('$/sources/Blockscout/Rest/queries.ts')
						const detail = await getAddressDetails({
							chainId,
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
							coinId: `eip155:${chainId}/erc20:${$contract.address}`,
							...(token.name != null && { name: token.name }),
							symbol: token.symbol ?? $contract.address,
							decimals: Number(token.decimals ?? 0),
							...(token.icon_url != null && { iconUrl: token.icon_url }),
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

		defineResolver({
			entityType: EntityType.EvmInternalTransfer,
			resolve: {
				TransactionIndexInTransaction: {
					resolve: async (entitySelector) => {
						const {
							blockscoutV2ItemsCountMax,
						} = await import('$/sources/Blockscout/Rest/constants.ts')
						const { getTransactionInternalTransactions } = await import('$/sources/Blockscout/Rest/queries.ts')
						const wires = await getTransactionInternalTransactions({
							chainId: evmChainIdFromNetworkSelector(entitySelector.$transaction.$network),
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

		defineResolver({
			entityType: EntityType.Erc4337SmartAccount,
			resolve: {
				EvmNetworkAddress: {
					resolve: async (entitySelector) => erc4337ContractField(entitySelector),
				},
			},
		})({
			$contract: (account) => account.$contract,
		}),

		defineResolver({
			entityType: EntityType.Erc4337SmartAccount,
			resolve: {
				EvmNetworkAddress: {
					resolve: async (entitySelector) => {
						const { getErc4337SmartAccountDetail } = await import('$/sources/Blockscout/Rest/queries.ts')
						const wire = await getErc4337SmartAccountDetail({
							chainId: evmChainIdFromNetworkSelector(entitySelector.$network),
							address: entitySelector.address,
						})
						const factoryAddress = hexLowerOfByteSize(wire.factory?.hash ?? '', 20)
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

		defineResolver({
			entityType: EntityType.Erc4337SmartAccount,
			resolve: {
				EvmNetworkAddress: {
					resolve: async (entitySelector, context) => (
						erc4337UserOperationsForAddressFilter({
							$network: entitySelector.$network,
							address: entitySelector.address,
							filter: 'sender',
							context,
						})
					),
				},
			},
		})({
			$$userOperations: (entity) => entity,
		}),

		defineResolver({
			entityType: EntityType.Erc4337SmartAccount_Timestamp,
			resolve: {
				AccountTimestampMsSource: {
					resolve: async ({ $account, timestampMs, source }) => {
						if (source !== Source.Blockscout_Rest)
							throw new Error(`Blockscout_Rest: unsupported source ${source}`)
						const { getErc4337SmartAccountDetail } = await import('$/sources/Blockscout/Rest/queries.ts')

						return {
							$account,
							timestampMs,
							source,
							userOperationsCount: (await getErc4337SmartAccountDetail({
								chainId: evmChainIdFromNetworkSelector($account.$network),
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

		defineResolver({
			entityType: EntityType.Erc4337Bundler,
			resolve: {
				EvmNetworkAddress: {
					resolve: async (entitySelector) => erc4337ContractField(entitySelector),
				},
			},
		})({
			$contract: (bundler) => bundler.$contract,
		}),

		defineResolver({
			entityType: EntityType.Erc4337Bundler,
			resolve: {
				EvmNetworkAddress: {
					resolve: async (entitySelector) => {
						const { getErc4337BundlerDetail } = await import('$/sources/Blockscout/Rest/queries.ts')
						const wire = await getErc4337BundlerDetail({
							chainId: evmChainIdFromNetworkSelector(entitySelector.$network),
							address: entitySelector.address,
						})
						return {
							$$timestamps: [
								{
									[EntityMetaKey.Selector]: {
										$bundler: entitySelector,
										timestampMs: Date.now(),
										source: Source.Blockscout_Rest,
									},
									userOperationsCount: wire.total_ops,
								},
							],
						}
					},
				},
			},
		})({
			$$timestamps: (bundler) => bundler.$$timestamps.map((timestamp) => ({
				[EntityMetaKey.Selector]: timestamp[EntityMetaKey.Selector],
			})),
		}),

		defineResolver({
			entityType: EntityType.Erc4337Bundler,
			resolve: {
				EvmNetworkAddress: {
					resolve: async (entitySelector, context) => (
						erc4337UserOperationsForAddressFilter({
							$network: entitySelector.$network,
							address: entitySelector.address,
							filter: 'bundler',
							context,
						})
					),
				},
			},
		})({
			$$userOperations: (entity) => entity,
		}),

		defineResolver({
			entityType: EntityType.Erc4337Bundler_Timestamp,
			resolve: {
				BundlerTimestampMsSource: {
					resolve: async ({ $bundler, timestampMs, source }) => {
						if (source !== Source.Blockscout_Rest)
							throw new Error(`Blockscout_Rest: unsupported source ${source}`)
						const { getErc4337BundlerDetail } = await import('$/sources/Blockscout/Rest/queries.ts')

						return {
							$bundler,
							timestampMs,
							source,
							userOperationsCount: (await getErc4337BundlerDetail({
								chainId: evmChainIdFromNetworkSelector($bundler.$network),
								address: $bundler.address,
							})).total_ops,
						}
					},
				},
			},
		})({
			$bundler: (timestamp) => ({
				[EntityMetaKey.Selector]: timestamp.$bundler,
			}),
			timestampMs: (timestamp) => timestamp.timestampMs,
			source: (timestamp) => timestamp.source,
			userOperationsCount: (timestamp) => timestamp.userOperationsCount,
		}),

		defineResolver({
			entityType: EntityType.Erc4337Paymaster,
			resolve: {
				EvmNetworkAddress: {
					resolve: async (entitySelector) => erc4337ContractField(entitySelector),
				}
			},
		})({
			$contract: (paymaster) => paymaster.$contract,
		}),

		defineResolver({
			entityType: EntityType.Erc4337Paymaster,
			resolve: {
				EvmNetworkAddress: {
					resolve: async (entitySelector) => {
						const { getErc4337PaymasterDetail } = await import('$/sources/Blockscout/Rest/queries.ts')
						const wire = await getErc4337PaymasterDetail({
							chainId: evmChainIdFromNetworkSelector(entitySelector.$network),
							address: entitySelector.address,
						})
						return {
							$$timestamps: [
								{
									[EntityMetaKey.Selector]: {
										$paymaster: entitySelector,
										timestampMs: Date.now(),
										source: Source.Blockscout_Rest,
									},
									userOperationsCount: wire.total_ops,
								},
							],
						}
					},
				},
			},
		})({
			$$timestamps: (paymaster) => paymaster.$$timestamps.map((timestamp) => ({
				[EntityMetaKey.Selector]: timestamp[EntityMetaKey.Selector],
			})),
		}),

		defineResolver({
			entityType: EntityType.Erc4337Paymaster,
			resolve: {
				EvmNetworkAddress: {
					resolve: async (entitySelector, context) => (
						erc4337UserOperationsForAddressFilter({
							$network: entitySelector.$network,
							address: entitySelector.address,
							filter: 'paymaster',
							context,
						})
					),
				},
			},
		})({
			$$userOperations: (entity) => entity,
		}),

		defineResolver({
			entityType: EntityType.Erc4337Paymaster_Timestamp,
			resolve: {
				PaymasterTimestampMsSource: {
					resolve: async ({ $paymaster, timestampMs, source }) => {
						if (source !== Source.Blockscout_Rest)
							throw new Error(`Blockscout_Rest: unsupported source ${source}`)
						const { getErc4337PaymasterDetail } = await import('$/sources/Blockscout/Rest/queries.ts')

						return {
							$paymaster,
							timestampMs,
							source,
							userOperationsCount: (await getErc4337PaymasterDetail({
								chainId: evmChainIdFromNetworkSelector($paymaster.$network),
								address: $paymaster.address,
							})).total_ops,
						}
					},
				},
			},
		})({
			$paymaster: (timestamp) => ({
				[EntityMetaKey.Selector]: timestamp.$paymaster,
			}),
			timestampMs: (timestamp) => timestamp.timestampMs,
			source: (timestamp) => timestamp.source,
			userOperationsCount: (timestamp) => timestamp.userOperationsCount,
		}),

		defineResolver({
			entityType: EntityType.Erc4337AccountFactory,
			resolve: {
				EvmNetworkAddress: {
					resolve: async (entitySelector) => erc4337ContractField(entitySelector),
				},
			},
		})({
			$contract: (factory) => factory.$contract,
		}),

		defineResolver({
			entityType: EntityType.Erc4337AccountFactory,
			resolve: {
				EvmNetworkAddress: {
					resolve: async (entitySelector) => {
						const { getErc4337AccountFactoryDetail } = await import('$/sources/Blockscout/Rest/queries.ts')
						const wire = await getErc4337AccountFactoryDetail({
							chainId: evmChainIdFromNetworkSelector(entitySelector.$network),
							address: entitySelector.address,
						})
						return {
							$$timestamps: [
								{
									[EntityMetaKey.Selector]: {
										$factory: entitySelector,
										timestampMs: Date.now(),
										source: Source.Blockscout_Rest,
									},
									smartAccountsCount: wire.total_accounts,
								},
							],
						}
					},
				},
			},
		})({
			$$timestamps: (factory) => factory.$$timestamps.map((timestamp) => ({
				[EntityMetaKey.Selector]: timestamp[EntityMetaKey.Selector],
			})),
		}),

		defineResolver({
			entityType: EntityType.Erc4337AccountFactory,
			resolve: {
				EvmNetworkAddress: {
					resolve: async (entitySelector, context) => (
						erc4337UserOperationsForAddressFilter({
							$network: entitySelector.$network,
							address: entitySelector.address,
							filter: 'factory',
							context,
						})
					),
				},
			},
		})({
			$$userOperations: (entity) => entity,
		}),

		defineResolver({
			entityType: EntityType.Erc4337AccountFactory,
			resolve: {
				EvmNetworkAddress: {
					resolve: async (entitySelector, context) => {
						const {
							blockscoutV2ItemsCountMax,
						} = await import('$/sources/Blockscout/Rest/constants.ts')
						const chainId = evmChainIdFromNetworkSelector(entitySelector.$network)
						if (!blockscoutAccountAbstractionChainIds.has(chainId))
							return []

						const limit = Math.min(
							resolverContextRowLimit(context),
							blockscoutV2ItemsCountMax
						)
						const { getErc4337SmartAccountList } = await import('$/sources/Blockscout/Rest/queries.ts')
						return erc4337RegistryEntitiesFromBlockscoutWires({
							chainId,
							items: await getErc4337SmartAccountList({
								chainId,
								limit,
								factory: entitySelector.address,
							}),
						})
					},
				},
			},
		})({
			$$smartAccounts: (entity) => entity,
		}),

		defineResolver({
			entityType: EntityType.Erc4337AccountFactory_Timestamp,
			resolve: {
				FactoryTimestampMsSource: {
					resolve: async ({ $factory, timestampMs, source }) => {
						if (source !== Source.Blockscout_Rest)
							throw new Error(`Blockscout_Rest: unsupported source ${source}`)
						const { getErc4337AccountFactoryDetail } = await import('$/sources/Blockscout/Rest/queries.ts')

						return {
							$factory,
							timestampMs,
							source,
							smartAccountsCount: (await getErc4337AccountFactoryDetail({
								chainId: evmChainIdFromNetworkSelector($factory.$network),
								address: $factory.address,
							})).total_accounts,
						}
					},
				},
			},
		})({
			$factory: (timestamp) => ({
				[EntityMetaKey.Selector]: timestamp.$factory,
			}),
			timestampMs: (timestamp) => timestamp.timestampMs,
			source: (timestamp) => timestamp.source,
			smartAccountsCount: (timestamp) => timestamp.smartAccountsCount,
		}),

		defineResolver({
			entityType: EntityType.EvmUserOperation,
			resolve: {
				EvmNetworkHash: {
					resolve: async ({ $network, hash }) => {
						const {
							getUserOperationDetail,
						} = await import('$/sources/Blockscout/Rest/queries.ts')
						const wire = await getUserOperationDetail({
							chainId: evmChainIdFromNetworkSelector($network),
							hash,
						})
						const bundledTransactionHash = hexLowerOfByteSize(wire.transaction_hash, 32)
						const senderAddress = hexLowerOfByteSize(wire.sender.hash, 20)
						const paymasterAddress = hexLowerOfByteSize(wire.paymaster?.hash ?? '', 20)
						const bundlerAddress = hexLowerOfByteSize(wire.bundler.hash, 20)
						const entryPointAddress = hexLowerOfByteSize(wire.entry_point.hash, 20)
						const initCode = (
							wire.raw.init_code !== '0x' ?
								with0xHex(wire.raw.init_code)
							:
								undefined
						)
						const callData = (
							wire.raw.call_data !== '0x' ?
								with0xHex(wire.raw.call_data)
							:
								undefined
						)
						const paymasterAndData = (
							wire.raw.paymaster_and_data !== '0x' ?
								with0xHex(wire.raw.paymaster_and_data)
							:
								undefined
						)
						const signature = (
							wire.raw.signature !== '0x' ?
								with0xHex(wire.raw.signature)
							:
								undefined
						)
						const blockNumber = blockscoutQuantityToBigInt(wire.block_number)
						const timestampMs = (
							wire.timestamp != null ? ((time) => (
								Number.isFinite(time) && time >= 0 ? time : undefined
							))(Date.parse(wire.timestamp))
							:
								undefined
						)
						const fee = optionalNonemptyString(wire.fee)
						const nonce = blockscoutQuantityToBigInt(wire.nonce)
						const callGasLimit = blockscoutQuantityToBigInt(wire.call_gas_limit)
						const verificationGasLimit = blockscoutQuantityToBigInt(wire.verification_gas_limit)
						const preVerificationGas = blockscoutQuantityToBigInt(wire.pre_verification_gas)
						const maxFeePerGas = blockscoutQuantityToBigInt(wire.max_fee_per_gas)
						const maxPriorityFeePerGas = blockscoutQuantityToBigInt(wire.max_priority_fee_per_gas)
						const gas = blockscoutQuantityToBigInt(wire.gas)
						const gasUsed = blockscoutQuantityToBigInt(wire.gas_used)
						const gasPrice = blockscoutQuantityToBigInt(wire.gas_price)
						const entryPointVersion = optionalNonemptyString(wire.entry_point_version)
						const sponsorType = optionalNonemptyString(wire.sponsor_type)
						return {
							...(bundledTransactionHash != null && {
								$bundledTransaction: {
									[EntityMetaKey.Selector]: {
										$network,
										txHash: bundledTransactionHash,
									},
								} satisfies Entity<typeof schema, EntityType.EvmTransaction>,
							}),
							...(senderAddress != null && {
								$sender: {
									[EntityMetaKey.Selector]: {
										$network,
										address: senderAddress,
									},
								} satisfies Entity<typeof schema, EntityType.Erc4337SmartAccount>,
							}),
							...(paymasterAddress != null && {
								$paymaster: {
									[EntityMetaKey.Selector]: {
										$network,
										address: paymasterAddress,
									},
								} satisfies Entity<typeof schema, EntityType.Erc4337Paymaster>,
							}),
							...(bundlerAddress != null && {
								$bundler: {
									[EntityMetaKey.Selector]: {
										$network,
										address: bundlerAddress,
									},
								} satisfies Entity<typeof schema, EntityType.Erc4337Bundler>,
							}),
							...(entryPointAddress != null && {
								$entryPoint: {
									[EntityMetaKey.Selector]: {
										$network,
										address: entryPointAddress,
									},
								} satisfies Entity<typeof schema, EntityType.EvmContract>,
							}),
							...(blockNumber != null && {
								$block: {
									[EntityMetaKey.Selector]: {
										$network,
										blockNumber,
									},
								} satisfies Entity<typeof schema, EntityType.EvmBlock>,
							}),
							...(timestampMs != undefined && { timestampMs }),
							successful: wire.status,
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

		defineResolver({
			entityType: EntityType.Market_Timestamp,
			resolve: {
				MarketTimestampMsFeedKey: {
					resolve: async ({ $market, feedKey, timestampMs: timestampMsSelector }) => {
						if (!isSeededCoinCurrencyMarket($market))
							throw new Error('Blockscout_Rest: Market_Timestamp only supports catalog USD spot markets')

						const coinId = $market.$base.assetKey
						if (feedKey !== coinId)
							throw new Error('Blockscout_Rest: Market_Timestamp feedKey does not match catalog coin id')

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

		defineResolver({
			entityType: EntityType.EvmNetwork_GasEstimate_Timestamp,
			resolve: {
				NetworkTimestampMsSource: {
					resolve: async ({ $network, timestampMs, source }) => {
						if (source !== Source.Blockscout_Rest)
							throw new Error('Blockscout_Rest: EvmNetwork_GasEstimate_Timestamp selector source mismatch')

						const stats = await blockscoutStatsForChain(evmChainIdFromNetworkSelector($network))
						if (stats == null)
							throw new Error(
								`Blockscout_Rest: EvmNetwork_GasEstimate_Timestamp unsupported for chain ${String(evmChainIdFromNetworkSelector($network))}`
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
				},
			},
		})({
			slowGwei: (gasEstimate) => gasEstimate.slowGwei,
			averageGwei: (gasEstimate) => gasEstimate.averageGwei,
			fastGwei: (gasEstimate) => gasEstimate.fastGwei,
			transport: (gasEstimate) => gasEstimate.transport,
		}),

		defineResolver({
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
							if (raw == null || raw === '')
								return undefined

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

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async (entitySelector) => {
						const stats = await blockscoutStatsForChain(evmChainIdFromNetworkSelector(entitySelector))
						if (stats == null)
							throw new Error(`Blockscout_Rest: no stats for chain ${evmChainIdFromNetworkSelector(entitySelector)}`)

						return {
							transactionCount: blockscoutCountFromDecimalString(
								stats.total_transactions,
								'total_transactions'
							),
							blockCount: blockscoutCountFromDecimalString(
								stats.total_blocks,
								'total_blocks'
							),
						}
					},
				},
			},
		})({
			Evm: {
				$$transactions: {
					resolveCount: (counts) => counts.transactionCount,
				},
				$$blocks: {
					resolveCount: (counts) => counts.blockCount,
				},
			},
		}),

		defineResolver({
			entityType: EntityType.EvmNetworkAccount,
			resolve: {
				EvmNetworkEvmAccount: {
					resolve: async ({ $actor, $network }) => {
						const { getAddressCounters } = await import('$/sources/Blockscout/Rest/queries.ts')
						const address = hexLowerOfByteSize($actor.address, 20)
						if (address == null)
							throw new Error('Blockscout_Rest: EvmNetworkAccount wallet address not normalized')

						const counters = await getAddressCounters({
							chainId: evmChainIdFromNetworkSelector($network),
							address,
						})
						return {
							transactionCount: blockscoutCountFromDecimalString(
								counters.transactions_count,
								'transactions_count'
							),
							tokenTransferCount: blockscoutCountFromDecimalString(
								counters.token_transfers_count,
								'token_transfers_count'
							),
						}
					},
				},
			},
		})({
			$$transactions: {
				resolveCount: (counts) => counts.transactionCount,
			},
			$$tokenTransfers: {
				resolveCount: (counts) => counts.tokenTransferCount,
			},
		}),

		defineResolver({
			entityType: EntityType.EvmNetworkAccount,
			resolve: {
				EvmNetworkEvmAccount: {
					resolve: async ({ $actor, $network }) => {
						const {
							getAddressDetails,
							getAddressTokenBalances,
						} = await import('$/sources/Blockscout/Rest/queries.ts')
						const address = hexLowerOfByteSize($actor.address, 20)
						if (address == null)
							throw new Error('Blockscout_Rest: EvmNetworkAccount wallet address not normalized')

						const chainId = evmChainIdFromNetworkSelector($network)
						const [details, balances] = await Promise.all([
							getAddressDetails({
								chainId,
								address,
							}),
							getAddressTokenBalances({
								chainId,
								address,
							}),
						])

						type EvmNetworkActorCoinBalanceEntitySelector = EntitySelector<
							typeof schema,
							EntityType.EvmNetworkActorCoinBalance
						>

						const nativeBalance = details.coin_balance
						const ownedCoins: { [EntityMetaKey.Selector]: EvmNetworkActorCoinBalanceEntitySelector }[] = (
							nativeBalance != null && nativeBalance !== '' && /^(0|[1-9][0-9]*)$/.test(nativeBalance) ?
								[{
									[EntityMetaKey.Selector]: {
										$actor,
										$network,
									},
								}]
							:
								[]
						)

						for (const balance of balances) {
							if (balance.token == null)
								continue
							const tokenType = balance.token.type
							if (tokenType !== 'ERC-20' && tokenType !== 'ERC-404')
								continue
							const contractAddress = hexLowerOfByteSize(balance.token.address_hash, 20)
							if (contractAddress == null)
								continue
							ownedCoins.push({
								[EntityMetaKey.Selector]: {
									$actor,
									$contract: {
										$network,
										address: contractAddress,
									},
								},
							})
						}

						return ownedCoins
					},
				},
			},
		})({
			$$ownedCoins: (ownedCoins) => ownedCoins,
		}),

		defineResolver({
			entityType: EntityType.EvmNetworkActorCoinBalance,
			resolve: {
				EvmAccountNativeCoinInstance: {
					resolve: async ({ $actor, $network }) => {
						const {
							getAddressCoinBalanceHistory,
							getAddressDetails,
						} = await import('$/sources/Blockscout/Rest/queries.ts')
						const {
							blockscoutV2ItemsCountMax,
						} = await import('$/sources/Blockscout/Rest/constants.ts')
						const address = hexLowerOfByteSize($actor.address, 20)
						if (address == null)
							throw new Error('Blockscout_Rest: native balance wallet address not normalized')

						const chainId = evmChainIdFromNetworkSelector($network)
						const [nativeCoin, details, history] = await Promise.all([
							blockscoutNativeCoinForChain(chainId),
							getAddressDetails({
								chainId,
								address,
							}),
							getAddressCoinBalanceHistory({
								chainId,
								address,
								limit: blockscoutV2ItemsCountMax,
							}),
						])

						const actorCoin = {
							$actor,
							$network,
						} satisfies EntitySelector<typeof schema, EntityType.EvmNetworkActorCoinBalance>

						const observations = (
							history.length > 0 ?
								history.map((item) => (
									blockscoutNativeBalanceObservation({
										actorCoin,
										value: item.value,
										blockNumber: item.block_number,
										blockTimestamp: item.block_timestamp,
										exchangeRate: details.exchange_rate,
									})
								))
							: details.coin_balance != null && details.coin_balance !== '' && details.block_number_balance_updated_at != null ?
								((clock) => [
									blockscoutNativeBalanceObservation({
										actorCoin,
										value: details.coin_balance!,
										blockNumber: details.block_number_balance_updated_at!,
										blockTimestamp: clock.timestamp,
										exchangeRate: details.exchange_rate,
									}),
								])(
									await (async () => {
										const { getBlockByNumber } = await import('$/sources/Blockscout/Rest/queries.ts')
										return getBlockByNumber({
											chainId,
											blockNumber: BigInt(details.block_number_balance_updated_at!),
										})
									})()
								)
							:
								[]
						)
						if (observations.length === 0)
							throw new Error('Blockscout_Rest: native coin balance observation missing')

						return {
							$network,
							$contract: undefined,
							$coinInstance: {
								[EntityMetaKey.Selector]: {
									$network,
									type: CoinInstanceType.NativeCurrency,
								},
							},
							symbol: nativeCoin.symbol,
							decimals: nativeCoin.decimals,
							$$timestamps: observations,
						}
					},
				},
				EvmAccountErc20CoinInstance: {
					resolve: async ({ $actor, $contract }) => {
						const { getAddressTokenBalances } = await import('$/sources/Blockscout/Rest/queries.ts')
						const address = hexLowerOfByteSize($actor.address, 20)
						if (address == null)
							throw new Error('Blockscout_Rest: ERC-20 balance wallet address not normalized')

						const chainId = evmChainIdFromNetworkSelector($contract.$network)
						const [balances, tipClock] = await Promise.all([
							getAddressTokenBalances({
								chainId,
								address,
							}),
							blockscoutTipBlockObservationClock(chainId),
						])
						const balance = balances.find((candidate) => {
							if (candidate.token == null)
								return false
							const tokenType = candidate.token.type
							if (tokenType !== 'ERC-20' && tokenType !== 'ERC-404')
								return false
							const contractAddress = hexLowerOfByteSize(candidate.token.address_hash, 20)
							return contractAddress === $contract.address
						})
						if (balance?.token == null)
							throw new Error('Blockscout_Rest: ERC-20 token balance missing')

						const symbol = balance.token.symbol?.trim()
						if (symbol == null || symbol === '')
							throw new Error('Blockscout_Rest: ERC-20 token symbol missing')
						const decimals = Number(balance.token.decimals ?? '')
						if (!Number.isSafeInteger(decimals) || decimals < 0)
							throw new Error('Blockscout_Rest: ERC-20 token decimals missing')

						const actorCoin = {
							$actor,
							$contract,
						} satisfies EntitySelector<typeof schema, EntityType.EvmNetworkActorCoinBalance>

						return {
							$network: $contract.$network,
							$contract,
							$coinInstance: {
								[EntityMetaKey.Selector]: {
									$network: $contract.$network,
									type: CoinInstanceType.Erc20Token,
									$contract,
								},
							},
							symbol: symbol.toUpperCase(),
							decimals,
							$$timestamps: [
								blockscoutErc20BalanceObservation({
									actorCoin,
									value: balance.value,
									blockNumber: tipClock.blockNumber,
									timestampMs: tipClock.timestampMs,
									exchangeRate: balance.token.exchange_rate,
								}),
							],
						}
					},
				},
			},
		})({
			$network: (balance) => ({
				[EntityMetaKey.Selector]: balance.$network,
			}),
			$contract: {
				parentSelectors: [
					'EvmAccountErc20CoinInstance',
				],
				select: (balance) => {
					if (balance.$contract == null)
						throw new Error('Blockscout_Rest: ERC-20 balance is missing contract')

					return {
						[EntityMetaKey.Selector]: balance.$contract,
					}
				},
			},
			$coinInstance: (balance) => balance.$coinInstance,
			symbol: (balance) => balance.symbol,
			decimals: (balance) => balance.decimals,
			$$timestamps: (balance) => balance.$$timestamps.map((timestamp) => ({
				[EntityMetaKey.Selector]: timestamp[EntityMetaKey.Selector],
			})),
		}),

		defineResolver({
			entityType: EntityType.EvmNetworkActorCoinBalance_Timestamp,
			resolve: {
				ActorCoinTimestampMsSource: {
					resolve: async ({
						$actorCoin,
						timestampMs,
						source,
					}) => {
						if (source !== Source.Blockscout_Rest)
							throw new Error(`Blockscout_Rest: unsupported balance observation source ${source}`)
						if (!Number.isSafeInteger(timestampMs) || timestampMs < 0)
							throw new Error('Blockscout_Rest: invalid balance observation timestamp')

						const isErc20 = '$contract' in $actorCoin
						const address = hexLowerOfByteSize($actorCoin.$actor.address, 20)
						if (address == null)
							throw new Error('Blockscout_Rest: balance observation wallet address not normalized')

						if (isErc20) {
							const { getAddressTokenBalances } = await import('$/sources/Blockscout/Rest/queries.ts')
							const chainId = evmChainIdFromNetworkSelector($actorCoin.$contract.$network)
							const [balances, tipClock] = await Promise.all([
								getAddressTokenBalances({
									chainId,
									address,
								}),
								blockscoutTipBlockObservationClock(chainId),
							])
							const balance = balances.find((candidate) => {
								if (candidate.token == null)
									return false
								const tokenType = candidate.token.type
								if (tokenType !== 'ERC-20' && tokenType !== 'ERC-404')
									return false
								const contractAddress = hexLowerOfByteSize(candidate.token.address_hash, 20)
								return contractAddress === $actorCoin.$contract.address
							})
							if (balance?.token == null)
								throw new Error('Blockscout_Rest: balance observation missing')

							const observation = blockscoutErc20BalanceObservation({
								actorCoin: {
									$actor: $actorCoin.$actor,
									$contract: $actorCoin.$contract,
								},
								value: balance.value,
								blockNumber: tipClock.blockNumber,
								timestampMs: tipClock.timestampMs,
								exchangeRate: balance.token.exchange_rate,
							})
							if (observation[EntityMetaKey.Selector].timestampMs !== timestampMs)
								throw new Error('Blockscout_Rest: balance observation timestamp does not match request')

							return observation
						}

						const {
							getAddressCoinBalanceHistory,
							getAddressDetails,
						} = await import('$/sources/Blockscout/Rest/queries.ts')
						const {
							blockscoutV2ItemsCountMax,
						} = await import('$/sources/Blockscout/Rest/constants.ts')
						const chainId = evmChainIdFromNetworkSelector($actorCoin.$network)
						const [details, history] = await Promise.all([
							getAddressDetails({
								chainId,
								address,
							}),
							getAddressCoinBalanceHistory({
								chainId,
								address,
								limit: blockscoutV2ItemsCountMax,
							}),
						])
						const actorCoin = {
							$actor: $actorCoin.$actor,
							$network: $actorCoin.$network,
						} satisfies EntitySelector<typeof schema, EntityType.EvmNetworkActorCoinBalance>

						const fromHistory = history.find((item) => (
							Math.floor(Date.parse(item.block_timestamp) / 1_000) * 1_000 === timestampMs
						))
						if (fromHistory != null) {
							return blockscoutNativeBalanceObservation({
								actorCoin,
								value: fromHistory.value,
								blockNumber: fromHistory.block_number,
								blockTimestamp: fromHistory.block_timestamp,
								exchangeRate: details.exchange_rate,
							})
						}

						if (
							details.coin_balance == null
							|| details.coin_balance === ''
							|| details.block_number_balance_updated_at == null
						)
							throw new Error('Blockscout_Rest: balance observation missing')

						const { getBlockByNumber } = await import('$/sources/Blockscout/Rest/queries.ts')
						const block = await getBlockByNumber({
							chainId,
							blockNumber: BigInt(details.block_number_balance_updated_at),
						})
						const observation = blockscoutNativeBalanceObservation({
							actorCoin,
							value: details.coin_balance,
							blockNumber: details.block_number_balance_updated_at,
							blockTimestamp: block.timestamp,
							exchangeRate: details.exchange_rate,
						})
						if (observation[EntityMetaKey.Selector].timestampMs !== timestampMs)
							throw new Error('Blockscout_Rest: balance observation timestamp does not match request')

						return observation
					},
				},
			},
		})({
			$actorCoin: (observation) => ({
				[EntityMetaKey.Selector]: observation[EntityMetaKey.Selector].$actorCoin,
			}),
			timestampMs: (observation) => observation[EntityMetaKey.Selector].timestampMs,
			source: (observation) => observation[EntityMetaKey.Selector].source,
			blockNumber: (observation) => observation.blockNumber,
			balance: (observation) => observation.balance,
			priceUsd: (observation) => observation.priceUsd,
		}),

		defineResolver({
			entityType: EntityType.EvmBlock,
			resolve: {
				EvmNetworkBlockNumber: {
					resolve: async ({ $network, blockNumber }) => {
						const { getBlockByNumber } = await import('$/sources/Blockscout/Rest/queries.ts')
						const wire = await getBlockByNumber({
							chainId: evmChainIdFromNetworkSelector($network),
							blockNumber,
						})
						return wire.transactions_count
					},
				}
			},
		})({
			$$transactions: {
				resolveCount: (count) => count,
			},
		}),

		defineResolver({
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
						const wires = await getBlocks({
							chainId: evmChainIdFromNetworkSelector(entitySelector),
							limit,
						})
						return (
							wires.flatMap((wire) => {
								const blockNumber = (
									Number.isSafeInteger(wire.height) && wire.height >= 0 ?
										BigInt(wire.height)
									:
										null
								)
								if (blockNumber == null)
									return []

								return [
									{
										[EntityMetaKey.Selector]: {
											$network: evmNetworkSelectorFromChainId(evmChainIdFromNetworkSelector(entitySelector)),
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

		defineResolver({
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
						const wires = await getTransactions({
							chainId: evmChainIdFromNetworkSelector(entitySelector),
							limit,
						})
						return (
							wires.flatMap((wire) => {
								const txHash = hexLowerOfByteSize(wire.hash, 32)

								return (
									txHash == null ?
										[]
									:
										[{
											[EntityMetaKey.Selector]: {
												$network: evmNetworkSelectorFromChainId(evmChainIdFromNetworkSelector(entitySelector)),
												txHash,
											},
										}]
								)
							})
						)
					},
				},
			},
		})({
			Evm: {
				$$transactions: (entity) => entity,
			},
		}),

		defineResolver({
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
						const address = hexLowerOfByteSize($actor.address, 20)
						if (address == null)
							throw new Error('Blockscout_Rest: EvmNetworkAccount wallet address not normalized')

						const wires = await getAddressTransactions({
							chainId: evmChainIdFromNetworkSelector($network),
							address,
							limit,
						})
						return (
							wires.flatMap((wire) => {
								const txHash = hexLowerOfByteSize(wire.hash, 32)

								return (
									txHash == null ?
										[]
									:
										[{
											[EntityMetaKey.Selector]: {
												$network: evmNetworkSelectorFromChainId(evmChainIdFromNetworkSelector($network)),
												txHash,
											},
										}]
								)
							})
						)
					},
				},
			},
		})({
			$$transactions: (entity) => entity,
		}),

		defineResolver({
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
						const address = hexLowerOfByteSize($actor.address, 20)
						if (address == null)
							throw new Error('Blockscout_Rest: EvmNetworkAccount wallet address not normalized')

						const wires = await getAddressTokenTransfers({
							chainId: evmChainIdFromNetworkSelector($network),
							address,
							limit,
						})
						return evmTokenTransferEntitiesFromBlockscoutAddressWires({
							$network,
							chainId: evmChainIdFromNetworkSelector($network),
							wires,
						})
					},
				},
			},
		})({
			$$tokenTransfers: (entity) => entity.map(evmTokenTransferReference),
		}),

		defineResolver({
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
						const address = hexLowerOfByteSize($actor.address, 20)
						if (address == null)
							throw new Error('Blockscout_Rest: EvmNetworkAccount wallet address not normalized')

						const wires = await getAddressInternalTransactions({
							chainId: evmChainIdFromNetworkSelector($network),
							address,
							limit,
						})
						return evmInternalTransferEntitiesFromBlockscoutAddressWires({
							$network,
							wires,
						})
					},
				},
			},
		})({
			$$internalTransfers: (entity) => entity.map(evmInternalTransferReference),
		}),

		defineResolver({
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
						const chainId = evmChainIdFromNetworkSelector(entitySelector)
						const limit = Math.min(
							resolverContextRowLimit(context),
							blockscoutV2ItemsCountMax
						)
						const wiresByTxHash = Map.groupBy(
							await getTokenTransfers({
								chainId,
								limit: blockscoutV2ItemsCountMax,
							}),
							(wire) => wire.transaction_hash
						)
						const tokenTransfers = (
							await Promise.all(
								[...wiresByTxHash.entries()].flatMap(([rawTxHash, wires]) => {
									const txHash = hexLowerOfByteSize(rawTxHash, 32)

									return txHash == null ?
										[]
									:
										[(
											getTransactionLogs({
												chainId,
												txHash,
											})
												.then((receiptLogs) => evmTokenTransferEntitiesFromBlockscoutWires({
													$network: entitySelector,
													txHash,
													receiptLogs,
													wires,
												}))
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
				},
			},
		})({
			Evm: {
				$$erc20TokenTransfers: (snapshot) => snapshot.erc20.map(evmTokenTransferReference),
				$$nftTokenTransfers: (snapshot) => snapshot.nft.map(evmTokenTransferReference),
			},
		}),

		defineResolver({
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
						const smartContracts = await getSmartContracts({
							chainId: evmChainIdFromNetworkSelector(entitySelector),
							limit,
						})
						return (
							smartContracts
								.flatMap((w) => {
									const address = normalizeAddressFromContractListWire(w)
									return address == null ?
										[]
									:
										[{
											[EntityMetaKey.Selector]: {
												$network: evmNetworkSelectorFromChainId(evmChainIdFromNetworkSelector(entitySelector)),
												address,
											},
										} satisfies Entity<typeof schema, EntityType.EvmContract>]
								})
						)
					},
				}
			},
		})({
			Evm: {
				$$contracts: (entity) => entity,
			},
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async (entitySelector, context) => {
						const {
							blockscoutV2ItemsCountMax,
						} = await import('$/sources/Blockscout/Rest/constants.ts')
						const chainId = evmChainIdFromNetworkSelector(entitySelector)
						if (!blockscoutAccountAbstractionChainIds.has(chainId))
							return []

						const limit = Math.min(
							resolverContextRowLimit(context),
							blockscoutV2ItemsCountMax
						)
						const { getErc4337SmartAccountList } = await import('$/sources/Blockscout/Rest/queries.ts')
						const wires = await getErc4337SmartAccountList({
							chainId,
							limit,
						})
						return erc4337RegistryEntitiesFromBlockscoutWires({
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

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async (entitySelector, context) => {
						const {
							blockscoutV2ItemsCountMax,
						} = await import('$/sources/Blockscout/Rest/constants.ts')
						const chainId = evmChainIdFromNetworkSelector(entitySelector)
						if (!blockscoutAccountAbstractionChainIds.has(chainId))
							return []

						const limit = Math.min(
							resolverContextRowLimit(context),
							blockscoutV2ItemsCountMax
						)
						const { getUserOperationsPage } = await import('$/sources/Blockscout/Rest/queries.ts')
						const wires = await getUserOperationsPage({
							chainId,
							limit,
						})
						return wires.flatMap((wire) => {
							const reference = evmUserOperationReferenceFromBlockscoutWire({
								$network: entitySelector,
								wire,
							})
							return reference == null ? [] : [reference]
						})
					},
				}
			},
		})({
			Evm: {
				$$userOperations: (entity) => entity,
			},
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async (entitySelector) => {
						const stats = await blockscoutStatsForChain(evmChainIdFromNetworkSelector(entitySelector))
						if (stats == null)
							return []

						const observation = gasEstimateObservationFromBlockscoutStats(stats)
						if (observation == null)
							return []

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

		defineResolver({
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
									$coin: { coinId },
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

		defineResolver({
			entityType: EntityType.MarketPrice,
			resolve: {
				Market: {
					resolve: async ({ $market }) => {
						if (!isSeededCoinCurrencyMarket($market))
							return []

						const coinId = $market.$base.assetKey
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
									$market,
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

		defineResolver({
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
						const wires = await getTransactionTokenTransfers({
							chainId: evmChainIdFromNetworkSelector($network),
							txHash,
							limit,
						})
						return evmTokenTransferEntitiesFromBlockscoutWires({
							$network,
							txHash,
							receiptLogs: await getTransactionLogs({
								chainId: evmChainIdFromNetworkSelector($network),
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

		defineResolver({
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
						const wires = await getTransactionInternalTransactions({
							chainId: evmChainIdFromNetworkSelector($network),
							txHash,
							limit,
						})
						return (
							evmInternalTransferEntitiesFromBlockscoutWires({
								$network,
								txHash,
								wires,
							})
						)
					},
				}
			},
		})({
			$$internalTransfers: (entity) => entity.map(evmInternalTransferReference),
		}),

		defineResolver({
			entityType: EntityType.EvmTransaction,
			resolve: {
				EvmNetworkTxHash: {
					resolve: async ({ $network, txHash }, context) => {
						const {
							blockscoutV2ItemsCountMax,
						} = await import('$/sources/Blockscout/Rest/constants.ts')
						if (!blockscoutAccountAbstractionChainIds.has(evmChainIdFromNetworkSelector($network)))
							return []
						const limit = Math.min(
							resolverContextRowLimit(context),
							blockscoutV2ItemsCountMax
						)
						const { getUserOperationsPage } = await import('$/sources/Blockscout/Rest/queries.ts')
						const wires = await getUserOperationsPage({
							chainId: evmChainIdFromNetworkSelector($network),
							limit,
							transactionHash: txHash,
						})
						return wires.flatMap((wire) => {
							const reference = evmUserOperationReferenceFromBlockscoutWire({
								$network,
								wire,
							})
							return reference == null ? [] : [reference]
						})
					},
				}
			},
		})({
			$$userOperations: (entity) => entity,
		}),

		defineResolver({
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
						const wires = await getBlockTransactions({
							chainId: evmChainIdFromNetworkSelector($network),
							blockNumber,
							limit,
						})
						return (
							wires
								.flatMap((w) => {
									const txHash = hexLowerOfByteSize(w.hash, 32)

									return txHash == null ?
										[]
									:
										[{
											[EntityMetaKey.Selector]: {
												$network: evmNetworkSelectorFromChainId(evmChainIdFromNetworkSelector($network)),
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

		defineResolver({
			entityType: EntityType.EvmContract,
			resolve: {
				EvmNetworkAddress: {
					resolve: async ({ $network, address: addressSelector }) => {
						const { getAddressDetails } = await import('$/sources/Blockscout/Rest/queries.ts')
						const address = hexLowerOfByteSize(addressSelector, 20)
						if (address == null)
							throw new Error('Blockscout_Rest: address not normalized')

						const details = await getAddressDetails({
							chainId: evmChainIdFromNetworkSelector($network),
							address,
						})
						const creatorAddress = hexLowerOfByteSize(details.creator_address_hash ?? '', 20)
						const creationTransactionHash = hexLowerOfByteSize(details.creation_transaction_hash ?? '', 32)
						return {
							...(creatorAddress != null && {
								$deployer: {
									[EntityMetaKey.Selector]: {
										address: creatorAddress,
									},
								},
							}),
							...(creationTransactionHash != null && {
								$creationTransaction: {
									[EntityMetaKey.Selector]: {
										$network,
										txHash: creationTransactionHash,
									},
								},
							}),
						}
					},
				},
			},
		})({
			$deployer: (contract) => contract.$deployer,
			$creationTransaction: (contract) => contract.$creationTransaction,
		}),

		defineResolver({
			entityType: EntityType.EvmContract,
			resolve: {
				EvmNetworkAddress: {
					resolve: async ({ $network, address: addressSelector }) => {
						const { getSmartContract } = await import('$/sources/Blockscout/Rest/queries.ts')
						const address = hexLowerOfByteSize(addressSelector, 20)
						if (address == null)
							throw new Error('Blockscout_Rest: address not normalized')

						const details = await getSmartContract({
							chainId: evmChainIdFromNetworkSelector($network),
							address,
						})
						const implementationAddress = hexLowerOfByteSize(
							details.implementations?.at(0)?.address_hash ?? '',
							20
						)
						const abi = (
							details.abi == null ?
								undefined
							:
								evmAbiFromJsonString(JSON.stringify(details.abi))
						)
						return {
							...(implementationAddress != null && {
								$implementation: {
									[EntityMetaKey.Selector]: {
										$network,
										address: implementationAddress,
									},
								},
							}),
							...(abi != null && { abi }),
						}
					},
				},
			},
		})({
			$implementation: (contract) => contract.$implementation,
			abi: (contract) => contract.abi,
		}),

		defineResolver({
			entityType: EntityType.EvmContract,
			resolve: {
				EvmNetworkAddress: {
					resolve: async ({ $network, address: addressSelector }) => {
						const { getCode } = await import('$/sources/Blockscout/Rest/queries.ts')
						const address = hexLowerOfByteSize(addressSelector, 20)
						if (address == null)
							throw new Error('Blockscout_Rest: address not normalized')

						const codeHex = await getCode({
							chainId: evmChainIdFromNetworkSelector($network),
							address,
						})
						if (codeHex == null)
							return {}

						const code = evmContractRuntimeCodeFromGetCodeHex(codeHex)
						return {
							...(code != null && {
								code,
								codeHash: evmContractBytecodeHashFromGetCodeHex(codeHex),
							}),
						}
					},
				},
			},
		})({
			code: (contract) => contract.code,
			codeHash: (contract) => contract.codeHash,
		}),

		defineResolver({
			entityType: EntityType.EvmContract,
			resolve: {
				EvmNetworkAddress: {
					resolve: async ({ $network, address: addressSelector }, context) => {
						const { getStorageAt } = await import('$/sources/Blockscout/Rest/queries.ts')
						const address = hexLowerOfByteSize(addressSelector, 20)
						if (address == null)
							throw new Error('Blockscout_Rest: EvmContract address not normalized')

						const depth = Math.min(32, Math.max(1, resolverContextRowLimit(context)))
						return evmContractStorageSlotReadsFromEthGetStorageAt({
							address,
							depth,
							getStorageAt: (slotQuantityHex) => (
								getStorageAt({
									chainId: evmChainIdFromNetworkSelector($network),
									address,
									slotQuantityHex,
								}).then((valueHex) => {
									if (valueHex == null)
										throw new Error('Blockscout_Rest: eth_getStorageAt returned no result')

									return valueHex
								})
							),
						})
					},
				},
			},
		})({
			storageSlotReads: (entity) => entity,
		}),
	],
} satisfies RegisteredSourceResolverModule
