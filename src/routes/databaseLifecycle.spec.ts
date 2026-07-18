import { describe, expect, it, vi } from 'vitest'

import { databaseCloseWhenReady } from './databaseLifecycle.ts'

describe('databaseCloseWhenReady', () => {
	it('shares one eventual close across pagehide and HMR before and after readiness', async () => {
		let resolveDatabase: ((database: { close: () => Promise<void> }) => void) | undefined
		const close = vi.fn(async () => {})
		const databasePromise = new Promise<{ close: () => Promise<void> }>((resolve) => {
			resolveDatabase = resolve
		})
		const closeDatabase = databaseCloseWhenReady(databasePromise)
		const pagehideClose = closeDatabase()
		const hmrCloseBeforeReady = closeDatabase()

		expect(hmrCloseBeforeReady).toBe(pagehideClose)
		expect(close).not.toHaveBeenCalled()
		resolveDatabase?.({ close })
		await pagehideClose
		expect(close).toHaveBeenCalledOnce()
		expect(closeDatabase()).toBe(pagehideClose)
		await closeDatabase()
		expect(close).toHaveBeenCalledOnce()
	})
})
