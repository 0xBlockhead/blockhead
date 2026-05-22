// Types
import type { EntityId } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { schema } from '$/schema/index.ts'


// Constants
export const nostrNetworkFieldValues = {
	docsUrl: 'https://github.com/nostr-protocol/nips',
	homeUrl: 'https://nostr.com',
	protocolName: 'Nostr',
	registryLabel: 'Curated seed profiles + relay/indexer feeds',
	topology: 'Constants seeds + live REST/indexer -> network -> relays / profiles -> notes / reposts / articles',
} as const

/** Relay `relayUrl` is a public `wss://` endpoint (NIP-11 metadata optional). */
export const nostrNetworkSeedRelays: readonly EntityId<typeof schema, EntityType.NostrRelay>[] = [
	{
		relayUrl: 'wss://relay.damus.io',
	},
	{
		relayUrl: 'wss://nos.lol',
	},
	{
		relayUrl: 'wss://relay.primal.net',
	},
]

/** Profile `pubkey` is 64-char lowercase hex (secp256k1 x-only). */
export const nostrNetworkSeedProfiles: readonly EntityId<typeof schema, EntityType.NostrProfile>[] = [
	{
		pubkey: '82341f880b9929660a178be448011edd0e5839858c4fc1480b5fd4b6205d127b',
	},
	{
		pubkey: '3bf0c63fcb93463407af75a5a2a6e9e66704bf8628b1655776622461b998244',
	},
	{
		pubkey: 'c45abd5648552b4c7333b6bcc33ccba8fc58f452dc41f2b6dceda1588758144',
	},
]
