import { expect, type BrowserContext, type Page } from '@playwright/test'

import type {
	WalletMatrixObservation,
	WalletMatrixScenario,
} from '../WalletCompatibilityMatrix.ts'
import type { LoadedWalletExtension } from '../WalletExtensionHarness.ts'


const unisatBlockedDetail = (lifecycleEdgeCase: string) => (
	lifecycleEdgeCase === 'fixture-material-not-provided-blocked' ?
		'UniSat recover has no safe fixture material in unattended automation'
	:
		'UniSat lifecycle automation is blocked'
)

export const unisatBlockedObservation = (
	scenario: Pick<WalletMatrixScenario, 'lifecycleEdgeCase'>
): WalletMatrixObservation => (
	{
		outcome: 'blocked',
		evidence: {
			code: scenario.lifecycleEdgeCase,
			detail: unisatBlockedDetail(scenario.lifecycleEdgeCase),
			source: 'declared-blocker',
		},
	}
)

export const unisatOrdinalsPurposeUnsupportedObservation = (): WalletMatrixObservation => (
	{
		outcome: 'unsupported',
		evidence: {
			code: 'ordinals-purpose-not-exposed-by-injected-api',
			detail: 'UniSat injected getAccounts/requestAccounts return unlabeled address strings; Sats Connect payment/ordinals purposes are not available without inventing a role',
			source: 'adapter-contract',
		},
	}
)

/** UniSat Connect chrome is `windows.create` of `notification.html` (hash `/approval` is SPA after load). */
export const isUniSatApprovalPageUrl = (
	url: string,
	extensionId: string
) => (
	url.startsWith(`chrome-extension://${extensionId}/`)
	&& url.includes('/notification.html')
)

const dismissUniSatHomePopovers = async (page: Page) => {
	const overlay = page.locator('.popover-container')
	const overlayDismiss = overlay.getByText('Skip', {
		exact: true,
	}).or(overlay.getByText('Got it', {
		exact: true,
	}))
	if (await overlayDismiss.count() > 0)
		await overlayDismiss.first().click().catch(() => undefined)
	const notice = page.getByTestId('notice-popover')
	if (await notice.isVisible()) {
		const checkbox = page.getByTestId('notice-checkbox-1-input')
		if (!await checkbox.isChecked())
			await checkbox.click()
		await page.getByTestId('notice-ok-button').click({
			force: true,
		}).catch(() => undefined)
	}
}

const clickUniSatAccountSelect = async (page: Page) => {
	const overlay = page.locator('.popover-container')
	const accountSelect = page.getByTestId('account-select')
	await expect.poll(async () => {
		if (await overlay.count() > 0) {
			await dismissUniSatHomePopovers(page)
			return 'blocked'
		}
		try {
			await accountSelect.click({
				timeout: 2_000,
			})
			return 'clicked'
		} catch {
			return 'blocked'
		}
	}, {
		timeout: 30_000,
	}).toBe('clicked')
}

export const unisatDriver = {
	kind: 'unisat',
	open: (context: BrowserContext, extension: LoadedWalletExtension): Promise<Page> => (
		Promise.resolve(context.pages().find((page) => page.url().startsWith(`chrome-extension://${extension.id}/`)))
			.then(async (page) => {
				if (page)
					return page

				const extensionPage = await context.newPage()
				await extensionPage.goto(`chrome-extension://${extension.id}/index.html`)
				return extensionPage
			})
	),
	onboard: async (page: Page, password: string) => {
		await page.getByText('Create new wallet', {
			exact: true,
		}).click()
		const passwordInputs = page.locator('input[type="password"]')
		await passwordInputs.nth(0).fill(password)
		await passwordInputs.nth(1).fill(password)
		await page.getByText('Continue', {
			exact: true,
		}).click()
		await page.waitForURL(/#\/account\/create-hd-wallet$/)

		const recoveryWords = await page.locator('body').evaluate((body) => (
			(body.textContent ?? '')
				.split('\n')
				.flatMap((line, index, lines) => (
					/^\d+\.$/.test(lines[index - 1] ?? '') && /^[a-z]+$/.test(line) ?
						[
							line,
						]
					:
						[]
				))
		))
		if (recoveryWords.length !== 12)
			throw new Error('UniSat did not expose exactly 12 recovery-word fields')

		await page.getByTestId('mnemonic-saved-checkbox-input').click()
		if (!await page.getByTestId('mnemonic-saved-checkbox-input').isChecked())
			throw new Error('UniSat recovery confirmation checkbox did not remain checked')
		recoveryWords.fill('')
		await page.getByTestId('mnemonic-continue-button').click()
		await page.getByTestId('address-type-continue-button').click()
	},
	createDerivedAccount: async (page: Page) => {
		await clickUniSatAccountSelect(page)
		await page.getByTestId('add-account-button').click()
		await page.getByTestId('create-account-name-input').fill('Ephemeral account 2')
		await page.getByTestId('create-account-confirm-button').click()
	},
	switchAccount: async (page: Page) => {
		await clickUniSatAccountSelect(page)
		const accountItems = page.locator('[data-testid^="account-item-"]')
		if (await accountItems.count() !== 2)
			throw new Error('UniSat did not expose exactly two derived accounts')
		for (let index = 0; index < 2; index++) {
			const item = accountItems.nth(index)
			const selected = await item.evaluate((element) => (
				Number.parseFloat(getComputedStyle(element).borderTopWidth) > 0
			))
			if (selected)
				continue
			await item.click({
				position: {
					x: 80,
					y: 28,
				},
			})
			return
		}
		throw new Error('UniSat did not expose an unselected derived account')
	},
	waitForApproval: async (
		context: BrowserContext,
		extension: LoadedWalletExtension
	) => {
		const existing = context.pages().find((page) => (
			isUniSatApprovalPageUrl(page.url(), extension.id)
		))
		if (existing)
			return existing

		await context.waitForEvent('page', {
			predicate: (page) => isUniSatApprovalPageUrl(page.url(), extension.id),
			timeout: 30_000,
		}).catch(() => undefined)
		const approvalPage = context.pages().find((page) => (
			isUniSatApprovalPageUrl(page.url(), extension.id)
		))
		if (!approvalPage)
			throw new Error('UniSat approval page was not found')
		return approvalPage
	},
	rejectConnection: async (page: Page) => {
		await page.getByText('Cancel', {
			exact: true,
		}).click()
		await page.waitForEvent('close').catch(() => undefined)
	},
	approveConnection: async (page: Page) => {
		await page.getByText('Connect', {
			exact: true,
		}).locator('..').locator('..').click()
		await page.waitForEvent('close').catch(() => undefined)
	},
} as const
