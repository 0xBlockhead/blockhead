import type {
	BrowserContext,
	Page,
} from 'playwright'

import type {
	WalletMatrixObservation,
	WalletMatrixScenario,
} from '../WalletCompatibilityMatrix.ts'
import type {
	LoadedWalletExtension,
	WalletDriver,
} from '../WalletExtensionHarness.ts'


const onboardingUrl = (extension: LoadedWalletExtension) => (
	`chrome-extension://${extension.id}/${extension.manifest.action?.default_popup}?windowType=tab&appMode=onboarding#/onboarding/welcome`
)

const walletUrl = (extension: LoadedWalletExtension) => (
	`chrome-extension://${extension.id}/${extension.manifest.action?.default_popup}?windowType=tab#/`
)

const turnstileBlockedMessage = 'Zerion onboarding blocked by its Cloudflare Turnstile challenge; completing a CAPTCHA is not safe unattended automation.'

const zerionTurnstileBlockedDetail = (lifecycleEdgeCase: string) => (
	lifecycleEdgeCase === 'turnstile-captcha-blocked' ?
		'Cloudflare Turnstile CAPTCHA blocks unattended Zerion create-new onboarding; completing CAPTCHA is not safe automation'
	: lifecycleEdgeCase === 'turnstile-second-account-blocked' ?
		'Zerion second-account creation depends on Turnstile-gated onboarding that is not safe to complete unattended'
	: lifecycleEdgeCase === 'turnstile-recover-blocked' ?
		'Zerion recover onboarding is blocked by Cloudflare Turnstile CAPTCHA; completing CAPTCHA is not safe unattended automation'
	:
		'Zerion onboarding is blocked by Cloudflare Turnstile CAPTCHA'
)

export const zerionTurnstileBlockedObservation = (
	scenario: Pick<WalletMatrixScenario, 'lifecycleEdgeCase'>
): WalletMatrixObservation => (
	{
		outcome: 'blocked',
		evidence: {
			code: scenario.lifecycleEdgeCase,
			detail: zerionTurnstileBlockedDetail(scenario.lifecycleEdgeCase),
			source: 'declared-blocker',
		},
	}
)

/**
 * Zerion Connect chrome surfaces as hashed popup entrypoints (`popup.<hash>.html`),
 * not the sidepanel onboarding surface.
 */
export const isZerionPopupPageUrl = (
	url: string,
	extensionId: string
) => (
	url.startsWith(`chrome-extension://${extensionId}/`)
	&& /\/popup(?:\.[^/?#]+)?\.html(?:$|[?#])/.test(url)
)

const expectNoTurnstile = async (page: Page) => {
	await page.waitForTimeout(1_000)
	if (await page.locator('iframe[src*="turnstile"]').isVisible())
		throw new Error(turnstileBlockedMessage)
}

const clickOnboardingButton = async (
	page: Page,
	name: string
) => {
	try {
		await page.getByRole('button', {
			name,
		}).click({
			timeout: 15_000,
		})
	} catch (error) {
		if (await page.locator('iframe[src*="turnstile"]').isVisible())
			throw new Error(turnstileBlockedMessage, {
				cause: error,
			})

		throw error
	}
}

export const zerionDriver = {
	kind: 'zerion',
	open: async (
		context: BrowserContext,
		extension: LoadedWalletExtension
	) => {
		const page = await context.newPage()
		await page.goto(walletUrl(extension))
		return page
	},
	onboard: async (
		context: BrowserContext,
		extension: LoadedWalletExtension,
		password: string
	) => {
		const page = await context.newPage()
		await page.goto(onboardingUrl(extension), {
			waitUntil: 'domcontentloaded',
		})
		await page.getByText('Create New Wallet', {
			exact: true,
		}).click()
		await page.locator('input[name=password]').fill(password)
		await page.getByRole('button', {
			name: 'Confirm Password',
		}).click()
		await page.locator('input[name=confirmPassword]').fill(password)
		await page.getByRole('button', {
			name: 'Set Password',
		}).click()
		await page.getByRole('button', {
			name: 'Create',
			exact: true,
		}).click()
		await expectNoTurnstile(page)
		await clickOnboardingButton(page, 'Continue')
		await expectNoTurnstile(page)
		await clickOnboardingButton(page, 'Continue')
		await clickOnboardingButton(page, 'Do it Later')
		await page.goto(walletUrl(extension))
		await expectNoTurnstile(page)
		try {
			await page.getByText('I’ll take the risk', {
				exact: true,
			}).click({
				timeout: 15_000,
			})
		} catch (error) {
			if (await page.locator('iframe[src*="turnstile"]').isVisible())
				throw new Error(turnstileBlockedMessage, {
					cause: error,
				})

			throw error
		}
		return page
	},
	waitForRequest: async (
		context: BrowserContext,
		extension: LoadedWalletExtension,
		previousPages: Set<Page>
	) => {
		const existingRequestPage = context.pages().find((page) => (
			!previousPages.has(page)
			&& isZerionPopupPageUrl(page.url(), extension.id)
		))
		if (existingRequestPage)
			return existingRequestPage

		return context.waitForEvent('page', {
			predicate: (page) => (
				!previousPages.has(page)
				&& isZerionPopupPageUrl(page.url(), extension.id)
			),
			timeout: 30_000,
		}).catch(() => (
			context.waitForEvent('page', {
				predicate: (page) => (
					!previousPages.has(page)
					&& page.url().startsWith(`chrome-extension://${extension.id}/`)
				),
				timeout: 30_000,
			})
		))
	},
	approveConnection: async (page: Page) => {
		await page.getByRole('button', {
			name: /connect|approve/i,
		}).last().click()
	},
	rejectConnection: async (page: Page) => {
		await page.getByRole('button', {
			name: /cancel|reject/i,
		}).last().click()
	},
} as const satisfies WalletDriver<'zerion'>
