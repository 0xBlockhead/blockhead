import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import { keccak256, toHex } from '@tevm/voltaire/Hash'
import { toBytes } from '@tevm/voltaire/Hex'

import {
	EvmInternalCallType,
	EvmTokenStandard,
	EvmTransactionEnvelopeType,
	EvmTransactionExecutionStatus,
	EvmTransactionKind,
} from '$/constants/Evm.ts'
import { evmAbiFromJsonString } from '$/lib/evmAbi.ts'
import { hexLowerOfByteSize, with0xHex, zeroExLowerCase } from '$/lib/hexLowerOfByteSize.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import {
	evmChainIdFromNetworkSelector,
	evmNetworkSelectorFromChainId,
} from '$/resolvers/evm.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import type { Entity, EntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { CoinInstanceType } from '$/schema/CoinInstanceType.ts'
import { Source } from '$/sources/Source.ts'
import type { SourcePublicEnv } from '$/sources/$sources.ts'
import type {
	EtherscanInternalTransaction,
	EtherscanTokenTransferTagged,
} from '$/sources/Etherscan/Rest/types.ts'
import type { RpcLog } from '$/sources/_shared/interfaces/EvmExecutionJsonRpc/types.ts'

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
	const codeHash = runtimeCode == null ?
		undefined
	:
		toHex(keccak256(toBytes(runtimeCode)))
		return codeHash
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

const etherscanQuantityToBigInt = (
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

const etherscanTipBlockObservationClock = async ({
	publicEnv,
	chainId,
}: {
	publicEnv: SourcePublicEnv
	chainId: number
}) => {
	const {
		getBlockByNumber,
		getBlockNumber,
	} = await import('$/sources/Etherscan/Rest/queries.ts')
	const headHex = await getBlockNumber({
		publicEnv,
		chainId,
	})
	const blockNumber = etherscanQuantityToBigInt(headHex ?? undefined)
	if (blockNumber == null)
		throw new Error('Etherscan_Rest: tip block missing for account observation clock')

	const tip = await getBlockByNumber({
		publicEnv,
		chainId,
		blockNumber,
		includeTransactions: false,
	})
	const timestampSeconds = etherscanQuantityToBigInt(tip?.timestamp)
	if (timestampSeconds == null)
		throw new Error('Etherscan_Rest: tip block timestamp missing for account observation clock')

	return {
		blockNumber,
		timestampMs: Number(timestampSeconds) * 1_000,
	}
}

const etherscanEvmNetworkAccountObservation = async ({
	publicEnv,
	$network,
	$actor,
}: {
	publicEnv: SourcePublicEnv
	$network: EvmNetworkId
	$actor: EntitySelector<typeof schema, EntityType.EvmAccount>
}) => {
	const address = hexLowerOfByteSize($actor.address, 20)
	if (address == null)
		throw new Error('Etherscan_Rest: EvmNetworkAccount wallet address not normalized')

	const chainId = evmChainIdFromNetworkSelector($network)
	const { getCode } = await import('$/sources/Etherscan/Rest/queries.ts')
	const [codeHex, tipClock] = await Promise.all([
		getCode({
			publicEnv,
			chainId,
			address,
		}),
		etherscanTipBlockObservationClock({
			publicEnv,
			chainId,
		}),
	])
	if (codeHex == null)
		throw new Error('Etherscan_Rest: eth_getCode returned no result')

	return {
		[EntityMetaKey.Selector]: {
			$account: {
				$network,
				$actor,
			},
			timestampMs: tipClock.timestampMs,
			source: Source.Etherscan_Rest,
		},
		blockNumber: tipClock.blockNumber,
		isContract: codeHex !== '0x' && codeHex !== '0x0',
	}
}

const etherscanLogIndexFromWire = (
	raw: string | undefined
): number | undefined => (
	raw == null || raw === '' ?
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

const evmTokenStandardFromEtherscanTaggedWire = (
	wire: EtherscanTokenTransferTagged
): EvmTokenStandard => (
	wire.standard === 'erc721' ?
		EvmTokenStandard.Erc721
	:
		wire.standard === 'erc1155' ?
			EvmTokenStandard.Erc1155
		:
			EvmTokenStandard.Erc20
)

const evmTokenTransferEntityFromEtherscanWire = ({
	$network,
	txHash,
	wire,
	transferIndex = 0,
}: {
	$network: EvmNetworkId
	txHash: string
	wire: EtherscanTokenTransferTagged
	transferIndex?: number
}) => {
	const normalizedTxHash = hexLowerOfByteSize(txHash, 32)
	const logIndex = etherscanLogIndexFromWire(wire.row.logIndex)
	if (normalizedTxHash == null || logIndex == null) return undefined
	const standard = evmTokenStandardFromEtherscanTaggedWire(wire)
	const tokenTransferWire = wire.row
	const fromAddress = hexLowerOfByteSize(tokenTransferWire.from ?? '', 20)
	const toAddress = hexLowerOfByteSize(tokenTransferWire.to ?? '', 20)
	const tokenAddress = hexLowerOfByteSize(tokenTransferWire.contractAddress ?? '', 20)
	const tokenId = (
		wire.standard === 'erc721' || wire.standard === 'erc1155' ?
			etherscanQuantityToBigInt(wire.row.tokenID)
		:
			undefined
	)
	const amount = (
		wire.standard === 'erc721' ?
			1n
		:
			wire.standard === 'erc1155' ?
				etherscanQuantityToBigInt(wire.row.tokenValue) ?? 0n
			:
				etherscanQuantityToBigInt(wire.row.value) ?? 0n
	)
	const tokenDecimals = (
		tokenTransferWire.tokenDecimal != null && tokenTransferWire.tokenDecimal !== '' ?
			Number(tokenTransferWire.tokenDecimal)
		:
			undefined
	)
	return {
		[EntityMetaKey.Selector]: {
			$log: {
				$transaction: {
					$network,
					txHash: normalizedTxHash,
				},
				indexInTransaction: logIndex,
			},
			indexInLog: transferIndex,
		},
		$log: {
			[EntityMetaKey.Selector]: {
				$transaction: {
					$network,
					txHash: normalizedTxHash,
				},
				indexInTransaction: logIndex,
			},
		} satisfies Entity<typeof schema, EntityType.EvmLog>,
		standard,
		amount,
		...(tokenId != null && { tokenId }),
		...(tokenTransferWire.tokenSymbol != null && { tokenSymbol: tokenTransferWire.tokenSymbol }),
		...(tokenTransferWire.tokenName != null && { tokenName: tokenTransferWire.tokenName }),
		...(tokenDecimals != null && Number.isFinite(tokenDecimals) && {
			tokenDecimals,
		}),
		...(fromAddress != null && {
			$from: {
				[EntityMetaKey.Selector]: { address: fromAddress },
			},
		}),
		...(toAddress != null && {
			$to: {
				[EntityMetaKey.Selector]: { address: toAddress },
			},
		}),
		...(tokenAddress != null && {
			$tokenContract: {
				[EntityMetaKey.Selector]: {
					$network,
					address: tokenAddress,
				},
			},
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
				},
			}),
		}),
	}
}

