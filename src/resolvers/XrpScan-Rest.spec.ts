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
const getLedger = vi.hoisted(() => vi.fn())
const getLedgers = vi.hoisted(() => vi.fn())
const getLedgerTransactions = vi.hoisted(() => vi.fn())
const getObject = vi.hoisted(() => vi.fn())
const getServerInfo = vi.hoisted(() => vi.fn())
const getTransaction = vi.hoisted(() => vi.fn())

vi.mock('$/sources/XrpScan/Rest/queries.ts', () => ({
	getAccount,
	getAccountTransactions,
	getAmm,
	getLedger,
	getLedgers,
	getLedgerTransactions,
	getObject,
	getServerInfo,
	getTransaction,
}))

const { default: xrpScan } = await import('$/resolvers/XrpScan-Rest.ts')

const accountResolver = xrpScan.resolvers[0]
const accountTxResolver = xrpScan.resolvers[1]
const ammResolver = xrpScan.resolvers[2]
const ledgerResolver = xrpScan.resolvers[3]
const ledgerTxResolver = xrpScan.resolvers[4]
const transactionResolver = xrpScan.resolvers[5]
const ledgerEntryResolver = xrpScan.resolvers[6]
const networkLedgersResolver = xrpScan.resolvers[7]

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
	ammAccount: 'rs9ineLqrCzeAGS1bxsrW8x2n3bRJYAh3Q',
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

