import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import type { Entity, EntityId } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { CoinInstanceType } from '$/schema/CoinInstance.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { EvmTokenStandard } from '$/schema/EvmTokenTransfer.ts'
import type { BlockscoutTokenTransferWire } from '$/sources/Blockscout/Rest/types.ts'

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

const evmTokenStandardFromBlockscoutWire = (
	wire: BlockscoutTokenTransferWire,
): EvmTokenStandard => {
	const tokenType = wire.token?.type?.toUpperCase() ?? ''
	if (tokenType.includes('721')) return EvmTokenStandard.Erc721
	if (tokenType.includes('1155')) return EvmTokenStandard.Erc1155
	return EvmTokenStandard.Erc20
}

export const evmTokenTransferEntityFromWire = ({
	$network,
	txHash,
	transferIndex,
	wire,
}: {
	$network: { chainId: number }
	txHash: `0x${string}`
	transferIndex: number
	wire: BlockscoutTokenTransferWire
}): Entity<typeof schema, EntityType.EvmTokenTransfer> | undefined => {
	const normalizedTxHash = hexLowerOfByteSize(txHash, 32)
	if (normalizedTxHash == null) return undefined
	const standard = evmTokenStandardFromBlockscoutWire(wire)
	const fromAddress = hexLowerOfByteSize(wire.from?.hash ?? '', 20)
	const toAddress = hexLowerOfByteSize(wire.to?.hash ?? '', 20)
	const tokenAddress = hexLowerOfByteSize(wire.token?.address_hash ?? '', 20)
	const logIndex = blockscoutLogIndexFromWire(wire.log_index)
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
	const entityId = {
		$network,
		txHash: normalizedTxHash,
		transferIndex,
	} satisfies EntityId<typeof schema, EntityType.EvmTokenTransfer>
	return {
		[EntityMetaKey.Id]: entityId,
		standard,
		amount,
		...(logIndex != null && { logIndex }),
		...(tokenId != null && { tokenId }),
		...(wire.token?.symbol != null && { tokenSymbol: wire.token.symbol }),
		...(wire.token?.name != null && { tokenName: wire.token.name }),
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
	}
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
	wires.flatMap((wire, transferIndex) => {
		const entity = evmTokenTransferEntityFromWire({
			$network,
			txHash,
			transferIndex,
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

export const findBlockscoutTokenTransferWireForEntityId = (
	wires: readonly BlockscoutTokenTransferWire[],
	entityId: EntityId<typeof schema, EntityType.EvmTokenTransfer>,
): BlockscoutTokenTransferWire | undefined => (
	wires[entityId.transferIndex]
)
