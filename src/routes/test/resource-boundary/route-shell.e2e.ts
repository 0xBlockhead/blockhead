import { expect, test } from '@playwright/test'

import {
	expectMainAttached,
	setupPageRuntimeDiagnostics,
} from '../../../../tests/_e2eBrowserHelpers.ts'

test('resource boundary test route renders inside the app shell', async ({ page }) => {
	const diagnostics = setupPageRuntimeDiagnostics(page, {
		failFast: false,
	})
	await diagnostics.step(page.goto('/test/resource-boundary', { waitUntil: 'load', timeout: 120_000 }))
	await expectMainAttached(page, 120_000, diagnostics)
	await expect(page.getByRole('heading', { level: 1 })).toHaveText('Resource boundary test route')
})
