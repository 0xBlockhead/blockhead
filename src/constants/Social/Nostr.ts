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
		pubkey: '82341f880b9929660a178be448011edd0e5839858c4fc1480b5fd4b6205d127b',
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
		eventId: '69be3416ed20ce50dea9cdd5471dbef55d320df41d97e1e999108321c2c3e3df',
		pubkey: '82341f880b9929660a178be448011edd0e5839858c4fc1480b5fd4b6205d127b',
		createdAt: 1710000000,
		content: 'Blockhead Nostr seed note',
	},
] as const satisfies readonly {
	eventId: string
	pubkey: string
	createdAt: number
	content: string
}[]
