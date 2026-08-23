import { describe, expect, it, vi } from 'vitest'

import { createRadicleCliSession } from '$/sources/RadicleCli/Local/platform.ts'

describe('Radicle CLI local platform boundary', () => {
	it('fails closed when no injectable authority is present', async () => {
		await expect(createRadicleCliSession().readRepository('rad:z3gqcJUoA1n9HaHKufZs5FCSGazv5D6Dt7Fnx1C4h2kKz'))
			.rejects.toThrow('local radicle CLI authority is unavailable')
	})
})