describe('XrpScan Rest XRPL projections', () => {
	beforeEach(() => {
		getAccount.mockReset()
		getAccountTransactions.mockReset()
		getAmm.mockReset()
		getLedger.mockReset()
		getLedgers.mockReset()
		getLedgerTransactions.mockReset()
		getObject.mockReset()
		getServerInfo.mockReset()
		getTransaction.mockReset()

		getServerInfo.mockResolvedValue({
			info: {
				validated_ledger: {
					hash: 'TIPHASH',
					seq: 106119341,
				},
			},
		})
	})

	it('projects account tip from account + server_info tip ledger (not inception ledger_index)', async () => {
		getAccount.mockResolvedValue({
			Account: account.account,
			Balance: '56770125556',
			Flags: 1703936,
			LedgerEntryType: 'AccountRoot',
			OwnerCount: 1,
			Sequence: 44196,
			ledger_index: 32570,
			inception: '2013-01-01T03:21:10.000Z',
		})

		const timestamps = await accountResolver.resolve.NetworkAccount.resolve(account, context)

		expect(accountResolver.projections.$$timestamps(timestamps)).toEqual([{
			[EntityMetaKey.Selector]: {
				$account: account,
				ledgerIndex: 106119341n,
				source: Source.XrpScan_Rest,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.XrplAccount_Timestamp, [], 'balanceDrops')]: 56770125556n,
				[entityFieldAddressKey(EntityType.XrplAccount_Timestamp, [], 'ownerCount')]: 1,
				[entityFieldAddressKey(EntityType.XrplAccount_Timestamp, [], 'sequence')]: 44196,
				[entityFieldAddressKey(EntityType.XrplAccount_Timestamp, [], 'flags')]: 1703936,
			},
		}])
		expect(getServerInfo).toHaveBeenCalledOnce()
	})

	it('projects AMM identity + tip observation clocked by server_info (no dishonest timestampMs)', async () => {
		getAmm.mockResolvedValue({
			account: amm.ammAccount,
			amount: '10285371598',
			amount2: {
				currency: 'USD',
				issuer: 'rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq',
				value: '10680.70334334452',
			},
			lp_token: {
				currency: '03930D02208264E2E40EC1B0C09E4DB96EE197B1',
				issuer: amm.ammAccount,
				value: '7973564.21175256',
			},
			trading_fee: 462,
			auction_slot: {
				account: 'rpLP',
			},
			vote_slots: [{
				account: 'rVote',
			}],
		})

		const snapshot = await ammResolver.resolve.NetworkAmmAccount.resolve(amm, context)

		expect(ammResolver.projections.assetCurrency(snapshot)).toBe('XRP')
		expect(ammResolver.projections.asset2Currency(snapshot)).toBe('USD')
		expect(ammResolver.projections.asset2Issuer(snapshot)).toBe('rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq')
		expect(ammResolver.projections.lpTokenCurrency(snapshot)).toBe('03930D02208264E2E40EC1B0C09E4DB96EE197B1')
		expect(ammResolver.projections.$$timestamps(snapshot)).toEqual([{
			[EntityMetaKey.Selector]: {
				$amm: amm,
				ledgerIndex: 106119341n,
				source: Source.XrpScan_Rest,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.XrplAmm_Timestamp, [], 'assetAmount')]: '10285371598',
				[entityFieldAddressKey(EntityType.XrplAmm_Timestamp, [], 'asset2Amount')]: '10680.70334334452',
				[entityFieldAddressKey(EntityType.XrplAmm_Timestamp, [], 'lpTokenBalance')]: '7973564.21175256',
				[entityFieldAddressKey(EntityType.XrplAmm_Timestamp, [], 'tradingFee')]: 462,
				[entityFieldAddressKey(EntityType.XrplAmm_Timestamp, [], 'auctionSlot')]: {
					account: 'rpLP',
				},
				[entityFieldAddressKey(EntityType.XrplAmm_Timestamp, [], 'voteSlots')]: [{
					account: 'rVote',
				}],
			},
		}])
	})

	it('projects historical ledger fields and ledger transactions', async () => {
		getLedger.mockResolvedValue({
			ledger_index: 80000000,
			ledger_hash: 'DB978F031BB14734213998060E077D5F813358222DAB07CA8148588D852A55DF',
			close_time: 1684953531,
			close_time_human: '2023-05-24T18:38:51.000Z',
			parent_hash: 'E70235CEAA964202C74CD81132C69F8F44FE539F9E347F82AA3131410B7CDBEF',
			transaction_hash: 'CDA48280EF5F88BC86164A77E1072296899B384619D552445D71C922026A3E8C',
			total_coins: '99988894618845390',
		})
		getLedgerTransactions.mockResolvedValue([{
			hash: '0BE1E6647EE9D851880706B1F1229F0CF21ADF3CD53AAB1BCD1408C68F899C28',
			TransactionType: 'OfferCreate',
			Account: 'rhhh49pFH96roGyuC4E5P4CHaNjS1k8gzM',
			Fee: 15,
			Sequence: 25577104,
			date: '2023-05-24T18:38:51.000Z',
			meta: {
				TransactionResult: 'tesSUCCESS',
			},
		}])

		const ledger = await ledgerResolver.resolve.NetworkLedgerIndex.resolve({
			$network: account.$network,
			ledgerIndex: 80000000n,
		}, context)

		expect(ledgerResolver.projections.ledgerHash(ledger)).toBe('DB978F031BB14734213998060E077D5F813358222DAB07CA8148588D852A55DF')
		expect(ledgerResolver.projections.closeTimeMs(ledger)).toBe(1684953531000)
		expect(ledgerResolver.projections.totalCoinsDrops(ledger)).toBe(99988894618845390n)

		const transactions = await ledgerTxResolver.resolve.NetworkLedgerIndex.resolve({
			$network: account.$network,
			ledgerIndex: 80000000n,
		}, context)
		expect(ledgerTxResolver.projections.$$transactions(transactions)).toHaveLength(1)
		expect(transactions[0][EntityMetaKey.Selector]).toEqual({
			$network: account.$network,
			hash: '0BE1E6647EE9D851880706B1F1229F0CF21ADF3CD53AAB1BCD1408C68F899C28',
		})
	})

	it('projects transaction tip observation and validated ledger object', async () => {
		getTransaction.mockResolvedValue({
			hash: 'B01A7E11B84A2539A3DCCF65C95514F4C3A87E61BAF7DBDED9F1CDEE06D5A39C',
			TransactionType: 'Payment',
			Account: 'rDsbeomae4FXwgQTJp9Rs64Qg9vDiTCdBv',
			Sequence: 2902419,
			Fee: 10000,
			ledger_index: 81516515,
			date: '2023-07-31T07:18:30.000Z',
			validated: true,
			meta: {
				TransactionResult: 'tesSUCCESS',
			},
		})
		getObject.mockResolvedValue({
			index: '2B6AC232AA4C4BE41BF49D2459FA4A0347E1B543A4C92FCEE0821C0201E2E9A8',
			ledger_hash: 'LEDGER',
			ledger_index: 106119351,
			node: {
				LedgerEntryType: 'AccountRoot',
				Account: account.account,
				PreviousTxnID: 'BDD85A6D8F83A1C9BBE34CCF8FD3CB1FE0E2DB282B1B42D2CE36D42F863133B2',
				PreviousTxnLgrSeq: 105143509,
			},
			validated: true,
		})

		const txSnapshot = await transactionResolver.resolve.NetworkHash.resolve({
			$network: account.$network,
			hash: 'B01A7E11B84A2539A3DCCF65C95514F4C3A87E61BAF7DBDED9F1CDEE06D5A39C',
		}, context)
		expect(transactionResolver.projections.transactionType(txSnapshot)).toBe('Payment')
		expect(transactionResolver.projections.$$timestamps(txSnapshot)[0][EntityMetaKey.Selector]).toEqual({
			$transaction: {
				$network: account.$network,
				hash: 'B01A7E11B84A2539A3DCCF65C95514F4C3A87E61BAF7DBDED9F1CDEE06D5A39C',
			},
			ledgerIndex: 81516515n,
			source: Source.XrpScan_Rest,
		})

		const entry = await ledgerEntryResolver.resolve.LedgerEntryHash.resolve({
			$ledger: {
				$network: account.$network,
				ledgerIndex: 106119351n,
			},
			entryHash: '2B6AC232AA4C4BE41BF49D2459FA4A0347E1B543A4C92FCEE0821C0201E2E9A8',
		}, context)
		expect(ledgerEntryResolver.projections.entryType(entry)).toBe('AccountRoot')
		expect(ledgerEntryResolver.projections.account(entry)).toBe(account.account)
	})

	it('projects Network.Xrpl.$$ledgers from the recent ledgers window', async () => {
		getLedgers.mockResolvedValue({
			current_ledger: 106119352,
			ledgers: [{
				ledger_index: 106119352,
				ledger_hash: 'TIP',
				close_time: 1786056551,
				close_time_human: '2026-08-06T22:49:11.000Z',
				parent_hash: 'PARENT',
				transaction_hash: 'TXROOT',
				total_coins: '99985630519073280',
			}],
		})

		const ledgers = await networkLedgersResolver.resolve.Caip2.resolve({
			caip2: networkBySlug.xrpl.caip2,
		}, context)

		expect(networkLedgersResolver.projections.Xrpl.$$ledgers(ledgers)).toEqual([{
			[EntityMetaKey.Selector]: {
				$network: {
					caip2: networkBySlug.xrpl.caip2,
				},
				ledgerIndex: 106119352n,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.XrplLedger, [], 'ledgerHash')]: 'TIP',
				[entityFieldAddressKey(EntityType.XrplLedger, [], 'closeTimeMs')]: 1786056551000,
				[entityFieldAddressKey(EntityType.XrplLedger, [], 'totalCoinsDrops')]: 99985630519073280n,
				[entityFieldAddressKey(EntityType.XrplLedger, [], 'parentHash')]: 'PARENT',
				[entityFieldAddressKey(EntityType.XrplLedger, [], 'transactionHash')]: 'TXROOT',
			},
		}])
	})

	it('projects account transactions with marker continuation', async () => {
		getAccountTransactions.mockResolvedValue({
			account: account.account,
			ledger_index_min: 32570,
			ledger_index_max: 106119350,
			marker: 'next-page',
			transactions: [{
				hash: '05EEB773E4F2A9B2917EA641246B842A04B65752DDDC95806CCDCF671110952E',
				TransactionType: 'SetRegularKey',
				Account: 'rpCexCFgDdkgx7VchoTm2EsrTSRxSnX53R',
				Fee: '12',
				ledger_index: 105691924,
				date: '2026-07-18T22:04:12.000Z',
				validated: true,
				meta: {
					TransactionResult: 'tesSUCCESS',
				},
			}],
		})

		const page = await accountTxResolver.resolve.NetworkAccount.resolve(account, context)
		expect(accountTxResolver.projections.$$transactions.select(page)).toHaveLength(1)
		expect(accountTxResolver.projections.$$transactions.continuation(page, account, context)).toEqual({
			operation: 'account-transactions',
			target: account.account,
			terminal: false,
			token: 'next-page',
		})
	})

	it('rejects non-xrpl networks before transport', async () => {
		await expect(accountResolver.resolve.NetworkAccount.resolve({
			...account,
			$network: {
				caip2: networkBySlug.ethereum.caip2,
			},
		}, context)).rejects.toThrow('unsupported network')
		expect(getAccount).not.toHaveBeenCalled()
	})
})
