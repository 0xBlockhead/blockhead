import { readFileSync } from 'node:fs'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { EntityMetaKey } from '$/schema/$schema.ts'
import { NetworkSelector } from '$/schema/Network.ts'
import { sourceProviderDefinitions } from '$/sources/$sourceProviders.ts'
import { Source } from '$/sources/Source.ts'
import {
	getServerInfo,
	getValidatedLedger,
} from '$/sources/Xrpl/JsonRpc/queries.ts'
import type {
	XrplLedgerResult,
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
})

describe('XRPL rippled network resolver', () => {
	beforeEach(() => {
		sourceFetch.mockReset()
	})

	it('maps the validated ledger identity without fabricating history', async () => {
		sourceFetch.mockResolvedValueOnce(jsonRpcResponse(validatedLedger))

		await expect(xrpl.resolvers[0].resolve[NetworkSelector.Slug]({
			slug: 'xrpl',
		}, context)).resolves.toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: {
						slug: 'xrpl',
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

	it('rejects unsupported networks before transport', async () => {
		await expect(xrpl.resolvers[0].resolve[NetworkSelector.Slug]({
			slug: 'ethereum',
		}, context)).rejects.toThrow('unsupported network')
		expect(sourceFetch).not.toHaveBeenCalled()
	})

	it('rejects an unvalidated ledger', async () => {
		sourceFetch.mockResolvedValueOnce(jsonRpcResponse({
			...validatedLedger,
			validated: false,
		}))

		await expect(xrpl.resolvers[0].resolve[NetworkSelector.Slug]({
			slug: 'xrpl',
		}, context)).rejects.toThrow('ledger is not validated')
	})

	it('rejects malformed validated-ledger identity', async () => {
		sourceFetch.mockResolvedValueOnce(jsonRpcResponse({
			...validatedLedger,
			ledger_index: -1,
		}))
		await expect(xrpl.resolvers[0].resolve[NetworkSelector.Slug]({
			slug: 'xrpl',
		}, context)).rejects.toThrow('malformed validated ledger index')

		sourceFetch.mockResolvedValueOnce(jsonRpcResponse({
			...validatedLedger,
			ledger_hash: '',
		}))
		await expect(xrpl.resolvers[0].resolve[NetworkSelector.Slug]({
			slug: 'xrpl',
		}, context)).rejects.toThrow('malformed validated ledger hash')
	})
})
