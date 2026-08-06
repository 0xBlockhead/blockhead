import { randomBytes } from 'node:crypto'

import { expect, type BrowserContext, type Page } from '@playwright/test'

import type {
	WalletMatrixObservation,
	WalletMatrixScenario,
} from '../WalletCompatibilityMatrix.ts'
import type { LoadedWalletExtension } from '../WalletExtensionHarness.ts'


// Types

export type TahoAccounts = {
	first: string
	page: Page
	second: string
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
} as const

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

export const createTahoWallet = async (page: Page): Promise<TahoAccounts> => {
	const password = randomBytes(24).toString('base64url')

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
	await clickFirstVisible(page, [
		/^0x/i,
	])
	await expect(page.getByRole('heading', {
		name: 'Taho 1',
	})).toBeVisible()
	const addWalletPagePromise = page.context().waitForEvent('page')
	await page.getByRole('button', {
		name: /Add Wallet/i,
	}).click()
	const addWalletPage = await addWalletPagePromise
	await addWalletPage.waitForTimeout(1_000)
	await addWalletPage.evaluate(() => {
		globalThis.location.hash = '/onboarding/add-wallet'
	})
	await addWalletPage.getByRole('button').first().waitFor({
		timeout: 15_000,
	}).catch(() => {
		throw new Error('Taho 0.66.0 opened a blank tab for Add Wallet and did not render its /onboarding/add-wallet route.')
	})
	await clickFirstVisible(addWalletPage, [
		/Create (?:a )?new wallet/i,
	])
	if (await addWalletPage.locator('input[type="password"]:visible').count()) {
		await fillPasswordFields(addWalletPage, randomBytes(24).toString('base64url'))
		await clickFirstVisible(addWalletPage, [
			/Begin the hunt/i,
		])
	}
	await clickFirstVisible(addWalletPage, [
		/Create recovery phrase/i,
	])
	await verifyRecoveryPhrase(addWalletPage)
	await addWalletPage.goto(`${walletUrl.protocol}//${walletUrl.host}/popup.html`)
	await addWalletPage.getByRole('button', {
		name: /^0x/i,
	}).click()
	await expect(addWalletPage.getByRole('heading', {
		name: 'Taho 2',
	})).toBeVisible()

	return {
		first: 'Taho 1',
		page: addWalletPage,
		second: 'Taho 2',
	}
}

export const approveTahoConnection = async (context: BrowserContext, extensionId: string) => {
	const approval = (
		context.pages().find((page) => isTahoPopupPageUrl(page.url(), extensionId))
		?? await context.waitForEvent('page', {
			predicate: (page) => isTahoPopupPageUrl(page.url(), extensionId),
			timeout: 15_000,
		})
	)
	await approval.waitForLoadState('domcontentloaded')
	await clickFirstVisible(approval, [
		/Connect/i,
		/Approve/i,
	])
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
