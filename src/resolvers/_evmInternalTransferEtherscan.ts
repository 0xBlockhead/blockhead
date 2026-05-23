import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import type { Entity, EntityId } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { evmInternalCallTypeFromWire } from '$/resolvers/_evmTransaction.ts'
import type { EtherscanInternalTransactionRowWire } from '$/sources/Etherscan/Rest/types.ts'

const etherscanQuantityToBigInt = (
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

export const evmInternalTransferEntityFromEtherscanWire = ({
	$network,
	txHash,
	internalIndex,
	wire,
}: {
	$network: { chainId: number }
	txHash: `0x${string}`
	internalIndex: number
	wire: EtherscanInternalTransactionRowWire
}): Entity<typeof schema, EntityType.EvmInternalTransfer> | undefined => {
	const normalizedTxHash = hexLowerOfByteSize(txHash, 32)
	if (normalizedTxHash == null || internalIndex < 0) return undefined
	const fromAddress = hexLowerOfByteSize(wire.from ?? '', 20)
	const toAddress = hexLowerOfByteSize(wire.to ?? '', 20)
	const createdAddress = hexLowerOfByteSize(wire.contractAddress ?? '', 20)
	const value = etherscanQuantityToBigInt(wire.value) ?? 0n
	const entityId = {
		$network,
		txHash: normalizedTxHash,
		internalIndex,
	} satisfies EntityId<typeof schema, EntityType.EvmInternalTransfer>
	return {
		[EntityMetaKey.Id]: entityId,
		value,
		...(wire.type != null && ((callType) => (
			callType != null && { callType }
		))(evmInternalCallTypeFromWire(wire.type))),
		...(wire.isError != null && { success: wire.isError === '0' }),
		...(fromAddress != null && {
			$from: {
				[EntityMetaKey.Id]: { address: fromAddress },
			} satisfies Entity<typeof schema, EntityType.Actor>,
		}),
		...(toAddress != null && toAddress !== '' && {
			$to: {
				[EntityMetaKey.Id]: { address: toAddress },
			} satisfies Entity<typeof schema, EntityType.Actor>,
		}),
		...(createdAddress != null && createdAddress !== '' && {
			$createdContract: {
				[EntityMetaKey.Id]: {
					$network,
					address: createdAddress,
				},
			} satisfies Entity<typeof schema, EntityType.EvmContract>,
		}),
	}
}

export const evmInternalTransferEntityIdsFromEtherscanWires = ({
	$network,
	txHash,
	wires,
}: {
	$network: { chainId: number }
	txHash: `0x${string}`
	wires: readonly EtherscanInternalTransactionRowWire[]
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

export const evmInternalTransferEntityIdsFromEtherscanAddressWires = ({
	$network,
	wires,
}: {
	$network: { chainId: number }
	wires: readonly EtherscanInternalTransactionRowWire[]
}): Entity<typeof schema, EntityType.EvmInternalTransfer>[] => {
	const wiresByTxHash = new Map<string, EtherscanInternalTransactionRowWire[]>()
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
					txHash: txHash as `0x${string}`,
					wires: txWires,
				})
			))
	)
}

export const findEtherscanInternalTransferWireForEntityId = (
	wires: readonly EtherscanInternalTransactionRowWire[],
	entityId: EntityId<typeof schema, EntityType.EvmInternalTransfer>,
): EtherscanInternalTransactionRowWire | undefined => (
	wires[entityId.internalIndex]
)
