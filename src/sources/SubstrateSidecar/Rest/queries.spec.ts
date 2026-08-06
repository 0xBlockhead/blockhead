import { beforeEach, describe, expect, it, vi } from 'vitest'

import { Source } from '$/sources/Source.ts'
import { SourceEndpointKind } from '$/sources/SourceBinding.ts'

const sourceFetch = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', () => ({
	firstHttpUrlForBinding: (binding: {
		endpoints: {
			locator: string
		}[]
	}) => binding.endpoints[0].locator,
	sourceFetch,
	sourceGetJson: async (_binding: unknown, url: string) => {
		const response = await sourceFetch(_binding, url)
		return response.json()
	},
	sourceGetText: vi.fn(),
}))

const {
	getAccountAssetBalances,
	getAccountBalanceInfo,
	getBlock,
	getBlockHead,
	getNodeVersion,
	getRuntimeMetadata,
	getRuntimeSpec,
	getStakingValidators,
} = await import('$/sources/SubstrateSidecar/Rest/queries.ts')

const balanceInfo = {
	at: {
		hash: '0xFINALIZED_BLOCK_HASH',
		height: '20000000',
	},
	nonce: '9007199254740993',
	tokenSymbol: 'DOT',
	free: '123456789012345678901234',
	reserved: '0',
	frozen: '0',
	transferable: '123456789012345678901234',
	locks: [],
}

const block = {
	number: '32440766',
	hash: '0xBLOCK_HASH',
	parentHash: '0xPARENT_HASH',
	stateRoot: '0xSTATE_ROOT',
	extrinsicsRoot: '0xEXTRINSICS_ROOT',
	authorId: '16QuK5qdXsb7BdJ47p7r73RmyUAMpi27T2LnnkGa7xezUSDm',
	extrinsics: [
		{
			method: {
				pallet: 'timestamp',
				method: 'set',
			},
			signature: null,
			hash: '0xEXTRINSIC_HASH',
			events: [
				{
					method: {
						pallet: 'system',
						method: 'ExtrinsicSuccess',
					},
					data: [],
				},
			],
			success: true,
		},
	],
}

