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
	getAmmInfo,
	getFeatures,
	getLedgerEntry,
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
	XrplAmmInfoResult,
	XrplFeatureResult,
	XrplLedgerDataResult,
	XrplLedgerEntryResult,
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
const ledgerEntry = JSON.parse(readFileSync(
	new URL('../sources/Xrpl/JsonRpc/fixtures/ledger-entry.json', import.meta.url),
	'utf8'
)) satisfies XrplLedgerEntryResult
const ammInfo = JSON.parse(readFileSync(
	new URL('../sources/Xrpl/JsonRpc/fixtures/amm-info.json', import.meta.url),
	'utf8'
)) satisfies XrplAmmInfoResult
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

const binding = bindings[Source.Xrpl_Rippled][0]

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
				corsEnabled: false,
			}],
			wireProtocol: WireProtocol.JsonRpc2,
			apiFamily: ApiFamily.JsonRpcApi,
			operationGroups: [
				SourceOperationGroup.GenericRead,
			],
			delivery: SourceDelivery.HttpProxy,
			credentials: [],
			artifacts: [{
				kind: SourceArtifactKind.HandwrittenTypes,
				path: 'src/sources/Xrpl/JsonRpc/types.ts',
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

	it('rejects provider limits outside rippled bounds before transport', async () => {
		for (const query of [
			() => getValidatedLedgerData(0),
			() => getAccountObjects(account.account, 401),
			() => getAccountLines(account.account, 0),
			() => getAccountTransactions(account.account, 401),
		])
			await expect(query()).rejects.toThrow('invalid')

		expect(sourceFetch).not.toHaveBeenCalled()
	})

	it('fails closed on malformed arktype envelopes', async () => {
		sourceFetch.mockResolvedValueOnce(jsonRpcResponse({
			ledger_hash: '',
			ledger_index: 1,
			validated: true,
		}))
		await expect(getValidatedLedger()).rejects.toThrow('invalid ledger response envelope')

		sourceFetch.mockResolvedValueOnce(jsonRpcResponse({
			'': {
				name: 'Broken',
			},
		}))
		await expect(getFeatures()).rejects.toThrow('invalid feature response envelope')

		sourceFetch.mockResolvedValueOnce(jsonRpcResponse({
			amm: {
				account: 'rExampleAmm',
				amount: '1',
				amount2: '2',
				lp_token: {
					currency: '',
				},
				trading_fee: 0,
			},
			validated: true,
			ledger_index: 1,
		}))
		await expect(getAmmInfo('rExampleAmm')).rejects.toThrow('invalid amm_info response envelope')
	})

	it('loads typed amm_info for a validated AMM account', async () => {
		sourceFetch.mockResolvedValueOnce(jsonRpcResponse(ammInfo))
		await expect(getAmmInfo('rExampleAmm')).resolves.toEqual(ammInfo)
		expect(JSON.parse(sourceFetch.mock.calls[0][2].body)).toMatchObject({
			method: 'amm_info',
			params: [{
				amm_account: 'rExampleAmm',
				ledger_index: 'validated',
			}],
		})
	})

	it('loads a typed ledger_entry by canonical entry hash', async () => {
		sourceFetch.mockResolvedValueOnce(jsonRpcResponse(ledgerEntry))
		await expect(getLedgerEntry(ledgerEntry.index)).resolves.toEqual(ledgerEntry)
		expect(JSON.parse(sourceFetch.mock.calls[0][2].body)).toMatchObject({
			method: 'ledger_entry',
			params: [{
				index: ledgerEntry.index,
				ledger_index: 'validated',
			}],
		})

		sourceFetch.mockResolvedValueOnce(jsonRpcResponse(ledgerEntry))
		await expect(getLedgerEntry(ledgerEntry.index, validatedLedger.ledger_index)).resolves.toEqual(ledgerEntry)
		expect(JSON.parse(sourceFetch.mock.calls[1][2].body)).toMatchObject({
			params: [{
				index: ledgerEntry.index,
				ledger_index: validatedLedger.ledger_index,
			}],
		})

		sourceFetch.mockResolvedValueOnce(jsonRpcResponse(ledgerEntry))
		await expect(getLedgerEntry(ledgerEntry.index, {
			ledgerHash: validatedLedger.ledger_hash,
		})).resolves.toEqual(ledgerEntry)
		expect(JSON.parse(sourceFetch.mock.calls[2][2].body)).toMatchObject({
			params: [{
				index: ledgerEntry.index,
				ledger_hash: validatedLedger.ledger_hash,
			}],
		})
	})

	it('rejects non-canonical or mismatched ledger entry lookups', async () => {
		await expect(getLedgerEntry('not-a-hash')).rejects.toThrow('canonical hexadecimal')
		await expect(getLedgerEntry(ledgerEntry.index, -1)).rejects.toThrow('nonnegative safe integer')
		await expect(getLedgerEntry(ledgerEntry.index, {
			ledgerHash: 'not-a-hash',
		})).rejects.toThrow('canonical hexadecimal')
		expect(sourceFetch).not.toHaveBeenCalled()

		sourceFetch.mockResolvedValueOnce(jsonRpcResponse({
			...ledgerEntry,
			validated: false,
		}))
		await expect(getLedgerEntry(ledgerEntry.index)).rejects.toThrow('is not validated')

		sourceFetch.mockResolvedValueOnce(jsonRpcResponse({
			...ledgerEntry,
			index: 'B'.repeat(64),
		}))
		await expect(getLedgerEntry(ledgerEntry.index)).rejects.toThrow('does not match request')

		sourceFetch.mockResolvedValueOnce(jsonRpcResponse({
			...ledgerEntry,
			ledger_index: 93_412_782,
		}))
		await expect(getLedgerEntry(ledgerEntry.index, 93_412_781)).rejects.toThrow('does not match request')

		sourceFetch.mockResolvedValueOnce(jsonRpcResponse({
			...ledgerEntry,
			ledger_hash: 'B'.repeat(64),
		}))
		await expect(getLedgerEntry(ledgerEntry.index, {
			ledgerHash: validatedLedger.ledger_hash,
		})).rejects.toThrow('does not match request')
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
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.XrplLedger, [], 'ledgerHash')]: 'EC02890710AAA2B71221D74DE9B3B7A4E67E7A3A77B47D342E82D0B3B1E69456',
					[entityFieldAddressKey(EntityType.XrplLedger, [], 'validated')]: true,
					[entityFieldAddressKey(EntityType.XrplLedger, [], 'closeTimeMs')]: 1_726_684_800_000,
					[entityFieldAddressKey(EntityType.XrplLedger, [], 'totalCoinsDrops')]: 99_999_999_999_999_999n,
					[entityFieldAddressKey(EntityType.XrplLedger, [], 'parentHash')]: 'PARENT_HASH_EXAMPLE',
					[entityFieldAddressKey(EntityType.XrplLedger, [], 'accountHash')]: 'ACCOUNT_HASH_EXAMPLE',
					[entityFieldAddressKey(EntityType.XrplLedger, [], 'transactionHash')]: 'TRANSACTION_HASH_ROOT',
				},
			},
		])
	})

	it('projects enrolled XrplLedger tip fields from nested ledger body', async () => {
		sourceFetch.mockResolvedValueOnce(jsonRpcResponse(validatedLedger))
		const resolver = xrpl.resolvers.find((candidate) => (
			candidate.entityType === EntityType.XrplLedger
			&& 'NetworkLedgerIndex' in candidate.resolve
			&& 'closeTimeMs' in candidate.projections
		))
		if (resolver == null)
			throw new Error('missing XrplLedger tip field resolver')

		const snapshot = await resolver.resolve.NetworkLedgerIndex.resolve({
			$network: {
				caip2: networkBySlug.xrpl.caip2,
			},
			ledgerIndex: 93_412_781n,
		}, context)

		expect(resolver.projections.ledgerHash(snapshot)).toBe(validatedLedger.ledger_hash)
		expect(resolver.projections.ledgerIndex(snapshot)).toBe(93_412_781n)
		expect(resolver.projections.validated(snapshot)).toBe(true)
		expect(resolver.projections.closeTimeMs(snapshot)).toBe(1_726_684_800_000)
		expect(resolver.projections.totalCoinsDrops(snapshot)).toBe(99_999_999_999_999_999n)
		expect(resolver.projections.parentHash(snapshot)).toBe('PARENT_HASH_EXAMPLE')
		expect(resolver.projections.accountHash(snapshot)).toBe('ACCOUNT_HASH_EXAMPLE')
		expect(resolver.projections.transactionHash(snapshot)).toBe('TRANSACTION_HASH_ROOT')
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
		}, context)).rejects.toThrow('invalid ledger response envelope')

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
		}, context)).rejects.toThrow('invalid ledger response envelope')
	})
})

