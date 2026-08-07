import { beforeEach, describe, expect, it, vi } from 'vitest'

import { Source } from '$/sources/Source.ts'
import bindings from '$/sources/Starkscan/bindings.ts'
import type { components } from '$/sources/Starkscan/OpenApi/openapi.d.ts'

type AddressSummary = components['schemas']['AddressSummaryView']
type AddressTransaction = components['schemas']['AddressTransactionListItem']
type AddressTokenHoldings = components['schemas']['AddressTokenHoldingsView']
type BlockView = components['schemas']['BlockView']
type ClassDetail = components['schemas']['ClassDetailView']
type ContractEvent = components['schemas']['ContractEventItem']
type TransactionDetail = components['schemas']['TransactionDetailView']

const { getJson } = vi.hoisted(() => ({
	getJson: vi.fn(),
}))

vi.mock('$/sources/_shared/wire/HttpRest/client.ts', () => ({
	getJson,
}))

const {
	getAddressSummary,
	getAddressTransactions,
	getBlock,
	getClass,
	getContractEvents,
	getExactTokenHoldings,
	getTransaction,
} = await import('$/sources/Starkscan/Rest/queries.ts')

const binding = bindings[Source.Starkscan][0]

const account = '0x01'
const transaction = {
	blockNumber: 10_630_025,
	timestampIso: '2026-07-15T12:00:00Z',
	txIndex: 4,
	txHash: '0xabc',
	kinds: ['invoke'],
	counterparty: '0x2',
	txType: 'INVOKE',
	executionStatus: 'SUCCEEDED',
	finalityStatus: 'ACCEPTED_ON_L2',
	fromAddress: '0x0001',
	toAddress: '0x2',
	primaryMethod: 'transfer',
	callCount: 1,
	methodsDiffer: false,
	transferCount: 1,
	topTransferTokenAddress: '0x3',
	topTransferAmount: '340282366920938463463374607431768211455',
	topTransferStandard: 'ERC20',
} satisfies AddressTransaction

const holdings = {
	chainId: 'SN_MAIN',
	ownerAddress: '0x0001',
	items: [{
		tokenAddress: '0x03',
		normalizedTokenAddress: '0x3',
		indexedBalanceRaw: '340282366920938463463374607431768211455',
		symbol: 'STRK',
		name: 'Starknet Token',
		decimals: 18,
	}],
	exact: true,
	truncated: false,
	completeness: {
		exact: true,
		truncated: false,
		complete: true,
		reasonCode: 'complete',
		reason: 'Complete indexed holdings',
		lagBlocks: 0,
		capped: false,
		cap: null,
	},
} satisfies AddressTokenHoldings

const summary = {
	address: '0x0001',
	totalActivityCount: 12,
	latestActivityBlock: 10_630_025,
	classHash: '0x0abc',
	isAccount: true,
	contractExistence: null,
} satisfies AddressSummary

const event = {
	blockNumber: 10_630_025,
	timestampIso: '2026-07-15T12:00:00Z',
	txHash: '0xabc',
	txIndex: 4,
	logIndex: 2,
	address: '0x0001',
	keys: ['0x11', '0x22'],
	topic0: '0x11',
	topic1: '0x22',
	topic2: null,
	topic3: null,
	data: ['0x33'],
	decodingStatus: 'unknown',
} satisfies ContractEvent

const block = {
	chainId: 'SN_MAIN',
	blockNumber: 10_630_025,
	blockHash: '0xabc',
	parentHash: '0xdef',
	timestampIso: '2026-07-15T12:00:00Z',
	txCount: 1,
	rawObjectKey: 'block:10630025',
	stateRoot: '0x11',
	sequencerAddress: '0x22',
	l1DataAvailabilityMode: null,
	starknetVersion: '0.13.2',
	l1GasPrice: {
		priceInWei: '1',
		priceInFri: null,
	},
	l2GasPrice: null,
	l1DataGasPrice: {
		priceInWei: null,
		priceInFri: '2',
	},
	transactions: [{
		txHash: '0xabc',
		txIndex: 0,
		txCursor: '10630025:0',
		fromAddress: '0x1',
		toAddress: '0x2',
		executionStatus: 'SUCCEEDED',
		finalityStatus: 'ACCEPTED_ON_L2',
	}],
} satisfies BlockView

