import { describe, expect, it } from 'vitest'

import { base58, bech32 } from '@scure/base'

import {
	entityHrefFromSearchInput,
	evmAccountCandidatesFromSearchInput,
	evmAddressHrefFromCoordinates,
	evmHashHrefFromCoordinates,
	evmNetworkChoices,
	nostrHexHrefFromCoordinates,
	utxoTransactionHrefFromCoordinates,
	utxoTransactionNetworkChoices,
} from './entitySearch.ts'


describe('universal search acceptance matrix', () => {
	it.each([
		['Farcaster profile URL', 'https://farcaster.xyz/~/profiles/3', '/farcaster/user/3'],
		['Farcaster channel URL', 'https://warpcast.com/~/channel/ethereum', '/farcaster/channel/ethereum'],
		['Farcaster cast URL', 'https://farcaster.xyz/vitalik/0xabcdef12', '/farcaster/c/vitalik/0xabcdef12'],
		['YouTube video URL', 'https://youtube.com/watch?v=dQw4w9WgXcQ', '/youtube/video/dQw4w9WgXcQ'],
		['YouTube playlist URL', 'https://youtube.com/playlist?list=PL1234567890_example', '/youtube/playlist/PL1234567890_example'],
		['YouTube channel URL', 'https://youtube.com/channel/UC_x5XG1OV2P6uZZ5FSM9Ttw', '/youtube/channel/UC_x5XG1OV2P6uZZ5FSM9Ttw'],
		['X user URL', 'https://x.com/vitalikbuterin', '/x/user/@vitalikbuterin'],
		['X post URL', 'https://twitter.com/vitalikbuterin/status/1892305694578297172', '/x/post/1892305694578297172'],
		['Arweave resource URI', 'ar://1234567890123456789012345678901234567890123/docs/index.html', '/arweave/resource/1234567890123456789012345678901234567890123/docs/index.html'],
		['AT Protocol PLC DID', 'did:plc:ewvi7nxzyoun6zhxrhs64oiz', '/atproto/actor/did%3Aplc%3Aewvi7nxzyoun6zhxrhs64oiz'],
		['Swarm resource URI', 'bzz://0000000000000000000000000000000000000000000000000000000000000001/docs/index.html', '/swarm/0000000000000000000000000000000000000000000000000000000000000001/path/docs/index.html'],
		['ActivityPub handle', '@alice@mastodon.social', '/activitypub/actor/https%3A%2F%2Fmastodon.social/@alice'],
		['ActivityPub note URL', 'https://mastodon.social/@alice/114000000000000000', '/activitypub/note/https%3A%2F%2Fmastodon.social/114000000000000000'],
		['Radicle RID', 'rad:z3gqcJUoA1n9HaHKufZs5FCSGazv5D6Dt7Fnx1C4h2kKz', '/radicle/repository/rad:z3gqcJUoA1n9HaHKufZs5FCSGazv5D6Dt7Fnx1C4h2kKz'],
		['AT Protocol post URI', 'at://did:plc:ewvi7nxzyoun6zhxrhs64oiz/app.bsky.feed.post/3lbm6y55c2c2a', '/atproto/post/at%3A%2F%2Fdid%3Aplc%3Aewvi7nxzyoun6zhxrhs64oiz%2Fapp.bsky.feed.post%2F3lbm6y55c2c2a'],
		['Bluesky post URL', 'https://bsky.app/profile/alice.bsky.social/post/3lbm6y55c2c2a', '/atproto/post/at%3A%2F%2Falice.bsky.social%2Fapp.bsky.feed.post%2F3lbm6y55c2c2a'],
		['Bluesky profile URL', 'https://bsky.app/profile/alice.bsky.social', '/atproto/actor/handle/alice.bsky.social'],
		['Reddit link URL', 'https://reddit.com/r/ethereum/comments/1u8x2f8/a_title/', '/reddit/link/t3_1u8x2f8'],
		['Reddit subreddit URL', 'https://reddit.com/r/ethereum', '/reddit/r/ethereum'],
		['Git forge repository URL', 'https://gitlab.com/gitlab-org/gitlab', '/git/forge/gitlab.com/gitlab-org/gitlab'],
		['Git forge issue URL', 'https://gitlab.com/gitlab-org/gitlab/-/issues/12', '/git/forge/gitlab.com/gitlab-org/gitlab/issue/12'],
		['Git forge pull request URL', 'https://gitlab.com/gitlab-org/gitlab/-/merge_requests/34', '/git/forge/gitlab.com/gitlab-org/gitlab/pull-request/34'],
		['Git forge release URL', 'https://gitlab.com/gitlab-org/gitlab/-/releases/v1.0.0', '/git/forge/gitlab.com/gitlab-org/gitlab/release/v1.0.0'],
		['Nested Git forge repository URL', 'https://gitlab.com/platform/backend/payments', '/git/forge/gitlab.com/platform%2Fbackend/payments'],
		['Nested Git forge issue URL', 'https://gitlab.com/platform/backend/payments/-/issues/12', '/git/forge/gitlab.com/platform%2Fbackend/payments/issue/12'],
		['GitHub repository URL', 'https://github.com/openai/codex', '/git/forge/github.com/openai/codex'],
		['GitHub pull request URL', 'https://github.com/openai/codex/pull/34', '/git/forge/github.com/openai/codex/pull-request/34'],
		['Snapshot proposal URL', `https://snapshot.org/#/ens.eth/proposal/0x${'12'.repeat(32)}`, `/~/snapshot/proposal/0x${'12'.repeat(32)}`],
		['Tally proposal URL', 'https://www.tally.xyz/gov/uniswap/proposal/2207450143689540901', '/~/tally/proposal/2207450143689540901'],
		['EVM explorer transaction URL', `https://etherscan.io/tx/0x${'12'.repeat(32)}`, `/network/eip155:1/tx/0x${'12'.repeat(32)}`],
		['EVM explorer address URL', `https://basescan.org/address/0x${'AB'.repeat(20)}`, `/account/eip155:8453/0x${'AB'.repeat(20)}`],
		['IPFS URI', 'ipfs://bafybeigdyrzt5sfp7udm7hu76f7lz4gf5o7vsvixd3rqfwxq6c6azp7j7m/folder/file.json', '/ipfs/ipfs/bafybeigdyrzt5sfp7udm7hu76f7lz4gf5o7vsvixd3rqfwxq6c6azp7j7m/path/folder/file.json'],
		['IPNS URI', 'ipns://docs.ipfs.tech/concepts', '/ipfs/ipns/docs.ipfs.tech/path/concepts'],
		['magnet URI', 'magnet:?xt=urn:btih:0123456789abcdef0123456789abcdef01234567', '/magnet/magnet%3A%3Fxt%3Durn%3Abtih%3A0123456789abcdef0123456789abcdef01234567'],
		['generic HTTPS URL', 'https://example.com/a?b=c', '/url/https%3A%2F%2Fexample.com%2Fa%3Fb%3Dc'],
		['CAIP-2 network', 'eip155:1', '/network/eip155:1'],
		['CAIP-10 account', 'eip155:1:0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045', '/account/eip155:1/0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'],
		['ENS name', 'vitalik.eth', '/ens/name/vitalik.eth'],
		['Solana transaction signature', base58.encode(new Uint8Array(64).fill(7)), `/network/solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp/tx/${base58.encode(new Uint8Array(64).fill(7))}`],
		['Nostr profile', bech32.encode('npub', bech32.toWords(new Uint8Array(32).fill(7)), false), `/nostr/profile/${'07'.repeat(32)}`],
		['Nostr note', `nostr:${bech32.encode('note', bech32.toWords(new Uint8Array(32).fill(8)), false)}`, `/nostr/note/${'08'.repeat(32)}`],
	])('%s has one canonical destination', (_family, query, href) => {
		expect(entityHrefFromSearchInput(query)).toBe(href)
	})

	it('keeps identifier-shape ambiguities unresolved until the user provides existing route coordinates', () => {
		const address = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
		const hash = '31ed178236b6bc4dd6dc8c6026e9d344e39afe0dc6d832c228131ce4ee40a8ca'
		const evmHash = `0x${hash}`

		expect(entityHrefFromSearchInput(address)).toBeUndefined()
		expect(entityHrefFromSearchInput(hash)).toBeUndefined()
		expect(evmAddressHrefFromCoordinates({
			query: address,
			networkCaip2: 'eip155:1',
			entityKind: 'account',
		})).toBe(`/account/eip155:1/${address}`)
		expect(evmHashHrefFromCoordinates({
			query: evmHash,
			networkCaip2: 'eip155:1',
			entityKind: 'transaction',
		})).toBe(`/network/eip155:1/tx/${evmHash}`)
		expect(utxoTransactionHrefFromCoordinates({
			query: hash,
			networkKey: 'bip122:000000000019d6689c085ae165831e93',
		})).toBe(`/network/bip122:000000000019d6689c085ae165831e93/tx/${hash}`)
		expect(nostrHexHrefFromCoordinates({
			query: hash,
			entityKind: 'note',
		})).toBe(`/nostr/note/${hash}`)
	})

	it('shows checked-in network identities and environment labels for ambiguous EVM and transaction values', () => {
		const address = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'

		expect(evmNetworkChoices).toContainEqual(expect.objectContaining({
			name: 'Ethereum Mainnet',
			environment: 'Mainnet',
			caip2: 'eip155:1',
	}))
		expect(evmAccountCandidatesFromSearchInput(address)).toContainEqual(expect.objectContaining({
			name: 'Ethereum Sepolia',
			environment: 'Testnet',
			caip2: 'eip155:11155111',
			accountAddress: address,
	}))
		expect(utxoTransactionNetworkChoices).toContainEqual(expect.objectContaining({
			name: 'Bitcoin',
			environment: 'Mainnet',
			identity: 'bip122:000000000019d6689c085ae165831e93',
		}))
		expect(utxoTransactionNetworkChoices).toContainEqual(expect.objectContaining({
			name: 'Liquid Network',
			environment: 'Mainnet',
			identity: 'Elements catalog slug: liquid',
		}))
	})
})