describe('XRPL rippled amendment and AMM entity resolvers', () => {
	beforeEach(() => {
		sourceFetch.mockReset()
	})

	const amendment = {
		$network: {
			caip2: networkBySlug.xrpl.caip2,
		},
		amendmentId: '567A9B7D9E5C4A3B2C1D0E0F11121314',
	}
	const amm = {
		$network: {
			caip2: networkBySlug.xrpl.caip2,
		},
		ammAccount: 'rExampleAmm',
	}

	it('projects amendment tip observations from feature + validated ledger', async () => {
		const resolver = xrpl.resolvers.find((candidate) => (
			candidate.entityType === EntityType.XrplAmendment
			&& '$$timestamps' in candidate.projections
		))
		if (resolver == null)
			throw new Error('Xrpl_Rippled spec missing XrplAmendment.$$timestamps resolver')

		sourceFetch
			.mockResolvedValueOnce(jsonRpcResponse(features))
			.mockResolvedValueOnce(jsonRpcResponse(validatedLedger))

		const snapshot = await resolver.resolve['NetworkAmendmentId'].resolve(amendment)
		expect(resolver.projections.name(snapshot)).toBe('ExampleAmendment')
		expect(resolver.projections.$$timestamps(snapshot)).toEqual([{
			[EntityMetaKey.Selector]: {
				$amendment: amendment,
				ledgerIndex: 93_412_781n,
				source: Source.Xrpl_Rippled,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.XrplAmendment_Timestamp, [], 'enabled')]: true,
				[entityFieldAddressKey(EntityType.XrplAmendment_Timestamp, [], 'supported')]: true,
				[entityFieldAddressKey(EntityType.XrplAmendment_Timestamp, [], 'status')]: 'enabled',
			},
		}])
	})

	it('projects AMM tip observations from amm_info', async () => {
		const resolver = xrpl.resolvers.find((candidate) => (
			candidate.entityType === EntityType.XrplAmm
			&& '$$timestamps' in candidate.projections
		))
		if (resolver == null)
			throw new Error('Xrpl_Rippled spec missing XrplAmm.$$timestamps resolver')

		sourceFetch.mockResolvedValueOnce(jsonRpcResponse(ammInfo))
		const snapshot = await resolver.resolve['NetworkAmmAccount'].resolve(amm)
		expect(resolver.projections.assetCurrency(snapshot)).toBe('USD')
		expect(resolver.projections.assetIssuer(snapshot)).toBe('rExampleIssuer')
		expect(resolver.projections.asset2Currency(snapshot)).toBe('XRP')
		expect(resolver.projections.lpTokenCurrency(snapshot)).toBe('03C4B0B8E8D5A5F0')
		expect(resolver.projections.$$timestamps(snapshot)).toEqual([{
			[EntityMetaKey.Selector]: {
				$amm: amm,
				ledgerIndex: 93_412_781n,
				source: Source.Xrpl_Rippled,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.XrplAmm_Timestamp, [], 'assetAmount')]: '500',
				[entityFieldAddressKey(EntityType.XrplAmm_Timestamp, [], 'asset2Amount')]: '1000000',
				[entityFieldAddressKey(EntityType.XrplAmm_Timestamp, [], 'lpTokenBalance')]: '2500',
				[entityFieldAddressKey(EntityType.XrplAmm_Timestamp, [], 'tradingFee')]: 500,
				[entityFieldAddressKey(EntityType.XrplAmm_Timestamp, [], 'auctionSlot')]: ammInfo.amm.auction_slot,
				[entityFieldAddressKey(EntityType.XrplAmm_Timestamp, [], 'voteSlots')]: [],
			},
		}])
	})

	it('rehydrates AMM and amendment timestamp selectors against tip state', async () => {
		const amendmentTimestampResolver = xrpl.resolvers.find((candidate) => (
			candidate.entityType === EntityType.XrplAmendment_Timestamp
		))
		const ammTimestampResolver = xrpl.resolvers.find((candidate) => (
			candidate.entityType === EntityType.XrplAmm_Timestamp
		))
		if (amendmentTimestampResolver == null || ammTimestampResolver == null)
			throw new Error('Xrpl_Rippled spec missing amendment/AMM timestamp resolvers')

		sourceFetch
			.mockResolvedValueOnce(jsonRpcResponse(features))
			.mockResolvedValueOnce(jsonRpcResponse(validatedLedger))
		await expect(amendmentTimestampResolver.resolve['AmendmentLedgerIndexSource'].resolve({
			$amendment: amendment,
			ledgerIndex: 93_412_781n,
			source: Source.Xrpl_Rippled,
		})).resolves.toMatchObject({
			enabled: true,
			supported: true,
			status: 'enabled',
		})

		sourceFetch.mockResolvedValueOnce(jsonRpcResponse(ammInfo))
		await expect(ammTimestampResolver.resolve['AmmLedgerIndexSource'].resolve({
			$amm: amm,
			ledgerIndex: 93_412_781n,
			source: Source.Xrpl_Rippled,
		})).resolves.toMatchObject({
			assetAmount: '500',
			asset2Amount: '1000000',
			lpTokenBalance: '2500',
			tradingFee: 500,
		})
	})
})

