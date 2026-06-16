import { afterEach, describe, expect, it, vi } from 'vitest'

import { getUserOperationsPage } from '$/sources/Blockscout/Rest/queries.ts'

describe('Blockscout account-abstraction queries', () => {
	afterEach(() => {
		vi.restoreAllMocks()
	})

	it('rejects Blockscout error envelopes before reading paginated rows', async () => {
		vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({
			error: 'account abstraction disabled',
			items: [],
		}), {
			headers: {
				'content-type': 'application/json',
			},
		}))

		await expect(getUserOperationsPage({
			explorerOrigin: 'https://eth.blockscout.com',
			limit: 3,
		})).rejects.toThrow(
			'Blockscout GET /proxy/account-abstraction/operations: account abstraction disabled'
		)
	})

	it('returns paginated rows when the Blockscout envelope has no error payload', async () => {
		vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({
			items: [
				{
					hash: '0x1234',
					status: true,
				},
			],
			next_page_params: {
				page: 2,
			},
		}), {
			headers: {
				'content-type': 'application/json',
			},
		}))

		await expect(getUserOperationsPage({
			explorerOrigin: 'https://eth.blockscout.com',
			limit: 3,
		})).resolves.toEqual([
			{
				hash: '0x1234',
				status: true,
			},
		])
	})
})
