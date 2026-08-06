import { expect } from '@playwright/test'
import type {
	BrowserContext,
	Page,
} from '@playwright/test'

import type {
	WalletMatrixObservation,
	WalletMatrixScenario,
} from '../WalletCompatibilityMatrix.ts'
import type {
	LoadedWalletExtension,
} from '../WalletExtensionHarness.ts'


// Types

export type ArgentXWallet = {
	page: Page
}


// Functions

const argentXBlockedDetail = (lifecycleEdgeCase: string) => (
	lifecycleEdgeCase === 'fixture-material-not-provided-blocked' ?
		'Argent X recover has no safe restore fixture in unattended automation; source-available build carries Argent non-commercial licensing terms'
	:
		'Argent X lifecycle automation is blocked'
)

export const argentXBlockedObservation = (
	scenario: Pick<WalletMatrixScenario, 'lifecycleEdgeCase'>
): WalletMatrixObservation => (
	{
		outcome: 'blocked',
		evidence: {
			code: scenario.lifecycleEdgeCase,
			detail: argentXBlockedDetail(scenario.lifecycleEdgeCase),
			source: 'declared-blocker',
		},
	}
)

/** Argent X Connect chrome surfaces as the SPA index.html window (no separate notification.html). */
export const isArgentXIndexPageUrl = (
	url: string,
	extensionId: string
) => (
	url.startsWith(`chrome-extension://${extensionId}/`)
	&& url.includes('/index.html')
)

const click = async (
	page: Page,
	name: string | RegExp
) => {
	await page.getByRole('button', {
		name,
	}).click()
}

export const argentXDriver = {
	kind: 'argent-x',
	open: async (context: BrowserContext, extension: LoadedWalletExtension) => {
		const page = await context.newPage()
		await page.goto(`chrome-extension://${extension.id}/index.html`)
		return page
	},
	onboard: async (page: Page, password: string) => {
		await click(page, 'Create a new wallet')
		await click(page, 'No thanks')
		await page.getByPlaceholder('Password', {
			exact: true,
		}).fill(password)
		await page.getByPlaceholder('Repeat password').fill(password)
		await click(page, 'Continue')
		await page.getByRole('button', {
			name: 'Standard Account',
		}).click()
		await click(page, 'Continue')
		await expect(page.getByText('Your account is ready!', {
			exact: true,
		})).toBeVisible({
			timeout: 60_000,
		})
		await page.goto(`chrome-extension://${new URL(page.url()).host}/index.html`)
		await click(page, 'Show account list')
		await expect(page.getByTestId('account-name')).toHaveCount(1)
	},
	createSecondAccount: async (page: Page) => {
		await page.getByTestId('create-account-button').click()
		await page.getByRole('button', {
			name: 'Standard Account',
		}).click()
		await click(page, 'Continue')
		await expect(page.getByTestId('account-name')).toHaveCount(2)
	},
	createAccounts: async (
		context: BrowserContext,
		extension: LoadedWalletExtension,
		password: string
	): Promise<ArgentXWallet> => {
		const page = await argentXDriver.open(context, extension)
		await argentXDriver.onboard(page, password)
		await argentXDriver.createSecondAccount(page)

		return {
			page,
		}
	},
	decideConnection: async (
		context: BrowserContext,
		extensionId: string,
		decision: 'approve' | 'reject'
	) => {
		const deadline = Date.now() + 15_000
		while (Date.now() < deadline) {
			for (const page of context.pages().filter((page) => isArgentXIndexPageUrl(page.url(), extensionId))) {
				const decisionButton = page.getByRole('button', {
					name: decision === 'approve' ? /^Connect$/ : /reject|cancel/i,
				})
					.first()
				if (await decisionButton.isVisible().catch(() => false)) {
					await decisionButton.click()
					return true
				}
			}

			await new Promise((resolve) => setTimeout(resolve, 100))
		}

		return false
	},
	selectAccount: async (
		page: Page,
		accountOrdinal: 1 | 2
	) => {
		const accountNames = page.getByTestId('account-name')
		if (await accountNames.count() !== 2)
			await click(page, 'Show account list')

		await accountNames.nth(accountOrdinal - 1).click()
	},
} as const satisfies {
	kind: 'argent-x'
	open: (
		context: BrowserContext,
		extension: LoadedWalletExtension
	) => Promise<Page>
	onboard: (
		page: Page,
		password: string
	) => Promise<void>
	createSecondAccount: (page: Page) => Promise<void>
	createAccounts: (
		context: BrowserContext,
		extension: LoadedWalletExtension,
		password: string
	) => Promise<ArgentXWallet>
	decideConnection: (
		context: BrowserContext,
		extensionId: string,
		decision: 'approve' | 'reject'
	) => Promise<boolean>
	selectAccount: (
		page: Page,
		accountOrdinal: 1 | 2
	) => Promise<void>
}
