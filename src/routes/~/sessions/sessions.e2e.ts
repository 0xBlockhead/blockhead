import { expect, test } from '@playwright/test'

import {
	expectMainAttached,
	setupPageRuntimeDiagnostics,
} from '../../../../tests/_e2eBrowserHelpers.ts'


test.setTimeout(180_000)

test('keeps session actions as drafts until explicit confirmation', async ({ page }) => {
	const diagnostics = setupPageRuntimeDiagnostics(page)
	await diagnostics.step(page.goto('/~/sessions'))
	await expectMainAttached(page, 120_000, diagnostics)
	await expect(page.getByRole('heading', {
		name: 'New session',
	})).toBeVisible({
		timeout: 120_000,
	})
	await page.getByLabel('Session name').fill('Intent draft test')
	await page.getByRole('button', { name: 'Create session' }).click()
	await page.getByRole('link', {
		name: 'Intent draft test',
	}).click()
	await expect(page).toHaveURL(/\/~\/session\//)

	await page.getByRole('button', { name: 'Start transfer draft with keyboard' }).click()
	await expect(page.getByText('Transfer draft', { exact: true })).toBeVisible()
	await expect(page.getByText('Transfer draft added.')).not.toBeAttached()

	await page.getByLabel('From account').fill('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045')
	await page.getByLabel('To account').fill('0x000000000000000000000000000000000000dEaD')
	await page.getByLabel('Chain ID').fill('1')
	await page.getByLabel('Token address').fill('0x0000000000000000000000000000000000000000')
	await page.getByLabel('Amount (base units)').fill('1')
	await page.getByRole('button', { name: 'Confirm draft' }).click()

	await expect(page.getByText('Transfer draft added.')).toBeVisible()
	await expect(page.getByText('Transfer draft', { exact: true })).not.toBeAttached()

	await page.getByLabel('Edit Transfer action').selectOption('Bridge')
	await page.getByRole('button', { name: 'Save action type' }).click()
	await expect(page.getByLabel('Edit Bridge action')).toBeVisible()

	await page.getByRole('button', { name: 'Lock session' }).click()
	await expect(page.getByRole('button', { name: 'Save action type' })).not.toBeAttached()
	await expect(page.getByRole('button', { name: 'Delete Bridge action' })).not.toBeAttached()

	await page.getByRole('button', { name: 'Unlock session' }).click()
	await page.getByRole('button', { name: 'Delete Bridge action' }).click()
	await expect(page.getByLabel('Edit Bridge action')).not.toBeAttached()

	await page.getByRole('button', { name: 'Delete session' }).click()
	await expect(page).toHaveURL('/~/sessions')
	await expect(page.getByRole('link', {
		name: 'Intent draft test',
	})).not.toBeAttached()
	await page.reload({
		waitUntil: 'load',
	})
	await expect(page.getByRole('link', {
		name: 'Intent draft test',
	})).not.toBeAttached({
		timeout: 120_000,
	})
	expect(diagnostics.issues).toEqual([])
})

test('cancels a keyboard-created draft without adding an action', async ({ page }) => {
	await page.goto('/~/sessions')
	await expect(page.getByRole('heading', {
		name: 'New session',
	})).toBeVisible({
		timeout: 120_000,
	})
	await page.getByLabel('Session name').fill('Cancel draft test')
	await page.getByRole('button', { name: 'Create session' }).click()
	await page.getByRole('link', {
		name: 'Cancel draft test',
	}).click()
	await expect(page).toHaveURL(/\/~\/session\//)

	await page.getByRole('button', { name: 'Start transfer draft with keyboard' }).click()
	await page.getByRole('button', { name: 'Cancel' }).click()

	await expect(page.getByText('Transfer draft', { exact: true })).not.toBeAttached()
	await expect(page.getByText('Transfer draft added.')).not.toBeAttached()
})
