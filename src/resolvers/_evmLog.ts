import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import type { Entity, EntityId } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import type { RpcLogWire } from '$/sources/Evm/JsonRpc/types.ts'

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
	return {
		[EntityMetaKey.Id]: entityId,
		topics: log.topics ?? [],
		...(address != null && { address }),
		...(log.data != null && { data: log.data }),
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
