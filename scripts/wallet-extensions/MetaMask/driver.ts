import { randomBytes } from 'node:crypto'

import { expect } from '@playwright/test'
import type {
	BrowserContext,
	Page,
} from 'playwright'

import {
	acquireExtensionPage,
	openExtensionPage,
	type LoadedWalletExtension,
	type WalletDriver,
	type WalletSigningDriverHooks,
} from '../WalletExtensionHarness.ts'


// Types

export type MetaMaskWallet = {
	addresses: [string, string, string]
	page: Page
}


// Functions

export const metamaskUnsupportedEnvironmentEvidence = () => ({
	outcome: 'unsupported',
	evidence: {
		code: 'metamask-extension-dir-unavailable',
		source: 'test-environment',
	},
} as const)

export const metamaskUiGeneration = (version: string) => {
	const major = Number.parseInt(version.split('.')[0] ?? '', 10)
	if (!Number.isInteger(major) || major < 11)
		throw new Error(`MetaMask ${version} is outside the observed semantic-selector UI range (11.x and newer)`)

	return 'modern' as const
}

const clickButton = async (
	page: Page,
	name: RegExp
) => {
	await page.getByRole('button', {
		name,
	}).last().click()
}

const waitForRequest = async (
	context: BrowserContext,
	extension: LoadedWalletExtension,
	previousPages: Set<Page>
) => {
	const page = await acquireExtensionPage(context, extension, {
		previousPages,
	})
	await page.waitForLoadState('domcontentloaded')
	return page
}

const accountAddress = async (page: Page) => {
	const text = await page.getByRole('button', {
		name: /copy address/i,
	}).first().getAttribute('aria-label') ?? await page.getByRole('button', {
		name: /copy address/i,
	}).first().innerText()
	const address = text.match(/0x[0-9a-f]{40}/i)?.[0]
	if (!address)
		throw new Error('MetaMask did not expose a full EVM account address through its accessible account control')

	return address
}

const openAccountMenu = async (page: Page) => {
	await page.getByRole('button', {
		name: /account menu|account options|select an account/i,
	}).first().click()
}

const addAccount = async (page: Page) => {
	await openAccountMenu(page)
	await page.getByText(/add account or hardware wallet/i, {
		exact: true,
	}).click()
	await page.getByText(/add a new ethereum account/i, {
		exact: true,
	}).click()
	await clickButton(page, /create/i)
	await expect(page.getByRole('button', {
		name: /copy address/i,
	}).first()).toBeVisible()
	return accountAddress(page)
}

const signingHooks = (
	context: BrowserContext,
	extension: LoadedWalletExtension
): WalletSigningDriverHooks => {
	let requestPage: Page | undefined
	let previousPages = new Set(context.pages())

	return {
		waitForRequest: async () => {
			requestPage = await waitForRequest(context, extension, previousPages)
		},
		approve: async () => {
			if (!requestPage)
				throw new Error('MetaMask signing approval requested before a confirmation page appeared')

			await clickButton(requestPage, /sign|confirm/i)
			previousPages = new Set(context.pages())
			requestPage = undefined
		},
		reject: async () => {
			if (!requestPage)
				throw new Error('MetaMask signing rejection requested before a confirmation page appeared')

			await clickButton(requestPage, /cancel|reject/i)
			previousPages = new Set(context.pages())
			requestPage = undefined
		},
	}
}

export const metamaskDriver = {
	kind: 'metamask',
	open: (context, extension) => (
		openExtensionPage(context, extension, 'home.html')
	),
	onboard: async (
		context: BrowserContext,
		extension: LoadedWalletExtension,
		password: string
	) => {
		metamaskUiGeneration(extension.manifest.version)
		const page = await openExtensionPage(context, extension, 'home.html#onboarding/welcome')
		const terms = page.getByRole('checkbox')
		if (await terms.isVisible())
			await terms.check()
		await clickButton(page, /create a new wallet/i)
		const telemetryChoice = page.getByRole('button', {
			name: /no thanks/i,
		})
		if (await telemetryChoice.isVisible())
			await telemetryChoice.click()
		const directPasswordInputs = page.locator('input[type="password"]')
		await directPasswordInputs.first().fill(password)
		await directPasswordInputs.nth(1).fill(password)
		await page.getByRole('checkbox').last().check()
		await clickButton(page, /create (a )?new wallet/i)
		const secureLater = page.getByRole('button', {
			name: /remind me later|secure my wallet later/i,
		})
		if (await secureLater.isVisible())
			await secureLater.click()
		const skipConfirmation = page.getByRole('button', {
			name: /skip account security|skip/i,
		})
		if (await skipConfirmation.isVisible())
			await skipConfirmation.click()
		const done = page.getByRole('button', {
			name: /done|got it/i,
		})
		if (await done.isVisible())
			await done.click()
		await page.goto(`chrome-extension://${extension.id}/home.html`)
		await expect(page.getByRole('button', {
			name: /copy address/i,
		}).first()).toBeVisible({
			timeout: 30_000,
		})
		return page
	},
	createAccounts: async (
		context: BrowserContext,
		extension: LoadedWalletExtension,
		password: string
	): Promise<MetaMaskWallet> => {
		const page = await metamaskDriver.onboard(context, extension, password)
		const first = await accountAddress(page)
		const second = await addAccount(page)
		const third = await metamaskDriver.importEphemeralAccount(page)

		return {
			addresses: [
				first,
				second,
				third,
			],
			page,
		}
	},
	waitForRequest,
	approveConnection: async (page: Page) => {
		const next = page.getByRole('button', {
			name: /next/i,
		})
		if (await next.isVisible())
			await next.click()
		await clickButton(page, /connect/i)
	},
	rejectConnection: async (page: Page) => {
		await clickButton(page, /cancel|reject/i)
	},
	selectAccount: async (page: Page, account: string) => {
		await openAccountMenu(page)
		await page.getByText(account, {
			exact: false,
		}).click()
	},
	signing: signingHooks,
	importEphemeralAccount: async (page: Page) => {
		await openAccountMenu(page)
		await page.getByText(/add account or hardware wallet/i, {
			exact: true,
		}).click()
		await page.getByText(/import account/i, {
			exact: true,
		}).click()
		await page.getByRole('textbox').fill(randomBytes(32).toString('hex'))
		await clickButton(page, /import/i)
		return accountAddress(page)
	},
} as const satisfies WalletDriver<'metamask'> & {
	createAccounts: (
		context: BrowserContext,
		extension: LoadedWalletExtension,
		password: string
	) => Promise<MetaMaskWallet>
	importEphemeralAccount: (page: Page) => Promise<string>
}
