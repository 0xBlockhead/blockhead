import {
	resolverContextRowLimit,
	type ResolveLiveFields,
	type ResolveLivePublisherContext,
} from '$/resolvers/$resolvers.ts'
import { ChainId } from '$/constants/ChainId.ts'
import { networks } from '$/constants/Network.ts'
import {
	Abi,
	decodeParameters,
	encodeFunction,
} from '@tevm/voltaire/Abi'
import { keccak256, toHex } from '@tevm/voltaire/Hash'
import { toBytes } from '@tevm/voltaire/Hex'
import type { BlockStreamEvent, StreamBlock } from '@tevm/voltaire/block'
import {
	EvmInternalCallType,
	EvmTokenStandard,
	EvmTransactionEnvelopeType,
	EvmTransactionExecutionStatus,
	EvmTransactionKind,
} from '$/constants/Evm.ts'
import { hexLowerOfByteSize, with0xHex, zeroExLowerCase } from '$/lib/hexLowerOfByteSize.ts'
import { resolveMediaUrlTransport } from '$/lib/media.ts'
import { mediaFromUrl } from '$/resolvers/media.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import { evmNetworkSelectorFromChainId } from '$/resolvers/evm.ts'
import {
	evmTokenApprovalEntityFromLog,
	evmTokenApprovalReference,
} from '$/resolvers/evmTokenApproval.ts'
import { uniswapV3Resolvers } from '$/resolvers/Voltaire/Uniswap.ts'
import { erc4626Resolvers } from '$/resolvers/Voltaire/Erc4626.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
} from '$/schema/$schema.ts'
import {
	type Entity,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { CoinInstanceType } from '$/schema/CoinInstanceType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { MediaType } from '$/schema/MediaType.ts'
import { Source } from '$/sources/Source.ts'
import { ApiFamily } from '$/sources/SourceBinding.ts'
import { voltaireJsonRpcTransports } from '$/sources/Voltaire/JsonRpc/queries.ts'
import type {
	RpcBlockWire,
	RpcLog,
	RpcTransactionWire,
} from '$/sources/_shared/interfaces/EvmExecutionJsonRpc/types.ts'
import type { VoltaireCallTraceRpc } from '$/sources/Voltaire/JsonRpc/CallTrace.ts'
import { voltaireCallTraceError } from '$/sources/Voltaire/JsonRpc/CallTrace.ts'

type NetworkId = EntitySelector<typeof schema, EntityType.Network>
type EvmNetworkLiveFieldName =
	| '$$timestamps'
	| '$$blocks'
	| '$$transactions'
	| '$$gasFeeBlocks'
	| '$$contracts'
	| '$$blobs'
	| '$$beaconEpochs'
	| '$$beaconSlots'
type EvmNetworkLiveContext = Omit<
	ResolveLivePublisherContext<typeof schema, EntityType.Network>,
	'fields'
> & {
	readonly fields: ResolveLiveFields<
		typeof schema,
		EntityType.Network,
		EvmNetworkLiveFieldName
	>
}

const hexFromBytes = (bytes: Uint8Array): `0x${string}` => (
	`0x${Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')}`
)

const ERC20_ABI = new Abi([
	{
		type: 'function',
		name: 'balanceOf',
		stateMutability: 'view',
		inputs: [
			{
				type: 'address',
				name: 'account',
			},
		],
		outputs: [
			{
				type: 'uint256',
				name: '',
			},
		],
	},
	{
		type: 'function',
		name: 'allowance',
		stateMutability: 'view',
		inputs: [
			{
				type: 'address',
				name: 'owner',
			},
			{
				type: 'address',
				name: 'spender',
			},
		],
		outputs: [
			{
				type: 'uint256',
				name: '',
			},
		],
	},
])

const erc20AllowanceOutput = [
	{
		type: 'uint256' as const,
		name: '',
	},
] as const

const voltaireJsonRpcTransportsByChainId = async () => (
	voltaireJsonRpcTransports.transportsByChainId
)

const voltaireJsonRpcHttpTransportsByChainId = async () => (
	voltaireJsonRpcTransports.httpTransportsByChainId
)

const voltaireJsonRpcTxpoolTransportsByChainId = async () => (
	voltaireJsonRpcTransports.txpoolTransportsByChainId
)

const voltaireJsonRpcProviderTransportsByChainId = async () => (
	voltaireJsonRpcTransports.providerTransportsByChainId
)

const evmInternalCallTypeFromVoltaireCallTrace = (raw: string | undefined) => (
	raw == null || raw === '' ?
		EvmInternalCallType.Unknown
	:
		((normalized) => (
			normalized === 'call' ? EvmInternalCallType.Call
			: normalized === 'callcode' ? EvmInternalCallType.CallCode
			: normalized === 'delegatecall' ? EvmInternalCallType.DelegateCall
			: normalized === 'staticcall' ? EvmInternalCallType.StaticCall
			: normalized === 'create' ? EvmInternalCallType.Create
			: normalized === 'create2' ? EvmInternalCallType.Create2
			: normalized === 'suicide' || normalized === 'selfdestruct' ? EvmInternalCallType.SelfDestruct
			: EvmInternalCallType.Unknown
		))(raw.toLowerCase())
)

const evmTraceEntitiesFromVoltaireCallTrace = ({
	call,
	$transaction,
	traceAddress = [],
}: {
	call: VoltaireCallTraceRpc
	$transaction: EntitySelector<typeof schema, EntityType.EvmTransaction>
	traceAddress?: number[]
}): Entity<typeof schema, EntityType.EvmTrace>[] => {
	const traceAddressString = traceAddress.length === 0 ? 'root' : traceAddress.join('.')
	const childTraces = (call.calls ?? []).flatMap((child, childIndex) => evmTraceEntitiesFromVoltaireCallTrace({
		call: child,
		$transaction,
		traceAddress: [...traceAddress, childIndex],
	}))
	const from = hexLowerOfByteSize(call.from ?? '', 20)
	const to = hexLowerOfByteSize(call.to ?? '', 20)

	return [
		{
			[EntityMetaKey.Selector]: {
				$transaction,
				traceAddress: traceAddressString,
			},
			$transaction: {
				[EntityMetaKey.Selector]: $transaction,
			},
			traceAddress: traceAddressString,
			index: traceAddress.at(-1) ?? 0,
			type: evmInternalCallTypeFromVoltaireCallTrace(call.type),
			...(from != null && {
				$from: {
					[EntityMetaKey.Selector]: { address: from },
				},
			}),
			...(to != null && {
				$to: {
					[EntityMetaKey.Selector]: { address: to },
				},
			}),
			...(call.value != null && { value: BigInt(call.value) }),
			...(call.gas != null && { gas: BigInt(call.gas) }),
			...(call.gasUsed != null && { gasUsed: BigInt(call.gasUsed) }),
			...(call.input != null && { input: with0xHex(call.input) }),
			...(call.output != null && { output: with0xHex(call.output) }),
			...((error) => (
				error != null && { error }
			))(voltaireCallTraceError(call)),
			$$children: (call.calls ?? []).map((_child, childIndex) => ({
				[EntityMetaKey.Selector]: {
					$transaction,
					traceAddress: [...traceAddress, childIndex].join('.'),
				},
			})),
		},
		...childTraces,
	]
}

const evmInternalTransferEntitiesFromVoltaireTraces = ({
	$network,
	txHash,
	traces,
}: {
	$network: NetworkId
	txHash: `0x${string}`
	traces: Entity<typeof schema, EntityType.EvmTrace>[]
}) => (
	traces.flatMap((trace, indexInTransaction) => (
		trace.traceAddress === 'root'
		|| trace.value == null
		|| trace.value === 0n ?
			[]
		:
			[{
				[EntityMetaKey.Selector]: {
					$transaction: {
						$network,
						txHash,
					},
					indexInTransaction,
				},
				$transaction: {
					[EntityMetaKey.Selector]: {
						$network,
						txHash,
					},
				},
				...(trace.$from != null && { $from: trace.$from }),
				...(trace.$to != null && { $to: trace.$to }),
				value: trace.value,
				callType: trace.type,
				success: trace.error == null,
				...(
					(
						trace.type === EvmInternalCallType.Create
						|| trace.type === EvmInternalCallType.Create2
					)
					&& trace.$to != null
					&& {
						$createdContract: {
							[EntityMetaKey.Selector]: {
								$network,
								address: trace.$to[EntityMetaKey.Selector].address,
							},
						},
					}
				),
			}]
	))
)

const chainIdFromEvmNetworkId = (network: NetworkId) => {
	const caip2 = (
		'caip2' in network ?
			network.caip2
		:
			((networkRow) => (
				networkRow != null && 'caip2' in networkRow ?
					networkRow.caip2
				:
					undefined
			))(networks.find(({ slug }) => slug === network.slug))
	)
	if (caip2?.namespace !== 'eip155')
		throw new Error('Voltaire_JsonRpc: network selector does not identify an EIP-155 network')

	const chainId = Number(caip2.reference)
	if (!Number.isSafeInteger(chainId) || chainId < 0)
		throw new Error(`Voltaire_JsonRpc: invalid EIP-155 chain id ${caip2.reference}`)

	return chainId
}

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
		if (slotNormalized == null || value == null) continue
		storageSlots.push({
			slot: slotNormalized,
			value,
		})
	}
	return storageSlots
}

const evmLogIndexFromWire = (
	raw: string | undefined
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
				Number(raw)
				)
)

const erc20OrErc721TransferTopic = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
const erc1155TransferSingleTopic = '0xc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62'

const addressFromTopic = (topic: `0x${string}` | undefined) => (
	topic != null && /^0x0{24}[0-9a-f]{40}$/.test(topic) ?
		hexLowerOfByteSize(`0x${topic.slice(-40)}`, 20)
	:
		undefined
)

const evmTokenTransferEntitiesFromVoltaireLog = ({
	$log,
	topics,
	data,
	emitterAddress,
}: {
	$log: Entity<typeof schema, EntityType.EvmLog>[typeof EntityMetaKey.Selector]
	topics: readonly `0x${string}`[]
	data: `0x${string}`
	emitterAddress: `0x${string}` | undefined
}) => {
	if (emitterAddress == null)
		return []

	const $network = $log.$transaction.$network
	const $tokenContract = {
		[EntityMetaKey.Selector]: {
			$network,
			address: emitterAddress,
		},
	}
	const transfer = (
		topics.at(0) === erc20OrErc721TransferTopic && topics.length === 3 && /^0x[0-9a-f]{64}$/.test(data) ?
			{
				standard: EvmTokenStandard.Erc20,
				amount: BigInt(data),
				fromAddress: addressFromTopic(topics.at(1)),
				toAddress: addressFromTopic(topics.at(2)),
			}
		: topics.at(0) === erc20OrErc721TransferTopic && topics.length === 4 && data === '0x' ?
			{
				standard: EvmTokenStandard.Erc721,
				amount: 1n,
				tokenId: BigInt(topics[3]),
				fromAddress: addressFromTopic(topics.at(1)),
				toAddress: addressFromTopic(topics.at(2)),
			}
		: topics.at(0) === erc1155TransferSingleTopic && topics.length === 4 && /^0x[0-9a-f]{128}$/.test(data) ?
			{
				standard: EvmTokenStandard.Erc1155,
				amount: BigInt(`0x${data.slice(66)}`),
				tokenId: BigInt(`0x${data.slice(2, 66)}`),
				fromAddress: addressFromTopic(topics.at(2)),
				toAddress: addressFromTopic(topics.at(3)),
			}
		:
			undefined
	)
	if (transfer == null)
		return []

	return [{
		[EntityMetaKey.Selector]: {
			$log,
			indexInLog: 0,
		},
		$log: {
			[EntityMetaKey.Selector]: $log,
		},
		standard: transfer.standard,
		amount: transfer.amount,
		...(transfer.tokenId != null && { tokenId: transfer.tokenId }),
		...(transfer.fromAddress != null && {
			$from: {
				[EntityMetaKey.Selector]: { address: transfer.fromAddress },
			},
		}),
		...(transfer.toAddress != null && {
			$to: {
				[EntityMetaKey.Selector]: { address: transfer.toAddress },
			},
		}),
		$tokenContract,
		...(transfer.standard === EvmTokenStandard.Erc20 && {
			$coinInstance: {
				[EntityMetaKey.Selector]: {
					$network,
					type: CoinInstanceType.Erc20Token,
					$contract: {
						$network,
						address: emitterAddress,
					},
				},
			},
		}),
	}]
}

const evmTokenTransferReference = (
	transfer: ReturnType<typeof evmTokenTransferEntitiesFromVoltaireLog>[number]
) => ({
	[EntityMetaKey.Selector]: transfer[EntityMetaKey.Selector],
	[EntityMetaKey.Fields]: {
		[entityFieldAddressKey(EntityType.EvmTokenTransfer, [], '$log')]: transfer.$log,
		[entityFieldAddressKey(EntityType.EvmTokenTransfer, [], 'standard')]: transfer.standard,
		[entityFieldAddressKey(EntityType.EvmTokenTransfer, [], 'amount')]: transfer.amount,
		...(transfer.tokenId != null && {
			[entityFieldAddressKey(EntityType.EvmTokenTransfer, ['Nft'], 'tokenId')]: transfer.tokenId,
		}),
		...(transfer.$from != null && {
			[entityFieldAddressKey(EntityType.EvmTokenTransfer, [], '$from')]: transfer.$from,
		}),
		...(transfer.$to != null && {
			[entityFieldAddressKey(EntityType.EvmTokenTransfer, [], '$to')]: transfer.$to,
		}),
		[entityFieldAddressKey(EntityType.EvmTokenTransfer, [], '$tokenContract')]: transfer.$tokenContract,
		...(transfer.$coinInstance != null && {
			[entityFieldAddressKey(EntityType.EvmTokenTransfer, [], '$coinInstance')]: transfer.$coinInstance,
		}),
	},
})

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

const rpcQuantityToBigInt = (
	raw: string | null | undefined
) => {
	if (raw == null)
		return undefined

	try {
		const value = BigInt(raw)
		return value < 0n ? undefined : value
	} catch {
		return undefined
	}
}

const rpcQuantityToNumber = (
	raw: string | null | undefined
) => {
	const value = rpcQuantityToBigInt(raw)
	return value == null || value > BigInt(Number.MAX_SAFE_INTEGER) ? undefined : Number(value)
}

