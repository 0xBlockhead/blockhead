import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import { EvmTokenStandard } from '$/constants/EvmTokenTransfer.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import type { Entity, EntityId } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { CoinInstanceType } from '$/schema/CoinInstance.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { evmLogIndexFromWire } from '$/resolvers/_evmLog.ts'
import type { BlockscoutTokenTransferWire } from '$/sources/Blockscout/Rest/types.ts'
import type { RpcLogWire } from '$/sources/Evm/JsonRpc/types.ts'

const ERC20_TRANSFER_TOPIC = (
	'0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
)
const ERC1155_TRANSFER_SINGLE_TOPIC = (
	'0xc3d58168c5ae7397731d063d5bbf431dada86e602'
)
const ERC1155_TRANSFER_BATCH_TOPIC = (
	'0x4a39dc06d4c0ebdb8888df8e6bc6fdc36c4c5e1d'
)

const blockscoutQuantityToBigInt = (
	raw: string | undefined,
): bigint | undefined => (
	raw == null || raw === '' ?
		undefined
	:	((value) => (
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

const blockscoutLogIndexFromWire = (
	raw: string | number | undefined,
): number | undefined => (
	raw == null ?
		undefined
	:	((parsed) => (
			Number.isFinite(parsed) && Number.isInteger(parsed) && parsed >= 0 ?
				parsed
			:	undefined
		))(
			typeof raw === 'number' ?
				raw
			:
				raw.startsWith('0x') || raw.startsWith('0X') ?
					Number.parseInt(raw, 16)
				:
					Number(raw),
		)
)

const evmRpcQuantityToBigInt = (
	raw: string | undefined,
): bigint | undefined => (
	raw == null || raw === '' ?
		undefined
	:	((value) => (
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

const topicToAddress = (
	topic: string | undefined,
): `0x${string}` | undefined => (
	topic == null ?
		undefined
	:
		hexLowerOfByteSize(topic, 20)
)

const evmTokenStandardFromBlockscoutWire = (
	wire: BlockscoutTokenTransferWire,
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
	...(tokenDecimals != null && Number.isFinite(tokenDecimals) && {
		tokenDecimals,
	}),
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

export const evmTokenTransferEntityFromWire = ({
	$network,
	txHash,
	wire,
}: {
	$network: { chainId: number }
	txHash: `0x${string}`
	wire: BlockscoutTokenTransferWire
}): Entity<typeof schema, EntityType.EvmTokenTransfer> | undefined => {
	const normalizedTxHash = hexLowerOfByteSize(txHash, 32)
	const logIndex = blockscoutLogIndexFromWire(wire.log_index)
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

const evmTokenTransferEntitiesFromRpcLog = ({
	$network,
	txHash,
	log,
}: {
	$network: { chainId: number }
	txHash: `0x${string}`
	log: RpcLogWire
}): Entity<typeof schema, EntityType.EvmTokenTransfer>[] => {
	const normalizedTxHash = hexLowerOfByteSize(txHash, 32)
	const baseLogIndex = evmLogIndexFromWire(log.logIndex)
	const tokenAddress = hexLowerOfByteSize(log.address ?? '', 20)
	const topic0 = log.topics?.[0]?.toLowerCase()
	if (normalizedTxHash == null || baseLogIndex == null || tokenAddress == null || topic0 == null) {
		return []
	}
	if (topic0 === ERC20_TRANSFER_TOPIC.toLowerCase()) {
		const standard = (log.topics?.length ?? 0) >= 4 ?
			EvmTokenStandard.Erc721
		:
			EvmTokenStandard.Erc20
		const fromAddress = topicToAddress(log.topics?.[1])
		const toAddress = topicToAddress(log.topics?.[2])
		const tokenId = (
			standard === EvmTokenStandard.Erc721 ?
				evmRpcQuantityToBigInt(log.topics?.[3])
			:
				undefined
		)
		const amount = (
			standard === EvmTokenStandard.Erc721 ?
				1n
			:
				evmRpcQuantityToBigInt(log.data) ?? 0n
		)
		return [evmTokenTransferEntityFromFields({
			$network,
			txHash: normalizedTxHash,
			logIndex: baseLogIndex,
			standard,
			fromAddress,
			toAddress,
			tokenAddress,
			amount,
			tokenId,
		})]
	}
	if (topic0 === ERC1155_TRANSFER_SINGLE_TOPIC.toLowerCase()) {
		const fromAddress = topicToAddress(log.topics?.[2])
		const toAddress = topicToAddress(log.topics?.[3])
		const data = log.data ?? '0x'
		const tokenId = (
			data.length >= 66 ?
				evmRpcQuantityToBigInt(`0x${data.slice(2, 66)}`)
			:
				undefined
		)
		const amount = (
			data.length >= 130 ?
				evmRpcQuantityToBigInt(`0x${data.slice(66, 130)}`)
			:
				0n
		)
		return tokenId == null ?
			[]
		:	[evmTokenTransferEntityFromFields({
				$network,
				txHash: normalizedTxHash,
				logIndex: baseLogIndex,
				standard: EvmTokenStandard.Erc1155,
				fromAddress,
				toAddress,
				tokenAddress,
				amount,
				tokenId,
			})]
	}
	if (topic0 === ERC1155_TRANSFER_BATCH_TOPIC.toLowerCase()) {
		return []
	}
	return []
}

export const evmTokenTransferEntityIdsFromBlockscoutWires = ({
	$network,
	txHash,
	wires,
}: {
	$network: { chainId: number }
	txHash: `0x${string}`
	wires: readonly BlockscoutTokenTransferWire[]
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

export const evmTokenTransferEntityIdsFromBlockscoutAddressWires = ({
	$network,
	wires,
}: {
	$network: { chainId: number }
	wires: readonly BlockscoutTokenTransferWire[]
}): Entity<typeof schema, EntityType.EvmTokenTransfer>[] => {
	const wiresByTxHash = new Map<string, BlockscoutTokenTransferWire[]>()
	for (const wire of wires) {
		const txHash = hexLowerOfByteSize(wire.transaction_hash ?? '', 32)
		if (txHash == null) continue
		const txWires = wiresByTxHash.get(txHash) ?? []
		txWires.push(wire)
		wiresByTxHash.set(txHash, txWires)
	}
	return (
		[...wiresByTxHash.entries()]
			.flatMap(([txHash, txWires]) => (
				evmTokenTransferEntityIdsFromBlockscoutWires({
					$network,
					txHash: txHash as `0x${string}`,
					wires: txWires,
				})
			))
	)
}

export const evmTokenTransferEntitiesFromRpcLogs = ({
	$network,
	txHash,
	logs,
}: {
	$network: { chainId: number }
	txHash: `0x${string}`
	logs: readonly RpcLogWire[] | undefined
}): Entity<typeof schema, EntityType.EvmTokenTransfer>[] => (
	(logs ?? [])
		.flatMap((log) => (
			evmTokenTransferEntitiesFromRpcLog({
				$network,
				txHash,
				log,
			})
		))
		.sort((
			left,
			right,
		) => (
			left[EntityMetaKey.Id].logIndex - right[EntityMetaKey.Id].logIndex
		))
)

export const findBlockscoutTokenTransferWireForEntityId = (
	wires: readonly BlockscoutTokenTransferWire[],
	entityId: EntityId<typeof schema, EntityType.EvmTokenTransfer>,
): BlockscoutTokenTransferWire | undefined => (
	wires.find((wire) => (
		blockscoutLogIndexFromWire(wire.log_index) === entityId.logIndex
	))
)
