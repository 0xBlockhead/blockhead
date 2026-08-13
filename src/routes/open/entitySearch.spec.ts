import { describe, expect, it } from 'vitest'

import { base58, bech32 } from '@scure/base'

import { NetworkLedgerModel, networks } from '$/constants/Network.ts'

import {
	entityHrefFromSearchInput,
	evmAccountCandidatesFromSearchInput,
	evmAddressHrefFromCoordinates,
	evmHashHrefFromCoordinates,
	nostrHexHrefFromCoordinates,
	utxoTransactionHrefFromCoordinates,
	utxoTransactionNetworkChoices,
} from './entitySearch.ts'


describe(entityHrefFromSearchInput, () => {
	it.each([
		['https://farcaster.xyz/~/profiles/3', '/farcaster/user/3'],
		['https://warpcast.com/~/channel/ethereum', '/farcaster/channel/ethereum'],
		['https://FARCASTER.XYZ/Vitalik/0xABCDEF12', '/farcaster/c/vitalik/0xabcdef12'],
		['https://www.youtube.com/watch?v=dQw4w9WgXcQ', '/youtube/video/dQw4w9WgXcQ'],
		['https://youtu.be/dQw4w9WgXcQ?t=43', '/youtube/video/dQw4w9WgXcQ'],
		['https://youtube.com/shorts/dQw4w9WgXcQ', '/youtube/video/dQw4w9WgXcQ'],
		['https://www.youtube.com/embed/dQw4w9WgXcQ', '/youtube/video/dQw4w9WgXcQ'],
		['https://www.youtube.com/playlist?list=PL1234567890_example', '/youtube/playlist/PL1234567890_example'],
		['https://youtube.com/channel/UC_x5XG1OV2P6uZZ5FSM9Ttw', '/youtube/channel/UC_x5XG1OV2P6uZZ5FSM9Ttw'],
		['https://x.com/vitalikbuterin', '/x/user/@vitalikbuterin'],
		['https://mobile.twitter.com/vitalikbuterin/status/1892305694578297172', '/x/post/1892305694578297172'],
		['ar://1234567890123456789012345678901234567890123/docs/index.html', '/arweave/resource/1234567890123456789012345678901234567890123/docs/index.html'],
		['did:plc:ewvi7nxzyoun6zhxrhs64oiz', '/atproto/actor/did%3Aplc%3Aewvi7nxzyoun6zhxrhs64oiz'],
		['bzz://0000000000000000000000000000000000000000000000000000000000000001/docs/index.html', '/swarm/0000000000000000000000000000000000000000000000000000000000000001/path/docs/index.html'],
		['swarm://0x0000000000000000000000000000000000000000000000000000000000000001', '/swarm/0000000000000000000000000000000000000000000000000000000000000001'],
		['@alice@mastodon.social', '/activitypub/actor/https%3A%2F%2Fmastodon.social/@alice'],
		['https://mastodon.social/@alice/114000000000000000', '/activitypub/note/https%3A%2F%2Fmastodon.social/114000000000000000'],
		['rad:z3gqcJUoA1n9HaHKufZs5FCSGazv5D6Dt7Fnx1C4h2kKz', '/radicle/repository/rad:z3gqcJUoA1n9HaHKufZs5FCSGazv5D6Dt7Fnx1C4h2kKz'],
		['at://did:plc:ewvi7nxzyoun6zhxrhs64oiz/app.bsky.feed.post/3lbm6y55c2c2a', '/atproto/post/at%3A%2F%2Fdid%3Aplc%3Aewvi7nxzyoun6zhxrhs64oiz%2Fapp.bsky.feed.post%2F3lbm6y55c2c2a'],
		['https://bsky.app/profile/did:plc:ewvi7nxzyoun6zhxrhs64oiz', '/atproto/actor/did%3Aplc%3Aewvi7nxzyoun6zhxrhs64oiz'],
		['https://bsky.app/profile/alice.bsky.social', '/atproto/actor/handle/alice.bsky.social'],
		['https://bsky.app/profile/did:plc:ewvi7nxzyoun6zhxrhs64oiz/post/3lbm6y55c2c2a?ref=search', '/atproto/post/at%3A%2F%2Fdid%3Aplc%3Aewvi7nxzyoun6zhxrhs64oiz%2Fapp.bsky.feed.post%2F3lbm6y55c2c2a'],
		['https://bsky.app/profile/alice.bsky.social/post/3lbm6y55c2c2a', '/atproto/post/at%3A%2F%2Falice.bsky.social%2Fapp.bsky.feed.post%2F3lbm6y55c2c2a'],
		['https://www.reddit.com/r/ethereum/comments/1u8x2f8/a_title/', '/reddit/link/t3_1u8x2f8'],
		['https://reddit.com/r/ethereum?utm_source=search', '/reddit/r/ethereum'],
		['https://gitlab.com/gitlab-org/gitlab', '/git/forge/gitlab.com/gitlab-org/gitlab'],
		['https://gitlab.com/gitlab-org/gitlab.git', '/git/forge/gitlab.com/gitlab-org/gitlab'],
		['https://gitlab.com/gitlab-org/gitlab/-/issues/12', '/git/forge/gitlab.com/gitlab-org/gitlab/issue/12'],
		['https://gitlab.com/gitlab-org/gitlab/-/merge_requests/34', '/git/forge/gitlab.com/gitlab-org/gitlab/pull-request/34'],
		['https://gitlab.com/gitlab-org/gitlab/-/releases/v1.0.0', '/git/forge/gitlab.com/gitlab-org/gitlab/release/v1.0.0'],
		['https://gitlab.com/platform/backend/payments', '/git/forge/gitlab.com/platform%2Fbackend/payments'],
		['https://gitlab.com/platform/backend/payments.git', '/git/forge/gitlab.com/platform%2Fbackend/payments'],
		['https://gitlab.com/platform/backend/payments/-/issues/12', '/git/forge/gitlab.com/platform%2Fbackend/payments/issue/12'],
		['https://gitlab.com/platform/backend/payments/-/merge_requests/34', '/git/forge/gitlab.com/platform%2Fbackend/payments/pull-request/34'],
		['https://gitlab.com/platform/backend/payments/-/releases/v1.0.0', '/git/forge/gitlab.com/platform%2Fbackend/payments/release/v1.0.0'],
		['https://github.com/openai/codex', '/git/forge/github.com/openai/codex'],
		['https://github.com/openai/codex.git', '/git/forge/github.com/openai/codex'],
		['https://github.com/openai/codex/issues/12', '/git/forge/github.com/openai/codex/issue/12'],
		['https://github.com/openai/codex/pull/34', '/git/forge/github.com/openai/codex/pull-request/34'],
		['https://github.com/openai/codex/releases/tag/v1.0.0', '/git/forge/github.com/openai/codex/release/v1.0.0'],
		[`https://snapshot.org/#/ens.eth/proposal/0x${'AB'.repeat(32)}`, `/~/snapshot/proposal/0x${'ab'.repeat(32)}`],
		[`https://snapshot.box/#/s:ens.eth/proposal/0x${'12'.repeat(32)}?ref=search`, `/~/snapshot/proposal/0x${'12'.repeat(32)}`],
		['https://www.tally.xyz/gov/uniswap/proposal/2207450143689540901', '/~/tally/proposal/2207450143689540901'],
		['https://tally.xyz/gov/uniswap/proposal/2207450143689540901?chart=1', '/~/tally/proposal/2207450143689540901'],
		[`https://mempool.space/tx/${'AB'.repeat(32)}`, `/network/bip122:000000000019d6689c085ae165831e93/tx/${'ab'.repeat(32)}`],
		[`https://mempool.space/testnet/block/${'12'.repeat(32)}#details`, `/network/bip122:000000000933ea01ad0ee984209779ba/block/hash/${'12'.repeat(32)}`],
		['https://mempool.space/address/bc1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq', '/network/bip122:000000000019d6689c085ae165831e93/address/bc1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq'],
		[`https://mempool.space/lightning/node/02${'AB'.repeat(32)}`, `/network/bip122:000000000019d6689c085ae165831e93/nodes/02${'ab'.repeat(32)}`],
		['https://mempool.space/lightning/channel/824123456789012', '/network/bip122:000000000019d6689c085ae165831e93/channels/824123456789012'],
		['https://beaconcha.in/validator/123456', '/network/eip155:1/validator/123456'],
		['https://beaconcha.in/epoch/234567', '/network/eip155:1/epoch/234567'],
		['https://beaconcha.in/slot/7654321?tab=attestations', '/network/eip155:1/slot/7654321'],
		[`https://etherscan.io/tx/0x${'AB'.repeat(32)}`, `/network/eip155:1/tx/0x${'ab'.repeat(32)}`],
		[`https://arbiscan.io/tx/0x${'12'.repeat(32)}#eventlog`, `/network/eip155:42161/tx/0x${'12'.repeat(32)}`],
		[`https://basescan.org/address/0x${'AB'.repeat(20)}`, `/account/eip155:8453/0x${'AB'.repeat(20)}`],
		[`https://etherscan.io/token/0x${'AB'.repeat(20)}?a=0x${'12'.repeat(20)}`, `/network/eip155:1/contract/0x${'AB'.repeat(20)}`],
		['https://optimistic.etherscan.io/block/123456', '/network/eip155:10/block/123456'],
		[`https://polygonscan.com/block/0x${'AB'.repeat(32)}`, `/network/eip155:137/block/hash/0x${'ab'.repeat(32)}`],
		['eip155:1', '/network/eip155:1'],
		['eip155:1:0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045', '/account/eip155:1/0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'],
		[`eip155:8453/erc20:0x${'AB'.repeat(20)}`, `/coin-instance/8453/0x${'ab'.repeat(20)}`],
		['https://example.com/a?b=c', '/url/https%3A%2F%2Fexample.com%2Fa%3Fb%3Dc'],
		['vitalik.eth', '/ens/name/vitalik.eth'],
		['ipfs://bafybeigdyrzt5sfp7udm7hu76f7lz4gf5o7vsvixd3rqfwxq6c6azp7j7m/folder/file.json', '/ipfs/ipfs/bafybeigdyrzt5sfp7udm7hu76f7lz4gf5o7vsvixd3rqfwxq6c6azp7j7m/path/folder/file.json'],
		['ipns://docs.ipfs.tech/concepts', '/ipfs/ipns/docs.ipfs.tech/path/concepts'],
		['magnet:?xt=urn:btih:0123456789abcdef0123456789abcdef01234567', '/magnet/magnet%3A%3Fxt%3Durn%3Abtih%3A0123456789abcdef0123456789abcdef01234567'],
		[base58.encode(new Uint8Array(64).fill(7)), `/network/solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp/tx/${base58.encode(new Uint8Array(64).fill(7))}`],
		[bech32.encode('npub', bech32.toWords(new Uint8Array(32).fill(7)), false), `/nostr/profile/${'07'.repeat(32)}`],
		[bech32.encode('note', bech32.toWords(new Uint8Array(32).fill(8)), false), `/nostr/note/${'08'.repeat(32)}`],
		[`nostr:${bech32.encode('npub', bech32.toWords(new Uint8Array(32).fill(7)), false)}`, `/nostr/profile/${'07'.repeat(32)}`],
		[`nostr:${bech32.encode('note', bech32.toWords(new Uint8Array(32).fill(8)), false)}`, `/nostr/note/${'08'.repeat(32)}`],
	])('recognizes %s', (query, href) => {
		expect(entityHrefFromSearchInput(query)).toBe(href)
	})

	it('does not guess the network for a bare address', () => {
		expect(entityHrefFromSearchInput('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045')).toBeUndefined()
	})

	it.each([
		[`eip155:999999999/erc20:0x${'12'.repeat(20)}`],
		['eip155:999999999/slip44:60'],
		['eip155:1/slip44:60'],
		['eip155:1/slip44:0'],
		[`EIP155:1/erc20:0x${'12'.repeat(20)}`],
		[`eip155:1/ERC20:0x${'12'.repeat(20)}`],
		[`eip155:1/erc721:0x${'12'.repeat(20)}`],
		[`https://example.com/token/0x${'12'.repeat(20)}`],
		[`http://etherscan.io/token/0x${'12'.repeat(20)}`],
	])('does not fabricate an asset owner for unsupported authority %s', (query) => {
		expect(entityHrefFromSearchInput(query)).toBe(
			query.startsWith('http') ? `/url/${encodeURIComponent(query)}` : undefined
		)
	})

	it('does not relabel a Solana public key as a transaction signature', () => {
		expect(entityHrefFromSearchInput(base58.encode(new Uint8Array(32).fill(7)))).toBeUndefined()
	})

	it.each([
		[bech32.encode('nprofile', bech32.toWords(new Uint8Array(32).fill(7)), false)],
		[bech32.encode('npub', bech32.toWords(new Uint8Array(31).fill(7)), false)],
	])('does not relabel unsupported NIP-19 value %s', (query) => {
		expect(entityHrefFromSearchInput(query)).toBeUndefined()
	})

	it('does not relabel another AT Protocol collection as a post', () => {
		expect(entityHrefFromSearchInput(
			'at://did:plc:ewvi7nxzyoun6zhxrhs64oiz/app.bsky.feed.like/3lbm6y55c2c2a'
		)).toBeUndefined()
	})

	it.each([
		['@alice'],
		['alice@mastodon.social'],
		['@alice@localhost'],
		['@alice@mastodon.social@extra.example'],
	])('does not relabel malformed ActivityPub handle %s', (query) => {
		expect(entityHrefFromSearchInput(query)).toBeUndefined()
	})

	it.each([
		['http://mastodon.social/@alice/114000000000000000'],
		['https://mastodon.social/@alice/not-a-status-id'],
	])('does not relabel unsafe or malformed ActivityPub note URL %s', (query) => {
		expect(entityHrefFromSearchInput(query)).toBe(`/url/${encodeURIComponent(query)}`)
	})

	it.each([
		['rad:'],
		['rad:z3gqc!'],
		['rad:z3gqc/path'],
	])('does not relabel malformed Radicle RID %s', (query) => {
		expect(entityHrefFromSearchInput(query)).toBeUndefined()
	})

	it.each([
		['bzz://'],
		['swarm:///docs'],
	])('does not route malformed Swarm resource %s', (query) => {
		expect(entityHrefFromSearchInput(query)).toBeUndefined()
	})

	it.each([
		['ar://1234567890123456789012345678901234567890123'],
		['ar://short/docs'],
		['ar://1234567890123456789012345678901234567890123/'],
	])('does not route incomplete Arweave resource %s', (query) => {
		expect(entityHrefFromSearchInput(query)).toBeUndefined()
	})

	it.each([
		['did:plc:short', '/account/did:plc/short'],
		['did:plc:EWVI7NXZYOUN6ZHXrhs64oiz', '/account/did:plc/EWVI7NXZYOUN6ZHXrhs64oiz'],
		['did:web:example.com', '/account/did:web/example.com'],
	])('keeps unsupported DID %s on the generic account route', (query, href) => {
		expect(entityHrefFromSearchInput(query)).toBe(href)
	})

	it.each([
		['https://www.youtube.com/watch?v=short'],
		['https://www.youtube.com/@GoogleDevelopers'],
		['https://example.com/watch?v=dQw4w9WgXcQ'],
	])('does not relabel non-video URL %s as a YouTube video', (query) => {
		expect(entityHrefFromSearchInput(query)).toBe(`/url/${encodeURIComponent(query)}`)
	})

	it.each([
		['http://bsky.app/profile/alice.bsky.social'],
		['https://bsky.app.evil.example/profile/alice.bsky.social'],
		['https://bsky.app/profile/did:plc:short'],
		['https://bsky.app/profile/alice'],
		['https://bsky.app/profile/alice.bsky.social/post/'],
		['http://reddit.com/r/ethereum'],
		['https://reddit.com.evil.example/r/ethereum'],
		['https://reddit.com/r/ab'],
		['https://reddit.com/r/ethereum/comments/not-a-valid-id!'],
		['https://snapshot.org/#/ens.eth/proposal/not-a-proposal'],
		[`http://snapshot.org/#/ens.eth/proposal/0x${'12'.repeat(32)}`],
		[`https://snapshot.org.evil.example/#/ens.eth/proposal/0x${'12'.repeat(32)}`],
		['http://gitlab.com/gitlab-org/gitlab'],
		['https://gitlab.com.evil.example/gitlab-org/gitlab'],
		['https://gitlab.com/gitlab-org/gitlab/-/issues/not-a-number'],
		['http://www.tally.xyz/gov/uniswap/proposal/2207450143689540901'],
		['https://www.tally.xyz/gov/uniswap/proposal/not-a-number'],
		['https://www.tally.xyz.evil.example/gov/uniswap/proposal/2207450143689540901'],
		[`http://mempool.space/tx/${'12'.repeat(32)}`],
		[`https://mempool.space.evil.example/tx/${'12'.repeat(32)}`],
		['https://mempool.space/tx/not-a-transaction'],
		['https://mempool.space/address/not-an-address'],
		['https://mempool.space/lightning/node/04bad-key'],
		['https://mempool.space/lightning/channel/not-a-channel'],
		['http://beaconcha.in/validator/123456'],
		['https://beaconcha.in.evil.example/epoch/234567'],
		['https://beaconcha.in/slot/not-a-slot'],
		['http://github.com/openai/codex'],
		['https://github.com.evil.example/openai/codex'],
		['https://github.com/openai/codex/issues/not-a-number'],
		[`http://etherscan.io/tx/0x${'12'.repeat(32)}`],
		[`https://etherscan.io.evil.example/tx/0x${'12'.repeat(32)}`],
		['https://etherscan.io/block/not-a-block'],
	])('does not relabel unsafe or incomplete provider URL %s', (query) => {
		expect(entityHrefFromSearchInput(query)).toBe(`/url/${encodeURIComponent(query)}`)
	})

	it.each([
		['http://farcaster.xyz/alice/0xabcdef12'],
		['https://farcaster.xyz.evil.example/alice/0xabcdef12'],
		['https://farcaster.xyz:8443/alice/0xabcdef12'],
	])('does not relabel unsafe Farcaster URL %s', (query) => {
		expect(entityHrefFromSearchInput(query)).toBe(`/url/${encodeURIComponent(query)}`)
	})

	it.each([
		['https://x.com.evil.example/vitalikbuterin'],
		['https://x.com/i/web/status/1892305694578297172'],
		['https://twitter.com/vitalikbuterin/status/not-a-post-id'],
	])('does not relabel unsafe or malformed X URL %s', (query) => {
		expect(entityHrefFromSearchInput(query)).toBe(`/url/${encodeURIComponent(query)}`)
	})
})


