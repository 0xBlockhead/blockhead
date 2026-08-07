import {
	afterEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import bindings from '$/sources/Sourcify/bindings.ts'
import {
	getContractLookup,
	getContractLookupPath,
	getContractLookupsByAddress,
	listVerifiedContracts,
} from '$/sources/Sourcify/Rest/queries.ts'
import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	SourceDelivery,
} from '$/sources/SourceBinding.ts'

const binding = bindings[Source.Sourcify_Rest][0]
const depositContract = '0x00000000219ab540356cBB839Cbe05303d7705Fa' as const
const jsonResponse = (body: unknown, status = 200) => (
	new Response(JSON.stringify(body), {
		status,
		headers: {
			'content-type': 'application/json',
		},
	})
)

describe('Sourcify REST product queries', () => {
	afterEach(() => {
		vi.restoreAllMocks()
		vi.unstubAllGlobals()
	})

	it('binds the Sourcify Server API v2 repository over HTTP proxy', () => {
		expect(binding.apiFamily).toBe(ApiFamily.SourcifyRestV2)
		expect(binding.delivery).toBe(SourceDelivery.HttpProxy)
		expect(binding.endpoints[0]?.locator).toBe('https://sourcify.dev/server/v2')
		expect(binding.endpoints[0]?.corsEnabled).toBe(false)
	})

	it('encodes lowercase address contract lookup with product fields', () => {
		expect(getContractLookupPath({
			chainId: 1,
			address: depositContract,
		})).toBe(
			`/contract/1/${depositContract}?fields=abi%2Ccompilation%2Cdeployment%2Cmetadata%2Csources%2CstorageLayout%2CproxyResolution`
		)
	})

	it('routes contract lookup through the registered browser HTTP proxy binding', async () => {
		const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(jsonResponse({
			match: 'exact_match',
			creationMatch: 'exact_match',
			runtimeMatch: 'exact_match',
			matchId: '2115',
			chainId: '1',
			address: depositContract.toLowerCase(),
			abi: [],
		}))
		vi.stubGlobal('fetch', fetchMock)
		vi.stubGlobal('window', {})

		await expect(getContractLookup({
			chainId: 1,
			address: '0x00000000219AB540356CBB839CBE05303D7705FA',
		})).resolves.toMatchObject({
			match: 'exact_match',
			matchId: '2115',
		})

		expect(fetchMock).toHaveBeenCalledWith(
			expect.stringMatching(
				/^\/api-proxy\/.+\/0\/https%3A%2F%2Fsourcify\.dev%2Fserver%2Fv2%2Fcontract%2F1%2F0x00000000219ab540356cbb839cbe05303d7705fa%3Ffields%3D/
			),
			expect.objectContaining({
				signal: expect.any(AbortSignal),
			})
		)
	})

	it('softens only missing verified contracts and hard-fails other HTTP errors', async () => {
		vi.spyOn(globalThis, 'fetch')
			.mockResolvedValueOnce(new Response(null, { status: 404 }))
			.mockResolvedValueOnce(new Response(null, { status: 500 }))

		await expect(getContractLookup({
			chainId: 1,
			address: depositContract,
		})).resolves.toBeNull()
		await expect(getContractLookup({
			chainId: 1,
			address: depositContract,
		})).rejects.toThrow('500')
	})

	it('rejects verified-looking payloads that carry no match status', async () => {
		vi.spyOn(globalThis, 'fetch').mockResolvedValue(jsonResponse({
			abi: [],
			chainId: '1',
			address: depositContract.toLowerCase(),
		}))

		await expect(getContractLookup({
			chainId: 1,
			address: depositContract,
		})).resolves.toBeNull()
	})

	it('fail-closes malformed contract lookup envelopes', async () => {
		vi.spyOn(globalThis, 'fetch').mockResolvedValue(jsonResponse({
			match: 'exact_match',
			chainId: 1,
			address: depositContract.toLowerCase(),
		}))

		await expect(getContractLookup({
			chainId: 1,
			address: depositContract,
		})).rejects.toThrow('invalid contract lookup response envelope')
	})

	it('fail-closes malformed verified-contract list envelopes', async () => {
		vi.spyOn(globalThis, 'fetch').mockResolvedValue(jsonResponse({
			results: {
				match: 'exact_match',
			},
		}))

		await expect(listVerifiedContracts({
			chainId: 1,
			limit: 10,
		})).rejects.toThrow('invalid verified contract list response envelope')
	})

	it('rejects contract lookups that substitute a different chain or address', async () => {
		vi.spyOn(globalThis, 'fetch').mockResolvedValue(jsonResponse({
			match: 'exact_match',
			chainId: '10',
			address: depositContract.toLowerCase(),
			abi: [],
		}))

		await expect(getContractLookup({
			chainId: 1,
			address: depositContract,
		})).rejects.toThrow('belongs to a different chain')

		vi.spyOn(globalThis, 'fetch').mockResolvedValue(jsonResponse({
			match: 'exact_match',
			chainId: '1',
			address: '0x1111111111111111111111111111111111111111',
			abi: [],
		}))

		await expect(getContractLookup({
			chainId: 1,
			address: depositContract,
		})).rejects.toThrow('belongs to a different address')
	})

	it('rejects verified-contract list rows that escape the requested chain', async () => {
		vi.spyOn(globalThis, 'fetch').mockResolvedValue(jsonResponse({
			results: [
				{
					match: 'exact_match',
					chainId: '10',
					address: depositContract.toLowerCase(),
				},
			],
		}))

		await expect(listVerifiedContracts({
			chainId: 1,
			limit: 10,
		})).rejects.toThrow('includes a different chain')
	})

	it('rejects all-chain match summaries that substitute a different address', async () => {
		vi.spyOn(globalThis, 'fetch').mockResolvedValue(jsonResponse({
			results: [
				{
					match: 'exact_match',
					chainId: '1',
					address: '0x1111111111111111111111111111111111111111',
				},
			],
		}))

		await expect(getContractLookupsByAddress({
			address: depositContract,
		})).rejects.toThrow('includes a different address')
	})

	it('lists verified contracts with clamped pagination and continuation', async () => {
		const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(jsonResponse({
			results: [
				{
					match: 'exact_match',
					chainId: '1',
					address: depositContract.toLowerCase(),
					matchId: '2115',
				},
			],
		}))
		vi.stubGlobal('fetch', fetchMock)
		vi.stubGlobal('window', {})

		await expect(listVerifiedContracts({
			chainId: 1,
			limit: 500,
			sort: 'asc',
			afterMatchId: '100',
		})).resolves.toEqual([
			{
				match: 'exact_match',
				chainId: '1',
				address: depositContract.toLowerCase(),
				matchId: '2115',
			},
		])

		expect(fetchMock.mock.calls[0]?.[0]).toMatch(
			/contracts%2F1%3Flimit%3D200%26sort%3Dasc%26afterMatchId%3D100$/
		)
	})

	it('returns all-chain match summaries for one address', async () => {
		vi.spyOn(globalThis, 'fetch').mockResolvedValue(jsonResponse({
			results: [
				{
					match: 'exact_match',
					chainId: '1',
					address: depositContract.toLowerCase(),
				},
				{
					match: 'exact_match',
					chainId: '11155111',
					address: depositContract.toLowerCase(),
				},
			],
		}))
		vi.stubGlobal('window', {})

		await expect(getContractLookupsByAddress({
			address: depositContract,
		})).resolves.toHaveLength(2)
	})

	it('accepts live proxy/metadata/deployment leftovers without freestyling schema', async () => {
		vi.spyOn(globalThis, 'fetch').mockResolvedValue(jsonResponse({
			match: 'exact_match',
			creationMatch: 'exact_match',
			runtimeMatch: 'exact_match',
			matchId: '2115',
			chainId: '1',
			address: depositContract.toLowerCase(),
			abi: [],
			deployment: {
				deployer: '0xb20a608c624Ca5003905aA834De7156C68b2E1d0',
				transactionHash: `0x${'e'.repeat(64)}`,
				blockNumber: '11052984',
				transactionIndex: '2',
			},
			metadata: {
				compiler: {
					version: '0.6.11+commit.5ef660b1',
				},
				language: 'Solidity',
				output: {
					abi: [],
				},
				settings: {
					optimizer: {
						enabled: true,
					},
				},
				version: 1,
			},
			proxyResolution: {
				isProxy: false,
				proxyType: null,
				implementations: [],
			},
		}))

		await expect(getContractLookup({
			chainId: 1,
			address: depositContract,
		})).resolves.toMatchObject({
			match: 'exact_match',
			deployment: {
				blockNumber: '11052984',
				transactionIndex: '2',
			},
			metadata: {
				output: {
					abi: [],
				},
				version: 1,
			},
			proxyResolution: {
				isProxy: false,
				proxyType: null,
			},
		})
	})

	it('fail-closes malformed proxyType leftovers', async () => {
		vi.spyOn(globalThis, 'fetch').mockResolvedValue(jsonResponse({
			match: 'exact_match',
			chainId: '1',
			address: depositContract.toLowerCase(),
			proxyResolution: {
				isProxy: false,
				proxyType: 12,
			},
		}))

		await expect(getContractLookup({
			chainId: 1,
			address: depositContract,
		})).rejects.toThrow('invalid contract lookup response envelope')
	})
})
