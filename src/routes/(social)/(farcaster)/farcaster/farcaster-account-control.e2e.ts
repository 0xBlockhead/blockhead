import { expect, test } from '@playwright/test'

import {
	expectMainVisible,
	installChainlistRpcsJsonStub,
} from '../../../../../tests/_e2eBrowserHelpers.ts'
import { routeViewSmokeTimeoutsMs } from '../../../../../tests/e2e/_routeViewDiagnostics.ts'

test('rejects arbitrary FID account connection routes', async ({ page }) => {
	await installChainlistRpcsJsonStub(page)
	await page.goto('/farcaster/account/3', {
		waitUntil: 'load',
		timeout: routeViewSmokeTimeoutsMs.goto,
	})
	await expectMainVisible(page, routeViewSmokeTimeoutsMs.mainSelector, [])
	await expect(page.getByRole('alert', {
		name: 'Farcaster account connections require an opaque local connection ID.',
	})).toBeVisible()
	await expect(page.getByRole('button', {
		name: 'Select viewer',
	})).toHaveCount(0)
	await expect(page.getByRole('button', {
		name: 'Reverify',
	})).toHaveCount(0)
	await expect(page.getByRole('button', {
		name: 'Disconnect',
	})).toHaveCount(0)
})

test('connect fails closed without verified wallet proof', async ({ page }) => {
	await installChainlistRpcsJsonStub(page)
	await page.goto('/farcaster/accounts', {
		waitUntil: 'load',
		timeout: routeViewSmokeTimeoutsMs.goto,
	})
	await expectMainVisible(page, routeViewSmokeTimeoutsMs.mainSelector, [])
	await page.getByLabel('Connected wallet address').fill('0x0000000000000000000000000000000000000003')
	await page.getByRole('button', {
		name: 'Verify and connect',
	}).click()
	await expect(page.getByRole('alert')).toContainText(
		'A connected wallet with Farcaster custody or approved app auth-address proof is required.'
	)
	await expect(page.evaluate(() => localStorage.getItem('blockhead:farcaster-account-connections'))).resolves.toBeNull()
})
