import { expect, test } from '@playwright/test'

import { attachWalletExtensionStructuralTelemetry } from '../../../scripts/wallet-extensions/WalletExtensionRequestCheckpoint.ts'


test('captures bounded structural telemetry across existing and future pages', async ({ context, page }) => {
	await page.setContent('<button>safe</button><button disabled>blocked</button><input id="safe-input">')
	const telemetry = attachWalletExtensionStructuralTelemetry(context)
	const futurePage = await context.newPage()
	await futurePage.setContent('<dialog open>private text must not persist</dialog><button>next</button>')
	await page.route('http://telemetry.invalid/**', (route) => route.abort('failed'))
	await page.evaluate(() => {
		void fetch('http://telemetry.invalid/secret?seed=private').catch(() => {})
		setTimeout(() => { throw new Error('private page error') }, 0)
	})
	for (let index = 0; index < 40; index++)
		await page.evaluate(async (path) => { await fetch(`http://telemetry.invalid/${path}`).catch(() => {}) }, `request-${index}`)

	await expect.poll(async () => (await telemetry.capture()).networkFailures.length).toBe(32)
	const captured = await telemetry.capture()
	assertTelemetry(captured)
	telemetry.dispose()
	await page.unroute('http://telemetry.invalid/**')
	await page.route('http://telemetry.invalid/**', (route) => route.fulfill({
		status: 451,
		headers: { 'access-control-allow-origin': '*' },
		body: '',
	}))
	await page.evaluate(async () => { await fetch('http://telemetry.invalid/after-dispose').catch(() => {}) })
	const afterDispose = await context.newPage()
	await afterDispose.setContent('<button disabled>private</button>')
	const errorEvent = afterDispose.waitForEvent('pageerror')
	await afterDispose.evaluate(() => { setTimeout(() => { throw new Error('permission denied private') }, 0) })
	await errorEvent
	const disposedCapture = await telemetry.capture()
	expect(disposedCapture.networkFailures).toEqual(captured.networkFailures)
	expect(disposedCapture.pageErrors).toEqual(captured.pageErrors)
	await afterDispose.close()
	await futurePage.close()
	await page.close()

	function assertTelemetry(value: Awaited<ReturnType<typeof telemetry.capture>>) {
		expect(value.pageControls.length).toBe(2)
		expect(value.pageControls.some(({ buttons, disabledButtons, inputs }) => buttons === 2 && disabledButtons === 1 && inputs === 1)).toBe(true)
		expect(value.pageControls.some(({ buttons, dialogs }) => buttons === 1 && dialogs === 1)).toBe(true)
		expect(value.networkFailures).toHaveLength(32)
		expect(value.pageErrors).toContain('page-error')
		expect(value.events.some(({ kind, page, resourceType }) => kind === 'request-failed' && page === 'about:blank' && resourceType === 'fetch')).toBe(true)
		expect(value.events.every(({ elapsedMilliseconds }) => elapsedMilliseconds >= 0)).toBe(true)
		expect(value.networkFailures[0]?.path).toBe('http://telemetry.invalid/[redacted]')
		expect(JSON.stringify(value)).not.toContain('private')
		expect(value.networkFailures.every(({ path }) => !path.includes('?'))).toBe(true)
	}
})
