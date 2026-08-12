import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiFamily } from '$/sources/SourceBinding.ts'
import { Source } from '$/sources/Source.ts'

const {
	getJson,
	sourceFetch,
} = vi.hoisted(() => ({
	getJson: vi.fn(),
	sourceFetch: vi.fn(),
}))

vi.mock('$/sources/_shared/wire/HttpRest/client.ts', () => ({
	getJson,
	httpUrl: (_binding: unknown, path: string, query?: Record<string, string>) => {
		const url = new URL(path, 'https://mainnet-api.4160.nodely.dev')
		for (const [key, value] of Object.entries(query ?? {}))
			url.searchParams.set(key, value)
		return url.toString()
	},
}))

vi.mock('$/sources/_runtime/http.ts', () => ({
	sourceFetch,
}))

vi.mock('$/lib/http.ts', () => ({
	throwHttpError: vi.fn(),
}))

const {
	getBlockHash,
	getApplicationBox,
	getParticipationKey,
	getParticipationKeys,
	getPendingTransaction,
	getPendingTransactions,
	getPendingTransactionsByAddress,
	getStatus,
	getTransactionParams,
	getTransactionProof,
} = await import('$/sources/Algod/Rest/queries.ts')

const account = 'CCOSLTGG2BNX2FQATPIWW5PRDEEEYI74BY2FGNUYEP4UPO24I5STKK43GM'
const otherAccount = 'EH5BHWISPB7MEIITJIWF2VB3YFN2RZLJMWBRV6CBJV76FBAEAALL6XKSQE'

const signedAssetTransfer = {
	sig: 'IBRntOXMUD+5WwRSvp8QvaZFe++K19refR1zsIhUa6CDXlDMvoEpBGzaX2BiLuxFpDsh3nZ4LbXb/IGGW8EMCg==',
	txn: {
		aamt: 100000,
		arcv: otherAccount,
		fee: 1000,
		fv: 63823220,
		gen: 'mainnet-v1.0',
		gh: 'wGHE2Pwdvd7S12BL5FaOP20EGYesN73ktiC1qzkkit8=',
		lv: 63823230,
		note: 'eDQwMi1wYXltZW50LXYyLTE3ODYwNTcwNDUxNzM=',
		snd: account,
		type: 'axfer',
		xaid: 31566704,
	},
}

