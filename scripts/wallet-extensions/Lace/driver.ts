import { expect, type BrowserContext, type Page } from '@playwright/test'

import type {
	WalletMatrixObservation,
	WalletMatrixScenario,
} from '../WalletCompatibilityMatrix.ts'
import {
	openExtensionPage,
	type LoadedWalletExtension,
	type WalletDriver,
} from '../WalletExtensionHarness.ts'


// Types

export type LaceWallet = {
	page: Page
}


// Functions

const laceSidePanelBlockedDetail = (lifecycleEdgeCase: string) => (
	lifecycleEdgeCase === 'side-panel-onboarding-blocked' ?
		'Lace 2.2.0 headed expo side-panel create-new onboarding is not reliably executable in unattended automation'
	: lifecycleEdgeCase === 'side-panel-second-account-blocked' ?
		'Lace second-account derivation depends on side-panel onboarding that is not yet reliably executable'
	: lifecycleEdgeCase === 'side-panel-recover-blocked' ?
		'Lace side-panel recover onboarding is not reliably executable in unattended automation'
	:
		'Lace side-panel automation is blocked'
)

export const laceSidePanelBlockedObservation = (
	scenario: Pick<WalletMatrixScenario, 'lifecycleEdgeCase'>
): WalletMatrixObservation => (
	{
		outcome: 'blocked',
		evidence: {
			code: scenario.lifecycleEdgeCase,
			detail: laceSidePanelBlockedDetail(scenario.lifecycleEdgeCase),
			source: 'declared-blocker',
		},
	}
)

const openSidePanel = (
	context: BrowserContext,
	extension: LoadedWalletExtension
) => (
	openExtensionPage(context, extension, 'expo/index.html')
)

export const laceDriver = {
	kind: 'lace',
	open: openSidePanel,
	onboard: async (
		context: BrowserContext,
		extension: LoadedWalletExtension,
		password: string
	) => {
		const page = await openSidePanel(context, extension)
		await expect(page.getByRole('button', {
			name: /^Create$/i,
		})).toBeVisible()
		await page.getByRole('button', {
			name: /^Create$/i,
		}).click()
		await page.getByRole('button', {
			name: /accept|agree|continue/i,
		}).last().click()
		const analyticsChoice = page.getByRole('button', {
			name: /skip|decline|no thanks/i,
		})
		if (await analyticsChoice.isVisible())
			await analyticsChoice.click()

		await page.getByRole('textbox').first().fill('Blockhead ephemeral Lace')
		const passwordInputs = page.locator('input[type="password"]')
		await passwordInputs.first().fill(password)
		await passwordInputs.last().fill(password)
		await page.getByRole('button', {
			name: /create wallet|continue|next/i,
		}).last().click()

		return page
	},
	createAccounts: async (
		context: BrowserContext,
		extension: LoadedWalletExtension,
		password: string
	): Promise<LaceWallet> => {
		const page = await laceDriver.onboard(
			context,
			extension,
			password
		)
		await expect(page.getByText(/account 1/i).first()).toBeVisible({
			timeout: 120_000,
		})
		await page.getByRole('button', {
			name: /add account/i,
		}).click()
		await expect(page.getByText(/account 2/i).first()).toBeVisible({
			timeout: 120_000,
		})

		return {
			page,
		}
	},
	approveConnection: async (page: Page) => {
		await page.getByRole('button', {
			name: /connect|allow/i,
		}).last().click()
	},
} as const satisfies WalletDriver<'lace'> & {
	createAccounts: (
		context: BrowserContext,
		extension: LoadedWalletExtension,
		password: string
	) => Promise<LaceWallet>
}
