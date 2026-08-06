import type {
	BrowserContext,
	Page,
} from 'playwright'

import type {
	WalletMatrixObservation,
	WalletMatrixScenario,
} from '../WalletCompatibilityMatrix.ts'
import {
	acquireExtensionPage,
	openExtensionPage,
	type LoadedWalletExtension,
} from '../WalletExtensionHarness.ts'


const tonkeeperBlockedDetail = (lifecycleEdgeCase: string) => (
	lifecycleEdgeCase === 'fixture-material-not-provided-blocked' ?
		'Tonkeeper recover has no safe fixture material in unattended automation'
	:
		'Tonkeeper lifecycle automation is blocked'
)

export const tonkeeperBlockedObservation = (
	scenario: Pick<WalletMatrixScenario, 'lifecycleEdgeCase'>
): WalletMatrixObservation => (
	{
		outcome: 'blocked',
		evidence: {
			code: scenario.lifecycleEdgeCase,
			detail: tonkeeperBlockedDetail(scenario.lifecycleEdgeCase),
			source: 'declared-blocker',
		},
	}
)

/** Tonkeeper TonConnect chrome surfaces as the SPA index.html window (no separate notification.html). */
export const isTonkeeperIndexPageUrl = (
	url: string,
	extensionId: string
) => (
	url.startsWith(`chrome-extension://${extensionId}/`)
	&& url.includes('/index.html')
)

const createWallet = async (
	page: Page,
	name: string,
	password: string,
	existingPassword = false
) => {
	await page.getByRole('button', {
		name: 'New Wallet Create new wallet',
	}).click()
	if (existingPassword) {
		await page.locator('#react-portal-modal-container').getByRole('textbox').fill(password)
		await page.getByRole('button', {
			name: 'Confirm',
		}).click()
	}
	await page.getByRole('button', {
		name: 'Continue',
	}).click()
	await page.getByRole('heading', {
		name: 'Your recovery phrase',
	}).waitFor()

	const recoveryWords = await page.locator('span').evaluateAll((spans) => (
		spans.flatMap((span) => {
			const match = span.textContent?.match(/^\s*(\d+)\.\s+([a-z]+)\s*$/)
			return match ?
				[[
					Number(match[1]),
					match[2],
				]]
			:
				[]
		})
	))
	const wordsByIndex = Object.fromEntries(recoveryWords)
	if (Object.keys(wordsByIndex).length !== 24)
		throw new Error('Tonkeeper did not expose exactly 24 recovery words')

	await page.getByRole('button', {
		name: 'Continue',
	}).click()
	for (const input of await page.locator('#react-portal-modal-container input').all()) {
		const index = Number((await input.locator('..').innerText()).match(/^\s*(\d+):/)?.[1])
		await input.fill(wordsByIndex[index])
	}
	Object.keys(wordsByIndex).forEach((index) => delete wordsByIndex[Number(index)])
	recoveryWords.splice(0)
	await page.getByRole('button', {
		name: 'Continue',
	}).click()

	if (!existingPassword) {
		await page.locator('#create-password').fill(password)
		await page.locator('#create-password-confirm').fill(password)
		await page.getByRole('button', {
			name: 'Continue',
		}).click()
	}

	const namePageReady = await page.getByRole('heading', {
		name: 'Name your wallet',
	}).waitFor({
		timeout: existingPassword ?
			30_000
		:
			120_000,
	}).then(
		() => true,
		() => false
	)
	if (!namePageReady)
		return false

	await page.locator('#wallet-name').fill(name)
	await page.locator('#wallet-name').press('Enter')
	await page.getByRole('heading', {
		name: 'Name your wallet',
	}).waitFor({
		state: 'hidden',
	})
	await page.getByRole('button', {
		name: 'Continue',
	}).click()
	await page.getByRole('heading', {
		name: /Congratulations/,
	}).waitFor()
	await page.locator('#react-portal-modal-container').waitFor({
		state: 'hidden',
	})
	return true
}

export const tonkeeperDriver = {
	kind: 'tonkeeper',
	open: (
		context: BrowserContext,
		extension: LoadedWalletExtension
	) => (
		openExtensionPage(context, extension, 'index.html')
	),
	onboardTwoAccounts: async (
		context: BrowserContext,
		extension: LoadedWalletExtension,
		password: string
	) => {
		const page = await openExtensionPage(context, extension, 'index.html')
		await page.getByRole('button', {
			name: 'Get started',
		}).click()
		if (!await createWallet(page, 'Blockhead Ephemeral 1', password))
			throw new Error('Tonkeeper did not complete initial account onboarding')
		await page.getByText('Blockhead Ephemeral 1', {
			exact: true,
		}).click()
		await page.getByText('Set up wallet', {
			exact: true,
		}).click()
		return {
			page,
			secondAccountOnboarded: await createWallet(page, 'Blockhead Ephemeral 2', password, true),
		}
	},
	waitForRequest: (
		context: BrowserContext,
		extension: LoadedWalletExtension,
		previousPages: Set<Page>
	) => {
		const existing = context.pages().find((page) => (
			!previousPages.has(page)
			&& isTonkeeperIndexPageUrl(page.url(), extension.id)
		))
		if (existing)
			return Promise.resolve(existing)

		return context.waitForEvent('page', {
			predicate: (page) => (
				!previousPages.has(page)
				&& isTonkeeperIndexPageUrl(page.url(), extension.id)
			),
			timeout: 60_000,
		}).catch(() => (
			acquireExtensionPage(context, extension, {
				previousPages,
				timeoutMs: 60_000,
			})
		))
	},
	approveConnection: async (page: Page, password: string) => {
		const connectButton = page.getByRole('button', {
			name: 'Connect wallet',
		})
		if (!await connectButton.waitFor({
			timeout: 15_000,
		}).then(
			() => true,
			() => false
		))
			return false

		await connectButton.click()
		const passwordInput = page.locator('#react-portal-modal-container').getByRole('textbox')
		if (await passwordInput.isVisible()) {
			await passwordInput.fill(password)
			await page.getByRole('button', {
				name: 'Confirm',
			}).click()
		}
		return true
	},
} as const
