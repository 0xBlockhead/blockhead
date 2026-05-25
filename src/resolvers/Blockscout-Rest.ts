import { stringify } from 'devalue'
import { keccak256, toHex } from '@tevm/voltaire/Hash'
import { toBytes } from '@tevm/voltaire/Hex'
import { hexLowerOfByteSize, zeroExLowerCase } from '$/lib/hexLowerOfByteSize.ts'
import { singleFlight } from '$/lib/singleFlight.ts'
import {
	defineEntityFieldResolver,
	defineEntityResolver,
	resolverLoadSubsetRowLimit,
} from '$/resolvers/$resolvers.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { schema } from '$/schema/index.ts'
import type { Entity } from '$/schema/$schema.ts'
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
import { CoinInstanceType } from '$/schema/CoinInstance.ts'
import { catalogCoinUsdMarketIdByCoinId } from '$/constants/MarketCatalog.ts'
import type {
	BlockscoutInternalTransaction,
	BlockscoutErc4337RegistryEntry,
	BlockscoutStats,
	BlockscoutTokenTransfer,
} from '$/sources/Blockscout/Rest/types.ts'
import type { RpcBlockHeader, RpcLog } from '$/sources/Evm/JsonRpc/types.ts'

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
	const rows: { slot: `0x${string}`; value: `0x${string}` }[] = []
	for (let slotIndex = 0; slotIndex < depth; slotIndex += 1) {
		const slotQuantityHex = `0x${BigInt(slotIndex).toString(16).padStart(64, '0')}`
		const valueHex = await getStorageAt(slotQuantityHex)
		const slotNormalized = hexLowerOfByteSize(slotQuantityHex, 32)
		const value = hexLowerOfByteSize(valueHex, 32)
		if (slotNormalized == null || value == null) continue
		rows.push({ slot: slotNormalized, value })
	}
	return rows
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
	: ((parsed) => (
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
	: ((value) => (
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
	$network: { chainId: number }
	txHash: string
	log: RpcLog
}) => {
	const logIndex = evmLogIndexFromWire(log.logIndex)
	const normalizedTxHash = hexLowerOfByteSize(txHash, 32)
	return logIndex == null || normalizedTxHash == null ?
		undefined
	: {
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
		...(log.data != null && { data: log.data }),
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

const evmTransactionExecutionStatusFromReceiptStatus = (
	raw: number | undefined,
): EvmTransactionExecutionStatus | undefined => (
	raw == null || !Number.isFinite(raw) || !Number.isInteger(raw) ?
		undefined
	: raw === 1 ?
		EvmTransactionExecutionStatus.Success
	: raw === 0 ?
		EvmTransactionExecutionStatus.Failed
	:
		undefined
)

const evmTransactionExecutionStatusWhenReceiptMissing = (
	receiptPresent: boolean | undefined,
	receiptStatus: number | undefined,
): EvmTransactionExecutionStatus | undefined => (
	receiptPresent ?
		evmTransactionExecutionStatusFromReceiptStatus(receiptStatus)
	:
		EvmTransactionExecutionStatus.Pending
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

const evmTransactionDiscriminatorFields = ({
	rpcTypeByte,
	receiptStatus,
	receiptPresent,
	value,
	toAddress,
	input,
	createdContractAddress,
}: {
	rpcTypeByte: number | undefined
	receiptStatus: number | undefined
	receiptPresent?: boolean
	value: bigint
	toAddress?: string
	input?: string
	createdContractAddress?: string
}) => {
	const envelopeType = evmTransactionEnvelopeTypeFromRpcTypeByte(rpcTypeByte)
	const executionStatus = evmTransactionExecutionStatusWhenReceiptMissing(
		receiptPresent,
		receiptStatus,
	)
	const kind = evmTransactionKindFromSignedFields({
		value,
		toAddress,
		input,
		createdContractAddress,
	})
	return {
		envelopeType,
		...(executionStatus != null && { executionStatus }),
		kind,
	}
}

const evmInternalCallTypeFromWire = (
	raw: string | undefined,
): EvmInternalCallType | undefined => (
	raw == null || raw === '' ?
		undefined
	: ((normalized) => (
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
	: ((value) => (
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
	$network: { chainId: number }
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
	return {
		[EntityMetaKey.Id]: {
			$network,
			txHash: normalizedTxHash,
			internalIndex,
		},
		value,
		...(wire.type != null && ((callType) => (
			callType != null && { callType }
		))(evmInternalCallTypeFromWire(wire.type))),
		...(wire.success != null && { success: wire.success }),
		...(fromAddress != null && {
			$from: {
				[EntityMetaKey.Id]: { address: fromAddress },
			} satisfies Entity<typeof schema, EntityType.Actor>,
		}),
		...(toAddress != null && {
			$to: {
				[EntityMetaKey.Id]: { address: toAddress },
			} satisfies Entity<typeof schema, EntityType.Actor>,
		}),
		...(createdAddress != null && {
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
	$network: { chainId: number }
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
	$network: { chainId: number }
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
				:	evmInternalTransferEntityIdsFromBlockscoutWires({
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
	: ((parsed) => (
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
	$network: { chainId: number }
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
	...(tokenId != null && { tokenId }),
	...(tokenSymbol != null && { tokenSymbol }),
	...(tokenName != null && { tokenName }),
	...(tokenDecimals != null && Number.isFinite(tokenDecimals) && { tokenDecimals }),
	...(fromAddress != null && {
		$from: {
			[EntityMetaKey.Id]: { address: fromAddress },
		} satisfies Entity<typeof schema, EntityType.Actor>,
	}),
	...(toAddress != null && {
		$to: {
			[EntityMetaKey.Id]: { address: toAddress },
		} satisfies Entity<typeof schema, EntityType.Actor>,
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
			} satisfies Entity<typeof schema, EntityType.CoinInstance>,
		}),
	}),
})

const evmTokenTransferEntityFromWire = ({
	$network,
	txHash,
	wire,
	transferIndex,
}: {
	$network: { chainId: number }
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
	$network: { chainId: number }
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
	$network: { chainId: number }
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
				:	evmTokenTransferEntityIdsFromBlockscoutWires({
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
		:	undefined
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
		:	NaN
	)
	const timestampMs = (
		Number.isFinite(updatedAtMs) ?
			updatedAtMs
		:	Date.now()
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
	const { getBlockscoutStats } = await import('$/sources/Blockscout/Rest/queries.ts')
	const origin = blockscoutV2ExplorerOriginWhenRestSupported({
		chainId,
		blockscoutExplorerOriginForChain,
		blockscoutRestV2AtExplorerOrigin,
	})
	if (origin == null) return null
	return singleFlight(getBlockscoutStats)({ explorerOrigin: origin })
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
	const entities = items.flatMap((row) => {
		const address = hexLowerOfByteSize(row.address?.hash ?? '', 20)
		return address == null ?
				[]
			:	[{
					[EntityMetaKey.Id]: {
						$network: { chainId },
						address,
					},
				} satisfies Entity<typeof schema, _Type>]
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
				const { getBlockByNumberBlockscout } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: entityId.$network.chainId,
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${entityId.$network.chainId}`)
				}
				const header = await singleFlight(getBlockByNumberBlockscout)({
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
						))(Number(wire.timestamp)) : NaN
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
						})()) : undefined
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
						})()) : undefined
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
						})()) : undefined
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
						})()) : undefined
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
						})()) : undefined
					)
					const miner = (
						wire.miner != null ?
							hexLowerOfByteSize(wire.miner, 20)
						:
							undefined
					)
					const base = {
						[EntityMetaKey.Id]: {
							$network: { chainId },
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
										$network: { chainId },
										blockNumber: parentBlockNumber,
									},
									number: parentBlockNumber,
								} satisfies Entity<typeof schema, EntityType.EvmBlock>,
							}),
						...(miner != null && {
								$miner: {
									[EntityMetaKey.Id]: {
										address: miner,
									} satisfies Entity<typeof schema, EntityType.Actor>,
								},
							}),
					}
				}
				return evmBlockEntityFromRpcHeaderWire({
					chainId: entityId.$network.chainId,
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
					getTransactionByHashBlockscout,
					getTransactionReceiptBlockscout,
				} = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: entityId.$network.chainId,
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${entityId.$network.chainId}`)
				}
				const jsonRpcTransaction = await singleFlight(getTransactionByHashBlockscout)({
					explorerOrigin: origin,
					txHash: entityId.txHash,
				})
				if (jsonRpcTransaction == null) {
					throw new Error('Blockscout_Rest: transaction not returned for EvmTransaction')
				}
				const networkChainId = entityId.$network.chainId
				const containingBlockNumber = (
					jsonRpcTransaction.blockNumber != null ? ((value) => (
						value == null || value < 0n ? undefined : value
					))((() => {
						try {
							return BigInt(jsonRpcTransaction.blockNumber)
						} catch {
							return undefined
						}
					})()) : undefined
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
				const base = {
					[EntityMetaKey.Id]: {
						$network: { chainId: networkChainId },
						txHash,
					},
					...(containingBlockNumber != null && {
							$block: {
								[EntityMetaKey.Id]: {
									$network: { chainId: networkChainId },
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
							} satisfies Entity<typeof schema, EntityType.Actor>,
						}),
					...(to != null && {
							$to: {
								[EntityMetaKey.Id]: {
									address: to,
								},
							} satisfies Entity<typeof schema, EntityType.Actor>,
						}),
					transactionIndex: (
						jsonRpcTransaction.transactionIndex != null ? ((parsed) => (
							Number.isFinite(parsed) && Number.isInteger(parsed) && parsed >= 0 ?
								parsed
							:
								undefined
						))(Number(jsonRpcTransaction.transactionIndex)) : undefined
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
						})()) : 0n
					),
					nonce: (
						jsonRpcTransaction.nonce != null ? ((parsed) => (
							Number.isFinite(parsed) && Number.isInteger(parsed) && parsed >= 0 ?
								parsed
							:
								undefined
						))(Number(jsonRpcTransaction.nonce)) : undefined
					),
					...(jsonRpcTransaction.input != null && { input: jsonRpcTransaction.input }),
					gas: (
						jsonRpcTransaction.gas != null ? ((value) => (
							value == null || value < 0n ? undefined : value
						))((() => {
							try {
								return BigInt(jsonRpcTransaction.gas)
							} catch {
								return undefined
							}
						})()) : undefined
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
						})()) : undefined
					),
					maxFeePerGas: (
						jsonRpcTransaction.maxFeePerGas != null ? ((value) => (
							value == null || value < 0n ? undefined : value
						))((() => {
							try {
								return BigInt(jsonRpcTransaction.maxFeePerGas)
							} catch {
								return undefined
							}
						})()) : undefined
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
						})()) : undefined
					),
				} satisfies Entity<typeof schema, EntityType.EvmTransaction>
				const receipt = await singleFlight(getTransactionReceiptBlockscout)({
					explorerOrigin: origin,
					txHash: entityId.txHash,
				})
				const createdContractAddress = (
					receipt?.contractAddress != null ?
						hexLowerOfByteSize(receipt.contractAddress, 20)
					:
						undefined
				)
				const rpcTypeByte = (
					jsonRpcTransaction.type != null ? ((parsed) => (
						Number.isFinite(parsed) && Number.isInteger(parsed) && parsed >= 0 ?
							parsed
						:
							undefined
					))(Number(jsonRpcTransaction.type)) : undefined
				)
				return {
					...base,
					...evmTransactionDiscriminatorFields({
						rpcTypeByte,
						receiptStatus: (
							receipt?.status != null ?
								Number(receipt.status)
							:
								undefined
						),
						value: base.value,
						toAddress: to,
						input: jsonRpcTransaction.input,
						createdContractAddress,
					}),
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
				const { getTransactionReceiptBlockscout } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: entityId.$network.chainId,
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${entityId.$network.chainId}`)
				}
				const receipt = await singleFlight(getTransactionReceiptBlockscout)({
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
				const { getBlockscoutTransactionTokenTransfers } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: entityId.$network.chainId,
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${entityId.$network.chainId}`)
				}
				const wires = await singleFlight(getBlockscoutTransactionTokenTransfers)({
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
					transferIndex: entityId.transferIndex,
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
				const { getBlockscoutTransactionInternalTransactions } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: entityId.$network.chainId,
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${entityId.$network.chainId}`)
				}
				const wires = await singleFlight(getBlockscoutTransactionInternalTransactions)({
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
				const { getBlockscoutErc4337SmartAccountDetail } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: entityId.$network.chainId,
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${entityId.$network.chainId}`)
				}
				const wire = await singleFlight(getBlockscoutErc4337SmartAccountDetail)({
					explorerOrigin: origin,
					address: entityId.address,
				})
				return erc4337RegistryFieldsFromBlockscoutWire(
					EntityType.Erc4337SmartAccount,
					wire,
				)
			},
		}),

		defineEntityResolver({
			entityType: EntityType.Erc4337Bundler,
			resolve: async (entityId) => {
				const {
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				} = await import('$/sources/Blockscout/Rest/constants.ts')
				const { getBlockscoutErc4337BundlerDetail } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: entityId.$network.chainId,
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${entityId.$network.chainId}`)
				}
				const wire = await singleFlight(getBlockscoutErc4337BundlerDetail)({
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
				const { getBlockscoutErc4337PaymasterDetail } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: entityId.$network.chainId,
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${entityId.$network.chainId}`)
				}
				const wire = await singleFlight(getBlockscoutErc4337PaymasterDetail)({
					explorerOrigin: origin,
					address: entityId.address,
				})
				return erc4337RegistryFieldsFromBlockscoutWire(
					EntityType.Erc4337Paymaster,
					wire,
				)
			},
		}),

		defineEntityResolver({
			entityType: EntityType.Erc4337AccountFactory,
			resolve: async (entityId) => {
				const {
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				} = await import('$/sources/Blockscout/Rest/constants.ts')
				const { getBlockscoutErc4337AccountFactoryDetail } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: entityId.$network.chainId,
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${entityId.$network.chainId}`)
				}
				const wire = await singleFlight(getBlockscoutErc4337AccountFactoryDetail)({
					explorerOrigin: origin,
					address: entityId.address,
				})
				return erc4337RegistryFieldsFromBlockscoutWire(
					EntityType.Erc4337AccountFactory,
					wire,
				)
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
					getBlockscoutUserOperationDetail,
				} = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: entityId.$network.chainId,
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${entityId.$network.chainId}`)
				}
				const wire = await singleFlight(getBlockscoutUserOperationDetail)({
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
				const paymasterAndData = (
					wire.raw?.paymaster_and_data != null
					&& wire.raw.paymaster_and_data !== '0x' ?
						wire.raw.paymaster_and_data
					:
						undefined
				)
				const blockNumberRaw = wire.block_number
				const blockNumber = (
					blockNumberRaw === null || blockNumberRaw === undefined ?
						undefined
					: (() => {
						try {
							return BigInt(`${blockNumberRaw}`)
						} catch {
							return undefined
						}
					})()
				)
				const timestampSeconds = (
					wire.timestamp != null ? ((time) => (
						Number.isFinite(time) && time >= 0 ? Math.floor(time / 1000) : undefined
					))(Date.parse(wire.timestamp)) : undefined
				)
				const feeTrimmed = wire.fee?.trim() || undefined
				const optionalBigIntFromWire = (
					value: string | number | null | undefined,
				) => (
					value === null || value === undefined ?
						undefined
					: (() => {
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
					...(bundledTransactionHash != null && { bundledTransactionHash }),
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
					...(blockNumber != null && { blockNumber }),
					...(timestampSeconds != undefined && { timestampSeconds }),
					...(wire.status === false || wire.status === true ? { finalized: wire.status } : {}),
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
					...(sponsorType != null && { sponsorType }),
					...(paymasterAndData != null && { paymasterAndData }),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.ActorNetwork,
			resolve: async (entityId) => {
				const {
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				} = await import('$/sources/Blockscout/Rest/constants.ts')
				const {
					getBlockscoutAddressCounters,
					getBlockscoutAddressDetails,
				} = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: entityId.$network.chainId,
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${entityId.$network.chainId}`)
				}
				const address = hexLowerOfByteSize(entityId.$actor.address, 20)
				if (address == null) {
					throw new Error('Blockscout_Rest: ActorNetwork wallet address not normalized')
				}
				const details = await getBlockscoutAddressDetails({ explorerOrigin: origin, address })
				const counters = await getBlockscoutAddressCounters({ explorerOrigin: origin, address })
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
					:	undefined
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
					:	NaN
				)
				const timestampMs = (
					Number.isFinite(updatedAtMs) ?
						updatedAtMs
					:	Date.now()
				)
				if (entityId.timestampMs !== timestampMs) {
					throw new Error('Blockscout_Rest: Market_Timestamp id does not match stats clock')
				}
				return {
					price,
					...('blockscout-stats-usd-1e8' && { transport: 'blockscout-stats-usd-1e8' }),
					...(coinId !== undefined && { providerAssetId: coinId }),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.Network_GasEstimate_Timestamp,
			resolve: async (entityId) => {
				const stats = await blockscoutStatsForChain(entityId.$network.chainId)
				if (stats == null) {
					throw new Error(
						`Blockscout_Rest: Network_GasEstimate_Timestamp unsupported for chain ${String(entityId.$network.chainId)}`,
					)
				}
				const observation = gasEstimateObservationFromBlockscoutStats(stats)
				if (observation == null) {
					throw new Error('Blockscout_Rest: stats missing gas_prices tiers')
				}
				if (entityId.timestampMs !== observation.timestampMs) {
					throw new Error('Blockscout_Rest: Network_GasEstimate_Timestamp id does not match stats clock')
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
					:	NaN
				)
				const timestampMs = (
					Number.isFinite(updatedAtMs) ?
						updatedAtMs
					:	Date.now()
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
						:	undefined
				})()
				return {
					...(marketCapUsd != null && {
						marketCap: BigInt(Math.round(marketCapUsd)),
					}),
					...(stats.coin_price_change_percentage != null
						&& Number.isFinite(stats.coin_price_change_percentage) && {
						change24hPercent: stats.coin_price_change_percentage,
					}),
					...('blockscout-stats' && { transport: 'blockscout-stats' }),
					...(entityId.$coin.coinId != null && {
						providerAssetId: entityId.$coin.coinId,
					}),
				}
			},
		}),
	],

	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType.Network,
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
				const { getBlockscoutBlocks } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: entityId.chainId,
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${entityId.chainId}`)
				}
				const wires = await getBlockscoutBlocks({ explorerOrigin: origin, limit })
				return (
					wires.flatMap((wire) => {
						const height = wire.height
						const blockNumber = (
							height != null && Number.isFinite(height) && Number.isInteger(height) && height >= 0 ?
								BigInt(height)
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
						const timestampSeconds = (
							wire.timestamp != null ? ((parsed) => (
								Number.isFinite(parsed) && Number.isInteger(parsed) && parsed >= 0 ?
									parsed
								:
									NaN
							))(Number(wire.timestamp)) : NaN
						)
						return [
							{
								[EntityMetaKey.Id]: {
									$network: { chainId: entityId.chainId },
									blockNumber,
									...(blockHash != null && { hash: blockHash }),
								},
								number: blockNumber,
								timestamp: ((timestampSeconds) => (
									Number.isFinite(timestampSeconds) ? timestampSeconds * 1000 : undefined
								))(timestampSeconds),
								gasUsed: (
									wire.gas_used != null ? ((value) => (
										value == null || value < 0n ? undefined : value
									))((() => {
										try {
											return BigInt(wire.gas_used)
										} catch {
											return undefined
										}
									})()) : undefined
								),
								gasLimit: (
									wire.gas_limit != null ? ((value) => (
										value == null || value < 0n ? undefined : value
									))((() => {
										try {
											return BigInt(wire.gas_limit)
										} catch {
											return undefined
										}
									})()) : undefined
								),
								baseFeePerGas: (
									wire.base_fee_per_gas != null ? ((value) => (
										value == null || value < 0n ? undefined : value
									))((() => {
										try {
											return BigInt(wire.base_fee_per_gas)
										} catch {
											return undefined
										}
									})()) : undefined
								),
								transactionCount: wire.transactions_count ?? 0,
							} satisfies Entity<typeof schema, EntityType.EvmBlock>,
						]
					})
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Network,
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
				const { getBlockscoutTransactions } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: entityId.chainId,
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${entityId.chainId}`)
				}
				const wires = await getBlockscoutTransactions({ explorerOrigin: origin, limit })
				return (
					wires
						.flatMap((wire) => {
							const txHash = wire.hash != null ? hexLowerOfByteSize(wire.hash, 32) : undefined
							return txHash == null ?
									[]
								:	[{
										[EntityMetaKey.Id]: {
											$network: { chainId: entityId.chainId },
											txHash,
										},
									}]
						})
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.ActorNetwork,
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
				const { getBlockscoutAddressTransactions } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: entityId.$network.chainId,
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${entityId.$network.chainId}`)
				}
				const address = hexLowerOfByteSize(entityId.$actor.address, 20)
				if (address == null) {
					throw new Error('Blockscout_Rest: ActorNetwork wallet address not normalized')
				}
				const wires = await getBlockscoutAddressTransactions({
					explorerOrigin: origin,
					address,
					limit,
				})
				return (
					wires
						.flatMap((wire) => {
							const txHash = wire.hash != null ? hexLowerOfByteSize(wire.hash, 32) : undefined
							return txHash == null ?
								[]
							:	[{
										[EntityMetaKey.Id]: {
											$network: { chainId: entityId.$network.chainId },
											txHash,
										},
									}]
						})
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.ActorNetwork,
			fieldName: '$$tokenTransfers',
			resolve: async (entityId, context) => {
				const {
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
					blockscoutV2ItemsCountMax,
				} = await import('$/sources/Blockscout/Rest/constants.ts')
				const {
					getBlockscoutAddressTokenTransfers,
				} = await import('$/sources/Blockscout/Rest/queries.ts')
				const limit = Math.min(
					resolverLoadSubsetRowLimit(context),
					blockscoutV2ItemsCountMax,
				)
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: entityId.$network.chainId,
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${entityId.$network.chainId}`)
				}
				const address = hexLowerOfByteSize(entityId.$actor.address, 20)
				if (address == null) {
					throw new Error('Blockscout_Rest: ActorNetwork wallet address not normalized')
				}
				const wires = await getBlockscoutAddressTokenTransfers({
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
			entityType: EntityType.ActorNetwork,
			fieldName: '$$internalTransactions',
			resolve: async (entityId, context) => {
				const {
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
					blockscoutV2ItemsCountMax,
				} = await import('$/sources/Blockscout/Rest/constants.ts')
				const {
					getBlockscoutAddressInternalTransactions,
				} = await import('$/sources/Blockscout/Rest/queries.ts')
				const limit = Math.min(
					resolverLoadSubsetRowLimit(context),
					blockscoutV2ItemsCountMax,
				)
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: entityId.$network.chainId,
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${entityId.$network.chainId}`)
				}
				const address = hexLowerOfByteSize(entityId.$actor.address, 20)
				if (address == null) {
					throw new Error('Blockscout_Rest: ActorNetwork wallet address not normalized')
				}
				const wires = await getBlockscoutAddressInternalTransactions({
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
			entityType: EntityType.ActorNetwork,
			fieldName: '$$erc20TokenAllowances',
			resolve: async (entityId) => {
				throw new Error(
					`Blockscout_Rest: $$erc20TokenAllowances unsupported for ${entityId.$actor.address} on chain ${entityId.$network.chainId}; Blockscout token-transfers omit ERC-20 Approval events`,
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Network,
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
					evmAddressFromBlockscoutContractListWire,
					getBlockscoutSmartContracts,
				} = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: entityId.chainId,
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${entityId.chainId}`)
				}
				const items = await getBlockscoutSmartContracts({ explorerOrigin: origin, limit })
				const entities = (
					items
						.flatMap((w) => {
							const address = evmAddressFromBlockscoutContractListWire(w)
							return address == null ?
								[]
							:	[{
								[EntityMetaKey.Id]: {
									$network: { chainId: entityId.chainId },
									address,
								},
							} satisfies Entity<typeof schema, EntityType.EvmContract>]
						})
				)
				return entities
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Network,
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
				const { getBlockscoutErc4337SmartAccountList } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: entityId.chainId,
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${entityId.chainId}`)
				}
				const wires = await getBlockscoutErc4337SmartAccountList({
					explorerOrigin: origin,
					limit,
				})
				return erc4337RegistryEntitiesFromBlockscoutWires<EntityType.Erc4337SmartAccount>({
					chainId: entityId.chainId,
					items: wires,
				})
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Network,
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
				const { getBlockscoutErc4337BundlerList } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: entityId.chainId,
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${entityId.chainId}`)
				}
				const wires = await getBlockscoutErc4337BundlerList({
					explorerOrigin: origin,
					limit,
				})
				return erc4337RegistryEntitiesFromBlockscoutWires<EntityType.Erc4337Bundler>({
					chainId: entityId.chainId,
					items: wires,
				})
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Network,
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
				const { getBlockscoutErc4337PaymasterList } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: entityId.chainId,
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${entityId.chainId}`)
				}
				const wires = await getBlockscoutErc4337PaymasterList({
					explorerOrigin: origin,
					limit,
				})
				return erc4337RegistryEntitiesFromBlockscoutWires<EntityType.Erc4337Paymaster>({
					chainId: entityId.chainId,
					items: wires,
				})
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Network,
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
				const { getBlockscoutErc4337AccountFactoryList } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: entityId.chainId,
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${entityId.chainId}`)
				}
				const wires = await getBlockscoutErc4337AccountFactoryList({
					explorerOrigin: origin,
					limit,
				})
				return erc4337RegistryEntitiesFromBlockscoutWires<EntityType.Erc4337AccountFactory>({
					chainId: entityId.chainId,
					items: wires,
				})
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Network,
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
				const { getBlockscoutUserOperationsPage } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: entityId.chainId,
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${entityId.chainId}`)
				}
				const wires = await getBlockscoutUserOperationsPage({ explorerOrigin: origin, limit })
				const entities = (
					wires.flatMap((w) => {
						const hashRaw = w.hash != null ? hexLowerOfByteSize(w.hash, 32) : undefined
						return hashRaw == null ?
								[]
							:	[{
									[EntityMetaKey.Id]: {
										$network: { chainId: entityId.chainId },
										hash: hashRaw,
									},
								} satisfies Entity<typeof schema, EntityType.EvmUserOperation>]
					})
				)
				return entities
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Network,
			fieldName: '$$gasEstimateTimestamps',
			resolve: async (entityId) => {
				const stats = await blockscoutStatsForChain(entityId.chainId)
				if (stats == null) {
					throw new Error(`Blockscout_Rest: no stats for chain ${entityId.chainId}`)
				}
				const observation = gasEstimateObservationFromBlockscoutStats(stats)
				if (observation == null) {
					throw new Error(`Blockscout_Rest: stats on chain ${entityId.chainId} have no gas estimate observation`)
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
					:	NaN
				)
				const timestampMs = (
					Number.isFinite(updatedAtMs) ?
						updatedAtMs
					:	Date.now()
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
					:	undefined
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
					:	NaN
				)
				const timestampMs = (
					Number.isFinite(updatedAtMs) ?
						updatedAtMs
					:	Date.now()
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
				const { getTransactionReceiptBlockscout } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: entityId.$network.chainId,
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${entityId.$network.chainId}`)
				}
				const receipt = await singleFlight(getTransactionReceiptBlockscout)({
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
								:	[{
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
				const { getBlockscoutTransactionTokenTransfers } = await import('$/sources/Blockscout/Rest/queries.ts')
				const limit = Math.min(
					resolverLoadSubsetRowLimit(context),
					blockscoutV2ItemsCountMax,
				)
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: entityId.$network.chainId,
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${entityId.$network.chainId}`)
				}
				const wires = await singleFlight(getBlockscoutTransactionTokenTransfers)({
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
				const { getBlockscoutTransactionInternalTransactions } = await import('$/sources/Blockscout/Rest/queries.ts')
				const limit = Math.min(
					resolverLoadSubsetRowLimit(context),
					blockscoutV2ItemsCountMax,
				)
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: entityId.$network.chainId,
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${entityId.$network.chainId}`)
				}
				const wires = await singleFlight(getBlockscoutTransactionInternalTransactions)({
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
				const { getBlockTransactionsBlockscout } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: entityId.$network.chainId,
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${entityId.$network.chainId}`)
				}
				const wires = await singleFlight(getBlockTransactionsBlockscout)({
					explorerOrigin: origin,
					blockNumber: entityId.blockNumber,
					limit,
				})
				return (
					wires
						.flatMap((w) => {
							const txHash = w.hash != null ? hexLowerOfByteSize(w.hash, 32) : undefined
							return txHash == null ?
									[]
								:	[{
										[EntityMetaKey.Id]: {
											$network: { chainId: entityId.$network.chainId },
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
				const { getBlockscoutAddressDetails } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = await requireBlockscoutV2ExplorerOrigin(entityId.$network.chainId)
				const address = hexLowerOfByteSize(entityId.address, 20)
				if (address == null) {
					throw new Error('Blockscout_Rest: address not normalized')
				}
				const details = await singleFlight(getBlockscoutAddressDetails)({
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
				const { getBlockscoutAddressDetails } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = await requireBlockscoutV2ExplorerOrigin(entityId.$network.chainId)
				const address = hexLowerOfByteSize(entityId.address, 20)
				if (address == null) {
					throw new Error('Blockscout_Rest: address not normalized')
				}
				const details = await singleFlight(getBlockscoutAddressDetails)({
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
				const { getBlockscoutAddressDetails } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = await requireBlockscoutV2ExplorerOrigin(entityId.$network.chainId)
				const address = hexLowerOfByteSize(entityId.address, 20)
				if (address == null) {
					throw new Error('Blockscout_Rest: address not normalized')
				}
				const details = await singleFlight(getBlockscoutAddressDetails)({
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
				const { getBlockscoutContractSourceCodeRow } = await import('$/sources/Blockscout/Rest/queries.ts')
				const sourceRow = await singleFlight(getBlockscoutContractSourceCodeRow)({
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
				const { getBlockscoutContractAbiJsonString } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = await requireBlockscoutV2ExplorerOrigin(entityId.$network.chainId)
				const address = hexLowerOfByteSize(entityId.address, 20)
				if (address == null) {
					throw new Error('Blockscout_Rest: address not normalized')
				}
				const abi = await singleFlight(getBlockscoutContractAbiJsonString)({
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
				const { blockscoutEthGetCode } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = await requireBlockscoutV2ExplorerOrigin(entityId.$network.chainId)
				const address = hexLowerOfByteSize(entityId.address, 20)
				if (address == null) {
					throw new Error('Blockscout_Rest: address not normalized')
				}
				const codeHex = await singleFlight(blockscoutEthGetCode)({
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
				const { blockscoutEthGetCode } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = await requireBlockscoutV2ExplorerOrigin(entityId.$network.chainId)
				const address = hexLowerOfByteSize(entityId.address, 20)
				if (address == null) {
					throw new Error('Blockscout_Rest: address not normalized')
				}
				const codeHex = await singleFlight(blockscoutEthGetCode)({
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
				const { blockscoutEthGetStorageAt } = await import('$/sources/Blockscout/Rest/queries.ts')
				const origin = blockscoutV2ExplorerOriginWhenRestSupported({
					chainId: entityId.$network.chainId,
					blockscoutExplorerOriginForChain,
					blockscoutRestV2AtExplorerOrigin,
				})
				if (origin == null) {
					throw new Error(`Blockscout_Rest: no Blockscout v2 explorer for chain ${entityId.$network.chainId}`)
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
						singleFlight(blockscoutEthGetStorageAt)({
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
