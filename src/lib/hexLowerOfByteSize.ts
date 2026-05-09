import { Hex } from '@tevm/voltaire/Hex'

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
