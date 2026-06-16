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
		pubkey: '3bf0c63fcb93463407af75a5a2a6e9e66704bf8628b1655776622461b998244',
	},
	{
		pubkey: 'c45abd5648552b4c7333b6bcc33ccba8fc58f452dc41f2b6dceda1588758144',
	},
] as const satisfies readonly {
	pubkey: string
}[]
