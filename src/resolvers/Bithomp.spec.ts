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
const getAccountTransactions = vi.hoisted(() => vi.fn())
const getAmm = vi.hoisted(() => vi.fn())
const getAmms = vi.hoisted(() => vi.fn())
const getLedgerEntry = vi.hoisted(() => vi.fn())
const getTrustlines = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Bithomp/Rest/queries.ts', () => ({
	getAccount,
	getAccountTransactions,
	getAmm,
	getAmms,
	getLedgerEntry,
	getTrustlines,
}))

const { default: bithompResolvers } = await import('$/resolvers/Bithomp.ts')

const resolverFor = (
	entityType: EntityType,
	projectionKey?: string
) => {
	const resolver = bithompResolvers.resolvers.find((candidate) => (
		candidate.entityType === entityType
		&& (
			projectionKey == null
			|| projectionKey in candidate.projections
			|| (
				'Xrpl' in candidate.projections
				&& projectionKey in candidate.projections.Xrpl
			)
		)
	))
	if (resolver == null)
		throw new Error(`Bithomp spec missing ${entityType}${projectionKey == null ? '' : `.${projectionKey}`} resolver`)
	return resolver
}

const accountResolver = resolverFor(EntityType.XrplAccount, '$$timestamps')
const accountTipResolver = resolverFor(EntityType.XrplAccount_Timestamp)
const trustlinesResolver = resolverFor(EntityType.XrplAccount, '$$trustlines')
const transactionsResolver = resolverFor(EntityType.XrplAccount, '$$transactions')
const ammResolver = resolverFor(EntityType.XrplAmm, '$$timestamps')
const ammTipResolver = resolverFor(EntityType.XrplAmm_Timestamp)
const networkAmmsResolver = resolverFor(EntityType.Network, '$$amms')
const ledgerEntryResolver = resolverFor(EntityType.XrplLedgerEntry)

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

	it('re-resolves tip account observations by ledger index', async () => {
		const observation = await accountTipResolver.resolve.AccountLedgerIndexSource.resolve({
			$account: account,
			ledgerIndex: 98_765_432n,
			source: Source.Bithomp,
		}, context)

		expect(accountTipResolver.projections.balanceDrops(observation)).toBe(900719925474099312345n)
		expect(accountTipResolver.projections.timestampMs(observation)).toBe(1_784_783_358_000)
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
	])('rejects malformed $name', async ({ name, ledgerInfo }) => {
		getAccount.mockResolvedValueOnce({
			address: account.account,
			ledgerInfo,
		})

		await expect(accountResolver.resolve.NetworkAccount.resolve(account, context))
			.rejects.toThrow(`malformed ${name}`)
	})
})

