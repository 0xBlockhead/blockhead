import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { entityFieldAddressKey, EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import bindings from '$/sources/NostrRelay/bindings.ts'
import { Source } from '$/sources/Source.ts'

const fetchRelayInformation = vi.hoisted(() => vi.fn())

vi.mock('$/sources/NostrRelay/Http/queries.ts', () => ({
	fetchRelayInformation,
}))

const { default: nostrRelayNip11Http } = await import('$/resolvers/NostrRelay-Nip11-Http.ts')

const boundRelayUrl = bindings[Source.NostrRelay_Nip11_Http][0].target.key

const [relayResolver] = nostrRelayNip11Http.resolvers

describe('NostrRelay NIP-11 Http resolver', () => {
	beforeEach(() => {
		fetchRelayInformation.mockReset()
	})

	it('rejects relay URL aliases that would discard credentials or request components', async () => {
		await expect(relayResolver.resolve.RelayUrl.resolve({
			relayUrl: 'wss://relay.example/?profile=public',
		})).rejects.toThrow('relay url must not include credentials, query, or fragment')
		await expect(relayResolver.resolve.RelayUrl.resolve({
			relayUrl: 'wss://ops:secret@relay.example/',
		})).rejects.toThrow('relay url must not include credentials, query, or fragment')
		await expect(relayResolver.resolve.RelayUrl.resolve({
			relayUrl: 'wss://relay.example/#metadata',
		})).rejects.toThrow('relay url must not include credentials, query, or fragment')
	})

	it('projects enrolled NIP-11 observation fields when reachable', async () => {
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

		const relay = await relayResolver.resolve.RelayUrl.resolve({ relayUrl: boundRelayUrl })
		const snapshot = relay.$$timestamps[0]
		const fields = snapshot[EntityMetaKey.Fields]

		expect(fields[entityFieldAddressKey(EntityType.NostrRelay_Timestamp, [], 'reachable')]).toBe(true)
		expect(fields[entityFieldAddressKey(EntityType.NostrRelay_Timestamp, [], 'name')]).toBe('relay.example')
		expect(fields[entityFieldAddressKey(EntityType.NostrRelay_Timestamp, [], 'description')]).toBe('test relay')
		expect(fields[entityFieldAddressKey(EntityType.NostrRelay_Timestamp, [], 'software')]).toBe('strfry')
		expect(fields[entityFieldAddressKey(EntityType.NostrRelay_Timestamp, [], 'version')]).toBe('1.0.0')
		expect(fields[entityFieldAddressKey(EntityType.NostrRelay_Timestamp, [], 'supportedNips')]).toEqual([
			1,
			11,
		])
		expect(fields[entityFieldAddressKey(EntityType.NostrRelay_Timestamp, [], 'limitation')]).toEqual({
			maxLimit: 500,
			authenticationRequired: false,
			paymentRequired: true,
		})
		expect(fields[entityFieldAddressKey(EntityType.NostrRelay_Timestamp, [], 'isPaid')]).toBe(true)
		expect(fields[entityFieldAddressKey(EntityType.NostrRelay_Timestamp, [], 'paymentsUrl')]).toBe('https://example.com/pay')
		expect(fields[entityFieldAddressKey(EntityType.NostrRelay_Timestamp, [], 'fees')]).toEqual({
			admission: [
				{
					amount: 1000,
					unit: 'msats',
				},
			],
		})
		expect(snapshot[EntityMetaKey.Selector].$relay).toEqual({
				relayUrl: boundRelayUrl.replace(/\/$/, ''),
		})
		expect(snapshot).not.toHaveProperty('language_tags')
		expect(snapshot).not.toHaveProperty('relay_countries')
		expect(snapshot).not.toHaveProperty('tags')
		expect(snapshot).not.toHaveProperty('languageTags')
		expect(snapshot).not.toHaveProperty('relayCountries')
	})

	it('keeps NIP-11 language_tags / relay_countries / tags unprojected', async () => {
		fetchRelayInformation.mockResolvedValue({
			name: 'relay.example',
			language_tags: [
				'en',
			],
			relay_countries: [
				'US',
			],
			tags: [
				'nsfw',
			],
		})

		const snapshot = (await relayResolver.resolve.RelayUrl.resolve({ relayUrl: boundRelayUrl })).$$timestamps[0]
		expect(snapshot[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.NostrRelay_Timestamp, [], 'name')]).toBe('relay.example')
		expect(snapshot).not.toHaveProperty('language_tags')
		expect(snapshot).not.toHaveProperty('relay_countries')
		expect(snapshot).not.toHaveProperty('tags')
		expect(Object.keys(snapshot[EntityMetaKey.Fields])).not.toContain('languageTags')
		expect(Object.keys(snapshot[EntityMetaKey.Fields])).not.toContain('relayCountries')
		expect(Object.keys(snapshot[EntityMetaKey.Fields])).not.toContain('tags')
	})

	it('does not register a direct NostrRelay_Timestamp resolver', () => {
		const resolvers: readonly { entityType: EntityType }[] = nostrRelayNip11Http.resolvers
		expect(resolvers.some((candidate) => (
			candidate.entityType === EntityType.NostrRelay_Timestamp
		))).toBe(false)
	})

	it('embeds unreachable failure evidence on the parent relay read', async () => {
		fetchRelayInformation.mockRejectedValue(new Error('relay unavailable'))

		const relay = await relayResolver.resolve.RelayUrl.resolve({ relayUrl: boundRelayUrl })
		expect(relay.$$timestamps).toEqual([{
			[EntityMetaKey.Selector]: {
				$relay: {
					relayUrl: boundRelayUrl.replace(/\/$/, ''),
				},
				timestampMs: expect.any(Number),
				source: Source.NostrRelay_Nip11_Http,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.NostrRelay_Timestamp, [], 'reachable')]: false,
				[entityFieldAddressKey(EntityType.NostrRelay_Timestamp, [], 'error')]: 'relay unavailable',
			},
		}])
	})
})
