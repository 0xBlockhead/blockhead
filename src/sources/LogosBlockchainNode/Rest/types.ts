import { type } from 'arktype'

const headerId = /^[0-9a-f]{64}$/
const unsignedSafeInteger = 'number.integer >= 0 <= 9007199254740991'

/**
 * `ChainServiceInfo` returned by Logos Blockchain 0.2.0.
 * @see https://github.com/logos-blockchain/logos-blockchain/blob/0.2.0/services/chain/chain-service/src/lib.rs
 */
export const chainServiceInfo = type({
	cryptarchia_info: type({
		lib: headerId,
		lib_slot: unsignedSafeInteger,
		tip: headerId,
		slot: unsignedSafeInteger,
		height: unsignedSafeInteger,
	}).onUndeclaredKey('reject'),
	mode: type.or(
		type.unit('AwaitingStart'),
		type({
			Started: "'Bootstrapping' | 'Online'",
		}).onUndeclaredKey('reject')
	),
}).onUndeclaredKey('reject')