describe(evmAccountCandidatesFromSearchInput, () => {
	it('offers checked-in EVM networks for a bare address', () => {
		const address = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
		const candidates = evmAccountCandidatesFromSearchInput(address)

		expect(candidates).toContainEqual({
			name: 'Ethereum Mainnet',
			environment: 'Mainnet',
			caip2: 'eip155:1',
			namespace: 'eip155',
			reference: '1',
			accountAddress: address,
		})
		expect(candidates).toContainEqual({
			name: 'Base',
			environment: 'Mainnet',
			caip2: 'eip155:8453',
			namespace: 'eip155',
			reference: '8453',
			accountAddress: address,
		})
	})

	it('preserves checked-in environment distinctions', () => {
		expect(evmAccountCandidatesFromSearchInput(
			'0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
		)).toContainEqual(expect.objectContaining({
			name: 'Ethereum Sepolia',
			environment: 'Testnet',
			caip2: 'eip155:11155111',
		}))
	})

	it('does not offer EVM networks for other unresolved input', () => {
		expect(evmAccountCandidatesFromSearchInput('0123456789abcdef')).toEqual([])
	})
})


describe(evmAddressHrefFromCoordinates, () => {
	const address = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'

	it('opens an account after both coordinates are chosen', () => {
		expect(evmAddressHrefFromCoordinates({
			query: address,
			networkCaip2: 'eip155:1',
			entityKind: 'account',
		})).toBe(`/account/eip155:1/${address}`)
	})

	it('opens a contract after both coordinates are chosen', () => {
		expect(evmAddressHrefFromCoordinates({
			query: address,
			networkCaip2: 'eip155:8453',
			entityKind: 'contract',
		})).toBe(`/network/eip155:8453/contract/${address}`)
	})

	it.each([
		[null, 'account'],
		['eip155:999999999', 'account'],
		['eip155:1', null],
		['eip155:1', 'token'],
	])('rejects unsupported coordinates %s / %s', (networkCaip2, entityKind) => {
		expect(evmAddressHrefFromCoordinates({
			query: address,
			networkCaip2,
			entityKind,
		})).toBeUndefined()
	})
})


