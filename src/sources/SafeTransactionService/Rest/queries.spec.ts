import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import * as Address from 'ox/Address'

import { Source } from '$/sources/Source.ts'
import {
	safeTransactionServiceChainIds,
} from '$/sources/SafeTransactionService/Rest/queries.ts'

const { sourceGetJson } = vi.hoisted(() => ({
	sourceGetJson: vi.fn(),
}))

vi.mock('$/sources/_runtime/http.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/_runtime/http.ts')>(),
	sourceGetJson,
}))

const {
	getSafeCreation,
	getSafeMultisigTransaction,
	getSafeMultisigTransactions,
	getSafeStatus,
	getSafeTransactionConfirmations,
	isSafeNonceRejectionTransaction,
	requireSafeTransactionServiceBinding,
} = await import('$/sources/SafeTransactionService/Rest/queries.ts')

const chainId = 8453
const safeAddress = `0x${'a'.repeat(40)}`
const checksummedSafeAddress = Address.checksum(safeAddress)
const ownerAddress = `0x${'b'.repeat(40)}`
const recipientAddress = `0x${'c'.repeat(40)}`
const safeTxHash = `0x${'d'.repeat(64)}`
const executionHash = `0x${'e'.repeat(64)}`
const masterCopy = `0x${'1'.repeat(40)}`
const moduleAddress = `0x${'2'.repeat(40)}`
const zeroAddress = `0x${'0'.repeat(40)}`

const transaction = {
	safe: safeAddress,
	to: recipientAddress,
	value: '900719925474099300000',
	data: '0x',
	operation: 0,
	safeTxGas: '0',
	baseGas: '0',
	gasPrice: '0',
	gasToken: zeroAddress,
	refundReceiver: zeroAddress,
	nonce: '9007199254740993',
	executionDate: null,
	submissionDate: '2026-07-22T00:00:00Z',
	modified: '2026-07-22T00:00:00Z',
	blockNumber: null,
	transactionHash: null,
	safeTxHash,
	proposer: ownerAddress,
	executor: null,
	isExecuted: false,
	isSuccessful: null,
	confirmationsRequired: 1,
	confirmations: [],
	trusted: true,
	signatures: null,
}

const safeStatus = {
	address: safeAddress,
	nonce: '9007199254740993',
	threshold: 1,
	owners: [
		ownerAddress,
	],
	masterCopy,
	modules: [],
	fallbackHandler: recipientAddress,
	guard: zeroAddress,
	version: '1.4.1',
}

