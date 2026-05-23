import { singleFlight } from '$/lib/singleFlight.ts'
import {
	defineEntityFieldResolver,
	defineEntityResolver,
	resolverLoadSubsetRowLimit,
	sourcePublicEnv,
} from '$/resolvers/$resolvers.ts'
import {
	evmContractBytecodeHashFromGetCodeHex,
	evmContractRuntimeCodeFromGetCodeHex,
	evmContractStorageSlotReadsFromEthGetStorageAt,
} from '$/resolvers/_evmContractRpc.ts'
import {
	gweiFromDecimalString,
	networkGasEstimateTimestampFieldsFromObservation,
} from '$/resolvers/_networkGasEstimateTimestamp.ts'
import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'


const throwIfEtherscanRestUnsupportedChainId = async (chainId: number) => {
	const { isEtherscanRestSupportedChainId } = await import('$/sources/Etherscan/Rest/client.ts')
	if (!isEtherscanRestSupportedChainId(chainId)) {
		throw new Error(`Etherscan_Rest: unsupported chain ${String(chainId)}`)
	}
}


export default {
	source: Source.Etherscan_Rest,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.Network_GasEstimate_Timestamp,
			resolve: async (entityId, context) => {
				const { gastrackerGasOracle } = await import('$/sources/Etherscan/Rest/queries.ts')
				const chainId = entityId.$network.chainId
				await throwIfEtherscanRestUnsupportedChainId(chainId)
				const oracle = await singleFlight(gastrackerGasOracle)({
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
				return networkGasEstimateTimestampFieldsFromObservation({
					timestampMs: entityId.timestampMs,
					...(slowGwei != null && { slowGwei }),
					...(averageGwei != null && { averageGwei }),
					...(fastGwei != null && { fastGwei }),
					transport: 'etherscan-gasoracle',
				})
			},
		}),

		defineEntityResolver({
			entityType: EntityType.EvmTokenTransfer,
			resolve: async (entityId, context) => {
				const {
					accountTokenTransfersByTransaction,
					etherscanAccountListMaxOffset,
				} = await import('$/sources/Etherscan/Rest/queries.ts')
				const {
					evmTokenTransferEntityFromEtherscanWire,
					findEtherscanTokenTransferWireForEntityId,
				} = await import('$/resolvers/_evmTokenTransferEtherscan.ts')
				const chainId = entityId.$network.chainId
				await throwIfEtherscanRestUnsupportedChainId(chainId)
				const wires = await singleFlight(accountTokenTransfersByTransaction)({
					publicEnv: sourcePublicEnv(context, Source.Etherscan_Rest),
					chainId,
					txHash: entityId.txHash,
					offset: etherscanAccountListMaxOffset,
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
				const { accountInternalTransactionsByTxHash } = await import('$/sources/Etherscan/Rest/queries.ts')
				const {
					evmInternalTransferEntityFromEtherscanWire,
					findEtherscanInternalTransferWireForEntityId,
				} = await import('$/resolvers/_evmInternalTransferEtherscan.ts')
				const chainId = entityId.$network.chainId
				await throwIfEtherscanRestUnsupportedChainId(chainId)
				const wires = await singleFlight(accountInternalTransactionsByTxHash)({
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
				const chainId = entityId.$network.chainId
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
				const { getContractCreationRow } = await import('$/sources/Etherscan/Rest/queries.ts')
				const chainId = entityId.$network.chainId
				await throwIfEtherscanRestUnsupportedChainId(chainId)
				const row = await singleFlight(getContractCreationRow)({
					publicEnv: sourcePublicEnv(context, Source.Etherscan_Rest),
					chainId,
					address: entityId.address,
				})
				const creator = row?.contractCreator
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
				const { getContractCreationRow } = await import('$/sources/Etherscan/Rest/queries.ts')
				const chainId = entityId.$network.chainId
				await throwIfEtherscanRestUnsupportedChainId(chainId)
				const row = await singleFlight(getContractCreationRow)({
					publicEnv: sourcePublicEnv(context, Source.Etherscan_Rest),
					chainId,
					address: entityId.address,
				})
				const txHash = row?.txHash
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
				const { getContractSourceCodeRow } = await import('$/sources/Etherscan/Rest/queries.ts')
				const chainId = entityId.$network.chainId
				await throwIfEtherscanRestUnsupportedChainId(chainId)
				const row = await singleFlight(getContractSourceCodeRow)({
					publicEnv: sourcePublicEnv(context, Source.Etherscan_Rest),
					chainId,
					address: entityId.address,
				})
				const implementation = row?.Implementation
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
				const { proxyEthGetCode } = await import('$/sources/Etherscan/Rest/queries.ts')
				const chainId = entityId.$network.chainId
				await throwIfEtherscanRestUnsupportedChainId(chainId)
				const codeHex = await singleFlight(proxyEthGetCode)({
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
			fieldName: 'bytecodeHash',
			resolve: async (entityId, context) => {
				const { proxyEthGetCode } = await import('$/sources/Etherscan/Rest/queries.ts')
				const chainId = entityId.$network.chainId
				await throwIfEtherscanRestUnsupportedChainId(chainId)
				const codeHex = await singleFlight(proxyEthGetCode)({
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
				const { proxyEthGetStorageAt } = await import('$/sources/Etherscan/Rest/queries.ts')
				const chainId = entityId.$network.chainId
				await throwIfEtherscanRestUnsupportedChainId(chainId)
				const depth = Math.min(32, Math.max(1, resolverLoadSubsetRowLimit(context)))
				return evmContractStorageSlotReadsFromEthGetStorageAt({
					address: entityId.address,
					depth,
					getStorageAt: (slotQuantityHex) => (
						singleFlight(proxyEthGetStorageAt)({
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
			entityType: EntityType.Network,
			fieldName: '$$gasEstimateTimestamps',
			resolve: async (entityId) => {
				await throwIfEtherscanRestUnsupportedChainId(entityId.chainId)
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
			entityType: EntityType.ActorNetwork,
			fieldName: '$$tokenTransfers',
			resolve: async (entityId, context) => {
				const {
					accountTokenTransfersByAddress,
					etherscanAccountListMaxOffset,
				} = await import('$/sources/Etherscan/Rest/queries.ts')
				const { evmTokenTransferEntityIdsFromEtherscanAddressWires } = await import('$/resolvers/_evmTokenTransferEtherscan.ts')
				const chainId = entityId.$network.chainId
				await throwIfEtherscanRestUnsupportedChainId(chainId)
				const address = hexLowerOfByteSize(entityId.$actor.address, 20)
				if (address == null) {
					throw new Error('Etherscan_Rest: ActorNetwork wallet address not normalized')
				}
				const limit = Math.min(
					resolverLoadSubsetRowLimit(context),
					etherscanAccountListMaxOffset,
				)
				const wires = await accountTokenTransfersByAddress({
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
			entityType: EntityType.ActorNetwork,
			fieldName: '$$internalTransactions',
			resolve: async (entityId, context) => {
				const {
					accountInternalTransactionsByAddress,
					etherscanAccountListMaxOffset,
				} = await import('$/sources/Etherscan/Rest/queries.ts')
				const { evmInternalTransferEntityIdsFromEtherscanAddressWires } = await import('$/resolvers/_evmInternalTransferEtherscan.ts')
				const chainId = entityId.$network.chainId
				await throwIfEtherscanRestUnsupportedChainId(chainId)
				const address = hexLowerOfByteSize(entityId.$actor.address, 20)
				if (address == null) {
					throw new Error('Etherscan_Rest: ActorNetwork wallet address not normalized')
				}
				const limit = Math.min(
					resolverLoadSubsetRowLimit(context),
					etherscanAccountListMaxOffset,
				)
				const wires = await accountInternalTransactionsByAddress({
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
					accountTokenTransfersByTransaction,
					etherscanAccountListMaxOffset,
				} = await import('$/sources/Etherscan/Rest/queries.ts')
				const { evmTokenTransferEntityIdsFromEtherscanWires } = await import('$/resolvers/_evmTokenTransferEtherscan.ts')
				const chainId = entityId.$network.chainId
				await throwIfEtherscanRestUnsupportedChainId(chainId)
				const limit = Math.min(
					resolverLoadSubsetRowLimit(context),
					etherscanAccountListMaxOffset,
				)
				const wires = await singleFlight(accountTokenTransfersByTransaction)({
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
				const { accountInternalTransactionsByTxHash } = await import('$/sources/Etherscan/Rest/queries.ts')
				const { evmInternalTransferEntityIdsFromEtherscanWires } = await import('$/resolvers/_evmInternalTransferEtherscan.ts')
				const chainId = entityId.$network.chainId
				await throwIfEtherscanRestUnsupportedChainId(chainId)
				const wires = await singleFlight(accountInternalTransactionsByTxHash)({
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
