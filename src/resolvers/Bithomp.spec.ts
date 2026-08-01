import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { networkBySlug } from '$/constants/Network.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const getAccount = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Bithomp/Rest/queries.ts', () => ({
	getAccount,
}))

const { default: bithompResolvers } = await import('$/resolvers/Bithomp.ts')

const resolver = bithompResolvers.resolvers[0]
const account = {
	$network: {
		caip2: networkBySlug.xrpl.caip2,
	},
	account: 'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh',
}
const publicEnv = {
	PUBLIC_BITHOMP_API_KEY: 'configured token',
}
const context = {
	filters: [],
	sorts: [],
	pagination: {},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv,
}

describe('Bithomp XRPL account resolver', () => {
	beforeEach(() => {
		getAccount.mockReset()
		getAccount.mockResolvedValue({
			address: account.account,
			username: 'not modeled',
			service: {
				name: 'not modeled',
				domain: 'not-modeled.example',
			},
			ledgerInfo: {
				ledger: 98_765_432,
				ledgerTimestamp: 1_784_783_358,
				balance: '900719925474099312345',
				flags: {
					disableMaster: true,
				},
				ownerCount: 3,
				sequence: 42,
				domain: 'not-modeled.example',
			},
		})
	})

	it('materializes only the modeled account observation from the xrpl:0 response', async () => {
		const timestamps = await resolver.resolve.NetworkAccount.resolve(account, context)

		expect(resolver.resolve.NetworkAccount.appliesTo).toEqual([{
			$network: {
				caip2: networkBySlug.xrpl.caip2,
			},
		}])
		expect(resolver.projections.$$timestamps(timestamps)).toEqual([{
			[EntityMetaKey.Selector]: {
				$account: account,
				ledgerIndex: 98_765_432n,
				source: Source.Bithomp,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.XrplAccount_Timestamp, [], 'timestampMs')]: 1_784_783_358_000,
				[entityFieldAddressKey(EntityType.XrplAccount_Timestamp, [], 'balanceDrops')]: 900719925474099312345n,
				[entityFieldAddressKey(EntityType.XrplAccount_Timestamp, [], 'ownerCount')]: 3,
				[entityFieldAddressKey(EntityType.XrplAccount_Timestamp, [], 'sequence')]: 42,
			},
		}])
		expect(getAccount).toHaveBeenCalledOnce()
		expect(getAccount).toHaveBeenCalledWith(publicEnv, {
			address: account.account,
		})
		expect(bithompResolvers.resolvers).toHaveLength(1)
	})

	it('rejects every network except xrpl:0 before transport', async () => {
		await expect(resolver.resolve.NetworkAccount.resolve({
			...account,
			$network: {
				caip2: networkBySlug.ethereum.caip2,
			},
		}, context)).rejects.toThrow('unsupported network')
		expect(getAccount).not.toHaveBeenCalled()
	})

	it('rejects responses for another account', async () => {
		getAccount.mockResolvedValueOnce({
			address: 'rAnotherAccount',
			ledgerInfo: {
				ledger: 1,
				ledgerTimestamp: 1,
				balance: '1',
				ownerCount: 0,
				sequence: 0,
			},
		})

		await expect(resolver.resolve.NetworkAccount.resolve(account, context))
			.rejects.toThrow('does not match the subject')
	})

	it.each([
		{
			name: 'ledger index',
			ledgerInfo: {
				ledger: -1,
				ledgerTimestamp: 1,
				balance: '1',
				ownerCount: 0,
				sequence: 0,
			},
		},
		{
			name: 'ledger timestamp',
			ledgerInfo: {
				ledger: 1,
				ledgerTimestamp: Number.MAX_SAFE_INTEGER,
				balance: '1',
				ownerCount: 0,
				sequence: 0,
			},
		},
		{
			name: 'XRP balance',
			ledgerInfo: {
				ledger: 1,
				ledgerTimestamp: 1,
				balance: '1.5',
				ownerCount: 0,
				sequence: 0,
			},
		},
		{
			name: 'account counters',
			ledgerInfo: {
				ledger: 1,
				ledgerTimestamp: 1,
				balance: '1',
				ownerCount: -1,
				sequence: 0,
			},
		},
	])('rejects malformed $name', async ({ name, ledgerInfo }) => {
		getAccount.mockResolvedValueOnce({
			address: account.account,
			ledgerInfo,
		})

		await expect(resolver.resolve.NetworkAccount.resolve(account, context))
			.rejects.toThrow(`malformed ${name}`)
	})
})
