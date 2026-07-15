import { base58btc } from 'multiformats/bases/base58'


export const match = (value: string) => {
	try {
		const decoded = base58btc.baseDecode(value)
		return decoded.length === 32
			&& base58btc.baseEncode(decoded) === value
	}
	catch {
		return false
	}
}