const transactionDetail = {
	chainId: 'SN_MAIN',
	blockNumber: 10_630_025,
	timestampIso: '2026-07-15T12:00:00Z',
	txIndex: 4,
	txHash: '0x0abc',
	txCursor: '10630025:4',
	fromAddress: '0x01',
	toAddress: '0x2',
	executionStatus: 'SUCCEEDED',
	finalityStatus: 'ACCEPTED_ON_L2',
	txType: 'INVOKE',
	rawObjectKey: 'tx:0xabc',
	receipt: {
		executionStatus: 'SUCCEEDED',
		finalityStatus: 'ACCEPTED_ON_L2',
		gasUsed: '12',
		effectiveGasPrice: '3',
		revertReason: null,
	},
	logsTruncated: false,
	eventDecodingDegraded: false,
	logs: [{
		logIndex: 1,
		address: '0x01',
		keys: ['0x11'],
		topic0: '0x11',
		topic1: null,
		topic2: null,
		topic3: null,
		data: ['0x22'],
		decodingStatus: 'unknown',
	}],
	calldata: ['0x33'],
	tokenTransfers: [],
	messages: [],
	messagesCoverage: {
		status: 'exact',
		source: 'starknet_protocol_messages',
		reasonCode: 'no_matching_message_rows',
		message: 'No messages',
	},
	bridgeIntent: null,
} satisfies TransactionDetail

const classDetail = {
	class: {
		chainId: 'SN_MAIN',
		classHash: '0x0abc',
		classLabel: null,
		classLabelSource: null,
		verificationTier: 'unverified',
		originKind: 'declare',
		originTransactionHash: '0xdef',
		originatedAtBlock: 100,
		originatedAtIso: '2026-07-15T12:00:00Z',
		originSource: 'indexed_finalized_declare_tx',
		originFinalityStatus: 'finalized',
		originRefreshedAtIso: '2026-07-15T12:00:00Z',
		declarationTxHash: '0xdef',
		declaredAtBlock: 100,
		declaredAtIso: '2026-07-15T12:00:00Z',
		compiledClassHash: '0x11',
		classKind: null,
		classVersion: '0.1.0',
		abiAvailable: false,
		abiSource: null,
		instanceCount: 1,
		currentInstanceCount: 1,
		accountInstanceCount: 0,
		contractInstanceCount: 1,
		unknownInstanceCount: 0,
		verifiedInstanceCount: 0,
		firstSeenBlockNumber: 100,
		usageAsOfBlock: 100,
		firstSeenAtIso: '2026-07-15T12:00:00Z',
		sampleContractAddress: '0x01',
		source: 'indexed_finalized_declare_tx',
		usageRefreshedAtIso: '2026-07-15T12:00:00Z',
		refreshedAtIso: '2026-07-15T12:00:00Z',
	},
	instances: [{
		address: '0x01',
		isAccount: false,
		relationshipKind: 'deployed_as_class',
		evidenceBlockNumber: 100,
		evidenceTransactionHash: '0xdef',
		evidenceAtIso: '2026-07-15T12:00:00Z',
		evidenceSource: 'indexed_deploy',
		deployedAtBlock: 100,
		deployedAtTxHash: '0xdef',
		deployedByAddress: '0x2',
		createdOnIso: '2026-07-15T12:00:00Z',
		observedAtBlock: null,
		observedAtIso: null,
		observationSource: null,
		source: 'indexed_deploy',
	}],
	nextInstanceCursor: '0x02',
} satisfies ClassDetail

