import {
	resolverContextRowLimit,
	type ProviderContinuation,
} from '$/resolvers/$resolvers.ts'
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
import {
	evmTokenApprovalEntityFromLog,
	evmTokenApprovalReference,
} from '$/resolvers/evmTokenApproval.ts'
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
	blockscoutStateChangeKey,
} from '$/sources/Blockscout/Rest/queries.ts'
import { Source } from '$/sources/Source.ts'
import {
	EvmInternalCallType,
	EvmStateChangeKind,
	EvmTokenStandard,
	EvmTransactionEnvelopeType,
	EvmTransactionExecutionStatus,
	EvmTransactionKind,
} from '$/constants/Evm.ts'
import { CoinId } from '$/constants/Coin.ts'
import { CoinInstanceType } from '$/schema/CoinInstanceType.ts'
import type {
	BlockscoutAddress,
	BlockscoutBlock,
	BlockscoutInternalTransaction,
	BlockscoutErc4337Account,
	BlockscoutRawTrace,
	BlockscoutSmartContract,
	BlockscoutSmartContractForList,
	BlockscoutStateChange,
	BlockscoutStats,
	BlockscoutTokenTransfer,
	BlockscoutTransaction,
	BlockscoutTransactionLog,
	BlockscoutUserOperationListItem,
} from '$/sources/Blockscout/Rest/types.ts'

type EvmNetworkId = EntitySelector<typeof schema, EntityType.Network>

const evmBlockReferenceFromBlockscoutWire = ({
	$network,
	wire,
}: {
	$network: EvmNetworkId
	wire: BlockscoutBlock
}) => {
	const blockNumber = (
		Number.isSafeInteger(wire.height) && wire.height >= 0 ?
			BigInt(wire.height)
		:
			undefined
	)
	const hash = hexLowerOfByteSize(wire.hash, 32)
	if (blockNumber == null || hash == null)
		return undefined

	const parentHash = hexLowerOfByteSize(wire.parent_hash, 32)
	const miner = hexLowerOfByteSize(wire.miner.hash, 20)
	const timestamp = Math.floor(Date.parse(wire.timestamp) / 1_000) * 1_000
	return {
		[EntityMetaKey.Selector]: {
			$network,
			blockNumber,
		},
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.EvmBlock, [], 'hash')]: hash,
			[entityFieldAddressKey(EntityType.EvmBlock, [], 'blockNumber')]: blockNumber,
			...(parentHash != null && {
				[entityFieldAddressKey(EntityType.EvmBlock, [], 'parentHash')]: parentHash,
			}),
			...(Number.isFinite(timestamp) && timestamp >= 0 && {
				[entityFieldAddressKey(EntityType.EvmBlock, [], 'timestamp')]: timestamp,
			}),
			...(miner != null && {
				[entityFieldAddressKey(EntityType.EvmBlock, [], '$miner')]: {
					[EntityMetaKey.Selector]: {
						address: miner,
					},
				},
			}),
			[entityFieldAddressKey(EntityType.EvmBlock, [], 'gasUsed')]: blockscoutQuantityToBigInt(wire.gas_used),
			[entityFieldAddressKey(EntityType.EvmBlock, [], 'gasLimit')]: blockscoutQuantityToBigInt(wire.gas_limit),
			[entityFieldAddressKey(EntityType.EvmBlock, [], 'baseFeePerGas')]: blockscoutQuantityToBigInt(wire.base_fee_per_gas),
			[entityFieldAddressKey(EntityType.EvmBlock, [], 'transactionCount')]: wire.transactions_count,
		},
	}
}

const evmContractReferenceFromBlockscoutListWire = ({
	$network,
	wire,
}: {
	$network: EvmNetworkId
	wire: BlockscoutSmartContractForList
}) => {
	const address = hexLowerOfByteSize(wire.address.hash, 20)
	if (address == null)
		return undefined

	const $contract = {
		$network,
		address,
	}
	const verifiedAtMs = wire.verified_at == null ? undefined : Date.parse(wire.verified_at)
	return {
		[EntityMetaKey.Selector]: $contract,
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.EvmContract, [], '$verification')]: {
				[EntityMetaKey.Selector]: {
					$contract,
				},
				[EntityMetaKey.Fields]: {
					...(verifiedAtMs != null && Number.isFinite(verifiedAtMs) && {
						[entityFieldAddressKey(EntityType.EvmContractVerification, [], 'verifiedAtMs')]: verifiedAtMs,
					}),
					...((wire.language != null || wire.compiler_version != null) && {
						[entityFieldAddressKey(EntityType.EvmContractVerification, [], '$compilation')]: {
							[EntityMetaKey.Selector]: {
								$contract,
							},
							[EntityMetaKey.Fields]: {
								...(wire.language != null && {
									[entityFieldAddressKey(EntityType.EvmContractCompilation, [], 'language')]: wire.language,
								}),
								...(wire.compiler_version != null && {
									[entityFieldAddressKey(EntityType.EvmContractCompilation, [], 'compilerVersion')]: wire.compiler_version,
								}),
							},
						},
					}),
				},
			},
		},
	}
}

const getBlockscoutSmartContractForEvmContract = async ({
	$network,
	address,
}: EntitySelector<typeof schema, EntityType.EvmContract>) => {
	const { getSmartContract } = await import('$/sources/Blockscout/Rest/queries.ts')
	const normalized = hexLowerOfByteSize(address, 20)
	if (normalized == null)
		throw new Error('Blockscout_Rest: contract address not normalized')

	return getSmartContract({
		chainId: evmChainIdFromNetworkSelector($network),
		address: normalized,
	})
}

const blockscoutVerificationMatchFromSmartContractWire = (
	wire: BlockscoutSmartContract
) => (
	wire.is_fully_verified === true ?
		'full'
	:
		wire.is_partially_verified === true ?
			'partial'
		:
			undefined
)

