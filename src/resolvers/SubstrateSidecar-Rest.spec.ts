import { beforeEach, describe, expect, it, vi } from 'vitest'

import { networkBySlug } from '$/constants/Network.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const sourceFetch = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', () => ({
	firstHttpUrlForBinding: () => 'http://127.0.0.1:8080',
	sourceFetch,
	sourceGetJson: async (_binding: unknown, url: string) => {
		const response = await sourceFetch(_binding, url)
		return response.json()
	},
	sourceGetText: vi.fn(),
}))

const { default: sidecar } = await import('$/resolvers/SubstrateSidecar-Rest.ts')

const accountResolver = sidecar.resolvers.find((
	resolver
): resolver is Extract<
	typeof sidecar.resolvers[number],
	{ entityType: EntityType.PolkadotAccount }
> => resolver.entityType === EntityType.PolkadotAccount)

if (accountResolver == null)
	throw new Error('Substrate Sidecar account resolver is missing')

const account = {
	$network: {
		caip2: networkBySlug.polkadot.caip2,
	},
	accountId: '12dK7dBTwDJcb4VGBag9zRrwWBPq9VtfmDDbVQCM1jVweTVm',
}
const context = {
	filters: [],
	sorts: [],
	pagination: {},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}
const balanceInfo = {
	at: {
		hash: '0xFINALIZED_BLOCK_HASH',
		height: '20000000',
	},
	nonce: '9007199254740993',
	tokenSymbol: 'DOT',
	free: '123456789012345678901234',
	reserved: '0',
	frozen: '0',
	transferable: '123456789012345678901234',
}

describe('Substrate Sidecar Polkadot account resolver', () => {
	beforeEach(() => {
		sourceFetch.mockReset()
		vi.spyOn(Date, 'now').mockReturnValue(1_753_000_100_000)
		sourceFetch.mockResolvedValue(new Response(JSON.stringify(balanceInfo)))
	})

	it('preserves the SS58 subject and lossless live state values', async () => {
		const snapshot = await accountResolver.resolve[
			'NetworkAccountId'
		].resolve(account, context)
		const timestamps = accountResolver.projections.$$timestamps(snapshot)

		expect(sourceFetch.mock.calls[0][1]).toBe(
			`http://127.0.0.1:8080/accounts/${account.accountId}/balance-info`
		)
		expect(timestamps).toEqual([{
			[EntityMetaKey.Selector]: {
				$account: account,
				timestampMs: 1_753_000_100_000,
				source: Source.SubstrateSidecar_Rest,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.PolkadotAccount_Timestamp, [], '$account')]: {
					[EntityMetaKey.Selector]: account,
				},
				[entityFieldAddressKey(EntityType.PolkadotAccount_Timestamp, [], 'timestampMs')]: 1_753_000_100_000,
				[entityFieldAddressKey(EntityType.PolkadotAccount_Timestamp, [], 'source')]: Source.SubstrateSidecar_Rest,
				[entityFieldAddressKey(EntityType.PolkadotAccount_Timestamp, [], 'nonce')]: 9_007_199_254_740_993n,
				[entityFieldAddressKey(EntityType.PolkadotAccount_Timestamp, [], 'freeBalancePlancks')]: 123_456_789_012_345_678_901_234n,
			},
		}])
	})

	it('rejects unsupported networks before transport', async () => {
		await expect(accountResolver.resolve[
			'NetworkAccountId'
		].resolve({
			...account,
			$network: {
				caip2: networkBySlug.ethereum.caip2,
			},
		}, context)).rejects.toThrow('unsupported network')
		expect(sourceFetch).not.toHaveBeenCalled()
	})

	it('fails closed on malformed state identities and amounts', async () => {
		for (const response of [
			{
				...balanceInfo,
				at: {
					...balanceInfo.at,
					height: '-1',
				},
			},
			{
				...balanceInfo,
				nonce: '1.5',
			},
			{
				...balanceInfo,
				free: '-1',
			},
			{
				...balanceInfo,
				reserved: 'not-an-amount',
			},
		]) {
			sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify(response)))
			await expect(accountResolver.resolve[
				'NetworkAccountId'
			].resolve(account, context)).rejects.toThrow('malformed account')
		}
	})
})