describe('Starkscan account portfolio transport', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('loads a bounded direct-account transaction page with opaque continuation', async () => {
		getJson.mockResolvedValueOnce({
			items: [transaction],
			nextCursor: 'opaque:cursor+value',
		})

		await expect(getAddressTransactions({
			address: account,
			limit: 25,
			cursor: 'previous+cursor',
		})).resolves.toEqual({
			items: [transaction],
			nextCursor: 'opaque:cursor+value',
		})
		expect(getJson).toHaveBeenCalledWith(
			binding,
			'/v1/SN_MAIN/address/0x01/transactions?limit=25&cursor=previous%2Bcursor'
		)
	})

	it('returns only exact, complete, owner-matched indexed holdings', async () => {
		getJson.mockResolvedValueOnce(holdings)

		await expect(getExactTokenHoldings(account)).resolves.toEqual(holdings)
		expect(getJson).toHaveBeenCalledWith(
			binding,
			'/v1/SN_MAIN/address/0x01/token-holdings'
		)
	})

	it('certifies address summaries with class or not-deployed evidence', async () => {
		getJson.mockResolvedValueOnce(summary)
		await expect(getAddressSummary(account)).resolves.toEqual(summary)
		expect(getJson).toHaveBeenCalledWith(
			binding,
			'/v1/SN_MAIN/address/0x01'
		)

		getJson.mockResolvedValueOnce({
			address: '0x0001',
			totalActivityCount: 0,
			latestActivityBlock: null,
			classHash: null,
			contractExistence: {
				status: 'not_deployed',
				reasonCode: 'contract_not_found',
				evidenceSource: 'finalized_class_hash_at',
				observedBlockNumber: 42,
				observedBlockHash: '0xdead',
				expiresAtIso: '2026-07-15T12:00:00Z',
			},
		})
		await expect(getAddressSummary(account)).resolves.toMatchObject({
			contractExistence: {
				status: 'not_deployed',
				observedBlockNumber: 42,
			},
		})

		getJson.mockResolvedValueOnce({
			...summary,
			classHash: null,
			contractExistence: null,
		})
		await expect(getAddressSummary(account)).rejects.toThrow('lacks contract existence evidence')

		getJson.mockResolvedValueOnce({
			...summary,
			latestActivityBlock: null,
		})
		await expect(getAddressSummary(account)).rejects.toThrow('lacks observation block')
	})

	it('loads newest-first contract events and rejects degraded or foreign pages', async () => {
		getJson.mockResolvedValueOnce({
			items: [event],
			nextCursor: '10630024:1:0',
			eventDecodingDegraded: false,
		})
		await expect(getContractEvents({
			address: account,
			limit: 25,
			cursor: '10630025:4:2',
		})).resolves.toMatchObject({
			items: [event],
			nextCursor: '10630024:1:0',
		})
		expect(getJson).toHaveBeenCalledWith(
			binding,
			'/v1/SN_MAIN/contract/0x01/events?limit=25&cursor=10630025%3A4%3A2'
		)

		getJson.mockResolvedValueOnce({
			items: [{
				...event,
				address: '0x2',
			}],
			nextCursor: null,
			eventDecodingDegraded: false,
		})
		await expect(getContractEvents({
			address: account,
			limit: 25,
		})).rejects.toThrow('foreign contract row')

		getJson.mockResolvedValueOnce({
			items: [event],
			nextCursor: null,
			eventDecodingDegraded: true,
		})
		await expect(getContractEvents({
			address: account,
			limit: 25,
		})).rejects.toThrow('operationally degraded')
	})

	it('fails closed on foreign transaction rows and stalled cursors', async () => {
		getJson.mockResolvedValueOnce({
			items: [{
				...transaction,
				fromAddress: '0x2',
				toAddress: '0x3',
			}],
			nextCursor: null,
		})
		await expect(getAddressTransactions({
			address: account,
			limit: 25,
		})).rejects.toThrow('foreign account row')

		getJson.mockResolvedValueOnce({
			items: [transaction],
			nextCursor: 'same',
		})
		await expect(getAddressTransactions({
			address: account,
			limit: 25,
			cursor: 'same',
		})).rejects.toThrow('did not advance')
	})

	it('rejects transaction pages with reversed ledger order or malformed clocks', async () => {
		getJson.mockResolvedValueOnce({
			items: [
				transaction,
				{
					...transaction,
					blockNumber: transaction.blockNumber + 1,
					txHash: '0xdef',
				},
			],
			nextCursor: null,
		})
		await expect(getAddressTransactions({
			address: account,
			limit: 25,
		})).rejects.toThrow('not newest-first')

		getJson.mockResolvedValueOnce({
			items: [{
				...transaction,
				timestampIso: 'not-a-clock',
			}],
			nextCursor: null,
		})
		await expect(getAddressTransactions({
			address: account,
			limit: 25,
		})).rejects.toThrow('invalid address transactions envelope')

		getJson.mockResolvedValueOnce({
			items: [
				transaction,
				{
					...transaction,
					blockNumber: transaction.blockNumber - 1,
					txHash: '0x0abc',
				},
			],
			nextCursor: null,
		})
		await expect(getAddressTransactions({
			address: account,
			limit: 25,
		})).rejects.toThrow('duplicate hash')
	})

	it('rejects incomplete holdings and arktype-fail-closes malformed amounts', async () => {
		getJson.mockResolvedValueOnce({
			...holdings,
			exact: false,
			completeness: {
				...holdings.completeness,
				exact: false,
				complete: false,
				reasonCode: 'indexLag',
			},
		})
		await expect(getExactTokenHoldings(account)).rejects.toThrow(
			'token holdings are incomplete (indexLag)'
		)

		getJson.mockResolvedValueOnce({
			...holdings,
			items: [{
				...holdings.items[0],
				indexedBalanceRaw: '1.5',
			}],
		})
		await expect(getExactTokenHoldings(account)).rejects.toThrow(
			'invalid token holdings envelope'
		)
	})

	it('bounds requests and avoids transport for zero cardinality', async () => {
		await expect(getAddressTransactions({
			address: account,
			limit: 0,
		})).resolves.toEqual({
			items: [],
			nextCursor: null,
		})
		await expect(getContractEvents({
			address: account,
			limit: 0,
		})).resolves.toEqual({
			items: [],
			nextCursor: null,
			eventDecodingDegraded: false,
		})
		await expect(getAddressTransactions({
			address: account,
			limit: 101,
		})).rejects.toThrow('0 through 100')
		await expect(getAddressTransactions({
			address: account,
			limit: 25,
			cursor: '',
		})).rejects.toThrow('must not be empty')
		expect(getJson).not.toHaveBeenCalled()
	})
})

