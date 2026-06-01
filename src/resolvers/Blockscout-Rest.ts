import { stringify } from 'devalue'
import { keccak256, toHex } from '@tevm/voltaire/Hash'
import { toBytes } from '@tevm/voltaire/Hex'
import { hexLowerOfByteSize, with0xHex, zeroExLowerCase } from '$/lib/hexLowerOfByteSize.ts'
import { singleFlight } from '$/lib/singleFlight.ts'
import {
	defineEntityFieldResolver,
	defineEntityResolver,
	resolverLoadSubsetRowLimit,
} from '$/resolvers/$resolvers.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { schema } from '$/schema/index.ts'
import type { Entity, EntityId } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'
import {
	EvmInternalCallType,
	EvmLogInterpretationKind,
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

type EvmNetworkId = {
	caip2: {
		namespace: 'eip155'
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
		tokenTransfers.push({ slot: slotNormalized, value })
	}
	return tokenTransfers
}

const ERC20_TRANSFER_TOPIC = (
	'0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
)
const ERC20_APPROVAL_TOPIC = (
	'0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e80d49a8a6f947aeb'
)
const UNISWAP_V2_SWAP_TOPIC = (
	'0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822'
)
const UNISWAP_V3_SWAP_TOPIC = (
	'0xc42079f94a6350d7e6235f29174924f928cc2ac818eb64fed8004e115fbcca67'
)

const evmLogInterpretationKindFromTopics = (
	topics: readonly string[],
): EvmLogInterpretationKind => {
	const topic0 = topics[0]?.toLowerCase()
	if (topic0 == null) return EvmLogInterpretationKind.Unknown
	if (topic0 === ERC20_TRANSFER_TOPIC.toLowerCase()) return EvmLogInterpretationKind.Transfer
	if (topic0 === ERC20_APPROVAL_TOPIC.toLowerCase()) return EvmLogInterpretationKind.Approval
	if (
		topic0 === UNISWAP_V2_SWAP_TOPIC.toLowerCase()
		|| topic0 === UNISWAP_V3_SWAP_TOPIC.toLowerCase()
	) {
		return EvmLogInterpretationKind.Swap
	}
	return EvmLogInterpretationKind.Unknown
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

const evmLogEntityIdFromWire = ({
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
	entityId: Entity<typeof schema, EntityType.EvmLog>[typeof EntityMetaKey.Id],
	log: RpcLog,
): Entity<typeof schema, EntityType.EvmLog> => {
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
		[EntityMetaKey.Id]: entityId,
		topics,
		interpretationKind: evmLogInterpretationKindFromTopics(topics),
		...(address != null && { address }),
		...(data != null && { data }),
		...(blockNumber != null && { blockNumber }),
		...(blockHash != null && { blockHash }),
		...(transactionIndex != null && { transactionIndex }),
		...(log.removed != null && { removed: log.removed }),
		...(address != null && {
			$emitter: {
				[EntityMetaKey.Id]: {
					$network: entityId.$network,
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
	))(raw.trim().toLowerCase())
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
}): Entity<typeof schema, EntityType.EvmInternalTransfer> | undefined => {
	const normalizedTxHash = hexLowerOfByteSize(txHash, 32)
	const internalIndex = wire.index
	if (normalizedTxHash == null || internalIndex == null || internalIndex < 0) return undefined
	const fromAddress = hexLowerOfByteSize(wire.from?.hash ?? '', 20)
	const toAddress = hexLowerOfByteSize(wire.to?.hash ?? '', 20)
	const createdAddress = hexLowerOfByteSize(wire.created_contract?.hash ?? '', 20)
	const value = blockscoutQuantityToBigInt(wire.value) ?? 0n
	const callType = evmInternalCallTypeFromWire(wire.type)
	return {
		[EntityMetaKey.Id]: {
			$network,
			txHash: normalizedTxHash,
			internalIndex,
		},
		value,
		...(callType != null && { callType }),
		...(wire.success != null && { success: wire.success }),
		...(fromAddress != null && {
			$from: {
				[EntityMetaKey.Id]: { address: fromAddress },
			} satisfies Entity<typeof schema, EntityType.EvmAccount>,
		}),
		...(toAddress != null && {
			$to: {
				[EntityMetaKey.Id]: { address: toAddress },
			} satisfies Entity<typeof schema, EntityType.EvmAccount>,
		}),
		...(createdAddress != null && (
			callType === EvmInternalCallType.Create
			|| callType === EvmInternalCallType.Create2
		) && {
			$createdContract: {
				[EntityMetaKey.Id]: {
					$network,
					address: createdAddress,
				},
			} satisfies Entity<typeof schema, EntityType.EvmContract>,
		}),
	}
}

const evmInternalTransferEntityIdsFromBlockscoutWires = ({
	$network,
	txHash,
	wires,
}: {
	$network: EvmNetworkId
	txHash: `0x${string}`
	wires: readonly BlockscoutInternalTransaction[]
}): Entity<typeof schema, EntityType.EvmInternalTransfer>[] => (
	wires.flatMap((wire) => {
		const entity = evmInternalTransferEntityFromWire({
			$network,
			txHash,
			wire,
		})
		return entity == null ? [] : [entity]
	})
)

const evmInternalTransferEntityIdsFromBlockscoutAddresss = ({
	$network,
	wires,
}: {
	$network: EvmNetworkId
	wires: readonly BlockscoutInternalTransaction[]
}): Entity<typeof schema, EntityType.EvmInternalTransfer>[] => {
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
					evmInternalTransferEntityIdsFromBlockscoutWires({
						$network,
						txHash: normalizedTxHash,
						wires: txWires,
					})
			})
	)
}

const findBlockscoutInternalTransferWireForEntityId = (
	wires: readonly BlockscoutInternalTransaction[],
	entityId: Entity<typeof schema, EntityType.EvmInternalTransfer>[typeof EntityMetaKey.Id],
): BlockscoutInternalTransaction | undefined => (
	wires.find((wire) => wire.index === entityId.internalIndex)
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
}): Entity<typeof schema, EntityType.EvmTokenTransfer> => ({
	[EntityMetaKey.Id]: {
		$network,
		txHash,
		logIndex,
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
			[EntityMetaKey.Id]: { address: fromAddress },
		} satisfies Entity<typeof schema, EntityType.EvmAccount>,
	}),
	...(toAddress != null && {
		$to: {
			[EntityMetaKey.Id]: { address: toAddress },
		} satisfies Entity<typeof schema, EntityType.EvmAccount>,
	}),
	...(tokenAddress != null && {
		$tokenContract: {
			[EntityMetaKey.Id]: {
				$network,
				address: tokenAddress,
			},
		} satisfies Entity<typeof schema, EntityType.EvmContract>,
		...(standard === EvmTokenStandard.Erc20 && {
			$coinInstance: {
				[EntityMetaKey.Id]: {
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
}): Entity<typeof schema, EntityType.EvmTokenTransfer> | undefined => {
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

const evmTokenTransferEntityIdsFromBlockscoutWires = ({
	$network,
	txHash,
	wires,
}: {
	$network: EvmNetworkId
	txHash: `0x${string}`
	wires: readonly BlockscoutTokenTransfer[]
}): Entity<typeof schema, EntityType.EvmTokenTransfer>[] => (
	wires.flatMap((wire) => {
		const entity = evmTokenTransferEntityFromWire({
			$network,
			txHash,
			wire,
		})
		return entity == null ? [] : [entity]
	})
)

const evmTokenTransferEntityIdsFromBlockscoutAddresss = ({
	$network,
	wires,
}: {
	$network: EvmNetworkId
	wires: readonly BlockscoutTokenTransfer[]
}): Entity<typeof schema, EntityType.EvmTokenTransfer>[] => {
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
					evmTokenTransferEntityIdsFromBlockscoutWires({
						$network,
						txHash: normalizedTxHash,
						wires: txWires,
					})
			})
	)
}

const findBlockscoutTokenTransferForEntityId = (
	wires: readonly BlockscoutTokenTransfer[],
	entityId: Entity<typeof schema, EntityType.EvmTokenTransfer>[typeof EntityMetaKey.Id],
): BlockscoutTokenTransfer | undefined => (
	wires.find((wire) => (
		blockscoutLogIndexFromWire(wire.log_index) === entityId.logIndex
	))
)

const usdPriceStringToPrice1e8 = (
	raw: string | undefined,
): bigint | undefined => {
	if (raw == null || raw.trim() === '') return undefined
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
	return singleFlight(getStats)({ explorerOrigin: origin })
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
	entityId:
		| EntityId<typeof schema, EntityType.Erc4337SmartAccount>
		| EntityId<typeof schema, EntityType.Erc4337Paymaster>
		| EntityId<typeof schema, EntityType.Erc4337AccountFactory>,
) => ({
	$contract: {
		[EntityMetaKey.Id]: {
			$network: entityId.$network,
			address: entityId.address,
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
					[EntityMetaKey.Id]: {
						$network: evmNetworkIdFromChainId(chainId),
						address,
					},
				}]
	})
	return entities
}

export default {
	source: Source.Blockscout_Rest,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.EvmBlock,
			resolve: async (entityId) => {
				const {
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				} = await import('$/sources/Blockscout/Rest/constants.ts')
				const { getBlockByNumber } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: chainIdFromEvmNetworkId(entityId.$network),
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${chainIdFromEvmNetworkId(entityId.$network)}`)
				}
				const header = await singleFlight(getBlockByNumber)({
					explorerOrigin: origin,
					blockNumber: entityId.blockNumber,
				})
				if (header == null) {
					throw new Error('Blockscout_Rest: block header not returned for EvmBlock')
				}
				const evmBlockEntityFromRpcHeaderWire = ({
					chainId,
					blockNumber,
					wire,
				}: {
					chainId: number
					blockNumber: bigint
					wire: RpcBlockHeader
				}): Entity<typeof schema, EntityType.EvmBlock> => {
					const parentBlockNumber = blockNumber > 0n ? blockNumber - 1n : undefined
					const blockHash = (
						wire.hash != null ?
							hexLowerOfByteSize(wire.hash, 32)
						:
							undefined
					)
					const timestampSeconds = (
						wire.timestamp != null ? ((parsed) => (
							Number.isFinite(parsed) && Number.isInteger(parsed) && parsed >= 0 ?
								parsed
							:
								NaN
						))(Number(wire.timestamp))
						:
							NaN
					)
					const gasUsed = (
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
					)
					const gasLimit = (
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
					)
					const baseFeePerGas = (
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
					)
					const blobGasUsed = (
						wire.blobGasUsed != null ? ((value) => (
							value == null || value < 0n ? undefined : value
						))((() => {
							try {
								return BigInt(wire.blobGasUsed)
							} catch {
								return undefined
							}
						})())
						:
							undefined
					)
					const excessBlobGas = (
						wire.excessBlobGas != null ? ((value) => (
							value == null || value < 0n ? undefined : value
						))((() => {
							try {
								return BigInt(wire.excessBlobGas)
							} catch {
								return undefined
							}
						})())
						:
							undefined
					)
					const miner = (
						wire.miner != null ?
							hexLowerOfByteSize(wire.miner, 20)
						:
							undefined
					)
					const base = {
						[EntityMetaKey.Id]: {
							$network: evmNetworkIdFromChainId(chainId),
							blockNumber,
							...(blockHash != null && { hash: blockHash }),
						},
						number: blockNumber,
						timestamp: ((timestampSeconds) => (
							Number.isFinite(timestampSeconds) ? timestampSeconds * 1000 : undefined
						))(timestampSeconds),
						gasUsed,
						gasLimit,
						baseFeePerGas,
						blobGasUsed,
						excessBlobGas,
						transactionCount: (wire.transactions ?? []).length,
					}
					return {
						...base,
						...(parentBlockNumber != null && {
								$parent: {
									[EntityMetaKey.Id]: {
										$network: evmNetworkIdFromChainId(chainId),
										blockNumber: parentBlockNumber,
									},
									number: parentBlockNumber,
								} satisfies Entity<typeof schema, EntityType.EvmBlock>,
							}),
						...(miner != null && {
								$miner: {
									[EntityMetaKey.Id]: {
										address: miner,
									},
								},
							}),
					}
				}
				return evmBlockEntityFromRpcHeaderWire({
					chainId: chainIdFromEvmNetworkId(entityId.$network),
					blockNumber: entityId.blockNumber,
					wire: header,
				})
			},
		}),

		defineEntityResolver({
			entityType: EntityType.EvmTransaction,
			resolve: async (entityId) => {
				const {
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				} = await import('$/sources/Blockscout/Rest/constants.ts')
				const {
					getTransactionByHash,
					getTransactionReceipt,
				} = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: chainIdFromEvmNetworkId(entityId.$network),
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${chainIdFromEvmNetworkId(entityId.$network)}`)
				}
				const jsonRpcTransaction = await singleFlight(getTransactionByHash)({
					explorerOrigin: origin,
					txHash: entityId.txHash,
				})
				if (jsonRpcTransaction == null) {
					throw new Error('Blockscout_Rest: transaction not returned for EvmTransaction')
				}
				const networkChainId = chainIdFromEvmNetworkId(entityId.$network)
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
						(hexLowerOfByteSize(jsonRpcTransaction.hash, 32) ?? entityId.txHash)
					:
						entityId.txHash
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
					[EntityMetaKey.Id]: {
						$network: evmNetworkIdFromChainId(networkChainId),
						txHash,
					},
					...(containingBlockNumber != null && {
							$block: {
								[EntityMetaKey.Id]: {
									$network: evmNetworkIdFromChainId(networkChainId),
									blockNumber: containingBlockNumber,
								},
								number: containingBlockNumber,
							} satisfies Entity<typeof schema, EntityType.EvmBlock>,
						}),
					...(from != null && {
							$from: {
								[EntityMetaKey.Id]: {
									address: from,
								},
							} satisfies Entity<typeof schema, EntityType.EvmAccount>,
						}),
					...(to != null && {
							$to: {
								[EntityMetaKey.Id]: {
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
				const receipt = await singleFlight(getTransactionReceipt)({
					explorerOrigin: origin,
					txHash: entityId.txHash,
				})
				const createdContractAddress = (
					receipt?.contractAddress != null ?
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
					...(receipt == null && { executionStatus: EvmTransactionExecutionStatus.Pending }),
					...(Number(receipt?.status) === 1 && { executionStatus: EvmTransactionExecutionStatus.Success }),
					...(Number(receipt?.status) === 0 && { executionStatus: EvmTransactionExecutionStatus.Failed }),
					...(receipt?.gasUsed != null && ((value) => (
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
					...(receipt?.cumulativeGasUsed != null && ((value) => (
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
					...(receipt?.effectiveGasPrice != null && ((value) => (
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
					...(receipt?.contractAddress != null && ((address) => (
						address != null && {
							$contract: {
								[EntityMetaKey.Id]: {
									$network: entityId.$network,
									address,
								},
							} satisfies Entity<typeof schema, EntityType.EvmContract>,
						}
					))(createdContractAddress)),
					traceUnavailable: true,
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.EvmLog,
			resolve: async (entityId) => {
				const {
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				} = await import('$/sources/Blockscout/Rest/constants.ts')
				const { getTransactionReceipt } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: chainIdFromEvmNetworkId(entityId.$network),
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${chainIdFromEvmNetworkId(entityId.$network)}`)
				}
				const receipt = await singleFlight(getTransactionReceipt)({
					explorerOrigin: origin,
					txHash: entityId.txHash,
				})
				const log = findReceiptLogWireForEvmLogId(receipt?.logs, entityId.logIndex)
				if (log == null) {
					throw new Error('Blockscout_Rest: receipt log not found for EvmLog')
				}
				return evmLogEntityFromIdAndWire(entityId, log)
			},
		}),

		defineEntityResolver({
			entityType: EntityType.EvmTokenTransfer,
			resolve: async (entityId) => {
				const {
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
					blockscoutV2ItemsCountMax,
				} = await import('$/sources/Blockscout/Rest/constants.ts')
				const { getTransactionTokenTransfers } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: chainIdFromEvmNetworkId(entityId.$network),
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${chainIdFromEvmNetworkId(entityId.$network)}`)
				}
				const wires = await singleFlight(getTransactionTokenTransfers)({
					explorerOrigin: origin,
					txHash: entityId.txHash,
					limit: blockscoutV2ItemsCountMax,
				})
				const wire = findBlockscoutTokenTransferForEntityId(wires, entityId)
				if (wire == null) {
					throw new Error('Blockscout_Rest: token transfer not found for EvmTokenTransfer')
				}
				const entity = evmTokenTransferEntityFromWire({
					$network: entityId.$network,
					txHash: entityId.txHash,
					transferIndex: entityId.logIndex,
					wire,
				})
				if (entity == null) {
					throw new Error('Blockscout_Rest: token transfer wire did not map to EvmTokenTransfer')
				}
				return entity
			},
		}),

		defineEntityResolver({
			entityType: EntityType.EvmInternalTransfer,
			resolve: async (entityId) => {
				const {
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
					blockscoutV2ItemsCountMax,
				} = await import('$/sources/Blockscout/Rest/constants.ts')
				const { getTransactionInternalTransactions } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: chainIdFromEvmNetworkId(entityId.$network),
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${chainIdFromEvmNetworkId(entityId.$network)}`)
				}
				const wires = await singleFlight(getTransactionInternalTransactions)({
					explorerOrigin: origin,
					txHash: entityId.txHash,
					limit: blockscoutV2ItemsCountMax,
				})
				const wire = findBlockscoutInternalTransferWireForEntityId(wires, entityId)
				if (wire == null) {
					throw new Error('Blockscout_Rest: internal transfer not found for EvmInternalTransfer')
				}
				const entity = evmInternalTransferEntityFromWire({
					$network: entityId.$network,
					txHash: entityId.txHash,
					wire,
				})
				if (entity == null) {
					throw new Error('Blockscout_Rest: internal transfer wire did not map to EvmInternalTransfer')
				}
				return entity
			},
		}),

		defineEntityResolver({
			entityType: EntityType.Erc4337SmartAccount,
			resolve: async (entityId) => {
				const {
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				} = await import('$/sources/Blockscout/Rest/constants.ts')
				const { getErc4337SmartAccountDetail } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: chainIdFromEvmNetworkId(entityId.$network),
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${chainIdFromEvmNetworkId(entityId.$network)}`)
				}
				const wire = await singleFlight(getErc4337SmartAccountDetail)({
					explorerOrigin: origin,
					address: entityId.address,
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
					...erc4337ContractField(entityId),
					...(factoryAddress != null && {
						$factory: {
							[EntityMetaKey.Id]: {
								$network: entityId.$network,
								address: factoryAddress,
							},
						} satisfies Entity<typeof schema, EntityType.Erc4337AccountFactory>,
					}),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.Erc4337Bundler,
			resolve: async (entityId) => {
				const {
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				} = await import('$/sources/Blockscout/Rest/constants.ts')
				const { getErc4337BundlerDetail } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: chainIdFromEvmNetworkId(entityId.$network),
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${chainIdFromEvmNetworkId(entityId.$network)}`)
				}
				const wire = await singleFlight(getErc4337BundlerDetail)({
					explorerOrigin: origin,
					address: entityId.address,
				})
				return erc4337RegistryFieldsFromBlockscoutWire(
					EntityType.Erc4337Bundler,
					wire,
				)
			},
		}),

		defineEntityResolver({
			entityType: EntityType.Erc4337Paymaster,
			resolve: async (entityId) => {
				const {
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				} = await import('$/sources/Blockscout/Rest/constants.ts')
				const { getErc4337PaymasterDetail } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: chainIdFromEvmNetworkId(entityId.$network),
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${chainIdFromEvmNetworkId(entityId.$network)}`)
				}
				const wire = await singleFlight(getErc4337PaymasterDetail)({
					explorerOrigin: origin,
					address: entityId.address,
				})
				return {
					...erc4337RegistryFieldsFromBlockscoutWire(
						EntityType.Erc4337Paymaster,
						wire,
					),
					...erc4337ContractField(entityId),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.Erc4337AccountFactory,
			resolve: async (entityId) => {
				const {
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				} = await import('$/sources/Blockscout/Rest/constants.ts')
				const { getErc4337AccountFactoryDetail } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: chainIdFromEvmNetworkId(entityId.$network),
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${chainIdFromEvmNetworkId(entityId.$network)}`)
				}
				const wire = await singleFlight(getErc4337AccountFactoryDetail)({
					explorerOrigin: origin,
					address: entityId.address,
				})
				return {
					...erc4337RegistryFieldsFromBlockscoutWire(
						EntityType.Erc4337AccountFactory,
						wire,
					),
					...erc4337ContractField(entityId),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.EvmUserOperation,
			resolve: async (entityId) => {
				const {
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				} = await import('$/sources/Blockscout/Rest/constants.ts')
				const {
					getUserOperationDetail,
				} = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: chainIdFromEvmNetworkId(entityId.$network),
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${chainIdFromEvmNetworkId(entityId.$network)}`)
				}
				const wire = await singleFlight(getUserOperationDetail)({
					explorerOrigin: origin,
					hash: entityId.hash,
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
				const feeTrimmed = wire.fee?.trim() || undefined
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
				const entryPointVersion = wire.entry_point_version?.trim() || undefined
				const sponsorType = wire.sponsor_type?.trim() || undefined
				return {
					...(bundledTransactionHash != null && {
						$bundledTransaction: {
							[EntityMetaKey.Id]: {
								$network: entityId.$network,
								txHash: bundledTransactionHash,
							},
						} satisfies Entity<typeof schema, EntityType.EvmTransaction>,
					}),
					...(senderAddress != null && {
						$sender: {
							[EntityMetaKey.Id]: {
								$network: entityId.$network,
								address: senderAddress,
							},
						} satisfies Entity<typeof schema, EntityType.Erc4337SmartAccount>,
					}),
					...(paymasterAddress != null && {
						$paymaster: {
							[EntityMetaKey.Id]: {
								$network: entityId.$network,
								address: paymasterAddress,
							},
						} satisfies Entity<typeof schema, EntityType.Erc4337Paymaster>,
					}),
					...(bundlerAddress != null && {
						$bundler: {
							[EntityMetaKey.Id]: {
								$network: entityId.$network,
								address: bundlerAddress,
							},
						} satisfies Entity<typeof schema, EntityType.Erc4337Bundler>,
					}),
					...(entryPointAddress != null && {
						$entryPoint: {
							[EntityMetaKey.Id]: {
								$network: entityId.$network,
								address: entryPointAddress,
							},
						} satisfies Entity<typeof schema, EntityType.EvmContract>,
					}),
					...(blockNumber != null && {
						$block: {
							[EntityMetaKey.Id]: {
								$network: entityId.$network,
								blockNumber,
							},
						} satisfies Entity<typeof schema, EntityType.EvmBlock>,
					}),
					...(timestampMs != undefined && { timestampMs }),
					...(wire.status === false || wire.status === true ? { successful: wire.status }
					:
						{}),
					...(feeTrimmed != null && { fee: feeTrimmed }),
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
		}),

		defineEntityResolver({
			entityType: EntityType.EvmNetworkAccount,
			resolve: async (entityId) => {
				const {
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				} = await import('$/sources/Blockscout/Rest/constants.ts')
				const {
					getAddressCounters,
					getAddressDetails,
				} = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: chainIdFromEvmNetworkId(entityId.$network),
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${chainIdFromEvmNetworkId(entityId.$network)}`)
				}
				const address = hexLowerOfByteSize(entityId.$actor.address, 20)
				if (address == null) {
					throw new Error('Blockscout_Rest: EvmNetworkAccount wallet address not normalized')
				}
				const details = await getAddressDetails({ explorerOrigin: origin, address })
				const counters = await getAddressCounters({ explorerOrigin: origin, address })
				const transactionsCount = (
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
					...(details.is_contract === true || details.is_contract === false ?
							{ isContract: details.is_contract === true }
						:
							{}),
					...(transactionsCount != null && {
						transactionsCount,
					}),
					...(tokenTransferCount != null && {
						tokenTransferCount: Number(tokenTransferCount),
					}),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.Market_Timestamp,
			resolve: async (entityId) => {
				if (entityId.$market.marketKind !== MarketKind.Spot) {
					throw new Error('Blockscout_Rest: Market_Timestamp is spot-only')
				}
				const coinId = (
					entityId.$market.$base.kind === MarketAssetKind.Coin ?
						entityId.$market.$base.$coin.coinId
					:
						undefined
				)
				if (coinId == null) {
					throw new Error('Blockscout_Rest: market base is not a catalog coin')
				}
				const catalogMarketId = catalogCoinUsdMarketIdByCoinId[coinId]
				if (stringify(entityId.$market) !== stringify(catalogMarketId)) {
					throw new Error('Blockscout_Rest: Market_Timestamp only supports catalog USD spot markets')
				}
				const stats = await blockscoutStatsForNativeCoinId(coinId)
				const price = usdPriceStringToPrice1e8(stats?.coin_price)
				if (stats == null || price == null) {
					throw new Error(`Blockscout_Rest: Market_Timestamp unsupported for coin ${coinId}`)
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
				if (entityId.timestampMs !== timestampMs) {
					throw new Error('Blockscout_Rest: Market_Timestamp id does not match stats clock')
				}
				return {
					price,
					transport: 'blockscout-stats-usd-1e8',
					...(coinId !== undefined && { providerAssetId: coinId }),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.EvmNetwork_GasEstimate_Timestamp,
			resolve: async (entityId) => {
				const stats = await blockscoutStatsForChain(chainIdFromEvmNetworkId(entityId.$network))
				if (stats == null) {
					throw new Error(
						`Blockscout_Rest: EvmNetwork_GasEstimate_Timestamp unsupported for chain ${String(chainIdFromEvmNetworkId(entityId.$network))}`,
					)
				}
				const observation = gasEstimateObservationFromBlockscoutStats(stats)
				if (observation == null) {
					throw new Error('Blockscout_Rest: stats missing gas_prices tiers')
				}
				if (entityId.timestampMs !== observation.timestampMs) {
					throw new Error('Blockscout_Rest: EvmNetwork_GasEstimate_Timestamp id does not match stats clock')
				}
				return {
					...(observation.slowGwei != null && { slowGwei: observation.slowGwei }),
					...(observation.averageGwei != null && { averageGwei: observation.averageGwei }),
					...(observation.fastGwei != null && { fastGwei: observation.fastGwei }),
					...(observation.transport != null && { transport: observation.transport }),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.Coin_Timestamp,
			resolve: async (entityId) => {
				const stats = await blockscoutStatsForNativeCoinId(entityId.$coin.coinId)
				if (stats == null) {
					throw new Error(`Blockscout_Rest: Coin_Timestamp unsupported for coin ${entityId.$coin.coinId}`)
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
				if (entityId.timestampMs !== timestampMs) {
					throw new Error('Blockscout_Rest: Coin_Timestamp id does not match stats clock')
				}
				const marketCapUsd = (() => {
					const raw = stats?.market_cap
					if (raw == null || raw.trim() === '') return undefined
					const usd = Number(raw)
					return Number.isFinite(usd) && usd >= 0 ?
							usd
						:
							undefined
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
					...(entityId.$coin.coinId != null && {
						providerAssetId: entityId.$coin.coinId,
					}),
				}
			},
		}),
	],

	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType.EvmNetwork,
			fieldName: '$$blocks',
			resolve: async (entityId, context) => {
				const {
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
					blockscoutV2ItemsCountMax,
				} = await import('$/sources/Blockscout/Rest/constants.ts')
				const limit = Math.min(
					resolverLoadSubsetRowLimit(context),
					blockscoutV2ItemsCountMax,
				)
				const { getBlocks } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: chainIdFromEvmNetworkId(entityId),
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${chainIdFromEvmNetworkId(entityId)}`)
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
								[EntityMetaKey.Id]: {
									$network: evmNetworkIdFromChainId(chainIdFromEvmNetworkId(entityId)),
									blockNumber,
									...(blockHash != null && { hash: blockHash }),
								},
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
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EvmNetwork,
			fieldName: '$$transactions',
			resolve: async (entityId, context) => {
				const {
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
					blockscoutV2ItemsCountMax,
				} = await import('$/sources/Blockscout/Rest/constants.ts')
				const limit = Math.min(
					resolverLoadSubsetRowLimit(context),
					blockscoutV2ItemsCountMax,
				)
				const { getTransactions } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: chainIdFromEvmNetworkId(entityId),
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${chainIdFromEvmNetworkId(entityId)}`)
				}
				const wires = await getTransactions({ explorerOrigin: origin, limit })
				return (
					wires
						.flatMap((wire) => {
							const txHash = wire.hash != null ? hexLowerOfByteSize(wire.hash, 32)
							:
								undefined
							return txHash == null ?
									[]
								:
									[{
										[EntityMetaKey.Id]: {
											$network: evmNetworkIdFromChainId(chainIdFromEvmNetworkId(entityId)),
											txHash,
										},
									}]
						})
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EvmNetworkAccount,
			fieldName: '$$transactions',
			resolve: async (entityId, context) => {
				const {
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
					blockscoutV2ItemsCountMax,
				} = await import('$/sources/Blockscout/Rest/constants.ts')
				const limit = Math.min(
					resolverLoadSubsetRowLimit(context),
					blockscoutV2ItemsCountMax,
				)
				const { getAddressTransactions } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: chainIdFromEvmNetworkId(entityId.$network),
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${chainIdFromEvmNetworkId(entityId.$network)}`)
				}
				const address = hexLowerOfByteSize(entityId.$actor.address, 20)
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
							const txHash = wire.hash != null ? hexLowerOfByteSize(wire.hash, 32)
							:
								undefined
							return txHash == null ?
								[]
							:
								[{
										[EntityMetaKey.Id]: {
											$network: evmNetworkIdFromChainId(chainIdFromEvmNetworkId(entityId.$network)),
											txHash,
										},
									}]
						})
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EvmNetworkAccount,
			fieldName: '$$tokenTransfers',
			resolve: async (entityId, context) => {
				const {
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
					blockscoutV2ItemsCountMax,
				} = await import('$/sources/Blockscout/Rest/constants.ts')
				const {
					getAddressTokenTransfers,
				} = await import('$/sources/Blockscout/Rest/queries.ts')
				const limit = Math.min(
					resolverLoadSubsetRowLimit(context),
					blockscoutV2ItemsCountMax,
				)
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: chainIdFromEvmNetworkId(entityId.$network),
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${chainIdFromEvmNetworkId(entityId.$network)}`)
				}
				const address = hexLowerOfByteSize(entityId.$actor.address, 20)
				if (address == null) {
					throw new Error('Blockscout_Rest: EvmNetworkAccount wallet address not normalized')
				}
				const wires = await getAddressTokenTransfers({
					explorerOrigin: origin,
					address,
					limit,
				})
				const entities = (
					evmTokenTransferEntityIdsFromBlockscoutAddresss({
						$network: entityId.$network,
						wires,
					})
						.map((entity) => ({
							[EntityMetaKey.Id]: entity[EntityMetaKey.Id],
						}))
				)
				return entities
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EvmNetworkAccount,
			fieldName: '$$internalTransactions',
			resolve: async (entityId, context) => {
				const {
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
					blockscoutV2ItemsCountMax,
				} = await import('$/sources/Blockscout/Rest/constants.ts')
				const {
					getAddressInternalTransactions,
				} = await import('$/sources/Blockscout/Rest/queries.ts')
				const limit = Math.min(
					resolverLoadSubsetRowLimit(context),
					blockscoutV2ItemsCountMax,
				)
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: chainIdFromEvmNetworkId(entityId.$network),
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${chainIdFromEvmNetworkId(entityId.$network)}`)
				}
				const address = hexLowerOfByteSize(entityId.$actor.address, 20)
				if (address == null) {
					throw new Error('Blockscout_Rest: EvmNetworkAccount wallet address not normalized')
				}
				const wires = await getAddressInternalTransactions({
					explorerOrigin: origin,
					address,
					limit,
				})
				const entities = (
					evmInternalTransferEntityIdsFromBlockscoutAddresss({
						$network: entityId.$network,
						wires,
					})
						.map((entity) => ({
							[EntityMetaKey.Id]: entity[EntityMetaKey.Id],
						}))
				)
				return entities
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EvmNetworkAccount,
			fieldName: '$$erc20TokenAllowances',
			resolve: async (entityId) => {
				throw new Error(
					`Blockscout_Rest: $$erc20TokenAllowances unsupported for ${entityId.$actor.address} on chain ${chainIdFromEvmNetworkId(entityId.$network)}; Blockscout token-transfers omit ERC-20 Approval events`,
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EvmNetwork,
			fieldName: '$$erc20TokenTransfers',
			resolve: async (entityId, context) => {
				const {
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
					blockscoutV2ItemsCountMax,
				} = await import('$/sources/Blockscout/Rest/constants.ts')
				const {
					getTransactionTokenTransfers,
					getTransactions,
				} = await import('$/sources/Blockscout/Rest/queries.ts')
				const chainId = chainIdFromEvmNetworkId(entityId)
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId,
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${chainId}`)
				}
				const limit = Math.min(
					resolverLoadSubsetRowLimit(context),
					blockscoutV2ItemsCountMax,
				)
				const tokenTransfers: Entity<typeof schema, EntityType.EvmTokenTransfer>[] = []
				for (const transaction of await getTransactions({ explorerOrigin: origin, limit })) {
					const txHash = hexLowerOfByteSize(transaction.hash ?? '', 32)
					if (txHash == null) continue
					tokenTransfers.push(
						...evmTokenTransferEntityIdsFromBlockscoutWires({
							$network: entityId,
							txHash,
							wires: await singleFlight(getTransactionTokenTransfers)({
								explorerOrigin: origin,
								txHash,
								limit: blockscoutV2ItemsCountMax,
							}),
						})
							.filter((tokenTransfer) => tokenTransfer.standard === EvmTokenStandard.Erc20),
					)
					if (tokenTransfers.length >= limit) return tokenTransfers.slice(0, limit)
				}
				return tokenTransfers
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EvmNetwork,
			fieldName: '$$nftTokenTransfers',
			resolve: async (entityId, context) => {
				const {
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
					blockscoutV2ItemsCountMax,
				} = await import('$/sources/Blockscout/Rest/constants.ts')
				const {
					getTransactionTokenTransfers,
					getTransactions,
				} = await import('$/sources/Blockscout/Rest/queries.ts')
				const chainId = chainIdFromEvmNetworkId(entityId)
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId,
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${chainId}`)
				}
				const limit = Math.min(
					resolverLoadSubsetRowLimit(context),
					blockscoutV2ItemsCountMax,
				)
				const tokenTransfers: Entity<typeof schema, EntityType.EvmTokenTransfer>[] = []
				for (const transaction of await getTransactions({ explorerOrigin: origin, limit })) {
					const txHash = hexLowerOfByteSize(transaction.hash ?? '', 32)
					if (txHash == null) continue
					tokenTransfers.push(
						...evmTokenTransferEntityIdsFromBlockscoutWires({
							$network: entityId,
							txHash,
							wires: await singleFlight(getTransactionTokenTransfers)({
								explorerOrigin: origin,
								txHash,
								limit: blockscoutV2ItemsCountMax,
							}),
						})
							.filter((tokenTransfer) => (
								tokenTransfer.standard === EvmTokenStandard.Erc721
								|| tokenTransfer.standard === EvmTokenStandard.Erc1155
							)),
					)
					if (tokenTransfers.length >= limit) return tokenTransfers.slice(0, limit)
				}
				return tokenTransfers
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EvmNetwork,
			fieldName: '$$contracts',
			resolve: async (entityId, context) => {
				const {
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
					blockscoutV2ItemsCountMax,
				} = await import('$/sources/Blockscout/Rest/constants.ts')
				const limit = Math.min(
					resolverLoadSubsetRowLimit(context),
					blockscoutV2ItemsCountMax,
				)
				const {
					normalizeAddressFromContractListWire,
					getSmartContracts,
				} = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: chainIdFromEvmNetworkId(entityId),
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${chainIdFromEvmNetworkId(entityId)}`)
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
								[EntityMetaKey.Id]: {
									$network: evmNetworkIdFromChainId(chainIdFromEvmNetworkId(entityId)),
									address,
								},
							} satisfies Entity<typeof schema, EntityType.EvmContract>]
						})
				)
				return entities
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EvmNetwork,
			fieldName: '$$erc4337SmartAccounts',
			resolve: async (entityId, context) => {
				const {
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
					blockscoutV2ItemsCountMax,
				} = await import('$/sources/Blockscout/Rest/constants.ts')
				const limit = Math.min(
					resolverLoadSubsetRowLimit(context),
					blockscoutV2ItemsCountMax,
				)
				const { getErc4337SmartAccountList } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: chainIdFromEvmNetworkId(entityId),
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${chainIdFromEvmNetworkId(entityId)}`)
				}
				const wires = await getErc4337SmartAccountList({
					explorerOrigin: origin,
					limit,
				})
				return erc4337RegistryEntitiesFromBlockscoutWires<EntityType.Erc4337SmartAccount>({
					chainId: chainIdFromEvmNetworkId(entityId),
					items: wires,
				})
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EvmNetwork,
			fieldName: '$$erc4337Bundlers',
			resolve: async (entityId, context) => {
				const {
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
					blockscoutV2ItemsCountMax,
				} = await import('$/sources/Blockscout/Rest/constants.ts')
				const limit = Math.min(
					resolverLoadSubsetRowLimit(context),
					blockscoutV2ItemsCountMax,
				)
				const { getErc4337BundlerList } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: chainIdFromEvmNetworkId(entityId),
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${chainIdFromEvmNetworkId(entityId)}`)
				}
				const wires = await getErc4337BundlerList({
					explorerOrigin: origin,
					limit,
				})
				return erc4337RegistryEntitiesFromBlockscoutWires<EntityType.Erc4337Bundler>({
					chainId: chainIdFromEvmNetworkId(entityId),
					items: wires,
				})
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EvmNetwork,
			fieldName: '$$erc4337Paymasters',
			resolve: async (entityId, context) => {
				const {
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
					blockscoutV2ItemsCountMax,
				} = await import('$/sources/Blockscout/Rest/constants.ts')
				const limit = Math.min(
					resolverLoadSubsetRowLimit(context),
					blockscoutV2ItemsCountMax,
				)
				const { getErc4337PaymasterList } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: chainIdFromEvmNetworkId(entityId),
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${chainIdFromEvmNetworkId(entityId)}`)
				}
				const wires = await getErc4337PaymasterList({
					explorerOrigin: origin,
					limit,
				})
				return erc4337RegistryEntitiesFromBlockscoutWires<EntityType.Erc4337Paymaster>({
					chainId: chainIdFromEvmNetworkId(entityId),
					items: wires,
				})
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EvmNetwork,
			fieldName: '$$erc4337AccountFactories',
			resolve: async (entityId, context) => {
				const {
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
					blockscoutV2ItemsCountMax,
				} = await import('$/sources/Blockscout/Rest/constants.ts')
				const limit = Math.min(
					resolverLoadSubsetRowLimit(context),
					blockscoutV2ItemsCountMax,
				)
				const { getErc4337AccountFactoryList } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: chainIdFromEvmNetworkId(entityId),
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${chainIdFromEvmNetworkId(entityId)}`)
				}
				const wires = await getErc4337AccountFactoryList({
					explorerOrigin: origin,
					limit,
				})
				return erc4337RegistryEntitiesFromBlockscoutWires<EntityType.Erc4337AccountFactory>({
					chainId: chainIdFromEvmNetworkId(entityId),
					items: wires,
				})
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EvmNetwork,
			fieldName: '$$userOperations',
			resolve: async (entityId, context) => {
				const {
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
					blockscoutV2ItemsCountMax,
				} = await import('$/sources/Blockscout/Rest/constants.ts')
				const limit = Math.min(
					resolverLoadSubsetRowLimit(context),
					blockscoutV2ItemsCountMax,
				)
				const { getUserOperationsPage } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: chainIdFromEvmNetworkId(entityId),
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${chainIdFromEvmNetworkId(entityId)}`)
				}
				const wires = await getUserOperationsPage({ explorerOrigin: origin, limit })
				const entities = (
					wires.flatMap((w) => {
						const hashRaw = w.hash != null ? hexLowerOfByteSize(w.hash, 32)
						:
							undefined
						return hashRaw == null ?
								[]
							:
								[{
									[EntityMetaKey.Id]: {
										$network: evmNetworkIdFromChainId(chainIdFromEvmNetworkId(entityId)),
										hash: hashRaw,
									},
								} satisfies Entity<typeof schema, EntityType.EvmUserOperation>]
					})
				)
				return entities
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EvmNetwork,
			fieldName: '$$gasEstimateTimestamps',
			resolve: async (entityId) => {
				const stats = await blockscoutStatsForChain(chainIdFromEvmNetworkId(entityId))
				if (stats == null) {
					throw new Error(`Blockscout_Rest: no stats for chain ${chainIdFromEvmNetworkId(entityId)}`)
				}
				const observation = gasEstimateObservationFromBlockscoutStats(stats)
				if (observation == null) {
					throw new Error(`Blockscout_Rest: stats on chain ${chainIdFromEvmNetworkId(entityId)} have no gas estimate observation`)
				}
				return [
					{
						[EntityMetaKey.Id]: {
							$network: entityId,
							timestampMs: observation.timestampMs,
						},
					},
				]
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Coin,
			fieldName: '$$timestamps',
			resolve: async (entityId) => {
				const stats = await blockscoutStatsForNativeCoinId(entityId.coinId)
				if (stats == null) {
					throw new Error(`Blockscout_Rest: no native stats for coin ${entityId.coinId}`)
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
						[EntityMetaKey.Id]: {
							$coin: { coinId: entityId.coinId },
							timestampMs,
						},
					},
				]
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.MarketPrice,
			fieldName: '$$quotes',
			resolve: async (entityId) => {
				if (entityId.$market.marketKind !== MarketKind.Spot) {
					throw new Error('Blockscout_Rest: MarketPrice $$quotes is spot-only')
				}
				const coinId = (
					entityId.$market.$base.kind === MarketAssetKind.Coin ?
						entityId.$market.$base.$coin.coinId
					:
						undefined
				)
				if (coinId == null) {
					throw new Error('Blockscout_Rest: market base is not a catalog coin')
				}
				const catalogMarketId = catalogCoinUsdMarketIdByCoinId[coinId]
				if (stringify(entityId.$market) !== stringify(catalogMarketId)) {
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
						[EntityMetaKey.Id]: {
							$market: entityId.$market,
							timestampMs,
						},
					},
				]
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EvmTransaction,
			fieldName: '$$logs',
			resolve: async (entityId) => {
				const {
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				} = await import('$/sources/Blockscout/Rest/constants.ts')
				const { getTransactionReceipt } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: chainIdFromEvmNetworkId(entityId.$network),
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${chainIdFromEvmNetworkId(entityId.$network)}`)
				}
				const receipt = await singleFlight(getTransactionReceipt)({
					explorerOrigin: origin,
					txHash: entityId.txHash,
				})
				return (
					(receipt?.logs ?? [])
						.flatMap((log) => {
							const id = evmLogEntityIdFromWire({
								$network: entityId.$network,
								txHash: entityId.txHash,
								log,
							})
							return id == null ?
									[]
								:
									[{
										[EntityMetaKey.Id]: id,
									}]
						})
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EvmTransaction,
			fieldName: '$$tokenTransfers',
			resolve: async (entityId, context) => {
				const {
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
					blockscoutV2ItemsCountMax,
				} = await import('$/sources/Blockscout/Rest/constants.ts')
				const { getTransactionTokenTransfers } = await import('$/sources/Blockscout/Rest/queries.ts')
				const limit = Math.min(
					resolverLoadSubsetRowLimit(context),
					blockscoutV2ItemsCountMax,
				)
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: chainIdFromEvmNetworkId(entityId.$network),
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${chainIdFromEvmNetworkId(entityId.$network)}`)
				}
				const wires = await singleFlight(getTransactionTokenTransfers)({
					explorerOrigin: origin,
					txHash: entityId.txHash,
					limit,
				})
				return (
					evmTokenTransferEntityIdsFromBlockscoutWires({
						$network: entityId.$network,
						txHash: entityId.txHash,
						wires,
					})
						.map((entity) => ({
							[EntityMetaKey.Id]: entity[EntityMetaKey.Id],
						}))
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EvmTransaction,
			fieldName: '$$internalTransfers',
			resolve: async (entityId, context) => {
				const {
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
					blockscoutV2ItemsCountMax,
				} = await import('$/sources/Blockscout/Rest/constants.ts')
				const { getTransactionInternalTransactions } = await import('$/sources/Blockscout/Rest/queries.ts')
				const limit = Math.min(
					resolverLoadSubsetRowLimit(context),
					blockscoutV2ItemsCountMax,
				)
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: chainIdFromEvmNetworkId(entityId.$network),
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${chainIdFromEvmNetworkId(entityId.$network)}`)
				}
				const wires = await singleFlight(getTransactionInternalTransactions)({
					explorerOrigin: origin,
					txHash: entityId.txHash,
					limit,
				})
				return (
					evmInternalTransferEntityIdsFromBlockscoutWires({
						$network: entityId.$network,
						txHash: entityId.txHash,
						wires,
					})
						.map((entity) => ({
							[EntityMetaKey.Id]: entity[EntityMetaKey.Id],
						}))
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EvmTransaction,
			fieldName: '$$userOperations',
			resolve: async (entityId, context) => {
				const {
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
					blockscoutV2ItemsCountMax,
					blockscoutErc4337OperationsSupported,
				} = await import('$/sources/Blockscout/Rest/constants.ts')
				if (!blockscoutErc4337OperationsSupported(chainIdFromEvmNetworkId(entityId.$network))) {
					throw new Error(`Blockscout_Rest: ERC-4337 user operations not supported for chain ${chainIdFromEvmNetworkId(entityId.$network)}`)
				}
				const limit = Math.min(
					resolverLoadSubsetRowLimit(context),
					blockscoutV2ItemsCountMax,
				)
				const { getUserOperationsByTransaction } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: chainIdFromEvmNetworkId(entityId.$network),
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${chainIdFromEvmNetworkId(entityId.$network)}`)
				}
				const wires = await singleFlight(getUserOperationsByTransaction)({
					explorerOrigin: origin,
					txHash: entityId.txHash,
					limit,
				})
				return (
					wires.flatMap((w) => {
						const hashRaw = w.hash != null ? hexLowerOfByteSize(w.hash, 32)
						:
							undefined
						return hashRaw == null ?
								[]
							:
								[{
									[EntityMetaKey.Id]: {
										$network: entityId.$network,
										hash: hashRaw,
									},
								} satisfies Entity<typeof schema, EntityType.EvmUserOperation>]
					})
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EvmBlock,
			fieldName: '$$transactions',
			resolve: async (entityId, context) => {
				const {
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
					blockscoutV2ItemsCountMax,
				} = await import('$/sources/Blockscout/Rest/constants.ts')
				const limit = Math.min(
					resolverLoadSubsetRowLimit(context),
					blockscoutV2ItemsCountMax,
				)
				const { getBlockTransactions } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: chainIdFromEvmNetworkId(entityId.$network),
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${chainIdFromEvmNetworkId(entityId.$network)}`)
				}
				const wires = await singleFlight(getBlockTransactions)({
					explorerOrigin: origin,
					blockNumber: entityId.blockNumber,
					limit,
				})
				return (
					wires
						.flatMap((w) => {
							const txHash = w.hash != null ? hexLowerOfByteSize(w.hash, 32)
							:
								undefined
							return txHash == null ?
									[]
								:
									[{
										[EntityMetaKey.Id]: {
											$network: evmNetworkIdFromChainId(chainIdFromEvmNetworkId(entityId.$network)),
											txHash,
										},
									}]
						})
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EvmContract,
			fieldName: '$deployer',
			resolve: async (entityId) => {
				const { getAddressDetails } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = await requireBlockscoutV2ExplorerOrigin(chainIdFromEvmNetworkId(entityId.$network))
				const address = hexLowerOfByteSize(entityId.address, 20)
				if (address == null) {
					throw new Error('Blockscout_Rest: address not normalized')
				}
				const details = await singleFlight(getAddressDetails)({
					explorerOrigin: origin,
					address,
				})
				const creator = details.creator_address_hash
				if (creator == null) return undefined
				const creatorAddress = hexLowerOfByteSize(creator, 20)
				if (creatorAddress == null) return undefined
				return {
					[EntityMetaKey.Id]: {
						address: creatorAddress,
					},
				}
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EvmContract,
			fieldName: '$creationTransaction',
			resolve: async (entityId) => {
				const { getAddressDetails } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = await requireBlockscoutV2ExplorerOrigin(chainIdFromEvmNetworkId(entityId.$network))
				const address = hexLowerOfByteSize(entityId.address, 20)
				if (address == null) {
					throw new Error('Blockscout_Rest: address not normalized')
				}
				const details = await singleFlight(getAddressDetails)({
					explorerOrigin: origin,
					address,
				})
				const txHash = details.creation_transaction_hash
				if (txHash == null) return undefined
				const normalized = hexLowerOfByteSize(txHash, 32)
				if (normalized == null) return undefined
				return {
					[EntityMetaKey.Id]: {
						$network: entityId.$network,
						txHash: normalized,
					},
				}
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EvmContract,
			fieldName: '$implementation',
			resolve: async (entityId) => {
				const { getAddressDetails } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = await requireBlockscoutV2ExplorerOrigin(chainIdFromEvmNetworkId(entityId.$network))
				const address = hexLowerOfByteSize(entityId.address, 20)
				if (address == null) {
					throw new Error('Blockscout_Rest: address not normalized')
				}
				const details = await singleFlight(getAddressDetails)({
					explorerOrigin: origin,
					address,
				})
				const implementationAddress = details.implementations?.[0]?.address_hash
				if (implementationAddress != null) {
					const normalized = hexLowerOfByteSize(implementationAddress, 20)
					if (normalized != null) {
						return {
							[EntityMetaKey.Id]: {
								$network: entityId.$network,
								address: normalized,
							},
						}
					}
				}
				const { getContractSourceCodeRow } = await import('$/sources/Blockscout/Rest/queries.ts')
				const sourceRow = await singleFlight(getContractSourceCodeRow)({
					explorerOrigin: origin,
					address,
				})
				const legacyImplementation = sourceRow?.Implementation
				if (legacyImplementation == null || legacyImplementation.trim() === '') return undefined
				const normalized = hexLowerOfByteSize(legacyImplementation, 20)
				if (normalized == null) return undefined
				return {
					[EntityMetaKey.Id]: {
						$network: entityId.$network,
						address: normalized,
					},
				}
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EvmContract,
			fieldName: 'abi',
			resolve: async (entityId) => {
				const { getContractAbiJsonString } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = await requireBlockscoutV2ExplorerOrigin(chainIdFromEvmNetworkId(entityId.$network))
				const address = hexLowerOfByteSize(entityId.address, 20)
				if (address == null) {
					throw new Error('Blockscout_Rest: address not normalized')
				}
				const abi = await singleFlight(getContractAbiJsonString)({
					explorerOrigin: origin,
					address,
				})
				return abi ?? undefined
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EvmContract,
			fieldName: 'code',
			resolve: async (entityId) => {
				const { getCode } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = await requireBlockscoutV2ExplorerOrigin(chainIdFromEvmNetworkId(entityId.$network))
				const address = hexLowerOfByteSize(entityId.address, 20)
				if (address == null) {
					throw new Error('Blockscout_Rest: address not normalized')
				}
				const codeHex = await singleFlight(getCode)({
					explorerOrigin: origin,
					address,
				})
				if (codeHex == null) return undefined
				return evmContractRuntimeCodeFromGetCodeHex(codeHex)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EvmContract,
			fieldName: 'bytecodeHash',
			resolve: async (entityId) => {
				const { getCode } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = await requireBlockscoutV2ExplorerOrigin(chainIdFromEvmNetworkId(entityId.$network))
				const address = hexLowerOfByteSize(entityId.address, 20)
				if (address == null) {
					throw new Error('Blockscout_Rest: address not normalized')
				}
				const codeHex = await singleFlight(getCode)({
					explorerOrigin: origin,
					address,
				})
				if (codeHex == null) return undefined
				return evmContractBytecodeHashFromGetCodeHex(codeHex)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EvmContract,
			fieldName: 'storageSlotReads',
			resolve: async (entityId, context) => {
				const {
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				} = await import('$/sources/Blockscout/Rest/constants.ts')
				const { getStorageAt } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: chainIdFromEvmNetworkId(entityId.$network),
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${chainIdFromEvmNetworkId(entityId.$network)}`)
				}
				const address = hexLowerOfByteSize(entityId.address, 20)
				if (address == null) {
					throw new Error('Blockscout_Rest: EvmContract address not normalized')
				}
				const depth = Math.min(32, Math.max(1, resolverLoadSubsetRowLimit(context)))
				return evmContractStorageSlotReadsFromEthGetStorageAt({
					address,
					depth,
					getStorageAt: (slotQuantityHex) => (
						singleFlight(getStorageAt)({
							explorerOrigin: origin,
							address,
							slotQuantityHex,
						}).then((valueHex) => {
							if (valueHex == null) throw new Error('Blockscout_Rest: eth_getStorageAt returned no result')
							return valueHex
						})
					),
				})
			},
		}),
	],
}