const evmLogEntitySelectorFromWire = ({
	$network,
	txHash,
	log,
}: {
	$network: NetworkId
	txHash: string
	log: RpcLog
}) => {
	const logIndex = evmLogIndexFromWire(log.logIndex)
	const normalizedTxHash = hexLowerOfByteSize(txHash, 32)
	return logIndex == null || normalizedTxHash == null ?
		undefined
	:
		{
			$transaction: {
				$network,
				txHash: normalizedTxHash,
			},
			indexInTransaction: logIndex,
		}
}

const evmLogEntityFromIdAndWire = (
	{ $transaction, indexInTransaction }: Entity<typeof schema, EntityType.EvmLog>[typeof EntityMetaKey.Selector],
	log: RpcLog
) => {
	const { $network, txHash } = $transaction
	const address = hexLowerOfByteSize(log.address ?? '', 20)
	const blockHash = hexLowerOfByteSize(log.blockHash ?? '', 32)
	const blockNumber = rpcQuantityToBigInt(log.blockNumber)
	const data = log.data == null ? undefined : with0xHex(log.data)
	const topics = (
		(log.topics ?? [])
			.flatMap((topic) => {
				const normalized = hexLowerOfByteSize(topic, 32)
				return normalized == null ? [] : [normalized]
			})
	)
	const $tokenApproval = evmTokenApprovalEntityFromLog({
		$log: {
			$transaction,
			indexInTransaction,
		},
		topics,
		data: data ?? '0x',
		emitterAddress: address,
	})
	const $$tokenTransfers = evmTokenTransferEntitiesFromVoltaireLog({
		$log: {
			$transaction,
			indexInTransaction,
		},
		topics,
		data: data ?? '0x',
		emitterAddress: address,
	})
	return {
		[EntityMetaKey.Selector]: {
			$transaction,
			indexInTransaction,
		},
		$transaction: {
			[EntityMetaKey.Selector]: {
				$network,
				txHash,
			},
		} satisfies Entity<typeof schema, EntityType.EvmTransaction>,
		...(blockHash != null && blockNumber != null && {
			$block: {
				[EntityMetaKey.Selector]: {
					$network,
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
					$network,
					address,
				},
			} satisfies Entity<typeof schema, EntityType.EvmContract>,
		}),
		...($tokenApproval != null && {
			$tokenApproval,
		}),
		$$tokenTransfers,
	}
}

const findReceiptLogWireForEvmLogId = (
	logs: readonly RpcLog[] | undefined,
	logIndex: number
): RpcLog | undefined => (
	(logs ?? []).find((log) => (
		evmLogIndexFromWire(log.logIndex) === logIndex
	))
)

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

const eip7702AuthorizationEntitiesFromVoltaireWire = ({
	$network,
	txHash,
	authorizationList,
}: {
	$network: NetworkId
	txHash: `0x${string}`
	authorizationList: NonNullable<RpcTransactionWire['authorizationList']>
}) => (
	authorizationList.map((authorization, authorizationIndex) => {
		const chainId = rpcQuantityToBigInt(authorization.chainId)
		const delegationAddress = hexLowerOfByteSize(authorization.address ?? '', 20)
		const nonce = rpcQuantityToBigInt(authorization.nonce)
		const yParity = rpcQuantityToNumber(authorization.yParity)
		const r = authorization.r == null ? undefined : with0xHex(authorization.r)
		const s = authorization.s == null ? undefined : with0xHex(authorization.s)
		if (
			chainId == null
			|| delegationAddress == null
			|| nonce == null
			|| yParity == null
			|| (yParity !== 0 && yParity !== 1)
			|| r == null
			|| !/^0x[0-9a-f]+$/.test(r)
			|| s == null
			|| !/^0x[0-9a-f]+$/.test(s)
		)
			throw new Error(`Voltaire_JsonRpc: invalid EIP-7702 authorization at index ${String(authorizationIndex)}`)

		return {
			[EntityMetaKey.Selector]: {
				$transaction: {
					$network,
					txHash,
				},
				authorizationIndex,
			},
			$transaction: {
				[EntityMetaKey.Selector]: {
					$network,
					txHash,
				},
			},
			authorizationIndex,
			chainId,
			delegationAddress,
			nonce,
			yParity,
			r,
			s,
			$delegationContract: {
				[EntityMetaKey.Selector]: {
					$network,
					address: delegationAddress,
				},
			},
		}
	})
)

const evmBlobEntityRefsFromVoltaireTx = ({
	$network,
	txHash,
	blobVersionedHashes,
	blockNumber,
}: {
	$network: NetworkId
	txHash: `0x${string}`
	blobVersionedHashes: readonly string[] | undefined
	blockNumber?: bigint
}) => (
	(blobVersionedHashes ?? []).flatMap((blobVersionedHash, blobIndex) => {
		const versionedHash = hexLowerOfByteSize(blobVersionedHash, 32)
		if (versionedHash == null || !versionedHash.startsWith('0x01')) return []
		return [{
			[EntityMetaKey.Selector]: {
				$transaction: {
					$network,
					txHash,
				},
				indexInTransaction: blobIndex,
			},
			[EntityMetaKey.Fields]: {
				...(blockNumber != null && {
					[entityFieldAddressKey(EntityType.EvmBlob, [], '$block')]: {
						[EntityMetaKey.Selector]: {
							$network,
							blockNumber,
						},
					} satisfies Entity<typeof schema, EntityType.EvmBlock>,
				}),
				[entityFieldAddressKey(EntityType.EvmBlob, [], '$transaction')]: {
					[EntityMetaKey.Selector]: {
						$network,
						txHash,
					},
				} satisfies Entity<typeof schema, EntityType.EvmTransaction>,
				[entityFieldAddressKey(EntityType.EvmBlob, [], 'versionedHash')]: versionedHash as `0x01${string}`,
			},
		}]
	})
)

const errorMessage = (error: unknown) => (
	error instanceof Error ?
		error.message
	:
		String(error)
)

const allJsonRpcEndpointsFailedError = (
	chainId: number,
	fieldName: string,
	errors: readonly string[]
) => (
	new Error(`Voltaire_JsonRpc: all JSON-RPC endpoints failed for Network.${fieldName} on chain ${String(chainId)}${errors.length > 0 ? `: ${errors.join('; ')}` : ''}`)
)

const currentEvmBlockNumber = async (
	$network: NetworkId,
	fieldName: string
) => {
	const chainId = chainIdFromEvmNetworkId($network)
	const jsonRpcTransports = (await voltaireJsonRpcHttpTransportsByChainId())[chainId] ?? []
	if (jsonRpcTransports.length === 0)
		throw new Error(`Voltaire_JsonRpc: no JSON-RPC URL for ${fieldName} on chain ${String(chainId)}`)

	const errors: string[] = []
	for (const jsonRpcTransport of jsonRpcTransports) {
		try {
			return await jsonRpcTransport.getBlockNumber()
		} catch (error) {
			errors.push(`${jsonRpcTransport.diagnosticLabel}: ${errorMessage(error)}`)
		}
	}
	throw allJsonRpcEndpointsFailedError(chainId, fieldName, errors)
}

const voltaireTipBlockObservationClock = async (
	chainId: number,
	fieldName: string
) => {
	const jsonRpcTransports = (await voltaireJsonRpcHttpTransportsByChainId())[chainId] ?? []
	if (jsonRpcTransports.length === 0)
		throw new Error(`Voltaire_JsonRpc: no JSON-RPC URL for ${fieldName} on chain ${String(chainId)}`)

	const errors: string[] = []
	for (const jsonRpcTransport of jsonRpcTransports) {
		try {
			const blockNumber = await jsonRpcTransport.getBlockNumber()
			const wire = await jsonRpcTransport.getBlockByNumber({
				blockNumber,
				txObjects: false,
			})
			if (wire == null)
				throw new Error('tip block missing')

			const timestampSeconds = nonNegativeBigIntFromHex(wire.timestamp)
			if (timestampSeconds == null)
				throw new Error('tip block timestamp missing')

			const timestampMs = Number(timestampSeconds) * 1_000
			if (!Number.isSafeInteger(timestampMs) || timestampMs < 0)
				throw new Error('tip block timestamp missing')

			return {
				jsonRpcTransport,
				blockNumber,
				timestampMs,
			}
		} catch (error) {
			errors.push(`${jsonRpcTransport.diagnosticLabel}: ${errorMessage(error)}`)
		}
	}
	throw allJsonRpcEndpointsFailedError(chainId, fieldName, errors)
}

const ensRecordKindFromRecordKey = (recordKey: string) => (
	recordKey.startsWith('coin:') ?
		'coin'
	: recordKey.startsWith('text:') ?
		'text'
	: recordKey.startsWith('dns:') ?
		'dns'
	: recordKey === 'contenthash' ?
		'contenthash'
	: recordKey === 'zonehash' ?
		'zonehash'
	: recordKey === 'abi' ?
		'abi'
	: recordKey === 'pubkey' ?
		'pubkey'
	:
		'text'
)

const ensLiveRecordValue = (value: string | null | undefined) => (
	value == null || value === '' || value === '0x' ?
		undefined
	:
		value
)

const ensForwardFromJsonRpc = async (
	name: string,
	options?: {
		textKeys?: readonly string[]
		coinTypeIds?: readonly number[]
		dnsRecordKeys?: readonly {
			name: string
			type: number
		}[]
		zonehash?: boolean
		resolverAbi?: boolean
		resolverPubkey?: boolean
	}
) => {
	const chainId = ChainId.Ethereum
	const jsonRpcTransports = (await voltaireJsonRpcHttpTransportsByChainId())[chainId] ?? []
	if (jsonRpcTransports.length === 0)
		throw new Error('Voltaire_JsonRpc: no JSON-RPC URL for EnsRecord')

	const errors: string[] = []
	for (const jsonRpcTransport of jsonRpcTransports) {
		try {
			const {
				textRecords,
				coinAddresses,
				contentHash,
				dnsRecords,
				zonehash,
				resolverAbiJsonText,
				pubkey,
			} = await jsonRpcTransport.resolveEnsForward({
				name,
				...options,
			})
			return {
				textRecords,
				coinAddresses,
				contentHash: ensLiveRecordValue(contentHash),
				dnsRecords,
				zonehash: ensLiveRecordValue(zonehash),
				resolverAbiJsonText: ensLiveRecordValue(resolverAbiJsonText),
				pubkey: ensLiveRecordValue(pubkey),
			}
		} catch (error) {
			errors.push(`${jsonRpcTransport.diagnosticLabel}: ${errorMessage(error)}`)
		}
	}
	throw allJsonRpcEndpointsFailedError(chainId, 'EnsRecord', errors)
}

const ensRecordSnapshot = ({
	name,
	recordKey,
	coinType,
	value,
	observedAtMs,
}: {
	name: string
	recordKey: string
	coinType?: number
	value: string | undefined
	observedAtMs: number
}) => ({
	$name: {
		[EntityMetaKey.Selector]: {
			name,
		},
	},
	recordKey,
	recordKind: ensRecordKindFromRecordKey(recordKey),
	...(coinType != null && Number.isSafeInteger(coinType) && {
		coinType,
	}),
	$$timestamps: [{
		[EntityMetaKey.Selector]: {
			$record: {
				$name: {
					name,
				},
				recordKey,
			},
			timestampMs: observedAtMs,
			source: Source.Voltaire_JsonRpc,
		},
		[EntityMetaKey.Fields]: {
			...(value !== undefined && {
				[entityFieldAddressKey(EntityType.EnsRecord_Timestamp, [], 'value')]: value,
			}),
		},
	}],
})

const evmTransactionRefsForTxHashes = (
	chainId: number,
	transactions: readonly (string | RpcTransactionWire)[] | undefined
) => (
	(transactions ?? [])
		.map((transactionRef) => (
			typeof transactionRef === 'string' ?
				transactionRef
			:
				transactionRef.hash
		))
		.filter((hash) => hash.length > 0)
		.map((hash) => hexLowerOfByteSize(hash, 32))
		.filter((hash): hash is `0x${string}` => hash != null)
		.map((txHash) => ({
			[EntityMetaKey.Selector]: {
				$network: evmNetworkSelectorFromChainId(chainId),
				txHash,
			},
		}))
)

const evmNetworkRecentBlocksFromBlockWires = ({
	chainId,
	blockNumbers,
	wires,
}: {
	chainId: number
	blockNumbers: readonly bigint[]
	wires: readonly (RpcBlockWire | null)[]
}) => {
	if (wires.length !== blockNumbers.length)
		throw new Error('Voltaire_JsonRpc: recent block response does not preserve the requested window')

	const recentBlocks = blockNumbers.map((requestedBlockNumber, blockIndex) => {
		const $block = {
			$network: evmNetworkSelectorFromChainId(chainId),
			blockNumber: requestedBlockNumber,
		}
		const wire = wires[blockIndex]
		if (wire == null)
			return { $block, fields: undefined, transactionHashes: [] }

		const fields = networkScopedEvmBlockFieldsFromVoltaireBlockRpc(chainId, wire)
		if (fields == null || fields.blockNumber !== requestedBlockNumber)
			throw new Error(`Voltaire_JsonRpc: recent block ${String(requestedBlockNumber)} does not match its requested position`)

		const transactionHashes = wire.transactions.map((transaction, indexInBlock) => {
			const txHash = hexLowerOfByteSize(
				typeof transaction === 'string' ? transaction : transaction.hash,
				32
			)
			if (txHash == null)
				throw new Error(`Voltaire_JsonRpc: recent block ${String(fields.blockNumber)} has an invalid transaction at index ${String(indexInBlock)}`)
			return txHash
		})

		return { $block, fields, transactionHashes }
	})
	for (let index = 0; index < recentBlocks.length - 1; index += 1) {
		const newer = recentBlocks[index]?.fields
		const older = recentBlocks[index + 1]?.fields
		if (newer != null && older != null && newer.parentHash !== older.hash)
			throw new Error(`Voltaire_JsonRpc: recent blocks ${String(newer.blockNumber)} and ${String(older.blockNumber)} are not canonically linked`)
	}
	return recentBlocks
}

type EvmNetworkRecentBlock = ReturnType<typeof evmNetworkRecentBlocksFromBlockWires>[number]

