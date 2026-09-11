import { randomBytes } from 'node:crypto'

import { expect, type BrowserContext, type Page } from '@playwright/test'

import type {
	WalletMatrixObservation,
	WalletMatrixScenario,
} from '../WalletCompatibilityMatrix.ts'
import {
	type LoadedWalletExtension,
	type WalletDriver,
} from '../WalletExtensionHarness.ts'


// Types

export type TahoAccounts = {
	first: string
	page: Page
	telemetry: 'already-disabled' | 'disabled'
}


// Functions

const tahoBlockedDetail = (lifecycleEdgeCase: string) => (
	lifecycleEdgeCase === 'blank-add-wallet-tab-blocked' ?
		'Taho 0.66.0 Add Wallet opens a blank tab and does not render its /onboarding/add-wallet route'
	: lifecycleEdgeCase === 'fixture-material-not-provided-blocked' ?
		'Taho recover has no safe fixture material in unattended automation'
	:
		'Taho lifecycle automation is blocked'
)

export const tahoBlockedObservation = (
	scenario: Pick<WalletMatrixScenario, 'lifecycleEdgeCase'>
): WalletMatrixObservation => (
	{
		outcome: 'blocked',
		evidence: {
			code: scenario.lifecycleEdgeCase,
			detail: tahoBlockedDetail(scenario.lifecycleEdgeCase),
			source: 'declared-blocker',
		},
	}
)

export const tahoDriver = {
	kind: 'taho',
	open: (context: BrowserContext, extension: LoadedWalletExtension) => (
		openTaho(context, extension)
	),
	onboard: async (
		context: BrowserContext,
		extension: LoadedWalletExtension,
		secret: string
	) => {
		const page = await openTaho(context, extension)
		const accounts = await createTahoWallet(page, secret)

		return accounts.page
	},
	waitForRequest: async (
		context: BrowserContext,
		extension: LoadedWalletExtension,
		previousPages = new Set(context.pages())
	) => {
		const existing = context.pages().find((page) => (
			!previousPages.has(page)
			&& isTahoPopupPageUrl(page.url(), extension.id)
		))
		if (existing)
			return existing

		return context.waitForEvent('page', {
			predicate: (page) => (
				!previousPages.has(page)
				&& isTahoPopupPageUrl(page.url(), extension.id)
			),
			timeout: 30_000,
		})
	},
	approveConnection: (page: Page) => approveTahoRequest(page),
	rejectConnection: async (page: Page) => {
		await clickFirstVisible(page, [
			/Reject/i,
			/Deny/i,
			/Cancel/i,
			/Close/i,
		])
	},
	selectAccount: (page: Page, account: string) => (
		selectTahoAccount(page, account)
	),
} satisfies WalletDriver<'taho'>

/** Taho Connect / sign chrome surfaces as popup.html (distinct from tab.html onboarding). */
export const isTahoPopupPageUrl = (
	url: string,
	extensionId: string
) => (
	url.startsWith(`chrome-extension://${extensionId}/`)
	&& url.includes('/popup.html')
)

const clickFirstVisible = async (page: Page, names: RegExp[]) => {
	const deadline = Date.now() + 15_000
	while (Date.now() < deadline) {
		for (const name of names) {
			const button = page.getByRole('button', {
				name,
			}).first()

			if (await button.isVisible().catch(() => false)) {
				await button.click()
				return
			}
		}

		await page.waitForTimeout(100)
	}

	throw new Error(`Taho did not show any expected action: ${names.map(String).join(', ')}`)
}

const approveTahoRequest = async (page: Page) => {
	const defaultWalletPopoverBackdrop = page.locator('section.highlighted button.void_space')
	if (await defaultWalletPopoverBackdrop.isVisible().catch(() => false))
		await defaultWalletPopoverBackdrop.click()
	const grantPermission = page.locator('#grantPermission')
	await expect(grantPermission).toHaveCount(1)
	await expect(grantPermission).toBeEnabled()
	await grantPermission.click()
}

const fillPasswordFields = async (page: Page, password: string) => {
	const passwordFields = page.locator('input[type="password"]:visible')
	await expect(passwordFields).toHaveCount(2)
	await passwordFields.nth(0).fill(password)
	await passwordFields.nth(1).fill(password)
}