const blockscoutSourceFilesFromSmartContractWire = (
	wire: BlockscoutSmartContract
) => (
	Object.fromEntries([
		...(
			wire.source_code != null && wire.source_code !== '' ?
				[[wire.file_path ?? 'contract', wire.source_code]]
			:
				[]
		),
		...(wire.additional_sources ?? []).flatMap((source) => (
			source.source_code != null
			&& source.source_code !== ''
			&& source.file_path != null
			&& source.file_path !== '' ?
				[[source.file_path, source.source_code]]
			:
				[]
		)),
	])
)

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
	const $tokenApproval = evmTokenApprovalEntityFromLog({
		$log: entitySelector,
		topics,
		data,
		emitterAddress: address,
	})
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
		...($tokenApproval != null && {
			$tokenApproval,
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

const zeroExHexFromIntegerQuantity = (
	raw: string | number | null | undefined,
	byteSize: 20 | 32
) => {
	if (raw == null || raw === '')
		return undefined

	try {
		const value = BigInt(raw)
		if (value < 0n)
			return undefined

		return hexLowerOfByteSize(
			`0x${value.toString(16).padStart(byteSize * 2, '0')}`,
			byteSize
		)
	} catch {
		return undefined
	}
}

const eip7702AuthorizationEntitiesFromBlockscoutWire = ({
	$network,
	txHash,
	authorizationList,
}: {
	$network: EvmNetworkId
	txHash: `0x${string}`
	authorizationList: NonNullable<BlockscoutTransaction['authorization_list']>
}) => (
	authorizationList.flatMap((authorization, authorizationIndex) => {
		const delegationAddress = hexLowerOfByteSize(authorization.address_hash, 20)
		const authority = hexLowerOfByteSize(authorization.authority, 20)
		const r = zeroExHexFromIntegerQuantity(authorization.r, 32)
		const s = zeroExHexFromIntegerQuantity(authorization.s, 32)
		const nonce = blockscoutQuantityToBigInt(authorization.nonce)
		if (
			delegationAddress == null
			|| r == null
			|| s == null
			|| nonce == null
			|| !Number.isSafeInteger(authorization.chain_id)
			|| authorization.chain_id < 0
			|| !Number.isSafeInteger(authorization.v)
			|| authorization.v < 0
		)
			return []

		return [{
			[EntityMetaKey.Selector]: {
				$transaction: {
					$network,
					txHash,
				},
				authorizationIndex,
			},
			chainId: BigInt(authorization.chain_id),
			delegationAddress,
			nonce,
			yParity: authorization.v,
			r,
			s,
			...(authority != null && {
				authority,
				$authorityAccount: {
					[EntityMetaKey.Selector]: {
						$network,
						$actor: {
							address: authority,
						},
					},
				} satisfies Entity<typeof schema, EntityType.EvmNetworkAccount>,
			}),
			$delegationContract: {
				[EntityMetaKey.Selector]: {
					$network,
					address: delegationAddress,
				},
			} satisfies Entity<typeof schema, EntityType.EvmContract>,
			...(authorization.status != null && {
				verificationStatus: authorization.status,
			}),
		}]
	})
)

const evmBlobEntityRefsFromBlockscoutTx = ({
	$network,
	txHash,
	blobVersionedHashes,
	blockNumber,
}: {
	$network: EvmNetworkId
	txHash: `0x${string}`
	blobVersionedHashes: readonly string[] | null | undefined
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

const evmTransactionReferenceFromBlockscoutWire = (
	$network: EvmNetworkId,
	transaction: BlockscoutTransaction
) => {
	const txHash = hexLowerOfByteSize(transaction.hash, 32)
	const from = hexLowerOfByteSize(transaction.from.hash, 20)
	const to = hexLowerOfByteSize(transaction.to?.hash ?? '', 20)
	const envelopeType = evmTransactionEnvelopeTypeFromRpcTypeByte(
		nonnegativeIntegerFromWire(transaction.type)
	)
	if (txHash == null || from == null || envelopeType == null)
		return

	const blockNumber = blockscoutQuantityToBigInt(transaction.block_number)
	const value = blockscoutQuantityToBigInt(transaction.value) ?? 0n
	const createdContractAddress = transaction.created_contract == null ? undefined : hexLowerOfByteSize(transaction.created_contract.hash, 20)
	return {
		[EntityMetaKey.Selector]: {
			$network,
			txHash,
		},
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.EvmTransaction, [], 'envelopeType')]: envelopeType,
			[entityFieldAddressKey(EntityType.EvmTransaction, [], 'kind')]: evmTransactionKindFromSignedFields({
				value,
				toAddress: to,
				input: transaction.raw_input,
				createdContractAddress,
			}),
			[entityFieldAddressKey(EntityType.EvmTransaction, [], '$from')]: {
				[EntityMetaKey.Selector]: { address: from },
			},
			...(to != null && {
				[entityFieldAddressKey(EntityType.EvmTransaction, [], '$to')]: {
					[EntityMetaKey.Selector]: { address: to },
				},
			}),
			[entityFieldAddressKey(EntityType.EvmTransaction, [], 'value')]: value,
			...(blockNumber != null && {
				[entityFieldAddressKey(EntityType.EvmTransaction, [], '$block')]: {
					[EntityMetaKey.Selector]: {
						$network,
						blockNumber,
					},
				},
			}),
			...(nonnegativeIntegerFromWire(transaction.position) != null && {
				[entityFieldAddressKey(EntityType.EvmTransaction, [], 'indexInBlock')]: nonnegativeIntegerFromWire(transaction.position),
			}),
			...(transaction.status === 'ok' && {
				[entityFieldAddressKey(EntityType.EvmTransaction, [], 'executionStatus')]: EvmTransactionExecutionStatus.Success,
			}),
			...(transaction.status === 'error' && {
				[entityFieldAddressKey(EntityType.EvmTransaction, [], 'executionStatus')]: EvmTransactionExecutionStatus.Failed,
			}),
			...(createdContractAddress != null && {
				[entityFieldAddressKey(EntityType.EvmTransaction, ['ContractCreation'], '$contract')]: {
					[EntityMetaKey.Selector]: {
						$network,
						address: createdContractAddress,
					},
				},
			}),
		},
	}
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

const evmStateChangeEntityFromBlockscoutWire = ({
	$network,
	txHash,
	wire,
}: {
	$network: EvmNetworkId
	txHash: string
	wire: BlockscoutStateChange
}) => {
	const normalizedTxHash = hexLowerOfByteSize(txHash, 32)
	const accountAddress = hexLowerOfByteSize(wire.address.hash, 20)
	if (normalizedTxHash == null || accountAddress == null)
		return undefined

	const stateChangeKey = blockscoutStateChangeKey(wire)
	const $transaction = {
		$network,
		txHash: normalizedTxHash,
	}
	const kind = (
		wire.type === 'coin' ?
			EvmStateChangeKind.Coin
		:
			EvmStateChangeKind.Token
	)
	const tokenAddress = wire.token == null ? undefined : hexLowerOfByteSize(wire.token.address, 20)
	if (kind === EvmStateChangeKind.Token && tokenAddress == null)
		return undefined

	return {
		[EntityMetaKey.Selector]: {
			$transaction,
			stateChangeKey,
		},
		$transaction: {
			[EntityMetaKey.Selector]: $transaction,
		} satisfies Entity<typeof schema, EntityType.EvmTransaction>,
		$account: {
			[EntityMetaKey.Selector]: {
				address: accountAddress,
			},
		} satisfies Entity<typeof schema, EntityType.EvmAccount>,
		kind,
		...(tokenAddress != null && {
			$tokenContract: {
				[EntityMetaKey.Selector]: {
					$network,
					address: tokenAddress,
				},
			} satisfies Entity<typeof schema, EntityType.EvmContract>,
		}),
		...(wire.token_id != null && {
			tokenId: BigInt(wire.token_id),
		}),
		...(wire.balance_before != null && {
			balanceBefore: BigInt(wire.balance_before),
		}),
		...(wire.balance_after != null && {
			balanceAfter: BigInt(wire.balance_after),
		}),
		...(wire.change != null && {
			delta: BigInt(wire.change),
		}),
		isMiner: wire.is_miner,
	}
}

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

const evmInternalCallTypeFromBlockscoutRawTrace = (raw: BlockscoutRawTrace[number]) => (
	(raw.action.callType ?? raw.type) === 'call' ? EvmInternalCallType.Call
	: (raw.action.callType ?? raw.type) === 'callcode' ? EvmInternalCallType.CallCode
	: (raw.action.callType ?? raw.type) === 'delegatecall' ? EvmInternalCallType.DelegateCall
	: (raw.action.callType ?? raw.type) === 'staticcall' ? EvmInternalCallType.StaticCall
	: raw.type === 'create' ? EvmInternalCallType.Create
	: raw.type === 'create2' ? EvmInternalCallType.Create2
	: raw.type === 'selfdestruct' ? EvmInternalCallType.SelfDestruct
	: EvmInternalCallType.Unknown
)

const evmTraceEntitiesFromBlockscoutRawTrace = ({
	$network,
	txHash,
	wires,
	rootError,
}: {
	$network: EvmNetworkId
	txHash: string
	wires: BlockscoutRawTrace
	rootError?: string
}): Entity<typeof schema, EntityType.EvmTrace>[] => {
	const $transaction = {
		$network,
		txHash,
	}
	const childTraceAddressesByTraceAddress = new Map<string, string[]>()
	for (const wire of wires)
		if (wire.traceAddress.length > 0) {
			const parentTraceAddress = wire.traceAddress.slice(0, -1).join('.') || 'root'
			const childTraceAddresses = childTraceAddressesByTraceAddress.get(parentTraceAddress) ?? []
			childTraceAddresses.push(wire.traceAddress.join('.'))
			childTraceAddressesByTraceAddress.set(parentTraceAddress, childTraceAddresses)
		}

	return wires.map((wire) => {
		const traceAddress = wire.traceAddress.length === 0 ? 'root' : wire.traceAddress.join('.')
		const from = hexLowerOfByteSize(wire.action.from, 20)
		const to = wire.action.to == null ? undefined : hexLowerOfByteSize(wire.action.to, 20)
		return {
			[EntityMetaKey.Selector]: {
				$transaction,
				traceAddress,
			},
			$transaction: {
				[EntityMetaKey.Selector]: $transaction,
			},
			traceAddress,
			index: wire.traceAddress.at(-1) ?? 0,
			type: evmInternalCallTypeFromBlockscoutRawTrace(wire),
			...(from != null && {
				$from: {
					[EntityMetaKey.Selector]: {
						address: from,
					},
				},
			}),
			...(to != null && {
				$to: {
					[EntityMetaKey.Selector]: {
						address: to,
					},
				},
			}),
			value: BigInt(wire.action.value),
			gas: BigInt(wire.action.gas),
			input: with0xHex(wire.action.input),
			...(wire.result != null && {
				gasUsed: BigInt(wire.result.gasUsed),
				output: with0xHex(wire.result.output),
			}),
			...(traceAddress === 'root' && rootError != null && { error: rootError }),
			$$children: (childTraceAddressesByTraceAddress.get(traceAddress) ?? [])
				.map((childTraceAddress) => ({
					[EntityMetaKey.Selector]: {
						$transaction,
						traceAddress: childTraceAddress,
					},
				})),
		}
	})
}

const evmTraceReference = (
	trace: Entity<typeof schema, EntityType.EvmTrace>
) => ({
	[EntityMetaKey.Selector]: trace[EntityMetaKey.Selector],
	[EntityMetaKey.Fields]: {
		[entityFieldAddressKey(EntityType.EvmTrace, [], '$transaction')]: trace.$transaction,
		[entityFieldAddressKey(EntityType.EvmTrace, [], 'traceAddress')]: trace.traceAddress,
		[entityFieldAddressKey(EntityType.EvmTrace, [], 'index')]: trace.index,
		[entityFieldAddressKey(EntityType.EvmTrace, [], 'type')]: trace.type,
		...(trace.$from != null && {
			[entityFieldAddressKey(EntityType.EvmTrace, [], '$from')]: trace.$from,
		}),
		...(trace.$to != null && {
			[entityFieldAddressKey(EntityType.EvmTrace, [], '$to')]: trace.$to,
		}),
		...(trace.value != null && {
			[entityFieldAddressKey(EntityType.EvmTrace, [], 'value')]: trace.value,
		}),
		...(trace.gas != null && {
			[entityFieldAddressKey(EntityType.EvmTrace, [], 'gas')]: trace.gas,
		}),
		...(trace.gasUsed != null && {
			[entityFieldAddressKey(EntityType.EvmTrace, [], 'gasUsed')]: trace.gasUsed,
		}),
		...(trace.input != null && {
			[entityFieldAddressKey(EntityType.EvmTrace, [], 'input')]: trace.input,
		}),
		...(trace.output != null && {
			[entityFieldAddressKey(EntityType.EvmTrace, [], 'output')]: trace.output,
		}),
		...(trace.error != null && {
			[entityFieldAddressKey(EntityType.EvmTrace, [], 'error')]: trace.error,
		}),
		[entityFieldAddressKey(EntityType.EvmTrace, [], '$$children')]: trace.$$children,
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
	stats: BlockscoutStats
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
	if (!Number.isFinite(updatedAtMs))
		return null

	const timestampMs = updatedAtMs
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
	if (coin.symbol.trim() === '')
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
	const tip = (await getBlocks({
		chainId,
		limit: 1,
	})).items.at(0)
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

const blockscoutHistoryContinuation = ({
	operation,
	target,
	nextPageParams,
}: {
	operation: string
	target: string
	nextPageParams: {
		readonly [key: string]: string | number | null
	} | undefined
}): ProviderContinuation => (
	nextPageParams == null || Object.keys(nextPageParams).length === 0 ?
		{
			operation,
			target,
			terminal: true,
		}
	:
		{
			operation,
			target,
			terminal: false,
			token: JSON.stringify(nextPageParams),
		}
)

const blockscoutEvmNetworkAccountObservation = async ({
	$network,
	$actor,
}: {
	$network: EvmNetworkId
	$actor: EntitySelector<typeof schema, EntityType.EvmAccount>
}) => {
	const address = hexLowerOfByteSize($actor.address, 20)
	if (address == null)
		throw new Error('Blockscout_Rest: EvmNetworkAccount wallet address not normalized')

	const chainId = evmChainIdFromNetworkSelector($network)
	const {
		getAddressCounters,
		getAddressDetails,
	} = await import('$/sources/Blockscout/Rest/queries.ts')
	const [counters, details] = await Promise.all([
		getAddressCounters({
			chainId,
			address,
		}),
		getAddressDetails({
			chainId,
			address,
		}),
	])
	const tipClock = await blockscoutTipBlockObservationClock(chainId)

	return {
		[EntityMetaKey.Selector]: {
			$account: {
				$network,
				$actor,
			},
			timestampMs: tipClock.timestampMs,
			source: Source.Blockscout_Rest,
		},
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.EvmNetworkAccount_Timestamp, [], 'blockNumber')]: tipClock.blockNumber,
			[entityFieldAddressKey(EntityType.EvmNetworkAccount_Timestamp, [], 'transactionCount')]: BigInt(blockscoutCountFromDecimalString(
				counters.transactions_count,
				'transactions_count'
			)),
			[entityFieldAddressKey(EntityType.EvmNetworkAccount_Timestamp, [], 'tokenTransferCount')]: blockscoutCountFromDecimalString(
				counters.token_transfers_count,
				'token_transfers_count'
			),
			...(details.is_contract != null && {
				[entityFieldAddressKey(EntityType.EvmNetworkAccount_Timestamp, [], 'isContract')]: details.is_contract,
			}),
		},
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
	items: readonly BlockscoutErc4337Account[]
}) => (
	items.flatMap((smartContract) => {
		const address = hexLowerOfByteSize(smartContract.address.hash, 20)
		const factoryAddress = hexLowerOfByteSize(smartContract.factory?.hash ?? '', 20)
		return address == null ?
			[]
		:
			[{
				[EntityMetaKey.Selector]: {
					$network: evmNetworkSelectorFromChainId(chainId),
					address,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.Erc4337SmartAccount, [], '$contract')]: {
						[EntityMetaKey.Selector]: {
							$network: evmNetworkSelectorFromChainId(chainId),
							address,
						},
					},
					...(factoryAddress != null && {
						[entityFieldAddressKey(EntityType.Erc4337SmartAccount, [], '$factory')]: {
							[EntityMetaKey.Selector]: {
								$network: evmNetworkSelectorFromChainId(chainId),
								address: factoryAddress,
							},
						},
					}),
					[entityFieldAddressKey(EntityType.Erc4337SmartAccount, [], 'userOperationsCount')]: smartContract.total_ops,
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
	const senderAddress = hexLowerOfByteSize(wire.address.hash, 20)
	const entryPointAddress = hexLowerOfByteSize(wire.entry_point.hash, 20)
	const bundledTransactionHash = hexLowerOfByteSize(wire.transaction_hash, 32)
	const blockNumber = blockscoutQuantityToBigInt(wire.block_number)
	return {
		[EntityMetaKey.Selector]: {
			$network,
			hash,
		},
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.EvmUserOperation, [], 'successful')]: wire.status,
			...(senderAddress != null && {
				[entityFieldAddressKey(EntityType.EvmUserOperation, [], '$sender')]: {
					[EntityMetaKey.Selector]: {
						$network,
						address: senderAddress,
					},
				},
			}),
			...(entryPointAddress != null && {
				[entityFieldAddressKey(EntityType.EvmUserOperation, [], '$entryPoint')]: {
					[EntityMetaKey.Selector]: {
						$network,
						address: entryPointAddress,
					},
				},
			}),
			...(bundledTransactionHash != null && {
				[entityFieldAddressKey(EntityType.EvmUserOperation, [], '$bundledTransaction')]: {
					[EntityMetaKey.Selector]: {
						$network,
						txHash: bundledTransactionHash,
					},
				},
			}),
			...(blockNumber != null && {
				[entityFieldAddressKey(EntityType.EvmUserOperation, [], '$block')]: {
					[EntityMetaKey.Selector]: {
						$network,
						blockNumber,
					},
				},
			}),
			[entityFieldAddressKey(EntityType.EvmUserOperation, [], 'entryPointVersion')]: wire.entry_point_version,
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
		return {
			filter,
			nextPageParams: undefined,
			rows: [],
		}

	const limit = Math.min(
		resolverContextRowLimit(context),
		blockscoutV2ItemsCountMax
	)
	const { getUserOperationsPage } = await import('$/sources/Blockscout/Rest/queries.ts')
	const page = await getUserOperationsPage({
		chainId,
		limit,
		[filter]: address,
		continuation: context.providerContinuationToken,
	})
	return {
		filter,
		nextPageParams: page.nextPageParams,
		rows: page.items.flatMap((wire) => {
			const reference = evmUserOperationReferenceFromBlockscoutWire({
				$network,
				wire,
			})
			return reference == null ? [] : [reference]
		}),
	}
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
							blobGasUsed: blockscoutQuantityToBigInt(wire.blob_gas_used),
							excessBlobGas: blockscoutQuantityToBigInt(wire.excess_blob_gas),
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
			blobGasUsed: (block) => block.blobGasUsed,
			excessBlobGas: (block) => block.excessBlobGas,
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
						const to = hexLowerOfByteSize(transaction.to?.hash ?? '', 20)
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
							...(
								envelopeType === EvmTransactionEnvelopeType.Blob && {
									maxFeePerBlobGas: blockscoutQuantityToBigIntStrict(transaction.max_fee_per_blob_gas),
									blobGasUsed: blockscoutQuantityToBigIntStrict(transaction.blob_gas_used),
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
							$$authorizations: (
								transaction.authorization_list == null ?
									[]
								:
									eip7702AuthorizationEntitiesFromBlockscoutWire({
										$network,
										txHash,
										authorizationList: transaction.authorization_list,
									})
							),
							$$blobs: (
								envelopeType === EvmTransactionEnvelopeType.Blob ?
									evmBlobEntityRefsFromBlockscoutTx({
										$network,
										txHash,
										blobVersionedHashes: transaction.blob_versioned_hashes,
										blockNumber: containingBlockNumber ?? undefined,
									})
								:
									[]
							),
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
			$block: (transaction) => transaction.$block,
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
			Blob: {
				blobGasUsed: (transaction) => transaction.blobGasUsed,
				maxFeePerBlobGas: (transaction) => transaction.maxFeePerBlobGas,
				$$blobs: {
					select: (transaction) => transaction.$$blobs,
					resolveCount: (transaction) => transaction.$$blobs.length,
				},
			},
			SetCode: {
				$$authorizations: {
					select: (transaction) => transaction.$$authorizations,
					resolveCount: (transaction) => transaction.$$authorizations.length,
				},
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
			$$tokenApprovals: {
				select: (transaction) => transaction.$$logs.flatMap((log) => (
					log.$tokenApproval == null ?
						[]
					:
						[evmTokenApprovalReference(log.$tokenApproval)]
				)),
				resolveCount: (transaction) => transaction.$$logs.filter((log) => log.$tokenApproval != null).length,
			},
		}),

		defineResolver({
			entityType: EntityType.Eip7702Authorization,
			resolve: {
				TransactionAuthorizationIndex: {
					resolve: async (entitySelector) => {
						const { getTransactionByHash } = await import('$/sources/Blockscout/Rest/queries.ts')
						const transaction = await getTransactionByHash({
							chainId: evmChainIdFromNetworkSelector(entitySelector.$transaction.$network),
							txHash: entitySelector.$transaction.txHash,
						})
						if (transaction == null)
							throw new Error('Blockscout_Rest: authorization transaction not found')

						const txHash = hexLowerOfByteSize(transaction.hash, 32)
						if (txHash !== entitySelector.$transaction.txHash)
							throw new Error('Blockscout_Rest: authorization transaction identity does not match request')

						const authorization = eip7702AuthorizationEntitiesFromBlockscoutWire({
							$network: entitySelector.$transaction.$network,
							txHash,
							authorizationList: transaction.authorization_list ?? [],
						}).find((candidate) => (
							candidate[EntityMetaKey.Selector].authorizationIndex === entitySelector.authorizationIndex
						))
						if (authorization == null)
							throw new Error('Blockscout_Rest: authorization index is missing from transaction')

						return authorization
					},
				},
			},
		})({
			$transaction: (authorization) => authorization.$transaction,
			authorizationIndex: (authorization) => authorization[EntityMetaKey.Selector].authorizationIndex,
			chainId: (authorization) => authorization.chainId,
			delegationAddress: (authorization) => authorization.delegationAddress,
			authority: (authorization) => authorization.authority,
			nonce: (authorization) => authorization.nonce,
			yParity: (authorization) => authorization.yParity,
			r: (authorization) => authorization.r,
			s: (authorization) => authorization.s,
			verificationStatus: (authorization) => authorization.verificationStatus,
			$authorityAccount: (authorization) => authorization.$authorityAccount,
			$delegationContract: (authorization) => authorization.$delegationContract,
		}),

		defineResolver({
			entityType: EntityType.EvmBlob,
			resolve: {
				TransactionIndexInTransaction: {
					resolve: async (entitySelector) => {
						const { getTransactionByHash } = await import('$/sources/Blockscout/Rest/queries.ts')
						const transaction = await getTransactionByHash({
							chainId: evmChainIdFromNetworkSelector(entitySelector.$transaction.$network),
							txHash: entitySelector.$transaction.txHash,
						})
						if (transaction == null)
							throw new Error('Blockscout_Rest: blob transaction not found')

						const txHash = hexLowerOfByteSize(transaction.hash, 32)
						if (txHash !== entitySelector.$transaction.txHash)
							throw new Error('Blockscout_Rest: blob transaction identity does not match request')

						const blob = evmBlobEntityRefsFromBlockscoutTx({
							$network: entitySelector.$transaction.$network,
							txHash,
							blobVersionedHashes: transaction.blob_versioned_hashes,
							blockNumber: blockscoutQuantityToBigInt(transaction.block_number) ?? undefined,
						}).at(entitySelector.indexInTransaction)
						if (blob == null || blob.$block == null)
							throw new Error('Blockscout_Rest: blob is missing from a confirmed transaction')

						return blob
					},
				},
			},
		})({
			versionedHash: (blob) => blob.versionedHash,
			$transaction: (blob) => blob.$transaction,
			$block: (blob) => blob.$block,
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
			$$topics: {
				select: (log) => log.$$topics,
				resolveCount: (log) => log.$$topics.length,
			},
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
				TokenApproval: {
					$tokenApproval: (log) => {
						if (log.$tokenApproval == null)
							throw new Error('Blockscout_Rest: approval event has invalid topics or data')

						return log.$tokenApproval
					},
				},
			},
		}),

		defineResolver({
			entityType: EntityType.EvmTokenApproval,
			resolve: {
				Log: {
					resolve: async ({ $log }) => {
						const { getTransactionLogs } = await import('$/sources/Blockscout/Rest/queries.ts')
						const log = (await getTransactionLogs({
							chainId: evmChainIdFromNetworkSelector($log.$transaction.$network),
							txHash: $log.$transaction.txHash,
						})).at($log.indexInTransaction)
						if (log == null)
							throw new Error('Blockscout_Rest: receipt log not found for EvmTokenApproval')

						const approval = evmLogEntityFromIdAndWire($log, log).$tokenApproval
						if (approval == null)
							throw new Error('Blockscout_Rest: receipt log is not an exact token approval')

						return approval
					},
				},
			},
		})({
			$log: (approval) => approval.$log,
			$tokenContract: (approval) => approval.$tokenContract,
			$owner: (approval) => approval.$owner,
			$approvedActor: (approval) => approval.$approvedActor,
			approvalKind: (approval) => approval.approvalKind,
			standard: (approval) => approval.standard,
			Allowance: {
				amount: (approval) => approval.amount,
			},
			Token: {
				tokenId: (approval) => approval.tokenId,
			},
			Operator: {
				approved: (approval) => approval.approved,
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
			entityType: EntityType.EvmStateChange,
			resolve: {
				TransactionStateChangeKey: {
					resolve: async (entitySelector) => {
						const {
							blockscoutV2ItemsCountMax,
						} = await import('$/sources/Blockscout/Rest/constants.ts')
						const {
							getTransactionStateChanges,
						} = await import('$/sources/Blockscout/Rest/queries.ts')
						const wires = await getTransactionStateChanges({
							chainId: evmChainIdFromNetworkSelector(entitySelector.$transaction.$network),
							txHash: entitySelector.$transaction.txHash,
							limit: blockscoutV2ItemsCountMax,
						})
						const entity = wires
							.flatMap((wire) => {
								const stateChange = evmStateChangeEntityFromBlockscoutWire({
									$network: entitySelector.$transaction.$network,
									txHash: entitySelector.$transaction.txHash,
									wire,
								})
								return stateChange == null ? [] : [stateChange]
							})
							.find((stateChange) => (
								stateChange[EntityMetaKey.Selector].stateChangeKey
								=== entitySelector.stateChangeKey
							))
						if (entity == null)
							throw new Error('Blockscout_Rest: state change not found for EvmStateChange')

						return entity
					},
				},
			},
		})({
			$transaction: (stateChange) => stateChange.$transaction,
			stateChangeKey: (stateChange) => stateChange[EntityMetaKey.Selector].stateChangeKey,
			$account: (stateChange) => stateChange.$account,
			kind: (stateChange) => stateChange.kind,
			$tokenContract: (stateChange) => stateChange.$tokenContract,
			tokenId: (stateChange) => stateChange.tokenId,
			balanceBefore: (stateChange) => stateChange.balanceBefore,
			balanceAfter: (stateChange) => stateChange.balanceAfter,
			delta: (stateChange) => stateChange.delta,
			isMiner: (stateChange) => stateChange.isMiner,
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
							getTransactionStateChanges,
						} = await import('$/sources/Blockscout/Rest/queries.ts')
						return (
							await getTransactionStateChanges({
								chainId: evmChainIdFromNetworkSelector($network),
								txHash,
								limit: Math.min(
									resolverContextRowLimit(context),
									blockscoutV2ItemsCountMax
								),
							})
						)
							.flatMap((wire) => {
								const stateChange = evmStateChangeEntityFromBlockscoutWire({
									$network,
									txHash,
									wire,
								})
								return stateChange == null ? [] : [stateChange]
							})
					},
				},
			},
		})({
			$$stateChanges: (stateChanges) => stateChanges.map((stateChange) => ({
				[EntityMetaKey.Selector]: stateChange[EntityMetaKey.Selector],
			})),
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
							userOperationsCount: wire.total_ops,
						}
					},
				}
			},
		})({
			$factory: (account) => account.$factory,
			userOperationsCount: (account) => account.userOperationsCount,
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
			$$userOperations: {
				select: (snapshot) => snapshot.rows,
				continuation: (snapshot, account) => blockscoutHistoryContinuation({
					operation: 'erc4337-user-operations',
					target: `${snapshot.filter}:${account.address}`,
					nextPageParams: snapshot.nextPageParams,
				}),
			},
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
						return { userOperationsCount: wire.total_ops }
					},
				},
			},
		})({
			userOperationsCount: (bundler) => bundler.userOperationsCount,
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
			$$userOperations: {
				select: (snapshot) => snapshot.rows,
				continuation: (snapshot, bundler) => blockscoutHistoryContinuation({
					operation: 'erc4337-user-operations',
					target: `${snapshot.filter}:${bundler.address}`,
					nextPageParams: snapshot.nextPageParams,
				}),
			},
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
						return { userOperationsCount: wire.total_ops }
					},
				},
			},
		})({
			userOperationsCount: (paymaster) => paymaster.userOperationsCount,
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
			$$userOperations: {
				select: (snapshot) => snapshot.rows,
				continuation: (snapshot, paymaster) => blockscoutHistoryContinuation({
					operation: 'erc4337-user-operations',
					target: `${snapshot.filter}:${paymaster.address}`,
					nextPageParams: snapshot.nextPageParams,
				}),
			},
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
							userOperationsCount: wire.total_ops,
							smartAccountsCount: wire.total_accounts,
						}
					},
				},
			},
		})({
			userOperationsCount: (factory) => factory.userOperationsCount,
			smartAccountsCount: (factory) => factory.smartAccountsCount,
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
			$$userOperations: {
				select: (snapshot) => snapshot.rows,
				continuation: (snapshot, factory) => blockscoutHistoryContinuation({
					operation: 'erc4337-user-operations',
					target: `${snapshot.filter}:${factory.address}`,
					nextPageParams: snapshot.nextPageParams,
				}),
			},
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
							return {
								nextPageParams: undefined,
								rows: [],
							}

						const limit = Math.min(
							resolverContextRowLimit(context),
							blockscoutV2ItemsCountMax
						)
						const { getErc4337SmartAccountList } = await import('$/sources/Blockscout/Rest/queries.ts')
						const page = await getErc4337SmartAccountList({
							chainId,
							limit,
							factory: entitySelector.address,
							continuation: context.providerContinuationToken,
						})
						return {
							nextPageParams: page.nextPageParams,
							rows: erc4337RegistryEntitiesFromBlockscoutWires({
								chainId,
								items: page.items,
							}),
						}
					},
				},
			},
		})({
			$$smartAccounts: {
				select: (snapshot) => snapshot.rows,
				continuation: (snapshot, factory) => blockscoutHistoryContinuation({
					operation: 'erc4337-factory-smart-accounts',
					target: factory.address,
					nextPageParams: snapshot.nextPageParams,
				}),
			},
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

						const observation = gasEstimateObservationFromBlockscoutStats(stats)
						if (observation == null)
							throw new Error('Blockscout_Rest: stats missing authoritative gas estimate clock')
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
					resolve: async ({ $actor, $network }) => ({
						$$timestamps: [
							await blockscoutEvmNetworkAccountObservation({
								$network,
								$actor,
							}),
						],
					}),
				},
			},
		})({
			$$timestamps: (account) => account.$$timestamps,
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
											value: details.coin_balance,
											blockNumber: details.block_number_balance_updated_at,
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
						const chainId = evmChainIdFromNetworkSelector(entitySelector)
						const limit = Math.min(
							resolverContextRowLimit(context),
							blockscoutV2ItemsCountMax
						)
						const { getBlocks } = await import('$/sources/Blockscout/Rest/queries.ts')
						const page = await getBlocks({
							chainId,
							limit,
							continuation: context.providerContinuationToken,
						})
						return {
							target: `eip155:${chainId}`,
							nextPageParams: page.nextPageParams,
							rows: page.items.flatMap((wire) => {
								const reference = evmBlockReferenceFromBlockscoutWire({
									$network: evmNetworkSelectorFromChainId(chainId),
									wire,
								})
								return reference == null ? [] : [reference]
							}),
						}
					},
				}
			},
		})({
			Evm: {
				$$blocks: {
					select: (page) => page.rows,
					continuation: (page) => blockscoutHistoryContinuation({
						operation: 'network-blocks',
						target: page.target,
						nextPageParams: page.nextPageParams,
					}),
				},
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
						const limit = Math.min(
							resolverContextRowLimit(context),
							blockscoutV2ItemsCountMax
						)
						const { getTransactions } = await import('$/sources/Blockscout/Rest/queries.ts')
						const page = await getTransactions({
							chainId,
							limit,
							continuation: context.providerContinuationToken,
						})
						return {
							target: `eip155:${chainId}`,
							nextPageParams: page.nextPageParams,
							rows: page.items.flatMap((wire) => {
								const reference = evmTransactionReferenceFromBlockscoutWire(
									evmNetworkSelectorFromChainId(chainId),
									wire
								)
								return reference == null ? [] : [reference]
							}),
						}
					},
				},
			},
		})({
			Evm: {
				$$transactions: {
					select: (page) => page.rows,
					continuation: (page) => blockscoutHistoryContinuation({
						operation: 'network-transactions',
						target: page.target,
						nextPageParams: page.nextPageParams,
					}),
				},
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

						const page = await getAddressTransactions({
							chainId: evmChainIdFromNetworkSelector($network),
							address,
							limit,
							continuation: context.providerContinuationToken,
						})
						return {
							target: address,
							nextPageParams: page.nextPageParams,
							rows: page.items.flatMap((wire) => {
								const reference = evmTransactionReferenceFromBlockscoutWire(
									evmNetworkSelectorFromChainId(evmChainIdFromNetworkSelector($network)),
									wire
								)
								return reference == null ? [] : [reference]
							}),
						}
					},
				},
			},
		})({
			$$transactions: {
				select: (page) => page.rows,
				continuation: (page) => blockscoutHistoryContinuation({
					operation: 'account-transactions',
					target: page.target,
					nextPageParams: page.nextPageParams,
				}),
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

						const page = await getAddressTokenTransfers({
							chainId: evmChainIdFromNetworkSelector($network),
							address,
							limit,
							continuation: context.providerContinuationToken,
						})
						return {
							target: address,
							nextPageParams: page.nextPageParams,
							rows: evmTokenTransferEntitiesFromBlockscoutAddressWires({
								$network,
								chainId: evmChainIdFromNetworkSelector($network),
								wires: page.items,
							}),
						}
					},
				},
			},
		})({
			$$tokenTransfers: {
				select: (page) => page.rows.map(evmTokenTransferReference),
				continuation: (page) => blockscoutHistoryContinuation({
					operation: 'account-token-transfers',
					target: page.target,
					nextPageParams: page.nextPageParams,
				}),
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

						const page = await getAddressInternalTransactions({
							chainId: evmChainIdFromNetworkSelector($network),
							address,
							limit,
							continuation: context.providerContinuationToken,
						})
						return {
							target: address,
							nextPageParams: page.nextPageParams,
							rows: evmInternalTransferEntitiesFromBlockscoutAddressWires({
								$network,
								wires: page.items,
							}),
						}
					},
				},
			},
		})({
			$$internalTransfers: {
				select: (page) => page.rows.map(evmInternalTransferReference),
				continuation: (page) => blockscoutHistoryContinuation({
					operation: 'account-internal-transfers',
					target: page.target,
					nextPageParams: page.nextPageParams,
				}),
			},
		}),

		defineResolver({
			entityType: EntityType.EvmTransaction,
			resolve: {
				EvmNetworkTxHash: {
					resolve: async ({ $network, txHash }) => {
						const {
							getTransactionByHash,
							getTransactionRawTrace,
						} = await import('$/sources/Blockscout/Rest/queries.ts')
						const chainId = evmChainIdFromNetworkSelector($network)
						const [transaction, wires] = await Promise.all([
							getTransactionByHash({
								chainId,
								txHash,
							}),
							getTransactionRawTrace({
								chainId,
								txHash,
							}),
						])
						const revertReason = transaction?.revert_reason
						return evmTraceEntitiesFromBlockscoutRawTrace({
							$network,
							txHash,
							wires,
							rootError: (
								revertReason == null ?
									transaction?.status === 'error' ?
										'Execution reverted'
									:
										undefined
								: 'raw' in revertReason ?
									revertReason.raw ?? undefined
								:
									revertReason.method_call ?? revertReason.method_id ?? 'Reverted'
							),
						})
					},
				},
			},
		})({
			$$traces: (entity) => entity.map(evmTraceReference),
		}),

		defineResolver({
			entityType: EntityType.EvmTrace,
			resolve: {
				TransactionTraceAddress: {
					resolve: async ({ $transaction, traceAddress }) => {
						const {
							getTransactionByHash,
							getTransactionRawTrace,
						} = await import('$/sources/Blockscout/Rest/queries.ts')
						const chainId = evmChainIdFromNetworkSelector($transaction.$network)
						const [transaction, wires] = await Promise.all([
							getTransactionByHash({
								chainId,
								txHash: $transaction.txHash,
							}),
							getTransactionRawTrace({
								chainId,
								txHash: $transaction.txHash,
							}),
						])
						const revertReason = transaction?.revert_reason
						const trace = evmTraceEntitiesFromBlockscoutRawTrace({
							$network: $transaction.$network,
							txHash: $transaction.txHash,
							wires,
							rootError: (
								revertReason == null ?
									transaction?.status === 'error' ?
										'Execution reverted'
									:
										undefined
								: 'raw' in revertReason ?
									revertReason.raw ?? undefined
								:
									revertReason.method_call ?? revertReason.method_id ?? 'Reverted'
							),
						}).find((candidate) => candidate.traceAddress === traceAddress)
						if (trace == null)
							throw new Error('Blockscout_Rest: trace not found for EvmTrace')

						return trace
					},
				},
			},
		})({
			$transaction: (trace) => trace.$transaction,
			traceAddress: (trace) => trace.traceAddress,
			index: (trace) => trace.index,
			type: (trace) => trace.type,
			$from: (trace) => trace.$from,
			$to: (trace) => trace.$to,
			value: (trace) => trace.value,
			gas: (trace) => trace.gas,
			gasUsed: (trace) => trace.gasUsed,
			input: (trace) => trace.input,
			output: (trace) => trace.output,
			error: (trace) => trace.error,
			$$children: {
				select: (trace) => trace.$$children,
				resolveCount: (trace) => trace.$$children.length,
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
						const { getSmartContracts } = await import('$/sources/Blockscout/Rest/queries.ts')
						const smartContracts = await getSmartContracts({
							chainId: evmChainIdFromNetworkSelector(entitySelector),
							limit,
						})
						return smartContracts.flatMap((wire) => {
							const reference = evmContractReferenceFromBlockscoutListWire({
								$network: evmNetworkSelectorFromChainId(evmChainIdFromNetworkSelector(entitySelector)),
								wire,
							})
							return reference == null ? [] : [reference]
						})
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
							return {
								nextPageParams: undefined,
								rows: [],
							}

						const limit = Math.min(
							resolverContextRowLimit(context),
							blockscoutV2ItemsCountMax
						)
						const { getErc4337SmartAccountList } = await import('$/sources/Blockscout/Rest/queries.ts')
						const page = await getErc4337SmartAccountList({
							chainId,
							limit,
							continuation: context.providerContinuationToken,
						})
						return {
							nextPageParams: page.nextPageParams,
							rows: erc4337RegistryEntitiesFromBlockscoutWires({
								chainId,
								items: page.items,
							}),
						}
					},
				}
			},
		})({
			Evm: {
				$$erc4337SmartAccounts: {
					select: (snapshot) => snapshot.rows,
					continuation: (snapshot, network) => blockscoutHistoryContinuation({
						operation: 'network-erc4337-smart-accounts',
						target: `eip155:${evmChainIdFromNetworkSelector(network)}`,
						nextPageParams: snapshot.nextPageParams,
					}),
				},
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
							return {
								nextPageParams: undefined,
								rows: [],
							}

						const limit = Math.min(
							resolverContextRowLimit(context),
							blockscoutV2ItemsCountMax
						)
						const { getUserOperationsPage } = await import('$/sources/Blockscout/Rest/queries.ts')
						const page = await getUserOperationsPage({
							chainId,
							limit,
							continuation: context.providerContinuationToken,
						})
						return {
							nextPageParams: page.nextPageParams,
							rows: page.items.flatMap((wire) => {
								const reference = evmUserOperationReferenceFromBlockscoutWire({
									$network: entitySelector,
									wire,
								})
								return reference == null ? [] : [reference]
							}),
						}
					},
				}
			},
		})({
			Evm: {
				$$userOperations: {
					select: (snapshot) => snapshot.rows,
					continuation: (snapshot, network) => blockscoutHistoryContinuation({
						operation: 'network-erc4337-user-operations',
						target: `eip155:${evmChainIdFromNetworkSelector(network)}`,
						nextPageParams: snapshot.nextPageParams,
					}),
				},
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
							return {
								nextPageParams: undefined,
								rows: [],
							}
						const limit = Math.min(
							resolverContextRowLimit(context),
							blockscoutV2ItemsCountMax
						)
						const { getUserOperationsPage } = await import('$/sources/Blockscout/Rest/queries.ts')
						const page = await getUserOperationsPage({
							chainId: evmChainIdFromNetworkSelector($network),
							limit,
							transactionHash: txHash,
							continuation: context.providerContinuationToken,
						})
						return {
							nextPageParams: page.nextPageParams,
							rows: page.items.flatMap((wire) => {
								const reference = evmUserOperationReferenceFromBlockscoutWire({
									$network,
									wire,
								})
								return reference == null ? [] : [reference]
							}),
						}
					},
				}
			},
		})({
			$$userOperations: {
				select: (snapshot) => snapshot.rows,
				continuation: (snapshot, transaction) => blockscoutHistoryContinuation({
					operation: 'transaction-erc4337-user-operations',
					target: transaction.txHash,
					nextPageParams: snapshot.nextPageParams,
				}),
			},
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
						const chainId = evmChainIdFromNetworkSelector($network)
						const page = await getBlockTransactions({
							chainId,
							blockNumber,
							limit,
							continuation: context.providerContinuationToken,
						})
						return {
							target: `eip155:${chainId}:${blockNumber}`,
							nextPageParams: page.nextPageParams,
							rows: page.items.flatMap((wire) => {
								const txHash = hexLowerOfByteSize(wire.hash, 32)

								return txHash == null ?
									[]
								:
									[{
										[EntityMetaKey.Selector]: {
											$network: evmNetworkSelectorFromChainId(chainId),
											txHash,
										},
									}]
							}),
						}
					},
				}
			},
		})({
			$$transactions: {
				select: (page) => page.rows,
				continuation: (page) => blockscoutHistoryContinuation({
					operation: 'block-transactions',
					target: page.target,
					nextPageParams: page.nextPageParams,
				}),
			},
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
						if (details == null)
							return {}

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

		defineResolver({
			entityType: EntityType.EvmContract,
			resolve: {
				EvmNetworkAddress: {
					resolve: async ({ $network, address: addressSelector }, context) => {
						const address = hexLowerOfByteSize(addressSelector, 20)
						if (address == null)
							throw new Error('Blockscout_Rest: EvmContract address not normalized')

						const chainId = evmChainIdFromNetworkSelector($network)
						const tipClock = await blockscoutTipBlockObservationClock(chainId)
						const depth = Math.min(32, Math.max(1, resolverContextRowLimit(context)))
						const { getStorageAt } = await import('$/sources/Blockscout/Rest/queries.ts')
						return (
							await evmContractStorageSlotReadsFromEthGetStorageAt({
								address,
								depth,
								getStorageAt: (slotQuantityHex) => getStorageAt({
									chainId,
									address,
									slotQuantityHex,
									blockTag: `0x${tipClock.blockNumber.toString(16)}`,
								}).then((valueHex) => {
									if (valueHex == null)
										throw new Error('Blockscout_Rest: eth_getStorageAt returned no result')

									return valueHex
								}),
							})
						).map(({ slot, value }) => ({
							[EntityMetaKey.Selector]: {
								$contract: {
									$network,
									address,
								},
								slot,
								timestampMs: tipClock.timestampMs,
								source: Source.Blockscout_Rest,
							},
							[EntityMetaKey.Fields]: {
								[entityFieldAddressKey(EntityType.EvmStorageRead_Timestamp, [], 'value')]: value,
								[entityFieldAddressKey(EntityType.EvmStorageRead_Timestamp, [], 'blockNumber')]: tipClock.blockNumber,
							},
						}))
					},
				},
			},
		})({
			$$storageReads: (entity) => entity,
		}),

		defineResolver({
			entityType: EntityType.EvmContractVerification,
			resolve: {
				EvmContract: {
					resolve: async (entitySelector) => {
						const details = await getBlockscoutSmartContractForEvmContract(entitySelector.$contract)
						if (details == null)
							throw new Error('Blockscout_Rest: contract not verified')

						const verifiedAtMs = details.verified_at == null ?
							undefined
						:
							Date.parse(details.verified_at)
						return {
							...((match) => (
								match != null ?
									{ match }
								:
									{}
							))(blockscoutVerificationMatchFromSmartContractWire(details)),
							...(verifiedAtMs != null && Number.isFinite(verifiedAtMs) && verifiedAtMs >= 0 && {
								verifiedAtMs,
							}),
							$compilation: {
								[EntityMetaKey.Selector]: entitySelector,
							},
							$sourceBundle: {
								[EntityMetaKey.Selector]: entitySelector,
							},
						}
					},
				},
			},
		})({
			match: (verification) => verification.match,
			creationMatch: (verification) => verification.creationMatch,
			runtimeMatch: (verification) => verification.runtimeMatch,
			verifiedAtMs: (verification) => verification.verifiedAtMs,
			matchId: (verification) => verification.matchId,
			$compilation: (verification) => verification.$compilation,
			$sourceBundle: (verification) => verification.$sourceBundle,
		}),

		defineResolver({
			entityType: EntityType.EvmContractCompilation,
			resolve: {
				EvmContract: {
					resolve: async ({ $contract }) => {
						const details = await getBlockscoutSmartContractForEvmContract($contract)
						if (details == null)
							throw new Error('Blockscout_Rest: compilation not verified')

						return {
							...(details.language != null && { language: details.language }),
							...(details.compiler_version != null && {
								compilerVersion: details.compiler_version,
							}),
							...(details.name != null && details.name !== '' && { name: details.name }),
							...(details.file_path != null && details.file_path !== '' && {
								fullyQualifiedName: details.file_path,
							}),
							...(details.compiler_settings != null && {
								compilerSettingsJson: JSON.stringify(details.compiler_settings),
							}),
						}
					},
				},
			},
		})({
			language: (compilation) => compilation.language,
			compiler: (compilation) => compilation.compiler,
			compilerVersion: (compilation) => compilation.compilerVersion,
			name: (compilation) => compilation.name,
			fullyQualifiedName: (compilation) => compilation.fullyQualifiedName,
			compilerSettingsJson: (compilation) => compilation.compilerSettingsJson,
			storageLayoutJson: (compilation) => compilation.storageLayoutJson,
		}),

		defineResolver({
			entityType: EntityType.EvmContractSourceBundle,
			resolve: {
				EvmContract: {
					resolve: async ({ $contract }) => {
						const details = await getBlockscoutSmartContractForEvmContract($contract)
						if (details == null)
							throw new Error('Blockscout_Rest: source bundle not verified')

						return {
							files: JSON.stringify(blockscoutSourceFilesFromSmartContractWire(details)),
						}
					},
				},
			},
		})({
			files: (sourceBundle) => sourceBundle.files,
		}),

		defineResolver({
			entityType: EntityType.EvmContract,
			resolve: {
				EvmNetworkAddress: {
					resolve: async (entitySelector) => {
						if (await getBlockscoutSmartContractForEvmContract(entitySelector) == null)
							return undefined

						return {
							[EntityMetaKey.Selector]: {
								$contract: entitySelector,
							},
						}
					},
				},
			},
		})({
			$verification: (verification) => verification,
		}),
	],
} satisfies RegisteredSourceResolverModule
