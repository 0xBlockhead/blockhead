import { beforeEach, describe, expect, it, vi } from 'vitest'

import bindings from '$/sources/Helius/bindings.ts'
import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	SourceEndpointKind,
	SourceTargetKind,
} from '$/sources/SourceBinding.ts'

const corsFetch = vi.hoisted(() => vi.fn())

vi.mock('$/lib/http.ts', () => ({
	corsFetch,
	throwHttpError: vi.fn(),
}))

const { getEnhancedTransactions } = await import('$/sources/Helius/Rest/queries.ts')

const binding = bindings[Source.Helius].find(
	({ apiFamily }) => apiFamily === ApiFamily.RestJson
)

if (binding == null)
	throw new Error('Helius REST test binding is missing')

describe('Helius enhanced transaction transport', () => {
	beforeEach(() => {
		corsFetch.mockReset()
		corsFetch.mockResolvedValue(new Response(JSON.stringify([{
			signature: 'transaction-signature',
			slot: 123,
		}])))
	})

	it('uses the binding-owned endpoint and browser delivery', async () => {
		await expect(getEnhancedTransactions({
			binding,
			signatures: ['transaction-signature'],
			publicEnv: {
				PUBLIC_HELIUS_API_KEY: 'helius key',
			},
		})).resolves.toEqual([{
			signature: 'transaction-signature',
			slot: 123,
		}])

		expect(corsFetch).toHaveBeenCalledWith(
			'https://api-mainnet.helius-rpc.com/v0/transactions/?api-key=helius%20key',
			{
				delivery: binding.delivery,
				origins: [{
					origin: 'https://api-mainnet.helius-rpc.com',
					corsEnabled: true,
				}],
				init: {
					method: 'POST',
					headers: {
						'content-type': 'application/json',
					},
					body: JSON.stringify({
						transactions: ['transaction-signature'],
					}),
				},
			}
		)
	})
})
