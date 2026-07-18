import { beforeEach, describe, expect, it, vi } from 'vitest'

import { NearContractStorageEntrySelector } from '$/schema/NearContractStorageEntry.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const corsFetch = vi.hoisted(() => vi.fn())

vi.mock('$/lib/http.ts', () => ({
	corsFetch,
	throwHttpError: vi.fn(),
}))

const { default: nearRpc } = await import('$/resolvers/NearRpc-JsonRpc.ts')
const { viewState } = await import('$/sources/NearRpc/JsonRpc/queries.ts')

const context = {
	filters: [],
	sorts: [],
	pagination: {},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}

const storageEntryResolver = nearRpc.resolvers.find((resolver) => (
	resolver.entityType === EntityType.NearContractStorageEntry
))

if (storageEntryResolver == null)
	throw new Error('NearRpc_JsonRpc spec missing NearContractStorageEntry resolver')

const selector = {
	$contract: {
		$network: {
			slug: 'near',
		},
		accountId: 'contract.near',
	},
	keyBase64: 'YWNjb3VudA==',
	blockHeight: 123n,
	source: Source.NearRpc_JsonRpc,
}

describe('NEAR contract storage query', () => {
	beforeEach(() => {
		corsFetch.mockReset()
	})

	it('queries view_state at the selected historical block and exact key prefix', async () => {
		corsFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			jsonrpc: '2.0',
			id: 'dontcare',
			result: {
				block_hash: 'block-hash',
				block_height: 123,
				values: [{
					key: selector.keyBase64,
					value: 'dmFsdWU=',
				}],
				proof: [],
			},
		})))

		await expect(viewState({
			rpcUrl: 'https://rpc.mainnet.near.org',
			accountId: selector.$contract.accountId,
			prefixBase64: selector.keyBase64,
			blockHeight: 123,
		})).resolves.toMatchObject({
			block_hash: 'block-hash',
			block_height: 123,
		})
		expect(JSON.parse(corsFetch.mock.calls[0][1].init.body)).toMatchObject({
			method: 'query',
			params: {
				request_type: 'view_state',
				block_id: 123,
				account_id: 'contract.near',
				prefix_base64: selector.keyBase64,
			},
		})
	})
})

describe('NEAR contract storage resolver', () => {
	beforeEach(() => {
		corsFetch.mockReset()
	})

	it('materializes only the exact key returned at the selected block', async () => {
		corsFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			jsonrpc: '2.0',
			id: 'dontcare',
			result: {
				block_hash: 'block-hash',
				block_height: 123,
				values: [
					{
						key: `${selector.keyBase64}suffix`,
						value: 'd3Jvbmc=',
					},
					{
						key: selector.keyBase64,
						value: 'dmFsdWU=',
					},
				],
				proof: [],
			},
		})))

		await expect(storageEntryResolver.resolve[
			NearContractStorageEntrySelector.ContractKeyBlockHeightSource
		].resolve(selector, context)).resolves.toEqual({
			blockHash: 'block-hash',
			valueBase64: 'dmFsdWU=',
			prefixBase64: selector.keyBase64,
		})
		expect(Object.keys(storageEntryResolver.projections).sort()).toEqual([
			'blockHash',
			'prefixBase64',
			'valueBase64',
		])
	})

	it('rejects wrong sources, networks, heights, and prefix-only results', async () => {
		await expect(storageEntryResolver.resolve[
			NearContractStorageEntrySelector.ContractKeyBlockHeightSource
		].resolve({
			...selector,
			source: Source.Constants_Internal,
		}, context)).rejects.toThrow('unsupported source')
		expect(corsFetch).not.toHaveBeenCalled()

		await expect(storageEntryResolver.resolve[
			NearContractStorageEntrySelector.ContractKeyBlockHeightSource
		].resolve({
			...selector,
			$contract: {
				...selector.$contract,
				$network: {
					slug: 'ethereum',
				},
			},
		}, context)).rejects.toThrow('unsupported network')
		expect(corsFetch).not.toHaveBeenCalled()

		corsFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			jsonrpc: '2.0',
			id: 'dontcare',
			result: {
				block_hash: 'wrong-block',
				block_height: 124,
				values: [{
					key: selector.keyBase64,
					value: 'dmFsdWU=',
				}],
				proof: [],
			},
		})))
		await expect(storageEntryResolver.resolve[
			NearContractStorageEntrySelector.ContractKeyBlockHeightSource
		].resolve(selector, context)).rejects.toThrow('response block height 124 does not match 123')

		corsFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			jsonrpc: '2.0',
			id: 'dontcare',
			result: {
				block_hash: 'block-hash',
				block_height: 123,
				values: [{
					key: `${selector.keyBase64}suffix`,
					value: 'd3Jvbmc=',
				}],
				proof: [],
			},
		})))
		await expect(storageEntryResolver.resolve[
			NearContractStorageEntrySelector.ContractKeyBlockHeightSource
		].resolve(selector, context)).rejects.toThrow('storage key')
	})
})
