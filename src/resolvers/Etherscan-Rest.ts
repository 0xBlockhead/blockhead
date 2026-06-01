import { keccak256, toHex } from '@tevm/voltaire/Hash'
import { toBytes } from '@tevm/voltaire/Hex'

import { EvmInternalCallType, EvmTokenStandard } from '$/constants/Evm.ts'
import { hexLowerOfByteSize, zeroExLowerCase } from '$/lib/hexLowerOfByteSize.ts'
import { singleFlight } from '$/lib/singleFlight.ts'
import {
	defineEntityFieldResolver,
	defineEntityResolver,
	resolverLoadSubsetRowLimit,
	sourcePublicEnv,
} from '$/resolvers/$resolvers.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import type { Entity, EntityId } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { CoinInstanceType } from '$/schema/EvmCoinInstance.ts'
import { Source } from '$/sources/$Source.ts'
import type {
	EtherscanInternalTransaction,
	EtherscanTokenTransferTagged,
} from '$/sources/Etherscan/Rest/types.ts'

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

const etherscanQuantityToBigInt = (
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

const etherscanLogIndexFromWire = (
	raw: string | undefined,
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
				Number(raw),
		)
)

const evmTokenStandardFromEtherscanTaggedWire = (
	wire: EtherscanTokenTransferTagged,
): EvmTokenStandard => (
	wire.standard === 'erc721' ?
		EvmTokenStandard.Erc721
	: wire.standard === 'erc1155' ?
		EvmTokenStandard.Erc1155
	:
		EvmTokenStandard.Erc20
)

const evmTokenTransferEntityFromEtherscanWire = ({
	$network,
	txHash,
	wire,
}: {
	$network: EvmNetworkId
	txHash: `0x${string}`
	wire: EtherscanTokenTransferTagged
}): Entity<typeof schema, EntityType.EvmTokenTransfer> | undefined => {
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
		: wire.standard === 'erc1155' ?
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
		[EntityMetaKey.Id]: {
			$network,
			txHash: normalizedTxHash,
			logIndex,
		},
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
	}
}

const evmTokenTransferEntityIdsFromEtherscanWires = ({
	$network,
	txHash,
	wires,
}: {
	$network: EvmNetworkId
	txHash: `0x${string}`
	wires: readonly EtherscanTokenTransferTagged[]
}): Entity<typeof schema, EntityType.EvmTokenTransfer>[] => (
	wires.flatMap((wire) => {
		const entity = evmTokenTransferEntityFromEtherscanWire({
			$network,
			txHash,
			wire,
		})
		return entity == null ? [] : [entity]
	})
)

const evmTokenTransferEntityIdsFromEtherscanAddressWires = ({
	$network,
	wires,
}: {
	$network: EvmNetworkId
	wires: readonly EtherscanTokenTransferTagged[]
}): Entity<typeof schema, EntityType.EvmTokenTransfer>[] => {
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
				evmTokenTransferEntityIdsFromEtherscanWires({
					$network,
					txHash,
					wires: txWires,
				})
			))
	)
}

const findEtherscanTokenTransferWireForEntityId = (
	wires: readonly EtherscanTokenTransferTagged[],
	entityId: EntityId<typeof schema, EntityType.EvmTokenTransfer>,
): EtherscanTokenTransferTagged | undefined => (
	wires.find((wire) => (
		etherscanLogIndexFromWire(wire.row.logIndex) === entityId.logIndex
	))
)

const evmInternalTransferEntityFromEtherscanWire = ({
	$network,
	txHash,
	internalIndex,
	wire,
}: {
	$network: EvmNetworkId
	txHash: `0x${string}`
	internalIndex: number
	wire: EtherscanInternalTransaction
}): Entity<typeof schema, EntityType.EvmInternalTransfer> | undefined => {
	const normalizedTxHash = hexLowerOfByteSize(txHash, 32)
	if (normalizedTxHash == null || internalIndex < 0) return undefined
	const fromAddress = hexLowerOfByteSize(wire.from ?? '', 20)
	const toAddress = hexLowerOfByteSize(wire.to ?? '', 20)
	const createdAddress = hexLowerOfByteSize(wire.contractAddress ?? '', 20)
	const value = etherscanQuantityToBigInt(wire.value) ?? 0n
	const callType = evmInternalCallTypeFromWire(wire.type)
	const entityId = {
		$network,
		txHash: normalizedTxHash,
		internalIndex,
	} satisfies EntityId<typeof schema, EntityType.EvmInternalTransfer>
	return {
		[EntityMetaKey.Id]: entityId,
		value,
		...(callType != null && { callType }),
		...(wire.isError != null && { success: wire.isError === '0' }),
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

const evmInternalTransferEntityIdsFromEtherscanWires = ({
	$network,
	txHash,
	wires,
}: {
	$network: EvmNetworkId
	txHash: `0x${string}`
	wires: readonly EtherscanInternalTransaction[]
}): Entity<typeof schema, EntityType.EvmInternalTransfer>[] => (
	wires.flatMap((wire, internalIndex) => {
		const entity = evmInternalTransferEntityFromEtherscanWire({
			$network,
			txHash,
			internalIndex,
			wire,
		})
		return entity == null ? [] : [entity]
	})
)

const evmInternalTransferEntityIdsFromEtherscanAddressWires = ({
	$network,
	wires,
}: {
	$network: EvmNetworkId
	wires: readonly EtherscanInternalTransaction[]
}): Entity<typeof schema, EntityType.EvmInternalTransfer>[] => {
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
				evmInternalTransferEntityIdsFromEtherscanWires({
					$network,
					txHash,
					wires: txWires,
				})
			))
	)
}