describe('Bithomp XRPL account trustlines / transactions', () => {
	beforeEach(() => {
		getAccount.mockReset()
		getTrustlines.mockReset()
		getAccountTransactions.mockReset()
		getAccount.mockResolvedValue({
			address: account.account,
			ledgerInfo: {
				ledger: 10,
				ledgerTimestamp: 1_700_000_000,
				balance: '1',
				ownerCount: 0,
				sequence: 1,
			},
		})
	})

	it('projects tip-paired trustlines from explorer balances', async () => {
		getTrustlines.mockResolvedValue([{
			counterparty: 'rIssuer',
			currency: 'USD',
			balance: '12.5',
			limit: '1000',
			ripplingDisabled: true,
			peer: {
				limit: '0',
				ripplingDisabled: false,
			},
		}])

		const trustlines = await trustlinesResolver.resolve.NetworkAccount.resolve(account, context)
		expect(trustlinesResolver.projections.$$trustlines(trustlines)).toEqual([{
			[EntityMetaKey.Selector]: {
				$network: account.$network,
				account: account.account,
				currency: 'USD',
				issuer: 'rIssuer',
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.XrplTrustline, [], '$account')]: {
					[EntityMetaKey.Selector]: account,
				},
				[entityFieldAddressKey(EntityType.XrplTrustline, [], '$issuerAccount')]: {
					[EntityMetaKey.Selector]: {
						$network: account.$network,
						account: 'rIssuer',
					},
				},
				[entityFieldAddressKey(EntityType.XrplTrustline, [], '$$timestamps')]: [{
					[EntityMetaKey.Selector]: {
						$trustline: {
							$network: account.$network,
							account: account.account,
							currency: 'USD',
							issuer: 'rIssuer',
						},
						ledgerIndex: 10n,
						source: Source.Bithomp,
					},
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.XrplTrustline_Timestamp, [], 'timestampMs')]: 1_700_000_000_000,
						[entityFieldAddressKey(EntityType.XrplTrustline_Timestamp, [], 'balance')]: '12.5',
						[entityFieldAddressKey(EntityType.XrplTrustline_Timestamp, [], 'limit')]: '1000',
						[entityFieldAddressKey(EntityType.XrplTrustline_Timestamp, [], 'limitPeer')]: '0',
						[entityFieldAddressKey(EntityType.XrplTrustline_Timestamp, [], 'noRipple')]: true,
						[entityFieldAddressKey(EntityType.XrplTrustline_Timestamp, [], 'noRipplePeer')]: false,
					},
				}],
			},
		}])
	})

	it('projects account transactions from explorer pages with raw fee drops', async () => {
		getAccountTransactions.mockResolvedValue([{
			id: 'TXHASH',
			type: 'payment',
			address: account.account,
			sequence: 9,
			outcome: {
				result: 'tesSUCCESS',
				timestamp: '2025-07-18T21:03:10.000Z',
				fee: '0.01',
				ledgerIndex: 97_563_734,
			},
			rawTransaction: JSON.stringify({
				hash: 'TXHASH',
				TransactionType: 'Payment',
				Account: account.account,
				Sequence: 9,
				Fee: '10000',
				ledger_index: 97_563_734,
				validated: true,
				meta: {
					TransactionResult: 'tesSUCCESS',
				},
			}),
		}])

		const page = await transactionsResolver.resolve.NetworkAccount.resolve(account, {
			...context,
			pagination: {
				limit: 10,
			},
		})
		expect(transactionsResolver.projections.$$transactions.select(page, account, context)).toEqual([{
			[EntityMetaKey.Selector]: {
				$network: account.$network,
				hash: 'TXHASH',
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.XrplTransaction, [], 'transactionType')]: 'Payment',
				[entityFieldAddressKey(EntityType.XrplTransaction, [], 'account')]: account.account,
				[entityFieldAddressKey(EntityType.XrplTransaction, [], 'sequence')]: 9,
				[entityFieldAddressKey(EntityType.XrplTransaction, [], '$$timestamps')]: [{
					[EntityMetaKey.Selector]: {
						$transaction: {
							$network: account.$network,
							hash: 'TXHASH',
						},
						ledgerIndex: 97_563_734n,
						source: Source.Bithomp,
					},
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.XrplTransaction_Timestamp, [], 'timestampMs')]: Date.parse('2025-07-18T21:03:10.000Z'),
						[entityFieldAddressKey(EntityType.XrplTransaction_Timestamp, [], 'fee')]: 10000n,
						[entityFieldAddressKey(EntityType.XrplTransaction_Timestamp, [], 'status')]: 'tesSUCCESS',
						[entityFieldAddressKey(EntityType.XrplTransaction_Timestamp, [], 'resultCode')]: 'tesSUCCESS',
						[entityFieldAddressKey(EntityType.XrplTransaction_Timestamp, [], 'validated')]: true,
						[entityFieldAddressKey(EntityType.XrplTransaction_Timestamp, [], 'meta')]: {
							TransactionResult: 'tesSUCCESS',
						},
					},
				}],
			},
		}])
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
				[entityFieldAddressKey(EntityType.XrplAmm_Timestamp, [], '$ledgerEntry')]: {
					[EntityMetaKey.Selector]: {
						$ledger: {
							$network: amm.$network,
							ledgerIndex: 87_461_194n,
						},
						entryHash: 'C55741BDA5F2590DD0F0EF7F620F133C0B73C382A8987068CA2DD886D99FD3B5',
					},
				},
			},
		}])
		expect(getAmm).toHaveBeenCalledOnce()
		expect(getAmm).toHaveBeenCalledWith(publicEnv, {
			id: amm.ammAccount,
		})
	})

	it('re-resolves tip AMM observations by ledger index', async () => {
		const observation = await ammTipResolver.resolve.AmmLedgerIndexSource.resolve({
			$amm: amm,
			ledgerIndex: 87_461_194n,
			source: Source.Bithomp,
		}, context)

		expect(ammTipResolver.projections.assetAmount(observation)).toBe('13820630640')
		expect(ammTipResolver.projections.tradingFee(observation)).toBe(290)
		expect(ammTipResolver.projections.$ledgerEntry(observation)).toEqual({
			[EntityMetaKey.Selector]: {
				$ledger: {
					$network: amm.$network,
					ledgerIndex: 87_461_194n,
				},
				entryHash: 'C55741BDA5F2590DD0F0EF7F620F133C0B73C382A8987068CA2DD886D99FD3B5',
			},
		})
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

describe('Bithomp network AMM list and ledger entry', () => {
	beforeEach(() => {
		getAmms.mockReset()
		getLedgerEntry.mockReset()
	})

	it('projects Network.Xrpl.$$amms from the explorer AMM catalog', async () => {
		getAmms.mockResolvedValue({
			marker: 'NEXT',
			amms: [{
				ammID: 'C55741BDA5F2590DD0F0EF7F620F133C0B73C382A8987068CA2DD886D99FD3B5',
				account: amm.ammAccount,
				amount: '10',
				amount2: {
					currency: 'USD',
					issuer: 'rIssuer',
					value: '2',
				},
				lpTokenBalance: {
					currency: 'LP',
					issuer: amm.ammAccount,
					value: '3',
				},
				updatedAt: 1_713_700_900,
				updatedLedgerIndex: 87_461_194,
				tradingFee: 290,
			}],
		})

		const page = await networkAmmsResolver.resolve.Caip2.resolve(account.$network, context)
		expect(networkAmmsResolver.projections.Xrpl.$$amms.select(page, account.$network, context)).toEqual([{
			[EntityMetaKey.Selector]: {
				$network: account.$network,
				ammAccount: amm.ammAccount,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.XrplAmm, [], 'assetCurrency')]: 'XRP',
				[entityFieldAddressKey(EntityType.XrplAmm, [], 'asset2Currency')]: 'USD',
				[entityFieldAddressKey(EntityType.XrplAmm, [], 'asset2Issuer')]: 'rIssuer',
				[entityFieldAddressKey(EntityType.XrplAmm, [], 'lpTokenCurrency')]: 'LP',
				[entityFieldAddressKey(EntityType.XrplAmm, [], '$$timestamps')]: [{
					[EntityMetaKey.Selector]: {
						$amm: {
							$network: account.$network,
							ammAccount: amm.ammAccount,
						},
						ledgerIndex: 87_461_194n,
						source: Source.Bithomp,
					},
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.XrplAmm_Timestamp, [], 'timestampMs')]: 1_713_700_900_000,
						[entityFieldAddressKey(EntityType.XrplAmm_Timestamp, [], 'assetAmount')]: '10',
						[entityFieldAddressKey(EntityType.XrplAmm_Timestamp, [], 'asset2Amount')]: '2',
						[entityFieldAddressKey(EntityType.XrplAmm_Timestamp, [], 'lpTokenBalance')]: '3',
						[entityFieldAddressKey(EntityType.XrplAmm_Timestamp, [], 'tradingFee')]: 290,
						[entityFieldAddressKey(EntityType.XrplAmm_Timestamp, [], '$ledgerEntry')]: {
							[EntityMetaKey.Selector]: {
								$ledger: {
									$network: account.$network,
									ledgerIndex: 87_461_194n,
								},
								entryHash: 'C55741BDA5F2590DD0F0EF7F620F133C0B73C382A8987068CA2DD886D99FD3B5',
							},
						},
					},
				}],
			},
		}])
		expect(networkAmmsResolver.projections.Xrpl.$$amms.continuation(page, account.$network, context)).toEqual({
			operation: 'network-amms',
			target: 'xrpl:0',
			terminal: false,
			token: 'NEXT',
		})
	})

	it('projects validated ledger entries by index', async () => {
		getLedgerEntry.mockResolvedValue({
			index: 'ENTRYHASH',
			ledger_hash: 'LEDGERHASH',
			ledger_index: 80_000_000,
			node: {
				LedgerEntryType: 'AccountRoot',
				Account: account.account,
				PreviousTxnID: 'PREV',
				PreviousTxnLgrSeq: 79_999_999,
			},
			validated: true,
		})

		const entry = await ledgerEntryResolver.resolve.LedgerEntryHash.resolve({
			$ledger: {
				$network: account.$network,
				ledgerIndex: 80_000_000n,
				ledgerHash: 'LEDGERHASH',
			},
			entryHash: 'ENTRYHASH',
		}, context)

		expect(ledgerEntryResolver.projections.entryType(entry)).toBe('AccountRoot')
		expect(ledgerEntryResolver.projections.account(entry)).toBe(account.account)
		expect(ledgerEntryResolver.projections.previousTransactionHash(entry)).toBe('PREV')
		expect(ledgerEntryResolver.projections.previousTransactionLedgerIndex(entry)).toBe(79_999_999n)
	})
})
