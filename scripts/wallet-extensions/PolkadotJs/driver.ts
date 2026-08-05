import { randomBytes } from 'node:crypto'

import { expect, type BrowserContext, type Page } from '@playwright/test'

import type {
	WalletMatrixObservation,
	WalletMatrixScenario,
} from '../WalletCompatibilityMatrix.ts'
import type { LoadedWalletExtension } from '../WalletExtensionHarness.ts'


const polkadotJsBlockedDetail = (lifecycleEdgeCase: string) => (
	lifecycleEdgeCase === 'rejection-retry-third-flow-unavailable' ?
		'polkadot-js account-3 recover is not independently available as a third initialization flow in this shard'
	:
		'polkadot-js lifecycle automation is blocked'
)

export const polkadotJsBlockedObservation = (
	scenario: Pick<WalletMatrixScenario, 'lifecycleEdgeCase'>
): WalletMatrixObservation => (
	{
		outcome: 'blocked',
		evidence: {
			code: scenario.lifecycleEdgeCase,
			detail: polkadotJsBlockedDetail(scenario.lifecycleEdgeCase),
			source: 'declared-blocker',
		},
	}
)

export const polkadotJsDriver = {
	kind: 'polkadot-js',
} as const

const addAccount = async (page: Page, name: string) => {
	await page.getByText('Create new account', {
		exact: true,
	}).click()
	await expect(page.getByText('Generated 12-word mnemonic seed:', {
		exact: true,
	})).toBeVisible()
	await page.getByText('I have saved my mnemonic seed safely.', {
		exact: true,
	}).click()
	await page.getByText('Next step', {
		exact: true,
	}).click()

	const password = randomBytes(24).toString('base64url')
	await page.locator('input[type="text"]').fill(name)
	await page.locator('input[type="password"]').first().fill(password)
	await expect(page.locator('input[type="password"]')).toHaveCount(2)
	await page.locator('input[type="password"]').nth(1).fill(password)
	await page.getByText('Add the account with the generated seed', {
		exact: true,
	}).click()
	await expect(page.getByText(name, {
		exact: true,
	})).toBeVisible()
}

export const openPolkadotJs = async (
	context: BrowserContext,
	extension: LoadedWalletExtension
) => (
	context.newPage().then(async (page) => {
		await page.goto(`chrome-extension://${extension.id}/index.html`)
		return page
	})
)

export const createPolkadotJsAccounts = async (page: Page) => {
	await page.getByText('Understood, let me continue', {
		exact: true,
	}).click()
	await page.getByText('I Understand', {
		exact: true,
	}).click()

	await page.locator('.plusIcon').click()
	await addAccount(page, 'Blockhead ephemeral 1')
	await page.locator('.plusIcon').click()
	await addAccount(page, 'Blockhead ephemeral 2')
}

export const approvePolkadotJsConnection = async (
	context: BrowserContext,
	extensionId: string
) => {
	const approval = await context.waitForEvent('page', {
		predicate: (page) => page.url().startsWith(`chrome-extension://${extensionId}/notification.html`),
		timeout: 15_000,
	})
	await approval.waitForLoadState('domcontentloaded')
	await approval.getByText('Select all', {
		exact: true,
	}).click()
	await approval.getByText(/Yes, allow this application access|Connect \d+ account\(s\)/, {
		exact: true,
	}).click()
}