const evmNetworkRecentBlockFromStreamBlock = (
	chainId: number,
	block: StreamBlock<'header'>
): EvmNetworkRecentBlock => {
	const blockHash = hexLowerOfByteSize(hexFromBytes(block.hash), 32)
	const parentHash = hexLowerOfByteSize(hexFromBytes(block.header.parentHash), 32)
	if (blockHash == null || parentHash == null)
		throw new Error(`Voltaire_JsonRpc: stream block ${String(block.header.number)} has an invalid hash`)

	return {
		$block: {
			$network: evmNetworkSelectorFromChainId(chainId),
			blockNumber: block.header.number,
		},
		fields: {
			[EntityMetaKey.Selector]: {
				$network: evmNetworkSelectorFromChainId(chainId),
				blockNumber: block.header.number,
			},
			blockNumber: block.header.number,
			hash: blockHash,
			parentHash,
			timestamp: Number(block.header.timestamp) * 1000,
			gasUsed: block.header.gasUsed,
			gasLimit: block.header.gasLimit,
			baseFeePerGas: block.header.baseFeePerGas,
			blobGasUsed: block.header.blobGasUsed,
			excessBlobGas: block.header.excessBlobGas,
			transactionCount: block.body.transactions.length,
		},
		transactionHashes: block.body.transactions.map((transaction, indexInBlock) => {
			const txHash = hexLowerOfByteSize(transaction, 32)
			if (txHash == null)
				throw new Error(`Voltaire_JsonRpc: stream block ${String(block.header.number)} has an invalid transaction at index ${String(indexInBlock)}`)
			return txHash
		}),
	}
}

const evmNetworkRecentBlocksAfterStreamEvent = (
	chainId: number,
	previous: readonly EvmNetworkRecentBlock[],
	event: BlockStreamEvent<'header'>,
	depth = 8
) => {
	const incoming = (
		event.type === 'reorg' ? event.added : event.blocks
	).map((block) => evmNetworkRecentBlockFromStreamBlock(chainId, block))
	const retained = event.type === 'reorg' ?
		previous.filter(({ $block }) => $block.blockNumber <= event.commonAncestor.number)
	:
		previous
	const byBlockNumber = new Map(
		[...retained, ...incoming].map((block) => [block.$block.blockNumber, block])
	)
	const next = [...byBlockNumber.values()]
		.filter(({ $block }) => $block.blockNumber <= event.metadata.chainHead)
		.toSorted((left, right) => Number(right.$block.blockNumber - left.$block.blockNumber))
		.slice(0, Math.min(depth, Number(event.metadata.chainHead + 1n)))
	const expectedDepth = Math.min(depth, Number(event.metadata.chainHead + 1n))

	if (
		next.length !== expectedDepth
		|| next[0]?.$block.blockNumber !== event.metadata.chainHead
		|| next.some((block, index) => (
			block.$block.blockNumber !== event.metadata.chainHead - BigInt(index)
		))
	)
		throw new Error('Voltaire_JsonRpc: stream event does not produce a complete canonical recent window')
	for (let index = 0; index < next.length - 1; index += 1) {
		const newer = next[index]?.fields
		const older = next[index + 1]?.fields
		if (newer != null && older != null && newer.parentHash !== older.hash)
			throw new Error(`Voltaire_JsonRpc: stream blocks ${String(newer.blockNumber)} and ${String(older.blockNumber)} are not canonically linked`)
	}

	return next
}

const evmNetworkBlockReferenceFromFields = (
	block: EvmNetworkRecentBlock
) => ({
	[EntityMetaKey.Selector]: block.$block,
	...(block.fields != null && {
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.EvmBlock, [], 'blockNumber')]: block.fields.blockNumber,
			[entityFieldAddressKey(EntityType.EvmBlock, [], 'hash')]: block.fields.hash,
			...(block.fields.parentHash != null && {
				[entityFieldAddressKey(EntityType.EvmBlock, [], 'parentHash')]: block.fields.parentHash,
			}),
			...(block.fields.timestamp != null && {
				[entityFieldAddressKey(EntityType.EvmBlock, [], 'timestamp')]: block.fields.timestamp,
			}),
			...(block.fields.gasUsed != null && {
				[entityFieldAddressKey(EntityType.EvmBlock, [], 'gasUsed')]: block.fields.gasUsed,
			}),
			...(block.fields.gasLimit != null && {
				[entityFieldAddressKey(EntityType.EvmBlock, [], 'gasLimit')]: block.fields.gasLimit,
			}),
			...(block.fields.baseFeePerGas != null && {
				[entityFieldAddressKey(EntityType.EvmBlock, [], 'baseFeePerGas')]: block.fields.baseFeePerGas,
			}),
			...(block.fields.blobGasUsed != null && {
				[entityFieldAddressKey(EntityType.EvmBlock, [], 'blobGasUsed')]: block.fields.blobGasUsed,
			}),
			...(block.fields.excessBlobGas != null && {
				[entityFieldAddressKey(EntityType.EvmBlock, [], 'excessBlobGas')]: block.fields.excessBlobGas,
			}),
			[entityFieldAddressKey(EntityType.EvmBlock, [], 'transactionCount')]: block.fields.transactionCount,
		},
	}),
})

const evmNetworkTransactionReferencesFromRecentBlocks = (
	chainId: number,
	blocks: readonly EvmNetworkRecentBlock[]
) => blocks.flatMap(({ $block, transactionHashes }) => (
	transactionHashes.map((txHash, indexInBlock) => {
		return {
			[EntityMetaKey.Selector]: {
				$network: evmNetworkSelectorFromChainId(chainId),
				txHash,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.EvmTransaction, [], '$block')]: {
					[EntityMetaKey.Selector]: $block,
				},
				[entityFieldAddressKey(EntityType.EvmTransaction, [], 'indexInBlock')]: indexInBlock,
			},
		}
	})
))

const nonNegativeBigIntFromHex = (value: string | undefined) => (
	value == null ?
		undefined
	:
		((parsed) => (
			parsed == null || parsed < 0n ?
				undefined
			:
				parsed
		))((() => {
			try {
				return BigInt(value)
			} catch {
				return undefined
			}
		})())
)

const txpoolCountFromHex = (label: string, hex: string | undefined): number => {
	if (hex == null) throw new Error(`Voltaire_JsonRpc: txpool ${label} missing`)
	try {
		const n = Number(BigInt(hex))
		if (!Number.isFinite(n) || n < 0) throw new Error('txpool count out of range')
		return n
	} catch {
		throw new Error(`Voltaire_JsonRpc: txpool ${label} not a hex quantity`)
	}
}

const gasUsedRatioAtFromFeeHistory = (
	feeHistory: { gasUsedRatio: readonly (number | string)[] },
	index: number
) => {
	const raw = feeHistory.gasUsedRatio.at(index)
	if (raw == null) return undefined
	if (typeof raw === 'number') return raw
	if (typeof raw === 'string') {
		const parsed = Number.parseFloat(raw)
		return Number.isFinite(parsed) ? parsed : undefined
	}
	return undefined
}

const baseFeeAtFromFeeHistory = (
	feeHistory: { baseFeePerGas: readonly string[] },
	index: number
) => (
	nonNegativeBigIntFromHex(feeHistory.baseFeePerGas.at(index))
)

const baseFeePerBlobGasAtFromFeeHistory = (
	feeHistory: { baseFeePerBlobGas?: readonly string[] },
	index: number
) => (
	nonNegativeBigIntFromHex(feeHistory.baseFeePerBlobGas?.at(index))
)

const blobGasUsedRatioAtFromFeeHistory = (
	feeHistory: { blobGasUsedRatio?: readonly (number | string)[] },
	index: number
) => {
	const raw = feeHistory.blobGasUsedRatio?.at(index)
	if (raw == null) return undefined
	if (typeof raw === 'number') return raw
	if (typeof raw === 'string') {
		const parsed = Number.parseFloat(raw)
		return Number.isFinite(parsed) ? parsed : undefined
	}
	return undefined
}

const priorityRewardAt50thFromFeeHistoryAt = (
	feeHistory: { reward?: string[][] },
	index: number
) => (
	nonNegativeBigIntFromHex(feeHistory.reward?.at(index)?.at(0))
)

const networkGasFeeBlockRefsFromFeeHistory = (
	networkEntitySelector: EntitySelector<typeof schema, EntityType.Network>,
	feeHistory: {
		oldestBlock: string
		gasUsedRatio: readonly (number | string)[]
	}
) => {
	const oldestBlock = nonNegativeBigIntFromHex(feeHistory.oldestBlock)
	if (oldestBlock == null || feeHistory.gasUsedRatio.length === 0) return []
	return (
		Array.from(
			{ length: feeHistory.gasUsedRatio.length },
			(_entry, index) => ({
				[EntityMetaKey.Selector]: {
					$network: networkEntitySelector,
					blockNumber: oldestBlock + BigInt(index),
				},
			})
		)
	)
}

const evmBlobEntitiesFromVoltaireBlockWire = (
	chainId: number,
	blockNumber: bigint,
	wire: RpcBlockWire
) => {
	const txs = wire.transactions
	const out = []
	for (const transactionRef of txs) {
		if (typeof transactionRef === 'string') continue
		const txHash = hexLowerOfByteSize(transactionRef.hash, 32)
		if (txHash == null) continue
		const bvh = transactionRef.blobVersionedHashes
		if (bvh == null) continue
		for (let blobIndex = 0; blobIndex < bvh.length; blobIndex += 1) {
			const h = bvh[blobIndex]
			const versionedHash = hexLowerOfByteSize(h, 32)
			if (versionedHash == null || !versionedHash.startsWith('0x01')) continue
			out.push({
				[EntityMetaKey.Selector]: {
					$transaction: {
						$network: evmNetworkSelectorFromChainId(chainId),
						txHash,
					},
					indexInTransaction: blobIndex,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.EvmBlob, [], '$block')]: {
						[EntityMetaKey.Selector]: {
							$network: evmNetworkSelectorFromChainId(chainId),
							blockNumber,
						},
					} satisfies Entity<typeof schema, EntityType.EvmBlock>,
					[entityFieldAddressKey(EntityType.EvmBlob, [], '$transaction')]: {
						[EntityMetaKey.Selector]: {
							$network: evmNetworkSelectorFromChainId(chainId),
							txHash,
						},
					} satisfies Entity<typeof schema, EntityType.EvmTransaction>,
					[entityFieldAddressKey(EntityType.EvmBlob, [], 'versionedHash')]: versionedHash as `0x01${string}`,
					},
			})
		}
	}
	return out
}

const networkScopedEvmBlockFieldsFromVoltaireBlockRpc = (
	chainId: number,
	wire: RpcBlockWire
) => {
	const blockHash = hexLowerOfByteSize(wire.hash, 32)
	const parentHash = hexLowerOfByteSize(wire.parentHash, 32)
	const blockNumber = (() => {
		try {
			return BigInt(wire.number)
		} catch {
			return undefined
		}
	})()
	if (blockHash == null || blockNumber == null)
		return null
	return {
											[EntityMetaKey.Selector]: {
			$network: evmNetworkSelectorFromChainId(chainId),
			blockNumber,
		},
		blockNumber,
		hash: blockHash,
		...(parentHash != null && { parentHash }),
		timestamp: (
			typeof wire.timestamp === 'number' ?
				wire.timestamp * 1000
			:
				((parsed) => (
					Number.isFinite(parsed) ? parsed * 1000 : undefined
				))(Number(wire.timestamp))
		),
		gasUsed: nonNegativeBigIntFromHex(wire.gasUsed),
		gasLimit: nonNegativeBigIntFromHex(wire.gasLimit),
		baseFeePerGas: nonNegativeBigIntFromHex(wire.baseFeePerGas),
		blobGasUsed: nonNegativeBigIntFromHex(wire.blobGasUsed),
		excessBlobGas: nonNegativeBigIntFromHex(wire.excessBlobGas),
		transactionCount: wire.transactions.length,
	}
}