const verifyRecoveryPhrase = async (page: Page) => (
	page.evaluate(async () => {
		const waitUntil = async (
			predicate: () => boolean,
			timeoutMs = 15_000
		) => {
			const deadline = Date.now() + timeoutMs
			while (!predicate()) {
				if (Date.now() >= deadline)
					throw new Error('Taho recovery-phrase verification UI timed out')

				await new Promise((resolve) => globalThis.setTimeout(resolve, 50))
			}
		}
		const visibleButtons = () => (
			[...document.querySelectorAll('button')].filter((button) => (
				button.getBoundingClientRect().width > 0
				&& button.getBoundingClientRect().height > 0
			))
		)

		await waitUntil(() => visibleButtons().some((button) => button.textContent?.trim() === 'I wrote it down'))
		await waitUntil(() => document.querySelectorAll('.seed_phrase .word').length === 24)
		const phraseWords = [...document.querySelectorAll('.seed_phrase .word')]
			.map((element) => (element.textContent?.trim() ?? '').replace(/^-/, ''))

		if (phraseWords.length !== 24)
			throw new Error(`Taho exposed ${phraseWords.length} recovery words; expected 24`)

		visibleButtons().find((button) => button.textContent?.trim() === 'I wrote it down')?.click()
		await waitUntil(() => globalThis.location.hash.endsWith('/verify'))
		const requestedPositions = [...document.querySelectorAll('[data-testid="verify_seed_word_placeholder"]')]
			.map((placeholder) => Number.parseInt(placeholder.querySelector('.word_index')?.textContent ?? '', 10) - 1)

		for (const position of requestedPositions) {
			const word = phraseWords[position]
			const candidate = visibleButtons().find((button) => button.textContent?.trim() === word)
			if (!candidate)
				throw new Error(`Taho did not offer recovery word ${position + 1} for verification`)

			candidate.click()
			await new Promise((resolve) => globalThis.setTimeout(resolve, 50))
		}

		phraseWords.fill('')
		await waitUntil(() => document.querySelectorAll('[data-testid="remaining_seed_words"] button').length === 0)
		document.querySelector<HTMLButtonElement>('.verify_and_submit button:first-child')?.click()
		await waitUntil(() => document.querySelectorAll<HTMLButtonElement>('.verify_and_submit button:not(:disabled)').length >= 2)
		document.querySelector<HTMLButtonElement>('.verify_and_submit button:last-child')?.click()
		await waitUntil(() => !globalThis.location.hash.endsWith('/verify'))

		return {
			phraseWordCount: 24,
			requestedWordCount: requestedPositions.length,
		}
	})
)

export const openTaho = async (
	context: BrowserContext,
	extension: LoadedWalletExtension
) => (
	context.newPage().then(async (page) => {
		await page.goto(`chrome-extension://${extension.id}/tab.html#/onboarding`)
		return page
	})
)

export const disableTahoTelemetry = async (page: Page) => {
	const mainNavigation = page.locator('nav[aria-label="Main"]')
	await expect(mainNavigation).toHaveCount(1)
	const tabs = mainNavigation.getByRole('link')
	await expect(tabs).toHaveCount(4)
	await tabs.last().click()

	const settingsGroups = page.locator('section ul').first().locator(':scope > div')
	const generalSettings = settingsGroups.first().getByRole('button')
	await expect(generalSettings).toHaveCount(3)
	await generalSettings.nth(1).click()

	const analyticsState = page.locator('img[alt="correct"], img[alt="error"]')
	await expect(analyticsState).toHaveCount(1)
	const toggle = analyticsState.locator('xpath=ancestor::section[1]')
		.locator('[data-testid="toggle"][role="checkbox"]')
	await expect(toggle).toHaveCount(1)
	const enabled = await toggle.getAttribute('aria-checked')
	if (enabled === 'false') {
		await mainNavigation.getByRole('link').first().click()
		return 'already-disabled' as const
	}
	if (enabled !== 'true')
		throw new Error(`Taho analytics toggle exposed invalid aria-checked=${String(enabled)}`)

	await toggle.click()
	const confirmation = page.locator('[data-testid="slide_up_menu"]:not(.closed)')
	await expect(confirmation).toBeVisible()
	const choices = confirmation.getByRole('button')
	await expect(choices).toHaveCount(3)
	await choices.nth(2).click()
	await expect(toggle).toHaveAttribute('aria-checked', 'false')
	await mainNavigation.getByRole('link').first().click()
	return 'disabled' as const
}

export const createTahoWallet = async (
	page: Page,
	password = randomBytes(24).toString('base64url')
): Promise<TahoAccounts> => {

	await clickFirstVisible(page, [
		/Create (?:a )?new wallet/i,
		/Get started/i,
	])
	await fillPasswordFields(page, password)
	await clickFirstVisible(page, [
		/Create (?:a )?new wallet/i,
		/Continue/i,
		/Begin the hunt/i,
	])
	await clickFirstVisible(page, [
		/Create recovery phrase/i,
	])
	await verifyRecoveryPhrase(page)
	const walletUrl = new URL(page.url())
	if (walletUrl.hash.endsWith('/done'))
		await page.goto(`${walletUrl.protocol}//${walletUrl.host}/popup.html`)
	const telemetry = await disableTahoTelemetry(page)
	const currentAccount = page.locator('[data-testid="top_menu_profile_button"]')
	await expect(currentAccount).toHaveCount(1)
	await expect(currentAccount).toBeVisible()
	const first = (await currentAccount.innerText()).trim()
	if (!first)
		throw new Error('Taho did not expose the created account through its current-account control')
	return {
		first,
		page,
		telemetry,
	}
}

export const approveTahoConnection = async (
	context: BrowserContext,
	extensionId: string,
	previousPages: ReadonlySet<Page>
) => {
	const approval = (
		context.pages().find((page) => (
			!previousPages.has(page)
			&& isTahoPopupPageUrl(page.url(), extensionId)
		))
		?? await context.waitForEvent('page', {
			predicate: (page) => (
				!previousPages.has(page)
				&& isTahoPopupPageUrl(page.url(), extensionId)
			),
			timeout: 15_000,
		})
	)
	await approval.waitForLoadState('domcontentloaded')
	await approveTahoRequest(approval)
	await approval.waitForEvent('close').catch(() => undefined)
}

export const selectTahoAccount = async (page: Page, accountName: string) => {
	await clickFirstVisible(page, [
		/Account \d/i,
		/Accounts/i,
	])
	await page.getByText(accountName, {
		exact: true,
	}).click()
}