const evmTokenTransferEntitySelectorsFromEtherscanWires = ({
	$network,
	txHash,
	wires,
}: {
	$network: EvmNetworkId
	txHash: string
	wires: readonly EtherscanTokenTransferTagged[]
}) => {
	const normalizedTxHash = hexLowerOfByteSize(txHash, 32)
	if (normalizedTxHash == null) return []

	return wires.flatMap((wire, index) => {
		const indexInTransaction = etherscanLogIndexFromWire(wire.row.logIndex)
		return indexInTransaction == null ?
			[]
		:
			[{
				[EntityMetaKey.Selector]: {
					$log: {
						$transaction: {
							$network,
							txHash: normalizedTxHash,
						},
						indexInTransaction,
					},
					indexInLog: wires
						.slice(0, index)
						.filter((previousWire) => (
							etherscanLogIndexFromWire(previousWire.row.logIndex)
							=== indexInTransaction
						))
						.length,
				},
			}]
	})
}

const evmTokenTransferEntitySelectorsFromEtherscanAddressWires = ({
	$network,
	wires,
}: {
	$network: EvmNetworkId
	wires: readonly EtherscanTokenTransferTagged[]
}) => {
	const wiresByTxHash = new Map<`0x${string}`, EtherscanTokenTransferTagged[]>()
	for (const wire of wires) {
		const txHash = hexLowerOfByteSize(wire.row.hash ?? '', 32)
		if (txHash == null) continue
		const txWires = wiresByTxHash.get(txHash) ?? []
		txWires.push(wire)
		wiresByTxHash.set(txHash, txWires)
	}
	return (
		[...wiresByTxHash.entries()]
			.flatMap(([txHash, txWires]) => (
				evmTokenTransferEntitySelectorsFromEtherscanWires({
					$network,
					txHash,
					wires: txWires,
				})
			))
	)
}

const findEtherscanTokenTransferWireForEntitySelector = (
	wires: readonly EtherscanTokenTransferTagged[],
	entitySelector: EntitySelector<typeof schema, EntityType.EvmTokenTransfer>
): EtherscanTokenTransferTagged | undefined => (
	wires
		.filter((wire) => (
			etherscanLogIndexFromWire(wire.row.logIndex) === entitySelector.$log.indexInTransaction
		))
		.at(entitySelector.indexInLog)
)

