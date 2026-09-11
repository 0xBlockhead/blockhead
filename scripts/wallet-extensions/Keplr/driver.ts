import type {
	BrowserContext,
	Page,
} from 'playwright'

import type {
	WalletMatrixObservation,
	WalletMatrixScenario,
} from '../WalletCompatibilityMatrix.ts'
import type { LoadedWalletExtension } from '../WalletExtensionHarness.ts'


const keplrBlockedDetail = (lifecycleEdgeCase: string) => (
	lifecycleEdgeCase === 'fixture-material-not-provided-blocked' ?
		'Keplr recover has no safe fixture material in unattended automation'
	:
		'Keplr lifecycle automation is blocked'
)

export const keplrBlockedObservation = (
	scenario: Pick<WalletMatrixScenario, 'lifecycleEdgeCase'>
): WalletMatrixObservation => (
	{
		outcome: 'blocked',
		evidence: {
			code: scenario.lifecycleEdgeCase,
			detail: keplrBlockedDetail(scenario.lifecycleEdgeCase),
			source: 'declared-blocker',
		},
	}
)

/** Keplr Connect / suggest-chain chrome surfaces as popup.html (optionally #/suggest-chain). */
export const isKeplrPopupPageUrl = (
	url: string,
	extensionId: string
) => {
	try {
		const parsed = new URL(url)
		return parsed.protocol === 'chrome-extension:'
			&& parsed.hostname === extensionId
			&& parsed.pathname === '/popup.html'
	} catch {
		return false
	}
}

export const keplrDriver = {
	kind: 'keplr',
	open: (context: BrowserContext, extension: LoadedWalletExtension): Promise<Page> => (
		Promise.resolve(context.pages().find((page) => page.url().startsWith(`chrome-extension://${extension.id}/register.html`)))
			.then(async (page) => {
				if (page)
					return page

				const extensionPage = await context.newPage()
				await extensionPage.goto(`chrome-extension://${extension.id}/register.html`)
				return extensionPage
			})
	),
	createAccount: async (page: Page, {
		name,
		password,
	}: {
		name: string,
		password: string,
	}) => {
		await page.getByRole('button', {
			name: 'Create a new wallet',
		}).click()
		await page.getByRole('button', {
			name: 'Create new recovery phrase',
		}).click()
		await page.getByRole('button', {
			name: /I understood\. Show my phrase\./,
		}).click()
		const recoveryPhrase = await page.locator('body *').evaluateAll((elements) => elements.flatMap((element) => (
			/^[a-z]+$/.test(element.textContent ?? '') && ![...element.children].some((child) => child.textContent === element.textContent) ?
				[element.textContent ?? '']
			:
				[]
		)))
		if (recoveryPhrase.length !== 12)
			throw new Error(`Keplr exposed ${recoveryPhrase.length} recovery words instead of 12`)

		await page.getByRole('button', {
			name: 'Next',
		}).click()
		const recoveryWordIndexes = await page.locator('body *').evaluateAll((elements) => elements.flatMap((element) => (
			/^Word #\d+$/.test(element.textContent ?? '') && ![...element.children].some((child) => child.textContent === element.textContent) ?
				[Number((element.textContent ?? '').slice('Word #'.length)) - 1]
			:
				[]
		)))
		if (recoveryWordIndexes.length !== 2)
			throw new Error(`Keplr requested ${recoveryWordIndexes.length} recovery words instead of 2`)

		const recoveryWordLabels = page.getByText(/^Word #\d+$/)
		await recoveryWordLabels.nth(0).locator('xpath=ancestor::*[.//input][1]//input').fill(recoveryPhrase[recoveryWordIndexes[0]])
		await recoveryWordLabels.nth(1).locator('xpath=ancestor::*[.//input][1]//input').fill(recoveryPhrase[recoveryWordIndexes[1]])
		await page.getByPlaceholder('e.g. Trading, NFT Vault, Investment').fill(name)
		const passwordInputs = page.getByPlaceholder('At least 8 characters in length')
		if (await passwordInputs.count() === 2) {
			await passwordInputs.nth(0).fill(password)
			await passwordInputs.nth(1).fill(password)
		}

		recoveryPhrase.fill('')
		await page.getByRole('button', {
			name: 'Next',
		}).last().click()
		await page.getByRole('button', {
			name: 'Save',
		}).click()
	},
	switchAccount: async (
		context: BrowserContext,
		extension: LoadedWalletExtension,
		currentAccountName: string,
		nextAccountName: string
	) => {
		const page = await context.newPage()
		await page.goto(`chrome-extension://${extension.id}/popup.html`)
		await page.getByText(currentAccountName, {
			exact: true,
		}).click()
		await page.getByText(nextAccountName, {
			exact: true,
		}).click()
		await page.close()
	},
} as const
