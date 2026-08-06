import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import bindings from '$/sources/NostrRelay/bindings.ts'
import { Source } from '$/sources/Source.ts'

const fetchRelayInformation = vi.hoisted(() => vi.fn())

vi.mock('$/sources/NostrRelay/Http/queries.ts', () => ({
	fetchRelayInformation,
}))

const { default: nostrRelayNip11Http } = await import('$/resolvers/NostrRelay-Nip11-Http.ts')

const boundRelayUrl = bindings[Source.NostrRelay_Nip11_Http][0]?.target.key

const timestampResolver = nostrRelayNip11Http.resolvers.find((resolver) => (
	resolver.entityType === EntityType.NostrRelay_Timestamp
))

describe('NostrRelay NIP-11 Http resolver', () => {
	beforeEach(() => {
		fetchRelayInformation.mockReset()
	})

	it('registers under NostrRelay_Nip11_Http', () => {
		expect(nostrRelayNip11Http.source).toBe(Source.NostrRelay_Nip11_Http)
		expect(timestampResolver).toBeDefined()
	})

	it('projects enrolled NIP-11 observation fields when reachable', async () => {
		if (timestampResolver == null || boundRelayUrl == null)
			throw new Error('missing NIP-11 timestamp resolver or binding')

		fetchRelayInformation.mockResolvedValue({
			name: 'relay.example',
			description: 'test relay',
			software: 'strfry',
			version: '1.0.0',
			pubkey: 'a'.repeat(64),
			contact: 'mailto:ops@example.com',
			supported_nips: [
				1,
				11,
			],
			limitation: {
				max_limit: 500,
				auth_required: false,
				payment_required: true,
			},
			payments_url: 'https://example.com/pay',
			terms_of_service: 'https://example.com/tos',
			icon: 'https://example.com/icon.png',
			banner: 'https://example.com/banner.png',
			fees: {
				admission: [
					{
						amount: 1000,
						unit: 'msats',
					},
				],
			},
		})

		const snapshot = await timestampResolver.resolve.RelayTimestampMsSource.resolve({
			$relay: {
				relayUrl: boundRelayUrl,
			},
			timestampMs: 1_700_000_000_000,
			source: Source.NostrRelay_Nip11_Http,
		}, {
			filters: [],
			sorts: [],
			pagination: {
				limit: 16,
			},
			selectorKeys: [],
			parentSelectorKeys: [],
			sources: [],
			publicEnv: {},
		})

		expect(timestampResolver.projections.reachable(snapshot)).toBe(true)
		expect(timestampResolver.projections.name(snapshot)).toBe('relay.example')
		expect(timestampResolver.projections.description(snapshot)).toBe('test relay')
		expect(timestampResolver.projections.software(snapshot)).toBe('strfry')
		expect(timestampResolver.projections.version(snapshot)).toBe('1.0.0')
		expect(timestampResolver.projections.supportedNips(snapshot)).toEqual([
			1,
			11,
		])
		expect(timestampResolver.projections.limitation(snapshot)).toEqual({
			maxLimit: 500,
			authenticationRequired: false,
			paymentRequired: true,
		})
		expect(timestampResolver.projections.isPaid(snapshot)).toBe(true)
		expect(timestampResolver.projections.paymentsUrl(snapshot)).toBe('https://example.com/pay')
		expect(timestampResolver.projections.fees(snapshot)).toEqual({
			admission: [
				{
					amount: 1000,
					unit: 'msats',
				},
			],
		})
		expect(timestampResolver.projections.$relay(snapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				relayUrl: boundRelayUrl.replace(/\/$/, ''),
			},
		})
	})

	it('marks unreachable when NIP-11 transport fails', async () => {
		if (timestampResolver == null || boundRelayUrl == null)
			throw new Error('missing NIP-11 timestamp resolver or binding')

		fetchRelayInformation.mockRejectedValue(new Error('NostrRelay_Nip11_Http: invalid NIP-11 response envelope'))

		const snapshot = await timestampResolver.resolve.RelayTimestampMsSource.resolve({
			$relay: {
				relayUrl: boundRelayUrl,
			},
			timestampMs: 1_700_000_000_000,
			source: Source.NostrRelay_Nip11_Http,
		}, {
			filters: [],
			sorts: [],
			pagination: {
				limit: 16,
			},
			selectorKeys: [],
			parentSelectorKeys: [],
			sources: [],
			publicEnv: {},
		})

		expect(timestampResolver.projections.reachable(snapshot)).toBe(false)
		expect(timestampResolver.projections.error(snapshot)).toBe('NostrRelay_Nip11_Http: invalid NIP-11 response envelope')
		expect(timestampResolver.projections.name(snapshot)).toBeUndefined()
	})
})
