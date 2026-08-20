import {
	afterEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import bindings from '$/sources/MevRelay/bindings.ts'
import {
	getBuilderBlocksReceivedForRelayHost,
	getProposerPayloadDeliveredForRelayHost,
} from '$/sources/MevRelay/Rest/queries.ts'
import { Source } from '$/sources/Source.ts'

const flashbotsMainnetBinding = bindings[Source.MevRelay_Rest].find((binding) => (
	binding.target.key === 'boost-relay.flashbots.net'
))

if (flashbotsMainnetBinding == null)
	throw new Error('MevRelay REST binding missing for boost-relay.flashbots.net')

const bidTrace = {
	slot: '14917871',
	parent_hash: '0x053111d81bc7dbd54b1519b7d91723627e1681506f76240a133c5805c8ddd620',
	block_hash: '0xae76bc643d558c4dc3b2a4dd0036d2c407f538ed65583131400a1e643c96258e',
	builder_pubkey: '0x88510a78794b69e07f73b2f3ee309f78fc372dcb2ed85d5f80bbe7ebc579778f2a7d6aafbb8b00c00cb7241e1c800d65',
	proposer_pubkey: '0xace2aefa76021d068bb90b461f516d81480a557dacef9196cea762a1b9d6df03c75f895f2dc68bd12ca13060065a59aa',
	proposer_fee_recipient: '0xba1951dF0C0A52af23857c5ab48B4C43A57E7ed1',
	gas_limit: '59999943',
	gas_used: '37301926',
	value: '5316647666874603',
	num_tx: '483',
	block_number: '25680883',
} as const

const builderTipBidTrace = {
	...bidTrace,
	timestamp: '1786068803',
	timestamp_ms: '1786068803855',
	optimistic_submission: true,
} as const

const jsonResponse = (body: unknown, status = 200) => (
	new Response(JSON.stringify(body), {
		status,
		headers: {
			'content-type': 'application/json',
		},
	})
)

describe('MevRelay REST bidtrace queries', () => {
	afterEach(() => {
		vi.restoreAllMocks()
		vi.unstubAllGlobals()
	})

	it('routes proposer_payload_delivered through the registered browser HTTP proxy binding', async () => {
		const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(jsonResponse([bidTrace]))
		vi.stubGlobal('fetch', fetchMock)
		vi.stubGlobal('window', {})

		await expect(getProposerPayloadDeliveredForRelayHost('boost-relay.flashbots.net', {
			limit: 1,
			slot: 14917871,
			block_hash: bidTrace.block_hash,
		})).resolves.toEqual([bidTrace])

		const proxiedUrl = String(fetchMock.mock.calls[0]?.[0])
		expect(proxiedUrl).toMatch(
			/^\/api-proxy\/.+\/0\/https%3A%2F%2Fboost-relay\.flashbots\.net%2Frelay%2Fv1%2Fdata%2Fbidtraces%2Fproposer_payload_delivered/
		)
		expect(proxiedUrl).toContain('limit%3D1')
		expect(proxiedUrl).toContain('slot%3D14917871')
		expect(proxiedUrl).toContain(`block_hash%3D${encodeURIComponent(bidTrace.block_hash)}`)
		expect(fetchMock.mock.calls[0]?.[1]).toEqual(expect.objectContaining({
			signal: expect.any(AbortSignal),
		}))
	})

	it('hard-fails HTTP errors for proposer_payload_delivered', async () => {
		vi.spyOn(globalThis, 'fetch').mockResolvedValue(jsonResponse({ code: 500, message: 'boom' }, 500))

		await expect(getProposerPayloadDeliveredForRelayHost('boost-relay.flashbots.net', {
			limit: 1,
		})).rejects.toThrow('500')
	})

	it.each([
		['invalid row', [
			{
				...bidTrace,
				value: 'not-a-decimal',
			},
		]],
		['non-array envelope', { slot: bidTrace.slot }],
	])('fail-closes malformed proposer payloads: %s', async (_case, response) => {
		const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(jsonResponse(response))
		vi.stubGlobal('fetch', fetchMock)
		vi.stubGlobal('window', {})

		await expect(getProposerPayloadDeliveredForRelayHost('boost-relay.flashbots.net', {
			limit: 1,
		})).rejects.toThrow('invalid proposer_payload_delivered BidTrace response envelope')
	})

	it('requires a scoped filter for builder_blocks_received', async () => {
		expect(() => getBuilderBlocksReceivedForRelayHost('boost-relay.flashbots.net', {
			limit: 1,
		})).toThrow('builder_blocks_received requires')
	})

	it('rejects malformed BidTrace query coordinates before transport', async () => {
		const fetchMock = vi.fn<typeof fetch>()
		vi.stubGlobal('fetch', fetchMock)

		for (const options of [
			{ limit: 0 },
			{ limit: 1.5 },
			{ slot: '01' },
			{ slot: Number.MAX_SAFE_INTEGER + 1 },
			{ block_number: -1 },
			{ block_hash: '0x1234' },
			{ builder_pubkey: '0x1234' },
		])
			await expect(getProposerPayloadDeliveredForRelayHost(
				'boost-relay.flashbots.net',
				options
			)).rejects.toThrow('MevRelay_Rest: invalid BidTrace')
		expect(fetchMock).not.toHaveBeenCalled()
	})

	it('routes filtered builder_blocks_received tip leftovers through the proxy binding', async () => {
		const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(jsonResponse([builderTipBidTrace]))
		vi.stubGlobal('fetch', fetchMock)
		vi.stubGlobal('window', {})

		await expect(getBuilderBlocksReceivedForRelayHost('boost-relay.flashbots.net', {
			limit: 1,
			builder_pubkey: bidTrace.builder_pubkey,
		})).resolves.toEqual([builderTipBidTrace])

		const proxiedUrl = String(fetchMock.mock.calls[0]?.[0])
		expect(proxiedUrl).toContain('builder_blocks_received')
		expect(proxiedUrl).toContain(`builder_pubkey%3D${encodeURIComponent(bidTrace.builder_pubkey)}`)
	})

	it('fail-closes malformed builder_blocks_received tip envelopes', async () => {
		const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(jsonResponse([
			{
				...builderTipBidTrace,
				optimistic_submission: 'yes',
			},
		]))
		vi.stubGlobal('fetch', fetchMock)
		vi.stubGlobal('window', {})

		await expect(getBuilderBlocksReceivedForRelayHost('boost-relay.flashbots.net', {
			limit: 1,
			builder_pubkey: bidTrace.builder_pubkey,
		})).rejects.toThrow('invalid builder_blocks_received BidTrace response envelope')
	})

	it('rejects unknown relay hosts before transport', async () => {
		const fetchMock = vi.fn<typeof fetch>()
		vi.stubGlobal('fetch', fetchMock)

		await expect(getProposerPayloadDeliveredForRelayHost('relay.example.invalid', {
			limit: 1,
		})).rejects.toThrow('MevRelay_Rest: no canonical relay binding for relay.example.invalid')
		expect(fetchMock).not.toHaveBeenCalled()
	})

	it('returns an empty array when a mapped relay has no bidtraces', async () => {
		const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(jsonResponse([]))
		vi.stubGlobal('fetch', fetchMock)
		vi.stubGlobal('window', {})

		await expect(getProposerPayloadDeliveredForRelayHost('boost-relay.flashbots.net', {
			limit: 1,
		})).resolves.toEqual([])
	})

	it('fail-closes proposer_payload_delivered rows that do not match the requested slot', async () => {
		const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(jsonResponse([{
			...bidTrace,
			slot: '14917872',
		}]))
		vi.stubGlobal('fetch', fetchMock)
		vi.stubGlobal('window', {})

		await expect(getProposerPayloadDeliveredForRelayHost('boost-relay.flashbots.net', {
			limit: 1,
			slot: 14917871,
		})).rejects.toThrow('MevRelay_Rest: proposer_payload_delivered BidTrace slot does not match query')
	})

	it.each([
		['duplicate selector', [bidTrace, bidTrace]],
		['conflicting builder attribution', [
			bidTrace,
			{
				...bidTrace,
				builder_pubkey: `0x${'00'.repeat(47)}01`,
			},
		]],
	])('fail-closes proposer selector collisions: %s', async (_case, response) => {
		const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(jsonResponse(response))
		vi.stubGlobal('fetch', fetchMock)
		vi.stubGlobal('window', {})

		await expect(getProposerPayloadDeliveredForRelayHost('boost-relay.flashbots.net', {
			limit: 2,
		})).rejects.toThrow('MevRelay_Rest: proposer_payload_delivered BidTrace list contains selector collisions')
	})

	it('fail-closes builder_blocks_received rows that do not match the requested builder_pubkey', async () => {
		const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(jsonResponse([{
			...builderTipBidTrace,
			builder_pubkey: `0x${'00'.repeat(47)}01`,
		}]))
		vi.stubGlobal('fetch', fetchMock)
		vi.stubGlobal('window', {})

		await expect(getBuilderBlocksReceivedForRelayHost('boost-relay.flashbots.net', {
			limit: 1,
			builder_pubkey: bidTrace.builder_pubkey,
		})).rejects.toThrow('MevRelay_Rest: builder_blocks_received BidTrace builder_pubkey does not match query')
	})

	it('fail-closes builder_blocks_received rows with selector collisions', async () => {
		const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(jsonResponse([builderTipBidTrace, builderTipBidTrace]))
		vi.stubGlobal('fetch', fetchMock)
		vi.stubGlobal('window', {})

		await expect(getBuilderBlocksReceivedForRelayHost('boost-relay.flashbots.net', {
			limit: 2,
			builder_pubkey: bidTrace.builder_pubkey,
		})).rejects.toThrow('MevRelay_Rest: builder_blocks_received BidTrace list contains selector collisions')
	})
})
