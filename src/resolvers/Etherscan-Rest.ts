import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import { keccak256, toHex } from '@tevm/voltaire/Hash'
import { toBytes } from '@tevm/voltaire/Hex'

import { EvmInternalCallType, EvmTokenStandard } from '$/constants/Evm.ts'
import { evmAbiFromJsonString } from '$/lib/evmAbi.ts'
import { hexLowerOfByteSize, zeroExLowerCase } from '$/lib/hexLowerOfByteSize.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import type { EntitySelectorForSelectorName } from '$/schema/$schema.ts'
import type { Entity, EntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { CoinInstanceType } from '$/schema/EvmCoinInstance.ts'
import { Source } from '$/sources/Source.ts'
import type {
	EtherscanInternalTransaction,
	EtherscanTokenTransferTagged,
} from '$/sources/Etherscan/Rest/types.ts'
import { EvmNetworkSelector } from '$/schema/EvmNetwork.ts'
import { EvmNetwork_GasEstimate_TimestampSelector } from '$/schema/EvmNetwork_GasEstimate_Timestamp.ts'
import { EvmTokenTransferSelector } from '$/schema/EvmTokenTransfer.ts'
import { EvmInternalTransferSelector } from '$/schema/EvmInternalTransfer.ts'
import { EvmContractSelector } from '$/schema/EvmContract.ts'
import { EvmNetworkAccountSelector } from '$/schema/EvmNetworkAccount.ts'
import { EvmLogSelector } from '$/schema/EvmLog.ts'
import { EvmTransactionSelector } from '$/schema/EvmTransaction.ts'

type EvmNetworkId = EntitySelectorForSelectorName<typeof schema, EntityType.EvmNetwork, EvmNetworkSelector.Caip2>

const evmNetworkIdFromChainId = (chainId: number): EvmNetworkId => ({
	caip2: {
		namespace: 'eip155',
		reference: String(chainId),
	},
})

const chainIdFromEvmNetworkId = (network: EvmNetworkId) => Number(network.caip2.reference)

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
	txHash: `0x${string}`
	wire: EtherscanTokenTransferTagged
	transferIndex?: number
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
			$network,
			txHash: normalizedTxHash,
			logIndex,
			transferIndex,
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
	}
}

