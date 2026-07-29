import { readFileSync } from 'node:fs'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { networkBySlug } from '$/constants/Network.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import bindings from '$/sources/Xrpl/bindings.ts'
import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	SourceArtifactKind,
	SourceCredentialScope,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
} from '$/sources/SourceBinding.ts'
import {
	getAccountInfo,
	getAccountLines,
	getAccountObjects,
	getAccountTransactions,
	getFeatures,
	getValidatedLedgerData,
	getServerInfo,
	getValidatedLedger,
	getValidatedLedgerTransactions,
} from '$/sources/Xrpl/JsonRpc/queries.ts'
import type {
	XrplAccountInfoResult,
	XrplAccountLinesResult,
	XrplAccountObjectsResult,
	XrplAccountTransactionsResult,
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
const account = {
	$network: {
		caip2: networkBySlug.xrpl.caip2,
	},
	account: 'rExampleAccount',
}
const accountInfo = {
	account_data: {
		Account: account.account,
		Balance: '123456789',
		Flags: 8_388_608,
		LedgerEntryType: 'AccountRoot',
		OwnerCount: 2,
		Sequence: 42,
	},
	ledger_hash: 'VALIDATED_LEDGER_HASH',
	ledger_index: 93_412_781,
	validated: true,
} satisfies XrplAccountInfoResult
const accountObjects = {
	account: account.account,
	account_objects: [{
		Account: account.account,
		LedgerEntryType: 'Offer',
		PreviousTxnID: 'PREVIOUS_TRANSACTION_HASH',
		PreviousTxnLgrSeq: 93_412_780,
		index: 'ACCOUNT_OBJECT_HASH',
	}],
	ledger_hash: 'VALIDATED_LEDGER_HASH',
	ledger_index: 93_412_781,
	validated: true,
} satisfies XrplAccountObjectsResult
const accountLines = {
	account: account.account,
	ledger_hash: 'VALIDATED_LEDGER_HASH',
	ledger_index: 93_412_781,
	lines: [{
		account: 'rExampleIssuer',
		authorized: true,
		balance: '25.5',
		currency: 'USD',
		limit: '100',
		limit_peer: '0',
		no_ripple: false,
		no_ripple_peer: true,
	}],
	validated: true,
} satisfies XrplAccountLinesResult
const accountTransactions = {
	account: account.account,
	ledger_index_min: 32_570,
	ledger_index_max: 93_412_781,
	transactions: [{
		close_time_iso: '2025-09-17T17:50:10Z',
		hash: 'ACCOUNT_TRANSACTION_HASH',
		ledger_hash: 'VALIDATED_LEDGER_HASH',
		ledger_index: 93_412_781,
		meta: {
			AffectedNodes: [],
			TransactionResult: 'tesSUCCESS',
		},
		tx_json: {
			Account: account.account,
			Fee: '12',
			Sequence: 42,
			TransactionType: 'Payment',
		},
		validated: true,
	}],
	validated: true,
} satisfies XrplAccountTransactionsResult

const binding = bindings[Source.Xrpl_Rippled]

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

	it('selects the exact canonical XRPL mainnet binding', () => {
		expect(binding).toEqual({
			source: Source.Xrpl_Rippled,
			target: {
				kind: SourceTargetKind.Caip2Network,
				key: 'xrpl:0',
			},
			endpoints: [{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://s1.ripple.com:51234',
				origin: 'https://s1.ripple.com:51234',
				corsEnabled: false,
			}],
			wireProtocol: WireProtocol.JsonRpc2,
			apiFamily: ApiFamily.JsonRpcApi,
			operationGroups: [
				SourceOperationGroup.GenericRead,
			],
			delivery: SourceDelivery.HttpProxy,
			credentials: [{
				scope: SourceCredentialScope.None,
			}],
			artifacts: [{
				kind: SourceArtifactKind.HandwrittenTypes,
				path: 'src/sources/Xrpl/JsonRpc/types.ts',
				generated: false,
			}],
		})
	})

	it('executes only the typed server information and validated-ledger operations', async () => {
		sourceFetch
			.mockResolvedValueOnce(jsonRpcResponse(serverInfo))
			.mockResolvedValueOnce(jsonRpcResponse(validatedLedger))

		await expect(getServerInfo()).resolves.toEqual(serverInfo)
		await expect(getValidatedLedger()).resolves.toEqual(validatedLedger)
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

		await expect(getServerInfo()).resolves.toEqual({
			info: {},
		})
	})

	it('executes typed relationship operations with bounded state queries', async () => {
		sourceFetch
			.mockResolvedValueOnce(jsonRpcResponse(ledgerData))
			.mockResolvedValueOnce(jsonRpcResponse(features))
			.mockResolvedValueOnce(jsonRpcResponse(ledgerTransactions))

		await expect(getValidatedLedgerData(3)).resolves.toEqual(ledgerData)
		await expect(getFeatures()).resolves.toEqual(features)
		await expect(getValidatedLedgerTransactions()).resolves.toEqual(ledgerTransactions)
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

	it('uses validated account methods and preserves provider markers', async () => {
		sourceFetch
			.mockResolvedValueOnce(jsonRpcResponse(accountInfo))
			.mockResolvedValueOnce(jsonRpcResponse(accountObjects))
			.mockResolvedValueOnce(jsonRpcResponse(accountLines))
			.mockResolvedValueOnce(jsonRpcResponse(accountTransactions))

		await expect(getAccountInfo(account.account)).resolves.toEqual(accountInfo)
		await expect(getAccountObjects(account.account, 3, 'objects-marker')).resolves.toEqual(accountObjects)
		await expect(getAccountLines(account.account, 3, 'lines-marker')).resolves.toEqual(accountLines)
		await expect(getAccountTransactions(account.account, 3, {
			ledger: 93_412_781,
			seq: 2,
		})).resolves.toEqual(accountTransactions)
		expect(sourceFetch.mock.calls.map((call) => JSON.parse(call[2].body))).toMatchObject([
			{
				method: 'account_info',
				params: [{
					account: account.account,
					ledger_index: 'validated',
				}],
			},
			{
				method: 'account_objects',
				params: [{
					account: account.account,
					ledger_index: 'validated',
					limit: 10,
					marker: 'objects-marker',
				}],
			},
			{
				method: 'account_lines',
				params: [{
					account: account.account,
					ledger_index: 'validated',
					limit: 10,
					marker: 'lines-marker',
				}],
			},
			{
				method: 'account_tx',
				params: [{
					account: account.account,
					binary: false,
					forward: false,
					ledger_index_min: -1,
					ledger_index_max: -1,
					limit: 3,
					marker: {
						ledger: 93_412_781,
						seq: 2,
					},
				}],
			},
		])
	})

	it('rejects provider limits outside rippled bounds before transport', () => {
		for (const query of [
			() => getValidatedLedgerData(0),
			() => getAccountObjects(account.account, 401),
			() => getAccountLines(account.account, 0),
			() => getAccountTransactions(account.account, 401),
		])
			expect(query).toThrow('invalid')

		expect(sourceFetch).not.toHaveBeenCalled()
	})
})

describe('XRPL rippled account resolver', () => {
	beforeEach(() => {
		sourceFetch.mockReset()
	})

	const resolverFor = (fieldName: string) => {
		const resolver = xrpl.resolvers.find((candidate) => (
			candidate.entityType === EntityType.XrplAccount
			&& fieldName in candidate.projections
		))
		if (resolver == null)
			throw new Error(`Xrpl_Rippled spec missing XrplAccount.${fieldName} resolver`)
		return resolver
	}

	it('implements every existing XrplAccount carousel relationship', () => {
		expect(xrpl.resolvers
			.filter((resolver) => resolver.entityType === EntityType.XrplAccount)
			.flatMap((resolver) => Object.keys(resolver.projections)))
			.toEqual([
				'$$timestamps',
				'$$ledgerEntries',
				'$$transactions',
				'$$trustlines',
			])
	})

	it('projects validated XRP balance, objects, transactions, and trustlines', async () => {
		sourceFetch
			.mockResolvedValueOnce(jsonRpcResponse(accountInfo))
			.mockResolvedValueOnce(jsonRpcResponse(accountObjects))
			.mockResolvedValueOnce(jsonRpcResponse(accountTransactions))
			.mockResolvedValueOnce(jsonRpcResponse(accountLines))

		const timestampsResolver = resolverFor('$$timestamps')
		const timestamps = await timestampsResolver.resolve['NetworkAccount'].resolve(account, context)
		expect(timestampsResolver.projections.$$timestamps(timestamps)).toEqual([{
			[EntityMetaKey.Selector]: {
				$account: account,
				ledgerIndex: 93_412_781n,
				source: Source.Xrpl_Rippled,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.XrplAccount_Timestamp, [], 'balanceDrops')]: 123_456_789n,
				[entityFieldAddressKey(EntityType.XrplAccount_Timestamp, [], 'ownerCount')]: 2,
				[entityFieldAddressKey(EntityType.XrplAccount_Timestamp, [], 'sequence')]: 42,
				[entityFieldAddressKey(EntityType.XrplAccount_Timestamp, [], 'flags')]: 8_388_608,
			},
		}])

		const objectsResolver = resolverFor('$$ledgerEntries')
		const objectsPage = await objectsResolver.resolve['NetworkAccount'].resolve(account, context)
		expect(objectsResolver.projections.$$ledgerEntries.select(objectsPage, account, context)).toEqual([
			expect.objectContaining({
				[EntityMetaKey.Selector]: {
					$ledger: {
						$network: account.$network,
						ledgerIndex: 93_412_781n,
					},
					entryHash: 'ACCOUNT_OBJECT_HASH',
				},
			}),
		])
		expect(objectsResolver.projections.$$ledgerEntries.continuation(objectsPage, account, context)).toEqual({
			operation: 'account-objects',
			target: account.account,
			terminal: true,
		})

		const transactionsResolver = resolverFor('$$transactions')
		const transactionsPage = await transactionsResolver.resolve['NetworkAccount'].resolve(account, context)
		const transactions = transactionsResolver.projections.$$transactions.select(transactionsPage, account, context)
		expect(transactions).toHaveLength(1)
		expect(transactions[0]).toMatchObject({
			[EntityMetaKey.Selector]: {
				$network: account.$network,
				hash: 'ACCOUNT_TRANSACTION_HASH',
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.XrplTransaction, [], 'transactionType')]: 'Payment',
				[entityFieldAddressKey(EntityType.XrplTransaction, [], 'account')]: account.account,
				[entityFieldAddressKey(EntityType.XrplTransaction, [], 'sequence')]: 42,
			},
		})
		expect(transactions[0][EntityMetaKey.Fields]?.[
			entityFieldAddressKey(EntityType.XrplTransaction, [], '$$timestamps')
		]).toEqual([
			expect.objectContaining({
				[EntityMetaKey.Selector]: {
					$transaction: {
						$network: account.$network,
						hash: 'ACCOUNT_TRANSACTION_HASH',
					},
					ledgerIndex: 93_412_781n,
					source: Source.Xrpl_Rippled,
				},
			}),
		])

		const trustlinesResolver = resolverFor('$$trustlines')
		const trustlinesPage = await trustlinesResolver.resolve['NetworkAccount'].resolve(account, context)
		const trustlines = trustlinesResolver.projections.$$trustlines.select(trustlinesPage, account, context)
		expect(trustlines).toHaveLength(1)
		expect(trustlines[0]).toMatchObject({
			[EntityMetaKey.Selector]: {
				$network: account.$network,
				account: account.account,
				currency: 'USD',
				issuer: 'rExampleIssuer',
			},
		})
	})

	it('keeps resolved-empty relationships empty and terminal', async () => {
		for (const [fieldName, response] of [
			['$$ledgerEntries', { ...accountObjects, account_objects: [] }],
			['$$transactions', { ...accountTransactions, transactions: [] }],
			['$$trustlines', { ...accountLines, lines: [] }],
		] as const) {
			sourceFetch.mockResolvedValueOnce(jsonRpcResponse(response))
			const resolver = resolverFor(fieldName)
			const page = await resolver.resolve['NetworkAccount'].resolve(account, context)
			const projection = resolver.projections[fieldName]
			expect(projection.select(page, account, context)).toEqual([])
			expect(projection.continuation(page, account, context).terminal).toBe(true)
		}
	})

	it('roundtrips opaque continuation markers', async () => {
		sourceFetch.mockResolvedValueOnce(jsonRpcResponse({
			...accountTransactions,
			marker: {
				ledger: 93_412_781,
				seq: 2,
			},
		}))
		const resolver = resolverFor('$$transactions')
		const page = await resolver.resolve['NetworkAccount'].resolve(account, context)
		const continuation = resolver.projections.$$transactions.continuation(page, account, context)
		expect(continuation).toEqual({
			operation: 'account-transactions',
			target: account.account,
			terminal: false,
			token: '{"ledger":93412781,"seq":2}',
		})

		sourceFetch.mockResolvedValueOnce(jsonRpcResponse({
			...accountTransactions,
			marker: undefined,
		}))
		await resolver.resolve['NetworkAccount'].resolve(account, {
			...context,
			providerContinuationToken: continuation.token,
		})
		expect(JSON.parse(sourceFetch.mock.calls[1][2].body).params[0].marker).toEqual({
			ledger: 93_412_781,
			seq: 2,
		})

		sourceFetch.mockResolvedValueOnce(jsonRpcResponse({
			...accountTransactions,
			marker: {
				ledger: 93_412_781,
				seq: 2,
			},
		}))
		const repeatedPage = await resolver.resolve['NetworkAccount'].resolve(account, {
			...context,
			providerContinuationToken: continuation.token,
		})
		expect(() => resolver.projections.$$transactions.continuation(
			repeatedPage,
			account,
			{
				...context,
				providerContinuationToken: continuation.token,
			}
		)).toThrow('continuation did not advance')

		await expect(resolver.resolve['NetworkAccount'].resolve(account, {
			...context,
			providerContinuationToken: 'null',
		})).rejects.toThrow('invalid continuation marker')
	})

	it('rejects duplicate identities and malformed trustline amounts', async () => {
		const resolver = resolverFor('$$trustlines')
		sourceFetch.mockResolvedValueOnce(jsonRpcResponse({
			...accountLines,
			lines: [
				...accountLines.lines,
				...accountLines.lines,
			],
		}))
		await expect(resolver.resolve['NetworkAccount'].resolve(
			account,
			context
		)).rejects.toThrow('duplicate identities')

		sourceFetch.mockResolvedValueOnce(jsonRpcResponse({
			...accountLines,
			lines: [{
				...accountLines.lines[0],
				balance: '25 XRP',
			}],
		}))
		const page = await resolver.resolve['NetworkAccount'].resolve(account, context)
		expect(() => resolver.projections.$$trustlines.select(page, account, context)).toThrow(
			'malformed amount'
		)
	})

	it('resolves an exact validated account observation', async () => {
		sourceFetch.mockResolvedValueOnce(jsonRpcResponse(accountInfo))
		const resolver = xrpl.resolvers.find((candidate) => candidate.entityType === EntityType.XrplAccount_Timestamp)
		if (resolver == null)
			throw new Error('Xrpl_Rippled spec missing XrplAccount_Timestamp resolver')

		await expect(resolver.resolve[
			'AccountLedgerIndexSource'
		].resolve({
			$account: account,
			ledgerIndex: 93_412_781n,
			source: Source.Xrpl_Rippled,
		}, context)).resolves.toMatchObject({
			balanceDrops: 123_456_789n,
			ownerCount: 2,
			sequence: 42,
		})
	})

	it('rejects non-validated or mismatched account data', async () => {
		const resolver = resolverFor('$$timestamps')
		for (const response of [
			{ ...accountInfo, validated: false },
			{
				...accountInfo,
				account_data: {
					...accountInfo.account_data,
					Account: 'rDifferentAccount',
				},
			},
		]) {
			sourceFetch.mockResolvedValueOnce(jsonRpcResponse(response))
			await expect(resolver.resolve['NetworkAccount'].resolve(
				account,
				context
			)).rejects.toThrow()
		}
	})
})

