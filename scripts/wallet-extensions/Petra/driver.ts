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

export type PetraWallet = {
	addresses: [string, string]
	page: Page
}


// Functions

const petraBlockedDetail = (lifecycleEdgeCase: string) => (
	lifecycleEdgeCase === 'fixture-material-not-provided-blocked' ?
		'Petra recover and key-import flows have no safe fixture material in unattended automation'
	:
		'Petra lifecycle automation is blocked'
)

export const petraBlockedObservation = (
	scenario: Pick<WalletMatrixScenario, 'lifecycleEdgeCase'>
): WalletMatrixObservation => (
	{
		outcome: 'blocked',
		evidence: {
			code: scenario.lifecycleEdgeCase,
			detail: petraBlockedDetail(scenario.lifecycleEdgeCase),
			source: 'declared-blocker',
		},
	}
)

export const isPetraPromptPageUrl = (
	url: string,
	extensionId: string
) => (
	url.startsWith(`chrome-extension://${extensionId}/`)
	&& url.includes('/prompt.html')
)

const aptosAddress = async (page: Page) => (
	page.getByRole('button', {
		name: 'Copy Address',
		exact: true,
	}).innerText().then((text) => {
		const address = text.match(/^0x[0-9a-f]+\.\.[0-9a-f]+$/i)?.[0]
		if (!address)
			throw new Error('Petra did not expose an Aptos account label')

		return address
	})
)

const openPopup = async (
	context: BrowserContext,
	extension: LoadedWalletExtension
) => (
	openExtensionPage(context, extension, 'index.html')
)

const petraDecisionButton = (
	page: Page,
	decision: 'approve' | 'reject'
) => (
	page.getByRole('button', {
		name: (
			decision === 'approve' ?
				/^(?:Connect|Approve|Confirm|Allow)$/i
			:
				/^(?:Reject|Cancel|Deny|Close)$/i
		),
	}).first()
)

const findPetraPromptDecision = async (
	context: BrowserContext,
	extension: LoadedWalletExtension,
	decision: 'approve' | 'reject',
	previousPages: Set<Page>
) => {
	const extensionPages = context.pages().filter((page) => (
		page.url().startsWith(`chrome-extension://${extension.id}/`)
	))
	const rankedPages = [
		...extensionPages.filter((page) => (
			!previousPages.has(page)
			&& isPetraPromptPageUrl(page.url(), extension.id)
		)),
		...extensionPages.filter((page) => (
			isPetraPromptPageUrl(page.url(), extension.id)
		)),
		...extensionPages.filter((page) => !previousPages.has(page)),
		...extensionPages,
	]
	const seen = new Set<Page>()
	for (const page of rankedPages) {
		if (seen.has(page))
			continue
		seen.add(page)

		const promptRoot = page.locator('#prompt, [id="prompt"], [data-testid="prompt"]').first()
		if (
			isPetraPromptPageUrl(page.url(), extension.id)
			|| await promptRoot.isVisible().catch(() => false)
		) {
			const decisionButton = petraDecisionButton(page, decision)
			if (await decisionButton.isVisible().catch(() => false))
				return {
					page,
					decisionButton,
				}
		}

		const decisionButton = petraDecisionButton(page, decision)
		if (await decisionButton.isVisible().catch(() => false))
			return {
				page,
				decisionButton,
			}
	}

	return undefined
}