describe('Algod Rest transport', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('loads fail-closed node status from the Nodely Algod binding', async () => {
		getJson.mockResolvedValueOnce({
			'catchpoint': '',
			'catchup-time': 0,
			'last-round': 63823221,
			'last-version': 'https://github.com/algorandfoundation/specs/tree/953304de35264fc3ef91bcd05c123242015eeaed',
			'next-version': 'https://github.com/algorandfoundation/specs/tree/953304de35264fc3ef91bcd05c123242015eeaed',
			'next-version-round': 63823222,
			'next-version-supported': true,
			'stopped-at-unsupported-round': false,
			'time-since-last-round': 1303092704,
		})

		await expect(getStatus()).resolves.toMatchObject({
			'last-round': 63823221,
			'last-version': 'https://github.com/algorandfoundation/specs/tree/953304de35264fc3ef91bcd05c123242015eeaed',
		})
		expect(getJson).toHaveBeenCalledWith(
			expect.objectContaining({
				source: Source.Nodely,
				apiFamily: ApiFamily.AlgodRestApi,
			}),
			'/v2/status'
		)

		getJson.mockResolvedValueOnce({
			'last-round': -1,
			'last-version': 'x',
			'next-version': 'x',
			'next-version-round': 1,
			'next-version-supported': true,
			'stopped-at-unsupported-round': false,
			'catchup-time': 0,
			'time-since-last-round': 0,
		})
		await expect(getStatus()).rejects.toThrow('Algod_Rest: invalid node status envelope')
	})

	it('loads application boxes with an authoritative response round', async () => {
		sourceFetch.mockResolvedValueOnce({
			ok: true,
			headers: new Headers({
				'x-algo-round': '63823221',
			}),
			json: async () => ({
				name: 'Ym94',
				value: 'dmFsdWU=',
			}),
		})

		await expect(getApplicationBox({
			applicationId: 42n,
			boxName: 'Ym94',
		})).resolves.toEqual({
			body: {
				name: 'Ym94',
				value: 'dmFsdWU=',
			},
			round: 63823221n,
		})
		expect(sourceFetch).toHaveBeenCalledWith(
			expect.objectContaining({
				source: Source.Nodely,
				apiFamily: ApiFamily.AlgodRestApi,
			}),
			'https://mainnet-api.4160.nodely.dev/v2/applications/42/box?name=Ym94'
		)

		sourceFetch.mockResolvedValueOnce({
			ok: true,
			headers: new Headers(),
			json: async () => ({
				name: 'Ym94',
				value: 'dmFsdWU=',
			}),
		})
		await expect(getApplicationBox({
			applicationId: 42n,
			boxName: 'Ym94',
		})).rejects.toThrow('application box response is missing a valid round')
	})

	it('loads fail-closed transaction params', async () => {
		getJson.mockResolvedValueOnce({
			'consensus-version': 'https://github.com/algorandfoundation/specs/tree/953304de35264fc3ef91bcd05c123242015eeaed',
			fee: 0,
			'genesis-hash': 'wGHE2Pwdvd7S12BL5FaOP20EGYesN73ktiC1qzkkit8=',
			'genesis-id': 'mainnet-v1.0',
			'last-round': 63823239,
			'min-fee': 1000,
		})

		await expect(getTransactionParams()).resolves.toMatchObject({
			'last-round': 63823239,
			'min-fee': 1000,
		})
		expect(getJson).toHaveBeenCalledWith(
			expect.objectContaining({
				apiFamily: ApiFamily.AlgodRestApi,
			}),
			'/v2/transactions/params'
		)

		getJson.mockResolvedValueOnce({
			'consensus-version': '',
			fee: 0,
			'genesis-hash': 'x',
			'genesis-id': 'x',
			'last-round': 1,
			'min-fee': 1,
		})
		await expect(getTransactionParams()).rejects.toThrow('Algod_Rest: invalid transaction params envelope')
	})

	it('loads bounded pending transactions and rejects oversized or inconsistent pages', async () => {
		getJson.mockResolvedValueOnce({
			'top-transactions': [signedAssetTransfer],
			'total-transactions': 1,
		})

		await expect(getPendingTransactions(2)).resolves.toMatchObject({
			'total-transactions': 1,
			'top-transactions': [{
				txn: {
					snd: account,
					type: 'axfer',
				},
			}],
		})
		expect(getJson).toHaveBeenCalledWith(
			expect.objectContaining({
				apiFamily: ApiFamily.AlgodRestApi,
			}),
			'/v2/transactions/pending?max=2'
		)

		getJson.mockResolvedValueOnce({
			'top-transactions': [signedAssetTransfer, signedAssetTransfer],
			'total-transactions': 1,
		})
		await expect(getPendingTransactions(2)).rejects.toThrow('Algod_Rest: pending top-transactions exceed total-transactions')

		getJson.mockResolvedValueOnce({
			'top-transactions': [signedAssetTransfer, signedAssetTransfer],
			'total-transactions': 2,
		})
		await expect(getPendingTransactions(1)).rejects.toThrow('Algod_Rest: pending transactions exceed requested max')

		getJson.mockResolvedValueOnce({
			'top-transactions': [{
				txn: {
					snd: 'not-an-address',
					type: 'pay',
				},
			}],
			'total-transactions': 1,
		})
		await expect(getPendingTransactions(1)).rejects.toThrow('Algod_Rest: invalid pending transactions envelope')
	})

	it('loads account pending transactions and rejects foreign senders', async () => {
		getJson.mockResolvedValueOnce({
			'top-transactions': [signedAssetTransfer],
			'total-transactions': 3,
		})

		await expect(getPendingTransactionsByAddress({
			address: account,
			max: 1,
		})).resolves.toMatchObject({
			'total-transactions': 3,
		})
		expect(getJson).toHaveBeenCalledWith(
			expect.objectContaining({
				apiFamily: ApiFamily.AlgodRestApi,
			}),
			`/v2/accounts/${account}/transactions/pending?max=1`
		)

		getJson.mockResolvedValueOnce({
			'top-transactions': [{
				...signedAssetTransfer,
				txn: {
					...signedAssetTransfer.txn,
					snd: otherAccount,
				},
			}],
			'total-transactions': 1,
		})
		await expect(getPendingTransactionsByAddress({
			address: account,
			max: 1,
		})).rejects.toThrow('Algod_Rest: account pending page contains a foreign sender')
	})

	it('loads a singular pending transaction by id', async () => {
		getJson.mockResolvedValueOnce({
			txn: signedAssetTransfer,
			'pool-error': '',
			'confirmed-round': 0,
		})

		await expect(getPendingTransaction('ABC123')).resolves.toMatchObject({
			'pool-error': '',
			txn: {
				txn: {
					snd: account,
				},
			},
		})
		expect(getJson).toHaveBeenCalledWith(
			expect.objectContaining({
				apiFamily: ApiFamily.AlgodRestApi,
			}),
			'/v2/transactions/pending/ABC123'
		)

		await expect(getPendingTransaction('bad id')).rejects.toThrow('Algod_Rest: invalid transaction id')

		getJson.mockResolvedValueOnce({
			txn: signedAssetTransfer,
		})
		await expect(getPendingTransaction('ABC123')).rejects.toThrow('Algod_Rest: invalid pending transaction envelope')
	})

	it('loads participation keys with subject-matched singular lookup', async () => {
		const participationKey = {
			address: account,
			id: 'participation-key-1',
			key: {
				'selection-participation-key': 'wGHE2Pwdvd7S12BL5FaOP20EGYesN73ktiC1qzkkit8=',
				'vote-participation-key': 'wGHE2Pwdvd7S12BL5FaOP20EGYesN73ktiC1qzkkit8=',
				'vote-first-valid': 1,
				'vote-last-valid': 100,
				'vote-key-dilution': 10_000,
			},
			'effective-first-valid': 1,
			'effective-last-valid': 100,
		}

		getJson.mockResolvedValueOnce([participationKey])
		await expect(getParticipationKeys()).resolves.toEqual([participationKey])
		expect(getJson).toHaveBeenCalledWith(
			expect.objectContaining({
				apiFamily: ApiFamily.AlgodRestApi,
			}),
			'/v2/participation'
		)

		getJson.mockResolvedValueOnce([
			participationKey,
			{
				...participationKey,
				id: 'participation-key-1',
			},
		])
		await expect(getParticipationKeys()).rejects.toThrow('Algod_Rest: duplicate participation key id')

		getJson.mockResolvedValueOnce(participationKey)
		await expect(getParticipationKey('participation-key-1')).resolves.toMatchObject({
			id: 'participation-key-1',
			address: account,
		})
		expect(getJson).toHaveBeenCalledWith(
			expect.objectContaining({
				apiFamily: ApiFamily.AlgodRestApi,
			}),
			'/v2/participation/participation-key-1'
		)

		getJson.mockResolvedValueOnce({
			...participationKey,
			id: 'other-id',
		})
		await expect(getParticipationKey('participation-key-1')).rejects.toThrow(
			'Algod_Rest: participation key response does not match the subject'
		)

		getJson.mockResolvedValueOnce({
			...participationKey,
			address: 'not-an-address',
		})
		await expect(getParticipationKey('participation-key-1')).rejects.toThrow(
			'Algod_Rest: invalid participation key envelope'
		)
	})

	it('loads fail-closed block hashes and transaction proofs', async () => {
		getJson.mockResolvedValueOnce({
			blockHash: '5ZWEXQT2PGYESRO5TNMWSHMPPP63Z6ZLODAVGZ66C7OEE5FOVVPA',
		})
		await expect(getBlockHash(63823782n)).resolves.toEqual({
			blockHash: '5ZWEXQT2PGYESRO5TNMWSHMPPP63Z6ZLODAVGZ66C7OEE5FOVVPA',
		})
		expect(getJson).toHaveBeenCalledWith(
			expect.objectContaining({
				apiFamily: ApiFamily.AlgodRestApi,
			}),
			'/v2/blocks/63823782/hash'
		)

		getJson.mockResolvedValueOnce({
			blockHash: 'not-base32!',
		})
		await expect(getBlockHash(1)).rejects.toThrow('Algod_Rest: invalid block hash envelope')
		await expect(getBlockHash(-1)).rejects.toThrow('Algod_Rest: block round must be a non-negative safe integer')

		const txId = '5WVG6OBH3OEJ4KO3DAFZMOKG2TDGWWAHB3WHNZ632JRXQTFV2BSA'
		getJson.mockResolvedValueOnce({
			hashtype: 'sha512_256',
			idx: 0,
			proof: 'vwCgYDrrRWbU76XEUqd8ewEvZrcRroSn96Ss+rHnVFpZyGSisR944QB1wvQpj+8u+Bhs9T1tnzWUTgMpeeHQn08Ncqo0ylkFmhuSHmFLx+mfcFZnkeHfXOu18cQRSWvK',
			stibhash: 'JKa8pryIvuAe+9B7+755U2Epv4F9umLZ5Quy5aXp0bI=',
			treedepth: 3,
		})
		await expect(getTransactionProof({
			round: 63823782,
			txId,
		})).resolves.toMatchObject({
			hashtype: 'sha512_256',
			idx: 0,
			treedepth: 3,
		})
		expect(getJson).toHaveBeenCalledWith(
			expect.objectContaining({
				apiFamily: ApiFamily.AlgodRestApi,
			}),
			`/v2/blocks/63823782/transactions/${txId}/proof?hashtype=sha512_256`
		)

		getJson.mockResolvedValueOnce({
			hashtype: 'sha256',
			idx: 0,
			proof: 'vwCgYDrrRWbU76XEUqd8ewEvZrcRroSn96Ss+rHnVFpZyGSisR944QB1wvQpj+8u+Bhs9T1tnzWUTgMpeeHQn08Ncqo0ylkFmhuSHmFLx+mfcFZnkeHfXOu18cQRSWvK',
			stibhash: 'JKa8pryIvuAe+9B7+755U2Epv4F9umLZ5Quy5aXp0bI=',
			treedepth: 3,
		})
		await expect(getTransactionProof({
			round: 63823782,
			txId,
			hashType: 'sha512_256',
		})).rejects.toThrow('Algod_Rest: transaction proof hashtype does not match the request')

		getJson.mockResolvedValueOnce({
			hashtype: 'sha512_256',
			idx: -1,
			proof: 'x',
			stibhash: 'y',
			treedepth: 0,
		})
		await expect(getTransactionProof({
			round: 1,
			txId,
		})).rejects.toThrow('Algod_Rest: invalid transaction proof envelope')
	})
})
