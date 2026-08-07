import {
	beforeEach,
	expect,
	it,
	vi,
} from 'vitest'
import { networkBySlug } from '$/constants/Network.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const {
	getPendingTransaction,
	getPendingTransactions,
} = vi.hoisted(() => ({
	getPendingTransaction: vi.fn(),
	getPendingTransactions: vi.fn(),
}))

vi.mock('$/sources/Algod/Rest/queries.ts', () => ({
	getPendingTransaction,
	getPendingTransactions,
}))

const { default: algodRest } = await import('$/resolvers/Algod-Rest.ts')

const pendingTransactionResolver = algodRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BlockheadAlgorandPendingTransaction
))

if (pendingTransactionResolver == null)
	throw new Error('Algod-Rest spec missing BlockheadAlgorandPendingTransaction resolver')

const account = 'CCOSLTGG2BNX2FQATPIWW5PRDEEEYI74BY2FGNUYEP4UPO24I5STKK43GM'
const otherAccount = 'EH5BHWISPB7MEIITJIWF2VB3YFN2RZLJMWBRV6CBJV76FBAEAALL6XKSQE'
const groupBytes = 'wGHE2Pwdvd7S12BL5FaOP20EGYesN73ktiC1qzkkit8='

const signedAssetTransfer = {
	sig: 'IBRntOXMUD+5WwRSvp8QvaZFe++K19refR1zsIhUa6CDXlDMvoEpBGzaX2BiLuxFpDsh3nZ4LbXb/IGGW8EMCg==',
	txn: {
		aamt: 100000,
		arcv: otherAccount,
		fee: 1000,
		fv: 63823220,
		gen: 'mainnet-v1.0',
		gh: 'wGHE2Pwdvd7S12BL5FaOP20EGYesN73ktiC1qzkkit8=',
		grp: groupBytes,
		lv: 63823230,
		note: 'eDQwMi1wYXltZW50LXYyLTE3ODYwNTcwNDUxNzM=',
		snd: account,
		type: 'axfer',
		xaid: 31566704,
	},
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

beforeEach(() => {
	getPendingTransaction.mockReset()
	getPendingTransactions.mockReset()
})

it('projects enrolled BlockheadAlgorandPendingTransaction from singular pending-by-txid', async () => {
	getPendingTransaction.mockResolvedValueOnce({
		txn: signedAssetTransfer,
		'pool-error': '',
	})
	getPendingTransactions.mockResolvedValueOnce({
		'top-transactions': [
			{
				sig: 'other',
				txn: {
					...signedAssetTransfer.txn,
					snd: otherAccount,
				},
			},
			signedAssetTransfer,
		],
		'total-transactions': 2,
	})

	const pendingTransaction = await pendingTransactionResolver.resolve.NodeIdTxIdObservedAtMs.resolve({
		nodeId: 'nodely-algod',
		txId: 'ABC123',
		observedAtMs: 1_700_000_000_000,
	}, context)

	expect(getPendingTransaction).toHaveBeenCalledWith('ABC123')
	expect(getPendingTransactions).toHaveBeenCalledWith(0)
	expect(pendingTransaction).toMatchObject({
		nodeId: 'nodely-algod',
		txId: 'ABC123',
		observedAtMs: 1_700_000_000_000,
		sender: account,
		transactionType: 'axfer',
		fee: 1000n,
		firstValidRound: 63823220n,
		lastValidRound: 63823230n,
		poolPriority: 1,
		$network: {
			[EntityMetaKey.Selector]: {
				$network: {
					slug: networkBySlug.algorand.slug,
				},
			},
		},
	})
	expect(pendingTransaction.group).toMatch(/^0x/)
	expect(pendingTransaction.payload).toMatchObject({
		'pool-error': '',
	})
	expect(algodRest.source).toBe(Source.Nodely)
})

it('omits poolPriority when the pending signed txn is absent from the pool page', async () => {
	getPendingTransaction.mockResolvedValueOnce({
		txn: signedAssetTransfer,
		'pool-error': '',
		'confirmed-round': 63823240,
	})
	getPendingTransactions.mockResolvedValueOnce({
		'top-transactions': [],
		'total-transactions': 0,
	})

	const pendingTransaction = await pendingTransactionResolver.resolve.NodeIdTxIdObservedAtMs.resolve({
		nodeId: 'nodely-algod',
		txId: 'ABC123',
		observedAtMs: 1,
	}, context)

	expect(pendingTransaction.poolPriority).toBeUndefined()
	expect(pendingTransaction.sender).toBe(account)
})

it('keeps singular projection when pool-wide pending-list fails', async () => {
	getPendingTransaction.mockResolvedValueOnce({
		txn: signedAssetTransfer,
		'pool-error': '',
	})
	getPendingTransactions.mockRejectedValueOnce(new Error('Algod_Rest: invalid pending transactions envelope'))

	const pendingTransaction = await pendingTransactionResolver.resolve.NodeIdTxIdObservedAtMs.resolve({
		nodeId: 'nodely-algod',
		txId: 'ABC123',
		observedAtMs: 1,
	}, context)

	expect(pendingTransaction.poolPriority).toBeUndefined()
	expect(pendingTransaction.transactionType).toBe('axfer')
})
