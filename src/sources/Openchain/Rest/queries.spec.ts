import {
	afterEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import bindings from '$/sources/Openchain/bindings.ts'
import {
	getEventEntries,
	getFunctionEntries,
	lookupPath,
	summarizeOpenchainEntries,
} from '$/sources/Openchain/Rest/queries.ts'
import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	SourceDelivery,
} from '$/sources/SourceBinding.ts'

const openchainBinding = bindings[Source.Openchain_Rest].find((binding) => (
	binding.target.key === 'openchain-signatures'
))
const jsonResponse = (body: unknown, status = 200) => (
	new Response(JSON.stringify(body), {
		status,
		headers: {
			'content-type': 'application/json',
		},
	})
)

describe('Openchain REST product queries', () => {
	afterEach(() => {
		vi.restoreAllMocks()
		vi.unstubAllGlobals()
	})

	it('binds Openchain over HTTP proxy', () => {
		expect(openchainBinding?.apiFamily).toBe(ApiFamily.RestJson)
		expect(openchainBinding?.delivery).toBe(SourceDelivery.HttpProxy)
		expect(openchainBinding?.endpoints[0]?.locator).toBe(
			'https://api.4byte.sourcify.dev/signature-database/v1'
		)
		expect(openchainBinding?.endpoints[0]?.corsEnabled).toBe(false)
	})

	it('encodes unfiltered lookup paths for function and event hex', () => {
		expect(lookupPath({
			function: '0xa9059cbb',
			filter: false,
		})).toBe('/lookup?function=0xa9059cbb&filter=false')
		expect(lookupPath({
			event: '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
			filter: false,
		})).toBe(
			'/lookup?event=0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef&filter=false'
		)
	})

	it('summarizes unfiltered names plus filtered/verified counts', () => {
		expect(summarizeOpenchainEntries([
			{
				name: 'transfer(address,uint256)',
				filtered: false,
				hasVerifiedContract: true,
			},
			{
				name: 'spam(uint256)',
				filtered: true,
				hasVerifiedContract: false,
			},
			{
				name: 'alsoSpam()',
				filtered: true,
				hasVerifiedContract: true,
			},
		])).toEqual({
			signatures: [
				'transfer(address,uint256)',
			],
			filteredSignatureCount: 2,
			verifiedCandidateCount: 2,
		})
	})

	it('routes function lookup through the registered browser HTTP proxy binding', async () => {
		const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(jsonResponse({
			ok: true,
			result: {
				function: {
					'0xa9059cbb': [
						{
							name: 'transfer(address,uint256)',
							filtered: false,
							hasVerifiedContract: true,
						},
					],
				},
			},
		}))
		vi.stubGlobal('fetch', fetchMock)
		vi.stubGlobal('window', {})

		await expect(getFunctionEntries({
			hex: '0xA9059CBB',
		})).resolves.toEqual([
			{
				name: 'transfer(address,uint256)',
				filtered: false,
				hasVerifiedContract: true,
			},
		])

		expect(fetchMock).toHaveBeenCalledWith(
			expect.stringMatching(
				/^\/api-proxy\/.+\/0\/https%3A%2F%2Fapi\.4byte\.sourcify\.dev%2Fsignature-database%2Fv1%2Flookup%3Ffunction%3D0xa9059cbb%26filter%3Dfalse$/
			),
			expect.objectContaining({
				signal: expect.any(AbortSignal),
			})
		)
	})

	it('hard-fails non-OK Openchain payloads and HTTP errors (no soft-empty)', async () => {
		vi.spyOn(globalThis, 'fetch')
			.mockResolvedValueOnce(jsonResponse({
				ok: false,
			}))
			.mockResolvedValueOnce(new Response(null, { status: 500 }))
			.mockResolvedValueOnce(new Response(null, { status: 404 }))

		await expect(getFunctionEntries({
			hex: '0xa9059cbb',
		})).rejects.toThrow('Openchain_Rest: lookup rejected')
		await expect(getEventEntries({
			hex: '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
		})).rejects.toThrow('500')
		await expect(getFunctionEntries({
			hex: '0xa9059cbb',
		})).rejects.toThrow('404')
	})

	it('hard-fails Openchain payloads that omit ok', async () => {
		vi.spyOn(globalThis, 'fetch').mockResolvedValue(jsonResponse({
			result: {
				function: {
					'0xa9059cbb': [],
				},
			},
		}))

		await expect(getFunctionEntries({
			hex: '0xa9059cbb',
		})).rejects.toThrow('invalid lookup response envelope')
	})
})
