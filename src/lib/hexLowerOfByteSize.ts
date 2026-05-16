import { Hex } from '@tevm/voltaire/Hex'


/**
 * Hex conventions (`$/schema/$ZeroExHex.ts`):
 * - **Entity / collection domain:** lowercase `0x` + hex (`EvmAddress`, `ZeroExHex`). Build with literals, `Hex.*` from Tevm, or **one** normalization at a provider boundary — do not strip to digits and re-prefix inside resolvers.
 * - **`zeroExLowerCase`:** trusted value that already has `0x`; lowercase only (subgraphs, stable URL segments).
 * - **`with0xHex`:** **Ingress only** — input may omit `0x` or use odd casing (user input, some legacy wire). Do not wrap entity id fields that are already typed `0x${string}`.
 *
 * Arktype `string.hex` is digits-only (no `0x`); prefer `$ZeroExHex` for JSON-RPC-shaped strings.
 */
export const zeroExLowerCase = (s: `0x${string}`): `0x${string}` => (
	s.toLowerCase() as `0x${string}`
)


export const with0xHex = (s: string): `0x${string}` => (
	s.startsWith('0x') || s.startsWith('0X') ?
		s.toLowerCase() as `0x${string}`
	:
		(`0x${s.toLowerCase()}`)
)


const isHexLowerOfByteSize = (
	value: string,
	byteSize: 20 | 32,
): value is `0x${string}` => (
	Hex.isHex(value) && Hex.size(value) === byteSize
)

export const hexLowerOfByteSize = (
	s: string,
	byteSize: 20 | 32,
): `0x${string}` | undefined => {
	const t = s.toLowerCase()
	return isHexLowerOfByteSize(t, byteSize) ? t : undefined
}
