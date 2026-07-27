// Constants
/** Relay `relayUrl` is a public `wss://` endpoint (NIP-11 metadata optional). */
export const nostrNetworkSeedRelays = [
	{
		relayUrl: 'wss://relay.damus.io',
	},
	{
		relayUrl: 'wss://nos.lol',
	},
	{
		relayUrl: 'wss://relay.primal.net',
	},
] as const satisfies readonly {
	relayUrl: string
}[]

/** Profile `pubkey` is 64-char lowercase hex (secp256k1 x-only). */
export const nostrNetworkSeedProfiles = [
	{
		pubkey: '531fe6068134503d2723133227c867ac8fa6c83c537e9a44c3c5bdbdcb1fe337',
	},
	{
		pubkey: '03bf0c63fcb93463407af75a5a2a6e9e66704bf8628b1655776622461b998244',
	},
	{
		pubkey: '0c45abd5648552b4c7333b6bcc33ccba8fc58f452dc41f2b6dceda1588758144',
	},
] as const satisfies readonly {
	pubkey: string
}[]

/** Note `eventId` is a 64-char lowercase hex event hash. */
export const nostrNetworkSeedNotes = [
	{
		eventId: '740b61069fef66f5a5a08fc8eaa821e0c20ec393d11f42bb1c8a70a52bc33bb9',
		pubkey: '531fe6068134503d2723133227c867ac8fa6c83c537e9a44c3c5bdbdcb1fe337',
		createdAt: 1710000000,
		content: 'Blockhead Nostr seed note',
	},
] as const satisfies readonly {
	eventId: string
	pubkey: string
	createdAt: number
	content: string
}[]
