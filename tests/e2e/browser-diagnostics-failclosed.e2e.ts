import { expect, test } from '@playwright/test'

import { setupPageRuntimeDiagnostics } from '../_e2eBrowserHelpers.ts'


test.describe('browser diagnostics fail closed', () => {
	test('console errors reject the active diagnostic step', async ({ page }) => {
		const diagnostics = setupPageRuntimeDiagnostics(page)

		await expect(diagnostics.step((async () => {
			await page.setContent('<main>diagnostics</main>')
			await page.evaluate(() => console.error('[diagnostics-test] console failure'))
			await page.waitForTimeout(100)
		})())).rejects.toThrow('console.error')
	})

	test('HTTP failures reject the active diagnostic step', async ({ page }) => {
		await page.route('**/__diagnostics_failure__', (route) => route.fulfill({
			status: 503,
			body: 'diagnostic failure',
		}))
		const diagnostics = setupPageRuntimeDiagnostics(page)

		await expect(
			diagnostics.step(page.goto('/__diagnostics_failure__'))
		).rejects.toThrow('response:503')
	})

	test('request failures reject the active diagnostic step', async ({ page }) => {
		await page.route('**/__diagnostics_request_failure__', (route) => route.abort('failed'))
		const diagnostics = setupPageRuntimeDiagnostics(page)
		const rejection = diagnostics.step(page.waitForTimeout(5_000))
		void page.goto('/__diagnostics_request_failure__').catch(() => {})

		await expect(rejection).rejects.toThrow('requestfailed:GET')
	})

	test('application fetch cancellation does not masquerade as a page failure', async ({ page }) => {
		await page.goto('/')
		await page.route('**/__diagnostics_fetch_cancellation__', (route) => route.abort('aborted'))
		const diagnostics = setupPageRuntimeDiagnostics(page)

		await expect(diagnostics.step(page.evaluate(async () => {
			await fetch('/__diagnostics_fetch_cancellation__').catch(() => undefined)
		}))).resolves.toBeUndefined()
	})

	test('legacy ignore option cannot suppress browser failures', async ({ page }) => {
		const diagnostics = setupPageRuntimeDiagnostics(page, {
			ignoreTransientDevLoad: true,
		})

		await expect(diagnostics.step((async () => {
			await page.setContent('<main>diagnostics</main>')
			await page.evaluate(() => console.error('[diagnostics-test] unsuppressed failure'))
			await page.waitForTimeout(100)
		})())).rejects.toThrow('console.error')
	})
})