export const petraDriver = {
	kind: 'petra',
	open: openPopup,
	onboard: async (
		context: BrowserContext,
		extension: LoadedWalletExtension,
		password: string
	) => {
		await openPopup(context, extension)
		await new Promise((resolve) => globalThis.setTimeout(resolve, 500))
		const page = context.pages().find((candidate) => (
			candidate.url() === `chrome-extension://${extension.id}/onboarding.html`
		))
		if (!page)
			throw new Error('Petra did not open its onboarding page')

		await expect(page.getByRole('button', {
			name: 'Create an account',
		})).toBeVisible()
		await page.getByRole('button', {
			name: 'Create an account',
		}).click()
		await page.getByRole('button', {
			name: 'Create a seed phrase wallet',
		}).click()
		await page.getByPlaceholder('Enter Password').fill(password)
		await page.getByPlaceholder('Confirm Password').fill(password)
		await page.getByText('I agree to the Wallet Terms of Service').click()
		await page.getByRole('button', {
			name: 'Continue',
		}).click()

		const recoveryWordInputs = page.locator('input[type="text"]')
		await expect(recoveryWordInputs).toHaveCount(12)
		for (let index = 0; index < 12; index++)
			await expect(recoveryWordInputs.nth(index)).not.toHaveValue('')

		await page.getByRole('button', {
			name: 'Skip',
		}).click()
		await page.getByRole('button', {
			name: 'Get started',
		}).click()
		await page.waitForTimeout(3_000)

		return page
	},
	createAccounts: async (
		context: BrowserContext,
		extension: LoadedWalletExtension,
		password: string
	): Promise<PetraWallet> => {
		await petraDriver.onboard(context, extension, password)
		const page = await openPopup(context, extension)
		await expect(page.getByRole('button', {
			name: 'Deposit',
		})).toBeVisible({
			timeout: 30_000,
		})
		const first = await aptosAddress(page)

		await page.getByRole('button', {
			name: 'Account Copy Address',
		}).click()
		await page.getByRole('button', {
			name: 'Add accounts',
		}).click()
		await page.getByText('Create new account', {
			exact: true,
		}).click()
		const recoveryWordInputs = page.locator('input[type="text"]')
		await expect(recoveryWordInputs).toHaveCount(12)
		for (let index = 0; index < 12; index++)
			await expect(recoveryWordInputs.nth(index)).not.toHaveValue('')

		await page.getByRole('button', {
			name: 'Continue',
		}).click()
		await expect(page.getByRole('button', {
			name: 'Deposit',
		})).toBeVisible()
		const second = await aptosAddress(page)

		return {
			addresses: [
				first,
				second,
			],
			page,
		}
	},
	waitForRequest: async (
		context: BrowserContext,
		extension: LoadedWalletExtension,
		previousPages = new Set(context.pages())
	) => {
		const deadline = Date.now() + 30_000
		while (Date.now() < deadline) {
			const match = await findPetraPromptDecision(context, extension, 'approve', previousPages)
				?? await findPetraPromptDecision(context, extension, 'reject', previousPages)
			if (match != null)
				return match.page

			await new Promise((resolve) => globalThis.setTimeout(resolve, 100))
		}

		throw new Error(`Petra prompt.html Connect chrome was not observed for ${extension.id}`)
	},
	approveConnection: async (page: Page) => {
		await petraDecisionButton(page, 'approve').click()
	},
	rejectConnection: async (page: Page) => {
		await petraDecisionButton(page, 'reject').click()
	},
	decideConnection: async (
		context: BrowserContext,
		extension: LoadedWalletExtension,
		decision: 'approve' | 'reject',
		previousPages = new Set(context.pages())
	) => {
		const deadline = Date.now() + 30_000
		while (Date.now() < deadline) {
			const match = await findPetraPromptDecision(context, extension, decision, previousPages)
			if (match != null) {
				await match.decisionButton.click()
				return true
			}

			await new Promise((resolve) => globalThis.setTimeout(resolve, 100))
		}

		return false
	},
} as const satisfies WalletDriver<'petra'> & {
	createAccounts: (
		context: BrowserContext,
		extension: LoadedWalletExtension,
		password: string
	) => Promise<PetraWallet>
	decideConnection: (
		context: BrowserContext,
		extension: LoadedWalletExtension,
		decision: 'approve' | 'reject',
		previousPages?: Set<Page>
	) => Promise<boolean>
}
