import { beforeEach, describe, expect, it, vi } from 'vitest'

import { TonAccountSelector } from '$/schema/TonAccount.ts'
import { sourceProviderDefinitions } from '$/sources/$sourceProviders.ts'
import { Source } from '$/sources/Source.ts'
import accountFixtureJson from '$/sources/TonApi/Rest/fixtures/account.json'
import type { TonApiAccount } from '$/sources/TonApi/Rest/types.ts'

const { sourceGetJson } = vi.hoisted(() => ({
	sourceGetJson: vi.fn(),
}))

vi.mock('$/sources/_runtime/http.ts', async (importOriginal) => ({
	...await importOriginal(),
	sourceGetJson,
}))

const { getAccount } = await import('$/sources/TonApi/Rest/queries.ts')
const { default: tonApiResolvers } = await import('$/resolvers/TonApi-Rest.ts')

const accountFixture = {
	...accountFixtureJson,
	status: 'active',
} satisfies TonApiAccount

const tonApiBinding = sourceProviderDefinitions
	.flatMap((provider) => provider.bindings)
	.find((binding) => binding.source === Source.TonApi_Rest)

if (tonApiBinding == null)
	throw new Error('TonApi-Rest spec missing source binding')

const accountResolver = tonApiResolvers.resolvers[0]

const resolverContext = {
	filters: [],
	sorts: [],
	pagination: {},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}

describe('TonAPI account transport', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('uses the selector address in the typed account endpoint', async () => {
		sourceGetJson.mockResolvedValueOnce(accountFixture)

		await expect(getAccount(tonApiBinding, 'EQ/a+b')).resolves.toEqual(accountFixture)
		expect(sourceGetJson).toHaveBeenCalledWith(
			tonApiBinding,
			'https://tonapi.io/v2/accounts/EQ%2Fa%2Bb'
		)
	})

	it('rejects malformed account wire data', async () => {
		sourceGetJson.mockResolvedValueOnce({
			...accountFixture,
			balance: 1,
		})

		await expect(getAccount(tonApiBinding, 'EQ/a+b')).rejects.toThrow()
	})

	it('rejects a balance that cannot be represented as bigint', async () => {
		sourceGetJson.mockResolvedValueOnce({
			...accountFixture,
			balance: '1.5',
		})

		await expect(getAccount(tonApiBinding, 'EQ/a+b')).rejects.toThrow('non-negative decimal integer')
	})
})

describe('TonAPI account resolver', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('maps canonical raw address coordinates for NetworkAddress', async () => {
		sourceGetJson.mockResolvedValueOnce(accountFixture)

		await expect(accountResolver.resolve[TonAccountSelector.NetworkAddress](
			{
				$network: {
					slug: 'ton',
				},
				address: 'EQ/a+b',
			},
			resolverContext
		)).resolves.toEqual({
			workchain: 0,
			addressHash: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
		})
	})

	it('fails closed when TonAPI does not return a canonical raw address', async () => {
		sourceGetJson.mockResolvedValueOnce({
			...accountFixture,
			address: 'EQ_not_a_raw_address',
		})

		await expect(accountResolver.resolve[TonAccountSelector.NetworkAddress](
			{
				$network: {
					slug: 'ton',
				},
				address: 'EQ/a+b',
			},
			resolverContext
		)).rejects.toThrow('malformed raw address')
	})

	it('fails closed on an unsafe workchain coordinate', async () => {
		sourceGetJson.mockResolvedValueOnce({
			...accountFixture,
			address: '9007199254740992:0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
		})

		await expect(accountResolver.resolve[TonAccountSelector.NetworkAddress](
			{
				$network: {
					slug: 'ton',
				},
				address: 'EQ/a+b',
			},
			resolverContext
		)).rejects.toThrow('malformed workchain')
	})

	it('rejects a non-TON parent before transport', async () => {
		await expect(accountResolver.resolve[TonAccountSelector.NetworkAddress](
			{
				$network: {
					slug: 'ethereum',
				},
				address: 'EQ/a+b',
			},
			resolverContext
		)).rejects.toThrow('unsupported network')
		expect(sourceGetJson).not.toHaveBeenCalled()
	})
})