describe('XRPL rippled network resolver', () => {
	beforeEach(() => {
		sourceFetch.mockReset()
	})

	const resolverFor = (fieldName: string) => {
		const resolver = xrpl.resolvers.find((candidate) => (
			candidate.entityType === EntityType.Network
			&& 'Xrpl' in candidate.projections
			&& fieldName in candidate.projections.Xrpl
		))
		if (resolver == null)
			throw new Error(`Xrpl_Rippled spec missing Network.Xrpl.${fieldName} resolver`)
		return resolver
	}

	it('maps the validated ledger identity without fabricating history', async () => {
		sourceFetch.mockResolvedValueOnce(jsonRpcResponse(validatedLedger))
		const resolver = resolverFor('$$ledgers')

		await expect(resolver.resolve['Caip2'].resolve({
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
		expect(Object.keys(resolver.projections)).toEqual([
			'Xrpl',
		])
		expect(Object.keys(resolver.projections.Xrpl)).toEqual([
			'$$ledgers',
		])
	})

	it('registers exactly the six network relationship leaves', () => {
		expect(xrpl.resolvers
			.filter((resolver) => resolver.entityType === EntityType.Network)
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
		const network = {
			caip2: networkBySlug.xrpl.caip2,
		}
		const accounts = await accountsResolver.resolve['Caip2'].resolve(network, context)
		expect(accountsResolver.projections.Xrpl.$$accounts.select(accounts, network, context)).toEqual([{
			[EntityMetaKey.Selector]: {
				$network: { caip2: networkBySlug.xrpl.caip2 },
				account: 'rExampleAccount',
			},
		}])

		const amendmentsResolver = resolverFor('$$amendments')
		const amendments = await amendmentsResolver.resolve['Caip2'].resolve(network, context)
		expect(amendmentsResolver.projections.Xrpl.$$amendments(amendments)).toEqual([{
			[EntityMetaKey.Selector]: {
				$network: { caip2: networkBySlug.xrpl.caip2 },
				amendmentId: '567A9B7D9E5C4A3B2C1D0E0F11121314',
			},
			name: 'ExampleAmendment',
		}])

		const ammsResolver = resolverFor('$$amms')
		const amms = await ammsResolver.resolve['Caip2'].resolve(network, context)
		expect(ammsResolver.projections.Xrpl.$$amms.select(amms, network, context)).toEqual([{
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
		const ledgerEntries = await ledgerEntriesResolver.resolve['Caip2'].resolve(network, context)
		expect(ledgerEntriesResolver.projections.Xrpl.$$ledgerEntries.select(
			ledgerEntries,
			network,
			context
		)).toEqual(expect.arrayContaining([
			{
				[EntityMetaKey.Selector]: {
					$ledger: {
						$network: { caip2: networkBySlug.xrpl.caip2 },
						ledgerIndex: 93412781n,
					},
					entryHash: 'TRUSTLINE_HASH',
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.XrplLedgerEntry, [], 'entryType')]: 'RippleState',
					[entityFieldAddressKey(EntityType.XrplLedgerEntry, [], 'previousTransactionHash')]: 'PREVIOUS_TRANSACTION_HASH',
					[entityFieldAddressKey(EntityType.XrplLedgerEntry, [], 'previousTransactionLedgerIndex')]: 93412780n,
					[entityFieldAddressKey(EntityType.XrplLedgerEntry, [], 'fields')]: expect.objectContaining({
						index: 'TRUSTLINE_HASH',
					}),
				},
			},
		]))

		const transactionsResolver = resolverFor('$$transactions')
		const transactions = await transactionsResolver.resolve['Caip2'].resolve({
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

	it('pins paginated ledger state to one validated ledger and rejects non-progress', async () => {
		const resolver = resolverFor('$$accounts')
		const network = {
			caip2: networkBySlug.xrpl.caip2,
		}
		const marker = {
			ledger: 93_412_781,
			seq: 2,
		}
		sourceFetch.mockResolvedValueOnce(jsonRpcResponse({
			...ledgerData,
			marker,
		}))
		const page = await resolver.resolve['Caip2'].resolve(network, context)
		const continuation = resolver.projections.Xrpl.$$accounts.continuation(page, network, context)
		expect(continuation).toEqual({
			operation: 'validated-ledger-data',
			target: networkBySlug.xrpl.slug,
			terminal: false,
			token: '{"ledgerIndex":93412781,"marker":{"ledger":93412781,"seq":2}}',
		})

		sourceFetch.mockResolvedValueOnce(jsonRpcResponse({
			...emptyLedgerData,
			marker,
		}))
		const repeatedPage = await resolver.resolve['Caip2'].resolve(network, {
			...context,
			providerContinuationToken: continuation.token,
		})
		expect(JSON.parse(sourceFetch.mock.calls[1][2].body).params[0]).toMatchObject({
			ledger_index: 93_412_781,
			marker,
		})
		expect(() => resolver.projections.Xrpl.$$accounts.continuation(
			repeatedPage,
			network,
			{
				...context,
				providerContinuationToken: continuation.token,
			}
		)).toThrow('continuation did not advance')

		sourceFetch.mockResolvedValueOnce(jsonRpcResponse({
			...emptyLedgerData,
			ledger_index: 93_412_782,
		}))
		await expect(resolver.resolve['Caip2'].resolve(network, {
			...context,
			providerContinuationToken: continuation.token,
		})).rejects.toThrow('changed ledgers')
	})

	it('returns an empty relationship without fabricating rows', async () => {
		sourceFetch
			.mockResolvedValueOnce(jsonRpcResponse(emptyLedgerData))
			.mockResolvedValueOnce(jsonRpcResponse(emptyLedgerData))
			.mockResolvedValueOnce(jsonRpcResponse(emptyLedgerData))

		for (const fieldName of ['$$accounts', '$$amms', '$$ledgerEntries']) {
			const resolver = resolverFor(fieldName)
			const network = {
				caip2: networkBySlug.xrpl.caip2,
			}
			const page = await resolver.resolve['Caip2'].resolve(network, context)
			const projection = resolver.projections.Xrpl[fieldName]
			expect(projection.select(page, network, context)).toEqual([])
			expect(projection.continuation(page, network, context).terminal).toBe(true)
		}
	})

	it('rejects unsupported networks before transport', async () => {
		await expect(resolverFor('$$ledgers').resolve['Caip2'].resolve({
			caip2: networkBySlug.ethereum.caip2,
		}, context)).rejects.toThrow('unsupported network')
		expect(sourceFetch).not.toHaveBeenCalled()
	})

	it('rejects an unvalidated ledger', async () => {
		sourceFetch.mockResolvedValueOnce(jsonRpcResponse({
			...validatedLedger,
			validated: false,
		}))

		await expect(resolverFor('$$ledgers').resolve['Caip2'].resolve({
			caip2: networkBySlug.xrpl.caip2,
		}, context)).rejects.toThrow('ledger is not validated')
	})

	it('rejects malformed validated-ledger identity', async () => {
		sourceFetch.mockResolvedValueOnce(jsonRpcResponse({
			...validatedLedger,
			ledger_index: -1,
		}))
		await expect(resolverFor('$$ledgers').resolve['Caip2'].resolve({
			caip2: networkBySlug.xrpl.caip2,
		}, context)).rejects.toThrow('malformed validated ledger index')

		sourceFetch.mockResolvedValueOnce(jsonRpcResponse({
			...validatedLedger,
			ledger_index: Number.MAX_SAFE_INTEGER + 1,
		}))
		await expect(resolverFor('$$ledgers').resolve['Caip2'].resolve({
			caip2: networkBySlug.xrpl.caip2,
		}, context)).rejects.toThrow('malformed validated ledger index')

		sourceFetch.mockResolvedValueOnce(jsonRpcResponse({
			...validatedLedger,
			ledger_hash: '',
		}))
		await expect(resolverFor('$$ledgers').resolve['Caip2'].resolve({
			caip2: networkBySlug.xrpl.caip2,
		}, context)).rejects.toThrow('malformed validated ledger hash')
	})
})