const evmTokenTransferEntitySelectorsFromEtherscanWires = ({
	$network,
	txHash,
	wires,
}: {
	$network: EvmNetworkId
	txHash: `0x${string}`
	wires: readonly EtherscanTokenTransferTagged[]
}) => (
	wires.flatMap((wire, index) => {
		const entity = evmTokenTransferEntityFromEtherscanWire({
			$network,
			txHash,
			transferIndex: wires
				.slice(0, index)
				.filter((previousWire) => (
								etherscanLogIndexFromWire(previousWire.row.logIndex)
							=== etherscanLogIndexFromWire(wire.row.logIndex)
				))
				.length,
			wire,
		})
		return entity == null ? [] : [entity]
	})
)

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
			etherscanLogIndexFromWire(wire.row.logIndex) === entitySelector.logIndex
		))
		.at(entitySelector.transferIndex)
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
		$network,
		txHash: normalizedTxHash,
		internalIndex,
	} satisfies EntitySelector<typeof schema, EntityType.EvmInternalTransfer>
	return {
		[EntityMetaKey.Selector]: entitySelector,
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
	txHash: `0x${string}`
	wires: readonly EtherscanInternalTransaction[]
}) => (
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
	wires[entitySelector.internalIndex]
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

const throwIfEtherscanRestUnsupportedChainId = async (chainId: number) => {
	await import('$/sources/Etherscan/Rest/constants.ts')
}


export default {
	source: Source.Etherscan_Rest,

	resolvers: [
		defineResolver(Source.Etherscan_Rest, {
			entityType: EntityType.EvmNetwork_GasEstimate_Timestamp,
			resolve: {
				[EvmNetwork_GasEstimate_TimestampSelector.EvmNetworkTimestampMs]: async ({ $network }, context) => {
					const { getGasOracle } = await import('$/sources/Etherscan/Rest/queries.ts')
					const chainId = chainIdFromEvmNetworkId($network)
					await throwIfEtherscanRestUnsupportedChainId(chainId)
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
				}
			},
		})({
			fields: {
				slowGwei: (timestamp) => timestamp.slowGwei,
				averageGwei: (timestamp) => timestamp.averageGwei,
				fastGwei: (timestamp) => timestamp.fastGwei,
				transport: (timestamp) => timestamp.transport,
			},
		}),

		defineResolver(Source.Etherscan_Rest, {
			entityType: EntityType.EvmTokenTransfer,
			resolve: {
				[EvmTokenTransferSelector.EvmNetworkTxHashLogIndexTransferIndex]: async (entitySelector, context) => {
					const {
						getTokenTransfersByTransaction,
						getAccountListMaxOffset,
					} = await import('$/sources/Etherscan/Rest/queries.ts')
					const chainId = chainIdFromEvmNetworkId(entitySelector.$network)
					await throwIfEtherscanRestUnsupportedChainId(chainId)
					const wires = await getTokenTransfersByTransaction({
						publicEnv: context.publicEnv,
						chainId,
						txHash: entitySelector.txHash,
						offset: getAccountListMaxOffset,
					})
					if (wires == null)
						throw new Error('Etherscan_Rest: token transfers by transaction returned no result')
					const wire = findEtherscanTokenTransferWireForEntitySelector(wires, entitySelector)
					if (wire == null)
						throw new Error('Etherscan_Rest: token transfer not found for EvmTokenTransfer')
					const entity = evmTokenTransferEntityFromEtherscanWire({
						$network: entitySelector.$network,
						txHash: entitySelector.txHash,
						transferIndex: entitySelector.transferIndex,
						wire,
					})
					if (entity == null)
						throw new Error('Etherscan_Rest: token transfer wire did not map to EvmTokenTransfer')
					return entity
				}
			},
		})({
			fields: {
				standard: (transfer) => {
					if (transfer.standard == null) throw new Error('Etherscan_Rest: token transfer missing standard')
					return transfer.standard
				},
				amount: (transfer) => {
					if (transfer.amount == null) throw new Error('Etherscan_Rest: token transfer missing amount')
					return transfer.amount
				},
				tokenId: (transfer) => transfer.tokenId,
				tokenSymbol: (transfer) => transfer.tokenSymbol,
				tokenName: (transfer) => transfer.tokenName,
				tokenDecimals: (transfer) => transfer.tokenDecimals,
				$from: (transfer) => transfer.$from,
				$to: (transfer) => transfer.$to,
				$tokenContract: (transfer) => transfer.$tokenContract,
				$coinInstance: (transfer) => transfer.$coinInstance,
			},
		}),

		defineResolver(Source.Etherscan_Rest, {
			entityType: EntityType.EvmInternalTransfer,
			resolve: {
				[EvmInternalTransferSelector.EvmNetworkTxHashInternalIndex]: async (entitySelector, context) => {
					const { getInternalTransactionsByTxHash } = await import('$/sources/Etherscan/Rest/queries.ts')
					const chainId = chainIdFromEvmNetworkId(entitySelector.$network)
					await throwIfEtherscanRestUnsupportedChainId(chainId)
					const wires = await getInternalTransactionsByTxHash({
						publicEnv: context.publicEnv,
						chainId,
						txHash: entitySelector.txHash,
					})
					if (wires == null)
						throw new Error('Etherscan_Rest: internal transactions by tx hash returned no result')
					const wire = findEtherscanInternalTransferWireForEntitySelector(wires, entitySelector)
					if (wire == null)
						throw new Error('Etherscan_Rest: internal transfer not found for EvmInternalTransfer')
					const entity = evmInternalTransferEntityFromEtherscanWire({
						$network: entitySelector.$network,
						txHash: entitySelector.txHash,
						internalIndex: entitySelector.internalIndex,
						wire,
					})
					if (entity == null)
						throw new Error('Etherscan_Rest: internal transfer wire did not map to EvmInternalTransfer')
					return entity
				}
			},
		})({
			fields: {
				value: ({ value }) => value,
				callType: (transfer) => transfer.callType,
				success: (transfer) => transfer.success,
				$from: (transfer) => transfer.$from,
				$to: (transfer) => transfer.$to,
				$createdContract: (transfer) => transfer.$createdContract,
			},
		}),
		defineResolver(Source.Etherscan_Rest, {
			entityType: EntityType.EvmContract,
			resolve: {
				[EvmContractSelector.EvmNetworkAddress]: async ({ $network, address }, context) => {
					const { getContractAbiJsonString } = await import('$/sources/Etherscan/Rest/queries.ts')
					const chainId = chainIdFromEvmNetworkId($network)
					await throwIfEtherscanRestUnsupportedChainId(chainId)
					const abi = await getContractAbiJsonString({
						publicEnv: context.publicEnv,
						chainId,
						address: address,
					})
					return abi == null ? undefined : evmAbiFromJsonString(abi)
				}
			},
		})({
			fields: {
				abi: (contract) => contract,
			},
		}),

		defineResolver(Source.Etherscan_Rest, {
			entityType: EntityType.EvmContract,
			resolve: {
				[EvmContractSelector.EvmNetworkAddress]: async ({ $network, address }, context) => {
					const { getContractCreation } = await import('$/sources/Etherscan/Rest/queries.ts')
					const chainId = chainIdFromEvmNetworkId($network)
					await throwIfEtherscanRestUnsupportedChainId(chainId)
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
				}
			},
		})({
			fields: {
				$deployer: (contract) => contract,
			},
		}),

		defineResolver(Source.Etherscan_Rest, {
			entityType: EntityType.EvmContract,
			resolve: {
				[EvmContractSelector.EvmNetworkAddress]: async ({ $network, address }, context) => {
					const { getContractCreation } = await import('$/sources/Etherscan/Rest/queries.ts')
					const chainId = chainIdFromEvmNetworkId($network)
					await throwIfEtherscanRestUnsupportedChainId(chainId)
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
				}
			},
		})({
			fields: {
				$creationTransaction: (contract) => contract,
			},
		}),

		defineResolver(Source.Etherscan_Rest, {
			entityType: EntityType.EvmContract,
			resolve: {
				[EvmContractSelector.EvmNetworkAddress]: async ({ $network, address }, context) => {
					const { getContractSourceCode } = await import('$/sources/Etherscan/Rest/queries.ts')
					const chainId = chainIdFromEvmNetworkId($network)
					await throwIfEtherscanRestUnsupportedChainId(chainId)
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
				}
			},
		})({
			fields: {
				$implementation: (contract) => contract,
			},
		}),

		defineResolver(Source.Etherscan_Rest, {
			entityType: EntityType.EvmContract,
			resolve: {
				[EvmContractSelector.EvmNetworkAddress]: async ({ $network, address }, context) => {
					const { getCode } = await import('$/sources/Etherscan/Rest/queries.ts')
					const chainId = chainIdFromEvmNetworkId($network)
					await throwIfEtherscanRestUnsupportedChainId(chainId)
					const codeHex = await getCode({
						publicEnv: context.publicEnv,
						chainId,
						address: address,
					})
					if (codeHex == null) return undefined
					return evmContractRuntimeCodeFromGetCodeHex(codeHex)
				}
			},
		})({
			fields: {
				code: (contract) => contract,
			},
		}),

		defineResolver(Source.Etherscan_Rest, {
			entityType: EntityType.EvmContract,
			resolve: {
				[EvmContractSelector.EvmNetworkAddress]: async ({ $network, address }, context) => {
					const { getCode } = await import('$/sources/Etherscan/Rest/queries.ts')
					const chainId = chainIdFromEvmNetworkId($network)
					await throwIfEtherscanRestUnsupportedChainId(chainId)
					const codeHex = await getCode({
						publicEnv: context.publicEnv,
						chainId,
						address: address,
					})
					if (codeHex == null) return undefined
					return evmContractBytecodeHashFromGetCodeHex(codeHex)
				}
			},
		})({
			fields: {
				codeHash: (contract) => contract,
			},
		}),

		defineResolver(Source.Etherscan_Rest, {
			entityType: EntityType.EvmContract,
			resolve: {
				[EvmContractSelector.EvmNetworkAddress]: async ({ $network, address }, context) => {
					const { getStorageAt } = await import('$/sources/Etherscan/Rest/queries.ts')
					const chainId = chainIdFromEvmNetworkId($network)
					await throwIfEtherscanRestUnsupportedChainId(chainId)
					const depth = Math.min(32, Math.max(1, resolverContextRowLimit(context)))
					return evmContractStorageSlotReadsFromEthGetStorageAt({
						address: address,
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
				}
			},
		})({
			fields: {
				storageSlotReads: (contract) => contract,
			},
		}),

		defineResolver(Source.Etherscan_Rest, {
			entityType: EntityType.EvmNetwork,
			resolve: {
				[EvmNetworkSelector.Caip2]: async (entitySelector) => {
					await throwIfEtherscanRestUnsupportedChainId(chainIdFromEvmNetworkId(entitySelector))
					return [
						{
							[EntityMetaKey.Selector]: {
								$network: entitySelector,
								timestampMs: Date.now(),
							},
						},
					]
				}
			},
		})({
			fields: {
				$$gasEstimateTimestamps: (network) => network,
			},
		}),

		defineResolver(Source.Etherscan_Rest, {
			entityType: EntityType.EvmNetworkAccount,
			resolve: {
				[EvmNetworkAccountSelector.EvmNetworkEvmAccount]: async ({ $actor, $network }, context) => {
					const {
						getTokenTransfersByAddress,
						getAccountListMaxOffset,
					} = await import('$/sources/Etherscan/Rest/queries.ts')
					const chainId = chainIdFromEvmNetworkId($network)
					await throwIfEtherscanRestUnsupportedChainId(chainId)
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
					return (
						evmTokenTransferEntitySelectorsFromEtherscanAddressWires({
							$network: $network,
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
				$$tokenTransfers: (account) => account,
			},
		}),

		defineResolver(Source.Etherscan_Rest, {
			entityType: EntityType.EvmNetworkAccount,
			resolve: {
				[EvmNetworkAccountSelector.EvmNetworkEvmAccount]: async ({ $actor, $network }, context) => {
					const {
						getInternalTransactionsByAddress,
						getAccountListMaxOffset,
					} = await import('$/sources/Etherscan/Rest/queries.ts')
					const chainId = chainIdFromEvmNetworkId($network)
					await throwIfEtherscanRestUnsupportedChainId(chainId)
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
					return (
						evmInternalTransferEntitySelectorsFromEtherscanAddressWires({
							$network: $network,
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
				$$internalTransfers: (account) => account,
			},
		}),

		defineResolver(Source.Etherscan_Rest, {
			entityType: EntityType.EvmLog,
			resolve: {
				[EvmLogSelector.EvmNetworkTxHashLogIndex]: async ({ $network, logIndex, txHash }, context) => {
					const {
						getTokenTransfersByTransaction,
						getAccountListMaxOffset,
					} = await import('$/sources/Etherscan/Rest/queries.ts')
					const chainId = chainIdFromEvmNetworkId($network)
					await throwIfEtherscanRestUnsupportedChainId(chainId)
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
						return []
					return (
						evmTokenTransferEntitySelectorsFromEtherscanWires({
							$network: $network,
							txHash: txHash,
							wires,
						})
							.filter((entity) => (
								entity[EntityMetaKey.Selector].logIndex === logIndex
							))
							.map((entity) => ({
								[EntityMetaKey.Selector]: entity[EntityMetaKey.Selector],
							}))
					)
				}
			},
		})({
			fields: {
				$$tokenTransfers: (log) => log,
			},
		}),

		defineResolver(Source.Etherscan_Rest, {
			entityType: EntityType.EvmTransaction,
			resolve: {
				[EvmTransactionSelector.EvmNetworkTxHash]: async ({ $network, txHash }, context) => {
					const {
						getTokenTransfersByTransaction,
						getAccountListMaxOffset,
					} = await import('$/sources/Etherscan/Rest/queries.ts')
					const chainId = chainIdFromEvmNetworkId($network)
					await throwIfEtherscanRestUnsupportedChainId(chainId)
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
					return (
						evmTokenTransferEntitySelectorsFromEtherscanWires({
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
				$$tokenTransfers: (transaction) => transaction,
			},
		}),

		defineResolver(Source.Etherscan_Rest, {
			entityType: EntityType.EvmTransaction,
			resolve: {
				[EvmTransactionSelector.EvmNetworkTxHash]: async ({ $network, txHash }, context) => {
					const { getInternalTransactionsByTxHash } = await import('$/sources/Etherscan/Rest/queries.ts')
					const chainId = chainIdFromEvmNetworkId($network)
					await throwIfEtherscanRestUnsupportedChainId(chainId)
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
				}
			},
		})({
			fields: {
				$$internalTransfers: (transaction) => transaction,
			},
		}),
	],
}
