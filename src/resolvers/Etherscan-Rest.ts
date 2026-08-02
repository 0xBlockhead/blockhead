import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import { keccak256, toHex } from '@tevm/voltaire/Hash'
import { toBytes } from '@tevm/voltaire/Hex'

import { EvmInternalCallType, EvmTokenStandard } from '$/constants/Evm.ts'
import { evmAbiFromJsonString } from '$/lib/evmAbi.ts'
import { hexLowerOfByteSize, zeroExLowerCase } from '$/lib/hexLowerOfByteSize.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import { evmChainIdFromNetworkSelector } from '$/resolvers/evm.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import type { Entity, EntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { CoinInstanceType } from '$/schema/CoinInstanceType.ts'
import { Source } from '$/sources/Source.ts'
import type {
	EtherscanInternalTransaction,
	EtherscanTokenTransferTagged,
} from '$/sources/Etherscan/Rest/types.ts'

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
							return []
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
	],
} satisfies RegisteredSourceResolverModule