export default {
	source: Source.Voltaire_JsonRpc,
	resolvers: [
		defineResolver({
			entityType: EntityType.EvmBlock,
			resolve: {
				EvmNetworkBlockNumber: {
					resolve: async ({ $network, blockNumber: blockNumberSelector }) => {
						const chainId = chainIdFromEvmNetworkId($network)
						const jsonRpcTransports = (await voltaireJsonRpcHttpTransportsByChainId())[chainId] ?? []
						if (jsonRpcTransports.length === 0)
							throw new Error(`Voltaire_JsonRpc: no JSON-RPC URL for EvmBlock on chain ${String(chainId)}`)
						const errors: string[] = []
						for (const jsonRpcTransport of jsonRpcTransports) {
							try {
								const voltaireBlockWire = await jsonRpcTransport.getBlockByNumber({
									blockNumber: blockNumberSelector,
									txObjects: false,
								})
								if (voltaireBlockWire == null)
									throw new Error('block not returned from RPC')
								const block = networkScopedEvmBlockFieldsFromVoltaireBlockRpc(
									chainId,
									voltaireBlockWire
								)
								if (block == null)
									throw new Error('invalid block returned from RPC')
								if (block.blockNumber !== blockNumberSelector)
									throw new Error('block number does not match the requested selector')
								const parentBlockNumber = block[EntityMetaKey.Selector].blockNumber > 0n ?
									block[EntityMetaKey.Selector].blockNumber - 1n
								:
									undefined
								const miner = hexLowerOfByteSize(voltaireBlockWire.miner, 20)
								return {
									...block,
									$$transactions: evmTransactionRefsForTxHashes(
										chainId,
										voltaireBlockWire.transactions
									),
									...(parentBlockNumber != null && block.parentHash != null && {
										$parent: {
											[EntityMetaKey.Selector]: {
												$network,
												blockNumber: parentBlockNumber,
											},
											hash: block.parentHash,
										} satisfies Entity<typeof schema, EntityType.EvmBlock>,
									}),
									...(miner != null && {
										$miner: {
											[EntityMetaKey.Selector]: {
												address: miner,
											},
										} satisfies Entity<typeof schema, EntityType.EvmAccount>,
									}),
								}
							} catch (error) {
								errors.push(`${jsonRpcTransport.diagnosticLabel}: ${errorMessage(error)}`)
							}
						}
						throw allJsonRpcEndpointsFailedError(chainId, 'EvmBlock', errors)
					},
				},
				EvmNetworkBlockHash: {
					resolve: async ({ $network, hash }) => {
						const chainId = chainIdFromEvmNetworkId($network)
						const jsonRpcTransports = (await voltaireJsonRpcHttpTransportsByChainId())[chainId] ?? []
						if (jsonRpcTransports.length === 0)
							throw new Error(`Voltaire_JsonRpc: no JSON-RPC URL for EvmBlock on chain ${String(chainId)}`)
						const errors: string[] = []
						for (const jsonRpcTransport of jsonRpcTransports) {
							try {
								const voltaireBlockWire = await jsonRpcTransport.getBlockByHash({
									blockHash: hash,
									txObjects: false,
								})
								if (voltaireBlockWire == null)
									throw new Error('block not returned from RPC')
								const block = networkScopedEvmBlockFieldsFromVoltaireBlockRpc(
									chainId,
									voltaireBlockWire
								)
								if (block == null)
									throw new Error('invalid block returned from RPC')
								const requestedBlockHash = hexLowerOfByteSize(hash, 32)
								if (requestedBlockHash == null || block.hash !== requestedBlockHash)
									throw new Error('block hash does not match the requested selector')
								const parentBlockNumber = block[EntityMetaKey.Selector].blockNumber > 0n ?
									block[EntityMetaKey.Selector].blockNumber - 1n
								:
									undefined
								const miner = hexLowerOfByteSize(voltaireBlockWire.miner, 20)
								return {
									...block,
									[EntityMetaKey.Selector]: {
										$network,
										hash: block.hash,
									},
									$$transactions: evmTransactionRefsForTxHashes(
										chainId,
										voltaireBlockWire.transactions
									),
									...(parentBlockNumber != null && block.parentHash != null && {
										$parent: {
											[EntityMetaKey.Selector]: {
												$network,
												hash: block.parentHash,
											},
										} satisfies Entity<typeof schema, EntityType.EvmBlock>,
									}),
									...(miner != null && {
										$miner: {
											[EntityMetaKey.Selector]: {
												address: miner,
											},
										} satisfies Entity<typeof schema, EntityType.EvmAccount>,
									}),
								}
							} catch (error) {
								errors.push(`${jsonRpcTransport.diagnosticLabel}: ${errorMessage(error)}`)
							}
						}
						throw allJsonRpcEndpointsFailedError(chainId, 'EvmBlock', errors)
					},
				},
			},
		})({
			blockNumber: (entity) => entity.blockNumber,
			hash: (entity) => entity.hash,
			parentHash: (entity) => entity.parentHash,
			timestamp: (entity) => entity.timestamp,
			gasUsed: (entity) => entity.gasUsed,
			gasLimit: (entity) => entity.gasLimit,
			baseFeePerGas: (entity) => entity.baseFeePerGas,
			blobGasUsed: (entity) => entity.blobGasUsed,
			excessBlobGas: (entity) => entity.excessBlobGas,
			transactionCount: (entity) => entity.transactionCount,
			$parent: (entity) => entity.$parent,
			$miner: (entity) => entity.$miner,
			$$transactions: (entity) => entity.$$transactions,
		}),

		defineResolver({
			entityType: EntityType.EvmBlob,
			resolve: {
				TransactionIndexInTransaction: {
					resolve: async ({ $transaction, indexInTransaction }) => {
						const chainId = chainIdFromEvmNetworkId($transaction.$network)
						const txHash = hexLowerOfByteSize($transaction.txHash, 32)
						if (txHash == null)
							throw new Error('Voltaire_JsonRpc: invalid blob transaction hash')
						const jsonRpcTransports = (await voltaireJsonRpcHttpTransportsByChainId())[chainId] ?? []
						if (jsonRpcTransports.length === 0)
							throw new Error(`Voltaire_JsonRpc: no JSON-RPC URL for EvmBlob on chain ${String(chainId)}`)
						const errors: string[] = []
						for (const jsonRpcTransport of jsonRpcTransports) {
							try {
								const tx = await jsonRpcTransport.getTransactionByHash({
									txHash,
								})
								if (tx == null)
									throw new Error('blob transaction not found')
								const blobVersionedHash = tx.blobVersionedHashes?.[indexInTransaction]
								if (blobVersionedHash == null)
									throw new Error('blob index missing on transaction')
								const versionedHash = hexLowerOfByteSize(blobVersionedHash, 32)
								if (versionedHash == null || !versionedHash.startsWith('0x01'))
									throw new Error('invalid blob versioned hash')
								const blockNumber = nonNegativeBigIntFromHex(tx.blockNumber)
								if (blockNumber == null)
									throw new Error('blob transaction missing block')
								return {
									[EntityMetaKey.Selector]: {
										$transaction,
										indexInTransaction,
									},
									versionedHash: versionedHash as `0x01${string}`,
									$transaction: {
										[EntityMetaKey.Selector]: {
											$network: evmNetworkSelectorFromChainId(chainId),
											txHash,
										},
									} satisfies Entity<typeof schema, EntityType.EvmTransaction>,
									$block: {
										[EntityMetaKey.Selector]: {
											$network: evmNetworkSelectorFromChainId(chainId),
											blockNumber,
										},
									} satisfies Entity<typeof schema, EntityType.EvmBlock>,
								}
							} catch (error) {
								errors.push(`${jsonRpcTransport.diagnosticLabel}: ${errorMessage(error)}`)
							}
						}
						throw allJsonRpcEndpointsFailedError(chainId, 'EvmBlob', errors)
					},
				}
			},
		})({
			indexInTransaction: (entity) => entity[EntityMetaKey.Selector].indexInTransaction,
			versionedHash: (entity) => entity.versionedHash,
			$transaction: (entity) => ({
				[EntityMetaKey.Selector]: entity.$transaction[EntityMetaKey.Selector],
			}),
			$block: (entity) => ({
				[EntityMetaKey.Selector]: entity.$block[EntityMetaKey.Selector],
			}),
		}),

		defineResolver({
			entityType: EntityType.EvmNetwork_GasFee_Block,
			resolve: {
				EvmNetworkBlockNumber: {
					resolve: async ({ $network, blockNumber }) => {
						const chainId = chainIdFromEvmNetworkId($network)
						const jsonRpcTransports = (await voltaireJsonRpcHttpTransportsByChainId())[chainId] ?? []
						if (jsonRpcTransports.length === 0) throw new Error('Voltaire_JsonRpc: no JSON-RPC URL for EvmNetwork_GasFee_Block')
						const errors: string[] = []
						for (const jsonRpcTransport of jsonRpcTransports) {
							try {
								const feeHistory = await jsonRpcTransport.getFeeHistory({
									blockCount: 1,
									newestBlock: blockNumber,
									rewardPercentiles: [50],
								})
								const headBlockNumber = await jsonRpcTransport.getBlockNumber()
								const isHeadBlock = (
									headBlockNumber === blockNumber
								)
								let legacyGasPrice: bigint | undefined
								let maxPriorityFeePerGas: bigint | undefined
								if (isHeadBlock) {
									legacyGasPrice = nonNegativeBigIntFromHex(
										await jsonRpcTransport.getGasPrice()
									)
									try {
										maxPriorityFeePerGas = nonNegativeBigIntFromHex(
											await jsonRpcTransport.getMaxPriorityFeePerGas()
										)
									} catch {
										maxPriorityFeePerGas = undefined
									}
								}
								return {
									[EntityMetaKey.Selector]: {
										$network,
										blockNumber,
									},
									baseFeePerGas: baseFeeAtFromFeeHistory(feeHistory, 0),
									legacyGasPrice,
									maxPriorityFeePerGas,
									gasUsedRatio: gasUsedRatioAtFromFeeHistory(feeHistory, 0),
									priorityFeeRewardAt50thPercentile: priorityRewardAt50thFromFeeHistoryAt(feeHistory, 0),
									baseFeePerBlobGas: baseFeePerBlobGasAtFromFeeHistory(feeHistory, 0),
									blobGasUsedRatio: blobGasUsedRatioAtFromFeeHistory(feeHistory, 0),
								}
							} catch (error) {
								errors.push(`${jsonRpcTransport.diagnosticLabel}: ${errorMessage(error)}`)
							}
						}
						throw allJsonRpcEndpointsFailedError(chainId, 'EvmNetwork_GasFee_Block', errors)
					},
				}
			},
		})({
			baseFeePerGas: (gasFeeBlock) => gasFeeBlock.baseFeePerGas,
			legacyGasPrice: (gasFeeBlock) => gasFeeBlock.legacyGasPrice,
			maxPriorityFeePerGas: (gasFeeBlock) => gasFeeBlock.maxPriorityFeePerGas,
			gasUsedRatio: (gasFeeBlock) => gasFeeBlock.gasUsedRatio,
			priorityFeeRewardAt50thPercentile: (gasFeeBlock) => gasFeeBlock.priorityFeeRewardAt50thPercentile,
			baseFeePerBlobGas: (gasFeeBlock) => gasFeeBlock.baseFeePerBlobGas,
			blobGasUsedRatio: (gasFeeBlock) => gasFeeBlock.blobGasUsedRatio,
		}),

		defineResolver({
			entityType: EntityType.EnsName,
			resolve: {
				NormalizedName: {
					resolve: async ({ name }) => {
						const {
							normalizeEnsName,
						} = await import('$/sources/Voltaire/JsonRpc/ens.ts')
						const normalizedName = normalizeEnsName(name)
						const {
							textRecords,
							coinAddresses,
							contentHash,
							dnsRecords,
							zonehash,
							resolverAbiJsonText,
							pubkey,
						} = await ensForwardFromJsonRpc(normalizedName)
						const observedAtMs = Date.now()
						return {
							name: normalizedName,
							normalizedName,
							$$records: [
								...Object.entries(textRecords).flatMap(([key, value]) => {
									const liveValue = ensLiveRecordValue(value)
									return liveValue === undefined ?
										[]
									:
										[ensRecordSnapshot({
											name: normalizedName,
											recordKey: `text:${key}`,
											value: liveValue,
											observedAtMs,
										})]
								}),
								...Object.entries(coinAddresses).flatMap(([coinTypeKey, value]) => {
									const liveValue = ensLiveRecordValue(value)
									const coinType = Number(coinTypeKey)
									return liveValue === undefined ?
										[]
									:
										[ensRecordSnapshot({
											name: normalizedName,
											recordKey: `coin:${coinTypeKey}`,
											coinType,
											value: liveValue,
											observedAtMs,
										})]
								}),
								...(
									contentHash === undefined ?
										[]
									:
										[ensRecordSnapshot({
											name: normalizedName,
											recordKey: 'contenthash',
											value: contentHash,
											observedAtMs,
										})]
								),
								...Object.entries(dnsRecords).flatMap(([recordKey, value]) => {
									const liveValue = ensLiveRecordValue(value)
									return liveValue === undefined ?
										[]
									:
										[ensRecordSnapshot({
											name: normalizedName,
											recordKey,
											value: liveValue,
											observedAtMs,
										})]
								}),
								...(
									zonehash === undefined ?
										[]
									:
										[ensRecordSnapshot({
											name: normalizedName,
											recordKey: 'zonehash',
											value: zonehash,
											observedAtMs,
										})]
								),
								...(
									resolverAbiJsonText === undefined ?
										[]
									:
										[ensRecordSnapshot({
											name: normalizedName,
											recordKey: 'abi',
											value: resolverAbiJsonText,
											observedAtMs,
										})]
								),
								...(
									pubkey === undefined ?
										[]
									:
										[ensRecordSnapshot({
											name: normalizedName,
											recordKey: 'pubkey',
											value: pubkey,
											observedAtMs,
										})]
								),
							].map((ensRecord) => ({
								[EntityMetaKey.Selector]: {
									$name: ensRecord.$name[EntityMetaKey.Selector],
									recordKey: ensRecord.recordKey,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.EnsRecord, [], '$name')]: ensRecord.$name,
									[entityFieldAddressKey(EntityType.EnsRecord, [], 'recordKey')]: ensRecord.recordKey,
									[entityFieldAddressKey(EntityType.EnsRecord, [], 'recordKind')]: ensRecord.recordKind,
									...(ensRecord.coinType != null && {
										[entityFieldAddressKey(EntityType.EnsRecord, [], 'coinType')]: ensRecord.coinType,
									}),
									[entityFieldAddressKey(EntityType.EnsRecord, [], '$$timestamps')]: ensRecord.$$timestamps,
								},
							})),
						}
					},
				}
			},
		})({
			name: (entity) => entity.name,
			normalizedName: (entity) => entity.normalizedName,
			$$records: {
				select: (entity) => entity.$$records,
				resolveCount: (entity) => entity.$$records.length,
			},
		}),

		defineResolver({
			entityType: EntityType.EnsRecord,
			resolve: {
				NameRecordKey: {
					resolve: async ({ $name, recordKey }) => {
						const {
							normalizeEnsName,
						} = await import('$/sources/Voltaire/JsonRpc/ens.ts')
						const normalizedName = normalizeEnsName($name.name)
						const observedAtMs = Date.now()
						if (recordKey === 'contenthash') {
							const { contentHash } = await ensForwardFromJsonRpc(normalizedName, {
								textKeys: [],
								coinTypeIds: [],
								dnsRecordKeys: [],
								zonehash: false,
								resolverAbi: false,
								resolverPubkey: false,
							})
							return ensRecordSnapshot({
								name: normalizedName,
								recordKey,
								value: contentHash,
								observedAtMs,
							})
						}
						if (recordKey.startsWith('coin:')) {
							const coinType = Number(recordKey.slice('coin:'.length))
							const { coinAddresses } = await ensForwardFromJsonRpc(normalizedName, {
								textKeys: [],
								coinTypeIds: (
									Number.isSafeInteger(coinType) ?
										[coinType]
									:
										[]
								),
								dnsRecordKeys: [],
								zonehash: false,
								resolverAbi: false,
								resolverPubkey: false,
							})
							return ensRecordSnapshot({
								name: normalizedName,
								recordKey,
								coinType,
								value: ensLiveRecordValue(
									Number.isSafeInteger(coinType) ?
										coinAddresses[String(coinType)]
									:
										undefined
								),
								observedAtMs,
							})
						}
						if (recordKey === 'zonehash') {
							const { zonehash } = await ensForwardFromJsonRpc(normalizedName, {
								textKeys: [],
								coinTypeIds: [],
								dnsRecordKeys: [],
								zonehash: true,
								resolverAbi: false,
								resolverPubkey: false,
							})
							return ensRecordSnapshot({
								name: normalizedName,
								recordKey,
								value: zonehash,
								observedAtMs,
							})
						}
						if (recordKey.startsWith('dns:')) {
							const dnsKey = recordKey.slice('dns:'.length)
							const separatorIndex = dnsKey.indexOf(':')
							const type = Number(dnsKey.slice(0, separatorIndex))
							const dnsName = dnsKey.slice(separatorIndex + 1)
							const { dnsRecords } = await ensForwardFromJsonRpc(normalizedName, {
								textKeys: [],
								coinTypeIds: [],
								dnsRecordKeys: [{
									name: dnsName,
									type,
								}],
								zonehash: false,
								resolverAbi: false,
								resolverPubkey: false,
							})
							return ensRecordSnapshot({
								name: normalizedName,
								recordKey,
								value: ensLiveRecordValue(dnsRecords[recordKey]),
								observedAtMs,
							})
						}
						if (recordKey === 'abi') {
							const { resolverAbiJsonText } = await ensForwardFromJsonRpc(normalizedName, {
								textKeys: [],
								coinTypeIds: [],
								dnsRecordKeys: [],
								zonehash: false,
								resolverAbi: true,
								resolverPubkey: false,
							})
							return ensRecordSnapshot({
								name: normalizedName,
								recordKey,
								value: resolverAbiJsonText,
								observedAtMs,
							})
						}
						if (recordKey === 'pubkey') {
							const { pubkey } = await ensForwardFromJsonRpc(normalizedName, {
								textKeys: [],
								coinTypeIds: [],
								dnsRecordKeys: [],
								zonehash: false,
								resolverAbi: false,
								resolverPubkey: true,
							})
							return ensRecordSnapshot({
								name: normalizedName,
								recordKey,
								value: pubkey,
								observedAtMs,
							})
						}
						const textKey = (
							recordKey.startsWith('text:') ?
								recordKey.slice('text:'.length)
							:
								recordKey
						)
						const { textRecords } = await ensForwardFromJsonRpc(normalizedName, {
							textKeys: [textKey],
							coinTypeIds: [],
							dnsRecordKeys: [],
							zonehash: false,
							resolverAbi: false,
							resolverPubkey: false,
						})
						return ensRecordSnapshot({
							name: normalizedName,
							recordKey,
							value: ensLiveRecordValue(textRecords[textKey]),
							observedAtMs,
						})
					},
				},
			},
		})({
			$name: (ensRecord) => ensRecord.$name,
			recordKey: (ensRecord) => ensRecord.recordKey,
			recordKind: (ensRecord) => ensRecord.recordKind,
			coinType: (ensRecord) => ensRecord.coinType,
			$$timestamps: {
				select: (ensRecord) => ensRecord.$$timestamps,
			},
		}),

		defineResolver({
			entityType: EntityType.EvmActorCoinAllowance,
			resolve: {
				EvmAccountEvmContractSpenderInteropAddress: {
					resolve: async ({ $actor, $contract, $spender, interopAddress }) => {
						const $allowance = {
							$actor,
							$contract,
							$spender,
							interopAddress,
						}
						return {
							...$allowance,
							$actorCoin: {
								[EntityMetaKey.Selector]: {
									$actor,
									$contract,
								},
							},
							$$blocks: [{
								[EntityMetaKey.Selector]: {
									$allowance,
									blockNumber: await currentEvmBlockNumber(
										$contract.$network,
										'EvmActorCoinAllowance.$$blocks'
									),
									source: Source.Voltaire_JsonRpc,
								},
							}],
						}
					},
				}
			},
		})({
			$actor: (allowance) => ({
				[EntityMetaKey.Selector]: allowance.$actor,
			}),
			$contract: (allowance) => ({
				[EntityMetaKey.Selector]: allowance.$contract,
			}),
			$actorCoin: (allowance) => allowance.$actorCoin,
			$spender: (allowance) => ({
				[EntityMetaKey.Selector]: allowance.$spender,
			}),
			interopAddress: (allowance) => allowance.interopAddress,
			$$blocks: (allowance) => allowance.$$blocks,
		}),

		defineResolver({
			entityType: EntityType.EvmNetworkActorCoinBalance,
			resolve: {
				EvmAccountNativeCoinInstance: {
					resolve: async ({ $actor, $network }) => [{
						[EntityMetaKey.Selector]: {
							$actorCoin: {
								$actor,
								$network,
							},
							$block: {
								$network,
								blockNumber: await currentEvmBlockNumber(
									$network,
									'EvmNetworkActorCoinBalance.$$blocks'
								),
							},
						},
					}],
				},
				EvmAccountErc20CoinInstance: {
					resolve: async ({ $actor, $contract }) => [{
						[EntityMetaKey.Selector]: {
							$actorCoin: {
								$actor,
								$network: $contract.$network,
								$contract,
							},
							$block: {
								$network: $contract.$network,
								blockNumber: await currentEvmBlockNumber(
									$contract.$network,
									'EvmNetworkActorCoinBalance.$$blocks'
								),
							},
						},
					}],
				},
			},
		})({
			$$blocks: (blocks) => blocks,
		}),

		defineResolver({
			entityType: EntityType.EvmActorCoinAllowance_Block,
			resolve: {
				AllowanceBlockNumberSource: {
					resolve: async ({
						$allowance,
						blockNumber,
						source,
					}) => {
						if (source !== Source.Voltaire_JsonRpc)
							throw new Error(`Voltaire_JsonRpc: unsupported allowance block source ${source}`)

						const chainId = chainIdFromEvmNetworkId($allowance.$contract.$network)
						const jsonRpcTransports = (await voltaireJsonRpcHttpTransportsByChainId())[chainId] ?? []
						if (jsonRpcTransports.length === 0)
							throw new Error(`Voltaire_JsonRpc: no JSON-RPC URL for EvmActorCoinAllowance_Block on chain ${String(chainId)}`)

						const errors: string[] = []
						for (const jsonRpcTransport of jsonRpcTransports) {
							try {
								const response = await jsonRpcTransport.getCall({
									to: $allowance.$contract.address,
									input: encodeFunction(
										ERC20_ABI,
										'allowance',
										[
											$allowance.$actor.address,
											$allowance.$spender.address,
										]
									),
									blockTag: `0x${blockNumber.toString(16)}`,
								})
								if (response === '0x')
									throw new Error('ERC-20 allowance call returned empty data')

								return {
									$allowance,
									blockNumber,
									source,
									allowance: decodeParameters(
										erc20AllowanceOutput,
										toBytes(response)
									)[0],
								}
							} catch (error) {
								errors.push(`${jsonRpcTransport.diagnosticLabel}: ${errorMessage(error)}`)
							}
						}
						throw allJsonRpcEndpointsFailedError(chainId, 'EvmActorCoinAllowance_Block', errors)
					},
				},
			},
		})({
			$allowance: (allowanceBlock) => ({
				[EntityMetaKey.Selector]: allowanceBlock.$allowance,
			}),
			blockNumber: (allowanceBlock) => allowanceBlock.blockNumber,
			source: (allowanceBlock) => allowanceBlock.source,
			allowance: (allowanceBlock) => allowanceBlock.allowance,
		}),

		defineResolver({
			entityType: EntityType.EvmNetworkActorCoinBalance_EvmBlock,
			resolve: {
				EvmNetworkActorCoinBalanceEvmBlock: {
					resolve: async ({
						$actorCoin,
						$block,
					}) => {
						const chainId = chainIdFromEvmNetworkId($actorCoin.$network)
						if (chainIdFromEvmNetworkId($block.$network) !== chainId)
							throw new Error('Voltaire_JsonRpc: balance block network does not match the actor coin network')
						if (
							$actorCoin.$contract != null
							&& chainIdFromEvmNetworkId($actorCoin.$contract.$network) !== chainId
						)
							throw new Error('Voltaire_JsonRpc: balance contract network does not match the actor coin network')

						const jsonRpcTransports = (await voltaireJsonRpcHttpTransportsByChainId())[chainId] ?? []
						if (jsonRpcTransports.length === 0)
							throw new Error(`Voltaire_JsonRpc: no JSON-RPC URL for EvmNetworkActorCoinBalance_EvmBlock on chain ${String(chainId)}`)

						const blockTag = `0x${$block.blockNumber.toString(16)}`
						const errors: string[] = []
						for (const jsonRpcTransport of jsonRpcTransports) {
							try {
								const balance = (
									$actorCoin.$contract == null ?
										nonNegativeBigIntFromHex(await jsonRpcTransport.getBalance({
											address: $actorCoin.$actor.address,
											blockTag,
										}))
									:
										decodeParameters(
											erc20AllowanceOutput,
											toBytes(await jsonRpcTransport.getCall({
												to: $actorCoin.$contract.address,
												input: encodeFunction(
													ERC20_ABI,
													'balanceOf',
													[$actorCoin.$actor.address]
												),
												blockTag,
											}))
										)[0]
								)
								if (balance == null)
									throw new Error('balance read returned an invalid non-negative quantity')

								return {
									$actorCoin,
									$block,
									balance,
								}
							} catch (error) {
								errors.push(`${jsonRpcTransport.diagnosticLabel}: ${errorMessage(error)}`)
							}
						}
						throw allJsonRpcEndpointsFailedError(chainId, 'EvmNetworkActorCoinBalance_EvmBlock', errors)
					},
				},
			},
		})({
			$actorCoin: (balanceBlock) => ({
				[EntityMetaKey.Selector]: balanceBlock.$actorCoin,
			}),
			$block: (balanceBlock) => ({
				[EntityMetaKey.Selector]: balanceBlock.$block,
			}),
			balance: (balanceBlock) => balanceBlock.balance,
		}),

		defineResolver({
			entityType: EntityType.EvmTransaction,
			resolve: {
				EvmNetworkTxHash: {
					resolve: async ({ $network, txHash: txHashSelector }) => {
						const chainId = chainIdFromEvmNetworkId($network)
						const requestedTxHash = hexLowerOfByteSize(txHashSelector, 32)
						if (requestedTxHash == null)
							throw new Error('Voltaire_JsonRpc: invalid transaction hash')
						const jsonRpcTransports = (await voltaireJsonRpcHttpTransportsByChainId())[chainId] ?? []
						if (jsonRpcTransports.length === 0)
							throw new Error(`Voltaire_JsonRpc: no JSON-RPC URL for EvmTransaction on chain ${String(chainId)}`)
						const errors: string[] = []
						const {
							jsonRpcTransaction,
							txHash,
							receipt,
							rawCallTrace,
						} = await (async () => {
							for (const jsonRpcTransport of jsonRpcTransports) {
								try {
									const voltaireTransactionWire = await jsonRpcTransport.getTransactionByHash({
										txHash: requestedTxHash,
									})
									if (voltaireTransactionWire == null)
										throw new Error('transaction not returned from RPC')
									const jsonRpcTransaction = voltaireTransactionWire
									const txHash = hexLowerOfByteSize(jsonRpcTransaction.hash, 32)
									if (txHash == null || txHash !== requestedTxHash)
										throw new Error('transaction hash does not match the requested selector')
									const receiptWire = await jsonRpcTransport.getTransactionReceipt({
										txHash,
									})
									return {
										jsonRpcTransaction,
										txHash,
										receipt: receiptWire,
										rawCallTrace: await jsonRpcTransport.debugTraceTransaction({
											txHash,
										}),
									}
								} catch (error) {
									errors.push(`${jsonRpcTransport.diagnosticLabel}: ${errorMessage(error)}`)
								}
							}
							throw allJsonRpcEndpointsFailedError(chainId, 'EvmTransaction', errors)
						})()
						const containingBlockNumber = rpcQuantityToBigInt(jsonRpcTransaction.blockNumber)
						const from = hexLowerOfByteSize(jsonRpcTransaction.from, 20)
						if (from == null)
							throw new Error('Voltaire_JsonRpc: transaction is missing from address')

						const to = (
							jsonRpcTransaction.to != null ?
								hexLowerOfByteSize(jsonRpcTransaction.to, 20)
							:
								undefined
						)
						const rpcTypeByte = rpcQuantityToNumber(jsonRpcTransaction.type)
						const envelopeType = evmTransactionEnvelopeTypeFromRpcTypeByte(rpcTypeByte)
						const evmTransactionEntityBase = {
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
							value: rpcQuantityToBigInt(jsonRpcTransaction.value) ?? 0n,
							nonce: rpcQuantityToNumber(jsonRpcTransaction.nonce),
							input: with0xHex(jsonRpcTransaction.input),
							r: with0xHex(jsonRpcTransaction.r),
							s: with0xHex(jsonRpcTransaction.s),
							...(jsonRpcTransaction.v != null && { v: jsonRpcTransaction.v }),
							gas: rpcQuantityToBigInt(jsonRpcTransaction.gas),
							gasPrice: rpcQuantityToBigInt(jsonRpcTransaction.gasPrice),
							...(
								(
								envelopeType === EvmTransactionEnvelopeType.FeeMarket
								|| envelopeType === EvmTransactionEnvelopeType.Blob
								|| envelopeType === EvmTransactionEnvelopeType.SetCode
								) && {
									maxFeePerGas: rpcQuantityToBigInt(jsonRpcTransaction.maxFeePerGas),
									maxPriorityFeePerGas: rpcQuantityToBigInt(jsonRpcTransaction.maxPriorityFeePerGas),
									maxFeePerBlobGas: rpcQuantityToBigInt(jsonRpcTransaction.maxFeePerBlobGas),
								}
							),
						}
						const createdContractAddress = (
							receipt?.contractAddress != null ?
								hexLowerOfByteSize(receipt.contractAddress, 20)
							:
								undefined
						)
						const traces = rawCallTrace == null ? [] : evmTraceEntitiesFromVoltaireCallTrace({
							call: rawCallTrace,
							$transaction: {
								$network,
								txHash,
							},
						})
						return {
							...evmTransactionEntityBase,
							envelopeType,
							kind: evmTransactionKindFromSignedFields({
								value: evmTransactionEntityBase.value,
								toAddress: to,
								input: jsonRpcTransaction.input,
								createdContractAddress,
							}),
							...(receipt == null && { executionStatus: EvmTransactionExecutionStatus.Pending }),
							...(Number(receipt?.status) === 1 && { executionStatus: EvmTransactionExecutionStatus.Success }),
							...(Number(receipt?.status) === 0 && { executionStatus: EvmTransactionExecutionStatus.Failed }),
							gasUsed: rpcQuantityToBigInt(receipt?.gasUsed),
							cumulativeGasUsed: rpcQuantityToBigInt(receipt?.cumulativeGasUsed),
							effectiveGasPrice: rpcQuantityToBigInt(receipt?.effectiveGasPrice),
							blobGasUsed: rpcQuantityToBigInt(receipt?.blobGasUsed),
							...(createdContractAddress != null && {
								$contract: {
									[EntityMetaKey.Selector]: {
										$network,
										address: createdContractAddress,
									},
								} satisfies Entity<typeof schema, EntityType.EvmContract>,
							}),
							$$logs: (
								(receipt?.logs ?? [])
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
							$$traces: traces,
							$$internalTransfers: evmInternalTransferEntitiesFromVoltaireTraces({
								$network,
								txHash,
								traces,
							}),
							$$authorizations: eip7702AuthorizationEntitiesFromVoltaireWire({
								$network,
								txHash,
								authorizationList: jsonRpcTransaction.authorizationList ?? [],
							}),
						}
					},
				}
			},
		})({
			$block: (entity) => entity.$block,
			$from: (entity) => entity.$from,
			$to: (entity) => entity.$to,
			ContractCreation: {
				$contract: (entity) => entity.$contract,
			},
			indexInBlock: (entity) => entity.indexInBlock,
			value: (entity) => entity.value,
			nonce: (entity) => entity.nonce,
			input: (entity) => entity.input,
			r: (entity) => entity.r,
			s: (entity) => entity.s,
			v: (entity) => entity.v,
			gas: (entity) => entity.gas,
			kind: (entity) => entity.kind,
			envelopeType: (entity) => entity.envelopeType,
			executionStatus: (entity) => entity.executionStatus,
			gasPrice: (entity) => entity.gasPrice,
			gasUsed: (entity) => entity.gasUsed,
			cumulativeGasUsed: (entity) => entity.cumulativeGasUsed,
			effectiveGasPrice: (entity) => entity.effectiveGasPrice,
			FeeMarket: {
				maxFeePerGas: (entity) => entity.maxFeePerGas,
				maxPriorityFeePerGas: (entity) => entity.maxPriorityFeePerGas,
			},
			Blob: {
				blobGasUsed: (entity) => entity.blobGasUsed,
				maxFeePerBlobGas: (entity) => entity.maxFeePerBlobGas,
			},
			SetCode: {
				$$authorizations: {
					select: (entity) => entity.$$authorizations.map((authorization) => ({
						[EntityMetaKey.Selector]: authorization[EntityMetaKey.Selector],
						[EntityMetaKey.Fields]: {
							[entityFieldAddressKey(EntityType.Eip7702Authorization, [], '$transaction')]: authorization.$transaction,
							[entityFieldAddressKey(EntityType.Eip7702Authorization, [], 'authorizationIndex')]: authorization.authorizationIndex,
							[entityFieldAddressKey(EntityType.Eip7702Authorization, [], 'chainId')]: authorization.chainId,
							[entityFieldAddressKey(EntityType.Eip7702Authorization, [], 'delegationAddress')]: authorization.delegationAddress,
							[entityFieldAddressKey(EntityType.Eip7702Authorization, [], 'nonce')]: authorization.nonce,
							[entityFieldAddressKey(EntityType.Eip7702Authorization, [], 'yParity')]: authorization.yParity,
							[entityFieldAddressKey(EntityType.Eip7702Authorization, [], 'r')]: authorization.r,
							[entityFieldAddressKey(EntityType.Eip7702Authorization, [], 's')]: authorization.s,
							[entityFieldAddressKey(EntityType.Eip7702Authorization, [], '$delegationContract')]: authorization.$delegationContract,
						},
					})),
					resolveCount: (entity) => entity.$$authorizations.length,
				},
			},
			$$logs: {
				select: (entity) => entity.$$logs.map((log) => ({
					[EntityMetaKey.Selector]: log[EntityMetaKey.Selector],
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.EvmLog, [], '$transaction')]: log.$transaction,
						...(log.$block != null && {
							[entityFieldAddressKey(EntityType.EvmLog, [], '$block')]: log.$block,
						}),
						[entityFieldAddressKey(EntityType.EvmLog, [], '$$topics')]: log.$$topics,
						...(log.topic0 != null && {
							[entityFieldAddressKey(EntityType.EvmLog, [], 'topic0')]: log.topic0,
						}),
						...(log.data != null && {
							[entityFieldAddressKey(EntityType.EvmLog, [], 'data')]: log.data,
						}),
						...(log.removed != null && {
							[entityFieldAddressKey(EntityType.EvmLog, [], 'removed')]: log.removed,
						}),
						...(log.$emitter != null && {
							[entityFieldAddressKey(EntityType.EvmLog, [], '$emitter')]: log.$emitter,
						}),
					},
				})),
				resolveCount: (entity) => entity.$$logs.length,
			},
			$$tokenApprovals: {
				select: (entity) => entity.$$logs.flatMap((log) => (
					log.$tokenApproval == null ?
						[]
					:
						[evmTokenApprovalReference(log.$tokenApproval)]
				)),
				resolveCount: (entity) => entity.$$logs.filter((log) => log.$tokenApproval != null).length,
			},
			$$tokenTransfers: {
				select: (entity) => entity.$$logs.flatMap((log) => log.$$tokenTransfers.map(evmTokenTransferReference)),
				resolveCount: (entity) => entity.$$logs.reduce((count, log) => count + log.$$tokenTransfers.length, 0),
			},
			$$traces: {
				select: (entity) => entity.$$traces.map(evmTraceReference),
				resolveCount: (entity) => entity.$$traces.length,
			},
			$$internalTransfers: {
				select: (entity) => entity.$$internalTransfers.map((transfer) => ({
					[EntityMetaKey.Selector]: transfer[EntityMetaKey.Selector],
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.EvmInternalTransfer, [], '$transaction')]: transfer.$transaction,
						...(transfer.$from != null && {
							[entityFieldAddressKey(EntityType.EvmInternalTransfer, [], '$from')]: transfer.$from,
						}),
						...(transfer.$to != null && {
							[entityFieldAddressKey(EntityType.EvmInternalTransfer, [], '$to')]: transfer.$to,
						}),
						[entityFieldAddressKey(EntityType.EvmInternalTransfer, [], 'value')]: transfer.value,
						[entityFieldAddressKey(EntityType.EvmInternalTransfer, [], 'callType')]: transfer.callType,
						[entityFieldAddressKey(EntityType.EvmInternalTransfer, [], 'success')]: transfer.success,
						...(transfer.$createdContract != null && {
							[entityFieldAddressKey(EntityType.EvmInternalTransfer, [], '$createdContract')]: transfer.$createdContract,
						}),
					},
				})),
				resolveCount: (entity) => entity.$$internalTransfers.length,
			},
		}),

		defineResolver({
			entityType: EntityType.Eip7702Authorization,
			resolve: {
				TransactionAuthorizationIndex: {
					resolve: async (entitySelector) => {
						const chainId = chainIdFromEvmNetworkId(entitySelector.$transaction.$network)
						const jsonRpcTransports = (await voltaireJsonRpcHttpTransportsByChainId())[chainId] ?? []
						if (jsonRpcTransports.length === 0)
							throw new Error(`Voltaire_JsonRpc: no JSON-RPC URL for Eip7702Authorization on chain ${String(chainId)}`)

						const errors: string[] = []
						for (const jsonRpcTransport of jsonRpcTransports) {
							try {
								const transaction = await jsonRpcTransport.getTransactionByHash({
									txHash: entitySelector.$transaction.txHash,
								})
								if (transaction == null)
									throw new Error('authorization transaction not returned from RPC')

								const txHash = hexLowerOfByteSize(transaction.hash, 32)
								if (txHash !== entitySelector.$transaction.txHash)
									throw new Error('authorization transaction identity does not match request')

								const authorization = eip7702AuthorizationEntitiesFromVoltaireWire({
									$network: entitySelector.$transaction.$network,
									txHash,
									authorizationList: transaction.authorizationList ?? [],
								}).at(entitySelector.authorizationIndex)
								if (authorization == null)
									throw new Error('authorization index is missing from transaction')

								return authorization
							} catch (error) {
								errors.push(`${jsonRpcTransport.diagnosticLabel}: ${errorMessage(error)}`)
							}
						}
						throw allJsonRpcEndpointsFailedError(chainId, 'Eip7702Authorization', errors)
					},
				},
			},
		})({
			$transaction: (authorization) => authorization.$transaction,
			authorizationIndex: (authorization) => authorization.authorizationIndex,
			chainId: (authorization) => authorization.chainId,
			delegationAddress: (authorization) => authorization.delegationAddress,
			nonce: (authorization) => authorization.nonce,
			yParity: (authorization) => authorization.yParity,
			r: (authorization) => authorization.r,
			s: (authorization) => authorization.s,
			$delegationContract: (authorization) => authorization.$delegationContract,
		}),

		defineResolver({
			entityType: EntityType.EvmInternalTransfer,
			resolve: {
				TransactionIndexInTransaction: {
					resolve: async (entitySelector) => {
						const chainId = chainIdFromEvmNetworkId(entitySelector.$transaction.$network)
						const txHash = hexLowerOfByteSize(entitySelector.$transaction.txHash, 32)
						if (txHash == null)
							throw new Error('Voltaire_JsonRpc: invalid internal transfer transaction hash')

						const jsonRpcTransports = (await voltaireJsonRpcHttpTransportsByChainId())[chainId] ?? []
						if (jsonRpcTransports.length === 0)
							throw new Error(`Voltaire_JsonRpc: no JSON-RPC URL for EvmInternalTransfer on chain ${String(chainId)}`)

						const errors: string[] = []
						for (const jsonRpcTransport of jsonRpcTransports) {
							try {
								const rawCallTrace = await jsonRpcTransport.debugTraceTransaction({ txHash })
								if (rawCallTrace == null)
									throw new Error('transaction call trace not returned from RPC')

								const transfer = evmInternalTransferEntitiesFromVoltaireTraces({
									$network: entitySelector.$transaction.$network,
									txHash,
									traces: evmTraceEntitiesFromVoltaireCallTrace({
										call: rawCallTrace,
										$transaction: entitySelector.$transaction,
									}),
								}).find((candidate) => (
									candidate[EntityMetaKey.Selector].indexInTransaction === entitySelector.indexInTransaction
								))
								if (transfer == null)
									throw new Error('internal transfer index is missing from transaction trace')

								return transfer
							} catch (error) {
								errors.push(`${jsonRpcTransport.diagnosticLabel}: ${errorMessage(error)}`)
							}
						}
						throw allJsonRpcEndpointsFailedError(chainId, 'EvmInternalTransfer', errors)
					},
				},
			},
		})({
			$transaction: (transfer) => transfer.$transaction,
			indexInTransaction: (transfer) => transfer[EntityMetaKey.Selector].indexInTransaction,
			$from: (transfer) => transfer.$from,
			$to: (transfer) => transfer.$to,
			value: (transfer) => transfer.value,
			callType: (transfer) => transfer.callType,
			success: (transfer) => transfer.success,
			$createdContract: (transfer) => transfer.$createdContract,
		}),

		defineResolver({
			entityType: EntityType.EvmTrace,
			resolve: {
				TransactionTraceAddress: {
					resolve: async ({ $transaction, traceAddress }) => {
						const chainId = chainIdFromEvmNetworkId($transaction.$network)
						const txHash = hexLowerOfByteSize($transaction.txHash, 32)
						if (txHash == null)
							throw new Error('Voltaire_JsonRpc: invalid trace transaction hash')

						const jsonRpcTransports = (await voltaireJsonRpcHttpTransportsByChainId())[chainId] ?? []
						if (jsonRpcTransports.length === 0)
							throw new Error(`Voltaire_JsonRpc: no JSON-RPC URL for EvmTrace on chain ${String(chainId)}`)

						const errors: string[] = []
						for (const jsonRpcTransport of jsonRpcTransports) {
							try {
								const rawCallTrace = await jsonRpcTransport.debugTraceTransaction({ txHash })
								if (rawCallTrace == null)
									throw new Error('transaction call trace not returned from RPC')

								const trace = evmTraceEntitiesFromVoltaireCallTrace({
									call: rawCallTrace,
									$transaction,
								}).find((candidate) => candidate.traceAddress === traceAddress)
								if (trace == null)
									throw new Error('Voltaire_JsonRpc: trace not found for EvmTrace')

								return trace
							} catch (error) {
								errors.push(`${jsonRpcTransport.diagnosticLabel}: ${errorMessage(error)}`)
							}
						}
						throw allJsonRpcEndpointsFailedError(chainId, 'EvmTrace', errors)
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
			entityType: EntityType.EvmLog,
			resolve: {
				TransactionIndexInTransaction: {
					resolve: async ({ $transaction, indexInTransaction }) => {
						const chainId = chainIdFromEvmNetworkId($transaction.$network)
						const txHash = hexLowerOfByteSize($transaction.txHash, 32)
						if (txHash == null)
							throw new Error('Voltaire_JsonRpc: invalid log transaction hash')
						const jsonRpcTransports = (await voltaireJsonRpcHttpTransportsByChainId())[chainId] ?? []
						if (jsonRpcTransports.length === 0)
							throw new Error(`Voltaire_JsonRpc: no JSON-RPC URL for EvmLog on chain ${String(chainId)}`)
						const errors: string[] = []
						for (const jsonRpcTransport of jsonRpcTransports) {
							try {
								const receiptWire = await jsonRpcTransport.getTransactionReceipt({
									txHash,
								})
								const log = findReceiptLogWireForEvmLogId(
									receiptWire?.logs,
									indexInTransaction
								)
								if (log == null)
									throw new Error('receipt log not found')
								return evmLogEntityFromIdAndWire({ $transaction, indexInTransaction }, log)
							} catch (error) {
								errors.push(`${jsonRpcTransport.diagnosticLabel}: ${errorMessage(error)}`)
							}
						}
						throw allJsonRpcEndpointsFailedError(chainId, 'EvmLog', errors)
					},
				}
			},
		})({
			$$topics: {
				select: (entity) => entity.$$topics.map((topic) => ({
					[EntityMetaKey.Selector]: topic[EntityMetaKey.Selector],
				})),
				resolveCount: (entity) => entity.$$topics.length,
			},
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
						throw new Error('Voltaire_JsonRpc: event log missing signature topic')

					return entity.topic0
				},
				TokenApproval: {
					$tokenApproval: (entity) => {
						if (entity.$tokenApproval == null)
							throw new Error('Voltaire_JsonRpc: approval event has invalid topics or data')

						return entity.$tokenApproval
					},
				},
				TokenTransfer: {
					$$tokenTransfers: (entity) => entity.$$tokenTransfers.map(evmTokenTransferReference),
				},
			},
		}),
		defineResolver({
			entityType: EntityType.EvmTokenApproval,
			resolve: {
				Log: {
					resolve: async ({ $log }) => {
						const chainId = chainIdFromEvmNetworkId($log.$transaction.$network)
						const jsonRpcTransports = (await voltaireJsonRpcHttpTransportsByChainId())[chainId] ?? []
						if (jsonRpcTransports.length === 0)
							throw new Error(`Voltaire_JsonRpc: no JSON-RPC URL for EvmTokenApproval on chain ${String(chainId)}`)

						const errors: string[] = []
						for (const jsonRpcTransport of jsonRpcTransports) {
							try {
								const receiptWire = await jsonRpcTransport.getTransactionReceipt({
									txHash: $log.$transaction.txHash,
								})
								const log = findReceiptLogWireForEvmLogId(
									receiptWire?.logs,
									$log.indexInTransaction
								)
								if (log == null)
									throw new Error('receipt log not found')

								const approval = evmLogEntityFromIdAndWire($log, log).$tokenApproval
								if (approval == null)
									throw new Error('receipt log is not an exact token approval')

								return approval
							} catch (error) {
								errors.push(`${jsonRpcTransport.diagnosticLabel}: ${errorMessage(error)}`)
							}
						}
						throw allJsonRpcEndpointsFailedError(chainId, 'EvmTokenApproval', errors)
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
			entityType: EntityType.EvmTokenTransfer,
			resolve: {
				LogIndexInLog: {
					resolve: async ({ $log, indexInLog }) => {
						const chainId = chainIdFromEvmNetworkId($log.$transaction.$network)
						const jsonRpcTransports = (await voltaireJsonRpcHttpTransportsByChainId())[chainId] ?? []
						if (jsonRpcTransports.length === 0)
							throw new Error(`Voltaire_JsonRpc: no JSON-RPC URL for EvmTokenTransfer on chain ${String(chainId)}`)

						const errors: string[] = []
						for (const jsonRpcTransport of jsonRpcTransports) {
							try {
								const receiptWire = await jsonRpcTransport.getTransactionReceipt({
									txHash: $log.$transaction.txHash,
								})
								const log = findReceiptLogWireForEvmLogId(
									receiptWire?.logs,
									$log.indexInTransaction
								)
								if (log == null)
									throw new Error('receipt log not found')

								const transfer = evmLogEntityFromIdAndWire($log, log).$$tokenTransfers.at(indexInLog)
								if (transfer == null)
									throw new Error('Voltaire_JsonRpc: receipt log is not an exact token transfer')

								return transfer
							} catch (error) {
								errors.push(`${jsonRpcTransport.diagnosticLabel}: ${errorMessage(error)}`)
							}
						}
						throw allJsonRpcEndpointsFailedError(chainId, 'EvmTokenTransfer', errors)
					},
				},
			},
		})({
			$log: (transfer) => transfer.$log,
			standard: (transfer) => transfer.standard,
			indexInLog: (transfer) => transfer[EntityMetaKey.Selector].indexInLog,
			$from: (transfer) => transfer.$from,
			$to: (transfer) => transfer.$to,
			$tokenContract: (transfer) => transfer.$tokenContract,
			$coinInstance: (transfer) => transfer.$coinInstance,
			amount: (transfer) => transfer.amount,
			Nft: {
				tokenId: (transfer) => {
					if (transfer.tokenId == null)
						throw new Error('Voltaire_JsonRpc: NFT transfer is missing token id')

					return transfer.tokenId
				},
			},
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async () => ({}),
				},
			},
			resolveLive: {
				// @ts-expect-error Eight valid generated Network.Evm fields exceed TypeScript's union instantiation depth; publishes and start are checked locally below.
				blockStream: {
					facetPath: [
						'Evm',
					],
					publishes: {
						'$$timestamps': true,
						'$$blocks': true,
						'$$transactions': true,
						'$$gasFeeBlocks': true,
						'$$contracts': true,
						'$$blobs': true,
						'$$beaconEpochs': true,
						'$$beaconSlots': true,
					} satisfies Record<EvmNetworkLiveFieldName, true>,
					start: (ctx: EvmNetworkLiveContext) => {
						const {
							fields,
							parentEntitySelector,
							signal,
						} = ctx
						const refreshedAfterBlockFields = [
							'$$contracts',
							'$$blobs',
							'$$gasFeeBlocks',
						] as const
						const reorgDependentFields = [
							...refreshedAfterBlockFields,
							'$$beaconEpochs',
							'$$beaconSlots',
						] as const
						const backstop = setInterval(
							() => { void fields.invalidate(reorgDependentFields) },
							30_000
						)
						const clear = () => clearInterval(backstop)
						signal.addEventListener('abort', clear, { once: true })

						void (async () => {
							const candidateTransports = (
								(await voltaireJsonRpcProviderTransportsByChainId())[
									chainIdFromEvmNetworkId(parentEntitySelector)
								] ?? []
							)
							if (candidateTransports.length === 0) {
								clear()
								return
							}

							const waitBeforeRetry = (ms: number) => (
								new Promise<void>((resolve) => {
									const timeout = setTimeout(resolve, ms)
									signal.addEventListener(
										'abort',
										() => {
											clearTimeout(timeout)
											resolve()
										},
										{ once: true }
									)
								})
							)
							const chainId = chainIdFromEvmNetworkId(parentEntitySelector)
							const publishRecentBlocks = (recentBlocks: readonly EvmNetworkRecentBlock[]) => {
								signal.throwIfAborted()
								fields.$$blocks.replaceRows([{
									source: Source.Voltaire_JsonRpc,
									value: recentBlocks.map(evmNetworkBlockReferenceFromFields),
								}])
								fields.$$transactions.replaceRows([{
									source: Source.Voltaire_JsonRpc,
									value: evmNetworkTransactionReferencesFromRecentBlocks(chainId, recentBlocks),
								}])
							}
							const publishHead = (head: bigint) => {
								signal.throwIfAborted()
								fields.$$timestamps.replaceRows([{
									source: Source.Voltaire_JsonRpc,
									value: [{
										[EntityMetaKey.Selector]: {
											$network: parentEntitySelector,
											timestampMs: Date.now(),
											source: Source.Voltaire_JsonRpc,
										},
										[EntityMetaKey.Fields]: {
											[entityFieldAddressKey(EntityType.EvmNetwork_Timestamp, [], 'blockHeight')]: head,
										},
									}],
								}])
								fields.$$blocks.count.replaceRows([{
									source: Source.Voltaire_JsonRpc,
									value: Number(head) + 1,
								}])
							}
							const readRecentBlocksForTransport = async (
								jsonRpcTransport: (typeof candidateTransports)[number],
								recentBlockDepth = 8
							) => {
								const { head, blockNumbers, wires } = await jsonRpcTransport.getRecentBlockWires({
									recentBlockDepth,
								})
								signal.throwIfAborted()
								const recentBlocks = evmNetworkRecentBlocksFromBlockWires({
									chainId,
									blockNumbers,
									wires,
								})
								if (recentBlocks[0]?.$block.blockNumber !== head)
									throw new Error('Voltaire_JsonRpc: recent block window head does not match the reported chain head')
								return recentBlocks
							}

							while (!signal.aborted) {
								for (const jsonRpcTransport of candidateTransports) {
									let initialized = false
									try {
									let recentBlocks = await readRecentBlocksForTransport(jsonRpcTransport)
									let currentHead = recentBlocks[0]!.$block.blockNumber
									publishRecentBlocks(recentBlocks)
									publishHead(currentHead)
										initialized = true
										for await (const event of jsonRpcTransport.iterateBlockStreamEvents({
											include: 'header',
											signal,
											fromBlock: currentHead,
											maxQueuedBlocks: 16,
											pollingInterval: 1_000,
											retry: {
												initialDelay: 1_000,
												maxDelay: 10_000,
												maxRetries: 5,
											},
										})) {
										if (event.type !== 'reorg' && event.metadata.chainHead <= currentHead)
											continue

									try {
											recentBlocks = evmNetworkRecentBlocksAfterStreamEvent(chainId, recentBlocks, event)
										} catch {
											// Only a gap or a reorg deeper than the retained window needs a bounded resync.
											recentBlocks = await readRecentBlocksForTransport(jsonRpcTransport)
										}
										signal.throwIfAborted()
										currentHead = recentBlocks[0]!.$block.blockNumber
										if (currentHead !== event.metadata.chainHead)
											throw new Error('Voltaire_JsonRpc: canonical window does not match the stream head')
										publishRecentBlocks(recentBlocks)
										publishHead(currentHead)

									const incomingCount = event.type === 'reorg' ? event.added.length : event.blocks.length
									if (incomingCount > 0) {
										await fields.invalidate(
											event.type === 'reorg' ? reorgDependentFields : refreshedAfterBlockFields
										)
									}
										}
										await waitBeforeRetry(1_000)
										break
									} catch (error) {
										if (signal.aborted) break
										console.warn('Voltaire: block stream ended', {
											error,
											transport: jsonRpcTransport.diagnosticLabel,
										})
										await waitBeforeRetry(1_000)
										if (initialized)
											break
									}
								}
							}
						})().catch((error: unknown) => {
							clear()
							if (!signal.aborted)
								console.warn('Voltaire: block stream initialization failed', { error })
						})
						return clear
					},
				},
			},
		})({
			Evm: {
				'$$timestamps': {},
				'$$blocks': {},
				'$$transactions': {},
				'$$gasFeeBlocks': {},
				'$$contracts': {},
				'$$blobs': {},
				'$$beaconEpochs': {},
				'$$beaconSlots': {},
			},
		}),

		defineResolver({
			entityType: EntityType.EvmAccount,
			resolve: {
				AddressInteropAddress: {
					resolve: async ({ address }) => {
						const { normalizeEnsName } = await import('$/sources/Voltaire/JsonRpc/ens.ts')
						const chainId = ChainId.Ethereum
						const jsonRpcTransports = (await voltaireJsonRpcHttpTransportsByChainId())[chainId] ?? []
						if (jsonRpcTransports.length === 0)
							throw new Error('Voltaire_JsonRpc: no JSON-RPC URL for EvmAccount.$primaryName')
						const errors: string[] = []
						for (const jsonRpcTransport of jsonRpcTransports) {
							try {
								const ensNameFromReverseLookup = await jsonRpcTransport.resolveEnsReverse({
									address,
								})
								if (ensNameFromReverseLookup == null)
									return undefined
								return {
									[EntityMetaKey.Selector]: {
										name: normalizeEnsName(ensNameFromReverseLookup),
									},
								} satisfies Entity<typeof schema, EntityType.EnsName>
							} catch (error) {
								errors.push(`${jsonRpcTransport.diagnosticLabel}: ${errorMessage(error)}`)
							}
						}
						throw allJsonRpcEndpointsFailedError(chainId, 'EvmAccount.$primaryName', errors)
					},
				}
			},
		})({
			$primaryName: (entity) => entity,
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async ({ caip2 }, context) => {
						const chainId = chainIdFromEvmNetworkId({ caip2 })
						const configuredJsonRpcTransports = (
							(await voltaireJsonRpcHttpTransportsByChainId())[chainId] ?? []
						)
						if (configuredJsonRpcTransports.length === 0)
							throw new Error(`Voltaire_JsonRpc: no JSON-RPC URL for Network.$$endpointObservations on chain ${String(chainId)}`)

						const jsonRpcTransports = configuredJsonRpcTransports.slice(
							context.pagination.offset ?? 0,
							(context.pagination.offset ?? 0) + resolverContextRowLimit(context)
						)
						if (jsonRpcTransports.length === 0)
							return []

						const observations = []
						const errors: string[] = []
						for (const jsonRpcTransport of jsonRpcTransports) {
							try {
								const observation = await jsonRpcTransport.getPeerCountObservation()
								observations.push({
									[EntityMetaKey.Selector]: {
										$network: { caip2 },
										endpointUrl: jsonRpcTransport.origin,
										endpointKind: ApiFamily.EvmExecutionJsonRpc,
										timestampMs: observation.providerClockMs,
										source: Source.Voltaire_JsonRpc,
									},
									[EntityMetaKey.Fields]: {
										[entityFieldAddressKey(EntityType.NetworkEndpointObservation_Timestamp, ['Execution'], 'peerCount')]: BigInt(observation.peerCount),
									},
								})
							} catch (error) {
								errors.push(`${jsonRpcTransport.diagnosticLabel}: ${errorMessage(error)}`)
							}
						}
						if (observations.length === 0)
							throw allJsonRpcEndpointsFailedError(chainId, '$$endpointObservations', errors)

						return observations
					},
				},
			},
		})({
			$$endpointObservations: (network) => network,
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async ({ caip2 }) => {
						const jsonRpcTransports = (await voltaireJsonRpcHttpTransportsByChainId())[chainIdFromEvmNetworkId({ caip2 })] ?? []
						if (jsonRpcTransports.length === 0) throw new Error(`Voltaire_JsonRpc: no JSON-RPC URL for Network.$$timestamps on chain ${String(chainIdFromEvmNetworkId({ caip2 }))}`)
						const errors: string[] = []
						for (const jsonRpcTransport of jsonRpcTransports) {
							try {
								return [{
									[EntityMetaKey.Selector]: {
										$network: { caip2 },
										timestampMs: Date.now(),
										source: Source.Voltaire_JsonRpc,
									},
									[EntityMetaKey.Fields]: {
										[entityFieldAddressKey(EntityType.EvmNetwork_Timestamp, [], 'blockHeight')]: await jsonRpcTransport.getBlockNumber(),
									},
								}]
							} catch (error) {
								errors.push(`${jsonRpcTransport.diagnosticLabel}: ${errorMessage(error)}`)
							}
						}
						throw allJsonRpcEndpointsFailedError(chainIdFromEvmNetworkId({ caip2 }), '$$timestamps', errors)
					}
				},
			},
		})({
			Evm: {
				$$timestamps: (entity) => entity,
			},
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async ({ caip2 }, context) => {
						const blockCount = Math.min(
							32,
							Math.max(1, resolverContextRowLimit(context))
						)
						const jsonRpcTransports = (await voltaireJsonRpcHttpTransportsByChainId())[chainIdFromEvmNetworkId({ caip2 })] ?? []
						if (jsonRpcTransports.length === 0) throw new Error(`Voltaire_JsonRpc: no JSON-RPC URL for Network.$$gasFeeBlocks on chain ${String(chainIdFromEvmNetworkId({ caip2 }))}`)
						const errors: string[] = []
						for (const jsonRpcTransport of jsonRpcTransports) {
							try {
								const feeHistory = await jsonRpcTransport.getFeeHistory({
									blockCount,
									newestBlock: 'latest',
									rewardPercentiles: [50],
								})
								return networkGasFeeBlockRefsFromFeeHistory({ caip2 }, feeHistory)
							} catch (error) {
								errors.push(`${jsonRpcTransport.diagnosticLabel}: ${errorMessage(error)}`)
							}
						}
						throw allJsonRpcEndpointsFailedError(chainIdFromEvmNetworkId({ caip2 }), '$$gasFeeBlocks', errors)
					},
				}
			},
		})({
			Evm: {
				$$gasFeeBlocks: (entity) => entity,
			},
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async ({ caip2 }) => {
						const jsonRpcTransports = (await voltaireJsonRpcTxpoolTransportsByChainId())[chainIdFromEvmNetworkId({ caip2 })] ?? []
						for (const jsonRpcTransport of jsonRpcTransports) {
							try {
								const status = await jsonRpcTransport.getTxpoolStatus()
								return [
									{
										[EntityMetaKey.Selector]: {
											$network: { caip2 },
											timestampMs: Date.now(),
											source: Source.Voltaire_JsonRpc,
										},
										[EntityMetaKey.Fields]: {
											[entityFieldAddressKey(EntityType.EvmNetwork_Txpool_Timestamp, [], 'pendingCount')]: txpoolCountFromHex('pending', status.pending),
											[entityFieldAddressKey(EntityType.EvmNetwork_Txpool_Timestamp, [], 'queuedCount')]: txpoolCountFromHex('queued', status.queued),
										},
									},
								]
							} catch {
								continue
							}
						}
						return []
					},
				},
			},
		})({
			Evm: {
				$$txpoolTimestamps: (entity) => entity,
			},
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async ({ caip2 }, context) => {
						const subsetRowLimit = resolverContextRowLimit(context)
						const chainId = chainIdFromEvmNetworkId({ caip2 })
						const jsonRpcTransports = (await voltaireJsonRpcHttpTransportsByChainId())[chainId] ?? []
						if (jsonRpcTransports.length === 0) throw new Error('Voltaire_JsonRpc: no JSON-RPC URL')
						const errors: string[] = []
						for (const jsonRpcTransport of jsonRpcTransports) {
							try {
								const { blockNumbers, wires } = await jsonRpcTransport.getRecentBlockWires({
									recentBlockDepth: subsetRowLimit,
								})
								return evmNetworkRecentBlocksFromBlockWires({
									chainId,
									blockNumbers,
									wires,
								}).map(evmNetworkBlockReferenceFromFields)
							} catch (error) {
								errors.push(`${jsonRpcTransport.diagnosticLabel}: ${errorMessage(error)}`)
							}
						}
						throw allJsonRpcEndpointsFailedError(chainId, '$$blocks', errors)
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
					resolve: async ({ caip2 }) => {
						const chainId = chainIdFromEvmNetworkId({ caip2 })
						const jsonRpcTransports = (await voltaireJsonRpcHttpTransportsByChainId())[chainId] ?? []
						if (jsonRpcTransports.length === 0)
							throw new Error(`Voltaire_JsonRpc: no JSON-RPC URL for Network.$$transactions on chain ${String(chainId)}`)

						const errors: string[] = []
						for (const jsonRpcTransport of jsonRpcTransports) {
							try {
								const { blockNumbers, wires } = await jsonRpcTransport.getRecentBlockWires({
									recentBlockDepth: 8,
								})
								const recentBlocks = evmNetworkRecentBlocksFromBlockWires({
									chainId,
									blockNumbers,
									wires,
								})
								return evmNetworkTransactionReferencesFromRecentBlocks(chainId, recentBlocks)
							} catch (error) {
								errors.push(`${jsonRpcTransport.diagnosticLabel}: ${errorMessage(error)}`)
							}
						}
						throw allJsonRpcEndpointsFailedError(chainId, '$$transactions', errors)
					},
				},
			},
		})({
			Evm: {
				$$transactions: (entity) => entity,
			},
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async ({ caip2 }) => {
						const chainId = chainIdFromEvmNetworkId({ caip2 })
						const jsonRpcTransports = (await voltaireJsonRpcHttpTransportsByChainId())[chainId] ?? []
						if (jsonRpcTransports.length === 0) throw new Error('Voltaire_JsonRpc: no JSON-RPC URL')
						const errors: string[] = []
						for (const jsonRpcTransport of jsonRpcTransports) {
							try {
								return Number(await jsonRpcTransport.getBlockNumber()) + 1
							} catch (error) {
								errors.push(`${jsonRpcTransport.diagnosticLabel}: ${errorMessage(error)}`)
							}
						}
						throw allJsonRpcEndpointsFailedError(chainId, '$$blocks count', errors)
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
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async ({ caip2 }, context) => {
						const subsetRowLimit = resolverContextRowLimit(context)
						const chainId = chainIdFromEvmNetworkId({ caip2 })
						const jsonRpcTransports = (await voltaireJsonRpcTransportsByChainId())[chainId] ?? []
						if (jsonRpcTransports.length === 0)
							throw new Error(`Voltaire_JsonRpc: no JSON-RPC URL for Network.$$blobs on chain ${String(chainId)}`)

						const depth = Math.min(Math.max(1, subsetRowLimit), 2)
						const errors: string[] = []
						for (const jsonRpcTransport of jsonRpcTransports) {
							try {
								const head = await jsonRpcTransport.getBlockNumber()
								const evmBlobs = []
								for (
									const blockNumber of Array.from(
										{ length: depth },
										(_, index) => head - BigInt(index)
									).filter((number) => number >= 0n)
								) {
									const wire = await jsonRpcTransport.getBlockByNumber({
											blockNumber,
											txObjects: true,
										})
									if (wire != null)
										evmBlobs.push(
											...evmBlobEntitiesFromVoltaireBlockWire(
												chainId,
												blockNumber,
												wire
											)
										)
								}
								return evmBlobs
							} catch (error) {
								errors.push(`${jsonRpcTransport.diagnosticLabel}: ${errorMessage(error)}`)
							}
						}
						throw allJsonRpcEndpointsFailedError(chainId, '$$blobs', errors)
					},
				},
			},
		})({
			Evm: {
				$$blobs: (entity) => entity,
			},
		}),

		defineResolver({
			entityType: EntityType.EvmTransaction,
			resolve: {
				EvmNetworkTxHash: {
					resolve: async ({ $network, txHash }) => {
						const chainId = chainIdFromEvmNetworkId($network)
						const normalizedTxHash = hexLowerOfByteSize(txHash, 32)
						if (normalizedTxHash == null)
							throw new Error('Voltaire_JsonRpc: invalid transaction hash for blobs')
						const jsonRpcTransports = (await voltaireJsonRpcHttpTransportsByChainId())[chainId] ?? []
						if (jsonRpcTransports.length === 0)
							throw new Error(`Voltaire_JsonRpc: no JSON-RPC URL for EvmTransaction.$$blobs on chain ${String(chainId)}`)
						const errors: string[] = []
						for (const jsonRpcTransport of jsonRpcTransports) {
							try {
								const tx = await jsonRpcTransport.getTransactionByHash({
									txHash: normalizedTxHash,
								})
								if (tx == null)
									throw new Error('transaction not found')
								return evmBlobEntityRefsFromVoltaireTx({
									$network,
									txHash: normalizedTxHash,
									blobVersionedHashes: tx.blobVersionedHashes,
									blockNumber: nonNegativeBigIntFromHex(tx.blockNumber),
								})
							} catch (error) {
								errors.push(`${jsonRpcTransport.diagnosticLabel}: ${errorMessage(error)}`)
							}
						}
						throw allJsonRpcEndpointsFailedError(chainId, 'EvmTransaction.$$blobs', errors)
					},
				},
			},
		})({
			Blob: {
				$$blobs: (entity) => entity,
			},
		}),

		defineResolver({
			entityType: EntityType.EvmAccount,
			resolve: {
				AddressInteropAddress: {
					resolve: async ({ address }) => {
						const { normalizeEnsName } = await import('$/sources/Voltaire/JsonRpc/ens.ts')
						const chainId = ChainId.Ethereum
						for (const jsonRpcTransport of (
							(await voltaireJsonRpcHttpTransportsByChainId())[chainId] ?? []
						)) {
							try {
								const ensNameFromReverseLookup = await jsonRpcTransport.resolveEnsReverse({
									address,
								})
								if (ensNameFromReverseLookup == null)
									return {}
								const { textRecords } = await jsonRpcTransport.resolveEnsForward({
									name: normalizeEnsName(ensNameFromReverseLookup),
									textKeys: ['avatar'],
									coinTypeIds: [],
									dnsRecordKeys: [],
									zonehash: false,
									resolverAbi: false,
									resolverPubkey: false,
								})
								const avatarUrl = ((raw) => (
									raw.length === 0 ?
										undefined
									:
										resolveMediaUrlTransport(raw)?.url
								))(String(textRecords.avatar))
								return {
									...(avatarUrl != null && { avatarUrl }),
									...((avatar) => (
										avatar != null && { $avatar: avatar }
									))(mediaFromUrl(avatarUrl, MediaType.Image)),
								}
							} catch {
								continue
							}
						}
						return {}
					},
				}
			},
		})({
			$avatar: (entity) => entity.$avatar,
			avatarUrl: (entity) => entity.avatarUrl,
		}),

		defineResolver({
			entityType: EntityType.EvmContract,
			resolve: {
				EvmNetworkAddress: {
					resolve: async ({ $network, address }, context) => {
						const chainId = chainIdFromEvmNetworkId($network)
						const jsonRpcTransports = (await voltaireJsonRpcTransportsByChainId())[chainId] ?? []
						if (jsonRpcTransports.length === 0)
							throw new Error(`Voltaire_JsonRpc: no JSON-RPC URL for EvmContract.storageSlotReads on chain ${String(chainId)}`)
						const depth = Math.min(32, Math.max(1, resolverContextRowLimit(context)))
						const errors: string[] = []
						for (const jsonRpcTransport of jsonRpcTransports) {
							try {
								return await evmContractStorageSlotReadsFromEthGetStorageAt({
									address,
									depth,
									getStorageAt: (slotQuantityHex) => (
										jsonRpcTransport.getStorageAt({
											address,
											slotQuantityHex,
											blockTag: 'latest',
										})
									),
								})
							} catch (error) {
								errors.push(`${jsonRpcTransport.diagnosticLabel}: ${errorMessage(error)}`)
							}
						}
						throw allJsonRpcEndpointsFailedError(chainId, 'EvmContract.storageSlotReads', errors)
					},
				}
			},
		})({
			storageSlotReads: (entity) => entity,
		}),

		defineResolver({
			entityType: EntityType.EvmContract,
			resolve: {
				EvmNetworkAddress: {
					resolve: async ({ $network, address }, context) => {
						const chainId = chainIdFromEvmNetworkId($network)
						const tipClock = await voltaireTipBlockObservationClock(
							chainId,
							'EvmContract.$$storageReads'
						)
						const depth = Math.min(32, Math.max(1, resolverContextRowLimit(context)))
						return (
							await evmContractStorageSlotReadsFromEthGetStorageAt({
								address,
								depth,
								getStorageAt: (slotQuantityHex) => (
									tipClock.jsonRpcTransport.getStorageAt({
										address,
										slotQuantityHex,
										blockTag: `0x${tipClock.blockNumber.toString(16)}`,
									})
								),
							})
						).map(({ slot, value }) => ({
							[EntityMetaKey.Selector]: {
								$contract: {
									$network,
									address,
								},
								slot,
								timestampMs: tipClock.timestampMs,
								source: Source.Voltaire_JsonRpc,
							},
							[EntityMetaKey.Fields]: {
								[entityFieldAddressKey(EntityType.EvmStorageRead_Timestamp, [], 'value')]: value,
								[entityFieldAddressKey(EntityType.EvmStorageRead_Timestamp, [], 'blockNumber')]: tipClock.blockNumber,
							},
						}))
					},
				}
			},
		})({
			$$storageReads: (entity) => entity,
		}),

		defineResolver({
			entityType: EntityType.EvmContract,
			resolve: {
				EvmNetworkAddress: {
					resolve: async ({ $network, address }) => {
						const chainId = chainIdFromEvmNetworkId($network)
						const jsonRpcTransports = (await voltaireJsonRpcHttpTransportsByChainId())[chainId] ?? []
						if (jsonRpcTransports.length === 0)
							throw new Error(`Voltaire_JsonRpc: no JSON-RPC URL for EvmContract.code on chain ${String(chainId)}`)
						const errors: string[] = []
						for (const jsonRpcTransport of jsonRpcTransports) {
							try {
								const codeHex = await jsonRpcTransport.getCode({
									address,
									blockTag: 'latest',
								})
								return {
									code: evmContractRuntimeCodeFromGetCodeHex(codeHex),
									codeHash: evmContractBytecodeHashFromGetCodeHex(codeHex),
								}
							} catch (error) {
								errors.push(`${jsonRpcTransport.diagnosticLabel}: ${errorMessage(error)}`)
							}
						}
						throw allJsonRpcEndpointsFailedError(chainId, 'EvmContract.code/codeHash', errors)
					},
				}
			},
		})({
			code: (snapshot) => snapshot.code,
			codeHash: (snapshot) => snapshot.codeHash,
		}),

		...uniswapV3Resolvers,
		...erc4626Resolvers,
	],
}
