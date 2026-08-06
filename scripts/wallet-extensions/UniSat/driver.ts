import type {
	BrowserContext,
	Page,
} from 'playwright'

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

export const isUniSatApprovalPageUrl = (
	url: string,
	extensionId: string
) => (
	url.startsWith(`chrome-extension://${extensionId}/`)
	&& url.includes('/notification.html#/approval')
)

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
			body.innerText
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
		if (await page.getByTestId('notice-popover').isVisible()) {
			await page.getByTestId('notice-checkbox-1-input').click()
			if (!await page.getByTestId('notice-checkbox-1-input').isChecked())
				throw new Error('UniSat notice checkbox did not remain checked')
			await page.getByText('OK', {
				exact: true,
			}).click()
			await page.getByTestId('notice-popover').waitFor({
				state: 'hidden',
			})
		}
		await page.getByTestId('account-select').click()
		await page.getByTestId('add-account-button').click()
		await page.getByTestId('create-account-name-input').fill('Ephemeral account 2')
		await page.getByTestId('create-account-confirm-button').click()
	},
	switchAccount: async (page: Page) => {
		await page.getByTestId('account-select').click()
		const accountItems = page.locator('[data-testid^="account-item-"]')
		if (await accountItems.count() !== 2)
			throw new Error('UniSat did not expose exactly two derived accounts')
		await accountItems.nth(0).click()
		await page.getByTestId('account-select').click()
		await accountItems.nth(1).click()
	},
	waitForApproval: async (
		context: BrowserContext,
		extension: LoadedWalletExtension
	) => {
		await context.waitForEvent('page', {
			predicate: (page) => isUniSatApprovalPageUrl(page.url(), extension.id),
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
