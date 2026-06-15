import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import { stringify } from 'devalue'
import { keccak256, toHex } from '@tevm/voltaire/Hash'
import { toBytes } from '@tevm/voltaire/Hex'
import { evmAbiFromJsonString } from '$/lib/evmAbi.ts'
import { optionalNonemptyString } from '$/lib/string.ts'
import { hexLowerOfByteSize, with0xHex, zeroExLowerCase } from '$/lib/hexLowerOfByteSize.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import type { Entity, EntitySelector } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import {
	EvmInternalCallType,
	EvmTokenStandard,
	EvmTransactionEnvelopeType,
	EvmTransactionExecutionStatus,
	EvmTransactionKind,
} from '$/constants/Evm.ts'
import { MarketAssetKind, MarketKind } from '$/constants/Market.ts'
import { CoinInstanceType } from '$/schema/EvmCoinInstance.ts'
import { catalogCoinUsdMarketIdByCoinId } from '$/constants/MarketCatalog.ts'
import type {
	BlockscoutInternalTransaction,
	BlockscoutErc4337RegistryEntry,
	BlockscoutStats,
	BlockscoutTokenTransfer,
} from '$/sources/Blockscout/Rest/types.ts'
import type { RpcBlockHeader, RpcLog } from '$/sources/Evm/JsonRpc/types.ts'
import { EvmNetworkSelector } from '$/schema/EvmNetwork.ts'
import { EvmBlockSelector } from '$/schema/EvmBlock.ts'
import { EvmTransactionSelector } from '$/schema/EvmTransaction.ts'
import { EvmLogSelector } from '$/schema/EvmLog.ts'
import { EvmTokenTransferSelector } from '$/schema/EvmTokenTransfer.ts'
import { EvmInternalTransferSelector } from '$/schema/EvmInternalTransfer.ts'
import { Erc4337SmartAccountSelector } from '$/schema/Erc4337SmartAccount.ts'
import { Erc4337BundlerSelector } from '$/schema/Erc4337Bundler.ts'
import { Erc4337PaymasterSelector } from '$/schema/Erc4337Paymaster.ts'
import { Erc4337AccountFactorySelector } from '$/schema/Erc4337AccountFactory.ts'
import { EvmUserOperationSelector } from '$/schema/EvmUserOperation.ts'
import { EvmNetworkAccountSelector } from '$/schema/EvmNetworkAccount.ts'
import { Market_TimestampSelector } from '$/schema/Market_Timestamp.ts'
import { EvmNetwork_GasEstimate_TimestampSelector } from '$/schema/EvmNetwork_GasEstimate_Timestamp.ts'
import { Coin_TimestampSelector } from '$/schema/Coin_Timestamp.ts'
import { CoinSelector } from '$/schema/Coin.ts'
import { MarketPriceSelector } from '$/schema/MarketPrice.ts'
import { EvmContractSelector } from '$/schema/EvmContract.ts'

type EvmNetworkId = {
	caip2: {
		namespace: string
		reference: string
	}
}

const evmNetworkIdFromChainId = (chainId: number): EvmNetworkId => ({
	caip2: {
		namespace: 'eip155',
		reference: String(chainId),
	},
})

const chainIdFromEvmNetworkId = (network: EvmNetworkId) => Number(network.caip2.reference)

const evmContractRuntimeCodeFromGetCodeHex = (
	codeHex: `0x${string}`,
): `0x${string}` | undefined => (
	codeHex === '0x' || codeHex === '0x0' ?
		undefined
	:
		zeroExLowerCase(codeHex)
)

const evmContractBytecodeHashFromGetCodeHex = (
	codeHex: `0x${string}`,
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
	const storageSlots: { slot: `0x${string}`; value: `0x${string}` }[] = []
	for (let slotIndex = 0; slotIndex < depth; slotIndex += 1) {
		const slotQuantityHex: `0x${string}` = `0x${BigInt(slotIndex).toString(16).padStart(64, '0')}`
		const valueHex = await getStorageAt(slotQuantityHex)
		const slotNormalized = hexLowerOfByteSize(slotQuantityHex, 32)
		const value = hexLowerOfByteSize(valueHex, 32)
		if (slotNormalized == null || value == null) continue
		storageSlots.push({ slot: slotNormalized, value })
	}
	return storageSlots
}

const evmLogIndexFromWire = (
	raw: string | undefined,
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
				Number(raw),
		)
)

const evmRpcQuantityToBigInt = (
	raw: string | undefined,
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
			})() ?? -1n,
		)
)

const evmLogEntitySelectorFromWire = ({
	$network,
	txHash,
	log,
}: {
	$network: EvmNetworkId
	txHash: string
	log: RpcLog
}) => {
	const logIndex = evmLogIndexFromWire(log.logIndex)
	const normalizedTxHash = hexLowerOfByteSize(txHash, 32)
	return logIndex == null || normalizedTxHash == null ?
		undefined
	:
		{
			$network,
			txHash: normalizedTxHash,
			logIndex,
		}
}

const evmLogEntityFromIdAndWire = (
	entitySelector: Entity<typeof schema, EntityType.EvmLog>[typeof EntityMetaKey.Selector],
	log: RpcLog,
) => {
	const address = hexLowerOfByteSize(log.address ?? '', 20)
	const blockHash = hexLowerOfByteSize(log.blockHash ?? '', 32)
	const blockNumber = evmRpcQuantityToBigInt(log.blockNumber)
	const transactionIndex = evmLogIndexFromWire(log.transactionIndex)
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
		topics,
		...(data != null && { data }),
		...(blockNumber != null && { blockNumber }),
		...(blockHash != null && { blockHash }),
		...(transactionIndex != null && { transactionIndex }),
		...(log.removed != null && { removed: log.removed }),
		...(address != null && {
			$emitter: {
				[EntityMetaKey.Selector]: {
					$network: entitySelector.$network,
					address,
				},
			} satisfies Entity<typeof schema, EntityType.EvmContract>,
		}),
	}
}

const findReceiptLogWireForEvmLogId = (
	logs: readonly RpcLog[] | undefined,
	logIndex: number,
): RpcLog | undefined => (
	(logs ?? []).find((log) => (
		evmLogIndexFromWire(log.logIndex) === logIndex
	))
)

const evmTransactionEnvelopeTypeFromRpcTypeByte = (
	raw: number | undefined,
): EvmTransactionEnvelopeType | undefined => (
	raw == null || !Number.isFinite(raw) || !Number.isInteger(raw) ?
		EvmTransactionEnvelopeType.Legacy
	: raw === 0 ?
		EvmTransactionEnvelopeType.Legacy
	: raw === 1 ?
		EvmTransactionEnvelopeType.AccessList
	: raw === 2 ?
		EvmTransactionEnvelopeType.FeeMarket
	: raw === 3 ?
		EvmTransactionEnvelopeType.Blob
	: raw === 4 ?
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
	: input != null && input !== '0x' && input.length > 2 ?
		value > 0n ?
			EvmTransactionKind.NativeTransferAndCall
		:
			EvmTransactionKind.ContractCall
	: value > 0n ?
		EvmTransactionKind.NativeTransfer
	:
		EvmTransactionKind.ContractCall
)

const evmInternalCallTypeFromWire = (
	raw: string | undefined,
): EvmInternalCallType | undefined => (
	raw == null || raw === '' ?
		undefined
	:
		((normalized) => (
		normalized === 'call' ?
			EvmInternalCallType.Call
		: normalized === 'callcode' ?
			EvmInternalCallType.CallCode
		: normalized === 'delegatecall' ?
			EvmInternalCallType.DelegateCall
		: normalized === 'staticcall' ?
			EvmInternalCallType.StaticCall
		: normalized === 'create' ?
			EvmInternalCallType.Create
		: normalized === 'create2' ?
			EvmInternalCallType.Create2
		: normalized === 'suicide' || normalized === 'selfdestruct' ?
			EvmInternalCallType.SelfDestruct
		:
			EvmInternalCallType.Unknown
			))(raw.toLowerCase())
)

const blockscoutQuantityToBigInt = (
	raw: string | undefined,
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
		})() ?? -1n,
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
	return {
		[EntityMetaKey.Selector]: {
			$network,
			txHash: normalizedTxHash,
			internalIndex,
		},
		value,
		...(callType != null && { callType }),
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

const evmInternalTransferEntitySelectorsFromBlockscoutWires = ({
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

const evmInternalTransferEntitySelectorsFromBlockscoutAddresss = ({
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
					evmInternalTransferEntitySelectorsFromBlockscoutWires({
						$network,
						txHash: normalizedTxHash,
						wires: txWires,
					})
			})
	)
}

const findBlockscoutInternalTransferWireForEntitySelector = (
	wires: readonly BlockscoutInternalTransaction[],
	entitySelector: Entity<typeof schema, EntityType.EvmInternalTransfer>[typeof EntityMetaKey.Selector],
): BlockscoutInternalTransaction | undefined => (
	wires.find((wire) => wire.index === entitySelector.internalIndex)
)

const blockscoutLogIndexFromWire = (
	raw: string | number | undefined,
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
			Number(raw),
	)
)