describe('Substrate Sidecar query envelopes', () => {
	beforeEach(() => {
		sourceFetch.mockReset()
	})

	it('fail-closes account balance info and preserves decimal strings', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify(balanceInfo)))
		await expect(getAccountBalanceInfo({
			accountId: '13UVJyLnbVp9RBZYFwFGyDvVd1y27Tt8tkntv6Q7JVPhFsTB',
		})).resolves.toMatchObject({
			nonce: '9007199254740993',
			free: '123456789012345678901234',
		})

		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			...balanceInfo,
			free: '-1',
		})))
		await expect(getAccountBalanceInfo({
			accountId: '13UVJyLnbVp9RBZYFwFGyDvVd1y27Tt8tkntv6Q7JVPhFsTB',
		})).rejects.toThrow('invalid account balance info response envelope')
	})

	it('accepts live block/event object method shapes', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify(block)))
		await expect(getBlock({
			blockId: block.hash,
		})).resolves.toMatchObject({
			number: '32440766',
			extrinsics: [
				{
					method: {
						pallet: 'timestamp',
						method: 'set',
					},
					events: [
						{
							method: {
								pallet: 'system',
								method: 'ExtrinsicSuccess',
							},
						},
					],
				},
			],
		})
		expect(sourceFetch.mock.calls[0][1]).toBe(`http://127.0.0.1:8080/blocks/${block.hash}`)
	})

	it('fail-closes malformed blocks and rejects empty account ids', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			...block,
			number: '-1',
		})))
		await expect(getBlock({
			blockId: 1n,
		})).rejects.toThrow('invalid block response envelope')

		await expect(getAccountBalanceInfo({
			accountId: '',
		})).rejects.toThrow('account ID must not be empty')
		expect(sourceFetch).toHaveBeenCalledTimes(1)
	})

	it('reads finalized head and asset-balance envelopes', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify(block)))
		await expect(getBlockHead()).resolves.toMatchObject({
			hash: block.hash,
		})
		expect(sourceFetch.mock.calls[0][1]).toBe('http://127.0.0.1:8080/blocks/head?finalized=true')

		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			at: {
				hash: '0xAH_HASH',
				height: '19148225',
			},
			assets: [
				{
					assetId: '100',
					balance: '42',
					isFrozen: false,
					isSufficient: true,
				},
			],
		})))
		await expect(getAccountAssetBalances({
			accountId: '13UVJyLnbVp9RBZYFwFGyDvVd1y27Tt8tkntv6Q7JVPhFsTB',
		})).resolves.toMatchObject({
			assets: [
				{
					assetId: '100',
					balance: '42',
				},
			],
		})
	})

	it('normalizes v14 runtime metadata pallets and fails closed on missing pallets', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			magicNumber: 1635018093,
			metadata: {
				v14: {
					pallets: [
						{
							name: 'System',
							index: '0',
						},
						{
							name: 'Staking',
							index: 7,
						},
					],
				},
			},
		})))
		await expect(getRuntimeMetadata()).resolves.toEqual({
			pallets: [
				{
					name: 'System',
					index: '0',
				},
				{
					name: 'Staking',
					index: 7,
				},
			],
		})

		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			magicNumber: 1,
			metadata: {
				v14: {},
			},
		})))
		await expect(getRuntimeMetadata()).rejects.toThrow('invalid runtime metadata response envelope')
	})

	it('fail-closes staking validators envelopes', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			validators: [
				{
					accountId: '15oF4uVJwmo4qjQJeHCDruaKdS2nG6t6dD6rJ8X2vY8rKzq',
					totalStake: '1000',
				},
			],
		})))
		await expect(getStakingValidators()).resolves.toMatchObject({
			validators: [
				{
					accountId: '15oF4uVJwmo4qjQJeHCDruaKdS2nG6t6dD6rJ8X2vY8rKzq',
				},
			],
		})

		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			validators: [
				{
					accountId: '',
				},
			],
		})))
		await expect(getStakingValidators()).rejects.toThrow('invalid staking validators response envelope')
	})

	it('reads runtime spec + node version and fail-closes malformed specs', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			at: {
				hash: '0xRUNTIME_HASH',
				height: '32440766',
			},
			specName: 'polkadot',
			implName: 'parity-polkadot',
			authoringVersion: '0',
			specVersion: '1007001',
			implVersion: 0,
			transactionVersion: 26,
			stateVersion: '1',
		})))
		await expect(getRuntimeSpec()).resolves.toEqual({
			at: {
				hash: '0xRUNTIME_HASH',
				height: '32440766',
			},
			specName: 'polkadot',
			implName: 'parity-polkadot',
			authoringVersion: 0,
			specVersion: 1007001,
			implVersion: 0,
			transactionVersion: 26,
			stateVersion: 1,
		})
		expect(sourceFetch.mock.calls[0][1]).toBe('http://127.0.0.1:8080/runtime')

		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			clientVersion: '0.17.0',
			clientImplName: 'substrate-api-sidecar',
			chain: 'Polkadot',
		})))
		await expect(getNodeVersion()).resolves.toMatchObject({
			clientVersion: '0.17.0',
			chain: 'Polkadot',
		})
		expect(sourceFetch.mock.calls[1][1]).toBe('http://127.0.0.1:8080/node/version')

		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			at: {
				hash: '0xRUNTIME_HASH',
				height: '32440766',
			},
			specName: '',
			authoringVersion: 0,
			specVersion: 1,
		})))
		await expect(getRuntimeSpec()).rejects.toThrow('invalid runtime spec response envelope')
	})

	it('routes asset-balance transport through an override binding for Asset Hub prep', async () => {
		const relayBinding = (await import('$/sources/SubstrateSidecar/bindings.ts')).default[Source.SubstrateSidecar_Rest][0]
		const assetHubBinding = {
			...relayBinding,
			endpoints: [
				{
					endpointKind: SourceEndpointKind.HttpUrl,
					locator: 'http://127.0.0.1:8081',
					corsEnabled: false,
				},
			],
		}
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			at: {
				hash: '0xAH_HASH',
				height: '19148225',
			},
			assets: [
				{
					assetId: 1984,
					balance: '7',
				},
			],
		})))
		await expect(getAccountAssetBalances({
			accountId: '13UVJyLnbVp9RBZYFwFGyDvVd1y27Tt8tkntv6Q7JVPhFsTB',
			binding: assetHubBinding,
		})).resolves.toMatchObject({
			assets: [
				{
					assetId: 1984,
					balance: '7',
				},
			],
		})
		expect(sourceFetch.mock.calls[0][1]).toBe(
			'http://127.0.0.1:8081/accounts/13UVJyLnbVp9RBZYFwFGyDvVd1y27Tt8tkntv6Q7JVPhFsTB/asset-balances'
		)
	})
})