describe('XRPL rippled direct trustline resolvers', () => {
	beforeEach(() => {
		sourceFetch.mockReset()
	})

	const trustline = {
		$network: account.$network,
		account: account.account,
		currency: accountLines.lines[0].currency,
		issuer: accountLines.lines[0].account,
	}

	it('resolves native account relationships and a validated observation', async () => {
		const resolver = xrpl.resolvers.find(({ entityType }) => entityType === EntityType.XrplTrustline)
		if (resolver == null)
			throw new Error('Xrpl_Rippled spec missing direct trustline resolver')

		sourceFetch.mockResolvedValueOnce(jsonRpcResponse(accountLines))
		await expect(resolver.resolve['NetworkAccountCurrencyIssuer'].resolve(trustline)).resolves.toMatchObject({
			$account: {
				[EntityMetaKey.Selector]: account,
			},
			$issuerAccount: {
				[EntityMetaKey.Selector]: {
					$network: account.$network,
					account: accountLines.lines[0].account,
				},
			},
			$$timestamps: [{
				[EntityMetaKey.Selector]: {
					$trustline: trustline,
					ledgerIndex: 93_412_781n,
					source: Source.Xrpl_Rippled,
				},
			}],
		})
	})

	it('replays exact-ledger trustline state and rejects a foreign clock', async () => {
		const resolver = xrpl.resolvers.find(({ entityType }) => entityType === EntityType.XrplTrustline_Timestamp)
		if (resolver == null)
			throw new Error('Xrpl_Rippled spec missing trustline timestamp resolver')

		sourceFetch.mockResolvedValueOnce(jsonRpcResponse(accountLines))
		await expect(resolver.resolve['TrustlineLedgerIndexSource'].resolve({
			$trustline: trustline,
			ledgerIndex: 93_412_781n,
			source: Source.Xrpl_Rippled,
		})).resolves.toMatchObject({
			balance: accountLines.lines[0].balance,
			limit: accountLines.lines[0].limit,
			limitPeer: accountLines.lines[0].limit_peer,
		})

		sourceFetch.mockResolvedValueOnce(jsonRpcResponse({
			...accountLines,
			ledger_index: 93_412_782,
		}))
		await expect(resolver.resolve['TrustlineLedgerIndexSource'].resolve({
			$trustline: trustline,
			ledgerIndex: 93_412_781n,
			source: Source.Xrpl_Rippled,
		})).rejects.toThrow('ledger index does not match')
	})
})

