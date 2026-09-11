import type {
	BrowserContext,
	Page,
} from 'playwright'

import type {
	WalletMatrixObservation,
	WalletMatrixScenario,
} from '../WalletCompatibilityMatrix.ts'
import {
	openExtensionPage,
	type LoadedWalletExtension,
} from '../WalletExtensionHarness.ts'
import {
	captureWalletExtensionSurfaceCheckpoint,
	type WalletExtensionSurfaceCheckpoint,
	waitForWalletExtensionPhase,
} from '../WalletExtensionRequestCheckpoint.ts'


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

// The pinned 26.6.1 request component renders its decision as the form's
// submit button and disables it for loading, unsupported, or manifest-mismatch
// states. Keep the selector independent of the locale-provided button label.
export const tonkeeperConnectionApprovalSelector = 'button[type="submit"]'

export const isTonkeeperConnectionRequestSurface = ({
	extensionId,
	visibleFormCount,
	visibleSubmitButtonCount,
	url,
}: {
	extensionId: string
	visibleFormCount: number
	visibleSubmitButtonCount: number
	url: string
}) => {
	if (!isTonkeeperIndexPageUrl(url, extensionId))
		return false

	return visibleFormCount === 1 && visibleSubmitButtonCount === 1
}

export const tonkeeperConnectionRequestSurfaceIndex = ({
	checkpoint,
	extensionId,
}: {
	checkpoint: WalletExtensionSurfaceCheckpoint
	extensionId: string
}) => checkpoint.extensionPages.findIndex(({ extensionUrl, visibleFormCount, visibleSubmitButtonCount }) => (
	isTonkeeperConnectionRequestSurface({
		extensionId,
		visibleFormCount,
		visibleSubmitButtonCount,
		url: extensionUrl,
	})
))

const waitForTonkeeperConnectionRequest = async (
	context: BrowserContext,
	extension: LoadedWalletExtension,
	previousPages: Set<Page>
) => waitForWalletExtensionPhase({
	capture: async () => {
		const extensionPages = context.pages().filter((page) => (
			page.url().startsWith(`chrome-extension://${extension.id}/`)
		)).sort((left, right) => (
			Number(previousPages.has(left)) - Number(previousPages.has(right))
		))
		const checkpoint = await captureWalletExtensionSurfaceCheckpoint(extensionPages)
		const requestIndex = tonkeeperConnectionRequestSurfaceIndex({
			checkpoint,
			extensionId: extension.id,
		})
		return {
			checkpoint,
			ownedSurface: extensionPages[requestIndex] ?? null,
		}
	},
	onCheckpoint: (checkpoint) => {
		process.stderr.write(`${JSON.stringify({
			checkpoint,
			phase: 'Tonkeeper connection authority',
		})}\n`)
	},
	phase: 'Tonkeeper connection authority',
}).then(async (page) => {
	await page.waitForLoadState('domcontentloaded')
	return page
})

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
			const match = span.textContent.match(/^\s*(\d+)\.\s+([a-z]+)\s*$/)
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
	if (existingPassword) {
		const unlockPassword = page.locator('#unlock-password')
		await unlockPassword.fill(password)
		await page.getByRole('button', {
			name: 'Confirm',
		}).click()
		await unlockPassword.waitFor({
			state: 'hidden',
		})
	}

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
		throw new Error(`Tonkeeper ${existingPassword ? 'existing-password second-wallet' : 'initial'} onboarding did not reach wallet naming; phase observations: ${JSON.stringify({
			headingCount: await page.getByRole('heading').count(),
			passwordInputVisible: await page.locator('input[type="password"]').first().isVisible().catch(() => false),
			modalPresent: await page.locator('#react-portal-modal-container').count() > 0,
		})}`)

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
		page.setDefaultTimeout(30_000)
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
	) => waitForTonkeeperConnectionRequest(context, extension, previousPages),
	approveConnection: async (page: Page, password: string) => {
		const passwordInput = page.locator('#unlock-password')
		if (await passwordInput.isVisible()) {
			await passwordInput.fill(password)
			await page.getByRole('button', {
				name: 'Confirm',
			}).click()
			await passwordInput.waitFor({ state: 'hidden' })
		}

		const connectButton = page.locator(tonkeeperConnectionApprovalSelector)
		await connectButton.waitFor({ state: 'visible' })
		if (!await connectButton.isVisible())
			throw new Error('Tonkeeper connection authority surface disappeared before its decision')
		if (await connectButton.isDisabled())
			throw new Error('Tonkeeper connection request is disabled; inspect structural diagnostics before approving')

		await connectButton.click()
		if (await passwordInput.isVisible()) {
			await passwordInput.fill(password)
			await page.getByRole('button', {
				name: 'Confirm',
			}).click()
		}
		return true
	},
} as const
