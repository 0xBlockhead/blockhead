import { type } from 'arktype'
import type { EntityFieldValueNormalizer } from '$/schema/$schema.ts'


/** JSON-RPC / EVM hex with `0x` prefix (any length). Prefer literals or Tevm `Hex.*` — see `$/lib/hexLowerOfByteSize.ts`. */
export const ZeroExHex = type(
	'/^0x[0-9a-fA-F]*$/' as type.cast<`0x${string}`>
)

/** `0x` + 40 hex digits (20-byte EVM account / contract address). */
export const EvmAddress = type(
	'/^0x[0-9a-fA-F]{40}$/' as type.cast<`0x${string}`>
)

export const lowercaseHexIdentityValue: EntityFieldValueNormalizer = (value) => (
	String(value).toLowerCase()
)
