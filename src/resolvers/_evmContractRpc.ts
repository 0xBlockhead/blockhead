import { keccak256, toHex } from '@tevm/voltaire/Hash'
import { toBytes } from '@tevm/voltaire/Hex'

import { hexLowerOfByteSize, zeroExLowerCase } from '$/lib/hexLowerOfByteSize.ts'

export const evmContractRuntimeCodeFromGetCodeHex = (
	codeHex: `0x${string}`,
): `0x${string}` | undefined => (
	codeHex === '0x' || codeHex === '0x0' ?
		undefined
	:
		zeroExLowerCase(codeHex)
)

export const evmContractBytecodeHashFromGetCodeHex = (
	codeHex: `0x${string}`,
): `0x${string}` | undefined => {
	const runtimeCode = evmContractRuntimeCodeFromGetCodeHex(codeHex)
	return runtimeCode == null ?
		undefined
	:
		toHex(keccak256(toBytes(runtimeCode))) as `0x${string}`
}

export const evmContractStorageSlotReadsFromEthGetStorageAt = async ({
	address,
	depth,
	getStorageAt,
}: {
	address: `0x${string}`
	depth: number
	getStorageAt: (slotQuantityHex: `0x${string}`) => Promise<`0x${string}`>
}) => (
	Promise.all(
		Array.from({ length: depth }, async (_, slotIndex) => {
			const slotQuantityHex = (
				`0x${BigInt(slotIndex).toString(16).padStart(64, '0')}`
			) as `0x${string}`
			const valueHex = await getStorageAt(slotQuantityHex)
			const slotNormalized = hexLowerOfByteSize(slotQuantityHex, 32)
			const value = hexLowerOfByteSize(valueHex, 32)
			if (slotNormalized == null || value == null) return undefined
			return { slot: slotNormalized, value }
		}),
	)
		.then((rows) => (
			rows.flatMap((row) => row == null ? [] : [row])
		))
)
