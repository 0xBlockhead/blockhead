import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import bindings from '$/sources/NostrRelay/bindings.ts'
import { Source } from '$/sources/Source.ts'

const sourceFetch = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/_runtime/http.ts')>(),
	sourceFetch,
}))

const { fetchRelayInformation } = await import('$/sources/NostrRelay/Http/queries.ts')

const boundRelayUrl = bindings[Source.NostrRelay_Nip11_Http][0].target.key

describe('NostrRelay NIP-11 Http transport', () => {
	beforeEach(() => {
		sourceFetch.mockReset()
	})

	it('has at least one NIP-11 binding', () => {
		expect(boundRelayUrl).toBeTypeOf('string')
		expect(bindings[Source.NostrRelay_Nip11_Http].length).toBeGreaterThan(0)
	})

	it('accepts a minimal valid NIP-11 document', async () => {
		sourceFetch.mockResolvedValue({
			ok: true,
			json: async () => ({
				name: 'relay.example',
				supported_nips: [
					1,
					11,
				],
				limitation: {
					auth_required: false,
					max_limit: 500,
				},
			}),
		})

		await expect(
			fetchRelayInformation({
				relayUrl: boundRelayUrl,
			})
		).resolves.toEqual({
			name: 'relay.example',
			supported_nips: [
				1,
				11,
			],
			limitation: {
				auth_required: false,
				max_limit: 500,
			},
		})
	})

	it('accepts NIP-11 transport leftovers without requiring enrolled projection', async () => {
		sourceFetch.mockResolvedValue({
			ok: true,
			json: async () => ({
				name: 'relay.example',
				language_tags: [
					'en',
					'ja',
				],
				relay_countries: [
					'US',
					'JP',
				],
				tags: [
					'nsfw',
					'media',
				],
			}),
		})

		await expect(
			fetchRelayInformation({
				relayUrl: boundRelayUrl,
			})
		).resolves.toEqual({
			name: 'relay.example',
			language_tags: [
				'en',
				'ja',
			],
			relay_countries: [
				'US',
				'JP',
			],
			tags: [
				'nsfw',
				'media',
			],
		})
	})

	it('fail-closes malformed language_tags leftovers', async () => {
		sourceFetch.mockResolvedValue({
			ok: true,
			json: async () => ({
				language_tags: 'en',
			}),
		})

		await expect(
			fetchRelayInformation({
				relayUrl: boundRelayUrl,
			})
		).rejects.toThrow('NostrRelay_Nip11_Http: invalid NIP-11 response envelope')
	})

	it('fail-closes malformed supported_nips', async () => {
		sourceFetch.mockResolvedValue({
			ok: true,
			json: async () => ({
				supported_nips: '1,11',
			}),
		})

		await expect(
			fetchRelayInformation({
				relayUrl: boundRelayUrl,
			})
		).rejects.toThrow('NostrRelay_Nip11_Http: invalid NIP-11 response envelope')
	})

	it('fail-closes malformed fee rows', async () => {
		sourceFetch.mockResolvedValue({
			ok: true,
			json: async () => ({
				fees: {
					admission: [
						{
							amount: '1000',
							unit: 'msats',
						},
					],
				},
			}),
		})

		await expect(
			fetchRelayInformation({
				relayUrl: boundRelayUrl,
			})
		).rejects.toThrow('NostrRelay_Nip11_Http: invalid NIP-11 response envelope')
	})

	it('throws when the relay has no binding', async () => {
		await expect(
			fetchRelayInformation({
				relayUrl: 'wss://not-bound.example',
			})
		).rejects.toThrow('NostrRelay_Nip11_Http: source binding is missing for wss://not-bound.example')
		expect(sourceFetch).not.toHaveBeenCalled()
	})

	it('throws on non-OK HTTP status', async () => {
		sourceFetch.mockResolvedValue({
			ok: false,
			status: 502,
		})

		await expect(
			fetchRelayInformation({
				relayUrl: boundRelayUrl,
			})
		).rejects.toThrow('NostrRelay_Nip11_Http: request failed with 502')
	})

	it('fails closed on duplicate supported_nips', async () => {
		sourceFetch.mockResolvedValue({
			ok: true,
			json: async () => ({
				supported_nips: [
					1,
					11,
					11,
				],
			}),
		})

		await expect(
			fetchRelayInformation({
				relayUrl: boundRelayUrl,
			})
		).rejects.toThrow('NostrRelay_Nip11_Http: duplicate supported_nips')
	})

	it('fails closed on duplicate tags', async () => {
		sourceFetch.mockResolvedValue({
			ok: true,
			json: async () => ({
				tags: [
					'media',
					'media',
				],
			}),
		})

		await expect(
			fetchRelayInformation({
				relayUrl: boundRelayUrl,
			})
		).rejects.toThrow('NostrRelay_Nip11_Http: duplicate tags')
	})

	it('fails closed on negative or fractional native relay limitations', async () => {
		sourceFetch.mockResolvedValueOnce({
			ok: true,
			json: async () => ({
				limitation: {
					max_limit: -1,
				},
			}),
		})

		await expect(fetchRelayInformation({
			relayUrl: boundRelayUrl,
		})).rejects.toThrow('NostrRelay_Nip11_Http: invalid native limitation value')

		sourceFetch.mockResolvedValueOnce({
			ok: true,
			json: async () => ({
				limitation: {
					created_at_upper_limit: 1.5,
				},
			}),
		})

		await expect(fetchRelayInformation({
			relayUrl: boundRelayUrl,
		})).rejects.toThrow('NostrRelay_Nip11_Http: invalid native limitation value')
	})

	it('fails closed on reversed created_at clock limits', async () => {
		sourceFetch.mockResolvedValue({
			ok: true,
			json: async () => ({
				limitation: {
					created_at_lower_limit: 1_000_000,
					created_at_upper_limit: 100,
				},
			}),
		})

		await expect(
			fetchRelayInformation({
				relayUrl: boundRelayUrl,
			})
		).rejects.toThrow('NostrRelay_Nip11_Http: reversed created_at clock limits')
	})
})
