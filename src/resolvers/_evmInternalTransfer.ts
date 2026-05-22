import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import type { Entity, EntityId } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import type { BlockscoutInternalTransactionWire } from '$/sources/Blockscout/Rest/types.ts'

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

export const evmInternalTransferEntityFromWire = ({
	$network,
	txHash,
	wire,
}: {
	$network: { chainId: number }
	txHash: `0x${string}`
	wire: BlockscoutInternalTransactionWire
}): Entity<typeof schema, EntityType.EvmInternalTransfer> | undefined => {
	const normalizedTxHash = hexLowerOfByteSize(txHash, 32)
	const internalIndex = wire.index
	if (normalizedTxHash == null || internalIndex == null || internalIndex < 0) return undefined
	const fromAddress = hexLowerOfByteSize(wire.from?.hash ?? '', 20)
	const toAddress = hexLowerOfByteSize(wire.to?.hash ?? '', 20)
	const createdAddress = hexLowerOfByteSize(wire.created_contract?.hash ?? '', 20)
	const value = blockscoutQuantityToBigInt(wire.value) ?? 0n
	const entityId = {
		$network,
		txHash: normalizedTxHash,
		internalIndex,
	} satisfies EntityId<typeof schema, EntityType.EvmInternalTransfer>
	return {
		[EntityMetaKey.Id]: entityId,
		value,
		...(wire.type != null && { callType: wire.type }),
		...(wire.success != null && { success: wire.success }),
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
		...(createdAddress != null && {
			$createdContract: {
				[EntityMetaKey.Id]: {
					$network,
					address: createdAddress,
				},
			} satisfies Entity<typeof schema, EntityType.EvmContract>,
		}),
	}
}

export const evmInternalTransferEntityIdsFromBlockscoutWires = ({
	$network,
	txHash,
	wires,
}: {
	$network: { chainId: number }
	txHash: `0x${string}`
	wires: readonly BlockscoutInternalTransactionWire[]
}): Entity<typeof schema, EntityType.EvmInternalTransfer>[] => (
	wires.flatMap((wire) => {
		const entity = evmInternalTransferEntityFromWire({
			$network,
			txHash,
			wire,
		})
		return entity == null ? [] : [entity]
	})
)

export const evmInternalTransferEntityIdsFromBlockscoutAddressWires = ({
	$network,
	wires,
}: {
	$network: { chainId: number }
	wires: readonly BlockscoutInternalTransactionWire[]
}): Entity<typeof schema, EntityType.EvmInternalTransfer>[] => {
	const wiresByTxHash = new Map<string, BlockscoutInternalTransactionWire[]>()
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
				evmInternalTransferEntityIdsFromBlockscoutWires({
					$network,
					txHash: txHash as `0x${string}`,
					wires: txWires,
				})
			))
	)
}

export const findBlockscoutInternalTransferWireForEntityId = (
	wires: readonly BlockscoutInternalTransactionWire[],
	entityId: EntityId<typeof schema, EntityType.EvmInternalTransfer>,
): BlockscoutInternalTransactionWire | undefined => (
	wires.find((wire) => wire.index === entityId.internalIndex)
)
