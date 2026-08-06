import { randomBytes } from 'node:crypto'

import { expect, type BrowserContext, type Page } from '@playwright/test'

import {
	acquireExtensionPage,
	openExtensionPage,
	type LoadedWalletExtension,
	type WalletDriver,
	type WalletSigningDriverHooks,
} from '../WalletExtensionHarness.ts'
import type {
	WalletMatrixDriver,
	WalletMatrixScenario,
} from '../WalletCompatibilityMatrix.ts'


// Types

export type RabbyWallet = {
	addresses: [string, string, string]
	page: Page
}


// Functions

const accountAddress = async (page: Page) => (
	page.getByRole('button', {
		name: /copy address/i,
	}).first().getAttribute('data-address').then((dataAddress) => (
		dataAddress
		?? page.getByText(/^0x[0-9a-f]{40}$/i).first().innerText()
	))
)

const clickButton = async (
	page: Page,
	name: RegExp
) => {
	const button = page.getByRole('button', {
		name,
	}).last()
	await expect(button).toBeVisible({
		timeout: 30_000,
	})
	await button.click()
}

export const rabbyUnsupportedMatrixDriver = (): WalletMatrixDriver => ({
	kind: 'rabby',
	run: async (scenario: WalletMatrixScenario) => ({
		outcome: 'unsupported',
		evidence: {
			code: 'rabby-extension-dir-unavailable',
			detail: `RABBY_EXTENSION_DIR is required for ${scenario.requestMethod}`,
			source: 'test-environment',
		},
	}),
})

export const rabbyDriver = {
	approveConnection: (page) => (
		clickButton(page, /connect|approve/i)
	),
	kind: 'rabby',
	open: (context, extension) => (
		openExtensionPage(context, extension, 'index.html')
	),
	onboard: async (
		context: BrowserContext,
		extension: LoadedWalletExtension,
		password: string
	) => {
		const page = await openExtensionPage(context, extension, 'index.html#/welcome')
		await clickButton(page, /get started/i)
		await clickButton(page, /create (?:a )?new address/i)
		await page.getByLabel(/password/i).first().fill(password)
		await page.getByLabel(/confirm password/i).fill(password)
		await clickButton(page, /next|confirm/i)
		await clickButton(page, /show seed phrase|show recovery phrase/i)
		await clickButton(page, /i(?:'|’)ve saved|next|continue/i)
		await page.goto(`chrome-extension://${extension.id}/index.html`)
		await expect(page.getByRole('button', {
			name: /copy address/i,
		})).toBeVisible({
			timeout: 30_000,
		})
		return page
	},
	createAccounts: async (
		context: BrowserContext,
		extension: LoadedWalletExtension,
		password: string
	): Promise<RabbyWallet> => {
		const page = await rabbyDriver.onboard(context, extension, password)
		const first = await accountAddress(page)

		await clickButton(page, /account|address/i)
		await page.getByText(/add address/i, {
			exact: true,
		}).click()
		await page.getByText(/create new address/i, {
			exact: true,
		}).click()
		const second = await accountAddress(page)

		await page.goto(`chrome-extension://${extension.id}/index.html#/import/watch-address`)
		const watchAddress = `0x${randomBytes(20).toString('hex')}`
		await page.getByRole('textbox').fill(watchAddress)
		await clickButton(page, /confirm/i)

		return {
			addresses: [
				first,
				second,
				watchAddress,
			],
			page,
		}
	},
	rejectConnection: (page) => (
		clickButton(page, /cancel|reject/i)
	),
	selectAccount: async (page, account) => {
		await clickButton(page, /account|address/i)
		await page.getByText(new RegExp(`${account.slice(0, 6)}.*${account.slice(-4)}`, 'i')).click()
	},
	signing: (
		context: BrowserContext,
		extension: LoadedWalletExtension
	): WalletSigningDriverHooks => {
		let knownPages = new Set(context.pages())
		let requestPage: Page | undefined

		return {
			waitForRequest: async () => {
				requestPage = await acquireExtensionPage(context, extension, {
					previousPages: knownPages,
				})
				.then(async (page) => {
					await page.waitForLoadState('domcontentloaded')
						knownPages = new Set(context.pages())
					return page
				})
			},
			approve: async () => {
				if (!requestPage)
					throw new Error('Rabby approval requested before a notification page was acquired')

				await clickButton(requestPage, /sign|confirm|approve/i)
			},
			reject: async () => {
				if (!requestPage)
					throw new Error('Rabby rejection requested before a notification page was acquired')

				await clickButton(requestPage, /cancel|reject/i)
			},
		}
	},
	waitForRequest: (context, extension, previousPages) => (
		acquireExtensionPage(context, extension, {
			previousPages,
		}).then(async (page) => {
			await page.waitForLoadState('domcontentloaded')
			return page
		})
	),
} as const satisfies WalletDriver<'rabby'> & {
	createAccounts: (
		context: BrowserContext,
		extension: LoadedWalletExtension,
		password: string
	) => Promise<RabbyWallet>
}