describe(evmHashHrefFromCoordinates, () => {
	const hash = '0x31ed178236b6bc4dd6dc8c6026e9d344e39afe0dc6d832c228131ce4ee40a8ca'

	it('opens a transaction after both coordinates are chosen', () => {
		expect(evmHashHrefFromCoordinates({
			query: hash,
			networkCaip2: 'eip155:1',
			entityKind: 'transaction',
		})).toBe(`/network/eip155:1/tx/${hash}`)
	})

	it('opens a user operation after both coordinates are chosen', () => {
		expect(evmHashHrefFromCoordinates({
			query: hash,
			networkCaip2: 'eip155:8453',
			entityKind: 'user-operation',
		})).toBe(`/network/eip155:8453/user-operation/${hash}`)
	})

	it.each([
		[null, 'transaction'],
		['eip155:999999999', 'transaction'],
		['eip155:1', null],
		['eip155:1', 'block'],
	])('rejects unsupported coordinates %s / %s', (networkCaip2, entityKind) => {
		expect(evmHashHrefFromCoordinates({
			query: hash,
			networkCaip2,
			entityKind,
		})).toBeUndefined()
	})
})


describe(utxoTransactionHrefFromCoordinates, () => {
	const transactionId = '31ed178236b6bc4dd6dc8c6026e9d344e39afe0dc6d832c228131ce4ee40a8ca'

	it('offers every checked-in transaction route supported by this identifier shape', () => {
		expect(utxoTransactionNetworkChoices.map(({ network }) => network)).toEqual(
			networks
				.filter(({ ledgerModels }) => ledgerModels.includes(NetworkLedgerModel.Utxo))
				.map((network) => (
					'caip2' in network ?
						`${network.caip2.namespace}:${network.caip2.reference}`
					:
						network.slug
				))
		)
		expect(utxoTransactionNetworkChoices).toEqual(expect.arrayContaining([
			expect.objectContaining({ name: 'Bitcoin', network: 'bip122:000000000019d6689c085ae165831e93' }),
			expect.objectContaining({ name: 'Cardano', network: 'cip34:1-764824073' }),
			expect.objectContaining({ name: 'Liquid Network', network: 'liquid' }),
		]))
	})

	it('opens a canonical transaction route after its network is chosen', () => {
		expect(utxoTransactionHrefFromCoordinates({
			query: transactionId,
			networkKey: 'bip122:000000000019d6689c085ae165831e93',
		})).toBe(`/network/bip122:000000000019d6689c085ae165831e93/tx/${transactionId}`)
	})

	it.each([
		[null],
		['eip155:1'],
	])('rejects an unsupported network coordinate %s', (networkKey) => {
		expect(utxoTransactionHrefFromCoordinates({
			query: transactionId,
			networkKey,
		})).toBeUndefined()
	})
})


describe(nostrHexHrefFromCoordinates, () => {
	const hex = '31ed178236b6bc4dd6dc8c6026e9d344e39afe0dc6d832c228131ce4ee40a8ca'

	it.each([
		['profile', `/nostr/profile/${hex}`],
		['note', `/nostr/note/${hex}`],
		['article-version', `/nostr/article-version/${hex}`],
		['profile-metadata-version', `/nostr/profile-metadata-version/${hex}`],
		['reaction', `/nostr/reaction/${hex}`],
		['repost', `/nostr/repost/${hex}`],
	])('opens the canonical %s route', (entityKind, href) => {
		expect(nostrHexHrefFromCoordinates({
			query: hex,
			entityKind,
		})).toBe(href)
	})

	it.each([
		[null],
		['relay'],
	])('rejects unsupported entity kind %s', (entityKind) => {
		expect(nostrHexHrefFromCoordinates({
			query: hex,
			entityKind,
		})).toBeUndefined()
	})
})
