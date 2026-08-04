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
const getAmm = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Bithomp/Rest/queries.ts', () => ({
	getAccount,
	getAmm,
}))

const { default: bithompResolvers } = await import('$/resolvers/Bithomp.ts')

const accountResolver = bithompResolvers.resolvers[0]
const ammResolver = bithompResolvers.resolvers[1]
const account = {
	$network: {
		caip2: networkBySlug.xrpl.caip2,
	},
	account: 'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh',
}
const amm = {
	$network: {
		caip2: networkBySlug.xrpl.caip2,
	},
	ammAccount: 'rUGqgPbzKFVsSkTYUk4hdRoPwTaLv1iSDS',
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
		const timestamps = await accountResolver.resolve.NetworkAccount.resolve(account, context)

		expect(accountResolver.resolve.NetworkAccount.appliesTo).toEqual([{
			$network: {
				caip2: networkBySlug.xrpl.caip2,
			},
		}])
		expect(accountResolver.projections.$$timestamps(timestamps)).toEqual([{
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
	})

	it('rejects every network except xrpl:0 before transport', async () => {
		await expect(accountResolver.resolve.NetworkAccount.resolve({
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

		await expect(accountResolver.resolve.NetworkAccount.resolve(account, context))
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

		await expect(accountResolver.resolve.NetworkAccount.resolve(account, context))
			.rejects.toThrow(`malformed ${name}`)
	})
})

describe('Bithomp XRPL AMM resolver', () => {
	beforeEach(() => {
		getAmm.mockReset()
		getAmm.mockResolvedValue({
			ammID: 'C55741BDA5F2590DD0F0EF7F620F133C0B73C382A8987068CA2DD886D99FD3B5',
			account: amm.ammAccount,
			amount: '13820630640',
			amount2: {
				currency: '7853504543544152000000000000000000000000',
				issuer: 'rh5jzTCdMRCVjQ7LT6zucjezC47KATkuvv',
				value: '173068.8207730273',
			},
			updatedAt: 1_713_700_900,
			updatedLedgerIndex: 87_461_194,
			tradingFee: 290,
			lpTokenBalance: {
				currency: '03DD35D1879DBE4FE3290B911A14875DE6534DFD',
				issuer: amm.ammAccount,
				value: '6591411.572091643',
			},
			auctionSlot: {
				account: 'rpGhdshAMiVYPei3FtusVTPndijbpdATna',
				discountedFee: 29,
				expiration: 1_713_301_051,
			},
			voteSlots: [{
				account: 'rpSw2Z5Rj7envE1reaD3K1As1pcjND4n7J',
				tradingFee: 300,
				voteWeight: 17_649,
			}],
		})
	})

	it('materializes the AMM identity and latest observation from the pool response', async () => {
		const snapshot = await ammResolver.resolve.NetworkAmmAccount.resolve(amm, context)

		expect(ammResolver.resolve.NetworkAmmAccount.appliesTo).toEqual([{
			$network: {
				caip2: networkBySlug.xrpl.caip2,
			},
		}])
		expect(ammResolver.projections.assetCurrency(snapshot)).toBe('XRP')
		expect(ammResolver.projections.asset2Currency(snapshot)).toBe('7853504543544152000000000000000000000000')
		expect(ammResolver.projections.asset2Issuer(snapshot)).toBe('rh5jzTCdMRCVjQ7LT6zucjezC47KATkuvv')
		expect(ammResolver.projections.lpTokenCurrency(snapshot)).toBe('03DD35D1879DBE4FE3290B911A14875DE6534DFD')
		expect(ammResolver.projections.$$timestamps(snapshot)).toEqual([{
			[EntityMetaKey.Selector]: {
				$amm: amm,
				ledgerIndex: 87_461_194n,
				source: Source.Bithomp,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.XrplAmm_Timestamp, [], 'timestampMs')]: 1_713_700_900_000,
				[entityFieldAddressKey(EntityType.XrplAmm_Timestamp, [], 'assetAmount')]: '13820630640',
				[entityFieldAddressKey(EntityType.XrplAmm_Timestamp, [], 'asset2Amount')]: '173068.8207730273',
				[entityFieldAddressKey(EntityType.XrplAmm_Timestamp, [], 'lpTokenBalance')]: '6591411.572091643',
				[entityFieldAddressKey(EntityType.XrplAmm_Timestamp, [], 'tradingFee')]: 290,
				[entityFieldAddressKey(EntityType.XrplAmm_Timestamp, [], 'auctionSlot')]: {
					account: 'rpGhdshAMiVYPei3FtusVTPndijbpdATna',
					discountedFee: 29,
					expiration: 1_713_301_051,
				},
				[entityFieldAddressKey(EntityType.XrplAmm_Timestamp, [], 'voteSlots')]: [{
					account: 'rpSw2Z5Rj7envE1reaD3K1As1pcjND4n7J',
					tradingFee: 300,
					voteWeight: 17_649,
				}],
			},
		}])
		expect(getAmm).toHaveBeenCalledOnce()
		expect(getAmm).toHaveBeenCalledWith(publicEnv, {
			id: amm.ammAccount,
		})
		expect(bithompResolvers.resolvers).toHaveLength(2)
	})

	it('rejects every network except xrpl:0 before transport', async () => {
		await expect(ammResolver.resolve.NetworkAmmAccount.resolve({
			...amm,
			$network: {
				caip2: networkBySlug.ethereum.caip2,
			},
		}, context)).rejects.toThrow('unsupported network')
		expect(getAmm).not.toHaveBeenCalled()
	})

	it('rejects responses for another amm account', async () => {
		getAmm.mockResolvedValueOnce({
			account: 'rAnotherAmm',
			amount: '1',
			amount2: {
				currency: 'USD',
				issuer: 'rIssuer',
				value: '1',
			},
			updatedAt: 1,
			updatedLedgerIndex: 1,
		})

		await expect(ammResolver.resolve.NetworkAmmAccount.resolve(amm, context))
			.rejects.toThrow('does not match the subject')
	})

	it.each([
		{
			name: 'XRP asset amount',
			patch: {
				amount: '1.5',
			},
		},
		{
			name: 'issued asset',
			patch: {
				amount2: {
					currency: '',
					value: '1',
				},
			},
		},
		{
			name: 'amm ledger index',
			patch: {
				updatedLedgerIndex: -1,
			},
		},
		{
			name: 'amm timestamp',
			patch: {
				updatedAt: Number.MAX_SAFE_INTEGER,
			},
		},
	])('rejects malformed $name', async ({ name, patch }) => {
		getAmm.mockResolvedValueOnce({
			account: amm.ammAccount,
			amount: '1',
			amount2: {
				currency: 'USD',
				issuer: 'rIssuer',
				value: '1',
			},
			updatedAt: 1,
			updatedLedgerIndex: 1,
			...patch,
		})

		await expect(ammResolver.resolve.NetworkAmmAccount.resolve(amm, context))
			.rejects.toThrow(`malformed ${name}`)
	})
})
