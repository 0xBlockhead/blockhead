import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import { EvmLogInterpretationKind } from '$/constants/EvmLog.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import type { Entity, EntityId } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import type { RpcLogWire } from '$/sources/Evm/JsonRpc/types.ts'

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

export const evmLogInterpretationKindFromTopics = (
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

export const evmLogIndexFromWire = (
	raw: string | undefined,
): number | undefined => (
	raw == null ?
		undefined
	:	((parsed) => (
			Number.isFinite(parsed) && Number.isInteger(parsed) && parsed >= 0 ?
				parsed
			:	undefined
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

export const evmLogEntityIdFromWire = ({
	$network,
	txHash,
	log,
}: {
	$network: { chainId: number }
	txHash: string
	log: RpcLogWire
}): EntityId<typeof schema, EntityType.EvmLog> | undefined => {
	const logIndex = evmLogIndexFromWire(log.logIndex)
	const normalizedTxHash = hexLowerOfByteSize(txHash, 32)
	return logIndex == null || normalizedTxHash == null ?
			undefined
		:	{
				$network,
				txHash: normalizedTxHash,
				logIndex,
			}
}

export const evmLogEntityFromIdAndWire = (
	entityId: EntityId<typeof schema, EntityType.EvmLog>,
	log: RpcLogWire,
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

export const findReceiptLogWireForEvmLogId = (
	logs: readonly RpcLogWire[] | undefined,
	logIndex: number,
): RpcLogWire | undefined => (
	(logs ?? []).find((log) => (
		evmLogIndexFromWire(log.logIndex) === logIndex
	))
)