const evmTokenStandardFromBlockscoutWire = (
	wire: BlockscoutTokenTransfer,
): EvmTokenStandard => {
	const tokenType = wire.token?.type?.toUpperCase() ?? ''
	if (tokenType.includes('721')) return EvmTokenStandard.Erc721
	if (tokenType.includes('1155')) return EvmTokenStandard.Erc1155
	return EvmTokenStandard.Erc20
}

const evmTokenTransferEntityFromFields = ({
	$network,
	txHash,
	logIndex,
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
	logIndex: number
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
		$network,
		txHash,
		logIndex,
		transferIndex: logIndex,
	},
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
	wire,
	transferIndex,
}: {
	$network: EvmNetworkId
	txHash: `0x${string}`
	wire: BlockscoutTokenTransfer
	transferIndex?: number
}) => {
	const normalizedTxHash = hexLowerOfByteSize(txHash, 32)
	const logIndex = transferIndex ?? blockscoutLogIndexFromWire(wire.log_index)
	if (normalizedTxHash == null || logIndex == null) return undefined
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
		: wire.token?.decimals != null && wire.token.decimals !== '' ?
			Number(wire.token.decimals)
		:
			undefined
	)
	return evmTokenTransferEntityFromFields({
		$network,
		txHash: normalizedTxHash,
		logIndex,
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

const evmTokenTransferEntitySelectorsFromBlockscoutWires = ({
	$network,
	txHash,
	wires,
}: {
	$network: EvmNetworkId
	txHash: `0x${string}`
	wires: readonly BlockscoutTokenTransfer[]
}) => (
	wires.flatMap((wire) => {
		const entity = evmTokenTransferEntityFromWire({
			$network,
			txHash,
			wire,
		})
		return entity == null ? [] : [entity]
	})
)

const evmTokenTransferEntitySelectorsFromBlockscoutAddresss = ({
	$network,
	wires,
}: {
	$network: EvmNetworkId
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
	return (
		[...wiresByTxHash.entries()]
			.flatMap(([txHash, txWires]) => {
				const normalizedTxHash = hexLowerOfByteSize(txHash, 32)
				return normalizedTxHash == null ?
					[]
				:
					evmTokenTransferEntitySelectorsFromBlockscoutWires({
						$network,
						txHash: normalizedTxHash,
						wires: txWires,
					})
			})
	)
}

const findBlockscoutTokenTransferForEntitySelector = (
	wires: readonly BlockscoutTokenTransfer[],
	entitySelector: Entity<typeof schema, EntityType.EvmTokenTransfer>[typeof EntityMetaKey.Selector],
): BlockscoutTokenTransfer | undefined => (
	wires.find((wire) => (
		blockscoutLogIndexFromWire(wire.log_index) === entitySelector.logIndex
	))
)

const usdPriceStringToPrice1e8 = (
	raw: string | undefined,
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
			Date.now()
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
	chainId: number,
): Promise<BlockscoutStats | null> => {
	const {
		blockscoutExplorerOriginForChain,
		blockscoutRestV2AtExplorerOrigin,
	} = await import('$/sources/Blockscout/Rest/constants.ts')
	const { getStats } = await import('$/sources/Blockscout/Rest/queries.ts')
	const origin = blockscoutV2ExplorerOriginWhenRestSupported({
		chainId,
		blockscoutExplorerOriginForChain,
		blockscoutRestV2AtExplorerOrigin,
	})
	if (origin == null) return null
	return getStats({ explorerOrigin: origin })
}

const blockscoutStatsForNativeCoinId = async (
	coinId: string,
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
	label: string,
) => {
	if (raw == null || String(raw).trim() === '')
		throw new Error(`Blockscout_Rest: missing ${label}`)

	const count = Number(raw)
	if (!Number.isSafeInteger(count) || count < 0)
		throw new Error(`Blockscout_Rest: invalid ${label}: ${String(raw)}`)

	return count
}

const blockscoutV2ExplorerOriginWhenRestSupported = ({
	chainId,
	blockscoutExplorerOriginForChain,
	blockscoutRestV2AtExplorerOrigin,
}: {
	chainId: number
	blockscoutExplorerOriginForChain: (chainId: number) => string | undefined
	blockscoutRestV2AtExplorerOrigin: (origin: string) => boolean
}): string | undefined => {
	const origin = blockscoutExplorerOriginForChain(chainId)
	if (origin == null) return undefined
	if (!blockscoutRestV2AtExplorerOrigin(origin)) return undefined
	return origin
}

const requireBlockscoutV2ExplorerOrigin = async (chainId: number) => {
	const {
		blockscoutExplorerOriginForChain,
		blockscoutRestV2AtExplorerOrigin,
	} = await import('$/sources/Blockscout/Rest/constants.ts')
	const origin = blockscoutV2ExplorerOriginWhenRestSupported({
		chainId,
		blockscoutExplorerOriginForChain,
		blockscoutRestV2AtExplorerOrigin,
	})
	if (origin == null) {
		throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${chainId}`)
	}
	return origin
}

const erc4337RegistryCountFromBlockscoutWire = (
	wire: BlockscoutErc4337RegistryEntry,
) => {
	if (
		wire.total_ops != null
		&& Number.isFinite(wire.total_ops)
		&& wire.total_ops >= 0
	) {
		return Math.floor(wire.total_ops)
	}
	if (
		wire.total_accounts != null
		&& Number.isFinite(wire.total_accounts)
		&& wire.total_accounts >= 0
	) {
		return Math.floor(wire.total_accounts)
	}
	return undefined
}

const erc4337RegistryFieldsFromBlockscoutWire = (
	entityType: string,
	wire: BlockscoutErc4337RegistryEntry,
) => {
	const userOperationsCount = erc4337RegistryCountFromBlockscoutWire(wire)
	if (userOperationsCount == null) {
		throw new Error(`Blockscout_Rest: ${entityType} detail missing total_ops/total_accounts`)
	}
	return { userOperationsCount }
}

const erc4337ContractField = (
	{ $network, address }:
		| EntitySelector<typeof schema, EntityType.Erc4337SmartAccount>
		| EntitySelector<typeof schema, EntityType.Erc4337Paymaster>
		| EntitySelector<typeof schema, EntityType.Erc4337AccountFactory>,
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

export default {
	source: Source.Blockscout_Rest,

	resolvers: [
		defineResolver(Source.Blockscout_Rest, {
			entityType: EntityType.EvmBlock,
			resolve: {
				[EvmBlockSelector.EvmNetworkBlockNumber]: async ({ $network, blockNumber }) => {
					const {
						blockscoutExplorerOriginForChain,
						blockscoutRestV2AtExplorerOrigin,
					} = await import('$/sources/Blockscout/Rest/constants.ts')
					const { getBlockByNumber } = await import('$/sources/Blockscout/Rest/queries.ts')
					const chainId = chainIdFromEvmNetworkId($network)
					const origin = blockscoutV2ExplorerOriginWhenRestSupported({
						chainId,
						blockscoutExplorerOriginForChain,
						blockscoutRestV2AtExplorerOrigin,
					})
					if (origin == null) {
						throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${chainId}`)
					}
					const header = await getBlockByNumber({
						explorerOrigin: origin,
						blockNumber: blockNumber,
					})
					if (header == null) {
						throw new Error('Blockscout_Rest: block header not returned for EvmBlock')
					}
					const parentBlockNumber = blockNumber > 0n ? blockNumber - 1n : undefined
					const blockHash = (
						header.hash != null ?
							hexLowerOfByteSize(header.hash, 32)
						:
							undefined
					)
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
						...(blockHash != null && { hash: blockHash }),
						number: blockNumber,
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
									hash: parentBlockHash,
									number: parentBlockNumber,
								} satisfies Entity<typeof schema, EntityType.EvmBlock>,
							}),
						...(miner != null && {
								$miner: {
									[EntityMetaKey.Selector]: {
										address: miner,
									},
								},
							}),
					}
				}
			},
		})({
			fields: {
				hash: (block) => block.hash,
				number: (block) => block.number,
				$parent: (block) => block.$parent,
				timestamp: (block) => block.timestamp,
				$miner: (block) => block.$miner,
				gasUsed: (block) => block.gasUsed,
				gasLimit: (block) => block.gasLimit,
				baseFeePerGas: (block) => block.baseFeePerGas,
				blobGasUsed: (block) => block.blobGasUsed,
				excessBlobGas: (block) => block.excessBlobGas,
				transactionCount: (block) => block.transactionCount,
			},
		}),

		defineResolver(Source.Blockscout_Rest, {
			entityType: EntityType.EvmTransaction,
			resolve: {
				[EvmTransactionSelector.EvmNetworkTxHash]: async ({ $network, txHash: txHashSelector }) => {
				const {
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				} = await import('$/sources/Blockscout/Rest/constants.ts')
				const {
					blockscoutTransactionWireAsRpcReceipt,
					blockscoutTransactionWireAsRpcTransaction,
					getTransactionLogs,
					getTransactionWireByHash,
				} = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: chainIdFromEvmNetworkId($network),
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${chainIdFromEvmNetworkId($network)}`)
				}
				const blockscoutTransaction = await getTransactionWireByHash({
					explorerOrigin: origin,
					txHash: txHashSelector,
				})
				if (blockscoutTransaction == null) {
					throw new Error('Blockscout_Rest: transaction not returned for EvmTransaction')
				}
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
								number: containingBlockNumber,
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
					transactionIndex: (
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
				const receiptLogs = await getTransactionLogs({
					explorerOrigin: origin,
					txHash: txHash,
				})
				const receipt = blockscoutTransactionWireAsRpcReceipt(
					blockscoutTransaction,
					receiptLogs,
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
							.flatMap((log) => {
								const id = evmLogEntitySelectorFromWire({
									$network,
									txHash,
									log,
								})
								return id == null ?
									[]
								:
									[evmLogEntityFromIdAndWire(id, log)]
							})
					),
					traceUnavailable: true,
				}
				}
			},
			})({
				fields: {
					$from: (transaction) => {
						if (transaction.$from == null)
							throw new Error('Blockscout_Rest: transaction is missing from address')

						return transaction.$from
					},
					$to: (transaction) => transaction.$to,
					$contract: (transaction) => transaction.$contract,
					transactionIndex: (transaction) => transaction.transactionIndex,
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
					maxFeePerGas: (transaction) => transaction.maxFeePerGas,
					maxPriorityFeePerGas: (transaction) => transaction.maxPriorityFeePerGas,
					$$logs: (transaction) => transaction.$$logs,
					traceUnavailable: (transaction) => transaction.traceUnavailable,
				},
			}),

		defineResolver(Source.Blockscout_Rest, {
			entityType: EntityType.EvmLog,
			resolve: {
				[EvmLogSelector.EvmNetworkTxHashLogIndex]: async (entitySelector) => {
				const {
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				} = await import('$/sources/Blockscout/Rest/constants.ts')
				const { getTransactionLogs } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: chainIdFromEvmNetworkId(entitySelector.$network),
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${chainIdFromEvmNetworkId(entitySelector.$network)}`)
				}
				const logs = await getTransactionLogs({
					explorerOrigin: origin,
					txHash: entitySelector.txHash,
				})
				const log = findReceiptLogWireForEvmLogId(logs, entitySelector.logIndex)
				if (log == null) {
					throw new Error('Blockscout_Rest: receipt log not found for EvmLog')
				}
				return evmLogEntityFromIdAndWire(entitySelector, log)
			}
			},
				})({
					fields: {
						topics: (log) => log.topics,
						data: (log) => log.data,
						blockNumber: (log) => log.blockNumber,
						blockHash: (log) => log.blockHash,
						transactionIndex: (log) => log.transactionIndex,
						removed: (log) => log.removed,
						$emitter: (log) => log.$emitter,
					},
				}),

		defineResolver(Source.Blockscout_Rest, {
			entityType: EntityType.EvmTokenTransfer,
			resolve: {
				[EvmTokenTransferSelector.EvmNetworkTxHashLogIndexTransferIndex]: async (entitySelector) => {
				const {
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
					blockscoutV2ItemsCountMax,
				} = await import('$/sources/Blockscout/Rest/constants.ts')
				const { getTransactionTokenTransfers } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: chainIdFromEvmNetworkId(entitySelector.$network),
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${chainIdFromEvmNetworkId(entitySelector.$network)}`)
				}
				const wires = await getTransactionTokenTransfers({
					explorerOrigin: origin,
					txHash: entitySelector.txHash,
					limit: blockscoutV2ItemsCountMax,
				})
				const wire = findBlockscoutTokenTransferForEntitySelector(wires, entitySelector)
				if (wire == null) {
					throw new Error('Blockscout_Rest: token transfer not found for EvmTokenTransfer')
				}
				const entity = evmTokenTransferEntityFromWire({
					$network: entitySelector.$network,
					txHash: entitySelector.txHash,
					transferIndex: entitySelector.logIndex,
					wire,
				})
				if (entity == null) {
					throw new Error('Blockscout_Rest: token transfer wire did not map to EvmTokenTransfer')
				}
				return entity
			}
			},
			})({
				fields: {
					standard: (transfer) => transfer.standard,
					txHash: (transfer) => transfer[EntityMetaKey.Selector].txHash,
					logIndex: (transfer) => transfer[EntityMetaKey.Selector].logIndex,
					transferIndex: (transfer) => transfer[EntityMetaKey.Selector].transferIndex,
					$from: (transfer) => transfer.$from,
					$to: (transfer) => transfer.$to,
					$tokenContract: (transfer) => transfer.$tokenContract,
					$coinInstance: (transfer) => transfer.$coinInstance,
					amount: (transfer) => transfer.amount,
					tokenId: (transfer) => transfer.tokenId,
					tokenSymbol: (transfer) => transfer.tokenSymbol,
					tokenName: (transfer) => transfer.tokenName,
					tokenDecimals: (transfer) => transfer.tokenDecimals,
				},
				}),

		defineResolver(Source.Blockscout_Rest, {
			entityType: EntityType.EvmInternalTransfer,
			resolve: {
				[EvmInternalTransferSelector.EvmNetworkTxHashInternalIndex]: async (entitySelector) => {
				const {
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
					blockscoutV2ItemsCountMax,
				} = await import('$/sources/Blockscout/Rest/constants.ts')
				const { getTransactionInternalTransactions } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: chainIdFromEvmNetworkId(entitySelector.$network),
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${chainIdFromEvmNetworkId(entitySelector.$network)}`)
				}
				const wires = await getTransactionInternalTransactions({
					explorerOrigin: origin,
					txHash: entitySelector.txHash,
					limit: blockscoutV2ItemsCountMax,
				})
				const wire = findBlockscoutInternalTransferWireForEntitySelector(wires, entitySelector)
				if (wire == null) {
					throw new Error('Blockscout_Rest: internal transfer not found for EvmInternalTransfer')
				}
				const entity = evmInternalTransferEntityFromWire({
					$network: entitySelector.$network,
					txHash: entitySelector.txHash,
					wire,
				})
				if (entity == null) {
					throw new Error('Blockscout_Rest: internal transfer wire did not map to EvmInternalTransfer')
				}
				return entity
			}
			},
		})({
			fields: {
				txHash: (transfer) => transfer[EntityMetaKey.Selector].txHash,
				internalIndex: (transfer) => transfer[EntityMetaKey.Selector].internalIndex,
				$from: (transfer) => transfer.$from,
				$to: (transfer) => transfer.$to,
				value: (transfer) => transfer.value,
				callType: (transfer) => transfer.callType,
				success: (transfer) => transfer.success,
				$createdContract: (transfer) => transfer.$createdContract,
			},
			}),

		defineResolver(Source.Blockscout_Rest, {
			entityType: EntityType.Erc4337SmartAccount,
			resolve: {
				[Erc4337SmartAccountSelector.EvmNetworkAddress]: async (entitySelector) => {
				const {
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				} = await import('$/sources/Blockscout/Rest/constants.ts')
				const { getErc4337SmartAccountDetail } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: chainIdFromEvmNetworkId(entitySelector.$network),
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${chainIdFromEvmNetworkId(entitySelector.$network)}`)
				}
				const wire = await getErc4337SmartAccountDetail({
					explorerOrigin: origin,
					address: entitySelector.address,
				})
				const factoryAddress = (
					wire.factory?.hash != null ?
						hexLowerOfByteSize(wire.factory.hash, 20)
					:
						undefined
				)
				return {
					...erc4337RegistryFieldsFromBlockscoutWire(
						EntityType.Erc4337SmartAccount,
						wire,
					),
					...erc4337ContractField(entitySelector),
					...(factoryAddress != null && {
						$factory: {
							[EntityMetaKey.Selector]: {
								$network: entitySelector.$network,
								address: factoryAddress,
							},
						} satisfies Entity<typeof schema, EntityType.Erc4337AccountFactory>,
					}),
				}
			}
			},
		})({
			fields: {
				userOperationsCount: (account) => account.userOperationsCount,
				$contract: (account) => account.$contract,
				$factory: (account) => account.$factory,
			},
			}),

		defineResolver(Source.Blockscout_Rest, {
			entityType: EntityType.Erc4337Bundler,
			resolve: {
				[Erc4337BundlerSelector.EvmNetworkAddress]: async ({ $network, address }) => {
				const {
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				} = await import('$/sources/Blockscout/Rest/constants.ts')
				const { getErc4337BundlerDetail } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: chainIdFromEvmNetworkId($network),
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${chainIdFromEvmNetworkId($network)}`)
				}
				const wire = await getErc4337BundlerDetail({
					explorerOrigin: origin,
					address: address,
				})
				return erc4337RegistryFieldsFromBlockscoutWire(
					EntityType.Erc4337Bundler,
					wire,
				)
			}
			},
		})({
			fields: {
				userOperationsCount: (bundler) => bundler.userOperationsCount,
			},
			}),

		defineResolver(Source.Blockscout_Rest, {
			entityType: EntityType.Erc4337Paymaster,
			resolve: {
				[Erc4337PaymasterSelector.EvmNetworkAddress]: async (entitySelector) => {
				const {
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				} = await import('$/sources/Blockscout/Rest/constants.ts')
				const { getErc4337PaymasterDetail } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: chainIdFromEvmNetworkId(entitySelector.$network),
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${chainIdFromEvmNetworkId(entitySelector.$network)}`)
				}
				const wire = await getErc4337PaymasterDetail({
					explorerOrigin: origin,
					address: entitySelector.address,
				})
				return {
					...erc4337RegistryFieldsFromBlockscoutWire(
						EntityType.Erc4337Paymaster,
						wire,
					),
					...erc4337ContractField(entitySelector),
				}
			}
			},
		})({
			fields: {
				userOperationsCount: (paymaster) => paymaster.userOperationsCount,
				$contract: (paymaster) => paymaster.$contract,
			},
			}),

		defineResolver(Source.Blockscout_Rest, {
			entityType: EntityType.Erc4337AccountFactory,
			resolve: {
				[Erc4337AccountFactorySelector.EvmNetworkAddress]: async (entitySelector) => {
				const {
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				} = await import('$/sources/Blockscout/Rest/constants.ts')
				const { getErc4337AccountFactoryDetail } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: chainIdFromEvmNetworkId(entitySelector.$network),
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${chainIdFromEvmNetworkId(entitySelector.$network)}`)
				}
				const wire = await getErc4337AccountFactoryDetail({
					explorerOrigin: origin,
					address: entitySelector.address,
				})
				return {
					...erc4337RegistryFieldsFromBlockscoutWire(
						EntityType.Erc4337AccountFactory,
						wire,
					),
					...erc4337ContractField(entitySelector),
				}
			}
			},
		})({
			fields: {
				userOperationsCount: (factory) => factory.userOperationsCount,
				$contract: (factory) => factory.$contract,
			},
			}),

		defineResolver(Source.Blockscout_Rest, {
			entityType: EntityType.EvmUserOperation,
			resolve: {
				[EvmUserOperationSelector.EvmNetworkHash]: async ({ $network, hash }) => {
				const {
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				} = await import('$/sources/Blockscout/Rest/constants.ts')
				const {
					getUserOperationDetail,
				} = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: chainIdFromEvmNetworkId($network),
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${chainIdFromEvmNetworkId($network)}`)
				}
				const wire = await getUserOperationDetail({
					explorerOrigin: origin,
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
					20,
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
					value: string | number | null | undefined,
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
					}
				}
			}
			},
		})({
			fields: {
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
			},
			}),

		defineResolver(Source.Blockscout_Rest, {
			entityType: EntityType.EvmNetworkAccount,
			resolve: {
				[EvmNetworkAccountSelector.EvmNetworkEvmAccount]: async ({ $actor, $network }) => {
				const {
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				} = await import('$/sources/Blockscout/Rest/constants.ts')
				const {
					getAddressCounters,
					getAddressDetails,
				} = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: chainIdFromEvmNetworkId($network),
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${chainIdFromEvmNetworkId($network)}`)
				}
				const address = hexLowerOfByteSize($actor.address, 20)
				if (address == null) {
					throw new Error('Blockscout_Rest: EvmNetworkAccount wallet address not normalized')
				}
				const details = await getAddressDetails({ explorerOrigin: origin, address })
				const counters = await getAddressCounters({ explorerOrigin: origin, address })
				const transactionCount = (
					counters.transactions_count == null ?
						undefined
					:
						BigInt(counters.transactions_count)
				)
				const tokenTransferCount = (
					counters.token_transfers_count == null ?
						undefined
					:
						Number(counters.token_transfers_count)
				)
				return {
					...(
						details.is_contract === true || details.is_contract === false ?
							{ isContract: details.is_contract === true }
						:
							{}
					),
					...transactionCount != null && {
						transactionCount,
					},
					...tokenTransferCount != null && {
						tokenTransferCount: Number(tokenTransferCount),
					},
				}
			}
			},
		})({
			fields: {
				transactionCount: (account) => account.transactionCount,
				tokenTransferCount: (account) => account.tokenTransferCount,
				isContract: (account) => account.isContract,
			},
			}),

		defineResolver(Source.Blockscout_Rest, {
			entityType: EntityType.Market_Timestamp,
			resolve: {
				[Market_TimestampSelector.MarketTimestampMsFeedKey]: async ({ $market }) => {
				if ($market.marketKind !== MarketKind.Spot) {
					throw new Error('Blockscout_Rest: Market_Timestamp is spot-only')
				}
				const coinId = (
					$market.$base.kind === MarketAssetKind.Coin ?
						$market.$base.$coin.coinId
					:
						undefined
				)
				if (coinId == null) {
					throw new Error('Blockscout_Rest: market base is not a catalog coin')
				}
				const catalogMarketId = catalogCoinUsdMarketIdByCoinId[coinId]
				if (stringify($market) !== stringify(catalogMarketId)) {
					throw new Error('Blockscout_Rest: Market_Timestamp only supports catalog USD spot markets')
				}
				const stats = await blockscoutStatsForNativeCoinId(coinId)
				const price = usdPriceStringToPrice1e8(stats?.coin_price)
				if (stats == null || price == null) {
					throw new Error(`Blockscout_Rest: Market_Timestamp unsupported for coin ${coinId}`)
				}
				return {
					price,
					transport: 'blockscout-stats-usd-1e8',
					providerAssetId: coinId,
				}
			}
			},
		})({
			fields: {
				price: (quote) => quote.price,
				transport: (quote) => quote.transport,
				providerAssetId: (quote) => quote.providerAssetId,
			},
			}),

		defineResolver(Source.Blockscout_Rest, {
			entityType: EntityType.EvmNetwork_GasEstimate_Timestamp,
			resolve: {
				[EvmNetwork_GasEstimate_TimestampSelector.EvmNetworkTimestampMs]: async ({ $network, timestampMs }) => {
				const stats = await blockscoutStatsForChain(chainIdFromEvmNetworkId($network))
				if (stats == null) {
					throw new Error(
						`Blockscout_Rest: EvmNetwork_GasEstimate_Timestamp unsupported for chain ${String(chainIdFromEvmNetworkId($network))}`,
					)
				}
				const observation = gasEstimateObservationFromBlockscoutStats(stats)
				if (observation == null) {
					throw new Error('Blockscout_Rest: stats missing gas_prices tiers')
				}
				if (timestampMs !== observation.timestampMs) {
					throw new Error('Blockscout_Rest: EvmNetwork_GasEstimate_Timestamp id does not match stats clock')
				}
				return {
					...(observation.slowGwei != null && { slowGwei: observation.slowGwei }),
					...(observation.averageGwei != null && { averageGwei: observation.averageGwei }),
					...(observation.fastGwei != null && { fastGwei: observation.fastGwei }),
					transport: observation.transport,
				}
			}
			},
		})({
			fields: {
				slowGwei: (gasEstimate) => gasEstimate.slowGwei,
				averageGwei: (gasEstimate) => gasEstimate.averageGwei,
				fastGwei: (gasEstimate) => gasEstimate.fastGwei,
				transport: (gasEstimate) => gasEstimate.transport,
			},
			}),

		defineResolver(Source.Blockscout_Rest, {
			entityType: EntityType.Coin_Timestamp,
			resolve: {
				[Coin_TimestampSelector.CoinTimestampMs]: async ({ $coin }) => {
				const stats = await blockscoutStatsForNativeCoinId($coin.coinId)
				if (stats == null) {
					throw new Error(`Blockscout_Rest: Coin_Timestamp unsupported for coin ${$coin.coinId}`)
				}
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
					}),
					...(stats.coin_price_change_percentage != null
						&& Number.isFinite(stats.coin_price_change_percentage) && {
						change24hPercent: stats.coin_price_change_percentage,
					}),
					transport: 'blockscout-stats',
					providerAssetId: $coin.coinId,
				}
			}
			},
			})({
				fields: {
					marketCap: (coinTimestamp) => coinTimestamp.marketCap,
					change24hPercent: (coinTimestamp) => coinTimestamp.change24hPercent,
					transport: (coinTimestamp) => coinTimestamp.transport,
					providerAssetId: (coinTimestamp) => coinTimestamp.providerAssetId,
				},
			}),
		defineResolver(Source.Blockscout_Rest, {
			entityType: EntityType.EvmNetwork,
			resolve: {
				[EvmNetworkSelector.Caip2]: async (entitySelector) => {
				const stats = await blockscoutStatsForChain(chainIdFromEvmNetworkId(entitySelector))
				if (stats == null)
					throw new Error(`Blockscout_Rest: no stats for chain ${chainIdFromEvmNetworkId(entitySelector)}`)

				return blockscoutCountFromDecimalString(
					stats.total_transactions,
					'total_transactions',
				)
			}
			},
			})({
				fields: {
					$$transactions: {
						resolveCount: (count) => count,
					},
				},
			}),

			defineResolver(Source.Blockscout_Rest, {
				entityType: EntityType.EvmNetwork,
			resolve: {
				[EvmNetworkSelector.Caip2]: async (entitySelector) => {
				const stats = await blockscoutStatsForChain(chainIdFromEvmNetworkId(entitySelector))
				if (stats == null)
					throw new Error(`Blockscout_Rest: no stats for chain ${chainIdFromEvmNetworkId(entitySelector)}`)

				return blockscoutCountFromDecimalString(
					stats.total_blocks,
					'total_blocks',
				)
			}
			},
			})({
				fields: {
					$$blocks: {
						resolveCount: (count) => count,
					},
				},
			}),

		defineResolver(Source.Blockscout_Rest, {
			entityType: EntityType.EvmNetworkAccount,
			resolve: {
				[EvmNetworkAccountSelector.EvmNetworkEvmAccount]: async ({ $actor, $network }) => {
				const { getAddressCounters } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = await requireBlockscoutV2ExplorerOrigin(chainIdFromEvmNetworkId($network))
				const address = hexLowerOfByteSize($actor.address, 20)
				if (address == null)
					throw new Error('Blockscout_Rest: EvmNetworkAccount wallet address not normalized')

				return blockscoutCountFromDecimalString(
					(await getAddressCounters({
						explorerOrigin: origin,
						address,
					})).transactions_count,
					'transactions_count',
				)
			}
			},
			})({
				fields: {
					$$transactions: {
						resolveCount: (count) => count,
					},
				},
			}),

		defineResolver(Source.Blockscout_Rest, {
			entityType: EntityType.EvmNetworkAccount,
			resolve: {
				[EvmNetworkAccountSelector.EvmNetworkEvmAccount]: async ({ $actor, $network }) => {
				const { getAddressCounters } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = await requireBlockscoutV2ExplorerOrigin(chainIdFromEvmNetworkId($network))
				const address = hexLowerOfByteSize($actor.address, 20)
				if (address == null)
					throw new Error('Blockscout_Rest: EvmNetworkAccount wallet address not normalized')

				return blockscoutCountFromDecimalString(
					(await getAddressCounters({
						explorerOrigin: origin,
						address,
					})).token_transfers_count,
					'token_transfers_count',
				)
			}
			},
			})({
				fields: {
					$$tokenTransfers: {
						resolveCount: (count) => count,
					},
				},
			}),

		defineResolver(Source.Blockscout_Rest, {
			entityType: EntityType.EvmBlock,
			resolve: {
				[EvmBlockSelector.EvmNetworkBlockNumber]: async ({ $network, blockNumber }) => {
				const { getBlockByNumber } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = await requireBlockscoutV2ExplorerOrigin(chainIdFromEvmNetworkId($network))
				const header = await getBlockByNumber({
					explorerOrigin: origin,
					blockNumber: blockNumber,
				})
				if (header == null)
					throw new Error('Blockscout_Rest: block header not returned for EvmBlock count')
				if (header.transactions == null)
					throw new Error('Blockscout_Rest: block header missing transaction count')

				return header.transactions.length
			}
			},
			})({
				fields: {
				$$transactions: {
					resolveCount: (count) => count,
				},
			},
			}),
		defineResolver(Source.Blockscout_Rest, {
			entityType: EntityType.EvmNetwork,
			resolve: {
				[EvmNetworkSelector.Caip2]: async (entitySelector, context) => {
				const {
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
					blockscoutV2ItemsCountMax,
				} = await import('$/sources/Blockscout/Rest/constants.ts')
				const limit = Math.min(
					resolverContextRowLimit(context),
					blockscoutV2ItemsCountMax,
				)
				const { getBlocks } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: chainIdFromEvmNetworkId(entitySelector),
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${chainIdFromEvmNetworkId(entitySelector)}`)
				}
				const wires = await getBlocks({ explorerOrigin: origin, limit })
				return (
					wires.flatMap((wire) => {
						const height = evmRpcQuantityToBigInt(wire.number)
						const blockNumber = (
							height != null && height >= 0n ?
								height
							:
								null
						)
						if (blockNumber == null) {
							return []
						}
						const blockHash = (
							wire.hash != null ?
								hexLowerOfByteSize(wire.hash, 32)
							:
								undefined
						)
						const timestampSeconds = Number(evmRpcQuantityToBigInt(wire.timestamp) ?? -1n)
						return [
							{
								[EntityMetaKey.Selector]: {
									$network: evmNetworkIdFromChainId(chainIdFromEvmNetworkId(entitySelector)),
									blockNumber,
								},
								...(blockHash != null && { hash: blockHash }),
								number: blockNumber,
								timestamp: ((timestampSeconds) => (
									Number.isFinite(timestampSeconds) ? timestampSeconds * 1000 : undefined
								))(timestampSeconds),
								gasUsed: (
									wire.gasUsed != null ? ((value) => (
										value == null || value < 0n ? undefined : value
									))((() => {
										try {
											return BigInt(wire.gasUsed)
										} catch {
											return undefined
										}
									})())
									:
										undefined
								),
								gasLimit: (
									wire.gasLimit != null ? ((value) => (
										value == null || value < 0n ? undefined : value
									))((() => {
										try {
											return BigInt(wire.gasLimit)
										} catch {
											return undefined
										}
									})())
									:
										undefined
								),
								baseFeePerGas: (
									wire.baseFeePerGas != null ? ((value) => (
										value == null || value < 0n ? undefined : value
									))((() => {
										try {
											return BigInt(wire.baseFeePerGas)
										} catch {
											return undefined
										}
									})())
									:
										undefined
								),
								transactionCount: wire.transactions?.length ?? 0,
							} satisfies Entity<typeof schema, EntityType.EvmBlock>,
						]
					})
					)
				}
			},
			})({
				fields: {
					$$blocks: (entity) => entity,
				},
			}),

			defineResolver(Source.Blockscout_Rest, {
				entityType: EntityType.EvmNetwork,
			resolve: {
				[EvmNetworkSelector.Caip2]: async (entitySelector, context) => {
				const {
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
					blockscoutV2ItemsCountMax,
				} = await import('$/sources/Blockscout/Rest/constants.ts')
				const limit = Math.min(
					resolverContextRowLimit(context),
					blockscoutV2ItemsCountMax,
				)
				const { getTransactions } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: chainIdFromEvmNetworkId(entitySelector),
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${chainIdFromEvmNetworkId(entitySelector)}`)
				}
				const wires = await getTransactions({ explorerOrigin: origin, limit })
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
				}
			},
			})({
				fields: {
					$$transactions: (entity) => entity,
				},
			}),

			defineResolver(Source.Blockscout_Rest, {
				entityType: EntityType.EvmNetworkAccount,
			resolve: {
				[EvmNetworkAccountSelector.EvmNetworkEvmAccount]: async ({ $actor, $network }, context) => {
				const {
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
					blockscoutV2ItemsCountMax,
				} = await import('$/sources/Blockscout/Rest/constants.ts')
				const limit = Math.min(
					resolverContextRowLimit(context),
					blockscoutV2ItemsCountMax,
				)
				const { getAddressTransactions } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: chainIdFromEvmNetworkId($network),
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${chainIdFromEvmNetworkId($network)}`)
				}
				const address = hexLowerOfByteSize($actor.address, 20)
				if (address == null) {
					throw new Error('Blockscout_Rest: EvmNetworkAccount wallet address not normalized')
				}
				const wires = await getAddressTransactions({
					explorerOrigin: origin,
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
				}
			},
			})({
				fields: {
					$$transactions: (entity) => entity,
				},
			}),

			defineResolver(Source.Blockscout_Rest, {
				entityType: EntityType.EvmNetworkAccount,
			resolve: {
				[EvmNetworkAccountSelector.EvmNetworkEvmAccount]: async ({ $actor, $network }, context) => {
				const {
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
					blockscoutV2ItemsCountMax,
				} = await import('$/sources/Blockscout/Rest/constants.ts')
				const {
					getAddressTokenTransfers,
				} = await import('$/sources/Blockscout/Rest/queries.ts')
				const limit = Math.min(
					resolverContextRowLimit(context),
					blockscoutV2ItemsCountMax,
				)
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: chainIdFromEvmNetworkId($network),
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${chainIdFromEvmNetworkId($network)}`)
				}
				const address = hexLowerOfByteSize($actor.address, 20)
				if (address == null) {
					throw new Error('Blockscout_Rest: EvmNetworkAccount wallet address not normalized')
				}
				const wires = await getAddressTokenTransfers({
					explorerOrigin: origin,
					address,
					limit,
				})
				const entities = (
					evmTokenTransferEntitySelectorsFromBlockscoutAddresss({
						$network: $network,
						wires,
					})
						.map((entity) => ({
							[EntityMetaKey.Selector]: entity[EntityMetaKey.Selector],
						}))
					)
					return entities
				}
			},
			})({
				fields: {
					$$tokenTransfers: (entity) => entity,
				},
			}),

		defineResolver(Source.Blockscout_Rest, {
			entityType: EntityType.EvmNetworkAccount,
			resolve: {
				[EvmNetworkAccountSelector.EvmNetworkEvmAccount]: async ({ $actor, $network }, context) => {
				const {
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
					blockscoutV2ItemsCountMax,
				} = await import('$/sources/Blockscout/Rest/constants.ts')
				const {
					getAddressInternalTransactions,
				} = await import('$/sources/Blockscout/Rest/queries.ts')
				const limit = Math.min(
					resolverContextRowLimit(context),
					blockscoutV2ItemsCountMax,
				)
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: chainIdFromEvmNetworkId($network),
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${chainIdFromEvmNetworkId($network)}`)
				}
				const address = hexLowerOfByteSize($actor.address, 20)
				if (address == null) {
					throw new Error('Blockscout_Rest: EvmNetworkAccount wallet address not normalized')
				}
				const wires = await getAddressInternalTransactions({
					explorerOrigin: origin,
					address,
					limit,
				})
				return evmInternalTransferEntitySelectorsFromBlockscoutAddresss({
					$network: $network,
					wires,
				})
			}
			},
		})({
				fields: {
				$$internalTransfers: (entity) => entity,
			},
			}),

		defineResolver(Source.Blockscout_Rest, {
			entityType: EntityType.EvmNetworkAccount,
			resolve: {
				[EvmNetworkAccountSelector.EvmNetworkEvmAccount]: async ({ $actor, $network }) => {
				throw new Error(
					`Blockscout_Rest: $$erc20TokenAllowances unsupported for ${$actor.address} on chain ${chainIdFromEvmNetworkId($network)}; Blockscout token-transfers omit ERC-20 Approval events`,
				)
			}
			},
		})({
				fields: {
				$$erc20TokenAllowances: () => [],
			},
			}),

		defineResolver(Source.Blockscout_Rest, {
			entityType: EntityType.EvmNetwork,
			resolve: {
				[EvmNetworkSelector.Caip2]: async (entitySelector, context) => {
				const {
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
					blockscoutV2ItemsCountMax,
				} = await import('$/sources/Blockscout/Rest/constants.ts')
				const {
					getTransactionTokenTransfers,
					getTransactions,
				} = await import('$/sources/Blockscout/Rest/queries.ts')
				const chainId = chainIdFromEvmNetworkId(entitySelector)
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId,
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${chainId}`)
				}
				const limit = Math.min(
					resolverContextRowLimit(context),
					blockscoutV2ItemsCountMax,
				)
				const tokenTransfers: Entity<typeof schema, EntityType.EvmTokenTransfer>[] = []
				for (const transaction of await getTransactions({ explorerOrigin: origin, limit })) {
					const txHash = hexLowerOfByteSize(transaction.hash ?? '', 32)
					if (txHash == null) continue
					let wires: BlockscoutTokenTransfer[]
					try {
						wires = await getTransactionTokenTransfers({
							explorerOrigin: origin,
							txHash,
							limit: blockscoutV2ItemsCountMax,
						})
					} catch {
						continue
					}
					tokenTransfers.push(
						...evmTokenTransferEntitySelectorsFromBlockscoutWires({
							$network: entitySelector,
							txHash,
							wires,
						})
							.filter((tokenTransfer) => tokenTransfer.standard === EvmTokenStandard.Erc20),
					)
					if (tokenTransfers.length >= limit) return tokenTransfers.slice(0, limit)
				}
				return tokenTransfers
			}
			},
		})({
				fields: {
				$$erc20TokenTransfers: (entity) => entity,
			},
			}),

		defineResolver(Source.Blockscout_Rest, {
			entityType: EntityType.EvmNetwork,
			resolve: {
				[EvmNetworkSelector.Caip2]: async (entitySelector, context) => {
				const {
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
					blockscoutV2ItemsCountMax,
				} = await import('$/sources/Blockscout/Rest/constants.ts')
				const {
					getTransactionTokenTransfers,
					getTransactions,
				} = await import('$/sources/Blockscout/Rest/queries.ts')
				const chainId = chainIdFromEvmNetworkId(entitySelector)
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId,
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${chainId}`)
				}
				const limit = Math.min(
					resolverContextRowLimit(context),
					blockscoutV2ItemsCountMax,
				)
				const tokenTransfers: Entity<typeof schema, EntityType.EvmTokenTransfer>[] = []
				for (const transaction of await getTransactions({ explorerOrigin: origin, limit })) {
					const txHash = hexLowerOfByteSize(transaction.hash ?? '', 32)
					if (txHash == null) continue
					let wires: BlockscoutTokenTransfer[]
					try {
						wires = await getTransactionTokenTransfers({
							explorerOrigin: origin,
							txHash,
							limit: blockscoutV2ItemsCountMax,
						})
					} catch {
						continue
					}
					tokenTransfers.push(
						...evmTokenTransferEntitySelectorsFromBlockscoutWires({
							$network: entitySelector,
							txHash,
							wires,
						})
							.filter((tokenTransfer) => (
								tokenTransfer.standard === EvmTokenStandard.Erc721
								|| tokenTransfer.standard === EvmTokenStandard.Erc1155
							)),
					)
					if (tokenTransfers.length >= limit) return tokenTransfers.slice(0, limit)
				}
				return tokenTransfers
			}
			},
		})({
				fields: {
				$$nftTokenTransfers: (entity) => entity,
			},
			}),

		defineResolver(Source.Blockscout_Rest, {
			entityType: EntityType.EvmNetwork,
			resolve: {
				[EvmNetworkSelector.Caip2]: async (entitySelector, context) => {
				const {
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
					blockscoutV2ItemsCountMax,
				} = await import('$/sources/Blockscout/Rest/constants.ts')
				const limit = Math.min(
					resolverContextRowLimit(context),
					blockscoutV2ItemsCountMax,
				)
				const {
					normalizeAddressFromContractListWire,
					getSmartContracts,
				} = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: chainIdFromEvmNetworkId(entitySelector),
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${chainIdFromEvmNetworkId(entitySelector)}`)
				}
				const smartContracts = await getSmartContracts({ explorerOrigin: origin, limit })
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
			}
			},
		})({
				fields: {
				$$contracts: (entity) => entity,
			},
			}),

		defineResolver(Source.Blockscout_Rest, {
			entityType: EntityType.EvmNetwork,
			resolve: {
				[EvmNetworkSelector.Caip2]: async (entitySelector, context) => {
				const {
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
					blockscoutV2ItemsCountMax,
				} = await import('$/sources/Blockscout/Rest/constants.ts')
				const limit = Math.min(
					resolverContextRowLimit(context),
					blockscoutV2ItemsCountMax,
				)
				const { getErc4337SmartAccountList } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: chainIdFromEvmNetworkId(entitySelector),
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${chainIdFromEvmNetworkId(entitySelector)}`)
				}
				const wires = await getErc4337SmartAccountList({
					explorerOrigin: origin,
					limit,
				})
				return erc4337RegistryEntitiesFromBlockscoutWires<EntityType.Erc4337SmartAccount>({
					chainId: chainIdFromEvmNetworkId(entitySelector),
					items: wires,
				})
			}
			},
		})({
				fields: {
				$$erc4337SmartAccounts: (entity) => entity,
			},
			}),

		defineResolver(Source.Blockscout_Rest, {
			entityType: EntityType.EvmNetwork,
			resolve: {
				[EvmNetworkSelector.Caip2]: async (entitySelector, context) => {
				const {
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
					blockscoutV2ItemsCountMax,
				} = await import('$/sources/Blockscout/Rest/constants.ts')
				const limit = Math.min(
					resolverContextRowLimit(context),
					blockscoutV2ItemsCountMax,
				)
				const { getErc4337BundlerList } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: chainIdFromEvmNetworkId(entitySelector),
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${chainIdFromEvmNetworkId(entitySelector)}`)
				}
				let wires: BlockscoutErc4337RegistryEntry[]
				try {
					wires = await getErc4337BundlerList({
						explorerOrigin: origin,
					limit,
					})
				} catch {
							return []
				}
				return erc4337RegistryEntitiesFromBlockscoutWires<EntityType.Erc4337Bundler>({
					chainId: chainIdFromEvmNetworkId(entitySelector),
					items: wires,
				})
			}
			},
		})({
				fields: {
				$$erc4337Bundlers: (entity) => entity,
			},
			}),

		defineResolver(Source.Blockscout_Rest, {
			entityType: EntityType.EvmNetwork,
			resolve: {
				[EvmNetworkSelector.Caip2]: async (entitySelector, context) => {
				const {
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
					blockscoutV2ItemsCountMax,
				} = await import('$/sources/Blockscout/Rest/constants.ts')
				const limit = Math.min(
					resolverContextRowLimit(context),
					blockscoutV2ItemsCountMax,
				)
				const { getErc4337PaymasterList } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: chainIdFromEvmNetworkId(entitySelector),
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${chainIdFromEvmNetworkId(entitySelector)}`)
				}
				let wires: BlockscoutErc4337RegistryEntry[]
				try {
					wires = await getErc4337PaymasterList({
						explorerOrigin: origin,
					limit,
					})
				} catch {
							return []
				}
				return erc4337RegistryEntitiesFromBlockscoutWires<EntityType.Erc4337Paymaster>({
					chainId: chainIdFromEvmNetworkId(entitySelector),
					items: wires,
				})
			}
			},
		})({
				fields: {
				$$erc4337Paymasters: (entity) => entity,
			},
			}),

		defineResolver(Source.Blockscout_Rest, {
			entityType: EntityType.EvmNetwork,
			resolve: {
				[EvmNetworkSelector.Caip2]: async (entitySelector, context) => {
				const {
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
					blockscoutV2ItemsCountMax,
				} = await import('$/sources/Blockscout/Rest/constants.ts')
				const limit = Math.min(
					resolverContextRowLimit(context),
					blockscoutV2ItemsCountMax,
				)
				const { getErc4337AccountFactoryList } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: chainIdFromEvmNetworkId(entitySelector),
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${chainIdFromEvmNetworkId(entitySelector)}`)
				}
				let wires: BlockscoutErc4337RegistryEntry[]
				try {
					wires = await getErc4337AccountFactoryList({
						explorerOrigin: origin,
					limit,
					})
				} catch {
							return []
				}
				return erc4337RegistryEntitiesFromBlockscoutWires<EntityType.Erc4337AccountFactory>({
					chainId: chainIdFromEvmNetworkId(entitySelector),
					items: wires,
				})
			}
			},
		})({
				fields: {
				$$erc4337AccountFactories: (entity) => entity,
			},
			}),

		defineResolver(Source.Blockscout_Rest, {
			entityType: EntityType.EvmNetwork,
			resolve: {
				[EvmNetworkSelector.Caip2]: async (entitySelector, context) => {
				const {
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
					blockscoutV2ItemsCountMax,
				} = await import('$/sources/Blockscout/Rest/constants.ts')
				const limit = Math.min(
					resolverContextRowLimit(context),
					blockscoutV2ItemsCountMax,
				)
				const { getUserOperationsPage } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: chainIdFromEvmNetworkId(entitySelector),
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${chainIdFromEvmNetworkId(entitySelector)}`)
				}
				const wires = await getUserOperationsPage({ explorerOrigin: origin, limit })
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
									$network: evmNetworkIdFromChainId(chainIdFromEvmNetworkId(entitySelector)),
									hash: hashRaw,
								},
							} satisfies Entity<typeof schema, EntityType.EvmUserOperation>]
					})
				)
				return entities
			}
			},
		})({
				fields: {
				$$userOperations: (entity) => entity,
			},
			}),

		defineResolver(Source.Blockscout_Rest, {
			entityType: EntityType.EvmNetwork,
			resolve: {
				[EvmNetworkSelector.Caip2]: async (entitySelector) => {
				const stats = await blockscoutStatsForChain(chainIdFromEvmNetworkId(entitySelector))
				if (stats == null) {
					throw new Error(`Blockscout_Rest: no stats for chain ${chainIdFromEvmNetworkId(entitySelector)}`)
				}
				const observation = gasEstimateObservationFromBlockscoutStats(stats)
				if (observation == null) {
					throw new Error(`Blockscout_Rest: stats on chain ${chainIdFromEvmNetworkId(entitySelector)} have no gas estimate observation`)
				}
				return [
					{
						[EntityMetaKey.Selector]: {
							$network: entitySelector,
							timestampMs: observation.timestampMs,
						},
					},
				]
			}
			},
		})({
				fields: {
				$$gasEstimateTimestamps: (entity) => entity,
			},
			}),

		defineResolver(Source.Blockscout_Rest, {
			entityType: EntityType.Coin,
			resolve: {
				[CoinSelector.CoinId]: async ({ coinId }) => {
				const stats = await blockscoutStatsForNativeCoinId(coinId)
				if (stats == null) {
					throw new Error(`Blockscout_Rest: no native stats for coin ${coinId}`)
				}
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
						Date.now()
				)
				return [
					{
						[EntityMetaKey.Selector]: {
							$coin: { coinId: coinId },
							timestampMs,
						},
					},
				]
			}
			},
		})({
				fields: {
				$$timestamps: (entity) => entity,
			},
			}),

		defineResolver(Source.Blockscout_Rest, {
			entityType: EntityType.MarketPrice,
			resolve: {
				[MarketPriceSelector.Market]: async ({ $market }) => {
				if ($market.marketKind !== MarketKind.Spot) {
					throw new Error('Blockscout_Rest: MarketPrice $$quotes is spot-only')
				}
				const coinId = (
					$market.$base.kind === MarketAssetKind.Coin ?
						$market.$base.$coin.coinId
					:
						undefined
				)
				if (coinId == null) {
					throw new Error('Blockscout_Rest: market base is not a catalog coin')
				}
				const catalogMarketId = catalogCoinUsdMarketIdByCoinId[coinId]
				if (stringify($market) !== stringify(catalogMarketId)) {
					throw new Error('Blockscout_Rest: MarketPrice $$quotes only supports catalog native USD markets')
				}
				const stats = await blockscoutStatsForNativeCoinId(coinId)
				const price = usdPriceStringToPrice1e8(stats?.coin_price)
				if (stats == null || price == null) {
					throw new Error(`Blockscout_Rest: no native USD quote stats for coin ${coinId}`)
				}
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
						Date.now()
				)
				return [
					{
						[EntityMetaKey.Selector]: {
							$market: $market,
							timestampMs,
							feedKey: coinId,
						},
					},
				]
			}
			},
		})({
				fields: {
				$$quotes: (entity) => entity,
			},
			}),

		defineResolver(Source.Blockscout_Rest, {
			entityType: EntityType.EvmTransaction,
			resolve: {
				[EvmTransactionSelector.EvmNetworkTxHash]: async ({ $network, txHash }, context) => {
				const {
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
					blockscoutV2ItemsCountMax,
				} = await import('$/sources/Blockscout/Rest/constants.ts')
				const { getTransactionTokenTransfers } = await import('$/sources/Blockscout/Rest/queries.ts')
				const limit = Math.min(
					resolverContextRowLimit(context),
					blockscoutV2ItemsCountMax,
				)
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: chainIdFromEvmNetworkId($network),
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${chainIdFromEvmNetworkId($network)}`)
				}
				const wires = await getTransactionTokenTransfers({
					explorerOrigin: origin,
					txHash: txHash,
					limit,
				})
				return (
					evmTokenTransferEntitySelectorsFromBlockscoutWires({
						$network: $network,
						txHash: txHash,
						wires,
					})
						.map((entity) => ({
							[EntityMetaKey.Selector]: entity[EntityMetaKey.Selector],
						}))
				)
			}
			},
		})({
				fields: {
				$$tokenTransfers: (entity) => entity,
			},
			}),

		defineResolver(Source.Blockscout_Rest, {
			entityType: EntityType.EvmTransaction,
			resolve: {
				[EvmTransactionSelector.EvmNetworkTxHash]: async ({ $network, txHash }, context) => {
				const {
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
					blockscoutV2ItemsCountMax,
				} = await import('$/sources/Blockscout/Rest/constants.ts')
				const { getTransactionInternalTransactions } = await import('$/sources/Blockscout/Rest/queries.ts')
				const limit = Math.min(
					resolverContextRowLimit(context),
					blockscoutV2ItemsCountMax,
				)
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: chainIdFromEvmNetworkId($network),
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${chainIdFromEvmNetworkId($network)}`)
				}
				const wires = await getTransactionInternalTransactions({
					explorerOrigin: origin,
					txHash: txHash,
					limit,
				})
				return (
					evmInternalTransferEntitySelectorsFromBlockscoutWires({
						$network: $network,
						txHash: txHash,
						wires,
					})
				)
			}
			},
		})({
				fields: {
				$$internalTransfers: (entity) => entity,
			},
			}),

		defineResolver(Source.Blockscout_Rest, {
			entityType: EntityType.EvmTransaction,
			resolve: {
				[EvmTransactionSelector.EvmNetworkTxHash]: async ({ $network, txHash }, context) => {
				const {
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
					blockscoutV2ItemsCountMax,
					blockscoutErc4337OperationsSupported,
				} = await import('$/sources/Blockscout/Rest/constants.ts')
				if (!blockscoutErc4337OperationsSupported(chainIdFromEvmNetworkId($network))) {
					throw new Error(`Blockscout_Rest: ERC-4337 user operations not supported for chain ${chainIdFromEvmNetworkId($network)}`)
				}
				const limit = Math.min(
					resolverContextRowLimit(context),
					blockscoutV2ItemsCountMax,
				)
				const { getUserOperationsByTransaction } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: chainIdFromEvmNetworkId($network),
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${chainIdFromEvmNetworkId($network)}`)
				}
				const wires = await getUserOperationsByTransaction({
					explorerOrigin: origin,
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
							} satisfies Entity<typeof schema, EntityType.EvmUserOperation>]
					})
				)
			}
			},
		})({
				fields: {
				$$userOperations: (entity) => entity,
			},
			}),

			defineResolver(Source.Blockscout_Rest, {
				entityType: EntityType.EvmBlock,
			resolve: {
				[EvmBlockSelector.EvmNetworkBlockNumber]: async ({ $network, blockNumber }, context) => {
				const {
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
					blockscoutV2ItemsCountMax,
				} = await import('$/sources/Blockscout/Rest/constants.ts')
				const limit = Math.min(
					resolverContextRowLimit(context),
					blockscoutV2ItemsCountMax,
				)
				const { getBlockTransactions } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: chainIdFromEvmNetworkId($network),
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${chainIdFromEvmNetworkId($network)}`)
				}
				const wires = await getBlockTransactions({
					explorerOrigin: origin,
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
				}
			},
			})({
				fields: {
					$$transactions: (entity) => entity,
				},
			}),

		defineResolver(Source.Blockscout_Rest, {
			entityType: EntityType.EvmContract,
			resolve: {
				[EvmContractSelector.EvmNetworkAddress]: async ({ $network, address: addressSelector }) => {
				const { getAddressDetails } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = await requireBlockscoutV2ExplorerOrigin(chainIdFromEvmNetworkId($network))
				const address = hexLowerOfByteSize(addressSelector, 20)
				if (address == null) {
					throw new Error('Blockscout_Rest: address not normalized')
				}
				const details = await getAddressDetails({
					explorerOrigin: origin,
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
			}
			},
		})({
				fields: {
				$deployer: (entity) => entity,
			},
			}),

		defineResolver(Source.Blockscout_Rest, {
			entityType: EntityType.EvmContract,
			resolve: {
				[EvmContractSelector.EvmNetworkAddress]: async ({ $network, address: addressSelector }) => {
				const { getAddressDetails } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = await requireBlockscoutV2ExplorerOrigin(chainIdFromEvmNetworkId($network))
				const address = hexLowerOfByteSize(addressSelector, 20)
				if (address == null) {
					throw new Error('Blockscout_Rest: address not normalized')
				}
				const details = await getAddressDetails({
					explorerOrigin: origin,
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
			}
			},
		})({
				fields: {
				$creationTransaction: (entity) => entity,
			},
			}),

		defineResolver(Source.Blockscout_Rest, {
			entityType: EntityType.EvmContract,
			resolve: {
				[EvmContractSelector.EvmNetworkAddress]: async ({ $network, address: addressSelector }) => {
				const { getAddressDetails } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = await requireBlockscoutV2ExplorerOrigin(chainIdFromEvmNetworkId($network))
				const address = hexLowerOfByteSize(addressSelector, 20)
				if (address == null) {
					throw new Error('Blockscout_Rest: address not normalized')
				}
				const details = await getAddressDetails({
					explorerOrigin: origin,
					address,
				})
				const implementationAddress = details.implementations?.[0]?.address_hash
				if (implementationAddress != null) {
					const normalized = hexLowerOfByteSize(implementationAddress, 20)
					if (normalized != null) {
						return {
							[EntityMetaKey.Selector]: {
								$network: $network,
								address: normalized,
							},
						}
					}
				}
				const { getContractSourceCodeRow } = await import('$/sources/Blockscout/Rest/queries.ts')
				const sourceRow = await getContractSourceCodeRow({
					explorerOrigin: origin,
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
			}
			},
		})({
				fields: {
				$implementation: (entity) => entity,
			},
			}),

		defineResolver(Source.Blockscout_Rest, {
			entityType: EntityType.EvmContract,
			resolve: {
				[EvmContractSelector.EvmNetworkAddress]: async ({ $network, address: addressSelector }) => {
				const { getContractAbiJsonString } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = await requireBlockscoutV2ExplorerOrigin(chainIdFromEvmNetworkId($network))
				const address = hexLowerOfByteSize(addressSelector, 20)
				if (address == null) {
					throw new Error('Blockscout_Rest: address not normalized')
				}
				const abi = await getContractAbiJsonString({
					explorerOrigin: origin,
					address,
				})
				return abi == null ? undefined : evmAbiFromJsonString(abi)
			}
			},
		})({
				fields: {
				abi: (entity) => entity,
			},
			}),

		defineResolver(Source.Blockscout_Rest, {
			entityType: EntityType.EvmContract,
			resolve: {
				[EvmContractSelector.EvmNetworkAddress]: async ({ $network, address: addressSelector }) => {
				const { getCode } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = await requireBlockscoutV2ExplorerOrigin(chainIdFromEvmNetworkId($network))
				const address = hexLowerOfByteSize(addressSelector, 20)
				if (address == null) {
					throw new Error('Blockscout_Rest: address not normalized')
				}
				const codeHex = await getCode({
					explorerOrigin: origin,
					address,
				})
				if (codeHex == null) return undefined
				return evmContractRuntimeCodeFromGetCodeHex(codeHex)
			}
			},
		})({
				fields: {
				code: (entity) => entity,
			},
			}),

		defineResolver(Source.Blockscout_Rest, {
			entityType: EntityType.EvmContract,
			resolve: {
				[EvmContractSelector.EvmNetworkAddress]: async ({ $network, address: addressSelector }) => {
				const { getCode } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = await requireBlockscoutV2ExplorerOrigin(chainIdFromEvmNetworkId($network))
				const address = hexLowerOfByteSize(addressSelector, 20)
				if (address == null) {
					throw new Error('Blockscout_Rest: address not normalized')
				}
				const codeHex = await getCode({
					explorerOrigin: origin,
					address,
				})
				if (codeHex == null) return undefined
				return evmContractBytecodeHashFromGetCodeHex(codeHex)
			}
			},
		})({
				fields: {
				codeHash: (entity) => entity,
			},
			}),

		defineResolver(Source.Blockscout_Rest, {
			entityType: EntityType.EvmContract,
			resolve: {
				[EvmContractSelector.EvmNetworkAddress]: async ({ $network, address: addressSelector }, context) => {
				const {
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				} = await import('$/sources/Blockscout/Rest/constants.ts')
				const { getStorageAt } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: chainIdFromEvmNetworkId($network),
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${chainIdFromEvmNetworkId($network)}`)
				}
				const address = hexLowerOfByteSize(addressSelector, 20)
				if (address == null) {
					throw new Error('Blockscout_Rest: EvmContract address not normalized')
				}
				const depth = Math.min(32, Math.max(1, resolverContextRowLimit(context)))
				return evmContractStorageSlotReadsFromEthGetStorageAt({
					address,
					depth,
					getStorageAt: (slotQuantityHex) => (
						getStorageAt({
							explorerOrigin: origin,
							address,
							slotQuantityHex,
						}).then((valueHex) => {
							if (valueHex == null) throw new Error('Blockscout_Rest: eth_getStorageAt returned no result')
							return valueHex
						})
					),
				})
			}
			},
		})({
				fields: {
				storageSlotReads: (entity) => entity,
			},
			}),
	],
}
