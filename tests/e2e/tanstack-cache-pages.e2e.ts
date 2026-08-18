import { expect, test } from '@playwright/test'

import {
	assertMainSettled,
	chainlistRpcsWire,
	countRequestsMatching,
	ethereumListsChainsJsonWire,
	expectMainVisible,
	installChainlistRpcsJsonStub,
	setupPageRuntimeDiagnostics,
} from '../_e2eBrowserHelpers.ts'


/** `load` can exceed the default 15s navigation timeout after many client navigations. */
const gotoLoadTimeoutMs = 120_000


test.describe.configure({ mode: 'serial' })

test.describe('TanStack query lifecycle + cache', () => {
	test('networks: cold live collection load resolves provider-backed rows', async ({ page }) => {
		test.setTimeout(240_000)
		await installChainlistRpcsJsonStub(page)
		const diagnostics = setupPageRuntimeDiagnostics(page, { forwardConsole: true })

		await diagnostics.step(page.goto('/', { waitUntil: 'domcontentloaded', timeout: gotoLoadTimeoutMs }))
		await expectMainVisible(page, 120_000, diagnostics)

		const networkListSources = countRequestsMatching(page, (url, method) => (
			chainlistRpcsWire(url)
			|| ethereumListsChainsJsonWire(url, method)
		))

		const coldRpc = page.waitForResponse(
			(r) => chainlistRpcsWire(r.url()),
			{ timeout: 120_000 }
		)
		await page.goto('/networks', { waitUntil: 'load' })
		await coldRpc
		await expect(page.locator('#networks')).toBeVisible()
		await expect(page.locator('#networks').locator('a[href$="/network/eip155:1"]').first()).toBeVisible({
			timeout: 120_000,
		})

		expect(networkListSources.get(), 'cold load should call network list resolvers').toBeGreaterThan(0)
		networkListSources.detach()

		await assertMainSettled(page, 180_000, diagnostics)
		expect(diagnostics.issues, diagnostics.issues.join('\n')).toEqual([])
	})

	test('navigation stress: networks, home, contracts loop', async ({ page }) => {
		test.setTimeout(120_000)
		await installChainlistRpcsJsonStub(page)
		const diagnostics = setupPageRuntimeDiagnostics(page, { forwardConsole: true })
		const cycle = ['/networks', '/', '/contracts'] as const

		for (let i = 0; i < 40; i += 1) {
			await diagnostics.step(page.goto(cycle[i % cycle.length], { waitUntil: 'domcontentloaded' }))
			await expectMainVisible(page, 120_000, diagnostics)
			await assertMainSettled(page, 180_000, diagnostics)
		}

		expect(diagnostics.issues, diagnostics.issues.join('\n')).toEqual([])
	})
})