describe('Starkscan block transaction and class transport', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('loads a certified block preview by number', async () => {
		getJson.mockResolvedValueOnce(block)
		await expect(getBlock('10630025')).resolves.toEqual(block)
		expect(getJson).toHaveBeenCalledWith(
			binding,
			'/v1/SN_MAIN/block/10630025?tx_limit=200'
		)
	})

	it('rejects mismatched block identities and oversized previews', async () => {
		getJson.mockResolvedValueOnce({
			...block,
			blockNumber: 1,
		})
		await expect(getBlock('10630025')).rejects.toThrow('block number does not match request')

		getJson.mockResolvedValueOnce({
			...block,
			transactions: Array.from({ length: 201 }, (_, index) => ({
				...block.transactions[0],
				txHash: `0x${(index + 1).toString(16)}`,
				txIndex: index,
				txCursor: `10630025:${index}`,
			})),
		})
		await expect(getBlock('10630025')).rejects.toThrow('exceeds certified cap')
	})

	it('loads transaction detail and fails closed on truncated or degraded logs', async () => {
		getJson.mockResolvedValueOnce(transactionDetail)
		await expect(getTransaction('0xabc')).resolves.toEqual(transactionDetail)
		expect(getJson).toHaveBeenCalledWith(
			binding,
			'/v1/SN_MAIN/tx/0xabc?logLimit=96'
		)

		getJson.mockResolvedValueOnce({
			...transactionDetail,
			logsTruncated: true,
		})
		await expect(getTransaction('0xabc')).rejects.toThrow('logs are truncated')

		getJson.mockResolvedValueOnce({
			...transactionDetail,
			eventDecodingDegraded: true,
		})
		await expect(getTransaction('0xabc')).rejects.toThrow('operationally degraded')
	})

	it('arktype fail-closes malformed event felt keys/data and transaction envelopes', async () => {
		getJson.mockResolvedValueOnce({
			items: [{
				...event,
				keys: ['not-a-felt'],
			}],
			nextCursor: null,
			eventDecodingDegraded: false,
		})
		await expect(getContractEvents({
			address: account,
			limit: 25,
		})).rejects.toThrow('invalid contract events envelope')

		getJson.mockResolvedValueOnce({
			items: [{
				...event,
				data: ['0xgg'],
			}],
			nextCursor: null,
			eventDecodingDegraded: false,
		})
		await expect(getContractEvents({
			address: account,
			limit: 25,
		})).rejects.toThrow('invalid contract events envelope')

		getJson.mockResolvedValueOnce({
			...transactionDetail,
			logs: [{
				...transactionDetail.logs[0],
				keys: ['1'],
			}],
		})
		await expect(getTransaction('0xabc')).rejects.toThrow('invalid transaction envelope')

		getJson.mockResolvedValueOnce({
			...transactionDetail,
			calldata: ['not-felt'],
		})
		await expect(getTransaction('0xabc')).rejects.toThrow('invalid transaction envelope')

		getJson.mockResolvedValueOnce({
			...block,
			blockHash: 'block-hash',
		})
		await expect(getBlock('10630025')).rejects.toThrow('invalid block envelope')
	})

	it('loads class detail with address-ordered instances and opaque continuation', async () => {
		getJson.mockResolvedValueOnce(classDetail)
		await expect(getClass({
			classHash: '0xabc',
			limit: 25,
			cursor: '0x00',
		})).resolves.toEqual(classDetail)
		expect(getJson).toHaveBeenCalledWith(
			binding,
			'/v1/SN_MAIN/class/0xabc?instanceLimit=25&instanceSort=address_asc&instanceCursor=0x00'
		)

		getJson.mockResolvedValueOnce({
			...classDetail,
			nextInstanceCursor: '0x00',
		})
		await expect(getClass({
			classHash: '0xabc',
			limit: 25,
			cursor: '0x00',
		})).rejects.toThrow('did not advance')
	})
})