const findEtherscanInternalTransferWireForEntityId = (
	wires: readonly EtherscanInternalTransaction[],
	entityId: EntityId<typeof schema, EntityType.EvmInternalTransfer>,
): EtherscanInternalTransaction | undefined => (
	wires[entityId.internalIndex]
)


const gweiFromDecimalString = (
	raw: string | undefined,
): number | undefined => {
	if (raw == null || raw.trim() === '') return undefined
	const value = Number(raw)
	return Number.isFinite(value) && value >= 0 ?
			value
		:
			undefined
}

const throwIfEtherscanRestUnsupportedChainId = async (chainId: number) => {
	const { supportedByChainId } = await import('$/sources/Etherscan/Rest/constants.ts')
	if (supportedByChainId[chainId] !== true) {
		throw new Error(`Etherscan_Rest: unsupported chain ${String(chainId)}`)
	}
}


export default {
	source: Source.Etherscan_Rest,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.EvmNetwork_GasEstimate_Timestamp,
			resolve: async (entityId, context) => {
				const { getGasOracle } = await import('$/sources/Etherscan/Rest/queries.ts')
				const chainId = chainIdFromEvmNetworkId(entityId.$network)
				await throwIfEtherscanRestUnsupportedChainId(chainId)
				const oracle = await singleFlight(getGasOracle)({
					publicEnv: sourcePublicEnv(context, Source.Etherscan_Rest),
					chainId,
				})
				if (oracle == null) {
					throw new Error('Etherscan_Rest: gasoracle returned no result')
				}
				const slowGwei = gweiFromDecimalString(oracle.SafeGasPrice)
				const averageGwei = gweiFromDecimalString(oracle.ProposeGasPrice)
				const fastGwei = gweiFromDecimalString(oracle.FastGasPrice)
				if (slowGwei == null && averageGwei == null && fastGwei == null) {
					throw new Error('Etherscan_Rest: gasoracle missing tier prices')
				}
				return {
					...(slowGwei != null && { slowGwei }),
					...(averageGwei != null && { averageGwei }),
					...(fastGwei != null && { fastGwei }),
					transport: 'etherscan-gasoracle',
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.EvmTokenTransfer,
			resolve: async (entityId, context) => {
				const {
					getTokenTransfersByTransaction,
					accountListMaxOffset,
				} = await import('$/sources/Etherscan/Rest/queries.ts')
				const chainId = chainIdFromEvmNetworkId(entityId.$network)
				await throwIfEtherscanRestUnsupportedChainId(chainId)
				const wires = await singleFlight(getTokenTransfersByTransaction)({
					publicEnv: sourcePublicEnv(context, Source.Etherscan_Rest),
					chainId,
					txHash: entityId.txHash,
					offset: accountListMaxOffset,
				})
				if (wires == null) {
					throw new Error('Etherscan_Rest: token transfers by transaction returned no result')
				}
				const wire = findEtherscanTokenTransferWireForEntityId(wires, entityId)
				if (wire == null) {
					throw new Error('Etherscan_Rest: token transfer not found for EvmTokenTransfer')
				}
				const entity = evmTokenTransferEntityFromEtherscanWire({
					$network: entityId.$network,
					txHash: entityId.txHash,
					wire,
				})
				if (entity == null) {
					throw new Error('Etherscan_Rest: token transfer wire did not map to EvmTokenTransfer')
				}
				return entity
			},
		}),

		defineEntityResolver({
			entityType: EntityType.EvmInternalTransfer,
			resolve: async (entityId, context) => {
				const { getInternalTransactionsByTxHash } = await import('$/sources/Etherscan/Rest/queries.ts')
				const chainId = chainIdFromEvmNetworkId(entityId.$network)
				await throwIfEtherscanRestUnsupportedChainId(chainId)
				const wires = await singleFlight(getInternalTransactionsByTxHash)({
					publicEnv: sourcePublicEnv(context, Source.Etherscan_Rest),
					chainId,
					txHash: entityId.txHash,
				})
				if (wires == null) {
					throw new Error('Etherscan_Rest: internal transactions by tx hash returned no result')
				}
				const wire = findEtherscanInternalTransferWireForEntityId(wires, entityId)
				if (wire == null) {
					throw new Error('Etherscan_Rest: internal transfer not found for EvmInternalTransfer')
				}
				const entity = evmInternalTransferEntityFromEtherscanWire({
					$network: entityId.$network,
					txHash: entityId.txHash,
					internalIndex: entityId.internalIndex,
					wire,
				})
				if (entity == null) {
					throw new Error('Etherscan_Rest: internal transfer wire did not map to EvmInternalTransfer')
				}
				return entity
			},
		}),
	],

	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType.EvmContract,
			fieldName: 'abi',
			resolve: async (entityId, context) => {
				const { getContractAbiJsonString } = await import('$/sources/Etherscan/Rest/queries.ts')
				const chainId = chainIdFromEvmNetworkId(entityId.$network)
				await throwIfEtherscanRestUnsupportedChainId(chainId)
				const abi = await singleFlight(getContractAbiJsonString)({
					publicEnv: sourcePublicEnv(context, Source.Etherscan_Rest),
					chainId,
					address: entityId.address,
				})
				return abi ?? undefined
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EvmContract,
			fieldName: '$deployer',
			resolve: async (entityId, context) => {
				const { getContractCreation } = await import('$/sources/Etherscan/Rest/queries.ts')
				const chainId = chainIdFromEvmNetworkId(entityId.$network)
				await throwIfEtherscanRestUnsupportedChainId(chainId)
				const contractCreation = await singleFlight(getContractCreation)({
					publicEnv: sourcePublicEnv(context, Source.Etherscan_Rest),
					chainId,
					address: entityId.address,
				})
				const creator = contractCreation?.contractCreator
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
			resolve: async (entityId, context) => {
				const { getContractCreation } = await import('$/sources/Etherscan/Rest/queries.ts')
				const chainId = chainIdFromEvmNetworkId(entityId.$network)
				await throwIfEtherscanRestUnsupportedChainId(chainId)
				const contractCreation = await singleFlight(getContractCreation)({
					publicEnv: sourcePublicEnv(context, Source.Etherscan_Rest),
					chainId,
					address: entityId.address,
				})
				const txHash = contractCreation?.txHash
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
			resolve: async (entityId, context) => {
				const { getContractSourceCode } = await import('$/sources/Etherscan/Rest/queries.ts')
				const chainId = chainIdFromEvmNetworkId(entityId.$network)
				await throwIfEtherscanRestUnsupportedChainId(chainId)
				const contractSourceCode = await singleFlight(getContractSourceCode)({
					publicEnv: sourcePublicEnv(context, Source.Etherscan_Rest),
					chainId,
					address: entityId.address,
				})
				const implementation = contractSourceCode?.Implementation
				if (implementation == null || implementation.trim() === '') return undefined
				const normalized = hexLowerOfByteSize(implementation, 20)
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
			fieldName: 'code',
			resolve: async (entityId, context) => {
				const { getCode } = await import('$/sources/Etherscan/Rest/queries.ts')
				const chainId = chainIdFromEvmNetworkId(entityId.$network)
				await throwIfEtherscanRestUnsupportedChainId(chainId)
				const codeHex = await singleFlight(getCode)({
					publicEnv: sourcePublicEnv(context, Source.Etherscan_Rest),
					chainId,
					address: entityId.address,
				})
				if (codeHex == null) return undefined
				return evmContractRuntimeCodeFromGetCodeHex(codeHex)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EvmContract,
			fieldName: 'codeHash',
			resolve: async (entityId, context) => {
				const { getCode } = await import('$/sources/Etherscan/Rest/queries.ts')
				const chainId = chainIdFromEvmNetworkId(entityId.$network)
				await throwIfEtherscanRestUnsupportedChainId(chainId)
				const codeHex = await singleFlight(getCode)({
					publicEnv: sourcePublicEnv(context, Source.Etherscan_Rest),
					chainId,
					address: entityId.address,
				})
				if (codeHex == null) return undefined
				return evmContractBytecodeHashFromGetCodeHex(codeHex)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EvmContract,
			fieldName: 'storageSlotReads',
			resolve: async (entityId, context) => {
				const { getStorageAt } = await import('$/sources/Etherscan/Rest/queries.ts')
				const chainId = chainIdFromEvmNetworkId(entityId.$network)
				await throwIfEtherscanRestUnsupportedChainId(chainId)
				const depth = Math.min(32, Math.max(1, resolverLoadSubsetRowLimit(context)))
				return evmContractStorageSlotReadsFromEthGetStorageAt({
					address: entityId.address,
					depth,
					getStorageAt: (slotQuantityHex) => (
						singleFlight(getStorageAt)({
							publicEnv: sourcePublicEnv(context, Source.Etherscan_Rest),
							chainId,
							address: entityId.address,
							slotQuantityHex,
						}).then((valueHex) => {
							if (valueHex == null) throw new Error('Etherscan_Rest: eth_getStorageAt returned no result')
							return valueHex
						})
					),
				})
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EvmNetwork,
			fieldName: '$$gasEstimateTimestamps',
			resolve: async (entityId) => {
				await throwIfEtherscanRestUnsupportedChainId(chainIdFromEvmNetworkId(entityId))
				return [
					{
						[EntityMetaKey.Id]: {
							$network: entityId,
							timestampMs: Date.now(),
						},
					},
				]
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EvmNetworkAccount,
			fieldName: '$$tokenTransfers',
			resolve: async (entityId, context) => {
				const {
					getTokenTransfersByAddress,
					accountListMaxOffset,
				} = await import('$/sources/Etherscan/Rest/queries.ts')
				const chainId = chainIdFromEvmNetworkId(entityId.$network)
				await throwIfEtherscanRestUnsupportedChainId(chainId)
				const address = hexLowerOfByteSize(entityId.$actor.address, 20)
				if (address == null) {
					throw new Error('Etherscan_Rest: EvmNetworkAccount wallet address not normalized')
				}
				const limit = Math.min(
					resolverLoadSubsetRowLimit(context),
					accountListMaxOffset,
				)
				const wires = await getTokenTransfersByAddress({
					publicEnv: sourcePublicEnv(context, Source.Etherscan_Rest),
					chainId,
					address,
					offset: limit,
				})
				if (wires == null) {
					throw new Error('Etherscan_Rest: address token transfers returned no result')
				}
				return (
					evmTokenTransferEntityIdsFromEtherscanAddressWires({
						$network: entityId.$network,
						wires,
					})
						.map((entity) => ({
							[EntityMetaKey.Id]: entity[EntityMetaKey.Id],
						}))
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EvmNetworkAccount,
			fieldName: '$internalTransfers',
			resolve: async (entityId, context) => {
				const {
					getInternalTransactionsByAddress,
					accountListMaxOffset,
				} = await import('$/sources/Etherscan/Rest/queries.ts')
				const chainId = chainIdFromEvmNetworkId(entityId.$network)
				await throwIfEtherscanRestUnsupportedChainId(chainId)
				const address = hexLowerOfByteSize(entityId.$actor.address, 20)
				if (address == null) {
					throw new Error('Etherscan_Rest: EvmNetworkAccount wallet address not normalized')
				}
				const limit = Math.min(
					resolverLoadSubsetRowLimit(context),
					accountListMaxOffset,
				)
				const wires = await getInternalTransactionsByAddress({
					publicEnv: sourcePublicEnv(context, Source.Etherscan_Rest),
					chainId,
					address,
					offset: limit,
				})
				if (wires == null) {
					throw new Error('Etherscan_Rest: address internal transactions returned no result')
				}
				return (
					evmInternalTransferEntityIdsFromEtherscanAddressWires({
						$network: entityId.$network,
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
			fieldName: '$$tokenTransfers',
			resolve: async (entityId, context) => {
				const {
					getTokenTransfersByTransaction,
					accountListMaxOffset,
				} = await import('$/sources/Etherscan/Rest/queries.ts')
				const chainId = chainIdFromEvmNetworkId(entityId.$network)
				await throwIfEtherscanRestUnsupportedChainId(chainId)
				const limit = Math.min(
					resolverLoadSubsetRowLimit(context),
					accountListMaxOffset,
				)
				const wires = await singleFlight(getTokenTransfersByTransaction)({
					publicEnv: sourcePublicEnv(context, Source.Etherscan_Rest),
					chainId,
					txHash: entityId.txHash,
					offset: limit,
				})
				if (wires == null) {
					throw new Error('Etherscan_Rest: transaction token transfers returned no result')
				}
				return (
					evmTokenTransferEntityIdsFromEtherscanWires({
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
				const { getInternalTransactionsByTxHash } = await import('$/sources/Etherscan/Rest/queries.ts')
				const chainId = chainIdFromEvmNetworkId(entityId.$network)
				await throwIfEtherscanRestUnsupportedChainId(chainId)
				const wires = await singleFlight(getInternalTransactionsByTxHash)({
					publicEnv: sourcePublicEnv(context, Source.Etherscan_Rest),
					chainId,
					txHash: entityId.txHash,
				})
				if (wires == null) {
					throw new Error('Etherscan_Rest: transaction internal transfers returned no result')
				}
				return (
					evmInternalTransferEntityIdsFromEtherscanWires({
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
	],
}
