import {
	beforeEach,
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

const {
	getApplicationBox,
	getParticipationKey,
	getParticipationKeys,
	getPendingTransaction,
	getPendingTransactions,
} = vi.hoisted(() => ({
	getApplicationBox: vi.fn(),
	getParticipationKey: vi.fn(),
	getParticipationKeys: vi.fn(),
	getPendingTransaction: vi.fn(),
	getPendingTransactions: vi.fn(),
}))

vi.mock('$/sources/Algod/Rest/queries.ts', () => ({
	getApplicationBox,
	getParticipationKey,
	getParticipationKeys,
	getPendingTransaction,
	getPendingTransactions,
}))

const { default: algodRest } = await import('$/resolvers/Algod-Rest.ts')

const pendingTransactionResolver = algodRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BlockheadAlgorandPendingTransaction
))

if (pendingTransactionResolver == null)
	throw new Error('Algod-Rest spec missing BlockheadAlgorandPendingTransaction resolver')

const participationKeysResolver = algodRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType._Global
	&& '$$blockheadAlgorandParticipationKeys' in resolver.projections
))

if (participationKeysResolver == null)
	throw new Error('Algod-Rest spec missing global participation keys resolver')

const participationKeyResolver = algodRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BlockheadAlgorandParticipationKey
))

const boxResolver = algodRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.AlgorandBox
))

const boxRoundResolver = algodRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.AlgorandBox_Round
))

if (participationKeyResolver == null)
	throw new Error('Algod-Rest spec missing BlockheadAlgorandParticipationKey resolver')
if (boxResolver == null || boxRoundResolver == null)
	throw new Error('Algod-Rest spec missing application box resolvers')

const account = 'CCOSLTGG2BNX2FQATPIWW5PRDEEEYI74BY2FGNUYEP4UPO24I5STKK43GM'
const otherAccount = 'EH5BHWISPB7MEIITJIWF2VB3YFN2RZLJMWBRV6CBJV76FBAEAALL6XKSQE'
const groupBytes = 'wGHE2Pwdvd7S12BL5FaOP20EGYesN73ktiC1qzkkit8='

const boxSelector = {
	$application: {
		$network: {
			$network: {
				slug: networkBySlug.algorand.slug,
			},
		},
		applicationId: 42n,
	},
	boxName: '0x626f78' as const,
}

const participationKey = {
	address: account,
	id: 'participation-key-1',
	key: {
		'selection-participation-key': groupBytes,
		'vote-participation-key': groupBytes,
		'vote-first-valid': 1,
		'vote-last-valid': 100,
		'vote-key-dilution': 10_000,
		'state-proof-key': groupBytes,
	},
	'effective-first-valid': 2,
	'effective-last-valid': 99,
}

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

it('materializes source-clocked application box content and fails closed on stale rounds', async () => {
	getApplicationBox.mockResolvedValue({
		body: {
			name: 'Ym94',
			value: 'dmFsdWU=',
		},
		round: 63823221n,
	})

	const rounds = await boxResolver.resolve.ApplicationBoxName.resolve(boxSelector)
	expect(rounds).toEqual([{
		[EntityMetaKey.Selector]: {
			$box: boxSelector,
			round: 63823221n,
			source: Source.Nodely,
		},
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.AlgorandBox_Round, [], 'valueHash')]: '0xcd42404d52ad55ccfa9aca4adc828aa5800ad9d385a0671fbcbf724118320619',
			[entityFieldAddressKey(EntityType.AlgorandBox_Round, [], 'deleted')]: false,
		},
	}])

	await expect(boxRoundResolver.resolve.BoxRoundSource.resolve({
		$box: boxSelector,
		round: 63823221n,
		source: Source.Nodely,
	})).resolves.toEqual({
		valueHash: '0xcd42404d52ad55ccfa9aca4adc828aa5800ad9d385a0671fbcbf724118320619',
		deleted: false,
	})

	await expect(boxRoundResolver.resolve.BoxRoundSource.resolve({
		$box: boxSelector,
		round: 63823220n,
		source: Source.Nodely,
	})).rejects.toThrow('application box round mismatch')
})

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
	getParticipationKey.mockReset()
	getParticipationKeys.mockReset()
	getPendingTransaction.mockReset()
	getPendingTransactions.mockReset()
})

it('projects native participation-key selectors from the Nodely Algod node', async () => {
	getParticipationKeys.mockResolvedValueOnce([participationKey])

	const participationKeys = await participationKeysResolver.resolve.Scope.resolve({
		scope: 'global',
	}, context)

	expect(getParticipationKeys).toHaveBeenCalledOnce()
	expect(
		participationKeysResolver.projections.$$blockheadAlgorandParticipationKeys(
			participationKeys
		)
	).toEqual([
		{
			[EntityMetaKey.Selector]: {
				nodeId: 'nodely-algod',
				participationId: participationKey.id,
			},
		},
	])
})

it('projects native participation key material for the enrolled node', async () => {
	getParticipationKey.mockResolvedValueOnce(participationKey)

	const resolvedParticipationKey = await participationKeyResolver.resolve.NodeIdParticipationId.resolve({
		nodeId: 'nodely-algod',
		participationId: participationKey.id,
	}, context)

	expect(getParticipationKey).toHaveBeenCalledWith(participationKey.id)
	expect(resolvedParticipationKey).toMatchObject({
		nodeId: 'nodely-algod',
		participationId: participationKey.id,
		firstValidRound: 1n,
		lastValidRound: 100n,
		keyDilution: 10_000n,
		selectionKey: groupBytes,
		votingKey: groupBytes,
		stateProofKey: groupBytes,
		effectiveFirstRound: 2n,
		effectiveLastRound: 99n,
		$account: {
			[EntityMetaKey.Selector]: {
				$network: {
					$network: {
						slug: networkBySlug.algorand.slug,
					},
				},
				address: account,
			},
		},
	})
})

it('rejects participation-key selectors for a node outside the enrolled binding', async () => {
	await expect(
		participationKeyResolver.resolve.NodeIdParticipationId.resolve({
			nodeId: 'foreign-algod',
			participationId: participationKey.id,
		}, context)
	).rejects.toThrow('Algod_Rest: unsupported node foreign-algod')

	expect(getParticipationKey).not.toHaveBeenCalled()
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
