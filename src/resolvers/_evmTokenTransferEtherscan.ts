import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import { EvmTokenStandard } from '$/constants/EvmTokenTransfer.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import type { Entity, EntityId } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { CoinInstanceType } from '$/schema/CoinInstance.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import type {
	EtherscanErc1155TokenTransferRowWire,
	EtherscanErc20TokenTransferRowWire,
	EtherscanErc721TokenTransferRowWire,
} from '$/sources/Etherscan/Rest/types.ts'

export type EtherscanTokenTransferWireTagged = (
	| {
		standard: 'erc20'
		row: EtherscanErc20TokenTransferRowWire
	}
	| {
		standard: 'erc721'
		row: EtherscanErc721TokenTransferRowWire
	}
	| {
		standard: 'erc1155'
		row: EtherscanErc1155TokenTransferRowWire
	}
)

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

const etherscanLogIndexFromWire = (
	raw: string | undefined,
): number | undefined => (
	raw == null || raw === '' ?
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

const evmTokenStandardFromEtherscanTaggedWire = (
	wire: EtherscanTokenTransferWireTagged,
): EvmTokenStandard => (
	wire.standard === 'erc721' ?
		EvmTokenStandard.Erc721
	: wire.standard === 'erc1155' ?
		EvmTokenStandard.Erc1155
	:
		EvmTokenStandard.Erc20
)

export const evmTokenTransferEntityFromEtherscanWire = ({
	$network,
	txHash,
	wire,
}: {
	$network: { chainId: number }
	txHash: `0x${string}`
	wire: EtherscanTokenTransferWireTagged
}): Entity<typeof schema, EntityType.EvmTokenTransfer> | undefined => {
	const normalizedTxHash = hexLowerOfByteSize(txHash, 32)
	const logIndex = etherscanLogIndexFromWire(wire.row.logIndex)
	if (normalizedTxHash == null || logIndex == null) return undefined
	const standard = evmTokenStandardFromEtherscanTaggedWire(wire)
	const row = wire.row
	const fromAddress = hexLowerOfByteSize(row.from ?? '', 20)
	const toAddress = hexLowerOfByteSize(row.to ?? '', 20)
	const tokenAddress = hexLowerOfByteSize(row.contractAddress ?? '', 20)
	const tokenId = (
		wire.standard === 'erc721' || wire.standard === 'erc1155' ?
			etherscanQuantityToBigInt(row.tokenID)
		:
			undefined
	)
	const amount = (
		standard === EvmTokenStandard.Erc721 ?
			1n
		: standard === EvmTokenStandard.Erc1155 ?
			etherscanQuantityToBigInt(row.tokenValue) ?? 0n
		:
			etherscanQuantityToBigInt(row.value) ?? 0n
	)
	const tokenDecimals = (
		row.tokenDecimal != null && row.tokenDecimal !== '' ?
			Number(row.tokenDecimal)
		:
			undefined
	)
	return {
		[EntityMetaKey.Id]: {
			$network,
			txHash: normalizedTxHash,
			logIndex,
		},
		standard,
		amount,
		...(tokenId != null && { tokenId }),
		...(row.tokenSymbol != null && { tokenSymbol: row.tokenSymbol }),
		...(row.tokenName != null && { tokenName: row.tokenName }),
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

export const evmTokenTransferEntityIdsFromEtherscanWires = ({
	$network,
	txHash,
	wires,
}: {
	$network: { chainId: number }
	txHash: `0x${string}`
	wires: readonly EtherscanTokenTransferWireTagged[]
}): Entity<typeof schema, EntityType.EvmTokenTransfer>[] => (
	wires.flatMap((wire) => {
		const entity = evmTokenTransferEntityFromEtherscanWire({
			$network,
			txHash,
			wire,
		})
		return entity == null ? [] : [entity]
	})
)

export const evmTokenTransferEntityIdsFromEtherscanAddressWires = ({
	$network,
	wires,
}: {
	$network: { chainId: number }
	wires: readonly EtherscanTokenTransferWireTagged[]
}): Entity<typeof schema, EntityType.EvmTokenTransfer>[] => {
	const wiresByTxHash = new Map<string, EtherscanTokenTransferWireTagged[]>()
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
				evmTokenTransferEntityIdsFromEtherscanWires({
					$network,
					txHash: txHash as `0x${string}`,
					wires: txWires,
				})
			))
	)
}

export const findEtherscanTokenTransferWireForEntityId = (
	wires: readonly EtherscanTokenTransferWireTagged[],
	entityId: EntityId<typeof schema, EntityType.EvmTokenTransfer>,
): EtherscanTokenTransferWireTagged | undefined => (
	wires.find((wire) => (
		etherscanLogIndexFromWire(wire.row.logIndex) === entityId.logIndex
	))
)
