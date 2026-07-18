import { readFileSync } from 'node:fs'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { networkBySlug } from '$/constants/Network.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import { NetworkSelector } from '$/schema/Network.ts'
import { sourceProviderDefinitions } from '$/sources/$sourceProviders.ts'
import { Source } from '$/sources/Source.ts'
import {
	getFeatures,
	getValidatedLedgerData,
	getServerInfo,
	getValidatedLedger,
	getValidatedLedgerTransactions,
} from '$/sources/Xrpl/JsonRpc/queries.ts'
import type {
	XrplFeatureResult,
	XrplLedgerDataResult,
	XrplLedgerResult,
	XrplLedgerWithTransactionsResult,
	XrplServerInfoResult,
} from '$/sources/Xrpl/JsonRpc/types.ts'

const sourceFetch = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', () => ({
	firstHttpUrlForBinding: () => 'https://xrpl.example',
	sourceFetch,
}))

const { default: xrpl } = await import('$/resolvers/Xrpl-JsonRpc.ts')

const serverInfo = JSON.parse(readFileSync(
	new URL('../sources/Xrpl/JsonRpc/fixtures/server-info.json', import.meta.url),
	'utf8'
)) satisfies XrplServerInfoResult
const validatedLedger = JSON.parse(readFileSync(
	new URL('../sources/Xrpl/JsonRpc/fixtures/ledger.json', import.meta.url),
	'utf8'
)) satisfies XrplLedgerResult
const ledgerData = JSON.parse(readFileSync(
	new URL('../sources/Xrpl/JsonRpc/fixtures/ledger-data.json', import.meta.url),
	'utf8'
)) satisfies XrplLedgerDataResult
const emptyLedgerData = JSON.parse(readFileSync(
	new URL('../sources/Xrpl/JsonRpc/fixtures/ledger-data-empty.json', import.meta.url),
	'utf8'
)) satisfies XrplLedgerDataResult
const features = JSON.parse(readFileSync(
	new URL('../sources/Xrpl/JsonRpc/fixtures/feature.json', import.meta.url),
	'utf8'
)) satisfies XrplFeatureResult
const ledgerTransactions = JSON.parse(readFileSync(
	new URL('../sources/Xrpl/JsonRpc/fixtures/ledger-transactions.json', import.meta.url),
	'utf8'
)) satisfies XrplLedgerWithTransactionsResult

const binding = sourceProviderDefinitions
	.flatMap((provider) => provider.bindings)
	.find((candidate) => candidate.source === Source.Xrpl_Rippled)

if (binding == null)
	throw new Error('Xrpl_Rippled spec missing source binding')

const context = {
	filters: [],
	sorts: [],
	pagination: {},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}

const jsonRpcResponse = (result: object) => new Response(JSON.stringify({
	jsonrpc: '2.0',
	id: 1,
	result,
}))

describe('XRPL rippled queries', () => {
	beforeEach(() => {
		sourceFetch.mockReset()
	})

	it('executes only the typed server information and validated-ledger operations', async () => {
		sourceFetch
			.mockResolvedValueOnce(jsonRpcResponse(serverInfo))
			.mockResolvedValueOnce(jsonRpcResponse(validatedLedger))

		await expect(getServerInfo(binding)).resolves.toEqual(serverInfo)
		await expect(getValidatedLedger(binding)).resolves.toEqual(validatedLedger)
		expect(sourceFetch.mock.calls.map((call) => JSON.parse(call[2].body))).toMatchObject([
			{
				method: 'server_info',
			},
			{
				method: 'ledger',
				params: [{ ledger_index: 'validated' }],
			},
		])
	})

	it('accepts server information with conditionally absent members', async () => {
		sourceFetch.mockResolvedValueOnce(jsonRpcResponse({
			info: {},
		}))

		await expect(getServerInfo(binding)).resolves.toEqual({
			info: {},
		})
	})

	it('executes typed relationship operations with bounded state queries', async () => {
		sourceFetch
			.mockResolvedValueOnce(jsonRpcResponse(ledgerData))
			.mockResolvedValueOnce(jsonRpcResponse(features))
			.mockResolvedValueOnce(jsonRpcResponse(ledgerTransactions))

		await expect(getValidatedLedgerData(binding, 3)).resolves.toEqual(ledgerData)
		await expect(getFeatures(binding)).resolves.toEqual(features)
		await expect(getValidatedLedgerTransactions(binding)).resolves.toEqual(ledgerTransactions)
		expect(sourceFetch.mock.calls.map((call) => JSON.parse(call[2].body))).toMatchObject([
			{
				method: 'ledger_data',
				params: [{ ledger_index: 'validated', limit: 3, type: 'state' }],
			},
			{
				method: 'feature',
			},
			{
				method: 'ledger',
				params: [{ ledger_index: 'validated', transactions: true, expand: true }],
			},
		])
	})
})