describe('Safe Transaction Service public multisig queries', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('indexes bound EIP-155 chains and hard-fails unknown ones', () => {
		expect(safeTransactionServiceChainIds).toEqual([
			1,
			10,
			50,
			56,
			100,
			130,
			137,
			143,
			146,
			196,
			204,
			232,
			324,
			480,
			677,
			988,
			999,
			1001,
			1672,
			3338,
			4217,
			4326,
			4663,
			5000,
			5003,
			5042,
			8217,
			8453,
			9745,
			10143,
			10200,
			16661,
			25363,
			42161,
			42220,
			42431,
			43111,
			43114,
			46630,
			57073,
			59144,
			80069,
			80094,
			81224,
			84532,
			102030,
			534352,
			747474,
			5042002,
			11142220,
			11155111,
			1313161554,
		])
		expect(requireSafeTransactionServiceBinding(8453).source).toBe(Source.SafeTransactionService_Rest)
		expect(requireSafeTransactionServiceBinding(10).endpoints[0]?.locator).toBe(
			'https://api.safe.global/tx-service/oeth'
		)
		expect(requireSafeTransactionServiceBinding(137).endpoints[0]?.locator).toBe(
			'https://api.safe.global/tx-service/pol'
		)
		expect(() => requireSafeTransactionServiceBinding(31337)).toThrow('no binding for chain 31337')
	})

	it('preserves exact Safe identity, owners, threshold, and lossless nonce', async () => {
		sourceGetJson.mockResolvedValue({
			...safeStatus,
			address: safeAddress.toUpperCase().replace('0X', '0x'),
		})

		await expect(getSafeStatus({
			chainId,
			safeAddress,
		})).resolves.toMatchObject({
			nonce: '9007199254740993',
			threshold: 1,
			masterCopy,
		})
		expect(sourceGetJson).toHaveBeenCalledWith(
			requireSafeTransactionServiceBinding(chainId),
			`https://api.safe.global/tx-service/base/api/v1/safes/${checksummedSafeAddress}/`
		)
	})

	it('rejects malformed Safe owner and module envelopes', async () => {
		sourceGetJson.mockResolvedValue({
			...safeStatus,
			owners: ownerAddress,
		})
		await expect(getSafeStatus({
			chainId,
			safeAddress,
		})).rejects.toThrow('invalid Safe status response envelope')

		sourceGetJson.mockResolvedValue({
			...safeStatus,
			modules: moduleAddress,
		})
		await expect(getSafeStatus({
			chainId,
			safeAddress,
		})).rejects.toThrow('invalid Safe status response envelope')
	})

	it('binds Safe creation factory + creation transaction hash', async () => {
		const creationHash = `0x${'3'.repeat(64)}`
		const factoryAddress = `0x${'4'.repeat(40)}`
		sourceGetJson.mockResolvedValue({
			created: '2024-01-01T00:00:00Z',
			creator: ownerAddress,
			transactionHash: creationHash,
			factoryAddress,
			masterCopy,
		})

		await expect(getSafeCreation({
			chainId,
			safeAddress,
		})).resolves.toMatchObject({
			transactionHash: creationHash,
			factoryAddress,
			masterCopy,
		})
		expect(sourceGetJson).toHaveBeenCalledWith(
			requireSafeTransactionServiceBinding(chainId),
			`https://api.safe.global/tx-service/base/api/v1/safes/${checksummedSafeAddress}/creation/`
		)
	})

	it('rejects Safe creation identities that collapse onto the Safe address', async () => {
		sourceGetJson.mockResolvedValue({
			created: '2024-01-01T00:00:00Z',
			creator: ownerAddress,
			transactionHash: `0x${'3'.repeat(64)}`,
			factoryAddress: safeAddress,
			masterCopy,
		})
		await expect(getSafeCreation({
			chainId,
			safeAddress,
		})).rejects.toThrow('creation factory cannot be the Safe itself')
	})

	it('rejects Safe creation envelopes where factory and masterCopy collide', async () => {
		sourceGetJson.mockResolvedValue({
			created: '2024-01-01T00:00:00Z',
			creator: ownerAddress,
			transactionHash: `0x${'3'.repeat(64)}`,
			factoryAddress: masterCopy,
			masterCopy,
		})
		await expect(getSafeCreation({
			chainId,
			safeAddress,
		})).rejects.toThrow('creation factory and masterCopy must differ')
	})

	it('fail-closes malformed Safe creation envelopes', async () => {
		sourceGetJson.mockResolvedValue({
			created: '2024-01-01T00:00:00Z',
			creator: ownerAddress,
			transactionHash: 'not-a-hash',
			factoryAddress: masterCopy,
			masterCopy,
		})
		await expect(getSafeCreation({
			chainId,
			safeAddress,
		})).rejects.toThrow('invalid Safe creation response envelope')
	})

	it('checksums lowercase Safe addresses before HTTP (EIP-55 required by tx-service)', async () => {
		sourceGetJson.mockResolvedValue(safeStatus)
		await getSafeStatus({
			chainId,
			safeAddress: safeAddress.toLowerCase(),
		})
		expect(sourceGetJson.mock.calls[0]?.[1]).toBe(
			`https://api.safe.global/tx-service/base/api/v1/safes/${checksummedSafeAddress}/`
		)
		expect(checksummedSafeAddress).not.toBe(safeAddress.toLowerCase())
	})

	it('returns bounded queued transactions and rejects foreign-subject rows', async () => {
		sourceGetJson.mockResolvedValueOnce({
			count: 1,
			next: null,
			previous: null,
			results: [
				transaction,
			],
		})

		await expect(getSafeMultisigTransactions({
			chainId,
			safeAddress,
			limit: 20,
			offset: 0,
			executed: false,
		})).resolves.toMatchObject({
			results: [
				{
					nonce: '9007199254740993',
					value: '900719925474099300000',
				},
			],
		})

		sourceGetJson.mockResolvedValueOnce({
			count: 1,
			next: null,
			previous: null,
			results: [
				{
					...transaction,
					safe: ownerAddress,
				},
			],
		})
		await expect(getSafeMultisigTransactions({
			chainId,
			safeAddress,
			limit: 20,
			offset: 0,
		})).rejects.toThrow('different Safe')
	})

	it('rejects malformed transaction page envelopes', async () => {
		sourceGetJson.mockResolvedValue({
			count: 1,
			next: null,
			previous: null,
			results: transaction,
		})

		await expect(getSafeMultisigTransactions({
			chainId,
			safeAddress,
			limit: 20,
			offset: 0,
		})).rejects.toThrow('invalid transaction page response envelope')
	})

	it('fails closed when a Safe transaction continuation cannot advance', async () => {
		sourceGetJson.mockResolvedValue({
			count: 2,
			next: `https://api.safe.global/tx-service/base/api/v2/safes/${checksummedSafeAddress}/multisig-transactions/?limit=20&offset=20`,
			previous: null,
			results: [],
		})

		await expect(getSafeMultisigTransactions({
			chainId,
			safeAddress,
			limit: 20,
			offset: 0,
		})).rejects.toThrow('transaction pagination cannot advance')
	})

	it('accepts multisig page/tx fee and decoder leftovers without projecting them', async () => {
		sourceGetJson.mockResolvedValue({
			count: 1,
			countUniqueNonce: 1,
			next: null,
			previous: null,
			results: [
				{
					...transaction,
					isExecuted: true,
					isSuccessful: true,
					executionDate: '2026-07-22T00:00:00Z',
					blockNumber: 12,
					transactionHash: executionHash,
					proposedByDelegate: null,
					ethGasPrice: '1000000000',
					maxFeePerGas: '2000000000',
					maxPriorityFeePerGas: '100000000',
					gasUsed: 21000,
					fee: '21000000000000',
					payment: '0',
					origin: 'https://app.safe.global',
					dataDecoded: {
						method: 'transfer',
						parameters: [],
					},
				},
			],
		})

		await expect(getSafeMultisigTransactions({
			chainId,
			safeAddress,
			limit: 1,
			offset: 0,
			executed: true,
		})).resolves.toMatchObject({
			count: 1,
			countUniqueNonce: 1,
			results: [
				{
					ethGasPrice: '1000000000',
					origin: 'https://app.safe.global',
					dataDecoded: {
						method: 'transfer',
					},
				},
			],
		})
	})

	it('fail-closes malformed fee leftovers and countUniqueNonce inversion', async () => {
		sourceGetJson.mockResolvedValue({
			count: 1,
			next: null,
			previous: null,
			results: [
				{
					...transaction,
					isExecuted: true,
					isSuccessful: true,
					transactionHash: executionHash,
					ethGasPrice: '-1',
				},
			],
		})
		await expect(getSafeMultisigTransactions({
			chainId,
			safeAddress,
			limit: 1,
			offset: 0,
			executed: true,
		})).rejects.toThrow('invalid transaction page response envelope')

		sourceGetJson.mockResolvedValue({
			count: 1,
			countUniqueNonce: 2,
			next: null,
			previous: null,
			results: [
				{
					...transaction,
					isExecuted: true,
					isSuccessful: true,
					transactionHash: executionHash,
				},
			],
		})
		await expect(getSafeMultisigTransactions({
			chainId,
			safeAddress,
			limit: 1,
			offset: 0,
			executed: true,
		})).rejects.toThrow('countUniqueNonce exceeds page count')
	})

	it('rejects queued transactions that carry execution fee leftovers', async () => {
		sourceGetJson.mockResolvedValue({
			count: 1,
			next: null,
			previous: null,
			results: [
				{
					...transaction,
					ethGasPrice: '1',
				},
			],
		})
		await expect(getSafeMultisigTransactions({
			chainId,
			safeAddress,
			limit: 1,
			offset: 0,
			executed: false,
		})).rejects.toThrow('queued transaction includes execution data')
	})

	it('accepts creation setupData leftovers fail-closed on malformed hex', async () => {
		const creationHash = `0x${'3'.repeat(64)}`
		const factoryAddress = `0x${'4'.repeat(40)}`
		sourceGetJson.mockResolvedValue({
			created: '2024-01-01T00:00:00Z',
			creator: ownerAddress,
			transactionHash: creationHash,
			factoryAddress,
			masterCopy,
			setupData: '0x1234',
			dataDecoded: {
				method: 'setup',
				parameters: [],
			},
		})
		await expect(getSafeCreation({
			chainId,
			safeAddress,
		})).resolves.toMatchObject({
			setupData: '0x1234',
			dataDecoded: {
				method: 'setup',
			},
		})

		sourceGetJson.mockResolvedValue({
			created: '2024-01-01T00:00:00Z',
			creator: ownerAddress,
			transactionHash: creationHash,
			factoryAddress,
			masterCopy,
			setupData: 'not-hex',
		})
		await expect(getSafeCreation({
			chainId,
			safeAddress,
		})).rejects.toThrow('invalid Safe creation response envelope')
	})

	it('rejects continuations that escape the exact chain and Safe path', async () => {
		sourceGetJson.mockResolvedValue({
			count: 1,
			next: `https://api.safe.global/tx-service/eth/api/v2/safes/${safeAddress}/multisig-transactions/?offset=20`,
			previous: null,
			results: [
				transaction,
			],
		})

		await expect(getSafeMultisigTransactions({
			chainId,
			safeAddress,
			limit: 20,
			offset: 0,
		})).rejects.toThrow('continuation escaped its subject')
	})

	it('hard-fails executed pages that omit the on-chain execution hash', async () => {
		sourceGetJson.mockResolvedValue({
			count: 1,
			next: null,
			previous: null,
			results: [
				{
					...transaction,
					isExecuted: true,
					isSuccessful: true,
					transactionHash: null,
				},
			],
		})

		await expect(getSafeMultisigTransactions({
			chainId,
			safeAddress,
			limit: 20,
			offset: 0,
			executed: true,
		})).rejects.toThrow('missing execution hash')
	})

	it('rejects queued transactions with execution envelope data', async () => {
		sourceGetJson.mockResolvedValue({
			count: 1,
			next: null,
			previous: null,
			results: [
				{
					...transaction,
					executionDate: '2026-07-22T00:00:00Z',
				},
			],
		})

		await expect(getSafeMultisigTransactions({
			chainId,
			safeAddress,
			limit: 20,
			offset: 0,
			executed: false,
		})).rejects.toThrow('queued transaction includes execution data')
	})

	it('binds a single multisig transaction to the requested Safe and hash', async () => {
		sourceGetJson.mockResolvedValue({
			...transaction,
			isExecuted: true,
			isSuccessful: true,
			transactionHash: executionHash,
		})

		await expect(getSafeMultisigTransaction({
			chainId,
			safeAddress,
			safeTxHash,
		})).resolves.toMatchObject({
			safeTxHash,
			transactionHash: executionHash,
		})
	})

	it('looks up a multisig transaction by SafeTxHash without a prior Safe address', async () => {
		sourceGetJson.mockResolvedValue({
			...transaction,
			isExecuted: false,
			isSuccessful: null,
			transactionHash: null,
		})

		await expect(getSafeMultisigTransaction({
			chainId,
			safeTxHash,
		})).resolves.toMatchObject({
			safe: safeAddress,
			safeTxHash,
			isExecuted: false,
		})
	})

	it('binds confirmations to the exact transaction and current Safe owners', async () => {
		sourceGetJson
			.mockResolvedValueOnce(safeStatus)
			.mockResolvedValueOnce({
				...transaction,
				isExecuted: true,
				isSuccessful: true,
				transactionHash: executionHash,
			})
			.mockResolvedValueOnce({
				count: 1,
				next: null,
				previous: null,
				results: [
					{
						owner: ownerAddress,
						submissionDate: '2026-07-22T00:00:00Z',
						transactionHash: executionHash,
						signature: `0x${'f'.repeat(130)}`,
						signatureType: 'ETH_SIGN',
					},
				],
			})

		await expect(getSafeTransactionConfirmations({
			chainId,
			safeAddress,
			safeTxHash,
			limit: 20,
			offset: 0,
		})).resolves.toMatchObject({
			results: [
				{
					owner: ownerAddress,
				},
			],
		})
	})

	it('rejects invalid thresholds', async () => {
		sourceGetJson.mockResolvedValue({
			...safeStatus,
			threshold: 2,
		})
		await expect(getSafeStatus({
			chainId,
			safeAddress,
		})).rejects.toThrow('threshold exceeds its owner set')
	})

	it('recognizes only the canonical empty self-call as a nonce rejection', () => {
		expect(isSafeNonceRejectionTransaction({
			...transaction,
			to: safeAddress,
			value: '0',
			data: '0x',
		})).toBe(true)
		expect(isSafeNonceRejectionTransaction({
			...transaction,
			to: safeAddress,
			value: '1',
			data: '0x',
		})).toBe(false)
	})
})
