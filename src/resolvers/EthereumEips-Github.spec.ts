import { describe, expect, it, vi } from 'vitest'

const sourceGetJson = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', () => ({
	sourceGetJson,
	sourceGetText: vi.fn(),
}))

const { getContents } = await import('$/sources/EthereumEips/Github/queries.ts')

describe('Ethereum EIPs source binding selection', () => {
	it.each([
		[
			'eip',
			'ethereum/EIPs@master:EIPS',
		],
		[
			'erc',
			'ethereum/ercs@master:ERCS',
		],
	] as const)('selects the %s repository inside the source layer', async (
		ledger,
		targetKey
	) => {
		sourceGetJson.mockResolvedValueOnce([])

		await getContents({ ledger })

		expect(sourceGetJson.mock.calls.at(-1)?.[0].target.key).toBe(targetKey)
	})
})
