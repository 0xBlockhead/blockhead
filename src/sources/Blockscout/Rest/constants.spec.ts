import { describe, expect, it } from 'vitest'

import { blockscoutRestV2AtExplorerOrigin } from '$/sources/Blockscout/Rest/constants.ts'

describe('blockscoutRestV2AtExplorerOrigin', () => {
	it('is true for Blockscout hosted explorer hostnames', () => {
		expect(blockscoutRestV2AtExplorerOrigin('https://eth.blockscout.com')).toBe(true)
		expect(blockscoutRestV2AtExplorerOrigin('https://gnosis.blockscout.com')).toBe(true)
	})

	it('is false for other explorer UIs (no Blockscout REST at that origin)', () => {
		for (const origin of [
			'https://basescan.org',
			'https://arbiscan.io',
			'https://example.com',
		]) {
			expect(blockscoutRestV2AtExplorerOrigin(origin), origin).toBe(false)
		}
	})
})