describe('XRPL rippled network resolver', () => {
	beforeEach(() => {
		sourceFetch.mockReset()
	})

	const resolverFor = (fieldName: string) => {
		const resolver = xrpl.resolvers.find((candidate) => fieldName in candidate.projections.Xrpl)
		if (resolver == null)
			throw new Error(`Xrpl_Rippled spec missing Network.Xrpl.${fieldName} resolver`)
		return resolver
	}

	it('maps the validated ledger identity without fabricating history', async () => {
		sourceFetch.mockResolvedValueOnce(jsonRpcResponse(validatedLedger))

		await expect(xrpl.resolvers[0].resolve[NetworkSelector.Caip2].resolve({
			caip2: networkBySlug.xrpl.caip2,
		}, context)).resolves.toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: {
						caip2: networkBySlug.xrpl.caip2,
					},
					ledgerIndex: 93412781n,
				},
			},
		])
		expect(Object.keys(xrpl.resolvers[0].projections)).toEqual([
			'Xrpl',
		])
		expect(Object.keys(xrpl.resolvers[0].projections.Xrpl)).toEqual([
			'$$ledgers',
		])
	})

	it('registers exactly the five deferred relationship leaves', () => {
		expect(xrpl.resolvers
			.flatMap((resolver) => Object.keys(resolver.projections.Xrpl)))
			.toEqual([
				'$$ledgers',
				'$$accounts',
				'$$amendments',
				'$$amms',
				'$$ledgerEntries',
				'$$transactions',
			])
	})

	it('projects accounts, amendments, AMMs, ledger entries, and transactions', async () => {
		sourceFetch
			.mockResolvedValueOnce(jsonRpcResponse(ledgerData))
			.mockResolvedValueOnce(jsonRpcResponse(features))
			.mockResolvedValueOnce(jsonRpcResponse(ledgerData))
			.mockResolvedValueOnce(jsonRpcResponse(ledgerData))
			.mockResolvedValueOnce(jsonRpcResponse(ledgerTransactions))

		const accountsResolver = resolverFor('$$accounts')
		const accounts = await accountsResolver.resolve[NetworkSelector.Caip2].resolve({
			caip2: networkBySlug.xrpl.caip2,
		}, context)
		expect(accountsResolver.projections.Xrpl.$$accounts(accounts)).toEqual([{
			[EntityMetaKey.Selector]: {
				$network: { caip2: networkBySlug.xrpl.caip2 },
				account: 'rExampleAccount',
			},
		}])

		const amendmentsResolver = resolverFor('$$amendments')
		const amendments = await amendmentsResolver.resolve[NetworkSelector.Caip2].resolve({
			caip2: networkBySlug.xrpl.caip2,
		}, context)
		expect(amendmentsResolver.projections.Xrpl.$$amendments(amendments)).toEqual([{
			[EntityMetaKey.Selector]: {
				$network: { caip2: networkBySlug.xrpl.caip2 },
				amendmentId: '567A9B7D9E5C4A3B2C1D0E0F11121314',
			},
			name: 'ExampleAmendment',
		}])

		const ammsResolver = resolverFor('$$amms')
		const amms = await ammsResolver.resolve[NetworkSelector.Caip2].resolve({
			caip2: networkBySlug.xrpl.caip2,
		}, context)
		expect(ammsResolver.projections.Xrpl.$$amms(amms)).toEqual([{
			[EntityMetaKey.Selector]: {
				$network: { caip2: networkBySlug.xrpl.caip2 },
				ammAccount: 'rExampleAmm',
			},
			assetCurrency: 'USD',
			assetIssuer: 'rExampleIssuer',
			asset2Currency: 'XRP',
			lpTokenCurrency: '03C4B0B8E8D5A5F0',
		}])

		const ledgerEntriesResolver = resolverFor('$$ledgerEntries')
		const ledgerEntries = await ledgerEntriesResolver.resolve[NetworkSelector.Caip2].resolve({
			caip2: networkBySlug.xrpl.caip2,
		}, context)
		expect(ledgerEntriesResolver.projections.Xrpl.$$ledgerEntries(ledgerEntries)).toEqual(expect.arrayContaining([
			expect.objectContaining({
				[EntityMetaKey.Selector]: {
					$ledger: {
						$network: { caip2: networkBySlug.xrpl.caip2 },
						ledgerIndex: 93412781n,
					},
					entryHash: 'TRUSTLINE_HASH',
				},
				entryType: 'RippleState',
				previousTransactionHash: 'PREVIOUS_TRANSACTION_HASH',
				previousTransactionLedgerIndex: 93412780n,
			}),
		]))

		const transactionsResolver = resolverFor('$$transactions')
		const transactions = await transactionsResolver.resolve[NetworkSelector.Caip2].resolve({
			caip2: networkBySlug.xrpl.caip2,
		}, context)
		expect(transactionsResolver.projections.Xrpl.$$transactions(transactions)).toEqual([{
			[EntityMetaKey.Selector]: {
				$network: { caip2: networkBySlug.xrpl.caip2 },
				hash: 'TRANSACTION_HASH',
			},
			transactionType: 'Payment',
			account: 'rExampleAccount',
			sequence: 42,
		}])
	})

	it('returns an empty relationship without fabricating rows', async () => {
		sourceFetch
			.mockResolvedValueOnce(jsonRpcResponse(emptyLedgerData))
			.mockResolvedValueOnce(jsonRpcResponse(emptyLedgerData))
			.mockResolvedValueOnce(jsonRpcResponse(emptyLedgerData))

		for (const fieldName of ['$$accounts', '$$amms', '$$ledgerEntries']) {
			const resolver = resolverFor(fieldName)
			const rows = await resolver.resolve[NetworkSelector.Caip2].resolve({
				caip2: networkBySlug.xrpl.caip2,
			}, context)
			expect(rows).toEqual([])
		}
	})

	it('rejects unsupported networks before transport', async () => {
		await expect(xrpl.resolvers[0].resolve[NetworkSelector.Caip2].resolve({
			caip2: networkBySlug.ethereum.caip2,
		}, context)).rejects.toThrow('unsupported network')
		expect(sourceFetch).not.toHaveBeenCalled()
	})

	it('rejects an unvalidated ledger', async () => {
		sourceFetch.mockResolvedValueOnce(jsonRpcResponse({
			...validatedLedger,
			validated: false,
		}))

		await expect(xrpl.resolvers[0].resolve[NetworkSelector.Caip2].resolve({
			caip2: networkBySlug.xrpl.caip2,
		}, context)).rejects.toThrow('ledger is not validated')
	})

	it('rejects malformed validated-ledger identity', async () => {
		sourceFetch.mockResolvedValueOnce(jsonRpcResponse({
			...validatedLedger,
			ledger_index: -1,
		}))
		await expect(xrpl.resolvers[0].resolve[NetworkSelector.Caip2].resolve({
			caip2: networkBySlug.xrpl.caip2,
		}, context)).rejects.toThrow('malformed validated ledger index')

		sourceFetch.mockResolvedValueOnce(jsonRpcResponse({
			...validatedLedger,
			ledger_index: Number.MAX_SAFE_INTEGER + 1,
		}))
		await expect(xrpl.resolvers[0].resolve[NetworkSelector.Caip2].resolve({
			caip2: networkBySlug.xrpl.caip2,
		}, context)).rejects.toThrow('malformed validated ledger index')

		sourceFetch.mockResolvedValueOnce(jsonRpcResponse({
			...validatedLedger,
			ledger_hash: '',
		}))
		await expect(xrpl.resolvers[0].resolve[NetworkSelector.Caip2].resolve({
			caip2: networkBySlug.xrpl.caip2,
		}, context)).rejects.toThrow('malformed validated ledger hash')
	})
})
