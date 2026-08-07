import { type } from 'arktype'

const headerId = /^[0-9a-f]{64}$/
const zkPublicKey = /^[0-9a-f]{64}$/
const unsignedSafeInteger = 'number.integer >= 0 <= 9007199254740991'
const multiaddr = type('string > 0')
const peerId = type('string > 0')

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

/**
 * `Libp2pInfo` from `GET /network/info` (Logos Blockchain 0.2.0).
 * @see https://github.com/logos-blockchain/logos-blockchain/blob/0.2.0/services/network/src/backends/libp2p/command.rs
 */
export const libp2pInfo = type({
	listen_addresses: multiaddr.array(),
	peer_id: peerId,
	'connected_peers?': peerId.array(),
	n_peers: unsignedSafeInteger,
	n_connections: unsignedSafeInteger,
	n_pending_connections: unsignedSafeInteger,
}).onUndeclaredKey('reject')

/**
 * `WalletBalanceResponseBody` from `GET /wallet/:public_key/balance`.
 * Wire-only `notes` stays accepted but unprojected.
 * @see https://github.com/logos-blockchain/logos-blockchain/blob/0.2.0/nodes/api-common/src/bodies/wallet.rs
 */
export const walletBalance = type({
	tip: headerId,
	balance: unsignedSafeInteger,
	notes: type({
		'[string]': unsignedSafeInteger,
	}),
	address: zkPublicKey,
}).onUndeclaredKey('reject')
