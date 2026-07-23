import { describe, expect, it, vi } from 'vitest'

import { databaseCloseWhenReady } from './databaseLifecycle.ts'

describe('databaseCloseWhenReady', () => {
	it('shares one eventual HMR close before and after readiness', async () => {
		let resolveDatabase: ((database: { close: () => Promise<void> }) => void) | undefined
		const close = vi.fn(async () => {})
		const databasePromise = new Promise<{ close: () => Promise<void> }>((resolve) => {
			resolveDatabase = resolve
		})
		const closeDatabase = databaseCloseWhenReady(databasePromise)
		const hmrClose = closeDatabase()
		const hmrCloseBeforeReady = closeDatabase()

		expect(hmrCloseBeforeReady).toBe(hmrClose)
		expect(close).not.toHaveBeenCalled()
		resolveDatabase?.({ close })
		await hmrClose
		expect(close).toHaveBeenCalledOnce()
		expect(closeDatabase()).toBe(hmrClose)
		await closeDatabase()
		expect(close).toHaveBeenCalledOnce()
	})
})
