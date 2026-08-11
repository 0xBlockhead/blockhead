import { beforeEach, describe, expect, it, vi } from 'vitest'

import bindings from '$/sources/BitcoinCashChips/bindings.ts'
import { Source } from '$/sources/Source.ts'

const sourceGetJson = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', () => ({
	firstHttpUrlForBinding: (binding: { endpoints: { locator: string }[] }) => binding.endpoints[0].locator,
	sourceGetJson,
	sourceGetText: vi.fn(),
}))

const { getTree } = await import('$/sources/BitcoinCashChips/Gitlab/queries.ts')
const binding = bindings[Source.BitcoinCashChips_Gitlab][0]

describe('Bitcoin Cash CHIP GitLab repository tree', () => {
	beforeEach(() => {
		sourceGetJson.mockReset()
	})

	it('uses the binding-owned repository and accepts file identities', async () => {
		sourceGetJson.mockResolvedValueOnce([{
			type: 'blob',
			name: 'CHIP-2026-08-example.md',
			path: 'spec/CHIP-2026-08-example.md',
		}])

		await expect(getTree()).resolves.toEqual([{
			type: 'blob',
			name: 'CHIP-2026-08-example.md',
			path: 'spec/CHIP-2026-08-example.md',
		}])
		expect(sourceGetJson).toHaveBeenCalledWith(
			binding,
			'https://gitlab.com/api/v4/projects/23431309/repository/tree?ref=master&per_page=100'
		)
	})

	it('fails closed when a tree entry lacks a stable identity', async () => {
		sourceGetJson.mockResolvedValueOnce([{
			type: 'blob',
			name: 'CHIP-2026-08-example.md',
		}])

		await expect(getTree()).rejects.toThrow(
			'BitcoinCashChips_Gitlab: invalid repository tree response'
		)
	})

	it('preserves transport failures', async () => {
		sourceGetJson.mockRejectedValueOnce(new Error('unavailable'))

		await expect(getTree()).rejects.toThrow('unavailable')
	})
})