describe('XRPL rippled ledger entry resolver', () => {
	beforeEach(() => {
		sourceFetch.mockReset()
	})

	const resolverFor = () => {
		const resolver = xrpl.resolvers.find((candidate) => (
			candidate.entityType === EntityType.XrplLedgerEntry
			&& 'LedgerEntryHash' in candidate.resolve
		))
		if (resolver == null)
			throw new Error('Xrpl_Rippled spec missing XrplLedgerEntry.LedgerEntryHash resolver')
		return resolver
	}

	it('projects a validated ledger entry against its ledger identity', async () => {
		const resolver = resolverFor()
		const entry = {
			$ledger: {
				$network: {
					caip2: networkBySlug.xrpl.caip2,
				},
				ledgerIndex: 93_412_781n,
				ledgerHash: validatedLedger.ledger_hash,
			},
			entryHash: ledgerEntry.index,
		}

		sourceFetch.mockResolvedValueOnce(jsonRpcResponse(ledgerEntry))
		const snapshot = await resolver.resolve['LedgerEntryHash'].resolve(entry)
		expect(resolver.projections.entryType(snapshot)).toBe('AccountRoot')
		expect(resolver.projections.account(snapshot)).toBe('rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn')
		expect(resolver.projections.previousTransactionHash(snapshot)).toBe('4E0AA11CBDD1760DE95B68DF2ABBE75C9698CEB548BEA9789053FCB3EBD444FB')
		expect(resolver.projections.previousTransactionLedgerIndex(snapshot)).toBe(66_054_510n)
		expect(resolver.projections.fields(snapshot)).toEqual(ledgerEntry.node)
		expect(JSON.parse(sourceFetch.mock.calls[0][2].body).params[0]).toMatchObject({
			index: ledgerEntry.index,
			ledger_index: 93_412_781,
		})
	})

	it('requests hash-keyed ledgers by ledger hash', async () => {
		const resolver = resolverFor()
		const entry = {
			$ledger: {
				$network: {
					caip2: networkBySlug.xrpl.caip2,
				},
				ledgerHash: validatedLedger.ledger_hash,
			},
			entryHash: ledgerEntry.index,
		}

		sourceFetch.mockResolvedValueOnce(jsonRpcResponse(ledgerEntry))
		const snapshot = await resolver.resolve['LedgerEntryHash'].resolve(entry)
		expect(resolver.projections.entryType(snapshot)).toBe('AccountRoot')
		expect(JSON.parse(sourceFetch.mock.calls[0][2].body).params[0]).toMatchObject({
			index: ledgerEntry.index,
			ledger_hash: validatedLedger.ledger_hash,
		})
	})

	it('rejects unsupported networks and oversized ledger indices before transport', async () => {
		const resolver = resolverFor()
		await expect(resolver.resolve['LedgerEntryHash'].resolve({
			$ledger: {
				$network: {
					caip2: networkBySlug.ethereum.caip2,
				},
				ledgerIndex: 93_412_781n,
			},
			entryHash: ledgerEntry.index,
		})).rejects.toThrow('unsupported network')
		await expect(resolver.resolve['LedgerEntryHash'].resolve({
			$ledger: {
				$network: {
					caip2: networkBySlug.xrpl.caip2,
				},
				ledgerIndex: BigInt(Number.MAX_SAFE_INTEGER) + 1n,
			},
			entryHash: ledgerEntry.index,
		})).rejects.toThrow('ledger index is too large')
		expect(sourceFetch).not.toHaveBeenCalled()
	})

	it('rejects unvalidated or foreign-ledger entries', async () => {
		const resolver = resolverFor()
		const entry = {
			$ledger: {
				$network: {
					caip2: networkBySlug.xrpl.caip2,
				},
				ledgerIndex: 93_412_781n,
				ledgerHash: validatedLedger.ledger_hash,
			},
			entryHash: ledgerEntry.index,
		}

		sourceFetch.mockResolvedValueOnce(jsonRpcResponse({
			...ledgerEntry,
			validated: false,
		}))
		await expect(resolver.resolve['LedgerEntryHash'].resolve(entry)).rejects.toThrow('is not validated')

		sourceFetch.mockResolvedValueOnce(jsonRpcResponse({
			...ledgerEntry,
			ledger_index: 93_412_782,
		}))
		await expect(resolver.resolve['LedgerEntryHash'].resolve(entry)).rejects.toThrow('does not match request')

		sourceFetch.mockResolvedValueOnce(jsonRpcResponse({
			...ledgerEntry,
			ledger_hash: 'B'.repeat(64),
		}))
		await expect(resolver.resolve['LedgerEntryHash'].resolve(entry)).rejects.toThrow('ledger hash does not match')

		sourceFetch.mockResolvedValueOnce(jsonRpcResponse({
			...ledgerEntry,
			node: {
				...ledgerEntry.node,
				Account: 'rDifferentAccount',
			},
		}))
		const snapshot = await resolver.resolve['LedgerEntryHash'].resolve(entry)
		expect(resolver.projections.account(snapshot)).toBe('rDifferentAccount')
	})
})
