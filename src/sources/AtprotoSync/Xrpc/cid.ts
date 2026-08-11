import { CID } from 'multiformats/cid'
import { type } from 'arktype'


export const atprotoCidLinkTag = 42


const cidFromAtprotoLinkBytes = (
	value: Uint8Array
) => {
	if (value.byteLength < 2 || value[0] !== 0)
		throw new Error('AtprotoSync_Xrpc: malformed CID link bytes')

	try {
		return CID.decode(value.subarray(1))
	} catch (error) {
		throw new Error('AtprotoSync_Xrpc: malformed CID link bytes', {
			cause: error,
		})
	}
}


export const atprotoCidLinkTagDecoder = (
	decodeInner: () => unknown
) => {
	const value = decodeInner()
	if (!(value instanceof Uint8Array))
		throw new Error('AtprotoSync_Xrpc: CID link tag must wrap bytes')

	return cidFromAtprotoLinkBytes(value)
}


export const atprotoCidString = (
	value: unknown
): string | null => {
	const asCid = CID.asCID(value)
	if (asCid != null)
		return asCid.toString()

	if (value instanceof Uint8Array) {
		try {
			return cidFromAtprotoLinkBytes(value).toString()
		} catch {
			return null
		}
	}

	const asString = type('string')(value)
	if (asString instanceof type.errors)
		return null

	const trimmed = asString.trim()
	if (trimmed === '')
		return null

	try {
		return CID.parse(trimmed).toString()
	} catch {
		return null
	}
}
