import { randomBytes } from 'node:crypto'

import { expect, type BrowserContext, type Page } from '@playwright/test'

import type {
	WalletMatrixObservation,
	WalletMatrixScenario,
} from '../WalletCompatibilityMatrix.ts'
import type { LoadedWalletExtension } from '../WalletExtensionHarness.ts'


const backpackBlockedDetail = (lifecycleEdgeCase: string) => (
	lifecycleEdgeCase === 'fixture-material-not-provided-blocked' ?
		'Backpack recover has no safe fixture material in unattended automation'
	:
		'Backpack lifecycle automation is blocked'
)

export const backpackBlockedObservation = (
	scenario: Pick<WalletMatrixScenario, 'lifecycleEdgeCase'>
): WalletMatrixObservation => (
	{
		outcome: 'blocked',
		evidence: {
			code: scenario.lifecycleEdgeCase,
			detail: backpackBlockedDetail(scenario.lifecycleEdgeCase),
			source: 'declared-blocker',
		},
	}
)

/** Backpack Connect chrome surfaces as popup.html. */
export const isBackpackPopupPageUrl = (
	url: string,
	extensionId: string
) => (
	url.startsWith(`chrome-extension://${extensionId}/`)
	&& url.includes('/popup.html')
)

const base58Alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'

const encodeBase58 = (bytes: Uint8Array) => {
	const digits = [
		0,
	]
	for (const byte of bytes) {
		let carry = byte
		for (let index = 0; index < digits.length; index++) {
			const digit = digits[index] ?? 0
			carry += digit << 8
			digits[index] = carry % 58
			carry = (carry / 58) | 0
		}
		while (carry > 0) {
			digits.push(carry % 58)
			carry = (carry / 58) | 0
		}
	}

	let leadingZeros = 0
	for (const byte of bytes) {
		if (byte !== 0)
			break
		leadingZeros += 1
	}

	return (
		`${base58Alphabet[0] ?? '1'}`.repeat(leadingZeros)
		+ [...digits]
			.reverse()
			.map((digit) => base58Alphabet[digit] ?? '')
			.join('')
	)
}

export const createEphemeralSolanaAddress = () => (
	encodeBase58(randomBytes(32))
)

const extensionPage = async (
	context: BrowserContext,
	extension: LoadedWalletExtension,
	path: string
) => (
	context.newPage().then(async (page) => {
		await page.goto(`chrome-extension://${extension.id}/${path}`)
		return page
	})
)

const clickByTestIdOrText = async (
	page: Page,
	testId: string,
	name: string | RegExp
) => {
	const byTestId = page.getByTestId(testId)
	if (await byTestId.count() > 0) {
		await byTestId.first().click()
		return
	}

	await page.getByText(name, {
		exact: typeof name === 'string',
	}).first().click()
}

export const backpackDriver = {
	kind: 'backpack',
	open: (
		context: BrowserContext,
		extension: LoadedWalletExtension
	): Promise<Page> => (
		extensionPage(context, extension, 'onboarding.html')
	),
	openPopup: (
		context: BrowserContext,
		extension: LoadedWalletExtension
	): Promise<Page> => (
		extensionPage(context, extension, 'popup.html')
	),
	onboardSolana: async (page: Page, password: string) => {
		await expect(page.getByText('Create a new wallet', {
			exact: true,
		}).or(page.getByTestId('create-wallet-button'))).toBeVisible({
			timeout: 30_000,
		})
		await clickByTestIdOrText(page, 'create-wallet-button', 'Create a new wallet')
		const touchable = page.getByRole('button', {
			name: 'Touchable',
			exact: true,
		})
		if (await touchable.count() > 0)
			await touchable.click({
				position: {
					x: 12,
					y: 12,
				},
			})
		if (await page.getByText('Create a new wallet', {
			exact: true,
		}).count() > 0)
			await page.getByText('Create a new wallet', {
				exact: true,
			}).click()
		await page.getByText('Solana', {
			exact: true,
		}).click()
		await page.getByRole('button', {
			name: 'Set up wallet',
			exact: true,
		}).or(page.getByTestId('set-up-networks-button')).first().click()
		const passwordInputs = page.locator('input[type="password"]').or(page.getByRole('textbox'))
		await passwordInputs.nth(0).fill(password)
		await passwordInputs.nth(1).fill(password)
		await page.getByRole('button', {
			name: 'Next',
			exact: true,
		}).or(page.getByTestId('password-next-button')).first().click()
		const completion = page.getByTestId('open-wallet-button')
			.or(page.getByText('Open Backpack', {
				exact: true,
			}))
			.or(page.getByText("You're all good!", {
				exact: true,
			}))
			.or(page.getByText('Done', {
				exact: true,
			}))
		await expect(completion.first()).toBeVisible({
			timeout: 30_000,
		})
	},
	createDerivedSolanaAccount: async (page: Page, ordinal: 2 | 3) => {
		await page.getByText(`Wallet ${ordinal - 1}`, {
			exact: true,
		}).click()
		await page.getByText('Add new Solana wallet', {
			exact: true,
		}).or(page.getByText('Add wallet', {
			exact: true,
		})).first().click()
		await clickByTestIdOrText(page, 'create-wallet-button', 'Create new wallet')
		await expect(page.getByText(`Wallet ${ordinal}`, {
			exact: true,
		})).toBeVisible()
	},
	importViewOnlySolanaAccount: async (
		page: Page,
		address = createEphemeralSolanaAddress()
	) => {
		await page.getByText('Wallet 1', {
			exact: true,
		}).or(page.getByText('Add wallet', {
			exact: true,
		})).first().click()
		if (await page.getByText('Add wallet', {
			exact: true,
		}).count() > 0)
			await page.getByText('Add wallet', {
				exact: true,
			}).first().click()
		await clickByTestIdOrText(page, 'view-only-importing-button', /View.?only/)
		const publicKeyInput = page.getByTestId('public-key-input').or(page.getByPlaceholder(/address/i)).or(page.getByRole('textbox'))
		await publicKeyInput.first().fill(address)
		await clickByTestIdOrText(page, 'public-key-import-button', /import|add|continue/i)
		await expect(page.getByText(address.slice(0, 4))).toBeVisible({
			timeout: 30_000,
		})
		return address
	},
	waitForApproval: (
		context: BrowserContext,
		extension: LoadedWalletExtension
	) => (
		context.waitForEvent('page', {
			predicate: (page) => page.url().startsWith(`chrome-extension://${extension.id}/`),
		})
	),
	rejectConnection: async (page: Page) => {
		await page.getByRole('button', {
			name: 'Deny',
			exact: true,
		}).click()
		await expect(page).toBeClosed()
	},
	approveConnection: async (page: Page) => {
		await page.getByRole('button', {
			name: 'Approve',
			exact: true,
		}).click()
		await expect(page).toBeClosed()
	},
	switchAccount: async (page: Page, currentLabel: string, nextLabel: string) => {
		await page.getByText(currentLabel, {
			exact: true,
		}).click()
		await page.getByText(nextLabel, {
			exact: true,
		}).click()
	},
} as const