const evmInternalTransferEntityFromEtherscanWire = ({
	$network,
	txHash,
	internalIndex,
	wire,
}: {
	$network: EvmNetworkId
	txHash: string
	internalIndex: number
	wire: EtherscanInternalTransaction
}) => {
	const normalizedTxHash = hexLowerOfByteSize(txHash, 32)
	if (normalizedTxHash == null || internalIndex < 0) return undefined
	const fromAddress = hexLowerOfByteSize(wire.from ?? '', 20)
	const toAddress = hexLowerOfByteSize(wire.to ?? '', 20)
	const createdAddress = hexLowerOfByteSize(wire.contractAddress ?? '', 20)
	const value = etherscanQuantityToBigInt(wire.value) ?? 0n
	const callType = evmInternalCallTypeFromWire(wire.type)
	if (callType == null) return undefined

	const entitySelector = {
		$transaction: {
			$network,
			txHash: normalizedTxHash,
		},
		indexInTransaction: internalIndex,
	} satisfies EntitySelector<typeof schema, EntityType.EvmInternalTransfer>
	return {
		[EntityMetaKey.Selector]: entitySelector,
		$transaction: {
			[EntityMetaKey.Selector]: {
				$network,
				txHash: normalizedTxHash,
			},
		} satisfies Entity<typeof schema, EntityType.EvmTransaction>,
		value,
		callType,
		...(wire.isError != null && { success: wire.isError === '0' }),
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

const evmInternalTransferEntitySelectorsFromEtherscanWires = ({
	$network,
	txHash,
	wires,
}: {
	$network: EvmNetworkId
	txHash: string
	wires: readonly EtherscanInternalTransaction[]
}) => {
	const normalizedTxHash = hexLowerOfByteSize(txHash, 32)
	if (normalizedTxHash == null) return []

	return wires.flatMap((wire, indexInTransaction) => (
		evmInternalCallTypeFromWire(wire.type) == null ?
			[]
		:
			[{
				[EntityMetaKey.Selector]: {
					$transaction: {
						$network,
						txHash: normalizedTxHash,
					},
					indexInTransaction,
				},
			}]
	))
}

const evmInternalTransferEntitySelectorsFromEtherscanAddressWires = ({
	$network,
	wires,
}: {
	$network: EvmNetworkId
	wires: readonly EtherscanInternalTransaction[]
}) => {
	const wiresByTxHash = new Map<`0x${string}`, EtherscanInternalTransaction[]>()
	for (const wire of wires) {
		const txHash = hexLowerOfByteSize(wire.hash ?? '', 32)
		if (txHash == null) continue
		const txWires = wiresByTxHash.get(txHash) ?? []
		txWires.push(wire)
		wiresByTxHash.set(txHash, txWires)
	}
	return (
		[...wiresByTxHash.entries()]
			.flatMap(([txHash, txWires]) => (
				evmInternalTransferEntitySelectorsFromEtherscanWires({
					$network,
					txHash,
					wires: txWires,
				})
			))
	)
}

const findEtherscanInternalTransferWireForEntitySelector = (
	wires: readonly EtherscanInternalTransaction[],
	entitySelector: EntitySelector<typeof schema, EntityType.EvmInternalTransfer>
): EtherscanInternalTransaction | undefined => (
	wires[entitySelector.indexInTransaction]
)

const rpcQuantityToNumber = (
	raw: string | null | undefined
) => {
	const value = etherscanQuantityToBigInt(raw ?? undefined)
	return value == null || value > BigInt(Number.MAX_SAFE_INTEGER) ? undefined : Number(value)
}

const evmLogIndexFromRpcWire = (
	raw: string | undefined
) => rpcQuantityToNumber(raw)

const evmTransactionEnvelopeTypeFromRpcTypeByte = (
	raw: number | undefined
): EvmTransactionEnvelopeType => (
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

const evmBlobEntityRefsFromEtherscanTx = ({
	$network,
	txHash,
	blobVersionedHashes,
	blockNumber,
}: {
	$network: EvmNetworkId
	txHash: `0x${string}`
	blobVersionedHashes: readonly string[] | undefined
	blockNumber?: bigint
}) => (
	(blobVersionedHashes ?? []).flatMap((blobVersionedHash, blobIndex) => {
		const versionedHash = hexLowerOfByteSize(blobVersionedHash, 32)
		if (versionedHash == null || !versionedHash.startsWith('0x01'))
			return []

		return [{
			[EntityMetaKey.Selector]: {
				$transaction: {
					$network,
					txHash,
				},
				indexInTransaction: blobIndex,
			},
			versionedHash,
			$transaction: {
				[EntityMetaKey.Selector]: {
					$network,
					txHash,
				},
			} satisfies Entity<typeof schema, EntityType.EvmTransaction>,
			...(blockNumber != null && {
				$block: {
					[EntityMetaKey.Selector]: {
						$network,
						blockNumber,
					},
				} satisfies Entity<typeof schema, EntityType.EvmBlock>,
			}),
		}]
	})
)

const evmLogEntityFromRpcWire = (
	entitySelector: EntitySelector<typeof schema, EntityType.EvmLog>,
	log: RpcLog
) => {
	const address = hexLowerOfByteSize(log.address ?? '', 20)
	const blockHash = hexLowerOfByteSize(log.blockHash ?? '', 32)
	const blockNumber = etherscanQuantityToBigInt(log.blockNumber)
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

const gweiFromDecimalString = (
	raw: string | undefined
): number | undefined => {
	if (raw == null || raw === '') return undefined
	const value = Number(raw)
	return Number.isFinite(value) && value >= 0 ?
		value
	:
		undefined
}


export default {
	source: Source.Etherscan_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.EvmNetwork_GasEstimate_Timestamp,
			resolve: {
				NetworkTimestampMsSource: {
					resolve: async ({ $network, source }, context) => {
						if (source !== Source.Etherscan_Rest)
							throw new Error('Etherscan_Rest: EvmNetwork_GasEstimate_Timestamp selector source mismatch')

						const { getGasOracle } = await import('$/sources/Etherscan/Rest/queries.ts')
						const chainId = evmChainIdFromNetworkSelector($network)
						const oracle = await getGasOracle({
							publicEnv: context.publicEnv,
							chainId,
						})
						if (oracle == null)
							throw new Error('Etherscan_Rest: gasoracle returned no result')
						const slowGwei = gweiFromDecimalString(oracle.SafeGasPrice)
						const averageGwei = gweiFromDecimalString(oracle.ProposeGasPrice)
						const fastGwei = gweiFromDecimalString(oracle.FastGasPrice)
						if (slowGwei == null && averageGwei == null && fastGwei == null)
							throw new Error('Etherscan_Rest: gasoracle missing tier prices')
						return {
							...(slowGwei != null && { slowGwei }),
							...(averageGwei != null && { averageGwei }),
							...(fastGwei != null && { fastGwei }),
							transport: 'etherscan-gasoracle',
						}
					},
				},
			},
		})({
			slowGwei: (timestamp) => timestamp.slowGwei,
			averageGwei: (timestamp) => timestamp.averageGwei,
			fastGwei: (timestamp) => timestamp.fastGwei,
			transport: (timestamp) => timestamp.transport,
		}),

		defineResolver({
			entityType: EntityType.EvmTokenTransfer,
			resolve: {
				LogIndexInLog: {
					resolve: async (entitySelector, context) => {
						const {
							getTokenTransfersByTransaction,
							getAccountListMaxOffset,
						} = await import('$/sources/Etherscan/Rest/queries.ts')
						const chainId = evmChainIdFromNetworkSelector(entitySelector.$log.$transaction.$network)
						const wires = await getTokenTransfersByTransaction({
							publicEnv: context.publicEnv,
							chainId,
							txHash: entitySelector.$log.$transaction.txHash,
							offset: getAccountListMaxOffset,
						})
						if (wires == null)
							throw new Error('Etherscan_Rest: token transfers by transaction returned no result')
						const wire = findEtherscanTokenTransferWireForEntitySelector(wires, entitySelector)
						if (wire == null)
							throw new Error('Etherscan_Rest: token transfer not found for EvmTokenTransfer')
						const entity = evmTokenTransferEntityFromEtherscanWire({
							$network: entitySelector.$log.$transaction.$network,
							txHash: entitySelector.$log.$transaction.txHash,
							transferIndex: entitySelector.indexInLog,
							wire,
						})
						if (entity == null)
							throw new Error('Etherscan_Rest: token transfer wire did not map to EvmTokenTransfer')
						return entity
					},
				}
			},
		})({
				$log: (transfer) => transfer.$log,
				indexInLog: (transfer) => transfer[EntityMetaKey.Selector].indexInLog,
				standard: (transfer) => transfer.standard,
				amount: (transfer) => transfer.amount,
				tokenSymbol: (transfer) => transfer.tokenSymbol,
				tokenName: (transfer) => transfer.tokenName,
				tokenDecimals: (transfer) => transfer.tokenDecimals,
				Nft: {
					tokenId: (transfer) => {
						if (transfer.tokenId == null)
							throw new Error('Etherscan_Rest: NFT transfer missing token id')

						return transfer.tokenId
					},
				},
				$from: (transfer) => transfer.$from,
				$to: (transfer) => transfer.$to,
				$tokenContract: (transfer) => (
					transfer.$tokenContract == null ?
						undefined
					:
						{
							[EntityMetaKey.Selector]: transfer.$tokenContract[EntityMetaKey.Selector],
						}
				),
				$coinInstance: (transfer) => (
					transfer.$coinInstance == null ?
						undefined
					:
						{
							[EntityMetaKey.Selector]: transfer.$coinInstance[EntityMetaKey.Selector],
						}
				),
			}),

		defineResolver({
			entityType: EntityType.EvmInternalTransfer,
			resolve: {
				TransactionIndexInTransaction: {
					resolve: async (entitySelector, context) => {
						const { getInternalTransactionsByTxHash } = await import('$/sources/Etherscan/Rest/queries.ts')
						const chainId = evmChainIdFromNetworkSelector(entitySelector.$transaction.$network)
						const wires = await getInternalTransactionsByTxHash({
							publicEnv: context.publicEnv,
							chainId,
							txHash: entitySelector.$transaction.txHash,
						})
						if (wires == null)
							throw new Error('Etherscan_Rest: internal transactions by tx hash returned no result')
						const wire = findEtherscanInternalTransferWireForEntitySelector(wires, entitySelector)
						if (wire == null)
							throw new Error('Etherscan_Rest: internal transfer not found for EvmInternalTransfer')
						const entity = evmInternalTransferEntityFromEtherscanWire({
							$network: entitySelector.$transaction.$network,
							txHash: entitySelector.$transaction.txHash,
							internalIndex: entitySelector.indexInTransaction,
							wire,
						})
						if (entity == null)
							throw new Error('Etherscan_Rest: internal transfer wire did not map to EvmInternalTransfer')
						return entity
					},
				}
			},
		})({
				$transaction: (transfer) => transfer.$transaction,
				indexInTransaction: (transfer) => transfer[EntityMetaKey.Selector].indexInTransaction,
				value: ({ value }) => value,
				callType: (transfer) => transfer.callType,
				success: (transfer) => transfer.success,
				$from: (transfer) => transfer.$from,
				$to: (transfer) => transfer.$to,
				$createdContract: (transfer) => transfer.$createdContract,
			}),
		defineResolver({
			entityType: EntityType.EvmContract,
			resolve: {
				EvmNetworkAddress: {
					resolve: async ({ $network, address }, context) => {
						const { getContractAbiJsonString } = await import('$/sources/Etherscan/Rest/queries.ts')
						const chainId = evmChainIdFromNetworkSelector($network)
						const abi = await getContractAbiJsonString({
							publicEnv: context.publicEnv,
							chainId,
							address: address,
						})
						return abi == null ? undefined : evmAbiFromJsonString(abi)
					},
				}
			},
		})({
				abi: (contract) => contract,
			}),

		defineResolver({
			entityType: EntityType.EvmContract,
			resolve: {
				EvmNetworkAddress: {
					resolve: async ({ $network, address }, context) => {
						const { getContractCreation } = await import('$/sources/Etherscan/Rest/queries.ts')
						const chainId = evmChainIdFromNetworkSelector($network)
						const contractCreation = await getContractCreation({
							publicEnv: context.publicEnv,
							chainId,
							address: address,
						})
						const creator = contractCreation?.contractCreator
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
				$deployer: (contract) => contract,
			}),

		defineResolver({
			entityType: EntityType.EvmContract,
			resolve: {
				EvmNetworkAddress: {
					resolve: async ({ $network, address }, context) => {
						const { getContractCreation } = await import('$/sources/Etherscan/Rest/queries.ts')
						const chainId = evmChainIdFromNetworkSelector($network)
						const contractCreation = await getContractCreation({
							publicEnv: context.publicEnv,
							chainId,
							address: address,
						})
						const txHash = contractCreation?.txHash
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
				$creationTransaction: (contract) => contract,
			}),

		defineResolver({
			entityType: EntityType.EvmContract,
			resolve: {
				EvmNetworkAddress: {
					resolve: async ({ $network, address }, context) => {
						const { getContractSourceCode } = await import('$/sources/Etherscan/Rest/queries.ts')
						const chainId = evmChainIdFromNetworkSelector($network)
						const contractSourceCode = await getContractSourceCode({
							publicEnv: context.publicEnv,
							chainId,
							address: address,
						})
						const implementation = contractSourceCode?.Implementation
						if (implementation == null || implementation === '') return undefined
						const normalized = hexLowerOfByteSize(implementation, 20)
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
				$implementation: (contract) => contract,
			}),

		defineResolver({
			entityType: EntityType.EvmContract,
			resolve: {
				EvmNetworkAddress: {
					resolve: async ({ $network, address }, context) => {
						const { getCode } = await import('$/sources/Etherscan/Rest/queries.ts')
						const chainId = evmChainIdFromNetworkSelector($network)
						const codeHex = await getCode({
							publicEnv: context.publicEnv,
							chainId,
							address: address,
						})
						if (codeHex == null) return undefined
						return evmContractRuntimeCodeFromGetCodeHex(codeHex)
					},
				}
			},
		})({
				code: (contract) => contract,
			}),

		defineResolver({
			entityType: EntityType.EvmContract,
			resolve: {
				EvmNetworkAddress: {
					resolve: async ({ $network, address }, context) => {
						const { getCode } = await import('$/sources/Etherscan/Rest/queries.ts')
						const chainId = evmChainIdFromNetworkSelector($network)
						const codeHex = await getCode({
							publicEnv: context.publicEnv,
							chainId,
							address: address,
						})
						if (codeHex == null) return undefined
						return evmContractBytecodeHashFromGetCodeHex(codeHex)
					},
				}
			},
		})({
				codeHash: (contract) => contract,
			}),

		defineResolver({
			entityType: EntityType.EvmContract,
			resolve: {
				EvmNetworkAddress: {
					resolve: async ({ $network, address }, context) => {
						const { getStorageAt } = await import('$/sources/Etherscan/Rest/queries.ts')
						const chainId = evmChainIdFromNetworkSelector($network)
						const depth = Math.min(32, Math.max(1, resolverContextRowLimit(context)))
						return evmContractStorageSlotReadsFromEthGetStorageAt({
							address,
							depth,
							getStorageAt: (slotQuantityHex) => (
								getStorageAt({
									publicEnv: context.publicEnv,
									chainId,
									address,
									slotQuantityHex,
								}).then((valueHex) => {
									if (valueHex == null) throw new Error('Etherscan_Rest: eth_getStorageAt returned no result')
									return valueHex
								})
							),
						})
					},
				}
			},
		})({
				storageSlotReads: (contract) => contract,
			}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async (entitySelector) => {
						const { supportsChainId } = await import('$/sources/Etherscan/Rest/queries.ts')
						if (!supportsChainId(evmChainIdFromNetworkSelector(entitySelector)))
							throw new Error('Etherscan_Rest: unsupported network')

						return [
							{
								[EntityMetaKey.Selector]: {
									$network: entitySelector,
									timestampMs: Date.now(),
									source: Source.Etherscan_Rest,
								},
							},
						]
					},
				}
			},
		})({
				Evm: {
					$$gasEstimateTimestamps: (network) => network,
				},
			}),

		defineResolver({
			entityType: EntityType.EvmNetworkAccount,
			resolve: {
				EvmNetworkEvmAccount: {
					resolve: async ({ $actor, $network }, context) => {
						const {
							getTokenTransfersByAddress,
							getAccountListMaxOffset,
						} = await import('$/sources/Etherscan/Rest/queries.ts')
						const chainId = evmChainIdFromNetworkSelector($network)
						const address = hexLowerOfByteSize($actor.address, 20)
						if (address == null)
							throw new Error('Etherscan_Rest: EvmNetworkAccount wallet address not normalized')
						const limit = Math.min(
							resolverContextRowLimit(context),
							getAccountListMaxOffset
						)
						const wires = await getTokenTransfersByAddress({
							publicEnv: context.publicEnv,
							chainId,
							address,
							offset: limit,
						})
						if (wires == null)
							throw new Error('Etherscan_Rest: address token transfers returned no result')
						return evmTokenTransferEntitySelectorsFromEtherscanAddressWires({
							$network,
							wires,
						})
					},
				}
			},
		})({
				$$tokenTransfers: (account) => account,
			}),

		defineResolver({
			entityType: EntityType.EvmNetworkAccount,
			resolve: {
				EvmNetworkEvmAccount: {
					resolve: async ({ $actor, $network }, context) => {
						const {
							getInternalTransactionsByAddress,
							getAccountListMaxOffset,
						} = await import('$/sources/Etherscan/Rest/queries.ts')
						const chainId = evmChainIdFromNetworkSelector($network)
						const address = hexLowerOfByteSize($actor.address, 20)
						if (address == null)
							throw new Error('Etherscan_Rest: EvmNetworkAccount wallet address not normalized')
						const limit = Math.min(
							resolverContextRowLimit(context),
							getAccountListMaxOffset
						)
						const wires = await getInternalTransactionsByAddress({
							publicEnv: context.publicEnv,
							chainId,
							address,
							offset: limit,
						})
						if (wires == null)
							throw new Error('Etherscan_Rest: address internal transactions returned no result')
						return evmInternalTransferEntitySelectorsFromEtherscanAddressWires({
							$network,
							wires,
						})
					},
				}
			},
		})({
				$$internalTransfers: (account) => account,
			}),

		defineResolver({
			entityType: EntityType.EvmLog,
			resolve: {
				TransactionIndexInTransaction: {
					resolve: async ({ $transaction, indexInTransaction }, context) => {
						const {
							getTokenTransfersByTransaction,
							getAccountListMaxOffset,
						} = await import('$/sources/Etherscan/Rest/queries.ts')
						const chainId = evmChainIdFromNetworkSelector($transaction.$network)
						const limit = Math.min(
							resolverContextRowLimit(context),
							getAccountListMaxOffset
						)
						const wires = await getTokenTransfersByTransaction({
							publicEnv: context.publicEnv,
							chainId,
							txHash: $transaction.txHash,
							offset: limit,
						})
						if (wires == null)
							throw new Error('Etherscan_Rest: token transfers by transaction returned no result')
						return evmTokenTransferEntitySelectorsFromEtherscanWires({
							$network: $transaction.$network,
							txHash: $transaction.txHash,
							wires,
						})
							.filter((entity) => (
								entity[EntityMetaKey.Selector].$log.indexInTransaction === indexInTransaction
							))
					},
				}
			},
		})({
				Event: {
					TokenTransfer: {
						$$tokenTransfers: (log) => log,
					},
				},
			}),

		defineResolver({
			entityType: EntityType.EvmTransaction,
			resolve: {
				EvmNetworkTxHash: {
					resolve: async ({ $network, txHash }, context) => {
						const {
							getTokenTransfersByTransaction,
							getAccountListMaxOffset,
						} = await import('$/sources/Etherscan/Rest/queries.ts')
						const chainId = evmChainIdFromNetworkSelector($network)
						const limit = Math.min(
							resolverContextRowLimit(context),
							getAccountListMaxOffset
						)
						const wires = await getTokenTransfersByTransaction({
							publicEnv: context.publicEnv,
							chainId,
							txHash: txHash,
							offset: limit,
						})
						if (wires == null)
							throw new Error('Etherscan_Rest: transaction token transfers returned no result')
						return evmTokenTransferEntitySelectorsFromEtherscanWires({
							$network,
							txHash,
							wires,
						})
					},
				}
			},
		})({
				$$tokenTransfers: (transaction) => transaction,
			}),

		defineResolver({
			entityType: EntityType.EvmTransaction,
			resolve: {
				EvmNetworkTxHash: {
					resolve: async ({ $network, txHash }, context) => {
						const { getInternalTransactionsByTxHash } = await import('$/sources/Etherscan/Rest/queries.ts')
						const chainId = evmChainIdFromNetworkSelector($network)
						const wires = await getInternalTransactionsByTxHash({
							publicEnv: context.publicEnv,
							chainId,
							txHash: txHash,
						})
						if (wires == null)
							throw new Error('Etherscan_Rest: transaction internal transfers returned no result')
						return (
							evmInternalTransferEntitySelectorsFromEtherscanWires({
								$network: $network,
								txHash: txHash,
								wires,
							})
						)
					},
				}
			},
		})({
				$$internalTransfers: (transaction) => transaction,
			}),

		defineResolver({
			entityType: EntityType.EvmTransaction,
			resolve: {
				EvmNetworkTxHash: {
					resolve: async ({ $network, txHash: txHashSelector }, context) => {
						const {
							getTransactionByHash,
							getTransactionReceipt,
						} = await import('$/sources/Etherscan/Rest/queries.ts')
						const chainId = evmChainIdFromNetworkSelector($network)
						const requestedTxHash = hexLowerOfByteSize(txHashSelector, 32)
						if (requestedTxHash == null)
							throw new Error('Etherscan_Rest: invalid transaction hash')
						const jsonRpcTransaction = await getTransactionByHash({
							publicEnv: context.publicEnv,
							chainId,
							txHash: requestedTxHash,
						})
						if (jsonRpcTransaction == null)
							throw new Error('Etherscan_Rest: transaction not found')
						const receipt = await getTransactionReceipt({
							publicEnv: context.publicEnv,
							chainId,
							txHash: requestedTxHash,
						})
						const txHash = hexLowerOfByteSize(jsonRpcTransaction.hash ?? requestedTxHash, 32) ?? requestedTxHash
						const from = hexLowerOfByteSize(jsonRpcTransaction.from ?? '', 20)
						if (from == null)
							throw new Error('Etherscan_Rest: transaction is missing from address')
						const to = (
							jsonRpcTransaction.to != null ?
								hexLowerOfByteSize(jsonRpcTransaction.to, 20)
							:
								undefined
						)
						const containingBlockNumber = etherscanQuantityToBigInt(jsonRpcTransaction.blockNumber ?? undefined)
						const value = etherscanQuantityToBigInt(jsonRpcTransaction.value) ?? 0n
						const envelopeType = evmTransactionEnvelopeTypeFromRpcTypeByte(
							rpcQuantityToNumber(jsonRpcTransaction.type)
						)
						const createdContractAddress = (
							receipt?.contractAddress != null ?
								hexLowerOfByteSize(receipt.contractAddress, 20)
							:
								undefined
						)
						return {
							[EntityMetaKey.Selector]: {
								$network: evmNetworkSelectorFromChainId(chainId),
								txHash,
							},
							...(containingBlockNumber != null && {
								$block: {
									[EntityMetaKey.Selector]: {
										$network: evmNetworkSelectorFromChainId(chainId),
										blockNumber: containingBlockNumber,
									},
								} satisfies Entity<typeof schema, EntityType.EvmBlock>,
							}),
							$from: {
								[EntityMetaKey.Selector]: {
									address: from,
								},
							} satisfies Entity<typeof schema, EntityType.EvmAccount>,
							...(to != null && {
								$to: {
									[EntityMetaKey.Selector]: {
										address: to,
									},
								} satisfies Entity<typeof schema, EntityType.EvmAccount>,
							}),
							indexInBlock: rpcQuantityToNumber(jsonRpcTransaction.transactionIndex),
							value,
							nonce: rpcQuantityToNumber(jsonRpcTransaction.nonce),
							input: with0xHex(jsonRpcTransaction.input ?? '0x'),
							...(jsonRpcTransaction.r != null && { r: with0xHex(jsonRpcTransaction.r) }),
							...(jsonRpcTransaction.s != null && { s: with0xHex(jsonRpcTransaction.s) }),
							...(jsonRpcTransaction.v != null && { v: jsonRpcTransaction.v }),
							gas: etherscanQuantityToBigInt(jsonRpcTransaction.gas),
							gasPrice: etherscanQuantityToBigInt(jsonRpcTransaction.gasPrice),
							...(
								(
									envelopeType === EvmTransactionEnvelopeType.FeeMarket
									|| envelopeType === EvmTransactionEnvelopeType.Blob
									|| envelopeType === EvmTransactionEnvelopeType.SetCode
								) && {
									maxFeePerGas: etherscanQuantityToBigInt(jsonRpcTransaction.maxFeePerGas),
									maxPriorityFeePerGas: etherscanQuantityToBigInt(jsonRpcTransaction.maxPriorityFeePerGas),
									maxFeePerBlobGas: etherscanQuantityToBigInt(jsonRpcTransaction.maxFeePerBlobGas),
								}
							),
							envelopeType,
							kind: evmTransactionKindFromSignedFields({
								value,
								toAddress: to,
								input: jsonRpcTransaction.input,
								createdContractAddress,
							}),
							...(receipt == null && { executionStatus: EvmTransactionExecutionStatus.Pending }),
							...(Number(receipt?.status) === 1 && { executionStatus: EvmTransactionExecutionStatus.Success }),
							...(Number(receipt?.status) === 0 && { executionStatus: EvmTransactionExecutionStatus.Failed }),
							gasUsed: etherscanQuantityToBigInt(receipt?.gasUsed),
							cumulativeGasUsed: etherscanQuantityToBigInt(receipt?.cumulativeGasUsed),
							effectiveGasPrice: etherscanQuantityToBigInt(receipt?.effectiveGasPrice),
							blobGasUsed: etherscanQuantityToBigInt(receipt?.blobGasUsed),
							...(createdContractAddress != null && {
								$contract: {
									[EntityMetaKey.Selector]: {
										$network,
										address: createdContractAddress,
									},
								} satisfies Entity<typeof schema, EntityType.EvmContract>,
							}),
							$$blobs: evmBlobEntityRefsFromEtherscanTx({
								$network,
								txHash,
								blobVersionedHashes: jsonRpcTransaction.blobVersionedHashes,
								blockNumber: containingBlockNumber ?? undefined,
							}),
							$$logs: (
								(receipt?.logs ?? [])
									.flatMap((log) => {
										const logIndex = evmLogIndexFromRpcWire(log.logIndex)
										const normalizedTxHash = hexLowerOfByteSize(log.transactionHash ?? txHash, 32)
										return logIndex == null || normalizedTxHash == null ?
											[]
										:
											[evmLogEntityFromRpcWire({
												$transaction: {
													$network,
													txHash: normalizedTxHash,
												},
												indexInTransaction: logIndex,
											}, log)]
									})
							),
						}
					},
				}
			},
		})({
			$block: (transaction) => transaction.$block,
			$from: (transaction) => {
				if (transaction.$from == null)
					throw new Error('Etherscan_Rest: transaction is missing from address')

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
			r: (transaction) => transaction.r,
			s: (transaction) => transaction.s,
			v: (transaction) => transaction.v,
			gas: (transaction) => transaction.gas,
			kind: (transaction) => transaction.kind,
			envelopeType: (transaction) => {
				if (transaction.envelopeType == null)
					throw new Error('Etherscan_Rest: transaction has unsupported envelope type')

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
			Blob: {
				blobGasUsed: (transaction) => transaction.blobGasUsed,
				maxFeePerBlobGas: (transaction) => transaction.maxFeePerBlobGas,
				$$blobs: {
					select: (transaction) => transaction.$$blobs,
					resolveCount: (transaction) => transaction.$$blobs.length,
				},
			},
			$$logs: {
				select: (transaction) => transaction.$$logs.map((log) => ({
					[EntityMetaKey.Selector]: log[EntityMetaKey.Selector],
				})),
				resolveCount: (transaction) => transaction.$$logs.length,
			},
		}),

		defineResolver({
			entityType: EntityType.EvmLog,
			resolve: {
				TransactionIndexInTransaction: {
					resolve: async (entitySelector, context) => {
						const { getTransactionReceipt } = await import('$/sources/Etherscan/Rest/queries.ts')
						const chainId = evmChainIdFromNetworkSelector(entitySelector.$transaction.$network)
						const txHash = hexLowerOfByteSize(entitySelector.$transaction.txHash, 32)
						if (txHash == null)
							throw new Error('Etherscan_Rest: invalid log transaction hash')
						const receipt = await getTransactionReceipt({
							publicEnv: context.publicEnv,
							chainId,
							txHash,
						})
						if (receipt == null)
							throw new Error('Etherscan_Rest: transaction receipt not found for EvmLog')
						const log = (receipt.logs ?? []).find((row) => (
							evmLogIndexFromRpcWire(row.logIndex) === entitySelector.indexInTransaction
						))
						if (log == null)
							throw new Error('Etherscan_Rest: receipt log not found for EvmLog')
						return evmLogEntityFromRpcWire(entitySelector, log)
					},
				}
			},
		})({
			$$topics: (entity) => entity.$$topics.map((topic) => ({
				[EntityMetaKey.Selector]: topic[EntityMetaKey.Selector],
			})),
			topic0: (entity) => entity.topic0,
			indexInTransaction: (entity) => entity[EntityMetaKey.Selector].indexInTransaction,
			$transaction: (entity) => ({
				[EntityMetaKey.Selector]: entity.$transaction[EntityMetaKey.Selector],
			}),
			$block: (entity) => (
				entity.$block == null ?
					undefined
				:
					{
						[EntityMetaKey.Selector]: entity.$block[EntityMetaKey.Selector],
					}
			),
			data: (entity) => entity.data,
			removed: (entity) => entity.removed,
			$emitter: (entity) => (
				entity.$emitter == null ?
					undefined
				:
					{
						[EntityMetaKey.Selector]: entity.$emitter[EntityMetaKey.Selector],
					}
			),
			Event: {
				signatureHash: (entity) => {
					if (entity.topic0 == null)
						throw new Error('Etherscan_Rest: event log missing signature topic')

					return entity.topic0
				},
			},
		}),

		defineResolver({
			entityType: EntityType.EvmBlock,
			resolve: {
				EvmNetworkBlockNumber: {
					resolve: async ({ $network, blockNumber }, context) => {
						const { getBlockByNumber } = await import('$/sources/Etherscan/Rest/queries.ts')
						const chainId = evmChainIdFromNetworkSelector($network)
						const wire = await getBlockByNumber({
							publicEnv: context.publicEnv,
							chainId,
							blockNumber,
							includeTransactions: true,
						})
						if (wire == null)
							throw new Error('Etherscan_Rest: block not found')
						const blockHash = hexLowerOfByteSize(wire.hash ?? '', 32)
						if (blockHash == null)
							throw new Error('Etherscan_Rest: block missing hash')
						const parentHash = hexLowerOfByteSize(wire.parentHash ?? '', 32)
						const miner = hexLowerOfByteSize(wire.miner ?? '', 20)
						const parentBlockNumber = blockNumber > 0n ? blockNumber - 1n : undefined
						const timestampSeconds = etherscanQuantityToBigInt(wire.timestamp)
						return {
							[EntityMetaKey.Selector]: {
								$network: evmNetworkSelectorFromChainId(chainId),
								blockNumber,
							},
							hash: blockHash,
							...(parentHash != null && { parentHash }),
							blockNumber,
							...(timestampSeconds != null && {
								timestamp: Number(timestampSeconds) * 1_000,
							}),
							gasUsed: etherscanQuantityToBigInt(wire.gasUsed),
							gasLimit: etherscanQuantityToBigInt(wire.gasLimit),
							baseFeePerGas: etherscanQuantityToBigInt(wire.baseFeePerGas),
							blobGasUsed: etherscanQuantityToBigInt(wire.blobGasUsed),
							excessBlobGas: etherscanQuantityToBigInt(wire.excessBlobGas),
							transactionCount: wire.transactions?.length,
							...(parentBlockNumber != null && parentHash != null && {
								$parent: {
									[EntityMetaKey.Selector]: {
										$network: evmNetworkSelectorFromChainId(chainId),
										blockNumber: parentBlockNumber,
									},
									hash: parentHash,
								} satisfies Entity<typeof schema, EntityType.EvmBlock>,
							}),
							...(miner != null && {
								$miner: {
									[EntityMetaKey.Selector]: {
										address: miner,
									},
								},
							}),
							$$transactions: (
								(wire.transactions ?? [])
									.flatMap((transaction) => {
										const txHash = (
											typeof transaction === 'string' ?
												hexLowerOfByteSize(transaction, 32)
											:
												hexLowerOfByteSize(transaction.hash ?? '', 32)
										)
										return txHash == null ?
											[]
										:
											[{
												[EntityMetaKey.Selector]: {
													$network: evmNetworkSelectorFromChainId(chainId),
													txHash,
												},
											}]
									})
							),
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
			$$transactions: {
				select: (block) => block.$$transactions,
				resolveCount: (block) => block.transactionCount ?? block.$$transactions.length,
			},
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async (entitySelector, context) => {
						const {
							getBlockNumber,
							supportsChainId,
						} = await import('$/sources/Etherscan/Rest/queries.ts')
						const chainId = evmChainIdFromNetworkSelector(entitySelector)
						if (!supportsChainId(chainId))
							throw new Error('Etherscan_Rest: unsupported network')
						const headHex = await getBlockNumber({
							publicEnv: context.publicEnv,
							chainId,
						})
						const head = etherscanQuantityToBigInt(headHex ?? undefined)
						if (head == null)
							throw new Error('Etherscan_Rest: eth_blockNumber returned no result')
						const limit = Math.min(Math.max(1, resolverContextRowLimit(context)), 32)
						return Array.from(
							{ length: limit },
							(_, index) => head - BigInt(index)
						)
							.filter((blockNumber) => blockNumber >= 0n)
							.map((blockNumber) => ({
								[EntityMetaKey.Selector]: {
									$network: evmNetworkSelectorFromChainId(chainId),
									blockNumber,
								},
							}))
					},
				}
			},
		})({
			Evm: {
				$$blocks: (network) => network,
			},
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async (entitySelector, context) => {
						const {
							getBlockNumber,
							supportsChainId,
						} = await import('$/sources/Etherscan/Rest/queries.ts')
						const chainId = evmChainIdFromNetworkSelector(entitySelector)
						if (!supportsChainId(chainId))
							throw new Error('Etherscan_Rest: unsupported network')
						const headHex = await getBlockNumber({
							publicEnv: context.publicEnv,
							chainId,
						})
						const head = etherscanQuantityToBigInt(headHex ?? undefined)
						if (head == null)
							throw new Error('Etherscan_Rest: eth_blockNumber returned no result')
						return Number(head) + 1
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

		defineResolver({
			entityType: EntityType.EvmNetworkAccount,
			resolve: {
				EvmNetworkEvmAccount: {
					resolve: async ({ $actor, $network }, context) => {
						const address = hexLowerOfByteSize($actor.address, 20)
						if (address == null)
							throw new Error('Etherscan_Rest: EvmNetworkAccount wallet address not normalized')

						const tipClock = await etherscanTipBlockObservationClock({
							publicEnv: context.publicEnv,
							chainId: evmChainIdFromNetworkSelector($network),
						})
						return {
							$$timestamps: [
								{
									[EntityMetaKey.Selector]: {
										$account: {
											$network,
											$actor,
										},
										timestampMs: tipClock.timestampMs,
										source: Source.Etherscan_Rest,
									},
								},
							],
						}
					},
				}
			},
		})({
			$$timestamps: (account) => account.$$timestamps,
		}),

		defineResolver({
			entityType: EntityType.EvmNetworkAccount_Timestamp,
			resolve: {
				AccountTimestampMsSource: {
					resolve: async ({
						$account,
						timestampMs,
						source,
					}, context) => {
						if (source !== Source.Etherscan_Rest)
							throw new Error(`Etherscan_Rest: unsupported account observation source ${source}`)
						if (!Number.isSafeInteger(timestampMs) || timestampMs < 0)
							throw new Error('Etherscan_Rest: invalid account observation timestamp')

						const observation = await etherscanEvmNetworkAccountObservation({
							publicEnv: context.publicEnv,
							$network: $account.$network,
							$actor: $account.$actor,
						})
						if (observation[EntityMetaKey.Selector].timestampMs !== timestampMs)
							throw new Error('Etherscan_Rest: account observation timestamp does not match request')

						return observation
					},
				}
			},
		})({
			blockNumber: (observation) => observation.blockNumber,
			isContract: (observation) => observation.isContract,
		}),

		defineResolver({
			entityType: EntityType.EvmNetworkAccount,
			resolve: {
				EvmNetworkEvmAccount: {
					resolve: async ({ $actor, $network }, context) => {
						const {
							getTransactionsByAddress,
							getAccountListMaxOffset,
						} = await import('$/sources/Etherscan/Rest/queries.ts')
						const chainId = evmChainIdFromNetworkSelector($network)
						const address = hexLowerOfByteSize($actor.address, 20)
						if (address == null)
							throw new Error('Etherscan_Rest: EvmNetworkAccount wallet address not normalized')
						const limit = Math.min(
							resolverContextRowLimit(context),
							getAccountListMaxOffset
						)
						const wires = await getTransactionsByAddress({
							publicEnv: context.publicEnv,
							chainId,
							address,
							offset: limit,
						})
						if (wires == null)
							throw new Error('Etherscan_Rest: address transactions returned no result')
						return wires.flatMap((wire) => {
							const txHash = hexLowerOfByteSize(wire.hash ?? '', 32)
							return txHash == null ?
								[]
							:
								[{
									[EntityMetaKey.Selector]: {
										$network,
										txHash,
									},
								}]
						})
					},
				}
			},
		})({
			$$transactions: (account) => account,
		}),
	],
} satisfies RegisteredSourceResolverModule
