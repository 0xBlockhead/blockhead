import type {
	WalletMatrixObservation,
	WalletMatrixScenario,
} from '../WalletCompatibilityMatrix.ts'
import {
	acquireExtensionPage,
	openExtensionPage,
	type WalletDriver,
} from '../WalletExtensionHarness.ts'


const ambireBlockedDetail = (lifecycleEdgeCase: string) => (
	lifecycleEdgeCase === 'internal-account-derivation-blocked' ?
		'Ambire recover signer derivation depends on internal HD derivation UI that is not reliably executable in unattended automation'
	:
		'Ambire lifecycle automation is blocked'
)

export const ambireBlockedObservation = (
	scenario: Pick<WalletMatrixScenario, 'lifecycleEdgeCase'>
): WalletMatrixObservation => (
	{
		outcome: 'blocked',
		evidence: {
			code: scenario.lifecycleEdgeCase,
			detail: ambireBlockedDetail(scenario.lifecycleEdgeCase),
			source: 'declared-blocker',
		},
	}
)

/** Ambire Connect / dapp request chrome surfaces as request-window.html. */
export const isAmbireRequestWindowPageUrl = (
	url: string,
	extensionId: string
) => {
	try {
		const parsed = new URL(url)
		return parsed.protocol === 'chrome-extension:'
			&& parsed.hostname === extensionId
			&& parsed.pathname === '/request-window.html'
	} catch {
		return false
	}
}

export const ambireDriver = {
	approveConnection: async (page) => {
		const connect = page.locator('[data-testid="dapp-connect-button"]')
		await connect.waitFor({
			timeout: 15_000,
		})
		await connect.filter({
			hasNotText: /loading/i,
		}).waitFor({
			timeout: 15_000,
		})
		const label = (await connect.innerText()).trim()
		if (/hold/i.test(label)) {
			const box = await connect.boundingBox()
			if (box == null)
				throw new Error('Ambire dapp-connect-button has no clickable box')

			await page.mouse.move(
				box.x + box.width / 2,
				box.y + box.height / 2
			)
			await page.mouse.down()
			await new Promise((resolve) => setTimeout(resolve, 2_300))
			await page.mouse.up()
		} else {
			await connect.click()
		}
		await page.waitForEvent('close').catch(() => undefined)
	},
	kind: 'ambire',
	open: (context, extension) => (
		openExtensionPage(context, extension, 'tab.html')
	),
	waitForRequest: async (context, extension, previousPages) => {
		const existingRequestPage = context.pages().find((page) => (
			!previousPages.has(page)
			&& isAmbireRequestWindowPageUrl(page.url(), extension.id)
		))
		if (existingRequestPage) {
			await existingRequestPage.waitForLoadState('domcontentloaded')
			return existingRequestPage
		}

		const page = await context.waitForEvent('page', {
			predicate: (candidate) => (
				!previousPages.has(candidate)
				&& isAmbireRequestWindowPageUrl(candidate.url(), extension.id)
			),
			timeout: 30_000,
		}).catch(() => (
			acquireExtensionPage(context, extension, {
				previousPages,
			})
		))
		await page.waitForLoadState('domcontentloaded')
		return page
	},
	rejectConnection: (page) => (
		page.getByText('Deny', {
			exact: true,
		}).click()
	),
	selectAccount: async (page, account) => {
		const accountRows = page.locator('[data-testid="account"]')
		await accountRows.first().waitFor()

		for (let index = 0; index < await accountRows.count(); index++) {
			const accountRow = accountRows.nth(index)
			const text = (await accountRow.innerText()).toLowerCase()

			if (text.includes(account.slice(0, 10).toLowerCase()) && text.includes(account.slice(-10).toLowerCase())) {
				await accountRow.click()
				return
			}
		}

		throw new Error(`Ambire account switcher did not contain ${account}`)
	},
} satisfies WalletDriver<'ambire'>
